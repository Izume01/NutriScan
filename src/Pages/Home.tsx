import React, { useState } from 'react'
import { Sidebar } from '../Components/Sidebar'
import { Logging } from '../Components/Logging'
import { Challenges } from '../Components/Challenges'
import { Activities } from '../Components/Activities'
import { Dashboard } from '../Components/Dashboard'
import Chatbot  from '../Components/Chatbot'


export const Home = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard')

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />
      case 'challenges':
        return <Challenges />
      case 'activities':
        return <Activities />
      case 'logging':
        return <Logging />
      case 'chatbot':
        return <Chatbot />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-[#121212]">
      <Sidebar onNavChange={setActiveComponent} activeItem={activeComponent} />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <main className="flex-1 overflow-x-hidden overflow-y-auto ">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">
              {renderComponent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
