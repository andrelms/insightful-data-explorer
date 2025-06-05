
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { SearchResult as SearchResultType } from "@/types/busca-convencoes";
import { getProviderIcon, getStatusIcon, getStatusIconProps } from "@/utils/busca-convencoes";

interface SearchResultProps {
  result: SearchResultType;
  processing: boolean;
  onStartProcessing: (resultId: string) => void;
}

export const SearchResult = ({ result, processing, onStartProcessing }: SearchResultProps) => {
  const ProviderIcon = getProviderIcon(result.provider);
  const StatusIcon = getStatusIcon(result.status);
  const statusProps = getStatusIconProps(result.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ProviderIcon className="h-5 w-5" />
          Resultado da Busca
          <Badge variant="outline">{result.provider}</Badge>
          <StatusIcon {...statusProps} />
        </CardTitle>
        <CardDescription>
          Consulta: {result.query}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Etapas do Raciocínio */}
        {result.etapas_raciocinio && result.etapas_raciocinio.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Etapas do Raciocínio</h4>
            <div className="space-y-1">
              {result.etapas_raciocinio.map((etapa, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  {etapa}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fontes de Referência */}
        {result.referencia_fontes && result.referencia_fontes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Fontes de Referência</h4>
            <div className="space-y-1">
              {result.referencia_fontes.map((fonte, index) => (
                <div key={index} className="text-sm text-blue-600 hover:underline">
                  • {fonte}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resposta Bruta */}
        <div className="space-y-2">
          <h4 className="font-medium">Resposta da IA</h4>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result.raw_response, null, 2)}
            </pre>
          </div>
        </div>

        {/* Processamento */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Processamento para o Banco</h4>
              <p className="text-sm text-muted-foreground">
                Processar e salvar os dados estruturados no Supabase
              </p>
            </div>
            <Button 
              onClick={() => onStartProcessing(result.id)}
              disabled={processing}
              variant="outline"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Processar Dados"
              )}
            </Button>
          </div>
          {processing && (
            <div className="mt-4">
              <Progress value={33} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Processando dados por hierarquia: sindicatos → convenções → cargos...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
