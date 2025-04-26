
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Loader2, Database } from "lucide-react";

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
}

export function ChatBotExpanded() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

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
        ]
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Mock response generator
  const generateMockResponse = (query: string): string => {
    const responses = [
      "De acordo com a convenção coletiva vigente, o piso salarial para esta categoria é de R$ 1.800,00 desde março de 2023.",
      "A jornada de trabalho prevista na convenção é de 44 horas semanais, distribuídas de segunda a sexta-feira.",
      "O adicional de horas extras previsto é de 50% sobre o valor da hora normal em dias úteis e 100% aos domingos e feriados.",
      "O vale-transporte deve ser fornecido pelo empregador com desconto máximo de 6% do salário básico.",
      "A contribuição assistencial prevista na convenção é de 1,5% sobre o salário base, condicionada à não oposição do empregado."
    ];
    
    // Simple selection based on query keywords
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
    } else {
      return "Com base nas convenções coletivas analisadas, não encontrei informações específicas sobre esse tema. Você poderia reformular sua pergunta ou ser mais específico?";
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
        content: "Olá! Sou o assistente IA do sistema de convenções coletivas. Como posso ajudá-lo hoje? Você pode me perguntar sobre pisos salariais, jornadas de trabalho, benefícios e outras cláusulas das convenções.",
        timestamp: new Date(),
      }]);
    }
  }, [messages.length]);

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
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <h3 className="font-medium">Assistente IA - Convenções Coletivas</h3>
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
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/80 dark:bg-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium mb-1">Fontes:</p>
                        <div className="space-y-1">
                          {message.sources.map((source, i) => (
                            <div key={i} className="text-xs p-1.5 bg-gray-100 dark:bg-gray-700 rounded">
                              <p className="font-medium">{source.title}</p>
                              <p className="text-muted-foreground line-clamp-2">{source.text}</p>
                            </div>
                          ))}
                        </div>
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
