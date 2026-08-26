import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';

const AdminAfiliados = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    category: 'electronics',
    image: '',
    rating: 5.0,
    reviews: 150,
    featured: false,
    price_amazon: '',
    link_amazon: '',
    price_shopee: '',
    link_shopee: '',
    price_meli: '',
    link_meli: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        category: formData.category,
        image: formData.image,
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        featured: formData.featured,
        price_amazon: formData.price_amazon ? Number(formData.price_amazon.replace(',', '.')) : null,
        link_amazon: formData.link_amazon || null,
        price_shopee: formData.price_shopee ? Number(formData.price_shopee.replace(',', '.')) : null,
        link_shopee: formData.link_shopee || null,
        price_meli: formData.price_meli ? Number(formData.price_meli.replace(',', '.')) : null,
        link_meli: formData.link_meli || null
      };

      const { error } = await supabase.from('affiliate_products').insert(payload);
      
      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto de afiliado inserido no banco de dados com sucesso.",
      });

      // Reset form
      setFormData({
        nome: '',
        category: 'electronics',
        image: '',
        rating: 5.0,
        reviews: 150,
        featured: false,
        price_amazon: '',
        link_amazon: '',
        price_shopee: '',
        link_shopee: '',
        price_meli: '',
        link_meli: ''
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao inserir",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-orbitron font-bold text-neon-purple mb-8">
          Painel de Administração (Afiliados)
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border shadow-lg space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-xl text-neon-cyan border-b border-border/50 pb-2">Detalhes do Produto</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input required id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Smartphone XYZ" />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData(p => ({ ...p, category: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Eletrônicos</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="wearables">Wearables</SelectItem>
                    <SelectItem value="computers">Computadores/Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem *</Label>
              <Input required id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://amazon.com/.../img.jpg" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
               <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
                <div className="space-y-0.5">
                  <Label>Destacar no Feed?</Label>
                  <p className="text-sm text-muted-foreground">Isso fará o produto aparecer como Oferta na Home (UserHome).</p>
                </div>
                <Switch 
                  checked={formData.featured}
                  onCheckedChange={(c) => setFormData(p => ({ ...p, featured: c }))} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-orange-500 border-b border-border/50 pb-2">Amazon</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_amazon">Preço Atual (Apenas números/pontos)</Label>
                <Input id="price_amazon" name="price_amazon" type="number" step="0.01" value={formData.price_amazon} onChange={handleChange} placeholder="Ex: 199.90" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="link_amazon">Seu Link de Afiliado Amazon</Label>
                <Input id="link_amazon" name="link_amazon" value={formData.link_amazon} onChange={handleChange} placeholder="https://amzn.to/..." />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-red-500 border-b border-border/50 pb-2">Shopee</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_shopee">Preço Atual</Label>
                <Input id="price_shopee" name="price_shopee" type="number" step="0.01" value={formData.price_shopee} onChange={handleChange} placeholder="Ex: 185.00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="link_shopee">Seu Link de Afiliado Shopee</Label>
                <Input id="link_shopee" name="link_shopee" value={formData.link_shopee} onChange={handleChange} placeholder="https://shope.ee/..." />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-yellow-500 border-b border-border/50 pb-2">Mercado Livre</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_meli">Preço Atual</Label>
                <Input id="price_meli" name="price_meli" type="number" step="0.01" value={formData.price_meli} onChange={handleChange} placeholder="Ex: 210.00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="link_meli">Seu Link de Afiliado Mercado Livre</Label>
                <Input id="link_meli" name="link_meli" value={formData.link_meli} onChange={handleChange} placeholder="https://mercadolivre.com.br/..." />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-lg py-6">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Publicar Oferta no Sistema"}
          </Button>

        </form>
      </main>
    </div>
  );
};

export default AdminAfiliados;
