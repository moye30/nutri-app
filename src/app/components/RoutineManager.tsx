import { useState } from 'react';
import { Routine, Exercise, ExerciseLevel, ExerciseInRoutine } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Search, Plus, Edit, Trash2, Dumbbell, X } from 'lucide-react';
import { toast } from 'sonner';

interface RoutineManagerProps {
  routines: Routine[];
  exercises: Exercise[];
  onAddRoutine: (routine: Routine) => void;
  onUpdateRoutine: (id: string, updates: Partial<Routine>) => void;
  onDeleteRoutine: (id: string) => void;
}

export function RoutineManager({ routines, exercises, onAddRoutine, onUpdateRoutine, onDeleteRoutine }: RoutineManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  
  const [formData, setFormData] = useState<Partial<Routine>>({
    nombre: '',
    nivel: 'principiante',
    objetivo: '',
    diasPorSemana: 3,
    ejercicios: [],
    duracionSemanas: 4,
    indicaciones: '',
  });

  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [series, setSeries] = useState<number>(3);
  const [repeticiones, setRepeticiones] = useState<string>('10-12');
  const [duracion, setDuracion] = useState<string>('30 min');
  const [descanso, setDescanso] = useState<string>('60 seg');

  const filteredRoutines = routines.filter(routine => {
    const matchesSearch = routine.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || routine.nivel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const openDialog = (routine?: Routine) => {
    if (routine) {
      setEditingRoutine(routine);
      setFormData(routine);
    } else {
      setEditingRoutine(null);
      setFormData({
        nombre: '',
        nivel: 'principiante',
        objetivo: '',
        diasPorSemana: 3,
        ejercicios: [],
        duracionSemanas: 4,
        indicaciones: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.objetivo) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    if (editingRoutine) {
      onUpdateRoutine(editingRoutine.id, formData);
      toast.success('Rutina actualizada');
    } else {
      const newRoutine: Routine = {
        ...formData,
        id: crypto.randomUUID(),
        fechaCreacion: new Date().toISOString(),
      } as Routine;
      onAddRoutine(newRoutine);
      toast.success('Rutina creada');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Eliminar rutina "${nombre}"?`)) {
      onDeleteRoutine(id);
      toast.success('Rutina eliminada');
    }
  };

  const addExerciseToRoutine = () => {
    if (!selectedExercise) {
      toast.error('Seleccione un ejercicio');
      return;
    }

    const exercise = exercises.find(e => e.id === selectedExercise);
    if (!exercise) return;

    const newExercise: ExerciseInRoutine = {
      exerciseId: selectedExercise,
      ...(exercise.tipo === 'cardio' ? { duracion } : { series, repeticiones }),
      descanso,
    };

    setFormData({
      ...formData,
      ejercicios: [...(formData.ejercicios || []), newExercise],
    });

    setSelectedExercise('');
    toast.success('Ejercicio agregado');
  };

  const removeExercise = (index: number) => {
    const updated = formData.ejercicios?.filter((_, i) => i !== index);
    setFormData({ ...formData, ejercicios: updated });
  };

  const getExerciseById = (id: string) => exercises.find(e => e.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar rutina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="principiante">Principiante</SelectItem>
            <SelectItem value="intermedio">Intermedio</SelectItem>
            <SelectItem value="avanzado">Avanzado</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus className="size-4" />
          Nueva Rutina
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutines.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <Dumbbell className="size-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No se encontraron rutinas</p>
          </Card>
        ) : (
          filteredRoutines.map(routine => (
            <Card key={routine.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{routine.nombre}</h3>
                  <Badge variant="outline" className="capitalize">{routine.nivel}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openDialog(routine)}>
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(routine.id, routine.nombre)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{routine.objetivo}</p>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <p className="text-lg font-bold text-purple-600">{routine.diasPorSemana}</p>
                    <p className="text-xs text-gray-500">días/semana</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="text-lg font-bold text-blue-600">{routine.ejercicios.length}</p>
                    <p className="text-xs text-gray-500">ejercicios</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-lg font-bold text-green-600">{routine.duracionSemanas}</p>
                    <p className="text-xs text-gray-500">semanas</p>
                  </div>
                </div>

                {routine.ejercicios.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">Ejercicios incluidos:</p>
                    <div className="space-y-1">
                      {routine.ejercicios.slice(0, 3).map((ex, idx) => {
                        const exercise = getExerciseById(ex.exerciseId);
                        return exercise ? (
                          <p key={idx} className="text-xs text-gray-600">
                            • {exercise.nombre}
                          </p>
                        ) : null;
                      })}
                      {routine.ejercicios.length > 3 && (
                        <p className="text-xs text-gray-500">+{routine.ejercicios.length - 3} más</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRoutine ? 'Editar Rutina' : 'Nueva Rutina'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre de la rutina *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Rutina de fuerza completa"
                />
              </div>
              <div>
                <Label>Nivel</Label>
                <Select
                  value={formData.nivel}
                  onValueChange={(value: ExerciseLevel) => setFormData({ ...formData, nivel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principiante">Principiante</SelectItem>
                    <SelectItem value="intermedio">Intermedio</SelectItem>
                    <SelectItem value="avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Objetivo *</Label>
              <Input
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                placeholder="Ej: Aumentar fuerza y masa muscular"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Días por semana</Label>
                <Input
                  type="number"
                  value={formData.diasPorSemana}
                  onChange={(e) => setFormData({ ...formData, diasPorSemana: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Duración (semanas)</Label>
                <Input
                  type="number"
                  value={formData.duracionSemanas}
                  onChange={(e) => setFormData({ ...formData, duracionSemanas: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Ejercicios de la Rutina</h4>
              
              <div className="grid grid-cols-5 gap-2 mb-3">
                <div className="col-span-2">
                  <Label className="text-xs">Ejercicio</Label>
                  <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map(exercise => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.nombre} ({exercise.tipo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Series</Label>
                  <Input
                    type="number"
                    value={series}
                    onChange={(e) => setSeries(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-xs">Reps/Duración</Label>
                  <Input
                    value={repeticiones}
                    onChange={(e) => setRepeticiones(e.target.value)}
                    placeholder="10-12 o 30min"
                  />
                </div>
                <div>
                  <Label className="text-xs">Descanso</Label>
                  <Input
                    value={descanso}
                    onChange={(e) => setDescanso(e.target.value)}
                    placeholder="60 seg"
                  />
                </div>
              </div>
              
              <Button onClick={addExerciseToRoutine} size="sm" className="w-full mb-3">
                Agregar Ejercicio
              </Button>

              {formData.ejercicios && formData.ejercicios.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.ejercicios.map((ex, index) => {
                    const exercise = getExerciseById(ex.exerciseId);
                    if (!exercise) return null;
                    
                    return (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                        <div className="flex-1">
                          <p className="font-semibold">{exercise.nombre}</p>
                          <p className="text-xs text-gray-600">
                            {ex.series && `${ex.series} series`}
                            {ex.repeticiones && ` × ${ex.repeticiones}`}
                            {ex.duracion && `Duración: ${ex.duracion}`}
                            {ex.descanso && ` • Descanso: ${ex.descanso}`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeExercise(index)}
                        >
                          <X className="size-4 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <Label>Indicaciones especiales</Label>
              <Textarea
                value={formData.indicaciones}
                onChange={(e) => setFormData({ ...formData, indicaciones: e.target.value })}
                placeholder="Instrucciones o recomendaciones adicionales"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingRoutine ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
