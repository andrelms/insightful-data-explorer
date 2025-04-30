
import React from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  id: string | number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationPanelProps {
  notificationCount: number;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({ 
  notificationCount, 
  notifications, 
  onMarkAllAsRead 
}: NotificationPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 hover:text-white">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge variant="outline" className="absolute -top-1 -right-1 bg-white/20 hover:bg-white/30 text-white border-transparent">
              {notificationCount.toString()}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Notificações do Sistema</h3>
            {notificationCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                Marcar como lidas
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-[300px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, i) => (
              <div key={notification.id || i} className={`p-4 border-b last:border-0 ${notification.read ? 'bg-background' : 'bg-muted/30'}`}>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">{notification.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação disponível
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
