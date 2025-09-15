"use client";

import { usePathname } from "next/navigation";
import { Footer, Navbar, MaintenancePage } from "@/components";
import Header from "@/components/student/Header";
import { useAuth } from "@/context/AuthContext";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLearningPage = pathname?.startsWith("/student/learning");
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {!isLearningPage && (user ? <Header /> : <Navbar />)}
      <main className="flex-grow">{children}</main>
      {!isLearningPage && <Footer />}
      {/* <MaintenancePage /> */}
    </div>
  );
}