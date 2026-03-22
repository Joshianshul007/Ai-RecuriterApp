import { ReactNode } from "react";
import HRSidebar from "@/components/hr/Sidebar";
import HRTopbar from "@/components/hr/Topbar";

export default function HRLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#060c14] overflow-hidden">
      {/* Sidebar */}
      <HRSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <HRTopbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
