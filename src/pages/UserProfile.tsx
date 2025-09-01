// frontend/src/pages/UserProfile.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/users/${username}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Usuário não encontrado.');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  if (loading) return <Layout><div className="text-center text-primary">Carregando perfil...</div></Layout>;
  if (error) return <Layout><div className="text-center text-destructive">{error}</div></Layout>;
  if (!userData) return <Layout><div className="text-center text-destructive">Usuário não encontrado.</div></Layout>;

  return (
    <Layout>
      <section className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto bg-card rounded-2xl p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-orbitron text-neon-cyan">
              Perfil de {userData.username}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <span className="font-semibold text-primary">Email:</span> {userData.email}
            </p>
            {/* Adicione mais campos aqui, como data de registro, etc. */}
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default UserProfile;