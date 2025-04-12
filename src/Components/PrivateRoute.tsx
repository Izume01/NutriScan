import { Navigate } from "react-router";
import { useAuthStore } from "../Store/authStore";
import React from 'react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>; // You can show a loader while we check user

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
