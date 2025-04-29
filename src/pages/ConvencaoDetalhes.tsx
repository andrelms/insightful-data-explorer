import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Download, ExternalLink, Clock, CalendarDays, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

interface Convencao {
  id: string;
  titulo: string;
  numero: string;
  tipo: string;
  estado: string | null;
  abrangencia: string | null;
  sindicato: {
    nome: string;
    cnpj: string | null;
    site: string | null;
  } | null;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  data_base: string | null;
  data_assinatura?: string | null;
  fonte: string;
  assistencia_medica: boolean | null;
  vale_refeicao: string | null;
  vale_refeicao_valor: number | null;
  seguro_vida: boolean | null;
  uniforme: boolean | null;
  adicional_noturno: string | null;
}

interface PisoSalarial {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  piso_salarial: number | null;
  valor_hora_normal: number | null;
  valor_hora_extra_50: number | null;
  valor_hora_extra_100: number | null;
}

interface Particularidade {
  id: string;
  descricao: string;
}

interface Beneficio {
  id: string;
  tipo: string;
  valor: string | null;
  descricao: string | null;
}

interface Licenca {
  id: string;
  tipo: string;
  dias: number | null;
  descricao: string | null;
}

const ConvencaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [convencao, setConvencao] = useState<Convencao | null>(null);
  const [pisosSalariais, setPisosSalariais] = useState<PisoSalarial[]>([]);
  const [particularidades, setParticularidades] = useState<Particularidade[]>([]);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [licencas, setLicencas] = useState<Licenca[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchConvencao = async () => {
      setLoading(true);
      try {
        // Buscar dados da convenção
        const { data: convencaoData, error: convencaoError } = await supabase
          .from('convencoes')
          .select(`
            id, titulo, tipo, estado, abrangencia, 
            vigencia_inicio, vigencia_fim, data_base, 
            assistencia_medica, vale_refeicao, vale_refeicao_valor, 
            seguro_vida, uniforme, adicional_noturno,
            sindicatos (nome, cnpj, site)
          `)
          .eq('id', id)
          .single();
          
        if (convencaoError) throw convencaoError;
        
        // Buscar pisos salariais
        const { data: pisosData, error: pisosError } = await supabase
          .from('pisos_salariais')
          .select('*')
          .eq('convenio_id', id);
          
        if (pisosError) throw pisosError;
        
        // Buscar particularidades
        const { data: particularidadesData, error: particularidadesError } = await supabase
          .from('particularidades')
          .select('*')
          .eq('convenio_id', id);
          
        if (particularidadesError) throw particularidadesError;
        
        // Buscar benefícios
        const { data: beneficiosData, error: beneficiosError } = await supabase
          .from('beneficios')
          .select('*')
          .eq('convenio_id', id);
          
        if (beneficiosError) throw beneficiosError;
        
        // Buscar licenças
        const { data: licencasData, error: licencasError } = await supabase
          .from('licencas')
          .select('*')
          .eq('convenio_id', id);
          
        if (licencasError) throw licencasError;
        
        // Atualizar estados
        if (convencaoData) {
          setConvencao({
            ...convencaoData,
            numero: convencaoData.id.substring(0, 8),
            fonte: "MTE - Sistema Mediador",
            sindicato: convencaoData.sindicatos
          });
        }
        
        setPisosSalariais(pisosData || []);
        setParticularidades(particularidadesData || []);
        setBeneficios(beneficiosData || []);
        setLicencas(licencasData || []);
      } catch (error) {
        console.error("Erro ao buscar dados da convenção:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConvencao();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!convencao) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Convenção não encontrada</h2>
        <p className="mt-2 text-muted-foreground">A convenção que você está procurando não existe ou foi removida.</p>
        <Button className="mt-4" onClick={() => navigate("/convencoes")}>
          Voltar para Convenções
        </Button>
      </div>
    );
  }

  const isActive = convencao.vigencia_fim ? new Date() <= new Date(convencao.vigencia_fim) : true;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver documento original
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">{convencao.titulo}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant={isActive ? "default" : "outline"} className="text-xs">
            {isActive ? "VIGENTE" : "EXPIRADA"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {convencao.numero} / {convencao.tipo}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna lateral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                  <CalendarDays className="h-4 w-4" />
                  Vigência
                </div>
                <p>
                  {formatDate(convencao.vigencia_inicio)} até{" "}
                  {formatDate(convencao.vigencia_fim)}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Data Base
                </div>
                <p>{formatDate(convencao.data_base)}</p>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground mb-2">Sindicatos Participantes</p>
                <ul className="space-y-2">
                  {convencao.sindicato && (
                    <li key={convencao.sindicato.nome} className="text-sm">
                      <p className="font-medium">{convencao.sindicato.nome}</p>
                      {convencao.sindicato.cnpj && (
                        <p className="text-muted-foreground text-xs">CNPJ: {convencao.sindicato.cnpj}</p>
                      )}
                      {convencao.sindicato.site && (
                        <p className="text-muted-foreground text-xs">
                          <a href={convencao.sindicato.site} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {convencao.sindicato.site}
                          </a>
                        </p>
                      )}
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground mb-1">Estado</p>
                <p>{convencao.estado || "Não especificado"}</p>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground mb-1">Fonte</p>
                <p>{convencao.fonte}</p>
              </div>
              
              {/* Benefícios Resumo */}
              <div>
                <p className="font-medium text-muted-foreground mb-2">Benefícios</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Vale Refeição:</span>
                    <span className="font-medium">{convencao.vale_refeicao || "Não especificado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assistência Médica:</span>
                    <span className="font-medium">{convencao.assistencia_medica ? "Sim" : "Não"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seguro de Vida:</span>
                    <span className="font-medium">{convencao.seguro_vida ? "Sim" : "Não"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uniforme:</span>
                    <span className="font-medium">{convencao.uniforme ? "Sim" : "Não"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Conteúdo principal */}
        <div className="col-span-1 md:col-span-2">
          {/* Pisos Salariais */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Pisos Salariais</CardTitle>
            </CardHeader>
            <CardContent>
              {pisosSalariais.length > 0 ? (
                <DashboardTable 
                  columns={["Cargo", "Carga Horária", "Piso Salarial", "Hora Normal", "Hora Extra 50%", "Hora Extra 100%"]}
                  data={pisosSalariais.map(piso => ({
                    "Cargo": piso.cargo,
                    "Carga Horária": piso.carga_horaria || "-",
                    "Piso Salarial": piso.piso_salarial ? `R$ ${piso.piso_salarial.toFixed(2)}` : "-",
                    "Hora Normal": piso.valor_hora_normal ? `R$ ${piso.valor_hora_normal.toFixed(2)}` : "-",
                    "Hora Extra 50%": piso.valor_hora_extra_50 ? `R$ ${piso.valor_hora_extra_50.toFixed(2)}` : "-",
                    "Hora Extra 100%": piso.valor_hora_extra_100 ? `R$ ${piso.valor_hora_extra_100.toFixed(2)}` : "-"
                  }))}
                />
              ) : (
                <p className="text-center text-muted-foreground py-4">Nenhum piso salarial registrado.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Benefícios Detalhados */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Benefícios</CardTitle>
            </CardHeader>
            <CardContent>
              {beneficios.length > 0 ? (
                <DashboardTable 
                  columns={["Tipo", "Valor", "Descrição"]}
                  data={beneficios.map(beneficio => ({
                    "Tipo": beneficio.tipo,
                    "Valor": beneficio.valor || "-",
                    "Descrição": beneficio.descricao || "-"
                  }))}
                />
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2">Benefícios Resumidos:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {convencao.vale_refeicao && (
                      <li>Vale Refeição: {convencao.vale_refeicao} 
                        {convencao.vale_refeicao_valor ? ` (R$ ${convencao.vale_refeicao_valor.toFixed(2)})` : ''}
                      </li>
                    )}
                    {convencao.assistencia_medica && <li>Assistência Médica</li>}
                    {convencao.seguro_vida && <li>Seguro de Vida</li>}
                    {convencao.uniforme && <li>Uniforme</li>}
                    {convencao.adicional_noturno && <li>Adicional Noturno: {convencao.adicional_noturno}</li>}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Licenças */}
          {licencas.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-base">Licenças</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardTable 
                  columns={["Tipo", "Dias", "Descrição"]}
                  data={licencas.map(licenca => ({
                    "Tipo": licenca.tipo,
                    "Dias": licenca.dias ? licenca.dias.toString() : "-",
                    "Descrição": licenca.descricao || "-"
                  }))}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Particularidades */}
          {particularidades.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-base">Particularidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {particularidades.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{item.descricao}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConvencaoDetalhes;
