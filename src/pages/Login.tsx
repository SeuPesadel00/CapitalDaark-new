import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const TEST_USER = {
  email: 'teste@email.com',
  password: '123456'
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === TEST_USER.email && password === TEST_USER.password) {
      setMessage('Login realizado com sucesso!');
      localStorage.setItem('token', 'fake-token');
      navigate('/'); // Redireciona para uma página protegida
    } else {
      setMessage('Usuário ou senha inválidos.');
    }
  };

  return (
    <Layout hideNav>
      <section id="login" className="fade-in container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 neon-text">Acesso ao Sistema</h2>
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-lg neon-border">
          <form id="loginForm" onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                placeholder="seu.email@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                placeholder="Sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="neon-button text-white font-bold py-3 px-10 rounded-full text-lg">
                Entrar
              </button>
            </div>
          </form>
          <div id="message" className="mt-4 text-center text-sm font-semibold text-red-400">
            {message}
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p className="mb-2">
              Esqueceu sua senha?{' '}
              <Link to="/recover-password" className="text-cyan-400 hover:underline">
                Recuperar
              </Link>
            </p>
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" className="text-purple-400 hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Login;