import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, CreditCard, ShoppingBag, Phone, Info } from 'lucide-react';

function UserHome() {
  const { profile } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-neon-cyan">
                Bem-vindo, {profile?.first_name || 'Usuário'}!
              </h1>
              <p className="text-muted-foreground text-xl">
                Acesse suas configurações, gerencie seu perfil e explore nossa plataforma.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 p-6 shadow-lg hover:shadow-neon-cyan/10 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Meu Perfil</h3>
                <p className="text-muted-foreground mb-4">Gerencie suas informações pessoais e foto de perfil.</p>
                <Link 
                  to="/dados-pessoais" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Acessar Perfil
                </Link>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 p-6 shadow-lg hover:shadow-neon-purple/10 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Configurações</h3>
                <p className="text-muted-foreground mb-4">Ajuste suas preferências e configurações de conta.</p>
                <Link 
                  to="/configuracoes" 
                  className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                >
                  Configurar
                </Link>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 p-6 shadow-lg hover:shadow-neon-green/10 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Pagamentos</h3>
                <p className="text-muted-foreground mb-4">Gerencie seus métodos de pagamento e cartões.</p>
                <Link 
                  to="/payment-methods" 
                  className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                  Gerenciar
                </Link>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 p-6 shadow-lg hover:shadow-neon-cyan/10 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Loja</h3>
                <p className="text-muted-foreground mb-4">Explore nossos produtos e serviços exclusivos.</p>
                <Link 
                  to="/loja" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Ver Loja
                </Link>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 p-6 shadow-lg hover:shadow-neon-purple/10 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Contatos</h3>
                <p className="text-muted-foreground mb-4">Entre em contato conosco para suporte.</p>
                <Link 
                  to="/contatos" 
                  className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                >
                  Contatar
                </Link>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 p-6 shadow-lg hover:shadow-neon-green/10 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Sobre Nós</h3>
                <p className="text-muted-foreground mb-4">Conheça mais sobre a Capital Daark.</p>
                <Link 
                  to="/sobre" 
                  className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                  Conhecer
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-card/50 border-t border-border/20 p-6 text-center mt-16">
          <p className="text-muted-foreground">&copy; 2025 Capital Daark. Todos os direitos reservados.</p>
          <p className="text-sm mt-2 text-muted-foreground">Construindo o futuro, hoje.</p>
        </footer>
      </div>
    </AuthGuard>
  );
}

export default UserHome;