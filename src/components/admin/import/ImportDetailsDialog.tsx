
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importDetails: any;
  registrosProcessados: any[];
  formatarData: (dataString: string) => string;
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Importação</DialogTitle>
          <DialogDescription>
            {importDetails && (
              <>
                Importação realizada em {formatarData(importDetails.data_inicio)} 
                {importDetails.data_fim && ` e concluída em ${formatarData(importDetails.data_fim)}`}.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {registrosProcessados.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Convenções Importadas:</h3>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Sindicato</TableHead>
                    <TableHead>Data Base</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrosProcessados.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>{registro.titulo}</TableCell>
                      <TableCell>{registro.tipo}</TableCell>
                      <TableCell>{registro.estado}</TableCell>
                      <TableCell>
                        {registro.sindicatos?.nome || "-"}
                        {registro.sindicatos?.cnpj && (
                          <div className="text-xs text-muted-foreground mt-1">
                            CNPJ: {registro.sindicatos.cnpj}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {registro.data_base ? new Date(registro.data_base).toLocaleDateString('pt-BR') : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {registrosProcessados.some(reg => reg.pisos_salariais?.length > 0) && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Pisos Salariais:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {registrosProcessados.map((registro) => 
                    registro.pisos_salariais?.map((piso: any) => (
                      <Card key={`${registro.id}-${piso.cargo}`} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 py-3">
                          <CardTitle className="text-base">{piso.cargo}</CardTitle>
                          <CardDescription>
                            {piso.carga_horaria || "Carga horária não especificada"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Piso Salarial:</span>
                            <span className="font-medium">
                              {piso.piso_salarial ? `R$ ${parseFloat(piso.piso_salarial).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : "-"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ).flat()}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhum registro detalhado disponível para esta importação</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
