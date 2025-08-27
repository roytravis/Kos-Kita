<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon; // Import Carbon untuk manipulasi tanggal

class BookingController extends Controller
{
    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        // 1. Validasi input
        $validator = Validator::make($request->all(), [
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Cek ketersediaan kamar (logika sederhana)
        // Logika ini bisa dikembangkan lebih lanjut, misal mengecek overlap tanggal
        $room = Room::find($request->room_id);
        if ($room->status !== 'available') {
            return response()->json(['message' => 'Kamar tidak tersedia saat ini.'], 409);
        }

        // 3. Kalkulasi harga
        $checkIn = Carbon::parse($request->check_in_date);
        $checkOut = Carbon::parse($request->check_out_date);
        $durationInDays = $checkOut->diffInDays($checkIn);

        // Asumsi harga harian ada, jika tidak, berikan error
        if (!$room->price_daily) {
             return response()->json(['message' => 'Harga harian untuk kamar ini tidak tersedia.'], 400);
        }
        $totalPrice = $durationInDays * $room->price_daily;

        // 4. Buat booking
        $booking = Booking::create([
            'user_id' => $request->user()->id, // Mengambil ID user yang sedang login
            'room_id' => $request->room_id,
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'total_price' => $totalPrice,
            'status' => 'pending', // Status awal booking
        ]);

        // 5. Kembalikan response sukses
        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibuat.',
            'data' => $booking
        ], 201);
    }
}
