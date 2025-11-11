import { useEffect, FormEventHandler, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import loginLeftSide from "@/assets/login_left_side.png";
import SFlogo from "@/assets/Sfhublogo.jpg";
import { Eye, EyeOff } from "lucide-react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <>
            <Head title="Log in" />

            <div className="flex h-screen w-screen bg-primary">
                {/* Left side: Image */}
                <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-primary transition-all duration-500 shadow-2xl shadow-black/50">
                    <img
                        src={loginLeftSide}
                        alt="Login left side"
                        className="object-cover w-full h-full  bg-primary"
                    />
                </div>
                {/* Right side: Login form */}
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full bg-primary px-6 sm:px-12 md:px-24 transition-all duration-500 shadow-2xl shadow-black/50">
                    <div className="mb-6">
                        <Link href={route("welcome")}>
                            <img
                                src={SFlogo}
                                alt="Logo"
                                className="w-24 h-24 md:w-48 md:h-48 rounded-full shadow-lg cursor-pointer"
                            />
                        </Link>
                    </div>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-3 w-full">
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="text-lg font-bold text-[#1D1B1B]"
                            />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full shadow-md shadow-black bg-[#D9D9D9]"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-lg font-bold text-[#1D1B1B]"
                            />

                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full shadow-md shadow-black bg-[#D9D9D9] pr-10"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-primary bg-transparent"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-lg font-bold text-[#1D1B1B]">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center justify-between mt-4 gap-4 w-full">
                            <Link
                                href={route("register")}
                                className="no-underline"
                            >
                                <PrimaryButton
                                    className="shadow-md shadow-black text-lg font-bold text-[#1D1B1B]"
                                    type="button"
                                >
                                    Register
                                </PrimaryButton>
                            </Link>
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="underline text-lg font-bold text-[#1D1B1B] hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <PrimaryButton
                                className="shadow-md shadow-black text-lg font-bold text-[#1D1B1B]"
                                disabled={processing}
                            >
                                Log in
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
