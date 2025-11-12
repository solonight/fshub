import { useState, PropsWithChildren, ReactNode, useEffect } from "react";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { User } from "@/types";
import Sidebar from "@/Components/Sidebar";

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "dark";
        }
        return "dark";
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#1D1B1B] text-[#1D1B1B] dark:text-[#D9D9D9] transition-colors duration-300 flex">
            {/* Sidebar toggle and sidebar */}
            {sidebarOpen && <Sidebar user={user} />}
            <div className="flex-1 flex flex-col ">
                <nav className="border-b border-[#2596be] bg-[#2596be] flex items-center h-27 px-6 shadow-2xl">
                    <div className="flex items-center justify-between w-full">
                        <button
                            aria-label="Toggle sidebar"
                            onClick={() => setSidebarOpen((open) => !open)}
                            className="mr-4 p-2 rounded-full bg-[#D9D9D9] hover:bg-[#2596be] transition-colors duration-200 flex items-center justify-center"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft className="w-5 h-5 text-[#1D1B1B]" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-[#1D1B1B]" />
                            )}
                        </button>

                        <Link href={route("marketplace")}>
                            <ApplicationLogo className="block w-[87px] h-[87px] rounded-full" />
                        </Link>

                        <button
                            aria-label="Toggle dark mode"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="p-2 rounded-full bg-[#D9D9D9] hover:bg-[#2596be] transition-colors duration-200 flex items-center justify-center"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5 text-[#1D1B1B]" />
                            ) : (
                                <Moon className="w-5 h-5 text-[#1D1B1B]" />
                            )}
                        </button>
                    </div>
                </nav>

                {/* Main content */}
                <main className="flex-1">
                    {header && (
                        <header className="bg-white dark:bg-[#232323] shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
