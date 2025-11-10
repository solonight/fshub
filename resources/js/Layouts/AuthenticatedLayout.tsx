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
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
            {sidebarOpen && <Sidebar />}
            <div className="flex-1 flex flex-col">
                <nav className="border-b border-[#2596be] bg-[#2596be] flex items-center justify-between h-16 px-4">
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

                    <div className="flex-1 flex justify-between items-center">
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="block w-[87px] h-[87px]" />
                            </Link>
                        </div>

                        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className="text-[#1D1B1B] font-bold"
                            >
                                Dashboard
                            </NavLink>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6 gap-4">
                            {/* Theme toggle button */}
                            <button
                                aria-label="Toggle dark mode"
                                onClick={() =>
                                    setTheme(
                                        theme === "dark" ? "light" : "dark"
                                    )
                                }
                                className="p-2 rounded-full bg-[#D9D9D9] hover:bg-[#2596be] transition-colors duration-200 flex items-center justify-center"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5 text-[#1D1B1B]" />
                                ) : (
                                    <Moon className="w-5 h-5 text-[#1D1B1B]" />
                                )}
                            </button>
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#1D1B1B] bg-[#D9D9D9] hover:text-[#2596be] focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="text-[#2596be]"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="text-[#2596be]"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
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
