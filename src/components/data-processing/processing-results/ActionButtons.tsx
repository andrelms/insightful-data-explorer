
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onRestart: () => void;
}

export function ActionButtons({ onRestart }: ActionButtonsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between mt-6 pt-4 border-t">
      <Button variant="outline" onClick={onRestart}>
        Processar Novo Arquivo
      </Button>
      <Button onClick={() => navigate("/convencoes")}>
        Visualizar Convenções
      </Button>
    </div>
  );
}
