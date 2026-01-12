import { useState } from 'react';
import { FoodItem, DietCategory } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Search, Plus, Edit, Trash2, Apple } from 'lucide-react';
import { toast } from 'sonner';

interface FoodManagerProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onUpdateFood: (id: string, updates: Partial<FoodItem>) => void;
  onDeleteFood: (id: string) => void;
}

export function FoodManager({ foods, onAddFood, onUpdateFood, onDeleteFood }: FoodManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    nombre: '',
    categoria: 'proteina',
    categoriaObjetivo: [],
    porcion: 100,
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    fibra: 0,
    notas: '',
  });

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || food.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openDialog = (food?: FoodItem) => {
    if (food) {
      setEditingFood(food);
      setFormData(food);
    } else {
      setEditingFood(null);
      setFormData({
        nombre: '',
        categoria: 'proteina',
        categoriaObjetivo: [],
        porcion: 100,
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
        fibra: 0,
        notas: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.calorias) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    if (editingFood) {
      onUpdateFood(editingFood.id, formData);
      toast.success('Alimento actualizado');
    } else {
      const newFood: FoodItem = {
        ...formData,
        id: crypto.randomUUID(),
      } as FoodItem;
      onAddFood(newFood);
      toast.success('Alimento agregado');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Eliminar ${nombre}?`)) {
      onDeleteFood(id);
      toast.success('Alimento eliminado');
    }
  };

  const toggleObjetivo = (objetivo: DietCategory) => {
    const current = formData.categoriaObjetivo || [];
    const updated = current.includes(objetivo)
      ? current.filter(o => o !== objetivo)
      : [...current, objetivo];
    setFormData({ ...formData, categoriaObjetivo: updated });
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      proteina: 'Proteína',
      carbohidrato: 'Carbohidrato',
      grasa: 'Grasa Saludable',
      vegetal: 'Vegetal',
      fruta: 'Fruta',
      lacteo: 'Lácteo',
      bebida: 'Bebida',
      otro: 'Otro',
    };
    return labels[cat] || cat;
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      proteina: 'bg-red-100 text-red-800',
      carbohidrato: 'bg-yellow-100 text-yellow-800',
      grasa: 'bg-orange-100 text-orange-800',
      vegetal: 'bg-green-100 text-green-800',
      fruta: 'bg-pink-100 text-pink-800',
      lacteo: 'bg-blue-100 text-blue-800',
      bebida: 'bg-cyan-100 text-cyan-800',
      otro: 'bg-gray-100 text-gray-800',
    };
    return colors[cat] || colors.otro;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar alimento..."
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
            <SelectItem value="proteina">Proteínas</SelectItem>
            <SelectItem value="carbohidrato">Carbohidratos</SelectItem>
            <SelectItem value="grasa">Grasas saludables</SelectItem>
            <SelectItem value="vegetal">Vegetales</SelectItem>
            <SelectItem value="fruta">Frutas</SelectItem>
            <SelectItem value="lacteo">Lácteos</SelectItem>
            <SelectItem value="bebida">Bebidas</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus className="size-4" />
          Nuevo Alimento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <Apple className="size-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No se encontraron alimentos</p>
          </Card>
        ) : (
          filteredFoods.map(food => (
            <Card key={food.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{food.nombre}</h3>
                  <Badge className={getCategoryColor(food.categoria)}>
                    {getCategoryLabel(food.categoria)}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openDialog(food)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(food.id, food.nombre)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Por {food.porcion}g</p>
                  <p className="text-lg font-bold">{food.calorias} kcal</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-red-50 p-2 rounded text-center">
                    <p className="font-semibold text-red-600">{food.proteinas}g</p>
                    <p className="text-gray-500">Proteínas</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="font-semibold text-green-600">{food.carbohidratos}g</p>
                    <p className="text-gray-500">Carbos</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <p className="font-semibold text-yellow-600">{food.grasas}g</p>
                    <p className="text-gray-500">Grasas</p>
                  </div>
                </div>

                {food.categoriaObjetivo.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">Adecuado para:</p>
                    <div className="flex flex-wrap gap-1">
                      {food.categoriaObjetivo.slice(0, 2).map(obj => (
                        <span key={obj} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {obj.replace('_', ' ')}
                        </span>
                      ))}
                      {food.categoriaObjetivo.length > 2 && (
                        <span className="text-xs text-gray-500">+{food.categoriaObjetivo.length - 2}</span>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFood ? 'Editar Alimento' : 'Nuevo Alimento'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre del alimento *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Pechuga de pollo"
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value: any) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proteina">Proteína</SelectItem>
                    <SelectItem value="carbohidrato">Carbohidrato</SelectItem>
                    <SelectItem value="grasa">Grasa Saludable</SelectItem>
                    <SelectItem value="vegetal">Vegetal</SelectItem>
                    <SelectItem value="fruta">Fruta</SelectItem>
                    <SelectItem value="lacteo">Lácteo</SelectItem>
                    <SelectItem value="bebida">Bebida</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Adecuado para objetivos:</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(['bajar_peso', 'subir_peso', 'definir', 'ganar_musculo', 'mantener', 'salud_cardiovascular'] as DietCategory[]).map(obj => (
                  <div key={obj} className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.categoriaObjetivo?.includes(obj)}
                      onCheckedChange={() => toggleObjetivo(obj)}
                    />
                    <label className="text-sm capitalize">{obj.replace('_', ' ')}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Porción (g) *</Label>
                <Input
                  type="number"
                  value={formData.porcion}
                  onChange={(e) => setFormData({ ...formData, porcion: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Calorías *</Label>
                <Input
                  type="number"
                  value={formData.calorias}
                  onChange={(e) => setFormData({ ...formData, calorias: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Fibra (g)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.fibra}
                  onChange={(e) => setFormData({ ...formData, fibra: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Proteínas (g) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.proteinas}
                  onChange={(e) => setFormData({ ...formData, proteinas: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Carbohidratos (g) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.carbohidratos}
                  onChange={(e) => setFormData({ ...formData, carbohidratos: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Grasas (g) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.grasas}
                  onChange={(e) => setFormData({ ...formData, grasas: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingFood ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
