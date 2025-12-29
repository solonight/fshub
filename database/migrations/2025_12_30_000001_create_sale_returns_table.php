<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleReturnsTable extends Migration
{
    public function up()
    {
        Schema::create('sale_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_record_id')->constrained('sale_records', 'record_id')->onDelete('cascade');
            $table->decimal('returned_quantity', 10, 2);
            $table->decimal('returned_amount', 10, 2);
            $table->timestamp('return_date')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sale_returns');
    }
}