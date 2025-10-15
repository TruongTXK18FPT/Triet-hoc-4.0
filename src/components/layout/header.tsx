'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Home, Route, CalendarClock, ListChecks, Newspaper, Sparkles, LogOut, User as UserIcon, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import logoMLN from '@/assets/logoMLN.png';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const navLinks = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Lộ trình AI', href: '/roadmap-ai', icon: Sparkles, highlight: true },
  { name: 'Dòng thời gian', href: '/timeline', icon: CalendarClock },
  { name: 'Trắc nghiệm', href: '/quiz', icon: ListChecks },
  { name: 'Blog', href: '/blog', icon: Newspaper },
  { name: 'Đánh giá', href: '/review', icon: Star },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#44392d] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative">
            <Image
              src={logoMLN}
              alt="Triết Học 4.0 - Logo"
              width={120}
              height={120}
              className="h-10 w-auto object-contain drop-shadow-lg"
              style={{ filter: 'sepia(1) saturate(600%) hue-rotate(330deg) brightness(0.7) contrast(1.1)' }}
            />
            <span className="relative font-extrabold tracking-tight leading-none text-xl md:text-2xl text-white select-none">
              Triết học 4.0
              <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-radial-soft" />
            </span>
            <span aria-hidden className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[180px] h-[180px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 radial-glow" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isHighlight = Boolean(link.highlight);
              return (
                <Button
                  key={link.name}
                  asChild
                  variant={isHighlight ? 'default' : 'ghost'}
                  className={cn(
                    'gap-2 text-white/90 hover:text-white hover:bg-white/10',
                    isHighlight && 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow hover:from-amber-600 hover:to-yellow-600'
                  )}
                >
                  <Link href={link.href} className="flex items-center">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    <span className="ml-1">{link.name}</span>
                    {isHighlight && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
                      </span>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>
          
          <div className="hidden md:flex items-center gap-2">
            {status === 'authenticated' ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 ring-2 ring-white/20">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'user'} />
                      <AvatarFallback><UserIcon className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                    <span className="text-white/90 hover:text-white">{session.user?.name || 'Tài khoản'}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Hồ sơ</Link>
                  </DropdownMenuItem>
                  {session.user?.email === 'admin@mln131.com' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">🔧 Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=>signOut({ callbackUrl: '/' })} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2"/> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" className="text-white border-white/30 hover:bg-white hover:text-[#44392d]">
                <Link href="/login">Đăng nhập</Link>
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] bg-background">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center border-b pb-4">
                     <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                        <Image 
                          src={logoMLN} 
                          alt="Triết Học 4.0 - Logo" 
                          width={100} 
                          height={100} 
                          className="h-8 w-auto object-contain"
                        />
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                        <X/>
                        <span className="sr-only">Đóng menu</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8 flex-grow">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isHighlight = Boolean(link.highlight);
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            'text-lg font-medium flex items-center gap-2',
                            isHighlight ? 'text-foreground bg-yellow-50 rounded-md px-3 py-2 border border-yellow-200' : 'text-foreground/80 hover:text-primary'
                          )}
                          onClick={() => setMenuOpen(false)}
                        >
                          {Icon ? <Icon className="h-5 w-5" /> : null}
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                     <Link href="/quiz/create" className="text-lg font-medium text-foreground/80 hover:text-primary flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                       <Route className="h-5 w-5 rotate-90" />
                       <span>Tạo trắc nghiệm</span>
                     </Link>
                  </nav>
                  {status === 'authenticated' ? (
                    <div className="flex items-center gap-2">
                      <Button asChild className="flex-1"><Link href="/profile">Hồ sơ</Link></Button>
                      <Button variant="outline" className="flex-1" onClick={()=>{ setMenuOpen(false); signOut({ callbackUrl: '/' }); }}>Đăng xuất</Button>
                    </div>
                  ) : (
                    <Button asChild size="lg" className="w-full"><Link href="/login">Đăng nhập</Link></Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* styles moved to globals.css utilities */}
    </header>
  );
}
