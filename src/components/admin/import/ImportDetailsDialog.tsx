
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ImportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importDetails: any;
  registrosProcessados: any[];
  formatarData: (date: string) => string;
}

export function ImportDetailsDialog({
  open,
  onOpenChange,
  importDetails,
  registrosProcessados,
  formatarData
}: ImportDetailsDialogProps) {
  if (!importDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Detalhes da Importação</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="data">Dados Processados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="h-[calc(80vh-180px)]">
            <ScrollArea className="h-full p-4 rounded-md border">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="font-semibold">Origem</h3>
                    <p>{importDetails.origem || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Data de Início</h3>
                    <p>{formatarData(importDetails.data_inicio)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <p>{importDetails.status || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Data de Conclusão</h3>
                    <p>{importDetails.data_fim ? formatarData(importDetails.data_fim) : "Em andamento"}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Registros Processados</h3>
                  <p>{importDetails.registros_processados || 0}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Detalhes</h3>
                  {importDetails.detalhes ? (
                    <div className="p-3 bg-muted rounded-md overflow-x-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {(() => {
                          try {
                            const detalhes = JSON.parse(importDetails.detalhes);
                            return JSON.stringify(detalhes, null, 2);
                          } catch (e) {
                            return importDetails.detalhes;
                          }
                        })()}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum detalhe disponível</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="data" className="h-[calc(80vh-180px)]">
            <ScrollArea className="h-full p-4 rounded-md border">
              {registrosProcessados && registrosProcessados.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Dados Extraídos</h3>
                    <div className="p-3 bg-muted rounded-md overflow-x-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(registrosProcessados[0].content, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">Nenhum dado processado disponível</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
