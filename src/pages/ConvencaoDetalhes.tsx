
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvencaoDetalhes } from "@/hooks/useConvencaoDetalhes";
import { ConvencaoDetalhesHeader } from "@/components/convencao-detalhes/ConvencaoDetalhesHeader";
import { ConvencaoDetalhesInfoCard } from "@/components/convencao-detalhes/ConvencaoDetalhesInfoCard";
import { ConvencaoDetalhesPisosCard } from "@/components/convencao-detalhes/ConvencaoDetalhesPisosCard";
import { ConvencaoDetalhesBeneficiosCard } from "@/components/convencao-detalhes/ConvencaoDetalhesBeneficiosCard";
import { ConvencaoDetalhesParticularidadesCard } from "@/components/convencao-detalhes/ConvencaoDetalhesParticularidadesCard";

const ConvencaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { convencao, pisosSalariais, particularidades, beneficios, loading } = useConvencaoDetalhes(id);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!convencao) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Convenção não encontrada</h2>
        <p className="mt-2 text-muted-foreground">A convenção que você está procurando não existe ou foi removida.</p>
        <Button className="mt-4" onClick={() => navigate("/convencoes")}>
          Voltar para Convenções
        </Button>
      </div>
    );
  }

  const isActive = convencao.vigencia_fim ? new Date() <= new Date(convencao.vigencia_fim) : true;

  return (
    <div className="space-y-6">
      <ConvencaoDetalhesHeader
        onVoltar={() => navigate(-1)}
        titulo={convencao.titulo}
        numero={convencao.numero}
        tipo={convencao.tipo}
        isActive={isActive}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ConvencaoDetalhesInfoCard
            vigenciaInicio={convencao.vigencia_inicio}
            vigenciaFim={convencao.vigencia_fim}
            dataBase={convencao.data_base}
            sindicato={convencao.sindicato}
            estado={convencao.estado}
            fonte={convencao.fonte}
            valeRefeicao={convencao.vale_refeicao}
            assistenciaMedica={convencao.assistencia_medica}
            seguroVida={convencao.seguro_vida}
            uniforme={convencao.uniforme}
            formatDate={formatDate}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          <ConvencaoDetalhesPisosCard pisosSalariais={pisosSalariais} />
          <ConvencaoDetalhesBeneficiosCard beneficios={beneficios} />
          <ConvencaoDetalhesParticularidadesCard particularidades={particularidades} />
        </div>
      </div>
    </div>
  );
};

export default ConvencaoDetalhes;
