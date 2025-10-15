'use client';

import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateStudyRoadmap } from '@/ai/flows/generate-study-roadmap';
import type { GenerateStudyRoadmapOutput } from '@/ai/flows/generate-study-roadmap';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Wand2, Link as LinkIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const formSchema = z.object({
  knowledgeLevel: z.string({
    required_error: 'Vui lòng chọn trình độ của bạn.',
  }),
  learningGoals: z.string().min(10, {
    message: 'Mục tiêu học tập cần có ít nhất 10 ký tự.',
  }),
});

export default function RoadmapAI() {
  const [isPending, startTransition] = useTransition();
  const [roadmap, setRoadmap] = useState<GenerateStudyRoadmapOutput | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeLevel: 'beginner',
      learningGoals: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setRoadmap(null);
    setCompleted(new Set());
    startTransition(async () => {
      const result = await generateStudyRoadmap(values);
      setRoadmap(result);
    });
  }

  const handleRoadmapChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (roadmap) {
      setRoadmap({ ...roadmap, roadmap: e.target.value });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
              Lộ Trình Học Tập Bởi AI
            </h1>
            <p className="text-lg text-foreground/80 mt-4">
              Hãy để AI xây dựng lộ trình học tập Triết học Mác – Lênin được cá
              nhân hóa cho riêng bạn.
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <Wand2 className="w-6 h-6" />
                <span>Tạo Lộ Trình Của Bạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="knowledgeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trình độ hiện tại</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trình độ của bạn..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Mới bắt đầu</SelectItem>
                            <SelectItem value="intermediate">
                              Đã có kiến thức cơ bản
                            </SelectItem>
                            <SelectItem value="advanced">Nâng cao</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Hãy cho AI biết bạn đang ở đâu trên hành trình học tập.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="learningGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mục tiêu học tập</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ví dụ: 'Nắm vững các khái niệm cốt lõi để qua môn', 'Tìm hiểu sâu về phép biện chứng duy vật'..."
                            className="resize-y min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Bạn muốn đạt được điều gì sau quá trình học?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                    size="lg"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    {isPending ? 'AI đang tạo lộ trình...' : 'Tạo Lộ Trình Ngay'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {(isPending || roadmap) && (
            <div className="mt-12">
              <h2 className="font-headline text-3xl font-bold text-primary text-center mb-6">
                Lộ Trình Học Tập Của Bạn
              </h2>
              <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  {isPending && !roadmap ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                      <Loader2 className="w-12 h-12 animate-spin text-accent" />
                      <p className="text-foreground/70">
                        AI đang phân tích yêu cầu của bạn. Vui lòng đợi trong giây lát...
                      </p>
                    </div>
                  ) : (
                     roadmap && (
                      <div className="space-y-6">
                        {(() => {
                          const items = roadmap.roadmap.split('\n').filter(Boolean);
                          const parsed = items.map((line) => {
                            const [titlePart, descPart, linksPart] = line.split(' — ').map(s => s?.trim());
                            const links = (linksPart || '')
                              .split(/;|,|\|/)
                              .map(s => s.trim())
                              .filter(Boolean);
                            return { title: titlePart || line, desc: descPart || '', links };
                          });
                          return (
                            <div className="grid grid-cols-1 gap-4">
                              {parsed.map((it, idx) => (
                                <div key={idx} className={`relative p-4 rounded-xl border bg-white/70 backdrop-blur vintage-card ${completed.has(idx+1) ? 'ring-1 ring-emerald-300/60 bg-gradient-to-br from-emerald-50 to-white' : ''}`}>
                                  <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 h-6 w-6 rounded-md border flex items-center justify-center ${completed.has(idx+1) ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white'}`}>
                                      <Checkbox
                                        checked={completed.has(idx+1)}
                                        onCheckedChange={(val) => {
                                          setCompleted(prev => {
                                            const next = new Set(prev);
                                            if (val) next.add(idx+1); else next.delete(idx+1);
                                            return next;
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 text-primary flex items-center justify-center ring-1 ring-amber-500/40 shadow">
                                          <span className="font-bold">{idx+1}</span>
                                        </div>
                                        <h3 className="font-semibold">{it.title}</h3>
                                      </div>
                                      {it.desc && <p className="leading-relaxed mt-1 text-sm text-foreground/80">{it.desc}</p>}
                                      {it.links.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {it.links.map((l, i) => (
                                            <a key={i} href={/^https?:\/\//.test(l) ? l : undefined} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 underline decoration-amber-300 underline-offset-4">
                                              <LinkIcon className="h-3.5 w-3.5" />
                                              <span className="text-sm truncate max-w-[220px]">{l}</span>
                                            </a>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                        {/* Flow chart interactive */}
                        <div className="mt-6">
                          {(() => {
                            const Flow = dynamic(() => import('@/components/roadmap/RoadmapFlow').then(m => m.RoadmapFlow), { ssr: false });
                            const items = roadmap.roadmap.split('\n').filter(Boolean);
                            return (
                              <Flow
                                lines={items}
                                completedIds={completed}
                                onToggleComplete={(index) => {
                                  setCompleted(prev => {
                                    const next = new Set(prev);
                                    const id = index + 1;
                                    if (next.has(id)) next.delete(id); else next.add(id);
                                    return next;
                                  });
                                }}
                              />
                            );
                          })()}
                        </div>
                        <div className="relative p-4 rounded-xl border bg-white/60 backdrop-blur">
                          <p className="text-sm text-foreground/70">
                            Gợi ý: Bạn có thể chỉnh sửa từng mục trong danh sách trên để cá nhân hóa thêm. Sau đó lưu lại dưới dạng ghi chú.
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
