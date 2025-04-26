
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Download, ExternalLink, Clock, CalendarDays } from "lucide-react";

const ConvencaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - Em uma aplicação real, isso seria buscado da API
  const mockConvencao = {
    id: id,
    title: "CONVENÇÃO COLETIVA DE TRABALHO 2023/2024 - SINDICATO DOS EMPREGADOS NO COMÉRCIO",
    numero: "MG001234/2023",
    ano: 2023,
    sindicatos: [
      { nome: "SINDICATO DOS EMPREGADOS NO COMÉRCIO DE BELO HORIZONTE", cnpj: "12.345.678/0001-90" },
      { nome: "FEDERAÇÃO DO COMÉRCIO DE BENS, SERVIÇOS E TURISMO DO ESTADO DE MINAS GERAIS", cnpj: "98.765.432/0001-10" }
    ],
    vigenciaInicio: "2023-06-01",
    vigenciaFim: "2024-05-31",
    dataAssinatura: "2023-05-20",
    fonte: "MTE - Sistema Mediador",
    linkPdf: "#",
    resumo: "Esta convenção coletiva de trabalho estabelece as condições de trabalho entre os empregados no comércio e as empresas do setor comercial...",
    clausulas: [
      {
        numero: 1,
        titulo: "REAJUSTE SALARIAL",
        texto: "Os salários dos empregados no comércio de Belo Horizonte serão reajustados a partir de 1º de junho de 2023 pelo percentual de 7,5% (sete e meio por cento), a incidir sobre os salários vigentes em maio de 2023."
      },
      {
        numero: 2,
        titulo: "PISO SALARIAL",
        texto: "A partir de 1º de junho de 2023, nenhum comerciário poderá receber salário inferior a R$ 1.485,00 (mil quatrocentos e oitenta e cinco reais) mensais."
      },
      {
        numero: 3,
        titulo: "JORNADA DE TRABALHO",
        texto: "A jornada normal de trabalho dos empregados no comércio será de 44 (quarenta e quatro) horas semanais, não se aplicando esta cláusula aos vigias e empregados que trabalham em jornada especial."
      },
      {
        numero: 4,
        titulo: "HORAS EXTRAS",
        texto: "As horas extras serão pagas com adicional de 60% (sessenta por cento) sobre o valor da hora normal."
      },
      {
        numero: 5,
        titulo: "VALE-TRANSPORTE",
        texto: "As empresas fornecerão vale-transporte aos seus empregados, descontando no máximo 6% (seis por cento) do salário-base."
      }
    ]
  };

  const isActive = new Date() <= new Date(mockConvencao.vigenciaFim);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver documento original
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">{mockConvencao.title}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant={isActive ? "default" : "outline"} className="text-xs">
            {isActive ? "VIGENTE" : "EXPIRADA"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {mockConvencao.numero} / {mockConvencao.ano}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna lateral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                  <CalendarDays className="h-4 w-4" />
                  Vigência
                </div>
                <p>
                  {new Date(mockConvencao.vigenciaInicio).toLocaleDateString("pt-BR")} até{" "}
                  {new Date(mockConvencao.vigenciaFim).toLocaleDateString("pt-BR")}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Data de Assinatura
                </div>
                <p>{new Date(mockConvencao.dataAssinatura).toLocaleDateString("pt-BR")}</p>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground mb-2">Sindicatos Participantes</p>
                <ul className="space-y-2">
                  {mockConvencao.sindicatos.map((sindicato, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-medium">{sindicato.nome}</p>
                      <p className="text-muted-foreground text-xs">CNPJ: {sindicato.cnpj}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground mb-1">Fonte</p>
                <p>{mockConvencao.fonte}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Conteúdo principal */}
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mockConvencao.resumo}</p>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Cláusulas Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockConvencao.clausulas.map((clausula, i) => (
                <div key={i}>
                  <h3 className="font-semibold">
                    Cláusula {clausula.numero} - {clausula.titulo}
                  </h3>
                  <p className="text-sm mt-1">{clausula.texto}</p>
                  {i < mockConvencao.clausulas.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConvencaoDetalhes;
