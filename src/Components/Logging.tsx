import React from 'react'

export const Logging = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 text-white bg-[#18181B] p-6 rounded-lg border border-[#3F3F46]">
  {/* Left Section - Form */}
  <div className="lg:col-span-2 bg-[#18181B] p-6 rounded-lg border border-[#3F3F46]">
    <h2 className="text-2xl font-bold mb-2">Record Your Activity</h2>
    <p className="text-sm text-gray-400 mb-4">
      Log your daily activities to track and reduce your carbon footprint
    </p>

    {/* Tabs */}
    <div className="flex gap-2 mb-4">
      {["Travel", "Food", "Energy", "Shopping"].map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            tab === "Shopping"
              ? "bg-[#3F3F46] text-white"
              : "bg-[#27272A] text-gray-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Form Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm mb-1 block">Activity Date</label>
        <input
          type="date"
          value="2025-04-12"
          className="w-full bg-[#27272A] text-white p-2 rounded-md border border-[#3F3F46]"
        />
      </div>
      <div className="flex items-center gap-2 mt-6">
        <input type="checkbox" id="recurring" />
        <label htmlFor="recurring" className="text-sm">Recurring activity</label>
      </div>

      <div>
        <label className="text-sm mb-1 block">Category</label>
        <select className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]">
          <option>Clothing</option>
        </select>
      </div>
      <div>
        <label className="text-sm mb-1 block">Quantity</label>
        <select className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]">
          <option>1 item</option>
        </select>
      </div>

      <div>
        <label className="text-sm mb-1 block">Items</label>
        <input
          placeholder="e.g., T-shirt, jeans"
          className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
        />
      </div>
      <div>
        <label className="text-sm mb-1 block">Packaging</label>
        <select className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]">
          <option>Minimal packaging</option>
        </select>
      </div>

      <div className="col-span-2 flex items-center gap-2 mt-2">
        <input type="checkbox" id="used" />
        <label htmlFor="used" className="text-sm">Second-hand/Used item</label>
      </div>
    </div>

    {/* CO2 Emission Display */}
    <div className="bg-[#3F3F46] mt-6 p-4 rounded-md flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold">Estimated CO2 Emissions</p>
        <p className="text-xs text-gray-300">This is an estimate based on average values. Actual emissions may vary.</p>
      </div>
      <p className="text-red-400 font-bold text-lg">5.5 kg</p>
    </div>

    {/* Notes */}
    <div className="mt-4">
      <label className="text-sm block mb-1">Additional Notes</label>
      <textarea
        placeholder="Add any additional details about this activity..."
        className="w-full bg-[#27272A] text-white p-2 rounded-md border border-[#3F3F46]"
        rows={3}
      ></textarea>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-2 mt-4">
      <button className="px-4 py-2 bg-[#27272A] rounded-md border border-[#3F3F46]">
        Cancel
      </button>
      <button className="px-4 py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400">
        Log Activity
      </button>
    </div>
  </div>

  {/* Right Side - Guides */}
  <div className="flex flex-col gap-4">
    {/* Emissions Guide */}
    <div className="bg-[#18181B] p-4 rounded-lg border border-[#3F3F46]">
      <h3 className="text-lg font-semibold mb-2">Emissions Guide</h3>
      <div className="text-sm text-gray-300 space-y-2">
        <p><span className="font-semibold">Travel</span></p>
        <p>Car (per km): 0.12 kg CO2</p>
        <p>Bus (per km): 0.05 kg CO2</p>
        <p>Train (per km): 0.03 kg CO2</p>
        <p>Flight (per km): 0.20 kg CO2</p>
        <br />
        <p><span className="font-semibold">Food</span></p>
        <p>Vegan meal: 0.5 kg CO2</p>
        <p>Vegetarian meal: 1.0 kg CO2</p>
        <p>Mixed meal: 2.5 kg CO2</p>
        <p>Meat-heavy meal: 4.0 kg CO2</p>
        <br />
        <p><span className="font-semibold">Energy</span></p>
        <p>Electricity (per kWh): 0.5 kg CO2</p>
        <p>Natural Gas (per unit): 0.2 kg CO2</p>
      </div>
    </div>

    {/* Tips for Accuracy */}
    <div className="bg-[#18181B] p-4 rounded-lg border border-[#3F3F46]">
      <h3 className="text-lg font-semibold mb-2">Tips for Accuracy</h3>
      <ul className="list-disc ml-5 text-sm text-gray-300 space-y-1">
        <li>Be specific about distances and quantities</li>
        <li>Log activities on the same day they occur</li>
        <li>Include all relevant details for accurate calculations</li>
        <li>For recurring activities, create a template to reuse</li>
      </ul>
    </div>
  </div>
</div>

  )
}
