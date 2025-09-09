import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
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
          title: "Conta criada com sucesso!",
          description: "Verifique seu e-mail para confirmar a conta.",
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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

  return (
    <Layout hideNav>
      <div className="w-full max-w-md px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-secondary mb-2">
              Junte-se a Nós
            </h1>
            <p className="text-muted-foreground">Crie sua conta e comece sua jornada</p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border animate-scale-in">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="email" className="text-sm font-medium text-secondary block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-secondary/70"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label htmlFor="firstName" className="text-sm font-medium text-secondary block mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-secondary/70"
                    placeholder="Seu primeiro nome"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label htmlFor="lastName" className="text-sm font-medium text-secondary block mb-2">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-secondary/70"
                    placeholder="Seu sobrenome"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label htmlFor="username" className="text-sm font-medium text-secondary block mb-2">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-secondary/70"
                    placeholder="Como quer ser chamado?"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label htmlFor="password" className="text-sm font-medium text-secondary block mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-secondary/70"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                {/* Termos e Aceitação de Privacidade */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      Eu aceito os{' '}
                      <Link to="/terms" target="_blank" className="text-secondary hover:underline">
                        Termos de Uso
                      </Link>
                      {' '}da plataforma Capital Daark
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={privacyAccepted}
                      onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                      required
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
                      Eu aceito a{' '}
                      <Link to="/privacy" target="_blank" className="text-secondary hover:underline">
                        Política de Privacidade
                      </Link>
                      {' '}e autorizo o tratamento dos meus dados pessoais conforme a LGPD
                    </label>
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading || !termsAccepted || !privacyAccepted}
                className="w-full bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-soft border border-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando Conta...' : 'Criar Minha Conta'}
              </button>
            </form>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}

export default Register;