<?php

namespace App\Http\Controllers;

use App\Models\TransporterCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransporterCardController extends Controller
{
    // List all transporter cards
    public function index()
    {
        return TransporterCard::all();
    }

    // Show a single transporter card
    public function show($id)
    {
        return TransporterCard::findOrFail($id);
    }

    // Create a new transporter card
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicleType' => 'required|string',
            'licensePlate' => 'required|string',
            'capacity' => 'required|integer',
            'serviceAreas' => 'required|string',
        ]);

        $transporterCard = TransporterCard::create($validated);

        return Inertia::render('TransporterDashboard', [
            'successMessage' => 'Transporter card created successfully!',
            'transporterCard' => $transporterCard,
        ]);
    }

    // Update an existing transporter card
    public function update(Request $request, $id)
    {
        $transporterCard = TransporterCard::findOrFail($id);
        $validated = $request->validate([
            'vehicleType' => 'sometimes|string',
            'licensePlate' => 'sometimes|string',
            'capacity' => 'sometimes|integer',
            'serviceAreas' => 'sometimes|string',
        ]);
        $transporterCard->update($validated);
        return $transporterCard;
    }

    // Delete a transporter card
    public function destroy($id)
    {
        $transporterCard = TransporterCard::findOrFail($id);
        $transporterCard->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
