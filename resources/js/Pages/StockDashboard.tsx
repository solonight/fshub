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

            <div className="py-12 min-h-screen dark:bg-[#1D1B1B] bg-[#F5F5F5]">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg border border-[#2596be] dark:bg-[#1D1B1B] bg-[#D9D9D9]">
                        <div className="p-6 font-semibold dark:text-[#D9D9D9] text-[#1D1B1B]">
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e]"
                            >
                                {showForm ? "Cancel" : "Add New Stock"}
                            </button>

                            {showForm && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-4 space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium">
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
                                            className="w-full border rounded px-3 py-2 text-[#1D1B1B]"
                                            required
                                        >
                                            <option value="">
                                                Select Fabric Type
                                            </option>
                                            <option value="Cotton">
                                                Cotton
                                            </option>
                                            <option value="Linen">Linen</option>
                                            <option value="Wool">Wool</option>
                                            <option value="Silk">Silk</option>
                                            <option value="Hemp">Hemp</option>
                                            <option value="Polyester">
                                                Polyester
                                            </option>
                                            <option value="Nylon">Nylon</option>
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
                                            <option value="Denim">Denim</option>
                                            <option value="Jersey">
                                                Jersey
                                            </option>
                                            <option value="Flannel">
                                                Flannel
                                            </option>
                                            <option value="Satin">Satin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
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
                                            className="w-full border rounded px-3 py-2 text-[#1D1B1B]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Color
                                        </label>
                                        <input
                                            type="text"
                                            value={data.color}
                                            onChange={(e) =>
                                                setData("color", e.target.value)
                                            }
                                            className="w-full border rounded px-3 py-2 text-[#1D1B1B]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
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
                                            className="w-full border rounded px-3 py-2 text-[#1D1B1B]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
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
                                            className="w-full border rounded px-3 py-2 text-[#1D1B1B]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
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
                                            className="w-full border rounded px-3 py-2 text-[#1D1B1B]"
                                        ></textarea>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.samples_availability}
                                            onChange={(e) =>
                                                setData(
                                                    "samples_availability",
                                                    e.target.checked
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        <label>Samples Availability</label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Submitting..."
                                            : "Submit"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                        <h3 className="text-lg font-bold text-primary mb-4 text-center">
                            Manage Your Stocks
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#2596be] bg-white dark:bg-[#1D1B1B] border border-[#2596be] rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                            ID
                                        </th>
                                        <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                            Type
                                        </th>
                                        <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                            Color
                                        </th>
                                        <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                            Location
                                        </th>
                                        <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                            Price
                                        </th>
                                        <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                            Total Qty
                                        </th>
                                        <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                            Available Qty
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2596be]">
                                    {fabricStocks &&
                                    fabricStocks.data &&
                                    fabricStocks.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center text-gray-500 dark:text-gray-300 py-12"
                                            >
                                                No stocks found.
                                            </td>
                                        </tr>
                                    ) : (
                                        fabricStocks &&
                                        fabricStocks.data &&
                                        fabricStocks.data.map((stock: any) => (
                                            <tr
                                                key={stock.stock_id}
                                                className="hover:bg-[#f0f8ff] dark:hover:bg-[#232323]"
                                            >
                                                <td className="px-4 py-2">
                                                    {stock.stock_id}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {stock.fabric_type}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {stock.color}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {stock.stock_location ||
                                                        "-"}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {stock.price_per_unit}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {stock.total_quantity}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {stock.available_quantity}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
