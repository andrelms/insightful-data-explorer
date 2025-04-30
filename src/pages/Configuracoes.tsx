
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Configuracoes = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e sistema.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white">
            <CardTitle>Área Administrativa</CardTitle>
            <CardDescription className="text-blue-100">
              Para configurações avançadas do sistema, acesse a área administrativa completa.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-muted/30 rounded-md p-4 mb-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1">Configurações Disponíveis na Área Admin</h3>
                <p className="text-sm text-muted-foreground">
                  A página de configurações foi consolidada. Para gerenciar o sistema, importar dados 
                  e monitorar logs, acesse a área administrativa completa.
                </p>
                <Button 
                  className="mt-3"
                  variant="default" 
                  onClick={() => navigate('/admin')}
                >
                  Acessar Área Administrativa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracoes;
