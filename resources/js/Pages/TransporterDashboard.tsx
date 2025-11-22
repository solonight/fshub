import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function TransporterDashboard({
    auth,
    transporterCards = [],
}: any) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        vehicleType: "",
        licensePlate: "",
        capacity: "",
        serviceAreas: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("transporter-cards.store"), {
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
                    Transporter Dashboard
                </h2>
            }
        >
            <Head title="Transporter Dashboard" />

            <div className="py-12 min-h-screen dark:bg-[#1D1B1B] bg-[#F5F5F5]">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg border border-[#2596be] dark:bg-[#1D1B1B] bg-[#D9D9D9]">
                        <div className="p-6 font-semibold dark:text-[#D9D9D9] text-[#1D1B1B]">
                            You're logged in!
                        </div>
                    </div>

                    {/* Add New Card Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e]"
                        >
                            Add New Card
                        </button>
                    </div>

                    {/* My Cards Section */}
                    {/* My Cards Section */}
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-4 dark:text-[#D9D9D9] text-[#1D1B1B]">
                            My Cards
                        </h3>
                        <div className="bg-white dark:bg-[#232323] border border-[#2596be] rounded shadow p-4">
                            {transporterCards && transporterCards.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {transporterCards.map((card: any) => (
                                        <div
                                            key={card.id}
                                            className="bg-[#F5F5F5] dark:bg-[#1D1B1B] border border-[#2596be] rounded-lg p-4 shadow hover:shadow-lg transition-shadow flex flex-col"
                                        >
                                            <div className="font-bold text-[#2596be] dark:text-[#D9D9D9] mb-2">
                                                {card.vehicleType}
                                            </div>
                                            <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                                License Plate:{" "}
                                                {card.licensePlate}
                                            </div>
                                            <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                                Capacity: {card.capacity}
                                            </div>
                                            <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                                Service Areas:{" "}
                                                {card.serviceAreas}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Created:{" "}
                                                {new Date(
                                                    card.created_at
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">
                                    You have no cards yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="dark:bg-[#1D1B1B] bg-[#D9D9D9] p-6 rounded shadow-md w-96 border border-[#2596be]">
                            <h3 className="text-lg font-semibold mb-4 dark:text-[#D9D9D9] text-[#1D1B1B]">
                                Create New Transporter Card
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1 dark:text-[#D9D9D9] text-[#1D1B1B]">
                                        Vehicle Type
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleType"
                                        value={data.vehicleType}
                                        onChange={(e) =>
                                            setData(
                                                "vehicleType",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded px-3 py-2 dark:bg-[#1D1B1B] bg-[#F5F5F5] dark:text-[#D9D9D9] text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1 dark:text-[#D9D9D9] text-[#1D1B1B]">
                                        License Plate
                                    </label>
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        value={data.licensePlate}
                                        onChange={(e) =>
                                            setData(
                                                "licensePlate",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded px-3 py-2 dark:bg-[#1D1B1B] bg-[#F5F5F5] dark:text-[#D9D9D9] text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1 dark:text-[#D9D9D9] text-[#1D1B1B]">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={data.capacity}
                                        onChange={(e) =>
                                            setData("capacity", e.target.value)
                                        }
                                        className="w-full border rounded px-3 py-2 dark:bg-[#1D1B1B] bg-[#F5F5F5] dark:text-[#D9D9D9] text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1 dark:text-[#D9D9D9] text-[#1D1B1B]">
                                        Service Areas
                                    </label>
                                    <input
                                        type="text"
                                        name="serviceAreas"
                                        value={data.serviceAreas}
                                        onChange={(e) =>
                                            setData(
                                                "serviceAreas",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded px-3 py-2 dark:bg-[#1D1B1B] bg-[#F5F5F5] dark:text-[#D9D9D9] text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-[#1D1B1B] dark:text-[#D9D9D9]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e]"
                                        disabled={processing}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
