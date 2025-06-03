
import { SindicatoData } from "./types";

interface SindicatoInfoProps {
  sindicato: SindicatoData;
}

export function SindicatoInfo({ sindicato }: SindicatoInfoProps) {
  const getInformacoesSindicato = (sindicato: SindicatoData) => {
    const informacoes: { coluna: string; valor: string }[] = [];
    
    const ordemColunas = ['Site', 'Data Base', 'Vigência Início', 'Vigência Fim'];
    
    if (sindicato.site) {
      informacoes.push({ coluna: 'Site', valor: sindicato.site });
    }
    
    if (sindicato.data_base) {
      informacoes.push({ coluna: 'Data Base', valor: sindicato.data_base });
    }
    
    if (sindicato.vigencia_inicio) {
      informacoes.push({ 
        coluna: 'Vigência Início', 
        valor: new Date(sindicato.vigencia_inicio).toLocaleDateString('pt-BR') 
      });
    }
    
    if (sindicato.vigencia_fim) {
      informacoes.push({ 
        coluna: 'Vigência Fim', 
        valor: new Date(sindicato.vigencia_fim).toLocaleDateString('pt-BR') 
      });
    }
    
    if (sindicato.anotacoes) {
      const colunasFiltradas = ['SITE', 'DATA BASE', 'VIGENCIA INICIO', 'VIGENCIA FIM'];
      const anotacoesFiltradas = sindicato.anotacoes
        .filter(anotacao => colunasFiltradas.includes(anotacao.coluna.toUpperCase()))
        .filter(anotacao => !informacoes.some(info => info.coluna.toLowerCase() === anotacao.coluna.toLowerCase()));
      
      anotacoesFiltradas.forEach(anotacao => {
        informacoes.push({ 
          coluna: anotacao.coluna, 
          valor: anotacao.campo_formatado 
        });
      });
    }
    
    return informacoes.sort((a, b) => {
      const indexA = ordemColunas.findIndex(col => col.toLowerCase() === a.coluna.toLowerCase());
      const indexB = ordemColunas.findIndex(col => col.toLowerCase() === b.coluna.toLowerCase());
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  };

  const informacoes = getInformacoesSindicato(sindicato);

  if (informacoes.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-xs text-accent-foreground">Informações do Sindicato</h4>
      <div className="grid grid-cols-1 gap-2">
        {informacoes.map((info, idx) => (
          <div key={idx} className="bg-muted/30 p-2 rounded border-l-2 border-primary">
            <div className="text-xs font-medium">{info.coluna}</div>
            <div className="truncate">{info.valor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
