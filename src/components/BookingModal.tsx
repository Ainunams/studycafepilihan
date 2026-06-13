/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalIcon, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Cafe, Booking, User as AppUser } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafe: Cafe;
  currentUser: AppUser | null;
  onSubmitBooking: (booking: Booking) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  cafe,
  currentUser,
  onSubmitBooking,
}: BookingModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(2);
  const [deskNumber, setDeskNumber] = useState('Meja A1 (Single)');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const DESK_OPTIONS = [
    'Meja A1 (Pro Single, Terdiam)',
    'Meja A2 (Pro Single, Terdiam)',
    'Meja B1 (Dual Monitor, WiFi Booster)',
    'Meja B2 (Dual Monitor, WiFi Booster)',
    'Meja Kolaborasi C1 (Grup, Maks 4 Orang)',
    'Sofa Pojok S1 (Aesthetic & Santai)',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date || !time) {
      setError('Harap lengkapi tanggal dan jam reservasi!');
      return;
    }

    if (!currentUser) {
      setError('Silakan login terlebih dahulu untuk melakukan booking.');
      return;
    }

    const calculatedTotalPrice = cafe.pricePerHour * duration;

    const newBooking: Booking = {
      id: 'book-' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      cafeId: cafe.id,
      cafeName: cafe.name,
      date,
      time,
      duration,
      deskNumber,
      totalPrice: calculatedTotalPrice,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSubmitBooking(newBooking);
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 text-white p-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">{cafe.name}</h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">{cafe.location}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-950/40 border border-red-500/50 text-red-200 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleConfirm} className="space-y-4">
              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Tanggal Belajar
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Jam Mulai
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Desk & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Pilihan Meja / Kursi
                  </label>
                  <select
                    value={deskNumber}
                    onChange={(e) => setDeskNumber(e.target.value)}
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    {DESK_OPTIONS.map((desk) => (
                      <option key={desk} value={desk} className="bg-zinc-950">
                        {desk}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Durasi Sewa
                  </label>
                  <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setDuration(Math.max(1, duration - 1))}
                      className="px-3.5 py-2.5 text-zinc-400 hover:text-white transition-all cursor-pointer font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="flex-grow text-center text-sm font-semibold">{duration} Jam</span>
                    <button
                      type="button"
                      onClick={() => setDuration(Math.min(12, duration + 1))}
                      className="px-3.5 py-2.5 text-zinc-400 hover:text-white transition-all cursor-pointer font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation Info Card */}
              <div className="bg-zinc-950/70 rounded-xl border border-zinc-800/80 p-4 space-y-2 mt-4">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Unit Tarif</span>
                  <span>{formattedPrice(cafe.pricePerHour)} / jam</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Durasi Sewa</span>
                  <span>{duration} Jam</span>
                </div>
                <div className="border-t border-zinc-800/60 my-2 pt-2 flex justify-between items-center text-white">
                  <span className="text-sm font-semibold">Total Biaya</span>
                  <span className="text-base font-extrabold text-amber-500">
                    {formattedPrice(cafe.pricePerHour * duration)}
                  </span>
                </div>
              </div>

              {/* Bottom CTAs */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition active:scale-95 shadow-lg shadow-amber-500/10 cursor-pointer mt-4"
              >
                Konfirmasi Reservasi & Bayar di Kafe
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border border-emerald-500/30 text-white p-8 text-center shadow-2xl z-10 flex flex-col items-center"
          >
            {/* success tick check */}
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-500 mb-6">
              <ShieldCheck size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Reservasi Berhasil!</h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Histori reservasi Anda telah disimpan dengan aman dan status diperbarui secara real-time.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
