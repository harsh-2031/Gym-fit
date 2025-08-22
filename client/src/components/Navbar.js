import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const isUserLoggedIn = !!localStorage.getItem("token");
  const isTrainerLoggedIn = !!localStorage.getItem("trainerToken");

  const handleLogout = () => {
    localStorage.clear(); // Clears all tokens and user info
    navigate("/");
    window.location.reload();
  };

  const navButtonClasses =
    "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700";
  const brandClasses = "text-white text-lg font-bold";

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <Link to="/" className={brandClasses}>
            Gym-Fit
          </Link>
          <div className="flex items-center space-x-4">
            {isUserLoggedIn ? (
              <>
                <Link to="/dashboard" className={navButtonClasses}>
                  Dashboard
                </Link>
                <Link to="/workouts" className={navButtonClasses}>
                  My Workouts
                </Link>
                <Link to="/history" className={navButtonClasses}>
                  History
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${navButtonClasses} bg-indigo-600 hover:bg-indigo-700`}
                >
                  Logout
                </button>
              </>
            ) : isTrainerLoggedIn ? (
              <>
                <Link to="/trainer/dashboard" className={navButtonClasses}>
                  Dashboard
                </Link>
                <Link to="/trainer/workouts" className={navButtonClasses}>
                  Templates
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${navButtonClasses} bg-purple-600 hover:bg-purple-700`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navButtonClasses}>
                  User Login
                </Link>
                <Link to="/trainer/login" className={navButtonClasses}>
                  Trainer Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
