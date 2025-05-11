
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { WorkSchedule, ScaleType } from '../types/models';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO, addDays } from 'date-fns';
import { toast } from 'sonner';

// Função para calcular horas trabalhadas
const calculateWorkHours = (schedule: WorkSchedule[]): number => {
  return schedule.reduce((total, day) => {
    return total + day.totalHours;
  }, 0);
};

// Função para determinar a carga horária mensal baseada nos dias no mês
const getMonthlyTargetHours = (date: Date): number => {
  const daysInMonth = endOfMonth(date).getDate();
  
  if (daysInMonth === 28) return 160;
  if (daysInMonth === 29) return 165;
  if (daysInMonth === 30) return 171;
  return 177; // 31 days
};

// Função para gerar uma escala automática
const generateSchedule = (
  startDate: Date,
  scaleType: ScaleType
): WorkSchedule[] => {
  const currentMonth = startDate.getMonth();
  const currentYear = startDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = endOfMonth(firstDay);
  
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  // Iniciar com um array vazio
  const newSchedule: WorkSchedule[] = [];
  
  // Aplicar lógica baseada no tipo de escala
  if (scaleType === '12x36') {
    let isWorkDay = true; // Começa trabalhando
    let currentDate = new Date(startDate);
    
    // Percorre todos os dias do mês
    while (currentDate.getMonth() === currentMonth) {
      if (isWorkDay) {
        newSchedule.push({
          id: currentDate.getTime().toString(),
          date: new Date(currentDate),
          startTime: '07:00',
          endTime: '19:00',
          totalHours: 12,
          type: 'regular'
        });
      }
      
      // Alterna entre trabalho e folga a cada dia
      isWorkDay = !isWorkDay;
      // Avança um dia
      currentDate = addDays(currentDate, 1);
    }
  } else if (scaleType === '12x24') {
    // Implementação da escala 12x24
    let dayCount = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate.getMonth() === currentMonth) {
      if (dayCount % 3 === 0 || dayCount % 3 === 2) {
        newSchedule.push({
          id: currentDate.getTime().toString(),
          date: new Date(currentDate),
          startTime: dayCount % 3 === 0 ? '07:00' : '19:00',
          endTime: dayCount % 3 === 0 ? '19:00' : '07:00',
          totalHours: 12,
          type: 'regular'
        });
      }
      
      dayCount++;
      currentDate = addDays(currentDate, 1);
    }
  } else if (scaleType === '12x48') {
    // Implementação da escala 12x48
    let dayCount = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate.getMonth() === currentMonth) {
      if (dayCount % 3 === 0) {
        newSchedule.push({
          id: currentDate.getTime().toString(),
          date: new Date(currentDate),
          startTime: '07:00',
          endTime: '19:00',
          totalHours: 12,
          type: 'regular'
        });
      }
      
      dayCount++;
      currentDate = addDays(currentDate, 1);
    }
  }
  
  return newSchedule;
};

interface ScheduleContextType {
  schedule: WorkSchedule[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  addWorkDay: (workDay: Omit<WorkSchedule, 'id'>) => void;
  updateWorkDay: (id: string, workDay: Partial<WorkSchedule>) => void;
  deleteWorkDay: (id: string) => void;
  generateAutomaticSchedule: (startDate: Date, scaleType: ScaleType) => void;
  totalWorkedHours: number;
  targetHours: number;
  overtimeHours: number;
  remainingHours: number;
  loading: boolean;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [schedule, setSchedule] = useState<WorkSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  
  const totalWorkedHours = calculateWorkHours(schedule);
  const targetHours = getMonthlyTargetHours(currentDate);
  const overtimeHours = Math.max(0, totalWorkedHours - targetHours);
  const remainingHours = Math.max(0, targetHours - totalWorkedHours);
  
  const addWorkDay = (workDay: Omit<WorkSchedule, 'id'>) => {
    setLoading(true);
    try {
      const newWorkDay: WorkSchedule = {
        ...workDay,
        id: Date.now().toString(),
      };
      setSchedule([...schedule, newWorkDay]);
      toast.success('Dia de trabalho adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar dia de trabalho');
    } finally {
      setLoading(false);
    }
  };
  
  const updateWorkDay = (id: string, updatedFields: Partial<WorkSchedule>) => {
    setLoading(true);
    try {
      const updatedSchedule = schedule.map(day => {
        if (day.id === id) {
          return { ...day, ...updatedFields };
        }
        return day;
      });
      setSchedule(updatedSchedule);
      toast.success('Dia de trabalho atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dia de trabalho');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteWorkDay = (id: string) => {
    setLoading(true);
    try {
      setSchedule(schedule.filter(day => day.id !== id));
      toast.success('Dia de trabalho removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover dia de trabalho');
    } finally {
      setLoading(false);
    }
  };
  
  const generateAutomaticSchedule = (startDate: Date, scaleType: ScaleType) => {
    setLoading(true);
    try {
      const newSchedule = generateSchedule(startDate, scaleType);
      setSchedule(newSchedule);
      toast.success('Escala gerada com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar escala');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScheduleContext.Provider value={{
      schedule,
      currentDate,
      setCurrentDate,
      addWorkDay,
      updateWorkDay,
      deleteWorkDay,
      generateAutomaticSchedule,
      totalWorkedHours,
      targetHours,
      overtimeHours,
      remainingHours,
      loading
    }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
