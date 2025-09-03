import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Star, Users, Globe, Rocket } from 'lucide-react';

const Sobre = () => {
  const features = [
    {
      icon: Zap,
      title: "Tecnologia de Ponta",
      description: "Produtos com as mais avançadas tecnologias do mercado"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Transações 100% seguras e dados protegidos"
    },
    {
      icon: Star,
      title: "Qualidade Premium",
      description: "Produtos selecionados e de alta qualidade"
    },
    {
      icon: Users,
      title: "Suporte 24/7",
      description: "Atendimento especializado quando você precisar"
    },
    {
      icon: Globe,
      title: "Entrega Global",
      description: "Enviamos para todo o Brasil com rapidez"
    },
    {
      icon: Rocket,
      title: "Inovação",
      description: "Sempre na vanguarda das tendências tecnológicas"
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
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Explore nossa loja digital com produtos exclusivos, tecnologia de ponta e experiência de compra revolucionária. 
            Somos pioneiros em transformar a maneira como você interage com a tecnologia.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10 group">
              <CardContent className="p-8 text-center">
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

        {/* Mission Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 p-12 text-center mb-16">
          <h2 className="text-3xl font-orbitron font-bold text-neon-purple mb-6">
            Nossa Missão
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Democratizar o acesso às tecnologias mais avançadas do planeta, criando uma ponte entre o presente e o futuro. 
            Acreditamos que a tecnologia deve ser acessível, intuitiva e transformadora para todos.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="space-y-3">
            <div className="text-4xl font-orbitron font-bold text-neon-green">1M+</div>
            <div className="text-foreground/70">Produtos Vendidos</div>
          </div>
          <div className="space-y-3">
            <div className="text-4xl font-orbitron font-bold text-neon-cyan">50K+</div>
            <div className="text-foreground/70">Clientes Satisfeitos</div>
          </div>
          <div className="space-y-3">
            <div className="text-4xl font-orbitron font-bold text-neon-purple">200K+</div>
            <div className="text-foreground/70">Comunidade Ativa</div>
          </div>
          <div className="space-y-3">
            <div className="text-4xl font-orbitron font-bold text-neon-orange">24/7</div>
            <div className="text-foreground/70">Suporte Online</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sobre;