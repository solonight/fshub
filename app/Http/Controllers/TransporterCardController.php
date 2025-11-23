<?php

namespace App\Http\Controllers;

use App\Models\TransporterCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransporterCardController extends Controller
{
    // List transporter cards for the authenticated user
    public function myCards()
    {
        $userId = auth()->id();
        $cards = TransporterCard::where('user_id', $userId)->get();
        return Inertia::render('TransporterDashboard', [
            'auth' => auth()->user(),
            'transporterCards' => $cards,
        ]);
    }
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
            'phone_number' => 'required|string',
        ]);

        $validated['user_id'] = auth()->id();
        $transporterCard = TransporterCard::create($validated);

        $userId = auth()->id();
        $cards = TransporterCard::where('user_id', $userId)->get();
        return Inertia::render('TransporterDashboard', [
            'successMessage' => 'Transporter card created successfully!',
            'auth' => auth()->user(),
            'transporterCards' => $cards,
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
            'phone_number' => 'sometimes|string',
        ]);
        $transporterCard->update($validated);
        $userId = auth()->id();
        $cards = TransporterCard::where('user_id', $userId)->get();
        return Inertia::render('TransporterDashboard', [
            'successMessage' => 'Transporter card updated successfully!',
            'auth' => auth()->user(),
            'transporterCards' => $cards,
        ]);
    }

    // Delete a transporter card
    public function destroy($id)
    {
        $transporterCard = TransporterCard::findOrFail($id);
        $transporterCard->delete();
        // Redirect back to the dashboard with updated cards
        $userId = auth()->id();
        $cards = TransporterCard::where('user_id', $userId)->get();
        return Inertia::render('TransporterDashboard', [
            'auth' => auth()->user(),
            'transporterCards' => $cards,
            'successMessage' => 'Deleted successfully',
        ]);
    }
}
