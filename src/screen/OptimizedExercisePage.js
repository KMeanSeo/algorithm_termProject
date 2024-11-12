// OptimizedExercisePage.js
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  WeeklyState,
  WeeklyPlan,
  buildWeeklyPlans,
  planNextWeek,
  findDailyExerciseCombination,
} from "../function/exerciseAlgorithm";

// OptimizedExercisePage component for displaying optimized exercise schedule
function OptimizedExercisePage({ currentWeight }) {
  const location = useLocation();
  const {
    allExercises,
    selectedDays,
    dailyTimes,
    targetWeight,
    weeklyCalorieDeficit,
    totalCaloriesToBurn,
  } = location.state || {
    allExercises: [],
    selectedDays: [],
    dailyTimes: {},
    currentWeight: 70,
    targetWeight: 65,
    weeklyCalorieDeficit: 0,
    totalCaloriesToBurn: 0,
  };

  // Converts selectedDays and dailyTimes to schedules with start and end times in hours
  const schedules = selectedDays.map((day) => ({
    day,
    startTime: parseInt(dailyTimes[day].start.split(":")[0], 10),
    endTime: parseInt(dailyTimes[day].end.split(":")[0], 10),
  }));

  // Builds a weekly plan over 4 weeks based on the exercises, schedules, and current weight
  const weeklyPlan =
    buildWeeklyPlans(4, allExercises, schedules, currentWeight) || [];

  // Calculates total calories burned in the first week
  const firstWeekCaloriesBurned =
    weeklyPlan.length > 0
      ? Object.values(weeklyPlan[0].dailyExercises)
          .flat()
          .reduce((weekTotal, exercise) => {
            const exerciseTimeHours = exercise.time / 60.0;
            const caloriesBurnedForExercise =
              exercise.met * currentWeight * exerciseTimeHours;
            return weekTotal + caloriesBurnedForExercise;
          }, 0)
      : 0;

  // Calculates total calories burned over all weeks
  const totalWeeklyCaloriesBurned = weeklyPlan.reduce((total, weekPlan) => {
    const weeklyCalories = Object.values(weekPlan.dailyExercises)
      .flat()
      .reduce((weekTotal, exercise) => {
        const exerciseTimeHours = exercise.time / 60.0;
        const caloriesBurnedForExercise =
          exercise.met * currentWeight * exerciseTimeHours;
        return weekTotal + caloriesBurnedForExercise;
      }, 0);
    return total + weeklyCalories;
  }, 0);

  // Calculate percentages of the goal achieved
  const firstWeekPercentageAchieved =
    (firstWeekCaloriesBurned / totalCaloriesToBurn) * 100;
  const totalPercentageAchieved =
    (totalWeeklyCaloriesBurned / totalCaloriesToBurn) * 100;

  return (
    <div className="App">
      <header className="App-header">
        <h2>Optimized Exercise Schedule</h2>
        {weeklyPlan.length > 0 && (
          <div className="weekly-plan">
            {Object.keys(weeklyPlan[0].dailyExercises).map((day) => {
              const dailyExercises = weeklyPlan[0].dailyExercises[day];

              // Calculate total time for the day's exercises, including rest times
              const totalDailyTime = dailyExercises.reduce(
                (sum, exercise, index) =>
                  sum +
                  exercise.time +
                  (index < dailyExercises.length - 1 ? 2 : 0),
                0
              );

              // Calculate total calories burned for the day
              const totalDailyCalories = dailyExercises.reduce(
                (sum, exercise) => {
                  const exerciseTimeHours = exercise.time / 60.0;
                  return sum + exercise.met * currentWeight * exerciseTimeHours;
                },
                0
              );

              return (
                <div key={day} className="day-schedule">
                  <h3>
                    <span className="day-name">{day}</span> - Total Exercise
                    Time: {Math.floor(totalDailyTime / 60)} hrs{" "}
                    {totalDailyTime % 60} mins (including rest), Calories
                    Burned:{" "}
                    <strong>{totalDailyCalories.toFixed(2)} kcal</strong>
                  </h3>
                  <ul className="exercise-list">
                    {dailyExercises.map((exercise, idx) => {
                      const exerciseTimeHours = exercise.time / 60.0;
                      const caloriesBurnedForExercise =
                        exercise.met * currentWeight * exerciseTimeHours;

                      return (
                        <li key={exercise.name} className="exercise-item">
                          <strong>Order {idx + 1}:</strong> {exercise.name} -{" "}
                          <span className="exercise-calories">
                            Calories Burned:{" "}
                            {caloriesBurnedForExercise.toFixed(2)} kcal
                          </span>
                          <br />
                          <span className="exercise-details">
                            Target Area: {exercise.bodyPart}, MET:{" "}
                            {exercise.met.toFixed(1)}, Duration: {exercise.time}{" "}
                            mins, Fatigue Effectiveness:{" "}
                            {exercise.fatigueEffectiveness.toFixed(1)}
                          </span>
                          {idx < dailyExercises.length - 1 && (
                            <div className="rest-time">
                              Rest Time: <strong>2 mins</strong>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        <div className="summary">
          <h3>Exercise Plan Summary</h3>
          <p>
            Weekly Calorie Deficit Goal:{" "}
            <strong>{firstWeekCaloriesBurned.toFixed(2)} kcal</strong>
          </p>
          <p>
            Total Achievement Rate:{" "}
            <strong>
              {totalPercentageAchieved.toFixed(2)}% (
              {totalWeeklyCaloriesBurned.toFixed(2)}/
              {totalCaloriesToBurn.toFixed(2)}) kcal
            </strong>
          </p>
        </div>
        <Link to="/" className="back-button">
          Go Back
        </Link>
      </header>
    </div>
  );
}

export default OptimizedExercisePage;
