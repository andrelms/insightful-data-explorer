
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, Bell, MessageSquare } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({
  children
}: MainLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { theme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Buscar notificações do banco
    const fetchNotifications = async () => {
      try {
        const { data: notificationsData, error } = await supabase
          .from('feed_noticias')
          .select('*')
          .order('data_publicacao', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        if (notificationsData && notificationsData.length > 0) {
          // Considerar apenas notificações não lidas (simulado aqui)
          // Em um sistema real, teria uma coluna 'lida' na tabela
          setNotificationCount(Math.min(notificationsData.length, 3));
          setNotifications(notificationsData.slice(0, 5).map(n => ({
            id: n.id,
            title: n.titulo,
            message: n.conteudo?.substring(0, 100) || "Nova atualização disponível",
            date: new Date(n.data_publicacao).toLocaleDateString('pt-BR'),
            read: false
          })));
        } else {
          // Se não há notificações no banco, mostrar contador 0
          setNotificationCount(0);
          setNotifications([]);
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        // Em caso de erro, não mostrar notificações
        setNotificationCount(0);
      }
    };
    
    fetchNotifications();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const markAllAsRead = () => {
    // Em um sistema real, atualizaria o banco de dados
    setNotificationCount(0);
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  return (
    <div className="flex min-h-screen bg-[#f5faff] dark:bg-[#0f172a] transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`h-16 shrink-0 border-b bg-background/80 backdrop-blur-md flex items-center px-4 sticky top-0 z-10 transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden hover:bg-transparent hover:text-primary">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Notificações</h3>
                    {notificationCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
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
                {notifications.length > 0 && (
                  <div className="p-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => navigate('/historico')}>
                      Ver todas as notificações
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            <ThemeToggle />
            
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 rounded-full hover:bg-primary hover:text-white transition-colors" onClick={() => navigate("/contato")}>
              <span className="text-xs">Contato</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 max-w-7xl">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t py-4 px-6 text-center text-xs text-muted-foreground">
          <p>Sistema de Convenções Coletivas © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
