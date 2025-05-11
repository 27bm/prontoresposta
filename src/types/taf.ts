
// Tipo para definir o sexo
export type Gender = 'male' | 'female';

// Tipo para definir a faixa etária
export type AgeRange = 'up_to_27' | '28_to_35' | '36_to_44' | '45_to_50' | '51_plus';

// Tipos de resultados
export type TafResultType = 'excellent' | 'very_good' | 'good' | 'regular' | 'insufficient';

// Interface para os dados do formulário TAF
export interface TafFormData {
  gender: Gender;
  ageRange: AgeRange;
  barPullups?: number;
  barIsometry?: number;
  situps: number;
  runningDistance: number;
}

// Interface para os resultados dos testes
export interface TafResult {
  barScore: number;
  situpsScore: number;
  runningScore: number;
  totalScore: number;
  resultType: TafResultType;
}
