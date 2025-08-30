import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isUserLoggedIn = !!localStorage.getItem("token");
  const isTrainerLoggedIn = !!localStorage.getItem("trainerToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const trainer = JSON.parse(localStorage.getItem("trainer"));

  let homePath = "/";
  if (isTrainerLoggedIn) {
    homePath = "/trainer/dashboard";
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getNavLinkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-secondary text-text-primary"
        : "text-text-secondary hover:bg-secondary/50 hover:text-text-primary"
    }`;

  const getMobileNavLinkStyle = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      isActive
        ? "bg-secondary text-text-primary"
        : "text-text-secondary hover:bg-secondary/50 hover:text-text-primary"
    }`;

  const dropdownLinkClasses =
    "flex items-center w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary/50";
  const dropdownDestructiveClasses =
    "flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white";

  const renderNavLinks = (isMobile = false) => {
    const styleFunc = isMobile ? getMobileNavLinkStyle : getNavLinkStyle;
    if (isUserLoggedIn) {
      return (
        <>
          <NavLink to="/dashboard" className={styleFunc}>
            Dashboard
          </NavLink>
          <NavLink to="/workouts" className={styleFunc}>
            My Workouts
          </NavLink>
          <NavLink to="/history" className={styleFunc}>
            History
          </NavLink>
        </>
      );
    }
    if (isTrainerLoggedIn) {
      return (
        <>
          <NavLink to="/trainer/dashboard" className={styleFunc}>
            Dashboard
          </NavLink>
          <NavLink to="/trainer/workouts" className={styleFunc}>
            Templates
          </NavLink>
        </>
      );
    }
    return (
      <div
        className={
          isMobile ? "flex flex-col space-y-1" : "flex items-center space-x-1"
        }
      >
        <NavLink to="/login" className={styleFunc}>
          User Login
        </NavLink>
        <NavLink to="/trainer/login" className={styleFunc}>
          Trainer Login
        </NavLink>
        {/* --- ADD THIS LINE --- */}
        <NavLink to="/contact" className={styleFunc}>
          Contact
        </NavLink>
      </div>
    );
  };

  return (
    <nav className="bg-bg-paper shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to={homePath} className="text-primary text-xl font-bold">
            Gym-Fit
          </NavLink>

          <div className="hidden md:flex items-center space-x-4">
            {renderNavLinks()}
            {(isUserLoggedIn || isTrainerLoggedIn) && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center justify-center h-9 w-9 bg-primary rounded-full text-secondary font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-paper focus:ring-primary"
                >
                  {getInitials(user?.name || trainer?.name)}
                </button>

                <div
                  className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-bg-paper ring-1 ring-black ring-opacity-5 z-20 transition-all duration-200 ease-out ${
                    isProfileMenuOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-text-secondary">Signed in as</p>
                    <p className="text-sm font-medium text-text-primary truncate">
                      {user?.name || trainer?.name}
                    </p>
                  </div>
                  <div className="py-1">
                    <NavLink
                      to={isTrainerLoggedIn ? "/trainer/profile" : "/profile"}
                      onClick={() => setProfileMenuOpen(false)}
                      className={dropdownLinkClasses}
                    >
                      My Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className={dropdownDestructiveClasses}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-text-secondary hover:text-text-primary focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks(true)}
            {(isUserLoggedIn || isTrainerLoggedIn) && (
              <div className="border-t border-gray-700 pt-3 mt-3">
                <NavLink
                  to={isTrainerLoggedIn ? "/trainer/profile" : "/profile"}
                  className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-secondary/50 hover:text-text-primary"
                >
                  My Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
