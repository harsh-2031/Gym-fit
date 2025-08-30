import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";

const TrainerDashboardPage = () => {
  const [clients, setClients] = useState([]);
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const trainerInfo = JSON.parse(localStorage.getItem("trainer"));

  // --- Define the API URL from the environment variable ---
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // --- UPDATED URL ---
      const { data } = await axios.get(
        `${API_URL}/api/trainers/clients`,
        config
      );
      setClients(data);
    } catch (err) {
      setError("Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddClient = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // --- UPDATED URL ---
      await axios.post(
        `${API_URL}/api/trainers/clients`,
        { clientEmail },
        config
      );
      setMessage("Client added successfully!");
      setClientEmail("");
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add client.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading Dashboard...</p>;

  const cardClasses = "bg-bg-paper rounded-lg shadow-lg p-6 flex flex-col";
  const inputClasses =
    "w-full px-3 py-2 border border-gray-700 bg-bg-default rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-primary hover:bg-primary/80";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome, {trainerInfo ? trainerInfo.name : "Trainer"}!
        </h1>
        <RouterLink
          to="/trainer/workouts"
          className="px-4 py-2 text-sm font-semibold text-secondary bg-primary rounded-md hover:bg-primary/80"
        >
          My Templates
        </RouterLink>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{ alignItems: "start" }}
      >
        <div className={cardClasses}>
          <h2 className="text-xl font-bold mb-4 text-text-primary">
            Add New Client
          </h2>
          <form onSubmit={handleAddClient} className="space-y-4">
            <input
              type="email"
              placeholder="Client's Email Address"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
              className={inputClasses}
            />
            <button type="submit" className={buttonClasses}>
              Add Client
            </button>
          </form>
          {error && (
            <div className="mt-3 p-3 bg-red-500/20 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-3 p-3 bg-green-500/20 text-green-400 rounded-md text-sm">
              {message}
            </div>
          )}
        </div>

        <div className={cardClasses}>
          <h2 className="text-xl font-bold mb-4 text-text-primary">
            My Clients
          </h2>
          {clients.length > 0 ? (
            <ul className="space-y-3">
              {clients.map((client) => (
                <li key={client._id}>
                  <RouterLink
                    to={`/trainer/client/${client._id}`}
                    className="block p-3 rounded-md bg-bg-default hover:bg-secondary/20"
                  >
                    <p className="font-semibold text-text-primary">
                      {client.name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {client.email}
                    </p>
                  </RouterLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary">
              You don't have any clients yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default TrainerDashboardPage;
