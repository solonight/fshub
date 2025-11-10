import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#1D1B1B]">
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-10 h-10" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-[#D9D9D9] shadow-md overflow-hidden sm:rounded-lg border border-[#2596be]">
                <div className="text-[#1D1B1B]">{children}</div>
            </div>
        </div>
    );
}
