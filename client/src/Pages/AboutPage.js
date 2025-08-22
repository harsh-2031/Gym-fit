import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-bg-paper shadow-lg rounded-lg text-text-primary">
      <h1 className="text-3xl font-bold text-primary mb-4">About Gym-Fit</h1>
      <div className="space-y-4 text-text-secondary">
        <p>
          Welcome to Gym-Fit, your ultimate companion on the path to a stronger,
          healthier you. Our mission is to provide a seamless and motivating
          experience for both fitness enthusiasts and professional trainers.
        </p>
        <p>
          We believe that tracking your progress is key to achieving your goals.
          Whether you're working out at home or at the gym, our platform
          provides the tools you need to create, follow, and log your workouts
          with precision. For trainers, we offer a powerful suite of tools to
          manage clients, create custom workout templates, and assign them with
          ease, all while monitoring client progress.
        </p>
        <p>Join our community and transform your fitness journey today.</p>
      </div>
    </div>
  );
};

export default AboutPage;
