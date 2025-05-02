
import { AlertTriangle, Database } from "lucide-react";

export function DatabaseAlerts() {
  return (
    <>
      <div className="rounded-md bg-blue-50 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Database className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Importante</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Sempre faça backup dos dados antes de qualquer operação de limpeza ou importação.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Atenção</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>A limpeza da base de dados irá remover permanentemente:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Todas as convenções e acordos coletivos</li>
                <li>Todos os arquivos enviados (Excel, PDF, CSV)</li>
                <li>Todo o histórico de feeds e notícias</li>
                <li>Todas as estatísticas e métricas</li>
                <li>Todo o histórico de consultas e importações</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
