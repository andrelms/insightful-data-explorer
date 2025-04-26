
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar convenções, sindicatos, cargos..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
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
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-primary rounded-full px-3 py-1 text-xs font-medium hover:bg-white/90 transition-colors h-8"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
