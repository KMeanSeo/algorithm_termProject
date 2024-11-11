// OptimizedExercisePage.js
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  WeeklyState,
  WeeklyPlan,
  buildWeeklyPlans,
  planNextWeek,
  findDailyExerciseCombination,
  calculateWeeklyPenalty,
} from "../function/exerciseAlgorithm";

function OptimizedExercisePage() {
  const location = useLocation();
  const {
    allExercises,
    selectedDays,
    dailyTimes,
    currentWeight,
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

  const schedules = selectedDays.map((day) => ({
    day,
    startTime: parseInt(dailyTimes[day].start.split(":")[0], 10),
    endTime: parseInt(dailyTimes[day].end.split(":")[0], 10),
  }));

  const weeklyPlan =
    buildWeeklyPlans(4, allExercises, schedules, currentWeight) || [];

  // 첫 번째 주의 총 칼로리 소모량 계산
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

  // 전체 주차의 총 칼로리 소모량 계산
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

  // 목표 칼로리 소모량 대비 달성률 계산
  const firstWeekPercentageAchieved =
    (firstWeekCaloriesBurned / totalCaloriesToBurn) * 100;
  const totalPercentageAchieved =
    (totalWeeklyCaloriesBurned / totalCaloriesToBurn) * 100;

  return (
    <div className="App">
      <header className="App-header">
        <h2>최적화된 운동 시간표</h2>
        {weeklyPlan.length > 0 && (
          <div>
            {Object.keys(weeklyPlan[0].dailyExercises).map((day) => {
              // 요일별 총 운동 시간과 칼로리 소모량 계산
              const dailyExercises = weeklyPlan[0].dailyExercises[day];
              let totalDailyTime = dailyExercises.reduce(
                (sum, exercise) => sum + exercise.time,
                0
              );

              // 휴식 시간 추가 (각 운동 사이에 3분)
              const totalRestTime = (dailyExercises.length - 1) * 3;
              totalDailyTime += totalRestTime; // 총 운동 시간에 휴식 시간 포함

              const totalDailyCalories = dailyExercises.reduce(
                (sum, exercise) => {
                  const exerciseTimeHours = exercise.time / 60.0;
                  return sum + exercise.met * currentWeight * exerciseTimeHours;
                },
                0
              );

              return (
                <div key={day}>
                  <h3>
                    {day} - 총 운동 시간: {Math.floor(totalDailyTime / 60)}시간{" "}
                    {totalDailyTime % 60}분 (휴식 포함), 칼로리 소모량:{" "}
                    {totalDailyCalories.toFixed(2)} kcal
                  </h3>
                  <ul className="exercise-list">
                    {dailyExercises.map((exercise, idx) => (
                      <li key={exercise.name} className="exercise-item">
                        <strong>순서 {idx + 1}:</strong> {exercise.name}
                        <br />
                        <span className="exercise-details">
                          부위: {exercise.bodyPart}, MET:{" "}
                          {exercise.met.toFixed(1)}, 시간: {exercise.time}분,
                          피로도 효과:{" "}
                          {exercise.fatigueEffectiveness.toFixed(1)}
                        </span>
                        {idx < dailyExercises.length - 1 && (
                          <div className="rest-time">쉬는 시간: 3분</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        <div className="summary">
          <h3>운동 계획 요약</h3>
          <p>총 주차: {weeklyPlan.length}주</p>
          <p>
            주당 칼로리 소모 목표: {firstWeekCaloriesBurned.toFixed(2)} kcal
          </p>
          <p>
            총 소모한 전체 칼로리: {totalWeeklyCaloriesBurned.toFixed(2)} kcal
          </p>
          <p>목표 칼로리 소모량: {totalCaloriesToBurn.toFixed(2)} kcal</p>
          <p>주당 달성률: {firstWeekPercentageAchieved.toFixed(2)}%</p>
          <p>전체 달성률: {totalPercentageAchieved.toFixed(2)}%</p>
        </div>
        <Link to="/" className="back-button">
          돌아가기
        </Link>
      </header>
    </div>
  );
}

export default OptimizedExercisePage;
