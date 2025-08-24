import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';
import { 
  CreditCard, 
  Truck, 
  Package, 
  Shield, 
  MapPin, 
  User, 
  Phone,
  FileText,
  Banknote,
  Smartphone,
  QrCode
} from 'lucide-react';

interface EnderecoData {
  nome: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cpf: string;
}

interface CartaoData {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
}

function Checkout() {
  const { produtos, limparCarrinho } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [metodoPagamento, setMetodoPagamento] = useState('credito');
  const [endereco, setEndereco] = useState<EnderecoData>({
    nome: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cpf: ''
  });
  const [cartao, setCartao] = useState<CartaoData>({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });

  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const frete = subtotal > 200 ? 0 : 15.90;
  const impostos = subtotal * 0.05; // 5% de impostos
  const total = subtotal + frete + impostos;

  const handleFinalizarCompra = (e: React.FormEvent) => {
    e.preventDefault();

    if (produtos.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    // Validações básicas
    if (!endereco.nome || !endereco.telefone || !endereco.cep || !endereco.endereco || !endereco.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if ((metodoPagamento === 'credito' || metodoPagamento === 'debito') && 
        (!cartao.numero || !cartao.nome || !cartao.validade || !cartao.cvv)) {
      toast({
        title: "Dados do cartão",
        description: "Preencha todos os dados do cartão.",
        variant: "destructive"
      });
      return;
    }

    // Simular processamento
    toast({
      title: "Pedido realizado!",
      description: `Seu pedido foi confirmado. Total: R$ ${total.toFixed(2)}`,
    });

    limparCarrinho();
    navigate('/');
  };

  if (produtos.length === 0) {
    navigate('/carrinho');
    return null;
  }

  return (
    <Layout>
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Finalizar Compra</h1>
        
        <form onSubmit={handleFinalizarCompra} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulários */}
          <div className="lg:col-span-2 space-y-6">
            {/* Endereço de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={endereco.nome}
                      onChange={(e) => setEndereco({...endereco, nome: e.target.value})}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={endereco.telefone}
                      onChange={(e) => setEndereco({...endereco, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={endereco.cep}
                      onChange={(e) => setEndereco({...endereco, cep: e.target.value})}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço *</Label>
                    <Input
                      id="endereco"
                      value={endereco.endereco}
                      onChange={(e) => setEndereco({...endereco, endereco: e.target.value})}
                      placeholder="Rua, avenida, etc."
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      value={endereco.numero}
                      onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
                      placeholder="123"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={endereco.complemento}
                      onChange={(e) => setEndereco({...endereco, complemento: e.target.value})}
                      placeholder="Apto, bloco, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      value={endereco.bairro}
                      onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
                      placeholder="Nome do bairro"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={endereco.cidade}
                      onChange={(e) => setEndereco({...endereco, cidade: e.target.value})}
                      placeholder="Sua cidade"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Input
                      id="estado"
                      value={endereco.estado}
                      onChange={(e) => setEndereco({...endereco, estado: e.target.value})}
                      placeholder="SP"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={endereco.cpf}
                      onChange={(e) => setEndereco({...endereco, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métodos de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={metodoPagamento} onValueChange={setMetodoPagamento} className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="credito" id="credito" />
                    <Label htmlFor="credito" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5" />
                      Cartão de Crédito
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="debito" id="debito" />
                    <Label htmlFor="debito" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5" />
                      Cartão de Débito
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                      <QrCode className="w-5 h-5" />
                      PIX - Pagamento instantâneo
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer flex-1">
                      <FileText className="w-5 h-5" />
                      Boleto Bancário
                    </Label>
                  </div>
                </RadioGroup>

                {/* Dados do Cartão */}
                {(metodoPagamento === 'credito' || metodoPagamento === 'debito') && (
                  <div className="mt-6 space-y-4 p-4 border border-border rounded-lg bg-muted/20">
                    <h4 className="font-semibold">Dados do Cartão</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="numeroCartao">Número do Cartão *</Label>
                        <Input
                          id="numeroCartao"
                          value={cartao.numero}
                          onChange={(e) => setCartao({...cartao, numero: e.target.value})}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          required={metodoPagamento === 'credito' || metodoPagamento === 'debito'}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="nomeCartao">Nome no Cartão *</Label>
                        <Input
                          id="nomeCartao"
                          value={cartao.nome}
                          onChange={(e) => setCartao({...cartao, nome: e.target.value})}
                          placeholder="Nome como está no cartão"
                          required={metodoPagamento === 'credito' || metodoPagamento === 'debito'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="validade">Validade *</Label>
                        <Input
                          id="validade"
                          value={cartao.validade}
                          onChange={(e) => setCartao({...cartao, validade: e.target.value})}
                          placeholder="MM/AA"
                          maxLength={5}
                          required={metodoPagamento === 'credito' || metodoPagamento === 'debito'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={cartao.cvv}
                          onChange={(e) => setCartao({...cartao, cvv: e.target.value})}
                          placeholder="000"
                          maxLength={4}
                          required={metodoPagamento === 'credito' || metodoPagamento === 'debito'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações PIX */}
                {metodoPagamento === 'pix' && (
                  <div className="mt-6 p-4 border border-border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">PIX - Pagamento Instantâneo</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Após confirmar o pedido, você receberá o código PIX para pagamento.
                    </p>
                  </div>
                )}

                {/* Informações Boleto */}
                {metodoPagamento === 'boleto' && (
                  <div className="mt-6 p-4 border border-border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-600">Boleto Bancário</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      O boleto será gerado após a confirmação do pedido. Prazo de vencimento: 3 dias úteis.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Produtos */}
                <div className="space-y-3">
                  {produtos.map(produto => (
                    <div key={produto.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{produto.nome}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {produto.quantidade}</p>
                      </div>
                      <p className="font-semibold text-sm">
                        R$ {(produto.preco * produto.quantidade).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Cálculos */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({produtos.length} {produtos.length === 1 ? 'item' : 'itens'})</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Frete
                    </span>
                    <span className={frete === 0 ? "text-green-600 font-medium" : ""}>
                      {frete === 0 ? "GRÁTIS" : `R$ ${frete.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Impostos e taxas</span>
                    <span>R$ {impostos.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Confirmar Pedido
                </Button>
              </CardContent>
            </Card>

            {/* Informações de Segurança */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Compra Protegida
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>🔒 Transação 100% segura</li>
                  <li>📋 Dados protegidos por SSL</li>
                  <li>🚚 Garantia de entrega</li>
                  <li>↩️ Política de devolução</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default Checkout;