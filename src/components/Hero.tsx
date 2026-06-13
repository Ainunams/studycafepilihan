/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, X } from 'lucide-react';
import { Cafe } from '../types';

interface HeroProps {
  cafes: Cafe[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFacilities: string[];
  toggleFacility: (facility: string) => void;
  onSearchSubmit: () => void;
  onSelectCafe: (cafe: Cafe) => void;
}

export default function Hero({
  cafes,
  searchQuery,
  setSearchQuery,
  selectedFacilities,
  toggleFacility,
  onSearchSubmit,
  onSelectCafe,
}: HeroProps) {
  const facilityPills = ['WiFi Kencang', 'Tenang', 'Banyak Colokan', 'Aesthetic'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter matched cafes for live autocomplete suggestions
  const matchedSuggestions = searchQuery.trim() !== ''
    ? cafes.filter((c) => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center min-h-[85vh] py-20 px-4 z-10">
      {/* Background image & gradient overlays */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600')`,
        }}
      />
      {/* Dark overlay mirroring the screenshot */}
      <div className="absolute inset-0 bg-black/75 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30 z-0 pointer-events-none" />

      {/* Hero Body Content */}
      <div className="relative z-10 max-w-4xl w-full text-center mx-auto flex flex-col items-center">
        {/* Upper pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8 backdrop-blur-inner"
        >
          <span className="text-amber-500 text-xs font-bold font-sans tracking-wide uppercase">
            PLATFORM PENCARIAN TEMPAT BELAJAR
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-sans text-white tracking-tight leading-tight max-w-3xl"
        >
          Temukan <span className="text-amber-500">Tempat Belajar</span> Idealmu
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-sans leading-relaxed text-center"
        >
          Cari kafe & coworking space terbaik untuk belajar berdasarkan WiFi, colokan, tingkat kebisingan, dan vibe aesthetic.
        </motion.p>

        {/* Search Form with Suggestions Dropdown */}
        <div className="relative w-full max-w-2xl z-30">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 w-full bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800/85 backdrop-blur-md flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-grow flex items-center pl-3">
              <span className="text-zinc-500 absolute left-4">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Cari nama kafe atau lokasi..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 250)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                className="w-full bg-transparent pl-10 pr-10 py-3 text-sm text-white focus:outline-none placeholder-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={onSearchSubmit}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-8 py-3 rounded-lg text-sm tracking-wide transition duration-150 active:scale-95 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              Cari
            </button>
          </motion.div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && matchedSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col divide-y divide-zinc-800/60 backdrop-blur-md text-left">
              <div className="px-4 py-2 bg-zinc-950/40 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                Rekomendasi Cafe Belajar ({matchedSuggestions.length})
              </div>
              {matchedSuggestions.map((cafe) => (
                <div
                  key={cafe.id}
                  onClick={() => {
                    onSelectCafe(cafe);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-zinc-800/85 transition cursor-pointer"
                >
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-10 h-10 rounded-lg object-cover bg-zinc-950 shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{cafe.name}</h4>
                    <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                      <MapPin size={11} className="text-amber-500" />
                      <span>{cafe.location}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-mono font-bold text-amber-500 block">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(cafe.pricePerHour)}/jam
                    </span>
                    <span className="text-[10px] text-amber-400">★ {cafe.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Facility Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3 z-20"
        >
          {facilityPills.map((facility) => {
            const isActive = selectedFacilities.includes(facility);
            return (
              <button
                key={facility}
                onClick={() => toggleFacility(facility)}
                className={`px-5 py-2 text-xs sm:text-sm rounded-full border transition-all duration-300 font-medium cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10 scale-105'
                    : 'bg-zinc-900/40 border-zinc-700/50 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-900/80'
                }`}
              >
                {facility}
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
