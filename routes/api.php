<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::middleware('auth:sanctum')->post('logout', function (Request $request) {
//     $request->user()->currentAccessToken()->delete();
//     return response()->json(['message' => 'Logged out successfully']);
// });

// // API Auth routes
// Route::post('register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
// Route::post('login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'apiLogin']);

// Route::apiResource('fabric-stocks', App\Http\Controllers\FabricStockController::class);
// Route::apiResource('sale-records', App\Http\Controllers\SaleRecordController::class);
// Route::apiResource('transporter-cards', App\Http\Controllers\TransporterCardController::class);

// Route::apiResource('warehouses', App\Http\Controllers\WarehouseController::class);

// // Admin user deletion route
// // Admin user index and show routes
// Route::middleware(['auth:sanctum'])->get('users', [App\Http\Controllers\UserController::class, 'index']);
// Route::middleware(['auth:sanctum'])->get('users/{id}', [App\Http\Controllers\UserController::class, 'show']);
// Route::middleware(['auth:sanctum'])->delete('users/{id}', [App\Http\Controllers\UserController::class, 'destroy']);

