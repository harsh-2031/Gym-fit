// client/src/components/WorkoutCalendar.js
import React from "react";
import Calendar from "react-calendar";

const WorkoutCalendar = ({ workoutDates = [] }) => {
  // A Set provides faster lookups than an array
  const workoutDateSet = new Set(workoutDates);

  const tileContent = ({ date, view }) => {
    // Only add the dot in the month view
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      // If the date is in our set, render the dot
      if (workoutDateSet.has(dateString)) {
        return <div className="workout-dot"></div>;
      }
    }
    return null;
  };

  return <Calendar tileContent={tileContent} className="w-full border-none" />;
};

export default WorkoutCalendar;
