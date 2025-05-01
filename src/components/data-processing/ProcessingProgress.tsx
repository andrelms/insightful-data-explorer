
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProcessingProgressProps {
  progress: number;
}

export function ProcessingProgress({ progress }: ProcessingProgressProps) {
  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Processando dados...</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}
