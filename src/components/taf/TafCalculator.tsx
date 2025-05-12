
import React, { useState, useEffect } from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Dumbbell, Running } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { TafFormData, TafResult, AgeRange, Gender } from '@/types/taf';
import { calculateTafResult, getTafResultTypeText } from '@/utils/tafCalculator';

// Opções para os selects
const genderOptions = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' }
];

const ageRangeOptions = [
  { value: 'up_to_27', label: 'Até 27 anos' },
  { value: '28_to_35', label: '28 a 35 anos' },
  { value: '36_to_44', label: '36 a 44 anos' },
  { value: '45_to_50', label: '45 a 50 anos' },
  { value: '51_plus', label: '51 anos ou mais' }
];

// Valores para selects baseados na tabela
const getBarOptions = (gender: Gender, ageRange: AgeRange): { value: number, label: string }[] => {
  const isYounger = ageRange === 'up_to_27' || ageRange === '28_to_35';
  
  if (isYounger) {
    if (gender === 'male') {
      // Barra masculina (repetições)
      return Array.from({length: 12}, (_, i) => ({
        value: i + 1,
        label: `${i + 1} repetições`
      }));
    } else {
      // Isometria feminina (segundos)
      return [5, 9, 13, 17, 20, 23, 26, 29, 32, 35, 37, 39].map(val => ({
        value: val,
        label: `${val} segundos`
      }));
    }
  } else {
    // Apoio (repetições) para idade >= 36
    if (gender === 'male') {
      return Array.from({length: 13}, (_, i) => ({
        value: i + 21,
        label: `${i + 21} repetições`
      }));
    } else {
      return Array.from({length: 13}, (_, i) => ({
        value: i + 20,
        label: `${i + 20} repetições`
      }));
    }
  }
};

// Valores para abdominais
const getAbdominalOptions = (): { value: number, label: string }[] => {
  return Array.from({length: 30}, (_, i) => ({
    value: i + 19,
    label: `${i + 19} repetições`
  }));
};

// Valores para corrida (metros)
const getRunningOptions = (gender: Gender): { value: number, label: string }[] => {
  if (gender === 'male') {
    return Array.from({length: 35}, (_, i) => {
      const value = 1200 + (i * 50);
      return {
        value,
        label: `${value} metros`
      };
    });
  } else {
    return Array.from({length: 35}, (_, i) => {
      const value = 800 + (i * 50);
      return {
        value,
        label: `${value} metros`
      };
    });
  }
};

export function TafCalculator() {
  const form = useForm<TafFormData>({
    defaultValues: {
      gender: 'male',
      ageRange: 'up_to_27',
      situps: 19,
      runningDistance: 1200
    }
  });

  const [result, setResult] = useState<TafResult | null>(null);
  const [barOptions, setBarOptions] = useState<{ value: number, label: string }[]>([]);
  const [abdominalOptions, setAbdominalOptions] = useState<{ value: number, label: string }[]>([]);
  const [runningOptions, setRunningOptions] = useState<{ value: number, label: string }[]>([]);

  const watchGender = form.watch('gender') as Gender;
  const watchAgeRange = form.watch('ageRange') as AgeRange;
  const watchBarPullups = form.watch('barPullups');
  const watchBarIsometry = form.watch('barIsometry');
  const watchSitups = form.watch('situps');
  const watchRunningDistance = form.watch('runningDistance');

  // Atualizar opções com base no sexo e faixa etária
  useEffect(() => {
    const gender = watchGender;
    const ageRange = watchAgeRange;

    // Atualiza opções da barra/apoio
    setBarOptions(getBarOptions(gender, ageRange));
    
    // Atualiza opções de abdominais
    setAbdominalOptions(getAbdominalOptions());
    
    // Atualiza opções de corrida
    setRunningOptions(getRunningOptions(gender));
    
    // Reset os valores quando mudar sexo/idade
    const isYounger = ageRange === 'up_to_27' || ageRange === '28_to_35';
    if (isYounger) {
      if (gender === 'male') {
        form.setValue('barPullups', 1);
      } else {
        form.setValue('barIsometry', 5);
      }
    } else {
      const defaultValue = gender === 'male' ? 21 : 20;
      if (gender === 'male') {
        form.setValue('barPullups', defaultValue);
      } else {
        form.setValue('barPullups', defaultValue);
      }
    }
    
    // Valores default para corrida
    const defaultRunningDistance = gender === 'male' ? 1200 : 800;
    form.setValue('runningDistance', defaultRunningDistance);
    
  }, [watchGender, watchAgeRange, form]);

  // Calcular resultado quando qualquer valor mudar
  useEffect(() => {
    if (!watchGender || !watchAgeRange) return;

    const isYounger = watchAgeRange === 'up_to_27' || watchAgeRange === '28_to_35';
    
    let formData: TafFormData = {
      gender: watchGender,
      ageRange: watchAgeRange,
      situps: watchSitups || 0,
      runningDistance: watchRunningDistance || 0
    };

    // Adiciona o valor correto com base na idade
    if (isYounger) {
      if (watchGender === 'male') {
        formData.barPullups = watchBarPullups;
      } else {
        formData.barIsometry = watchBarIsometry;
      }
    } else {
      formData.barPullups = watchBarPullups;
    }

    const calculatedResult = calculateTafResult(formData);
    setResult(calculatedResult);
  }, [watchGender, watchAgeRange, watchBarPullups, watchBarIsometry, watchSitups, watchRunningDistance]);

  // Determinar se é barra/isometria ou apoio com base na idade
  const isYounger = watchAgeRange === 'up_to_27' || watchAgeRange === '28_to_35';
  const barExerciseLabel = isYounger 
    ? (watchGender === 'male' ? 'Barra' : 'Barra (isometria)') 
    : 'Apoio';

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Sexo */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Faixa Etária */}
          <FormField
            control={form.control}
            name="ageRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faixa Etária</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa etária" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ageRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {/* Barra/Isometria/Apoio */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={isYounger && watchGender === 'female' ? "barIsometry" : "barPullups"}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-1">
                          <Dumbbell className="h-4 w-4 text-muted-foreground" />
                          <FormLabel className="text-sm font-medium">{barExerciseLabel}</FormLabel>
                        </div>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {barOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                {result && (
                  <div className="text-right mt-2 md:mt-4">
                    <Badge variant="outline" className="text-sm">
                      Pontuação: <span className="font-bold ml-1">{result.barScore}</span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Abdominal */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="situps"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-1">
                          <Dumbbell className="h-4 w-4 text-muted-foreground" />
                          <FormLabel className="text-sm font-medium">Abdominal</FormLabel>
                        </div>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {abdominalOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                {result && (
                  <div className="text-right mt-2 md:mt-4">
                    <Badge variant="outline" className="text-sm">
                      Pontuação: <span className="font-bold ml-1">{result.situpsScore}</span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Corrida */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="runningDistance"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-1">
                          <Running className="h-4 w-4 text-muted-foreground" />
                          <FormLabel className="text-sm font-medium">Corrida 12min</FormLabel>
                        </div>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {runningOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                {result && (
                  <div className="text-right mt-2 md:mt-4">
                    <Badge variant="outline" className="text-sm">
                      Pontuação: <span className="font-bold ml-1">{result.runningScore}</span>
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Form>

      {/* Resultado */}
      {result && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pontuação Total</h3>
                <span className="text-2xl font-bold">{result.totalScore}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">Classificação</div>
                <div className="flex items-center gap-2">
                  {result.totalScore >= 150 ? (
                    <>
                      <Badge className="bg-green-500">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Aprovado
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({getTafResultTypeText(result.resultType)})
                      </span>
                    </>
                  ) : (
                    <Badge className="bg-red-500">
                      <X className="h-3.5 w-3.5 mr-1" />
                      Reprovado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
