// Class represent state of a week, include cumulative cost and used exercises
export class WeeklyState {
  constructor(weekNumber, cumulativeCost, weeklyPlans, usedExercises) {
    this.weekNumber = weekNumber;
    this.cumulativeCost = cumulativeCost;
    this.weeklyPlans = weeklyPlans;
    this.usedExercises = usedExercises;
  }
}

// Class represnet the plan for single week, include daily exercises
export class WeeklyPlan {
  constructor(weekNumber, dailyExercises) {
    this.weekNumber = weekNumber;
    this.dailyExercises = dailyExercises;
  }
}

// Builds weekly plan for total number of weeks
export function buildWeeklyPlans(
  totalWeeks,
  allExercises,
  schedules,
  currentWeight
) {
  const weeklyPlans = [];

  // Loop over each week and generate plan
  for (let week = 0; week < totalWeeks; week++) {
    const weeklyPlan = planNextWeek(
      week,
      allExercises,
      schedules,
      currentWeight
    );
    weeklyPlans.push(weeklyPlan);
  }

  return weeklyPlans;
}

// Plans exercises for next week
export function planNextWeek(
  weekNumber,
  allExercises,
  schedules,
  currentWeight
) {
  // Set keep track of exercises used this week to avoid repeat
  const usedExercisesThisWeek = new Set();
  const dailyExercises = {};

  // Iterate over each day schedule
  schedules.forEach((schedule) => {
    const day = schedule.day;
    const availableTime = (schedule.endTime - schedule.startTime) * 60; // Convert hours to minutes

    // Find initial daily exercise combination using greedy approach
    let dailyExercisePlan = findDailyExerciseCombination(
      allExercises,
      availableTime,
      currentWeight,
      usedExercisesThisWeek
    );

    // Fill any remaining time with additional exercises
    dailyExercisePlan = fillRemainingTime(
      dailyExercisePlan,
      allExercises,
      availableTime,
      usedExercisesThisWeek
    );

    // Assign daily exercise plan to respective day
    dailyExercises[day] = dailyExercisePlan;

    // Add exercises used today to set used exercises for week
    dailyExercisePlan.forEach((exercise) => {
      usedExercisesThisWeek.add(exercise.name);
    });
  });

  return new WeeklyPlan(weekNumber, dailyExercises);
}

// Find combination of exercises for a day within available time, use greedy algorithm to select most efficient exercises first
export function findDailyExerciseCombination(
  exercises,
  availableTime,
  currentWeight,
  usedExercisesThisWeek
) {
  const restTimeBetweenExercises = 2; // Rest time between exercises
  let selectedExercises = [];
  let totalTimeUsed = 0;
  let lastBodyPart = null; // Avoid consecutive exercises of same body part
  const bodyPartUsage = {}; // Track how many times each body part used

  // Greedy step: Sort exercises by MET value (metabolic equivalent) in descending order
  // Prioritize exercises that burn more calories or are more intense
  exercises.sort((a, b) => b.met - a.met);

  // Iterate over sorted exercises to select ones that fit within time and constraints
  for (const exercise of exercises) {
    // Skip exercises that have been used this week or target same body part as last exercise
    if (
      usedExercisesThisWeek.has(exercise.name) ||
      exercise.bodyPart === lastBodyPart
    ) {
      continue;
    }

    const exerciseTimeWithRest = exercise.time + restTimeBetweenExercises;
    // Check adding exercise would exceed the available time
    if (totalTimeUsed + exerciseTimeWithRest <= availableTime) {
      // Select exercise
      selectedExercises.push(exercise);
      totalTimeUsed += exerciseTimeWithRest;
      usedExercisesThisWeek.add(exercise.name);
      lastBodyPart = exercise.bodyPart;

      // Update usage count for body part
      if (!bodyPartUsage[exercise.bodyPart]) {
        bodyPartUsage[exercise.bodyPart] = 0;
      }
      bodyPartUsage[exercise.bodyPart]++;
    }

    // Exit loop
    if (totalTimeUsed >= availableTime) {
      break;
    }
  }

  // Balance exercises to avoid overworking same body parts
  selectedExercises = balanceBodyParts(selectedExercises, bodyPartUsage);

  return selectedExercises;
}

// Attempt to fill any remaining time with additional exercises
// Due to NP-hard nature of problem, use approximate approach
function fillRemainingTime(
  selectedExercises,
  allExercises,
  availableTime,
  usedExercisesThisWeek
) {
  const restTimeBetweenExercises = 2;
  // Calculate total time already used by selected exercises
  let totalTimeUsed = selectedExercises.reduce(
    (acc, exercise) => acc + exercise.time + restTimeBetweenExercises,
    0
  );

  const startTime = performance.now(); // Record start time to limit execution time
  let lastBodyPart =
    selectedExercises.length > 0
      ? selectedExercises[selectedExercises.length - 1].bodyPart
      : null;
  // Initialize body part usage counts based on the selected exercises
  const bodyPartUsage = selectedExercises.reduce((acc, exercise) => {
    acc[exercise.bodyPart] = (acc[exercise.bodyPart] || 0) + 1;
    return acc;
  }, {});

  // Attempt to fill remaining time with additional exercises
  // use time limit to prevent infinite loops due to computational complexity
  while (totalTimeUsed < availableTime) {
    const currentTime = performance.now();
    // If loop is taking too long (over 500ms), break out avoid performance issues
    if (currentTime - startTime > 500) {
      console.warn("Operation taking too long, breaking loop to prevent hang.");
      break;
    }

    // Iterate over all exercise find one that fits
    for (const exercise of allExercises) {
      // Skip exercises already selected
      if (
        usedExercisesThisWeek.has(exercise.name) ||
        exercise.bodyPart === lastBodyPart
      ) {
        continue;
      }

      const exerciseTimeWithRest = exercise.time + restTimeBetweenExercises;

      // Check adding exercise stays within the available time
      if (totalTimeUsed + exerciseTimeWithRest <= availableTime) {
        // Select exercise
        selectedExercises.push(exercise);
        totalTimeUsed += exerciseTimeWithRest;
        usedExercisesThisWeek.add(exercise.name);
        lastBodyPart = exercise.bodyPart;

        // Update usage count for body part
        if (!bodyPartUsage[exercise.bodyPart]) {
          bodyPartUsage[exercise.bodyPart] = 0;
        }
        bodyPartUsage[exercise.bodyPart]++;
      }

      // Exit loop
      if (totalTimeUsed >= availableTime) {
        break;
      }
    }
  }

  // Balance exercise to even distribution across body parts
  return balanceBodyParts(selectedExercises, bodyPartUsage);
}

// Adjust selected exercises balance the usage of body parts
// Local optimization to avoid overworking any body part
function balanceBodyParts(selectedExercises, bodyPartUsage) {
  // Iterate over selected exercise starting from second one
  for (let i = 1; i < selectedExercises.length; i++) {
    const prevExercise = selectedExercises[i - 1];
    const currentExercise = selectedExercises[i];

    // If two consecutive exercises target same body part
    if (prevExercise.bodyPart === currentExercise.bodyPart) {
      // Try find replacement exercise that is not already selected
      for (const exercise of selectedExercises) {
        if (
          exercise.bodyPart !== currentExercise.bodyPart &&
          bodyPartUsage[exercise.bodyPart] < 2 && // Limit to 2 exercises per body part
          !selectedExercises.includes(exercise) // Ensure exercise is not already selected
        ) {
          // Replace current exercise with the new one
          selectedExercises[i] = exercise;
          // Update body part usage counts
          bodyPartUsage[currentExercise.bodyPart]--;
          bodyPartUsage[exercise.bodyPart] =
            (bodyPartUsage[exercise.bodyPart] || 0) + 1;
          break;
        }
      }
    }
  }
  return selectedExercises;
}
