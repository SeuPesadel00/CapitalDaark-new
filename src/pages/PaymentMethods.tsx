import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus, CreditCard } from 'lucide-react';

interface PaymentMethod {
  id: string;
  method_type: string;
  last_four: string;
  card_brand: string;
  expiry_month: number;
  expiry_year: number;
  cardholder_name: string;
  is_default: boolean;
}

function PaymentMethods() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar métodos de pagamento",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validação básica do cartão
      if (formData.cardNumber.length < 16) {
        throw new Error('Número do cartão inválido');
      }

      const lastFour = formData.cardNumber.slice(-4);
      let cardBrand = 'unknown';
      
      // Detectar bandeira do cartão
      if (formData.cardNumber.startsWith('4')) cardBrand = 'visa';
      else if (formData.cardNumber.startsWith('5')) cardBrand = 'mastercard';
      else if (formData.cardNumber.startsWith('3')) cardBrand = 'amex';

      const { error } = await supabase
        .from('user_payment_methods')
        .insert({
          user_id: user?.id,
          last_four: lastFour,
          card_brand: cardBrand,
          expiry_month: parseInt(formData.expiryMonth),
          expiry_year: parseInt(formData.expiryYear),
          cardholder_name: formData.cardholderName,
          is_default: paymentMethods.length === 0
        });

      if (error) throw error;

      toast({
        title: "Método de pagamento adicionado",
        description: "Cartão adicionado com sucesso!"
      });

      setFormData({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: ''
      });
      setShowAddForm(false);
      fetchPaymentMethods();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar cartão",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Método removido",
        description: "Cartão removido com sucesso!"
      });

      fetchPaymentMethods();
    } catch (error: any) {
      toast({
        title: "Erro ao remover cartão",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Métodos de Pagamento</CardTitle>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cartão
            </Button>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Adicionar Novo Cartão</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(formData.cardNumber)}
                        onChange={(e) => setFormData({
                          ...formData,
                          cardNumber: e.target.value.replace(/\s/g, '')
                        })}
                        maxLength={19}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Mês</Label>
                        <Input
                          id="expiryMonth"
                          type="number"
                          placeholder="12"
                          min="1"
                          max="12"
                          value={formData.expiryMonth}
                          onChange={(e) => setFormData({
                            ...formData,
                            expiryMonth: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Ano</Label>
                        <Input
                          id="expiryYear"
                          type="number"
                          placeholder="2025"
                          min={new Date().getFullYear()}
                          value={formData.expiryYear}
                          onChange={(e) => setFormData({
                            ...formData,
                            expiryYear: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => setFormData({
                          ...formData,
                          cvv: e.target.value.replace(/\D/g, '')
                        })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardholderName">Nome no Cartão</Label>
                      <Input
                        id="cardholderName"
                        type="text"
                        placeholder="João Silva"
                        value={formData.cardholderName}
                        onChange={(e) => setFormData({
                          ...formData,
                          cardholderName: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit">Adicionar Cartão</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum método de pagamento cadastrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <CreditCard className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-medium">
                              **** **** **** {method.last_four}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {method.card_brand.toUpperCase()} • {method.expiry_month}/{method.expiry_year}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {method.cardholder_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.is_default && (
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                              Padrão
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Segurança:</strong> Seus dados de pagamento são protegidos com criptografia de ponta. 
                Nunca armazenamos o número completo do cartão ou dados sensíveis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default PaymentMethods;