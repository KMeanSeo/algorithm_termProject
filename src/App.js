// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PriorityPage from "./screen/PriorityPage";
import OptimizedExercisePage from "./screen/OptimizedExercisePage";
import HomePage from "./screen/HomePage";

function App() {
  // State for user input on current weight, target weight, duration, and exercise schedule
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [months, setMonths] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [dailyTimes, setDailyTimes] = useState({
    Monday: { start: "", end: "" },
    Tuesday: { start: "", end: "" },
    Wednesday: { start: "", end: "" },
    Thursday: { start: "", end: "" },
    Friday: { start: "", end: "" },
    Saturday: { start: "", end: "" },
    Sunday: { start: "", end: "" },
  });
  const [summary, setSummary] = useState(null);

  // Handle change for selected days with checkboxes
  const handleCheckboxChange = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  // Handle time change for exercise start and end times
  const handleTimeChange = (day, field, value) => {
    setDailyTimes({
      ...dailyTimes,
      [day]: { ...dailyTimes[day], [field]: value },
    });
  };

  // Calculate the exercise summary based on user input
  const calculateSummary = () => {
    if (!currentWeight) {
      alert("Please enter your current weight.");
      return;
    }

    if (!targetWeight) {
      alert("Please enter your target weight.");
      return;
    }

    if (parseFloat(targetWeight) >= parseFloat(currentWeight)) {
      alert("Target weight should be less than current weight.");
      return;
    }

    if (selectedDays.length === 0) {
      alert("Please select at least one exercise day.");
      return;
    }

    for (const day of selectedDays) {
      const { start, end } = dailyTimes[day];
      if (!start || !end) {
        alert(`Please set both start and end times for ${day}.`);
        return;
      }
      if (start >= end) {
        alert(`Start time for ${day} should be earlier than end time.`);
        return;
      }
    }

    const totalWeeks = months * 4;
    const totalWeightLoss = currentWeight - targetWeight;
    const weeklyWeightLossGoal = totalWeightLoss / totalWeeks;
    const caloriesPerKg = 7700;
    const weeklyCalorieDeficit = (weeklyWeightLossGoal * caloriesPerKg).toFixed(
      2
    );

    // Calculate total exercise time in minutes for selected days
    const totalExerciseTime = selectedDays.reduce((total, day) => {
      const { start, end } = dailyTimes[day];
      if (start && end) {
        const [startHours, startMinutes] = start.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);
        const startTime = startHours * 60 + startMinutes;
        const endTime = endHours * 60 + endMinutes;
        return total + (endTime - startTime);
      }
      return total;
    }, 0);

    // Set the calculated summary data
    setSummary({
      currentWeight,
      targetWeight,
      months,
      selectedDays: selectedDays.join(", "),
      weeklyCalorieDeficit,
      dailyTimes,
      totalExerciseTime,
    });
  };

  return (
    <Router>
      <Routes>
        {/* HomePage route for setting exercise goals */}
        <Route
          path="/"
          element={
            <HomePage
              currentWeight={currentWeight}
              setCurrentWeight={setCurrentWeight}
              targetWeight={targetWeight}
              setTargetWeight={setTargetWeight}
              months={months}
              setMonths={setMonths}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              dailyTimes={dailyTimes}
              setDailyTimes={setDailyTimes}
              summary={summary}
              setSummary={setSummary}
              handleCheckboxChange={handleCheckboxChange}
              handleTimeChange={handleTimeChange}
              calculateSummary={calculateSummary}
            />
          }
        />
        {/* PriorityPage route for selecting exercises by body part */}
        <Route
          path="/priority"
          element={<PriorityPage csvFilePath="updated_exercise_data.csv" />}
        />
        {/* OptimizedExercisePage route for viewing optimized exercise schedule */}
        <Route
          path="/optimized-exercises"
          element={<OptimizedExercisePage currentWeight={currentWeight} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
