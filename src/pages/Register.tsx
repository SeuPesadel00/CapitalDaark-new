import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage('Registrando...');

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Redireciona para a página de login após o registro
        setTimeout(() => {
            navigate('/login');
        }, 1500);
      } else {
        setMessage(data.message || 'Erro no registro.');
      }
    } catch (error) {
      console.error('Erro na requisição de registro:', error);
      setMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <Layout hideNav>
      <section className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md">
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
              </div>
              <button 
                type="submit" 
                className="w-full bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-soft border border-secondary/30"
              >
                Criar Minha Conta
              </button>
            </form>
            {message && (
              <div className={`mt-4 text-center text-sm font-medium animate-fade-in ${
                message.includes('sucesso') || message.includes('Registrando') ? 'text-accent' : 'text-destructive'
              }`}>
                {message}
              </div>
            )}
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
      </section>
    </Layout>
  );
}

export default Register;