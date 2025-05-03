
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ConvencaoCard } from "@/components/dashboard/ConvencaoCard";
import { FeedSindicatos } from "@/components/dashboard/FeedSindicatos";
import { FileText, AlertCircle, Clock, RefreshCw, ChevronRight, User, Building, MapPin, Upload, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface RegionalStat {
  regiao: string;
  sindicatosCount: number;
  convencoesCount: number;
}

interface ConvencaoData {
  id: string;
  title: string;
  numero: string;
  ano: number;
  sindicatos: string[];
  vigenciaInicio: string | null;
  vigenciaFim: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Total de Convenções",
      value: 0,
      icon: <FileText className="h-4 w-4" />,
      description: "Convenções indexadas"
    },
    {
      title: "Convenções Vigentes",
      value: 0,
      icon: <Clock className="h-4 w-4" />,
      trend: { value: 0, isPositive: true }
    },
    {
      title: "Convenções Pendentes",
      value: 0,
      icon: <AlertCircle className="h-4 w-4" />,
      description: "Necessitam revisão"
    },
    {
      title: "Última Atualização",
      value: "0",
      icon: <RefreshCw className="h-4 w-4" />,
      description: "Base atualizada diariamente"
    }
  ]);
  const [convencoes, setConvencoes] = useState<ConvencaoData[]>([]);
  const [estatisticasRegionais, setEstatisticasRegionais] = useState<RegionalStat[]>([]);
  const [hasData, setHasData] = useState(false);
  const [sindicatosPorCategoria, setSindicatosPorCategoria] = useState({
    trabalhadores: 0,
    empregadores: 0
  });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Buscar dados das tabelas principais
      const [conveniosResult, sindicatosResult, feedsResult, uploadsResult] = await Promise.all([
        supabase.from('convenios').select('*').order('created_at', { ascending: false }),
        supabase.from('sindicatos').select('*'),
        supabase.from('feed_noticias').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('uploaded_files').select('*')
      ]);

      // Verificar se há dados
      const hasConvenios = conveniosResult.data && conveniosResult.data.length > 0;
      const hasSindicatos = sindicatosResult.data && sindicatosResult.data.length > 0;
      
      setHasData(hasConvenios || hasSindicatos);
      
      // Calcular estatísticas
      let totalConvencoes = conveniosResult.data?.length || 0;
      const now = new Date();
      // No nosso novo modelo, consideraremos todas as convenções dos últimos 30 dias como vigentes
      const convencoesVigentes = hasConvenios 
        ? conveniosResult.data.filter(c => {
            const createdDate = new Date(c.created_at);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return createdDate >= thirtyDaysAgo;
          }).length
        : 0;
      
      // Convenções pendentes são aquelas sem sindicato associado
      const convencoesPendentes = hasConvenios
        ? conveniosResult.data.filter(c => !c.sindicato_id).length
        : 0;
      
      // Determinar a última atualização
      const lastUpdated = conveniosResult.data?.[0]?.updated_at 
        ? new Date(conveniosResult.data[0].updated_at).toLocaleDateString('pt-BR')
        : uploadsResult.data?.[0]?.uploaded_at
          ? new Date(uploadsResult.data[0].uploaded_at).toLocaleDateString('pt-BR')
          : "0";
      
      // Atualizar stats
      setStats([
        {
          title: "Total de Convenções",
          value: totalConvencoes,
          icon: <FileText className="h-4 w-4" />,
          description: "Convenções indexadas"
        },
        {
          title: "Convenções Vigentes",
          value: convencoesVigentes,
          icon: <Clock className="h-4 w-4" />,
          trend: { 
            value: convencoesVigentes > 0 && totalConvencoes > 0 ? 
              Math.round((convencoesVigentes / totalConvencoes) * 100) : 0, 
            isPositive: true 
          }
        },
        {
          title: "Convenções Pendentes",
          value: convencoesPendentes,
          icon: <AlertCircle className="h-4 w-4" />,
          description: "Necessitam revisão"
        },
        {
          title: "Última Atualização",
          value: lastUpdated,
          icon: <RefreshCw className="h-4 w-4" />,
          description: "Base atualizada diariamente"
        }
      ]);
        
      // Transformar dados de convenções para exibição
      if (hasConvenios) {
        const transformedConvencoes: ConvencaoData[] = conveniosResult.data.slice(0, 4).map(c => {
          const createdDate = new Date(c.created_at || new Date());
          const year = createdDate.getFullYear();

          return {
            id: c.id,
            title: c.descricao || `Convenio #${c.id.substring(0, 8)}`,
            numero: c.id,
            ano: year,
            sindicatos: c.sindicato_id ? ["SINDICATO"] : ["Não especificado"],
            vigenciaInicio: c.created_at,
            // Definimos uma data de vigência fictícia de 1 ano a partir da data de criação
            vigenciaFim: new Date(createdDate.getFullYear() + 1, createdDate.getMonth(), createdDate.getDate()).toISOString()
          };
        });
        
        setConvencoes(transformedConvencoes);
      } else {
        setConvencoes([]);
      }

      // Processar estatísticas regionais
      if (hasSindicatos) {
        // Contar sindicatos por categoria (categorias fixas já que não temos esse campo no banco)
        // Vamos atribuir os sindicatos de forma arbitrária para exibição
        const totalSindicatos = sindicatosResult.data.length;
        const trabalhadores = Math.round(totalSindicatos * 0.7); // 70% trabalhadores (valor fictício)
        const empregadores = totalSindicatos - trabalhadores; // 30% empregadores
        
        setSindicatosPorCategoria({
          trabalhadores,
          empregadores
        });

        const regions = ["Sudeste", "Nordeste", "Sul", "Centro-Oeste", "Norte"];
        const regStats = regions.map(regiao => {
          // Função para mapear UF para região
          const getRegionFromUF = (uf: string | null): string | null => {
            if (!uf) return null;
            
            uf = uf.toUpperCase();
            
            if (["SP", "MG", "RJ", "ES"].includes(uf)) return "Sudeste";
            if (["BA", "PE", "CE", "MA", "PB", "RN", "AL", "SE", "PI"].includes(uf)) return "Nordeste";
            if (["RS", "PR", "SC"].includes(uf)) return "Sul";
            if (["MT", "MS", "GO", "DF"].includes(uf)) return "Centro-Oeste";
            if (["AM", "PA", "TO", "RO", "AC", "AP", "RR"].includes(uf)) return "Norte";
            
            return null;
          };
          
          // Extrair UF da data_base ou outro campo disponível
          const sindicatosCount = sindicatosResult.data.filter(s => {
            // Extrair UF do campo data_base (pode conter sigla do estado)
            const dataBase = s.data_base;
            const extractedUF = dataBase ? dataBase.match(/[A-Z]{2}/) : null;
            const uf = extractedUF ? extractedUF[0] : null;
            const sindicatoRegion = getRegionFromUF(uf);
            
            return sindicatoRegion === regiao;
          }).length;
          
          // Encontrar convenções relacionadas à região baseado nos sindicatos
          const convencoesCount = conveniosResult.data 
            ? conveniosResult.data.filter(c => {
                const sindicato = sindicatosResult.data?.find(s => s.id === c.sindicato_id);
                if (!sindicato || !sindicato.data_base) return false;
                
                const extractedUF = sindicato.data_base.match(/[A-Z]{2}/);
                const uf = extractedUF ? extractedUF[0] : null;
                const sindicatoRegion = getRegionFromUF(uf);
                
                return sindicatoRegion === regiao;
              }).length 
            : 0;
          
          return {
            regiao,
            sindicatosCount,
            convencoesCount
          };
        });
        
        setEstatisticasRegionais(regStats);
      } else {
        setEstatisticasRegionais([]);
      }
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do dashboard",
        variant: "destructive",
      });
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/convencoes?q=${encodeURIComponent(query)}`);
  };

  const handleViewConvencao = (numero: string) => {
    navigate(`/convencoes/${numero}`);
  };

  const renderEmptyState = () => (
    <div className="bg-muted/30 rounded-xl border p-8 text-center">
      <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Nenhum dado encontrado</h3>
      <p className="text-muted-foreground mb-4">
        A base de dados está vazia ou foi limpa recentemente.
      </p>
      <Button 
        onClick={() => navigate("/processar-dados")}
        className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
      >
        <Upload className="mr-2 h-4 w-4" />
        Importar Dados
      </Button>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-6 md:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 w-1/2 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMEgxMDBWMTAwSDBWMFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+')]"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-blue-100 max-w-2xl">
              Sistema de monitoramento e análise de convenções coletivas de trabalho. Dados extraídos e processados de fontes oficiais.
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Processamento de Dados</h2>
          <p className="text-muted-foreground">
            Faça upload de arquivos Excel ou PDF para enriquecer a base de dados com convenções coletivas.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/processar-dados")}
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white min-w-[180px]"
        >
          <Upload className="mr-2 h-4 w-4" />
          Processar Arquivos
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Feed de Atualizações</h2>
              <span className="text-xs text-muted-foreground">Atualizado agora</span>
            </div>
            <FeedSindicatos />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-semibold">Convenções</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/convencoes')}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  Ver todas
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            
            {convencoes.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {convencoes.slice(0, 4).map((convencao, i) => (
                  <ConvencaoCard
                    key={i}
                    {...convencao}
                    onView={() => handleViewConvencao(convencao.numero)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-muted-foreground">Nenhuma convenção encontrada</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-xl border p-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum dado encontrado</h3>
          <p className="text-muted-foreground mb-4">
            A base de dados está vazia ou foi limpa recentemente.
          </p>
          <Button 
            onClick={() => navigate("/processar-dados")}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar Dados
          </Button>
        </div>
      )}

      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-semibold">Estatísticas Regionais</h2>
                <span className="text-xs text-muted-foreground">Atualizado agora</span>
              </div>
            </div>
            
            <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
              <div className="p-4">
                {estatisticasRegionais.length > 0 ? (
                  estatisticasRegionais.map((item, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between py-2 ${
                        index !== estatisticasRegionais.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{item.regiao}</span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-right">
                          <span className="block font-medium">{item.convencoesCount}</span>
                          <span className="text-muted-foreground text-xs">Convenções</span>
                        </div>
                        <div className="text-right">
                          <span className="block font-medium">{item.sindicatosCount}</span>
                          <span className="text-muted-foreground text-xs">Sindicatos</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-muted-foreground">
                    Nenhuma estatística disponível
                  </div>
                )}
              </div>
              <div className="bg-muted/50 p-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/painel-sindicatos')}
                  className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground"
                >
                  Ver painel completo
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Categorias de Sindicatos</h3>
              </div>
              <div className="p-4">
                {hasData ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Trabalhadores</span>
                      </div>
                      <span className="text-sm font-medium">
                        {sindicatosPorCategoria.trabalhadores}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-violet-500" />
                        <span className="text-sm">Empregadores</span>
                      </div>
                      <span className="text-sm font-medium">
                        {sindicatosPorCategoria.empregadores}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-center text-muted-foreground">
                    Nenhuma categoria disponível
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
