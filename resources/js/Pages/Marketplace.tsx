import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Marketplace({ auth, fabricStocks }: any) {
    // fabricStocks is now a pagination object from Laravel
    const stocks = fabricStocks?.data || [];
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Marketplace" />
            <div className="flex flex-col items-center min-h-[60vh] w-full px-2 md:px-8">
                <div className="flex flex-col items-center mt-8">
                    <h1 className="text-3xl font-bold text-primary mb-6 text-center">
                        Marketplace
                    </h1>
                    <p className="text-lg text-center text-[#1D1B1B] dark:text-[#D9D9D9] max-w-2xl mb-8">
                        Welcome to the FSHub Marketplace! Here you can browse,
                        buy, and sell fabric stock, manage logistics, and
                        connect with providers.
                    </p>
                </div>
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stocks.length === 0 ? (
                            <div className="col-span-3 text-center text-gray-500 dark:text-gray-300 py-12">
                                No fabric stock available.
                            </div>
                        ) : (
                            stocks.map((stock: any) => (
                                <div
                                    key={stock.stock_id || stock.id}
                                    className="bg-white dark:bg-[#232323] rounded-xl shadow-lg p-6 flex flex-col gap-2 transition-transform hover:scale-[1.03]"
                                >
                                    <div className="font-bold text-lg text-primary mb-2">
                                        {stock.fabric_type}
                                    </div>
                                    <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                        <span className="font-semibold">
                                            Color:
                                        </span>{" "}
                                        {stock.color}
                                    </div>
                                    <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                        <span className="font-semibold">
                                            Location:
                                        </span>{" "}
                                        {stock.stock_location || "N/A"}
                                    </div>
                                    <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                        <span className="font-semibold">
                                            Price/unit:
                                        </span>{" "}
                                        ${stock.price_per_unit}
                                    </div>
                                    <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                        <span className="font-semibold">
                                            Available:
                                        </span>{" "}
                                        {stock.available_quantity} /{" "}
                                        {stock.total_quantity}
                                    </div>
                                    {stock.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            {stock.description}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    {/* Pagination Controls */}
                    {fabricStocks && (
                        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                            {fabricStocks.links &&
                                fabricStocks.links.map(
                                    (link: any, idx: number) =>
                                        link.url ? (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className={`px-3 py-1 rounded border text-sm transition-colors ${
                                                    link.active
                                                        ? "bg-primary text-white"
                                                        : "bg-white dark:bg-[#232323] text-primary hover:bg-primary/10"
                                                }`}
                                                preserveScroll
                                            >
                                                {/* Remove HTML tags from label for clean display */}
                                                {link.label.replace(
                                                    /<[^>]+>/g,
                                                    ""
                                                )}
                                            </Link>
                                        ) : (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 rounded border text-sm text-gray-400"
                                            >
                                                {link.label.replace(
                                                    /<[^>]+>/g,
                                                    ""
                                                )}
                                            </span>
                                        )
                                )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
