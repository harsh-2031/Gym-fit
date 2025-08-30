import React, { useState } from "react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-bg-paper p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-1 transition-all duration-300 h-full border border-gray-700/50 hover:shadow-2xl hover:shadow-primary/20">
    <div className="text-primary inline-block mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-text-primary">{title}</h3>
    <p className="text-text-secondary text-sm">{description}</p>
  </div>
);

const PricingCard = ({ plan, isYearly }) => {
  const isPopular = plan.popular;
  const price = isYearly ? plan.price * 10 : plan.price;

  return (
    <div
      className={`rounded-lg p-8 border ${
        isPopular ? "border-primary" : "border-gray-700"
      } ${
        isPopular
          ? "bg-primary/5 dark:bg-primary/10 transform scale-105"
          : "bg-bg-paper"
      } flex flex-col shadow-lg`}
    >
      {isPopular && (
        <div className="text-center mb-4">
          <span className="bg-primary text-secondary text-xs font-semibold px-3 py-1 rounded-full uppercase">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-text-primary text-center">
        {plan.title}
      </h3>
      <p className="text-text-secondary text-center mb-6">{plan.subtitle}</p>
      <div className="text-center my-4">
        <span className="text-5xl font-extrabold text-primary">₹{price}</span>
        <span className="text-text-secondary">
          /{isYearly ? "year" : "month"}
        </span>
      </div>
      <ul className="space-y-3 text-text-secondary text-sm mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-5 h-5 text-primary mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isPopular
            ? "bg-primary text-secondary hover:bg-primary/80"
            : "bg-secondary text-text-primary hover:bg-secondary/80"
        }`}
      >
        Choose Plan
      </button>
    </div>
  );
};

const HomePage = () => {
  const userToken = localStorage.getItem("token");
  const trainerToken = localStorage.getItem("trainerToken");
  const user = userToken ? JSON.parse(localStorage.getItem("user")) : null;
  const trainer = trainerToken
    ? JSON.parse(localStorage.getItem("trainer"))
    : null;
  const isLoggedIn = userToken || trainerToken;

  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      title: "Free",
      subtitle: "For Casual Tracking",
      price: 0,
      features: [
        "Log Unlimited Workouts",
        "Access Basic Workout Templates",
        "Track Personal Streak",
      ],
      popular: false,
    },
    {
      title: "Pro",
      subtitle: "For Dedicated Athletes",
      price: 299,
      features: [
        "Everything in Free",
        "Create Unlimited Custom Workout Plans",
        "Access All Workout Templates",
        "Advanced Progress Charts & Visuals",
        "Connect with a Trainer",
      ],
      popular: true,
    },
    {
      title: "Coach",
      subtitle: "For a Guided Experience",
      price: 999,
      features: [
        "Everything in Pro",
        "1-on-1 Personal Trainer Sessions",
        "Personalized Meal Plans",
        "Priority Support",
      ],
      popular: false,
    },
  ];

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

  return (
    <div>
      {/* --- Hero Section (90% Screen Height) --- */}
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
        {isLoggedIn ? (
          <>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-text-primary">
              Welcome back, {user?.name || trainer?.name}!
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-text-secondary mb-8">
              Ready to continue your fitness journey? Let's get started.
            </p>
            <Link
              to={userToken ? "/dashboard" : "/trainer/dashboard"}
              className="inline-block px-8 py-3 text-lg font-semibold text-secondary bg-primary rounded-lg shadow-md hover:bg-primary/80"
            >
              Go to My Dashboard
            </Link>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* --- Features Section (Centered with 80% Screen Height Background & max-w-7xl) --- */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-bg-default py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-20 bg-secondary rounded-2xl shadow-2xl">
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

      {/* --- Subscription Section (Compact Height) --- */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-primary uppercase">
            Start the Process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-6">
            Choose Your Plan
          </h2>
          <div className="inline-flex bg-bg-paper p-1 rounded-lg shadow-md mb-12">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${
                !isYearly
                  ? "bg-secondary text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${
                isYearly ? "bg-primary text-secondary" : "text-text-secondary"
              }`}
            >
              Yearly
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <PricingCard key={plan.title} plan={plan} isYearly={isYearly} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
