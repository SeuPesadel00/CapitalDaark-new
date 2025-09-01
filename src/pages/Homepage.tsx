// frontend/src/pages/Homepage.tsx
import Layout from '../components/Layout';

const Homepage = () => {
  return (
    <Layout>
      <section className="text-center">
        <h1 className="text-6xl font-orbitron font-bold text-neon-cyan mb-4">
          Capital<span className="text-neon-purple">Daark</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Forjando o amanhã digital. Bem-vindo ao portal de tecnologia e inovação.
        </p>
      </section>
    </Layout>
  );
};

export default Homepage;