import React from 'react';
import { Route, Routes } from 'react-router';
import { Sidebar } from './Components/Sidebar';
import { Dashboard } from './Components/Dashboard';

function App() {

  return (
    <Routes>
      <Route path="/" element={
        <Sidebar/>
      } />
      <Route path="/dashboard" element={
          <Dashboard />
      } />
    </Routes>
  )
}

export default App
