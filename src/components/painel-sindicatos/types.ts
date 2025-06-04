
export interface SindicatoData {
  id: string;
  nome: string;
  cnpj: string | null;
  site: string | null;
  data_base: string | null;
  estado: string | null;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  cargos: CargoData[];
  beneficios: BeneficioData[];
  particularidades: ParticularidadeData[];
  valoresHora: ValorHoraData[];
  jornadas: JornadaData[];
  pisosSalariais: PisoSalarialData[];
  anotacoes: AnotacaoData[];
}

export interface CargoData {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  cbo: string | null;
}

export interface PisoSalarialData {
  cargo_id: string;
  descricao: string | null;
  valor: number | null;
}

export interface JornadaData {
  cargo_id: string;
  carga_horaria: string | null;
  valor: number | null;
  unidade: string;
}

export interface ValorHoraData {
  cargo_id: string;
  cargo: string;
  descricao: string | null;
  valor: number | null;
}

export interface BeneficioData {
  titulo: string;
  coluna: string;
  campo_formatado: string;
  registro_idx: number | null;
}

export interface ParticularidadeData {
  categoria: string | null;
  conteudo: string | null;
  detalhe: string | null;
  registro_idx: number | null;
}

export interface AnotacaoData {
  coluna: string;
  campo_formatado: string;
  sugestao_particularidade: string | null;
  registro_idx: number | null;
}

export interface EstadoSindicatos {
  sigla: string;
  nome: string;
  sindicatos: SindicatoData[];
}

export interface CargoCompleto {
  id: string;
  cargo: string;
  cbo: string | null;
  jornadas: JornadaData[];
  pisos: PisoSalarialData[];
  valores: ValorHoraData[];
}
