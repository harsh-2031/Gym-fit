import React, { useState, useEffect } from "react";
import axios from "axios";

// A reusable card component for displaying stats
const StatCard = ({ title, value, icon }) => (
  <div className="bg-bg-default rounded-lg shadow-md p-6 text-center">
    <div className="text-4xl text-primary mb-2">{icon}</div>
    <p className="text-3xl font-bold text-text-primary">{value}</p>
    <p className="text-text-secondary">{title}</p>
  </div>
);

const TrainerProfilePage = () => {
  const trainer = JSON.parse(localStorage.getItem("trainer"));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("trainerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/trainers/profile/stats",
          config
        );
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch trainer stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (trainer) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [trainer]);

  if (loading) return <p className="text-center mt-8">Loading Profile...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-bg-paper shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-6">
          Trainer Profile
        </h1>
        {trainer && (
          <div className="space-y-3 text-text-primary">
            <p>
              <strong>Name:</strong> {trainer.name}
            </p>
            <p>
              <strong>Email:</strong> {trainer.email}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Total Clients"
          value={stats?.totalClients ?? 0}
          icon="👥"
        />
        <StatCard
          title="Templates Created"
          value={stats?.totalTemplates ?? 0}
          icon="📋"
        />
      </div>
    </div>
  );
};

export default TrainerProfilePage;
