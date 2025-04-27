
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Copy, Check, FileText, TableIcon, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    type: 'convencao' | 'pdf' | 'database';
    reference: string;
  }[];
  tables?: Array<{
    title: string;
    columns: string[];
    data: any[];
  }>;
  charts?: Array<{
    title: string;
    type: 'bar' | 'line' | 'pie';
    data: any;
  }>;
}

const Chat = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o assistente de Convenções Coletivas. Como posso ajudar você hoje? Você pode me perguntar sobre sindicatos específicos, convenções coletivas, pisos salariais, benefícios e mais.',
      timestamp: new Date(),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse: Message;

      // Different responses based on keywords in user input
      if (input.toLowerCase().includes('piso') || input.toLowerCase().includes('salário')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'De acordo com as convenções coletivas mais recentes, o piso salarial para a categoria de comércio em Minas Gerais varia entre R$ 1.800,00 para auxiliares administrativos e R$ 1.950,00 para vendedores. Esses valores foram estabelecidos na convenção coletiva vigente desde março de 2024.',
          timestamp: new Date(),
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
          ],
          tables: [
            {
              title: "Pisos Salariais por Categoria",
              columns: ["Cargo", "Piso Salarial", "Data Base", "Sindicato"],
              data: [
                { Cargo: "Auxiliar Administrativo", "Piso Salarial": "R$ 1.800,00", "Data Base": "01/03/2023", "Sindicato": "SINDICOM" },
                { Cargo: "Vendedor", "Piso Salarial": "R$ 1.950,00", "Data Base": "01/03/2023", "Sindicato": "SINDICOM" },
                { Cargo: "Operador de Caixa", "Piso Salarial": "R$ 1.820,00", "Data Base": "01/03/2023", "Sindicato": "SINDICOM" },
                { Cargo: "Metalúrgico Nível 1", "Piso Salarial": "R$ 2.200,00", "Data Base": "01/09/2022", "Sindicato": "SINDMETAL" }
              ]
            }
          ]
        };
      } else if (input.toLowerCase().includes('hora extra')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Segundo as convenções vigentes, o adicional de hora extra varia conforme a categoria. Para comerciários em MG, o percentual é de 50% em dias normais e 100% aos domingos e feriados. Já para metalúrgicos, o adicional é de 55% em dias normais e 110% aos domingos e feriados.',
          timestamp: new Date(),
          sources: [
            { 
              title: 'CCT Comerciários MG 2023-2024', 
              type: 'convencao',
              reference: 'Cláusula 12.3'
            },
            { 
              title: 'CCT Metalúrgicos MG 2022-2024', 
              type: 'convencao',
              reference: 'Cláusula 8.1'
            }
          ]
        };
      } else if (input.toLowerCase().includes('sindicato') || input.toLowerCase().includes('cnpj')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Encontrei as seguintes informações sobre o SINDICATO DOS EMPREGADOS NO COMÉRCIO:\n\nCNPJ: 23.112.429/0001-89\nData Base: 01/03\nAbrangência: Belo Horizonte e região metropolitana\nVigência atual: Março/2023 a Fevereiro/2024',
          timestamp: new Date(),
          sources: [
            {
              title: 'Registro Sindical',
              type: 'database',
              reference: 'Base MTE - atualizada em 20/03/2024'
            }
          ]
        };
      } else if (input.toLowerCase().includes('comparar') || input.toLowerCase().includes('histórico')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Analisando os dados das convenções coletivas dos últimos 5 anos, observa-se uma tendência de crescimento nos pisos salariais acima da inflação para algumas categorias específicas. O setor metalúrgico apresentou os maiores aumentos, seguido pelo comércio.',
          timestamp: new Date(),
          sources: [
            {
              title: 'Histórico de Convenções',
              type: 'database',
              reference: 'Análise temporal 2020-2024'
            }
          ],
          charts: [
            {
              title: "Evolução de Pisos Salariais (2020-2024)",
              type: "bar",
              data: {
                labels: ["2020", "2021", "2022", "2023", "2024"],
                datasets: [
                  { label: "SINDICOM", data: [1450, 1550, 1650, 1800, 1950] },
                  { label: "SINDMETAL", data: [1650, 1800, 1950, 2200, 2380] }
                ]
              }
            }
          ]
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Com base nas informações disponíveis em nossa base de dados, posso informar que as convenções coletivas são instrumentos normativos firmados entre sindicatos representativos das categorias profissionais e econômicas. Se você precisar de informações específicas sobre algum sindicato, convenção, piso salarial ou outro aspecto trabalhista, por favor, me pergunte de forma mais detalhada.',
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderTable = (table: { title: string; columns: string[]; data: any[] }) => {
    return (
      <div className="mt-3 mb-3 overflow-x-auto">
        <h4 className="text-xs font-medium mb-1 flex items-center gap-1">
          <TableIcon className="h-3 w-3" />
          {table.title}
        </h4>
        <Table className="text-xs border rounded-md">
          <TableHeader>
            <TableRow>
              {table.columns.map((column, idx) => (
                <TableHead key={idx} className="py-1 px-2">{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.data.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {table.columns.map((column, colIdx) => (
                  <TableCell key={colIdx} className="py-1 px-2">{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderChart = (chart: { title: string; type: string; data: any }) => {
    return (
      <div className="mt-3 p-3 bg-muted rounded-md">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium flex items-center gap-1">
            <BarChart2 className="h-3 w-3" />
            {chart.title}
          </h4>
        </div>
        <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-sm border">
          <div className="p-2 text-center">
            <p className="text-sm font-medium mb-2">Dados do Gráfico ({chart.type})</p>
            <div className="flex gap-4 justify-center">
              {chart.data.datasets.map((dataset: any, i: number) => (
                <div key={i} className="text-xs">
                  <p className="font-medium">{dataset.label}</p>
                  <ul>
                    {dataset.data.map((value: number, j: number) => (
                      <li key={j}>
                        {chart.data.labels[j]}: R$ {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-h-[calc(100vh-7rem)] animate-fade-in">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Chat IA</h1>
        <p className="text-muted-foreground">
          Consulte informações sobre convenções coletivas usando IA com rastreabilidade.
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex gap-3 max-w-[85%] animate-slide-in",
                message.role === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                {message.role === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              
              <div>
                <div 
                  className={cn(
                    "rounded-lg p-4",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card border"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {message.role === 'assistant' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 ml-2 mt-0 opacity-70 hover:opacity-100"
                              onClick={() => copyToClipboard(message.id, message.content)}
                            >
                              {copied === message.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {copied === message.id ? 'Copiado!' : 'Copiar mensagem'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  {/* Render tables if present */}
                  {message.tables && message.tables.length > 0 && (
                    <div className="mt-3">
                      {message.tables.map((table, i) => renderTable(table))}
                    </div>
                  )}
                  
                  {/* Render charts if present */}
                  {message.charts && message.charts.length > 0 && (
                    <div className="mt-3">
                      {message.charts.map((chart, i) => renderChart(chart))}
                    </div>
                  )}
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                      <div className="flex items-center gap-1 text-xs opacity-70">
                        <Sparkles className="h-3 w-3" />
                        <span>Fontes ({message.sources.length})</span>
                      </div>
                      <div className="space-y-1">
                        {message.sources.map((source, i) => (
                          <div key={i} className="flex items-start gap-1 text-xs">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] h-4",
                                source.type === 'convencao' && "bg-blue-500/10 text-blue-500 border-blue-200",
                                source.type === 'pdf' && "bg-red-500/10 text-red-500 border-red-200",
                                source.type === 'database' && "bg-green-500/10 text-green-500 border-green-200"
                              )}
                            >
                              {source.type === 'convencao' && 'CCT'}
                              {source.type === 'pdf' && 'PDF'}
                              {source.type === 'database' && 'BD'}
                            </Badge>
                            <span>{source.title}: {source.reference}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <span>{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto animate-slide-in">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta sobre convenções, sindicatos ou direitos trabalhistas..."
              className="resize-none min-h-[80px]"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="flex-shrink-0 h-10 w-10" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
          
          <div className="mt-2 text-xs text-center text-muted-foreground">
            As respostas são baseadas apenas em dados verificados de convenções coletivas, com fontes rastreáveis.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
