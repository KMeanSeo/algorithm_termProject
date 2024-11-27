# README

This document provides a summary of the key algorithms used in the provided JavaScript code for managing exercise data and generating weekly exercise plans.

## How to use open sources
Can check on the following website.
[Website Link](https://kmeanseo.github.io/algorithm_termProject/)



## Key Algorithms

### 1. Lookup Table

**Used In**: `calculateFatigueEffectiveness`

- **Purpose**: Maps strength levels to numerical weights.
- **Process**: Uses a predefined object to map string values to numerical weights.
- **Example**:
  ```javascript
  const strengthWeight = { Low: 1.0, Medium: 1.5, High: 2.0 }[strength] || 1.0;
  ```

### 2. CSV Parsing

**Used In**: `loadExercises`

- **Purpose**: Parses CSV data to create an array of `Exercise` objects.
- **Process**: Utilizes the `Papa.parse` library to parse CSV data and create objects.
- **Example**:
  ```javascript
  const parsedData = Papa.parse(csvData, { header: true });
  parsedData.data.forEach((row) => {
    if (row["Work Name"] && row.MET && row.Body && row.Strength && row.time) {
      exercises.push(
        new Exercise(
          row["Work Name"],
          parseFloat(row.MET),
          row.Body,
          row.Strength,
          parseInt(row.time, 10)
        )
      );
    }
  });
  ```

### 3. Grouping and Sorting

**Used In**: `groupExercisesByBodyPart`

- **Purpose**: Groups exercises by body part and sorts them based on fatigue effectiveness.
- **Process**: Groups exercises into an object and sorts each group by fatigue effectiveness in descending order.
- **Example**:
  ```javascript
  const grouped = {};
  exercises.forEach((exercise) => {
    if (!grouped[exercise.bodyPart]) {
      grouped[exercise.bodyPart] = [];
    }
    grouped[exercise.bodyPart].push(exercise);
  });
  for (const bodyPart in grouped) {
    grouped[bodyPart].sort(
      (a, b) => b.fatigueEffectiveness - a.fatigueEffectiveness
    );
  }
  ```

### 4. Asynchronous Processing

**Used In**: `loadExercisesFromFile`, `groupExercisesByBodyPartFromFile`

- **Purpose**: Loads exercises from external files without blocking execution.
- **Process**: Uses `fetch` to retrieve file content asynchronously and processes the data.
- **Example**:
  ```javascript
  async function loadExercisesFromFile(filePath) {
    const response = await fetch(filePath);
    const csvData = await response.text();
    return loadExercises(csvData);
  }
  ```

### 5. Greedy Algorithm

**Used In**: `findDailyExerciseCombination`

- **Purpose**: Selects the most efficient exercises first to maximize effectiveness.
- **Process**: Sorts exercises by MET value in descending order and selects exercises that fit within the available time.
- **Example**:
  ```javascript
  exercises.sort((a, b) => b.met - a.met);
  for (const exercise of exercises) {
    if (
      !usedExercisesThisWeek.has(exercise.name) &&
      exercise.bodyPart !== lastBodyPart &&
      totalTimeUsed + exercise.time + restTimeBetweenExercises <= availableTime
    ) {
      selectedExercises.push(exercise);
      totalTimeUsed += exercise.time + restTimeBetweenExercises;
      usedExercisesThisWeek.add(exercise.name);
      lastBodyPart = exercise.bodyPart;
    }
  }
  ```

### 6. Approximate Solution for NP-hard Problem

**Used In**: `fillRemainingTime`

- **Purpose**: Fills remaining time with additional exercises using an approximate method.
- **Process**: Adds exercises without exhaustive computation to fit within the remaining time, ensuring balanced body part usage.
- **Example**:
  ```javascript
  while (totalTimeUsed < availableTime) {
    const currentTime = performance.now();
    if (currentTime - startTime > 500) {
      break;
    }
    for (const exercise of allExercises) {
      if (
        !usedExercisesThisWeek.has(exercise.name) &&
        exercise.bodyPart !== lastBodyPart &&
        totalTimeUsed + exercise.time + restTimeBetweenExercises <= availableTime
      ) {
        selectedExercises.push(exercise);
        totalTimeUsed += exercise.time + restTimeBetweenExercises;
        usedExercisesThisWeek.add(exercise.name);
        lastBodyPart = exercise.bodyPart;
      }
    }
  }
  ```

### 7. Local Optimization

**Used In**: `balanceBodyParts`

- **Purpose**: Balances the usage of body parts in selected exercises.
- **Process**: Adjusts the exercise sequence to prevent overworking any body part.
- **Example**:
  ```javascript
  for (let i = 1; i < selectedExercises.length; i++) {
    const prevExercise = selectedExercises[i - 1];
    const currentExercise = selectedExercises[i];
    if (prevExercise.bodyPart === currentExercise.bodyPart) {
      for (const exercise of selectedExercises) {
        if (
          exercise.bodyPart !== currentExercise.bodyPart &&
          bodyPartUsage[exercise.bodyPart] < 2 &&
          !selectedExercises.includes(exercise)
        ) {
          selectedExercises[i] = exercise;
          bodyPartUsage[currentExercise.bodyPart]--;
          bodyPartUsage[exercise.bodyPart] =
            (bodyPartUsage[exercise.bodyPart] || 0) + 1;
          break;
        }
      }
    }
  }
  ```

## Summary of Functions and Classes

### `Exercise` Class

- **Purpose**: Represents an exercise with various properties.
- **Key Method**: `calculateFatigueEffectiveness` - Uses a lookup table to calculate fatigue effectiveness.

### `loadExercises(csvData)` Function

- **Purpose**: Loads exercises from CSV data.
- **Key Algorithm**: CSV Parsing.

### `groupExercisesByBodyPart(exercises)` Function

- **Purpose**: Groups exercises by body part and sorts them.
- **Key Algorithm**: Grouping and Sorting.

### `loadExercisesFromFile(filePath)` Function

- **Purpose**: Asynchronously loads exercises from a file.
- **Key Algorithm**: Asynchronous Processing.

### `groupExercisesByBodyPartFromFile(filePath)` Function

- **Purpose**: Asynchronously loads and groups exercises by body part.
- **Key Algorithm**: Asynchronous Processing.

### `buildWeeklyPlans(totalWeeks, allExercises, schedules, currentWeight)` Function

- **Purpose**: Builds weekly plans for a specified number of weeks.
- **Key Algorithm**: Iterative Plan Generation.

### `planNextWeek(weekNumber, allExercises, schedules, currentWeight)` Function

- **Purpose**: Plans exercises for the next week.
- **Key Algorithm**: Daily Exercise Planning.

### `findDailyExerciseCombination(exercises, availableTime, currentWeight, usedExercisesThisWeek)` Function

- **Purpose**: Finds a combination of exercises for a day.
- **Key Algorithm**: Greedy Algorithm.

### `fillRemainingTime(selectedExercises, allExercises, availableTime, usedExercisesThisWeek)` Function

- **Purpose**: Fills remaining time with additional exercises.
- **Key Algorithm**: Approximate Solution for NP-hard Problem.

### `balanceBodyParts(selectedExercises, bodyPartUsage)` Function

- **Purpose**: Balances the usage of body parts in selected exercises.
- **Key Algorithm**: Local Optimization.

## Conclusion

This code efficiently manages and organizes exercise data by leveraging various algorithmic techniques. The key algorithms used include lookup tables, greedy algorithms, approximate solutions for NP-hard problems, and local optimization. These algorithms enable the application to provide quick access to organized and sorted exercise data and generate balanced and efficient weekly exercise plans.
