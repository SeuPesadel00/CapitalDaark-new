// frontend/src/pages/RecoverPassword.tsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <Layout hideNav>
      <div className="w-full max-w-md px-4">
          {/* Cabeçalho com animação */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-accent mb-2">
              Recuperar Acesso
            </h1>
            <p className="text-muted-foreground">
              Digite seu email para receber o link de redefinição
            </p>
          </div>

          {/* Cartao de recuperação com efeito de vidro */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border animate-scale-in">
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="group">
                <Label htmlFor="email" className="text-sm font-medium text-accent block mb-2">
                  Email cadastrado
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:border-accent transition-all duration-300 hover:border-accent/70"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-all duration-300 shadow-soft border border-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>
            </form>


            {/* Link de volta */}
            <div className="mt-8 text-center">
              <Link
                className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                to="/login"
              >
                ← Voltar para o Login
              </Link>
            </div>
          </div>
        </div>
    </Layout>
  );
}

export default RecoverPassword;