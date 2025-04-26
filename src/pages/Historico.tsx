
import { useEffect, useState } from "react";
import { 
  Clock, Search, FileText, Filter, ArrowUpDown, 
  Users, Database, ArrowRight, Download, Trash2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Tipos de consultas para o histórico
type QueryType = 'all' | 'sindicato' | 'convencao' | 'cargo' | 'salario';

interface HistoryItem {
  id: string;
  query: string;
  queryType: QueryType;
  timestamp: Date;
  sourcesCount: number;
  response: string;
  sources?: {
    title: string;
    type: 'convencao' | 'pdf' | 'database';
    reference: string;
  }[];
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    query: 'Qual o piso salarial para auxiliar administrativo em BH?',
    queryType: 'salario',
    timestamp: new Date(2024, 3, 25, 14, 30),
    sourcesCount: 2,
    response: 'De acordo com as convenções coletivas mais recentes, o piso salarial para a categoria de comércio em Minas Gerais para auxiliares administrativos é de R$ 1.800,00. Esses valores foram estabelecidos na convenção coletiva vigente desde março de 2024.',
    sources: [
      { 
        title: 'CCT Comerciários MG 2023-2024', 
        type: 'convencao',
        reference: 'MG001234/2023, página 3, cláusula 4'
      },
      {
        title: 'Tabela Salarial',
        type: 'database',
        reference: 'Base de dados - atualizada em 15/04/2024'
      }
    ]
  },
  {
    id: '2',
    query: 'Informações sobre SINDICATO DOS METALÚRGICOS',
    queryType: 'sindicato',
    timestamp: new Date(2024, 3, 24, 10, 15),
    sourcesCount: 1,
    response: 'O SINDICATO DOS METALÚRGICOS possui CNPJ: 21.978.422/0001-62, com data base em 01/05 e convenção vigente de 2023-2025. A categoria tem piso salarial para soldador de R$ 2.400,00 para jornada de 44h semanais.'
  },
  {
    id: '3',
    query: 'Adicional de hora extra para professores',
    queryType: 'convencao',
    timestamp: new Date(2024, 3, 20, 16, 45),
    sourcesCount: 2,
    response: 'Para professores do ensino privado, conforme convenção coletiva vigente, o adicional de hora extra é de 50% para atividades em dias úteis e 100% para atividades em domingos e feriados. Os valores são calculados com base na hora-aula acrescida do DSR.'
  },
  {
    id: '4',
    query: 'CBO para vendedor interno',
    queryType: 'cargo',
    timestamp: new Date(2024, 3, 15, 9, 25),
    sourcesCount: 1,
    response: 'O código CBO (Classificação Brasileira de Ocupações) para Vendedor interno é 5211-10. De acordo com as convenções coletivas do comércio, este cargo tem piso salarial de R$ 1.950,00 em Minas Gerais.'
  },
  {
    id: '5',
    query: 'Principais benefícios para bancários',
    queryType: 'convencao',
    timestamp: new Date(2024, 3, 10, 11, 30),
    sourcesCount: 3,
    response: 'Os principais benefícios para bancários, conforme a convenção coletiva vigente, incluem: vale-alimentação de R$ 880,00, PLR (Participação nos Lucros e Resultados) com regras específicas, auxílio-creche de R$ 650,00 para filhos até 71 meses, entre outros benefícios.'
  }
];

const Historico = () => {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<QueryType>("all");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    // Ordenar por data
    const sorted = [...mockHistory].sort((a, b) => {
      if (dateSort === "asc") {
        return a.timestamp.getTime() - b.timestamp.getTime();
      } else {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });
    
    // Filtrar por tipo
    const filtered = sorted.filter(item => {
      if (typeFilter !== "all" && item.queryType !== typeFilter) {
        return false;
      }
      
      // Filtrar pela busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          item.query.toLowerCase().includes(term) ||
          item.response.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
    
    setHistory(filtered);
  }, [searchTerm, typeFilter, dateSort]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQueryTypeIcon = (type: QueryType) => {
    switch (type) {
      case 'sindicato':
        return <Users className="h-3 w-3" />;
      case 'convencao':
        return <FileText className="h-3 w-3" />;
      case 'cargo':
        return <Users className="h-3 w-3" />;
      case 'salario':
        return <Database className="h-3 w-3" />;
      default:
        return <Search className="h-3 w-3" />;
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Consultas</h1>
        <p className="text-muted-foreground">
          Histórico de consultas realizadas no chat IA com suas respostas e fontes.
        </p>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar no histórico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as QueryType)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filtrar por tipo" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="sindicato">Sindicatos</SelectItem>
              <SelectItem value="convencao">Convenções</SelectItem>
              <SelectItem value="cargo">Cargos</SelectItem>
              <SelectItem value="salario">Salários</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDateSort(dateSort === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="sr-only">Ordenar por data</span>
          </Button>
        </div>
      </div>

      {history.length > 0 ? (
        <Card>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Data</TableHead>
                  <TableHead>Consulta</TableHead>
                  <TableHead className="w-[100px]">Tipo</TableHead>
                  <TableHead className="w-[100px]">Fontes</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(item.timestamp)}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[400px]">{item.query}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[400px]">{item.response.substring(0, 100)}...</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1 w-fit"
                      >
                        {getQueryTypeIcon(item.queryType)}
                        <span className="capitalize">
                          {item.queryType === 'all' ? 'Geral' : item.queryType}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.sourcesCount} {item.sourcesCount === 1 ? 'fonte' : 'fontes'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Search className="h-4 w-4" />
                              <span className="sr-only">Ver detalhes</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Consulta</DialogTitle>
                              <DialogDescription className="flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                {selectedItem && formatDate(selectedItem.timestamp)} às {selectedItem && formatTime(selectedItem.timestamp)}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedItem && (
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-sm font-medium mb-1">Consulta</h3>
                                  <p className="text-sm bg-muted/50 p-2 rounded-md">{selectedItem.query}</p>
                                </div>
                                
                                <div>
                                  <h3 className="text-sm font-medium mb-1">Resposta</h3>
                                  <div className="text-sm bg-muted/50 p-2 rounded-md">
                                    <p>{selectedItem.response}</p>
                                  </div>
                                </div>
                                
                                {selectedItem.sources && selectedItem.sources.length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-medium mb-1">Fontes</h3>
                                    <div className="space-y-2">
                                      {selectedItem.sources.map((source, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm bg-muted/30 p-2 rounded-md">
                                          <Badge 
                                            variant="outline" 
                                            className={cn(
                                              "text-xs h-5",
                                              source.type === 'convencao' && "bg-blue-500/10 text-blue-500 border-blue-200",
                                              source.type === 'pdf' && "bg-red-500/10 text-red-500 border-red-200",
                                              source.type === 'database' && "bg-green-500/10 text-green-500 border-green-200"
                                            )}
                                          >
                                            {source.type === 'convencao' && 'Convenção'}
                                            {source.type === 'pdf' && 'PDF'}
                                            {source.type === 'database' && 'Banco de Dados'}
                                          </Badge>
                                          <div className="flex-1">
                                            <div className="font-medium">{source.title}</div>
                                            <div className="text-xs text-muted-foreground">{source.reference}</div>
                                          </div>
                                          <Button variant="ghost" size="sm" className="h-6 px-2">
                                            <ArrowRight className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <DialogFooter>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" /> Exportar Consulta
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Filter className="h-4 w-4" />
                              <span className="sr-only">Mais opções</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => deleteHistoryItem(item.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum resultado encontrado</CardTitle>
            <CardDescription>
              Não foram encontradas consultas com os filtros selecionados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted/40 p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground max-w-md">
              Tente usar outros termos na busca ou alterar os filtros.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Historico;
