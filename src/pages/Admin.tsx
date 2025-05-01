
import React from "react";
import { Bell } from "lucide-react";
import { StatusCard } from "@/components/admin/StatusCard";
import { AdminMetricsCards } from "@/components/admin/AdminMetricsCards";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { useSystemStatus } from "@/hooks/useSystemStatus";

const Admin = () => {
  const { 
    isConnected,
    lastSync, 
    notificationCount, 
    notifications, 
    activeConventions,
    recentImports,
    convTrend,
    markAllAsRead 
  } = useSystemStatus();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
        <p className="text-muted-foreground">
          Gerencie dados, defina configurações e monitore o sistema.
        </p>
      </div>

      <AdminMetricsCards 
        activeConventions={activeConventions}
        recentImports={recentImports}
        notificationCount={notificationCount}
        convTrend={convTrend}
      />

      <StatusCard 
        icon={<Bell className="h-5 w-5" />}
        trend="up"
        trendValue="12%"
        isConnected={isConnected}
        lastSync={lastSync}
        notificationCount={notificationCount.toString()}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
      />

      <AdminTabs />
    </div>
  );
};

export default Admin;
