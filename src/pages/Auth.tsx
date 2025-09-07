import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const title = mode === 'login' ? 'Log in' : 'Create account';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(email, password);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-6 flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-elevated border-0">
        <CardHeader>
          <h1 className="font-heading text-2xl font-semibold text-foreground text-center">{title}</h1>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Please wait…' : title}</Button>
          </form>
          <div className="text-sm text-center text-muted-foreground mt-3">
            {mode === 'login' ? (
              <button className="underline" onClick={() => setMode('signup')}>Need an account? Sign up</button>
            ) : (
              <button className="underline" onClick={() => setMode('login')}>Have an account? Log in</button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


