'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="section-padding bg-accent">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-primary">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Welcome to Salud, where authentic Italian cuisine meets modern elegance. Our passion
              for traditional Italian cooking is reflected in every dish we serve, prepared with
              the finest ingredients and time-honored recipes passed down through generations.
            </p>
            <p className="text-gray-700 mb-6">
              Our expert chefs bring the heart of Italy to your plate, creating an unforgettable
              dining experience that celebrates the rich culinary heritage of Italy while
              embracing contemporary cooking techniques.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/restaurant-interior.jpg"
              alt="Salud Restaurant Interior"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 