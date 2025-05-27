
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
}

interface CargoData {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  cbo: string | null;
  pisos_salariais: PisoSalarialData[];
}

interface PisoSalarialData {
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
}

interface ParticularidadeData {
  categoria: string | null;
  conteudo: string | null;
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
  const [dados, setDados] = useState<EstadoSindicatos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDadosSupabase();
  }, []);

  const fetchDadosSupabase = async () => {
    setLoading(true);
    try {
      // Buscar sindicatos com convenios
      const { data: sindicatos, error: sindicatosError } = await supabase
        .from('sindicatos')
        .select(`
          id,
          nome,
          cnpj,
          site,
          data_base,
          estado
        `);

      if (sindicatosError) {
        console.error('Erro ao buscar sindicatos:', sindicatosError);
        return;
      }

      if (!sindicatos || sindicatos.length === 0) {
        setDados([]);
        setLoading(false);
        return;
      }

      const sindicatosCompletos: SindicatoData[] = [];

      for (const sindicato of sindicatos) {
        // Buscar convenios do sindicato
        const { data: convenios } = await supabase
          .from('convenios')
          .select('id, vigencia_inicio, vigencia_fim')
          .eq('sindicato_id', sindicato.id);

        if (!convenios || convenios.length === 0) {
          sindicatosCompletos.push({
            ...sindicato,
            vigencia_inicio: null,
            vigencia_fim: null,
            cargos: [],
            beneficios: [],
            particularidades: [],
            valoresHora: [],
            jornadas: []
          });
          continue;
        }

        const convenioIds = convenios.map(c => c.id);
        const vigencia = convenios[0]; // Pegar a primeira vigência

        // Buscar cargos dos convenios
        const { data: cargos } = await supabase
          .from('cargos')
          .select(`
            id,
            cargo,
            carga_horaria,
            cbo
          `)
          .in('convenio_id', convenioIds);

        // Buscar beneficios gerais dos convenios
        const { data: beneficios } = await supabase
          .from('beneficios_gerais')
          .select(`
            tipo,
            nome,
            valor,
            descricao,
            categoria
          `)
          .in('convenio_id', convenioIds);

        // Buscar particularidades
        const { data: particularidades } = await supabase
          .from('particularidades')
          .select(`
            categoria,
            conteudo
          `)
          .in('convenio_id', convenioIds);

        // Para cada cargo, buscar piso salarial e valores de hora
        const cargosCompletos: CargoData[] = [];
        const valoresHoraCompletos: ValorHoraData[] = [];
        const jornadasCompletas: JornadaData[] = [];
        
        if (cargos) {
          for (const cargo of cargos) {
            const { data: pisosSalariais } = await supabase
              .from('piso_salarial')
              .select('descricao, valor')
              .eq('cargo_id', cargo.id);

            const { data: valoresHora } = await supabase
              .from('valores_hora')
              .select(`
                descricao,
                valor
              `)
              .eq('cargo_id', cargo.id);

            const { data: jornadas } = await supabase
              .from('jornada_cargo')
              .select(`
                carga_horaria,
                valor,
                unidade
              `)
              .eq('cargo_id', cargo.id);

            cargosCompletos.push({
              ...cargo,
              pisos_salariais: pisosSalariais || []
            });

            if (valoresHora) {
              valoresHora.forEach(vh => {
                valoresHoraCompletos.push({
                  cargo_id: cargo.id,
                  cargo: cargo.cargo,
                  descricao: vh.descricao,
                  valor: vh.valor
                });
              });
            }

            if (jornadas) {
              jornadas.forEach(j => {
                jornadasCompletas.push({
                  cargo_id: cargo.id,
                  carga_horaria: j.carga_horaria,
                  valor: j.valor,
                  unidade: j.unidade
                });
              });
            }
          }
        }

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

        sindicatosCompletos.push({
          ...sindicato,
          estado: estadoSigla,
          vigencia_inicio: vigencia.vigencia_inicio,
          vigencia_fim: vigencia.vigencia_fim,
          cargos: cargosCompletos,
          beneficios: beneficios || [],
          particularidades: particularidades || [],
          valoresHora: valoresHoraCompletos,
          jornadas: jornadasCompletas
        });
      }

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

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para agrupar benefícios por categoria
  const groupBeneficiosByCategoria = (beneficios: BeneficioData[]) => {
    const grouped: {[key: string]: BeneficioData[]} = {};
    beneficios.forEach(beneficio => {
      const categoria = beneficio.categoria || 'Outros';
      if (!grouped[categoria]) {
        grouped[categoria] = [];
      }
      grouped[categoria].push(beneficio);
    });
    return grouped;
  };

  // Função para agrupar particularidades por categoria
  const groupParticularidadesByCategoria = (particularidades: ParticularidadeData[]) => {
    const grouped: {[key: string]: ParticularidadeData[]} = {};
    particularidades.forEach(part => {
      const categoria = part.categoria || 'Outros';
      if (!grouped[categoria]) {
        grouped[categoria] = [];
      }
      grouped[categoria].push(part);
    });
    return grouped;
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEstados.map((estado) => (
            <div key={estado.sigla} className="estado-card fade-in" data-estado={estado.sigla.toLowerCase()}>
              <Card className="overflow-hidden hover-scale h-full">
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
                                {sindicato.site && (
                                  <div className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                                    <div className="text-xs font-medium">Site</div>
                                    <div className="truncate">{sindicato.site}</div>
                                  </div>
                                )}
                                {sindicato.data_base && (
                                  <div className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                                    <div className="text-xs font-medium">Data Base</div>
                                    <div>{sindicato.data_base}</div>
                                  </div>
                                )}
                                {sindicato.vigencia_inicio && (
                                  <div className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                                    <div className="text-xs font-medium">Vigência Início</div>
                                    <div>{new Date(sindicato.vigencia_inicio).toLocaleDateString('pt-BR')}</div>
                                  </div>
                                )}
                                {sindicato.vigencia_fim && (
                                  <div className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                                    <div className="text-xs font-medium">Vigência Fim</div>
                                    <div>{new Date(sindicato.vigencia_fim).toLocaleDateString('pt-BR')}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Cargos e Pisos Salariais */}
                            {sindicato.cargos && sindicato.cargos.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Cargos e Pisos Salariais</h4>
                                <div className="space-y-3">
                                  {sindicato.cargos.map((cargo, i) => {
                                    const jornadasCargo = sindicato.jornadas.filter(j => j.cargo_id === cargo.id);
                                    
                                    return (
                                      <div key={i} className="bg-muted/20 p-3 rounded border">
                                        <div className="font-medium text-sm mb-2">{cargo.cargo}</div>
                                        
                                        {/* Carga Horária */}
                                        {jornadasCargo.length > 0 && (
                                          <div className="mb-2">
                                            <div className="text-xs font-medium text-muted-foreground mb-1">Carga Horária</div>
                                            <div className="flex flex-wrap gap-2">
                                              {jornadasCargo.map((jornada, idx) => (
                                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                  {jornada.valor} {jornada.unidade}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Pisos Salariais Pivotados */}
                                        {cargo.pisos_salariais.length > 0 && (
                                          <div>
                                            <div className="text-xs font-medium text-muted-foreground mb-1">Pisos Salariais</div>
                                            <div className="flex flex-wrap gap-2">
                                              {cargo.pisos_salariais.map((piso, idx) => (
                                                <div key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                  <span className="font-medium">{piso.descricao || 'Piso'}: </span>
                                                  {formatCurrency(piso.valor)}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Valores Hora */}
                            {sindicato.valoresHora && sindicato.valoresHora.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Valores Hora</h4>
                                <div className="space-y-2">
                                  {sindicato.cargos.map((cargo) => {
                                    const valoresCargo = sindicato.valoresHora.filter(vh => vh.cargo_id === cargo.id);
                                    if (valoresCargo.length === 0) return null;
                                    
                                    return (
                                      <div key={cargo.id} className="bg-muted/20 p-3 rounded border">
                                        <div className="font-medium text-sm mb-2">{cargo.cargo}</div>
                                        <div className="flex flex-wrap gap-2">
                                          {valoresCargo.map((valor, idx) => (
                                            <div key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                              <span className="font-medium">{valor.descricao || 'Valor'}: </span>
                                              {formatCurrency(valor.valor)}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Benefícios */}
                            {sindicato.beneficios && sindicato.beneficios.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Benefícios</h4>
                                <div className="space-y-3">
                                  {Object.entries(groupBeneficiosByCategoria(sindicato.beneficios)).map(([categoria, beneficios]) => (
                                    <div key={categoria} className="bg-muted/20 p-3 rounded border">
                                      <div className="font-medium text-sm mb-2">{categoria}</div>
                                      <div className="space-y-1">
                                        {beneficios.map((beneficio, i) => (
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

                            {/* Particularidades */}
                            {sindicato.particularidades && sindicato.particularidades.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Particularidades</h4>
                                <div className="space-y-3">
                                  {Object.entries(groupParticularidadesByCategoria(sindicato.particularidades)).map(([categoria, particularidades]) => (
                                    <div key={categoria} className="bg-muted/20 p-3 rounded border">
                                      <div className="font-medium text-sm mb-2">{categoria}</div>
                                      <div className="space-y-1">
                                        {particularidades.map((part, i) => (
                                          <div key={i} className="bg-orange-100 text-orange-800 p-2 rounded text-xs">
                                            {part.conteudo}
                                          </div>
                                        ))}
                                      </div>
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
