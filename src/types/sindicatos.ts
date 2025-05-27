
export interface SindicatoData {
  id: string;
  nome: string;
  cnpj: string | null;
  site: string | null;
  data_base: string | null;
  estado: string | null;
  cargos: CargoData[];
  beneficios: BeneficioData[];
  particularidades: ParticularidadeData[];
}

export interface CargoData {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  cbo: string | null;
  piso_salarial: number | null;
  piso_descricao: string | null;
  valores_hora: ValorHoraData[];
}

export interface ValorHoraData {
  tipo: string;
  valor: number;
  descricao: string | null;
}

export interface BeneficioData {
  tipo: string;
  nome: string;
  valor: string | null;
  descricao: string | null;
  sugestao_particularidade?: string | null;
}

export interface ParticularidadeData {
  categoria: string | null;
  conteudo: string | null;
}

export interface EstadoSindicatos {
  sigla: string;
  nome: string;
  sindicatos: SindicatoData[];
}
