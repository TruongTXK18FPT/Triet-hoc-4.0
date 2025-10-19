"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateStudyRoadmap } from "@/ai/flows/generate-study-roadmap";
import type { GenerateStudyRoadmapOutput } from "@/ai/flows/generate-study-roadmap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Wand2,
  Link as LinkIcon,
  Save,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  knowledgeLevel: z.string({
    required_error: "Vui lòng chọn trình độ của bạn.",
  }),
  learningGoals: z.string().min(10, {
    message: "Mục tiêu học tập cần có ít nhất 10 ký tự.",
  }),
});

export default function RoadmapAI() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [roadmap, setRoadmap] = useState<GenerateStudyRoadmapOutput | null>(
    null
  );
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeLevel: "beginner",
      learningGoals: "",
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

  const handleSaveRoadmap = async () => {
    if (!roadmap || !session) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/roadmap/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmap: roadmap.roadmap,
          knowledgeLevel: form.getValues("knowledgeLevel"),
          learningGoals: form.getValues("learningGoals"),
        }),
      });
      if (res.ok) {
        toast({
          title: "Đã lưu thành công!",
          description: "Lộ trình đã được lưu vào hồ sơ của bạn.",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu lộ trình. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-64 md:h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-48 h-48 md:w-64 md:h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-48 h-48 md:w-64 md:h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block p-2 bg-amber-100 rounded-full mb-4 shadow-sm">
              <BookOpen className="w-10 h-10 text-amber-700" />
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
              Lộ Trình Học Tập Bởi AI
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mt-4 max-w-2xl mx-auto">
              Hãy để AI xây dựng lộ trình học tập Triết học Mác – Lênin được cá
              nhân hóa cho riêng bạn.
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-2 border-amber-200/50 hover:shadow-amber-200/50 transition-all duration-300">
            <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="font-headline text-2xl text-amber-800 flex items-center gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Wand2 className="w-6 h-6 text-amber-800" />
                </div>
                <span>Tạo Lộ Trình Của Bạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                        <FormLabel className="text-base font-semibold text-amber-900">
                          Trình độ hiện tại
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-amber-200 focus:ring-amber-500">
                              <SelectValue placeholder="Chọn trình độ của bạn..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">
                              🌱 Mới bắt đầu
                            </SelectItem>
                            <SelectItem value="intermediate">
                              📚 Đã có kiến thức cơ bản
                            </SelectItem>
                            <SelectItem value="advanced">
                              🎓 Nâng cao
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Hãy cho AI biết bạn đang ở đâu trên hành trình học
                          tập.
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
                        <FormLabel className="text-base font-semibold text-amber-900">
                          Mục tiêu học tập
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ví dụ: 'Nắm vững các khái niệm cốt lõi để qua môn', 'Tìm hiểu sâu về phép biện chứng duy vật'..."
                            className="resize-y min-h-[120px] border-amber-200 focus:ring-amber-500"
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
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-5 w-5" />
                    )}
                    {isPending
                      ? "AI đang tạo lộ trình..."
                      : "Tạo Lộ Trình Ngay"}
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
              <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-2 border-amber-200/50">
                <CardContent className="p-6">
                  {isPending && !roadmap ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                      <Loader2 className="w-12 h-12 animate-spin text-accent" />
                      <p className="text-foreground/70">
                        AI đang phân tích yêu cầu của bạn. Vui lòng đợi trong
                        giây lát...
                      </p>
                    </div>
                  ) : (
                    roadmap && (
                      <div className="space-y-6">
                        {/* Save Button */}
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSaveRoadmap}
                            disabled={isSaving || !session}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                          >
                            {isSaving ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            {isSaving ? "Đang lưu..." : "Lưu Lộ Trình"}
                          </Button>
                        </div>

                        {/* Roadmap Items */}
                        {(() => {
                          const items = roadmap.roadmap
                            .split("\n")
                            .filter(Boolean);
                          const parsed = items.map((line) => {
                            // Parse format: "1) [Title] — [Description] — [Links]"
                            const match = line.match(
                              /^\d+\)\s*(.+?)(?:\s*—\s*(.+?))?(?:\s*—\s*(.+?))?$/
                            );
                            if (match) {
                              const [, titlePart, descPart, linksPart] = match;
                              const links = (linksPart || "")
                                .split(/[;,|]/)
                                .map((s) => s.trim())
                                .filter(Boolean);
                              return {
                                title: titlePart?.trim() || line,
                                desc: descPart?.trim() || "",
                                links,
                              };
                            }
                            // Fallback parsing
                            const [titlePart, descPart, linksPart] = line
                              .split(" — ")
                              .map((s) => s?.trim());
                            const links = (linksPart || "")
                              .split(/[;,|]/)
                              .map((s) => s.trim())
                              .filter(Boolean);
                            return {
                              title: titlePart || line,
                              desc: descPart || "",
                              links,
                            };
                          });
                          return (
                            <div className="grid grid-cols-1 gap-5">
                              {parsed.map((it, idx) => (
                                <div
                                  key={idx}
                                  className={`
                                    relative group
                                    p-6 rounded-2xl 
                                    border-2 transition-all duration-300
                                    ${
                                      completed.has(idx + 1)
                                        ? "bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-emerald-300 shadow-lg shadow-emerald-200/50"
                                        : "bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-rose-50/80 border-amber-200 hover:border-amber-300 hover:shadow-xl"
                                    }
                                    backdrop-blur-sm
                                  `}
                                  style={{
                                    backgroundImage: completed.has(idx + 1)
                                      ? "radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)"
                                      : "radial-gradient(circle at 100% 100%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)",
                                  }}
                                >
                                  {/* Decorative corner */}
                                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                                    <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
                                  </div>

                                  <div className="flex items-start gap-4 relative z-10">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 mt-1">
                                      <div
                                        className={`
                                          h-7 w-7 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all
                                          ${
                                            completed.has(idx + 1)
                                              ? "bg-emerald-500 border-emerald-600 shadow-md"
                                              : "bg-white border-amber-300 hover:border-amber-400 hover:shadow"
                                          }
                                        `}
                                      >
                                        <Checkbox
                                          checked={completed.has(idx + 1)}
                                          onCheckedChange={(val) => {
                                            setCompleted((prev) => {
                                              const next = new Set(prev);
                                              if (val) next.add(idx + 1);
                                              else next.delete(idx + 1);
                                              return next;
                                            });
                                          }}
                                          className="opacity-0"
                                        />
                                        {completed.has(idx + 1) && (
                                          <CheckCircle2 className="h-5 w-5 text-white absolute" />
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      {/* Step Number & Title */}
                                      <div className="flex items-start gap-3 mb-2">
                                        <div
                                          className={`
                                            flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center 
                                            font-bold text-lg shadow-md
                                            ${
                                              completed.has(idx + 1)
                                                ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                                                : "bg-gradient-to-br from-amber-300 to-orange-400 text-amber-900"
                                            }
                                          `}
                                        >
                                          {idx + 1}
                                        </div>
                                        <h3 className="font-headline text-lg md:text-xl font-bold text-amber-900 leading-tight">
                                          {it.title}
                                        </h3>
                                      </div>

                                      {/* Description */}
                                      {it.desc && (
                                        <p className="text-foreground/80 leading-relaxed mb-3 text-sm md:text-base">
                                          {it.desc}
                                        </p>
                                      )}

                                      {/* Links */}
                                      {it.links.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                          {it.links.map((l, i) => {
                                            const isUrl = /^https?:\/\//.test(
                                              l
                                            );
                                            return (
                                              <a
                                                key={i}
                                                href={isUrl ? l : undefined}
                                                target={
                                                  isUrl ? "_blank" : undefined
                                                }
                                                rel={
                                                  isUrl
                                                    ? "noopener noreferrer"
                                                    : undefined
                                                }
                                                className={`
                                                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                                                  bg-white/80 border border-amber-200
                                                  hover:bg-amber-50 hover:border-amber-300
                                                  transition-all duration-200
                                                  ${
                                                    isUrl
                                                      ? "text-amber-700 hover:text-amber-900"
                                                      : "text-foreground/70"
                                                  }
                                                `}
                                              >
                                                <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
                                                <span className="truncate max-w-[200px]">
                                                  {l}
                                                </span>
                                              </a>
                                            );
                                          })}
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
                        <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border-2 border-slate-200">
                          <h3 className="font-headline text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              />
                            </svg>
                            Sơ Đồ Tư Duy
                          </h3>
                          {(() => {
                            const Flow = dynamic(
                              () =>
                                import("@/components/roadmap/RoadmapFlow").then(
                                  (m) => m.RoadmapFlow
                                ),
                              { ssr: false }
                            );
                            const items = roadmap.roadmap
                              .split("\n")
                              .filter(Boolean);
                            return (
                              <Flow
                                lines={items}
                                completedIds={completed}
                                onToggleComplete={(index) => {
                                  setCompleted((prev) => {
                                    const next = new Set(prev);
                                    const id = index + 1;
                                    if (next.has(id)) next.delete(id);
                                    else next.add(id);
                                    return next;
                                  });
                                }}
                              />
                            );
                          })()}
                        </div>

                        {/* Info Box */}
                        <div className="relative p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-1">
                                💡 Gợi ý học tập
                              </h4>
                              <p className="text-sm text-blue-800/80 leading-relaxed">
                                Đánh dấu hoàn thành từng mục để theo dõi tiến
                                độ. Nhấn <strong>Lưu Lộ Trình</strong> để lưu
                                vào hồ sơ và xem lại bất cứ lúc nào.
                              </p>
                            </div>
                          </div>
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
