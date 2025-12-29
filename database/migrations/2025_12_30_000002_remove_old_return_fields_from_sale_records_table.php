<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveOldReturnFieldsFromSaleRecordsTable extends Migration
{
    public function up()
    {
        Schema::table('sale_records', function (Blueprint $table) {
            $table->dropColumn(['returned_quantity', 'return_date']);
        });
    }

    public function down()
    {
        Schema::table('sale_records', function (Blueprint $table) {
            $table->decimal('returned_quantity', 10, 2)->default(0);
            $table->timestamp('return_date')->nullable();
        });
    }
}