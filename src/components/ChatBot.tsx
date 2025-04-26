
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatIcon, XIcon } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Como posso ajudar com as convenções coletivas de trabalho?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate response (in a real app, this would call your API)
    setTimeout(() => {
      const botResponse = { 
        role: "assistant" as const, 
        content: "Estamos ainda integrando a API do Gemini. Em breve você poderá fazer perguntas sobre as convenções coletivas e receber respostas contextualizadas." 
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating chat button */}
      <Button
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 transition-all duration-300",
          isOpen ? "scale-0" : "scale-100"
        )}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon className="w-6 h-6" />
        <span className="sr-only">Abrir chat</span>
      </Button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-80 md:w-96 h-96 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        )}
      >
        <Card className="w-full h-full flex flex-col overflow-hidden border shadow-lg">
          {/* Chat header */}
          <div className="p-3 border-b bg-primary text-primary-foreground flex justify-between items-center">
            <h3 className="font-medium">Assistente de Convenções</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Fechar chat</span>
            </Button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                  <span className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-75">.</span>
                    <span className="animate-bounce delay-150">.</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <Input
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" disabled={isLoading}>
              Enviar
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
