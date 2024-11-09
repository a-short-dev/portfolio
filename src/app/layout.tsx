import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${marlish.variable} ${open_sans.variable} w-full dark:bg-slate-950 bg-slate-900 antialiased min-h-screen`}
      >
        <header className="h-20 w-full z-30 backdrop-blur-sm p-5 flex-items-center top fixed left-0 border-b flex items-center shadow-sm">
          <div>
            <h1 className="font-marlish font-semibold text-gray-500 text-xl">
              SHORT DEV
            </h1>

            <div></div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
