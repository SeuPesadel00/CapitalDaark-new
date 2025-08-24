import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    // Se quiser validar o token com backend, descomente abaixo:
    /*
    const validateToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/protected`, {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          navigate('/login');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
      }
    };

    validateToken();
    */
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;