import React from 'react'
import { ChevronLeft } from 'lucide-react'

export const Activities = () => {
  return (
    <div className='flex flex-col w-full h-full bg-[#18181B] text-white p-6'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row gap-3 items-center'>
          <div className='p-2 rounded-full bg-[#27272A] hover:bg-[#3F3F46] flex items-center justify-center cursor-pointer transition-colors'>
            <ChevronLeft size={20} color="#10f500" />
          </div>
          <h1 className='text-3xl font-bold text-white'>Activities</h1>
        </div>
      </div>


      {/* Slider active , avaiable and completed */}

      <div className='flex flex-col gap-4 mt-8 w-full'>
        <div className='bg-[#27272A] p-1 rounded-lg flex w-full justify-between items-center'>
          <button className='px-6 py-2 rounded-md bg-[#10f500] text-black font-medium transition-all hover:bg-opacity-90 w-1/3 text-center'>
            All
          </button>
          <button className='px-6 py-2 rounded-md text-gray-300 transition-all hover:bg-[#3F3F46] w-1/3 text-center'>
            Travel
          </button>
          <button className='px-6 py-2 rounded-md text-gray-300 transition-all hover:bg-[#3F3F46] w-1/3 text-center'>
            Food
          </button>
          <button className='px-6 py-2 rounded-md text-gray-300 transition-all hover:bg-[#3F3F46] w-1/3 text-center'>
            Energy
          </button>
          <button className='px-6 py-2 rounded-md text-gray-300 transition-all hover:bg-[#3F3F46] w-1/3 text-center'>
            Shopping
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8 w-full border border-[#3F3F46] p-6 rounded-lg bg-[#18181B] text-white text-center items-center justify-center min-h-[250px]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-xl font-semibold">Activity Log</h1>
          <p className="text-sm text-gray-400">Your recent carbon footprint activities</p>
        </div>

        <div className="flex flex-col gap-2 items-center mt-8">
          <div className="w-16 h-16 bg-[#27272A] rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-md font-medium mt-2">No activities logged</p>
          <p className="text-sm text-gray-400">Start logging your daily activities to track your carbon footprint</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8 w-full border border-[#3F3F46] p-6 rounded-lg bg-[#18181B] text-white text-center items-center justify-center min-h-[150px]">
        <h1 className="text-md font-medium">Total Emissions
        </h1>
        <p className="text-2xl font-bold">0.0 kg CO2</p>
        <p className="text-sm text-gray-400">Lifetime CO2 emissions </p>
      </div>

      <div className="flex flex-col gap-4 mt-8 w-full border border-[#3F3F46] p-6 rounded-lg bg-[#18181B] text-white text-center items-center justify-center min-h-[150px]">
        <h1 className="text-md font-medium">Last 7 Days</h1>
        <p className="text-2xl font-bold">0.0 kg CO2</p>
        <p className="text-sm text-gray-400">From 0 activities</p>
      </div>

      <div className="flex flex-col gap-4 mt-8 w-full border border-[#3F3F46] p-6 rounded-lg bg-[#18181B] text-white text-center items-center justify-center min-h-[150px]">
        <h1 className="text-md font-medium">Highest Category</h1>
        <p className="text-2xl font-bold">None</p>
        <p className="text-sm text-gray-400">0.0 kg CO2 (0% of total)</p>
      </div>
    </div>
  )
}
