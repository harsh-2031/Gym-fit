import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
  });
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        "http://localhost:5000/api/users/details",
        formData,
        config
      );

      const user = JSON.parse(localStorage.getItem("user"));
      user.hasCompletedOnboarding = true;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to submit details", error);
      alert("Could not save details. Please try again.");
    }
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-700 bg-bg-default rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-primary hover:bg-primary/80";

  return (
    <div className="max-w-lg mx-auto p-8 bg-bg-paper shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-2 text-text-primary">
        Tell Us About Yourself
      </h1>
      <p className="text-center text-text-secondary mb-6">
        This will help us tailor your experience.
      </p>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-text-secondary"
          >
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={onChange}
            required
            className={`mt-1 ${inputClasses}`}
          />
        </div>
        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-text-secondary"
          >
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            required
            className={`mt-1 ${inputClasses}`}
          />
        </div>
        <div>
          <label
            htmlFor="height"
            className="block text-sm font-medium text-text-secondary"
          >
            Height (cm)
          </label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={onChange}
            required
            className={`mt-1 ${inputClasses}`}
          />
        </div>
        <div>
          <label
            htmlFor="goal"
            className="block text-sm font-medium text-text-secondary"
          >
            What is your primary goal?
          </label>
          <select
            name="goal"
            value={formData.goal}
            onChange={onChange}
            required
            className={`mt-1 ${inputClasses}`}
          >
            <option value="" disabled>
              Select a goal...
            </option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="General Fitness">General Fitness</option>
            <option value="Strength">Strength</option>
          </select>
        </div>
        <button type="submit" className={buttonClasses}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;
