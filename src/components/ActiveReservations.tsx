/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking } from '../types';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, CheckCircle2, ShieldAlert, Award, Coffee, HelpCircle } from 'lucide-react';

interface ActiveReservationsProps {
  bookings: Booking[];
  uEmail: string;
  onCancelBooking: (bookingId: string) => void;
}

export default function ActiveReservations({
  bookings,
  uEmail,
  onCancelBooking,
}: ActiveReservationsProps) {
  // Filter for early safety
  const myBookings = bookings.filter((b) => b.userEmail.toLowerCase() === uEmail.toLowerCase());

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const activeReservationsCount = myBookings.filter((b) => b.status === 'Disetujui' || b.status === 'Pending').length;

  return (
    <div className="py-16 bg-zinc-950 text-white min-h-[85vh] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Banner with Profile Info */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-90 w-full p-6 sm:p-8 rounded-2xl border border-zinc-850/80 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
          <div>
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block mb-1">DATA PERSISTEN</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Histori Reservasiku</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Halaman ini menyimpan seluruh data pemesanan transaksi belajar aktif dan histori secara aman.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono rounded-xl p-4 shrink-0 flex flex-col gap-1.5 shadow">
            <div>Email Aktif: <span className="text-amber-500 font-semibold">{uEmail}</span></div>
            <div>Sesi Aktif: <span className="text-emerald-400 font-bold">{activeReservationsCount} Reservasi</span></div>
          </div>
        </div>

        {/* Content lists */}
        {myBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10 flex flex-col items-center justify-center p-6"
          >
            <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-650 mb-5 text-zinc-500">
              <Coffee size={30} />
            </div>
            <h3 className="text-lg font-bold">Belum Ada Reservasi</h3>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              Kamu belum pernah melakukan reservasi tempat belajar. Silakan jelajahi katalog cafe kami dan temukan tempat belajarmu hari ini!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {myBookings
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking, bIdx) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: bIdx * 0.05 }}
                  className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-zinc-800 transition duration-200"
                >
                  <div className="space-y-3 flex-grow">
                    {/* Upper Line badge */}
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        booking.status === 'Disetujui' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        booking.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        booking.status === 'Dibatalkan' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-zinc-550 font-mono">Dibuat: {new Date(booking.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>

                    {/* Booking Cafe Title */}
                    <div>
                      <h4 className="text-xl font-extrabold text-white">{booking.cafeName}</h4>
                      <div className="text-xs text-zinc-455 font-semibold text-amber-500 mt-1 font-mono">{booking.deskNumber}</div>
                    </div>

                    {/* Schedule block */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Calendar size={14} className="text-zinc-600" />
                        <span>Tanggal: <strong className="text-white font-semibold">{booking.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Clock size={14} className="text-zinc-600" />
                        <span>Jam: <strong className="text-white font-semibold">{booking.time}</strong> ({booking.duration} Jam)</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment tag & Action */}
                  <div className="w-full md:w-auto shrink-0 flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 border-zinc-850 pt-4 md:pt-0 gap-4">
                    <div className="text-left md:text-right">
                      <span className="block text-xs text-zinc-500 uppercase tracking-widest">Total Tagihan</span>
                      <span className="text-xl font-extrabold text-amber-550 text-amber-500 font-mono mt-1 block">
                        {formattedPrice(booking.totalPrice)}
                      </span>
                      <span className="text-[10px] text-zinc-500 italic block mt-0.5">Bayar di Tempat</span>
                    </div>

                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-4.5 py-2 text-xs rounded-lg font-bold bg-zinc-850 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 border border-zinc-800 transition active:scale-95 cursor-pointer text-zinc-300"
                      >
                        Batalkan Booking
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
