'use client';

import Header from '@/components/global/Header';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategoriesSection from '@/components/home/FeaturedCategoriesSection';
import AIFeaturesSection from '@/components/home/AIFeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { useAuthGuard } from '@/api/auth-api';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ReactNode } from 'react';

// Subtle curve transition between sections
const CurveTransition = () => (
  <div className="relative h-24 overflow-hidden">
    <svg className="absolute w-full h-24" preserveAspectRatio="none" viewBox="0 0 1440 48">
      <path 
        d="M0,48 L1440,48 L1440,0 C1139.77,15.97 771.1,24 0,0 Z" 
        fill="white" 
        fillOpacity="0.8"
      ></path>
    </svg>
  </div>
);

// Enhanced floating accent elements with intensity levels
const FloatingAccents = ({ 
  color = "blue", 
  intensity = "medium" 
}: { 
  color?: "blue" | "indigo" | "yellow";
  intensity?: "low" | "medium" | "high";
}) => {
  const colors = {
    blue: "bg-blue-400",
    indigo: "bg-indigo-400",
    yellow: "bg-yellow-400"
  };
  
  // Define different intensities
  const intensitySettings = {
    high: {
      count: 12,
      opacity: [0.2, 0.35],
      size: [25, 45],
      height: "h-48"
    },
    medium: {
      count: 9, 
      opacity: [0.15, 0.25],
      size: [20, 40],
      height: "h-36"
    },
    low: {
      count: 6,
      opacity: [0.1, 0.2],
      size: [15, 35],
      height: "h-36"
    }
  };
  
  const settings = intensitySettings[intensity];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  
  return (
    <motion.div 
      ref={ref}
      className={`absolute inset-x-0 ${settings.height} top-1/2 -translate-y-1/2 pointer-events-none overflow-visible z-20`}
    >
      {[...Array(settings.count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${colors[color]} blur-md`}
          initial={{ 
            x: -150 + Math.random() * 300, 
            y: -30 + Math.random() * 60,
            scale: 0,
            opacity: 0
          }}
          animate={isInView ? { 
            x: -40 + Math.random() * 80, 
            y: -20 + Math.random() * 40,
            scale: 0.5 + Math.random() * 0.8,
            opacity: settings.opacity[0] + Math.random() * (settings.opacity[1] - settings.opacity[0])
          } : {}}
          transition={{ 
            duration: 1.8 + Math.random() * 1.2, 
            delay: 0.08 * i,
            ease: "easeOut"
          }}
          style={{
            width: `${settings.size[0] + Math.random() * (settings.size[1] - settings.size[0])}px`,
            height: `${settings.size[0] + Math.random() * (settings.size[1] - settings.size[0])}px`,
            left: `${5 + (i * (90/settings.count)) + (Math.random() * 8 - 4)}%`,
          }}
        />
      ))}
    </motion.div>
  );
};

// Reveal animation for sections
const RevealSection = ({ 
  children, 
  direction = "up" 
}: { 
  children: ReactNode; 
  direction?: "up" | "down" | "left" | "right" 
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const variants = {
    up: { opacity: 0, y: 40 },
    down: { opacity: 0, y: -40 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 }
  };
  
  return (
    <motion.div
      ref={sectionRef}
      initial={variants[direction]}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ 
        duration: 0.9, 
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};

// Enhanced section wrapper with transition area and intensity
const SectionWithTransition = ({ 
  children, 
  accentColor = "blue", 
  direction = "up",
  intensity = "medium",
  isLast = false
}: { 
  children: ReactNode; 
  accentColor?: "blue" | "indigo" | "yellow"; 
  direction?: "up" | "down" | "left" | "right"; 
  intensity?: "low" | "medium" | "high";
  isLast?: boolean; 
}) => {
  // Adjust transition height and margins based on intensity
  const transitionHeight = intensity === "high" ? "h-48" : "h-36";
  const transitionMargins = intensity === "high" ? "-mt-16 -mb-16" : "-mt-12 -mb-12";
  
  return (
    <div className="relative">
      <RevealSection direction={direction}>
        {children}
      </RevealSection>
      
      {!isLast && (
        <div className={`relative ${transitionHeight} ${transitionMargins} z-10`}>
          <FloatingAccents color={accentColor} intensity={intensity} />
          <CurveTransition />
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  
  // Very subtle parallax effect
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
    >
      {/* Subtle floating background elements */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ y: parallaxY }}
      >
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-blue-50 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-indigo-50 opacity-25 blur-3xl"></div>
      </motion.div>
      
      <Header />
      
      <div className="relative z-10">
        {/* Hero Section (without transition wrapper) */}
        <HeroSection />
        
        {/* High-intensity transition between Hero and AI Features */}
        <div className="relative h-48 -mt-16 -mb-16 z-10">
          <FloatingAccents color="blue" intensity="high" />
          <CurveTransition />
        </div>
        
        {/* AI Features Section with medium transition to next section */}
        <SectionWithTransition accentColor="indigo" intensity="medium" direction="up">
          <AIFeaturesSection />
        </SectionWithTransition>
        
        {/* Featured Categories with medium transition to next section */}
        <SectionWithTransition accentColor="yellow" intensity="medium" direction="left">
          <FeaturedCategoriesSection />
        </SectionWithTransition>
        
        {/* Testimonials Section with no trailing transition */}
        <SectionWithTransition accentColor="blue" intensity="medium" direction="right" isLast={true}>
          <TestimonialsSection />
        </SectionWithTransition>
      </div>
    </motion.main>
  );
}