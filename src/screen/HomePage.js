// HomePage.js
import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

// HomePage component for setting exercise goals
function HomePage({
  currentWeight,
  setCurrentWeight,
  targetWeight,
  setTargetWeight,
  months,
  setMonths,
  selectedDays,
  setSelectedDays,
  dailyTimes,
  setDailyTimes,
  summary,
  setSummary,
  handleCheckboxChange,
  handleTimeChange,
  calculateSummary,
}) {
  const navigate = useNavigate();

  // Handles calculation of summary and navigation to the next page
  const handleCalculateSummary = () => {
    calculateSummary(navigate);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Set Exercise Goals</h2>
        <div className="form-container">
          {/* Current weight input */}
          <div className="form-group">
            <label>Current Weight (kg)</label>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="e.g., 70"
            />
          </div>

          {/* Target weight input */}
          <div className="form-group">
            <label>Target Weight (kg)</label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="e.g., 65"
            />
          </div>

          {/* Select months for exercise duration */}
          <div className="form-group">
            <label>Exercise Duration (months)</label>
            <select
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <option key={month} value={month}>
                  {month} month(s)
                </option>
              ))}
            </select>
          </div>

          {/* Select days of the week for exercise */}
          <div className="form-group">
            <label>Select Exercise Days</label>
            <div className="checkbox-group">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="checkbox-item">
                  <label>
                    <input
                      type="checkbox"
                      value={day}
                      checked={selectedDays.includes(day)}
                      onChange={() => handleCheckboxChange(day)}
                    />
                    {day}
                  </label>
                  {/* Time input for each selected day */}
                  {selectedDays.includes(day) && (
                    <div className="time-inputs">
                      <div className="time-input">
                        <label>Start Time</label>
                        <select
                          value={dailyTimes[day].start}
                          onChange={(e) =>
                            handleTimeChange(day, "start", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {Array.from({ length: 24 * 1 }, (_, i) => i * 60).map(
                            (time) => {
                              const hours = Math.floor(time / 60);
                              const minutes = time % 60;
                              const displayTime = `${hours
                                .toString()
                                .padStart(2, "0")}:${minutes
                                .toString()
                                .padStart(2, "0")}`;
                              return (
                                <option key={displayTime} value={displayTime}>
                                  {displayTime}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                      <div className="time-input">
                        <label>End Time</label>
                        <select
                          value={dailyTimes[day].end}
                          onChange={(e) =>
                            handleTimeChange(day, "end", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {Array.from({ length: 24 * 1 }, (_, i) => i * 60).map(
                            (time) => {
                              const hours = Math.floor(time / 60);
                              const minutes = time % 60;
                              const displayTime = `${hours
                                .toString()
                                .padStart(2, "0")}:${minutes
                                .toString()
                                .padStart(2, "0")}`;
                              return (
                                <option key={displayTime} value={displayTime}>
                                  {displayTime}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Button to calculate summary */}
          <button className="submit-button" onClick={handleCalculateSummary}>
            Complete
          </button>
        </div>

        {/* Summary display */}
        {summary && (
          <div className="summary-container">
            <h3>Goal Summary</h3>
            <p>
              <strong>Current Weight:</strong> {summary.currentWeight} kg
            </p>
            <p>
              <strong>Target Weight:</strong> {summary.targetWeight} kg
            </p>
            <p>
              <strong>Duration:</strong> {summary.months} month(s)
            </p>
            <p>
              <strong>Exercise Days:</strong> {summary.selectedDays}
            </p>
            <p>
              <strong>Weekly Calorie Deficit Goal:</strong>{" "}
              {summary.weeklyCalorieDeficit} calories
            </p>
            <p>
              <strong>Exercise Time:</strong>
            </p>
            <ul>
              {selectedDays.map((day) => (
                <li key={day}>
                  {day}: {summary.dailyTimes[day].start} -{" "}
                  {summary.dailyTimes[day].end}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total Exercise Time per Week:</strong>{" "}
              {Math.floor(summary.totalExerciseTime / 60)} hours{" "}
              {summary.totalExerciseTime % 60} minutes
            </p>

            {/* Button to navigate to priority setting page */}
            <button
              onClick={() =>
                navigate("/priority", {
                  state: {
                    currentWeight,
                    targetWeight,
                    months,
                    selectedDays,
                    dailyTimes,
                    weeklyCalorieDeficit: summary.weeklyCalorieDeficit,
                    totalCaloriesToBurn: (currentWeight - targetWeight) * 7700,
                  },
                })
              }
              className="priority-button"
            >
              Check Exercise Priority
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default HomePage;
