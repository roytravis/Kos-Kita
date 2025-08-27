// File: booking-kos-frontend/components/RoomCard.tsx
import Link from 'next/link';

// Definisikan tipe data baru untuk gambar
interface RoomImage {
  id: number;
  path: string;
}

interface Room {
  id: number;
  name: string;
  description: string;
  size: string;
  price_monthly: number;
  status: 'available' | 'booked' | 'maintenance';
  images: RoomImage[]; // <-- Properti sekarang adalah array of images
}

interface RoomCardProps {
  room: Room;
}

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function RoomCard({ room }: RoomCardProps) {
  // Ambil gambar pertama dari array, atau gunakan placeholder jika tidak ada gambar
  const imageUrl = room.images && room.images.length > 0
    ? `${BACKEND_URL}/storage/${room.images[0].path}`
    : `https://placehold.co/600x400/E2E8F0/4A5568?text=${encodeURIComponent(room.name)}`;

  return (
    <Link href={`/rooms/${room.id}`} className="group block overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Foto ${room.name}`}
          className="w-full h-52 object-cover"
        />
        <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
          room.status === 'available' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {room.status === 'available' ? 'Tersedia' : 'Terisi'}
        </div>
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {room.name}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {room.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Mulai dari</p>
            <p className="text-xl font-bold text-gray-800">
              Rp {new Intl.NumberFormat('id-ID').format(room.price_monthly)}
              <span className="text-sm font-normal text-gray-500">/bulan</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 4.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m3 5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V3h8V.5a.5.5 0 0 1 1 0V3h1.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5H3V.5a.5.5 0 0 1 .5-.5m1 4v1.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V4H1v10h14V4h-3.5v1.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V4z" />
            </svg>
            <span>{room.size}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
