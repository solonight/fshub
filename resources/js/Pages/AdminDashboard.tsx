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
                        <div className="text-center text-[#1D1B1B] dark:text-[#D9D9D9]">
                            User management features go here.
                        </div>
                        {/* Users Data Board */}
                        <div className="mb-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[#2596be] bg-white dark:bg-[#1D1B1B] border border-[#2596be] rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                                ID
                                            </th>
                                            <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                                Name
                                            </th>
                                            <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                                Email
                                            </th>
                                            <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                                Phone
                                            </th>
                                            <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                                Role
                                            </th>
                                            <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                                Created At
                                            </th>
                                            <th className="px-4 py-2 font-semibold bg-[#2596be] text-white dark:bg-[#232323] dark:text-[#2596be]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2596be]">
                                        {/* User rows will be rendered here dynamically */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
