import { useState } from 'react';
import Layout from '../components/Layout';

const produtosExemplo = [
  { id: 1, nome: 'Produto 1', preco: 99.90, quantidade: 1 },
  { id: 2, nome: 'Produto 2', preco: 59.90, quantidade: 2 },
];

function Carrinho() {
  const [produtos, setProdutos] = useState(produtosExemplo);
  const [pagamento, setPagamento] = useState('credito');
  const [cartao, setCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
  });

  const total = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  const handleRemover = (id: number) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const handleAlterarQuantidade = (id: number, quantidade: number) => {
    setProdutos(produtos.map(p => p.id === id ? { ...p, quantidade } : p));
  };

  const handleFinalizarCompra = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Compra finalizada!');
  };

  return (
    <Layout>
      <section className="fade-in container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 neon-text">Carrinho de Compras</h2>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg neon-border">
          <h3 className="text-xl font-bold text-neon-cyan mb-6">Produtos no Carrinho</h3>
          <ul className="mb-8">
            {produtos.length === 0 ? (
              <li className="text-gray-400">Seu carrinho está vazio.</li>
            ) : (
              produtos.map(produto => (
                <li key={produto.id} className="flex items-center justify-between py-2 border-b border-border/20">
                  <span className="text-gray-300">{produto.nome}</span>
                  <span className="text-gray-300">R$ {produto.preco.toFixed(2)}</span>
                  <input
                    type="number"
                    min={1}
                    value={produto.quantidade}
                    onChange={e => handleAlterarQuantidade(produto.id, Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded bg-card/80 text-neon-cyan border border-neon-cyan mx-2"
                  />
                  <button
                    className="text-red-400 hover:underline"
                    onClick={() => handleRemover(produto.id)}
                  >
                    Remover
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="mb-8 text-right text-lg text-neon-cyan font-bold">
            Total: R$ {total.toFixed(2)}
          </div>
          <form onSubmit={handleFinalizarCompra} className="space-y-6">
            <h3 className="text-xl font-bold text-neon-cyan mb-4">Pagamento</h3>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">Forma de pagamento</label>
              <select
                value={pagamento}
                onChange={e => setPagamento(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan border border-neon-cyan"
              >
                <option value="credito">Cartão de Crédito</option>
                <option value="debito">Cartão de Débito</option>
                <option value="pix">Pix</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>
            {(pagamento === 'credito' || pagamento === 'debito') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Número do cartão</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={cartao.numero}
                    onChange={e => setCartao({ ...cartao, numero: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan border border-neon-cyan"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Nome no cartão</label>
                  <input
                    type="text"
                    value={cartao.nome}
                    onChange={e => setCartao({ ...cartao, nome: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan border border-neon-cyan"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-gray-300 text-sm font-bold mb-2">Validade</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cartao.validade}
                      onChange={e => setCartao({ ...cartao, validade: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan border border-neon-cyan"
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-300 text-sm font-bold mb-2">CVV</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cartao.cvv}
                      onChange={e => setCartao({ ...cartao, cvv: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-card/80 text-neon-cyan border border-neon-cyan"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {pagamento === 'pix' && (
              <div className="text-gray-300">
                Chave Pix: <span className="text-neon-cyan">pix@capitaldaark.com</span>
              </div>
            )}
            {pagamento === 'boleto' && (
              <div className="text-gray-300">
                O boleto será gerado após finalizar a compra.
              </div>
            )}
            <div className="text-center">
              <button type="submit" className="neon-button text-white font-bold py-3 px-10 rounded-full text-lg">
                Finalizar Compra
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}

export default Carrinho;