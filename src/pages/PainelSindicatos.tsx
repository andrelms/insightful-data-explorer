
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, ChevronDown, Info } from "lucide-react";
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
  cargos: CargoData[];
  beneficios: BeneficioData[];
  particularidades: ParticularidadeData[];
}

interface CargoData {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  cbo: string | null;
  piso_salarial: number | null;
  piso_descricao: string | null;
  valores_hora: ValorHoraData[];
}

interface ValorHoraData {
  tipo: string;
  valor: number;
  descricao: string | null;
}

interface BeneficioData {
  tipo: string;
  nome: string;
  valor: string | null;
  descricao: string | null;
  origem?: string;
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
      // Buscar sindicatos com convenios, cargos e dados relacionados
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

      // Para cada sindicato, buscar seus convenios e dados relacionados
      const sindicatosCompletos: SindicatoData[] = [];

      for (const sindicato of sindicatos) {
        // Buscar convenios do sindicato
        const { data: convenios } = await supabase
          .from('convenios')
          .select('id')
          .eq('sindicato_id', sindicato.id);

        if (!convenios || convenios.length === 0) {
          // Adicionar sindicato mesmo sem convenios
          sindicatosCompletos.push({
            ...sindicato,
            cargos: [],
            beneficios: [],
            particularidades: []
          });
          continue;
        }

        const convenioIds = convenios.map(c => c.id);

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

        // Buscar beneficios gerais dos convenios com origem
        const { data: beneficios } = await supabase
          .from('beneficios_gerais')
          .select(`
            tipo,
            nome,
            valor,
            descricao,
            fonte_coluna
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
        
        if (cargos) {
          for (const cargo of cargos) {
            const { data: pisoSalarial } = await supabase
              .from('piso_salarial')
              .select('valor, descricao')
              .eq('cargo_id', cargo.id)
              .maybeSingle();

            const { data: valoresHora } = await supabase
              .from('valores_hora')
              .select(`
                tipo,
                valor,
                descricao
              `)
              .eq('cargo_id', cargo.id);

            cargosCompletos.push({
              ...cargo,
              piso_salarial: pisoSalarial?.valor || null,
              piso_descricao: pisoSalarial?.descricao || null,
              valores_hora: valoresHora || []
            });
          }
        }

        // Extrair estado do sindicato (pode estar na data_base ou no nome)
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
          cargos: cargosCompletos,
          beneficios: beneficios?.map(b => ({
            ...b,
            origem: b.fonte_coluna || 'Sistema'
          })) || [],
          particularidades: particularidades || []
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
    // Estado filter logic
    if (estadoFilter !== "all" && estado.sigla !== estadoFilter) return false;
    
    // Search term logic
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

  // Agrupar particularidades por categoria
  const agruparParticularidades = (particularidades: ParticularidadeData[]) => {
    const grupos: Record<string, ParticularidadeData[]> = {};
    
    particularidades.forEach(part => {
      const categoria = part.categoria || 'Geral';
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(part);
    });
    
    return grupos;
  };

  // Determinar quantas colunas usar baseado no filtro
  const getGridCols = () => {
    if (estadoFilter !== "all") {
      return "grid-cols-1"; // Uma coluna quando filtrado para expandir
    }
    return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"; // Layout normal
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
        <div className={`grid ${getGridCols()} gap-6`}>
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
                                {sindicato.data_base && (
                                  <div className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                                    <div className="text-xs font-medium">Data Base</div>
                                    <div>{sindicato.data_base}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Cargos e Pisos Salariais */}
                            {sindicato.cargos && sindicato.cargos.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Cargos e Pisos Salariais</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full min-w-[400px] border-collapse text-left">
                                    <thead>
                                      <tr>
                                        <th className="p-2 border bg-muted text-xs uppercase">Cargo</th>
                                        <th className="p-2 border bg-muted text-xs uppercase">Carga Horária</th>
                                        <th className="p-2 border bg-muted text-xs uppercase">Piso Salarial</th>
                                        {sindicato.cargos[0]?.cbo && (
                                          <th className="p-2 border bg-muted text-xs uppercase">CBO</th>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sindicato.cargos.map((cargo, i) => (
                                        <tr key={i} className="even:bg-muted/30">
                                          <td className="p-2 border">{cargo.cargo}</td>
                                          <td className="p-2 border">{cargo.carga_horaria || '-'}</td>
                                          <td className="p-2 border">
                                            <div>
                                              <div>{formatCurrency(cargo.piso_salarial)}</div>
                                              {cargo.piso_descricao && (
                                                <div className="text-xs text-muted-foreground">{cargo.piso_descricao}</div>
                                              )}
                                            </div>
                                          </td>
                                          {cargo.cbo && (
                                            <td className="p-2 border">{cargo.cbo}</td>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Valores Hora Extra */}
                            {sindicato.cargos.some(c => c.valores_hora.length > 0) && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Valores Hora Extra</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse text-left">
                                    <thead>
                                      <tr>
                                        <th className="p-2 border bg-muted text-xs uppercase">Cargo</th>
                                        <th className="p-2 border bg-muted text-xs uppercase">Hora Normal</th>
                                        <th className="p-2 border bg-muted text-xs uppercase">Hora Extra 50%</th>
                                        <th className="p-2 border bg-muted text-xs uppercase">Hora Extra 100%</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sindicato.cargos.map((cargo) => {
                                        if (cargo.valores_hora.length === 0) return null;
                                        
                                        const horaNormal = cargo.valores_hora.find(v => v.tipo.includes('normal') || v.tipo.includes('Normal'));
                                        const hora50 = cargo.valores_hora.find(v => v.tipo.includes('50'));
                                        const hora100 = cargo.valores_hora.find(v => v.tipo.includes('100'));
                                        
                                        return (
                                          <tr key={cargo.id} className="even:bg-muted/30">
                                            <td className="p-2 border">{cargo.cargo}</td>
                                            <td className="p-2 border">{horaNormal ? formatCurrency(horaNormal.valor) : '-'}</td>
                                            <td className="p-2 border">{hora50 ? formatCurrency(hora50.valor) : '-'}</td>
                                            <td className="p-2 border">{hora100 ? formatCurrency(hora100.valor) : '-'}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Benefícios com origem */}
                            {sindicato.beneficios && sindicato.beneficios.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Benefícios</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse text-left">
                                    <thead>
                                      <tr>
                                        <th className="p-2 border bg-muted text-xs uppercase">Benefício</th>
                                        <th className="p-2 border bg-muted text-xs uppercase">Valor</th>
                                        <th className="p-2 border bg-muted text-xs uppercase">Origem</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sindicato.beneficios.map((beneficio, i) => (
                                        <tr key={i} className="even:bg-muted/30">
                                          <td className="p-2 border">{beneficio.nome}</td>
                                          <td className="p-2 border">{beneficio.valor || beneficio.descricao || '-'}</td>
                                          <td className="p-2 border text-xs">{beneficio.origem}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Particularidades agrupadas por categoria */}
                            {sindicato.particularidades && sindicato.particularidades.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Particularidades</h4>
                                <div className="space-y-3">
                                  {Object.entries(agruparParticularidades(sindicato.particularidades)).map(([categoria, items]) => (
                                    <Collapsible key={categoria}>
                                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-muted/30 rounded border-l-2 border-orange-500 hover:bg-muted/50">
                                        <span className="text-xs font-medium">{categoria}</span>
                                        <ChevronDown className="h-3 w-3" />
                                      </CollapsibleTrigger>
                                      <CollapsibleContent className="mt-1 space-y-1">
                                        {items.map((item, i) => (
                                          <div key={i} className="ml-4 p-2 bg-muted/20 rounded text-xs">
                                            {item.conteudo}
                                          </div>
                                        ))}
                                      </CollapsibleContent>
                                    </Collapsible>
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
