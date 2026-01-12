// Datos de ejemplo para el sistema

import { FoodItem, Exercise, Diet, Routine, Patient } from '../types';

export const mockFoodItems: FoodItem[] = [
  // Proteínas
  { id: '1', nombre: 'Pechuga de pollo', categoria: 'proteina', categoriaObjetivo: ['bajar_peso', 'definir', 'ganar_musculo', 'mantener'], porcion: 100, calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6, fibra: 0 },
  { id: '2', nombre: 'Huevo entero', categoria: 'proteina', categoriaObjetivo: ['subir_peso', 'ganar_musculo', 'mantener'], porcion: 50, calorias: 78, proteinas: 6.3, carbohidratos: 0.6, grasas: 5.3, fibra: 0 },
  { id: '3', nombre: 'Atún en agua', categoria: 'proteina', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener'], porcion: 100, calorias: 116, proteinas: 26, carbohidratos: 0, grasas: 0.8, fibra: 0 },
  { id: '4', nombre: 'Salmón', categoria: 'proteina', categoriaObjetivo: ['ganar_musculo', 'salud_cardiovascular', 'mantener'], porcion: 100, calorias: 208, proteinas: 20, carbohidratos: 0, grasas: 13, fibra: 0 },
  { id: '5', nombre: 'Carne de res magra', categoria: 'proteina', categoriaObjetivo: ['ganar_musculo', 'subir_peso', 'mantener'], porcion: 100, calorias: 250, proteinas: 26, carbohidratos: 0, grasas: 15, fibra: 0 },
  { id: '6', nombre: 'Requesón bajo en grasa', categoria: 'lacteo', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener'], porcion: 100, calorias: 72, proteinas: 12, carbohidratos: 3.5, grasas: 1, fibra: 0 },
  
  // Carbohidratos
  { id: '7', nombre: 'Arroz integral', categoria: 'carbohidrato', categoriaObjetivo: ['ganar_musculo', 'subir_peso', 'mantener'], porcion: 100, calorias: 370, proteinas: 7.9, carbohidratos: 77, grasas: 2.9, fibra: 3.5 },
  { id: '8', nombre: 'Avena', categoria: 'carbohidrato', categoriaObjetivo: ['ganar_musculo', 'subir_peso', 'salud_cardiovascular', 'mantener'], porcion: 100, calorias: 389, proteinas: 16.9, carbohidratos: 66, grasas: 6.9, fibra: 10.6 },
  { id: '9', nombre: 'Camote', categoria: 'carbohidrato', categoriaObjetivo: ['ganar_musculo', 'subir_peso', 'mantener'], porcion: 100, calorias: 86, proteinas: 1.6, carbohidratos: 20, grasas: 0.1, fibra: 3 },
  { id: '10', nombre: 'Pan integral', categoria: 'carbohidrato', categoriaObjetivo: ['mantener', 'ganar_musculo'], porcion: 100, calorias: 247, proteinas: 13, carbohidratos: 41, grasas: 3.4, fibra: 6 },
  { id: '11', nombre: 'Quinoa', categoria: 'carbohidrato', categoriaObjetivo: ['bajar_peso', 'mantener', 'salud_cardiovascular'], porcion: 100, calorias: 368, proteinas: 14, carbohidratos: 64, grasas: 6, fibra: 7 },
  { id: '12', nombre: 'Pasta integral', categoria: 'carbohidrato', categoriaObjetivo: ['ganar_musculo', 'subir_peso', 'mantener'], porcion: 100, calorias: 348, proteinas: 13, carbohidratos: 70, grasas: 2.5, fibra: 9 },
  
  // Grasas saludables
  { id: '13', nombre: 'Aguacate', categoria: 'grasa', categoriaObjetivo: ['ganar_musculo', 'salud_cardiovascular', 'mantener'], porcion: 100, calorias: 160, proteinas: 2, carbohidratos: 8.5, grasas: 14.7, fibra: 6.7 },
  { id: '14', nombre: 'Almendras', categoria: 'grasa', categoriaObjetivo: ['subir_peso', 'ganar_musculo', 'salud_cardiovascular'], porcion: 100, calorias: 579, proteinas: 21, carbohidratos: 21, grasas: 50, fibra: 12.5 },
  { id: '15', nombre: 'Aceite de oliva', categoria: 'grasa', categoriaObjetivo: ['salud_cardiovascular', 'mantener'], porcion: 14, calorias: 119, proteinas: 0, carbohidratos: 0, grasas: 13.5, fibra: 0 },
  { id: '16', nombre: 'Nueces', categoria: 'grasa', categoriaObjetivo: ['subir_peso', 'salud_cardiovascular', 'ganar_musculo'], porcion: 100, calorias: 654, proteinas: 15, carbohidratos: 14, grasas: 65, fibra: 7 },
  
  // Vegetales
  { id: '17', nombre: 'Brócoli', categoria: 'vegetal', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener', 'salud_cardiovascular'], porcion: 100, calorias: 34, proteinas: 2.8, carbohidratos: 7, grasas: 0.4, fibra: 2.6 },
  { id: '18', nombre: 'Espinaca', categoria: 'vegetal', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener', 'salud_cardiovascular'], porcion: 100, calorias: 23, proteinas: 2.9, carbohidratos: 3.6, grasas: 0.4, fibra: 2.2 },
  { id: '19', nombre: 'Zanahoria', categoria: 'vegetal', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener'], porcion: 100, calorias: 41, proteinas: 0.9, carbohidratos: 10, grasas: 0.2, fibra: 2.8 },
  { id: '20', nombre: 'Lechuga', categoria: 'vegetal', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener'], porcion: 100, calorias: 15, proteinas: 1.4, carbohidratos: 2.9, grasas: 0.2, fibra: 1.3 },
  { id: '21', nombre: 'Tomate', categoria: 'vegetal', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener', 'salud_cardiovascular'], porcion: 100, calorias: 18, proteinas: 0.9, carbohidratos: 3.9, grasas: 0.2, fibra: 1.2 },
  
  // Frutas
  { id: '22', nombre: 'Plátano', categoria: 'fruta', categoriaObjetivo: ['ganar_musculo', 'subir_peso', 'mantener'], porcion: 100, calorias: 89, proteinas: 1.1, carbohidratos: 23, grasas: 0.3, fibra: 2.6 },
  { id: '23', nombre: 'Manzana', categoria: 'fruta', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener'], porcion: 100, calorias: 52, proteinas: 0.3, carbohidratos: 14, grasas: 0.2, fibra: 2.4 },
  { id: '24', nombre: 'Fresa', categoria: 'fruta', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener'], porcion: 100, calorias: 32, proteinas: 0.7, carbohidratos: 7.7, grasas: 0.3, fibra: 2 },
  { id: '25', nombre: 'Naranja', categoria: 'fruta', categoriaObjetivo: ['bajar_peso', 'mantener', 'salud_cardiovascular'], porcion: 100, calorias: 47, proteinas: 0.9, carbohidratos: 12, grasas: 0.1, fibra: 2.4 },
  
  // Lácteos
  { id: '26', nombre: 'Yogurt griego natural', categoria: 'lacteo', categoriaObjetivo: ['bajar_peso', 'definir', 'ganar_musculo', 'mantener'], porcion: 100, calorias: 59, proteinas: 10, carbohidratos: 3.6, grasas: 0.4, fibra: 0 },
  { id: '27', nombre: 'Leche descremada', categoria: 'lacteo', categoriaObjetivo: ['bajar_peso', 'mantener'], porcion: 240, calorias: 83, proteinas: 8.3, carbohidratos: 12, grasas: 0.2, fibra: 0 },
  { id: '28', nombre: 'Queso panela', categoria: 'lacteo', categoriaObjetivo: ['mantener', 'ganar_musculo'], porcion: 100, calorias: 240, proteinas: 18, carbohidratos: 3, grasas: 18, fibra: 0 },
  
  // Bebidas
  { id: '29', nombre: 'Agua natural', categoria: 'bebida', categoriaObjetivo: ['bajar_peso', 'definir', 'mantener', 'ganar_musculo', 'subir_peso', 'salud_cardiovascular'], porcion: 240, calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
  { id: '30', nombre: 'Té verde', categoria: 'bebida', categoriaObjetivo: ['bajar_peso', 'definir', 'salud_cardiovascular'], porcion: 240, calorias: 2, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0 },
];

export const mockExercises: Exercise[] = [
  // Fuerza - Pecho
  { id: 'e1', nombre: 'Press de banca', grupoMuscular: ['pecho', 'tríceps', 'hombros'], tipo: 'fuerza', nivel: ['principiante', 'intermedio', 'avanzado'], descripcion: 'Acostado en banca, empujar la barra desde el pecho hasta arriba', calorias: 120 },
  { id: 'e2', nombre: 'Flexiones', grupoMuscular: ['pecho', 'tríceps', 'core'], tipo: 'fuerza', nivel: ['principiante', 'intermedio'], descripcion: 'Ejercicio con peso corporal para pecho', calorias: 100 },
  { id: 'e3', nombre: 'Aperturas con mancuernas', grupoMuscular: ['pecho'], tipo: 'fuerza', nivel: ['intermedio', 'avanzado'], descripcion: 'Acostado, abrir y cerrar brazos con mancuernas', calorias: 90 },
  
  // Fuerza - Espalda
  { id: 'e4', nombre: 'Dominadas', grupoMuscular: ['espalda', 'bíceps'], tipo: 'fuerza', nivel: ['intermedio', 'avanzado'], descripcion: 'Suspendido de barra, elevar cuerpo hasta barbilla', calorias: 130 },
  { id: 'e5', nombre: 'Remo con barra', grupoMuscular: ['espalda', 'bíceps'], tipo: 'fuerza', nivel: ['principiante', 'intermedio', 'avanzado'], descripcion: 'Inclinado, jalar barra hacia abdomen', calorias: 110 },
  { id: 'e6', nombre: 'Peso muerto', grupoMuscular: ['espalda', 'piernas', 'glúteos'], tipo: 'fuerza', nivel: ['intermedio', 'avanzado'], descripcion: 'Levantar barra desde el suelo manteniendo espalda recta', calorias: 150 },
  
  // Fuerza - Piernas
  { id: 'e7', nombre: 'Sentadilla', grupoMuscular: ['piernas', 'glúteos'], tipo: 'fuerza', nivel: ['principiante', 'intermedio', 'avanzado'], descripcion: 'Flexionar rodillas bajando cadera', calorias: 140 },
  { id: 'e8', nombre: 'Zancadas', grupoMuscular: ['piernas', 'glúteos'], tipo: 'fuerza', nivel: ['principiante', 'intermedio'], descripcion: 'Paso largo flexionando rodilla delantera', calorias: 120 },
  { id: 'e9', nombre: 'Prensa de piernas', grupoMuscular: ['piernas', 'glúteos'], tipo: 'fuerza', nivel: ['principiante', 'intermedio', 'avanzado'], descripcion: 'Empujar plataforma con pies en máquina', calorias: 130 },
  
  // Fuerza - Hombros
  { id: 'e10', nombre: 'Press militar', grupoMuscular: ['hombros', 'tríceps'], tipo: 'fuerza', nivel: ['principiante', 'intermedio', 'avanzado'], descripcion: 'De pie, empujar barra sobre la cabeza', calorias: 110 },
  { id: 'e11', nombre: 'Elevaciones laterales', grupoMuscular: ['hombros'], tipo: 'fuerza', nivel: ['principiante', 'intermedio'], descripcion: 'Elevar mancuernas lateralmente hasta hombros', calorias: 80 },
  
  // Fuerza - Brazos
  { id: 'e12', nombre: 'Curl de bíceps', grupoMuscular: ['bíceps'], tipo: 'fuerza', nivel: ['principiante', 'intermedio'], descripcion: 'Flexionar codos elevando mancuernas', calorias: 70 },
  { id: 'e13', nombre: 'Tríceps en polea', grupoMuscular: ['tríceps'], tipo: 'fuerza', nivel: ['principiante', 'intermedio'], descripcion: 'Empujar barra hacia abajo extendiendo codos', calorias: 75 },
  
  // Cardio
  { id: 'e14', nombre: 'Correr', grupoMuscular: ['piernas', 'cardiovascular'], tipo: 'cardio', nivel: ['principiante', 'intermedio', 'avanzado'], descripcion: 'Carrera continua o intervalos', calorias: 300 },
  { id: 'e15', nombre: 'Bicicleta estática', grupoMuscular: ['piernas', 'cardiovascular'], tipo: 'cardio', nivel: ['principiante', 'intermedio'], descripcion: 'Pedaleo continuo o intervalos', calorias: 250 },
  { id: 'e16', nombre: 'Elíptica', grupoMuscular: ['piernas', 'brazos', 'cardiovascular'], tipo: 'cardio', nivel: ['principiante', 'intermedio'], descripcion: 'Movimiento elíptico de bajo impacto', calorias: 280 },
  { id: 'e17', nombre: 'Nadar', grupoMuscular: ['todo el cuerpo', 'cardiovascular'], tipo: 'cardio', nivel: ['principiante', 'intermedio', 'avanzado'], descripcion: 'Natación continua', calorias: 350 },
  { id: 'e18', nombre: 'Saltar cuerda', grupoMuscular: ['piernas', 'cardiovascular'], tipo: 'cardio', nivel: ['intermedio', 'avanzado'], descripcion: 'Saltos continuos con cuerda', calorias: 400 },
  
  // Core
  { id: 'e19', nombre: 'Plancha', grupoMuscular: ['core', 'abdomen'], tipo: 'fuerza', nivel: ['principiante', 'intermedio'], descripcion: 'Sostener posición horizontal apoyado en antebrazos', calorias: 50 },
  { id: 'e20', nombre: 'Abdominales', grupoMuscular: ['abdomen'], tipo: 'fuerza', nivel: ['principiante'], descripcion: 'Flexión de tronco', calorias: 60 },
  
  // Funcional
  { id: 'e21', nombre: 'Burpees', grupoMuscular: ['todo el cuerpo'], tipo: 'funcional', nivel: ['intermedio', 'avanzado'], descripcion: 'Combinación de flexión, salto y sentadilla', calorias: 200 },
  { id: 'e22', nombre: 'Mountain climbers', grupoMuscular: ['core', 'piernas', 'cardiovascular'], tipo: 'funcional', nivel: ['intermedio', 'avanzado'], descripcion: 'Simulación de escalada en posición de plancha', calorias: 180 },
];
