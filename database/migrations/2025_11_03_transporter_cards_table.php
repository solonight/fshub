<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('transporter_cards', function (Blueprint $table) {
            $table->id();
            $table->string('vehicleType');
            $table->string('licensePlate');
            $table->integer('capacity');
            $table->string('serviceAreas');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transporter_cards');
    }
};
