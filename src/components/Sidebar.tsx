
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LayoutDashboard, Settings, FileText, Database } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
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
          "fixed z-30 inset-y-0 left-0 w-64 bg-sidebar border-r px-3 py-4 flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 mb-6">
          <h2 className="text-xl font-bold">Sindicato</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            <NavItem icon={LayoutDashboard} to="/" label="Dashboard" />
            <NavItem icon={FileText} to="/convencoes" label="Convenções" />
            <NavItem icon={Database} to="/admin" label="Administrativo" />
            <NavItem icon={Settings} to="/configuracoes" label="Configurações" />
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t pt-3 mt-6">
          <div className="text-xs text-muted-foreground">
            Versão 1.0.0
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
}

function NavItem({ icon: Icon, to, label }: NavItemProps) {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
          "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground"
        )}
        end={to === "/"}
      >
        <Icon className="h-5 w-5" />
        {label}
      </NavLink>
    </li>
  );
}
