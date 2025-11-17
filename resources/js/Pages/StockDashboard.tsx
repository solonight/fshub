import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function StockDashboard({ auth, fabricStocks }: any) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        fabric_type: "",
        stock_location: "",
        color: "",
        price_per_unit: "",
        total_quantity: "",
        description: "",
        auto_delete: true, // Set auto_delete to true by default
        samples_availability: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/fabric-stocks", {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-[#2596be] leading-tight">
                    Stock Dashboard
                </h2>
            }
        >
            <Head title="Stock Dashboard" />

            <div className="py-6 min-h-screen dark:bg-[#1D1B1B] bg-[#F5F5F5]">
                <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div
                        className={`overflow-hidden shadow-sm rounded-lg border border-[#2596be] dark:bg-[#1D1B1B] bg-[#D9D9D9] ${
                            showForm ? "w-full md:w-1/2 mx-auto" : ""
                        }`}
                    >
                        <div className="p-4 sm:p-6 font-semibold dark:text-[#D9D9D9] text-[#1D1B1B]">
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="w-full sm:w-auto mb-4 px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e]"
                            >
                                {showForm ? "Cancel" : "Add New Stock"}
                            </button>

                            {showForm && (
                                <div className="w-full flex justify-center">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-2 sm:mt-4 space-y-3 sm:space-y-4 w-full px-1 sm:px-0"
                                    >
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium">
                                                Fabric Type
                                            </label>
                                            <select
                                                value={data.fabric_type}
                                                onChange={(e) =>
                                                    setData(
                                                        "fabric_type",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                                required
                                            >
                                                <option value="">
                                                    Select Fabric Type
                                                </option>
                                                <option value="Cotton">
                                                    Cotton
                                                </option>
                                                <option value="Linen">
                                                    Linen
                                                </option>
                                                <option value="Wool">
                                                    Wool
                                                </option>
                                                <option value="Silk">
                                                    Silk
                                                </option>
                                                <option value="Hemp">
                                                    Hemp
                                                </option>
                                                <option value="Polyester">
                                                    Polyester
                                                </option>
                                                <option value="Nylon">
                                                    Nylon
                                                </option>
                                                <option value="Acrylic">
                                                    Acrylic
                                                </option>
                                                <option value="Spandex">
                                                    Spandex
                                                </option>
                                                <option value="Viscose/Rayon">
                                                    Viscose/Rayon
                                                </option>
                                                <option value="Lyocell (Tencel)">
                                                    Lyocell (Tencel)
                                                </option>
                                                <option value="Denim">
                                                    Denim
                                                </option>
                                                <option value="Jersey">
                                                    Jersey
                                                </option>
                                                <option value="Flannel">
                                                    Flannel
                                                </option>
                                                <option value="Satin">
                                                    Satin
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium">
                                                Stock Location
                                            </label>
                                            <input
                                                type="text"
                                                value={data.stock_location}
                                                onChange={(e) =>
                                                    setData(
                                                        "stock_location",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium">
                                                Color
                                            </label>
                                            <input
                                                type="text"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium">
                                                Price Per Unit (MAD/meter)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.price_per_unit}
                                                onChange={(e) =>
                                                    setData(
                                                        "price_per_unit",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium">
                                                Total Quantity
                                            </label>
                                            <input
                                                type="number"
                                                value={data.total_quantity}
                                                onChange={(e) =>
                                                    setData(
                                                        "total_quantity",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                            ></textarea>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    data.samples_availability
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "samples_availability",
                                                        e.target.checked
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <label className="text-xs sm:text-sm">
                                                Samples Availability
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Submitting..."
                                                : "Submit"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                            Manage Your Stocks
                        </h3>
                        {fabricStocks &&
                        fabricStocks.data &&
                        fabricStocks.data.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                                No stocks found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {fabricStocks &&
                                    fabricStocks.data &&
                                    fabricStocks.data.map((stock: any) => (
                                        <div
                                            key={stock.stock_id}
                                            className="bg-[#F5F5F5] dark:bg-[#1D1B1B] border border-[#2596be] rounded-lg p-4 shadow hover:shadow-lg transition-shadow flex flex-col"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-primary">
                                                    ID: {stock.stock_id}
                                                </span>
                                                <span className="text-xs bg-[#2596be] text-white rounded px-2 py-0.5">
                                                    {stock.fabric_type}
                                                </span>
                                            </div>
                                            <div className="mb-1">
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Color:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {stock.color}
                                                </span>
                                            </div>
                                            <div className="mb-1">
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Location:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {stock.stock_location ||
                                                        "-"}
                                                </span>
                                            </div>
                                            <div className="mb-1">
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Price:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {stock.price_per_unit} MAD/m
                                                </span>
                                            </div>
                                            <div className="mb-1">
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Total Qty:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {stock.total_quantity}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Available Qty:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {stock.available_quantity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
