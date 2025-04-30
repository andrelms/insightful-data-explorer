
import React from "react";

export function ProcessingHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Processamento de Dados</h1>
      <p className="text-muted-foreground">
        Faça upload de arquivos Excel ou PDF para extrair e processar dados de convenções coletivas.
      </p>
    </div>
  );
}
