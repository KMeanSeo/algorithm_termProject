# Summary of Key Algorithms

This document provides a concise summary of the key algorithms used in the provided JavaScript code for managing exercise data and generating weekly exercise plans.

## 1. `Exercise` Class

### Key Algorithm: `calculateFatigueEffectiveness`

- **Purpose**: Calculates fatigue effectiveness based on strength and MET values.
- **Process**:
  - Uses a lookup table to map strength levels to numerical weights.
  - Multiplies the strength weight by the MET value.
- **Output**: Returns the calculated fatigue effectiveness as a numerical value.

## 2. `loadExercises(csvData)` Function

### Key Algorithm: CSV Parsing

- **Purpose**: Loads exercises from CSV data and creates an array of `Exercise` objects.
- **Process**:
  - Parses CSV data using the `Papa.parse` library.
  - Iterates over each row to create `Exercise` objects if required fields are present.
- **Output**: Returns an array of `Exercise` objects.

## 3. `groupExercisesByBodyPart(exercises)` Function

### Key Algorithm: Grouping and Sorting

- **Purpose**: Groups exercises by body part and sorts them based on fatigue effectiveness.
- **Process**:
  - Groups exercises by body part.
  - Sorts each group by fatigue effectiveness in descending order.
- **Output**: Returns an object with body parts as keys and sorted exercise arrays as values.

## 4. `buildWeeklyPlans(totalWeeks, allExercises, schedules, currentWeight)` Function

### Key Algorithm: Weekly Plan Generation

- **Purpose**: Builds weekly plans for a specified number of weeks.
- **Process**:
  - Iterates over each week and calls `planNextWeek` to generate the plan.
- **Output**: Returns an array of `WeeklyPlan` instances for each week.

## 5. `planNextWeek(weekNumber, allExercises, schedules, currentWeight)` Function

### Key Algorithm: Daily Exercise Planning

- **Purpose**: Plans exercises for the next week.
- **Process**:
  - Tracks used exercises to avoid repetition.
  - Calls `findDailyExerciseCombination` and `fillRemainingTime` to select and utilize exercises.
- **Output**: Returns a `WeeklyPlan` instance with planned exercises.

## 6. `findDailyExerciseCombination(exercises, availableTime, currentWeight, usedExercisesThisWeek)` Function

### Key Algorithm: Greedy Selection

- **Purpose**: Finds a combination of exercises for a day within available time.
- **Process**:
  - Sorts exercises by MET value in descending order.
  - Selects exercises that fit within the available time and avoids repetition.
- **Output**: Returns an array of selected exercises.

## 7. `fillRemainingTime(selectedExercises, allExercises, availableTime, usedExercisesThisWeek)` Function

### Key Algorithm: Approximate Solution for NP-hard Problem

- **Purpose**: Fills remaining time with additional exercises.
- **Process**:
  - Uses an approximate method to add exercises without exhaustive computation.
  - Ensures balanced body part usage.
- **Output**: Returns an updated array of selected exercises.

## 8. `balanceBodyParts(selectedExercises, bodyPartUsage)` Function

### Key Algorithm: Local Optimization

- **Purpose**: Balances the usage of body parts in selected exercises.
- **Process**:
  - Adjusts the exercise sequence to prevent overworking any body part.
- **Output**: Returns an adjusted array of exercises with balanced body part usage.

## Key Concepts

- **Lookup Table**: Used for mapping strength levels to numerical weights.
- **Greedy Algorithm**: Prioritizes exercises with the highest MET values.
- **Approximate Solutions**: Provides practical solutions to NP-hard problems.
- **Local Optimization**: Ensures balanced exercise distribution across body parts.
- **Time Constraints**: Limits execution time to prevent performance issues.

## Considerations

- Avoids repetition of exercises within the same week.
- Balances workload across different body parts.
- Manages total exercise time to fit within available daily schedules.
- Adds fixed rest times between exercises.
- Ensures efficient execution by avoiding long-running loops.
