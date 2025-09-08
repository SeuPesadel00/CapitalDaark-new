import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import NewsSection from '@/components/NewsSection';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, CreditCard, ShoppingBag, Phone, Info } from 'lucide-react';

function UserHome() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/20">
              <img 
                src="/lovable-uploads/f2993ceb-7c75-4bf7-84fd-dbec0ad7aba2.png" 
                alt="Capital Daark Mascot" 
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-neon-cyan">
                  Bem-vindo, {profile?.first_name || 'Usuário'}!
                </h1>
                <p className="text-muted-foreground">
                  Acompanhe as últimas notícias e tendências do mundo da tecnologia
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Seção de Notícias */}
        <NewsSection />

        <footer className="bg-card/50 border-t border-border/20 p-6 text-center mt-16">
          <p className="text-muted-foreground">&copy; 2025 Capital Daark. Todos os direitos reservados.</p>
          <p className="text-sm mt-2 text-muted-foreground">Construindo o futuro, hoje.</p>
        </footer>
      </div>
    </AuthGuard>
  );
}

export default UserHome;