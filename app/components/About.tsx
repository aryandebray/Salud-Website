'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="section-padding bg-accent">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-primary">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Some journeys begin with a plan, but mine began with a craving—not just for food, but for something deeper. A craving for connection, for creation, and for the kind of magic that happens when people sit down together to share a meal. Salud was born from that craving—a supper club where flavors, cultures, and people come together in an intimate, ever-evolving dining experience.
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

        {/* About the Chef Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden bg-gray-200"
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <Image
              src="/chef.jpg"
              alt="Salud Restaurant Interior"
              fill
              className="object-cover"
            />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-primary">About the Chef</h2>
            <p className="text-gray-700 mb-6">
              I'm Anishka and my path to the kitchen wasn't conventional. I studied Mass Communication and Journalism at St. Xavier's College, Kolkata, followed by a Master's in Audio-Visual Production from St. Xavier's University, Kolkata. But storytelling through words wasn't enough—I wanted to tell stories through food.
            </p>
            <p className="text-gray-700">
              That calling led me to Switzerland, where I trained at the Culinary Arts Academy and worked at Sapori, a Michelin-guided restaurant in Interlaken. There, I learned the precision, artistry, and intensity of fine dining, but I always knew my journey would bring me home.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 