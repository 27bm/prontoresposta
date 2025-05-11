
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TafFormData, Gender, AgeRange } from '@/types/taf';

interface TafFormProps {
  onSubmit: (data: TafFormData) => void;
  defaultValues?: Partial<TafFormData>;
}

export function TafForm({ onSubmit, defaultValues }: TafFormProps) {
  const [gender, setGender] = useState<Gender>(defaultValues?.gender || 'male');
  const [ageRange, setAgeRange] = useState<AgeRange>(defaultValues?.ageRange || 'up_to_27');
  const [barPullups, setBarPullups] = useState<number | undefined>(defaultValues?.barPullups);
  const [barIsometry, setBarIsometry] = useState<number | undefined>(defaultValues?.barIsometry);
  const [situps, setSitups] = useState<number>(defaultValues?.situps || 0);
  const [runningDistance, setRunningDistance] = useState<number>(defaultValues?.runningDistance || 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      gender,
      ageRange,
      barPullups: gender === 'male' ? barPullups : undefined,
      barIsometry: gender === 'female' ? barIsometry : undefined,
      situps,
      runningDistance
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Sexo</Label>
        <RadioGroup 
          value={gender} 
          onValueChange={(val) => setGender(val as Gender)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Masculino</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Feminino</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ageRange">Faixa Etária</Label>
        <Select value={ageRange} onValueChange={(val) => setAgeRange(val as AgeRange)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a faixa etária" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="up_to_27">Até 27 anos</SelectItem>
            <SelectItem value="28_to_35">28 a 35 anos</SelectItem>
            <SelectItem value="36_to_44">36 a 44 anos</SelectItem>
            <SelectItem value="45_to_50">45 a 50 anos</SelectItem>
            <SelectItem value="51_plus">51 anos ou mais</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {gender === 'male' ? (
        <div className="space-y-2">
          <Label htmlFor="barPullups">Barra (repetições)</Label>
          <Input
            id="barPullups"
            type="number"
            min="0"
            max="55"
            value={barPullups || ''}
            onChange={(e) => setBarPullups(parseInt(e.target.value) || undefined)}
            placeholder="Número de repetições (1 a 55)"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="barIsometry">Isometria (segundos)</Label>
          <Input
            id="barIsometry"
            type="number"
            min="0"
            value={barIsometry || ''}
            onChange={(e) => setBarIsometry(parseInt(e.target.value) || undefined)}
            placeholder="Tempo em segundos"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="situps">Abdominais (1 minuto)</Label>
        <Input
          id="situps"
          type="number"
          min="0"
          value={situps || ''}
          onChange={(e) => setSitups(parseInt(e.target.value) || 0)}
          placeholder="Número de repetições"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="runningDistance">Corrida (12 minutos)</Label>
        <Input
          id="runningDistance"
          type="number"
          min="0"
          step="50"
          value={runningDistance || ''}
          onChange={(e) => setRunningDistance(parseInt(e.target.value) || 0)}
          placeholder="Distância em metros"
          required
        />
      </div>
      
      <Button type="submit" className="w-full bg-police-blue hover:bg-police-lightBlue">
        Calcular Resultado
      </Button>
    </form>
  );
}
