// Cálculos nutricionales y antropométricos

import { Gender, ActivityLevel, AnthropometricData } from '../types';

/**
 * Calcula el IMC (Índice de Masa Corporal)
 */
export function calculateIMC(peso: number, altura: number): number {
  const alturaM = altura / 100;
  return Number((peso / (alturaM * alturaM)).toFixed(2));
}

/**
 * Calcula el peso ideal usando la fórmula de Devine
 */
export function calculatePesoIdeal(altura: number, genero: Gender): number {
  const alturaPulgadas = altura / 2.54;
  const pulgadasSobre60 = alturaPulgadas - 60;
  
  if (genero === 'masculino') {
    return Number((50 + (2.3 * pulgadasSobre60)).toFixed(2));
  } else {
    return Number((45.5 + (2.3 * pulgadasSobre60)).toFixed(2));
  }
}

/**
 * Calcula TMB (Tasa Metabólica Basal) usando Harris-Benedict
 */
export function calculateTMB(peso: number, altura: number, edad: number, genero: Gender): number {
  if (genero === 'masculino') {
    return Number((88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad)).toFixed(2));
  } else {
    return Number((447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad)).toFixed(2));
  }
}

/**
 * Calcula GET (Gasto Energético Total)
 */
export function calculateGET(tmb: number, nivelActividad: ActivityLevel): number {
  const multipliers = {
    sedentario: 1.2,
    ligero: 1.375,
    moderado: 1.55,
    activo: 1.725,
    muy_activo: 1.9
  };
  
  return Number((tmb * multipliers[nivelActividad]).toFixed(2));
}

/**
 * Calcula el porcentaje de grasa corporal usando la fórmula de la Marina de EE.UU.
 */
export function calculateBodyFat(
  altura: number,
  perimetroCintura: number,
  perimetroCuello: number,
  genero: Gender,
  perimetroCadera?: number
): number {
  if (genero === 'masculino') {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(perimetroCintura - perimetroCuello) + 0.15456 * Math.log10(altura)) - 450;
    return Number(Math.max(0, bf).toFixed(2));
  } else {
    if (!perimetroCadera) return 0;
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(perimetroCintura + perimetroCadera - perimetroCuello) + 0.22100 * Math.log10(altura)) - 450;
    return Number(Math.max(0, bf).toFixed(2));
  }
}

/**
 * Calcula índice cintura-cadera
 */
export function calculateWaistHipRatio(perimetroCintura: number, perimetroCadera: number): number {
  return Number((perimetroCintura / perimetroCadera).toFixed(2));
}

/**
 * Calcula el porcentaje de grasa corporal usando pliegues cutáneos (método de Jackson-Pollock)
 */
export function calculateBodyFatFromSkinfolds(
  pliegues: {
    tricipital?: number;
    subescapular?: number;
    suprailiaco?: number;
    abdominal?: number;
    muslo?: number;
  },
  edad: number,
  genero: Gender
): number {
  if (genero === 'masculino') {
    const sumPliegues = (pliegues.pecho || 0) + (pliegues.abdominal || 0) + (pliegues.muslo || 0);
    if (sumPliegues === 0) return 0;
    
    const densidad = 1.10938 - (0.0008267 * sumPliegues) + (0.0000016 * sumPliegues * sumPliegues) - (0.0002574 * edad);
    const bf = ((495 / densidad) - 450);
    return Number(Math.max(0, bf).toFixed(2));
  } else {
    const sumPliegues = (pliegues.tricipital || 0) + (pliegues.suprailiaco || 0) + (pliegues.muslo || 0);
    if (sumPliegues === 0) return 0;
    
    const densidad = 1.0994921 - (0.0009929 * sumPliegues) + (0.0000023 * sumPliegues * sumPliegues) - (0.0001392 * edad);
    const bf = ((495 / densidad) - 450);
    return Number(Math.max(0, bf).toFixed(2));
  }
}

/**
 * Calcula la masa muscular estimada
 */
export function calculateMuscleMass(peso: number, grasaCorporalPorcentaje: number): number {
  const masaGrasa = peso * (grasaCorporalPorcentaje / 100);
  const masaMagra = peso - masaGrasa;
  return Number(masaMagra.toFixed(2));
}

/**
 * Calcula el porcentaje de grasa corporal ideal según género
 */
export function getIdealBodyFatRange(genero: Gender): { min: number; max: number } {
  if (genero === 'masculino') {
    return { min: 10, max: 20 };
  } else {
    return { min: 18, max: 28 };
  }
}

/**
 * Calcula las calorías necesarias según el objetivo
 */
export function calculateCaloriesForGoal(get: number, objetivo: string): number {
  switch (objetivo) {
    case 'bajar_peso':
      return Number((get * 0.8).toFixed(0)); // déficit del 20%
    case 'subir_peso':
    case 'ganar_musculo':
      return Number((get * 1.15).toFixed(0)); // superávit del 15%
    case 'definir':
      return Number((get * 0.85).toFixed(0)); // déficit del 15%
    case 'mantener':
    default:
      return Number(get.toFixed(0));
  }
}

/**
 * Calcula la distribución de macronutrientes según objetivo
 */
export function getMacroDistribution(objetivo: string): { proteinas: number; carbohidratos: number; grasas: number } {
  switch (objetivo) {
    case 'bajar_peso':
      return { proteinas: 35, carbohidratos: 35, grasas: 30 };
    case 'subir_peso':
      return { proteinas: 25, carbohidratos: 50, grasas: 25 };
    case 'ganar_musculo':
      return { proteinas: 30, carbohidratos: 45, grasas: 25 };
    case 'definir':
      return { proteinas: 40, carbohidratos: 30, grasas: 30 };
    case 'mantener':
    default:
      return { proteinas: 30, carbohidratos: 40, grasas: 30 };
  }
}

/**
 * Evalúa el estado nutricional según IMC
 */
export function evaluateIMC(imc: number): { estado: string; color: string } {
  if (imc < 18.5) {
    return { estado: 'Bajo peso', color: 'text-blue-600' };
  } else if (imc < 25) {
    return { estado: 'Peso normal', color: 'text-green-600' };
  } else if (imc < 30) {
    return { estado: 'Sobrepeso', color: 'text-yellow-600' };
  } else if (imc < 35) {
    return { estado: 'Obesidad I', color: 'text-orange-600' };
  } else if (imc < 40) {
    return { estado: 'Obesidad II', color: 'text-red-600' };
  } else {
    return { estado: 'Obesidad III', color: 'text-red-800' };
  }
}

/**
 * Completa los cálculos de las mediciones antropométricas
 */
export function completeAnthropometricCalculations(
  mediciones: Partial<AnthropometricData>,
  edad: number,
  genero: Gender,
  nivelActividad: ActivityLevel
): AnthropometricData {
  const { peso, altura, perimetroCintura, perimetroCuello, perimetroCadera } = mediciones;
  
  if (!peso || !altura) {
    throw new Error('Peso y altura son requeridos');
  }
  
  // IMC
  const imc = calculateIMC(peso, altura);
  
  // Peso ideal
  const pesoIdeal = calculatePesoIdeal(altura, genero);
  
  // TMB
  const tmb = calculateTMB(peso, altura, edad, genero);
  
  // GET
  const get = calculateGET(tmb, nivelActividad);
  
  // Grasa corporal (si hay datos de perímetros)
  let grasaCorporalPorcentaje = mediciones.grasaCorporalPorcentaje;
  if (!grasaCorporalPorcentaje && perimetroCintura && perimetroCuello) {
    grasaCorporalPorcentaje = calculateBodyFat(altura, perimetroCintura, perimetroCuello, genero, perimetroCadera);
  }
  
  // Masa muscular
  let masaMuscular = mediciones.masaMuscular;
  if (!masaMuscular && grasaCorporalPorcentaje) {
    masaMuscular = calculateMuscleMass(peso, grasaCorporalPorcentaje);
  }
  
  // Índice cintura-cadera
  let indiceCinturaCadera = mediciones.indiceCinturaCadera;
  if (!indiceCinturaCadera && perimetroCintura && perimetroCadera) {
    indiceCinturaCadera = calculateWaistHipRatio(perimetroCintura, perimetroCadera);
  }
  
  return {
    ...mediciones,
    id: mediciones.id || crypto.randomUUID(),
    fecha: mediciones.fecha || new Date().toISOString(),
    peso,
    altura,
    imc,
    pesoIdeal,
    tmb,
    get,
    grasaCorporalPorcentaje,
    masaMuscular,
    indiceCinturaCadera,
  } as AnthropometricData;
}
