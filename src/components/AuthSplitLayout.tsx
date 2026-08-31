import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthSplitLayoutProps {
  children: ReactNode;
  imageAlt?: string;
  themeColor?: 'primary' | 'secondary' | 'accent' | 'success';
}

const AuthSplitLayout = ({ 
  children, 
  imageAlt = 'Capital Daark Mamute',
  themeColor = 'primary'
}: AuthSplitLayoutProps) => {
  const navigate = useNavigate();

  // Mapeamento de cores de fundo para o gradiente e botões (sutil)
  const colorMap = {
    primary: 'from-orange-950/40 via-background to-background', // Laranja/Dourado
    secondary: 'from-blue-950/40 via-background to-background',  // Azul
    accent: 'from-purple-950/40 via-background to-background',   // Roxo
    success: 'from-emerald-950/40 via-background to-background', // Verde/Esmeralda
  };

  return (
    <div className={`min-h-screen flex bg-background text-foreground`}>
      {/* LADO ESQUERDO: Imagem Grande (Estilo X) - Oculto no Mobile */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center bg-black overflow-hidden border-r border-border/30">
        {/* Glow de fundo */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[themeColor]} opacity-70`}></div>
        
        {/* A imagem do mamute grande */}
        <div className="relative w-4/5 h-4/5 flex items-center justify-center animate-fade-in">
          <img 
            src="/mamute-Photoroom.png" 
            alt={imageAlt} 
            className="object-contain max-h-full max-w-full drop-shadow-2xl brightness-90 contrast-125 hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Texto ou Slogan na lateral */}
        <div className="absolute bottom-12 left-12 right-12 z-10 text-left">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2 drop-shadow-md">
            Capital Daark
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Junte-se ao ecossistema mais avançado e faça parte da nova economia.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: Conteúdo/Formulário */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 relative">
        {/* Botão voltar para Home */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        <div className="w-full max-w-md mt-12 lg:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
