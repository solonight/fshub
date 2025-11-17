import React, { useState } from "react";
// @ts-ignore
import InputMask from "react-input-mask";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function StockDashboard({ auth, fabricStocks }: any) {
    // Delete handler for a stock
    const handleDelete = (stockId: number) => {
        router.delete(`/fabric-stocks/${stockId}`);
    };
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

    // State for Add Sale form
    const [selectedStockForSale, setSelectedStockForSale] = useState<any>(null);
    const [saleForm, setSaleForm] = useState({
        customer_name: "",
        customer_phone: "",
        quantity_sold: "",
        total_amount: "",
        is_payed: false,
        notes: "",
        sale_date: "",
    });

    // State for Update Stock form
    const [selectedStockForUpdate, setSelectedStockForUpdate] =
        useState<any>(null);
    const [updateForm, setUpdateForm] = useState({
        fabric_type: "",
        stock_location: "",
        color: "",
        price_per_unit: "",
        total_quantity: "",
        available_quantity: "",
        description: "",
        auto_delete: false,
        samples_availability: false,
    });

    // When a stock is selected for update, pre-fill the form
    const handleUpdateClick = (stock: any) => {
        setSelectedStockForUpdate(stock);
        setUpdateForm({
            fabric_type: stock.fabric_type || "",
            stock_location: stock.stock_location || "",
            color: stock.color || "",
            price_per_unit: stock.price_per_unit || "",
            total_quantity: stock.total_quantity || "",
            available_quantity: stock.available_quantity || "",
            description: stock.description || "",
            auto_delete: !!stock.auto_delete,
            samples_availability: !!stock.samples_availability,
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(
            `/fabric-stocks/${selectedStockForUpdate.stock_id}`,
            updateForm,
            {
                onSuccess: () => {
                    setSelectedStockForUpdate(null);
                },
            }
        );
    };

    // Stock creation form submit handler (renamed to avoid confusion)
    const handleSubmitStock = (e: React.FormEvent) => {
        e.preventDefault();
        post("/fabric-stocks", {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleSaleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Prepare payload to match controller validation
        const payload = {
            stock_id: selectedStockForSale.stock_id,
            customer_name: saleForm.customer_name,
            customer_phone: saleForm.customer_phone,
            quantity_sold: saleForm.quantity_sold,
            total_amount: saleForm.total_amount,
            is_payed: saleForm.is_payed,
            notes: saleForm.notes,
            sale_date: saleForm.sale_date,
        };
        router.post(
            `/fabric-stocks/${selectedStockForSale.stock_id}/sales`,
            payload,
            {
                onSuccess: () => {
                    setSaleForm({
                        customer_name: "",
                        customer_phone: "",
                        quantity_sold: "",
                        total_amount: "",
                        is_payed: false,
                        notes: "",
                        sale_date: "",
                    });
                    setSelectedStockForSale(null);
                },
            }
        );
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
                                        onSubmit={handleSubmitStock}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
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
                                            <div className="mb-2">
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Available Qty:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {stock.available_quantity}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 mt-auto w-full">
                                                <button
                                                    onClick={() =>
                                                        setSelectedStockForSale(
                                                            stock
                                                        )
                                                    }
                                                    className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded hover:bg-green-600 transition-colors"
                                                >
                                                    Add Sale
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateClick(stock)
                                                    }
                                                    className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-yellow-400 text-black text-xs sm:text-sm rounded hover:bg-yellow-500 transition-colors"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            stock.stock_id
                                                        )
                                                    }
                                                    className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Update Stock Form Section (appears below Manage Your Stocks) */}
                {selectedStockForUpdate && (
                    <div className="mt-8 p-2 sm:p-6 bg-white dark:bg-yellow-100 rounded-lg shadow w-full max-w-md mx-auto">
                        <h3 className="text-base sm:text-lg font-bold text-yellow-600 mb-2 sm:mb-4 text-center">
                            Update Stock #{selectedStockForUpdate.stock_id}
                        </h3>
                        <form
                            onSubmit={handleUpdateSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Fabric Type
                                </label>
                                <select
                                    value={updateForm.fabric_type}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            fabric_type: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                    required
                                >
                                    <option value="">Select Fabric Type</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Linen">Linen</option>
                                    <option value="Wool">Wool</option>
                                    <option value="Silk">Silk</option>
                                    <option value="Hemp">Hemp</option>
                                    <option value="Polyester">Polyester</option>
                                    <option value="Nylon">Nylon</option>
                                    <option value="Acrylic">Acrylic</option>
                                    <option value="Spandex">Spandex</option>
                                    <option value="Viscose/Rayon">
                                        Viscose/Rayon
                                    </option>
                                    <option value="Lyocell (Tencel)">
                                        Lyocell (Tencel)
                                    </option>
                                    <option value="Denim">Denim</option>
                                    <option value="Jersey">Jersey</option>
                                    <option value="Flannel">Flannel</option>
                                    <option value="Satin">Satin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Stock Location
                                </label>
                                <input
                                    type="text"
                                    value={updateForm.stock_location}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            stock_location: e.target.value,
                                        })
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
                                    value={updateForm.color}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            color: e.target.value,
                                        })
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
                                    value={updateForm.price_per_unit}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            price_per_unit: e.target.value,
                                        })
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
                                    value={updateForm.total_quantity}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            total_quantity: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Available Quantity
                                </label>
                                <input
                                    type="number"
                                    value={updateForm.available_quantity}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            available_quantity: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    value={updateForm.description}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                ></textarea>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={updateForm.samples_availability}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            samples_availability:
                                                e.target.checked,
                                        })
                                    }
                                    className="mr-2"
                                />
                                <label className="text-xs sm:text-sm">
                                    Samples Availability
                                </label>
                            </div>
                            {/* Removed Auto Delete When Empty checkbox as requested */}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Update Stock
                                </button>
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    onClick={() =>
                                        setSelectedStockForUpdate(null)
                                    }
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Add Sale Form Section (appears below Manage Your Stocks) */}
                {selectedStockForSale && (
                    <div className="mt-8 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow w-full max-w-md mx-auto">
                        <h3 className="text-base sm:text-lg font-bold text-green-600 mb-2 sm:mb-4 text-center">
                            Add Sale for Stock #{selectedStockForSale.stock_id}
                        </h3>
                        <form onSubmit={handleSaleSubmit} className="space-y-4">
                            {/* customer_name */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    value={saleForm.customer_name}
                                    onChange={(e) =>
                                        setSaleForm({
                                            ...saleForm,
                                            customer_name: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                    required
                                />
                            </div>
                            {/* customer_phone */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Customer Phone
                                </label>
                                <InputMask
                                    mask="+212 9 99 99 99 99"
                                    maskChar={null}
                                    id="customer_phone"
                                    name="customer_phone"
                                    type="tel"
                                    value={saleForm.customer_phone}
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                    autoComplete="tel"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setSaleForm({
                                            ...saleForm,
                                            customer_phone: e.target.value,
                                        })
                                    }
                                    placeholder="+212 * ** ** ** **"
                                />
                            </div>
                            {/* quantity_sold */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Quantity Sold
                                </label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={saleForm.quantity_sold}
                                    onChange={(e) =>
                                        setSaleForm({
                                            ...saleForm,
                                            quantity_sold: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                    required
                                />
                            </div>
                            {/* total_amount */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Total Amount (MAD)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={saleForm.total_amount}
                                    onChange={(e) =>
                                        setSaleForm({
                                            ...saleForm,
                                            total_amount: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                    required
                                />
                            </div>
                            {/* is_payed */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={saleForm.is_payed}
                                    onChange={(e) =>
                                        setSaleForm({
                                            ...saleForm,
                                            is_payed: e.target.checked,
                                        })
                                    }
                                    className="mr-2"
                                />
                                <label className="text-xs sm:text-sm">
                                    Is Payed
                                </label>
                            </div>
                            {/* notes */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Notes
                                </label>
                                <textarea
                                    value={saleForm.notes}
                                    onChange={(e) =>
                                        setSaleForm({
                                            ...saleForm,
                                            notes: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                ></textarea>
                            </div>
                            {/* sale_date */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium">
                                    Sale Date
                                </label>
                                <input
                                    type="date"
                                    value={saleForm.sale_date}
                                    onChange={(e) =>
                                        setSaleForm({
                                            ...saleForm,
                                            sale_date: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B] text-xs sm:text-base"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Submit Sale
                                </button>
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    onClick={() =>
                                        setSelectedStockForSale(null)
                                    }
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Sales Records Section */}
                <div className="mt-8 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                        Sales Records
                    </h3>
                    <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                        {/* TODO: Render sales records here */}
                        Sales records content goes here.
                    </div>
                </div>

                {/* Stock Histories Section */}
                <div className="mt-8 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                        Stock Histories
                    </h3>
                    <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                        {/* TODO: Render stock histories here */}
                        Stock histories content goes here.
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
