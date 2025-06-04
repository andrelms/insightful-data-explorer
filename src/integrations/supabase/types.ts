export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anotacoes: {
        Row: {
          aba: string | null
          anotacao: string | null
          campo_formatado: string | null
          cargo_id: string | null
          categoria_particularidade: string | null
          coluna: string | null
          convenio_id: string | null
          created_at: string | null
          extra_detectado: boolean | null
          file_id: string
          id: string
          linha: number | null
          registro_idx: number | null
          sugestao_particularidade: string | null
          updated_at: string | null
          valido: boolean | null
          valor_original: string | null
        }
        Insert: {
          aba?: string | null
          anotacao?: string | null
          campo_formatado?: string | null
          cargo_id?: string | null
          categoria_particularidade?: string | null
          coluna?: string | null
          convenio_id?: string | null
          created_at?: string | null
          extra_detectado?: boolean | null
          file_id: string
          id?: string
          linha?: number | null
          registro_idx?: number | null
          sugestao_particularidade?: string | null
          updated_at?: string | null
          valido?: boolean | null
          valor_original?: string | null
        }
        Update: {
          aba?: string | null
          anotacao?: string | null
          campo_formatado?: string | null
          cargo_id?: string | null
          categoria_particularidade?: string | null
          coluna?: string | null
          convenio_id?: string | null
          created_at?: string | null
          extra_detectado?: boolean | null
          file_id?: string
          id?: string
          linha?: number | null
          registro_idx?: number | null
          sugestao_particularidade?: string | null
          updated_at?: string | null
          valido?: boolean | null
          valor_original?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anotacoes_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anotacoes_convenio_id_fkey"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convenios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anotacoes_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_processing: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          processed_count: number | null
          scope: string
          search_result_id: string
          status: string
          total_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          processed_count?: number | null
          scope: string
          search_result_id: string
          status?: string
          total_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          processed_count?: number | null
          scope?: string
          search_result_id?: string
          status?: string
          total_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_processing_search_result_id_fkey"
            columns: ["search_result_id"]
            isOneToOne: false
            referencedRelation: "search_results"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficios_gerais: {
        Row: {
          categoria: string | null
          convenio_id: string | null
          created_at: string | null
          descricao: string | null
          file_id: string
          fonte_coluna: string | null
          id: string
          nome: string | null
          registro_idx: number | null
          tipo: string | null
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          categoria?: string | null
          convenio_id?: string | null
          created_at?: string | null
          descricao?: string | null
          file_id: string
          fonte_coluna?: string | null
          id?: string
          nome?: string | null
          registro_idx?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          categoria?: string | null
          convenio_id?: string | null
          created_at?: string | null
          descricao?: string | null
          file_id?: string
          fonte_coluna?: string | null
          id?: string
          nome?: string | null
          registro_idx?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficios_gerais_convenio_id_fkey"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convenios"
            referencedColumns: ["id"]
          },
        ]
      }
      cargos: {
        Row: {
          carga_horaria: string | null
          cargo: string | null
          cbo: string | null
          convenio_id: string | null
          created_at: string | null
          file_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          carga_horaria?: string | null
          cargo?: string | null
          cbo?: string | null
          convenio_id?: string | null
          created_at?: string | null
          file_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          carga_horaria?: string | null
          cargo?: string | null
          cbo?: string | null
          convenio_id?: string | null
          created_at?: string | null
          file_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cargos_convenio_id_fkey"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convenios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          chave: string
          descricao: string | null
          id: string
          updated_at: string
          valor: string | null
        }
        Insert: {
          chave: string
          descricao?: string | null
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Update: {
          chave?: string
          descricao?: string | null
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Relationships: []
      }
      convenios: {
        Row: {
          created_at: string | null
          data_base: string | null
          descricao: string | null
          file_id: string | null
          id: string
          registro_idx: number | null
          sindicato_id: string | null
          updated_at: string | null
          vigencia: string | null
          vigencia_fim: string | null
          vigencia_inicio: string | null
        }
        Insert: {
          created_at?: string | null
          data_base?: string | null
          descricao?: string | null
          file_id?: string | null
          id?: string
          registro_idx?: number | null
          sindicato_id?: string | null
          updated_at?: string | null
          vigencia?: string | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Update: {
          created_at?: string | null
          data_base?: string | null
          descricao?: string | null
          file_id?: string | null
          id?: string
          registro_idx?: number | null
          sindicato_id?: string | null
          updated_at?: string | null
          vigencia?: string | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convenios_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convenios_sindicato_id_fkey"
            columns: ["sindicato_id"]
            isOneToOne: false
            referencedRelation: "sindicatos"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_noticias: {
        Row: {
          conteudo: string | null
          created_at: string
          data_publicacao: string | null
          fonte: string | null
          id: string
          sindicato_id: string | null
          titulo: string
          url: string | null
        }
        Insert: {
          conteudo?: string | null
          created_at?: string
          data_publicacao?: string | null
          fonte?: string | null
          id?: string
          sindicato_id?: string | null
          titulo: string
          url?: string | null
        }
        Update: {
          conteudo?: string | null
          created_at?: string
          data_publicacao?: string | null
          fonte?: string | null
          id?: string
          sindicato_id?: string | null
          titulo?: string
          url?: string | null
        }
        Relationships: []
      }
      historico_importacao: {
        Row: {
          data_fim: string | null
          data_inicio: string
          detalhes: string | null
          id: string
          origem: string | null
          registros_processados: number | null
          status: string | null
        }
        Insert: {
          data_fim?: string | null
          data_inicio?: string
          detalhes?: string | null
          id?: string
          origem?: string | null
          registros_processados?: number | null
          status?: string | null
        }
        Update: {
          data_fim?: string | null
          data_inicio?: string
          detalhes?: string | null
          id?: string
          origem?: string | null
          registros_processados?: number | null
          status?: string | null
        }
        Relationships: []
      }
      jornada_cargo: {
        Row: {
          carga_horaria: string | null
          cargo_id: string | null
          created_at: string | null
          file_id: string | null
          id: string
          observacao: string | null
          registro_idx: number | null
          tipo_jornada: string | null
          unidade: string
          valor: number | null
        }
        Insert: {
          carga_horaria?: string | null
          cargo_id?: string | null
          created_at?: string | null
          file_id?: string | null
          id?: string
          observacao?: string | null
          registro_idx?: number | null
          tipo_jornada?: string | null
          unidade: string
          valor?: number | null
        }
        Update: {
          carga_horaria?: string | null
          cargo_id?: string | null
          created_at?: string | null
          file_id?: string | null
          id?: string
          observacao?: string | null
          registro_idx?: number | null
          tipo_jornada?: string | null
          unidade?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jornada_cargo_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jornada_cargo_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
        ]
      }
      particularidades: {
        Row: {
          cargo_id: string | null
          categoria: string | null
          conteudo: string | null
          convenio_id: string | null
          created_at: string | null
          descricao: string | null
          detalhe: string | null
          file_id: string
          id: string
          registro_idx: number | null
          updated_at: string | null
        }
        Insert: {
          cargo_id?: string | null
          categoria?: string | null
          conteudo?: string | null
          convenio_id?: string | null
          created_at?: string | null
          descricao?: string | null
          detalhe?: string | null
          file_id: string
          id?: string
          registro_idx?: number | null
          updated_at?: string | null
        }
        Update: {
          cargo_id?: string | null
          categoria?: string | null
          conteudo?: string | null
          convenio_id?: string | null
          created_at?: string | null
          descricao?: string | null
          detalhe?: string | null
          file_id?: string
          id?: string
          registro_idx?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "particularidades_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "particularidades_convenio_id_fkey"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convenios"
            referencedColumns: ["id"]
          },
        ]
      }
      piso_salarial: {
        Row: {
          cargo_id: string | null
          created_at: string | null
          descricao: string | null
          file_id: string | null
          id: string
          registro_idx: number | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          cargo_id?: string | null
          created_at?: string | null
          descricao?: string | null
          file_id?: string | null
          id?: string
          registro_idx?: number | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          cargo_id?: string | null
          created_at?: string | null
          descricao?: string | null
          file_id?: string | null
          id?: string
          registro_idx?: number | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "piso_salarial_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_files: {
        Row: {
          content: Json
          created_at: string | null
          file_id: string | null
          id: string
          processing_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          file_id?: string | null
          id?: string
          processing_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          file_id?: string | null
          id?: string
          processing_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_files_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
        ]
      }
      search_results: {
        Row: {
          created_at: string
          etapas_raciocinio: string[] | null
          id: string
          processed_data: Json | null
          provider: string
          query: string
          raw_response: Json
          referencia_fontes: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          etapas_raciocinio?: string[] | null
          id?: string
          processed_data?: Json | null
          provider: string
          query: string
          raw_response: Json
          referencia_fontes?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          etapas_raciocinio?: string[] | null
          id?: string
          processed_data?: Json | null
          provider?: string
          query?: string
          raw_response?: Json
          referencia_fontes?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sindicatos: {
        Row: {
          cnpj: string | null
          created_at: string | null
          data_base: string | null
          estado: string | null
          file_id: string | null
          id: string
          nome: string
          registro_idx: number | null
          site: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          data_base?: string | null
          estado?: string | null
          file_id?: string | null
          id?: string
          nome: string
          registro_idx?: number | null
          site?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          data_base?: string | null
          estado?: string | null
          file_id?: string | null
          id?: string
          nome?: string
          registro_idx?: number | null
          site?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sindicatos_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          level: string
          message: string
          module: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          level: string
          message: string
          module?: string | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          level?: string
          message?: string
          module?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          file_hash: string | null
          file_path: string | null
          file_size: number
          file_type: string
          filename: string
          id: string
          processed: boolean | null
          processed_at: string | null
          raw_json: string | null
          uploaded_at: string
        }
        Insert: {
          file_hash?: string | null
          file_path?: string | null
          file_size: number
          file_type: string
          filename: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          raw_json?: string | null
          uploaded_at?: string
        }
        Update: {
          file_hash?: string | null
          file_path?: string | null
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          raw_json?: string | null
          uploaded_at?: string
        }
        Relationships: []
      }
      valores_hora: {
        Row: {
          cargo_id: string | null
          created_at: string | null
          descricao: string | null
          file_id: string | null
          fonte_coluna: string | null
          id: string
          registro_idx: number | null
          tipo: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          cargo_id?: string | null
          created_at?: string | null
          descricao?: string | null
          file_id?: string | null
          fonte_coluna?: string | null
          id?: string
          registro_idx?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          cargo_id?: string | null
          created_at?: string | null
          descricao?: string | null
          file_id?: string | null
          fonte_coluna?: string | null
          id?: string
          registro_idx?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "valores_hora_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
