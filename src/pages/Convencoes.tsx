
import { useState } from "react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ConvencaoCard } from "@/components/dashboard/ConvencaoCard";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Convencoes = () => {
  const navigate = useNavigate();
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data for convenções
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
    },
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2021/2023 - BANCÁRIOS E INSTITUIÇÕES FINANCEIRAS",
      numero: "MG006789/2021",
      ano: 2021,
      sindicatos: ["BANCÁRIOS", "BANCOS"],
      vigenciaInicio: "2021-09-01",
      vigenciaFim: "2023-08-31"
    },
    {
      title: "CONVENÇÃO COLETIVA DE TRABALHO 2022/2024 - CONSTRUÇÃO CIVIL",
      numero: "MG007890/2022",
      ano: 2022,
      sindicatos: ["TRABALHADORES DA CONSTRUÇÃO CIVIL", "CONSTRUTORAS"],
      vigenciaInicio: "2022-08-01",
      vigenciaFim: "2024-07-31"
    }
  ];

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implementação futura: chamar a API de busca
  };

  const handleViewConvencao = (numero: string) => {
    navigate(`/convencoes/${numero}`);
  };

  // Filtrar convenções por ano e status
  const filteredConvencoes = mockConvencoes.filter(convencao => {
    const matchesYear = filterYear === "all" || convencao.ano.toString() === filterYear;
    
    const isActive = new Date() <= new Date(convencao.vigenciaFim);
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && isActive) || 
      (filterStatus === "expired" && !isActive);
    
    return matchesYear && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Convenções Coletivas</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filtrar por ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os anos</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Vigentes</SelectItem>
                <SelectItem value="expired">Expiradas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredConvencoes.map((convencao, i) => (
          <ConvencaoCard
            key={i}
            {...convencao}
            onView={() => handleViewConvencao(convencao.numero)}
          />
        ))}
        
        {filteredConvencoes.length === 0 && (
          <div className="col-span-3 py-10 text-center text-muted-foreground">
            Nenhuma convenção encontrada com os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
};

export default Convencoes;
