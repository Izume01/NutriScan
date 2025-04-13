import { Navigate } from "react-router";
import { useAuthStore } from "../Store/authStore";
import React from 'react';
import { motion } from 'motion/react'

const LoadingSpinner = () => {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      backgroundColor: "black" 
    }}>
      <motion.div
        style={{
          display: "flex",
          gap: "8px"
        }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#ffffff"
            }}
            animate={{
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <LoadingSpinner />;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
