<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransporterCard extends Model
{
    protected $table = 'transporter_cards';

    protected $fillable = [
        'vehicleType',
        'licensePlate',
        'capacity',
        'serviceAreas',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
