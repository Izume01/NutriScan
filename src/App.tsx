import React from 'react';
import { Route, Routes } from 'react-router';
import { Sidebar } from './Components/Sidebar';
import { Dashboard } from './Components/Dashboard';
import { Challenges } from './Components/Challenges';
import { Activities } from './Components/Activities';
import { Logging } from './Components/Logging';
import { Login } from './Components/Login';
import { Signup } from './Components/Signup';

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
      <Route path="/activities" element={
          <Activities />
      } />
      <Route path="/logging" element={
          <Logging />
      } />

      <Route path='/login' element ={
        <Login />
      } />

      <Route path='/signup' element ={
        <Signup />
      } />
    </Routes>
  )
}

export default App
