<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Models\FabricStock;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/welcome', function () {
    return Inertia::render('Welcome');
})->name('welcome');


Route::get('/marketplace', function () {
    $fabricStocks = FabricStock::paginate(15);
    return Inertia::render('Marketplace', [
        'fabricStocks' => $fabricStocks,
    ]);
})->middleware(['auth', 'verified'])->name('marketplace');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin-dashboard', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');
});

Route::middleware(['auth', 'role:StockOwner'])->group(function () {
    Route::get('/stock-dashboard', function () {
        return Inertia::render('StockDashboard');
    })->name('stock.dashboard');
});

Route::middleware(['auth', 'role:WarehouseProvider'])->group(function () {
    Route::get('/warehouses-dashboard', function () {
        return Inertia::render('WarehousesDashboard');
    })->name('warehouses.dashboard');
});

Route::middleware(['auth', 'role:Transporter'])->group(function () {
    Route::get('/transporter-dashboard', function () {
        return Inertia::render('TransporterDashboard');
    })->name('transporter.dashboard');
});

Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/purchase-page', function () {
        return Inertia::render('PurchasePage');
    })->name('purchase.page');
});

require __DIR__.'/auth.php';
