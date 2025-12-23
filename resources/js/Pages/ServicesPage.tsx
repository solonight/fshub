import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function ServicesPage({ auth, services }: any) {
    // Example: services could be an array of service objects
    // You should fetch and pass real data from the backend
    const serviceList = services || [];
    const warehouseServices = serviceList.filter(
        (service: any) => service.type === "warehouse"
    );
    const transporterServices = serviceList.filter(
        (service: any) => service.type === "transporter"
    );
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Services" />
            <div className="flex flex-col items-center min-h-[60vh] w-full px-2 md:px-8">
                <div className="flex flex-col items-center mt-8">
                    <h1 className="text-3xl font-bold text-primary mb-6 text-center">
                        Services
                    </h1>
                    <p className="text-lg text-center text-[#1D1B1B] dark:text-[#D9D9D9] max-w-2xl mb-8">
                        Discover warehousing, transportation, and other services
                        available on FSHub.
                    </p>
                </div>
                <div className="w-full">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
                            Warehouses
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {warehouseServices.length === 0 ? (
                                <div className="col-span-3 text-center text-gray-500 dark:text-gray-300 py-12">
                                    No warehouses available.
                                </div>
                            ) : (
                                warehouseServices.map((service: any) => (
                                    <div
                                        key={service.id}
                                        className="bg-white dark:bg-[#232323] rounded-xl shadow-lg p-6 flex flex-col gap-2 transition-transform hover:scale-[1.03]"
                                    >
                                        <div className="font-bold text-lg text-primary mb-2">
                                            {service.name}
                                        </div>
                                        <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                            <span className="font-semibold">
                                                Type:
                                            </span>{" "}
                                            {service.type}
                                        </div>
                                        <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                            <span className="font-semibold">
                                                Location:
                                            </span>{" "}
                                            {service.location || "N/A"}
                                        </div>
                                        {service.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {service.description}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
                            Transporters
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {transporterServices.length === 0 ? (
                                <div className="col-span-3 text-center text-gray-500 dark:text-gray-300 py-12">
                                    No transporters available.
                                </div>
                            ) : (
                                transporterServices.map((service: any) => (
                                    <div
                                        key={service.id}
                                        className="bg-white dark:bg-[#232323] rounded-xl shadow-lg p-6 flex flex-col gap-2 transition-transform hover:scale-[1.03]"
                                    >
                                        <div className="font-bold text-lg text-primary mb-2">
                                            {service.name}
                                        </div>
                                        <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                            <span className="font-semibold">
                                                Type:
                                            </span>{" "}
                                            {service.type}
                                        </div>
                                        <div className="text-sm text-[#1D1B1B] dark:text-[#D9D9D9]">
                                            <span className="font-semibold">
                                                Location:
                                            </span>{" "}
                                            {service.location || "N/A"}
                                        </div>
                                        {service.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {service.description}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
