import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { PatientList } from './components/PatientList';
import { PatientForm } from './components/PatientForm';
import { PatientDetails } from './components/PatientDetails';
import { FoodManager } from './components/FoodManager';
import { DietManager } from './components/DietManager';
import { RoutineManager } from './components/RoutineManager';
import { 
  Users, Utensils, Apple, Dumbbell, LayoutDashboard, 
  UserPlus, TrendingDown, TrendingUp, Activity, Target, FileText
} from 'lucide-react';
import { Patient, FoodItem, Diet, Routine, Exercise } from './types';
import { 
  getPatients, addPatient, updatePatient, deletePatient,
  getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem,
  getDiets, addDiet, updateDiet, deleteDiet,
  getRoutines, addRoutine, updateRoutine, deleteRoutine,
  getExercises
} from './utils/storage';
import { toast } from 'sonner';

type View = 'list' | 'form' | 'details';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientView, setPatientView] = useState<View>('list');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isConsultaDialogOpen, setIsConsultaDialogOpen] = useState(false);
  const [consultaNota, setConsultaNota] = useState('');
  const [consultaObservaciones, setConsultaObservaciones] = useState('');
  const [consultaPeso, setConsultaPeso] = useState(0);

  const [isDietAssignOpen, setIsDietAssignOpen] = useState(false);
  const [isRoutineAssignOpen, setIsRoutineAssignOpen] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    setPatients(getPatients());
    setFoods(getFoodItems());
    setDiets(getDiets());
    setRoutines(getRoutines());
    setExercises(getExercises());
  }, []);

  // Handlers para pacientes
  const handleSavePatient = (patient: Patient) => {
    if (selectedPatient) {
      updatePatient(patient.id, patient);
      setPatients(getPatients());
      const updated = getPatients().find(p => p.id === patient.id);
      setSelectedPatient(updated || null);
      toast.success('Paciente actualizado');
    } else {
      addPatient(patient);
      setPatients(getPatients());
      toast.success('Paciente registrado');
    }
    setPatientView('details');
    setSelectedPatient(patient);
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientView('details');
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setPatientView('form');
  };

  const handleEditPatient = () => {
    setPatientView('form');
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setPatientView('list');
  };

  // Handlers para comidas
  const handleAddFood = (food: FoodItem) => {
    addFoodItem(food);
    setFoods(getFoodItems());
  };

  const handleUpdateFood = (id: string, updates: Partial<FoodItem>) => {
    updateFoodItem(id, updates);
    setFoods(getFoodItems());
  };

  const handleDeleteFood = (id: string) => {
    deleteFoodItem(id);
    setFoods(getFoodItems());
  };

  // Handlers para dietas
  const handleAddDiet = (diet: Diet) => {
    addDiet(diet);
    setDiets(getDiets());
  };

  const handleUpdateDiet = (id: string, updates: Partial<Diet>) => {
    updateDiet(id, updates);
    setDiets(getDiets());
  };

  const handleDeleteDiet = (id: string) => {
    deleteDiet(id);
    setDiets(getDiets());
  };

  // Handlers para rutinas
  const handleAddRoutine = (routine: Routine) => {
    addRoutine(routine);
    setRoutines(getRoutines());
  };

  const handleUpdateRoutine = (id: string, updates: Partial<Routine>) => {
    updateRoutine(id, updates);
    setRoutines(getRoutines());
  };

  const handleDeleteRoutine = (id: string) => {
    deleteRoutine(id);
    setRoutines(getRoutines());
  };

  // Asignar dieta
  const handleAssignDiet = () => {
    setIsDietAssignOpen(true);
  };

  const assignDietToPatient = (dietId: string) => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, { dietaAsignadaId: dietId });
      setPatients(getPatients());
      const updated = getPatients().find(p => p.id === selectedPatient.id);
      setSelectedPatient(updated || null);
      setIsDietAssignOpen(false);
      toast.success('Dieta asignada');
    }
  };

  // Asignar rutina
  const handleAssignRoutine = () => {
    setIsRoutineAssignOpen(true);
  };

  const assignRoutineToPatient = (routineId: string) => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, { rutinaAsignadaId: routineId });
      setPatients(getPatients());
      const updated = getPatients().find(p => p.id === selectedPatient.id);
      setSelectedPatient(updated || null);
      setIsRoutineAssignOpen(false);
      toast.success('Rutina asignada');
    }
  };

  // Agregar consulta
  const handleAddConsulta = () => {
    if (selectedPatient) {
      setConsultaPeso(selectedPatient.mediciones.peso);
      setConsultaNota('');
      setConsultaObservaciones('');
      setIsConsultaDialogOpen(true);
    }
  };

  const saveConsulta = () => {
    if (!selectedPatient || !consultaNota) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    const newConsulta = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      nota: consultaNota,
      peso: consultaPeso,
      observaciones: consultaObservaciones,
    };

    const updated = {
      ...selectedPatient,
      consultasNotas: [...selectedPatient.consultasNotas, newConsulta],
      ultimaConsulta: new Date().toISOString(),
    };

    updatePatient(selectedPatient.id, updated);
    setPatients(getPatients());
    const updatedPatient = getPatients().find(p => p.id === selectedPatient.id);
    setSelectedPatient(updatedPatient || null);
    setIsConsultaDialogOpen(false);
    toast.success('Consulta registrada');
  };

  // Estadísticas del dashboard
  const totalPatients = patients.length;
  const totalDiets = diets.length;
  const totalRoutines = routines.length;
  const totalFoods = foods.length;

  const patientsWithGoal = (goal: string) => 
    patients.filter(p => p.objetivos.categoria === goal).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dr. Ruben Erik Chavez Diaz</h1>
                <p className="text-sm text-gray-500">Sistema Profesional de Nutrición</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Sistema para</p>
              <p className="font-semibold">Médico Nutriólogo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="size-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="patients" className="gap-2">
              <Users className="size-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="foods" className="gap-2">
              <Apple className="size-4" />
              Alimentos
            </TabsTrigger>
            <TabsTrigger value="diets" className="gap-2">
              <Utensils className="size-4" />
              Dietas
            </TabsTrigger>
            <TabsTrigger value="routines" className="gap-2">
              <Dumbbell className="size-4" />
              Rutinas
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Resumen General</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="size-6 text-blue-600" />
                      </div>
                      <span className="text-3xl font-bold text-blue-600">{totalPatients}</span>
                    </div>
                    <p className="font-semibold">Pacientes Totales</p>
                    <p className="text-sm text-gray-500">Registrados en el sistema</p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Utensils className="size-6 text-green-600" />
                      </div>
                      <span className="text-3xl font-bold text-green-600">{totalDiets}</span>
                    </div>
                    <p className="font-semibold">Dietas Disponibles</p>
                    <p className="text-sm text-gray-500">Planes nutricionales</p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Dumbbell className="size-6 text-purple-600" />
                      </div>
                      <span className="text-3xl font-bold text-purple-600">{totalRoutines}</span>
                    </div>
                    <p className="font-semibold">Rutinas de Ejercicio</p>
                    <p className="text-sm text-gray-500">Planes de entrenamiento</p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Apple className="size-6 text-orange-600" />
                      </div>
                      <span className="text-3xl font-bold text-orange-600">{totalFoods}</span>
                    </div>
                    <p className="font-semibold">Alimentos Registrados</p>
                    <p className="text-sm text-gray-500">Base de datos nutricional</p>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="size-5" />
                    Distribución por Objetivos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="size-4 text-blue-600" />
                        <span className="text-sm">Bajar peso</span>
                      </div>
                      <span className="font-semibold">{patientsWithGoal('bajar_peso')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="size-4 text-green-600" />
                        <span className="text-sm">Subir peso</span>
                      </div>
                      <span className="font-semibold">{patientsWithGoal('subir_peso')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="size-4 text-purple-600" />
                        <span className="text-sm">Ganar músculo</span>
                      </div>
                      <span className="font-semibold">{patientsWithGoal('ganar_musculo')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="size-4 text-orange-600" />
                        <span className="text-sm">Definir</span>
                      </div>
                      <span className="font-semibold">{patientsWithGoal('definir')}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => {
                        setActiveTab('patients');
                        handleAddPatient();
                      }}
                    >
                      <UserPlus className="size-4" />
                      Registrar Nuevo Paciente
                    </Button>
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => setActiveTab('foods')}
                    >
                      <Apple className="size-4" />
                      Agregar Alimento
                    </Button>
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => setActiveTab('diets')}
                    >
                      <Utensils className="size-4" />
                      Crear Dieta
                    </Button>
                    <Button
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => setActiveTab('routines')}
                    >
                      <Dumbbell className="size-4" />
                      Crear Rutina de Ejercicio
                    </Button>
                  </div>
                </Card>
              </div>

              {patients.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Pacientes Recientes</h3>
                  <div className="space-y-2">
                    {patients.slice(0, 5).map(patient => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => {
                          setActiveTab('patients');
                          handleSelectPatient(patient);
                        }}
                      >
                        <div>
                          <p className="font-semibold">{patient.nombre} {patient.apellidos}</p>
                          <p className="text-sm text-gray-500">
                            {patient.edad} años • {patient.mediciones.peso} kg
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Pacientes */}
          <TabsContent value="patients">
            {patientView === 'list' && (
              <PatientList
                patients={patients}
                onSelectPatient={handleSelectPatient}
                onAddPatient={handleAddPatient}
              />
            )}

            {patientView === 'form' && (
              <div>
                <Button
                  variant="ghost"
                  onClick={handleBackToList}
                  className="mb-4"
                >
                  ← Volver a la lista
                </Button>
                <PatientForm
                  patient={selectedPatient || undefined}
                  onSave={handleSavePatient}
                  onCancel={handleBackToList}
                />
              </div>
            )}

            {patientView === 'details' && selectedPatient && (
              <div>
                <Button
                  variant="ghost"
                  onClick={handleBackToList}
                  className="mb-4"
                >
                  ← Volver a la lista
                </Button>
                <PatientDetails
                  patient={selectedPatient}
                  diets={diets}
                  routines={routines}
                  onEdit={handleEditPatient}
                  onAssignDiet={handleAssignDiet}
                  onAssignRoutine={handleAssignRoutine}
                  onAddConsulta={handleAddConsulta}
                />
              </div>
            )}
          </TabsContent>

          {/* Alimentos */}
          <TabsContent value="foods">
            <FoodManager
              foods={foods}
              onAddFood={handleAddFood}
              onUpdateFood={handleUpdateFood}
              onDeleteFood={handleDeleteFood}
            />
          </TabsContent>

          {/* Dietas */}
          <TabsContent value="diets">
            <DietManager
              diets={diets}
              foods={foods}
              onAddDiet={handleAddDiet}
              onUpdateDiet={handleUpdateDiet}
              onDeleteDiet={handleDeleteDiet}
            />
          </TabsContent>

          {/* Rutinas */}
          <TabsContent value="routines">
            <RoutineManager
              routines={routines}
              exercises={exercises}
              onAddRoutine={handleAddRoutine}
              onUpdateRoutine={handleUpdateRoutine}
              onDeleteRoutine={handleDeleteRoutine}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog para asignar dieta */}
      <Dialog open={isDietAssignOpen} onOpenChange={setIsDietAssignOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asignar Dieta</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {diets.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay dietas disponibles</p>
            ) : (
              diets.map(diet => (
                <Card
                  key={diet.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => assignDietToPatient(diet.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{diet.nombre}</h4>
                      <p className="text-sm text-gray-600 mt-1">{diet.descripcion}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">{diet.caloriasObjetivo} kcal</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{diet.comidas.length} comidas</span>
                      </div>
                    </div>
                    <Button size="sm">Seleccionar</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para asignar rutina */}
      <Dialog open={isRoutineAssignOpen} onOpenChange={setIsRoutineAssignOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asignar Rutina de Ejercicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {routines.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay rutinas disponibles</p>
            ) : (
              routines.map(routine => (
                <Card
                  key={routine.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => assignRoutineToPatient(routine.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{routine.nombre}</h4>
                      <p className="text-sm text-gray-600 mt-1">{routine.objetivo}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 capitalize">{routine.nivel}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{routine.diasPorSemana} días/semana</span>
                      </div>
                    </div>
                    <Button size="sm">Seleccionar</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar consulta */}
      <Dialog open={isConsultaDialogOpen} onOpenChange={setIsConsultaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nueva Consulta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Peso actual (kg) *</Label>
              <Input
                type="number"
                step="0.1"
                value={consultaPeso}
                onChange={(e) => setConsultaPeso(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Notas de la consulta *</Label>
              <Textarea
                value={consultaNota}
                onChange={(e) => setConsultaNota(e.target.value)}
                placeholder="Evolución, cambios observados, etc."
                rows={4}
              />
            </div>
            <div>
              <Label>Observaciones adicionales</Label>
              <Textarea
                value={consultaObservaciones}
                onChange={(e) => setConsultaObservaciones(e.target.value)}
                placeholder="Recomendaciones, ajustes al plan, etc."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsConsultaDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveConsulta}>
                Guardar Consulta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
