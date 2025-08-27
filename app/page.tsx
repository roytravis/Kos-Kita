// File: booking-kos-frontend/app/page.tsx
import RoomCard from '@/components/RoomCard';

// Definisikan tipe data baru
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
  images: RoomImage[];
}

// Fungsi untuk mengambil data kamar dari API Laravel
async function getRooms(): Promise<Room[]> {
  const API_URL = 'http://127.0.0.1:8000/api/rooms';
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal mengambil data dari server');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return [];
  }
}

// Komponen utama untuk halaman Home
export default async function HomePage() {
  const rooms = await getRooms();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center bg-gray-800 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img 
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop" 
          alt="Interior kos yang nyaman"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Temukan Kos Impianmu
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Hunian modern dan nyaman di lokasi strategis menantimu.
          </p>
          <div className="mt-8">
            <input 
              type="text" 
              placeholder="Cari berdasarkan lokasi atau nama kos..."
              className="w-full max-w-lg p-4 rounded-lg text-gray-800"
            />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Pilihan Kamar Untukmu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-xl">Saat ini belum ada kamar yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
