<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('fabric_stocks', function (Blueprint $table) {
            $table->id('stock_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('fabric_type');
            $table->string('color');
            $table->decimal('price_per_unit', 10, 2);
            $table->decimal('total_quantity', 10, 2);
            $table->decimal('available_quantity', 10, 2);
            $table->text('description')->nullable();
            $table->boolean('auto_delete')->default(true);
            $table->boolean('samples_availability')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'fabric_type', 'color']);
            $table->index(['available_quantity']);
            $table->index(['auto_delete']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('fabric_stocks');
    }
};