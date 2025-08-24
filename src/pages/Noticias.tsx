import Layout from '../components/Layout';

function Noticias() {
  return (
    <Layout>
      <section className="fade-in container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 neon-text">Notícias</h2>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg neon-border">
          <div className="space-y-8">
            {/* Exemplo de notícia */}
            <article className="border-b border-border/20 pb-6">
              <h3 className="text-xl font-bold text-neon-cyan mb-2">Título da Notícia 1</h3>
              <p className="text-gray-300">Conteúdo da notícia 1. Aqui você pode adicionar as últimas novidades do site ou empresa.</p>
              <span className="text-xs text-gray-400">24/08/2025</span>
            </article>
            <article className="border-b border-border/20 pb-6">
              <h3 className="text-xl font-bold text-neon-cyan mb-2">Título da Notícia 2</h3>
              <p className="text-gray-300">Conteúdo da notícia 2. Atualizações, promoções ou eventos podem ser divulgados aqui.</p>
              <span className="text-xs text-gray-400">23/08/2025</span>
            </article>
            {/* Adicione mais notícias conforme necessário */}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Noticias;