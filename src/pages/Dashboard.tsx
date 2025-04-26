
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { ConvencaoCard } from "@/components/dashboard/ConvencaoCard";
import { FeedSindicatos } from "@/components/dashboard/FeedSindicatos";
import { FileText, AlertCircle, Clock, RefreshCw, ChevronRight, User, Building, MapPin, Upload, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for cards
  const mockStats = [
    {
      title: "Total de Convenções",
      value: 248,
      icon: <FileText className="h-4 w-4" />,
      description: "Convenções indexadas"
    },
    {
      title: "Convenções Vigentes",
      value: 156,
      icon: <Clock className="h-4 w-4" />,
      trend: { value: 4, isPositive: true }
    },
    {
      title: "Convenções Pendentes",
      value: 12,
      icon: <AlertCircle className="h-4 w-4" />,
      description: "Necessitam revisão"
    },
    {
      title: "Última Atualização",
      value: "12/04/2023",
      icon: <RefreshCw className="h-4 w-4" />,
      description: "Base atualizada diariamente"
    }
  ];

  // Mock data for the table
  const mockTableData = [
    {
      Cargo: "Auxiliar Administrativo",
      "CBO": "4110-05",
      "Carga Horária": "44h",
      "Piso Salarial": "R$ 1.800,00",
      "Data Base": "01/03/2024",
      "Sindicato": "SINDICATO DOS EMPREGADOS NO COMÉRCIO"
    },
    {
      Cargo: "Vendedor",
      "CBO": "5211-10",
      "Carga Horária": "44h",
      "Piso Salarial": "R$ 1.950,00",
      "Data Base": "01/03/2024",
      "Sindicato": "SINDICATO DOS EMPREGADOS NO COMÉRCIO"
    }
  ];

  const tableColumns = ["Cargo", "CBO", "Carga Horária", "Piso Salarial", "Data Base", "Sindicato"];

  const mockConvencoes = [
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2023/2024 - SINDICATO DOS EMPREGADOS NO COMÉRCIO",
      numero: "MG001234/2023",
      ano: 2023,
      sindicatos: ["COMERCIÁRIOS", "EMPREGADORES"],
      vigenciaInicio: "2023-06-01",
      vigenciaFim: "2024-05-31"
    },
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2022/2024 - METALÚRGICOS E INDÚSTRIAS METALÚRGICAS",
      numero: "MG000789/2022",
      ano: 2022,
      sindicatos: ["METALÚRGICOS", "INDÚSTRIA METALÚRGICA"],
      vigenciaInicio: "2022-09-01",
      vigenciaFim: "2024-08-31"
    },
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2023/2025 - PROFESSORES E ESTABELECIMENTOS DE ENSINO",
      numero: "MG002345/2023",
      ano: 2023,
      sindicatos: ["PROFESSORES", "ESCOLAS PARTICULARES"],
      vigenciaInicio: "2023-03-01",
      vigenciaFim: "2025-02-28"
    },
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2022/2023 - TRABALHADORES EM TRANSPORTES RODOVIÁRIOS",
      numero: "MG003456/2022",
      ano: 2022,
      sindicatos: ["RODOVIÁRIOS", "EMPRESAS DE TRANSPORTE"],
      vigenciaInicio: "2022-05-01",
      vigenciaFim: "2023-04-30"
    }
  ];

  // Mock data para estatísticas regionais
  const estatisticasRegionais = [
    { regiao: "Sudeste", convencoesCount: 128, sindicatosCount: 42 },
    { regiao: "Nordeste", convencoesCount: 76, sindicatosCount: 28 },
    { regiao: "Sul", convencoesCount: 64, sindicatosCount: 24 },
    { regiao: "Centro-Oeste", convencoesCount: 36, sindicatosCount: 18 },
    { regiao: "Norte", convencoesCount: 24, sindicatosCount: 12 }
  ];

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implementação futura: chamar a API de busca
  };

  const handleViewConvencao = (numero: string) => {
    navigate(`/convencoes/${numero}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
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
      
      {/* Estatísticas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Upload CTA Section */}
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

      {/* Feed de Convenções Recentes e Feed Atualizações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed de Atualizações */}
        <div className="lg:col-span-1">
          <FeedSindicatos />
        </div>

        {/* Convenções Recentes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Convenções Recentes</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/convencoes')}
              className="text-xs"
            >
              Ver todas
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {mockConvencoes.slice(0, 4).map((convencao, i) => (
              <ConvencaoCard
                key={i}
                {...convencao}
                onView={() => handleViewConvencao(convencao.numero)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estatísticas Regionais */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Estatísticas Regionais</h2>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
            <div className="p-4">
              {estatisticasRegionais.map((item, index) => (
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
              ))}
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

          {/* Categorias de Sindicatos */}
          <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Categorias de Sindicatos</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Trabalhadores</span>
                </div>
                <span className="text-sm font-medium">156</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-violet-500" />
                  <span className="text-sm">Empregadores</span>
                </div>
                <span className="text-sm font-medium">92</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dados Salariais */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dados Salariais por Categoria</h2>
            <DashboardTable data={mockTableData} columns={tableColumns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
