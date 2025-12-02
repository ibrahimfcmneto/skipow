import { Token } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ValidationResultProps {
  type: 'success' | 'consumed' | 'notfound';
  token?: Token;
  onReset: () => void;
}

export function ValidationResult({ type, token, onReset }: ValidationResultProps) {
  if (type === 'success') {
    return (
      <div className="fixed inset-0 bg-success flex flex-col items-center justify-center p-6 z-50 animate-scale-in">
        <CheckCircle className="w-24 h-24 text-success-foreground mb-6" />
        <h1 className="text-3xl font-bold text-success-foreground text-center mb-2">
          ENTREGAR
        </h1>
        <p className="text-5xl font-bold text-success-foreground text-center mb-8">
          1x {token?.productName?.toUpperCase()}
        </p>
        <Button
          variant="outline"
          size="xl"
          onClick={onReset}
          className="bg-success-foreground/20 border-success-foreground text-success-foreground hover:bg-success-foreground/30"
        >
          PRÓXIMO
        </Button>
      </div>
    );
  }

  if (type === 'consumed') {
    return (
      <div className="fixed inset-0 bg-destructive flex flex-col items-center justify-center p-6 z-50 flash-animation">
        <XCircle className="w-24 h-24 text-destructive-foreground mb-6" />
        <h1 className="text-3xl font-bold text-destructive-foreground text-center mb-2">
          ERRO!
        </h1>
        <p className="text-2xl font-bold text-destructive-foreground text-center mb-8">
          FICHA JÁ UTILIZADA
        </p>
        <Button
          variant="outline"
          size="xl"
          onClick={onReset}
          className="bg-destructive-foreground/20 border-destructive-foreground text-destructive-foreground hover:bg-destructive-foreground/30"
        >
          VOLTAR
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-warning flex flex-col items-center justify-center p-6 z-50 animate-scale-in">
      <AlertTriangle className="w-24 h-24 text-warning-foreground mb-6" />
      <h1 className="text-3xl font-bold text-warning-foreground text-center mb-8">
        CÓDIGO NÃO EXISTE
      </h1>
      <Button
        variant="outline"
        size="xl"
        onClick={onReset}
        className="bg-warning-foreground/20 border-warning-foreground text-warning-foreground hover:bg-warning-foreground/30"
      >
        VOLTAR
      </Button>
    </div>
  );
}
