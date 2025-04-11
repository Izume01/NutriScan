import React from 'react'
import { ArrowDown } from 'lucide-react'

export const Dashboard = () => {
    return (
        <div className='flex flex-col w-full h-full bg-[#121212] text-white p-6'>
            <div className='flex flex-col gap-3 pb-6 border-b border-gray-700'>
                <h1 className='text-3xl font-bold'>Dashboard</h1>
                <p className='text-md font-semibold text-gray-400'>Track your carbon footprint and get personalized recommendations.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  mt-6'>
                {/* Total Carbon Score */}
                <div className='bg-[#242424] rounded-md p-5 flex flex-col border-1 gap-4'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300'>Total Carbon Score</h2>
                        <h1 className='text-4xl font-bold'>12.4 kg</h1>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Compared to yesterday</p>
                        <div className='flex flex-row gap-2 items-center text-green-500'>
                            <ArrowDown color='#10f500' size={20} />
                            <p className='text-sm'>-1.2 kg</p>
                        </div>
                    </div>
                </div>

                {/* Weekly Average */}
                <div className='bg-[#242424] rounded-md p-5 flex flex-col border-1 gap-4 '>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300'>Weekly Average</h2>
                        <h1 className='text-4xl font-bold'>10.4 kg</h1>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Compared to last week</p>
                        <div className='flex flex-row gap-2 items-center text-green-500'>
                            <ArrowDown color='#10f500' size={20} />
                            <p className='text-sm'>-0.5 kg</p>
                        </div>
                    </div>
                </div>

                {/* Monthly Total */}
                <div className='bg-[#242424] rounded-md p-5 flex flex-col border-1 gap-4'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300'>Monthly Total</h2>
                        <h1 className='text-4xl font-bold'>40.4 kg</h1>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Compared to last month</p>
                        <div className='flex flex-row gap-2 items-center text-green-500'>
                            <ArrowDown color='#10f500' size={20} />
                            <p className='text-sm'>-2.5 kg</p>
                        </div>
                    </div>
                </div>

                {/* Eco Streak*/}

                <div className='bg-[#242424] rounded-md p-5 flex flex-col border-1 gap-4'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-300'>Eco Streak</h2>
                        <h1 className='text-4xl font-bold'>7 days</h1>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Longest streak</p>
                        <div className='flex flex-row gap-2 items-center text-green-500'>
                            <ArrowDown color='#10f500' size={20} />
                            <p className='text-sm'>+3 days</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Next part  */}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
                <div className='col-span-3 flex flex-col gap-3 mt-6 border-1'>
                    <div className='bg-[#242424]   rounded-md p-5'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-2xl font-bold'>Emissions Over Time</h1>
                            <p className='text-md font-semibold text-gray-400'>Your carbon footprint for the past week</p>
                        </div>

                        <div className='flex flex-col gap-2 mt-4'>
                            <div className='bg-[#121212]  rounded-md p-5 '>
                                <h1 className='text-2xl font-bold'>Graph Placeholder</h1>
                                <p className='text-md font-semibold text-gray-400'>Graph will be displayed here</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-span-1 flex flex-col gap-3 mt-6 border-1'>
                    <div className='bg-[#242424] rounded-md p-5'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-2xl font-bold'>Smart Recommendations</h1>
                            <p className='text-md font-semibold text-gray-400'>Personalized tips to reduce your carbon footprint</p>
                        </div>




                        <div className='flex flex-col gap-2 mt-4'>
                            <div className='bg-[#121212] rounded-md p-5'>
                                <h1 className='text-lg font-bold'>Try plant-based protein</h1>
                                <p className='text-sm font-semibold text-gray-400'>Swap beef for lentils to save 2.1kg CO2 per meal</p>
                            </div>

                            <div className='bg-[#121212] rounded-md p-5'>
                                <h1 className='text-lg font-bold'>Bike short trips</h1>
                                <p className='text-sm font-semibold text-gray-400'>Consider biking trips under 3km to reduce emissions</p>
                            </div>

                            <div className='bg-[#121212] rounded-md p-5'>
                                <h1 className='text-lg font-bold'>Unplug devices</h1>
                                <p className='text-sm font-semibold text-gray-400'>Save 0.5kg CO2 daily by unplugging unused electronics</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Challenge  &  Carban offset */}
            {/* Weekly Eco-Challenges
Complete challenges to earn green coins

Go Vegetarian 3 Days
+50 coins
Eat plant-based meals for 3 days this week

Progress
2/3 days
Zero Waste Day
Avoid single-use plastics for 24 hours

Challenge completed! +30 green coins earned
Public Transport Week
+75 coins
Use public transport for all commutes

Progress
2/5 days
Carbon Offset
Offset your carbon footprint with verified projects

Your total emissions this week: 15.8 kg CO2

Offset this amount for approximately ₹120 by supporting tree planting initiatives.

Offset Now */}

            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6'>
                <div className='flex flex-col gap-3 mt-6 border-1'>
                    <div className='bg-[#242424] rounded-md p-5'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-2xl font-bold'>Weekly Eco-Challenges</h1>
                            <p className='text-md font-semibold text-gray-400'>Complete challenges to earn green coins</p>
                        </div>

                        <div className='flex flex-col gap-2 mt-4'>
                            <div className='bg-[#121212] rounded-md p-5'>
                                <h1 className='text-lg font-bold'>Go Vegetarian 3 Days</h1>
                                <p className='text-sm font-semibold text-gray-400'>Eat plant-based meals for 3 days this week</p>
                                <p className='text-sm font-semibold text-gray-400'>Progress: 2/3 days</p>
                            </div>

                            <div className='bg-[#121212] rounded-md p-5'>
                                <h1 className='text-lg font-bold'>Zero Waste Day</h1>
                                <p className='text-sm font-semibold text-gray-400'>Avoid single-use plastics for 24 hours</p>
                                <p className='text-sm font-semibold text-gray-400'>Challenge completed! +30 green coins earned</p>
                            </div>

                            <div className='bg-[#121212] rounded-md p-5'>
                                <h1 className='text-lg font-bold'>Public Transport Week</h1>
                                <p className='text-sm font-semibold text-gray-400'>Use public transport for all commutes</p>
                                <p className='text-sm font-semibold text-gray-400'>Progress: 2/5 days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carbon Offset */}
                <div className='flex flex-col gap-3 mt-6 border-1'>
                    <div className='bg-[#242424] rounded-md p-5'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-2xl font-bold'>Carbon Offset</h1>
                            <p className='text-md font-semibold text-gray-400'>Offset your carbon footprint with verified projects</p>
                        </div>

                        <div className='flex flex-col gap-2 mt-4'>
                            <div className='bg-[#121212] rounded-md p-5'>
                                <h1 className='text-lg font-bold'>Your total emissions this week: 15.8 kg CO2</h1>
                                <p className='text-sm font-semibold text-gray-400'>Offset this amount for approximately ₹120 by supporting tree planting initiatives.</p>
                                <button className='bg-green-500 text-white rounded-md px-4 py-2 mt-4'>Offset Now</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

        </div>
    )
}
