/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Shield } from 'lucide-react';
import { User as AppUser } from '../types';
import { registerUser } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Semua kolom wajib diisi!');
      return;
    }

    try {
      if (isRegister) {
        // Handle Register - Only hardiantirahmasitorus@gmail.com can be registered as Admin
        const lowerEmail = email.trim().toLowerCase();
        const isUserAdmin = lowerEmail === 'hardiantirahmasitorus@gmail.com';
        const newUser: AppUser = {
          id: 'user-' + Date.now(),
          email: lowerEmail,
          name: name.trim(),
          role: isUserAdmin ? 'admin' : 'user',
        };
        await registerUser(newUser);
        onLoginSuccess(newUser);
        onClose();
      } else {
        // Handle Login
        const lowercaseEmail = email.trim().toLowerCase();
        let loggedUser: AppUser;
        
        if (lowercaseEmail === 'hardiantirahmasitorus@gmail.com') {
          loggedUser = {
            id: 'admin-hardianti',
            email: lowercaseEmail,
            name: 'Hardianti Rahma Sitorus',
            role: 'admin',
          };
        } else {
          loggedUser = {
            id: 'user-' + Math.random().toString(36).substring(2, 9),
            email: lowercaseEmail,
            name: email.includes('@') ? email.split('@')[0] : email,
            role: 'user',
          };
        }
        // Register logged in users so they display in our user directory database!
        await registerUser(loggedUser);
        onLoginSuccess(loggedUser);
        onClose();
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba kembali.');
    }
  };

  const loginDemoUser = async () => {
    const demoUser: AppUser = {
      id: 'demo-user',
      email: 'pelajar@studycafe.com',
      name: 'Budi Santoso',
      role: 'user',
    };
    await registerUser(demoUser);
    onLoginSuccess(demoUser);
    onClose();
  };

  const loginDemoAdmin = async () => {
    const demoAdmin: AppUser = {
      id: 'admin-hardianti',
      email: 'hardiantirahmasitorus@gmail.com',
      name: 'Hardianti Rahma Sitorus',
      role: 'admin',
    };
    await registerUser(demoAdmin);
    onLoginSuccess(demoAdmin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 text-white p-6 shadow-2xl z-10"
      >
        {/* Head */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <h3 className="text-xl font-bold font-sans tracking-tight">
            {isRegister ? 'Buat Akun Baru' : 'Masuk Ke Akun Anda'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-950/50 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Contoh: Andi Wijaya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Mail size={18} />
              </span>
              <input
                type="text"
                placeholder={isRegister ? "nama@email.com" : "email atau 'admin'"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {isRegister && (
            <div className="flex items-center gap-2 pt-1 bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs">
              <Shield size={14} className="text-amber-500 shrink-0 animate-pulse" />
              <span className="text-zinc-400 text-[10px] leading-relaxed">
                Registrasi Admin dilindungi. Hanya email administrator resmi (<strong className="text-amber-500">hardiantirahmasitorus@gmail.com</strong>) yang mendapatkan akses penuh ke panel kontrol.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-amber-500 font-medium text-black hover:bg-amber-400 font-sans tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer mt-2"
          >
            {isRegister ? 'Daftar Sekarang' : 'Masuk'}
          </button>
        </form>

        {/* Register switcher */}
        <div className="text-center mt-4 text-sm">
          <span className="text-zinc-500">
            {isRegister ? 'Sudah memiliki akun? ' : 'Belum memiliki akun? '}
          </span>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-amber-500 hover:underline font-medium transition cursor-pointer"
          >
            {isRegister ? 'Masuk' : 'Daftar'}
          </button>
        </div>

        {/* Demo Fast Logins Grid */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase tracking-widest">Atau Akses Cepat</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={loginDemoUser}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 transition active:scale-95 cursor-pointer"
          >
            <User size={14} className="text-blue-400" />
            User Demo
          </button>
          <button
            onClick={loginDemoAdmin}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 transition active:scale-95 cursor-pointer"
          >
            <Shield size={14} className="text-amber-500" />
            Admin Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
