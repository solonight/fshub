import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-white dark:bg-[#1D1B1B] transition-colors duration-300">
            <div>
                <Link href="/">
                    <ApplicationLogo />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-[#D9D9D9] dark:bg-[#232323] shadow-md overflow-hidden sm:rounded-lg border border-[#2596be] transition-colors duration-300">
                <div className="text-[#1D1B1B] dark:text-[#D9D9D9]">
                    {children}
                </div>
            </div>
        </div>
    );
}
