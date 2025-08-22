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

  const cardClasses = "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6";
  const selectClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

  if (loading) return <p>Loading client details...</p>;
  if (error && !client)
    return (
      <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Client Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Information Card */}
        <div className={`${cardClasses} md:col-span-1 text-center`}>
          <div className="text-6xl mb-4 text-indigo-500 dark:text-indigo-400">
            👤
          </div>
          <h2 className="text-2xl font-bold">{client?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{client?.email}</p>
        </div>

        {/* Assign Workout Card */}
        <div className={`${cardClasses} md:col-span-2`}>
          <h3 className="text-xl font-bold mb-4">Assign a New Workout</h3>
          <form onSubmit={handleAssignWorkout} className="space-y-4">
            <div>
              <label htmlFor="template-select" className="sr-only">
                Select a Template
              </label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                required
                className={selectClasses}
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
                  <option disabled>No templates available</option>
                )}
              </select>
            </div>
            <button type="submit" className={buttonClasses}>
              Assign Workout
            </button>
          </form>
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
