// HomePage.js
import React from "react";

import { useNavigate } from "react-router-dom";

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

  const handleCalculateSummary = () => {
    calculateSummary(navigate);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>운동 목표 설정</h2>
        <div className="form-container">
          <div className="form-group">
            <label>현재 체중 (kg)</label>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="예: 70"
            />
          </div>
          <div className="form-group">
            <label>목표 체중 (kg)</label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="예: 65"
            />
          </div>
          <div className="form-group">
            <label>운동 개월 수</label>
            <select
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <option key={month} value={month}>
                  {month}개월
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>운동 요일 선택</label>
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
                  {selectedDays.includes(day) && (
                    <div className="time-inputs">
                      <div className="time-input">
                        <label>시작 시간</label>
                        <select
                          value={dailyTimes[day].start}
                          onChange={(e) =>
                            handleTimeChange(day, "start", e.target.value)
                          }
                        >
                          <option value="">선택</option>
                          {Array.from({ length: 24 * 2 }, (_, i) => i * 30).map(
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
                        <label>종료 시간</label>
                        <select
                          value={dailyTimes[day].end}
                          onChange={(e) =>
                            handleTimeChange(day, "end", e.target.value)
                          }
                        >
                          <option value="">선택</option>
                          {Array.from({ length: 24 * 2 }, (_, i) => i * 30).map(
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
          <button className="submit-button" onClick={handleCalculateSummary}>
            작성 완료
          </button>
        </div>

        {summary && (
          <div className="summary-container">
            <h3>목표 요약</h3>
            <p>
              <strong>현재 체중:</strong> {summary.currentWeight} kg
            </p>
            <p>
              <strong>목표 체중:</strong> {summary.targetWeight} kg
            </p>
            <p>
              <strong>운동 개월:</strong> {summary.months}개월
            </p>
            <p>
              <strong>운동 요일:</strong> {summary.selectedDays}
            </p>
            <p>
              <strong>주당 칼로리 소모 목표:</strong>{" "}
              {summary.weeklyCalorieDeficit} 칼로리
            </p>
            <p>
              <strong>운동 시간:</strong>
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
              <strong>1주일에 총 운동 시간:</strong>{" "}
              {Math.floor(summary.totalExerciseTime / 60)}시간{" "}
              {summary.totalExerciseTime % 60}분
            </p>
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
                    totalCaloriesToBurn: summary.totalExerciseTime * 7700,
                  },
                })
              }
              className="priority-button"
            >
              운동 우선순위 확인하기
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default HomePage;
