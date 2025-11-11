import { ReactNode } from "react";
import { Home, User, Settings, LogOut } from "lucide-react";
import { Link } from "@inertiajs/react";
import sidebarBg from "@/assets/sidebarbg.jpg";

interface SidebarProps {
    children?: ReactNode;
    user?: { name: string };
}

const navItems = [
    { label: "Home", icon: <Home />, href: "/dashboard" },
    { label: "Profile", icon: <User />, href: route("profile.edit") },
    { label: "Settings", icon: <Settings />, href: "/settings" },
    { label: "Logout", icon: <LogOut />, href: "/logout", method: "post" },
];

export default function Sidebar({ children, user }: SidebarProps) {
    return (
        <div className="flex h-screen">
            <aside
                className="w-20 md:w-56 text-[#D9D9D9] flex flex-col items-center py-6 shadow-lg relative"
                style={{
                    backgroundImage: `url(${sidebarBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-black/40 z-0" />
                <div className="mb-8 z-10 relative">
                    <span className="text-2xl font-bold text-primary">
                        {user?.name || "FSHub"}
                    </span>
                </div>
                <nav className="flex flex-col gap-6 w-full items-center md:items-start z-10 relative">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            method={item.method as any}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors w-16 md:w-full justify-center md:justify-start"
                        >
                            <span className="w-6 h-6">{item.icon}</span>
                            <span className="hidden md:inline text-sm font-medium">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 overflow-y-auto bg-white dark:bg-[#232323]">
                {children}
            </main>
        </div>
    );
}
