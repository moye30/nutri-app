import { useState } from 'react';
import { Patient, Diet, Routine } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  User, Activity, Target, TrendingUp, TrendingDown, 
  Edit, FileText, Utensils, Dumbbell, Calendar,
  Heart, Cigarette, Wine, Moon, Brain
} from 'lucide-react';
import { evaluateIMC, getIdealBodyFatRange, calculateCaloriesForGoal, getMacroDistribution } from '../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PatientDetailsProps {
  patient: Patient;
  diets: Diet[];
  routines: Routine[];
  onEdit: () => void;
  onAssignDiet: () => void;
  onAssignRoutine: () => void;
  onAddConsulta: () => void;
}

export function PatientDetails({ patient, diets, routines, onEdit, onAssignDiet, onAssignRoutine, onAddConsulta }: PatientDetailsProps) {
  const imcEval = patient.mediciones.imc ? evaluateIMC(patient.mediciones.imc) : null;
  const idealBodyFat = getIdealBodyFatRange(patient.genero);
  const assignedDiet = diets.find(d => d.id === patient.dietaAsignadaId);
  const assignedRoutine = routines.find(r => r.id === patient.rutinaAsignadaId);
  
  // Calcular calorías y macros recomendados
  const caloriasRecomendadas = patient.mediciones.get 
    ? calculateCaloriesForGoal(patient.mediciones.get, patient.objetivos.categoria)
    : 0;
  const macrosRecomendados = getMacroDistribution(patient.objetivos.categoria);
  
  // Preparar datos para gráfica de progreso
  const progressData = patient.historialMediciones
    .slice(-10)
    .map(m => ({
      fecha: new Date(m.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      peso: m.peso,
      imc: m.imc,
      grasa: m.grasaCorporalPorcentaje,
    }));

  return (
    <div className="space-y-6">
      {/* Header con información básica */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="size-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{patient.nombre} {patient.apellidos}</h2>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={patient.genero === 'masculino' ? 'default' : 'secondary'}>
                  {patient.genero === 'masculino' ? 'Masculino' : 'Femenino'}
                </Badge>
                <span className="text-gray-500">{patient.edad} años</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{patient.ocupacion || 'No especificado'}</span>
              </div>
            </div>
          </div>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="size-4" />
            Editar
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Peso Actual</p>
            <p className="text-2xl font-bold">{patient.mediciones.peso} kg</p>
            <p className="text-xs text-gray-500 mt-1">Objetivo: {patient.objetivos.pesoObjetivo} kg</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">IMC</p>
            <p className={`text-2xl font-bold ${imcEval?.color}`}>
              {patient.mediciones.imc?.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{imcEval?.estado}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Grasa Corporal</p>
            <p className="text-2xl font-bold">
              {patient.mediciones.grasaCorporalPorcentaje?.toFixed(1) || '--'}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ideal: {idealBodyFat.min}-{idealBodyFat.max}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Masa Muscular</p>
            <p className="text-2xl font-bold">
              {patient.mediciones.masaMuscular?.toFixed(1) || '--'} kg
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {patient.mediciones.masaMuscular 
                ? `${((patient.mediciones.masaMuscular / patient.mediciones.peso) * 100).toFixed(1)}%`
                : '--'}
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="medico">Médico</TabsTrigger>
          <TabsTrigger value="mediciones">Mediciones</TabsTrigger>
          <TabsTrigger value="dieta">Dieta</TabsTrigger>
          <TabsTrigger value="rutina">Rutina</TabsTrigger>
          <TabsTrigger value="progreso">Progreso</TabsTrigger>
        </TabsList>

        {/* Resumen */}
        <TabsContent value="resumen" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="size-5" />
              Objetivo Nutricional
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Categoría:</span>
                <Badge className="gap-2">
                  {patient.objetivos.categoria === 'bajar_peso' && <TrendingDown className="size-4" />}
                  {(patient.objetivos.categoria === 'subir_peso' || patient.objetivos.categoria === 'ganar_musculo') && <TrendingUp className="size-4" />}
                  {patient.objetivos.categoria.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span>Progreso hacia objetivo</span>
                  <span className="font-semibold">
                    {patient.mediciones.peso} / {patient.objetivos.pesoObjetivo} kg
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (patient.mediciones.peso / patient.objetivos.pesoObjetivo) * 100)} 
                />
              </div>
              
              {patient.objetivos.notasObjetivos && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm">{patient.objetivos.notasObjetivos}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="size-5" />
              Recomendaciones Nutricionales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">TMB (Tasa Metabólica Basal)</p>
                <p className="text-xl font-bold">{patient.mediciones.tmb?.toFixed(0)} kcal/día</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">GET (Gasto Energético Total)</p>
                <p className="text-xl font-bold">{patient.mediciones.get?.toFixed(0)} kcal/día</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg col-span-2">
                <p className="text-sm text-gray-500 mb-1">Calorías recomendadas para objetivo</p>
                <p className="text-2xl font-bold text-blue-600">{caloriasRecomendadas} kcal/día</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Distribución de macronutrientes recomendada:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">{macrosRecomendados.proteinas}%</p>
                  <p className="text-xs text-gray-600">Proteínas</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{macrosRecomendados.carbohidratos}%</p>
                  <p className="text-xs text-gray-600">Carbohidratos</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{macrosRecomendados.grasas}%</p>
                  <p className="text-xs text-gray-600">Grasas</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="size-5" />
              Estilo de Vida
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Wine className="size-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Alcohol</p>
                  <p className="font-semibold">
                    {patient.estiloVida.consumeAlcohol ? patient.estiloVida.frecuenciaAlcohol || 'Sí' : 'No'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Cigarette className="size-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Fumador</p>
                  <p className="font-semibold">
                    {patient.estiloVida.fumador ? `${patient.estiloVida.cigarrillosPorDia || '--'} cig/día` : 'No'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Moon className="size-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Sueño</p>
                  <p className="font-semibold">{patient.estiloVida.horasSueno} hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Brain className="size-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Estrés</p>
                  <p className="font-semibold">{patient.estiloVida.nivelEstres}/10</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Historial Médico */}
        <TabsContent value="medico">
          <Card className="p-6 space-y-6">
            {patient.historialMedico.enfermedadesCronicas.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Enfermedades Crónicas</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.historialMedico.enfermedadesCronicas.map((item, index) => (
                    <Badge key={index} variant="destructive">{item}</Badge>
                  ))}
                </div>
              </div>
            )}

            {patient.historialMedico.alergias.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Alergias</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.historialMedico.alergias.map((item, index) => (
                    <Badge key={index} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            )}

            {patient.historialMedico.medicamentosActuales.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Medicamentos Actuales</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.historialMedico.medicamentosActuales.map((item, index) => (
                    <Badge key={index} variant="outline">{item}</Badge>
                  ))}
                </div>
              </div>
            )}

            {patient.historialMedico.cirugiasAnteriores.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Cirugías Anteriores</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.historialMedico.cirugiasAnteriores.map((item, index) => (
                    <Badge key={index}>{item}</Badge>
                  ))}
                </div>
              </div>
            )}

            {patient.historialMedico.antecedentesHeredofamiliares && (
              <div>
                <h4 className="font-semibold mb-2">Antecedentes Heredofamiliares</h4>
                <p className="bg-gray-50 p-3 rounded-lg">{patient.historialMedico.antecedentesHeredofamiliares}</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Mediciones */}
        <TabsContent value="mediciones">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mediciones Antropométricas Actuales</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Peso</p>
                <p className="text-lg font-semibold">{patient.mediciones.peso} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Altura</p>
                <p className="text-lg font-semibold">{patient.mediciones.altura} cm</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IMC</p>
                <p className="text-lg font-semibold">{patient.mediciones.imc?.toFixed(2)}</p>
              </div>

              {patient.mediciones.perimetroCintura && (
                <>
                  <h4 className="col-span-3 font-semibold mt-4">Perímetros</h4>
                  {patient.mediciones.perimetroCintura && (
                    <div>
                      <p className="text-sm text-gray-500">Cintura</p>
                      <p className="text-lg font-semibold">{patient.mediciones.perimetroCintura} cm</p>
                    </div>
                  )}
                  {patient.mediciones.perimetroCadera && (
                    <div>
                      <p className="text-sm text-gray-500">Cadera</p>
                      <p className="text-lg font-semibold">{patient.mediciones.perimetroCadera} cm</p>
                    </div>
                  )}
                  {patient.mediciones.perimetroCuello && (
                    <div>
                      <p className="text-sm text-gray-500">Cuello</p>
                      <p className="text-lg font-semibold">{patient.mediciones.perimetroCuello} cm</p>
                    </div>
                  )}
                  {patient.mediciones.perimetroBrazo && (
                    <div>
                      <p className="text-sm text-gray-500">Brazo</p>
                      <p className="text-lg font-semibold">{patient.mediciones.perimetroBrazo} cm</p>
                    </div>
                  )}
                </>
              )}

              {patient.mediciones.indiceCinturaCadera && (
                <div className="col-span-3 bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-500">Índice Cintura-Cadera</p>
                  <p className="text-xl font-bold text-blue-600">{patient.mediciones.indiceCinturaCadera.toFixed(2)}</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Dieta */}
        <TabsContent value="dieta">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Utensils className="size-5" />
                Plan de Alimentación
              </h3>
              <Button onClick={onAssignDiet} variant={assignedDiet ? 'outline' : 'default'}>
                {assignedDiet ? 'Cambiar Dieta' : 'Asignar Dieta'}
              </Button>
            </div>

            {assignedDiet ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">{assignedDiet.nombre}</h4>
                  <p className="text-sm text-green-700 mb-3">{assignedDiet.descripcion}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-green-600">Calorías</p>
                      <p className="font-semibold">{assignedDiet.caloriasObjetivo} kcal</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Duración</p>
                      <p className="font-semibold">{assignedDiet.duracionSemanas} semanas</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Comidas</p>
                      <p className="font-semibold">{assignedDiet.comidas.length}</p>
                    </div>
                  </div>
                </div>
                {assignedDiet.indicaciones && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Indicaciones:</p>
                    <p className="text-sm text-gray-600">{assignedDiet.indicaciones}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Utensils className="size-12 mx-auto mb-3 text-gray-300" />
                <p>No hay dieta asignada</p>
                <p className="text-sm mt-1">Asigna una dieta para comenzar el seguimiento nutricional</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Rutina */}
        <TabsContent value="rutina">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Dumbbell className="size-5" />
                Plan de Ejercicio
              </h3>
              <Button onClick={onAssignRoutine} variant={assignedRoutine ? 'outline' : 'default'}>
                {assignedRoutine ? 'Cambiar Rutina' : 'Asignar Rutina'}
              </Button>
            </div>

            {assignedRoutine ? (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">{assignedRoutine.nombre}</h4>
                  <p className="text-sm text-purple-700 mb-3">{assignedRoutine.objetivo}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-purple-600">Nivel</p>
                      <p className="font-semibold capitalize">{assignedRoutine.nivel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600">Días/semana</p>
                      <p className="font-semibold">{assignedRoutine.diasPorSemana}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-600">Ejercicios</p>
                      <p className="font-semibold">{assignedRoutine.ejercicios.length}</p>
                    </div>
                  </div>
                </div>
                {assignedRoutine.indicaciones && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Indicaciones:</p>
                    <p className="text-sm text-gray-600">{assignedRoutine.indicaciones}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Dumbbell className="size-12 mx-auto mb-3 text-gray-300" />
                <p>No hay rutina asignada</p>
                <p className="text-sm mt-1">Asigna una rutina de ejercicio complementaria</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Progreso */}
        <TabsContent value="progreso">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Evolución del Paciente</h3>
              <Button onClick={onAddConsulta} className="gap-2">
                <FileText className="size-4" />
                Nueva Consulta
              </Button>
            </div>

            {progressData.length > 1 ? (
              <div className="space-y-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="imc" stroke="#82ca9d" name="IMC" strokeWidth={2} />
                      {progressData.some(d => d.grasa) && (
                        <Line yAxisId="right" type="monotone" dataKey="grasa" stroke="#ffc658" name="Grasa (%)" strokeWidth={2} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Historial de Consultas</h4>
                  <div className="space-y-3">
                    {patient.consultasNotas.slice().reverse().map((consulta) => (
                      <div key={consulta.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-gray-500" />
                            <span className="font-semibold">
                              {new Date(consulta.fecha).toLocaleDateString('es-MX', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">Peso: {consulta.peso} kg</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{consulta.nota}</p>
                        {consulta.observaciones && (
                          <p className="text-xs text-gray-500 italic">{consulta.observaciones}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="size-12 mx-auto mb-3 text-gray-300" />
                <p>No hay suficientes datos para mostrar progreso</p>
                <p className="text-sm mt-1">Registra más consultas para ver la evolución del paciente</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
