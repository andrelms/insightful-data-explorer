
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PisoSalarial {
  id: string;
  valor: string;
  descricao?: string;
}

interface Particularidade {
  id: string;
  categoria?: string;
  conteudo?: string;
  descricao?: string;
}

interface Beneficio {
  id: string;
  tipo: string;
  valor?: string | null;
  descricao?: string | null;
}

interface ConvencaoTabsProps {
  pisosSalariais: PisoSalarial[];
  particularidades: Particularidade[];
  beneficios: Beneficio[];
}

export function ConvencaoTabs({ pisosSalariais, particularidades, beneficios }: ConvencaoTabsProps) {
  // Filtrar benefícios para remover tipo 'site'
  const beneficiosFiltrados = beneficios.filter(beneficio => 
    beneficio.tipo !== 'site'
  );

  return (
    <Tabs defaultValue="pisos" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="pisos">Pisos Salariais</TabsTrigger>
        <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
        <TabsTrigger value="particularidades">Particularidades</TabsTrigger>
      </TabsList>

      <TabsContent value="pisos" className="mt-0">
        {pisosSalariais.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pisosSalariais.map((piso) => (
                  <TableRow key={piso.id}>
                    <TableCell className="font-medium">Piso Salarial</TableCell>
                    <TableCell>
                      {piso.valor 
                        ? `R$ ${parseFloat(piso.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                        : "-"}
                    </TableCell>
                    <TableCell>{piso.descricao || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Não há informações sobre pisos salariais para esta convenção.
          </div>
        )}
      </TabsContent>

      <TabsContent value="beneficios" className="mt-0">
        {beneficiosFiltrados.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beneficiosFiltrados.map((beneficio) => (
                <div key={beneficio.id} className="p-4 border rounded-md">
                  <h4 className="font-medium text-sm mb-1">{beneficio.tipo}</h4>
                  {beneficio.valor && (
                    <p className="text-sm text-muted-foreground mt-1">{beneficio.valor}</p>
                  )}
                  {beneficio.descricao && (
                    <p className="text-sm text-muted-foreground mt-1">{beneficio.descricao}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Não há informações sobre benefícios para esta convenção.
          </div>
        )}
      </TabsContent>

      <TabsContent value="particularidades" className="mt-0">
        {particularidades.length > 0 ? (
          <div className="space-y-4">
            {particularidades.map((part) => (
              <div key={part.id} className="p-4 border rounded-md">
                {part.categoria && (
                  <h4 className="font-medium text-sm mb-1">{part.categoria}</h4>
                )}
                <p>{part.conteudo || part.descricao}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Não há informações sobre particularidades para esta convenção.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
