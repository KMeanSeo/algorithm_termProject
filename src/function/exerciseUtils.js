// exerciseUtils.js
import Papa from "papaparse";

class Exercise {
  constructor(name, met, bodyPart, strength, time) {
    this.name = name;
    this.met = met;
    this.bodyPart = bodyPart;
    this.strength = strength;
    this.time = time;
    this.fatigueEffectiveness = this.calculateFatigueEffectiveness(
      strength,
      met
    );
  }

  calculateFatigueEffectiveness(strength, met) {
    const strengthWeight =
      { Low: 1.0, Medium: 1.5, High: 2.0 }[strength] || 1.0;
    return strengthWeight * met;
  }

  toString() {
    return `${this.name} (Body: ${this.bodyPart}, Strength: ${this.strength}, MET: ${this.met}, Time: ${this.time}, Fatigue-Effectiveness: ${this.fatigueEffectiveness})`;
  }
}

function loadExercises(csvData) {
  let exercises = [];
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

  console.log("총 로드된 운동 수:", exercises.length);
  console.log("로드된 운동 데이터:", exercises);
  return exercises;
}

function groupExercisesByBodyPart(exercises) {
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
    console.log(`Sorted exercises for ${bodyPart}:`, grouped[bodyPart]);
  }

  return grouped;
}

async function loadExercisesFromFile(filePath) {
  const response = await fetch(filePath);
  const csvData = await response.text();
  return loadExercises(csvData);
}

async function groupExercisesByBodyPartFromFile(filePath) {
  const exercises = await loadExercisesFromFile(filePath);
  return groupExercisesByBodyPart(exercises);
}

export {
  Exercise,
  loadExercises,
  groupExercisesByBodyPart,
  loadExercisesFromFile,
  groupExercisesByBodyPartFromFile,
};
