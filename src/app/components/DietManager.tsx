import { useState } from 'react';
import { Diet, DietCategory, FoodItem, MealInDiet } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Search, Plus, Edit, Trash2, Utensils, X } from 'lucide-react';
import { toast } from 'sonner';

interface DietManagerProps {
  diets: Diet[];
  foods: FoodItem[];
  onAddDiet: (diet: Diet) => void;
  onUpdateDiet: (id: string, updates: Partial<Diet>) => void;
  onDeleteDiet: (id: string) => void;
}

export function DietManager({ diets, foods, onAddDiet, onUpdateDiet, onDeleteDiet }: DietManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState<Diet | null>(null);
  
  const [formData, setFormData] = useState<Partial<Diet>>({
    nombre: '',
    categoria: 'mantener',
    descripcion: '',
    caloriasObjetivo: 2000,
    distribucionMacros: { proteinas: 30, carbohidratos: 40, grasas: 30 },
    comidas: [],
    duracionSemanas: 4,
    indicaciones: '',
  });

  const [selectedFood, setSelectedFood] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(100);
  const [horario, setHorario] = useState<string>('Desayuno');

  const filteredDiets = diets.filter(diet => {
    const matchesSearch = diet.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || diet.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openDialog = (diet?: Diet) => {
    if (diet) {
      setEditingDiet(diet);
      setFormData(diet);
    } else {
      setEditingDiet(null);
      setFormData({
        nombre: '',
        categoria: 'mantener',
        descripcion: '',
        caloriasObjetivo: 2000,
        distribucionMacros: { proteinas: 30, carbohidratos: 40, grasas: 30 },
        comidas: [],
        duracionSemanas: 4,
        indicaciones: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.caloriasObjetivo) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    if (editingDiet) {
      onUpdateDiet(editingDiet.id, formData);
      toast.success('Dieta actualizada');
    } else {
      const newDiet: Diet = {
        ...formData,
        id: crypto.randomUUID(),
        fechaCreacion: new Date().toISOString(),
      } as Diet;
      onAddDiet(newDiet);
      toast.success('Dieta creada');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Eliminar dieta "${nombre}"?`)) {
      onDeleteDiet(id);
      toast.success('Dieta eliminada');
    }
  };

  const addMealToDiet = () => {
    if (!selectedFood || !cantidad) {
      toast.error('Seleccione un alimento y cantidad');
      return;
    }

    const newMeal: MealInDiet = {
      foodItemId: selectedFood,
      cantidad,
      horario,
    };

    setFormData({
      ...formData,
      comidas: [...(formData.comidas || []), newMeal],
    });

    setSelectedFood('');
    setCantidad(100);
    toast.success('Comida agregada');
  };

  const removeMeal = (index: number) => {
    const updated = formData.comidas?.filter((_, i) => i !== index);
    setFormData({ ...formData, comidas: updated });
  };

  const getFoodById = (id: string) => foods.find(f => f.id === id);

  const calculateDietTotals = (meals: MealInDiet[]) => {
    let totalCal = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    meals.forEach(meal => {
      const food = getFoodById(meal.foodItemId);
      if (food) {
        const factor = meal.cantidad / food.porcion;
        totalCal += food.calorias * factor;
        totalProt += food.proteinas * factor;
        totalCarbs += food.carbohidratos * factor;
        totalFats += food.grasas * factor;
      }
    });

    return {
      calorias: totalCal.toFixed(0),
      proteinas: totalProt.toFixed(1),
      carbohidratos: totalCarbs.toFixed(1),
      grasas: totalFats.toFixed(1),
    };
  };

  const getCategoryLabel = (cat: DietCategory) => {
    const labels: Record<DietCategory, string> = {
      bajar_peso: 'Bajar peso',
      subir_peso: 'Subir peso',
      definir: 'Definición',
      ganar_musculo: 'Ganar músculo',
      mantener: 'Mantener',
      salud_cardiovascular: 'Salud cardiovascular',
    };
    return labels[cat];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar dieta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="bajar_peso">Bajar peso</SelectItem>
            <SelectItem value="subir_peso">Subir peso</SelectItem>
            <SelectItem value="definir">Definición</SelectItem>
            <SelectItem value="ganar_musculo">Ganar músculo</SelectItem>
            <SelectItem value="mantener">Mantener</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus className="size-4" />
          Nueva Dieta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDiets.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <Utensils className="size-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No se encontraron dietas</p>
          </Card>
        ) : (
          filteredDiets.map(diet => {
            const totals = calculateDietTotals(diet.comidas);
            return (
              <Card key={diet.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{diet.nombre}</h3>
                    <Badge variant="outline">{getCategoryLabel(diet.categoria)}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openDialog(diet)}>
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(diet.id, diet.nombre)}
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{diet.descripcion}</p>

                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Calorías totales</p>
                    <p className="text-2xl font-bold text-blue-700">{totals.calorias} kcal</p>
                    <p className="text-xs text-blue-600 mt-1">Objetivo: {diet.caloriasObjetivo} kcal</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-red-50 p-2 rounded text-center">
                      <p className="font-semibold text-red-600">{totals.proteinas}g</p>
                      <p className="text-gray-500">Proteínas</p>
                      <p className="text-xs text-gray-400">{diet.distribucionMacros.proteinas}%</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="font-semibold text-green-600">{totals.carbohidratos}g</p>
                      <p className="text-gray-500">Carbos</p>
                      <p className="text-xs text-gray-400">{diet.distribucionMacros.carbohidratos}%</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <p className="font-semibold text-yellow-600">{totals.grasas}g</p>
                      <p className="text-gray-500">Grasas</p>
                      <p className="text-xs text-gray-400">{diet.distribucionMacros.grasas}%</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t text-sm">
                    <p className="text-gray-500">
                      {diet.comidas.length} comidas • {diet.duracionSemanas} semanas
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDiet ? 'Editar Dieta' : 'Nueva Dieta'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre de la dieta *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Plan de pérdida de peso"
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value: DietCategory) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajar_peso">Bajar peso</SelectItem>
                    <SelectItem value="subir_peso">Subir peso</SelectItem>
                    <SelectItem value="definir">Definición muscular</SelectItem>
                    <SelectItem value="ganar_musculo">Ganar músculo</SelectItem>
                    <SelectItem value="mantener">Mantener peso</SelectItem>
                    <SelectItem value="salud_cardiovascular">Salud cardiovascular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción breve de la dieta"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Calorías objetivo (kcal/día) *</Label>
                <Input
                  type="number"
                  value={formData.caloriasObjetivo}
                  onChange={(e) => setFormData({ ...formData, caloriasObjetivo: parseInt(e.target.value) })}
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

            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="mb-3 block">Distribución de Macronutrientes (%)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Proteínas</Label>
                  <Input
                    type="number"
                    value={formData.distribucionMacros?.proteinas}
                    onChange={(e) => setFormData({
                      ...formData,
                      distribucionMacros: {
                        ...formData.distribucionMacros!,
                        proteinas: parseInt(e.target.value),
                      },
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Carbohidratos</Label>
                  <Input
                    type="number"
                    value={formData.distribucionMacros?.carbohidratos}
                    onChange={(e) => setFormData({
                      ...formData,
                      distribucionMacros: {
                        ...formData.distribucionMacros!,
                        carbohidratos: parseInt(e.target.value),
                      },
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Grasas</Label>
                  <Input
                    type="number"
                    value={formData.distribucionMacros?.grasas}
                    onChange={(e) => setFormData({
                      ...formData,
                      distribucionMacros: {
                        ...formData.distribucionMacros!,
                        grasas: parseInt(e.target.value),
                      },
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Comidas del Plan</h4>
              
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="col-span-2">
                  <Label className="text-xs">Alimento</Label>
                  <Select value={selectedFood} onValueChange={setSelectedFood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {foods.map(food => (
                        <SelectItem key={food.id} value={food.id}>
                          {food.nombre} ({food.calorias} kcal)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Cantidad (g)</Label>
                  <Input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-xs">Horario</Label>
                  <Select value={horario} onValueChange={setHorario}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desayuno">Desayuno</SelectItem>
                      <SelectItem value="Colación 1">Colación 1</SelectItem>
                      <SelectItem value="Comida">Comida</SelectItem>
                      <SelectItem value="Colación 2">Colación 2</SelectItem>
                      <SelectItem value="Cena">Cena</SelectItem>
                      <SelectItem value="Colación 3">Colación 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={addMealToDiet} size="sm" className="w-full mb-3">
                Agregar Comida
              </Button>

              {formData.comidas && formData.comidas.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.comidas.map((meal, index) => {
                    const food = getFoodById(meal.foodItemId);
                    if (!food) return null;
                    const factor = meal.cantidad / food.porcion;
                    const cals = (food.calorias * factor).toFixed(0);
                    
                    return (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                        <div className="flex-1">
                          <p className="font-semibold">{meal.horario}</p>
                          <p className="text-xs text-gray-600">
                            {food.nombre} - {meal.cantidad}g ({cals} kcal)
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMeal(index)}
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
                {editingDiet ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
