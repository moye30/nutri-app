// Utilidades para localStorage

import { Patient, FoodItem, Diet, Routine, Exercise } from '../types';
import { mockFoodItems, mockExercises } from './mockData';

const STORAGE_KEYS = {
  PATIENTS: 'nutrisys_patients',
  FOODS: 'nutrisys_foods',
  DIETS: 'nutrisys_diets',
  ROUTINES: 'nutrisys_routines',
  EXERCISES: 'nutrisys_exercises',
};

// Pacientes
export function getPatients(): Patient[] {
  const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  return data ? JSON.parse(data) : [];
}

export function savePatients(patients: Patient[]): void {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
}

export function addPatient(patient: Patient): void {
  const patients = getPatients();
  patients.push(patient);
  savePatients(patients);
}

export function updatePatient(id: string, updates: Partial<Patient>): void {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updates };
    savePatients(patients);
  }
}

export function deletePatient(id: string): void {
  const patients = getPatients();
  const filtered = patients.filter(p => p.id !== id);
  savePatients(filtered);
}

// Alimentos
export function getFoodItems(): FoodItem[] {
  const data = localStorage.getItem(STORAGE_KEYS.FOODS);
  if (!data) {
    // Inicializar con datos de ejemplo
    saveFoodItems(mockFoodItems);
    return mockFoodItems;
  }
  return JSON.parse(data);
}

export function saveFoodItems(foods: FoodItem[]): void {
  localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(foods));
}

export function addFoodItem(food: FoodItem): void {
  const foods = getFoodItems();
  foods.push(food);
  saveFoodItems(foods);
}

export function updateFoodItem(id: string, updates: Partial<FoodItem>): void {
  const foods = getFoodItems();
  const index = foods.findIndex(f => f.id === id);
  if (index !== -1) {
    foods[index] = { ...foods[index], ...updates };
    saveFoodItems(foods);
  }
}

export function deleteFoodItem(id: string): void {
  const foods = getFoodItems();
  const filtered = foods.filter(f => f.id !== id);
  saveFoodItems(filtered);
}

// Dietas
export function getDiets(): Diet[] {
  const data = localStorage.getItem(STORAGE_KEYS.DIETS);
  return data ? JSON.parse(data) : [];
}

export function saveDiets(diets: Diet[]): void {
  localStorage.setItem(STORAGE_KEYS.DIETS, JSON.stringify(diets));
}

export function addDiet(diet: Diet): void {
  const diets = getDiets();
  diets.push(diet);
  saveDiets(diets);
}

export function updateDiet(id: string, updates: Partial<Diet>): void {
  const diets = getDiets();
  const index = diets.findIndex(d => d.id === id);
  if (index !== -1) {
    diets[index] = { ...diets[index], ...updates };
    saveDiets(diets);
  }
}

export function deleteDiet(id: string): void {
  const diets = getDiets();
  const filtered = diets.filter(d => d.id !== id);
  saveDiets(filtered);
}

// Ejercicios
export function getExercises(): Exercise[] {
  const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
  if (!data) {
    // Inicializar con datos de ejemplo
    saveExercises(mockExercises);
    return mockExercises;
  }
  return JSON.parse(data);
}

export function saveExercises(exercises: Exercise[]): void {
  localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
}

export function addExercise(exercise: Exercise): void {
  const exercises = getExercises();
  exercises.push(exercise);
  saveExercises(exercises);
}

export function updateExercise(id: string, updates: Partial<Exercise>): void {
  const exercises = getExercises();
  const index = exercises.findIndex(e => e.id === id);
  if (index !== -1) {
    exercises[index] = { ...exercises[index], ...updates };
    saveExercises(exercises);
  }
}

export function deleteExercise(id: string): void {
  const exercises = getExercises();
  const filtered = exercises.filter(e => e.id !== id);
  saveExercises(filtered);
}

// Rutinas
export function getRoutines(): Routine[] {
  const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  return data ? JSON.parse(data) : [];
}

export function saveRoutines(routines: Routine[]): void {
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
}

export function addRoutine(routine: Routine): void {
  const routines = getRoutines();
  routines.push(routine);
  saveRoutines(routines);
}

export function updateRoutine(id: string, updates: Partial<Routine>): void {
  const routines = getRoutines();
  const index = routines.findIndex(r => r.id === id);
  if (index !== -1) {
    routines[index] = { ...routines[index], ...updates };
    saveRoutines(routines);
  }
}

export function deleteRoutine(id: string): void {
  const routines = getRoutines();
  const filtered = routines.filter(r => r.id !== id);
  saveRoutines(filtered);
}
