import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Marketplace({ auth }: any) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Marketplace" />
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
                <h1 className="text-3xl font-bold text-primary mb-6">
                    Marketplace
                </h1>
                <p className="text-lg text-center text-[#1D1B1B] dark:text-[#D9D9D9] max-w-2xl">
                    Welcome to the FSHub Marketplace! Here you can browse, buy,
                    and sell fabric stock, manage logistics, and connect with
                    providers. (Add your marketplace features here.)
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
