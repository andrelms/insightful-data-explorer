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
      beneficios: {
        Row: {
          convenio_id: string
          created_at: string | null
          descricao: string | null
          id: string
          tipo: string
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          convenio_id: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          tipo: string
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          convenio_id?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          tipo?: string
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_beneficios_convencoes"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convencoes"
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
      convencoes: {
        Row: {
          abrangencia: string | null
          adicional_noturno: string | null
          assistencia_medica: boolean | null
          created_at: string
          dados_brutos: Json | null
          data_base: string | null
          estado: string | null
          file_id: string | null
          id: string
          seguro_vida: boolean | null
          sindicato_id: string | null
          tipo: string
          titulo: string
          uniforme: boolean | null
          updated_at: string
          vale_refeicao: string | null
          vale_refeicao_valor: number | null
          vigencia_fim: string | null
          vigencia_inicio: string | null
        }
        Insert: {
          abrangencia?: string | null
          adicional_noturno?: string | null
          assistencia_medica?: boolean | null
          created_at?: string
          dados_brutos?: Json | null
          data_base?: string | null
          estado?: string | null
          file_id?: string | null
          id?: string
          seguro_vida?: boolean | null
          sindicato_id?: string | null
          tipo: string
          titulo: string
          uniforme?: boolean | null
          updated_at?: string
          vale_refeicao?: string | null
          vale_refeicao_valor?: number | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Update: {
          abrangencia?: string | null
          adicional_noturno?: string | null
          assistencia_medica?: boolean | null
          created_at?: string
          dados_brutos?: Json | null
          data_base?: string | null
          estado?: string | null
          file_id?: string | null
          id?: string
          seguro_vida?: boolean | null
          sindicato_id?: string | null
          tipo?: string
          titulo?: string
          uniforme?: boolean | null
          updated_at?: string
          vale_refeicao?: string | null
          vale_refeicao_valor?: number | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convencoes_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convencoes_sindicato_id_fkey"
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
        Relationships: [
          {
            foreignKeyName: "feed_noticias_sindicato_id_fkey"
            columns: ["sindicato_id"]
            isOneToOne: false
            referencedRelation: "sindicatos"
            referencedColumns: ["id"]
          },
        ]
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
      licencas: {
        Row: {
          convenio_id: string
          created_at: string | null
          descricao: string | null
          dias: number | null
          id: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          convenio_id: string
          created_at?: string | null
          descricao?: string | null
          dias?: number | null
          id?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          convenio_id?: string
          created_at?: string | null
          descricao?: string | null
          dias?: number | null
          id?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_licencas_convencoes"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convencoes"
            referencedColumns: ["id"]
          },
        ]
      }
      particularidades: {
        Row: {
          convenio_id: string
          created_at: string | null
          descricao: string
          id: string
          updated_at: string | null
        }
        Insert: {
          convenio_id: string
          created_at?: string | null
          descricao: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          convenio_id?: string
          created_at?: string | null
          descricao?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_particularidades_convencoes"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convencoes"
            referencedColumns: ["id"]
          },
        ]
      }
      pisos_salariais: {
        Row: {
          carga_horaria: string | null
          cargo: string
          convenio_id: string | null
          created_at: string | null
          id: string
          piso_salarial: number | null
          updated_at: string | null
          valor_hora_extra_100: number | null
          valor_hora_extra_50: number | null
          valor_hora_normal: number | null
        }
        Insert: {
          carga_horaria?: string | null
          cargo: string
          convenio_id?: string | null
          created_at?: string | null
          id?: string
          piso_salarial?: number | null
          updated_at?: string | null
          valor_hora_extra_100?: number | null
          valor_hora_extra_50?: number | null
          valor_hora_normal?: number | null
        }
        Update: {
          carga_horaria?: string | null
          cargo?: string
          convenio_id?: string | null
          created_at?: string | null
          id?: string
          piso_salarial?: number | null
          updated_at?: string | null
          valor_hora_extra_100?: number | null
          valor_hora_extra_50?: number | null
          valor_hora_normal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pisos_convencoes"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convencoes"
            referencedColumns: ["id"]
          },
        ]
      }
      sindicatos: {
        Row: {
          categoria: string | null
          cnpj: string | null
          created_at: string
          estado: string | null
          id: string
          nome: string
          site: string | null
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          cnpj?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          nome: string
          site?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          cnpj?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          nome?: string
          site?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          file_path: string | null
          file_size: number
          file_type: string
          filename: string
          id: string
          processed: boolean | null
          processed_at: string | null
          uploaded_at: string
        }
        Insert: {
          file_path?: string | null
          file_size: number
          file_type: string
          filename: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          uploaded_at?: string
        }
        Update: {
          file_path?: string | null
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          uploaded_at?: string
        }
        Relationships: []
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
