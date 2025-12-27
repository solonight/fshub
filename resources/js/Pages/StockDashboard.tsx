import React, { useState, useEffect } from "react";
import axios from "axios";
// @ts-ignore
import InputMask from "react-input-mask";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PieChart, { PieChartData } from "@/Components/PieChart";
import AreaBumpChart from "@/Components/AreaBumpChart";
import { PageProps } from "@/types";

export default function StockDashboard({
    auth,
    fabricStocks,
    unpaidSales,
    paidSales,
}: any) {
    // Delete handler for a stock
    const handleDelete = (stockId: number) => {
        setSelectedStockIdForDelete(stockId);
        setShowConfirmDelete(true);
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
    const [saleError, setSaleError] = useState<string | null>(null);

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

    const [showConfirmPaid, setShowConfirmPaid] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmConfirmPassword, setConfirmConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

    // States for Delete Confirmation
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [confirmDeletePassword, setConfirmDeletePassword] = useState("");
    const [confirmDeleteConfirmPassword, setConfirmDeleteConfirmPassword] =
        useState("");
    const [confirmDeleteError, setConfirmDeleteError] = useState("");
    const [selectedStockIdForDelete, setSelectedStockIdForDelete] = useState<
        number | null
    >(null);

    // Handler to mark sale record as paid
    const handleMarkAsPaid = (saleId: number, password: string) => {
        router.patch(
            `/sales-records/${saleId}/pay`,
            { is_payed: true, password },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowConfirmPaid(false);
                    setConfirmPassword("");
                    setConfirmConfirmPassword("");
                    setConfirmPasswordError("");
                    setSelectedSaleId(null);
                },
            }
        );
    };

    // Handler to confirm delete stock
    const handleConfirmDelete = (stockId: number, password: string) => {
        router.delete(`/fabric-stocks/${stockId}`, {
            data: { password },
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirmDelete(false);
                setConfirmDeletePassword("");
                setConfirmDeleteConfirmPassword("");
                setConfirmDeleteError("");
                setSelectedStockIdForDelete(null);
            },
        });
    };

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
        setSaleError(null); // Reset error before submission

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
                    router.reload();
                },
                onError: (errors) => {
                    if (errors.message) {
                        setSaleError(errors.message);
                    }
                },
            }
        );
    };

    // Stock Histories State
    const [stockHistories, setStockHistories] = useState<any>({});
    const [expandedStockIds, setExpandedStockIds] = useState<number[]>([]);
    const [loadingHistories, setLoadingHistories] = useState(false);

    // State for selected stock in chart
    const [selectedStockForChart, setSelectedStockForChart] =
        useState<any>(null);
    useEffect(() => {
        setLoadingHistories(true);
        axios
            .get("/user-stock-histories")
            .then((res) => {
                setStockHistories(res.data);
            })
            .finally(() => setLoadingHistories(false));
    }, []);
    const toggleExpand = (stockId: number) => {
        setExpandedStockIds((prev) =>
            prev.includes(stockId)
                ? prev.filter((id) => id !== stockId)
                : [...prev, stockId]
        );
    };

    // Calculate dynamic data for pie chart (amounts)
    let instockValue: number;
    let unpaidAmount: number;
    let paidAmount: number;

    if (selectedStockForChart) {
        // For selected stock
        instockValue =
            (selectedStockForChart.available_quantity || 0) *
            (parseFloat(selectedStockForChart.price_per_unit) || 0);
        const filteredUnpaid =
            unpaidSales?.filter(
                (sale: any) => sale.stock_id == selectedStockForChart.stock_id
            ) || [];
        const filteredPaid =
            paidSales?.filter(
                (sale: any) => sale.stock_id == selectedStockForChart.stock_id
            ) || [];
        unpaidAmount = filteredUnpaid.reduce(
            (sum: number, sale: any) =>
                sum + (parseFloat(sale.total_amount) || 0),
            0
        );
        paidAmount = filteredPaid.reduce(
            (sum: number, sale: any) =>
                sum + (parseFloat(sale.total_amount) || 0),
            0
        );
    } else {
        // For all stocks
        instockValue =
            fabricStocks?.data?.reduce(
                (sum: number, stock: any) =>
                    sum +
                    (stock.available_quantity || 0) *
                        (parseFloat(stock.price_per_unit) || 0),
                0
            ) || 0;
        unpaidAmount =
            unpaidSales?.reduce(
                (sum: number, sale: any) =>
                    sum + (parseFloat(sale.total_amount) || 0),
                0
            ) || 0;
        paidAmount =
            paidSales?.reduce(
                (sum: number, sale: any) =>
                    sum + (parseFloat(sale.total_amount) || 0),
                0
            ) || 0;
    }

    // Chart data shows categories with values > 0
    const chartData = [
        {
            id: `Instock: ${Math.round(instockValue).toLocaleString("fr")}/MAD`,
            label: "Instock",
            value: instockValue,
            color: "#2196F3",
        },
        {
            id: `Unpaid: ${Math.round(unpaidAmount).toLocaleString("fr")}/MAD`,
            label: "Unpayed",
            value: unpaidAmount,
            color: "#FF2D2D",
        },
        {
            id: `Sold: ${Math.round(paidAmount).toLocaleString("fr")}/MAD`,
            label: "Sold",
            value: paidAmount,
            color: "#4CAF50",
        },
    ].filter((item) => item.value > 0);

    // State to toggle chart type
    const [showPieChart, setShowPieChart] = useState(true);

    // New state to toggle between first and second half of the year for AreaBumpChart
    const [showFirstHalf, setShowFirstHalf] = useState(true);

    // AreaBumpChart sample data (extended to 12 months)
    const areaBumpData = [
        {
            id: "Cotton",
            data: [
                { x: "Jan", y: 10 },
                { x: "Feb", y: 20 },
                { x: "Mar", y: 15 },
                { x: "Apr", y: 25 },
                { x: "May", y: 30 },
                { x: "Jun", y: 35 },
                { x: "Jul", y: 40 },
                { x: "Aug", y: 45 },
                { x: "Sep", y: 50 },
                { x: "Oct", y: 55 },
                { x: "Nov", y: 60 },
                { x: "Dec", y: 65 },
            ],
        },
        {
            id: "denim",
            data: [
                { x: "Jan", y: 10 },
                { x: "Feb", y: 20 },
                { x: "Mar", y: 30 },
                { x: "Apr", y: 25 },
                { x: "May", y: 30 },
                { x: "Jun", y: 35 },
                { x: "Jul", y: 40 },
                { x: "Aug", y: 45 },
                { x: "Sep", y: 50 },
                { x: "Oct", y: 55 },
                { x: "Nov", y: 60 },
                { x: "Dec", y: 65 },
            ],
        },
        {
            id: "Linen",
            data: [
                { x: "Jan", y: 8 },
                { x: "Feb", y: 18 },
                { x: "Mar", y: 12 },
                { x: "Apr", y: 22 },
                { x: "May", y: 27 },
                { x: "Jun", y: 32 },
                { x: "Jul", y: 37 },
                { x: "Aug", y: 42 },
                { x: "Sep", y: 47 },
                { x: "Oct", y: 52 },
                { x: "Nov", y: 57 },
                { x: "Dec", y: 62 },
            ],
        },
        {
            id: "Wool",
            data: [
                { x: "Jan", y: 5 },
                { x: "Feb", y: 10 },
                { x: "Mar", y: 8 },
                { x: "Apr", y: 12 },
                { x: "May", y: 15 },
                { x: "Jun", y: 18 },
                { x: "Jul", y: 20 },
                { x: "Aug", y: 25 },
                { x: "Sep", y: 30 },
                { x: "Oct", y: 35 },
                { x: "Nov", y: 40 },
                { x: "Dec", y: 45 },
            ],
        },
    ];

    // Split data into first and second halves
    const firstHalfData = areaBumpData.map((series) => ({
        ...series,
        data: series.data.slice(0, 6), // Jan-Jun
    }));
    const secondHalfData = areaBumpData.map((series) => ({
        ...series,
        data: series.data.slice(6, 12), // Jul-Dec
    }));

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

                    {/* Choose Your Chart Button above Stock Tracking */}
                    <div className="flex justify-center mt-6 sm:mt-8 w-full">
                        <button
                            type="button"
                            className="w-full sm:w-auto px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e] font-semibold shadow text-center"
                            onClick={() => setShowPieChart((prev) => !prev)}
                        >
                            Switch Your Chart
                        </button>
                        {!showPieChart && (
                            <button
                                type="button"
                                className="ml-4 w-full sm:w-auto px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e] font-semibold shadow text-center"
                                onClick={() =>
                                    setShowFirstHalf((prev) => !prev)
                                }
                            >
                                {showFirstHalf
                                    ? "Show Jul-Dec"
                                    : "Show Jan-Jun"}
                            </button>
                        )}
                    </div>
                    <div className="mt-4 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                            Stocks Tracking
                        </h3>
                        <div className="flex mb-4">
                            <select
                                value={
                                    selectedStockForChart
                                        ? selectedStockForChart.stock_id
                                        : ""
                                }
                                onChange={(e) => {
                                    const id = e.target.value;
                                    if (id === "") {
                                        setSelectedStockForChart(null);
                                    } else {
                                        const stock = fabricStocks?.data?.find(
                                            (s: any) => s.stock_id == id
                                        );
                                        setSelectedStockForChart(stock || null);
                                    }
                                }}
                                className="w-full sm:w-60 border rounded px-3 py-2 text-[#1D1B1B] bg-white dark:bg-[#232323] dark:text-white"
                            >
                                <option value="">All Stocks</option>
                                {fabricStocks?.data?.map((stock: any) => (
                                    <option
                                        key={stock.stock_id}
                                        value={stock.stock_id}
                                    >
                                        Stock #{stock.stock_id} -{" "}
                                        {stock.fabric_type} {stock.color}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-center items-stretch">
                            <div
                                className="flex justify-center items-center w-full overflow-hidden"
                                style={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    height: 400,
                                }}
                            >
                                {showPieChart ? (
                                    <PieChart data={chartData} height={400} />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            maxWidth: "100%",
                                            height: 400,
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <AreaBumpChart
                                            data={
                                                showFirstHalf
                                                    ? firstHalfData
                                                    : secondHalfData
                                            }
                                        />
                                    </div>
                                )}
                            </div>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                    {Number(
                                                        stock.price_per_unit
                                                    )
                                                        .toLocaleString("en-US")
                                                        .replace(
                                                            /,/g,
                                                            "."
                                                        )}{" "}
                                                    MAD/m
                                                </span>
                                            </div>
                                            <div className="mb-1">
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Total Qty:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {Number(
                                                        stock.total_quantity
                                                    )
                                                        .toLocaleString("en-US")
                                                        .replace(
                                                            /,/g,
                                                            "."
                                                        )}{" "}
                                                    /meter
                                                </span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                    Available Qty:{" "}
                                                </span>
                                                <span className="text-xs">
                                                    {Number(
                                                        stock.available_quantity
                                                    )
                                                        .toLocaleString("en-US")
                                                        .replace(
                                                            /,/g,
                                                            "."
                                                        )}{" "}
                                                    /meter
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
                                        <option value="">
                                            Select Fabric Type
                                        </option>
                                        <option value="Cotton">Cotton</option>
                                        <option value="Linen">Linen</option>
                                        <option value="Wool">Wool</option>
                                        <option value="Silk">Silk</option>
                                        <option value="Hemp">Hemp</option>
                                        <option value="Polyester">
                                            Polyester
                                        </option>
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
                                                available_quantity:
                                                    e.target.value,
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
                                        checked={
                                            updateForm.samples_availability
                                        }
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
                                Add Sale for Stock #
                                {selectedStockForSale.stock_id}
                            </h3>
                            <form
                                onSubmit={handleSaleSubmit}
                                className="space-y-4"
                            >
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
                                {/* Display sale error message */}
                                {saleError && (
                                    <div className="text-red-500 text-sm mt-2">
                                        {saleError}
                                    </div>
                                )}
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
                            Unpaid Sales Records
                        </h3>
                        {unpaidSales && unpaidSales.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {unpaidSales.map((sale: any) => (
                                    <div
                                        key={sale.record_id}
                                        className="bg-white dark:bg-[#232323] text-black dark:text-white rounded-lg p-4 border-2 border-red-400 shadow-lg hover:shadow-2xl hover:border-red-600 transition-all duration-200 flex flex-col"
                                    >
                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Customer:
                                            </span>{" "}
                                            {sale.customer_name}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Phone:
                                            </span>{" "}
                                            {sale.customer_phone}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Quantity Sold:
                                            </span>{" "}
                                            {Number(sale.quantity_sold)
                                                .toLocaleString("en-US")
                                                .replace(/,/g, ".")}{" "}
                                            /meter
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Total Amount:
                                            </span>
                                            <span className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                                                {Number(sale.total_amount)
                                                    .toLocaleString("en-US")
                                                    .replace(/,/g, ".")}{" "}
                                                MAD
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Sale Date:
                                            </span>{" "}
                                            {sale.sale_date
                                                ? sale.sale_date.split("T")[0]
                                                : ""}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Notes:
                                            </span>{" "}
                                            {sale.notes}
                                        </div>
                                        <button
                                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-bold"
                                            onClick={() => {
                                                setSelectedSaleId(
                                                    sale.record_id
                                                );
                                                setShowConfirmPaid(true);
                                            }}
                                        >
                                            Is Payed
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                                No unpaid sales records found.
                            </div>
                        )}
                    </div>
                    {/* Stock Histories Section */}
                    <div className="mt-8 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                            Stock Histories
                        </h3>
                        {loadingHistories ? (
                            <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                                Loading stock histories...
                            </div>
                        ) : stockHistories &&
                          Object.keys(stockHistories).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(stockHistories).map(
                                    ([stockId, histories]) => (
                                        <div key={stockId}>
                                            <button
                                                className={`w-full text-left px-4 py-2 rounded font-semibold border border-primary bg-muted dark:bg-dark hover:bg-primary hover:text-white transition-colors ${
                                                    expandedStockIds.includes(
                                                        Number(stockId)
                                                    )
                                                        ? "bg-primary text-white"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    toggleExpand(
                                                        Number(stockId)
                                                    )
                                                }
                                            >
                                                Stock #{stockId} (
                                                {Array.isArray(histories)
                                                    ? histories.length
                                                    : 0}{" "}
                                                history record
                                                {Array.isArray(histories) &&
                                                histories.length > 1
                                                    ? "s"
                                                    : ""}
                                                )
                                            </button>
                                            {expandedStockIds.includes(
                                                Number(stockId)
                                            ) &&
                                                Array.isArray(histories) && (
                                                    <div className="pl-6 pt-2">
                                                        {histories.map(
                                                            (history: any) => (
                                                                <div
                                                                    key={
                                                                        history.history_id
                                                                    }
                                                                    className="mb-4 p-4 rounded border border-gray-300 bg-gray-50 dark:bg-[#232323]"
                                                                >
                                                                    <div className="font-bold text-primary">
                                                                        Change
                                                                        Type:{" "}
                                                                        {
                                                                            history.change_type
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        Quantity:{" "}
                                                                        {Number(
                                                                            history.quantity
                                                                        )
                                                                            .toLocaleString(
                                                                                "en-US"
                                                                            )
                                                                            .replace(
                                                                                /,/g,
                                                                                "."
                                                                            )}
                                                                    </div>
                                                                    <div>
                                                                        Notes:{" "}
                                                                        {history.notes ||
                                                                            "-"}
                                                                    </div>
                                                                    <div>
                                                                        Reference
                                                                        ID:{" "}
                                                                        {history.reference_id ||
                                                                            "-"}
                                                                    </div>
                                                                    <div>
                                                                        Is
                                                                        Payed:{" "}
                                                                        {history.is_payed
                                                                            ? "Yes"
                                                                            : "No"}
                                                                    </div>
                                                                    <div>
                                                                        Customer
                                                                        Name:{" "}
                                                                        {history.customer_name ||
                                                                            "-"}
                                                                    </div>
                                                                    <div>
                                                                        Customer
                                                                        Phone:{" "}
                                                                        {history.customer_phone ||
                                                                            "-"}
                                                                    </div>
                                                                    <div>
                                                                        Fabric
                                                                        Type:{" "}
                                                                        {history.fabric_type_snapshot ||
                                                                            "-"}
                                                                    </div>
                                                                    <div>
                                                                        Color:{" "}
                                                                        {history.color_snapshot ||
                                                                            "-"}
                                                                    </div>
                                                                    <div>
                                                                        Price
                                                                        Per
                                                                        Unit:{" "}
                                                                        {history.price_per_unit_snapshot
                                                                            ? `${Number(
                                                                                  history.price_per_unit_snapshot
                                                                              )
                                                                                  .toLocaleString(
                                                                                      "en-US"
                                                                                  )
                                                                                  .replace(
                                                                                      /,/g,
                                                                                      "."
                                                                                  )} MAD`
                                                                            : "-"}
                                                                    </div>
                                                                    <div>
                                                                        Date:{" "}
                                                                        {history.created_at
                                                                            ? new Date(
                                                                                  history.created_at
                                                                              ).toLocaleString()
                                                                            : "-"}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                                No stock histories found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Confirmation Modal for Marking as Paid */}
                {showConfirmPaid && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                            <h3 className="text-lg font-bold mb-4 text-center">
                                Mark this record as payed
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmConfirmPassword}
                                    onChange={(e) =>
                                        setConfirmConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm your password"
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                />
                            </div>
                            {confirmPasswordError && (
                                <div className="text-red-500 text-sm mb-4">
                                    {confirmPasswordError}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (
                                            confirmPassword !==
                                            confirmConfirmPassword
                                        ) {
                                            setConfirmPasswordError(
                                                "Passwords do not match"
                                            );
                                            return;
                                        }
                                        if (!confirmPassword.trim()) {
                                            setConfirmPasswordError(
                                                "Password is required"
                                            );
                                            return;
                                        }
                                        setConfirmPasswordError("");
                                        if (selectedSaleId) {
                                            handleMarkAsPaid(
                                                selectedSaleId,
                                                confirmPassword
                                            );
                                        }
                                    }}
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => {
                                        setShowConfirmPaid(false);
                                        setConfirmPassword("");
                                        setConfirmConfirmPassword("");
                                        setConfirmPasswordError("");
                                        setSelectedSaleId(null);
                                    }}
                                    className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal for Deleting Stock */}
                {showConfirmDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                            <h3 className="text-lg font-bold mb-4 text-center">
                                Delete the stock
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmDeletePassword}
                                    onChange={(e) =>
                                        setConfirmDeletePassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmDeleteConfirmPassword}
                                    onChange={(e) =>
                                        setConfirmDeleteConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm your password"
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                />
                            </div>
                            {confirmDeleteError && (
                                <div className="text-red-500 text-sm mb-4">
                                    {confirmDeleteError}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (
                                            confirmDeletePassword !==
                                            confirmDeleteConfirmPassword
                                        ) {
                                            setConfirmDeleteError(
                                                "Passwords do not match"
                                            );
                                            return;
                                        }
                                        if (!confirmDeletePassword.trim()) {
                                            setConfirmDeleteError(
                                                "Password is required"
                                            );
                                            return;
                                        }
                                        setConfirmDeleteError("");
                                        if (selectedStockIdForDelete) {
                                            handleConfirmDelete(
                                                selectedStockIdForDelete,
                                                confirmDeletePassword
                                            );
                                        }
                                    }}
                                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => {
                                        setShowConfirmDelete(false);
                                        setConfirmDeletePassword("");
                                        setConfirmDeleteConfirmPassword("");
                                        setConfirmDeleteError("");
                                        setSelectedStockIdForDelete(null);
                                    }}
                                    className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
