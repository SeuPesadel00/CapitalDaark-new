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
      title: "Suporte 24hrs",
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
      description: "Sempre atualizado com as tendências tecnológicas"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Seção Hero */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-primary text-white px-4 py-2 text-sm font-medium">
            🚀 Nova versão disponível
          </Badge>
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold text-neon-cyan mb-6">
            Sobre <span className="text-neon-purple">Nós</span>
          </h1>
        </div>

        {/* Quem Somos Nós */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 p-12 text-center mb-16">
          <h2 className="text-3xl font-orbitron font-bold text-neon-purple mb-6">
            Quem Somos Nós
          </h2>
          {/* Aplicação da nova estilização aqui */}
          <p className="text-xl max-w-4xl mx-auto leading-relaxed text-neon-cyan/80 drop-shadow-lg shadow-neon-cyan/20">
            O Capital Daark nasceu da faísca de uma ideia: criar um ecossistema digital onde a paixão por tecnologia e finanças descentralizadas se encontrasse. 
            Mais que um portal, somos uma rede social moderna e segura, dedicada a ser o ponto de encontro para quem vive e respira o ciberuniverso. 
            Nossa missão é clara: colocar a comunidade no centro de tudo.
          </p>
        </div>

        {/* Nossa Missão */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 p-12 text-center mb-16">
          <h2 className="text-3xl font-orbitron font-bold text-neon-purple mb-6">
            Nossa Missão
          </h2>
          {/* Aplicação da nova estilização aqui */}
          <p className="text-xl max-w-4xl mx-auto leading-relaxed text-neon-cyan/80 drop-shadow-lg shadow-neon-cyan/20">
            Existimos para ser um farol na escuridão digital, fornecendo informação de alta voltagem sobre as últimas inovações, 
            cibersegurança e oportunidades de mercado. Através de um ambiente descentralizado, permitimos que os usuários se conectem e conversem, 
            transformando cada notícia em um fórum pulsante e cada interação em uma nova possibilidade.
          </p>
        </div>

        {/* Criador: */}
        <div className="bg-card/20 backdrop-blur-sm rounded-2xl border border-border/30 p-12 text-center mb-16">
          <h2 className="text-3xl font-orbitron font-bold text-neon-purple mb-6">
            Criador: Arthur Henrique
          </h2>
          {/* Aplicação da nova estilização aqui */}
          <p className="text-xl max-w-4xl mx-auto leading-relaxed text-neon-cyan/80 drop-shadow-lg shadow-neon-cyan/20">
            O projeto é resultado de uma jornada pessoal e profissional. Aos 27 anos, Arthur é um Analista de Sistemas experiente, com 8 anos de atuação no mercado 
            mas com a alma de um programador e a visão de um investidor. Como um entusiasta e investidor de Bitcoin , ele traduz a paixão por tecnologia em código. 
            Atualmente, Arthur segue sua busca por conhecimento em Ciência da Computação e como desenvolvedor Full-stack, impulsionando o Capital Daark a cada linha de código.
          </p>
        </div>

        {/* Grade de recursos */}
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

        {/* Seção de estatísticas */}
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
            <div className="text-4xl font-orbitron font-bold text-neon-orange">24hrs</div>
            <div className="text-foreground/70">Suporte Online</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sobre;