
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, User, Mail, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contato = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    mensagem: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
        duration: 5000,
      });
      setIsSubmitting(false);
      setFormData({
        nome: "",
        email: "",
        empresa: "",
        mensagem: ""
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-4xl py-6 animate-fade-in">
      <div className="flex flex-col gap-2 mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Entre em Contato</h1>
        <p className="text-muted-foreground">
          Tire dúvidas sobre o sistema ou solicite informações adicionais.
        </p>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Envie sua mensagem
            </CardTitle>
            <CardDescription>
              Preencha o formulário abaixo e retornaremos o mais breve possível
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa/Instituição</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="empresa"
                    name="empresa"
                    placeholder="Nome da sua empresa ou instituição"
                    className="pl-10"
                    value={formData.empresa}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem</Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Digite sua mensagem, dúvida ou solicitação..."
                  rows={5}
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar mensagem
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>
              Outras formas de entrar em contato conosco
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">E-mail</h3>
              <p className="text-sm">contato@sindicatos.com.br</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Telefone</h3>
              <p className="text-sm">(31) 3333-4444</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Endereço</h3>
              <p className="text-sm">
                Av. Amazonas, 7675<br />
                Nova Gameleira<br />
                Belo Horizonte - MG<br />
                30510-000
              </p>
            </div>
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Horário de Atendimento</h3>
              <p className="text-sm">Segunda a Sexta: 9h às 18h</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contato;
