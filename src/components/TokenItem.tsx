import { Token } from '@/types';
import { ChevronRight } from 'lucide-react';

interface TokenItemProps {
  token: Token;
  onClick: () => void;
}

export function TokenItem({ token, onClick }: TokenItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-xl p-4 card-shadow hover:card-shadow-lg transition-all duration-200 flex items-center gap-4 text-left hover:bg-accent/30"
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        <img
          src={token.productImage}
          alt={token.productName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">
          {token.productName}
        </h3>
        <p className="text-sm text-muted-foreground">
          Toque para ver QR Code
        </p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </button>
  );
}
