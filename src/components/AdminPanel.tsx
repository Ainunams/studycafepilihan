/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cafe, Booking, MenuItem, User as AppUser } from '../types';
import { 
  Coffee, Calendar, Users, DollarSign, Plus, Trash2, Edit3, Check, X, RefreshCw, BarChart3, ListCollapse, Instagram, Map, PlusCircle, Trash
} from 'lucide-react';

interface AdminPanelProps {
  cafes: Cafe[];
  bookings: Booking[];
  appUsers: AppUser[];
  onAddCafe: (cafe: Cafe) => void;
  onUpdateCafe: (cafe: Cafe) => void;
  onDeleteCafe: (cafeId: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
}

export default function AdminPanel({
  cafes,
  bookings,
  appUsers,
  onAddCafe,
  onUpdateCafe,
  onDeleteCafe,
  onUpdateBookingStatus,
}: AdminPanelProps) {
  const [subTab, setSubTab] = useState<'bookings' | 'users' | 'cafes'>('bookings');
  
  // States for adding/editing a cafe
  const [isEditingCafe, setIsEditingCafe] = useState<boolean>(false);
  const [editingCafeId, setEditingCafeId] = useState<string | null>(null);
  const [cafeName, setCafeName] = useState('');
  const [cafeLocation, setCafeLocation] = useState('');
  const [cafeDesc, setCafeDesc] = useState('');
  const [cafeRating, setCafeRating] = useState(4.5);
  const [cafePrice, setCafePrice] = useState(15000);
  const [cafeImage, setCafeImage] = useState('');
  const [cafeDesks, setCafeDesks] = useState(10);
  const [cafeFacilities, setCafeFacilities] = useState<string[]>(['WiFi Kencang', 'Banyak Colokan']);
  const [cafeInstagram, setCafeInstagram] = useState('');
  const [cafeGmaps, setCafeGmaps] = useState('');
  const [cafeMenuItems, setCafeMenuItems] = useState<MenuItem[]>([]);

  // Menu Builder state variables for the current row
  const [menuItemName, setMenuItemName] = useState('');
  const [menuItemPrice, setMenuItemPrice] = useState(15000);
  const [menuItemCategory, setMenuItemCategory] = useState<'Kopi' | 'Non-Kopi' | 'Camilan' | 'Makanan Berat'>('Kopi');

  // Metric calculators
  const approvedBookings = bookings.filter((b) => b.status === 'Disetujui' || b.status === 'Selesai');
  const totalRevenue = approvedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const uniqueUsers = appUsers?.length || 0;

  const FACILITY_OPTIONS = ['WiFi Kencang', 'Tenang', 'Banyak Colokan', 'Aesthetic'];

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleFacilityToggle = (fac: string) => {
    if (cafeFacilities.includes(fac)) {
      setCafeFacilities(cafeFacilities.filter((f) => f !== fac));
    } else {
      setCafeFacilities([...cafeFacilities, fac]);
    }
  };

  const addMenuItem = () => {
    if (!menuItemName.trim()) return;
    const newItem: MenuItem = {
      id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 5),
      name: menuItemName.trim(),
      price: Number(menuItemPrice),
      category: menuItemCategory,
    };
    setCafeMenuItems([...cafeMenuItems, newItem]);
    setMenuItemName('');
  };

  const removeMenuItem = (itemId: string) => {
    setCafeMenuItems(cafeMenuItems.filter((item) => item.id !== itemId));
  };

  const handleSaveCafe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cafeName || !cafeLocation || !cafeDesc) return;

    const imgFallback = cafeImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800';

    if (editingCafeId) {
      // Edit
      const updated: Cafe = {
        id: editingCafeId,
        name: cafeName,
        location: cafeLocation,
        description: cafeDesc,
        image: imgFallback,
        rating: cafeRating,
        pricePerHour: Number(cafePrice),
        availableDesks: Number(cafeDesks),
        facilities: cafeFacilities,
        instagram: cafeInstagram || undefined,
        gmapsUrl: cafeGmaps || undefined,
        menu: cafeMenuItems.length > 0 ? cafeMenuItems : undefined,
      };
      onUpdateCafe(updated);
    } else {
      // Add
      const added: Cafe = {
        id: 'cafe-' + Date.now(),
        name: cafeName,
        location: cafeLocation,
        description: cafeDesc,
        image: imgFallback,
        rating: Number(cafeRating),
        pricePerHour: Number(cafePrice),
        availableDesks: Number(cafeDesks),
        facilities: cafeFacilities,
        instagram: cafeInstagram || undefined,
        gmapsUrl: cafeGmaps || undefined,
        menu: cafeMenuItems.length > 0 ? cafeMenuItems : undefined,
      };
      onAddCafe(added);
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setEditingCafeId(null);
    setIsEditingCafe(false);
    setCafeName('');
    setCafeLocation('');
    setCafeDesc('');
    setCafeRating(4.5);
    setCafePrice(15000);
    setCafeImage('');
    setCafeDesks(10);
    setCafeFacilities(['WiFi Kencang', 'Banyak Colokan']);
    setCafeInstagram('');
    setCafeGmaps('');
    setCafeMenuItems([]);
    setMenuItemName('');
    setMenuItemPrice(15000);
    setMenuItemCategory('Kopi');
  };

  const startEditCafe = (cafe: Cafe) => {
    setEditingCafeId(cafe.id);
    setCafeName(cafe.name);
    setCafeLocation(cafe.location);
    setCafeDesc(cafe.description);
    setCafeRating(cafe.rating);
    setCafePrice(cafe.pricePerHour);
    setCafeImage(cafe.image);
    setCafeDesks(cafe.availableDesks);
    setCafeFacilities(cafe.facilities);
    setCafeInstagram(cafe.instagram || '');
    setCafeGmaps(cafe.gmapsUrl || '');
    setCafeMenuItems(cafe.menu || []);
    setIsEditingCafe(true);
  };

  return (
    <div className="py-12 bg-zinc-950 text-white min-h-[90vh] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dashboard <span className="text-amber-500">Administrator</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Kontrol inventori cabang Study Cafe dan kelola transaksi booking pelanggan.
            </p>
          </div>

          <div className="flex gap-2 bg-zinc-900/60 p-1 border border-zinc-850 rounded-xl max-w-lg w-full sm:w-auto">
            <button
              onClick={() => setSubTab('bookings')}
              className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                subTab === 'bookings' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Reservasi ({bookings.length})
            </button>
            <button
              onClick={() => setSubTab('users')}
              className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                subTab === 'users' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Pelanggan ({uniqueUsers})
            </button>
            <button
              onClick={() => setSubTab('cafes')}
              className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                subTab === 'cafes' ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kelola Cafe ({cafes.length})
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl flex items-center gap-4 shadow">
            <div className="h-11 w-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Coffee size={22} />
            </div>
            <div>
              <span className="block text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Total Cafe</span>
              <span className="text-xl font-bold font-mono text-white">{cafes.length}</span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl flex items-center gap-4 shadow">
            <div className="h-11 w-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Calendar size={22} />
            </div>
            <div>
              <span className="block text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Total Booking</span>
              <span className="text-xl font-bold font-mono text-white">{bookings.length}</span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl flex items-center gap-4 shadow">
            <div className="h-11 w-11 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users size={22} />
            </div>
            <div>
              <span className="block text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Pelanggan</span>
              <span className="text-xl font-bold font-mono text-white">{uniqueUsers}</span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl flex items-center gap-4 shadow col-span-2 lg:col-span-1">
            <div className="h-11 w-11 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
              <DollarSign size={22} />
            </div>
            <div>
              <span className="block text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Total Omset</span>
              <span className="text-xl font-extrabold text-amber-500">{formattedPrice(totalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* ACTION TABS PANEL */}
        {subTab === 'bookings' && (
          /* RESERVATIONS HISTORY WITH ADMIN CONTROLS */
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 shadow-xl overflow-hidden text-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Semua Histori & Status Reservasi</h2>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <Calendar size={42} className="mx-auto mb-4 text-zinc-700" />
                <p className="text-sm">Belum ada transaksi pemesanan masuk.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Nama / Email</th>
                      <th className="py-3 px-4">Lokasi Cafe</th>
                      <th className="py-3 px-4">Jadwal & Meja</th>
                      <th className="py-3 px-4 text-right">Biaya</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Aksi Manajemen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-sm">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-zinc-900/30 transition">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{booking.userName}</div>
                          <div className="text-xs text-zinc-500 font-mono mt-0.5">{booking.userEmail}</div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-zinc-300">
                          {booking.cafeName}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white flex items-center gap-1.5">
                            <span className="text-amber-500 text-xs font-mono">{booking.date}</span> @ <span className="text-zinc-300 text-xs font-mono">{booking.time}</span>
                          </div>
                          <div className="text-xs text-zinc-550 font-mono mt-1 font-semibold">{booking.deskNumber} ({booking.duration} Jam)</div>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-amber-500 font-mono">
                          {formattedPrice(booking.totalPrice)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            booking.status === 'Disetujui' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            booking.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            booking.status === 'Dibatalkan' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-1.5">
                            {booking.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => onUpdateBookingStatus(booking.id, 'Disetujui')}
                                  className="p-1 px-2.5 text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 transition-all rounded-md flex items-center gap-0.5"
                                  title="Setujui Booking"
                                >
                                  <Check size={13} strokeWidth={3} />
                                  Setujui
                                </button>
                                <button
                                  onClick={() => onUpdateBookingStatus(booking.id, 'Dibatalkan')}
                                  className="p-1 px-2.5 text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-red-500 hover:text-white transition-all rounded-md flex items-center gap-0.5"
                                  title="Tolak / Batalkan"
                                >
                                  <X size={13} />
                                  Tolak
                                </button>
                              </>
                            )}
                            
                            {booking.status === 'Disetujui' && (
                              <button
                                onClick={() => onUpdateBookingStatus(booking.id, 'Selesai')}
                                className="p-1 px-3 text-xs font-bold text-black bg-blue-400 hover:bg-blue-300 transition-all rounded-md flex items-center gap-0.5"
                                title="Selesaikan Sesi"
                              >
                                <Check size={13} strokeWidth={3} />
                                Selesai
                              </button>
                            )}

                            {['Selesai', 'Dibatalkan'].includes(booking.status) && (
                              <span className="text-xs text-zinc-650 italic">Tidak ada tindakan</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {subTab === 'users' && (
          /* LIST OF REGISTREES / REGISTERED ACCOUNTS FOR PRIVACY CONTROL */
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 shadow-xl overflow-hidden text-left">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">Daftar Orang Login & Akun Terdaftar</h2>
                <p className="text-xs text-zinc-500 mt-1">Daftar seluruh pelanggan dan tamu yang telah melakukan proses registrasi demi privasi dan keamanan sistem.</p>
              </div>
            </div>

            {!appUsers || appUsers.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <Users size={42} className="mx-auto mb-4 text-zinc-700" />
                <p className="text-sm">Belum ada user yang terdaftar dalam sistem.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Nama Lengkap</th>
                      <th className="py-3 px-4">Alamat Email</th>
                      <th className="py-3 px-4">ID Pengguna</th>
                      <th className="py-3 px-4">Hak Akses / Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 text-sm">
                    {appUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/30 transition">
                        <td className="py-4 px-4 font-semibold text-white">
                          {user.name}
                        </td>
                        <td className="py-4 px-4 text-zinc-350 font-mono text-xs">
                          {user.email}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs text-zinc-500">
                          {user.id}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {subTab === 'cafes' && (
          /* CAFE CATALOG INVENTORY MANAGEMENT (CRUD) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Form Section */}
            <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl shadow-xl h-fit">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Coffee size={18} className="text-amber-550" />
                {editingCafeId ? 'Edit Cabang Cafe' : 'Tambah Cabang Baru'}
              </h2>

              <form onSubmit={handleSaveCafe} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Nama Cafe</label>
                  <input
                    type="text"
                    required
                    value={cafeName}
                    onChange={(e) => setCafeName(e.target.value)}
                    placeholder="Contoh: Dua Coffee & Work Space"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Lokasi Cabang</label>
                  <input
                    type="text"
                    required
                    value={cafeLocation}
                    onChange={(e) => setCafeLocation(e.target.value)}
                    placeholder="Contoh: Blok M, Jakarta Selatan"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Tarif / Jam (IDR)</label>
                    <input
                      type="number"
                      required
                      value={cafePrice}
                      onChange={(e) => setCafePrice(Number(e.target.value))}
                      placeholder="Tarif"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Kapasitas Meja</label>
                    <input
                      type="number"
                      required
                      value={cafeDesks}
                      onChange={(e) => setCafeDesks(Number(e.target.value))}
                      placeholder="Banyak meja"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">URL Gambar Foto</label>
                  <input
                    type="text"
                    value={cafeImage}
                    onChange={(e) => setCafeImage(e.target.value)}
                    placeholder="Contoh: https://images.unsplash.com/..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Deskripsi</label>
                  <textarea
                    required
                    value={cafeDesc}
                    onChange={(e) => setCafeDesc(e.target.value)}
                    placeholder="Tulis suasana cafe dan keunggulannya..."
                    rows={3}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Instagram Link</label>
                    <input
                      type="url"
                      value={cafeInstagram}
                      onChange={(e) => setCafeInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Google Maps Link</label>
                    <input
                      type="url"
                      value={cafeGmaps}
                      onChange={(e) => setCafeGmaps(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* CAFE MENU BUILDER SECTION */}
                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center justify-between">
                    <span>Kelola Menu Cafe ({cafeMenuItems.length})</span>
                    <span className="text-[10px] text-zinc-500 lowercase font-normal">tambahan opsional</span>
                  </h3>

                  {/* List of currently compiled items */}
                  {cafeMenuItems.length > 0 && (
                    <div className="max-h-36 overflow-y-auto space-y-1.5 border border-zinc-850 bg-zinc-900/10 p-2 rounded-lg divide-y divide-zinc-850/50">
                      {cafeMenuItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs text-zinc-300 pt-1.5 first:pt-0">
                          <div>
                            <span className="font-semibold text-white">{item.name}</span>
                            <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-500">Rp {item.price.toLocaleString()}</span>
                            <button
                              type="button"
                              onClick={() => removeMenuItem(item.id)}
                              className="text-red-400 hover:text-white p-0.5 transition"
                              title="Hapus menu ini"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form fields to add new item */}
                  <div className="space-y-2 pt-2 border-t border-zinc-850">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Menu (cth: Cappuccino)"
                        value={menuItemName}
                        onChange={(e) => setMenuItemName(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Harga (Rp)"
                        value={menuItemPrice || ''}
                        onChange={(e) => setMenuItemPrice(Number(e.target.value))}
                        className="bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <select
                        value={menuItemCategory}
                        onChange={(e) => setMenuItemCategory(e.target.value as any)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Kopi">Kopi</option>
                        <option value="Non-Kopi">Non-Kopi</option>
                        <option value="Camilan">Camilan</option>
                        <option value="Makanan Berat">Makanan Berat</option>
                      </select>

                      <button
                        type="button"
                        onClick={addMenuItem}
                        className="px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                        Tambah Menu
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Fasilitas Unggulan</label>
                  <div className="flex flex-wrap gap-2">
                    {FACILITY_OPTIONS.map((fac) => {
                      const selected = cafeFacilities.includes(fac);
                      return (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => handleFacilityToggle(fac)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                            selected 
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-bold' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          {fac}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-amber-500 text-black font-semibold text-xs tracking-wide hover:bg-amber-400 transition"
                  >
                    Simpan Cafe
                  </button>
                  {editingCafeId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="py-2.5 px-4 rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700 transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Section */}
            <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl shadow-xl lg:col-span-2">
              <h2 className="text-lg font-bold mb-5">Daftar Cabang Aktif ({cafes.length})</h2>

              <div className="space-y-3">
                {cafes.map((cafe) => (
                  <div 
                    key={cafe.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 border border-zinc-850 p-4 rounded-xl gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                        <img 
                          src={cafe.image} 
                          alt={cafe.name} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">{cafe.name}</h4>
                        <span className="text-xs text-zinc-500 font-mono">{cafe.location}</span>
                        <div className="text-xs text-amber-500 mt-1 font-semibold">{formattedPrice(cafe.pricePerHour)}/jam</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditCafe(cafe)}
                        className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
                        title="Edit Cafe"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteCafe(cafe.id)}
                        className="p-2 bg-zinc-900 border border-zinc-800 text-red-400 hover:text-white hover:bg-red-500 transition rounded-lg"
                        title="Hapus Cafe"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
