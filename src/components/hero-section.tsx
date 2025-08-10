"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { FaGit, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { gsap } from "gsap";


interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSection({ heroRef }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Entrance animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { 
          opacity: 0, 
          y: 50
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          ease: "power3.out",
          delay: 0.3
        }
      );
    }
  }, []);

  return (
    <section ref={heroRef} className='w-full flex items-center min-h-screen justify-center relative overflow-hidden pt-32 pb-16'>
      {/* Norse floating runes and embers */}
      <div className="absolute top-32 left-10 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-viking-float opacity-70" />
      <div className="absolute top-48 right-20 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ragnarok-pulse opacity-60" />
      <div className="absolute bottom-40 left-20 w-2.5 h-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-asgard-glow opacity-80" />
      <div className="absolute top-72 left-1/3 text-2xl text-yellow-400/30 animate-rune-glow">ᚱ</div>
      <div className="absolute bottom-60 right-1/4 text-xl text-orange-400/25 animate-rune-glow">ᚦ</div>
      <div className="absolute top-1/3 right-10 text-lg text-red-400/20 animate-rune-glow">ᚢ</div>
      

      
      <div className='text-center max-w-6xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 relative'>
          {/* Norse title with runic styling */}
          <h1 ref={titleRef} className='rune-border hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-10 font-bold leading-tight relative'>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent font-bold" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#fbbf24'}}>Greetings, I am Oluwaleke!</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-3xl -z-10 animate-asgard-glow" />
            {/* Epic glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-red-500/10 blur-2xl rounded-full animate-ragnarok-pulse" />
          </h1>
          {/* Norse divider */}
          <div className='flex items-center justify-center gap-4 mb-12'>
            <div className='text-yellow-400 text-2xl animate-rune-glow'>᚛</div>
            <div className='w-32 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-asgard-glow' />
            <div className='text-yellow-400 text-2xl animate-rune-glow'>᚜</div>
          </div>
        </div>
        
        <div className='space-y-10 mb-20'>
          <p className='hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-4xl mx-auto leading-relaxed'>
            <span className='text-amber-200'>Warrior of Code</span>, forging{" "}
            <span className='runic-text font-medium text-2xl'>
              legendary digital realms
            </span>
            {" "}with the power of full-stack mastery.
          </p>
          
          <p className='hero-description text-base sm:text-lg md:text-xl max-w-4xl mx-auto text-amber-300/80 leading-relaxed'>
            ⚔️ Battle-tested in web & mobile development • 🛡️ Guardian of scalable architectures • 🔥 Forged by curiosity and tempered by experience
          </p>
          

        </div>

        {/* Norse-themed social links */}
        <div className='hero-social flex items-center justify-center gap-6 sm:gap-8 flex-wrap'>
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-asgard-glow" />
            <Link
              href='https://github.com/a-short-dev'
              className='norse-glass asgard-border relative flex items-center justify-center p-5 rounded-xl text-2xl font-bold shadow-2xl transition-all duration-300 hover:scale-110 animate-mjolnir-strike group-hover:animate-mjolnir-strike'
            >
              <FaGit className='text-amber-300 group-hover:text-yellow-400 transition-colors duration-300' />
              <div className='absolute -top-1 -right-1 text-xs text-yellow-400/60 animate-rune-glow'>ᚷ</div>
            </Link>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-asgard-glow" />
            <Link
              href='https://www.linkedin.com/in/ashortdev/'
              className='norse-glass asgard-border relative flex items-center justify-center p-5 rounded-xl text-2xl font-bold shadow-2xl transition-all duration-300 hover:scale-110 animate-mjolnir-strike group-hover:animate-mjolnir-strike'
             >
               <FaLinkedinIn className='text-blue-300 group-hover:text-cyan-400 transition-colors duration-300' />
               <div className='absolute -top-1 -right-1 text-xs text-cyan-400/60 animate-rune-glow'>ᛚ</div>
             </Link>
           </div>

           <div className="group relative">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-asgard-glow" />
             <Link
               href='https://x.com/a_short_dev'
               className='norse-glass asgard-border relative flex items-center justify-center p-5 rounded-xl text-2xl font-bold shadow-2xl transition-all duration-300 hover:scale-110 animate-mjolnir-strike group-hover:animate-mjolnir-strike'
             >
               <FaXTwitter className='text-slate-300 group-hover:text-gray-200 transition-colors duration-300' />
               <div className='absolute -top-1 -right-1 text-xs text-gray-400/60 animate-rune-glow'>ᛪ</div>
             </Link>
           </div>
         </div>
         

       </div>
     </section>
  );
}