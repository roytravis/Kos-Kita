// File: booking-kos-frontend/app/admin/rooms/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definisikan tipe data untuk Room
interface Room {
  id: number;
  name: string;
  price_monthly: number;
  status: string;
}

export default function AdminRoomsPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data kamar
  const fetchRooms = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal mengambil data kamar.');
      const data = await res.json();
      setRooms(data.data);
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
    fetchRooms();
  }, [token, user, router]);

  // Fungsi untuk menghapus kamar
  const handleDelete = async (roomId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kamar ini? Aksi ini tidak bisa dibatalkan.')) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Gagal menghapus kamar.');
      }
      
      alert('Kamar berhasil dihapus.');
      // Ambil ulang data kamar untuk memperbarui daftar
      fetchRooms(); 
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menghapus kamar.');
    }
  };

  if (loading) return <div className="p-8">Loading data kamar...</div>;

  return (
    <main className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Kamar</h1>
        <Link href="/admin/rooms/create" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
          + Tambah Kamar Baru
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Nama Kamar</th>
                <th className="px-4 py-2 text-left">Harga Bulanan</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{room.name}</td>
                  <td className="px-4 py-3">Rp {new Intl.NumberFormat('id-ID').format(room.price_monthly)}</td>
                  <td className="px-4 py-3">
                    <span className={`capitalize p-2 text-xs font-semibold rounded-full ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {/* --- PERUBAHAN DI SINI --- */}
                    <Link href={`/admin/rooms/edit/${room.id}`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:underline">Delete</button>
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
