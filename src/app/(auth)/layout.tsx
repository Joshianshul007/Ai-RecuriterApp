import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0d0d0d]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
          style={{ filter: "blur(1px)" }}
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pt-16 pb-6">
        {children}
      </main>
    </div>
  );
}
