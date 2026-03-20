import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

const stats = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    value: "25,850",
    label: "Jobs",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 8a3 3 0 11-6 0 3 3 0 016 0zM4 8a3 3 0 116 0A3 3 0 014 8z" />
      </svg>
    ),
    value: "10,250",
    label: "Candidates",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
    value: "18,400",
    label: "Companies",
  },
];

const brands = [
  {
    name: "Spotify",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: "Slack",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    ),
  },
  {
    name: "Adobe",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm13.748 0H14.25l8.382 21.248z"/>
      </svg>
    ),
  },
  {
    name: "asana",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.141 12.336a4.856 4.856 0 1 1-9.712 0 4.856 4.856 0 0 1 9.712 0zM4.856 7.484a4.856 4.856 0 1 0 0 9.712 4.856 4.856 0 0 0 0-9.712zm14.288 0a4.856 4.856 0 1 0 0 9.712 4.856 4.856 0 0 0 0-9.712z"/>
      </svg>
    ),
  },
  {
    name: "Linear",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 14.109l9.891 9.893a12.038 12.038 0 0 1-9.89-9.893zM0 9.293L14.707 24a12.04 12.04 0 0 1-2.402.248A12.072 12.072 0 0 1 0 12.26v-2.967zm11.795-9.17l12.108 12.104a12.04 12.04 0 0 1-1.793 4.098L7.703.677a12.034 12.034 0 0 1 4.092-1.554zM5.354.006L23.994 18.64A12.062 12.062 0 0 1 5.354.006z"/>
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex flex-col">
        {/* Background Image + Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.png"
            alt="Hero background"
            fill
            priority
            className="object-cover object-center"
            style={{ filter: "blur(1px)" }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center pt-28 pb-14">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            Find Your Dream Job Today!
          </h1>
          <p className="text-white/75 text-base md:text-lg mb-10 max-w-lg">
            Connecting Talent with Opportunity: Your Gateway to Career Success
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl flex flex-col sm:flex-row items-stretch overflow-hidden">
            {/* Job Title */}
            <div className="flex flex-1 items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Job Title or Company"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>

            {/* Location */}
            <div className="flex flex-1 items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200 cursor-pointer">
              <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0L6.343 16.657a8 8 0 1 1 11.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
              <span className="flex-1 text-sm text-gray-400 text-left">Select Location</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Category */}
            <div className="flex flex-1 items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200 cursor-pointer">
              <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
              </svg>
              <span className="flex-1 text-sm text-gray-400 text-left">Select Category</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Search Button */}
            <button className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-6 py-3 transition-colors duration-200 cursor-pointer whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              Search Job
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/80 backdrop-blur-sm shadow-lg">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-xl leading-none">{stat.value}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* ── Brand Logos Strip ── */}
      <section className="bg-[#111111] py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2 text-white font-semibold text-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              {brand.icon}
              <span className="tracking-tight">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
