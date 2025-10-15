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
  const cleaned = raw
    .replace(/(^|\s)#{1,6}\s*/g, '$1')
    .replace(/\*\*\*|\*\*|\*|_{1,3}|`{1,3}|>{1,3}|\\{2,}/g, '')
    .trim();
  const lines = cleaned.split(/\r?\n/).filter(Boolean);
  return <div className="space-y-2 text-[15px] leading-relaxed text-gray-800">{lines.map((ln,i)=><p key={i}>{ln}</p>)}</div>;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', content: 'Xin chào! Ta là Vua Triết AI — người bạn đồng hành trên hành trình khám phá triết học và chủ nghĩa Mác–Lênin.' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const vp = scrollRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (vp) vp.scrollTop = vp.scrollHeight;
  }, [messages, open]);

  const send = () => {
    if (!input.trim() || isPending) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const prompt = input;
    setInput('');
    startTransition(async () => {
      const history = messages.map(m => ({ role: m.role as 'user'|'model', content: [{ text: m.content }] }));
      history.push({ role: 'user', content: [{ text: prompt }] });
      try {
        const result = await chatWithVuaTrietAI({ history });
        setMessages(prev => [...prev, { id: Date.now().toString()+'-ai', role: 'model', content: result.response }]);
      } catch {
        setMessages(prev => [...prev, { id: Date.now().toString()+'-err', role: 'model', content: 'Xin lỗi, ta đang bận xử lý luồng tư duy. Hãy thử lại sau một lát nhé.' }]);
      }
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v=>!v)}
        className="fixed bottom-6 right-6 z-50 group h-16 w-16 rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-200 to-rose-200
          shadow-[0_0_30px_-5px_rgba(250,204,21,0.6)] border border-amber-100
          overflow-hidden transition-all duration-500 hover:scale-110 ring-2 ring-amber-300/60
          before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,transparent,rgba(250,204,21,0.3),transparent_90deg)] before:animate-spin-slow before:opacity-60">
        <Image src={aiLogo} alt="Vua Triết AI" fill className="object-contain p-2" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[440px] rounded-3xl border border-amber-200/70 
          bg-white/70 backdrop-blur-xl shadow-[0_0_60px_-10px_rgba(250,204,21,0.4)]
          overflow-hidden animate-in slide-in-from-bottom-6 fade-in-50">
          
          {/* Header */}
          <div className="relative flex items-center justify-between p-3 border-b border-amber-100/70 
            bg-[linear-gradient(135deg,#fff8e1,#fde68a,#fce7f3)] 
            animate-[pulse_8s_ease-in-out_infinite_alternate]">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-amber-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                <Image src={aiLogo} alt="Vua Triết AI" fill className="object-contain p-1" />
              </div>
              <span className="font-bold tracking-tight text-amber-800 flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-amber-600 animate-pulse"/> Vua Triết AI
              </span>
            </div>
            <Button size="icon" variant="ghost" onClick={()=>setOpen(false)} className="text-amber-700 hover:text-rose-600">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat area */}
          <div className="h-[480px] flex flex-col bg-gradient-to-b from-white/90 to-yellow-50/40">
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-4 space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={m.role==='user' ? 'flex justify-end' : 'flex justify-start'}>
                    {m.role==='user' ? (
                      <div className="max-w-[80%] bg-gradient-to-tr from-amber-500 to-yellow-400 text-white 
                        rounded-2xl rounded-br-none p-3 text-sm shadow-lg 
                        animate-[fadeInRight_0.5s_ease]">
                        {renderMessage(m.content)}
                      </div>
                    ) : (
                      <div className="max-w-[80%] bg-white/90 border border-amber-100 rounded-2xl rounded-bl-none p-3 text-sm shadow-md 
                        animate-[fadeInLeft_0.5s_ease] backdrop-blur-sm">
                        {renderMessage(m.content)}
                      </div>
                    )}
                  </div>
                ))}
                {isPending && (
                  <div className="flex justify-start items-center gap-2 px-4 text-muted-foreground">
                    <Avatar className="h-6 w-6 bg-amber-100"><AvatarFallback><User size={14}/></AvatarFallback></Avatar>
                    <span className="h-2 w-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce"></span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="p-3 border-t border-amber-100 bg-[linear-gradient(90deg,#fff8e1,#fef3c7,#ffe4e6)]">
              <div className="flex items-center gap-2">
                <Input 
                  value={input} 
                  onChange={e=>setInput(e.target.value)} 
                  placeholder="Hỏi Vua Triết AI..." 
                  onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } }}
                  className="bg-white/80 border border-amber-200 focus:ring-amber-400 focus:border-amber-400 rounded-xl" />
                <Button size="icon" disabled={!input.trim() || isPending} 
                  onClick={send} 
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.6)]">
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
