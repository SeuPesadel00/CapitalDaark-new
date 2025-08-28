// frontend/src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage('Tentando login...');

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        setTimeout(() => {
          navigate('/user-home'); 
        }, 1500); 
      } else {
        setMessage(data.message || 'Erro no login.');
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      setMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <Layout hideNav>
      <section id="login" className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md">
          {/* Header com animação */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-2">
              Bem-vindo
            </h1>
            <p className="text-muted-foreground">Acesse sua conta para continuar</p>
          </div>
          {/* Card de login com glass effect */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border animate-scale-in">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="email" className="text-sm font-medium text-primary block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-primary/70"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="group">
                  <label htmlFor="password" className="text-sm font-medium text-primary block mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-primary/70"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-soft border border-primary/30"
              >
                Entrar na Conta
              </button>
            </form>
            {message && (
              <div className={`mt-4 text-center text-sm font-medium animate-fade-in ${
                message.includes('sucesso') ? 'text-accent' : 'text-destructive'
              }`}>
                {message}
              </div>
            )}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <Link 
                  to="/recover-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <Link 
                    to="/register" 
                    className="text-secondary hover:text-secondary/80 font-medium transition-colors hover:underline"
                  >
                    Criar conta
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

export default Login;