<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

use App\Models\FabricStock;
use App\Http\Controllers\FabricStockController;
use App\Http\Controllers\SaleRecordController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\StockHistoryController;
use App\Http\Controllers\TransporterCardController;

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
    $user = auth()->user();

    if ($user->hasRole('admin')) {
        return redirect()->route('admin.dashboard');
    } elseif ($user->hasRole('StockOwner')) {
        return redirect()->route('stock.dashboard');
    } elseif ($user->hasRole('WarehouseProvider')) {
        return redirect()->route('warehouses.dashboard');
    } elseif ($user->hasRole('Transporter')) {
        return redirect()->route('transporter.dashboard');
    } elseif ($user->hasRole('customer')) {
        return redirect()->route('purchase.page');
    }

    return abort(403, 'Unauthorized action.');
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
})->name('marketplace');

// Services page route for sidebar nav items
Route::get('/services', function () {
    return Inertia::render('ServicesPage', [
        'services' => [], // Replace with actual data if available
    ]);
})->middleware(['auth', 'verified'])->name('services');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin-dashboard', function () {
        return Inertia::render('AdminDashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'users' => User::paginate(35),
        ]);
    })->name('admin.dashboard');
});

Route::middleware(['auth', 'role:StockOwner'])->group(function () {
    Route::get('/stock-dashboard', function () {
        $user = Auth::user();
        $fabricStocks = \App\Models\FabricStock::where('user_id', $user->id)->orderByDesc('created_at')->paginate(20);
        $unpaidSales = \App\Models\SaleRecord::where('user_id', $user->id)->where('is_payed', false)->get();
        $paidSales = \App\Models\SaleRecord::where('user_id', $user->id)->where('is_payed', true)->get();
        return Inertia::render('StockDashboard', [
            'auth' => [
                'user' => $user,
            ],
            'fabricStocks' => $fabricStocks,
            'unpaidSales' => $unpaidSales,
            'paidSales' => $paidSales,
        ]);
    })->name('stock.dashboard');
    Route::get('/user-stock-histories', [StockHistoryController::class, 'userGroupedHistories'])->name('user.stock.histories');
    Route::post('/sale-records/{saleRecord}/payments', [PaymentController::class, 'store']);
    Route::get('/sale-records/{saleRecord}/payments', [PaymentController::class, 'index']);
});

Route::middleware(['auth', 'role:WarehouseProvider'])->group(function () {
    Route::get('/warehouses-dashboard', function () {
        return Inertia::render('WarehousesDashboard');
    })->name('warehouses.dashboard');
});

Route::middleware(['auth', 'role:Transporter'])->group(function () {
    Route::patch('/transporter-cards/{id}', [TransporterCardController::class, 'update'])->name('transporter-cards.update');
    Route::delete('/transporter-cards/{id}', [TransporterCardController::class, 'destroy'])->name('transporter-cards.destroy');
    Route::get('/transporter-dashboard', function () {
        $user = Auth::user();
        $transporterCards = \App\Models\TransporterCard::where('user_id', $user->id)->orderByDesc('created_at')->get();
        return Inertia::render('TransporterDashboard', [
            'auth' => [
                'user' => $user,
            ],
            'transporterCards' => $transporterCards,
        ]);
    })->name('transporter.dashboard');
    Route::get('/transporter-cards', [TransporterCardController::class, 'myCards'])->name('transporter-cards.index');
    Route::post('/transporter-cards', [TransporterCardController::class, 'store'])->name('transporter-cards.store');
});

Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/purchase-page', function () {
        return Inertia::render('PurchasePage');
    })->name('purchase.page');
});

Route::resource('fabric-stocks', FabricStockController::class)->middleware(['auth', 'role:StockOwner']);


// Services page route for sidebar nav items
Route::get('/services', function () {
    return Inertia::render('ServicesPage', [
        'services' => [], // Replace with actual data if available
    ]);
})->middleware(['auth', 'verified'])->name('services');

Route::delete('/admin-dashboard/users/{id}', function ($id) {
    $user = User::findOrFail($id);
    if (Auth::user()->id === $user->id) {
        return back()->with('error', 'You cannot delete your own account.');
    }
    $user->delete();
    return redirect()->route('admin.dashboard')->with('success', 'User deleted.');
})->middleware(['auth', 'role:admin'])->name('admin.users.delete');

Route::post('/fabric-stocks/{stock_id}/sales', [SaleRecordController::class, 'store']);
Route::patch('/sales-records/{id}/pay', [SaleRecordController::class, 'update'])->middleware(['auth', 'role:StockOwner']);
Route::post('/sales-records/{id}/return', [SaleRecordController::class, 'createReturn'])->middleware(['auth', 'role:StockOwner']);

require __DIR__.'/auth.php';
