'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';


const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Roadmap AI', href: '/roadmap-ai' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Quiz', href: '/quiz' },
  { name: 'Chatbot', href: '/chatbot' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-lg shadow-md border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Triết Học 4.0 Logo" width={40} height={40} className={cn(!scrolled && "brightness-0 invert")}/>
            <span className={cn(
                "font-headline text-xl font-bold",
                scrolled ? "text-primary" : "text-white"
            )}>Triết Học 4.0</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button key={link.name} variant="ghost" asChild className={cn(scrolled ? "text-foreground" : "text-white hover:bg-white/10")}>
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
             <Button variant="ghost" asChild className={cn(scrolled ? "text-foreground" : "text-white hover:bg-white/10")}>
                <Link href="#">Blog</Link>
              </Button>
          </nav>
          
          <div className="hidden md:flex items-center gap-2">
             <Button variant={scrolled ? "default" : "outline"} className={cn(!scrolled && "text-white border-white hover:bg-white hover:text-primary")}>
                Login
             </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(scrolled ? "text-foreground" : "text-white hover:bg-white/10")}>
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] bg-background">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center border-b pb-4">
                     <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                        <Image src="/logo.png" alt="Triết Học 4.0 Logo" width={32} height={32} />
                        <span className="font-headline text-xl font-bold text-primary">Triết Học 4.0</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                        <X/>
                        <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8 flex-grow">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-lg font-medium text-foreground/80 hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                     <Link href="/quiz/create" className="text-lg font-medium text-foreground/80 hover:text-primary" onClick={() => setMenuOpen(false)}>Tạo Quiz</Link>
                     <Link href="#" className="text-lg font-medium text-foreground/80 hover:text-primary" onClick={() => setMenuOpen(false)}>Blog</Link>
                  </nav>
                  <Button size="lg" className="w-full">Login</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
