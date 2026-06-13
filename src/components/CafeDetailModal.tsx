/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cafe, MenuItem, User as AppUser, Review } from '../types';
import { X, MapPin, Instagram, Coffee, BookOpen, Utensils, Sandwich, Check, Star } from 'lucide-react';

interface CafeDetailModalProps {
  isOpen: boolean;
  cafe: Cafe | null;
  currentUser: AppUser | null;
  onClose: () => void;
  onBookClick: (cafe: Cafe) => void;
  onUpdateCafe: (edited: Cafe) => void;
}

export default function CafeDetailModal({
  isOpen,
  cafe,
  currentUser,
  onClose,
  onBookClick,
  onUpdateCafe,
}: CafeDetailModalProps) {
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Kopi' | 'Non-Kopi' | 'Camilan' | 'Makanan Berat'>('Semua');
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!isOpen || !cafe) return null;

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const menuItems = cafe.menu || [];
  
  const filteredMenu = activeCategory === 'Semua' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Kopi': return <Coffee size={14} className="text-amber-500" />;
      case 'Non-Kopi': return <BookOpen size={14} className="text-emerald-500" />;
      case 'Camilan': return <Sandwich size={14} className="text-indigo-400" />;
      case 'Makanan Berat': return <Utensils size={14} className="text-pink-500" />;
      default: return null;
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating: userRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...(cafe.reviews || [])];
    
    // Recalculate average rating
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    const updatedCafe: Cafe = {
      ...cafe,
      rating: avgRating,
      reviews: updatedReviews,
    };

    onUpdateCafe(updatedCafe);
    setReviewComment('');
    setUserRating(5);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          id="cafe-detail-backdrop"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
          id="cafe-detail-modal"
        >
          {/* Header Image */}
          <div className="relative h-56 md:h-64 overflow-hidden bg-zinc-950 shrink-0">
            <img
              src={cafe.image}
              alt={cafe.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-black/80 transition-all border border-white/5"
              id="cafe-detail-close-btn"
            >
              <X size={18} />
            </button>

            {/* Pinned Cafe Title */}
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block text-[10px] tracking-widest uppercase font-bold text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full mb-2">
                Cabang Aktif
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {cafe.name}
              </h2>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
            {/* Detailed Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Description & Location */}
              <div className="md:col-span-2 space-y-3">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {cafe.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <MapPin size={13} className="text-amber-500/80" />
                  <span>{cafe.location}</span>
                </div>
              </div>

              {/* Socials & Actions Links */}
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between gap-3">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Tautan Informasi</span>
                
                <div className="space-y-1.5">
                  {cafe.gmapsUrl ? (
                    <a
                      href={cafe.gmapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-zinc-300 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 p-2 rounded-lg transition"
                    >
                      <MapPin size={14} className="text-amber-500" />
                      <span className="font-semibold truncate">Google Maps Peta</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-zinc-650 bg-zinc-900/50 p-2 rounded-lg border border-zinc-900">
                      <MapPin size={14} />
                      <span className="italic truncate">Peta tidak tersedia</span>
                    </div>
                  )}

                  {cafe.instagram ? (
                    <a
                      href={cafe.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-zinc-300 hover:text-pink-400 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 p-2 rounded-lg transition"
                    >
                      <Instagram size={14} className="text-pink-500" />
                      <span className="font-semibold truncate">Instagram Resmi</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-zinc-650 bg-zinc-900/50 p-2 rounded-lg border border-zinc-900">
                      <Instagram size={14} />
                      <span className="italic truncate">Instagram belum diset</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cafe Menu Section */}
            <div className="border-t border-zinc-850 pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Coffee size={16} className="text-amber-500" />
                  Katalog Menu Makanan & Minuman
                </h3>

                {/* Categories tab */}
                {menuItems.length > 0 && (
                  <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 border border-zinc-850 rounded-lg shrink-0">
                    {['Semua', 'Kopi', 'Non-Kopi', 'Camilan', 'Makanan Berat'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition ${
                          activeCategory === cat 
                            ? 'bg-amber-500 text-black shadow' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {menuItems.length === 0 ? (
                <div className="text-center py-8 bg-zinc-950/40 border border-dashed border-zinc-850 rounded-2xl text-zinc-500 text-xs">
                  <p>Kafe ini belum dikonfigurasi daftar menunya oleh Administrator.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredMenu.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-zinc-950/60 border border-zinc-850 p-3 rounded-xl hover:border-zinc-800 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded bg-zinc-900 flex items-center justify-center border border-zinc-800">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold block mt-0.5">{item.category}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-500">
                        {formattedPrice(item.price)}
                      </div>
                    </div>
                  ))}

                  {filteredMenu.length === 0 && (
                    <div className="col-span-full text-center py-6 text-xs text-zinc-550 italic">
                      Tidak ada menu di kategori "{activeCategory}".
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* List Facilities */}
            <div className="border-t border-zinc-850 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Fasilitas Unggulan</h3>
              <div className="flex flex-wrap gap-2">
                {cafe.facilities.map((fac) => (
                   <span
                     key={fac}
                     className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-850/80 text-zinc-300 text-xs px-3.5 py-1.5 rounded-xl font-medium"
                   >
                     <Check size={12} className="text-emerald-500" strokeWidth={3} />
                     {fac}
                   </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-zinc-850 pt-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Star size={15} className="text-amber-500 fill-amber-500" />
                  Ulasan & Review Pelanggan ({cafe.reviews?.length || 0})
                </h3>
                {cafe.reviews && cafe.reviews.length > 0 && (
                  <span className="text-xs text-amber-500 font-mono font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    ★ {(cafe.reviews.reduce((acc, r) => acc + r.rating, 0) / cafe.reviews.length).toFixed(1)} / 5.0
                  </span>
                )}
              </div>

              {/* Submit Review Card */}
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Tulis Ulasan Anda</h4>
                {currentUser ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 font-medium">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="p-0.5 hover:scale-110 transition cursor-pointer text-amber-500"
                          >
                            <Star
                              size={18}
                              className={star <= userRating ? 'fill-amber-500' : 'text-zinc-700'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tulis pendapat atau pengalaman belajar Anda di sini..."
                        required
                        rows={2}
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-zinc-500">
                        Masuk sebagai <strong className="text-zinc-400">{currentUser.name}</strong>
                      </span>
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer"
                      >
                        Kirim Ulasan
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="py-2 text-center">
                    <p className="text-xs text-zinc-500">
                      Silakan login terlebih dahulu untuk menulis ulasan cabang cafe ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {!cafe.reviews || cafe.reviews.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-550 italic bg-zinc-950/20 border border-dashed border-zinc-850 rounded-xl">
                    Belum ada ulasan untuk cafe ini. Jadilah yang pertama memberikan ulasan!
                  </div>
                ) : (
                  cafe.reviews.map((r) => (
                    <div key={r.id} className="bg-zinc-950/40 border border-zinc-850 p-3.5 rounded-xl space-y-1.5 text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-white">{r.userName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={11}
                              className={idx < r.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-800'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Direct Booking action */}
          <div className="bg-zinc-950/80 border-t border-zinc-850 p-5 shrink-0 flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-zinc-500 font-mono">Tarif Pemesanan</span>
              <span className="text-lg font-bold text-amber-500 font-mono">{formattedPrice(cafe.pricePerHour)}<span className="text-xs text-zinc-400 font-normal"> / jam</span></span>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookClick(cafe);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider transition active:scale-95 shadow cursor-pointer"
              id="cafe-detail-book-btn"
            >
              Pesan Meja Sekarang
            </button>
          </div>
         </motion.div>
      </div>
    </AnimatePresence>
  );
}
