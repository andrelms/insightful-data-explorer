
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Calendar, FileText, Users } from "lucide-react";

interface ConvencaoDetailsProps {
  id: string;
}

export function ConvencaoDetails({ id }: ConvencaoDetailsProps) {
  const [convencao, setConvencao] = useState<any | null>(null);
  const [pisosSalariais, setPisosSalariais] = useState<any[]>([]);
  const [particularidades, setParticularidades] = useState<any[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados principais da convenção
        const { data: convencaoData, error: convencaoError } = await supabase
          .from('convenios')
          .select(`
            *,
            sindicatos (*)
          `)
          .eq('id', id)
          .single();

        if (convencaoError) throw convencaoError;
        setConvencao(convencaoData);

        // Buscar pisos salariais através dos cargos
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('*')
          .eq('convenio_id', id);
        
        if (cargosError) throw cargosError;
        
        // Se temos cargos, vamos buscar os pisos salariais relacionados a eles
        if (cargosData && cargosData.length > 0) {
          const cargoIds = cargosData.map(cargo => cargo.id);
          
          const { data: pisosData, error: pisosError } = await supabase
            .from('piso_salarial')
            .select('*')
            .in('cargo_id', cargoIds);

          if (pisosError) throw pisosError;
          setPisosSalariais(pisosData || []);
          
          // Buscar particularidades relacionadas aos cargos
          const { data: particularidadesData, error: particularidadesError } = await supabase
            .from('particularidades')
            .select('*')
            .in('cargo_id', cargoIds);

          if (particularidadesError) throw particularidadesError;
          setParticularidades(particularidadesData || []);
        }

        // Extrair benefícios das particularidades
        if (particularidades.length > 0) {
          const beneficiosData = particularidades.filter(p => 
            p.categoria && p.categoria.toLowerCase().includes('benefício')
          );
          setBeneficios(beneficiosData);
        } else {
          setBeneficios([]);
        }

      } catch (error) {
        console.error("Erro ao buscar dados da convenção:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, particularidades.length]);

  const formatarData = (dataString: string | null) => {
    if (!dataString) return "-";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (e) {
      return dataString;
    }
  };

  const renderTipoConvencao = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'convencao':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Convenção Coletiva</Badge>;
      case 'acordo':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Acordo Coletivo</Badge>;
      case 'aditivo':
        return <Badge variant="outline" className="bg-purple-100 text-purple-700">Termo Aditivo</Badge>;
      default:
        return <Badge variant="outline">{tipo || "Não especificado"}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex justify-center">
            <div className="animate-pulse space-y-6 w-full max-w-3xl">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              <div className="h-32 bg-muted rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!convencao) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Convenção não encontrada</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Não foi possível encontrar a convenção com o ID especificado.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold">{convencao.descricao || "Convenção"}</CardTitle>
            <CardDescription>
              {renderTipoConvencao('convencao')}
              {convencao.sindicatos?.estado && (
                <Badge variant="outline" className="ml-2">
                  {convencao.sindicatos.estado}
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Vigência: {formatarData(convencao.vigencia_inicio)} até {formatarData(convencao.vigencia_fim)}</span>
            </div>
            {convencao.sindicatos?.data_base && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Data Base: {convencao.sindicatos.data_base}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-start gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Sindicato</h3>
              <p className="text-muted-foreground">
                {convencao.sindicatos?.nome || "Não informado"}
              </p>
              {convencao.sindicatos?.cnpj && (
                <p className="text-xs text-muted-foreground">
                  CNPJ: {convencao.sindicatos.cnpj}
                </p>
              )}
              {convencao.sindicatos?.site && (
                <p className="text-xs text-blue-500">
                  <a href={convencao.sindicatos.site.startsWith('http') ? convencao.sindicatos.site : `http://${convencao.sindicatos.site}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="hover:underline">
                    {convencao.sindicatos.site}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

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
            {beneficios.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beneficios.map((beneficio) => (
                    <div key={beneficio.id} className="p-4 border rounded-md">
                      <h4 className="font-medium text-sm mb-1">{beneficio.categoria}</h4>
                      {beneficio.conteudo && (
                        <p className="text-sm text-muted-foreground mt-1">{beneficio.conteudo}</p>
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
      </CardContent>
    </Card>
  );
}
