// File: booking-kos-frontend/app/rooms/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';

// Definisikan tipe data baru
interface RoomImage {
  id: number;
  path: string;
}

interface Room {
  id: number; name: string; description: string; size: string;
  price_monthly: number; price_daily: number | null; price_yearly: number | null;
  status: 'available' | 'booked' | 'maintenance';
  images: RoomImage[];
}

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function RoomDetailPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useAuth();
  const params = useParams<{ id: string }>();
  const id = params.id;

  useEffect(() => {
    if (!id) return;
    async function fetchRoomDetail() {
      const API_URL = `${BACKEND_URL}/api/rooms/${id}`;
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Kamar tidak ditemukan');
        const data = await res.json();
        setRoom(data.data);
      } catch (error) {
        setRoom(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRoomDetail();
  }, [id]);

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setMessage('Silakan pilih tanggal check-in dan check-out.');
      return;
    }
    if (!token) {
      setMessage('Anda harus login terlebih dahulu untuk melakukan booking.');
      return;
    }
    setMessage('Memproses booking...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: room?.id,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membuat booking.');
      setMessage(`Booking berhasil! Total harga: Rp ${new Intl.NumberFormat('id-ID').format(data.data.total_price)}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };
  
  const formatPrice = (price: number | null) => price ? `Rp ${new Intl.NumberFormat('id-ID').format(price)}` : 'Tidak Tersedia';

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!room) return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold">404 - Kamar Tidak Ditemukan</h1>
      <Link href="/" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">Kembali</Link>
    </div>
  );
  
  const [mainImage, ...otherImages] = room.images;

  return (
    <main className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">&gt;</span>
          <span>{room.name}</span>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{room.name}</h1>
          <p className="text-gray-600 mt-2">Alamat placeholder, Kota, Kode Pos</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-8">
              {mainImage ? (
                <div className="col-span-2">
                  <img src={`${BACKEND_URL}/storage/${mainImage.path}`} alt={`Foto utama ${room.name}`} className="w-full h-auto rounded-lg object-cover aspect-video"/>
                </div>
              ) : (
                <div className="col-span-2 bg-gray-200 rounded-lg flex items-center justify-center aspect-video">
                  <span className="text-gray-500">Tidak ada gambar</span>
                </div>
              )}
              {otherImages.map(image => (
                <img key={image.id} src={`${BACKEND_URL}/storage/${image.path}`} alt={`Foto tambahan ${room.name}`} className="w-full h-auto rounded-lg object-cover"/>
              ))}
            </div>
            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">Tentang Kamar Ini</h2>
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8 border rounded-lg p-6 shadow-lg">
              <div className="mb-4">
                <span className="text-gray-500">Mulai dari</span>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(room.price_monthly)}
                  <span className="text-base font-normal">/bulan</span>
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-in</label>
                  <input type="date" id="checkin" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
                </div>
                <div>
                  <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-out</label>
                  <input type="date" id="checkout" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
                </div>
              </div>
              <div className="mt-6">
                <button onClick={handleBooking} disabled={room.status !== 'available'} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
                  Booking Sekarang
                </button>
                {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
