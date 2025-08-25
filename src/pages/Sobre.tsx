import Layout from '../components/Layout';

function Sobre() {
  return (
    <Layout>
      <section className="fade-in container mx-auto px-4 py-12 md:py-24">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-cyan mb-4 text-center">
          Sobre <span className="text-neon-purple">Nós</span>
        </h1>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg neon-border">
          <p className="text-gray-300 mb-6">
            Somos a Capital Daark, referência em tecnologia e inovação. Nosso objetivo é oferecer os melhores produtos e serviços para nossos clientes, com segurança, qualidade e atendimento personalizado.
          </p>
          <p className="text-gray-300 mb-6">
            Nossa equipe é formada por profissionais apaixonados por tecnologia, sempre buscando as melhores soluções para você.
          </p>
          <p className="text-gray-300">
            Entre em contato conosco para saber mais sobre nossos projetos e como podemos ajudar você a alcançar seus objetivos!
          </p>
        </div>
      </section>
    </Layout>
  );
}

export default Sobre;