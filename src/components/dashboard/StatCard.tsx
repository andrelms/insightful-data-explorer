
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  // Formatação de valores especiais - atualizando para sempre mostrar "0" em vez de "N/A"
  const displayValue = value === "0" || value === 0 || value === "N/A" || value === null || value === undefined ? 
    "0" : 
    value;
  
  return (
    <Card className="overflow-hidden border hover-scale hover-glow transition-all">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border-b flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground/70">{title}</h3>
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          </div>
          
          <div className="p-4 flex flex-col">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">{displayValue}</span>
              {trend && trend.value > 0 && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                    trend.isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {trend.isPositive ? "+" : "-"}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
