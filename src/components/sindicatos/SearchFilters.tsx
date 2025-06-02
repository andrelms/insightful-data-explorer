
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { siglas_estados } from "@/types/sindicatos";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedEstado: string;
  setSelectedEstado: (value: string) => void;
  estados: any[];
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedEstado,
  setSelectedEstado,
  estados
}: SearchFiltersProps) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto] mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por sindicato, cargo, estado ou qualquer informação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-6 rounded-full bg-white/20 backdrop-blur-md border-white/10 placeholder:text-muted-foreground focus:bg-white/30 transition-all"
        />
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <Select value={selectedEstado} onValueChange={setSelectedEstado}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os estados</SelectItem>
            {Object.entries(siglas_estados).map(([sigla, nome]) => (
              <SelectItem key={sigla} value={sigla}>
                {nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value="todos" onValueChange={() => {}}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as categorias</SelectItem>
            <SelectItem value="hora-extra">Hora Extra</SelectItem>
            <SelectItem value="piso">Piso Salarial</SelectItem>
            <SelectItem value="beneficios">Benefícios</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
