/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Kopi' | 'Non-Kopi' | 'Camilan' | 'Makanan Berat';
}

export interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Cafe {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  pricePerHour: number;
  facilities: string[];
  availableDesks: number;
  instagram?: string;
  gmapsUrl?: string;
  menu?: MenuItem[];
  reviews?: Review[];
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  cafeId: string;
  cafeName: string;
  date: string;
  time: string;
  duration: number; // in hours
  deskNumber: string;
  totalPrice: number;
  status: 'Pending' | 'Disetujui' | 'Selesai' | 'Dibatalkan';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
