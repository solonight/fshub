<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('warehouseName');
            $table->string('location');
            $table->integer('totalCapacity');
            $table->integer('availableCapacity');
            $table->decimal('pricePerUnit', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('warehouses');
    }
};
