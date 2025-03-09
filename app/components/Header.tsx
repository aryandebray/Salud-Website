'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Update header background
      setIsScrolled(window.scrollY > 50);

      // Update active section
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 150; // Offset for header

      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#menu', label: 'Menu' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 100; // Header height + some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu after clicking
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${isScrolled || isMobileMenuOpen ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
      <div className="w-full">
        <div className="container-custom mx-auto flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Salud Logo"
              width={160}
              height={60}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={`text-lg transition-all duration-300 relative ${
                  isScrolled ? 'text-brand hover:text-brand/80' : 'text-white hover:text-white/80'
                }`}
              >
                {label}
                {activeSection === href.replace('#', '') && (
                  <motion.div
                    layoutId="activeSection"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      isScrolled ? 'bg-brand' : 'bg-white'
                    }`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <Link 
              href="#reservation"
              onClick={(e) => handleNavClick(e, '#reservation')}
              className={`px-6 py-2 rounded-md transition-colors duration-300 ${
                isScrolled 
                  ? 'bg-brand text-white hover:bg-brand/90' 
                  : 'bg-white text-brand hover:bg-white/90'
              }`}
            >
              Reserve a Table
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${
              isMobileMenuOpen 
                ? 'bg-brand transform rotate-45 translate-y-2' 
                : isScrolled ? 'bg-brand' : 'bg-white'
            }`}></div>
            <div className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${
              isMobileMenuOpen 
                ? 'opacity-0' 
                : isScrolled ? 'bg-brand' : 'bg-white'
            }`}></div>
            <div className={`w-6 h-0.5 transition-all duration-300 ${
              isMobileMenuOpen 
                ? 'bg-brand transform -rotate-45 -translate-y-2' 
                : isScrolled ? 'bg-brand' : 'bg-white'
            }`}></div>
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 w-full bg-white z-40 flex flex-col"
              >
                <div className="container-custom pt-24 pb-8">
                  <nav className="flex flex-col gap-6">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={(e) => handleNavClick(e, href)}
                        className="text-xl text-brand hover:text-brand/80 transition-colors duration-300"
                      >
                        {label}
                      </Link>
                    ))}
                    <Link 
                      href="#reservation"
                      onClick={(e) => handleNavClick(e, '#reservation')}
                      className="bg-brand text-white px-6 py-3 rounded-md hover:bg-brand/90 transition-colors duration-300 text-center mt-4"
                    >
                      Reserve a Table
                    </Link>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
} 