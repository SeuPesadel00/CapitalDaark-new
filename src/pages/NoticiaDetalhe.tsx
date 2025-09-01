// frontend/src/pages/NoticiaDetalhe.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
// A correção está AQUI: o Comments.tsx está na mesma pasta 'pages', não em 'components'.
import Comments from './Comments'; // Caminho relativo correto

const NoticiaDetalhe = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/noticias/${id}`);
        if (!response.ok) {
          throw new Error('Notícia não encontrada.');
        }
        const data = await response.json();
        setNoticia(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticia();
  }, [id]);

  if (loading) return <Layout><div className="text-center text-primary">Carregando notícia...</div></Layout>;
  if (error) return <Layout><div className="text-center text-destructive">{error}</div></Layout>;
  if (!noticia) return <Layout><div className="text-center text-destructive">Notícia não encontrada.</div></Layout>;

  return (
    <Layout>
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-cyan mb-4">
          {noticia.titulo}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Publicado em: {new Date(noticia.createdAt).toLocaleDateString()}</p>
        <div className="prose prose-invert max-w-none text-foreground">
          <p>{noticia.conteudo}</p>
          {noticia.imagemUrl && <img src={noticia.imagemUrl} alt={noticia.titulo} className="my-8 rounded-lg" />}
        </div>
        
        <Comments postId={id} />
      </section>
    </Layout>
  );
};

export default NoticiaDetalhe;