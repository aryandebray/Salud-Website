'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '1',
    specialRequests: ''
  });

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [status, setStatus] = useState({
    type: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Generate available dates for the next 3 months
    const dates: string[] = [];
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    let currentDate = new Date(today);
    while (currentDate <= threeMonthsFromNow) {
      const day = currentDate.getDay();
      if (day === 5 || day === 6 || day === 0) { // Friday, Saturday, Sunday
        dates.push(currentDate.toISOString().split('T')[0]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setAvailableDates(dates);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          time: '19:00' // Default time set to 7:00 PM
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: data.message || 'Reservation request received! Please check your email for confirmation.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          guests: '1',
          specialRequests: ''
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: data.error || 'Failed to submit reservation. Please try again or contact us directly.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again later or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="section-padding bg-primary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Request Reservation</h2>
          <p className="text-lg text-gray-200">
            Book your table at Salud and experience authentic Thai cuisine
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-xl"
        >
          {status.message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="guests" className="block text-gray-700 mb-2 font-medium">
                Number of Guests
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date" className="block text-gray-700 mb-2 font-medium">
                Date (Weekends Only)
              </label>
              <select
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a date</option>
                {availableDates.map(date => {
                  const dateObj = new Date(date);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                  const formattedDate = dateObj.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                  return (
                    <option key={date} value={date}>
                      {dayName}, {formattedDate}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mt-6 form-group">
            <label htmlFor="specialRequests" className="block text-gray-700 mb-2 font-medium">
              Special Requests
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any special requests or dietary requirements?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-8 bg-primary text-white py-3 rounded-md transition-all duration-300 font-medium ${
              isSubmitting
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-primary/90'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Reserve Table'}
          </button>
        </motion.form>
      </div>
    </section>
  );
} 
