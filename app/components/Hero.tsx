'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative h-screen">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Salud Restaurant Ambiance"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={100}
          style={{
            objectPosition: 'center 30%'
          }}
        />
        {/* Light gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
      </div>
      
      <div className="relative container-custom h-full">
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-2xl absolute top-1/2 -translate-y-1/2"
        >
          {/* Decorative line with increased width */}
          <div className="w-32 h-1 bg-[#0B4D2C] mb-8 rounded-full shadow-lg" />
          
          <h1 className="font-serif text-6xl md:text-7xl mb-6 drop-shadow-xl leading-tight">
            Welcome to <span className="text-[#0B4D2C] font-bold">Salud</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-lg max-w-xl font-medium">
            Where every meal tells a story
          </p>
          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="#reservation" 
                className="btn-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                Make a Reservation
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="#menu" 
                className="border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-brand transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                View Menu
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-300">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 