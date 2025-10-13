'use client';

import { useState, useTransition } from 'react';
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
import { Loader2, Wand2 } from 'lucide-react';

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeLevel: 'beginner',
      learningGoals: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setRoadmap(null);
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
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              AI Study Roadmap
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
                      <Textarea
                        value={roadmap.roadmap}
                        onChange={handleRoadmapChange}
                        className="w-full min-h-[300px] text-base leading-relaxed bg-background/50"
                        placeholder="Lộ trình của bạn sẽ xuất hiện ở đây..."
                      />
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
