
import React from "react";
import { Button } from "@/components/ui/button";

interface ProcessInstructionsProps {
  onStartProcessing: () => void;
}

export function ProcessInstructions({ onStartProcessing }: ProcessInstructionsProps) {
  return (
    <div className="flex flex-col space-y-4">
      <p className="text-sm">
        O arquivo será processado para extrair informações estruturadas.
        Este processo inclui:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Extração de dados de convenções coletivas</li>
        <li>Identificação de sindicatos e seus CNPJs</li>
        <li>Estruturação de dados salariais por categoria</li>
        <li>Organização por estados e regiões</li>
      </ul>
      <Button onClick={onStartProcessing} className="w-full mt-4">
        Iniciar Processamento
      </Button>
    </div>
  );
}
