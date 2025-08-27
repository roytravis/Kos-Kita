// File: booking-kos-frontend/app/admin/rooms/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditRoomPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  // State untuk form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [priceMonthly, setPriceMonthly] = useState('');
  const [priceDaily, setPriceDaily] = useState('');
  const [priceYearly, setPriceYearly] = useState('');
  const [status, setStatus] = useState('available');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Ambil data kamar yang akan diedit
  useEffect(() => {
    if (!id) return;
    async function fetchRoomData() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/rooms/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Gagal mengambil data kamar.');
        const data = await res.json();
        const room = data.data;
        // Isi state form dengan data yang ada
        setName(room.name);
        setDescription(room.description);
        setSize(room.size);
        setPriceMonthly(room.price_monthly);
        setPriceDaily(room.price_daily || '');
        setPriceYearly(room.price_yearly || '');
        setStatus(room.status);
      } catch (error) {
        setMessage('Error: Gagal memuat data kamar.');
      } finally {
        setLoading(false);
      }
    }
    fetchRoomData();
  }, [id, token]);

  // 2. Fungsi untuk mengirim data yang sudah diupdate
  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Memperbarui kamar...');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/rooms/${id}`, {
        method: 'PUT', // Gunakan method PUT untuk update
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name, description, size, status,
          price_monthly: priceMonthly,
          price_daily: priceDaily || null,
          price_yearly: priceYearly || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui kamar.');
      }

      setMessage('Kamar berhasil diperbarui! Mengarahkan kembali...');
      setTimeout(() => router.push('/admin/rooms'), 2000);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className="p-8">Loading form edit...</div>;

  return (
    <main className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Kamar: {name}</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleUpdateRoom} className="space-y-6">
          {/* Form input sama seperti halaman create, ditambah input status */}
          <div>
            <label htmlFor="name">Nama Kamar</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
          </div>
          <div>
            <label htmlFor="description">Deskripsi</label>
            <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded-md" rows={4}></textarea>
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-white">
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label htmlFor="size">Ukuran (cth: 3x4m)</label>
            <input id="size" type="text" required value={size} onChange={(e) => setSize(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="priceMonthly">Harga Bulanan</label>
              <input id="priceMonthly" type="number" required value={priceMonthly} onChange={(e) => setPriceMonthly(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <div>
              <label htmlFor="priceDaily">Harga Harian</label>
              <input id="priceDaily" type="number" value={priceDaily} onChange={(e) => setPriceDaily(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <div>
              <label htmlFor="priceYearly">Harga Tahunan</label>
              <input id="priceYearly" type="number" value={priceYearly} onChange={(e) => setPriceYearly(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link href="/admin/rooms" className="text-gray-600 hover:underline">Batal</Link>
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Simpan Perubahan</button>
          </div>
          {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </main>
  );
}
