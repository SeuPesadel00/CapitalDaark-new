import { createContext, useContext, useState, ReactNode } from 'react';

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface CartContextType {
  produtos: Produto[];
  adicionarProduto: (produto: Produto) => void;
  removerProduto: (id: number) => void;
  alterarQuantidade: (id: number, quantidade: number) => void;
  limparCarrinho: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro do CartProvider');
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  function adicionarProduto(produto: Produto) {
    setProdutos(prev => {
      const existente = prev.find(p => p.id === produto.id);
      if (existente) {
        return prev.map(p =>
          p.id === produto.id
            ? { ...p, quantidade: p.quantidade + produto.quantidade }
            : p
        );
      }
      return [...prev, produto];
    });
  }

  function removerProduto(id: number) {
    setProdutos(prev => prev.filter(p => p.id !== id));
  }

  function alterarQuantidade(id: number, quantidade: number) {
    setProdutos(prev =>
      prev.map(p => (p.id === id ? { ...p, quantidade } : p))
    );
  }

  function limparCarrinho() {
    setProdutos([]);
  }

  return (
    <CartContext.Provider
      value={{ produtos, adicionarProduto, removerProduto, alterarQuantidade, limparCarrinho }}
    >
      {children}
    </CartContext.Provider>
  );
}