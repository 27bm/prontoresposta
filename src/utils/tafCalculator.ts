
import { TafFormData, TafResult, TafResultType, AgeRange, Gender } from '@/types/taf';

// Função para calcular a pontuação da barra/isometria
const calculateBarScore = (gender: Gender, ageRange: AgeRange, value?: number): number => {
  if (value === undefined || value <= 0) return 0;
  
  // Masculino: Barra (repetições)
  if (gender === 'male') {
    // Pontos = 25 + repetições, limite de 55 repetições
    return Math.min(25 + value, 80);
  } 
  // Feminino: Isometria (tempo em segundos)
  else {
    // Tabela de pontuação para isometria feminina
    const isometryTable = [
      { time: 5, score: 1 },
      { time: 9, score: 2 },
      { time: 13, score: 3 },
      { time: 17, score: 4 },
      { time: 20, score: 5 },
      { time: 23, score: 6 },
      { time: 26, score: 7 },
      { time: 29, score: 8 },
      { time: 32, score: 9 },
      { time: 35, score: 10 },
      { time: 37, score: 11 },
      { time: 39, score: 12 }
    ];
    
    // Verificar se precisa considerar pontuações adicionais para faixa etária mais jovem
    const isYounger = ageRange === 'up_to_27';
    
    // Encontrar a pontuação mais alta aplicável
    let score = 0;
    for (let i = isometryTable.length - 1; i >= 0; i--) {
      if (value >= isometryTable[i].time) {
        score = isometryTable[i].score;
        break;
      }
    }
    
    // Para faixas mais velhas, limitar em 10 pontos
    if (!isYounger && score > 10) {
      return 10;
    }
    
    return score;
  }
};

// Função para calcular a pontuação de abdominais
const calculateSitupsScore = (gender: Gender, ageRange: AgeRange, situps: number): number => {
  if (situps <= 0) return 0;
  
  // Base de pontuação para abdominais (até 27 anos)
  const baseSitupsScore = (repetitions: number): number => {
    if (repetitions < 19) return -10 * (19 - repetitions);
    if (repetitions === 19) return 0;
    return (repetitions - 19) * 10;
  };
  
  // Ajustes com base na faixa etária
  let ageAdjustment = 0;
  if (ageRange === '28_to_35') ageAdjustment = -5;
  else if (ageRange === '36_to_44') ageAdjustment = -10;
  else if (ageRange === '45_to_50') ageAdjustment = -15;
  else if (ageRange === '51_plus') ageAdjustment = -20;
  
  // Pontuação base + ajuste de idade
  const score = baseSitupsScore(situps) + ageAdjustment;
  
  return Math.max(0, Math.min(140, score)); // Limitar entre 0 e 140
};

// Função para calcular a pontuação da corrida
const calculateRunningScore = (gender: Gender, ageRange: AgeRange, distance: number): number => {
  if (distance <= 0) return 0;
  
  // Base de pontuação para corrida masculina (até 27 anos)
  const baseRunningScore = (dist: number): number => {
    if (dist < 1200) return 0;
    if (dist === 1200) return 1;
    if (dist === 1250) return 10;
    
    // Interpolação linear para valores intermediários
    const scorePerMeter = (150 - 10) / (2550 - 1250);
    return 10 + Math.floor((dist - 1250) * scorePerMeter);
  };
  
  // Ajustes com base no sexo
  let genderAdjustment = 0;
  if (gender === 'female') {
    genderAdjustment = -8; // Aproximadamente 50 pontos a menos
  }
  
  // Ajustes com base na faixa etária
  let ageAdjustment = 0;
  if (ageRange === '28_to_35') ageAdjustment = 5;
  else if (ageRange === '36_to_44') ageAdjustment = 10;
  else if (ageRange === '45_to_50') ageAdjustment = 15;
  else if (ageRange === '51_plus') ageAdjustment = 20;
  
  // Pontuação base + ajustes
  const score = baseRunningScore(distance) + genderAdjustment + ageAdjustment;
  
  return Math.max(0, Math.min(150, score)); // Limitar entre 0 e 150
};

// Função para determinar a classificação com base na pontuação total
const getTafResultType = (totalScore: number): TafResultType => {
  if (totalScore >= 300) return 'excellent';
  if (totalScore >= 255) return 'very_good';
  if (totalScore >= 211) return 'good';
  if (totalScore >= 151) return 'regular';
  return 'insufficient';
};

// Função principal para calcular o resultado do TAF
export const calculateTafResult = (data: TafFormData): TafResult => {
  const { gender, ageRange, barPullups, barIsometry, situps, runningDistance } = data;
  
  // Usar barPullups para homens e barIsometry para mulheres
  const barValue = gender === 'male' ? barPullups : barIsometry;
  const barScore = calculateBarScore(gender, ageRange, barValue);
  const situpsScore = calculateSitupsScore(gender, ageRange, situps);
  const runningScore = calculateRunningScore(gender, ageRange, runningDistance);
  
  const totalScore = barScore + situpsScore + runningScore;
  const resultType = getTafResultType(totalScore);
  
  return {
    barScore,
    situpsScore,
    runningScore,
    totalScore,
    resultType
  };
};

// Função para obter o texto da classificação
export const getTafResultTypeText = (resultType: TafResultType): string => {
  switch (resultType) {
    case 'excellent': return 'Excelente';
    case 'very_good': return 'Muito Bom';
    case 'good': return 'Bom';
    case 'regular': return 'Regular';
    case 'insufficient': return 'Insuficiente';
    default: return 'Não avaliado';
  }
};
