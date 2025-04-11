import React from 'react'
import { ChevronLeft } from 'lucide-react'

export const Challenges = () => {
    return (
        <div className='flex flex-col w-full h-screen bg-[#18181B] text-white p-6'>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row gap-3 items-center'>
                    <div className='p-2 rounded-full bg-[#27272A] hover:bg-[#3F3F46] flex items-center justify-center cursor-pointer transition-colors'>
                        <ChevronLeft size={20} color="#10f500" />
                    </div>
                    <h1 className='text-2xl font-bold text-white'>Challenges</h1>
                </div>

                {/* Search */}
                <div className='relative flex items-center'>
                    <input
                        type="text"
                        placeholder='Search challenges...'
                        className='bg-[#27272A] text-white py-2 px-4 pr-10 rounded-lg border border-[#3F3F46] focus:outline-none focus:border-[#10f500] focus:ring-1 focus:ring-[#10f500] transition-all w-[300px]'
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Slider active , avaiable and completed */}

            <div className='flex flex-col gap-4 mt-8 w-full'>
                <div className='bg-[#27272A] p-1 rounded-lg flex w-full justify-between items-center'>
                    <button className='px-6 py-2 rounded-md bg-[#10f500] text-black font-medium transition-all hover:bg-opacity-90 w-1/3 text-center'>
                        Active
                    </button>
                    <button className='px-6 py-2 rounded-md text-gray-300 transition-all hover:bg-[#3F3F46] w-1/3 text-center'>
                        Available
                    </button>
                    <button className='px-6 py-2 rounded-md text-gray-300 transition-all hover:bg-[#3F3F46] w-1/3 text-center'>
                        Completed
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-4 mt-8 w-full'>
                <div className='bg-[#27272A] p-4 rounded-lg flex w-full flex-col justify-between items-start border border-[#3F3F46] hover:shadow-md transition-shadow'>
                    <div className='flex flex-col gap-2 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-xl font-bold'>Go Vegetarian for 3 Days</h1>
                                <span className='bg-[#3F3F46] text-white text-xs px-2 py-1 rounded-full'>Medium</span>
                            </div>
                            <p className='text-sm text-gray-400'>Enjoy plant-based meals for 3 days this week.</p>

                            <div className='mt-2'>
                                <h2 className='text-sm font-semibold'>Progress</h2>
                                <p className='text-sm text-gray-400'>2 out of 3 days completed</p>
                                <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                                    <div className='bg-green-600 h-2.5 rounded-full' style={{ width: '66%' }}></div>
                                </div>
                            </div>

                            <div className='mt-2'>
                                <h2 className='text-sm font-semibold'>CO₂ Savings</h2>
                                <p className='text-sm text-gray-400'>Approx. 15 kg saved</p>
                            </div>

                            <div className='mt-2'>
                                <h2 className='text-sm font-semibold'>Reward</h2>
                                <p className='text-sm text-gray-400'>Earn 50 coins</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 mt-4'>
                        <button className='px-4 py-2 rounded-md bg-[#10f500] text-black font-medium transition-colors hover:bg-opacity-90'>
                            Log Today’s Progress
                        </button>
                    </div>
                </div>
            </div>



        </div>
    )
}
