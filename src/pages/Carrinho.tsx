import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Package, Truck } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

function Carrinho() {
  const { produtos, removerProduto, alterarQuantidade, limparCarrinho } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const frete = subtotal > 200 ? 0 : 15.90;
  const total = subtotal + frete;

  const handleAlterarQuantidade = (id: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerProduto(id);
      toast({
        title: "Produto removido",
        description: "Item removido do carrinho com sucesso.",
      });
    } else {
      alterarQuantidade(id, novaQuantidade);
    }
  };

  const handleRemoverProduto = (id: number) => {
    removerProduto(id);
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho com sucesso.",
    });
  };

  const handleContinuarCompra = () => {
    if (produtos.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de continuar.",
        variant: "destructive"
      });
      return;
    }
    navigate('/checkout');
  };

  if (produtos.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-neon-cyan">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-8 text-xl">Adicione produtos incríveis do nosso catálogo!</p>
            <Button 
              onClick={() => navigate('/loja')} 
              className="bg-gradient-primary hover:bg-gradient-secondary text-white px-12 py-4 text-xl font-medium shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300"
            >
              Explorar Loja
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center text-neon-cyan">
          Carrinho de Compras ({produtos.length})
        </h1>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2 space-y-4 min-w-0">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 shadow-lg hover:shadow-neon-cyan/10">
              <div className="p-6 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Produtos ({produtos.length})
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={limparCarrinho}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Limpar carrinho
                  </Button>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {produtos.map(produto => (
                  <div key={produto.id} className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="font-medium text-foreground truncate text-sm md:text-base">{produto.nome}</h3>
                      <p className="text-lg md:text-2xl font-bold text-primary mt-1">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAlterarQuantidade(produto.id, produto.quantidade - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-2 md:px-3 py-1 min-w-[2.5rem] md:min-w-[3rem] text-center text-foreground text-sm md:text-base">
                            {produto.quantidade}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAlterarQuantidade(produto.id, produto.quantidade + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoverProduto(produto.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-left sm:text-right w-full sm:min-w-[100px]">
                        <p className="text-base md:text-lg font-bold text-foreground">
                          R$ {(produto.preco * produto.quantidade).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-4 lg:space-y-6">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 shadow-lg hover:shadow-neon-purple/10">
              <div className="p-6 border-b border-border/30">
                <h2 className="text-xl font-semibold text-foreground">Resumo do Pedido</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({produtos.length} {produtos.length === 1 ? 'item' : 'itens'})</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Frete
                  </span>
                  <span className={frete === 0 ? "text-green-600 font-medium" : ""}>
                    {frete === 0 ? "GRÁTIS" : `R$ ${frete.toFixed(2)}`}
                  </span>
                </div>
                
                {subtotal < 200 && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    💡 Frete grátis em compras acima de R$ 200,00
                  </div>
                )}
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleContinuarCompra}
                  className="w-full bg-gradient-primary hover:bg-gradient-secondary text-white py-3 text-lg font-medium shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Finalizar Compra
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/loja')}
                  className="w-full"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
            
            {/* Informações de Segurança */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/30 shadow-lg p-6">
              <h3 className="font-semibold text-foreground mb-3">🔒 Compra Segura</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Pagamentos 100% seguros</li>
                <li>✓ Dados criptografados</li>
                <li>✓ Garantia de entrega</li>
                <li>✓ Suporte 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Carrinho;