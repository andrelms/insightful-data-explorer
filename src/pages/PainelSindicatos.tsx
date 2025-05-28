import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, ChevronDown, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Dicionário de siglas dos estados
const siglas_estados: {[key: string]: string} = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia',
  'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás',
  'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais',
  'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí',
  'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
  'SE': 'Sergipe', 'TO': 'Tocantins'
};

interface SindicatoData {
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

interface CargoData {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  cbo: string | null;
}

interface PisoSalarialData {
  cargo_id: string;
  descricao: string | null;
  valor: number | null;
}

interface JornadaData {
  cargo_id: string;
  carga_horaria: string | null;
  valor: number | null;
  unidade: string;
}

interface ValorHoraData {
  cargo_id: string;
  cargo: string;
  descricao: string | null;
  valor: number | null;
}

interface BeneficioData {
  tipo: string;
  nome: string;
  valor: string | null;
  descricao: string | null;
  categoria: string | null;
  fonte_coluna: string | null;
  registro_idx: number | null;
}

interface ParticularidadeData {
  categoria: string | null;
  conteudo: string | null;
  detalhe: string | null;
}

interface AnotacaoData {
  coluna: string;
  campo_formatado: string;
  sugestao_particularidade: string | null;
  registro_idx: number | null;
}

interface EstadoSindicatos {
  sigla: string;
  nome: string;
  sindicatos: SindicatoData[];
}

const PainelSindicatos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const [expandedSindicatos, setExpandedSindicatos] = useState<Record<string, boolean>>({});
  const [expandedValoresHora, setExpandedValoresHora] = useState<Record<string, boolean>>({});
  const [dados, setDados] = useState<EstadoSindicatos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDadosSupabase();
  }, []);

  const fetchDadosSupabase = async () => {
    setLoading(true);
    try {
      // Buscar dados com joins otimizados em paralelo
      const [
        { data: sindicatos, error: sindicatosError },
        { data: convenios, error: conveniosError },
        { data: cargos, error: cargosError },
        { data: beneficios, error: beneficiosError },
        { data: particularidades, error: particularidadesError },
        { data: valoresHora, error: valoresHoraError },
        { data: jornadas, error: jornadasError },
        { data: pisosSalariais, error: pisosSalariaisError },
        { data: anotacoes, error: anotacoesError }
      ] = await Promise.all([
        supabase.from('sindicatos').select('id, nome, cnpj, site, data_base, estado'),
        supabase.from('convenios').select('id, sindicato_id, vigencia_inicio, vigencia_fim'),
        supabase.from('cargos').select('id, cargo, carga_horaria, cbo, convenio_id'),
        supabase.from('beneficios_gerais').select('tipo, nome, valor, descricao, categoria, fonte_coluna, registro_idx, convenio_id').order('registro_idx'),
        supabase.from('particularidades').select('categoria, conteudo, detalhe, convenio_id'),
        supabase.from('valores_hora').select('cargo_id, descricao, valor'),
        supabase.from('jornada_cargo').select('cargo_id, carga_horaria, valor, unidade'),
        supabase.from('piso_salarial').select('cargo_id, descricao, valor'),
        supabase.from('anotacoes').select('convenio_id, coluna, campo_formatado, sugestao_particularidade, registro_idx')
      ]);

      if (sindicatosError) throw sindicatosError;
      if (conveniosError) throw conveniosError;
      if (cargosError) throw cargosError;
      if (beneficiosError) throw beneficiosError;
      if (particularidadesError) throw particularidadesError;
      if (valoresHoraError) throw valoresHoraError;
      if (jornadasError) throw jornadasError;
      if (pisosSalariaisError) throw pisosSalariaisError;

      if (!sindicatos || sindicatos.length === 0) {
        setDados([]);
        setLoading(false);
        return;
      }

      // Criar maps para lookup rápido
      const conveniosMap = new Map();
      convenios?.forEach(convenio => {
        if (!conveniosMap.has(convenio.sindicato_id)) {
          conveniosMap.set(convenio.sindicato_id, []);
        }
        conveniosMap.get(convenio.sindicato_id).push(convenio);
      });

      const cargosMap = new Map();
      cargos?.forEach(cargo => {
        if (!cargosMap.has(cargo.convenio_id)) {
          cargosMap.set(cargo.convenio_id, []);
        }
        cargosMap.get(cargo.convenio_id).push(cargo);
      });

      const beneficiosMap = new Map();
      beneficios?.forEach(beneficio => {
        if (beneficio.tipo !== 'DATA BASE') { // Filtrar tipo DATA BASE
          if (!beneficiosMap.has(beneficio.convenio_id)) {
            beneficiosMap.set(beneficio.convenio_id, []);
          }
          beneficiosMap.get(beneficio.convenio_id).push(beneficio);
        }
      });

      const particularidadesMap = new Map();
      particularidades?.forEach(part => {
        if (!particularidadesMap.has(part.convenio_id)) {
          particularidadesMap.set(part.convenio_id, []);
        }
        particularidadesMap.get(part.convenio_id).push(part);
      });

      const valoresHoraMap = new Map();
      valoresHora?.forEach(vh => {
        if (!valoresHoraMap.has(vh.cargo_id)) {
          valoresHoraMap.set(vh.cargo_id, []);
        }
        valoresHoraMap.get(vh.cargo_id).push(vh);
      });

      const jornadasMap = new Map();
      jornadas?.forEach(j => {
        if (!jornadasMap.has(j.cargo_id)) {
          jornadasMap.set(j.cargo_id, []);
        }
        jornadasMap.get(j.cargo_id).push(j);
      });

      const pisosSalariaisMap = new Map();
      pisosSalariais?.forEach(p => {
        if (!pisosSalariaisMap.has(p.cargo_id)) {
          pisosSalariaisMap.set(p.cargo_id, []);
        }
        pisosSalariaisMap.get(p.cargo_id).push(p);
      });

      const anotacoesMap = new Map();
      anotacoes?.forEach(anotacao => {
        if (!anotacoesMap.has(anotacao.convenio_id)) {
          anotacoesMap.set(anotacao.convenio_id, []);
        }
        anotacoesMap.get(anotacao.convenio_id).push(anotacao);
      });

      // Processar sindicatos
      const sindicatosCompletos: SindicatoData[] = sindicatos.map(sindicato => {
        const sindicatoConvenios = conveniosMap.get(sindicato.id) || [];
        const vigencia = sindicatoConvenios[0];

        const allCargos: CargoData[] = [];
        const allBeneficios: BeneficioData[] = [];
        const allParticularidades: ParticularidadeData[] = [];
        const allValoresHora: ValorHoraData[] = [];
        const allJornadas: JornadaData[] = [];
        const allPisosSalariais: PisoSalarialData[] = [];
        const allAnotacoes: AnotacaoData[] = [];

        sindicatoConvenios.forEach(convenio => {
          const conveniosCargos = cargosMap.get(convenio.id) || [];
          // Ordenar cargos alfabeticamente
          conveniosCargos.sort((a, b) => a.cargo.localeCompare(b.cargo));
          allCargos.push(...conveniosCargos);

          const convenioBeneficios = beneficiosMap.get(convenio.id) || [];
          allBeneficios.push(...convenioBeneficios);

          const convenioParticularidades = particularidadesMap.get(convenio.id) || [];
          allParticularidades.push(...convenioParticularidades);

          const convenioAnotacoes = anotacoesMap.get(convenio.id) || [];
          allAnotacoes.push(...convenioAnotacoes);

          // Para cada cargo, buscar valores hora, jornadas e pisos
          conveniosCargos.forEach(cargo => {
            const cargoValoresHora = valoresHoraMap.get(cargo.id) || [];
            cargoValoresHora.forEach(vh => {
              allValoresHora.push({
                cargo_id: cargo.id,
                cargo: cargo.cargo,
                descricao: vh.descricao,
                valor: vh.valor
              });
            });

            const cargoJornadas = jornadasMap.get(cargo.id) || [];
            cargoJornadas.forEach(j => {
              allJornadas.push({
                cargo_id: cargo.id,
                carga_horaria: j.carga_horaria,
                valor: j.valor,
                unidade: j.unidade
              });
            });

            const cargoPisos = pisosSalariaisMap.get(cargo.id) || [];
            cargoPisos.forEach(p => {
              allPisosSalariais.push({
                cargo_id: cargo.id,
                descricao: p.descricao,
                valor: p.valor
              });
            });
          });
        });

        // Extrair estado do sindicato
        let estadoSigla = sindicato.estado;
        if (!estadoSigla && sindicato.data_base) {
          const match = sindicato.data_base.match(/([A-Z]{2})/);
          estadoSigla = match ? match[1] : null;
        }
        if (!estadoSigla && sindicato.nome) {
          const match = sindicato.nome.match(/([A-Z]{2})/);
          estadoSigla = match ? match[1] : null;
        }

        return {
          ...sindicato,
          estado: estadoSigla,
          vigencia_inicio: vigencia?.vigencia_inicio,
          vigencia_fim: vigencia?.vigencia_fim,
          cargos: allCargos,
          beneficios: allBeneficios,
          particularidades: allParticularidades,
          valoresHora: allValoresHora,
          jornadas: allJornadas,
          pisosSalariais: allPisosSalariais,
          anotacoes: allAnotacoes
        };
      });

      // Agrupar sindicatos por estado
      const estadosMap: {[key: string]: SindicatoData[]} = {};
      
      sindicatosCompletos.forEach(sindicato => {
        const estado = sindicato.estado || 'OUTROS';
        if (!estadosMap[estado]) {
          estadosMap[estado] = [];
        }
        estadosMap[estado].push(sindicato);
      });

      // Converter para array de EstadoSindicatos
      const estadosArray: EstadoSindicatos[] = Object.entries(estadosMap).map(([sigla, sindicatos]) => ({
        sigla,
        nome: siglas_estados[sigla] || sigla,
        sindicatos
      }));

      // Ordenar por nome do estado
      estadosArray.sort((a, b) => a.nome.localeCompare(b.nome));

      setDados(estadosArray);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredEstados = dados.filter(estado => {
    if (estadoFilter !== "all" && estado.sigla !== estadoFilter) return false;
    
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      const estadoMatches = estado.nome.toLowerCase().includes(termLower);
      const sindicatoMatches = estado.sindicatos.some(sind => 
        sind.nome.toLowerCase().includes(termLower) || 
        sind.cargos.some(cargo => 
          cargo.cargo.toLowerCase().includes(termLower) ||
          cargo.carga_horaria?.toLowerCase().includes(termLower)
        )
      );
      
      return estadoMatches || sindicatoMatches;
    }
    
    return true;
  });
  
  const toggleSindicato = (estadoSigla: string, sindicatoIndex: number) => {
    const key = `${estadoSigla}-${sindicatoIndex}`;
    setExpandedSindicatos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleValoresHora = (cargoId: string) => {
    setExpandedValoresHora(prev => ({
      ...prev,
      [cargoId]: !prev[cargoId]
    }));
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const groupBeneficiosBySugestao = (beneficios: BeneficioData[], anotacoes: AnotacaoData[]) => {
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

  const getInformacoesSindicato = (sindicato: SindicatoData) => {
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

  const prepareCargoData = (sindicato: SindicatoData) => {
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Sindicatos</h1>
        <p className="text-muted-foreground">
          Informações atualizadas e comparativas sobre sindicatos e convenções coletivas.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[1fr_auto] mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por sindicato, cargo, estado ou qualquer informação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 rounded-full bg-white/20 backdrop-blur-md border-white/10 placeholder:text-muted-foreground focus:bg-white/30 transition-all"
          />
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {Object.entries(siglas_estados).map(([sigla, nome]) => (
                <SelectItem key={sigla} value={sigla}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="hora-extra">Hora Extra</SelectItem>
              <SelectItem value="piso">Piso Salarial</SelectItem>
              <SelectItem value="beneficios">Benefícios</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEstados.map((estado) => (
            <div key={estado.sigla} className="estado-card fade-in" data-estado={estado.sigla.toLowerCase()}>
              <Card className="overflow-hidden hover-scale h-full flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <h2 className="text-xl font-bold">{estado.nome}</h2>
                  </div>
                  <div className="text-sm opacity-80 mt-1">
                    {estado.sindicatos.length} Sindicato{estado.sindicatos.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <CardContent className="p-0 flex-1">
                  {estado.sindicatos.map((sindicato, sindIdx) => {
                    const isExpanded = expandedSindicatos[`${estado.sigla}-${sindIdx}`];
                    
                    return (
                      <div key={sindIdx} className="border-t first:border-t-0">
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center"
                          onClick={() => toggleSindicato(estado.sigla, sindIdx)}
                        >
                          <div className="font-medium text-primary">{sindicato.nome}</div>
                          <ChevronDown className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            isExpanded && "transform rotate-180"
                          )} />
                        </div>
                        
                        {isExpanded && (
                          <div className="p-4 pt-0 space-y-4 text-sm">
                            {sindicato.cnpj && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Info className="h-3 w-3" />
                                <span>CNPJ: {sindicato.cnpj}</span>
                              </div>
                            )}
                            
                            {/* Informações do Sindicato */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-xs text-accent-foreground">Informações do Sindicato</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {getInformacoesSindicato(sindicato).map((info, idx) => (
                                  <div key={idx} className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                                    <div className="text-xs font-medium">{info.coluna}</div>
                                    <div className="truncate">{info.valor}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Cargos e Remuneração */}
                            {sindicato.cargos && sindicato.cargos.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Cargos e Remuneração</h4>
                                <div className="space-y-3">
                                  {prepareCargoData(sindicato).map((cargoData) => (
                                    <div key={cargoData.id} className="bg-muted/20 p-3 rounded border">
                                      {/* Cargo Info */}
                                      <div className="mb-3">
                                        <div className="font-medium text-sm">{cargoData.cargo}</div>
                                        {cargoData.cbo && (
                                          <div className="text-xs text-muted-foreground">CBO: {cargoData.cbo}</div>
                                        )}
                                      </div>
                                      
                                      {/* Carga Horária e Piso Salarial lado a lado */}
                                      <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                          <div className="text-xs font-medium mb-1">Carga Horária</div>
                                          {cargoData.jornadas.map((jornada, idx) => (
                                            <div key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mb-1">
                                              {jornada.valor} {jornada.unidade}
                                            </div>
                                          ))}
                                        </div>
                                        <div>
                                          <div className="text-xs font-medium mb-1">Piso Salarial</div>
                                          {cargoData.pisos.map((piso, idx) => (
                                            <div key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mb-1">
                                              <div className="font-medium">{piso.descricao || 'Piso'}</div>
                                              <div>{formatCurrency(piso.valor)}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      {/* Valores Hora - Collapsible horizontal */}
                                      {cargoData.valores.length > 0 && (
                                        <Collapsible 
                                          open={expandedValoresHora[cargoData.id]} 
                                          onOpenChange={() => toggleValoresHora(cargoData.id)}
                                        >
                                          <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium hover:text-primary w-full text-left">
                                            <ChevronRight className={cn(
                                              "h-3 w-3 transition-transform",
                                              expandedValoresHora[cargoData.id] && "transform rotate-90"
                                            )} />
                                            Valores Hora ({cargoData.valores.length})
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="mt-2">
                                            <div className="flex flex-wrap gap-2">
                                              {cargoData.valores.map((valor, idx) => (
                                                <div key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                                  <div className="font-medium">{valor.descricao || 'Valor'}</div>
                                                  <div>{formatCurrency(valor.valor)}</div>
                                                </div>
                                              ))}
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Benefícios Agrupados por Sugestão de Particularidade */}
                            {sindicato.beneficios && sindicato.beneficios.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Benefícios</h4>
                                <div className="space-y-3">
                                  {Object.entries(groupBeneficiosBySugestao(sindicato.beneficios, sindicato.anotacoes)).map(([sugestao, beneficios]) => (
                                    <div key={sugestao} className="bg-muted/20 p-3 rounded border">
                                      <div className="font-medium text-sm mb-2">{sugestao}</div>
                                      <div className="space-y-1">
                                        {beneficios
                                          .sort((a, b) => (a.registro_idx || 0) - (b.registro_idx || 0))
                                          .map((beneficio, i) => (
                                          <div key={i} className="bg-green-100 text-green-800 p-2 rounded text-xs">
                                            <div className="font-medium">{beneficio.tipo} - {beneficio.nome}</div>
                                            <div>{beneficio.valor || beneficio.descricao || '-'}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Particularidades usando campo detalhe */}
                            {sindicato.particularidades && sindicato.particularidades.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Particularidades</h4>
                                <div className="space-y-2">
                                  {sindicato.particularidades.map((part, i) => (
                                    <div key={i} className="bg-orange-100 text-orange-800 p-2 rounded text-xs">
                                      <div className="font-medium">{part.detalhe}</div>
                                      {part.conteudo && <div className="mt-1">{part.conteudo}</div>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="pt-2 mt-4 border-t text-center">
                              <Button variant="link" size="sm" className="text-xs text-muted-foreground">
                                Ver detalhes da convenção
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
          
          {filteredEstados.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted/40 p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-1">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground max-w-md">
                Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PainelSindicatos;
