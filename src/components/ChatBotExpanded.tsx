
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Loader2, 
  Database, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Table as TableIcon,
  BarChart2,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  pending?: boolean;
  sources?: Array<{
    title: string;
    url?: string;
    text: string;
  }>;
  tables?: Array<{
    title: string;
    data: any[];
    columns: string[];
  }>;
  charts?: Array<{
    title: string;
    type: 'bar' | 'line' | 'pie';
    data: any;
  }>;
}

export function ChatBotExpanded() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const toggleSourceExpand = (messageId: string) => {
    if (expandedSources.includes(messageId)) {
      setExpandedSources(expandedSources.filter(id => id !== messageId));
    } else {
      setExpandedSources([...expandedSources, messageId]);
    }
  };

  const copyToClipboard = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Mock function to simulate sending a message to the AI
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI thinking...
    setTimeout(() => {
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(content),
        timestamp: new Date(),
        sources: [
          {
            title: "Convenção Coletiva SINDICOM 2023-2024",
            text: "Cláusula 5ª - O piso salarial para a categoria é de R$ 1.800,00 a partir de 01/03/2023."
          },
          {
            title: "Acordo Coletivo SINDMETALURGICOS 2022-2024",
            text: "Art. 12 - A jornada de trabalho será de 44 horas semanais, conforme legislação vigente."
          }
        ],
        tables: content.toLowerCase().includes('piso') || content.toLowerCase().includes('salário') ? [
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
        ] : undefined,
        charts: content.toLowerCase().includes('comparação') || content.toLowerCase().includes('histórico') ? [
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
        ] : undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Mock response generator
  const generateMockResponse = (query: string): string => {
    const responses = [
      "De acordo com a convenção coletiva vigente, o piso salarial para esta categoria é de R$ 1.800,00 desde março de 2023. Este valor representa um aumento de 9,1% em relação ao piso anterior de R$ 1.650,00. A convenção também estabelece pisos diferenciados por função, conforme pode ser observado na tabela abaixo.",
      "A jornada de trabalho prevista na convenção é de 44 horas semanais, distribuídas de segunda a sexta-feira, com possibilidade de compensação aos sábados. A convenção também prevê regime de banco de horas com prazo de compensação de até 6 meses.",
      "O adicional de horas extras previsto é de 50% sobre o valor da hora normal em dias úteis e 100% aos domingos e feriados. A convenção também estabelece que o trabalho aos domingos deve ser compensado com folga em outro dia da semana.",
      "O vale-transporte deve ser fornecido pelo empregador com desconto máximo de 6% do salário básico. Além disso, empresas localizadas em regiões de difícil acesso devem oferecer transporte próprio ou adicional correspondente.",
      "A contribuição assistencial prevista na convenção é de 1,5% sobre o salário base, condicionada à não oposição do empregado. Este valor destina-se à manutenção do sistema sindical e às atividades de representação da categoria."
    ];
    
    // Enhanced selection based on query keywords
    if (query.toLowerCase().includes("piso") || query.toLowerCase().includes("salário")) {
      return responses[0];
    } else if (query.toLowerCase().includes("jornada") || query.toLowerCase().includes("hora")) {
      return responses[1];
    } else if (query.toLowerCase().includes("extra")) {
      return responses[2];
    } else if (query.toLowerCase().includes("vale") || query.toLowerCase().includes("transporte")) {
      return responses[3];
    } else if (query.toLowerCase().includes("contribuição")) {
      return responses[4];
    } else if (query.toLowerCase().includes("comparar") || query.toLowerCase().includes("comparação")) {
      return "Analisando os dados das convenções coletivas dos últimos 5 anos, observa-se uma tendência de crescimento nos pisos salariais acima da inflação para algumas categorias específicas. O setor metalúrgico apresentou os maiores aumentos, seguido pelo comércio. A média de reajuste anual foi de 8,5%, enquanto a inflação média no período foi de 6,2%. Veja o gráfico comparativo abaixo para mais detalhes.";
    } else {
      return "Com base nas convenções coletivas analisadas, não encontrei informações específicas sobre esse tema. Você poderia reformular sua pergunta ou ser mais específico sobre qual categoria profissional ou cláusula contratual você deseja informações?";
    }
  };

  // Scroll to bottom when new messages appear
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Olá! Sou o assistente IA do sistema de convenções coletivas. Como posso ajudá-lo hoje? Você pode me perguntar sobre pisos salariais, jornadas de trabalho, benefícios e outras cláusulas das convenções. Posso fornecer análises detalhadas e comparativas entre diferentes convenções coletivas.",
        timestamp: new Date(),
      }]);
    }
  }, [messages.length]);

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

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 p-0 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 transition-all duration-300 ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-96 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <h3 className="font-medium">Assistente IA - Convenções Coletivas</h3>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/80 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                                {copiedId === message.id ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              {copiedId === message.id ? 'Copiado!' : 'Copiar resposta'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    
                    {/* Tables */}
                    {message.tables && message.tables.length > 0 && (
                      <div className="mt-3">
                        {message.tables.map((table, i) => renderTable(table))}
                      </div>
                    )}
                    
                    {/* Charts placeholder (would be implemented with Recharts in a real app) */}
                    {message.charts && message.charts.length > 0 && message.charts.map((chart, i) => (
                      <div key={i} className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-medium flex items-center gap-1">
                            <BarChart2 className="h-3 w-3" />
                            {chart.title}
                          </h4>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-sm">
                          <span className="text-xs text-muted-foreground">Gráfico {chart.type} disponível na versão completa</span>
                        </div>
                      </div>
                    ))}
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex justify-between items-center py-1 px-2 h-6 text-xs font-medium mb-1"
                          onClick={() => toggleSourceExpand(message.id)}
                        >
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>Fontes ({message.sources.length})</span>
                          </span>
                          {expandedSources.includes(message.id) ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                        
                        {expandedSources.includes(message.id) && (
                          <div className="space-y-1">
                            {message.sources.map((source, i) => (
                              <div key={i} className="text-xs p-1.5 bg-gray-100 dark:bg-gray-700 rounded">
                                <p className="font-medium">{source.title}</p>
                                <p className="text-muted-foreground">{source.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-1 text-xs opacity-70 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              
              <div ref={endOfMessagesRef} />
            </div>
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        <div className="mt-2 flex justify-end">
          <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
            Alimentado por Gemini 2.5 Pro
          </Badge>
        </div>
      </div>
    </>
  );
}
