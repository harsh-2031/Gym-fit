import React from "react";

const TrainerProfilePage = () => {
  const trainer = JSON.parse(localStorage.getItem("trainer"));

  return (
    <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Trainer Profile</h1>
      {trainer && (
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {trainer.name}
          </p>
          <p>
            <strong>Email:</strong> {trainer.email}
          </p>
          {/* You can add trainer-specific details here later */}
        </div>
      )}
    </div>
  );
};

export default TrainerProfilePage;
