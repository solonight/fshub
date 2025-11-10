<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

        $roles = ['admin', 'StockOwner', 'WarehouseProvider', 'Transporter', 'customer'];
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'nullable|string|max:30',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|string|in:' . implode(',', $roles),
        ];
        if ($request->role === 'admin') {
            $rules['admin_secret'] = 'required|string';
        }
        $validated = $request->validate($rules);

        // If admin, check secret key
        if ($request->role === 'admin') {
            $envSecret = env('ADMIN_SECRET_KEY');
            if (!$envSecret || $request->admin_secret !== $envSecret) {
                return back()->withErrors(['admin_secret' => 'Invalid admin secret key.'])->withInput();
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        // Assign selected role or default to 'customer'
        $role = $request->role ?? 'customer';
        $user->addRole($role);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
