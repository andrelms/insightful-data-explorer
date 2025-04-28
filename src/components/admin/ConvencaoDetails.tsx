
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
  const [licencas, setLicencas] = useState<any[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados principais da convenção
        const { data: convencaoData, error: convencaoError } = await supabase
          .from('convencoes')
          .select(`
            *,
            sindicatos (*)
          `)
          .eq('id', id)
          .single();

        if (convencaoError) throw convencaoError;
        setConvencao(convencaoData);

        // Buscar pisos salariais
        const { data: pisosData, error: pisosError } = await supabase
          .from('pisos_salariais')
          .select('*')
          .eq('convenio_id', id);

        if (pisosError) throw pisosError;
        setPisosSalariais(pisosData || []);

        // Buscar particularidades
        const { data: particularidadesData, error: particularidadesError } = await supabase
          .from('particularidades')
          .select('*')
          .eq('convenio_id', id);

        if (particularidadesError) throw particularidadesError;
        setParticularidades(particularidadesData || []);

        // Buscar licenças
        const { data: licencasData, error: licencasError } = await supabase
          .from('licencas')
          .select('*')
          .eq('convenio_id', id);

        if (licencasError) throw licencasError;
        setLicencas(licencasData || []);

        // Buscar benefícios
        const { data: beneficiosData, error: beneficiosError } = await supabase
          .from('beneficios')
          .select('*')
          .eq('convenio_id', id);

        if (beneficiosError) throw beneficiosError;
        setBeneficios(beneficiosData || []);

      } catch (error) {
        console.error("Erro ao buscar dados da convenção:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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
            <CardTitle className="text-xl font-bold">{convencao.titulo}</CardTitle>
            <CardDescription>
              {renderTipoConvencao(convencao.tipo)}
              {convencao.estado && (
                <Badge variant="outline" className="ml-2">
                  {convencao.estado}
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Vigência: {formatarData(convencao.vigencia_inicio)} até {formatarData(convencao.vigencia_fim)}</span>
            </div>
            {convencao.data_base && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Data Base: {formatarData(convencao.data_base)}</span>
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
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="pisos">Pisos Salariais</TabsTrigger>
            <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
            <TabsTrigger value="licencas">Licenças</TabsTrigger>
            <TabsTrigger value="particularidades">Particularidades</TabsTrigger>
          </TabsList>

          <TabsContent value="pisos" className="mt-0">
            {pisosSalariais.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Carga Horária</TableHead>
                      <TableHead>Piso Salarial</TableHead>
                      <TableHead>Hora Normal</TableHead>
                      <TableHead>Hora Extra 50%</TableHead>
                      <TableHead>Hora Extra 100%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pisosSalariais.map((piso) => (
                      <TableRow key={piso.id}>
                        <TableCell className="font-medium">{piso.cargo}</TableCell>
                        <TableCell>{piso.carga_horaria || "-"}</TableCell>
                        <TableCell>
                          {piso.piso_salarial 
                            ? `R$ ${parseFloat(piso.piso_salarial).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {piso.valor_hora_normal
                            ? `R$ ${parseFloat(piso.valor_hora_normal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {piso.valor_hora_extra_50
                            ? `R$ ${parseFloat(piso.valor_hora_extra_50).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {piso.valor_hora_extra_100
                            ? `R$ ${parseFloat(piso.valor_hora_extra_100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                            : "-"}
                        </TableCell>
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
            {convencao.vale_refeicao && (
              <div className="p-4 border rounded-md mb-4">
                <h3 className="font-medium mb-2">Vale Refeição</h3>
                <p>
                  {convencao.vale_refeicao}
                  {convencao.vale_refeicao_valor && (
                    <span className="ml-2 font-medium">
                      (R$ {parseFloat(convencao.vale_refeicao_valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})})
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 border rounded-md flex items-start">
                <div className="mr-3 mt-1">
                  {convencao.assistencia_medica ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Sim</Badge>
                  ) : (
                    <Badge variant="outline">Não informado</Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Assistência Médica</h3>
                  <p className="text-sm text-muted-foreground">
                    {convencao.assistencia_medica ? "Possui assistência médica" : "Não possui informação sobre assistência médica"}
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-md flex items-start">
                <div className="mr-3 mt-1">
                  {convencao.seguro_vida ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Sim</Badge>
                  ) : (
                    <Badge variant="outline">Não informado</Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Seguro de Vida</h3>
                  <p className="text-sm text-muted-foreground">
                    {convencao.seguro_vida ? "Possui seguro de vida" : "Não possui informação sobre seguro de vida"}
                  </p>
                </div>
              </div>
            </div>

            {beneficios.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium">Outros Benefícios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beneficios.map((beneficio) => (
                    <div key={beneficio.id} className="p-4 border rounded-md">
                      <h4 className="font-medium text-sm mb-1">{beneficio.tipo}</h4>
                      {beneficio.valor && (
                        <p className="text-sm">
                          <span className="font-medium">Valor:</span> {beneficio.valor}
                        </p>
                      )}
                      {beneficio.descricao && (
                        <p className="text-sm text-muted-foreground mt-1">{beneficio.descricao}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : beneficios.length === 0 && !convencao.vale_refeicao && !convencao.assistencia_medica && !convencao.seguro_vida ? (
              <div className="text-center py-6 text-muted-foreground">
                Não há informações sobre benefícios para esta convenção.
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="licencas" className="mt-0">
            {licencas.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo de Licença</TableHead>
                        <TableHead>Dias</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {licencas.map((licenca) => (
                        <TableRow key={licenca.id}>
                          <TableCell className="font-medium">{licenca.tipo}</TableCell>
                          <TableCell>{licenca.dias || "-"}</TableCell>
                          <TableCell>{licenca.descricao || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Não há informações sobre licenças para esta convenção.
              </div>
            )}
          </TabsContent>

          <TabsContent value="particularidades" className="mt-0">
            {convencao.adicional_noturno && (
              <div className="p-4 border rounded-md mb-4">
                <h3 className="font-medium mb-1">Adicional Noturno</h3>
                <p>{convencao.adicional_noturno}</p>
              </div>
            )}
            
            {particularidades.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium">Outras Particularidades</h3>
                {particularidades.map((part) => (
                  <div key={part.id} className="p-4 border rounded-md">
                    <p>{part.descricao}</p>
                  </div>
                ))}
              </div>
            ) : particularidades.length === 0 && !convencao.adicional_noturno ? (
              <div className="text-center py-6 text-muted-foreground">
                Não há informações sobre particularidades para esta convenção.
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
