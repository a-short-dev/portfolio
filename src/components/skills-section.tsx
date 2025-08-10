"use client";

import React from "react";
import { motion } from "framer-motion";
import { BsUbuntu } from "react-icons/bs";
import { DiReact } from "react-icons/di";
import {
  FaDocker,
  FaGit,
  FaHtml5,
  FaJava,
  FaNodeJs,
  FaPhp,
} from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io";
import { RiTailwindCssLine } from "react-icons/ri";
import { SiAndroidstudio, SiNestjs, SiNginx } from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

interface SkillsSectionProps {
  skillsRef: React.RefObject<HTMLDivElement>;
}

const skills = [
  { icon: <FaHtml5 />, name: "HTML5", color: "from-orange-500 to-red-500" },
  { icon: <IoLogoJavascript />, name: "JavaScript", color: "from-yellow-400 to-yellow-600" },
  { icon: <FaJava />, name: "Java", color: "from-red-600 to-red-800" },
  { icon: <FaGit />, name: "Git", color: "from-orange-600 to-red-600" },
  { icon: <DiReact />, name: "React", color: "from-blue-400 to-blue-600" },
  { icon: <FaNodeJs />, name: "Node.js", color: "from-green-500 to-green-700" },
  { icon: <RiTailwindCssLine />, name: "Tailwind", color: "from-cyan-400 to-blue-500" },
  { icon: <FaPhp />, name: "PHP", color: "from-purple-600 to-indigo-600" },
  { icon: <TbBrandReactNative />, name: "React Native", color: "from-blue-500 to-purple-600" },
  { icon: <SiNestjs />, name: "NestJS", color: "from-red-500 to-pink-600" },
  { icon: <SiAndroidstudio />, name: "Android", color: "from-green-400 to-green-600" },
  { icon: <BsUbuntu />, name: "Ubuntu", color: "from-orange-500 to-red-600" },
  { icon: <SiNginx />, name: "Nginx", color: "from-green-500 to-emerald-600" },
  { icon: <FaDocker />, name: "Docker", color: "from-blue-500 to-blue-700" },
];

export default function SkillsSection({ skillsRef }: SkillsSectionProps) {
  return (
    <section 
      ref={skillsRef}
      className='section-reveal py-32 relative overflow-hidden' 
      id='skills-and-tools'
    >
      {/* Norse runes */}
      <div className="absolute top-20 right-20 text-4xl text-orange-400/15 animate-rune-glow">ᚨ</div>
      <div className="absolute bottom-20 left-20 text-5xl text-red-400/15 animate-rune-glow">ᛗ</div>
      
      <div className='text-center mb-24 relative'>
        <div className='mb-6'>
          <h2 className='rune-border text-5xl md:text-6xl font-bold mb-6 relative'>
            <span className='runic-text'>Arsenal of Power</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 blur-3xl -z-10 animate-asgard-glow" />
          </h2>
          {/* Weapon divider */}
          <div className='flex items-center justify-center gap-4 mb-8'>
            <div className='text-yellow-400 text-xl animate-rune-glow'>🔨</div>
            <div className='w-32 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full animate-asgard-glow' />
            <div className='text-yellow-400 text-xl animate-rune-glow'>⚡</div>
          </div>
        </div>
        <p className='text-xl text-amber-300/80 max-w-3xl mx-auto leading-relaxed'>
          <span className='text-amber-200'>Wielding the ancient tools of creation</span>, each technology mastered through countless battles in the realm of code.
        </p>
      </div>
      
      <div className='text-center mb-20'>
        <h3 className='text-3xl md:text-4xl font-bold text-amber-200 mb-4 relative'>
          Weapons & Tools of War
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-2xl -z-10" />
        </h3>
        <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full animate-pulse' />
        <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
          Technologies I work with to bring ideas to life
        </p>
      </div>
      
      <div className='flex flex-wrap gap-6 items-center justify-center w-full max-w-5xl mx-auto'>
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className='group relative'
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
            <div className='norse-glass asgard-border relative flex flex-col items-center justify-center p-6 rounded-2xl text-center transition-all duration-300 hover:scale-110 min-w-[120px] min-h-[120px]'>
              <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 text-amber-300 group-hover:text-yellow-400`}>
                {skill.icon}
              </div>
              <span className='text-sm font-medium text-amber-200 group-hover:text-yellow-300 transition-colors duration-300'>
                {skill.name}
              </span>
              <div className='absolute -top-1 -right-1 text-xs text-yellow-400/40 animate-rune-glow'>⚡</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}