
import { SearchResult } from "@/types/busca-convencoes";

// Type conversion helper
export const convertDatabaseResultToSearchResult = (dbResult: any): SearchResult => {
  return {
    id: dbResult.id,
    query: dbResult.query,
    provider: dbResult.provider as 'gemini' | 'perplexity' | 'jina',
    raw_response: dbResult.raw_response,
    processed_data: dbResult.processed_data,
    referencia_fontes: dbResult.referencia_fontes || [],
    etapas_raciocinio: dbResult.etapas_raciocinio || [],
    status: dbResult.status as 'pending' | 'processing' | 'completed' | 'error',
    created_at: dbResult.created_at,
    updated_at: dbResult.updated_at,
  };
};

// Helper functions for icons
export const getProviderIcon = (providerName: string) => {
  const { Brain, Search, FileText, Zap } = require('lucide-react');
  
  switch (providerName) {
    case 'gemini': return Brain;
    case 'perplexity': return Search;
    case 'jina': return FileText;
    default: return Zap;
  }
};

export const getStatusIcon = (status: string) => {
  const { CheckCircle, Loader2, AlertCircle, Clock } = require('lucide-react');
  
  switch (status) {
    case 'completed': return CheckCircle;
    case 'processing': return Loader2;
    case 'error': return AlertCircle;
    default: return Clock;
  }
};

export const getStatusIconProps = (status: string) => {
  switch (status) {
    case 'completed': return { className: "h-4 w-4 text-green-500" };
    case 'processing': return { className: "h-4 w-4 text-blue-500 animate-spin" };
    case 'error': return { className: "h-4 w-4 text-red-500" };
    default: return { className: "h-4 w-4 text-yellow-500" };
  }
};
