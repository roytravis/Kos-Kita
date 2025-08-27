// File: booking-kos-frontend/app/admin/rooms/create/page.tsx
"use client";

import { useState, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateRoomPage() {
  const { token } = useAuth();
  const router = useRouter();

  // State untuk form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [priceMonthly, setPriceMonthly] = useState('');
  const [priceDaily, setPriceDaily] = useState('');
  const [priceYearly, setPriceYearly] = useState('');
  const [message, setMessage] = useState('');

  // State baru untuk menangani BANYAK file dan pratinjau
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fungsi untuk menangani perubahan pada input file
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);

      // Buat URL pratinjau untuk setiap file
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Menyimpan kamar...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('size', size);
    formData.append('price_monthly', priceMonthly);
    if (priceDaily) formData.append('price_daily', priceDaily);
    if (priceYearly) formData.append('price_yearly', priceYearly);
    
    // Lampirkan setiap file gambar ke FormData
    images.forEach(image => {
      formData.append('images[]', image); // Gunakan 'images[]' untuk mengirim array
    });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!res.ok) {
        const errors = await res.json();
        throw new Error(errors.message || 'Gagal menambahkan kamar baru.');
      }

      setMessage('Kamar baru berhasil ditambahkan! Mengarahkan kembali...');
      setTimeout(() => {
        router.push('/admin/rooms');
      }, 2000);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <main className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tambah Kamar Baru</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleCreateRoom} className="space-y-6">
          {/* Input Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Foto Kamar (Bisa lebih dari satu)</label>
            <input 
              type="file" 
              multiple // <-- Atribut penting untuk memilih banyak file
              onChange={handleImageChange} 
              className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {/* Pratinjau Gambar */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-lg" />
              ))}
            </div>
          </div>

          {/* Input lainnya... */}
          <div>
            <label htmlFor="name">Nama Kamar</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
          </div>
          <div>
            <label htmlFor="description">Deskripsi</label>
            <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded-md" rows={4}></textarea>
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
          
          <div className="flex justify-end space-x-4 pt-4">
            <Link href="/admin/rooms" className="text-gray-600">Batal</Link>
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">Simpan Kamar</button>
          </div>
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}
