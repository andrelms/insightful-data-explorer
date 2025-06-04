
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SindicatoData, EstadoSindicatos, siglas_estados } from "@/types/sindicatos";

export function useSindicatosData() {
  const [dados, setDados] = useState<EstadoSindicatos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDadosSupabase();
  }, []);

  const fetchDadosSupabase = async () => {
    setLoading(true);
    try {
      // Buscar dados com joins otimizados em paralelo
      const [
        { data: sindicatos, error: sindicatosError },
        { data: convenios, error: conveniosError },
        { data: cargos, error: cargosError },
        { data: beneficios, error: beneficiosError },
        { data: particularidades, error: particularidadesError },
        { data: valoresHora, error: valoresHoraError },
        { data: jornadas, error: jornadasError },
        { data: pisosSalariais, error: pisosSalariaisError },
        { data: anotacoes, error: anotacoesError }
      ] = await Promise.all([
        supabase.from('sindicatos').select('id, nome, cnpj, site, data_base, estado'),
        supabase.from('convenios').select('id, sindicato_id, vigencia_inicio, vigencia_fim'),
        supabase.from('cargos').select('id, cargo, carga_horaria, cbo, convenio_id'),
        supabase.from('beneficios_gerais').select('tipo, nome, valor, descricao, categoria, fonte_coluna, registro_idx, convenio_id').order('registro_idx'),
        supabase.from('particularidades').select('categoria, conteudo, detalhe, registro_idx, convenio_id'),
        supabase.from('valores_hora').select('cargo_id, descricao, valor'),
        supabase.from('jornada_cargo').select('cargo_id, carga_horaria, valor, unidade'),
        supabase.from('piso_salarial').select('cargo_id, descricao, valor'),
        supabase.from('anotacoes').select('convenio_id, coluna, campo_formatado, sugestao_particularidade, registro_idx')
      ]);

      if (sindicatosError) throw sindicatosError;
      if (conveniosError) throw conveniosError;
      if (cargosError) throw cargosError;
      if (beneficiosError) throw beneficiosError;
      if (particularidadesError) throw particularidadesError;
      if (valoresHoraError) throw valoresHoraError;
      if (jornadasError) throw jornadasError;
      if (pisosSalariaisError) throw pisosSalariaisError;

      if (!sindicatos || sindicatos.length === 0) {
        setDados([]);
        setLoading(false);
        return;
      }

      // Criar maps para lookup rápido
      const conveniosMap = new Map();
      convenios?.forEach(convenio => {
        if (!conveniosMap.has(convenio.sindicato_id)) {
          conveniosMap.set(convenio.sindicato_id, []);
        }
        conveniosMap.get(convenio.sindicato_id).push(convenio);
      });

      const cargosMap = new Map();
      cargos?.forEach(cargo => {
        if (!cargosMap.has(cargo.convenio_id)) {
          cargosMap.set(cargo.convenio_id, []);
        }
        cargosMap.get(cargo.convenio_id).push(cargo);
      });

      const beneficiosMap = new Map();
      beneficios?.forEach(beneficio => {
        if (beneficio.tipo !== 'DATA BASE') { // Filtrar tipo DATA BASE
          if (!beneficiosMap.has(beneficio.convenio_id)) {
            beneficiosMap.set(beneficio.convenio_id, []);
          }
          beneficiosMap.get(beneficio.convenio_id).push(beneficio);
        }
      });

      const particularidadesMap = new Map();
      particularidades?.forEach(part => {
        if (!particularidadesMap.has(part.convenio_id)) {
          particularidadesMap.set(part.convenio_id, []);
        }
        particularidadesMap.get(part.convenio_id).push(part);
      });

      const valoresHoraMap = new Map();
      valoresHora?.forEach(vh => {
        if (!valoresHoraMap.has(vh.cargo_id)) {
          valoresHoraMap.set(vh.cargo_id, []);
        }
        valoresHoraMap.get(vh.cargo_id).push(vh);
      });

      const jornadasMap = new Map();
      jornadas?.forEach(j => {
        if (!jornadasMap.has(j.cargo_id)) {
          jornadasMap.set(j.cargo_id, []);
        }
        jornadasMap.get(j.cargo_id).push(j);
      });

      const pisosSalariaisMap = new Map();
      pisosSalariais?.forEach(p => {
        if (!pisosSalariaisMap.has(p.cargo_id)) {
          pisosSalariaisMap.set(p.cargo_id, []);
        }
        pisosSalariaisMap.get(p.cargo_id).push(p);
      });

      const anotacoesMap = new Map();
      anotacoes?.forEach(anotacao => {
        if (!anotacoesMap.has(anotacao.convenio_id)) {
          anotacoesMap.set(anotacao.convenio_id, []);
        }
        anotacoesMap.get(anotacao.convenio_id).push(anotacao);
      });

      // Processar sindicatos
      const sindicatosCompletos: SindicatoData[] = sindicatos.map(sindicato => {
        const sindicatoConvenios = conveniosMap.get(sindicato.id) || [];
        const vigencia = sindicatoConvenios[0];

        const allCargos = [];
        const allBeneficios = [];
        const allParticularidades = [];
        const allValoresHora = [];
        const allJornadas = [];
        const allPisosSalariais = [];
        const allAnotacoes = [];

        sindicatoConvenios.forEach(convenio => {
          const conveniosCargos = cargosMap.get(convenio.id) || [];
          // Ordenar cargos alfabeticamente
          conveniosCargos.sort((a, b) => a.cargo.localeCompare(b.cargo));
          allCargos.push(...conveniosCargos);

          const convenioBeneficios = beneficiosMap.get(convenio.id) || [];
          allBeneficios.push(...convenioBeneficios);

          const convenioParticularidades = particularidadesMap.get(convenio.id) || [];
          allParticularidades.push(...convenioParticularidades);

          const convenioAnotacoes = anotacoesMap.get(convenio.id) || [];
          allAnotacoes.push(...convenioAnotacoes);

          // Para cada cargo, buscar valores hora, jornadas e pisos
          conveniosCargos.forEach(cargo => {
            const cargoValoresHora = valoresHoraMap.get(cargo.id) || [];
            cargoValoresHora.forEach(vh => {
              allValoresHora.push({
                cargo_id: cargo.id,
                cargo: cargo.cargo,
                descricao: vh.descricao,
                valor: vh.valor
              });
            });

            const cargoJornadas = jornadasMap.get(cargo.id) || [];
            cargoJornadas.forEach(j => {
              allJornadas.push({
                cargo_id: cargo.id,
                carga_horaria: j.carga_horaria,
                valor: j.valor,
                unidade: j.unidade
              });
            });

            const cargoPisos = pisosSalariaisMap.get(cargo.id) || [];
            cargoPisos.forEach(p => {
              allPisosSalariais.push({
                cargo_id: cargo.id,
                descricao: p.descricao,
                valor: p.valor
              });
            });
          });
        });

        // Extrair estado do sindicato
        let estadoSigla = sindicato.estado;
        if (!estadoSigla && sindicato.data_base) {
          const match = sindicato.data_base.match(/([A-Z]{2})/);
          estadoSigla = match ? match[1] : null;
        }
        if (!estadoSigla && sindicato.nome) {
          const match = sindicato.nome.match(/([A-Z]{2})/);
          estadoSigla = match ? match[1] : null;
        }

        return {
          ...sindicato,
          estado: estadoSigla,
          vigencia_inicio: vigencia?.vigencia_inicio,
          vigencia_fim: vigencia?.vigencia_fim,
          cargos: allCargos,
          beneficios: allBeneficios,
          particularidades: allParticularidades,
          valoresHora: allValoresHora,
          jornadas: allJornadas,
          pisosSalariais: allPisosSalariais,
          anotacoes: allAnotacoes
        };
      });

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

  return { dados, loading };
}
