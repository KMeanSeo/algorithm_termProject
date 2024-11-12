// exerciseUtils.js
import Papa from "papaparse";

// Class represent Exercise various properties
class Exercise {
  constructor(name, met, bodyPart, strength, time) {
    this.name = name; // Name exercise
    this.met = met; // Metabolic Equivalent of Task (MET) value
    this.bodyPart = bodyPart; // Targeted body part
    this.strength = strength; // Strength level ('Low', 'Medium', 'High')
    this.time = time; // Duration of the exercise in minutes
    this.fatigueEffectiveness = this.calculateFatigueEffectiveness(
      strength,
      met
    ); // Calculated fatigue effectiveness based on strength and MET
  }

  // Calculates fatigue effectiveness of exercise
  calculateFatigueEffectiveness(strength, met) {
    // Lookup table to map strength levels to numerical weights
    const strengthWeight =
      { Low: 1.0, Medium: 1.5, High: 2.0 }[strength] || 1.0;
    // Returns product of strength weight and MET value
    return strengthWeight * met;
  }

  // Return a string representation of Exercise object
  toString() {
    return `${this.name} (Body: ${this.bodyPart}, Strength: ${this.strength}, MET: ${this.met}, Time: ${this.time}, Fatigue-Effectiveness: ${this.fatigueEffectiveness})`;
  }
}

// Load exercises from CSV data
function loadExercises(csvData) {
  let exercises = [];
  // Parse the CSV data using Papa.parse library
  const parsedData = Papa.parse(csvData, { header: true });

  // Iterate over each row of parsed data
  parsedData.data.forEach((row) => {
    // Check all required fields are present
    if (row["Work Name"] && row.MET && row.Body && row.Strength && row.time) {
      // Create new Exercise object and add it to exercises array
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

  return exercises;
}

// Groups exercises by body part and sorts them
function groupExercisesByBodyPart(exercises) {
  const grouped = {};
  // Iterate over each exercise
  exercises.forEach((exercise) => {
    // Initialize an array for the body part if it doesn't exist
    if (!grouped[exercise.bodyPart]) {
      grouped[exercise.bodyPart] = [];
    }
    // Add the exercise to the corresponding body part group
    grouped[exercise.bodyPart].push(exercise);
  });

  // For each body part, sort exercises by fatigue effectiveness
  for (const bodyPart in grouped) {
    grouped[bodyPart].sort(
      (a, b) => b.fatigueEffectiveness - a.fatigueEffectiveness
    );
    console.log(`Sorted exercises for ${bodyPart}:`, grouped[bodyPart]);
  }

  return grouped;
}

// Asynchronously loads exercises from a file
async function loadExercisesFromFile(filePath) {
  const response = await fetch(filePath); // Fetch file content
  const csvData = await response.text(); // Get text content
  return loadExercises(csvData); // Load exercises from the CSV data
}

// Asynchronously loads and groups exercises by body part from a file
async function groupExercisesByBodyPartFromFile(filePath) {
  const exercises = await loadExercisesFromFile(filePath); // Load exercises
  return groupExercisesByBodyPart(exercises); // Group exercises by body part
}

// Export functions and classes for external use
export {
  Exercise,
  loadExercises,
  groupExercisesByBodyPart,
  loadExercisesFromFile,
  groupExercisesByBodyPartFromFile,
};
