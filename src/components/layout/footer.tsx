import Link from 'next/link';
import { PhiIcon } from '../icons/phi-icon';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

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
        { name: 'Blog', href: '#' },
        { name: 'Timeline', href: '/timeline' },
      ],
    },
    {
      title: 'Liên Hệ',
      links: [
        { name: 'Email: contact@triethoc40.vn', href: 'mailto:contact@triethoc40.vn' },
        { name: 'Hotline: 1900 1234', href: 'tel:19001234' },
        { name: 'Địa chỉ: 123 Đường Tri Thức, Hà Nội', href: '#' },
      ],
    },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="mb-6 md:mb-0 lg:col-span-1">
             <Link href="/" className="flex items-center gap-2 mb-4">
              <PhiIcon className="w-8 h-8 text-primary-foreground" />
              <span className="font-headline text-2xl font-bold">Triết Học 4.0</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">Nền tảng học tập triết học Mác – Lênin bằng AI.</p>
          </div>
          
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="font-headline font-semibold uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          
        </div>
        <div className="mt-12 border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/60 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Triết Học 4.0. All rights reserved.</p>
          <div className="flex space-x-4">
            {socialLinks.map(({ Icon, href, name }) => (
              <Link key={name} href={href} aria-label={name} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
