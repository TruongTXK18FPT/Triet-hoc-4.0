'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chatWithVuaTrietAI } from '@/ai/flows/vua-triet-ai-flow';
import type { MessageData } from 'genkit/experimental/ai';
import Image from 'next/image';
import aiLogo from '@/assets/aiLogo.png';

interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      content:
        'Xin chào! Tôi là Vua Triết AI. Tôi có thể giúp gì cho bạn trong hành trình khám phá kinh tế, triết học và chủ nghĩa Mác-Lênin?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    startTransition(async () => {
        const history: MessageData[] = messages.map(m => ({
            role: m.role as 'user' | 'model',
            content: [{text: m.content}]
        }));
        history.push({ role: 'user', content: [{ text: input }] });

      try {
        const result = await chatWithVuaTrietAI({ history });
        const aiMessage: Message = {
          id: Date.now().toString() + '-ai',
          role: 'model',
          content: result.response,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error calling AI:', error);
        const errorMessage: Message = {
            id: Date.now().toString() + '-error',
            role: 'model',
            content: 'Rất tiếc, tôi đang gặp sự cố. Vui lòng thử lại sau.'
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 md:py-20 bg-background/50">
        <Card className="w-full max-w-3xl h-[80vh] min-h-[600px] flex flex-col bg-card/80 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden">
          <header className="flex items-center p-4 border-b bg-primary/5">
            <Avatar className="h-12 w-12 mr-4 border-2 border-accent">
              <Image src={aiLogo} alt="Vua Triết AI Logo" width={48} height={48} className="object-contain" />
            </Avatar>
            <div>
              <h1 className="font-headline text-2xl font-bold text-primary">Vua Triết AI</h1>
              <p className="text-sm text-green-600 flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                </span>
                Online
              </p>
            </div>
          </header>
          <CardContent className="flex-1 p-0 overflow-hidden">
             <ScrollArea className="h-full" ref={scrollAreaRef}>
                 <div className="p-6 space-y-6">
                    {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                        'flex items-start gap-4 animate-in fade-in zoom-in-95',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.role === 'model' && (
                        <Avatar className="h-8 w-8 bg-accent text-accent-foreground flex-shrink-0">
                          <Image src={aiLogo} alt="Vua Triết AI Logo" width={24} height={24} className="object-contain p-1" />
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            'max-w-[75%] p-3 rounded-2xl',
                            message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                        )}
                        >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                        <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground flex-shrink-0">
                            <AvatarFallback><User size={20}/></AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isPending && (
                        <div className="flex items-start gap-4 justify-start animate-in fade-in">
                            <Avatar className="h-8 w-8 bg-accent text-accent-foreground flex-shrink-0">
                                <Image src={aiLogo} alt="Vua Triết AI Logo" width={24} height={24} className="object-contain p-1" />
                            </Avatar>
                            <div className="max-w-[75%] p-3 rounded-2xl bg-muted rounded-bl-none flex items-center gap-2">
                               <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                               <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                               <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>
             </ScrollArea>
          </CardContent>
          <footer className="p-4 border-t bg-primary/5">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi Vua Triết AI một câu..."
                className="flex-1 text-base"
                disabled={isPending}
                autoFocus
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <Send />}
                <span className="sr-only">Gửi</span>
              </Button>
            </form>
             <p className="text-xs text-center text-muted-foreground mt-2">
                Vua Triết AI có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.
            </p>
          </footer>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
