
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

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

  return (
    <Card className="hover:shadow-md transition-shadow glass-card">
      <CardHeader className="pb-2 gap-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold line-clamp-2">{title}</CardTitle>
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "Vigente" : "Expirada"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {numero} / {ano}
        </p>
      </CardHeader>
      <CardContent className="space-y-2 pb-3">
        <div className="grid gap-1">
          <p className="text-sm font-medium">Sindicatos:</p>
          <div className="flex flex-wrap gap-1">
            {sindicatos.map((sindicato, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {sindicato}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-1">
          <p className="text-sm font-medium">Vigência:</p>
          <p className="text-xs text-muted-foreground">
            {new Date(vigenciaInicio).toLocaleDateString("pt-BR")} até{" "}
            {new Date(vigenciaFim).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onView}
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
