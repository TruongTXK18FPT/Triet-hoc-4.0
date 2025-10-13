'use client';

import { useState, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { useToast } from '@/hooks/use-toast';


const optionSchema = z.object({
  text: z.string().min(1, 'Lựa chọn không được để trống.'),
});

const questionSchema = z.object({
  text: z.string().min(10, 'Câu hỏi cần có ít nhất 10 ký tự.'),
  options: z.array(optionSchema).min(2, 'Cần có ít nhất 2 lựa chọn.').max(6, 'Tối đa 6 lựa chọn.'),
  correctOption: z.string({ required_error: 'Vui lòng chọn đáp án đúng.' }),
});

const quizFormSchema = z.object({
  title: z.string().min(5, 'Tiêu đề cần có ít nhất 5 ký tự.'),
  description: z.string().min(10, 'Mô tả cần có ít nhất 10 ký tự.'),
  topicForAI: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'Quiz cần có ít nhất 1 câu hỏi.'),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export default function CreateQuizPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      topicForAI: '',
      questions: [
        { text: '', options: [{ text: '' }, { text: '' }], correctOption: '0' },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  function onSubmit(values: QuizFormValues) {
    console.log(values);
    toast({
        title: "Thành công!",
        description: `Quiz "${values.title}" đã được tạo. (Kiểm tra console để xem dữ liệu)`,
    })
  }

  const handleAIGenerate = () => {
    const topic = form.getValues('topicForAI');
    if (!topic || topic.length < 5) {
        form.setError('topicForAI', { message: 'Chủ đề cần có ít nhất 5 ký tự.' });
        return;
    }
    form.clearErrors('topicForAI');

    startTransition(async () => {
        try {
            const result = await generateQuizQuestions({ topic });
            if (result && result.questions) {
                // Clear existing questions
                remove();
                
                // Add new questions from AI
                result.questions.forEach((q) => {
                    append({
                        text: q.questionText,
                        options: q.options.map(opt => ({ text: opt })),
                        correctOption: q.correctOptionIndex.toString(),
                    });
                });
                toast({
                    title: "AI đã tạo xong!",
                    description: `Đã thêm ${result.questions.length} câu hỏi về chủ đề "${topic}".`,
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Ôi, có lỗi!",
                description: "AI không thể tạo câu hỏi lúc này. Vui lòng thử lại.",
            });
            console.error(error);
        }
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Tạo Quiz Mới
            </h1>
            <p className="text-lg text-foreground/80 mt-4">
              Chia sẻ kiến thức của bạn bằng cách tạo ra các bài quiz thú vị.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">Thông Tin Chung</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tiêu đề Quiz</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ví dụ: Các quy luật cơ bản của phép biện chứng..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Mô tả ngắn</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Mô tả về nội dung chính của bài quiz..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                            <Wand2 className="w-6 h-6"/>
                            <span>Tạo nhanh bằng AI</span>
                        </CardTitle>
                         <CardDescription>Nhập một chủ đề, AI sẽ tự động tạo ra các câu hỏi liên quan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="topicForAI"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Chủ đề</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ví dụ: 'Sự khác biệt giữa vật chất và ý thức'..." {...field} />
                                </FormControl>
                                 <FormDescription>AI sẽ tạo ra 5 câu hỏi trắc nghiệm dựa trên chủ đề này.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" onClick={handleAIGenerate} disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            {isPending ? 'AI đang tạo...' : 'Tạo câu hỏi bằng AI'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">Các Câu Hỏi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {fields.map((question, qIndex) => (
                        <div key={question.id} className="p-4 border rounded-lg bg-background/50 relative">
                            <h4 className="font-semibold text-lg mb-4">Câu hỏi {qIndex + 1}</h4>
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                onClick={() => remove(qIndex)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                             <FormField
                                control={form.control}
                                name={`questions.${qIndex}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nội dung câu hỏi</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <div className="mt-4">
                                <Label>Các lựa chọn & Đáp án đúng</Label>
                                <FormDescription className="mb-2">Chọn một đáp án đúng.</FormDescription>
                                <FormField
                                    control={form.control}
                                    name={`questions.${qIndex}.correctOption`}
                                    render={({ field }) => (
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2 space-y-2">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-2">
                                                    <RadioGroupItem value={oIndex.toString()} id={`${question.id}-opt-${oIndex}`}/>
                                                    <FormField
                                                        control={form.control}
                                                        name={`questions.${qIndex}.options.${oIndex}.text`}
                                                        render={({ field: optionField }) => (
                                                            <Input {...optionField} className="flex-1" />
                                                        )}
                                                    />
                                                     <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => {
                                                        const newOptions = question.options.filter((_, i) => i !== oIndex);
                                                        update(qIndex, {...question, options: newOptions});
                                                     }}>
                                                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {form.formState.errors.questions?.[qIndex]?.options?.message}
                                        </RadioGroup>
                                    )}
                                />
                                {form.formState.errors.questions?.[qIndex]?.correctOption && <FormMessage>{form.formState.errors.questions?.[qIndex]?.correctOption?.message}</FormMessage>}

                             </div>
                             <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => {
                                 const newOptions = [...question.options, {text: ''}];
                                 update(qIndex, {...question, options: newOptions});
                             }}><Plus className="mr-2 w-4 h-4" />Thêm lựa chọn</Button>

                        </div>
                        ))}

                        <Separator />
                        
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => append({ text: '', options: [{ text: '' }, { text: '' }], correctOption: '0' })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Thêm câu hỏi
                        </Button>
                    </CardContent>
                </Card>
              
              <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                Tạo Quiz
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
