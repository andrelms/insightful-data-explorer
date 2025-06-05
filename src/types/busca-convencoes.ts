
// Types for busca de convenções functionality
export interface SearchResult {
  id: string;
  query: string;
  provider: 'gemini' | 'perplexity' | 'jina';
  raw_response: any;
  processed_data?: any;
  referencia_fontes?: string[];
  etapas_raciocinio?: string[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

export interface BatchProcessing {
  id: string;
  search_result_id: string;
  scope: 'estado' | 'sindicato' | 'todos';
  status: 'pending' | 'processing' | 'completed' | 'error';
  processed_count: number;
  total_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export type Provider = 'gemini' | 'perplexity' | 'jina';
export type Scope = 'estado' | 'sindicato' | 'todos';
