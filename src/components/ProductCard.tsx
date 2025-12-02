import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-xl p-4 card-shadow hover:card-shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left w-full"
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-foreground text-base mb-1">
        {product.name}
      </h3>
      <p className="text-primary font-bold text-lg">
        R$ {product.price.toFixed(2).replace('.', ',')}
      </p>
    </button>
  );
}
