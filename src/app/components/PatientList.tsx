import { useState } from 'react';
import { Patient } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, UserPlus, User, Activity, TrendingDown, TrendingUp } from 'lucide-react';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export function PatientList({ patients, onSelectPatient, onAddPatient }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = patients.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getObjetivoIcon = (categoria: string) => {
    switch (categoria) {
      case 'bajar_peso':
        return <TrendingDown className="size-4" />;
      case 'subir_peso':
      case 'ganar_musculo':
        return <TrendingUp className="size-4" />;
      default:
        return <Activity className="size-4" />;
    }
  };
  
  const getObjetivoLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      bajar_peso: 'Bajar peso',
      subir_peso: 'Subir peso',
      definir: 'Definir',
      mantener: 'Mantener',
      ganar_musculo: 'Ganar músculo',
      salud_cardiovascular: 'Salud cardiovascular',
    };
    return labels[categoria] || categoria;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onAddPatient} className="gap-2">
          <UserPlus className="size-4" />
          Nuevo Paciente
        </Button>
      </div>
      
      <div className="grid gap-4">
        {filteredPatients.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="size-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
            </p>
          </Card>
        ) : (
          filteredPatients.map(patient => (
            <Card
              key={patient.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectPatient(patient)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {patient.nombre} {patient.apellidos}
                    </h3>
                    <Badge variant={patient.genero === 'masculino' ? 'default' : 'secondary'}>
                      {patient.genero === 'masculino' ? 'Masculino' : 'Femenino'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Edad</p>
                      <p className="font-medium">{patient.edad} años</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Peso actual</p>
                      <p className="font-medium">{patient.mediciones.peso} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-500">IMC</p>
                      <p className="font-medium">{patient.mediciones.imc?.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Objetivo</p>
                      <div className="flex items-center gap-1 font-medium">
                        {getObjetivoIcon(patient.objetivos.categoria)}
                        <span>{patient.objetivos.pesoObjetivo} kg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      {getObjetivoIcon(patient.objetivos.categoria)}
                      {getObjetivoLabel(patient.objetivos.categoria)}
                    </Badge>
                    {patient.ultimaConsulta && (
                      <span className="text-xs text-gray-500">
                        Última consulta: {new Date(patient.ultimaConsulta).toLocaleDateString('es-MX')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
