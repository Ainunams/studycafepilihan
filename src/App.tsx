/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CatalogSection from './components/CatalogSection';
import AdminPanel from './components/AdminPanel';
import ActiveReservations from './components/ActiveReservations';
import LoginModal from './components/LoginModal';
import BookingModal from './components/BookingModal';
import CafeDetailModal from './components/CafeDetailModal';
import { Cafe, Booking, User as AppUser } from './types';
import { getCafes, getBookings, saveCafe, deleteCafe, saveBooking, getAppUsers } from './lib/firebase';

const CURRENT_USER_KEY = 'studycafe_current_user';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [activeTab, setActiveTab] = useState<'beranda' | 'katalog' | 'reservasi' | 'admin'>('beranda');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Dialog / Modal triggers
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedCafeForBooking, setSelectedCafeForBooking] = useState<Cafe | null>(null);
  const [selectedCafeForDetail, setSelectedCafeForDetail] = useState<Cafe | null>(null);

  // Load persistence data on bootstrap
  useEffect(() => {
    // 1. Hydrate User profile session from LocalStorage
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }

    // 2. Fetch cafes dynamic database listing
    const loadCoreData = async () => {
      try {
        const loadedCafes = await getCafes();
        setCafes(loadedCafes);

        const loadedBookings = await getBookings();
        setBookings(loadedBookings);

        const loadedUsers = await getAppUsers();
        setAppUsers(loadedUsers);
      } catch (err) {
        console.error('Failed to load initial storage state:', err);
      }
    };
    loadCoreData();
  }, []);

  // Facility filter toggles
  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  // Login session handling
  const handleLoginSuccess = async (user: AppUser) => {
    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    try {
      const loadedUsers = await getAppUsers();
      setAppUsers(loadedUsers);
    } catch (e) {
      console.warn('Failed to update users on login:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setActiveTab('beranda');
  };

  // Booking operations
  const handleAddBooking = async (newB: Booking) => {
    const updated = [...bookings, newB];
    setBookings(updated);
    await saveBooking(newB);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        const nextB: Booking = { ...b, status: 'Dibatalkan' };
        saveBooking(nextB); // Sync to persistence layers async
        return nextB;
      }
      return b;
    });
    setBookings(updated);
  };

  // Cafe creation & editing operations (Admin only)
  const handleAddCafe = async (newCafe: Cafe) => {
    const updated = [...cafes, newCafe];
    setCafes(updated);
    await saveCafe(newCafe);
  };

  const handleUpdateCafe = async (edited: Cafe) => {
    const updated = cafes.map((c) => (c.id === edited.id ? edited : c));
    setCafes(updated);
    await saveCafe(edited);
  };

  const handleDeleteCafe = async (cafeId: string) => {
    const updated = cafes.filter((c) => c.id !== cafeId);
    setCafes(updated);
    await deleteCafe(cafeId);
  };

  // Booking state operations (Admin only)
  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        const nextB: Booking = { ...b, status };
        saveBooking(nextB); // Sync to database
        return nextB;
      }
      return b;
    });
    setBookings(updated);
  };

  const triggerBookingModal = (cafe: Cafe) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
    } else {
      setSelectedCafeForBooking(cafe);
    }
  };

  const handleQuickSearchSubmit = () => {
    setActiveTab('katalog');
    // Scroll smoothly to catalog header section after search
    setTimeout(() => {
      const el = document.getElementById('katalog-langsung');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen selection:bg-amber-500 selection:text-black">
      {/* 1. Header Toolbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* 2. Main Body Content Switcher with animations */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'beranda' && (
            <motion.div
              key="beranda-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero
                cafes={cafes}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedFacilities={selectedFacilities}
                toggleFacility={toggleFacility}
                onSearchSubmit={handleQuickSearchSubmit}
                onSelectCafe={(c) => {
                  setSearchQuery(c.name);
                  setSelectedCafeForDetail(c);
                }}
              />
              <CatalogSection
                cafes={cafes}
                currentUser={currentUser}
                selectedFacilities={selectedFacilities}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onBookClick={triggerBookingModal}
                onDetailClick={setSelectedCafeForDetail}
                toggleFacility={toggleFacility}
              />
            </motion.div>
          )}

          {activeTab === 'katalog' && (
            <motion.div
              key="katalog-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CatalogSection
                cafes={cafes}
                currentUser={currentUser}
                selectedFacilities={selectedFacilities}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onBookClick={triggerBookingModal}
                onDetailClick={setSelectedCafeForDetail}
                toggleFacility={toggleFacility}
              />
            </motion.div>
          )}

          {activeTab === 'reservasi' && currentUser && (
            <motion.div
              key="reservasi-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveReservations
                bookings={bookings}
                uEmail={currentUser.email}
                onCancelBooking={handleCancelBooking}
              />
            </motion.div>
          )}

          {activeTab === 'admin' && currentUser?.role === 'admin' && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel
                cafes={cafes}
                bookings={bookings}
                appUsers={appUsers}
                onAddCafe={handleAddCafe}
                onUpdateCafe={handleUpdateCafe}
                onDeleteCafe={handleDeleteCafe}
                onUpdateBookingStatus={handleUpdateBookingStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-center text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p className="font-semibold text-zinc-400">
            &copy; 2026 Study Cafe Corp. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="max-w-md mx-auto leading-relaxed">
            Platform digital pemesanan coworking dan cafe belajar terintegrasi terlengkap di Indonesia. Belajar nyaman tanpa takut kehabisan meja.
          </p>
        </div>
      </footer>

      {/* 4. MODALS AND OVERLAYS */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {selectedCafeForBooking && (
          <BookingModal
            isOpen={!!selectedCafeForBooking}
            onClose={() => setSelectedCafeForBooking(null)}
            cafe={selectedCafeForBooking}
            currentUser={currentUser}
            onSubmitBooking={handleAddBooking}
          />
        )}

        {selectedCafeForDetail && (
          <CafeDetailModal
            isOpen={!!selectedCafeForDetail}
            cafe={selectedCafeForDetail}
            currentUser={currentUser}
            onClose={() => setSelectedCafeForDetail(null)}
            onBookClick={triggerBookingModal}
            onUpdateCafe={handleUpdateCafe}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
