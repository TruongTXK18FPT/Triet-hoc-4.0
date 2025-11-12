'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, Wand2, Save, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const optionSchema = z.object({
  text: z.string().min(1, 'Lựa chọn không được để trống.'),
});

const questionSchema = z.object({
  text: z.string().min(10, 'Câu hỏi cần có ít nhất 10 ký tự.'),
  options: z.array(optionSchema).min(2, 'Cần có ít nhất 2 lựa chọn.').max(6, 'Tối đa 6 lựa chọn.'),
  correctOptions: z.array(z.string()).min(1, 'Câu hỏi phải có ít nhất 1 đáp án đúng.'),
});

const quizFormSchema = z.object({
  title: z.string().min(5, 'Tiêu đề cần có ít nhất 5 ký tự.'),
  description: z.string().min(10, 'Mô tả cần có ít nhất 10 ký tự.').optional(),
  isPublic: z.boolean().default(true),
  topicForAI: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'Quiz cần có ít nhất 1 câu hỏi.'),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

type QuizData = {
  id: string;
  title: string;
  isPublic: boolean;
  questions: Array<{
    id: string;
    prompt: string;
    options: string[];
    answer: number;
    answers?: number[] | null;
  }>;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default function EditQuizPage() {
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const quizId = params?.id as string;

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: true,
      topicForAI: '',
      questions: [
        { text: '', options: [{ text: '' }, { text: '' }], correctOptions: [] },
      ],
    },
  });

  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  // Load quiz data
  useEffect(() => {
    async function loadQuiz() {
      if (!quizId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/quiz/${quizId}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy quiz');
        }

        const data = await response.json();
        const quiz: QuizData = data.quiz;

        // Check if user owns this quiz
        if (session?.user?.email !== quiz.author.email) {
          toast({
            variant: 'destructive',
            title: 'Không có quyền',
            description: 'Bạn chỉ có thể chỉnh sửa quiz của chính mình.',
          });
          router.push('/quiz');
          return;
        }

        // Populate form with quiz data
        form.reset({
          title: quiz.title,
          description: '',
          isPublic: quiz.isPublic,
          topicForAI: '',
          questions: quiz.questions.map((q) => {
            const correctAnswers = q.answers && Array.isArray(q.answers) ? q.answers : [q.answer];
            return {
              text: q.prompt,
              options: q.options.map(opt => ({ text: opt })),
              correctOptions: correctAnswers.map(idx => idx.toString()),
            };
          }),
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Lỗi!',
          description: error instanceof Error ? error.message : 'Không thể tải quiz. Vui lòng thử lại.',
        });
        router.push('/quiz');
      } finally {
        setIsLoading(false);
      }
    }

    if (session && quizId) {
      loadQuiz();
    }
  }, [quizId, session, form, router, toast]);

  async function onSubmit(values: QuizFormValues) {
    if (status !== 'authenticated') {
      toast({
        variant: 'destructive',
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để chỉnh sửa quiz.",
      });
      router.push('/login');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          isPublic: values.isPublic,
          questions: values.questions.map((q) => ({
            prompt: q.text,
            options: q.options.map(opt => opt.text),
            answers: q.correctOptions.map(idx => parseInt(idx)),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể cập nhật quiz');
      }

      toast({
        title: "✨ Thành công!",
        description: `Quiz "${values.title}" đã được cập nhật.`,
      });

      // Redirect to quiz list
      router.push('/quiz');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Lỗi!",
        description: error instanceof Error ? error.message : 'Không thể cập nhật quiz. Vui lòng thử lại.',
      });
    } finally {
      setIsSaving(false);
    }
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
                // Add new questions from AI (append, don't replace)
                result.questions.forEach((q) => {
                    append({
                        text: q.questionText,
                        options: q.options.map(opt => ({ text: opt })),
                        correctOptions: [q.correctOptionIndex.toString()],
                    });
                });
                toast({
                    title: "AI đã tạo xong!",
                    description: `Đã thêm ${result.questions.length} câu hỏi về chủ đề "${topic}".`,
                });
                // Clear the topic input field after successful generation
                form.setValue('topicForAI', '');
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

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Save className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Chỉnh Sửa Quiz
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cập nhật thông tin và câu hỏi cho quiz của bạn
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="border-2 shadow-xl bg-card/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                          <Save className="w-5 h-5" />
                          Thông Tin Chung
                        </CardTitle>
                        <CardDescription>Điền thông tin cơ bản về quiz của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-base font-semibold">Tiêu đề Quiz *</FormLabel>
                                <FormControl>
                                    <Input 
                                      placeholder="Ví dụ: Các quy luật cơ bản của phép biện chứng..." 
                                      className="text-base"
                                      {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPublic"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base font-semibold">Công khai Quiz</FormLabel>
                                    <FormDescription>
                                      Cho phép mọi người xem và làm quiz của bạn
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                            <Wand2 className="w-6 h-6"/>
                            <span>Tạo nhanh bằng AI</span>
                        </CardTitle>
                         <CardDescription>Nhập chủ đề, AI sẽ tự động tạo 5 câu hỏi trắc nghiệm chất lượng cao</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                         <FormField
                            control={form.control}
                            name="topicForAI"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-base font-semibold">Chủ đề cho AI</FormLabel>
                                <FormControl>
                                    <Input 
                                      placeholder="Ví dụ: 'Sự khác biệt giữa vật chất và ý thức'..." 
                                      className="text-base"
                                      {...field} 
                                    />
                                </FormControl>
                                 <FormDescription>AI sẽ phân tích và tạo ra các câu hỏi sâu sắc về chủ đề này</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" onClick={handleAIGenerate} disabled={isPending} size="lg" className="w-full">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            {isPending ? 'AI đang suy nghĩ...' : 'Tạo câu hỏi bằng AI'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-xl bg-card/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                        <CardTitle className="font-headline text-2xl text-primary">Các Câu Hỏi</CardTitle>
                        <CardDescription>Thêm hoặc chỉnh sửa các câu hỏi cho quiz</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {fields.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <p className="mb-4">Chưa có câu hỏi nào. Hãy thêm câu hỏi hoặc dùng AI để tạo.</p>
                          </div>
                        )}
                        {fields.map((question, qIndex) => (
                        <div key={question.id} className="p-6 border-2 rounded-xl bg-gradient-to-br from-background to-muted/30 relative shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-lg text-primary">Câu hỏi {qIndex + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => remove(qIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                             <FormField
                                control={form.control}
                                name={`questions.${qIndex}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="font-semibold">Nội dung câu hỏi</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className="min-h-20 text-base" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                             />
                             <div className="mt-6 space-y-4">
                                <Label className="font-semibold text-base">Các lựa chọn & Đáp án đúng</Label>
                                <FormDescription>Chọn một hoặc nhiều đáp án đúng bằng cách click vào checkbox</FormDescription>

                                {(!question.correctOptions || question.correctOptions.length === 0) && (
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/50">
                                    <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                                    <p className="text-sm text-destructive">Câu hỏi này chưa có đáp án đúng nào được chọn</p>
                                  </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name={`questions.${qIndex}.correctOptions`}
                                    render={({ field }) => (
                                        <div className="space-y-3">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border hover:border-primary/50 transition-colors">
                                                    <Checkbox
                                                        id={`${question.id}-opt-${oIndex}`}
                                                        checked={field.value?.includes(oIndex.toString()) || false}
                                                        onCheckedChange={(checked) => {
                                                          const current = field.value || [];
                                                          if (checked) {
                                                            field.onChange([...current, oIndex.toString()]);
                                                          } else {
                                                            field.onChange(current.filter(idx => idx !== oIndex.toString()));
                                                          }
                                                        }}
                                                        className="shrink-0 mt-1"
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`questions.${qIndex}.options.${oIndex}.text`}
                                                        render={({ field: optionField }) => (
                                                            <Input {...optionField} className="flex-1" placeholder={`Lựa chọn ${oIndex + 1}`} />
                                                        )}
                                                    />
                                                     <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="icon"
                                                      className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                                                      onClick={() => {
                                                        if (question.options.length > 2) {
                                                          const newOptions = question.options.filter((_, i) => i !== oIndex);
                                                          update(qIndex, {...question, options: newOptions});
                                                        } else {
                                                          toast({
                                                            variant: 'destructive',
                                                            title: 'Không thể xóa',
                                                            description: 'Câu hỏi phải có ít nhất 2 lựa chọn.',
                                                          });
                                                        }
                                                     }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                                {form.formState.errors.questions?.[qIndex]?.correctOptions && (
                                  <FormMessage>{form.formState.errors.questions?.[qIndex]?.correctOptions?.message}</FormMessage>
                                )}
                             </div>
                             <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="mt-4" 
                              onClick={() => {
                                if (question.options.length < 6) {
                                  const newOptions = [...question.options, {text: ''}];
                                  update(qIndex, {...question, options: newOptions});
                                } else {
                                  toast({
                                    variant: 'destructive',
                                    title: 'Đã đạt giới hạn',
                                    description: 'Tối đa 6 lựa chọn cho mỗi câu hỏi.',
                                  });
                                }
                             }}>
                              <Plus className="mr-2 w-4 h-4" />
                              Thêm lựa chọn
                            </Button>
                        </div>
                        ))}

                        {fields.length > 0 && <Separator className="my-6" />}
                        
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            className="w-full"
                            onClick={() => append({ text: '', options: [{ text: '' }, { text: '' }], correctOptions: [] })}
                        >
                            <Plus className="mr-2 h-5 w-5" /> Thêm câu hỏi mới
                        </Button>
                    </CardContent>
                </Card>
              
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={() => router.push('/quiz')}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                  disabled={isSaving || isPending}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Cập nhật Quiz
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

