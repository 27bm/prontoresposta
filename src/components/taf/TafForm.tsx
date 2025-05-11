
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TafFormData, Gender, AgeRange } from '@/types/taf';

interface TafFormProps {
  onSubmit: (data: TafFormData) => void;
  defaultValues?: Partial<TafFormData>;
}

const pullupOptions = Array.from({ length: 55 }, (_, i) => i + 1);
const isometryOptions = [5, 9, 13, 17, 20, 23, 26, 29, 32, 35, 37, 39];
const situpOptions = Array.from({ length: 60 }, (_, i) => i + 1);
const runningOptions = [
  1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 
  1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550
];

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
          <Select 
            value={barPullups?.toString() || ''}
            onValueChange={(val) => setBarPullups(parseInt(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o número de repetições" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {pullupOptions.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="barIsometry">Isometria (segundos)</Label>
          <Select 
            value={barIsometry?.toString() || ''}
            onValueChange={(val) => setBarIsometry(parseInt(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tempo em segundos" />
            </SelectTrigger>
            <SelectContent>
              {isometryOptions.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} segundos
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="situps">Abdominais (1 minuto)</Label>
        <Select 
          value={situps?.toString() || ''}
          onValueChange={(val) => setSitups(parseInt(val))}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o número de repetições" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {situpOptions.map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="runningDistance">Corrida (12 minutos)</Label>
        <Select 
          value={runningDistance?.toString() || ''}
          onValueChange={(val) => setRunningDistance(parseInt(val))}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a distância em metros" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {runningOptions.map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value} metros
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full bg-police-blue hover:bg-police-lightBlue">
        Calcular Resultado
      </Button>
    </form>
  );
}
