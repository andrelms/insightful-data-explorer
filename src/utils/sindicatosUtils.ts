
import { SindicatoData, BeneficioData, AnotacaoData } from "@/types/sindicatos";

export const formatCurrency = (value: number | null) => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const groupBeneficiosBySugestao = (beneficios: BeneficioData[], anotacoes: AnotacaoData[]) => {
  const grouped: {[key: string]: BeneficioData[]} = {};
  
  beneficios.forEach(beneficio => {
    // Buscar sugestão de particularidade nas anotações pelo registro_idx
    const anotacao = anotacoes.find(a => a.registro_idx === beneficio.registro_idx);
    const sugestao = anotacao?.sugestao_particularidade || 'Outros';
    
    if (!grouped[sugestao]) {
      grouped[sugestao] = [];
    }
    grouped[sugestao].push(beneficio);
  });
  
  return grouped;
};

export const getInformacoesSindicato = (sindicato: SindicatoData) => {
  const informacoes: { coluna: string; valor: string }[] = [];
  
  // Ordem específica solicitada
  const ordemColunas = ['Site', 'Data Base', 'Vigência Início', 'Vigência Fim'];
  
  // Primeiro, tentar pegar dados diretos do sindicato
  if (sindicato.site) {
    informacoes.push({ coluna: 'Site', valor: sindicato.site });
  }
  
  if (sindicato.data_base) {
    informacoes.push({ coluna: 'Data Base', valor: sindicato.data_base });
  }
  
  if (sindicato.vigencia_inicio) {
    informacoes.push({ 
      coluna: 'Vigência Início', 
      valor: new Date(sindicato.vigencia_inicio).toLocaleDateString('pt-BR') 
    });
  }
  
  if (sindicato.vigencia_fim) {
    informacoes.push({ 
      coluna: 'Vigência Fim', 
      valor: new Date(sindicato.vigencia_fim).toLocaleDateString('pt-BR') 
    });
  }
  
  // Se não tem dados diretos, buscar nas anotações apenas para as colunas específicas
  if (sindicato.anotacoes) {
    const colunasFiltradas = ['SITE', 'DATA BASE', 'VIGENCIA INICIO', 'VIGENCIA FIM'];
    const anotacoesFiltradas = sindicato.anotacoes
      .filter(anotacao => colunasFiltradas.includes(anotacao.coluna.toUpperCase()))
      .filter(anotacao => !informacoes.some(info => info.coluna.toLowerCase() === anotacao.coluna.toLowerCase()));
    
    anotacoesFiltradas.forEach(anotacao => {
      informacoes.push({ 
        coluna: anotacao.coluna, 
        valor: anotacao.campo_formatado 
      });
    });
  }
  
  // Ordenar conforme a ordem solicitada
  return informacoes.sort((a, b) => {
    const indexA = ordemColunas.findIndex(col => col.toLowerCase() === a.coluna.toLowerCase());
    const indexB = ordemColunas.findIndex(col => col.toLowerCase() === b.coluna.toLowerCase());
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
};

export const prepareCargoData = (sindicato: SindicatoData) => {
  const cargoDataMap = new Map();
  
  sindicato.cargos.forEach(cargo => {
    if (!cargoDataMap.has(cargo.id)) {
      cargoDataMap.set(cargo.id, {
        id: cargo.id,
        cargo: cargo.cargo,
        cbo: cargo.cbo,
        jornadas: [],
        pisos: [],
        valores: []
      });
    }
  });
  
  sindicato.jornadas.forEach(jornada => {
    if (cargoDataMap.has(jornada.cargo_id)) {
      cargoDataMap.get(jornada.cargo_id).jornadas.push(jornada);
    }
  });
  
  sindicato.pisosSalariais.forEach(piso => {
    if (cargoDataMap.has(piso.cargo_id)) {
      cargoDataMap.get(piso.cargo_id).pisos.push(piso);
    }
  });
  
  sindicato.valoresHora.forEach(valor => {
    if (cargoDataMap.has(valor.cargo_id)) {
      cargoDataMap.get(valor.cargo_id).valores.push(valor);
    }
  });
  
  return Array.from(cargoDataMap.values()).sort((a, b) => a.cargo.localeCompare(b.cargo));
};
