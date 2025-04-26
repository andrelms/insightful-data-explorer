
import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f0f4f8] dark:bg-[#0f172a] transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header 
          className={`h-16 shrink-0 border-b bg-background/80 backdrop-blur-md flex items-center px-4 sticky top-0 z-10 transition-all duration-300 ${
            scrolled ? "shadow-sm" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden hover:bg-transparent hover:text-primary"
            >
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
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-2 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
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
