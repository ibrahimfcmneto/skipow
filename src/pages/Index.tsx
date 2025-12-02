import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Token } from '@/types';
import { products, generateTokens, getAvailableTokens } from '@/lib/store';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { QuantityModal } from '@/components/QuantityModal';
import { QRModal } from '@/components/QRModal';
import { TokenItem } from '@/components/TokenItem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ShoppingBag, Ticket, ScanLine } from 'lucide-react';

export default function Index() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState('loja');

  useEffect(() => {
    setTokens(getAvailableTokens());
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantityModalOpen(true);
  };

  const handleConfirmPurchase = (product: Product, quantity: number) => {
    generateTokens(product, quantity);
    setTokens(getAvailableTokens());
    setQuantityModalOpen(false);
    setSelectedProduct(null);
    setActiveTab('pedidos');
    
    toast({
      title: "Compra realizada!",
      description: `${quantity}x ${product.name} adicionado(s) à sua carteira.`,
    });
  };

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
    setQrModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="🎟️ Fichas Digitais"
        rightContent={
          <Link to="/bar">
            <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-header-foreground/10">
              <ScanLine className="h-4 w-4 mr-2" />
              Área Bar
            </Button>
          </Link>
        }
      />

      <main className="container mx-auto pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mt-4 h-14 bg-secondary">
            <TabsTrigger value="loja" className="flex items-center gap-2 text-base h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ShoppingBag className="h-5 w-5" />
              Loja
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center gap-2 text-base h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
              <Ticket className="h-5 w-5" />
              Meus Pedidos
              {tokens.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {tokens.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="loja" className="mt-6 animate-slide-up">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Escolha suas bebidas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pedidos" className="mt-6 animate-slide-up">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Fichas disponíveis
            </h2>
            {tokens.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Você ainda não possui fichas.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Compre produtos na aba Loja.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tokens.map((token) => (
                  <TokenItem
                    key={token.id}
                    token={token}
                    onClick={() => handleTokenClick(token)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <QuantityModal
        product={selectedProduct}
        open={quantityModalOpen}
        onClose={() => {
          setQuantityModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmPurchase}
      />

      <QRModal
        token={selectedToken}
        open={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedToken(null);
        }}
      />
    </div>
  );
}
