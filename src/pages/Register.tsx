import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSplitLayout from '../components/AuthSplitLayout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  // Controle de OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  
  const navigate = useNavigate();
  const { signUp, verifyOtp, signInWithOAuth, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/user-home');
    }
  }, [user, navigate]);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!termsAccepted || !privacyAccepted) {
      toast({
        title: "Termos obrigatórios",
        description: "Você deve aceitar os Termos de Uso e a Política de Privacidade para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await signUp(email, password, {
        username,
        first_name: firstName,
        last_name: lastName,
        phone,
        terms_accepted: termsAccepted,
        privacy_accepted: privacyAccepted
      });
      
      if (error) {
        toast({
          title: "Erro no registro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Código enviado!",
          description: "Verifique seu e-mail para pegar o código de 6 dígitos.",
        });
        setIsVerifyingOtp(true);
      }
    } catch (error: any) {
      toast({
        title: "Erro no registro",
        description: "Erro de conexão com o servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Código inválido",
        description: "O código deve ter 6 dígitos.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await verifyOtp(email, otp);
      if (error) {
        toast({
          title: "Erro na verificação",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta verificada!",
          description: "Seja bem-vindo(a)!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha de conexão com o servidor.",
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
    <AuthSplitLayout themeColor="success" imageAlt="Cadastro Capital Daark">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]">
          {isVerifyingOtp ? 'Verificar E-mail' : 'Junte-se a Nós'}
        </h1>
        <p className="text-muted-foreground">
          {isVerifyingOtp 
            ? 'Digite o código de 6 dígitos enviado para seu e-mail' 
            : 'Crie sua conta e comece sua jornada'}
        </p>
      </div>

      <div className="bg-card/60 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(14,165,233,0.15)] border border-emerald-400/20 animate-scale-in">
        {isVerifyingOtp ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="group">
              <label htmlFor="otp" className="text-sm font-medium text-emerald-400 block mb-2 transition-colors group-focus-within:text-emerald-300">
                Código de Verificação (OTP)
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 hover:border-emerald-400/50 text-center tracking-[0.5em] font-mono text-2xl"
                placeholder="123456"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || otp.length !== 6}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)] hover:shadow-[0_0_25px_-5px_rgba(14,165,233,0.7)] border border-emerald-400/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Verificando...' : 'Verificar e Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="group">
                <label htmlFor="email" className="text-sm font-medium text-emerald-400 block mb-2 transition-colors group-focus-within:text-emerald-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 hover:border-emerald-400/50"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label htmlFor="firstName" className="text-sm font-medium text-emerald-400 block mb-2 transition-colors group-focus-within:text-emerald-300">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 hover:border-emerald-400/50"
                    placeholder="Primeiro nome"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label htmlFor="lastName" className="text-sm font-medium text-emerald-400 block mb-2 transition-colors group-focus-within:text-emerald-300">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 hover:border-emerald-400/50"
                    placeholder="Sobrenome"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="group">
                <label htmlFor="username" className="text-sm font-medium text-emerald-400 block mb-2 transition-colors group-focus-within:text-emerald-300">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 hover:border-emerald-400/50"
                  placeholder="Como quer ser chamado?"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="group">
                <label htmlFor="phone" className="text-sm font-medium text-emerald-400 block mb-2 transition-colors group-focus-within:text-emerald-300">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 hover:border-emerald-400/50"
                  placeholder="(11) 99999-9999"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="group">
                <label htmlFor="password" className="text-sm font-medium text-emerald-400 block mb-2 transition-colors group-focus-within:text-emerald-300">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 hover:border-emerald-400/50 pr-12"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {/* Termos e Aceitação de Privacidade */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    required
                    className="border-emerald-400 data-[state=checked]:bg-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none">
                    Eu aceito os{' '}
                    <Link to="/terms" target="_blank" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                      Termos de Uso
                    </Link>
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={privacyAccepted}
                    onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                    required
                    className="border-emerald-400 data-[state=checked]:bg-emerald-500"
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none">
                    Eu aceito a{' '}
                    <Link to="/privacy" target="_blank" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !termsAccepted || !privacyAccepted}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)] hover:shadow-[0_0_25px_-5px_rgba(14,165,233,0.7)] border border-emerald-400/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
            >
              {loading ? 'Criando Conta...' : 'Criar Minha Conta'}
            </button>
          </form>
        )}

        <div className="mt-8 space-y-5">
          {!isVerifyingOtp && (
            <>
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
            </>
          )}

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="text-emerald-400 hover:text-orange-400 font-semibold transition-colors hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

export default Register;
