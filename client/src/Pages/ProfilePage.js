import React, { useState, useEffect } from "react";
import axios from "axios";

// A reusable card component for displaying stats
const StatCard = ({ title, value, icon }) => (
  <div className="bg-bg-paper rounded-lg shadow-lg p-6 text-center">
    <div className="text-4xl text-primary mb-2">{icon}</div>
    <p className="text-3xl font-bold text-text-primary">{value}</p>
    <p className="text-text-secondary">{title}</p>
  </div>
);

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the API URL from the environment variable
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // --- UPDATED URL ---
        const { data } = await axios.get(
          `${API_URL}/api/users/profile`,
          config
        );
        setProfile(data.profile);
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [API_URL]); // Added API_URL to dependency array

  if (loading) return <p className="text-center mt-8">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-text-primary">
          My Profile & Progress
        </h1>
        <p className="text-lg text-text-secondary">
          Here's a look at your journey so far.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Workouts Completed"
          value={stats?.totalWorkouts || 0}
          icon="🏋️"
        />
        <StatCard
          title="Hours Trained"
          value={stats?.totalHoursTrained || 0}
          icon="⏱️"
        />
        <StatCard
          title="Total Weight Lifted (kg)"
          value={stats?.totalWeightLifted?.toLocaleString() || 0}
          icon="💪"
        />
      </div>

      {/* Profile Details Card */}
      <div className="bg-bg-paper rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">
          Your Details
        </h2>
        <div className="space-y-3 text-text-primary">
          <p>
            <strong>Name:</strong> {profile?.name}
          </p>
          <p>
            <strong>Email:</strong> {profile?.email}
          </p>
          <p>
            <strong>Age:</strong> {profile?.age || "Not set"}
          </p>
          <p>
            <strong>Weight:</strong>{" "}
            {profile?.weight ? `${profile.weight} kg` : "Not set"}
          </p>
          <p>
            <strong>Height:</strong>{" "}
            {profile?.height ? `${profile.height} cm` : "Not set"}
          </p>
          <p>
            <strong>Goal:</strong> {profile?.goal || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
