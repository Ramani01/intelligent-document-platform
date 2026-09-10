import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Modules', hasDropdown: false },
    { name: 'Clientele', hasDropdown: false },
    { name: 'Solutions', hasDropdown: true },
    { name: 'Billing', hasDropdown: false },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white font-sans">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
      />

      {/* Main Relative Container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-2 z-50">
            <svg
              className="h-6 w-6 text-[#010101] fill-[#010101] lg:text-white lg:fill-white transition-colors duration-300"
              viewBox="0 0 256 256"
            >
              <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
            </svg>
            <span className="text-lg font-semibold text-[#010101] lg:text-white transition-colors duration-300">
              nexum
            </span>
          </div>

          {/* Desktop Navigation Cluster */}
          <div className="hidden md:flex items-center gap-3">
            {/* Glass Pill Cluster */}
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.name.toLowerCase()}`}
                  className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </a>
              ))}
            </div>

            {/* Separate CTA Pill */}
            <button className="flex items-center justify-center rounded-full px-5 text-sm font-medium text-white self-stretch cta-gradient transition-opacity duration-200">
              Get started
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden relative z-50 h-10 w-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center"
          >
            <Menu
              className={`absolute h-5 w-5 text-[#010101] lg:text-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute h-5 w-5 text-[#010101] lg:text-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </button>
        </nav>

        {/* Mobile Menu Glass Overlay + Drawer */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        <div
          className={`fixed right-0 top-0 z-40 h-full w-72 bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Nav Links */}
          <div className="px-6 pt-24 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                style={{
                  transitionDelay: `${(index + 1) * 60}ms`,
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(24px)',
                }}
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </a>
            ))}
          </div>

          {/* Mobile Drawer Bottom CTA */}
          <div
            className="mt-auto px-6 pb-10 transition-all duration-400"
            style={{
              transitionDelay: '300ms',
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(16px)',
            }}
          >
            <button className="w-full rounded-full py-3.5 text-center text-sm font-medium text-white cta-gradient transition-opacity duration-200">
              Get started
            </button>
          </div>
        </div>

        {/* Bottom-Anchored Main Hero Content */}
        <main className="mt-auto px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Left Column: Headline + Email CTA */}
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight text-[#010101] lg:text-white transition-colors duration-300">
                Ship AI workers that grind while you rest
              </h1>

              {/* Email Input CTA */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:inline-flex sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5">
                <input
                  type="email"
                  placeholder="Type your email"
                  className="rounded-full bg-white px-5 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none sm:w-64 sm:rounded-none sm:bg-transparent sm:px-4 sm:py-2"
                />
                <button className="rounded-full px-6 py-3 sm:py-2.5 text-sm font-medium text-white cta-gradient transition-opacity duration-200 text-center">
                  Get started
                </button>
              </div>
            </div>

            {/* Right Column: Two Glass Cards */}
            <div className="flex flex-col gap-4 sm:flex-row lg:w-auto lg:gap-5">
              {/* Stats Card */}
              <div className="sm:w-64 flex flex-col justify-between rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:p-6">
                <div>
                  <div className="font-silkscreen text-3xl sm:text-4xl font-normal tracking-tight text-[#010101] lg:text-white transition-colors duration-300">
                    42,500+
                  </div>
                  <p className="text-sm leading-relaxed mt-3 sm:mt-4 text-[#010101]/70 lg:text-white/70 transition-colors duration-300">
                    Teams run Nexum to handle recurring ops daily.
                  </p>
                </div>
              </div>

              {/* Testimonial Card */}
              <div className="sm:w-64 rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:p-6">
                {/* Stratify Header Row */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-6 w-6 rounded-md bg-black flex items-center justify-center text-xs font-bold text-white">
                    S
                  </div>
                  <span className="text-sm font-semibold text-[#010101] lg:text-white transition-colors duration-300">
                    Stratify
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed text-[#010101]/80 lg:text-white/80 transition-colors duration-300">
                  "With Nexum we went from managing tedious operational work to having AI agents that handle everything."
                </p>

                {/* Footer User Profile */}
                <div className="flex items-center gap-3 mt-4 sm:mt-5">
                  <img
                    src="https://i.pravatar.cc/72?img=12"
                    alt="Sara Klein"
                    className="h-9 w-9 rounded-full object-cover bg-white/20"
                  />
                  <div>
                    <div className="text-sm font-semibold text-[#010101] lg:text-white transition-colors duration-300">
                      Sara Klein
                    </div>
                    <div className="text-xs text-[#010101]/60 lg:text-white/60 transition-colors duration-300">
                      Dir of Operations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
