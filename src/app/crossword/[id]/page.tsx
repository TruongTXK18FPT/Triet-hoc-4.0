"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { QuestionPanel } from "@/components/crossword/QuestionPanel";
import { KeywordInput } from "@/components/crossword/KeywordInput";

interface CrosswordQuestion {
  id: string;
  order: number;
  question: string;
  answer: string;
  explanation?: string;
  keywordCharIndex: number;
  keywordColumn: number;
}

interface CrosswordGame {
  id: string;
  title: string;
  description?: string;
  keyword: string;
  theme?: string;
  questions: CrosswordQuestion[];
}

export default function PlayCrosswordGame() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [game, setGame] = useState<CrosswordGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameWon, setGameWon] = useState(false);

  // Game state
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(
    new Set()
  );
  const [selectedQuestion, setSelectedQuestion] = useState<
    number | undefined
  >();
  const [isCheckingKeyword, setIsCheckingKeyword] = useState(false);
  
  // Sound state
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const backgroundSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Helper function to play sound
  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (!soundRef.current || isSoundMuted) return;
    
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {
      // Silently fail - audio play may be blocked by browser autoplay policy
    });
  };
  
  // Initialize sound effects
  useEffect(() => {
    if (globalThis.window !== undefined) {
      // Background sound
      const bgSound = new Audio();
      bgSound.src = '/assets/background-sound.mp3';
      bgSound.loop = true;
      bgSound.volume = 0.3;
      bgSound.preload = 'auto';
      backgroundSoundRef.current = bgSound;
      
      // Correct sound
      const corSound = new Audio();
      corSound.src = '/assets/correct-sound.mp3';
      corSound.volume = 0.5;
      corSound.preload = 'auto';
      correctSoundRef.current = corSound;
      
      // Wrong sound
      const wrSound = new Audio();
      wrSound.src = '/assets/wrong-sound.mp3';
      wrSound.volume = 0.5;
      wrSound.preload = 'auto';
      wrongSoundRef.current = wrSound;
      
      // Handle errors with detailed info
      const handleError = (sound: string) => (e: Event) => {
        const audio = e.target as HTMLAudioElement;
        const error = audio.error;
        if (error) {
          let errorMsg = `${sound} sound error: `;
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMsg += 'Media loading aborted';
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMsg += 'Network error';
              break;
            case error.MEDIA_ERR_DECODE:
              errorMsg += 'Decode error';
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg += 'Format not supported';
              break;
            default:
              errorMsg += `Unknown error (code: ${error.code})`;
          }
          console.warn(errorMsg);
        } else {
          console.warn(`${sound} sound error: Unable to load audio file`);
        }
      };
      
      bgSound.addEventListener('error', handleError('Background'));
      corSound.addEventListener('error', handleError('Correct'));
      wrSound.addEventListener('error', handleError('Wrong'));
      
      // Try to load audio files (load() doesn't return a promise)
      try {
        bgSound.load();
        corSound.load();
        wrSound.load();
      } catch (error) {
        // Ignore load errors - they will be caught by error event listeners
      }
      
      // Start background sound after user interaction
      const handleFirstInteraction = () => {
        if (!isSoundMuted && backgroundSoundRef.current) {
          backgroundSoundRef.current.play().catch((error) => {
            console.log('Background sound play failed:', error);
          });
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
      
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
      
      return () => {
        bgSound.pause();
        corSound.pause();
        wrSound.pause();
        bgSound.src = '';
        corSound.src = '';
        wrSound.src = '';
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, []);
  
  // Handle sound mute toggle
  useEffect(() => {
    if (backgroundSoundRef.current) {
      if (isSoundMuted) {
        backgroundSoundRef.current.pause();
      } else {
        backgroundSoundRef.current.play().catch((error) => {
          console.log('Background sound play failed:', error);
        });
      }
    }
  }, [isSoundMuted]);

  useEffect(() => {
    // Kiểm tra quyền admin
    if (status === "loading") return; // Đang loading session

    if (
      status === "unauthenticated" ||
      session?.user?.email !== "admin@mln131.com"
    ) {
      router.push("/");
      return;
    }

    if (params.id) {
      loadGame();
    }
  }, [params.id, session, status, router]);

  const loadGame = async () => {
    try {
      const response = await fetch(`/api/crossword/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGame(data);
      } else {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy trò chơi",
          variant: "destructive",
        });
        router.push("/crossword");
      }
    } catch (error) {
      console.error("Error loading game:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải trò chơi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionOrder: number, answer: string) => {
    const question = game?.questions.find((q) => q.order === questionOrder);
    if (!question) return;

    const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();

    if (isCorrect) {
      setAnsweredQuestions((prev) => new Set([...prev, questionOrder]));
      setCorrectAnswers((prev) => new Set([...prev, questionOrder]));

      // Mở khóa chữ cái keyword (sử dụng thứ tự câu hỏi làm index trong keyword)
      setRevealedLetters((prev) => new Set([...prev, question.order - 1]));

      // Play correct sound
      playSound(correctSoundRef);

      toast({
        title: "Chính xác!",
        description: "Bạn đã trả lời đúng và mở khóa một chữ cái keyword",
      });

      // Kiểm tra xem đã mở khóa hết chữ cái chưa
      if (revealedLetters.size === game?.keyword.length) {
        setTimeout(() => {
          setGameWon(true);
        }, 1000);
      }
    } else {
      setAnsweredQuestions((prev) => new Set([...prev, questionOrder]));

      // Play wrong sound
      playSound(wrongSoundRef);

      toast({
        title: "Sai rồi!",
        description: "Đáp án không chính xác. Hãy thử lại!",
        variant: "destructive",
      });
    }
  };

  const handleKeywordSubmit = async (keyword: string) => {
    setIsCheckingKeyword(true);
    try {
      const response = await fetch(`/api/crossword/${params.id}/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });

      const result = await response.json();

      if (result.correct) {
        setGameWon(true);
        toast({
          title: "Chúc mừng!",
          description: "Bạn đã đoán đúng keyword!",
        });
      } else {
        toast({
          title: "Sai rồi!",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking keyword:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kiểm tra keyword",
        variant: "destructive",
      });
    } finally {
      setIsCheckingKeyword(false);
    }
  };

  const resetGame = () => {
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setRevealedLetters(new Set());
    setSelectedQuestion(undefined);
    setGameWon(false);
  };

  // Hiển thị loading hoặc redirect
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44392d] mx-auto mb-4"></div>
            <p>Đang tải trò chơi...</p>
          </div>
        </div>
      </div>
    );
  }

  // Nếu không phải admin, không hiển thị gì (đã redirect)
  if (session?.user?.email !== "admin@mln131.com") {
    return null;
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p>Không tìm thấy trò chơi</p>
            <Button onClick={() => router.push("/crossword")} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#44392d] via-[#5a4a3a] to-[#44392d] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-extrabold font-headline">
                  {game.title}
                </h1>
                {game.theme && (
                  <p className="text-white/80 mt-1">📚 {game.theme}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
                title={isSoundMuted ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                {isSoundMuted ? (
                  <VolumeX className="h-4 w-4 mr-2" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                {isSoundMuted ? "Bật âm" : "Tắt âm"}
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Chơi lại
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {correctAnswers.size}/{game.questions.length} câu đã giải
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {revealedLetters.size}/{game.keyword.length} chữ cái đã mở
                </Badge>
              </div>
              {gameWon && (
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <Trophy className="h-6 w-6" />
                  <span>CHIẾN THẮNG!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <CrosswordGrid
              questions={game.questions}
              keyword={game.keyword}
              answeredQuestions={correctAnswers}
              onQuestionClick={setSelectedQuestion}
              selectedQuestion={selectedQuestion}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Keyword Input */}
            <KeywordInput
              keyword={game.keyword}
              revealedLetters={revealedLetters}
              onKeywordSubmit={handleKeywordSubmit}
              isChecking={isCheckingKeyword}
            />

            {/* Question Panel */}
            <QuestionPanel
              questions={game.questions}
              answeredQuestions={answeredQuestions}
              correctAnswers={correctAnswers}
              onAnswerSubmit={handleAnswerSubmit}
              selectedQuestion={selectedQuestion}
              onQuestionSelect={setSelectedQuestion}
            />
          </div>
        </div>

        {/* Game Description */}
        {game.description && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-[#44392d]">Mô tả trò chơi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{game.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
