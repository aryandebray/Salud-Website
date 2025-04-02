'use client';

import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Address',
      content: '5 Dr. S N Roy Road Kol-29. Beside Menoka Cinema Hall'
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: '+91 9831175550'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'salud.calcutta@gmail.com'
    },
    {
      icon: ClockIcon,
      title: 'Hours',
      content: 'Fri-Sun: 7:00 PM - 10:00 PM'
    }
  ];

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">Contact Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or want to make a special arrangement? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((item, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-accent hover:shadow-lg transition-shadow duration-300">
              <item.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.816220461347!2d88.34811787628028!3d22.511077435220447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0270cdcd612251%3A0x246592a938455340!2sMenoka%20Cinema%20Hall!5e0!3m2!1sen!2sin!4v1741446275845!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            title="Salud Restaurant Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
} 