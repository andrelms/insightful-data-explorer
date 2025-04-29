
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

// Dados reais estruturados a partir das informações de sindicatos
interface SindicatoInfo {
  nome: string;
  cnpj: string;
  infoPrincipais: {
    cargo: string;
    cbo?: string;
    cargaHoraria: string;
    pisoSalarial: string;
  }[];
  outrasInfos: {
    nome: string;
    valor: string;
  }[];
  valoresHoraExtra?: {
    dia: string;
    percentual: string;
    valor: string;
  }[];
}

interface EstadoSindicatos {
  sigla: string;
  sindicatos: SindicatoInfo[];
}

// Dados a partir das informações em custom instructions
const sindicatosPorEstado: EstadoSindicatos[] = [
  {
    sigla: 'AL',
    sindicatos: [
      {
        nome: 'SINDPD AL',
        cnpj: '69.982.155/0001-77',
        infoPrincipais: [
          { cargo: 'ANALISTA DE INFORMATICA NIVEL I', cargaHoraria: '44h', pisoSalarial: 'R$ 8696,50' },
          { cargo: 'ANALISTA DE INFORMATICA NIVEL II', cargaHoraria: '44h', pisoSalarial: 'R$ 6630,50' },
          { cargo: 'TECNICO EM APLICATIVO E DESENVOLVIMENTO DE SISTEMAS I', cargaHoraria: '44h', pisoSalarial: 'R$ 5484,00' },
          { cargo: 'TECNICO EM APLICATIVO E DESENVOLVIMENTO DE SISTEMAS II', cargaHoraria: '44h', pisoSalarial: 'R$ 4295,50' },
          { cargo: 'TECNICO EM INFORMATICA - 8 HORAS', cargaHoraria: '44h', pisoSalarial: 'R$ 4214,25' },
          { cargo: 'TECNICO EM INFORMATICA - 6 HORAS', cargaHoraria: '36h', pisoSalarial: 'R$ 3167,00' },
          { cargo: 'ASSISTENTE DE INFORMATICA', cargaHoraria: '36h', pisoSalarial: 'R$ 2036,00' },
          { cargo: 'PISO NORMATIVO/ JORNADA DE 8 HORAS DIÁRIAS', cargaHoraria: '44h', pisoSalarial: 'R$ 2314,00' },
          { cargo: 'PISO NORMATIVO/ JORNADA DE 6 HORAS DIÁRIAS', cargaHoraria: '36h', pisoSalarial: 'R$ 1736,00' }
        ],
        outrasInfos: [
          { nome: 'DATA BASE', valor: '01 JULHO' },
          { nome: 'SITE', valor: 'www.sindpdal.org.br' },
          { nome: 'VALE REFEIÇÃO', valor: 'VA/VR R$26,75 (FIXO 22 DIAS)' },
          { nome: 'PARTICULARIDADE', valor: 'HORAS EXTRAS 60% (SEG-SAB), 100% (DOM/FER)' }
        ]
      }
    ]
  },
  {
    sigla: 'SP',
    sindicatos: [
      {
        nome: 'SINDPD SP',
        cnpj: '00.000.000/0001-00',
        infoPrincipais: [
          { cargo: 'DIGITADOR', cargaHoraria: '30H SEMANAIS', pisoSalarial: 'R$ 2025,00' },
          { cargo: 'ATIVIDADES ADMINISTRATIVAS', cargaHoraria: '40H SEMANAIS', pisoSalarial: 'R$ 1615,00' },
          { cargo: 'ATIVIDADE TÉCNICA INFORMATICA', cargaHoraria: '40H SEMANAIS', pisoSalarial: 'R$ 2245,00' },
          { cargo: 'TÉCNICO DE SUPORTE', cargaHoraria: '40H SEMANAIS', pisoSalarial: 'R$ 2245,00' }
        ],
        outrasInfos: [
          { nome: 'DATA BASE', valor: '01 JANEIRO 2024' },
          { nome: 'SITE', valor: 'www.sindpd.org.br' },
          { nome: 'VALE REFEIÇÃO', valor: 'VR R$ 28,00 PARA 08 HORAS (FIXO 22 DIAS MÊS) = R$ 616,00' }
        ],
        valoresHoraExtra: [
          { dia: 'DIAS ÚTEIS (PRIMEIRAS 2 HORAS)', percentual: '75%', valor: 'R$ 23,63' },
          { dia: 'DIAS ÚTEIS (APÓS 2 HORAS)', percentual: '100%', valor: 'R$ 27,00' },
          { dia: 'FINAL DE SEMANA E FERIADO', percentual: '100%', valor: 'R$ 27,00' }
        ]
      }
    ]
  },
  {
    sigla: 'RJ',
    sindicatos: [
      {
        nome: 'SINDPD RJ',
        cnpj: '00.000.000/0001-00',
        infoPrincipais: [
          { cargo: 'ASSISTENTE/AUXILIAR ADMINISTRATIVO', cargaHoraria: '40H SEMANAIS', pisoSalarial: 'R$ 1540,00' },
          { cargo: 'SECRETÁRIA', cargaHoraria: '40H SEMANAIS', pisoSalarial: 'R$ 1540,00' },
          { cargo: 'DIGITADOR, DIGITADOR DE TERMINAL', cargaHoraria: '30H SEMANAIS', pisoSalarial: 'R$ 1699,38' }
        ],
        outrasInfos: [
          { nome: 'DATA BASE', valor: '01 SETEMBRO 2023' },
          { nome: 'SITE', valor: 'http://sindpdrj.org.br/' },
          { nome: 'VALE REFEIÇÃO', valor: 'VR R$ 35,00 P/8h (FIXO 21 DIAS) = 735,00' }
        ],
        valoresHoraExtra: [
          { dia: 'DIAS NORMAIS', percentual: '50%', valor: 'R$ 11,55' },
          { dia: 'FINAL DE SEMANA E FERIADO', percentual: '100%', valor: 'R$ 15,40' }
        ]
      }
    ]
  }
];

const PainelSindicatos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const [expandedSindicatos, setExpandedSindicatos] = useState<Record<string, boolean>>({});
  const [dados, setDados] = useState<EstadoSindicatos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Para o propósito deste exemplo, vamos usar os dados estruturados
    // Em uma implementação real, buscaríamos do Supabase
    setDados(sindicatosPorEstado);
    setLoading(false);
  }, []);

  // Filter and search logic
  const filteredEstados = dados.filter(estado => {
    // Estado filter logic
    if (estadoFilter !== "all" && estado.sigla !== estadoFilter) return false;
    
    // Search term logic
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      const estadoMatches = siglas_estados[estado.sigla]?.toLowerCase().includes(termLower);
      const sindicatoMatches = estado.sindicatos.some(sind => 
        sind.nome.toLowerCase().includes(termLower) || 
        sind.infoPrincipais.some(info => 
          Object.values(info).some(val => val.toString().toLowerCase().includes(termLower))
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
              <Card className="overflow-hidden hover-scale">
                <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <h2 className="text-xl font-bold">{siglas_estados[estado.sigla]}</h2>
                  </div>
                  <div className="text-sm opacity-80 mt-1">
                    {estado.sindicatos.length} Sindicato{estado.sindicatos.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <CardContent className="p-0">
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
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Info className="h-3 w-3" />
                              <span>CNPJ: {sindicato.cnpj}</span>
                            </div>
                            
                            {sindicato.infoPrincipais && sindicato.infoPrincipais.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Informações Principais</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full min-w-[400px] border-collapse text-left">
                                    <thead>
                                      <tr>
                                        {Object.keys(sindicato.infoPrincipais[0]).filter(k => k !== 'cbo' || sindicato.infoPrincipais[0].cbo).map(key => (
                                          <th key={key} className="p-2 border bg-muted text-xs uppercase">{key}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sindicato.infoPrincipais.map((info, i) => (
                                        <tr key={i} className="even:bg-muted/30">
                                          {Object.entries(info).filter(([k]) => k !== 'cbo' || info.cbo).map(([key, value], j) => (
                                            <td key={j} className="p-2 border">{String(value)}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            
                            {sindicato.outrasInfos && sindicato.outrasInfos.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Outras Informações</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {sindicato.outrasInfos.map((info, i) => (
                                    <div key={i} className="bg-muted/30 p-2 rounded border-l-2 border-primary">
                                      <div className="text-xs font-medium">{info.nome}</div>
                                      <div>{info.valor}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {sindicato.valoresHoraExtra && sindicato.valoresHoraExtra.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs text-accent-foreground">Valores Hora Extra</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse text-left">
                                    <thead>
                                      <tr>
                                        {Object.keys(sindicato.valoresHoraExtra[0]).map(key => (
                                          <th key={key} className="p-2 border bg-muted text-xs uppercase">{key}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sindicato.valoresHoraExtra.map((valor, i) => (
                                        <tr key={i} className="even:bg-muted/30">
                                          {Object.values(valor).map((v, j) => (
                                            <td key={j} className="p-2 border">{String(v)}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
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
