
import React, { useState } from 'react';
import { MonthlyCalendar } from '@/components/schedule/MonthlyCalendar';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { useSchedule } from '@/contexts/ScheduleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScaleType } from '@/types/models';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownCircle } from 'lucide-react';

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWorkdayId, setSelectedWorkdayId] = useState<string | null>(null);
  const [scaleType, setScaleType] = useState<ScaleType>('12x36');
  
  // Manipular seleção de dia no calendário
  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    
    // Verificar se já existe um registro para este dia
    const existingDay = schedule.find(day => 
      format(new Date(day.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    if (existingDay) {
      setSelectedWorkdayId(existingDay.id);
    } else {
      setSelectedWorkdayId(null);
    }
    
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
      setIsFormOpen(false);
    }
  };
  
  // Manipular geração automática de escala
  const handleGenerateScale = () => {
    generateAutomaticSchedule(currentDate, scaleType);
    setIsScaleDialogOpen(false);
  };
  
  // Obter o registro de trabalho atual selecionado
  const getCurrentWorkday = () => {
    if (!selectedWorkdayId) return undefined;
    return schedule.find(day => day.id === selectedWorkdayId);
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
                <span className="text-sm text-gray-600">Meta mensal</span>
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
            
            <Button
              onClick={() => setIsScaleDialogOpen(true)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowDownCircle className="h-4 w-4" />
              Gerar Escala Automática
            </Button>
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
            onSave={(workDay) => {
              if (selectedWorkdayId) {
                updateWorkDay(selectedWorkdayId, workDay);
              } else {
                addWorkDay(workDay);
              }
              setIsFormOpen(false);
            }}
            onDelete={handleDelete}
            onCancel={() => setIsFormOpen(false)}
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
              Esta ação irá gerar automaticamente uma escala de trabalho para o mês atual 
              baseada no tipo de escala selecionado. Qualquer registro existente será substituído.
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-500">
                <strong>Escala 12x36:</strong> Trabalha 12 horas e folga 36 horas.<br />
                <strong>Escala 12x24/48:</strong> Trabalha 12 horas de manhã, depois 12 horas à noite, depois folga 48 horas.
              </p>
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
    </div>
  );
}

export default SchedulePage;
