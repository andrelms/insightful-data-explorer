
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar convenções, sindicatos, cargos..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        description: "Por favor, digite algo para buscar",
        variant: "default",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Real search would query the database and fetch results
      const searchTerm = query.toLowerCase();
      
      // Search in multiple tables
      const [convencoesResult, sindicatosResult, feedResult] = await Promise.all([
        supabase.from('convencoes').select('*')
          .ilike('titulo', `%${searchTerm}%`)
          .limit(5),
        supabase.from('sindicatos').select('*')
          .ilike('nome', `%${searchTerm}%`)
          .limit(5),
        supabase.from('feed_noticias').select('*')
          .ilike('titulo', `%${searchTerm}%`)
          .limit(5)
      ]);
      
      // Process results
      const results = {
        convencoes: convencoesResult.data || [],
        sindicatos: sindicatosResult.data || [],
        noticias: feedResult.data || []
      };
      
      // Pass results to parent component
      onSearch(query);
      
      // If there are results, navigate to search results page with query param
      const totalResults = results.convencoes.length + results.sindicatos.length + results.noticias.length;
      
      if (totalResults > 0) {
        // In a real app, we would navigate to a search results page
        // For now, just show a toast with the count of results
        toast({
          title: "Resultados encontrados",
          description: `${totalResults} resultados encontrados para "${query}"`,
        });
      } else {
        toast({
          description: `Nenhum resultado encontrado para "${query}"`,
        });
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-12 py-6 rounded-full bg-white/20 backdrop-blur-md border-white/10 text-white placeholder:text-white/70 focus:bg-white/30 transition-all"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-primary rounded-full px-3 py-1 text-xs font-medium hover:bg-white/90 transition-colors h-8 disabled:opacity-70"
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </form>
  );
}
