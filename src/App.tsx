
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainLayout } from "./components/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PainelSindicatos from "./pages/PainelSindicatos";
import BuscaConvencoes from "./pages/BuscaConvencoes";
import Convencoes from "./pages/Convencoes";
import ConvencaoDetalhes from "./pages/ConvencaoDetalhes";
import ProcessarDados from "./pages/ProcessarDados";
import Admin from "./pages/Admin";
import Configuracoes from "./pages/Configuracoes";
import Historico from "./pages/Historico";
import Chat from "./pages/Chat";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="painel-sindicatos" element={<PainelSindicatos />} />
                <Route path="busca-convencoes" element={<BuscaConvencoes />} />
                <Route path="convencoes" element={<Convencoes />} />
                <Route path="convencoes/:id" element={<ConvencaoDetalhes />} />
                <Route path="processar-dados" element={<ProcessarDados />} />
                <Route path="admin" element={<Admin />} />
                <Route path="configuracoes" element={<Configuracoes />} />
                <Route path="historico" element={<Historico />} />
                <Route path="chat" element={<Chat />} />
                <Route path="contato" element={<Contato />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
