'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  adminNote?: string;
  createdAt: string;
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations');
      if (!response.ok) throw new Error('Failed to fetch reservations');
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      setUpdateStatus('Updating...');
      const response = await fetch(`/api/reservation/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNote,
        }),
      });

      if (!response.ok) throw new Error('Failed to update reservation');

      // Update local state
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, status, adminNote } : res
        )
      );
      setSelectedReservation(null);
      setAdminNote('');
      setUpdateStatus('Updated successfully!');
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (err) {
      setUpdateStatus('Failed to update');
      setTimeout(() => setUpdateStatus(''), 3000);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-4xl font-serif text-primary mb-8">Reservation Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservations List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-serif text-primary mb-4">Reservations</h2>
              
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      reservation.status === 'PENDING'
                        ? 'border-yellow-200 bg-yellow-50'
                        : reservation.status === 'CONFIRMED'
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{reservation.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(reservation.date)} at {reservation.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reservation.guests} guests
                        </p>
                        {reservation.specialRequests && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-semibold">Special Requests:</span>{' '}
                            {reservation.specialRequests}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            reservation.status === 'PENDING'
                              ? 'bg-yellow-200 text-yellow-800'
                              : reservation.status === 'CONFIRMED'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {reservation.status}
                        </span>
                        {reservation.status === 'PENDING' && (
                          <button
                            onClick={() => setSelectedReservation(reservation)}
                            className="block mt-2 text-primary hover:text-primary/80"
                          >
                            Manage
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-serif text-primary mb-4">
                {selectedReservation ? 'Update Reservation' : 'Select a Reservation'}
              </h2>

              {selectedReservation ? (
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold">{selectedReservation.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(selectedReservation.date)} at{' '}
                      {selectedReservation.time}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Note
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                      placeholder="Add a note (optional)"
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedReservation.id, 'CONFIRMED')
                      }
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Confirm Reservation
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedReservation.id, 'REJECTED')
                      }
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Reject Reservation
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReservation(null);
                        setAdminNote('');
                      }}
                      className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  {updateStatus && (
                    <p
                      className={`mt-3 text-center ${
                        updateStatus.includes('Failed')
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {updateStatus}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">
                  Select a pending reservation to confirm or reject it.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 