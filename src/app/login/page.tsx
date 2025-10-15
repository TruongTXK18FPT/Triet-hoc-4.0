'use client';

import Image from 'next/image';
import bg from '@/assets/backgroundLogin.jpeg';
import { signIn } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, Mail, User as UserIcon, Lock, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<'login'|'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const doLogin = () => {
    setError(null);
    startTransition(async () => {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.ok) router.push('/profile'); else setError('Email hoặc mật khẩu không đúng');
    });
  };

  const doRegister = () => {
    setError(null);
    if (password !== confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    startTransition(async () => {
      const r = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      if (!r.ok) { setError((await r.json()).error || 'Lỗi đăng ký'); return; }
      await signIn('credentials', { email, password, redirect: true, callbackUrl: '/profile' });
    });
  };

  return (
    <div className="relative min-h-screen">
      <Header/>
      <Image src={bg} alt="Vintage background" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-amber-900/30 mix-blend-multiply" />
      <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/85 backdrop-blur vintage-card shadow-2xl border-amber-200">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-extrabold text-amber-800 flex items-center justify-center gap-2">
              <Shield className="h-6 w-6"/> Cổng Đăng nhập
            </CardTitle>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant={tab==='login'?'default':'outline'} onClick={()=>setTab('login')}>Đăng nhập</Button>
              <Button variant={tab==='register'?'default':'outline'} onClick={()=>setTab('register')}>Đăng ký</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tab==='login' ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4"/><Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
                  <div className="flex items-center gap-2"><Lock className="h-4 w-4"/><Input placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button className="w-full" onClick={doLogin} disabled={isPending}>{isPending? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <LogIn className="h-4 w-4 mr-2"/>}Đăng nhập</Button>
                <Button variant="outline" className="w-full" onClick={()=>signIn('google', { callbackUrl: '/profile' })}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.9 6.1 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.9 6.1 29.7 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 34.5 26.7 35.5 24 35.5 18.8 35.5 14.5 32.4 12.7 28l-6.6 5C9.6 39.7 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.7-4.7 6.5-8.6 6.5-5.2 0-9.5-4.2-9.5-9.5S21.5 15.5 26.7 15.5c2.7 0 5.1 1.1 6.8 2.8l5.6-5.6C36.7 9.2 31.7 7 26.7 7 17.4 7 9.8 13.5 8.2 22h-2v6h2c1.6 8.5 9.1 15 18.5 15 10 0 18-8 18-18 0-1.2-.1-2.3-.4-3.5z"/></svg>
                  Đăng nhập bằng Google
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><UserIcon className="h-4 w-4"/><Input placeholder="Họ tên" value={name} onChange={e=>setName(e.target.value)} /></div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4"/><Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
                  <div className="flex items-center gap-2"><Lock className="h-4 w-4"/><Input placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
                  <div className="flex items-center gap-2"><Lock className="h-4 w-4"/><Input placeholder="Xác nhận mật khẩu" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} /></div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button className="w-full" onClick={doRegister} disabled={isPending}>{isPending? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <LogIn className="h-4 w-4 mr-2"/>}Đăng ký</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


