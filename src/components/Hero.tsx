import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/20 border border-neon-cyan/30 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-neon-cyan mr-2" />
            <span className="text-sm font-medium text-neon-cyan">Nova versão disponível</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 leading-tight">
            <span className="text-neon-cyan">Capital</span>
            <span className="text-neon-purple">Dark</span>
            <br />
            <span className="text-2xl md:text-4xl font-inter font-light text-foreground/80">
              O futuro é agora
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Explore nossa loja digital com produtos exclusivos, tecnologia de ponta e 
            experiência de compra revolucionária.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:bg-gradient-secondary text-lg px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              onClick={() => navigate('/loja')}
            >
              Explorar Loja
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 text-lg px-8 py-6 rounded-xl font-semibold"
              onClick={() => navigate('/sobre')}
            >
              Saiba Mais
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-card/20 border border-border/10 backdrop-blur-sm hover:bg-card/30 transition-all duration-300">
              <Shield className="w-8 h-8 text-neon-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neon-green mb-2">Segurança Total</h3>
              <p className="text-foreground/60">Compre com confiança e proteção de dados</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/20 border border-border/10 backdrop-blur-sm hover:bg-card/30 transition-all duration-300">
              <Zap className="w-8 h-8 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neon-cyan mb-2">Entrega Rápida</h3>
              <p className="text-foreground/60">Receba seus produtos em tempo recorde</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/20 border border-border/10 backdrop-blur-sm hover:bg-card/30 transition-all duration-300">
              <Star className="w-8 h-8 text-neon-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neon-purple mb-2">Qualidade Premium</h3>
              <p className="text-foreground/60">Produtos selecionados e de alta qualidade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neon-cyan/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neon-cyan rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;