import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Make sure Link is imported

const TrainerDashboardPage = () => {
  const [clients, setClients] = useState([]);
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Function to fetch clients, reusable
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("trainerToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
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
      setMessage(`Client with email ${clientEmail} added successfully!`);
      setClientEmail(""); // Clear input
      fetchClients(); // Refresh the client list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add client.");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  // --- EVERYTHING MUST BE INSIDE THIS ONE RETURN STATEMENT ---
  return (
    <div>
      <h1>Trainer Dashboard</h1>

      {/* --- ADDED THE LINK HERE --- */}
      <div style={{ margin: "20px 0" }}>
        <Link to="/trainer/workouts">
          <button>My Workout Templates</button>
        </Link>
      </div>

      {/* Add New Client Form */}
      <div
        style={{ margin: "20px 0", padding: "15px", border: "1px solid #ddd" }}
      >
        <h3>Add New Client</h3>
        <form onSubmit={handleAddClient}>
          <input
            type="email"
            placeholder="Client's Email Address"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
          <button type="submit">Add Client</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>

      {/* Client List */}
      <div>
        <h2>My Clients</h2>
        {clients.length > 0 ? (
          <ul>
            {clients.map((client) => (
              <li key={client._id}>
                {/* Make the client name a link */}
                <Link to={`/trainer/client/${client._id}`}>
                  {client.name}
                </Link>{" "}
                - {client.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have any clients yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboardPage;
