// Types for data import functionality
import { SupabaseClient } from "@supabase/supabase-js";

// Types to match our database schema
export interface ConvencaoImport {
  titulo: string;
  tipo: string;
  estado: string | null;
  data_base: string | null;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  vale_refeicao: string | null;
  vale_refeicao_valor: number | null;
  assistencia_medica: boolean | null;
  seguro_vida: boolean | null;
  uniforme: boolean | null;
  adicional_noturno: string | null;
  sindicato_id: string | null;
}

export interface PisoSalarialImport {
  convenio_id: string;
  cargo: string;
  carga_horaria: string | null;
  piso_salarial: number | null;
  valor_hora_normal: number | null;
  valor_hora_extra_50: number | null;
  valor_hora_extra_100: number | null;
}

export interface ParticularidadeImport {
  cargo_id: string;
  categoria: string | null;
  conteudo: string | null;
}

export interface BeneficioImport {
  convenio_id: string;
  tipo: string;
  valor: string | null;
  descricao: string | null;
}

export interface LicencaImport {
  convenio_id: string;
  tipo: string;
  dias: number | null;
  descricao: string | null;
}

export interface ProcessExcelResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface ProcessingContext {
  fileName: string;
  importId: string;
  geminiApiKey?: string;
}

export interface ProcessingResult {
  convention: ConvencaoImport | null;
  pisosSalariais: PisoSalarialImport[];
  particularidades: ParticularidadeImport[];
}
