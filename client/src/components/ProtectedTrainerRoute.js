import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedTrainerRoute = () => {
  // Check if a trainer token exists in local storage
  const token = localStorage.getItem("trainerToken");

  // If token exists, render the child component (Outlet), otherwise redirect to trainer login
  return token ? <Outlet /> : <Navigate to="/trainer/login" />;
};

export default ProtectedTrainerRoute;
