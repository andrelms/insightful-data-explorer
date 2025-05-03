import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

interface Convencao {
  id: string;
  title: string;
  titulo: string;
  numero: string;
  ano: number;
  sindicatos: string[];
  vigenciaInicio: string;
  vigenciaFim: string;
  estado: string;
  sindicato_id?: string;
}

const Convencoes = () => {
  const navigate = useNavigate();
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [convencoes, setConvencoes] = useState<Convencao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    fetchConvencoes();
  }, []);

  const fetchConvencoes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('convenios') // Updated table name
        .select(`
          id, 
          descricao, 
          sindicato_id,
          created_at,
          sindicatos (nome, cnpj, site, data_base)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform the data to match our component's expected format
        const transformedData: Convencao[] = data.map(item => {
          const currentDate = new Date();
          const created = new Date(item.created_at || currentDate);
          const ano = created.getFullYear();
            
          return {
            id: item.id,
            title: item.descricao || "Convenção sem descrição",
            titulo: item.descricao || "Convenção sem descrição",
            numero: item.id.substring(0, 8),
            ano,
            sindicatos: [item.sindicatos?.nome || 'Sindicato não especificado'],
            vigenciaInicio: item.created_at || '',
            vigenciaFim: '', // Not storing end date anymore
            estado: '',
            sindicato_id: item.sindicato_id
          };
        });
        
        setConvencoes(transformedData);
        
        // Extract unique years for the filter
        const uniqueYears = Array.from(new Set(
          transformedData
            .map(c => c.ano)
            .filter(year => !isNaN(year))
            .sort((a, b) => b - a) // Sort in descending order
        )).map(year => year.toString());
        
        setYears(uniqueYears);
      }
    } catch (error) {
      console.error("Erro ao buscar convenções:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchConvencoes();
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('convenios') // Updated table name
        .select(`
          id, 
          descricao,
          sindicato_id,
          created_at,
          sindicatos (nome, cnpj, site, data_base)
        `)
        .or(`descricao.ilike.%${query}%,sindicatos.nome.ilike.%${query}%`)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const transformedData: Convencao[] = data.map(item => {
          const currentDate = new Date();
          const created = new Date(item.created_at || currentDate);
          const ano = created.getFullYear();
            
          return {
            id: item.id,
            title: item.descricao || "Convenção sem descrição",
            titulo: item.descricao || "Convenção sem descrição",
            numero: item.id.substring(0, 8),
            ano,
            sindicatos: [item.sindicatos?.nome || 'Sindicato não especificado'],
            vigenciaInicio: item.created_at || '',
            vigenciaFim: '',
            estado: '',
            sindicato_id: item.sindicato_id
          };
        });
        
        setConvencoes(transformedData);
      }
    } catch (error) {
      console.error("Erro ao buscar convenções:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewConvencao = (id: string) => {
    navigate(`/convencoes/${id}`);
  };

  // Filtrar convenções por ano e status
  const filteredConvencoes = convencoes.filter(convencao => {
    const matchesYear = filterYear === "all" || convencao.ano.toString() === filterYear;
    
    const isActive = convencao.vigenciaFim ? new Date() <= new Date(convencao.vigenciaFim) : true;
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
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredConvencoes.map((convencao) => (
            <ConvencaoCard
              key={convencao.id}
              {...convencao}
              onView={() => handleViewConvencao(convencao.id)}
            />
          ))}
          
          {filteredConvencoes.length === 0 && (
            <div className="col-span-3 py-10 text-center text-muted-foreground">
              Nenhuma convenção encontrada com os filtros selecionados.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Convencoes;
