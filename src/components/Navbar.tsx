/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { User as AppUser } from '../types';
import { LogOut, User, LayoutDashboard, Calendar, Search, LogIn } from 'lucide-react';

interface NavbarProps {
  currentUser: AppUser | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  activeTab: 'beranda' | 'katalog' | 'admin' | 'reservasi';
  setActiveTab: (tab: 'beranda' | 'katalog' | 'admin' | 'reservasi') => void;
}

export default function Navbar({
  currentUser,
  onLoginClick,
  onLogoutClick,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/60 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left Brand Logo */}
        <div 
          onClick={() => setActiveTab('beranda')} 
          className="flex items-center gap-2 cursor-pointer group"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all duration-300">
            <span className="text-amber-500 font-bold text-lg font-mono">SC</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight font-sans text-white">
            Study <span className="text-amber-500">Cafe</span>
          </span>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center space-x-1" id="nav-center-menu">
          <button
            onClick={() => setActiveTab('beranda')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'beranda' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {activeTab === 'beranda' && (
              <motion.span
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-white/5 rounded-lg border-b-2 border-amber-500"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            Beranda
          </button>

          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative cursor-pointer ${
              activeTab === 'katalog' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {activeTab === 'katalog' && (
              <motion.span
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-white/5 rounded-lg border-b-2 border-amber-500"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            Katalog
          </button>

          {currentUser && (
            <button
              onClick={() => setActiveTab('reservasi')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative cursor-pointer ${
                activeTab === 'reservasi' ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {activeTab === 'reservasi' && (
                <motion.span
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-white/5 rounded-lg border-b-2 border-amber-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Reservasiku
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative cursor-pointer ${
                activeTab === 'admin' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {activeTab === 'admin' && (
                <motion.span
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-white/5 rounded-lg border-b-2 border-amber-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="flex items-center gap-1">
                Admin Panel
              </span>
            </button>
          )}
        </nav>

        {/* Right Section Profile/Button */}
        <div className="flex items-center gap-3" id="nav-right-actions">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Profile Badge info */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-white text-sm font-semibold">{currentUser.name}</span>
                <span className="text-zinc-500 text-xs font-mono">{currentUser.role === 'admin' ? 'Admin' : 'Pelanggan'}</span>
              </div>
              <div 
                onClick={() => currentUser.role === 'admin' ? setActiveTab('admin') : setActiveTab('reservasi')}
                className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white cursor-pointer hover:bg-zinc-800 transition"
                title="Lihat Profil"
              >
                <User size={18} className="text-amber-400" />
              </div>
              <button
                onClick={onLogoutClick}
                className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition duration-240 cursor-pointer active:scale-95"
                title="Keluar"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 shadow-md hover:shadow-amber-500/10 cursor-pointer"
              id="login-btn"
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="md:hidden flex justify-around items-center bg-zinc-950 border-t border-zinc-900/60 py-2.5">
        <button
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'beranda' ? 'text-amber-500' : 'text-zinc-500'}`}
        >
          <Search size={18} />
          Beranda
        </button>
        <button
          onClick={() => setActiveTab('katalog')}
          className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'katalog' ? 'text-amber-500' : 'text-zinc-500'}`}
        >
          <Calendar size={18} />
          Katalog
        </button>
        {currentUser && (
          <button
            onClick={() => setActiveTab('reservasi')}
            className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'reservasi' ? 'text-amber-500' : 'text-zinc-500'}`}
          >
            <User size={18} />
            Reservasiku
          </button>
        )}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'admin' ? 'text-amber-500' : 'text-zinc-500'}`}
          >
            <LayoutDashboard size={18} />
            Admin
          </button>
        )}
      </div>
    </header>
  );
}
