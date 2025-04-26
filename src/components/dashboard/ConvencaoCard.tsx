
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText } from "lucide-react";

interface ConvencaoProps {
  title: string;
  numero: string;
  ano: number;
  sindicatos: string[];
  vigenciaInicio: string;
  vigenciaFim: string;
  onView?: () => void;
}

export function ConvencaoCard({
  title,
  numero,
  ano,
  sindicatos,
  vigenciaInicio,
  vigenciaFim,
  onView,
}: ConvencaoProps) {
  const isActive = new Date() <= new Date(vigenciaFim);
  const formattedDateStart = new Date(vigenciaInicio).toLocaleDateString("pt-BR");
  const formattedDateEnd = new Date(vigenciaFim).toLocaleDateString("pt-BR");
  
  // Função para limitar o tamanho do título
  const truncateTitle = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className="overflow-hidden border transition-all hover-scale hover-glow">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className={`p-4 border-b ${isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/10 dark:to-gray-800/20'}`}>
            <div className="flex justify-between items-start gap-2 mb-2">
              <Badge variant={isActive ? "default" : "outline"} className={`${isActive ? 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-400' : ''}`}>
                {isActive ? "Vigente" : "Expirada"}
              </Badge>
              <span className="text-xs text-muted-foreground">{numero}</span>
            </div>
            <h3 className="font-semibold line-clamp-2 min-h-[2.5rem]">
              {truncateTitle(title, 65)}
            </h3>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Vigência: {formattedDateStart} até {formattedDateEnd}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {sindicatos.map((sindicato, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {sindicato}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onView}
              className="w-full mt-4 flex items-center justify-center gap-2"
            >
              <FileText className="h-3.5 w-3.5" />
              Visualizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
