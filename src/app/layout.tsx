import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const marlish = localFont({
  src: "./fonts/Mulish/Mulish-VariableFont_wght.ttf",
  variable: "--font-marlish",
  weight: "100 900",
});

const open_sans = localFont({
  src: "./fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf",
  variable: "--font-open-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Oluwaleke Abiodun",
  description: "Full-stack developer web and mobile developer",
  keywords: [
    "javascript developer, experienced developer, nodejs developer, frontend developer, java developer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${marlish.variable} ${open_sans.variable} w-full dark:bg-slate-950 scroll-smooth bg-slate-900 antialiased min-h-screen`}
      >
        <header className='norse-glass fixed top-0 left-0 right-0 z-50 h-20 backdrop-blur-md bg-slate-900/90 border-b border-amber-500/30 transition-all duration-300 relative overflow-hidden'>
          {/* Norse header decorations */}
          <div className='absolute top-2 left-10 text-yellow-400/20 text-sm animate-rune-glow'>ᚺ</div>
          <div className='absolute top-2 right-10 text-yellow-400/20 text-sm animate-rune-glow'>ᚱ</div>
          <div className='absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-red-500/5 animate-asgard-glow' />
          
          <div className='w-full mx-auto max-w-7xl px-5 h-full flex items-center justify-between relative z-10'>
            <Link href='/' className='group relative'>
              <div className='absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-asgard-glow' />
              <h1 className='font-marlish font-bold text-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-amber-400 group-hover:to-yellow-300 transition-all duration-300 relative flex items-center gap-2'>
                <span className='text-yellow-400/60 text-lg animate-rune-glow'>ᚦ</span>
                a_short_dev
                <span className='text-yellow-400/60 text-lg animate-rune-glow'>ᚦ</span>
              </h1>
            </Link>

            <nav className='hidden md:flex items-center gap-8'>
              <Link 
                href='#projects' 
                className='text-amber-200 hover:text-amber-100 font-marlish font-medium transition-colors duration-300 relative group flex items-center gap-1'
              >
                <span className='text-yellow-400/60 text-sm animate-rune-glow'>ᛈ</span>
                Projects
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-red-500 group-hover:w-full transition-all duration-300 animate-asgard-glow'></span>
              </Link>
              <Link 
                href='#skills-and-tools' 
                className='text-amber-200 hover:text-amber-100 font-marlish font-medium transition-colors duration-300 relative group flex items-center gap-1'
              >
                <span className='text-yellow-400/60 text-sm animate-rune-glow'>ᛋ</span>
                Skills
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-red-500 group-hover:w-full transition-all duration-300 animate-asgard-glow'></span>
              </Link>
              <Link 
                href='#abilities' 
                className='text-amber-200 hover:text-amber-100 font-marlish font-medium transition-colors duration-300 relative group flex items-center gap-1'
              >
                <span className='text-yellow-400/60 text-sm animate-rune-glow'>ᚨ</span>
                Abilities
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-red-500 group-hover:w-full transition-all duration-300 animate-asgard-glow'></span>
              </Link>
              <Link 
                href='#contact' 
                className='asgard-border px-6 py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-marlish font-medium rounded-full transition-all duration-300 transform hover:scale-105 relative overflow-hidden group'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-asgard-glow' />
                <span className='relative z-10 flex items-center gap-2'>
                  <span className='text-yellow-300/80 animate-rune-glow'>ᚲ</span>
                  Contact
                  <span className='text-yellow-300/80 animate-rune-glow'>ᚲ</span>
                </span>
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
