'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function OurStory() {
  return (
    <section id="about" className="section-padding bg-[#F7E6D3]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-[#C08261] mb-4">Our Story</h2>
          <p className="text-lg text-gray-600">
            A journey of passion, tradition, and culinary excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/restaurant-interior.jpg"
              alt="Salud Restaurant Interior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-gray-700 leading-relaxed">
              Founded in 2024, Salud emerged from a deep appreciation for authentic Italian cuisine and a desire to create a dining experience that transcends the ordinary. Our name, "Salud," meaning "health" in Spanish, reflects our commitment to using fresh, high-quality ingredients and traditional cooking methods.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Every dish at Salud tells a story—a story of heritage, passion, and the joy of sharing good food with loved ones. Our menu is carefully curated to bring you the authentic flavors of Italy, from classic pasta dishes to innovative culinary creations.
            </p>
          </motion.div>
        </div>

        {/* About the Chef Section */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-[#C08261] mb-4">About the Chef</h2>
          </motion.div>

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
              sizes="(max-width: 768px) 100vw, 50vw"
            />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gray-700 leading-relaxed">
                I'm Anishka and my path to the kitchen wasn't conventional. I studied Mass Communication and Journalism at St. Xavier's College, Kolkata, followed by a Master's in Audio-Visual Production from St. Xavier's University, Kolkata. But storytelling through words wasn't enough—I wanted to tell stories through food.
              </p>
              <p className="text-gray-700 leading-relaxed">
                That calling led me to Switzerland, where I trained at the Culinary Arts Academy and worked at Sapori, a Michelin-guided restaurant in Interlaken. There, I learned the precision, artistry, and intensity of fine dining, but I always knew my journey would bring me home.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 