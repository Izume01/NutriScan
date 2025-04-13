import { useEffect } from 'react';

import { Route, Routes } from 'react-router';

import { Login } from './Components/Login';
import { Signup } from './Components/Signup';
import PrivateRoute from './Components/PrivateRoute';
import { useAuthStore } from './Store/authStore';
import { getUser } from './appwrite/authService';
import { Home } from './Pages/Home';
import {Onboarding} from './Components/Onboarding';
import LandingPage from './Pages/Landing';

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
      <Route path="/home" element={
        <PrivateRoute>
          <Home />
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
      <Route path='/' element={
        <LandingPage />
      } />

    </Routes>


  )
}

export default App
