import React, { useState, useEffect, useMemo } from "react";
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
    const calculateToPay = (sale: any) => {
        const paidAmount =
            sale.payments?.reduce(
                (sum: number, payment: any) =>
                    sum + (parseFloat(payment.amount) || 0),
                0,
            ) || 0;
        return parseFloat(sale.total_amount) - paidAmount;
    };

    const getBackgroundColor = (sale: any) => {
        const total = parseFloat(sale.total_amount) || 0;
        const toPay = calculateToPay(sale);
        const paid = total - toPay;
        const percentage = total > 0 ? (paid / total) * 100 : 0;
        const hue = (percentage / 100) * 120; // 0 to 120
        return `hsla(${hue}, 100%, 50%, 0.7)`;
    };

    const getNetQuantitySold = (sale: any) => {
        const sold = parseFloat(sale.quantity_sold) || 0;
        const returned = (sale.returns || []).reduce(
            (sum: number, ret: any) =>
                sum + (parseFloat(ret.returned_quantity) || 0),
            0,
        );
        return Math.max(0, sold - returned);
    };

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
    const [showAddSaleModal, setShowAddSaleModal] = useState(false);
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

    // State for Return Sale
    const [selectedStockForReturn, setSelectedStockForReturn] =
        useState<any>(null);
    const [selectedReturnSale, setSelectedReturnSale] = useState<any>(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnForm, setReturnForm] = useState({
        returned_quantity: "",
        returned_amount: "",
        notes: "",
    });
    const [returnError, setReturnError] = useState<string | null>(null);
    const [returnPassword, setReturnPassword] = useState("");
    const [returnConfirmPassword, setReturnConfirmPassword] = useState("");

    const getValidationMessage = (error: any) =>
        Array.isArray(error) ? error[0] : error || "";

    const getErrorMessage = (error: any) => {
        if (!error) return "";
        if (Array.isArray(error)) return error[0] || "";
        return String(error);
    };

    // State for Update Stock form
    const [selectedStockForUpdate, setSelectedStockForUpdate] =
        useState<any>(null);
    const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
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

    // State for selected sale in payment modal
    const [selectedSale, setSelectedSale] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentError, setPaymentError] = useState("");

    // State for Sales to Return section visibility
    const [showSalesToReturn, setShowSalesToReturn] = useState(false);

    // States for Delete Confirmation
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [confirmDeletePassword, setConfirmDeletePassword] = useState("");
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
                    setSelectedSale(null);
                    setPaymentAmount("");
                    loadStockHistories();
                    router.reload();
                },
            },
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
                setConfirmDeleteError("");
                setSelectedStockIdForDelete(null);
                loadStockHistories();
                router.reload();
            },
            onError: (errors: any) => {
                setConfirmDeleteError(
                    getErrorMessage(errors.password) ||
                        getErrorMessage(errors.message) ||
                        "Invalid password",
                );
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
                    setShowUpdateStockModal(false);
                    loadStockHistories();
                    router.reload();
                },
            },
        );
    };

    // Stock creation form submit handler (renamed to avoid confusion)
    const handleSubmitStock = (e: React.FormEvent) => {
        e.preventDefault();
        post("/fabric-stocks", {
            onSuccess: () => {
                reset();
                setShowForm(false);
                loadStockHistories();
                router.reload();
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
                    setShowAddSaleModal(false);
                    loadStockHistories();
                    router.reload();
                },
                onError: (errors) => {
                    if (errors.message) {
                        setSaleError(errors.message);
                    }
                },
            },
        );
    };

    const openReturnModal = (sale: any) => {
        setSelectedReturnSale(sale);
        setReturnForm({
            returned_quantity: "",
            returned_amount: "",
            notes: "",
        });
        setReturnPassword("");
        setReturnConfirmPassword("");
        setReturnError(null);
        setShowReturnModal(true);
    };

    const closeReturnModal = () => {
        setShowReturnModal(false);
        setSelectedReturnSale(null);
        setReturnForm({
            returned_quantity: "",
            returned_amount: "",
            notes: "",
        });
        setReturnPassword("");
        setReturnConfirmPassword("");
        setReturnError(null);
    };

    const closeAddSaleModal = () => {
        setShowAddSaleModal(false);
        setSelectedStockForSale(null);
        setSaleForm({
            customer_name: "",
            customer_phone: "",
            quantity_sold: "",
            total_amount: "",
            is_payed: false,
            notes: "",
            sale_date: "",
        });
        setSaleError(null);
    };

    const closeUpdateStockModal = () => {
        setShowUpdateStockModal(false);
        setSelectedStockForUpdate(null);
        setUpdateForm({
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
    };

    const handleReturnSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReturnSale) {
            return;
        }

        if (
            !returnForm.returned_quantity ||
            parseFloat(returnForm.returned_quantity) <= 0
        ) {
            setReturnError("Returned quantity must be greater than 0.");
            return;
        }

        if (
            !returnForm.returned_amount ||
            parseFloat(returnForm.returned_amount) <= 0
        ) {
            setReturnError("Returned amount must be greater than 0.");
            return;
        }

        if (!returnPassword.trim()) {
            setReturnError("Password is required to confirm the return.");
            return;
        }

        if (returnPassword !== returnConfirmPassword) {
            setReturnError("Passwords do not match.");
            return;
        }

        router.post(
            `/sales-records/${selectedReturnSale.record_id}/return`,
            {
                returned_quantity: returnForm.returned_quantity,
                returned_amount: returnForm.returned_amount,
                notes: returnForm.notes,
                password: returnPassword,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeReturnModal();
                    loadStockHistories();
                    router.reload();
                },
                onError: (errors) => {
                    setReturnError(
                        getValidationMessage(errors.password) ||
                            getValidationMessage(errors.returned_quantity) ||
                            getValidationMessage(errors.returned_amount) ||
                            getValidationMessage(errors.notes) ||
                            getValidationMessage(errors.error) ||
                            errors.message ||
                            "Unable to process return.",
                    );
                },
            },
        );
    };

    // Handler to add payment
    const handleAddPayment = () => {
        setPaymentError("");
        setConfirmPasswordError("");
        if (confirmPassword !== confirmConfirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError("Password is required.");
            return;
        }
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            setPaymentError("Valid payment amount is required.");
            return;
        }
        router.post(
            `/sales-records/${selectedSale.record_id}/payments`,
            { amount: paymentAmount, password: confirmPassword },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setShowConfirmPaid(false);
                    setConfirmPassword("");
                    setConfirmConfirmPassword("");
                    setConfirmPasswordError("");
                    setPaymentError("");
                    setSelectedSale(null);
                    setPaymentAmount("");
                    loadStockHistories();
                    router.reload();
                },
                onError: (errors) => {
                    setPaymentError(errors.amount?.[0] || "");
                    setConfirmPasswordError(
                        errors.password?.[0] ||
                            "Payment amount exceeds unpaid amount.",
                    );
                },
            },
        );
    };

    // Stock Histories State
    const [stockHistories, setStockHistories] = useState<any>({});
    const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
    const [loadingHistories, setLoadingHistories] = useState(false);
    const [expandedSaleHistoryIds, setExpandedSaleHistoryIds] = useState<
        number[]
    >([]);
    const [salePaymentsByHistoryId, setSalePaymentsByHistoryId] = useState<
        Record<number, any[]>
    >({});
    const [loadingSalePayments, setLoadingSalePayments] = useState<
        Record<number, boolean>
    >({});
    // Filters for Stock Histories (name, phone, fabric type)
    const [searchName, setSearchName] = useState<string>("");
    const [searchPhone, setSearchPhone] = useState<string>("");
    const [searchFabricType, setSearchFabricType] = useState<string>("");
    const [filterName, setFilterName] = useState<string>("");
    const [filterPhone, setFilterPhone] = useState<string>("");
    const [filterFabricType, setFilterFabricType] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[] | null>(null);

    const handleSearchHistory = () => {
        setFilterName(searchName);
        setFilterPhone(searchPhone);
        setFilterFabricType(searchFabricType);

        const criteriaName = searchName.trim().toLowerCase();
        const criteriaPhone = searchPhone.trim().toLowerCase();
        const criteriaFabricType = searchFabricType.trim();

        const results = Object.entries(stockHistories).flatMap(
            ([stockId, histories]: [string, any]) =>
                (histories || [])
                    .filter((h: any) => {
                        let ok = true;
                        if (criteriaName) {
                            ok =
                                ok &&
                                (h.customer_name || "")
                                    .toString()
                                    .toLowerCase()
                                    .includes(criteriaName);
                        }
                        if (criteriaPhone) {
                            ok =
                                ok &&
                                (h.customer_phone || "")
                                    .toString()
                                    .toLowerCase()
                                    .includes(criteriaPhone);
                        }
                        if (criteriaFabricType) {
                            ok =
                                ok &&
                                (h.fabric_type_snapshot || "").toString() ===
                                    criteriaFabricType;
                        }
                        return ok;
                    })
                    .map((h: any) => ({ ...h, stock_id: Number(stockId) })),
        );

        setSearchResults(results);
    };

    const handleClearHistoryFilters = () => {
        setSearchName("");
        setSearchPhone("");
        setSearchFabricType("");
        setFilterName("");
        setFilterPhone("");
        setFilterFabricType("");
        setSearchResults(null);
    };

    // Derived list of fabric types to populate the select
    const fabricTypes = useMemo(() => {
        if (selectedStockId && stockHistories[selectedStockId]) {
            return Array.from(
                new Set(
                    stockHistories[selectedStockId]
                        .map((h: any) => h.fabric_type_snapshot)
                        .filter(Boolean),
                ),
            );
        }
        return (
            fabricStocks?.data
                ?.map((s: any) => s.fabric_type)
                .filter(Boolean) || []
        );
    }, [selectedStockId, stockHistories, fabricStocks]);

    // Filter histories for the selected stock
    const filteredHistories = useMemo(() => {
        if (!selectedStockId || !stockHistories[selectedStockId]) return [];
        const list = stockHistories[selectedStockId] || [];
        return list.filter((h: any) => {
            let ok = true;
            if (filterName && filterName.trim() !== "") {
                ok =
                    ok &&
                    (h.customer_name || "")
                        .toString()
                        .toLowerCase()
                        .includes(filterName.toLowerCase());
            }
            if (filterPhone && filterPhone.trim() !== "") {
                ok =
                    ok &&
                    (h.customer_phone || "")
                        .toString()
                        .toLowerCase()
                        .includes(filterPhone.toLowerCase());
            }
            if (filterFabricType && filterFabricType.trim() !== "") {
                ok =
                    ok &&
                    (h.fabric_type_snapshot || "").toString() ===
                        filterFabricType;
            }
            return ok;
        });
    }, [
        selectedStockId,
        stockHistories,
        filterName,
        filterPhone,
        filterFabricType,
    ]);

    const hasSearchFilters =
        filterName.trim() !== "" ||
        filterPhone.trim() !== "" ||
        filterFabricType.trim() !== "";

    const currentHistories = useMemo(() => {
        if (selectedStockId && stockHistories[selectedStockId]) {
            return filteredHistories;
        }
        if (searchResults !== null) {
            return searchResults;
        }
        return [];
    }, [selectedStockId, stockHistories, filteredHistories, searchResults]);

    // Function to load stock histories
    const loadStockHistories = () => {
        setLoadingHistories(true);
        axios
            .get("/user-stock-histories")
            .then((res) => {
                setStockHistories(res.data);
            })
            .finally(() => setLoadingHistories(false));
    };

    // State for selected stock in chart
    const [selectedStockForChartId, setSelectedStockForChartId] = useState<
        number | null
    >(null);
    const selectedStockForChart = useMemo(() => {
        if (!selectedStockForChartId) {
            return null;
        }
        return (
            fabricStocks?.data?.find(
                (stock: any) => stock.stock_id === selectedStockForChartId,
            ) || null
        );
    }, [selectedStockForChartId, fabricStocks]);

    useEffect(() => {
        loadStockHistories();
    }, []);
    const toggleExpand = (stockId: number) => {
        setSelectedStockId(selectedStockId === stockId ? null : stockId);
    };

    const toggleSaleHistoryPayments = async (history: any) => {
        const saleId = Number(history.reference_id);
        if (!saleId) {
            return;
        }

        const isExpanded = expandedSaleHistoryIds.includes(saleId);
        if (isExpanded) {
            setExpandedSaleHistoryIds((prev) =>
                prev.filter((id) => id !== saleId),
            );
            return;
        }

        setExpandedSaleHistoryIds((prev) => [...prev, saleId]);

        if (!salePaymentsByHistoryId[saleId]) {
            setLoadingSalePayments((prev) => ({ ...prev, [saleId]: true }));
            try {
                const response = await axios.get(
                    `/sales-records/${saleId}/payments`,
                );
                setSalePaymentsByHistoryId((prev) => ({
                    ...prev,
                    [saleId]: response.data || [],
                }));
            } catch (error) {
                setSalePaymentsByHistoryId((prev) => ({
                    ...prev,
                    [saleId]: [],
                }));
            } finally {
                setLoadingSalePayments((prev) => ({
                    ...prev,
                    [saleId]: false,
                }));
            }
        }
    };

    const chartStocks =
        fabricStocks?.data?.filter(
            (stock: any) => parseFloat(stock.available_quantity) >= 0,
        ) || []; // include sold-out stocks so the pie chart still shows them in the stock selector and tracking

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
                (sale: any) => sale.stock_id == selectedStockForChart.stock_id,
            ) || [];
        const filteredPaid =
            paidSales?.filter(
                (sale: any) => sale.stock_id == selectedStockForChart.stock_id,
            ) || [];
        unpaidAmount = filteredUnpaid.reduce(
            (sum: number, sale: any) => sum + calculateToPay(sale),
            0,
        );
        const partialPaymentsFromUnpaid = filteredUnpaid.reduce(
            (sum: number, sale: any) => {
                const paidAmount =
                    sale.payments?.reduce(
                        (total: number, payment: any) =>
                            total + (parseFloat(payment.amount) || 0),
                        0,
                    ) || 0;
                return sum + paidAmount;
            },
            0,
        );
        paidAmount =
            filteredPaid.reduce(
                (sum: number, sale: any) =>
                    sum + (parseFloat(sale.total_amount) || 0),
                0,
            ) + partialPaymentsFromUnpaid;
    } else {
        // For all stocks
        instockValue =
            chartStocks.reduce(
                (sum: number, stock: any) =>
                    sum +
                    (stock.available_quantity || 0) *
                        (parseFloat(stock.price_per_unit) || 0),
                0,
            ) || 0;
        const chartStockIds = chartStocks.map((stock: any) => stock.stock_id);
        const filteredUnpaid =
            unpaidSales?.filter((sale: any) =>
                chartStockIds.includes(sale.stock_id),
            ) || [];
        const filteredPaid =
            paidSales?.filter((sale: any) =>
                chartStockIds.includes(sale.stock_id),
            ) || [];
        unpaidAmount = filteredUnpaid.reduce(
            (sum: number, sale: any) => sum + calculateToPay(sale),
            0,
        );
        const partialPaymentsFromUnpaid = filteredUnpaid.reduce(
            (sum: number, sale: any) => {
                const paidAmount =
                    sale.payments?.reduce(
                        (total: number, payment: any) =>
                            total + (parseFloat(payment.amount) || 0),
                        0,
                    ) || 0;
                return sum + paidAmount;
            },
            0,
        );
        paidAmount =
            filteredPaid.reduce(
                (sum: number, sale: any) =>
                    sum + (parseFloat(sale.total_amount) || 0),
                0,
            ) + partialPaymentsFromUnpaid;
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

    // AreaBumpChart data from real sales
    const stockMap = new Map();
    fabricStocks?.data?.forEach((stock: any) => {
        stockMap.set(stock.stock_id, stock.fabric_type);
    });

    const colorMap = new Map();
    fabricStocks?.data?.forEach((stock: any) => {
        colorMap.set(stock.stock_id, stock.color);
    });

    const salesData: { [key: string]: { [key: string]: number } } = {};
    const allSales = [...(paidSales || []), ...(unpaidSales || [])];
    allSales.forEach((sale: any) => {
        const fabric = stockMap.get(sale.stock_id);
        if (!fabric) return;
        const date = new Date(sale.sale_date);
        const month = date.toLocaleString("default", { month: "short" });
        if (!salesData[fabric]) salesData[fabric] = {};
        if (!salesData[fabric][month]) salesData[fabric][month] = 0;
        salesData[fabric][month] += parseFloat(sale.quantity_sold) || 0;
    });

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const areaBumpData = Object.keys(salesData).map((fabric) => ({
        id: fabric,
        data: months.map((month) => ({
            x: month,
            y: salesData[fabric][month] || 0,
        })),
    }));

    // Split data into first and second halves
    const firstHalfData = areaBumpData.map((series) => ({
        ...series,
        data: series.data.slice(0, 6), // Jan-Jun
    }));
    const secondHalfData = areaBumpData.map((series) => ({
        ...series,
        data: series.data.slice(6, 12), // Jul-Dec
    }));

    // Calculate quantities for the stock tracking summary
    let totalQty = 0;
    let availableQty = 0;
    let soldQty = 0;

    if (selectedStockForChart) {
        // For selected stock
        totalQty = parseFloat(selectedStockForChart.total_quantity) || 0;
        availableQty =
            parseFloat(selectedStockForChart.available_quantity) || 0;
        const selectedStockSales = allSales.filter(
            (sale: any) => sale.stock_id === selectedStockForChart.stock_id,
        );
        soldQty = selectedStockSales.reduce(
            (sum: number, sale: any) => sum + getNetQuantitySold(sale),
            0,
        );
    } else {
        // For all stocks
        totalQty =
            fabricStocks?.data?.reduce(
                (sum: number, stock: any) =>
                    sum + (parseFloat(stock.total_quantity) || 0),
                0,
            ) || 0;
        availableQty =
            fabricStocks?.data?.reduce(
                (sum: number, stock: any) =>
                    sum + (parseFloat(stock.available_quantity) || 0),
                0,
            ) || 0;
        const allStockSales = allSales.filter((sale: any) =>
            chartStocks.map((s: any) => s.stock_id).includes(sale.stock_id),
        );
        soldQty = allStockSales.reduce(
            (sum: number, sale: any) => sum + getNetQuantitySold(sale),
            0,
        );
    }

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
                            <div className="flex justify-center align-items-center mb-4">
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e]"
                                >
                                    {showForm ? "Cancel" : "Add New Stock"}
                                </button>
                            </div>

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
                                                        e.target.value,
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
                                                        e.target.value,
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
                                                        e.target.value,
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
                                                        e.target.value,
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
                                                        e.target.value,
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
                                                        e.target.value,
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
                                                        e.target.checked,
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

                    {fabricStocks?.data?.length > 0 && (
                        <>
                            {/* Choose Your Chart Button above Stock Tracking */}
                            <div className="flex justify-center mt-6 sm:mt-8 w-full">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e] font-semibold shadow text-center"
                                    onClick={() =>
                                        setShowPieChart((prev) => !prev)
                                    }
                                >
                                    Switch Your Chart
                                </button>
                            </div>
                            <div className="mt-4 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                                <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                                    Stocks Tracking
                                </h3>
                                <div className="flex mb-4">
                                    {showPieChart && (
                                        <select
                                            value={
                                                selectedStockForChartId ?? ""
                                            }
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                if (id === "") {
                                                    setSelectedStockForChartId(
                                                        null,
                                                    );
                                                } else {
                                                    setSelectedStockForChartId(
                                                        Number(id),
                                                    );
                                                }
                                            }}
                                            className="w-full sm:w-60 border rounded px-3 py-2 text-[#1D1B1B] bg-white dark:bg-[#232323] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold shadow text-center"
                                        >
                                            <option value="">All Stocks</option>
                                            {chartStocks.map((stock: any) => (
                                                <option
                                                    key={stock.stock_id}
                                                    value={stock.stock_id}
                                                >
                                                    Stock #{stock.stock_id} -{" "}
                                                    {stock.fabric_type}{" "}
                                                    {stock.color}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {!showPieChart && (
                                        <button
                                            type="button"
                                            className="w-full sm:w-60 border rounded px-3 py-2 text-[#1D1B1B] bg-white dark:bg-[#232323] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold shadow text-center"
                                            onClick={() =>
                                                setShowFirstHalf(
                                                    (prev) => !prev,
                                                )
                                            }
                                        >
                                            {showFirstHalf
                                                ? "Show Jul-Dec"
                                                : "Show Jan-Jun"}
                                        </button>
                                    )}
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
                                            <PieChart
                                                data={chartData}
                                                height={400}
                                            />
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
                                {/* Stock Quantities Summary */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-[#2596be]/10 to-[#2596be]/5 dark:from-[#2596be]/20 dark:to-[#2596be]/10 rounded-lg border border-[#2596be]/30 dark:border-[#2596be]/50">
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Total Qty */}
                                        <div className="text-center p-3 bg-white dark:bg-[#1D1B1B] rounded-lg shadow">
                                            <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                                Total Qty
                                            </div>
                                            <div className="text-lg sm:text-2xl font-bold text-orange-600">
                                                {Number(totalQty)
                                                    .toLocaleString("en-US")
                                                    .replace(/,/g, ".")}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                meters
                                            </div>
                                        </div>

                                        {/* Available Qty */}
                                        <div className="text-center p-3 bg-white dark:bg-[#1D1B1B] rounded-lg shadow">
                                            <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                                Available Qty
                                            </div>
                                            <div className="text-lg sm:text-2xl font-bold text-[#2596be]">
                                                {Number(availableQty)
                                                    .toLocaleString("en-US")
                                                    .replace(/,/g, ".")}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                meters
                                            </div>
                                        </div>

                                        {/* Sold Qty */}
                                        <div className="text-center p-3 bg-white dark:bg-[#1D1B1B] rounded-lg shadow">
                                            <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                                Sold Qty
                                            </div>
                                            <div className="text-lg sm:text-2xl font-bold text-green-600">
                                                {Number(soldQty)
                                                    .toLocaleString("en-US")
                                                    .replace(/,/g, ".")}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                meters
                                            </div>
                                        </div>
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
                                            fabricStocks.data.map(
                                                (stock: any) => (
                                                    <div
                                                        key={stock.stock_id}
                                                        className="bg-[#F5F5F5] dark:bg-[#1D1B1B] border border-[#2596be] rounded-lg p-4 shadow hover:shadow-lg transition-shadow flex flex-col"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold text-primary">
                                                                ID:{" "}
                                                                {stock.stock_id}
                                                            </span>
                                                            <span className="text-xs bg-[#2596be] text-white rounded px-2 py-0.5">
                                                                {
                                                                    stock.fabric_type
                                                                }
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
                                                                    stock.price_per_unit,
                                                                )
                                                                    .toLocaleString(
                                                                        "en-US",
                                                                    )
                                                                    .replace(
                                                                        /,/g,
                                                                        ".",
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
                                                                    stock.total_quantity,
                                                                )
                                                                    .toLocaleString(
                                                                        "en-US",
                                                                    )
                                                                    .replace(
                                                                        /,/g,
                                                                        ".",
                                                                    )}{" "}
                                                                /meter
                                                            </span>
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                                                                Available
                                                                Qty:{" "}
                                                            </span>
                                                            <span className="text-xs">
                                                                {Number(
                                                                    stock.available_quantity,
                                                                )
                                                                    .toLocaleString(
                                                                        "en-US",
                                                                    )
                                                                    .replace(
                                                                        /,/g,
                                                                        ".",
                                                                    )}{" "}
                                                                /meter
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col gap-2 mt-auto w-full">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedStockForSale(
                                                                        stock,
                                                                    );
                                                                    setShowAddSaleModal(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded hover:bg-green-600 transition-colors"
                                                            >
                                                                Add Sale
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (
                                                                        showSalesToReturn &&
                                                                        selectedStockForReturn?.stock_id ===
                                                                            stock.stock_id
                                                                    ) {
                                                                        setShowSalesToReturn(
                                                                            false,
                                                                        );
                                                                        setSelectedStockForReturn(
                                                                            null,
                                                                        );
                                                                    } else {
                                                                        setSelectedStockForReturn(
                                                                            stock,
                                                                        );
                                                                        setShowSalesToReturn(
                                                                            true,
                                                                        );
                                                                        setTimeout(
                                                                            () =>
                                                                                document
                                                                                    .getElementById(
                                                                                        "return-sale-section",
                                                                                    )
                                                                                    ?.scrollIntoView(
                                                                                        {
                                                                                            behavior:
                                                                                                "smooth",
                                                                                        },
                                                                                    ),
                                                                            100,
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded hover:bg-blue-600 transition-colors"
                                                            >
                                                                Return Sale
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleUpdateClick(
                                                                        stock,
                                                                    );
                                                                    setShowUpdateStockModal(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-yellow-400 text-black text-xs sm:text-sm rounded hover:bg-yellow-500 transition-colors"
                                                            >
                                                                Update Stock
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        stock.stock_id,
                                                                    )
                                                                }
                                                                className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600 transition-colors"
                                                            >
                                                                Delete Stock
                                                            </button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                    </div>
                                )}
                            </div>
                            {/* Add Sale Form Section (appears below Manage Your Stocks) - Now in modal */}
                            {/* Update Stock Form Section (appears below Manage Your Stocks) - Now in modal */}

                            {showSalesToReturn && selectedStockForReturn && (
                                <div
                                    id="return-sale-section"
                                    className="mt-6 sm:mt-8 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                                        Sales Records for Stock #
                                        {selectedStockForReturn.stock_id}
                                    </h3>
                                    {(() => {
                                        const stockSales = [
                                            ...(paidSales || []).filter(
                                                (sale: any) =>
                                                    sale.stock_id ===
                                                    selectedStockForReturn.stock_id,
                                            ),
                                            ...(unpaidSales || []).filter(
                                                (sale: any) =>
                                                    sale.stock_id ===
                                                    selectedStockForReturn.stock_id,
                                            ),
                                        ];
                                        return stockSales.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {stockSales.map((sale: any) => (
                                                    <div
                                                        key={sale.record_id}
                                                        className={`bg-white dark:bg-[#232323] text-black dark:text-white rounded-lg p-4 border-2 shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col ${
                                                            sale.is_payed
                                                                ? "border-green-400 hover:border-green-600"
                                                                : "border-red-400 hover:border-red-600"
                                                        }`}
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
                                                            {
                                                                sale.customer_phone
                                                            }
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="font-semibold">
                                                                Quantity Sold:
                                                            </span>{" "}
                                                            {Number(
                                                                getNetQuantitySold(
                                                                    sale,
                                                                ),
                                                            )
                                                                .toLocaleString(
                                                                    "en-US",
                                                                )
                                                                .replace(
                                                                    /,/g,
                                                                    ".",
                                                                )}{" "}
                                                            /meter
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="font-semibold">
                                                                Total Amount:
                                                            </span>{" "}
                                                            {Number(
                                                                sale.total_amount,
                                                            )
                                                                .toLocaleString(
                                                                    "en-US",
                                                                )
                                                                .replace(
                                                                    /,/g,
                                                                    ".",
                                                                )}{" "}
                                                            MAD
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="font-semibold">
                                                                Status:
                                                            </span>{" "}
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs ${
                                                                    sale.is_payed
                                                                        ? "bg-green-500 text-white"
                                                                        : "bg-red-500 text-white"
                                                                }`}
                                                            >
                                                                {sale.is_payed
                                                                    ? "Paid"
                                                                    : "Unpaid"}
                                                            </span>
                                                        </div>
                                                        <div className="mb-2">
                                                            <span className="font-semibold">
                                                                Sale Date:
                                                            </span>{" "}
                                                            {new Date(
                                                                sale.sale_date,
                                                            ).toLocaleDateString()}
                                                        </div>
                                                        {sale.notes && (
                                                            <div className="mb-2">
                                                                <span className="font-semibold">
                                                                    Notes:
                                                                </span>{" "}
                                                                {sale.notes}
                                                            </div>
                                                        )}
                                                        {sale.is_payed && (
                                                            <button
                                                                onClick={() =>
                                                                    openReturnModal(
                                                                        sale,
                                                                    )
                                                                }
                                                                className="mt-auto px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                                                            >
                                                                Return
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                                                No sales records found for this
                                                stock.
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Sales Records Section */}
                            {unpaidSales && unpaidSales.length > 0 && (
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
                                                        {Number(
                                                            getNetQuantitySold(
                                                                sale,
                                                            ),
                                                        )
                                                            .toLocaleString(
                                                                "en-US",
                                                            )
                                                            .replace(
                                                                /,/g,
                                                                ".",
                                                            )}{" "}
                                                        /meter
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="font-semibold">
                                                            Fabric Type:
                                                        </span>{" "}
                                                        {stockMap.get(
                                                            sale.stock_id,
                                                        )}
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="font-semibold">
                                                            Color:
                                                        </span>{" "}
                                                        {colorMap.get(
                                                            sale.stock_id,
                                                        )}
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="font-semibold">
                                                            To Pay:
                                                        </span>
                                                        <span
                                                            className="text-white px-2 py-1 rounded ml-2"
                                                            style={{
                                                                backgroundColor:
                                                                    getBackgroundColor(
                                                                        sale,
                                                                    ),
                                                            }}
                                                        >
                                                            {calculateToPay(
                                                                sale,
                                                            ).toLocaleString(
                                                                "de-DE",
                                                                {
                                                                    minimumFractionDigits: 0,
                                                                    maximumFractionDigits: 0,
                                                                },
                                                            )}{" "}
                                                            MAD
                                                        </span>
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="font-semibold">
                                                            Sale Date:
                                                        </span>{" "}
                                                        {sale.sale_date
                                                            ? sale.sale_date.split(
                                                                  "T",
                                                              )[0]
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
                                                            setSelectedSale(
                                                                sale,
                                                            );
                                                            setPaymentAmount(
                                                                (
                                                                    sale.unpaid_amount ||
                                                                    0
                                                                ).toString(),
                                                            );
                                                            setShowConfirmPaid(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        Pay
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
                            )}
                            {/* Stock Histories Section */}
                            {stockHistories &&
                                Object.keys(stockHistories).length > 0 && (
                                    <div className="mt-8 p-2 sm:p-6 bg-white dark:bg-[#232323] rounded-lg shadow">
                                        <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-4 text-center">
                                            Stock Histories
                                        </h3>
                                        <div className="mt-4 p-4 w-full md:w-full bg-gradient-to-r from-[#2596be]/10 to-[#2596be]/5 dark:from-[#2596be]/20 dark:to-[#2596be]/10 rounded-lg border border-[#2596be]/30 dark:border-[#2596be]/50 mb-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={searchName}
                                                        onChange={(e) =>
                                                            setSearchName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Customer name"
                                                        className="w-full border rounded px-3 py-2 text-[#1D1B1B] bg-white dark:bg-[#232323] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold shadow"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={searchPhone}
                                                        onChange={(e) =>
                                                            setSearchPhone(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Phone"
                                                        className="w-full border rounded px-3 py-2 text-[#1D1B1B] bg-white dark:bg-[#232323] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold shadow"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                        Fabric Type
                                                    </label>
                                                    <select
                                                        value={searchFabricType}
                                                        onChange={(e) =>
                                                            setSearchFabricType(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full border rounded px-3 py-2 text-[#1D1B1B] bg-white dark:bg-[#232323] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold shadow"
                                                    >
                                                        <option value="">
                                                            All Fabric Types
                                                        </option>
                                                        {fabricTypes.map(
                                                            (ft: any) => (
                                                                <option
                                                                    key={ft}
                                                                    value={ft}
                                                                >
                                                                    {ft}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleSearchHistory
                                                        }
                                                        className="w-full px-4 py-2 bg-[#2596be] text-white rounded hover:bg-[#1d7a9e] font-semibold shadow"
                                                    >
                                                        Search
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleClearHistoryFilters
                                                        }
                                                        className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold shadow"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {loadingHistories ? (
                                            <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                                                Loading stock histories...
                                            </div>
                                        ) : stockHistories &&
                                          Object.keys(stockHistories).length >
                                              0 ? (
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {Object.entries(
                                                    stockHistories,
                                                ).map(
                                                    ([stockId, histories]) => (
                                                        <div key={stockId}>
                                                            <button
                                                                className={`w-full text-left px-4 py-2 rounded font-semibold border border-primary bg-muted dark:bg-dark hover:bg-primary hover:text-white transition-colors ${
                                                                    selectedStockId ===
                                                                    Number(
                                                                        stockId,
                                                                    )
                                                                        ? "bg-primary text-white"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    toggleExpand(
                                                                        Number(
                                                                            stockId,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                Stock #{stockId}{" "}
                                                                (
                                                                {Array.isArray(
                                                                    histories,
                                                                )
                                                                    ? histories.length
                                                                    : 0}{" "}
                                                                history record
                                                                {Array.isArray(
                                                                    histories,
                                                                ) &&
                                                                histories.length >
                                                                    1
                                                                    ? "s"
                                                                    : ""}
                                                                )
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500 dark:text-gray-300 py-8 sm:py-12">
                                                No stock histories found.
                                            </div>
                                        )}

                                        <h4 className="text-base sm:text-lg font-bold text-primary mb-1 sm:mb-2 mt-2 sm:mt-4 text-center">
                                            History detailes
                                        </h4>
                                        {((selectedStockId &&
                                            stockHistories[selectedStockId]) ||
                                            searchResults !== null) && (
                                            <div className="mt-4">
                                                <h5 className="text-sm font-semibold mb-2">
                                                    {selectedStockId
                                                        ? `Details for Stock #${selectedStockId}`
                                                        : "Search Results"}
                                                </h5>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {currentHistories.length >
                                                    0 ? (
                                                        currentHistories.map(
                                                            (history: any) => {
                                                                const isSaleHistory =
                                                                    String(
                                                                        history.change_type,
                                                                    )
                                                                        .toUpperCase()
                                                                        .trim() ===
                                                                        "SALE" &&
                                                                    history.reference_id;
                                                                const saleId =
                                                                    Number(
                                                                        history.reference_id,
                                                                    );
                                                                const isExpanded =
                                                                    isSaleHistory &&
                                                                    expandedSaleHistoryIds.includes(
                                                                        saleId,
                                                                    );
                                                                const payments =
                                                                    salePaymentsByHistoryId[
                                                                        saleId
                                                                    ] || [];

                                                                return (
                                                                    <div
                                                                        key={
                                                                            history.history_id
                                                                        }
                                                                    >
                                                                        <div
                                                                            className={`p-4 rounded border ${
                                                                                isSaleHistory
                                                                                    ? "border-green-400 bg-green-50 hover:border-green-500 cursor-pointer"
                                                                                    : "border-gray-300 bg-gray-50 dark:bg-[#232323]"
                                                                            }`}
                                                                            onClick={() =>
                                                                                isSaleHistory &&
                                                                                toggleSaleHistoryPayments(
                                                                                    history,
                                                                                )
                                                                            }
                                                                        >
                                                                            {!selectedStockId &&
                                                                                history.stock_id && (
                                                                                    <div className="text-xs font-semibold text-[#2596be] mb-2">
                                                                                        Stock
                                                                                        #
                                                                                        {
                                                                                            history.stock_id
                                                                                        }
                                                                                    </div>
                                                                                )}
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
                                                                                    history.quantity,
                                                                                )
                                                                                    .toLocaleString(
                                                                                        "en-US",
                                                                                    )
                                                                                    .replace(
                                                                                        /,/g,
                                                                                        ".",
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
                                                                                <span className="font-semibold">
                                                                                    Is
                                                                                    Payed:
                                                                                </span>{" "}
                                                                                <span
                                                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                                                        history.is_payed
                                                                                            ? "bg-green-500 text-white"
                                                                                            : "bg-red-500 text-white"
                                                                                    }`}
                                                                                >
                                                                                    {history.is_payed
                                                                                        ? "Yes"
                                                                                        : "No"}
                                                                                </span>
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
                                                                                {history.price_per_unit_snapshot !=
                                                                                null
                                                                                    ? `${Number(history.price_per_unit_snapshot).toLocaleString("en-US").replace(/,/g, ".")} MAD`
                                                                                    : "-"}
                                                                            </div>
                                                                            <div>
                                                                                Total
                                                                                Amount:{" "}
                                                                                {history.total_amount_snapshot !=
                                                                                null
                                                                                    ? `${Number(history.total_amount_snapshot).toLocaleString("en-US").replace(/,/g, ".")} MAD`
                                                                                    : "-"}
                                                                            </div>
                                                                            <div>
                                                                                Date:{" "}
                                                                                {history.created_at
                                                                                    ? new Date(
                                                                                          history.created_at,
                                                                                      ).toLocaleString()
                                                                                    : "-"}
                                                                            </div>
                                                                        </div>
                                                                        {isSaleHistory &&
                                                                            isExpanded && (
                                                                                <div className="mt-3 rounded border border-green-500 bg-green-50 p-3">
                                                                                    <div className="mb-2 text-sm font-semibold text-green-800">
                                                                                        Partial
                                                                                        Payments
                                                                                    </div>
                                                                                    {loadingSalePayments[
                                                                                        saleId
                                                                                    ] ? (
                                                                                        <div className="text-sm text-gray-700">
                                                                                            Loading
                                                                                            payments...
                                                                                        </div>
                                                                                    ) : payments.length >
                                                                                      0 ? (
                                                                                        <div className="space-y-2">
                                                                                            {payments.map(
                                                                                                (
                                                                                                    payment: any,
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            payment.id ||
                                                                                                            payment.payment_id ||
                                                                                                            payment.created_at ||
                                                                                                            Math.random()
                                                                                                        }
                                                                                                        className="rounded border border-green-200 bg-white p-3 text-sm text-[#1D1B1B]"
                                                                                                    >
                                                                                                        <div className="font-semibold">
                                                                                                            Amount:{" "}
                                                                                                            {Number(
                                                                                                                payment.amount,
                                                                                                            )
                                                                                                                .toLocaleString(
                                                                                                                    "en-US",
                                                                                                                )
                                                                                                                .replace(
                                                                                                                    /,/g,
                                                                                                                    ".",
                                                                                                                )}{" "}
                                                                                                            MAD
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            Date:{" "}
                                                                                                            {payment.payment_date
                                                                                                                ? new Date(
                                                                                                                      payment.payment_date,
                                                                                                                  ).toLocaleDateString()
                                                                                                                : payment.created_at
                                                                                                                  ? new Date(
                                                                                                                        payment.created_at,
                                                                                                                    ).toLocaleDateString()
                                                                                                                  : "-"}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ),
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="text-sm text-green-900">
                                                                                            No
                                                                                            partial
                                                                                            payments
                                                                                            found
                                                                                            for
                                                                                            this
                                                                                            sale.
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                );
                                                            },
                                                        )
                                                    ) : (
                                                        <div className="col-span-1 md:col-span-2 text-center text-gray-500 dark:text-gray-400 py-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#171717]">
                                                            No stock history
                                                            records match your
                                                            search criteria.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                        </>
                    )}
                </div>

                {/* Return Sale Modal */}
                {showReturnModal && selectedReturnSale && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-bold mb-4 text-center">
                                Return Sale #{selectedReturnSale.record_id}
                            </h3>
                            <form
                                onSubmit={handleReturnSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Returned Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={returnForm.returned_quantity}
                                        onChange={(e) =>
                                            setReturnForm({
                                                ...returnForm,
                                                returned_quantity:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Returned Amount (MAD)
                                    </label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={returnForm.returned_amount}
                                        onChange={(e) =>
                                            setReturnForm({
                                                ...returnForm,
                                                returned_amount: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={returnForm.notes}
                                        onChange={(e) =>
                                            setReturnForm({
                                                ...returnForm,
                                                notes: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={returnPassword}
                                        onChange={(e) =>
                                            setReturnPassword(e.target.value)
                                        }
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={returnConfirmPassword}
                                        onChange={(e) =>
                                            setReturnConfirmPassword(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                {returnError && (
                                    <div className="text-red-500 text-sm">
                                        {returnError}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                    >
                                        Confirm Return
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                        onClick={closeReturnModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal for Marking as Paid */}
                {showConfirmPaid && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-bold mb-4 text-center">
                                Add Payment
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Payment Amount
                                </label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={paymentAmount}
                                    onChange={(e) =>
                                        setPaymentAmount(e.target.value)
                                    }
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                    required
                                />
                                {paymentError && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {paymentError}
                                    </div>
                                )}
                            </div>
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
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Confirm your password"
                                    className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                />
                                {confirmPasswordError && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {confirmPasswordError}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddPayment}
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
                                        setPaymentError("");
                                        setSelectedSale(null);
                                        setPaymentAmount("");
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
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-bold mb-4 text-center">
                                Delete the stock
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Current password
                                </label>
                                <input
                                    type="password"
                                    value={confirmDeletePassword}
                                    onChange={(e) =>
                                        setConfirmDeletePassword(e.target.value)
                                    }
                                    placeholder="Enter your current password"
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
                                        if (!confirmDeletePassword.trim()) {
                                            setConfirmDeleteError(
                                                "Password is required",
                                            );
                                            return;
                                        }
                                        setConfirmDeleteError("");
                                        if (selectedStockIdForDelete) {
                                            handleConfirmDelete(
                                                selectedStockIdForDelete,
                                                confirmDeletePassword,
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

                {/* Add Sale Modal */}
                {showAddSaleModal && selectedStockForSale && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-lg max-w-sm md:max-w-md lg:max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-bold mb-4 text-center">
                                Add Sale for Stock #
                                {selectedStockForSale.stock_id}
                            </h3>
                            <form
                                onSubmit={handleSaleSubmit}
                                className="space-y-4"
                            >
                                {/* customer_name */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                {/* customer_phone */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Customer Phone
                                    </label>
                                    <InputMask
                                        mask="+212 9 99 99 99 99"
                                        maskChar={null}
                                        id="customer_phone"
                                        name="customer_phone"
                                        type="tel"
                                        value={saleForm.customer_phone}
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        autoComplete="tel"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
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
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                {/* total_amount */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
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
                                    <label className="text-sm">Is Payed</label>
                                </div>
                                {/* notes */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        rows={3}
                                    ></textarea>
                                </div>
                                {/* sale_date */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                    />
                                </div>
                                {/* Display sale error message */}
                                {saleError && (
                                    <div className="text-red-500 text-sm">
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
                                        onClick={closeAddSaleModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Update Stock Modal */}
                {showUpdateStockModal && selectedStockForUpdate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-[#232323] p-6 rounded-lg shadow-lg max-w-sm md:max-w-md lg:max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-bold mb-4 text-center">
                                Update Stock #{selectedStockForUpdate.stock_id}
                            </h3>
                            <form
                                onSubmit={handleUpdateSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
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
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
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
                                        className="w-full border rounded px-2 py-2 text-[#1D1B1B]"
                                        rows={3}
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
                                    <label className="text-sm">
                                        Samples Availability
                                    </label>
                                </div>
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
                                        onClick={closeUpdateStockModal}
                                    >
                                        Cancel
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
