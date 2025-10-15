'use client';

import { useForm } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';

const blogPostSchema = z.object({
  title: z.string().min(10, 'Tiêu đề cần có ít nhất 10 ký tự.'),
  description: z.string().min(20, 'Mô tả cần có ít nhất 20 ký tự.'),
  content: z.string().min(100, 'Nội dung cần có ít nhất 100 ký tự.'),
  imageUrl: z.string().url('Vui lòng nhập một URL hình ảnh hợp lệ.').optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      imageUrl: '',
    },
  });

  async function onSubmit(values: BlogPostFormValues) {
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          content: values.content,
          imageUrl: values.imageUrl,
          publish: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Không thể tạo bài viết');
      }
      const data = await res.json();
      setShowSuccessDialog(true);
      form.reset();
    } catch (e: any) {
      toast({ title: 'Lỗi', description: e.message, variant: 'destructive' });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
         <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang Blog
            </Link>
         </Button>
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Viết Blog Mới
            </h1>
            <p className="text-lg text-foreground/80 mt-4">
              Chia sẻ kiến thức, góc nhìn và phân tích của bạn với cộng đồng.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">Nội dung bài viết</CardTitle>
                  <CardDescription>Điền các thông tin cần thiết cho bài đăng của bạn.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề</FormLabel>
                        <FormControl>
                          <Input placeholder="Tiêu đề bài viết của bạn..." {...field} />
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
                          <Textarea placeholder="Một mô tả ngắn gọn, hấp dẫn về bài viết..." {...field} />
                        </FormControl>
                         <FormDescription>Mô tả này sẽ hiển thị trên trang danh sách blog.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hình ảnh đại diện</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData();
                                  fd.append('file', file);
                                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                  const data = await res.json();
                                  if (res.ok && data.url) {
                                    field.onChange(data.url);
                                    toast({ title: 'Đã tải ảnh lên', description: 'Hình ảnh đã được tải lên Cloudinary.' });
                                  } else {
                                    toast({ title: 'Upload thất bại', description: data.error || 'Không thể upload ảnh', variant: 'destructive' });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
                         <FormDescription>Hình ảnh sẽ hiển thị ở đầu bài viết và trên thẻ bài viết.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung chính</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Viết nội dung của bạn ở đây. Bạn có thể sử dụng cú pháp Markdown đơn giản..."
                            className="min-h-[300px]"
                            {...field}
                          />
                        </FormControl>
                         <FormDescription>Hỗ trợ Markdown cơ bản cho tiêu đề (##, ###), in đậm (**text**).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full">
                Đăng bài
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-primary">✅ Đăng bài thành công!</DialogTitle>
            <DialogDescription className="text-base pt-4">
              Bài viết của bạn đã được gửi thành công và đang chờ kiểm duyệt từ admin. 
              Bài viết sẽ được xuất bản sau khi được phê duyệt.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={() => { setShowSuccessDialog(false); window.location.href = '/blog'; }} className="w-full">
              Quay lại trang Blog
            </Button>
            <Button onClick={() => setShowSuccessDialog(false)} variant="outline" className="w-full">
              Viết bài mới
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
