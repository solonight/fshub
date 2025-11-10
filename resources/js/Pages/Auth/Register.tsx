import { useEffect, useState, FormEventHandler } from "react";
import registerRightSide from "@/assets/register_rihgt_side.png";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    Shield,
    Truck,
    BriefcaseBusiness,
    Warehouse,
} from "lucide-react";
// @ts-ignore
import InputMask from "react-input-mask";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex h-screen w-screen">
                {/* Left side: Register form */}
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full bg-dark px-6 sm:px-12 md:px-24 transition-all duration-500">
                    <h2 className="text-4xl font-bold text-white mb-10 text-center w-full">
                        <span className="text-primary">S</span>ign{" "}
                        <span className="text-primary">U</span>p
                    </h2>
                    <form onSubmit={submit} className="space-y-3 w-full">
                        <div className="mb-2">
                            <InputLabel
                                htmlFor="name"
                                value="Name"
                                className="text-white"
                            />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2 text-primary"
                            />
                        </div>
                        <div className="mb-2">
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="text-white"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2 text-primary"
                            />
                        </div>
                        <div className="mb-2">
                            <div className="flex items-center justify-between">
                                <InputLabel
                                    htmlFor="phone"
                                    value="Phone"
                                    className="text-white"
                                />
                                <span className="text-xs text-muted ml-2">
                                    optional
                                </span>
                            </div>
                            <InputMask
                                mask="+212 9 99 99 99 99"
                                maskChar={null}
                                id="phone"
                                name="phone"
                                type="tel"
                                value={data.phone}
                                className="mt-1 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary rounded-md py-2 px-3"
                                autoComplete="tel"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setData("phone", e.target.value)}
                                placeholder="+212 * ** ** ** **"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2 text-primary"
                            />
                        </div>
                        <div className="mb-2">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-white"
                            />
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary pr-10"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
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
                                className="mt-2 text-primary"
                            />
                        </div>
                        <div className="mb-2">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                                className="text-white"
                            />
                            <div className="relative">
                                <TextInput
                                    id="password_confirmation"
                                    type={showPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary pr-10"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
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
                                message={errors.password_confirmation}
                                className="mt-2 text-primary"
                            />
                        </div>
                        <div className="mb-2">
                            <InputLabel
                                htmlFor="role"
                                value="Role"
                                className="text-white mb-2"
                            />
                            <div className="flex flex-row justify-between gap-6 w-full">
                                {[
                                    {
                                        value: "admin",
                                        label: "Admin",
                                        icon: <Shield size={32} />,
                                    },
                                    {
                                        value: "StockOwner",
                                        label: "Stock Owner",
                                        icon: <BriefcaseBusiness size={32} />,
                                    },
                                    {
                                        value: "WarehouseProvider",
                                        label: "Warehouse Provider",
                                        icon: <Warehouse size={32} />,
                                    },
                                    {
                                        value: "Transporter",
                                        label: "Transporter",
                                        icon: <Truck size={32} />,
                                    },
                                ].map((role) => (
                                    <button
                                        type="button"
                                        key={role.value}
                                        onClick={() =>
                                            setData("role", role.value)
                                        }
                                        className={`flex flex-col items-center p-2 rounded-lg border-2 transition-colors duration-200 focus:outline-none ${
                                            data.role === role.value
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-gray-400 text-white hover:border-primary"
                                        }`}
                                    >
                                        {role.icon}
                                        <span className="mt-1 text-primary text-xs font-semibold">
                                            {role.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <InputError
                                message={errors.role}
                                className="mt-2 text-primary"
                            />
                            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 mt-2">
                                <Link
                                    href={route("login")}
                                    className="text-sm text-muted hover:text-primary"
                                >
                                    Already registered?
                                </Link>
                                <PrimaryButton
                                    className="w-full sm:w-auto"
                                    disabled={processing}
                                >
                                    Register
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
                {/* Right side: Image */}
                <div className="hidden md:flex w-1/2 h-full items-center justify-center bg-dark transition-all duration-500">
                    <img
                        src={registerRightSide}
                        alt="Register right side"
                        className="object-cover w-full h-full shadow-2xl shadow-blue-500/50"
                    />
                </div>
                {/* Background color for medium screens */}
                <div className="md:hidden w-1/2 h-full bg-dark"></div>
            </div>
        </>
    );
}
