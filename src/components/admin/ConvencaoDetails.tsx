
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ConvencaoHeader } from "./convencao-details/ConvencaoHeader";
import { ConvencaoInfo } from "./convencao-details/ConvencaoInfo";
import { ConvencaoTabs } from "./convencao-details/ConvencaoTabs";
import { ConvencaoSkeleton } from "./convencao-details/ConvencaoSkeleton";
import { ConvencaoNotFound } from "./convencao-details/ConvencaoNotFound";

interface ConvencaoDetailsProps {
  id: string;
}

export function ConvencaoDetails({ id }: ConvencaoDetailsProps) {
  const [convencao, setConvencao] = useState<any | null>(null);
  const [pisosSalariais, setPisosSalariais] = useState<any[]>([]);
  const [particularidades, setParticularidades] = useState<any[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados principais da convenção
        const { data: convencaoData, error: convencaoError } = await supabase
          .from('convenios')
          .select(`
            *,
            sindicatos (*)
          `)
          .eq('id', id)
          .single();

        if (convencaoError) throw convencaoError;
        setConvencao(convencaoData);

        // Buscar pisos salariais através dos cargos
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('*')
          .eq('convenio_id', id);
        
        if (cargosError) throw cargosError;
        
        // Se temos cargos, vamos buscar os pisos salariais relacionados a eles
        if (cargosData && cargosData.length > 0) {
          const cargoIds = cargosData.map(cargo => cargo.id);
          
          const { data: pisosData, error: pisosError } = await supabase
            .from('piso_salarial')
            .select('*')
            .in('cargo_id', cargoIds);

          if (pisosError) throw pisosError;
          setPisosSalariais(pisosData || []);
          
          // Buscar particularidades relacionadas aos cargos
          const { data: particularidadesData, error: particularidadesError } = await supabase
            .from('particularidades')
            .select('*')
            .in('cargo_id', cargoIds);

          if (particularidadesError) throw particularidadesError;
          setParticularidades(particularidadesData || []);
        }

        // Extrair benefícios das particularidades
        if (particularidades.length > 0) {
          const beneficiosData = particularidades.filter(p => 
            p.categoria && p.categoria.toLowerCase().includes('benefício')
          );
          setBeneficios(beneficiosData);
        } else {
          setBeneficios([]);
        }

      } catch (error) {
        console.error("Erro ao buscar dados da convenção:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, particularidades.length]);

  if (isLoading) {
    return <ConvencaoSkeleton />;
  }

  if (!convencao) {
    return <ConvencaoNotFound />;
  }

  return (
    <Card>
      <CardHeader>
        <ConvencaoHeader
          descricao={convencao.descricao}
          estado={convencao.sindicatos?.estado}
          vigenciaInicio={convencao.vigencia_inicio}
          vigenciaFim={convencao.vigencia_fim}
          dataBase={convencao.sindicatos?.data_base}
        />
      </CardHeader>
      <CardContent>
        <ConvencaoInfo sindicato={convencao.sindicatos} />
        <ConvencaoTabs
          pisosSalariais={pisosSalariais}
          particularidades={particularidades}
          beneficios={beneficios}
        />
      </CardContent>
    </Card>
  );
}
