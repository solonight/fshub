import { ReactNode } from "react";
import {
    Gauge,
    User,
    Settings,
    LogOut,
    Warehouse,
    Truck,
    DollarSign,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import sidebarBg from "@/assets/sidebarbg.jpg";

interface SidebarProps {
    children?: ReactNode;
    user?: { name: string };
}

type NavItem = {
    label: string;
    icon: ReactNode;
    href: string;
    method?: string;
};

const navItems: NavItem[] = [
    { label: "Dashboard", icon: <Gauge />, href: "/dashboard" },
    { label: "Profile", icon: <User />, href: route("profile.edit") },
];

const servicesNav: NavItem[] = [
    { label: "Marketplace", icon: <DollarSign />, href: "/marketplace" },
    { label: "Warehouses", icon: <Warehouse />, href: "/services" },
    { label: "Transporters", icon: <Truck />, href: "/services" },
];
const logoutItem: NavItem = {
    label: "Logout",
    icon: <LogOut />,
    href: "/logout",
    method: "post",
};

export default function Sidebar({ children, user }: SidebarProps) {
    return (
        <div className="flex h-screen">
            <aside
                className="w-14 md:w-40 text-[#D9D9D9] flex flex-col justify-between items-center py-6 shadow-lg fixed left-0 top-0 h-screen"
                style={{
                    backgroundImage: `url(${sidebarBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="w-full">
                    <div className="absolute inset-0 bg-black/40 z-0" />
                    <div className="mb-8 z-10 relative flex justify-center items-center">
                        <span className="text-2xl font-bold text-primary hidden lg:inline">
                            {user?.name || "FSHub"}
                        </span>
                    </div>
                    <nav className="flex flex-col gap-6 w-full items-center md:items-start z-10 relative">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                {...(item.method
                                    ? {
                                          method: item.method as any,
                                          as: "button",
                                      }
                                    : {})}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors w-12 md:w-full justify-center md:justify-start"
                            >
                                <span className="w-6 h-6">{item.icon}</span>
                                <span className="hidden md:inline text-sm font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                        {/* Services Section */}
                        <div className="w-full mt-6">
                            <div className="uppercase text-xs text-primary font-bold mb-2 px-3 hidden md:block">
                                Services
                            </div>
                            <div className="flex flex-col gap-2">
                                {servicesNav.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors w-12 md:w-full justify-center md:justify-start"
                                    >
                                        <span className="w-6 h-6">
                                            {item.icon}
                                        </span>
                                        <span className="hidden md:inline text-sm font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="w-full flex items-center md:items-start z-10 relative mb-4">
                    <Link
                        key={logoutItem.label}
                        href={logoutItem.href}
                        method={logoutItem.method as any}
                        as="button"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors w-12 md:w-full justify-center md:justify-start"
                    >
                        <span className="w-6 h-6">{logoutItem.icon}</span>
                        <span className="hidden md:inline text-sm font-medium">
                            {logoutItem.label}
                        </span>
                    </Link>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto bg-white dark:bg-[#232323] ml-14 md:ml-40">
                {children}
            </main>
        </div>
    );
}
