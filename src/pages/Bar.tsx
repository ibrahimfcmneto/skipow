import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ValidationResult } from '@/components/ValidationResult';
import { validateToken } from '@/lib/store';
import { Token } from '@/types';
import { Camera, Home, Search, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ValidationState = {
  type: 'success' | 'consumed' | 'notfound';
  token?: Token;
} | null;

export default function Bar() {
  const [codeInput, setCodeInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationState>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      toast({
        title: "Câmera ativa",
        description: "Cole o código abaixo para simular a leitura.",
      });
    } catch (err) {
      setCameraError('Não foi possível acessar a câmera. Use o campo de texto para validar.');
      toast({
        title: "Câmera indisponível",
        description: "Use o campo de texto para colar o código.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

const handleValidate = async () => {
    const code = codeInput.trim();
    if (!code) {
      toast({
        title: "Código vazio",
        description: "Digite ou cole um código para validar.",
        variant: "destructive",
      });
      return;
    }

    // Chamada Assíncrona ao Banco
    const result = await validateToken(code);

    if (result.success) {
      setValidationResult({ type: 'success', token: result.token });
    } else if (result.error === 'CONSUMED') {
      setValidationResult({ type: 'consumed', token: result.token });
    } else {
      setValidationResult({ type: 'notfound' });
    }

    setCodeInput('');
    stopCamera();
  };

  const handleReset = () => {
    setValidationResult(null);
    setCodeInput('');
  };

  if (validationResult) {
    return (
      <ValidationResult
        type={validationResult.type}
        token={validationResult.token}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="📷 Validador - Bar"
        rightContent={
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-header-foreground/10">
              <Home className="h-4 w-4 mr-2" />
              Cliente
            </Button>
          </Link>
        }
      />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">
              Escanear Ficha
            </h2>

            {cameraActive && (
              <div className="relative mb-6 rounded-xl overflow-hidden bg-secondary aspect-square">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={stopCamera}
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-4 border-primary rounded-xl opacity-50"></div>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg text-warning-foreground text-sm">
                {cameraError}
              </div>
            )}

            {!cameraActive && (
              <Button
                size="lg"
                className="w-full mb-6"
                onClick={startCamera}
              >
                <Camera className="h-5 w-5 mr-2" />
                Abrir Câmera
              </Button>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Ou cole o código manualmente:
                </label>
                <Input
                  placeholder="Cole o código UUID aqui..."
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="h-12 font-mono text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleValidate();
                    }
                  }}
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleValidate}
                disabled={!codeInput.trim()}
              >
                <Search className="h-5 w-5 mr-2" />
                Validar Código
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Aponte a câmera para o QR Code do cliente ou cole o código no campo acima.
          </p>
        </div>
      </main>
    </div>
  );
}
