import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function RecoverPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Simulação de envio de código
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a chamada para o backend
    setMessage('Código de recuperação enviado para seu e-mail.');
    setStep(2);
  };

  // Simulação de verificação de código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a chamada para o backend
    if (code === '123456') {
      setMessage('Código verificado! Crie uma nova senha.');
      setStep(3);
    } else {
      setMessage('Código inválido.');
    }
  };

  // Simulação de redefinição de senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a chamada para o backend
    setMessage('Senha redefinida com sucesso! Faça login.');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <Layout hideNav>
      <section className="fade-in container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 neon-text">Recuperar Senha</h2>
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-lg neon-border">
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
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
              <div className="text-center">
                <button type="submit" className="neon-button text-white font-bold py-3 px-10 rounded-full text-lg">
                  Enviar código
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-gray-300 text-sm font-bold mb-2">Código de verificação</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                  placeholder="Digite o código recebido"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button type="submit" className="neon-button text-white font-bold py-3 px-10 rounded-full text-lg">
                  Verificar código
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-gray-300 text-sm font-bold mb-2">Nova senha</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                  placeholder="Digite sua nova senha"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button type="submit" className="neon-button text-white font-bold py-3 px-10 rounded-full text-lg">
                  Redefinir senha
                </button>
              </div>
            </form>
          )}
          <div className="mt-4 text-center text-sm font-semibold text-neon-cyan">{message}</div>
          <div className="mt-6 text-center text-gray-400">
            <button
              className="text-purple-400 hover:underline"
              onClick={() => navigate('/login')}
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default RecoverPassword;