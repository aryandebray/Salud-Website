'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MenuItem {
  name: string;
  description: string;
  price: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  image: string;
}

export default function Menu() {
  const [activeSection, setActiveSection] = useState('appetizers');

  const menuSections: { [key: string]: MenuSection } = {
    appetizers: {
      title: "Appetizers",
      image: "/menu/appetizers.jpg",
      items: [
        {
          name: "Bruschetta Classica",
          description: "Grilled bread rubbed with garlic, topped with fresh tomatoes, basil, and extra virgin olive oil",
          price: "$8.95"
        },
        {
          name: "Calamari Fritti",
          description: "Crispy fried calamari served with marinara sauce and lemon wedges",
          price: "$12.95"
        },
        {
          name: "Caprese",
          description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
          price: "$10.95"
        },
        {
          name: "Antipasto Misto",
          description: "Selection of Italian cured meats, cheeses, and marinated vegetables",
          price: "$15.95"
        }
      ]
    },
    mains: {
      title: "Main Course",
      image: "/menu/mains.jpg",
      items: [
        {
          name: "Osso Buco",
          description: "Braised veal shanks with gremolata, served with saffron risotto",
          price: "$32.95"
        },
        {
          name: "Spaghetti alle Vongole",
          description: "Spaghetti with fresh clams in white wine garlic sauce",
          price: "$24.95"
        },
        {
          name: "Bistecca Fiorentina",
          description: "Grilled T-bone steak with rosemary and garlic, served with roasted potatoes",
          price: "$38.95"
        },
        {
          name: "Risotto ai Funghi",
          description: "Creamy mushroom risotto with truffle oil and parmesan",
          price: "$26.95"
        }
      ]
    },
    desserts: {
      title: "Desserts",
      image: "/menu/desserts.jpg",
      items: [
        {
          name: "Tiramisu",
          description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
          price: "$8.95"
        },
        {
          name: "Panna Cotta",
          description: "Vanilla bean panna cotta with berry compote",
          price: "$7.95"
        },
        {
          name: "Cannoli",
          description: "Sicilian pastry filled with sweet ricotta and chocolate chips",
          price: "$6.95"
        },
        {
          name: "Gelato Assortito",
          description: "Selection of house-made Italian ice cream",
          price: "$7.95"
        }
      ]
    },
    drinks: {
      title: "Drinks",
      image: "/menu/drinks.jpg",
      items: [
        {
          name: "Italian Red Wines",
          description: "Selection of premium Italian red wines (by glass)",
          price: "$9-15"
        },
        {
          name: "Aperitivo Spritz",
          description: "Prosecco, Aperol, and soda water",
          price: "$11.95"
        },
        {
          name: "Espresso",
          description: "Traditional Italian coffee",
          price: "$3.95"
        },
        {
          name: "Limoncello",
          description: "House-made Italian lemon liqueur",
          price: "$8.95"
        }
      ]
    }
  };

  return (
    <section id="menu" className="section-padding bg-accent">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Savor the authentic flavors of Italy with our carefully curated menu
          </p>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(menuSections).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeSection === section
                  ? 'bg-primary text-white'
                  : 'bg-accent text-primary hover:bg-primary/10'
              }`}
            >
              {menuSections[section].title}
            </button>
          ))}
        </div>

        {/* Menu Content */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Menu Image */}
          <motion.div
            key={`${activeSection}-image`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[600px] sticky top-24"
          >
            <Image
              src={menuSections[activeSection].image}
              alt={menuSections[activeSection].title}
              fill
              className="object-cover rounded-lg shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
            <h3 className="absolute bottom-6 left-6 text-3xl font-serif text-white">
              {menuSections[activeSection].title}
            </h3>
          </motion.div>

          {/* Menu Items */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6"
          >
            {menuSections[activeSection].items.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-serif text-primary mb-2">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <span className="text-lg font-semibold text-primary whitespace-nowrap">
                    {item.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 