'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import Image from 'next/image';
import aiLogo from '@/assets/aiLogo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Loader2, X, MessageSquare } from 'lucide-react';
import { chatWithVuaTrietAI } from '@/ai/flows/vua-triet-ai-flow';

interface Message { id: string; role: 'user' | 'model' | 'system'; content: string; }

function renderMessage(raw: string) {
  // Strip markdown symbols like ###, ***, /// and format bullets/emojis
  const cleaned = raw
    .replace(/(^|\s)#{1,6}\s*/g, '$1')
    .replace(/\*\*\*|\*\*|\*|_{1,3}|`{1,3}|>{1,3}|\\{2,}/g, '')
    .replace(/\/\/{2,}/g, '')
    .trim();

  const lines = cleaned.split(/\r?\n/).filter(Boolean);
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const pushList = () => {
    if (list.length) {
      blocks.push(
        <ul className="list-none space-y-1 pl-0" key={`ul-${blocks.length}`}>
          {list.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (const ln of lines) {
    if (/^[\-\*•\u2022]/.test(ln.trim())) {
      list.push(ln.replace(/^[\-\*•\u2022]\s*/, ''));
    } else if (/^\d+[\.)]/.test(ln.trim())) {
      pushList();
      blocks.push(<p key={`p-${blocks.length}`} className="flex gap-2"><span className="font-semibold text-amber-700">{ln.match(/^\d+/)?.[0]}</span><span>{ln.replace(/^\d+[\.)]\s*/, '')}</span></p>);
    } else if (ln.trim() === '') {
      pushList();
    } else {
      pushList();
      blocks.push(<p key={`p-${blocks.length}`}>{ln}</p>);
    }
  }
  pushList();
  return <div className="space-y-2">{blocks}</div>;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
  id: 'init', role: 'model', content: 'Xin chào! Tôi là Vua Triết AI — cần hỗ trợ gì không?' }]);
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return;
    const vp = scrollRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (vp) vp.scrollTop = vp.scrollHeight;
  }, [messages, open]);

  const send = () => {
    if (!input.trim() || isPending) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const prompt = input; setInput('');
  startTransition(async () => {
      const history = messages.map(m => ({ role: m.role as 'user'|'model', content: [{ text: m.content }] }));
      history.push({ role: 'user', content: [{ text: prompt }] });
      try {
        const result = await chatWithVuaTrietAI({ history });
        setMessages(prev => [...prev, { id: Date.now().toString()+'-ai', role: 'model', content: result.response }]);
      } catch {
        setMessages(prev => [...prev, { id: Date.now().toString()+'-err', role: 'model', content: 'Xin lỗi, tôi đang bận. Vui lòng thử lại.' }]);
      }
    });
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 group h-14 w-14 rounded-2xl shadow-2xl overflow-hidden ring-2 ring-amber-300/80 hover:ring-amber-400 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-amber-50/90 to-yellow-100/90 backdrop-blur-md border border-amber-200"
        aria-label="Mở Vua Triết AI"
        onClick={() => setOpen(v=>!v)}
      >
        <span className="absolute inset-0 opacity-80" />
        <Image src={aiLogo} alt="Vua Triết AI" fill className="object-contain p-2" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] rounded-2xl border border-amber-200 bg-white/80 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-amber-50 to-yellow-50">
            <div className="flex items-center gap-2">
              <span className="relative block h-8 w-8 rounded-full overflow-hidden ring-1 ring-amber-300/70">
                <Image src={aiLogo} alt="Vua Triết AI" fill className="object-contain p-1" />
              </span>
              <span className="font-bold tracking-tight flex items-center gap-1"><MessageSquare className="h-4 w-4"/>Vua Triết AI</span>
            </div>
            <Button size="icon" variant="ghost" onClick={()=>setOpen(false)} aria-label="Đóng" className="text-amber-700">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-96 flex flex-col">
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-4 space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={m.role==='user' ? 'flex justify-end' : 'flex justify-start'}>
                    {m.role==='user' ? (
                      <div className="max-w-[80%] bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-2xl rounded-br-none p-3 text-sm shadow">
                        {renderMessage(m.content)}
                      </div>
                    ) : (
                      <div className="max-w-[80%] bg-white border rounded-2xl rounded-bl-none p-3 text-sm shadow-sm">
                        {renderMessage(m.content)}
                      </div>
                    )}
                  </div>
                ))}
                {isPending && (
                  <div className="flex justify-start items-center gap-2 text-muted-foreground px-3">
                    <Avatar className="h-6 w-6 bg-accent text-accent-foreground"><AvatarFallback><User size={14}/></AvatarFallback></Avatar>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></span>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-2">
                <Input value={input} onChange={e=>setInput(e.target.value)} placeholder="Hỏi Vua Triết AI..." onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } }} className="bg-white/80" />
                <Button size="icon" disabled={!input.trim() || isPending} onClick={send} className="bg-amber-500 hover:bg-amber-600 text-white">
                  {isPending ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


