
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dicionário de siglas dos estados
const siglas_estados = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia',
  'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás',
  'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais',
  'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí',
  'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
  'SE': 'Sergipe', 'TO': 'Tocantins'
};

// Mock data para sindicatos por estado
const mockSindicatosPorEstado = [
  {
    sigla: 'MG',
    sindicatos: [
      {
        nome: 'SINDICATO DOS EMPREGADOS NO COMÉRCIO',
        cnpj: '23.112.429/0001-89',
        infoPrincipais: [
          { cargo: 'Auxiliar Administrativo', cbo: '4110-05', cargaHoraria: '44h', pisoSalarial: 'R$ 1.800,00' },
          { cargo: 'Vendedor', cbo: '5211-10', cargaHoraria: '44h', pisoSalarial: 'R$ 1.950,00' }
        ],
        outrasInfos: [
          { nome: 'DATA BASE', valor: '01/03/2024' },
          { nome: 'VIGÊNCIA', valor: '2023-2024' }
        ],
        valoresHoraExtra: [
          { dia: 'Normal', percentual: '50%', valor: 'R$ 12,27' },
          { dia: 'Domingo/Feriado', percentual: '100%', valor: 'R$ 18,40' }
        ]
      },
      {
        nome: 'SINDICATO DOS METALÚRGICOS',
        cnpj: '21.978.422/0001-62',
        infoPrincipais: [
          { cargo: 'Soldador', cbo: '7243-15', cargaHoraria: '44h', pisoSalarial: 'R$ 2.400,00' }
        ],
        outrasInfos: [
          { nome: 'DATA BASE', valor: '01/05/2024' },
          { nome: 'VIGÊNCIA', valor: '2023-2025' }
        ],
        valoresHoraExtra: [
          { dia: 'Normal', percentual: '55%', valor: 'R$ 15,30' },
          { dia: 'Domingo/Feriado', percentual: '110%', valor: 'R$ 21,50' }
        ]
      }
    ]
  },
  {
    sigla: 'SP',
    sindicatos: [
      {
        nome: 'SINDICATO DOS BANCÁRIOS',
        cnpj: '61.651.675/0001-95',
        infoPrincipais: [
          { cargo: 'Caixa', cbo: '4132-10', cargaHoraria: '30h', pisoSalarial: 'R$ 3.200,00' }
        ],
        outrasInfos: [
          { nome: 'DATA BASE', valor: '01/09/2024' },
          { nome: 'VIGÊNCIA', valor: '2022-2024' }
        ],
        valoresHoraExtra: [
          { dia: 'Normal', percentual: '60%', valor: 'R$ 25,60' }
        ]
      }
    ]
  },
  {
    sigla: 'RJ',
    sindicatos: [
      {
        nome: 'SINDICATO DOS PROFESSORES',
        cnpj: '33.654.328/0001-41',
        infoPrincipais: [
          { cargo: 'Professor Ensino Médio', cbo: '2321-05', cargaHoraria: '20h', pisoSalarial: 'R$ 2.800,00' },
          { cargo: 'Professor Ensino Superior', cbo: '2341-15', cargaHoraria: '20h', pisoSalarial: 'R$ 4.200,00' }
        ],
        outrasInfos: [
          { nome: 'DATA BASE', valor: '01/04/2024' },
          { nome: 'VIGÊNCIA', valor: '2023-2024' }
        ]
      }
    ]
  }
];

const PainelSindicatos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [categoriaFilter, setCategoriaSFilter] = useState("");
  const [expandedSindicatos, setExpandedSindicatos] = useState<Record<string, boolean>>({});

  // Filter and search logic
  const filteredEstados = mockSindicatosPorEstado.filter(estado => {
    // Estado filter logic
    if (estadoFilter && estado.sigla !== estadoFilter) return false;
    
    // Search term logic
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      const estadoMatches = siglas_estados[estado.sigla as keyof typeof siglas_estados]?.toLowerCase().includes(termLower);
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
              <SelectItem value="">Todos os estados</SelectItem>
              {Object.entries(siglas_estados).map(([sigla, nome]) => (
                <SelectItem key={sigla} value={sigla}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={categoriaFilter} onValueChange={setCategoriaSFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              <SelectItem value="hora-extra">Hora Extra</SelectItem>
              <SelectItem value="piso">Piso Salarial</SelectItem>
              <SelectItem value="beneficios">Benefícios</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEstados.map((estado) => (
          <div key={estado.sigla} className="estado-card fade-in" data-estado={estado.sigla.toLowerCase()}>
            <Card className="overflow-hidden hover-scale">
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <h2 className="text-xl font-bold">{siglas_estados[estado.sigla as keyof typeof siglas_estados]}</h2>
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
                                      {Object.keys(sindicato.infoPrincipais[0]).map(key => (
                                        <th key={key} className="p-2 border bg-muted text-xs uppercase">{key}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sindicato.infoPrincipais.map((info, i) => (
                                      <tr key={i} className="even:bg-muted/30">
                                        {Object.values(info).map((value, j) => (
                                          <td key={j} className="p-2 border">{value}</td>
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
                                          <td key={j} className="p-2 border">{v}</td>
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
    </div>
  );
};

export default PainelSindicatos;
