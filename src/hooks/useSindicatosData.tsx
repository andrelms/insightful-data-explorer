
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SindicatoData, EstadoSindicatos } from '@/types/sindicatos';
import { siglas_estados } from '@/constants/estados';

export const useSindicatosData = () => {
  const [dados, setDados] = useState<EstadoSindicatos[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDadosSupabase = async () => {
    setLoading(true);
    try {
      // Buscar sindicatos com convenios, cargos e dados relacionados
      const { data: sindicatos, error: sindicatosError } = await supabase
        .from('sindicatos')
        .select(`
          id,
          nome,
          cnpj,
          site,
          data_base,
          estado
        `);

      if (sindicatosError) {
        console.error('Erro ao buscar sindicatos:', sindicatosError);
        return;
      }

      if (!sindicatos || sindicatos.length === 0) {
        setDados([]);
        setLoading(false);
        return;
      }

      // Para cada sindicato, buscar seus convenios e dados relacionados
      const sindicatosCompletos: SindicatoData[] = [];

      for (const sindicato of sindicatos) {
        // Buscar convenios do sindicato
        const { data: convenios } = await supabase
          .from('convenios')
          .select('id')
          .eq('sindicato_id', sindicato.id);

        if (!convenios || convenios.length === 0) {
          // Adicionar sindicato mesmo sem convenios
          sindicatosCompletos.push({
            ...sindicato,
            cargos: [],
            beneficios: [],
            particularidades: []
          });
          continue;
        }

        const convenioIds = convenios.map(c => c.id);

        // Buscar cargos dos convenios (incluindo duplicados)
        const { data: cargos } = await supabase
          .from('cargos')
          .select(`
            id,
            cargo,
            carga_horaria,
            cbo
          `)
          .in('convenio_id', convenioIds);

        // Buscar beneficios gerais dos convenios (excluindo tipo 'site')
        const { data: beneficios } = await supabase
          .from('beneficios_gerais')
          .select(`
            tipo,
            nome,
            valor,
            descricao
          `)
          .in('convenio_id', convenioIds)
          .neq('tipo', 'site'); // Excluir tipo 'site'

        // Buscar sugestões de particularidades das anotações relacionadas aos benefícios
        let beneficiosComSugestoes = beneficios || [];
        if (beneficios && beneficios.length > 0) {
          const { data: anotacoes } = await supabase
            .from('anotacoes')
            .select('sugestao_particularidade, campo_formatado')
            .in('convenio_id', convenioIds)
            .not('sugestao_particularidade', 'is', null);

          // Mapear sugestões para os benefícios baseado no campo_formatado
          beneficiosComSugestoes = beneficios.map(beneficio => {
            const anotacaoRelacionada = anotacoes?.find(anotacao => 
              anotacao.campo_formatado?.toLowerCase().includes(beneficio.tipo?.toLowerCase() || '') ||
              anotacao.campo_formatado?.toLowerCase().includes(beneficio.nome?.toLowerCase() || '')
            );
            
            return {
              ...beneficio,
              sugestao_particularidade: anotacaoRelacionada?.sugestao_particularidade || null
            };
          });
        }

        // Buscar particularidades
        const { data: particularidades } = await supabase
          .from('particularidades')
          .select(`
            categoria,
            conteudo
          `)
          .in('convenio_id', convenioIds);

        // Para cada cargo, buscar piso salarial e valores de hora
        const cargosCompletos = [];
        
        if (cargos) {
          for (const cargo of cargos) {
            const { data: pisoSalarial } = await supabase
              .from('piso_salarial')
              .select('valor, descricao')
              .eq('cargo_id', cargo.id)
              .maybeSingle();

            const { data: valoresHora } = await supabase
              .from('valores_hora')
              .select(`
                tipo,
                valor,
                descricao
              `)
              .eq('cargo_id', cargo.id);

            cargosCompletos.push({
              ...cargo,
              piso_salarial: pisoSalarial?.valor || null,
              piso_descricao: pisoSalarial?.descricao || null,
              valores_hora: valoresHora || []
            });
          }
        }

        // Extrair estado do sindicato (pode estar na data_base ou no nome)
        let estadoSigla = sindicato.estado;
        if (!estadoSigla && sindicato.data_base) {
          const match = sindicato.data_base.match(/([A-Z]{2})/);
          estadoSigla = match ? match[1] : null;
        }
        if (!estadoSigla && sindicato.nome) {
          const match = sindicato.nome.match(/([A-Z]{2})/);
          estadoSigla = match ? match[1] : null;
        }

        sindicatosCompletos.push({
          ...sindicato,
          estado: estadoSigla,
          cargos: cargosCompletos,
          beneficios: beneficiosComSugestoes,
          particularidades: particularidades || []
        });
      }

      // Agrupar sindicatos por estado
      const estadosMap: {[key: string]: SindicatoData[]} = {};
      
      sindicatosCompletos.forEach(sindicato => {
        const estado = sindicato.estado || 'OUTROS';
        if (!estadosMap[estado]) {
          estadosMap[estado] = [];
        }
        estadosMap[estado].push(sindicato);
      });

      // Converter para array de EstadoSindicatos
      const estadosArray: EstadoSindicatos[] = Object.entries(estadosMap).map(([sigla, sindicatos]) => ({
        sigla,
        nome: siglas_estados[sigla] || sigla,
        sindicatos
      }));

      // Ordenar por nome do estado
      estadosArray.sort((a, b) => a.nome.localeCompare(b.nome));

      setDados(estadosArray);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosSupabase();
  }, []);

  return { dados, loading };
};
