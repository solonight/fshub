<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    // List all warehouses
    public function index()
    {
        return Warehouse::all();
    }

    // Show a single warehouse
    public function show($id)
    {
        return Warehouse::findOrFail($id);
    }

    // Create a new warehouse
    public function store(Request $request)
    {
        $validated = $request->validate([
            'warehouseName' => 'required|string',
            'location' => 'required|string',
            'totalCapacity' => 'required|integer',
            'availableCapacity' => 'required|integer',
            'pricePerUnit' => 'required|numeric',
        ]);
        return Warehouse::create($validated);
    }

    // Update an existing warehouse
    public function update(Request $request, $id)
    {
        $warehouse = Warehouse::findOrFail($id);
        $validated = $request->validate([
            'warehouseName' => 'sometimes|string',
            'location' => 'sometimes|string',
            'totalCapacity' => 'sometimes|integer',
            'availableCapacity' => 'sometimes|integer',
            'pricePerUnit' => 'sometimes|numeric',
        ]);
        $warehouse->update($validated);
        return $warehouse;
    }

    // Delete a warehouse
    public function destroy($id)
    {
        $warehouse = Warehouse::findOrFail($id);
        $warehouse->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
