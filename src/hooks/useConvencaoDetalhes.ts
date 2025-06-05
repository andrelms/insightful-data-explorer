
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
  valor_hora_normal: number | null;
  valor_hora_extra_50: number | null;
  valor_hora_extra_100: number | null;
}

interface Particularidade {
  id: string;
  descricao: string;
  sugestao_particularidade?: string;
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
        // Buscar dados da convenção com sindicato
        const { data: convencaoData, error: convencaoError } = await supabase
          .from('convenios')
          .select(`
            id, descricao, vigencia_inicio, vigencia_fim, 
            sindicatos (nome, cnpj, site, data_base, estado)
          `)
          .eq('id', id)
          .single();
          
        if (convencaoError) throw convencaoError;
        
        // Buscar cargos e dados relacionados
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select(`
            id, cargo, carga_horaria,
            piso_salarial (valor, descricao),
            valores_hora (tipo, valor)
          `)
          .eq('convenio_id', id);

        if (cargosError) throw cargosError;
        
        // Buscar anotações para benefícios (excluindo PARTICULARIDADE e CNPJ)
        const { data: anotacoesData, error: anotacoesError } = await supabase
          .from('anotacoes')
          .select('*')
          .eq('convenio_id', id)
          .not('coluna', 'in', '("PARTICULARIDADE", "CNPJ")');
          
        if (anotacoesError) throw anotacoesError;
        
        // Buscar particularidades da tabela particularidades e anotações PARTICULARIDADE
        const { data: particularidadesData, error: particularidadesError } = await supabase
          .from('particularidades')
          .select('*')
          .eq('convenio_id', id);
          
        if (particularidadesError) throw particularidadesError;

        const { data: anotacoesParticularidades, error: anotParticError } = await supabase
          .from('anotacoes')
          .select('*')
          .eq('convenio_id', id)
          .eq('coluna', 'PARTICULARIDADE');

        if (anotParticError) throw anotParticError;
        
        // Processar pisos salariais
        const pisosProcessed: PisoSalarial[] = [];
        if (cargosData) {
          cargosData.forEach(cargo => {
            const pisoValor = cargo.piso_salarial && cargo.piso_salarial.length > 0 
              ? cargo.piso_salarial[0].valor 
              : null;
              
            let valorHoraNormal = null;
            let valorHoraExtra50 = null;
            let valorHoraExtra100 = null;
            
            if (cargo.valores_hora && Array.isArray(cargo.valores_hora)) {
              cargo.valores_hora.forEach(valorHora => {
                if (valorHora.tipo === 'normal') valorHoraNormal = valorHora.valor;
                if (valorHora.tipo === 'extra_50') valorHoraExtra50 = valorHora.valor;
                if (valorHora.tipo === 'extra_100') valorHoraExtra100 = valorHora.valor;
              });
            }
            
            pisosProcessed.push({
              id: cargo.id,
              cargo: cargo.cargo || "Não especificado",
              carga_horaria: cargo.carga_horaria,
              piso_salarial: pisoValor,
              valor_hora_normal: valorHoraNormal,
              valor_hora_extra_50: valorHoraExtra50,
              valor_hora_extra_100: valorHoraExtra100
            });
          });
        }
        
        // Processar benefícios das anotações
        const beneficiosProcessed = (anotacoesData || []).map(anotacao => ({
          id: anotacao.id,
          tipo: anotacao.coluna || "Benefício",
          valor: anotacao.campo_formatado,
          descricao: anotacao.sugestao_particularidade
        }));
        
        // Processar particularidades
        const particularidadesProcessed = [
          ...(particularidadesData || []).map(p => ({
            id: p.id,
            descricao: p.conteudo || "",
            sugestao_particularidade: p.categoria
          })),
          ...(anotacoesParticularidades || []).map(a => ({
            id: a.id,
            descricao: a.campo_formatado || "",
            sugestao_particularidade: a.sugestao_particularidade
          }))
        ];
        
        // Atualizar estados
        if (convencaoData) {
          setConvencao({
            ...convencaoData,
            titulo: convencaoData.descricao || "Sem descrição",
            numero: convencaoData.id.substring(0, 8),
            tipo: "Convenção Coletiva",
            fonte: "Base de dados sindical",
            estado: convencaoData.sindicatos?.estado || null,
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
        setBeneficios(beneficiosProcessed);
        setParticularidades(particularidadesProcessed);
        
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
