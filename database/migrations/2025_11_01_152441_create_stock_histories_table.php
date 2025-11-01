<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stock_histories', function (Blueprint $table) {
            $table->id('history_id');
            
            // Foreign key to fabric_stocks - set null when stock is deleted
            $table->foreignId('stock_id')
                  ->nullable()
                  ->constrained('fabric_stocks', 'stock_id')
                  ->onDelete('set null');
                  
            // Foreign key to users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
                  
            $table->enum('change_type', ['ADD', 'SALE', 'ADJUSTMENT', 'RETURN', 'CORRECTION']);
            $table->decimal('quantity', 10, 2); // Can be positive or negative
            $table->text('notes')->nullable();
            
            // Foreign key to sale_records - set null when sale is deleted
            $table->foreignId('reference_id')
                  ->nullable()
                  ->constrained('sale_records', 'record_id')
                  ->onDelete('set null');
                  
            // Snapshot data for historical records
            $table->string('fabric_type_snapshot')->nullable();
            $table->string('color_snapshot')->nullable();
            $table->decimal('price_per_unit_snapshot', 10, 2)->nullable();
            
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['stock_id', 'created_at']);
            $table->index(['reference_id']);
            $table->index(['change_type']);
            $table->index(['user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('stock_histories');
    }
};