
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { WorkSchedule, ScaleType } from '../types/models';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO, addDays, isSameMonth, isWithinInterval, addHours } from 'date-fns';
import { toast } from 'sonner';

// Chave para armazenamento local
const SCHEDULE_STORAGE_KEY = 'prontoresposta_schedule_data';
const CURRENT_DATE_STORAGE_KEY = 'prontoresposta_current_date';

// Função para calcular horas trabalhadas para um mês específico
const calculateWorkHours = (schedule: WorkSchedule[], date: Date): number => {
  return schedule
    .filter(day => isSameMonth(new Date(day.date), date))
    .reduce((total, day) => {
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

// Helper function to parse time string to hours and minutes
const parseTimeString = (timeStr: string): { hours: number, minutes: number } => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

// Helper function to format hours and minutes to time string
const formatTimeString = (hours: number, minutes: number): string => {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Função para gerar um registro de escala com divisão na meia-noite se necessário
const generateWorkDayWithMidnightSplit = (
  date: Date,
  startTime: string,
  duration: number, // in hours
  type: WorkSchedule['type'] = 'ordinaria'
): WorkSchedule[] => {
  const result: WorkSchedule[] = [];
  const { hours: startHours, minutes: startMinutes } = parseTimeString(startTime);
  
  // Calculate end time based on duration
  let endHours = startHours + duration;
  const endMinutes = startMinutes;
  
  // Check if the shift crosses midnight
  if (endHours >= 24) {
    // First part - from start time to midnight
    const hoursUntilMidnight = 24 - startHours;
    
    result.push({
      id: `${date.getTime()}-part1`,
      date: new Date(date),
      startTime,
      endTime: '00:00',
      totalHours: hoursUntilMidnight,
      type
    });
    
    // Second part - from midnight to end time of the next day
    const remainingHours = duration - hoursUntilMidnight;
    const nextDay = addDays(date, 1);
    
    if (remainingHours > 0) {
      result.push({
        id: `${nextDay.getTime()}-part2`,
        date: nextDay,
        startTime: '00:00',
        endTime: formatTimeString(remainingHours, endMinutes),
        totalHours: remainingHours,
        type
      });
    }
  } else {
    // Shift doesn't cross midnight
    result.push({
      id: date.getTime().toString(),
      date: new Date(date),
      startTime,
      endTime: formatTimeString(endHours, endMinutes),
      totalHours: duration,
      type
    });
  }
  
  return result;
};

// Função para gerar uma escala automática
const generateSchedule = (
  startDate: Date,
  endDate: Date,
  scaleType: ScaleType,
  startTimeStr: string = '07:00'
): WorkSchedule[] => {
  const daysInInterval = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Iniciar com um array vazio
  const newSchedule: WorkSchedule[] = [];
  
  // Aplicar lógica baseada no tipo de escala
  if (scaleType === '12x36') {
    let isWorkDay = true; // Começa trabalhando
    let currentDate = new Date(startDate);
    
    // Percorre os dias no intervalo
    while (currentDate <= endDate) {
      if (isWorkDay) {
        const workDays = generateWorkDayWithMidnightSplit(
          new Date(currentDate),
          startTimeStr,
          12,
          'ordinaria'
        );
        
        newSchedule.push(...workDays);
      }
      
      // Alterna entre trabalho e folga a cada dia
      isWorkDay = !isWorkDay;
      // Avança um dia
      currentDate = addDays(currentDate, 1);
    }
  } else if (scaleType === '12x24_48') {
    // Implementação da escala 12x24/48
    // Padrão: trabalha de manhã, depois à noite, depois folga 48h
    let dayCount = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (dayCount % 4 === 0) {
        // Dia de trabalho - manhã
        const workDays = generateWorkDayWithMidnightSplit(
          new Date(currentDate),
          startTimeStr,
          12,
          'ordinaria'
        );
        
        newSchedule.push(...workDays);
      } else if (dayCount % 4 === 1) {
        // For night shift, we need to calculate different hours
        const nightStartHour = (parseTimeString(startTimeStr).hours + 12) % 24;
        const nightStartTimeStr = formatTimeString(nightStartHour, parseTimeString(startTimeStr).minutes);
        
        // Dia de trabalho - noite
        const workDays = generateWorkDayWithMidnightSplit(
          new Date(currentDate),
          nightStartTimeStr,
          12,
          'ordinaria'
        );
        
        newSchedule.push(...workDays);
      }
      // Os outros 2 dias são folga (48h)
      
      dayCount++;
      currentDate = addDays(currentDate, 1);
    }
  } else if (scaleType === '6x24') {
    // Nova implementação para escala 6x24 (6 horas por dia, todos os dias)
    daysInInterval.forEach(day => {
      const workDays = generateWorkDayWithMidnightSplit(
        new Date(day),
        startTimeStr,
        6, // 6 horas de duração
        'ordinaria'
      );
      
      newSchedule.push(...workDays);
    });
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
  generateAutomaticSchedule: (startDate: Date, endDate: Date, scaleType: ScaleType, startTime?: string) => void;
  totalWorkedHours: number;
  targetHours: number;
  overtimeHours: number;
  remainingHours: number;
  loading: boolean;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Tentar carregar a data atual do localStorage
    const savedDate = localStorage.getItem(CURRENT_DATE_STORAGE_KEY);
    if (savedDate) {
      try {
        return new Date(savedDate);
      } catch (error) {
        return new Date();
      }
    }
    return new Date();
  });
  
  const [schedule, setSchedule] = useState<WorkSchedule[]>(() => {
    // Tentar carregar a agenda do localStorage
    const savedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (savedSchedule) {
      try {
        const parsedSchedule = JSON.parse(savedSchedule);
        // Converter as strings de data de volta para objetos Date
        return parsedSchedule.map((day: any) => ({
          ...day,
          date: new Date(day.date)
        }));
      } catch (error) {
        console.error('Erro ao carregar agenda do localStorage:', error);
        return [];
      }
    }
    return [];
  });
  
  const [loading, setLoading] = useState(false);
  
  // Cálculo de horas agora é baseado no mês atual
  const totalWorkedHours = calculateWorkHours(schedule, currentDate);
  const targetHours = getMonthlyTargetHours(currentDate);
  const overtimeHours = Math.max(0, totalWorkedHours - targetHours);
  const remainingHours = Math.max(0, targetHours - totalWorkedHours);
  
  // Salvar alterações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
    } catch (error) {
      console.error('Erro ao salvar agenda no localStorage:', error);
    }
  }, [schedule]);
  
  // Salvar data atual no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_DATE_STORAGE_KEY, currentDate.toISOString());
    } catch (error) {
      console.error('Erro ao salvar data atual no localStorage:', error);
    }
  }, [currentDate]);
  
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
  
  const generateAutomaticSchedule = (startDate: Date, endDate: Date, scaleType: ScaleType, startTime: string = '07:00') => {
    setLoading(true);
    try {
      // Filtramos os dias que não estão no intervalo selecionado
      const daysOutsideInterval = schedule.filter(
        day => {
          const dayDate = new Date(day.date);
          return !isWithinInterval(dayDate, { start: startDate, end: endDate });
        }
      );
      
      // Geramos a nova escala para o intervalo selecionado
      const newScheduleDays = generateSchedule(startDate, endDate, scaleType, startTime);
      
      // Combinamos os dias fora do intervalo com os novos dias
      setSchedule([...daysOutsideInterval, ...newScheduleDays]);
      toast.success('Escala gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar escala:', error);
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
