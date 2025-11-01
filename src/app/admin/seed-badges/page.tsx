'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

export default function SeedBadgesPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  async function seedBadges() {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/gamification/badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: prompt('Enter admin secret:'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to seed badges');
      }

      toast({
        title: '✅ Success!',
        description: data.message,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to seed badges',
      });
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Seed Badges
          </CardTitle>
          <CardDescription>
            Initialize the gamification system with default badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={seedBadges}
            disabled={isSeeding}
            className="w-full"
          >
            {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSeeding ? 'Seeding...' : 'Seed Badges'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
