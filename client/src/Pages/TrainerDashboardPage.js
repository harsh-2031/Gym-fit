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

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        "http://localhost:5000/api/trainers/clients",
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
  }, []);

  const handleAddClient = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5000/api/trainers/clients",
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

  if (loading) return <p>Loading Dashboard...</p>;

  const cardClasses = "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6";
  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Welcome, {trainerInfo ? trainerInfo.name : "Trainer"}!
        </h1>
        <RouterLink
          to="/trainer/workouts"
          className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          My Templates
        </RouterLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Client Card */}
        <div className={cardClasses}>
          <h2 className="text-xl font-bold mb-4">Add New Client</h2>
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
            <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {message}
            </div>
          )}
        </div>

        {/* Clients List Card */}
        <div className={cardClasses}>
          <h2 className="text-xl font-bold mb-4">My Clients</h2>
          {clients.length > 0 ? (
            <ul className="space-y-3">
              {clients.map((client) => (
                <li key={client._id}>
                  <RouterLink
                    to={`/trainer/client/${client._id}`}
                    className="block p-3 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {client.email}
                    </p>
                  </RouterLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              You don't have any clients yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default TrainerDashboardPage;
