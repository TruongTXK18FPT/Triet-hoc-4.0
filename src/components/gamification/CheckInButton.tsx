'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Calendar, Sparkles, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function CheckInButton() {
  const { data: session, status } = useSession();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      checkStatus();
    }
  }, [status]);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/checkin');
      if (res.ok) {
        const data = await res.json();
        setCheckedIn(data.checkedIn);
        setCheckInTime(data.checkInTime ? new Date(data.checkInTime) : null);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCheckIn = async () => {
    if (!session) {
      toast({
        title: 'Cần đăng nhập',
        description: 'Vui lòng đăng nhập để điểm danh',
        variant: 'destructive',
      });
      return;
    }

    if (checkedIn) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setCheckedIn(true);
        setCheckInTime(new Date());
        toast({
          title: '🎉 Điểm danh thành công!',
          description: data.message || `Bạn đã nhận được ${data.xpEarned} XP!`,
          className: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200',
        });
        // Refresh page after a short delay to update XP display
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: 'Điểm danh thất bại',
          description: data.error || 'Đã có lỗi xảy ra',
          variant: 'destructive',
        });
        if (data.alreadyCheckedIn) {
          setCheckedIn(true);
          setCheckInTime(data.checkInTime ? new Date(data.checkInTime) : null);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error?.message || 'Không thể điểm danh',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unauthenticated') {
    return null;
  }

  if (checkingStatus) {
    return (
      <Card className="vintage-card border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="vintage-card border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      {/* Decorative vintage pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div
            className={cn(
              'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
              checkedIn
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/50'
                : 'bg-gradient-to-br from-amber-200 to-orange-300 shadow-md'
            )}
          >
            {checkedIn ? (
              <CheckCircle2 className="w-12 h-12 text-white animate-bounce-once" />
            ) : (
              <Calendar className="w-10 h-10 text-amber-800" />
            )}
            {checkedIn && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse-amber"></div>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-headline font-bold text-amber-900 mb-1">
              Điểm Danh Hàng Ngày
            </h3>
            <p className="text-sm text-amber-700/80">
              {checkedIn
                ? 'Bạn đã điểm danh hôm nay!'
                : 'Nhận 50 XP mỗi ngày'}
            </p>
          </div>

          {/* Check-in time */}
          {checkedIn && checkInTime && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-white/50 px-4 py-2 rounded-lg border border-amber-200">
              <Clock className="w-4 h-4" />
              <span>Đã điểm danh lúc {formatTime(checkInTime)}</span>
            </div>
          )}

          {/* XP Reward Badge */}
          {!checkedIn && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-300">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-amber-800">+50 XP</span>
            </div>
          )}

          {/* Button */}
          <Button
            onClick={handleCheckIn}
            disabled={checkedIn || loading}
            className={cn(
              'w-full font-headline font-bold text-lg py-6 transition-all duration-300',
              checkedIn
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang điểm danh...</span>
              </div>
            ) : checkedIn ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Đã Điểm Danh</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Điểm Danh Ngay</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

