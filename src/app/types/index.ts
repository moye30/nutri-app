// Tipos principales del sistema

export type Gender = 'masculino' | 'femenino';

export type DietCategory = 'bajar_peso' | 'subir_peso' | 'definir' | 'mantener' | 'ganar_musculo' | 'salud_cardiovascular';

export type ActivityLevel = 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo';

export type ExerciseLevel = 'principiante' | 'intermedio' | 'avanzado';

export interface Patient {
  id: string;
  // Información Personal
  nombre: string;
  apellidos: string;
  genero: Gender;
  edad: number;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  ocupacion: string;
  
  // Historial Médico
  historialMedico: {
    enfermedadesCronicas: string[];
    alergias: string[];
    medicamentosActuales: string[];
    cirugiasAnteriores: string[];
    antecedentesHeredofamiliares: string;
  };
  
  // Estilo de Vida
  estiloVida: {
    consumeAlcohol: boolean;
    frecuenciaAlcohol?: string;
    fumador: boolean;
    cigarrillosPorDia?: number;
    nivelActividad: ActivityLevel;
    horasSueno: number;
    nivelEstres: number; // 1-10
  };
  
  // Mediciones Antropométricas Actuales
  mediciones: AnthropometricData;
  
  // Historial de mediciones
  historialMediciones: AnthropometricData[];
  
  // Objetivos
  objetivos: {
    pesoObjetivo: number;
    grasaCorporalObjetivo: number;
    categoria: DietCategory;
    fechaObjetivo?: string;
    notasObjetivos: string;
  };
  
  // Evaluación Dietética
  evaluacionDietetica: {
    recordatorio24hrs: string;
    frecuenciaConsumo: string;
    preferenciasAlimentarias: string[];
    alimentosNoGustan: string[];
    restriccionesDieteticas: string[];
  };
  
  // Asignaciones
  dietaAsignadaId?: string;
  rutinaAsignadaId?: string;
  
  // Notas de consultas
  consultasNotas: ConsultaNote[];
  
  // Fechas
  fechaRegistro: string;
  ultimaConsulta?: string;
}

export interface AnthropometricData {
  id: string;
  fecha: string;
  peso: number; // kg
  altura: number; // cm
  
  // Perímetros (cm)
  perimetroCintura?: number;
  perimetroCadera?: number;
  perimetroCuello?: number;
  perimetroBrazo?: number;
  perimetroMuslo?: number;
  perimetroPantorrilla?: number;
  perimetroPecho?: number;
  
  // Pliegues cutáneos (mm)
  plieguesTricipital?: number;
  plieguesSubescapular?: number;
  plieguesSuprailiaco?: number;
  plieguesAbdominal?: number;
  plieguesMuslo?: number;
  plieguesPantorrilla?: number;
  
  // Composición corporal
  grasaCorporalPorcentaje?: number;
  masaMuscular?: number;
  
  // Cálculos (se calculan automáticamente)
  imc?: number;
  pesoIdeal?: number;
  tmb?: number; // Tasa Metabólica Basal
  get?: number; // Gasto Energético Total
  indiceCinturaCadera?: number;
}

export interface ConsultaNote {
  id: string;
  fecha: string;
  nota: string;
  peso: number;
  observaciones: string;
}

export interface FoodItem {
  id: string;
  nombre: string;
  categoria: 'proteina' | 'carbohidrato' | 'grasa' | 'vegetal' | 'fruta' | 'lacteo' | 'bebida' | 'otro';
  categoriaObjetivo: DietCategory[]; // Para qué objetivos es adecuada
  
  // Por 100g o porción estándar
  porcion: number; // gramos
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  fibra?: number;
  
  // Micronutrientes opcionales
  sodio?: number;
  azucares?: number;
  
  notas?: string;
}

export interface MealInDiet {
  foodItemId: string;
  cantidad: number; // gramos o porciones
  horario: string; // "Desayuno", "Colación 1", "Comida", etc.
}

export interface Diet {
  id: string;
  nombre: string;
  categoria: DietCategory;
  descripcion: string;
  caloriasObjetivo: number;
  
  // Distribución de macros (%)
  distribucionMacros: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  
  comidas: MealInDiet[];
  
  duracionSemanas: number;
  indicaciones: string;
  
  fechaCreacion: string;
}

export interface Exercise {
  id: string;
  nombre: string;
  grupoMuscular: string[];
  tipo: 'cardio' | 'fuerza' | 'flexibilidad' | 'funcional';
  nivel: ExerciseLevel[];
  descripcion: string;
  calorias?: number; // estimado por 30 min
}

export interface ExerciseInRoutine {
  exerciseId: string;
  series?: number;
  repeticiones?: string;
  duracion?: string; // para cardio
  descanso?: string;
  notas?: string;
}

export interface Routine {
  id: string;
  nombre: string;
  nivel: ExerciseLevel;
  objetivo: string;
  diasPorSemana: number;
  
  ejercicios: ExerciseInRoutine[];
  
  duracionSemanas: number;
  indicaciones: string;
  
  fechaCreacion: string;
}
