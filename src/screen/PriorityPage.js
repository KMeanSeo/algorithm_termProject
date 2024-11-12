// PriorityPage.js
import React, { useState, useEffect } from "react";
import "./PriorityPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loadExercisesFromFile,
  groupExercisesByBodyPartFromFile,
} from "../function/exerciseUtils";

// PriorityPage component for selecting exercises by body part and generating optimized exercises
function PriorityPage({ csvFilePath }) {
  const [exercisesByBodyPart, setExercisesByBodyPart] = useState({});
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [sortedExercises, setSortedExercises] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentWeight,
    targetWeight,
    selectedDays,
    dailyTimes,
    weeklyCalorieDeficit,
    totalCaloriesToBurn,
  } = location.state || {};

  // Load and group exercises by body part from the CSV file on component mount
  useEffect(() => {
    groupExercisesByBodyPartFromFile(csvFilePath).then((groupedExercises) => {
      setExercisesByBodyPart(groupedExercises);
    });
  }, [csvFilePath]);

  // Update sorted exercises when selected body part or exercise list changes
  useEffect(() => {
    if (selectedBodyPart) {
      const exercises = exercisesByBodyPart[selectedBodyPart] || [];
      setSortedExercises(exercises);
    }
  }, [selectedBodyPart, exercisesByBodyPart]);

  // Handle body part selection change
  const handleBodyPartChange = (event) => {
    setSelectedBodyPart(event.target.value);
  };

  // Navigate to optimized exercises page with necessary data
  const handleGenerateOptimizedExercises = () => {
    navigate("/optimized-exercises", {
      state: {
        allExercises: Object.values(exercisesByBodyPart).flat(),
        currentWeight,
        targetWeight,
        selectedDays,
        dailyTimes,
        weeklyCalorieDeficit,
        totalCaloriesToBurn,
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Top Weighted Exercises by Body Part</h2>
        <div className="form-group">
          <label htmlFor="bodyPartSelect">Select Body Part:</label>
          <select
            id="bodyPartSelect"
            value={selectedBodyPart}
            onChange={handleBodyPartChange}
          >
            <option value="">Select a body part</option>
            {Object.keys(exercisesByBodyPart).map((bodyPart) => (
              <option key={bodyPart} value={bodyPart}>
                {bodyPart}
              </option>
            ))}
          </select>
        </div>

        {/* Display sorted exercises for the selected body part */}
        {selectedBodyPart && sortedExercises.length > 0 && (
          <div>
            <h3>{selectedBodyPart}</h3>
            <ul className="exercise-list">
              {sortedExercises.map((exercise, index) => (
                <li key={exercise.name} className="exercise-item">
                  <strong>Rank {index + 1}:</strong> {exercise.name} -<br />
                  <span className="exercise-details">
                    MET: {exercise.met.toFixed(1)}, Duration: {exercise.time}{" "}
                    mins, Fatigue Effectiveness:{" "}
                    {exercise.fatigueEffectiveness.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Button to generate optimized exercises */}
        <button onClick={handleGenerateOptimizedExercises}>
          Generate Optimized Exercises
        </button>
      </header>
    </div>
  );
}

export default PriorityPage;
