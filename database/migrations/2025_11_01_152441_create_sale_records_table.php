<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sale_records', function (Blueprint $table) {
            $table->id('record_id');
            $table->foreignId('stock_id')->constrained('fabric_stocks', 'stock_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->decimal('quantity_sold', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->boolean('is_payed')->default(true);
            $table->text('notes')->nullable();
            $table->timestamp('sale_date')->useCurrent();
            $table->timestamps();
            
            $table->index(['stock_id', 'sale_date']);
            $table->index(['customer_phone']);
            $table->index(['sale_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('sale_records');
    }
};