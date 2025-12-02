import { Token } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface QRModalProps {
  token: Token | null;
  open: boolean;
  onClose: () => void;
}

export function QRModal({ token, open, onClose }: QRModalProps) {
  if (!token) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {token.productName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="bg-background p-4 rounded-xl border-2 border-border mb-4">
            <QRCodeSVG
              value={token.id}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>

          <p className="text-xs text-muted-foreground font-mono break-all text-center px-4">
            {token.id}
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Apresente este QR Code no bar
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
