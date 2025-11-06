import PrimaryButton from "@/Components/PrimaryButton";
import { Link } from "@inertiajs/react";
import heroBackground from "@/assets/hero-background.png";

const Welcome = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBackground})` }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-transparent" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 pt-4 sm:pt-8 px-4 w-full">
                <div className="mx-auto w-full max-w-lg sm:max-w-none flex flex-col sm:flex-row items-center sm:justify-center gap-3 sm:gap-4">
                    <Link href={route("login")}>
                        <PrimaryButton className="w-full sm:w-auto sm:min-w-[120px] text-xs sm:text-sm text-center flex items-center justify-center hover:bg-transparent">
                            Login
                        </PrimaryButton>
                    </Link>
                    <Link href={route("register")}>
                        <PrimaryButton className="w-full sm:w-auto sm:min-w-[120px] text-xs sm:text-sm text-center flex items-center justify-center hover:bg-transparent">
                            Register
                        </PrimaryButton>
                    </Link>
                    <Link href={route("register")}>
                    <PrimaryButton className="w-full sm:w-auto sm:min-w-[180px] text-xs sm:text-sm text-center flex items-center justify-center bg-primary border-primary hover:bg-transparent hover:border-primary">
                        Go to Marketplace
                    </PrimaryButton>
                    </Link>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center sm:items-start justify-center min-h-[calc(100vh-100px)] px-4 sm:px-8 md:px-16 lg:px-24">
                <div className="w-full max-w-3xl">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 sm:mb-6 tracking-tight text-center sm:text-left">
                        Fabric<span className="text-primary">Stock</span>Hub
                    </h1>

                    <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white/90 text-center sm:text-left">
                            Welcome to the Future of Fabric Logistics
                        </h2>

                        <p className="text-sm sm:text-lg md:text-xl text-muted leading-relaxed max-w-xl sm:max-w-2xl text-center sm:text-left">
                            FSHub is your comprehensive platform for managing
                            fabric inventory, tracking logistics, and
                            coordinating transportation and warehousing
                            operations. Streamline your supply chain with
                            real-time visibility and intelligent management
                            tools.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-0" />
        </div>
    );
};

export default Welcome;
