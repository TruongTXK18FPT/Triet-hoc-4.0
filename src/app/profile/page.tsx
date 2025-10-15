'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, Save } from 'lucide-react';
import { Header } from '@/components/layout/header';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [stats, setStats] = useState<{quizzes:number; roadmaps:number; reviews:number; posts:number; comments:number}>({quizzes:0, roadmaps:0, reviews:0, posts:0, comments:0});

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      // fetch stats
      startTransition(async () => {
        const r = await fetch('/api/profile/stats');
        if (r.ok) setStats(await r.json());
      });
    }
  }, [session]);

  const onSave = () => {
    startTransition(async () => {
      await fetch('/api/profile/update', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name }) });
    });
  };

  if (status !== 'authenticated') return null;

  return (
    <div className="min-h-screen">
      <Header/>
      <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto bg-white/85 backdrop-blur vintage-card">
        <CardHeader>
          <CardTitle className="text-2xl">Hồ sơ của tôi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Input value={name} onChange={e=>setName(e.target.value)} />
            <Button onClick={onSave} disabled={isPending}>{isPending?<Loader2 className="h-4 w-4 mr-2 animate-spin"/>:<Save className="h-4 w-4 mr-2"/>}Lưu</Button>
            <Button variant="outline" onClick={()=>signOut({ callbackUrl: '/' })}><LogOut className="h-4 w-4 mr-2"/>Đăng xuất</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatBox label="Quizzes" value={stats.quizzes} />
            <StatBox label="Roadmaps" value={stats.roadmaps} />
            <StatBox label="Reviews" value={stats.reviews} />
            <StatBox label="Posts" value={stats.posts} />
            <StatBox label="Comments" value={stats.comments} />
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

function StatBox({label, value}:{label:string; value:number}){
  return (
    <div className="rounded-xl border bg-white p-4 text-center">
      <div className="text-3xl font-extrabold text-amber-700">{value}</div>
      <div className="text-sm text-foreground/70">{label}</div>
    </div>
  );
}


