import React from 'react';
import { Route, Routes } from 'react-router';
import { Sidebar } from './Components/Sidebar';
import { Dashboard } from './Components/Dashboard';
import { Challenges } from './Components/Challenges';
function App() {

  return (
    <Routes>
      <Route path="/" element={
        <Sidebar/>
      } />
      <Route path="/dashboard" element={
          <Dashboard />
      } />
      <Route path="/challenges" element={
          <Challenges />
      } />
    </Routes>
  )
}

export default App
