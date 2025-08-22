import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// A simple SVG icon component for reusability
const Icon = ({ path }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-bg-paper p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300 h-full">
    <div className="text-primary inline-block mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-text-primary">{title}</h3>
    <p className="text-text-secondary text-sm">{description}</p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();

  // --- NEW: Redirection Logic ---
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const trainerToken = localStorage.getItem("trainerToken");

    if (userToken) {
      navigate("/dashboard");
    } else if (trainerToken) {
      navigate("/trainer/dashboard");
    }
  }, [navigate]);

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-text-primary">
          Transform Your Fitness Journey
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-text-secondary mb-8">
          Track workouts, connect with trainers, and see your progress grow.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="inline-block px-8 py-3 text-lg font-semibold text-secondary bg-primary rounded-lg shadow-md hover:bg-primary/80"
          >
            Get Started as an Athlete
          </Link>
          <Link
            to="/trainer/register"
            className="inline-block px-8 py-3 text-lg font-semibold text-primary bg-transparent border-2 border-primary rounded-lg hover:bg-primary/10"
          >
            I'm a Trainer
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-bg-paper py-16 md:py-24 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Why Choose Gym-Fit?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Icon path="M19 14l-7 7m0 0l-7-7m7 7V3" />}
              title="Track Workouts"
              description="Log exercises, sets, and reps with our intuitive tracking system."
            />
            <FeatureCard
              icon={
                <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              }
              title="Personal Plans"
              description="Create workout plans tailored to your goals or get them from a trainer."
            />
            <FeatureCard
              icon={<Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
              title="Progress History"
              description="Monitor your improvements over time with a detailed workout logbook."
            />
            <FeatureCard
              icon={
                <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              }
              title="Trainer Connection"
              description="Trainers can manage clients, assign workouts, and track their progress."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
