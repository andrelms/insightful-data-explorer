
import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotificationPanel } from "@/components/admin/NotificationPanel";

interface Notification {
  id: string | number;
  title: string;
  message: string;
  date?: string; // Making date optional to match NotificationPanel
  read: boolean;
}

interface StatusCardProps {
  isConnected?: boolean;
  lastSync?: string | null;
  notificationCount?: string; 
  notifications?: Notification[];
  onMarkAllAsRead?: () => void;
  icon?: React.ReactNode;
  trend?: string;
  trendValue?: string;
}

export function StatusCard({
  isConnected,
  lastSync,
  notificationCount,
  notifications = [],
  onMarkAllAsRead,
  icon,
  trend,
  trendValue
}: StatusCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {icon || <AlertCircle className="h-5 w-5" />}
            Status do Sistema
          </CardTitle>
          {notifications && notificationCount && onMarkAllAsRead && (
            <NotificationPanel
              notificationCount={notificationCount}
              notifications={notifications}
              onMarkAllAsRead={onMarkAllAsRead}
            />
          )}
        </div>
        <CardDescription className="text-blue-100">
          Monitore o estado atual do sistema e acesse funções administrativas.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2 p-4 border rounded-lg">
          <h3 className="text-sm font-semibold">Recursos do Sistema</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>Dashboard</Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/processar-dados")}>Processar Dados</Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/painel-sindicatos")}>Painel Sindicatos</Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/convencoes")}>Convenções</Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 border rounded-lg">
          <h3 className="text-sm font-semibold">Banco de Dados</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Conexão</span>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{isConnected ? 'Ativa' : 'Inativa'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Última sincronização</span>
            <span className="text-sm">{lastSync || "0"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
