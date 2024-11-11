// PriorityPage.js
import React, { useState, useEffect } from "react";
import "./PriorityPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loadExercisesFromFile,
  groupExercisesByBodyPartFromFile,
} from "../function/exerciseUtils";

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

  useEffect(() => {
    groupExercisesByBodyPartFromFile(csvFilePath).then((groupedExercises) => {
      setExercisesByBodyPart(groupedExercises);
    });
  }, [csvFilePath]);

  useEffect(() => {
    if (selectedBodyPart) {
      const exercises = exercisesByBodyPart[selectedBodyPart] || [];
      setSortedExercises(exercises);
    }
  }, [selectedBodyPart, exercisesByBodyPart]);

  const handleBodyPartChange = (event) => {
    setSelectedBodyPart(event.target.value);
  };

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
        <h2>부위별 최고 가중치 운동</h2>
        <div className="form-group">
          <label htmlFor="bodyPartSelect">운동 부위 선택:</label>
          <select
            id="bodyPartSelect"
            value={selectedBodyPart}
            onChange={handleBodyPartChange}
          >
            <option value="">부위를 선택하세요</option>
            {Object.keys(exercisesByBodyPart).map((bodyPart) => (
              <option key={bodyPart} value={bodyPart}>
                {bodyPart}
              </option>
            ))}
          </select>
        </div>
        {selectedBodyPart && sortedExercises.length > 0 && (
          <div>
            <h3>{selectedBodyPart}</h3>
            <ul className="exercise-list">
              {sortedExercises.map((exercise, index) => (
                <li key={exercise.name} className="exercise-item">
                  <strong>순위 {index + 1}:</strong> {exercise.name} -<br />
                  <span className="exercise-details">
                    MET: {exercise.met.toFixed(1)}, 시간: {exercise.time}분,
                    피로도 효과: {exercise.fatigueEffectiveness.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={handleGenerateOptimizedExercises}>
          최적화된 운동 생성
        </button>
      </header>
    </div>
  );
}

export default PriorityPage;
