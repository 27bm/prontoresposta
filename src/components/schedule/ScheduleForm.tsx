
import React, { useState, useEffect } from 'react';
import { WorkSchedule } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleFormProps {
  schedule?: WorkSchedule;
  selectedDate: Date;
  onSave: (schedule: Omit<WorkSchedule, 'id'>) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export function ScheduleForm({ schedule, selectedDate, onSave, onDelete, onCancel }: ScheduleFormProps) {
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('19:00');
  const [totalHours, setTotalHours] = useState(12);
  const [type, setType] = useState<WorkSchedule['type']>('ordinaria');
  
  // Se houver uma escala para edição, carregue os dados
  useEffect(() => {
    if (schedule) {
      setStartTime(schedule.startTime);
      setEndTime(schedule.endTime);
      setTotalHours(schedule.totalHours);
      setType(schedule.type);
    }
  }, [schedule]);
  
  // Calcula as horas totais quando os horários mudam
  useEffect(() => {
    const calculateHours = () => {
      try {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
        
        // Se for negativo, assumimos que o horário de término é no dia seguinte
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60;
        }
        
        const hours = totalMinutes / 60;
        setTotalHours(parseFloat(hours.toFixed(1)));
      } catch (error) {
        console.error('Erro ao calcular as horas:', error);
      }
    };
    
    calculateHours();
  }, [startTime, endTime]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      date: selectedDate,
      startTime,
      endTime,
      totalHours,
      type,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h3 className="text-lg font-semibold text-center mb-3">
        {schedule ? 'Editar' : 'Adicionar'} registro para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Hora de início*</Label>
          <Input 
            id="startTime" 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Hora de término*</Label>
          <Input 
            id="endTime" 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalHours">Total de horas*</Label>
          <Input 
            id="totalHours" 
            type="number" 
            min="0" 
            step="0.5" 
            value={totalHours} 
            onChange={(e) => setTotalHours(parseFloat(e.target.value))} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de jornada*</Label>
          <Select 
            value={type}
            onValueChange={(val: WorkSchedule['type']) => setType(val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ordinaria">Ordinária</SelectItem>
              <SelectItem value="extra">Extra</SelectItem>
              <SelectItem value="outras">Outras</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <div>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          {schedule && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              className="ml-2" 
              onClick={() => onDelete(schedule.id)}
            >
              Excluir
            </Button>
          )}
        </div>
        <Button type="submit" className="bg-police-blue hover:bg-police-lightBlue">
          {schedule ? 'Atualizar' : 'Adicionar'} Registro
        </Button>
      </div>
    </form>
  );
}
