import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthSplitLayout from '../components/AuthSplitLayout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/user-home');
    }
  }, [user, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Erro na recuperação",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "E-mail enviado!",
          description: "Verifique sua caixa de entrada para redefinir a senha.",
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      toast({
        title: "Erro na recuperação",
        description: "Erro de conexão com o servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout themeColor="accent" imageAlt="Recuperar Senha Capital Daark">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-fuchsia-500 mb-2 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          Recuperar Acesso
        </h1>
        <p className="text-muted-foreground">
          Digite seu email para receber o link de redefinição
        </p>
      </div>

      <div className="bg-card/60 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(217,70,239,0.15)] border border-fuchsia-500/20 animate-scale-in">
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="group">
            <label htmlFor="email" className="text-sm font-medium text-fuchsia-500 block mb-2 transition-colors group-focus-within:text-fuchsia-400">
              Email cadastrado
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 rounded-xl bg-background/80 border border-input text-foreground placeholder:text-muted-foreground focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all duration-300 hover:border-fuchsia-500/50"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_-5px_rgba(217,70,239,0.7)] border border-fuchsia-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="mt-8 text-center pt-2">
          <Link
            className="text-sm text-muted-foreground hover:text-fuchsia-400 font-semibold transition-colors hover:underline"
            to="/login"
          >
            ← Voltar para o Login
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

export default RecoverPassword;