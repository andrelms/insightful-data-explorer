
import React from "react";
import { Scale, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminMetricsCardsProps {
  activeConventions: number;
  recentImports: number;
  notificationCount: number;
  convTrend: number;
}

export function AdminMetricsCards({
  activeConventions,
  recentImports,
  notificationCount,
  convTrend
}: AdminMetricsCardsProps) {
  // Determine if trend is up or down based on the value
  const trendDirection = convTrend >= 0 ? 'up' : 'down';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="card p-6 border rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <h3 className="font-medium">Convenções</h3>
          </div>
          <Button size="sm" variant="outline">Ver todas</Button>
        </div>
        <p className="text-3xl font-bold">{activeConventions}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">Ativas</span>
          <div className="flex items-center text-xs">
            <span className={`${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(convTrend)}%
            </span>
          </div>
        </div>
      </div>

      <div className="card p-6 border rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-orange-500" />
            <h3 className="font-medium">Processamentos</h3>
          </div>
          <Button size="sm" variant="outline">Histórico</Button>
        </div>
        <p className="text-3xl font-bold">{recentImports}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">Últimos 30 dias</span>
          <div className="flex items-center text-xs">
            <span className="text-green-500">5%</span>
          </div>
        </div>
      </div>
      
      <div className="card p-6 border rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-500" />
            <h3 className="font-medium">Notificações</h3>
          </div>
          <Button size="sm" variant="outline">Ver todas</Button>
        </div>
        <p className="text-3xl font-bold">{notificationCount}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">Não lidas</span>
          <div className="flex items-center text-xs">
            <span className="text-red-500">15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
