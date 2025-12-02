import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Minus, Plus, Loader2 } from 'lucide-react';

interface QuantityModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number) => void;
  loading?: boolean;
}

export function QuantityModal({ product, open, onClose, onConfirm, loading }: QuantityModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    if (product && quantity > 0 && !loading) {
      onConfirm(product, quantity);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  if (!product) return null;

  const total = product.price * quantity;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-secondary mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-muted-foreground mb-4">
            Preço unitário: R$ {product.price.toFixed(2).replace('.', ',')}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-5 w-5" />
            </Button>

            <span className="text-3xl font-bold w-16 text-center">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold text-primary">
              R$ {total.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'CONFIRMAR COMPRA'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
