import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'bar' && password === 'bar') {
      localStorage.setItem('bar_auth', 'true');
      toast({
        title: "Login realizado!",
        description: "Bem-vindo à área do bar.",
      });
      navigate('/bar');
    } else {
      toast({
        title: "Erro de login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="🔐 Login - Bar" />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-sm mx-auto">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">
              Acesso Restrito
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Digite o usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Entrar
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Credenciais de teste: bar / bar
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
