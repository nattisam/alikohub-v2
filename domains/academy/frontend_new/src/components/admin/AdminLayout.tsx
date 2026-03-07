import React from "react";
import AdminNavbar from "@/components/AdminNavbar";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <main className="section-container py-8 md:py-12">
        <h1 className="text-xl md:text-2xl font-heading font-bold text-slate-900 mb-8">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
};
