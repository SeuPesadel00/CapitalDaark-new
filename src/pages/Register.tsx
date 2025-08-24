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
        navigate('/Index');
      } else {
        setMessage(data.message || 'Erro no registro.');
      }
    } catch (error) {
      console.error('Erro na requisição de registro:', error);
      setMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <Layout>
      <section id="register" className="fade-in container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 neon-text">Crie sua Conta</h2>
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-lg neon-border">
          <form id="registerForm" onSubmit={handleRegister} className="space-y-6">
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
              <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                placeholder="Seu nome de usuário"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                Registrar
              </button>
            </div>
          </form>
          <div id="message" className="mt-4 text-center text-sm font-semibold text-red-400">
            {message}
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p>Já tem uma conta? <Link to="/login" className="text-cyan-400 hover:underline">Entrar</Link></p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Register;