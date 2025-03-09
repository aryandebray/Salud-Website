'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: ReservationStatus;
  adminNote?: string;
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | ReservationStatus>('ALL');
  const router = useRouter();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
      setError('');
    } catch (err) {
      setError('Failed to load reservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus, adminNote?: string) => {
    try {
      setUpdatingId(id);
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNote }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update reservation');
      }
      
      await fetchReservations();
      setError('');
    } catch (err) {
      setError('Failed to update reservation');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      setUpdatingId(id);
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete reservation');
      }
      
      await fetchReservations();
      setError('');
    } catch (err) {
      setError('Failed to delete reservation');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReservations = filter === 'ALL' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C08261]"></div>
    </div>
  );

  return (
    <>
      <div className="bg-[#F7E6D3] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {(['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    filter === status
                      ? 'bg-[#C08261] text-white'
                      : 'bg-white text-[#C08261] border border-[#C08261] hover:bg-[#F7E6D3]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={async () => {
                  await fetch('/api/admin/logout', { method: 'POST' });
                  window.location.href = '/admin/login';
                }}
                className="px-4 py-2 bg-[#C08261] text-white rounded-md hover:bg-[#B4724F] transition-colors duration-200"
              >
                Logout
              </button>
              <img 
                src="/logo.png" 
                alt="Salud Logo" 
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReservations.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-[#C08261]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-[#C08261]">No reservations</h3>
              <p className="mt-1 text-sm text-gray-500">No reservations found for the selected filter.</p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div key={reservation.id} className="bg-white overflow-hidden shadow rounded-lg border border-[#F7E6D3]">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[#C08261]">{reservation.name}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="flex items-center">
                          <svg className="mr-2 h-4 w-4 text-[#C08261]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {reservation.email}
                        </p>
                        <p className="flex items-center mt-1">
                          <svg className="mr-2 h-4 w-4 text-[#C08261]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {reservation.phone}
                        </p>
                        <p className="flex items-center mt-1">
                          <svg className="mr-2 h-4 w-4 text-[#C08261]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                        </p>
                        <p className="flex items-center mt-1">
                          <svg className="mr-2 h-4 w-4 text-[#C08261]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {reservation.guests} guests
                        </p>
                      </div>
                      {reservation.specialRequests && (
                        <div className="mt-3 text-sm">
                          <p className="font-medium text-[#C08261]">Special Requests:</p>
                          <p className="mt-1 text-gray-600">{reservation.specialRequests}</p>
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
                {reservation.status === 'PENDING' ? (
                  <div className="px-4 py-4 sm:px-6 bg-[#FFFBF5] border-t border-[#F7E6D3]">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'CONFIRMED')}
                        disabled={updatingId === reservation.id}
                        className="flex-1 bg-[#C08261] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#9A6B50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C08261] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {updatingId === reservation.id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Confirming...
                          </span>
                        ) : 'Confirm'}
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'REJECTED')}
                        disabled={updatingId === reservation.id}
                        className="flex-1 bg-white text-[#C08261] border border-[#C08261] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#F7E6D3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C08261] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {updatingId === reservation.id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#C08261]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Rejecting...
                          </span>
                        ) : 'Reject'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-4 sm:px-6 bg-[#FFFBF5] border-t border-[#F7E6D3]">
                    <button
                      onClick={() => deleteReservation(reservation.id)}
                      disabled={updatingId === reservation.id}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {updatingId === reservation.id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Deleting...
                        </span>
                      ) : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
} 