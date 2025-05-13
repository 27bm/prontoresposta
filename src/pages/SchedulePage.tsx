import React, { useState, useEffect } from 'react';
import { MonthlyCalendar } from '@/components/schedule/MonthlyCalendar';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { useSchedule } from '@/contexts/ScheduleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScaleType } from '@/types/models';
import { format, parseISO, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownCircle, Calendar, Clock, Trash2, Plus } from 'lucide-react';

export function SchedulePage() {
  const {
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
    loading,
  } = useSchedule();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScaleDialogOpen, setIsScaleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearMonthDialogOpen, setIsClearMonthDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWorkdayId, setSelectedWorkdayId] = useState<string | null>(null);
  const [scaleType, setScaleType] = useState<ScaleType>('12x36');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState<string>('07:00');
  
  // Manipular seleção de dia no calendário
  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    
    // Para múltiplos registros por dia, não precisamos mais selecionar um único registro
    setSelectedWorkdayId(null);
    
    setIsFormOpen(true);
  };
  
  // Manipular exclusão de dia de trabalho
  const handleDelete = (id: string) => {
    setSelectedWorkdayId(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (selectedWorkdayId) {
      deleteWorkDay(selectedWorkdayId);
      setSelectedWorkdayId(null);
      setIsDeleteDialogOpen(false);
      
      // Se excluir, não fechar o formulário para permitir adicionar outro registro
      // Só fecha se não houver mais registros para o dia
      const remainingSchedulesForDay = schedule.filter(day => 
        isSameDay(new Date(day.date), selectedDate) && day.id !== selectedWorkdayId
      );
      
      if (remainingSchedulesForDay.length === 0) {
        setIsFormOpen(false);
      }
    }
  };
  
  // Manipular geração automática de escala
  const handleGenerateScale = () => {
    // Converter as strings de data em objetos Date
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Modificar o contexto para passar também o horário inicial
    generateAutomaticSchedule(start, end, scaleType, startTime);
    setIsScaleDialogOpen(false);
  };
  
  // Limpar os registros do mês atual
  const handleClearMonth = () => {
    setIsClearMonthDialogOpen(true);
  };
  
  // Confirmar limpeza dos registros do mês
  const handleConfirmClearMonth = () => {
    // Filtrar os registros que não são do mês atual
    const updatedSchedule = schedule.filter(day => {
      const dayDate = new Date(day.date);
      return !isSameMonth(dayDate, currentDate);
    });
    
    // Atualizar o localStorage diretamente para manter consistência
    try {
      localStorage.setItem('prontoresposta_schedule_data', JSON.stringify(updatedSchedule));
      // Forçar um reload da página para atualizar os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao limpar registros do mês:', error);
    }
    
    setIsClearMonthDialogOpen(false);
  };
  
  // Obter o registro de trabalho atual selecionado
  const getCurrentWorkday = () => {
    if (!selectedWorkdayId) return undefined;
    return schedule.find(day => day.id === selectedWorkdayId);
  };
  
  // Obter todos os registros para a data selecionada
  const getSchedulesForSelectedDate = () => {
    return schedule.filter(day => 
      isSameDay(new Date(day.date), selectedDate)
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <MonthlyCalendar
              currentDate={currentDate}
              schedule={schedule}
              onChangeMonth={setCurrentDate}
              onSelectDay={handleSelectDay}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Resumo do Mês</h3>
              <p className="text-sm text-gray-500">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Horas trabalhadas</span>
                <span className="font-semibold">{totalWorkedHours}h</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Carga horária</span>
                <span className="font-semibold">{targetHours}h</span>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-full rounded-full ${
                    totalWorkedHours >= targetHours ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalWorkedHours / targetHours) * 100)}%` }}
                ></div>
              </div>
              
              {overtimeHours > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm">Horas extras</span>
                  <span className="font-semibold">+{overtimeHours}h</span>
                </div>
              )}
              
              {remainingHours > 0 && (
                <div className="flex justify-between items-center text-blue-600">
                  <span className="text-sm">Horas restantes</span>
                  <span className="font-semibold">-{remainingHours}h</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={() => setIsScaleDialogOpen(true)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowDownCircle className="h-4 w-4" />
                Gerar Escala Automática
              </Button>
              
              <Button
                onClick={handleClearMonth}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-red-200 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Registros do Mês
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Modal do formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {getCurrentWorkday() ? 'Editar' : 'Adicionar'} Jornada de Trabalho
            </DialogTitle>
          </DialogHeader>
          <ScheduleForm
            schedule={getCurrentWorkday()}
            selectedDate={selectedDate}
            existingSchedules={selectedWorkdayId ? getSchedulesForSelectedDate().filter(s => s.id !== selectedWorkdayId) : getSchedulesForSelectedDate()}
            onSave={(workDay) => {
              if (selectedWorkdayId) {
                updateWorkDay(selectedWorkdayId, workDay);
              } else {
                addWorkDay(workDay);
              }
              
              // Manter o modal aberto após adicionar para permitir vários registros
              if (selectedWorkdayId) {
                setIsFormOpen(false); // Fecha apenas se estiver editando
                setSelectedWorkdayId(null);
              } else {
                // Resetar campos para um novo registro
                setSelectedWorkdayId(null);
              }
            }}
            onDelete={handleDelete}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedWorkdayId(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal de geração de escala */}
      <Dialog open={isScaleDialogOpen} onOpenChange={setIsScaleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gerar Escala Automática</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p>
              Esta ação irá gerar automaticamente uma escala de trabalho baseada no tipo de escala selecionado.
              Selecione o período e o horário inicial para gerar a escala.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tipo de escala</h3>
              <Select
                value={scaleType}
                onValueChange={(value: ScaleType) => setScaleType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de escala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12x36">Escala 12x36</SelectItem>
                  <SelectItem value="12x24_48">Escala 12x24/48</SelectItem>
                  <SelectItem value="6x24">Escala 6x24</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data inicial</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Data final</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário inicial</Label>
              <div className="relative">
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-9"
                  required
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setIsScaleDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGenerateScale} className="bg-police-blue hover:bg-police-lightBlue">
                Gerar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de trabalho? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo de confirmação para limpar o mês */}
      <AlertDialog open={isClearMonthDialogOpen} onOpenChange={setIsClearMonthDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar registros do mês</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover todos os registros de trabalho do mês de {format(currentDate, 'MMMM yyyy', { locale: ptBR })}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmClearMonth}>
              Limpar Registros
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SchedulePage;
