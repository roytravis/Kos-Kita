<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id(); // ID unik untuk setiap kamar
            $table->string('name'); // Nama atau nomor kamar, cth: "Kamar 201"
            $table->text('description'); // Deskripsi lengkap kamar
            $table->string('size'); // Ukuran kamar, cth: "3x4m"
            $table->decimal('price_monthly', 10, 2); // Harga sewa bulanan
            $table->decimal('price_daily', 10, 2)->nullable(); // Harga sewa harian (opsional)
            $table->decimal('price_yearly', 10, 2)->nullable(); // Harga sewa tahunan (opsional)
            $table->enum('status', ['available', 'booked', 'maintenance'])->default('available'); // Status ketersediaan kamar
            $table->timestamps(); // Otomatis membuat kolom created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
