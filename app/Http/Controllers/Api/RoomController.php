<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::latest()->get(); // Mengambil data terbaru
        return response()->json([
            'success' => true,
            'message' => 'Daftar semua kamar berhasil diambil.',
            'data' => $rooms
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'size' => 'required|string',
            'price_monthly' => 'required|numeric',
            'price_daily' => 'nullable|numeric',
            'price_yearly' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $room = Room::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Kamar baru berhasil ditambahkan.',
            'data' => $room
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room) // <-- Menggunakan Route Model Binding
    {
        return response()->json([
            'success' => true,
            'message' => 'Detail kamar berhasil diambil.',
            'data' => $room
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room) // <-- Menggunakan Route Model Binding
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'size' => 'sometimes|required|string',
            'price_monthly' => 'sometimes|required|numeric',
            'price_daily' => 'nullable|numeric',
            'price_yearly' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $room->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data kamar berhasil diperbarui.',
            'data' => $room
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room) // <-- Menggunakan Route Model Binding
    {
        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data kamar berhasil dihapus.'
        ], 200);
    }
}
