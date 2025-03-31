import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-row gap-5 min-h-screen overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-grow p-5">{children}</main>
      {/** <AdminFooter /> */}
    </div>
  );
}
