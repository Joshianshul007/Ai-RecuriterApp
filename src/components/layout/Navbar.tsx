"use client";

import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-10 py-4 absolute top-0 left-0 z-20">
      {/* Logo */}
      <Link href="/" className="flex items-center select-none">
        <span className="text-teal-400 font-black text-2xl tracking-tight">AA</span>
        <span className="text-white font-black text-2xl tracking-tight">I</span>
        <span className="text-white/90 font-semibold text-xl tracking-wide">Recruiter</span>
      </Link>

      {/* Nav Links */}
      <ul className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:text-white transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-white text-sm font-medium hover:text-white/80 transition-colors px-3 py-1"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-white px-5 py-2 rounded-md transition-colors duration-200"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
