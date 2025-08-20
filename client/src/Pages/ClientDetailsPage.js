import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClientDetailsPage = () => {
  const { clientId } = useParams(); // Get client ID from the URL
  const [client, setClient] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("trainerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch both client details and workout templates at the same time
        const [clientRes, templatesRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/trainers/clients/${clientId}`,
            config
          ),
          // --- THIS LINE IS NOW FIXED ---
          axios.get("http://localhost:5000/api/trainers/workouts", config),
        ]);

        setClient(clientRes.data);
        setTemplates(templatesRes.data);
      } catch (err) {
        setError("Failed to load page data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const handleAssignWorkout = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) {
      setError("Please select a workout template to assign.");
      return;
    }
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { workoutId: selectedTemplate };

      await axios.post(
        `http://localhost:5000/api/trainers/clients/${clientId}/assign-workout`,
        body,
        config
      );
      setMessage("Workout assigned successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign workout.");
    }
  };

  if (loading) return <p>Loading client details...</p>;
  if (error && !client) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Client: {client?.name}</h1>
      <p>Email: {client?.email}</p>

      <div
        style={{ margin: "20px 0", padding: "15px", border: "1px solid #ddd" }}
      >
        <h3>Assign a New Workout</h3>
        <form onSubmit={handleAssignWorkout}>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            required
          >
            <option value="">-- Select a Template --</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
          <button type="submit">Assign Workout</button>
        </form>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ClientDetailsPage;
