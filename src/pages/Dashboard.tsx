import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { ConvencaoCard } from "@/components/dashboard/ConvencaoCard";
import { FileText, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    },
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2023/2024 - VIGILANTES E EMPRESAS DE SEGURANÇA",
      numero: "MG004567/2023",
      ano: 2023,
      sindicatos: ["VIGILANTES", "SEGURANÇA PRIVADA"],
      vigenciaInicio: "2023-01-01",
      vigenciaFim: "2024-12-31"
    },
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2023/2024 - TRABALHADORES EM SAÚDE",
      numero: "MG005678/2023",
      ano: 2023,
      sindicatos: ["PROFISSIONAIS DE SAÚDE", "HOSPITAIS"],
      vigenciaInicio: "2023-04-01",
      vigenciaFim: "2024-03-31"
    }
  ];

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implementação futura: chamar a API de busca
  };

  const handleViewConvencao = (numero: string) => {
    navigate(`/convencoes/${numero}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Dados das Convenções</h2>
        <DashboardTable data={mockTableData} columns={tableColumns} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Convenções Recentes</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mockConvencoes.map((convencao, i) => (
            <ConvencaoCard
              key={i}
              {...convencao}
              onView={() => handleViewConvencao(convencao.numero)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
