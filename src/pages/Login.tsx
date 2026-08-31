import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSplitLayout from '../components/AuthSplitLayout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithOAuth, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/user-home', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
        navigate('/user-home', { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: "Erro de conexão com o servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithOAuth('google');
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro no login com Google",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthSplitLayout themeColor="primary" imageAlt="Login Capital Daark">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-2 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
          Bem-vindo de volta
        </h1>
        <p className="text-muted-foreground">Acesse sua conta para continuar</p>
      </div>

      <div className="bg-card/60 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)] border border-primary/20 animate-scale-in">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label htmlFor="email" className="text-sm font-medium text-primary block mb-2 transition-colors group-focus-within:text-orange-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 hover:border-primary/50"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="text-sm font-medium text-primary block mb-2 transition-colors group-focus-within:text-orange-400">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 hover:border-primary/50 pr-12"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-500 text-primary-foreground font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)] hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.7)] border border-primary/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-8 space-y-5">
          <div className="text-center">
            <Link 
              to="/recover-password" 
              className="text-sm text-primary/90 hover:text-primary transition-colors hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-medium">ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:border-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

export default Login;