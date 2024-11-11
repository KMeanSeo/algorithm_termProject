// exerciseAlgorithm.js
class WeeklyState {
  constructor(weekNumber, cumulativeCost, weeklyPlans, usedExercises) {
    this.weekNumber = weekNumber;
    this.cumulativeCost = cumulativeCost;
    this.weeklyPlans = weeklyPlans;
    this.usedExercises = usedExercises;
  }

  compareTo(other) {
    return this.cumulativeCost - other.cumulativeCost;
  }
}

class WeeklyPlan {
  constructor(weekNumber, dailyExercises) {
    this.weekNumber = weekNumber;
    this.dailyExercises = dailyExercises;
  }
}

function buildWeeklyPlans(totalWeeks, allExercises, schedules, currentWeight) {
  const queue = [];
  const visitedWeeks = {};

  const startState = new WeeklyState(0, 0.0, [], new Set());
  queue.push(startState);

  while (queue.length > 0) {
    const currentState = queue.shift();

    if (currentState.weekNumber === totalWeeks) {
      return currentState.weeklyPlans;
    }

    if (
      visitedWeeks[currentState.weekNumber] &&
      visitedWeeks[currentState.weekNumber] <= currentState.cumulativeCost
    ) {
      continue;
    }
    visitedWeeks[currentState.weekNumber] = currentState.cumulativeCost;

    const nextState = planNextWeek(
      currentState,
      allExercises,
      schedules,
      currentWeight,
      totalWeeks
    );

    queue.push(nextState);
  }

  return [];
}

function planNextWeek(
  currentState,
  allExercises,
  schedules,
  currentWeight,
  totalWeeks
) {
  const nextWeekNumber = currentState.weekNumber + 1;
  const newWeeklyPlans = [...currentState.weeklyPlans];

  const usedExercisesThisWeek = new Set();
  const usedBodyPartsThisWeek = new Map();

  const dailyExercises = {};

  schedules.forEach((schedule) => {
    const day = schedule.day;
    const availableTime = (schedule.endTime - schedule.startTime) * 60;

    let availableExercises = [...allExercises];

    const dailyExercisePlan = findDailyExerciseCombination(
      availableExercises,
      availableTime,
      currentWeight,
      usedExercisesThisWeek,
      usedBodyPartsThisWeek
    );

    dailyExercises[day] = dailyExercisePlan;

    dailyExercisePlan.forEach((exercise) => {
      usedExercisesThisWeek.add(exercise.name);
      usedBodyPartsThisWeek.set(
        exercise.bodyPart,
        (usedBodyPartsThisWeek.get(exercise.bodyPart) || 0) + 1
      );
    });
  });

  newWeeklyPlans.push(new WeeklyPlan(nextWeekNumber, dailyExercises));

  const newUsedExercises = new Set(currentState.usedExercises);
  usedExercisesThisWeek.forEach((exercise) => newUsedExercises.add(exercise));

  const newCumulativeCost =
    currentState.cumulativeCost +
    calculateWeeklyPenalty(usedExercisesThisWeek, usedBodyPartsThisWeek);

  return new WeeklyState(
    nextWeekNumber,
    newCumulativeCost,
    newWeeklyPlans,
    newUsedExercises
  );
}

function findDailyExerciseCombination(
  exercises,
  availableTime,
  currentWeight,
  usedExercisesThisWeek,
  usedBodyPartsThisWeek
) {
  const n = exercises.length;

  const dpCalories = Array(availableTime + 1).fill(0);
  const dpExercises = Array.from({ length: availableTime + 1 }, () => []);
  const dpLastBodyPart = Array(availableTime + 1).fill(null);

  for (let i = 0; i < n; i++) {
    const exercise = exercises[i];
    const exerciseTime = exercise.time + 3; // 휴식 시간 포함

    for (let t = availableTime; t >= exerciseTime; t--) {
      const exerciseTimeHours = exercise.time / 60.0;
      const caloriesBurnedForExercise =
        exercise.met * currentWeight * exerciseTimeHours;

      let penalty = 0.0;

      // 중복된 운동을 피하기 위한 패널티
      if (usedExercisesThisWeek.has(exercise.name)) penalty -= 1000.0;

      // 이전에 같은 운동 부위를 했을 때 패널티를 강화하여 연속적 선택 피하기
      if (dpLastBodyPart[t - exerciseTime] === exercise.bodyPart)
        penalty -= 500.0;

      // 주중에 사용된 운동 부위가 있는 경우 약간의 패널티 적용 (가급적 다양한 부위 운동을 위해)
      if (usedBodyPartsThisWeek.has(exercise.bodyPart)) penalty -= 100.0;

      const newCalories =
        dpCalories[t - exerciseTime] + caloriesBurnedForExercise + penalty;

      // 최적의 칼로리 소모와 패널티를 고려한 운동 선택
      if (newCalories > dpCalories[t]) {
        dpCalories[t] = newCalories;
        dpExercises[t] = [...dpExercises[t - exerciseTime], i];
        dpLastBodyPart[t] = exercise.bodyPart;
      }
    }
  }

  const maxCalories = Math.max(...dpCalories);
  const maxTime = dpCalories.indexOf(maxCalories);

  // 최적 운동 조합 반환
  return dpExercises[maxTime].map((idx) => exercises[idx]);
}

function calculateWeeklyPenalty(usedExercisesThisWeek, usedBodyPartsThisWeek) {
  let penalty = 0.0;
  if (usedBodyPartsThisWeek.size < 3) {
    penalty += 50.0;
  }
  return penalty;
}

export {
  WeeklyState,
  WeeklyPlan,
  buildWeeklyPlans,
  planNextWeek,
  findDailyExerciseCombination,
  calculateWeeklyPenalty,
};
