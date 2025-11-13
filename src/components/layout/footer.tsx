import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Sparkles, MapPin } from 'lucide-react';
import Image from 'next/image';
import logoMLN from '@/assets/logoMLN.png';

const socialLinks = [
  { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61582693996915', name: 'Facebook' },
  { Icon: Twitter, href: '#', name: 'Twitter' },
  { Icon: Instagram, href: '#', name: 'Instagram' },
  { Icon: Linkedin, href: '#', name: 'LinkedIn' },
];

const footerSections = [
    {
      title: 'Về Chúng Tôi',
      links: [
        { name: 'Sứ mệnh', href: '/mission' },
        { name: 'Đội ngũ', href: '/team' },
        { name: 'Tuyển dụng', href: '/careers' },
        { name: 'AI Usage', href: '/ai-commitment' },
        { name: 'Báo cáo KPI', href: '/kpi-report' },
        { name: 'Log Công Việc', href: '/work-log' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { name: 'Roadmap AI', href: '/roadmap-ai' },
        { name: 'Làm Quiz', href: '/quiz' },
        { name: 'Tạo Quiz', href: '/quiz/create' },
        { name: 'Blog', href: '/blog' },
        { name: 'Timeline', href: '/timeline' },
      ],
    },
    {
      title: 'Liên Hệ',
      links: [
        { name: 'Email: contact@triethoc40.vn', href: 'mailto:tranxuantin1234@gmail.com' },
        { name: 'Hotline: =D', href: '#' },
        { name: 'Địa chỉ: Đại học FPT, Hồ Chí Minh', href: '#' },
      ],
    },
];

export function Footer() {
  return (
    <footer className="relative text-primary-foreground overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/95 to-primary" />
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="mb-6 md:mb-0 lg:col-span-1">
             <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image 
                src={logoMLN} 
                alt="Triết Học 4.0 Logo" 
                width={140} 
                height={140} 
                className="h-9 w-auto object-contain"
                style={{ filter: 'sepia(1) saturate(600%) hue-rotate(330deg) brightness(0.7) contrast(1.1)' }}
              />
              <span className="font-semibold tracking-wide">Triết Học 4.0</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">Nền tảng học tập triết học Mác – Lênin bằng AI.</p>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Về Chúng Tôi
            </h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Về Dự Án</Link></li>
              <li><Link href="/mission" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Sứ mệnh</Link></li>
              <li><Link href="/team" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Đội ngũ</Link></li>
              <li><Link href="/careers" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Tuyển dụng</Link></li>
              <li><Link href="/ai-commitment" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Cam kết AI</Link></li>
              <li><Link href="/kpi-report" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Báo cáo KPI</Link></li>
              <li><Link href="/work-log" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Log Công Việc</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link href="/roadmap-ai" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Roadmap AI</Link></li>
              <li><Link href="/quiz" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Làm Quiz</Link></li>
              <li><Link href="/quiz/create" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Tạo Quiz</Link></li>
              <li><Link href="/blog" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Blog</Link></li>
              <li><Link href="/timeline" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Timeline</Link></li>
              <li><Link href="/review" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Đánh giá</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Liên Hệ
            </h3>
            <ul className="space-y-2">
              <li><a href="mailto:tranxuantin1234@gmail.com" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group"><span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />Email: tranxuantin1234@gmail.com</a></li>
              <li><span className="text-sm text-primary-foreground/80">Hotline: =D</span></li>
              <li><a href="https://maps.app.goo.gl/VmS5hFzs9TJgXfhU9" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group flex items-start gap-1"><MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" /><span className="flex-1">7 Đ. D1, Khu CNC, Thủ Đức</span></a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Facebook className="h-4 w-4 text-amber-300" />
              Facebook
            </h3>
            <div className="rounded-lg overflow-hidden border-2 border-white/20 shadow-lg bg-white/5 backdrop-blur-sm">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61582693996915&tabs=timeline&width=340&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="100%"
                height="400"
                style={{ border: 0, overflow: 'hidden' }}
                scrolling="no"
                allow="encrypted-media"
                allowFullScreen
                loading="lazy"
                title="Facebook Page"
              />
            </div>
            <Link
              href="https://www.facebook.com/profile.php?id=61582693996915"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-white transition-colors"
            >
              <Facebook className="h-4 w-4" />
              <span>Xem thêm trên Facebook</span>
            </Link>
          </div>

        </div>
        <div className="mt-12 border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/70 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Triết Học 4.0. All rights reserved.</p>
          <div className="flex space-x-4">
            {socialLinks.map(({ Icon, href, name }) => (
              <Link 
                key={name} 
                href={href} 
                target={href !== '#' ? '_blank' : undefined}
                rel={href !== '#' ? 'noopener noreferrer' : undefined}
                aria-label={name} 
                className="text-primary-foreground/80 hover:text-white transition-colors transform hover:-translate-y-0.5 duration-300"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
