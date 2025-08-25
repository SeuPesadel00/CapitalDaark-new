import Layout from '../components/Layout';

function Contatos() {
  return (
    <Layout>
      <section className="fade-in container mx-auto px-4 py-12 md:py-24">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-cyan mb-4 text-center">
          <span className="text-neon-purple">Contatos</span>
        </h1>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg neon-border">
          <form className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-gray-300 text-sm font-bold mb-2">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                placeholder="Seu nome"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>
            <div>
              <label htmlFor="mensagem" className="block text-gray-300 text-sm font-bold mb-2">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan placeholder:text-neon-cyan/60 border border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
                placeholder="Digite sua mensagem"
                required
              />
            </div>
            <div className="text-center">
              <button type="submit" className="neon-button text-white font-bold py-3 px-10 rounded-full text-lg">
                Enviar
              </button>
            </div>
          </form>
          <div className="mt-8 text-center text-gray-400">
            <p>E-mail: contato@capitaldaark.com</p>
            <p>Telefone: (11) 99999-9999</p>
            <p>Endereço: Rua Exemplo, 123 - São Paulo, SP</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Contatos;