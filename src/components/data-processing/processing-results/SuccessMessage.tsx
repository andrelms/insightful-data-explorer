
import React from "react";

interface SuccessMessageProps {
  fileName: string;
}

export function SuccessMessage({ fileName }: SuccessMessageProps) {
  return (
    <>
      <h3 className="font-medium text-green-500 mb-2">Processamento concluído com sucesso!</h3>
      <p className="text-sm mb-4">
        Os dados foram extraídos e processados. Agora você pode visualizá-los no painel ou realizar análises adicionais.
      </p>
    </>
  );
}
