import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if user token exists in local storage
  const token = localStorage.getItem("token");

  // If token exists, render the child component (Outlet), otherwise redirect to login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
