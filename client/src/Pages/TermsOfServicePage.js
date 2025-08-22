import React from "react";

const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-bg-paper shadow-lg rounded-lg text-text-primary">
      <h1 className="text-3xl font-bold text-primary mb-4">Terms of Service</h1>
      <div className="space-y-4 text-text-secondary">
        <p>
          By accessing the website at Gym-Fit, you are agreeing to be bound by
          these terms of service, all applicable laws and regulations, and agree
          that you are responsible for compliance with any applicable local
          laws.
        </p>
        <p>
          Permission is granted to temporarily download one copy of the
          materials on Gym-Fit's website for personal, non-commercial transitory
          viewing only. This is the grant of a license, not a transfer of title.
        </p>
        {/* Add more detailed terms here */}
      </div>
    </div>
  );
};

export default TermsOfServicePage;
