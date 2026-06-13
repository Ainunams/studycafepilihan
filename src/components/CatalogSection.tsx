/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Cafe, User as AppUser } from '../types';
import { Star, MapPin, Wifi, ShieldAlert, BadgeCheck, CheckCircle } from 'lucide-react';

interface CatalogSectionProps {
  cafes: Cafe[];
  currentUser: AppUser | null;
  selectedFacilities: string[];
  searchQuery: string;
  onBookClick: (cafe: Cafe) => void;
  onDetailClick: (cafe: Cafe) => void;
  toggleFacility: (facility: string) => void;
  setSearchQuery: (query: string) => void;
}

export default function CatalogSection({
  cafes,
  currentUser,
  selectedFacilities,
  searchQuery,
  onBookClick,
  onDetailClick,
  toggleFacility,
  setSearchQuery,
}: CatalogSectionProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Filter cafes
  const filteredCafes = cafes.filter((cafe) => {
    const matchesSearch =
      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFacilities =
      selectedFacilities.length === 0 ||
      selectedFacilities.every((facility) => cafe.facilities.includes(facility));

    return matchesSearch && matchesFacilities;
  });

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFacilityIcon = (facility: string) => {
    // Return standard aesthetic representations
    switch (facility) {
      case 'WiFi Kencang':
        return <Wifi size={14} className="text-emerald-500" />;
      default:
        return <CheckCircle size={14} className="text-amber-500" />;
    }
  };

  return (
    <section className="py-16 bg-zinc-950 text-white min-h-[70vh]" id="katalog-langsung">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-zinc-900 pb-6 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-sans">
              Katalog <span className="text-amber-500">Study Cafe</span> Terbaik
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Pilih lokasi terdekat dengan fasilitas terbaik sesuai kebutuhan belajarmu.
            </p>
          </div>

          {/* Quick search input in Catalog section */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari kafe di katalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-sm rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Results Info & Active Filters */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div className="text-zinc-400 text-sm">
            Menampilkan <span className="text-amber-500 font-bold">{filteredCafes.length}</span> kafe yang cocok
          </div>

          {selectedFacilities.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Filter Aktif:</span>
              <div className="flex gap-1.5 flex-wrap">
                {selectedFacilities.map((f) => (
                  <span
                    key={f}
                    onClick={() => toggleFacility(f)}
                    className="cursor-pointer bg-zinc-900 border border-zinc-800 text-[11px] text-amber-500 rounded-full px-2.5 py-0.5 hover:bg-zinc-850 hover:border-red-500/20 hover:text-red-400 transition"
                  >
                    {f} &times;
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grid Lists of Cafes */}
        {filteredCafes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40"
          >
            <ShieldAlert size={48} className="text-zinc-600 mb-4" />
            <span className="text-zinc-400 font-medium text-lg">Tidak ada cafe yang sesuai filter</span>
            <p className="text-zinc-500 text-sm mt-1 max-w-sm text-center">
              Eksperimen dengan menghapus beberapa tag atau ubah kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                // Clear facilities
                selectedFacilities.forEach(f => toggleFacility(f));
              }}
              className="mt-5 text-xs text-black bg-amber-500 hover:bg-amber-400 font-semibold px-4 py-2.5 rounded-lg transition"
            >
              Reset Semua Filter
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCafes.map((cafe, kIdx) => (
              <motion.div
                key={cafe.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: kIdx * 0.05 }}
                onMouseEnter={() => setHoveredCardId(cafe.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group relative flex flex-col bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700/80 hover:bg-zinc-900/80 transition-all duration-300 shadow-xl"
              >
                {/* Cafe image */}
                <div 
                  onClick={() => onDetailClick(cafe)}
                  className="relative aspect-video w-full overflow-hidden bg-zinc-950 cursor-pointer"
                >
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Rating Tag */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-400 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-white/10 shadow-lg">
                    <Star size={13} fill="currentColor" />
                    {cafe.rating.toFixed(1)}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 bg-zinc-950/90 text-xs text-zinc-300 font-mono px-3 py-1 rounded-md border border-zinc-800 shadow">
                    Tarif: <span className="text-amber-500 font-semibold">{formattedPrice(cafe.pricePerHour)}/jam</span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onDetailClick(cafe)}
                      className="text-xl font-bold text-white group-hover:text-amber-500 transition duration-150 cursor-pointer"
                    >
                      {cafe.name}
                    </h3>
                    
                    {/* Location pinned */}
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono mt-1.5">
                      <MapPin size={13} className="text-zinc-650" />
                      {cafe.location}
                    </div>

                    {/* Desc */}
                    <p className="mt-4 text-zinc-400 text-sm leading-relaxed line-clamp-2">
                      {cafe.description}
                    </p>

                    {/* Facility pills */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {cafe.facilities.map((fac) => (
                        <div
                          key={fac}
                          className="flex items-center gap-1 bg-zinc-950 text-zinc-400 text-xs px-2.5 py-1 rounded-md border border-zinc-850"
                        >
                          {getFacilityIcon(fac)}
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions CTA Trigger */}
                  <div className="mt-6 pt-4 border-t border-zinc-900/80 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-zinc-500 font-mono">
                        Tersedia: <span className="text-emerald-500 font-semibold">{cafe.availableDesks} meja</span>
                      </div>

                      {/* Instagram & GMaps Quick Icons */}
                      <div className="flex gap-1.5">
                        {cafe.gmapsUrl && (
                          <a 
                            href={cafe.gmapsUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-amber-500 text-zinc-500 hover:text-amber-500 rounded-lg transition" 
                            title="Buka Google Maps"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MapPin size={12} />
                          </a>
                        )}
                        {cafe.instagram && (
                          <a 
                            href={cafe.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-pink-500 text-zinc-500 hover:text-pink-400 rounded-lg transition text-[9px] font-bold font-mono px-2" 
                            title="Instagram Resmi"
                            onClick={(e) => e.stopPropagation()}
                          >
                            IG
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onDetailClick(cafe)}
                        className="flex-1 py-2 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-300 font-semibold text-xs hover:bg-zinc-850 active:scale-95 transition"
                      >
                        Detail & Menu
                      </button>

                      <button
                        onClick={() => onBookClick(cafe)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition duration-150 active:scale-95 shadow cursor-pointer shadow-amber-500/10"
                      >
                        Pesan Meja
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
