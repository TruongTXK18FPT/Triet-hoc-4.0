"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink } from "lucide-react";

interface VideoPlayerProps {
  youtubeUrl?: string | null;
  videoUrl?: string | null;
  title: string;
  description?: string | null;
}

export function VideoPlayer({
  youtubeUrl,
  videoUrl,
  title,
  description,
}: VideoPlayerProps) {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const renderVideoContent = () => {
    if (youtubeUrl) {
      const videoId = getYouTubeVideoId(youtubeUrl);
      if (videoId) {
        return (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    if (videoUrl) {
      return (
        <div className="aspect-video w-full">
          <video
            src={videoUrl}
            controls
            className="w-full h-full rounded-lg"
            poster=""
          >
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      );
    }

    return (
      <div className="aspect-video w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Play className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500">Không có video</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="font-headline text-xl text-primary">
            {title}
          </CardTitle>
          {youtubeUrl && (
            <Badge variant="outline" className="text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              YouTube
            </Badge>
          )}
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>{renderVideoContent()}</CardContent>
    </Card>
  );
}

