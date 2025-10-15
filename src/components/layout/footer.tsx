import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import logoMLN from '@/assets/logoMLN.png';

const socialLinks = [
  { Icon: Facebook, href: '#', name: 'Facebook' },
  { Icon: Twitter, href: '#', name: 'Twitter' },
  { Icon: Instagram, href: '#', name: 'Instagram' },
  { Icon: Linkedin, href: '#', name: 'LinkedIn' },
];

const footerSections = [
    {
      title: 'Về Chúng Tôi',
      links: [
        { name: 'Sứ mệnh', href: '#mission' },
        { name: 'Đội ngũ', href: '#' },
        { name: 'Tuyển dụng', href: '#' },
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
              <Image src={logoMLN} alt="Triết Học 4.0 Logo" width={140} height={140} className="h-9 w-auto object-contain mix-blend-luminosity"/>
              <span className="font-semibold tracking-wide">Triết Học 4.0</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">Nền tảng học tập triết học Mác – Lênin bằng AI.</p>
          </div>
          
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="font-headline font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300" />
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-primary-foreground/80 hover:text-white transition-colors inline-block relative group">
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/70 transition-all duration-300 group-hover:w-full" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          
        </div>
        <div className="mt-12 border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/70 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Triết Học 4.0. All rights reserved.</p>
          <div className="flex space-x-4">
            {socialLinks.map(({ Icon, href, name }) => (
              <Link key={name} href={href} aria-label={name} className="text-primary-foreground/80 hover:text-white transition-colors transform hover:-translate-y-0.5 duration-300">
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
