import React, { useState } from "react"
import { getUser } from "../appwrite/authService"
import { createEmissionLog } from "../appwrite/dbService"

type ActivityType = "Travel" | "Food" | "Energy" | "Shopping"

export const Logging = () => {


  const submitEmission  = async () => {
    const user = await getUser();
    const emissionValue = parseFloat(calculateEmissions());
    
    // Get the appropriate category field based on activeTab
    let category = "";
    switch (activeTab) {
      case "Travel":
        category = formData.travelMode;
        break;
      case "Food":
        category = formData.mealType;
        break;
      case "Energy":
        category = formData.energyType;
        break;
      case "Shopping":
        category = formData.category;
        break;
    }
    
    const data = {
      userId: user.$id,
      type: activeTab,
      category: category,
      value: emissionValue,
      unit: "kg",
      emission: emissionValue,
      date: formData.date,
      description : formData.notes,
      
    }

    const doc = await createEmissionLog(data)
    console.log("Document created:", doc)
  }


  const [activeTab, setActiveTab] = useState<ActivityType>("Shopping")
  const [formData, setFormData] = useState({
    date: "2025-04-12",
    recurring: false,
    notes: "",
    // Travel fields
    travelMode: "Car",
    distance: "10",
    passengers: "1",
    // Food fields
    mealType: "Mixed meal",
    servings: "1",
    locallySourced: false,
    // Energy fields
    energyType: "Electricity",
    amount: "10",
    renewableSource: false,
    // Shopping fields
    category: "Clothing",
    quantity: "1",
    items: "",
    packaging: "Minimal packaging",
    secondHand: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const calculateEmissions = (): string => {
    let emissions = 0


    switch (activeTab) {
      case "Travel": {
        const distanceNum = parseFloat(formData.distance) || 0;
        const passengersNum = parseInt(formData.passengers) || 1;

        if (formData.travelMode === "Car") emissions = (distanceNum * 0.12) / Math.max(1, passengersNum);
        else if (formData.travelMode === "Bus") emissions = distanceNum * 0.05;
        else if (formData.travelMode === "Train") emissions = distanceNum * 0.03;
        else if (formData.travelMode === "Flight") emissions = distanceNum * 0.2;
        break;
      }

      case "Food": {
        const servings = parseInt(formData.servings) || 0;

        if (formData.mealType === "Vegan meal") emissions = 0.5 * servings;
        else if (formData.mealType === "Vegetarian meal") emissions = 1.0 * servings;
        else if (formData.mealType === "Mixed meal") emissions = 2.5 * servings;
        else if (formData.mealType === "Meat-heavy meal") emissions = 4.0 * servings;

        if (formData.locallySourced) emissions *= 0.8; // 20% reduction
        break;
      }

      case "Energy": {
        const amount = parseFloat(formData.amount) || 0;

        if (formData.energyType === "Electricity") emissions = amount * 0.5;
        else if (formData.energyType === "Natural Gas") emissions = amount * 0.2;

        if (formData.renewableSource) emissions *= 0.2; // 80% reduction
        break;
      }

      case "Shopping": {
        const quantity = parseInt(formData.quantity) || 0;

        if (formData.category === "Clothing") emissions = 5.5 * quantity; 
        else if (formData.category === "Electronics") emissions = 15 * quantity;
        else if (formData.category === "Household") emissions = 8 * quantity;

        if (formData.secondHand) emissions *= 0.3; // 70% reduction
        break;
      }
    }

    return emissions.toFixed(1)
  }

  const renderFormFields = () => {
    switch (activeTab) {
      case "Travel":
        return (
          <>
            <div>
              <label className="text-sm mb-1 block">Travel Mode</label>
              <select
                name="travelMode"
                value={formData.travelMode}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                <option>Car</option>
                <option>Bus</option>
                <option>Train</option>
                <option>Flight</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Distance (km)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">Passengers</label>
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="recurring" className="text-sm">
                Recurring trip (e.g., daily commute)
              </label>
            </div>
          </>
        )

      case "Food":
        return (
          <>
            <div>
              <label className="text-sm mb-1 block">Meal Type</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                <option>Vegan meal</option>
                <option>Vegetarian meal</option>
                <option>Mixed meal</option>
                <option>Meat-heavy meal</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Servings</label>
              <select
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="locallySourced"
                name="locallySourced"
                checked={formData.locallySourced}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="locallySourced" className="text-sm">
                Locally sourced ingredients
              </label>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="recurring" className="text-sm">
                Recurring meal (e.g., daily lunch)
              </label>
            </div>
          </>
        )

      case "Energy":
        return (
          <>
            <div>
              <label className="text-sm mb-1 block">Energy Type</label>
              <select
                name="energyType"
                value={formData.energyType}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                <option>Electricity</option>
                <option>Natural Gas</option>
                <option>Heating Oil</option>
                <option>Propane</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Amount (kWh/units)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="renewableSource"
                name="renewableSource"
                checked={formData.renewableSource}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="renewableSource" className="text-sm">
                Renewable energy source
              </label>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="recurring" className="text-sm">
                Recurring usage (e.g., monthly bill)
              </label>
            </div>
          </>
        )

      case "Shopping":
        return (
          <>
            <div>
              <label className="text-sm mb-1 block">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                <option>Clothing</option>
                <option>Electronics</option>
                <option>Household</option>
                <option>Personal Care</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Quantity</label>
              <select
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num.toString()}>
                    {num} item{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Items</label>
              <input
                name="items"
                value={formData.items}
                onChange={handleChange}
                placeholder="e.g., T-shirt, jeans"
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">Packaging</label>
              <select
                name="packaging"
                value={formData.packaging}
                onChange={handleChange}
                className="w-full bg-[#27272A] p-2 rounded-md border border-[#3F3F46]"
              >
                <option>Minimal packaging</option>
                <option>Standard packaging</option>
                <option>Excessive packaging</option>
                <option>No packaging</option>
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="secondHand"
                name="secondHand"
                checked={formData.secondHand}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="secondHand" className="text-sm">
                Second-hand/Used item
              </label>
            </div>
          </>
        )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Activity logged! Estimated CO2 emissions: ${calculateEmissions()} kg`)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#121212] text-white">
      <div className="p-6 flex-1 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Carbon Footprint Tracker</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Left Section - Form */}
          <div className="lg:col-span-3 bg-[#121212] p-6 rounded-lg border border-[#3F3F46]">
            <h2 className="text-2xl font-bold mb-2">Record Your Activity</h2>
            <p className="text-sm text-gray-400 mb-4">
              Log your daily activities to track and reduce your carbon footprint
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Travel", "Food", "Energy", "Shopping"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as ActivityType)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${tab === activeTab ? "bg-[#3F3F46] text-white" : "bg-[#27272A] text-gray-400"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm mb-1 block">Activity Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-[#27272A] text-white p-2 rounded-md border border-[#3F3F46]"
                  />
                </div>
              </div>

              {/* Dynamic Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{renderFormFields()}</div>

              {/* CO2 Emission Display */}
              <div className="bg-[#3F3F46] mt-6 p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-sm font-semibold">Estimated CO2 Emissions</p>
                  <p className="text-xs text-gray-300">
                    This is an estimate based on average values. Actual emissions may vary.
                  </p>
                </div>
                <p className="text-red-400 font-bold text-lg">{calculateEmissions()} kg</p>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <label className="text-sm block mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional details about this activity..."
                  className="w-full bg-[#27272A] text-white p-2 rounded-md border border-[#3F3F46]"
                  rows={3}
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-[#27272A] rounded-md border border-[#3F3F46]">
                  Cancel
                </button>
                <button
                  onClick={submitEmission}
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400"
                >
                  Log Activity
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Guides */}
          <div className="flex flex-col gap-4">
            {/* Emissions Guide */}
            <div className="bg-[#18181B] p-4 rounded-lg border border-[#3F3F46] h-fit sticky top-6">
              <h3 className="text-lg font-semibold mb-2">Emissions Guide</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <span className="font-semibold">Travel</span>
                </p>
                <p>Car (per km): 0.12 kg CO2</p>
                <p>Bus (per km): 0.05 kg CO2</p>
                <p>Train (per km): 0.03 kg CO2</p>
                <p>Flight (per km): 0.20 kg CO2</p>
                <br />
                <p>
                  <span className="font-semibold">Food</span>
                </p>
                <p>Vegan meal: 0.5 kg CO2</p>
                <p>Vegetarian meal: 1.0 kg CO2</p>
                <p>Mixed meal: 2.5 kg CO2</p>
                <p>Meat-heavy meal: 4.0 kg CO2</p>
                <br />
                <p>
                  <span className="font-semibold">Energy</span>
                </p>
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
      </div>
    </div>
  )
}
