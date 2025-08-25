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
      <section className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md">
          {/* Header com animação */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-accent mb-2">
              Recuperar Acesso
            </h1>
            <p className="text-muted-foreground">
              {step === 1 && "Digite seu email para receber o código"}
              {step === 2 && "Verifique seu email e digite o código"}
              {step === 3 && "Crie uma nova senha segura"}
            </p>
          </div>

          {/* Card de recuperação com glass effect */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border animate-scale-in">
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="group">
                  <label htmlFor="email" className="text-sm font-medium text-accent block mb-2">
                    Email cadastrado
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-accent/70"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-all duration-300 shadow-soft border border-accent/30"
                >
                  Enviar Código de Verificação
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="group">
                  <label htmlFor="code" className="text-sm font-medium text-accent block mb-2">
                    Código de verificação
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-accent/70 text-center text-lg tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Código de 6 dígitos enviado para {email}
                  </p>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-all duration-300 shadow-soft border border-accent/30"
                >
                  Verificar Código
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="group">
                  <label htmlFor="newPassword" className="text-sm font-medium text-accent block mb-2">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring/20 transition-all duration-300 hover:border-accent/70"
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Escolha uma senha forte com pelo menos 8 caracteres
                  </p>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-all duration-300 shadow-soft border border-accent/30"
                >
                  Confirmar Nova Senha
                </button>
              </form>
            )}

            {message && (
              <div className={`mt-4 text-center text-sm font-medium animate-fade-in ${
                message.includes('sucesso') || message.includes('enviado') || message.includes('verificado') ? 'text-accent' : 'text-destructive'
              }`}>
                {message}
              </div>
            )}

            {/* Progresso visual */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Progresso</span>
                <span className="text-xs text-muted-foreground">{step}/3</span>
              </div>
              <div className="w-full bg-background/30 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Link de volta */}
            <div className="mt-8 text-center">
              <button
                className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                onClick={() => navigate('/login')}
              >
                ← Voltar para o Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default RecoverPassword;