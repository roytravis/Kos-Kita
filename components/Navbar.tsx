// File: booking-kos-frontend/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  // Ambil 'user' juga dari useAuth()
  const { token, user, logout } = useAuth(); 

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          KosKita
        </Link>
        <div className="space-x-4 flex items-center">
          {token ? (
            // Jika ada token (sudah login)
            <>
              {/* Tambahkan pengecekan role untuk link admin */}
              {user && user.role === 'admin' && (
                <Link href="/admin/dashboard" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">
                Dashboard
              </Link>
              <span className="text-gray-700">Selamat Datang!</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // Jika tidak ada token (belum login)
            <>
              <Link href="/login" className="text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}