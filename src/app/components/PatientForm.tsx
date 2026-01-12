import { useState } from 'react';
import { Patient, Gender, ActivityLevel, DietCategory } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { completeAnthropometricCalculations } from '../utils/calculations';
import { toast } from 'sonner';

interface PatientFormProps {
  patient?: Patient;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

export function PatientForm({ patient, onSave, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState<Partial<Patient>>(
    patient || {
      nombre: '',
      apellidos: '',
      genero: 'masculino',
      edad: 0,
      fechaNacimiento: '',
      telefono: '',
      email: '',
      ocupacion: '',
      historialMedico: {
        enfermedadesCronicas: [],
        alergias: [],
        medicamentosActuales: [],
        cirugiasAnteriores: [],
        antecedentesHeredofamiliares: '',
      },
      estiloVida: {
        consumeAlcohol: false,
        fumador: false,
        nivelActividad: 'sedentario',
        horasSueno: 7,
        nivelEstres: 5,
      },
      mediciones: {
        id: crypto.randomUUID(),
        fecha: new Date().toISOString(),
        peso: 0,
        altura: 0,
      },
      historialMediciones: [],
      objetivos: {
        pesoObjetivo: 0,
        grasaCorporalObjetivo: 20,
        categoria: 'mantener',
        notasObjetivos: '',
      },
      evaluacionDietetica: {
        recordatorio24hrs: '',
        frecuenciaConsumo: '',
        preferenciasAlimentarias: [],
        alimentosNoGustan: [],
        restriccionesDieteticas: [],
      },
      consultasNotas: [],
      fechaRegistro: new Date().toISOString(),
    }
  );

  const [enfermedadInput, setEnfermedadInput] = useState('');
  const [alergiaInput, setAlergiaInput] = useState('');
  const [medicamentoInput, setMedicamentoInput] = useState('');
  const [cirugiaInput, setCirugiaInput] = useState('');

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof Patient] as any),
        [field]: value,
      },
    }));
  };

  const addToArray = (parent: string, field: string, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;
    const current = (formData[parent as keyof Patient] as any)[field] || [];
    updateNestedField(parent, field, [...current, value.trim()]);
    setter('');
  };

  const removeFromArray = (parent: string, field: string, index: number) => {
    const current = (formData[parent as keyof Patient] as any)[field] || [];
    updateNestedField(parent, field, current.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = () => {
    // Validaciones
    if (!formData.nombre || !formData.apellidos || !formData.edad) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }

    if (!formData.mediciones?.peso || !formData.mediciones?.altura) {
      toast.error('Por favor ingrese peso y altura');
      return;
    }

    try {
      // Completar cálculos antropométricos
      const medicionesCompletas = completeAnthropometricCalculations(
        formData.mediciones!,
        formData.edad!,
        formData.genero!,
        formData.estiloVida!.nivelActividad
      );

      const patientToSave: Patient = {
        ...formData,
        id: formData.id || crypto.randomUUID(),
        mediciones: medicionesCompletas,
        historialMediciones: patient
          ? [...patient.historialMediciones, medicionesCompletas]
          : [medicionesCompletas],
        ultimaConsulta: new Date().toISOString(),
      } as Patient;

      onSave(patientToSave);
      toast.success(patient ? 'Paciente actualizado' : 'Paciente registrado exitosamente');
    } catch (error) {
      toast.error('Error al guardar paciente');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="medico">Médico</TabsTrigger>
          <TabsTrigger value="mediciones">Mediciones</TabsTrigger>
          <TabsTrigger value="estilo">Estilo de Vida</TabsTrigger>
          <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
        </TabsList>

        {/* Información Personal */}
        <TabsContent value="personal">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => updateFormField('nombre', e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div>
                <Label>Apellidos *</Label>
                <Input
                  value={formData.apellidos}
                  onChange={(e) => updateFormField('apellidos', e.target.value)}
                  placeholder="Apellidos"
                />
              </div>
              <div>
                <Label>Género *</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) => updateFormField('genero', value as Gender)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fecha de Nacimiento *</Label>
                <Input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => {
                    updateFormField('fechaNacimiento', e.target.value);
                    const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                    updateFormField('edad', age);
                  }}
                />
              </div>
              <div>
                <Label>Edad</Label>
                <Input
                  type="number"
                  value={formData.edad}
                  onChange={(e) => updateFormField('edad', parseInt(e.target.value))}
                  placeholder="Edad"
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={formData.telefono}
                  onChange={(e) => updateFormField('telefono', e.target.value)}
                  placeholder="Teléfono"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormField('email', e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div>
                <Label>Ocupación</Label>
                <Input
                  value={formData.ocupacion}
                  onChange={(e) => updateFormField('ocupacion', e.target.value)}
                  placeholder="Ocupación"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Historial Médico */}
        <TabsContent value="medico">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Historial Médico</h3>
            <div className="space-y-6">
              {/* Enfermedades Crónicas */}
              <div>
                <Label>Enfermedades Crónicas</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={enfermedadInput}
                    onChange={(e) => setEnfermedadInput(e.target.value)}
                    placeholder="Agregar enfermedad"
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('historialMedico', 'enfermedadesCronicas', enfermedadInput, setEnfermedadInput)}
                  />
                  <Button onClick={() => addToArray('historialMedico', 'enfermedadesCronicas', enfermedadInput, setEnfermedadInput)}>
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.historialMedico?.enfermedadesCronicas?.map((item, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {item}
                      <button onClick={() => removeFromArray('historialMedico', 'enfermedadesCronicas', index)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Alergias */}
              <div>
                <Label>Alergias</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={alergiaInput}
                    onChange={(e) => setAlergiaInput(e.target.value)}
                    placeholder="Agregar alergia"
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('historialMedico', 'alergias', alergiaInput, setAlergiaInput)}
                  />
                  <Button onClick={() => addToArray('historialMedico', 'alergias', alergiaInput, setAlergiaInput)}>
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.historialMedico?.alergias?.map((item, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {item}
                      <button onClick={() => removeFromArray('historialMedico', 'alergias', index)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Medicamentos */}
              <div>
                <Label>Medicamentos Actuales</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={medicamentoInput}
                    onChange={(e) => setMedicamentoInput(e.target.value)}
                    placeholder="Agregar medicamento"
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('historialMedico', 'medicamentosActuales', medicamentoInput, setMedicamentoInput)}
                  />
                  <Button onClick={() => addToArray('historialMedico', 'medicamentosActuales', medicamentoInput, setMedicamentoInput)}>
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.historialMedico?.medicamentosActuales?.map((item, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {item}
                      <button onClick={() => removeFromArray('historialMedico', 'medicamentosActuales', index)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Cirugías */}
              <div>
                <Label>Cirugías Anteriores</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={cirugiaInput}
                    onChange={(e) => setCirugiaInput(e.target.value)}
                    placeholder="Agregar cirugía"
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('historialMedico', 'cirugiasAnteriores', cirugiaInput, setCirugiaInput)}
                  />
                  <Button onClick={() => addToArray('historialMedico', 'cirugiasAnteriores', cirugiaInput, setCirugiaInput)}>
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.historialMedico?.cirugiasAnteriores?.map((item, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {item}
                      <button onClick={() => removeFromArray('historialMedico', 'cirugiasAnteriores', index)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Antecedentes */}
              <div>
                <Label>Antecedentes Heredofamiliares</Label>
                <Textarea
                  value={formData.historialMedico?.antecedentesHeredofamiliares}
                  onChange={(e) => updateNestedField('historialMedico', 'antecedentesHeredofamiliares', e.target.value)}
                  placeholder="Diabetes, hipertensión, obesidad en familiares, etc."
                  rows={3}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Mediciones Antropométricas */}
        <TabsContent value="mediciones">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mediciones Antropométricas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Peso (kg) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.peso || ''}
                  onChange={(e) => updateNestedField('mediciones', 'peso', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Altura (cm) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.altura || ''}
                  onChange={(e) => updateNestedField('mediciones', 'altura', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>% Grasa Corporal</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.grasaCorporalPorcentaje || ''}
                  onChange={(e) => updateNestedField('mediciones', 'grasaCorporalPorcentaje', parseFloat(e.target.value))}
                />
              </div>

              <h4 className="col-span-3 font-semibold mt-4">Perímetros (cm)</h4>
              <div>
                <Label>Cintura</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.perimetroCintura || ''}
                  onChange={(e) => updateNestedField('mediciones', 'perimetroCintura', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Cadera</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.perimetroCadera || ''}
                  onChange={(e) => updateNestedField('mediciones', 'perimetroCadera', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Cuello</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.perimetroCuello || ''}
                  onChange={(e) => updateNestedField('mediciones', 'perimetroCuello', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Brazo</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.perimetroBrazo || ''}
                  onChange={(e) => updateNestedField('mediciones', 'perimetroBrazo', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Muslo</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.perimetroMuslo || ''}
                  onChange={(e) => updateNestedField('mediciones', 'perimetroMuslo', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Pantorrilla</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.perimetroPantorrilla || ''}
                  onChange={(e) => updateNestedField('mediciones', 'perimetroPantorrilla', parseFloat(e.target.value))}
                />
              </div>

              <h4 className="col-span-3 font-semibold mt-4">Pliegues Cutáneos (mm)</h4>
              <div>
                <Label>Tríceps</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.plieguesTricipital || ''}
                  onChange={(e) => updateNestedField('mediciones', 'plieguesTricipital', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Subescapular</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.plieguesSubescapular || ''}
                  onChange={(e) => updateNestedField('mediciones', 'plieguesSubescapular', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Suprailiaco</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.plieguesSuprailiaco || ''}
                  onChange={(e) => updateNestedField('mediciones', 'plieguesSuprailiaco', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Abdominal</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.mediciones?.plieguesAbdominal || ''}
                  onChange={(e) => updateNestedField('mediciones', 'plieguesAbdominal', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Estilo de Vida */}
        <TabsContent value="estilo">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estilo de Vida</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.estiloVida?.consumeAlcohol}
                  onCheckedChange={(checked) => updateNestedField('estiloVida', 'consumeAlcohol', checked)}
                />
                <Label>¿Consume alcohol?</Label>
              </div>
              {formData.estiloVida?.consumeAlcohol && (
                <div>
                  <Label>Frecuencia de consumo</Label>
                  <Input
                    value={formData.estiloVida?.frecuenciaAlcohol || ''}
                    onChange={(e) => updateNestedField('estiloVida', 'frecuenciaAlcohol', e.target.value)}
                    placeholder="Ej: 1-2 veces por semana"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.estiloVida?.fumador}
                  onCheckedChange={(checked) => updateNestedField('estiloVida', 'fumador', checked)}
                />
                <Label>¿Fumador?</Label>
              </div>
              {formData.estiloVida?.fumador && (
                <div>
                  <Label>Cigarrillos por día</Label>
                  <Input
                    type="number"
                    value={formData.estiloVida?.cigarrillosPorDia || ''}
                    onChange={(e) => updateNestedField('estiloVida', 'cigarrillosPorDia', parseInt(e.target.value))}
                  />
                </div>
              )}

              <div>
                <Label>Nivel de Actividad Física</Label>
                <Select
                  value={formData.estiloVida?.nivelActividad}
                  onValueChange={(value) => updateNestedField('estiloVida', 'nivelActividad', value as ActivityLevel)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentario (poco o ningún ejercicio)</SelectItem>
                    <SelectItem value="ligero">Ligero (ejercicio 1-3 días/semana)</SelectItem>
                    <SelectItem value="moderado">Moderado (ejercicio 3-5 días/semana)</SelectItem>
                    <SelectItem value="activo">Activo (ejercicio 6-7 días/semana)</SelectItem>
                    <SelectItem value="muy_activo">Muy Activo (ejercicio intenso diario)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Horas de sueño promedio</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.estiloVida?.horasSueno}
                  onChange={(e) => updateNestedField('estiloVida', 'horasSueno', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <Label>Nivel de estrés (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.estiloVida?.nivelEstres}
                  onChange={(e) => updateNestedField('estiloVida', 'nivelEstres', parseInt(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Objetivos */}
        <TabsContent value="objetivos">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Objetivos Nutricionales</h3>
            <div className="space-y-4">
              <div>
                <Label>Categoría de Objetivo</Label>
                <Select
                  value={formData.objetivos?.categoria}
                  onValueChange={(value) => updateNestedField('objetivos', 'categoria', value as DietCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajar_peso">Bajar de peso</SelectItem>
                    <SelectItem value="subir_peso">Subir de peso</SelectItem>
                    <SelectItem value="definir">Definición muscular</SelectItem>
                    <SelectItem value="ganar_musculo">Ganar músculo</SelectItem>
                    <SelectItem value="mantener">Mantener peso</SelectItem>
                    <SelectItem value="salud_cardiovascular">Salud cardiovascular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Peso Objetivo (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.objetivos?.pesoObjetivo}
                  onChange={(e) => updateNestedField('objetivos', 'pesoObjetivo', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <Label>Grasa Corporal Objetivo (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.objetivos?.grasaCorporalObjetivo}
                  onChange={(e) => updateNestedField('objetivos', 'grasaCorporalObjetivo', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <Label>Fecha Objetivo (opcional)</Label>
                <Input
                  type="date"
                  value={formData.objetivos?.fechaObjetivo || ''}
                  onChange={(e) => updateNestedField('objetivos', 'fechaObjetivo', e.target.value)}
                />
              </div>

              <div>
                <Label>Notas sobre objetivos</Label>
                <Textarea
                  value={formData.objetivos?.notasObjetivos}
                  onChange={(e) => updateNestedField('objetivos', 'notasObjetivos', e.target.value)}
                  placeholder="Notas adicionales sobre los objetivos del paciente"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {patient ? 'Actualizar' : 'Guardar'} Paciente
        </Button>
      </div>
    </div>
  );
}
