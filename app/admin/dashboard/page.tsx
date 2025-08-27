// File: booking-kos-frontend/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definisikan tipe data
interface Booking {
  id: number;
  check_in_date: string;
  status: string;
  room: { name: string };
  user: { name: string };
}

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data booking
  const fetchBookings = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal mengambil data admin.');
      const data = await res.json();
      setBookings(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [token, user, router]);

  // Fungsi untuk menangani perubahan status
  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui status.');
      }
      
      alert('Status berhasil diperbarui.');
      // Perbarui state secara lokal agar UI langsung berubah
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan.');
    }
  };

  if (loading) return <div className="p-8">Loading Admin Dashboard...</div>;

  return (
    <main className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/rooms" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold">Manajemen Kamar</h2>
          <p className="mt-2 text-gray-600">Tambah, edit, atau hapus data kamar kos.</p>
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Semua Booking</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Penyewa</th>
                <th className="px-4 py-2 text-left">Kamar</th>
                <th className="px-4 py-2 text-left">Check-in</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b">
                  <td className="px-4 py-3">{booking.user.name}</td>
                  <td className="px-4 py-3">{booking.room.name}</td>
                  <td className="px-4 py-3">{new Date(booking.check_in_date).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <span className={`capitalize p-2 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="p-1 border rounded-md bg-white text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
