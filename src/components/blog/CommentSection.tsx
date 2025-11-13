'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, Loader2, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
}

interface CommentSectionProps {
  postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [postSlug]);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/blog/${postSlug}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      toast({
        title: 'Cần đăng nhập',
        description: 'Vui lòng đăng nhập để bình luận',
        variant: 'destructive',
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Nội dung comment không được để trống',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/blog/${postSlug}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: commentText }),
        });

        if (res.ok) {
          const data = await res.json();
          setComments([data.comment, ...comments]);
          setCommentText('');
          toast({
            title: 'Thành công',
            description: 'Đã thêm bình luận',
          });
        } else {
          const error = await res.json();
          toast({
            title: 'Lỗi',
            description: error.error || 'Không thể thêm bình luận',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể thêm bình luận',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/blog/${postSlug}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
        toast({
          title: 'Thành công',
          description: 'Đã xóa bình luận',
        });
      } else {
        toast({
          title: 'Lỗi',
          description: 'Không thể xóa bình luận',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bình luận',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-background/80 backdrop-blur-sm border-2 border-primary/10 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/80 backdrop-blur-sm border-2 border-primary/10 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary/20">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold font-headline text-primary">Bình luận ({comments.length})</h3>
        </div>

        {/* Comment form */}
        {session ? (
          <div className="mb-6 space-y-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              rows={3}
              className="resize-none bg-background/50 border-primary/20 focus:border-primary"
            />
            <Button
              onClick={handleSubmit}
              disabled={isPending || !commentText.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi bình luận
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Vui lòng đăng nhập để bình luận
            </p>
          </div>
        )}

        {/* Comments list - Scrollable */}
        <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50 text-primary/50" />
              <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-3 rounded-xl border border-primary/10 bg-gradient-to-br from-card/50 to-card/30 hover:from-primary/5 hover:to-primary/10 transition-all duration-200 hover:shadow-md"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-primary/10 flex-shrink-0">
                    <AvatarImage src={comment.author.image || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                      {comment.author.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {comment.author.name || 'Người dùng'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {(session?.user?.email === comment.author.email ||
                        session?.user?.role === 'ADMIN') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCommentToDelete(comment.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa bình luận?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => commentToDelete && handleDelete(commentToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

