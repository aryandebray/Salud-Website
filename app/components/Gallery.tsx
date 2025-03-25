'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Gallery() {
  const images = [
    {
      src: '/gallery/pasta.jpg',
      alt: 'Fresh Italian Pasta',
      title: 'Handmade'
    },
    {
      src: '/gallery/pizza.jpg',
      alt: 'Wood-fired Pizza',
      title: 'Authentic'
    },
    {
      src: '/gallery/wine.jpg',
      alt: 'Wine Selection',
      title: 'Fine'
    },
    {
      src: '/gallery/dessert.jpg',
      alt: 'Italian Desserts',
      title: 'Sweet'
    },
    {
      src: '/gallery/interior.jpg',
      alt: 'Restaurant Interior',
      title: 'Elegant'
    },
    {
      src: '/gallery/chef.jpg',
      alt: 'Our Chef',
      title: 'Expert Chef'
    }
  ];

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Our Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
          An intimate dining experience in Kolkata with a rotational menu, celebrating global flavors. 
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative h-[300px] group overflow-hidden rounded-lg"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-2xl font-serif">{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 