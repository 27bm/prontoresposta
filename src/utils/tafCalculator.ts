
import { TafFormData, TafResult, TafResultType, AgeRange, Gender } from '@/types/taf';
import { getBarScore, getSitupScore, getRunningScore } from '@/utils/tafScores';

// Função principal para calcular o resultado do TAF
export const calculateTafResult = (data: TafFormData): TafResult => {
  const { gender, ageRange, barPullups, barIsometry, situps, runningDistance } = data;
  
  // Determinar o valor da barra/apoio com base no sexo e idade
  const isYounger = ageRange === 'up_to_27' || ageRange === '28_to_35';
  let barValue = 0;
  
  if (isYounger) {
    barValue = gender === 'male' ? (barPullups || 0) : (barIsometry || 0);
  } else {
    barValue = barPullups || 0; // Apoio
  }
  
  // Calcular pontuações
  const barScore = getBarScore(gender, ageRange, barValue);
  const situpsScore = getSitupScore(ageRange, situps);
  const runningScore = getRunningScore(gender, ageRange, runningDistance);
  
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

// Função para determinar a classificação com base na pontuação total
const getTafResultType = (totalScore: number): TafResultType => {
  if (totalScore >= 300) return 'excellent';
  if (totalScore >= 255) return 'very_good';
  if (totalScore >= 211) return 'good';
  if (totalScore >= 151) return 'regular';
  return 'insufficient';
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
