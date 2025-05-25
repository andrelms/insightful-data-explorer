
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ConvencaoNotFound() {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Convenção não encontrada</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Não foi possível encontrar a convenção com o ID especificado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
