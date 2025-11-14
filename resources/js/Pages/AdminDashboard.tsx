import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function AdminDashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-[#2596be] leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 min-h-screen dark:bg-[#1D1B1B] bg-[#F5F5F5]">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg border border-[#2596be] dark:bg-[#1D1B1B] bg-[#D9D9D9]">
                        <div className="p-6 font-semibold dark:text-[#D9D9D9] text-[#1D1B1B]">
                            You're logged in!
                        </div>
                    </div>
                    {/* Manage Users Section */}
                    <div className="p-6 font-semibold text-[#1D1B1B]">
                        <h3 className="text-lg font-bold text-primary mb-4 text-center">
                            Manage Users
                        </h3>
                        <div className="text-center text-muted">
                            User management features go here.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
