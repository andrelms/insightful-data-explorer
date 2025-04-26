
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LayoutDashboard, Settings, FileText, Database, MessageCircle, Clock, Upload, Layers, Users, MessageSquare, BarChart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { theme } = useTheme();
  
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden",
          open ? "block" : "hidden"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed z-30 inset-y-0 left-0 w-64 bg-[#0f172a] dark:bg-[#0f172a] text-white border-r border-[#1e293b] px-3 py-4 flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">Sindicatos</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-400 hover:text-white hover:bg-[#1e293b]"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu Principal
            </h2>
            <ul className="space-y-1">
              <NavItem icon={LayoutDashboard} to="/" label="Dashboard" />
              <NavItem icon={BarChart} to="/painel-sindicatos" label="Painel Sindicatos" />
              <NavItem icon={FileText} to="/convencoes" label="Convenções" />
              <NavItem icon={Upload} to="/processar-dados" label="Processar Dados" badge="Novo" />
            </ul>
          </div>
          
          <div className="px-3 py-2 mt-6">
            <h2 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Ferramentas
            </h2>
            <ul className="space-y-1">
              <NavItem icon={MessageSquare} to="/chat" label="Chat IA" />
              <NavItem icon={Clock} to="/historico" label="Histórico" />
              <NavItem icon={Users} to="/admin" label="Administrativo" />
              <NavItem icon={Settings} to="/configuracoes" label="Configurações" />
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#1e293b] pt-3 mt-6">
          <div className="text-xs text-gray-400 px-4 flex items-center justify-between">
            <span>Versão 1.0.0</span>
            <NavLink to="/contato" className="text-blue-400 hover:text-blue-300">
              Contato
            </NavLink>
          </div>
          <div className="mt-4 px-4">
            <div className="glass-effect bg-[#1e293b]/60 p-3 rounded-xl">
              <div className="text-xs font-medium mb-2">Status do Banco</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-300">Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  to: string;
  label: string;
  badge?: string;
}

function NavItem({ icon: Icon, to, label, badge }: NavItemProps) {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
          "transition-colors hover:bg-[#1e293b] hover:text-white",
          isActive 
            ? "bg-gradient-to-r from-blue-600/40 to-violet-600/40 text-white" 
            : "text-gray-300"
        )}
        end={to === "/"}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        {badge && (
          <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
}
