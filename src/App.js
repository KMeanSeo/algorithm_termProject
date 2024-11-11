// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PriorityPage from "./screen/PriorityPage";
import OptimizedExercisePage from "./screen/OptimizedExercisePage";
import HomePage from "./screen/HomePage";

function App() {
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

  const handleCheckboxChange = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleTimeChange = (day, field, value) => {
    setDailyTimes({
      ...dailyTimes,
      [day]: { ...dailyTimes[day], [field]: value },
    });
  };

  const calculateSummary = (navigate) => {
    if (!currentWeight) {
      alert("현재 체중을 입력하세요.");
      return;
    }

    if (!targetWeight) {
      alert("목표 체중을 입력하세요.");
      return;
    }

    if (parseFloat(targetWeight) >= parseFloat(currentWeight)) {
      alert("목표 체중은 현재 체중보다 낮아야 합니다.");
      return;
    }

    if (selectedDays.length === 0) {
      alert("최소한 하나의 운동 요일을 선택해야 합니다.");
      return;
    }

    for (const day of selectedDays) {
      const { start, end } = dailyTimes[day];
      if (!start || !end) {
        alert(`${day}의 시작 시간과 종료 시간을 모두 설정해야 합니다.`);
        return;
      }
      if (start >= end) {
        alert(`${day}의 시작 시간은 종료 시간보다 이전이어야 합니다.`);
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

    setSummary({
      currentWeight,
      targetWeight,
      months,
      selectedDays: selectedDays.join(", "),
      weeklyCalorieDeficit,
      dailyTimes,
      totalExerciseTime,
    });

    navigate("/priority", {
      state: {
        currentWeight,
        targetWeight,
        months,
        selectedDays,
        dailyTimes,
        weeklyCalorieDeficit,
        totalCaloriesToBurn: totalWeightLoss * caloriesPerKg,
      },
    });
  };

  return (
    <Router>
      <Routes>
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
        <Route
          path="/priority"
          element={<PriorityPage csvFilePath="updated_exercise_data.csv" />}
        />
        <Route
          path="/optimized-exercises"
          element={<OptimizedExercisePage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
