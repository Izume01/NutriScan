/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { getUserBaseline, getUserEmissions } from '../appwrite/dbService';
import { offsetTotalEmission } from '../appwrite/dbService';
import { getUser } from '../appwrite/authService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
    // State variables
    const [userBaseline, setUserBaseline] = React.useState<any>(null);
    const [userEmissions, setUserEmissions] = React.useState<any>(null);
    const [calculatedData, setCalculatedData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [chartData, setChartData] = React.useState<any[]>([]);

    const handleOffset = async () => {
        try {
            const user = await getUser();
            const userId = user.$id;
            await offsetTotalEmission(userId);
            alert('Offset successful!');
        } catch (error) {
            console.error("Error offsetting emissions:", error);
            alert('Error offsetting emissions. Please try again.');
        }
    }

    // Effect to fetch initial user data and baseline
    useEffect(() => {
        const fetchUserAndBaseline = async () => {
            setLoading(true); // Ensure loading state is true at the start
            try {
                const user = await getUser();
                const userId = user.$id;
                // Fetch baseline and emissions concurrently for potential speed up
                const [baselineResult, emissionsResult] = await Promise.all([
                    getUserBaseline(userId),
                    getUserEmissions(userId)
                ]);

                setUserBaseline(baselineResult.length > 0 ? baselineResult[0] : null); // Handle case where baseline might not exist yet
                setUserEmissions(emissionsResult || []); // Ensure emissions is an array

            } catch (error) {
                console.error("Error fetching user data, baseline or emissions:", error);
                // Optionally set state to show an error message to the user
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndBaseline();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Effect to calculate derived data and process chart data when dependencies change
    useEffect(() => {
        // Only proceed if we have baseline and emissions data
        if (userBaseline !== null && userEmissions !== null) {
            const data = calculate();
            setCalculatedData(data);

            // Process data for the chart
            const weeklyData = processWeeklyData(userEmissions);
            setChartData(weeklyData);
        }
        // If either baseline or emissions is null, ensure calculatedData and chartData are reset or handled appropriately
        else {
            setCalculatedData(null); // Reset calculated data if inputs are missing
            setChartData([]);      // Reset chart data
        }
    }, [userBaseline, userEmissions]); // Dependencies: run when baseline or emissions data updates

    // Processes raw emissions data into weekly aggregates for the chart
    const processWeeklyData = (emissions: any[]) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Initialize weekData with 0 emissions for each day
        const weekData = days.map(day => ({
            day,
            emissions: 0
        }));

        // Aggregate emissions if available
        if (emissions && emissions.length > 0) {
            emissions.forEach((emission: any) => {
                try {
                    const date = new Date(emission.date);
                    // Check if date is valid before proceeding
                    if (!isNaN(date.getTime())) {
                        const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
                        // Ensure dayIndex is within bounds (though getDay() should always be 0-6)
                        if (dayIndex >= 0 && dayIndex < 7) {
                            // Add emission value, defaulting to 0 if value is missing or not a number
                            weekData[dayIndex].emissions += Number(emission.value) || 0;
                        }
                    } else {
                        console.warn("Invalid date found in emission record:", emission.date);
                    }
                } catch (e) {
                    console.error("Error processing emission date:", emission, e);
                }
            });
            // Round the aggregated emissions for display
            weekData.forEach(dayData => {
                dayData.emissions = parseFloat(dayData.emissions.toFixed(1));
            });
        }

        return weekData;
    };

    // Calculates summary statistics based on user emissions and baseline
    const calculate = () => {
        // Ensure baseline exists and emissions array is not empty
        if (userBaseline && userEmissions && userEmissions.length > 0) {
            const totalCarbonScore = userEmissions.reduce((acc: number, emission: any) => acc + (Number(emission.value) || 0), 0);
            // Calculate weekly average based on the number of days with data, up to 7
            const numberOfDaysWithData = new Set(userEmissions.map((e: any) => new Date(e.date).toDateString())).size;
            const divisor = Math.max(1, Math.min(numberOfDaysWithData, 7)); // Avoid division by zero, cap at 7
            const weeklyAverage = totalCarbonScore / divisor;

            // Estimate monthly total (assuming average week) - consider refining this logic if needed
            const monthlyTotal = weeklyAverage * (30 / 7); // More accurate monthly estimate
            // const monthlyTotal = weeklyAverage * 4.33; // Alternative: avg weeks per month

            // Calculate eco streak (assuming 'streak' property indicates consecutive days)
            // This might need more complex logic depending on exact 'streak' definition
            const ecoStreak = userEmissions.filter((emission: any) => emission.streak === true).length; // Example: count days marked as part of a streak

            // Safely access baseline values, defaulting to 0 if missing
            const baselineTotalCarbon = userBaseline?.totalCarbon || 0;
            const baselineWeeklyAvg = userBaseline?.weeklyAverage || 0;
            const baselineMonthlyTotal = userBaseline?.monthlyTotal || 0;
            const baselineStreak = userBaseline?.ecoStreak || 0;

            // Return calculated data with differences from baseline, rounded to 1 decimal place
            return {
                totalCarbonScore: parseFloat(totalCarbonScore.toFixed(1)),
                weeklyAverage: parseFloat(weeklyAverage.toFixed(1)),
                monthlyTotal: parseFloat(monthlyTotal.toFixed(1)),
                ecoStreak, // Integer, no rounding needed
                diffTotal: parseFloat((totalCarbonScore - baselineTotalCarbon).toFixed(1)),
                diffWeekly: parseFloat((weeklyAverage - baselineWeeklyAvg).toFixed(1)),
                diffMonthly: parseFloat((monthlyTotal - baselineMonthlyTotal).toFixed(1)),
                diffStreak: ecoStreak - baselineStreak // Integer difference
            };
        }
        // Return null if required data is missing
        return null;
    };

    // Renders the difference indicator (arrow + value) compared to baseline
    const renderDifference = (diff: number | undefined | null, inverted = false) => {
        // Handle cases where diff might be undefined or null
        if (diff === undefined || diff === null || isNaN(diff)) {
            return <p className='text-sm text-gray-500'>N/A</p>; // Or some placeholder
        }

        const isNeutral = diff === 0;
        // Determine positivity based on 'inverted' flag (lower emissions are better)
        const isPositive = inverted ? diff < 0 : diff > 0;
        const absValue = Math.abs(diff);
        // Determine color based on whether the change is positive (good/green) or negative (bad/red)
        const color = isPositive ? '#10f500' : (isNeutral ? '#888888' : '#ff4d4d'); // Green for positive, Gray for neutral, Red for negative
        const Icon = isPositive ? ArrowUp : ArrowDown; // Up arrow for positive change, Down for negative

        // Determine unit based on whether the number is an integer (likely days) or float (likely kg)
        const unit = Number.isInteger(diff) && !inverted ? 'days' : 'kg'; // Assume integer diff is streak unless inverted

        return (
            <div className='flex flex-row gap-1 items-center' style={{ color }}>
                {!isNeutral && <Icon color={color} size={18} />} {/* Smaller icon */}
                <p className='text-sm font-medium'> {/* Slightly bolder text */}
                    {isNeutral ? 'No change' : `${isPositive ? '+' : '-'}${absValue} ${unit}`}
                </p>
            </div>
        );
    };

    // Loading state display
    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-[#121212] text-white">Loading dashboard data...</div>;
    }

    // Main component render
    return (
        <div className='flex flex-col w-full min-h-screen bg-[#121212] text-white p-6'>
            {/* Header */}
            <div className='flex flex-col gap-3 pb-6 border-b border-gray-700 mb-6'>
                <h1 className='text-3xl font-bold'>Dashboard</h1>
                <p className='text-md font-semibold text-gray-400'>Track your carbon footprint and get personalized recommendations.</p>
            </div>

            {/* Summary Cards Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
                {/* Total Carbon Score Card */}
                <div className='bg-[#242424] rounded-lg p-5 flex flex-col justify-between gap-4 shadow-md'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300 mb-1'>Total Weekly Score</h2>
                        <h1 className='text-4xl font-bold'>{calculatedData?.totalCarbonScore ?? 'N/A'} kg</h1>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='text-sm text-gray-400'>Compared to baseline</p>
                        {renderDifference(calculatedData?.diffTotal, true)} {/* Lower is better (inverted) */}
                    </div>
                </div>

                {/* Weekly Average Card */}
                <div className='bg-[#242424] rounded-lg p-5 flex flex-col justify-between gap-4 shadow-md'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300 mb-1'>Daily Average</h2>
                        <h1 className='text-4xl font-bold'>{calculatedData?.weeklyAverage ?? 'N/A'} kg</h1>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='text-sm text-gray-400'>Compared to baseline</p>
                        {renderDifference(calculatedData?.diffWeekly, true)} {/* Lower is better (inverted) */}
                    </div>
                </div>

                {/* Monthly Total Card */}
                <div className='bg-[#242424] rounded-lg p-5 flex flex-col justify-between gap-4 shadow-md'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300 mb-1'>Est. Monthly Total</h2>
                        <h1 className='text-4xl font-bold'>{calculatedData?.monthlyTotal ?? 'N/A'} kg</h1>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='text-sm text-gray-400'>Compared to baseline</p>
                        {renderDifference(calculatedData?.diffMonthly, true)} {/* Lower is better (inverted) */}
                    </div>
                </div>

                {/* Eco Streak Card */}
                <div className='bg-[#242424] rounded-lg p-5 flex flex-col justify-between gap-4 shadow-md'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300 mb-1'>Eco Streak</h2>
                        <h1 className='text-4xl font-bold'>{calculatedData?.ecoStreak ?? 0} days</h1>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='text-sm text-gray-400'>Compared to baseline</p>
                        {renderDifference(calculatedData?.diffStreak, false)} {/* Higher is better */}
                    </div>
                </div>
            </div>

            {/* Chart and Recommendations/Actions Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
                {/* Weekly Progress Graph Card */}
                <div className='lg:col-span-2 bg-[#242424] rounded-lg p-5 shadow-md'>
                    <div className='flex flex-col gap-2 mb-4'>
                        <h1 className='text-2xl font-bold'>Emissions Over Time</h1>
                        <p className='text-md font-semibold text-gray-400'>Your carbon footprint for the past week (Sun-Sat)</p>
                    </div>
                    <div className='bg-[#121212] rounded-md p-5 h-80'> {/* Fixed height for the chart container */}
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> {/* Adjust margins */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="day" stroke="#888" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#888" tick={{ fontSize: 12 }} unit="kg" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#242424', border: '1px solid #333', borderRadius: '4px' }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#10f500' }} // Style for the line item in tooltip
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="emissions"
                                        stroke="#10f500" // Bright green line
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: '#10f500', stroke: '#242424', strokeWidth: 1 }} // Dot style
                                        activeDot={{ r: 6, fill: '#10f500', stroke: '#fff', strokeWidth: 2 }} // Active dot style
                                        name="Carbon Emissions" // Name shown in tooltip
                                        unit=" kg" // Unit shown in tooltip
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>No emission data available for the past week.</p>
                            </div>
                        )}
                    </div>
                </div>



                {/* Combined AI Suggestions & Offset Column */}
                <div className='lg:col-span-1 flex flex-col gap-6'>
                    {/* AI Suggestions Card (moved from below) */}
                    <div className='bg-[#242424] rounded-lg p-5 shadow-md flex-grow flex flex-col'>
                        <div className='flex flex-col gap-2 mb-4'>
                            <h1 className='text-2xl font-bold'>AI Suggestions</h1>
                            <p className='text-md font-semibold text-gray-400'>Personalized tips to reduce your footprint.</p>
                        </div>
                        {/* Individual AI Suggestion Items */}
                        <div className='flex flex-col gap-3'>
                            <div className='bg-[#121212] rounded-md p-4 border-l-2 border-green-500'>
                                <h2 className='text-lg font-bold text-gray-200'>Try Meatless Mondays</h2>
                                <p className='text-sm text-gray-400'>Switching to plant-based meals one day a week could reduce your footprint by 5%.</p>
                            </div>
                            <div className='bg-[#121212] rounded-md p-4 border-l-2 border-blue-500'>
                                <h2 className='text-lg font-bold text-gray-200'>Optimize Your Route</h2>
                                <p className='text-sm text-gray-400'>Your travel emissions are highest on Wednesdays. Consider carpooling.</p>
                            </div>
                            <div className='bg-[#121212] rounded-md p-4 border-l-2 border-yellow-500'>
                                <h2 className='text-lg font-bold text-gray-200'>Lower Energy Usage</h2>
                                <p className='text-sm text-gray-400'>Try using LED lighting to reduce your energy consumption.</p>
                            </div>
                        </div>
                    </div>

                    {/* Carbon Offset Card (keep unchanged) */}
                    
                </div>
            </div>

            <div className='bg-[#242424] rounded-lg p-5 shadow-md'>
                <div className='flex flex-col gap-2 mb-4'>
                    <h1 className='text-2xl font-bold'>Carbon Offset</h1>
                    <p className='text-md font-semibold text-gray-400'>Neutralize your footprint via verified projects.</p>
                </div>
                <div className='bg-[#121212] rounded-md p-4 flex flex-col items-center'>
                    <p className='text-md font-semibold text-gray-300 mb-2'>Your total emissions this week:</p>
                    <p className='text-xl font-bold text-white mb-3'>{calculatedData?.totalCarbonScore ?? '0.0'} kg CO₂</p>
                    {calculatedData?.totalCarbonScore > 0 ? ( // Only show offset if there are emissions
                        <>
                            <p className='text-sm text-gray-400 mb-3 text-center'>
                                Offset this for ~₹{((calculatedData.totalCarbonScore || 0) * 7.6).toFixed(0)}
                                {/* Example calculation: 1kg CO2 ≈ ₹7.6 */}
                                <br />by supporting tree planting.
                            </p>
                            <button 
                                onClick={handleOffset}
                                className='w-full bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 font-semibold transition duration-200'>
                                Offset Now
                            </button>
                        </>
                    ) : (
                        <p className='text-sm text-green-400'>No emissions to offset this week!</p>
                    )}
                </div>
            </div>

            {/* Weekly Eco-Challenges Section (moved to bottom) */}
            <div className='mb-6'>
                <div className='flex flex-col gap-2 mb-4'>
                    <h1 className='text-2xl font-bold'>Weekly Eco-Challenges</h1>
                    <p className='text-md font-semibold text-gray-400'>Complete challenges to earn green coins!</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-[#242424] rounded-lg p-5 shadow-md flex flex-col'>
                        <h2 className='text-lg font-bold text-gray-200'>Go Vegetarian 3 Days</h2>
                        <p className='text-sm text-gray-400'>Eat plant-based meals for 3 days this week.</p>
                        <p className='text-sm font-semibold text-green-400 mt-3'>Progress: 2/3 days</p>
                        <div className='mt-2 w-full bg-[#121212] rounded-full h-2'>
                            <div className='bg-green-500 h-2 rounded-full' style={{ width: '66%' }}></div>
                        </div>
                    </div>

                    <div className='bg-[#242424] rounded-lg p-5 shadow-md flex flex-col'>
                        <h2 className='text-lg font-bold text-gray-200' style={{ textDecoration: 'line-through' }}>Zero Waste Day</h2>
                        <p className='text-sm text-gray-400'>Avoid single-use plastics for 24 hours.</p>
                        <p className='text-sm font-semibold text-yellow-400 mt-3'>Completed! +30 🪙</p>
                        <div className='mt-2 w-full bg-[#121212] rounded-full h-2'>
                            <div className='bg-yellow-500 h-2 rounded-full' style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    <div className='bg-[#242424] rounded-lg p-5 shadow-md flex flex-col'>
                        <h2 className='text-lg font-bold text-gray-200'>Public Transport Week</h2>
                        <p className='text-sm text-gray-400'>Use public transport for all commutes.</p>
                        <p className='text-sm font-semibold text-green-400 mt-3'>Progress: 2/5 days</p>
                        <div className='mt-2 w-full bg-[#121212] rounded-full h-2'>
                            <div className='bg-green-500 h-2 rounded-full' style={{ width: '40%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}