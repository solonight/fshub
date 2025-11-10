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
        admin_secret: "",
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
            <div className="flex flex-col min-h-screen w-full bg-dark">
                <div className="flex flex-1 flex-col md:flex-row w-full h-full">
                    {/* Left side: Register form */}
                    <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full min-h-screen bg-dark px-4 sm:px-6 md:px-12 lg:px-24 py-8 overflow-auto">
                        <h2 className="text-2xl font-bold text-white mb-4 text-center w-full">
                            <span className="text-primary">S</span>ign{" "}
                            <span className="text-primary">U</span>p
                        </h2>
                        <form
                            onSubmit={submit}
                            className="space-y-1 w-full max-w-xs mx-auto"
                        >
                            <div className="mb-1">
                                <InputLabel
                                    htmlFor="name"
                                    value="Name"
                                    className="text-white"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-0.5 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary text-sm py-1 px-2"
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
                            <div className="mb-1.5">
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
                                    className="mt-0.5 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary text-sm py-1 px-2"
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
                            <div className="mb-1.5">
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
                                    className="mt-0.5 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary rounded-md text-sm py-1 px-2"
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
                            <div className="mb-1.5">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="text-white"
                                />
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        className="mt-0.5 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary pr-8 text-sm py-1 px-2"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-primary bg-transparent"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
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
                            <div className="mb-1.5">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="text-white"
                                />
                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-0.5 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary pr-8 text-sm py-1 px-2"
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
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
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
                            <div className="mb-1.5">
                                <InputLabel
                                    htmlFor="role"
                                    value="Role"
                                    className="text-white mb-2"
                                />
                                <div className="flex flex-row flex-wrap justify-between gap-2 w-full">
                                    {[
                                        {
                                            value: "admin",
                                            label: "Admin",
                                            icon: <Shield size={32} />,
                                        },
                                        {
                                            value: "StockOwner",
                                            label: "Stock Owner",
                                            icon: (
                                                <BriefcaseBusiness size={32} />
                                            ),
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
                                            onClick={() => {
                                                setData("role", role.value);
                                                if (role.value !== "admin")
                                                    setData("admin_secret", "");
                                            }}
                                            className={`flex flex-col items-center p-1 rounded-md border transition-colors duration-200 focus:outline-none min-w-[60px] max-w-[80px] flex-1 ${
                                                data.role === role.value
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-gray-400 text-white hover:border-primary"
                                            }`}
                                        >
                                            {role.icon &&
                                                typeof role.icon ===
                                                    "object" && (
                                                    <span className="scale-75">
                                                        {role.icon}
                                                    </span>
                                                )}
                                            <span className="mt-0.5 text-primary text-[10px] font-semibold">
                                                {role.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {data.role === "admin" && (
                                    <div className="mt-2">
                                        <InputLabel
                                            htmlFor="admin_secret"
                                            value="Admin Secret Key"
                                            className="text-white"
                                        />
                                        <TextInput
                                            id="admin_secret"
                                            name="admin_secret"
                                            type="password"
                                            value={data.admin_secret}
                                            onChange={(e) =>
                                                setData(
                                                    "admin_secret",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-primary text-white bg-dark placeholder:text-muted focus:border-primary focus:ring-primary text-sm py-1 px-2"
                                            placeholder="Enter admin secret key"
                                            required
                                        />
                                        <InputError
                                            message={errors.admin_secret}
                                            className="mt-2 text-primary"
                                        />
                                    </div>
                                )}
                                <InputError
                                    message={errors.role}
                                    className="mt-2 text-primary"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1.5 mt-1.5">
                                <Link
                                    href={route("login")}
                                    className="text-sm text-muted hover:text-primary"
                                >
                                    Already registered?
                                </Link>
                                <PrimaryButton
                                    className="w-full sm:w-auto text-xs py-1 px-3"
                                    disabled={processing}
                                >
                                    Register
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                    {/* Right side: Image (hidden on screens smaller than md) */}
                    <div className="hidden sm:flex w-full md:w-1/2 h-full min-h-[200px] md:min-h-screen items-center justify-center bg-dark transition-all duration-500">
                        <div className="flex items-center justify-center w-full h-full">
                            <img
                                src={registerRightSide}
                                alt="Register right side"
                                className="object-contain max-w-full max-h-full shadow-2xl shadow-blue-500/50 rounded-none md:rounded-l-3xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
