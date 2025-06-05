
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchResult } from "@/types/busca-convencoes";
import { getProviderIcon, getStatusIcon, getStatusIconProps } from "@/utils/busca-convencoes";

interface SearchHistoryProps {
  searchResults: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
}

export const SearchHistory = ({ searchResults, onSelectResult }: SearchHistoryProps) => {
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Buscas</CardTitle>
        <CardDescription>
          Últimas buscas realizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {searchResults.map((result) => {
            const ProviderIcon = getProviderIcon(result.provider);
            const StatusIcon = getStatusIcon(result.status);
            const statusProps = getStatusIconProps(result.status);

            return (
              <div 
                key={result.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onSelectResult(result)}
              >
                <div className="flex items-center gap-3">
                  <ProviderIcon className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-sm">{result.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(result.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{result.provider}</Badge>
                  <StatusIcon {...statusProps} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
