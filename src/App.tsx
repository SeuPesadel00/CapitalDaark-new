import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Loja from "./pages/Loja";
import Configuracoes from "./pages/Configuracoes";
import DadosPessoais from "./pages/DadosPessoais";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecoverPassword from "./pages/RecoverPassword";
import AuthGuard from "./pages/AuthGuard";
import Noticias from "./pages/Noticias";
import Sobre from "./pages/Sobre";
import Contatos from "./pages/Contatos";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contatos" element={<Contatos />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Rotas protegidas */}
            <Route
              path="/loja"
              element={
                <AuthGuard>
                  <Loja />
                </AuthGuard>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <AuthGuard>
                  <Configuracoes />
                </AuthGuard>
              }
            />
            <Route
              path="/dados-pessoais"
              element={
                <AuthGuard>
                  <DadosPessoais />
                </AuthGuard>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;