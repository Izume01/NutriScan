import { useEffect } from 'react';

import { Route, Routes } from 'react-router';
import { Dashboard } from './Components/Dashboard';
import { Challenges } from './Components/Challenges';
import { Activities } from './Components/Activities';
import { Logging } from './Components/Logging';
import { Login } from './Components/Login';
import { Signup } from './Components/Signup';
import PrivateRoute from './Components/PrivateRoute';
import { useAuthStore } from './Store/authStore';
import { getUser } from './appwrite/authService';
import { Home } from './Pages/Home';
import {Onboarding} from './Components/Onboarding';

function App() {

  const { setLoading, setUser } = useAuthStore();

  useEffect(() => {
    getUser()
      .then(user => {
        setUser(user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false)); // Set loading state false once user data is loaded
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/challenges" element={
        <PrivateRoute>
          <Challenges />
        </PrivateRoute>
      } />
      <Route path="/activities" element={
        <PrivateRoute>
          <Activities />
        </PrivateRoute>
      } />
      <Route path="/logging" element={
        <PrivateRoute>
          <Logging />
        </PrivateRoute>
      } />

      <Route path='/login' element={
        <Login />
      } />

      <Route path='/signup' element={
        <Signup />
      } />
      <Route path='/onboarding' element={
        <Onboarding />
      } />
    </Routes>


  )
}

export default App
