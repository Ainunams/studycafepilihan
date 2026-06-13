/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cafe } from './types';

export const INITIAL_CAFES: Cafe[] = [
  {
    id: 'cafe-1',
    name: 'Dua Coffee & Work',
    location: 'Cilandak, Jakarta Selatan',
    description: 'Tempat ideal untuk fokus bekerja dan belajar dengan area outdoor rindang, interior nyaman, dan koneksi internet super cepat.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    pricePerHour: 20000,
    facilities: ['WiFi Kencang', 'Banyak Colokan', 'Aesthetic'],
    availableDesks: 15,
    instagram: 'https://instagram.com/duacoffee',
    gmapsUrl: 'https://maps.google.com/?q=Dua+Coffee+Cilandak',
    menu: [
      { id: 'm1-1', name: 'Es Kopi Susu Kedua', price: 22000, category: 'Kopi' },
      { id: 'm1-2', name: 'Matcha Latte Smooth', price: 25000, category: 'Non-Kopi' },
      { id: 'm1-3', name: 'Butter Croissant', price: 18000, category: 'Camilan' },
      { id: 'm1-4', name: 'Nasi Goreng Kampung', price: 35000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r1-1', userName: 'Andi Pratama', userEmail: 'andi@example.com', rating: 5, comment: 'Tempat terfavorit buat nugas kuliah, internetnya kencang banget dan suasananya tenang.', date: '2026-06-10' },
      { id: 'r1-2', userName: 'Siti Rahma', userEmail: 'siti@example.com', rating: 4, comment: 'kopinya enak, mejanya nyaman buat pake laptop seharian.', date: '2026-06-08' }
    ]
  },
  {
    id: 'cafe-2',
    name: 'Kopi Nako Coworking',
    location: 'Semplak, Bogor',
    description: 'Desain kaca ikonik Kopi Nako dengan tambahan ruang khusus coworking yang hening, ramah untuk pelajar dan profesional.',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    pricePerHour: 15000,
    facilities: ['WiFi Kencang', 'Tenang', 'Banyak Colokan'],
    availableDesks: 20,
    instagram: 'https://instagram.com/kopinako.id',
    gmapsUrl: 'https://maps.google.com/?q=Kopi+Nako+Bogor',
    menu: [
      { id: 'm2-1', name: 'Es Kopi Nako', price: 19000, category: 'Kopi' },
      { id: 'm2-2', name: 'Yuzu Tea Segar', price: 21000, category: 'Non-Kopi' },
      { id: 'm2-3', name: 'Pisang Nako Keju', price: 15000, category: 'Camilan' },
      { id: 'm2-4', name: 'Mie Goreng Spesial Nako', price: 28000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r2-1', userName: 'Budi Santoso', userEmail: 'budi@example.com', rating: 4, comment: 'Harga sewa per jam terjangkau sekali. Cocok di kantong mahasiswa.', date: '2026-06-11' },
      { id: 'r2-2', userName: 'Laras Ati', userEmail: 'laras@example.com', rating: 5, comment: 'Konsep coworkingnya bagus banget, tenang dan bersih.', date: '2026-06-05' }
    ]
  },
  {
    id: 'cafe-3',
    name: 'Mula Cafe & Hub',
    location: 'Blok M, Jakarta Selatan',
    description: 'Coworking ultra modern dengan pencahayaan hangat, kursi ergonomis, dan suasana yang membangkitkan kreativitas.',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    pricePerHour: 25000,
    facilities: ['WiFi Kencang', 'Tenang', 'Aesthetic', 'Banyak Colokan'],
    availableDesks: 12,
    instagram: 'https://instagram.com/mulacafe.hub',
    gmapsUrl: 'https://maps.google.com/?q=Mula+Cafe+Blok+M',
    menu: [
      { id: 'm3-1', name: 'Vanilla Cafe Latte', price: 26000, category: 'Kopi' },
      { id: 'm3-2', name: 'Choco Cream Velvet', price: 28000, category: 'Non-Kopi' },
      { id: 'm3-3', name: 'French Fries Herb', price: 20000, category: 'Camilan' },
      { id: 'm3-4', name: 'Club Sandwich Supreme', price: 38000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r3-1', userName: 'Diana Putri', userEmail: 'diana@example.com', rating: 5, comment: 'Kursi kerjanya sangat ergonomis, colokan melimpah di setiap sudut.', date: '2026-06-12' },
      { id: 'r3-2', userName: 'Rian Hidayat', userEmail: 'rian@example.com', rating: 5, comment: 'Terbaik di Blok M! Akses dekat MRT dan sangat representatif.', date: '2026-06-09' }
    ]
  },
  {
    id: 'cafe-4',
    name: 'Koma Space & Library',
    location: 'Depok, Sleman, Yogyakarta',
    description: 'Sangat direkomendasikan bagi mahasiswa yang membutuhkan suasana perpustakaan hening namun tetap santai dengan secangkir kopi hangat.',
    image: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    pricePerHour: 10000,
    facilities: ['Tenang', 'Banyak Colokan', 'WiFi Kencang'],
    availableDesks: 18,
    instagram: 'https://instagram.com/komaspace',
    gmapsUrl: 'https://maps.google.com/?q=Koma+Space+Yogyakarta',
    menu: [
      { id: 'm4-1', name: 'Americano Hebat', price: 12000, category: 'Kopi' },
      { id: 'm4-2', name: 'Ice Lemon Tea Segar', price: 10000, category: 'Non-Kopi' },
      { id: 'm4-3', name: 'Donat Gula Halus', price: 8000, category: 'Camilan' },
      { id: 'm4-4', name: 'Spaghetti Bolognese Koma', price: 22000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r4-1', userName: 'Fahmi Adi', userEmail: 'fahmi@example.com', rating: 5, comment: 'Cocok banget buat bikin skripsi. Sunyi, tenang, dan murah meriah.', date: '2026-06-10' },
      { id: 'r4-2', userName: 'Gita Lestari', userEmail: 'gita@example.com', rating: 4, comment: 'Tempat favorit di Jogja, meskipun ramai tetap kondusif.', date: '2026-06-07' }
    ]
  },
  {
    id: 'cafe-5',
    name: 'Filosofi Kopi Melawai',
    location: 'Kebayoran Baru, Jakarta Selatan',
    description: 'Kafe bersejarah dengan getaran retro-klasik. Cocok bagi Anda yang ingin mencari inspirasi, berdiskusi kelompok, atau membaca buku.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    pricePerHour: 18000,
    facilities: ['Aesthetic', 'Banyak Colokan'],
    availableDesks: 8,
    instagram: 'https://instagram.com/filosofikopi',
    gmapsUrl: 'https://maps.google.com/?q=Filosofi+Kopi+Melawai',
    menu: [
      { id: 'm5-1', name: 'Kopi Lestari (Ice Latte)', price: 24000, category: 'Kopi' },
      { id: 'm5-2', name: 'Red Velvet Premium', price: 25000, category: 'Non-Kopi' },
      { id: 'm5-3', name: 'Kue Cubit Cokelat', price: 16000, category: 'Camilan' },
      { id: 'm5-4', name: 'Beef Burger Filosofi', price: 42000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r5-1', userName: 'Deni Surya', userEmail: 'deni@example.com', rating: 4, comment: 'Vibenya asyik banget, estetik dan bikin betah nongkrong sambil ngetik.', date: '2026-06-11' },
      { id: 'r5-2', userName: 'Amelia', userEmail: 'amel@example.com', rating: 5, comment: 'Es kopi lestarinya juara! Meja belajarnya terbatas jadi siap-siap antre.', date: '2026-06-08' }
    ]
  },
  {
    id: 'cafe-6',
    name: 'Satu Atap Co-working',
    location: 'Genteng, Surabaya',
    description: 'Kafe modern dengan ruang kolaborasi luas, ruang meeting privat, dan paket kopi istimewa untuk menemani sesi belajar panjang Anda.',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    pricePerHour: 22000,
    facilities: ['WiFi Kencang', 'Tenang', 'Aesthetic'],
    availableDesks: 10,
    instagram: 'https://instagram.com/satuatap.co',
    gmapsUrl: 'https://maps.google.com/?q=Satu+Atap+Surabaya',
    menu: [
      { id: 'm6-1', name: 'Ice Cappuccino Creamy', price: 23000, category: 'Kopi' },
      { id: 'm6-2', name: 'Thai Green Tea', price: 21000, category: 'Non-Kopi' },
      { id: 'm6-3', name: 'Cireng Krispi Sambal Rujak', price: 14000, category: 'Camilan' },
      { id: 'm6-4', name: 'Chicken Katsu Curry', price: 33000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r6-1', userName: 'Hendra Setiawan', userEmail: 'hendra@example.com', rating: 5, comment: 'Ruang kolaborasinya mantap, cocok buat ngerjain project bareng tim start-up.', date: '2026-06-11' },
      { id: 'r6-2', userName: 'Lina Wahyudi', userEmail: 'lina@example.com', rating: 4, comment: 'Makanannya enak-enak dan mengenyangkan. AC-nya dingin.', date: '2026-06-09' }
    ]
  },
  {
    id: 'cafe-7',
    name: 'Arah Kopi Hub',
    location: 'Coblong, Dago, Bandung',
    description: 'Workspace nyaman berudara sejuk khas Dago dengan area semi-outdoor modern, kopi premium, dan pencahayaan estetik yang menenangkan.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    pricePerHour: 18000,
    facilities: ['WiFi Kencang', 'Aesthetic', 'Banyak Colokan', 'Tenang'],
    availableDesks: 14,
    instagram: 'https://instagram.com/arahkopi',
    gmapsUrl: 'https://maps.google.com/?q=Arah+Kopi+Dago+Bandung',
    menu: [
      { id: 'm7-1', name: 'Arah Macchiato Creamy', price: 22000, category: 'Kopi' },
      { id: 'm7-2', name: 'Taro Velvet Latte', price: 20000, category: 'Non-Kopi' },
      { id: 'm7-3', name: 'Cinnamon Roll Warm', price: 15000, category: 'Camilan' },
      { id: 'm7-4', name: 'Nasi Gila Bakso Spektakuler', price: 30000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r7-1', userName: 'Zidan Alamsyah', userEmail: 'zidan@example.com', rating: 5, comment: 'Paling mantap se-Bandung buat nugas malam. Dingin, sejuk dan tenang.', date: '2026-06-12' },
      { id: 'r7-2', userName: 'Nadia Syafira', userEmail: 'nadia@example.com', rating: 4, comment: 'Estetik banget dekorasinya, banyak spot foto bagus juga disela belajar.', date: '2026-06-10' }
    ]
  },
  {
    id: 'cafe-8',
    name: 'Common Grounds Cowork',
    location: 'Sudirman, Jakarta Pusat',
    description: 'Terletak di jantung bisnis Jakarta, menggabungkan specialty coffee luar biasa dan fasilitas kerja premium berpencahayaan profesional.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    pricePerHour: 30000,
    facilities: ['WiFi Kencang', 'Tenang', 'Banyak Colokan'],
    availableDesks: 11,
    instagram: 'https://instagram.com/commongrounds.co',
    gmapsUrl: 'https://maps.google.com/?q=Common+Grounds+Sudirman+Jakarta',
    menu: [
      { id: 'm8-1', name: 'Espresso Double Shot', price: 25000, category: 'Kopi' },
      { id: 'm8-2', name: 'Fresh Avocado Juice', price: 28000, category: 'Non-Kopi' },
      { id: 'm8-3', name: 'Truffle Fries Gourmet', price: 35000, category: 'Camilan' },
      { id: 'm8-4', name: 'Sourdough Smoked Beef', price: 55000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r8-1', userName: 'Rizwan Hakim', userEmail: 'rizwan@example.com', rating: 5, comment: 'Layanan kelas satu! Sangat cocok untuk meeting online prestisius dengan klien bergengsi.', date: '2026-06-12' },
      { id: 'r8-2', userName: 'Jessica', userEmail: 'jess@example.com', rating: 4, comment: 'Khusus professional, specialty coffee nya bener-bener enak dan nendang kafeinnya.', date: '2026-06-08' }
    ]
  },
  {
    id: 'cafe-9',
    name: 'Ruang Seduh & Workspace',
    location: 'Kaliurang, Sleman, Yogyakarta',
    description: 'Suasana tenang khas pegunungan Kaliurang yang asri, menawarkan pod-pod belajar privat dan ruang kolosal berfasilitas lengkap.',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    pricePerHour: 12000,
    facilities: ['WiFi Kencang', 'Tenang', 'Banyak Colokan', 'Aesthetic'],
    availableDesks: 16,
    instagram: 'https://instagram.com/ruangseduh',
    gmapsUrl: 'https://maps.google.com/?q=Ruang+Seduh+Kaliurang+Yogyakarta',
    menu: [
      { id: 'm9-1', name: 'Kopi V60 Specialty', price: 18000, category: 'Kopi' },
      { id: 'm9-2', name: 'Ice Lychee Tea Sweet', price: 15000, category: 'Non-Kopi' },
      { id: 'm9-3', name: 'Singkong Keju Krispi', price: 12000, category: 'Camilan' },
      { id: 'm9-4', name: 'Ayam geprek Sambal Bawang', price: 22000, category: 'Makanan Berat' }
    ],
    reviews: [
      { id: 'r9-1', userName: 'Yusuf Gibran', userEmail: 'yusuf@example.com', rating: 5, comment: 'Suasananya asri pegunungan, kopinya diseduh manual lezat. Sukses terus!', date: '2026-06-11' },
      { id: 'r9-2', userName: 'Clara Shinta', userEmail: 'clara@example.com', rating: 4, comment: 'Tersedia bilik belajar pribadi yang hening sekali, sangat tenang.', date: '2026-06-06' }
    ]
  }
];
