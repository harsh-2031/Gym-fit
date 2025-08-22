import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClientDetailsPage = () => {
  const { clientId } = useParams();
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

        const [clientRes, templatesRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/trainers/clients/${clientId}`,
            config
          ),
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

  const cardClasses = "bg-bg-paper rounded-lg shadow-lg p-6 flex flex-col";
  const inputClasses =
    "w-full px-3 py-2 border border-gray-700 bg-bg-default rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-primary hover:bg-primary/80";

  if (loading)
    return <p className="text-center mt-8">Loading client details...</p>;
  if (error && !client)
    return (
      <div className="p-4 bg-red-500/20 text-red-400 rounded-md">{error}</div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">
        Client Management
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Information Card */}
        <div
          className={`${cardClasses} md:col-span-1 text-center items-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mb-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-text-primary">
            {client?.name}
          </h2>
          <p className="text-text-secondary">{client?.email}</p>
        </div>

        {/* Assign Workout Card */}
        <div className={`${cardClasses} md:col-span-2`}>
          <h3 className="text-xl font-bold mb-4 text-text-primary">
            Assign a New Workout
          </h3>
          <form onSubmit={handleAssignWorkout} className="space-y-4">
            <div>
              <label
                htmlFor="template-select"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Select a Template
              </label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                required
                className={inputClasses}
              >
                <option value="" disabled>
                  -- Select a Template --
                </option>
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No templates available to assign</option>
                )}
              </select>
            </div>
            <button type="submit" className={buttonClasses}>
              Assign Workout
            </button>
          </form>
          {message && (
            <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-md text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
