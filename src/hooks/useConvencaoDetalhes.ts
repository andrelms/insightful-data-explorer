
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Convencao {
  id: string;
  titulo: string;
  numero: string;
  tipo: string;
  estado: string | null;
  abrangencia: string | null;
  sindicato: {
    nome: string;
    cnpj: string | null;
    site: string | null;
  } | null;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  data_base: string | null;
  data_assinatura?: string | null;
  fonte: string;
  assistencia_medica: boolean | null;
  vale_refeicao: string | null;
  vale_refeicao_valor: number | null;
  seguro_vida: boolean | null;
  uniforme: boolean | null;
  adicional_noturno: string | null;
}

interface PisoSalarial {
  id: string;
  cargo: string;
  carga_horaria: string | null;
  piso_salarial: number | null;
  piso_descricao?: string | null;
  valor_hora_normal: number | null;
  valor_hora_extra_50: number | null;
  valor_hora_extra_100: number | null;
}

interface Particularidade {
  id: string;
  categoria?: string;
  conteudo?: string;
  descricao?: string;
}

interface Beneficio {
  id: string;
  tipo: string;
  valor: string | null;
  descricao: string | null;
}

export function useConvencaoDetalhes(id: string | undefined) {
  const [convencao, setConvencao] = useState<Convencao | null>(null);
  const [pisosSalariais, setPisosSalariais] = useState<PisoSalarial[]>([]);
  const [particularidades, setParticularidades] = useState<Particularidade[]>([]);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchConvencao = async () => {
      setLoading(true);
      try {
        // Buscar dados da convenção
        const { data: convencaoData, error: convencaoError } = await supabase
          .from('convenios')
          .select(`
            id, descricao, created_at,
            sindicatos (nome, cnpj, site, data_base)
          `)
          .eq('id', id)
          .single();
          
        if (convencaoError) throw convencaoError;
        
        // Buscar TODOS os cargos dessa convenção
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select(`
            id, cargo, carga_horaria
          `)
          .eq('convenio_id', id);

        if (cargosError) throw cargosError;
        
        // Transformar dados de cargos em pisos salariais
        const pisosProcessed: PisoSalarial[] = [];
        if (cargosData) {
          for (const cargo of cargosData) {
            // Buscar piso salarial para cada cargo
            const { data: pisoData } = await supabase
              .from('piso_salarial')
              .select('valor, descricao')
              .eq('cargo_id', cargo.id)
              .maybeSingle();
              
            // Buscar valores de hora para cada cargo
            const { data: valoresHora } = await supabase
              .from('valores_hora')
              .select('tipo, valor')
              .eq('cargo_id', cargo.id);
            
            // Processar valores de hora (normal, 50%, 100%)
            let valorHoraNormal = null;
            let valorHoraExtra50 = null;
            let valorHoraExtra100 = null;
            
            if (valoresHora && Array.isArray(valoresHora)) {
              valoresHora.forEach(valorHora => {
                if (valorHora.tipo === 'normal') valorHoraNormal = valorHora.valor;
                if (valorHora.tipo === 'extra_50') valorHoraExtra50 = valorHora.valor;
                if (valorHora.tipo === 'extra_100') valorHoraExtra100 = valorHora.valor;
              });
            }
            
            pisosProcessed.push({
              id: cargo.id,
              cargo: cargo.cargo || "Não especificado",
              carga_horaria: cargo.carga_horaria,
              piso_salarial: pisoData?.valor || null,
              piso_descricao: pisoData?.descricao || null,
              valor_hora_normal: valorHoraNormal,
              valor_hora_extra_50: valorHoraExtra50,
              valor_hora_extra_100: valorHoraExtra100
            });
          }
        }
        
        // Buscar particularidades
        const { data: particularidadesData, error: particularidadesError } = await supabase
          .from('particularidades')
          .select('*')
          .eq('convenio_id', id);
          
        if (particularidadesError) throw particularidadesError;
        
        // Buscar benefícios gerais (excluindo 'site')
        const { data: beneficiosData, error: beneficiosError } = await supabase
          .from('beneficios_gerais')
          .select('*')
          .eq('convenio_id', id)
          .neq('tipo', 'site')
          .neq('nome', 'site');
          
        if (beneficiosError) throw beneficiosError;
        
        // Atualizar estados
        if (convencaoData) {
          setConvencao({
            ...convencaoData,
            titulo: convencaoData.descricao || "Sem descrição",
            numero: convencaoData.id.substring(0, 8),
            tipo: "Convenção Coletiva",
            fonte: "Base de dados sindical",
            vigencia_inicio: convencaoData.created_at,
            vigencia_fim: null,
            data_base: convencaoData.sindicatos?.data_base || null,
            estado: null,
            abrangencia: null,
            sindicato: convencaoData.sindicatos,
            assistencia_medica: false,
            vale_refeicao: null,
            vale_refeicao_valor: null,
            seguro_vida: false,
            uniforme: false,
            adicional_noturno: null
          });
        }
        
        setPisosSalariais(pisosProcessed);
        
        // Transformar particularidades
        const partProcessed = (particularidadesData || [])
          .filter(p => p.categoria !== 'benefício')
          .map(p => ({
            id: p.id,
            categoria: p.categoria,
            conteudo: p.conteudo,
            descricao: p.conteudo || ""
          }));
        
        setParticularidades(partProcessed);
        
        // Transformar benefícios
        const benProcessed = (beneficiosData || []).map(b => ({
          id: b.id,
          tipo: b.tipo || "Benefício",
          valor: b.valor,
          descricao: b.descricao
        }));
        
        setBeneficios(benProcessed);
      } catch (error) {
        console.error("Erro ao buscar dados da convenção:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConvencao();
  }, [id]);

  return {
    convencao,
    pisosSalariais,
    particularidades,
    beneficios,
    loading
  };
}
