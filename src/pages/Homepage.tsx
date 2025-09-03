import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Entrega Rápida",
      description: "Receba seus produtos em tempo recorde com nossa logística avançada."
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Compre com confiança. Dados protegidos e transações 100% seguras."
    },
    {
      icon: Star,
      title: "Qualidade Premium",
      description: "Produtos selecionados e de alta qualidade para a melhor experiência."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-primary text-white px-4 py-2 text-sm font-medium">
            🚀 Nova versão disponível
          </Badge>
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold text-neon-cyan mb-6">
            Capital<span className="text-neon-purple">Daark</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            O futuro é agora
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed mb-12">
            Explore nossa loja digital com produtos exclusivos, tecnologia de ponta e experiência de compra revolucionária.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/loja')}
              className="bg-gradient-primary hover:bg-gradient-secondary text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 group"
            >
              Explorar Loja
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/sobre')}
              className="border-border/30 hover:border-neon-purple/50 px-8 py-4 text-lg"
            >
              Saiba Mais
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10 group text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neon-cyan mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Homepage;