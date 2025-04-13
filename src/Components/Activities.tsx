
import { useState, useEffect } from "react"
import { ChevronLeft, Car, Utensils, Zap, ShoppingBag } from "lucide-react"
import { getUserEmissions } from "../appwrite/dbService"
import { getUser } from "../appwrite/authService"

type ActivityType = "Travel" | "Food" | "Energy" | "Shopping" | "All"
type ActivityItem = {
  id: string
  type: Exclude<ActivityType, "All">
  date: string
  description: string
  emissions: number
  details: string
}

export const Activities = () => {
  const [activeFilter, setActiveFilter] = useState<ActivityType>("All")
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)


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


  // Filter activities based on selected category
  const filteredActivities =
    activeFilter === "All" ? activities : activities.filter((activity) => activity.type === activeFilter)

  // Calculate statistics
  const totalEmissions = activities.reduce((sum, activity) => sum + activity.emissions, 0)

  // Last 7 days emissions
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const last7DaysActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate >= sevenDaysAgo
  })
  const last7DaysEmissions = last7DaysActivities.reduce((sum, activity) => sum + activity.emissions, 0)

  // Highest category
  const categoryEmissions = activities.reduce(
    (acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + activity.emissions
      return acc
    },
    {} as Record<Exclude<ActivityType, "All">, number>,
  )

  const highestCategory =
    Object.entries(categoryEmissions).length > 0
      ? Object.entries(categoryEmissions).sort((a, b) => b[1] - a[1])[0]
      : ["None", 0]

  const highestCategoryPercentage =
    totalEmissions > 0 ? Math.round(((highestCategory[1] as number) / totalEmissions) * 100) : 0

  // Activity icon based on type
  const getActivityIcon = (type: Exclude<ActivityType, "All">) => {
    switch (type) {
      case "Travel":
        return <Car size={18} className="text-blue-400" />
      case "Food":
        return <Utensils size={18} className="text-orange-400" />
      case "Energy":
        return <Zap size={18} className="text-yellow-400" />
      case "Shopping":
        return <ShoppingBag size={18} className="text-purple-400" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#18181B] text-white p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-3 items-center">
          <div
            className="p-2 rounded-full bg-[#27272A] hover:bg-[#3F3F46] flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft size={20} color="#10f500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Activities</h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col gap-4 mt-8 w-full">
        <div className="bg-[#27272A] p-1 rounded-lg flex w-full justify-between items-center overflow-x-auto">
          {["All", "Travel", "Food", "Energy", "Shopping"].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-md ${
                activeFilter === filter ? "bg-[#10f500] text-black font-medium" : "text-gray-300 hover:bg-[#3F3F46]"
              } transition-all w-1/5 text-center whitespace-nowrap`}
              onClick={() => setActiveFilter(filter as ActivityType)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>


        <div className="flex flex-col gap-4 mt-8 w-full overflow-x-hidden overflow-y-auto p-6 rounded-lg bg-[#18181B] text-white min-h-[250px] max-h-[400px]">
          <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Activity Log</h1>
          <p className="text-sm text-gray-400">Your recent carbon footprint activities</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10f500]"></div>
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="mt-4 space-y-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-[#27272A] rounded-lg hover:bg-[#3F3F46] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#18181B] rounded-full">{getActivityIcon(activity.type)}</div>
                  <div>
                    <h3 className="font-medium">{activity.description}</h3>
                    <p className="text-sm text-gray-400">{activity.details}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-red-400 font-semibold">{activity.emissions.toFixed(1)} kg</span>
                  <span className="text-xs text-gray-400">{formatDate(activity.date)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center h-40">
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
            <p className="text-sm text-gray-400">
              {activeFilter === "All"
                ? "Start logging your daily activities to track your carbon footprint"
                : `No ${activeFilter} activities found. Try logging some!`}
            </p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="border border-[#3F3F46] p-6 rounded-lg bg-[#18181B] text-white text-center items-center justify-center min-h-[150px] flex flex-col">
          <h1 className="text-md font-medium">Total Emissions</h1>
          <p className="text-2xl font-bold">{totalEmissions.toFixed(1)} kg CO2</p>
          <p className="text-sm text-gray-400">Lifetime CO2 emissions</p>
        </div>

        <div className="border border-[#3F3F46] p-6 rounded-lg bg-[#18181B] text-white text-center items-center justify-center min-h-[150px] flex flex-col">
          <h1 className="text-md font-medium">Last 7 Days</h1>
          <p className="text-2xl font-bold">{last7DaysEmissions.toFixed(1)} kg CO2</p>
          <p className="text-sm text-gray-400">From {last7DaysActivities.length} activities</p>
        </div>

        <div className="border border-[#3F3F46] p-6 rounded-lg bg-[#18181B] text-white text-center items-center justify-center min-h-[150px] flex flex-col">
          <h1 className="text-md font-medium">Highest Category</h1>
          <p className="text-2xl font-bold">{highestCategory[0]}</p>
          <p className="text-sm text-gray-400">
            {typeof highestCategory[1] === 'number' && highestCategory[1] > 0
              ? `${(highestCategory[1] as number).toFixed(1)} kg CO2 (${highestCategoryPercentage}% of total)`
              : "0.0 kg CO2 (0% of total)"}
          </p>
        </div>
      </div>

      {/* Add Activity Button */}
      
    </div>
  )
}
