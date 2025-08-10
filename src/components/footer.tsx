"use client";

import React from "react";
import Link from "next/link";
import { FaGit, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className='relative py-20 text-center overflow-hidden'>
      {/* Norse footer background */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-orange-900/10 to-transparent" />
      <div className="absolute top-10 left-1/4 text-3xl text-yellow-400/10 animate-rune-glow">ᚹ</div>
      <div className="absolute bottom-10 right-1/4 text-2xl text-red-400/10 animate-rune-glow">ᛟ</div>
      
      <div className='relative z-10 space-y-8'>
        <div className='max-w-2xl mx-auto'>
          <p className='text-lg text-amber-300/80 mb-6'>
            ⚔️ <span className='text-amber-200'>Forging legends in the realm of code</span>, one epic project at a time.
          </p>
          <div className='flex items-center justify-center gap-4 mb-8'>
            <div className='text-yellow-400 text-lg animate-rune-glow'>ᚱ</div>
            <div className='w-24 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-asgard-glow' />
            <div className='text-yellow-400 text-lg animate-rune-glow'>ᚢ</div>
          </div>
        </div>
        
        <div className='flex items-center justify-center gap-6 mb-8'>
          <Link
            href='https://github.com/a-short-dev'
            className='norse-glass asgard-border flex items-center justify-center p-4 rounded-xl text-xl transition-all duration-300 hover:scale-110 animate-mjolnir-strike group'
          >
            <FaGit className='text-amber-300 group-hover:text-yellow-400 transition-colors duration-300' />
            <div className='absolute -top-1 -right-1 text-xs text-yellow-400/50 animate-rune-glow'>ᚷᛁᛏ</div>
          </Link>
          
          <Link
            href='https://www.linkedin.com/in/ashortdev/'
            className='norse-glass asgard-border flex items-center justify-center p-4 rounded-xl text-xl transition-all duration-300 hover:scale-110 animate-asgard-glow group'
          >
            <FaLinkedinIn className='text-blue-300 group-hover:text-cyan-400 transition-colors duration-300' />
            <div className='absolute -top-1 -right-1 text-xs text-cyan-400/50 animate-rune-glow'>ᛚᛁᚾᚲ</div>
          </Link>
          
          <Link
            href='https://x.com/a_short_dev'
            className='norse-glass asgard-border flex items-center justify-center p-4 rounded-xl text-xl transition-all duration-300 hover:scale-110 animate-ragnarok-pulse group'
          >
            <FaXTwitter className='text-slate-300 group-hover:text-gray-200 transition-colors duration-300' />
            <div className='absolute -top-1 -right-1 text-xs text-gray-400/50 animate-rune-glow'>ᛪᛏᚹᛁᛏ</div>
          </Link>
        </div>
        
        <div className='text-sm text-stone-400'>
          <p>© 2024 Oluwaleke • <span className='text-amber-400'>Warrior of the Digital Realm</span> • Built with ⚡ and 🔥</p>
        </div>
      </div>
    </footer>
  );
}