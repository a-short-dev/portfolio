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
        <header className='fixed top-0 left-0 right-0 z-50 h-20 backdrop-blur-md bg-slate-900/80 border-b border-gray-800/50 transition-all duration-300'>
          <div className='w-full mx-auto max-w-7xl px-5 h-full flex items-center justify-between'>
            <Link href='/' className='group'>
              <h1 className='font-marlish font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300'>
                SHORT DEV
              </h1>
            </Link>

            <nav className='hidden md:flex items-center gap-8'>
              <Link 
                href='#projects' 
                className='text-gray-300 hover:text-white font-marlish font-medium transition-colors duration-300 relative group'
              >
                Projects
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link 
                href='#skills-and-tools' 
                className='text-gray-300 hover:text-white font-marlish font-medium transition-colors duration-300 relative group'
              >
                Skills
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link 
                href='#abilities' 
                className='text-gray-300 hover:text-white font-marlish font-medium transition-colors duration-300 relative group'
              >
                Abilities
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300'></span>
              </Link>
              <Link 
                href='#contact' 
                className='px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-marlish font-medium rounded-full transition-all duration-300 transform hover:scale-105'
              >
                Contact
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
