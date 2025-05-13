
import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { WorkSchedule } from '@/types/models';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyCalendarProps {
  currentDate: Date;
  schedule: WorkSchedule[];
  onChangeMonth: (date: Date) => void;
  onSelectDay: (date: Date) => void;
}

export function MonthlyCalendar({
  currentDate,
  schedule,
  onChangeMonth,
  onSelectDay,
}: MonthlyCalendarProps) {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // Obtém o dia da semana do primeiro dia do mês (0 = domingo, 1 = segunda, etc.)
  const startDay = firstDayOfMonth.getDay();
  
  // Nomes dos dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Função para obter todos os registros de escala para um dia
  const getSchedulesForDay = (day: Date) => {
    return schedule.filter(scheduleDay => 
      isSameDay(new Date(scheduleDay.date), day)
    );
  };
  
  // Função para formatar horas (por exemplo, "12h")
  const formatHours = (hours: number) => {
    return `${hours}h`;
  };
  
  // Função para obter a cor de fundo baseada no tipo de jornada
  const getScheduleColorClass = (type: WorkSchedule['type']) => {
    switch (type) {
      case 'ordinaria':
        return 'bg-blue-100 text-blue-800';
      case 'extra':
        return 'bg-green-100 text-green-800';
      case 'outras':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter a cor do badge de horas baseada no tipo
  const getBadgeColorClass = (type: WorkSchedule['type']) => {
    switch (type) {
      case 'ordinaria':
        return 'bg-blue-500';
      case 'extra':
        return 'bg-green-500';
      case 'outras':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Calcular a soma total de horas para um dia
  const getTotalHoursForDay = (schedules: WorkSchedule[]) => {
    return schedules.reduce((total, schedule) => total + schedule.totalHours, 0);
  };
  
  // Navegar para o mês anterior
  const handlePreviousMonth = () => {
    const previousMonth = subMonths(currentDate, 1);
    onChangeMonth(previousMonth);
  };
  
  // Navegar para o próximo mês
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    onChangeMonth(nextMonth);
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <div className="bg-police-blue text-white p-3 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h2 className="text-xl font-bold">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="text-white hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium text-gray-600 border-b"
          >
            {day}
          </div>
        ))}
        
        {/* Espaços vazios até o dia inicial do mês */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="border p-2" />
        ))}
        
        {/* Dias do mês */}
        {daysInMonth.map(day => {
          const schedulesForDay = getSchedulesForDay(day);
          const totalHours = getTotalHoursForDay(schedulesForDay);
          const hasMultipleSchedules = schedulesForDay.length > 1;
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border p-1 cursor-pointer transition-colors hover:bg-gray-50",
                isToday(day) ? 'bg-blue-50' : '',
                // Aumento da altura mínima para acomodar mais informações
                "min-h-[85px] md:min-h-[100px]"
              )}
              onClick={() => onSelectDay(day)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isToday(day) ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                  )}
                >
                  {format(day, 'd')}
                </span>
                
                {schedulesForDay.length > 0 && (
                  <span className={cn(
                    "text-xs font-semibold text-white rounded-sm px-1",
                    getBadgeColorClass(
                      // Se houver diferentes tipos, mostrar uma cor neutra
                      hasMultipleSchedules ? 'outras' : schedulesForDay[0].type
                    )
                  )}>
                    {formatHours(totalHours)}
                  </span>
                )}
              </div>
              
              {/* Exibir todos os horários de trabalho para este dia */}
              {schedulesForDay.length > 0 && (
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px] md:max-h-[70px] text-xs">
                  {schedulesForDay.map((scheduleData, index) => (
                    <div 
                      key={`${day.toISOString()}-${index}`} 
                      className={cn(
                        "rounded p-1 text-center truncate",
                        getScheduleColorClass(scheduleData.type)
                      )}
                    >
                      {scheduleData.startTime} - {scheduleData.endTime}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
