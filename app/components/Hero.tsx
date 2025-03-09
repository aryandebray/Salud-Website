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
            objectPosition: 'center 30%' // Adjust this value to focus on the best part of your image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>
      
      <div className="relative container-custom h-full">
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-2xl absolute top-1/2 -translate-y-1/2"
        >
          <h1 className="font-serif text-6xl md:text-7xl mb-6 drop-shadow-lg">
            Welcome to Salud
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-md">
            Experience authentic Italian cuisine in an elegant atmosphere
          </p>
          <div className="flex gap-4">
            <Link 
              href="#reservation" 
              className="btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Make a Reservation
            </Link>
            <Link 
              href="#menu" 
              className="border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-brand transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 