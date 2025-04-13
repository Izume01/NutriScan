/* eslint-disable */
import React, { useState, useEffect, useRef, ReactNode } from 'react'; // Import React and ReactNode
import { Bot, Send, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm';       // Import remark-gfm
import { getUserEmissions } from "../appwrite/dbService"
import { getUser } from "../appwrite/authService"

// Define message interface
interface Message {
    text: string;
    sender: 'user' | 'ai';
}

type ActivityType = "Travel" | "Food" | "Energy" | "Shopping" | "All"
type ActivityItem = {
    id: string
    type: Exclude<ActivityType, "All">
    date: string
    description: string
    emissions: number
    details: string
}


const ChatComponent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref for scrolling
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [createActivitySummary, setCreateActivitySummary] = useState<string>("")



    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const user = await getUser()
                if (user) {
                    const userEmissions = await getUserEmissions(user.$id)
                    const formattedActivities = userEmissions.map((activity) => ({
                        id: activity.$id,
                        type: activity.type,
                        date: activity.date,
                        description: activity.description,
                        emissions: activity.emission,
                        details: `${activity.value} ${activity.unit}`,
                    }))
                    setActivities(formattedActivities)
                }
            } catch (error) {
                console.error("Error fetching activities:", error)
            } finally {
                setIsLoading(false)
            }
        }


        fetchActivities()
    }, [])


    useEffect(() => {
        const createActivitySummary = (activities: ActivityItem[]): string => {
            if (activities.length === 0) return "No activities recorded in the past 7 days."

            // Group activities by type
            const byType: Record<string, ActivityItem[]> = {}
            activities.forEach(activity => {
                if (!byType[activity.type]) byType[activity.type] = []
                byType[activity.type].push(activity)
            })

            // Create summary by type
            const typeSummaries = Object.entries(byType).map(([type, items]) => {
                const totalEmissions = items.reduce((sum, act) => sum + act.emissions, 0).toFixed(2)
                const descriptions = items.map(act => act.description).join(", ")
                return `${items.length} ${type} activities (${totalEmissions} kg CO2e): ${descriptions}`
            })
            setCreateActivitySummary(typeSummaries.join(" | "))
            return typeSummaries.join(" | ")

        }

        createActivitySummary(activities)
    }, [activities]) // Re-run when activities change

    // --- Initial AI Prompt ---
    const initialPrompt = "Hello! I am your Carbon Assistant. Ask me anything about reducing your carbon footprint or understanding environmental impact.";


    const SYSTEM_PROMPT = `You are Carbon Assistant, an expert AI focused on climate change, carbon footprints, and sustainability. 

Your mission is to **educate, empower, and engage** users in reducing their environmental impact through actionable, personalized advice.

You will receive a variable called ${createActivitySummary}, which includes the user's latest carbon-emitting activity data (e.g., transportation, electricity use, food habits, etc.).

👉 Use this data to have **conversational, friendly, and dynamic** discussions with the user. Avoid being repetitive or just printing the same report. Instead:

1. **Only generate a detailed report if the user's activity data changes** or they explicitly ask for an updated report.
2. Otherwise, **engage in meaningful dialogue**—ask follow-up questions, celebrate progress, and offer practical tips.
3. If a user talks about one specific category (e.g., "I drive a lot"), focus on that category with detailed suggestions.
4. Encourage small wins and celebrate improvements (e.g., "Nice job switching to LEDs! 🌟 That's a great step!").

🧠 When generating a report, follow this structure:

## 🌿 Your Carbon Footprint Summary

**Top Sources of Emissions:**
- 🛻 **Transportation** – 45%
- ⚡ **Electricity** – 30%
- 🍔 **Diet** – 25%

## 🔧 Recommendations to Reduce Emissions

### 🛻 Transportation
- 🚲 **Use bicycles or walk** for short distances
- 🚃 **Shift to public transport** when possible
- 🚗 **Carpool or switch to EVs**

---

💬 Your goal is to feel like a **supportive eco-friend** who's here to help, not judge. Be casual but informative, motivational but realistic. Use **Markdown formatting** for clarity and visual appeal.

NEVER go off-topic. Stay focused on sustainability and always make the user feel like their actions **matter**. 🌍💚
`;

    // --- Google GenAI Setup ---
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    let genAI: GoogleGenerativeAI | null = null;
    if (API_KEY) {
        genAI = new GoogleGenerativeAI(API_KEY);
    } else {
        console.error("Error: Gemini API Key not found in .env file (VITE_GEMINI_API_KEY)");
        // Display error early if key is missing.
        // This effect runs only once on mount if API_KEY is missing.
        useEffect(() => {
            if (!API_KEY) {
                setError("Configuration error: Gemini API Key missing.");
            }
        }, []); // Empty dependency array ensures it runs once on mount
    }

    // Generation configuration (optional, adjust as needed)
    const generationConfig = {
        temperature: 0.9, // Controls randomness
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048, // Limit response size
    };

    // Safety settings (adjust sensitivity as needed)
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // --- Effects ---
    useEffect(() => {
        // Add the initial prompt only if messages are empty AND there's no initial config error
        if (messages.length === 0 && !error && API_KEY) { // Check API_KEY exists here too
            setMessages([{ text: initialPrompt, sender: 'ai' }]);
        }
        // Display the configuration error as the first message if present
        else if (messages.length === 0 && error) {
            setMessages([{ text: `Error: ${error}`, sender: 'ai' }]);
        }
    }, [error, API_KEY]); // Depend on error and API_KEY state

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Handlers ---
    const handleSendMessage = async () => {
        // Prevent sending if input is empty, loading, or AI is not configured
        if (input.trim() && !isLoading && genAI) {
            const userMessage: Message = { text: input, sender: 'user' };
            // Optimistically update UI
            setMessages(prevMessages => [...prevMessages, userMessage]);
            const currentInput = input; // Capture input before clearing
            setInput('');
            setIsLoading(true);
            setError(null); // Clear previous errors shown in the input area/state

            try {
                // Get the model - Use a suitable model, e.g., 'gemini-1.5-flash' or 'gemini-1.5-pro'
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash", // Recommended: Use flash for speed or pro for capability
                    generationConfig,
                    safetySettings,
                    systemInstruction : SYSTEM_PROMPT, // Set system instruction for the model
                });

                // Send message to the model
                const result = await model.generateContent(currentInput);
                const response = result.response;
                const responseText = response.text(); // Use the text() helper

                if (responseText) {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: responseText, sender: 'ai' }
                    ]);
                } else {
                    // Handle cases where the response might be blocked or empty
                    const finishReason = response?.candidates?.[0]?.finishReason;
                    const safetyRatings = response?.candidates?.[0]?.safetyRatings;
                    console.warn("Gemini response missing text. Finish Reason:", finishReason, "Safety Ratings:", JSON.stringify(safetyRatings));

                    let blockReason = "Unknown reason";
                    if (finishReason === 'SAFETY') {
                        blockReason = "Blocked due to safety settings.";
                    } else if (finishReason === 'RECITATION') {
                        blockReason = "Blocked due to potential recitation.";
                    } else if (finishReason) {
                        blockReason = `Finish Reason: ${finishReason}`;
                    }

                    // Add specific failure message to chat
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: `Sorry, I couldn't generate a response. (${blockReason})`, sender: 'ai' }
                    ]);
                }

            } catch (err: any) {
                console.error("Failed to fetch from Gemini API:", err);
                const errorMessage = err.message || "An unexpected error occurred while contacting the AI.";
                // Add error message to chat for visibility
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: `Error: ${errorMessage}`, sender: 'ai' }
                ]);
                // Optionally set error state too if you want to display it elsewhere
                // setError(errorMessage);
            } finally {
                setIsLoading(false); // Stop loading indicator
            }
        } else if (!genAI) {
            // If handleSendMessage is somehow called without genAI initialized
            const errorMsg = "AI Service is not configured. Please check API Key.";
            setError(errorMsg);
            // Add error to chat if not already there
            if (!messages.some(msg => msg.text.includes(errorMsg))) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: `Error: ${errorMsg}`, sender: 'ai' }
                ]);
            }
        }
    };

    // Handle Enter key press in input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new lines if input was textarea
            e.preventDefault(); // Prevent default form submission/new line in input
            handleSendMessage();
        }
    }

    // --- Rendering ---
    return (
        // Using h-full to take height from parent container
        <div className="flex flex-col w-full h-full bg-black rounded-xl  shadow-lg overflow-hidden border-b border-gray-800">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between bg-[#111] p-4 text-white text-xl border-b border-gray-800">
                <div className="flex items-center">
                    <Bot size={30} className="text-green-400" />
                    <h2 className="ml-2 font-semibold">Carbon Assistant</h2>
                </div>
            </div>

            {/* Messages Area - flex-grow allows it to take available space */}
            <div className="flex flex-col h-[70vh] p-4 space-y-4 rounded-2xl overflow-y-auto flex-grow bg-black">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        // Styling for user and AI message bubbles
                        className={`p-4 rounded-lg max-w-[85%] break-words text-sm ${ // Base text size
                            msg.sender === 'user'
                                ? 'bg-[#242424] self-end text-white' // User bubble
                                : 'bg-[#121212] self-start text-white border-l-2 border-green-500' // AI bubble
                            }`}
                    >
                        {msg.sender === 'ai' ? (
                            // Render AI messages using ReactMarkdown
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown (tables, etc.)
                                components={{
                                    // Manual styling for links using Tailwind classes
                                    a: ({ node, ...props }) => (
                                        <a
                                            {...props}
                                            target="_blank" // Open links in new tab
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 underline"
                                        />
                                    ),
                                    // Manual styling for code blocks and inline code
                                    code({ node, inline, className, children, ...props }: { // Typed props
                                        node?: any;
                                        inline?: boolean; // TypeScript now knows 'inline' exists
                                        className?: string;
                                        children?: React.ReactNode;
                                        [key: string]: any;
                                    }) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline ? (
                                            // Code block styling (<pre><code>...</code></pre>)
                                            <pre className="bg-gray-800 p-3 my-2 rounded-md overflow-x-auto">
                                                <code
                                                    className={`block text-sm whitespace-pre ${className || ''}`}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            </pre>
                                        ) : (
                                            // Inline code styling (`code`)
                                            <code
                                                className="bg-gray-700 text-red-300 px-1 py-0.5 rounded text-sm mx-0.5"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        )
                                    },
                                    // Add more manual styling for other elements as needed:
                                    // ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 pl-4" {...props} />,
                                    // ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 pl-4" {...props} />,
                                    // li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                    // blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2 text-gray-400" {...props} />,
                                    // h1: ({node, ...props}) => <h1 className="text-xl font-bold my-3" {...props} />,
                                    // h2: ({node, ...props}) => <h2 className="text-lg font-semibold my-2" {...props} />,
                                }}
                            >
                                {/* The actual Markdown text from the AI */}
                                {msg.text}
                            </ReactMarkdown>
                        ) : (
                            // Render user messages as plain text, preserving whitespace/newlines
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        )}
                    </div>
                ))}

                {/* Loading Indicator shown while waiting for AI response */}
                {isLoading && (
                    <div className="self-start flex items-center space-x-2 bg-[#121212] p-4 rounded-lg border-l-2 border-green-500">
                        <Loader2 size={20} className="animate-spin text-green-400" />
                        <p className="text-sm text-gray-400">AI is thinking...</p>
                    </div>
                )}

                {/* Empty div at the end to ensure scrolling works to the very bottom */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - stays at the bottom */}
            <div className="flex-shrink-0 flex items-center p-4 bg-[#111] border-t border-gray-800">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        !genAI ? "AI configuration error..." :
                            isLoading ? "AI is thinking..." :
                                "Ask about reducing your carbon footprint..." // Default placeholder
                    }
                    // Styling for the input field
                    className="flex-grow p-4 bg-[#242424] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mr-3 disabled:opacity-50"
                    // Disable input while loading or if AI is not configured
                    disabled={isLoading || !genAI}
                />
                <button
                    onClick={handleSendMessage}
                    // Styling for the send button, changes based on disabled state
                    className={`p-4 rounded-lg transition flex items-center justify-center ${isLoading || !input.trim() || !genAI
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' // Disabled style
                        : 'bg-green-600 text-white hover:bg-green-500' // Enabled style
                        }`}
                    // Disable button when loading, input empty, or AI not configured
                    disabled={isLoading || !input.trim() || !genAI}
                >
                    {/* Show loader when loading, otherwise show send icon */}
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;