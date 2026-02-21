# Panduan Tugas Akhir: Pengembangan Aplikasi Web "MyLifeOS" (Edisi Ramadan)

Dokumen ini berfungsi sebagai spesifikasi teknis lengkap (Project Brief) untuk pengembangan aplikasi produktivitas berbasis web. Mahasiswa diharapkan membangun aplikasi yang **persis** dengan spesifikasi desain, alur, dan fungsionalitas yang dijelaskan di bawah ini.

---

## 1. Deskripsi Proyek

**Nama Aplikasi**: MyLifeOS
**Tema**: Produktivitas Islami & Manajemen Gaya Hidup (Gen Z Aesthetic)
**Platform**: Web Application (PWA Ready)

Aplikasi ini bertujuan untuk membantu pengguna menyeimbangkan aktivitas duniawi dan ukhrawi, khususnya selama bulan Ramadan. Aplikasi mencakup pelacakan ibadah, manajemen kebiasaan (habits), pencatatan keuangan, dan alat bantu ibadah (jadwal sholat & arah kiblat).

---

## 2. Spesifikasi Teknis (Wajib)

Mahasiswa **harus** menggunakan teknologi berikut:

*   **Core Framework**: React (Vite) dengan TypeScript.
*   **Styling**: Tailwind CSS (Wajib menggunakan utility classes, tidak ada CSS file terpisah kecuali `index.css`).
*   **State Management**: React Context API (untuk Auth dan Notifikasi).
*   **Animasi**: `framer-motion` (untuk transisi halaman dan interaksi mikro).
*   **Ikon**: `lucide-react`.
*   **Visualisasi Data**: `react-chartjs-2` dan `chart.js`.
*   **Backend Simulation**: Mock API menggunakan `localStorage` (Tidak boleh ada backend server riil, aplikasi harus berjalan 100% di browser).
*   **Date Handling**: `date-fns`.

### 2.1. Design System & Color Palette (Wajib Pixel-Perfect)

Untuk mencapai tampilan yang seragam, gunakan konfigurasi warna dan styling berikut:

**Warna Utama:**
*   **Neon Lime (Aksen Utama)**: `#ccff00` (Gunakan sebagai `bg-neon-lime` di `tailwind.config.js` atau arbitrary value `bg-[#ccff00]`).
*   **Emerald (Mode Ramadan)**: Tailwind `emerald-500` (`#10b981`) dan `emerald-600`.
*   **Black (Background)**: `#000000` (Hitam pekat, bukan abu-abu gelap).
*   **Dark Gray (Card/Surface)**: `#111827` (Gray-900) atau `#1f2937` (Gray-800).

**Typography & Shape:**
*   **Font**: Gunakan font sans-serif modern (Inter atau system-ui).
*   **Radius**: Gunakan `rounded-3xl` (24px) untuk kartu besar, dan `rounded-2xl` (16px) untuk elemen list. Jangan gunakan `rounded-md`.
*   **Padding**: Gunakan `p-6` (24px) untuk padding dalam kartu.
*   **Shadow**: Gunakan `shadow-xl` atau `shadow-2xl` untuk elemen yang "melayang".

---

## 3. Struktur Folder Proyek

Aplikasi harus mengikuti struktur direktori berikut untuk kerapihan kode:

```
/src
├── /components         # Komponen UI yang dapat digunakan kembali
│   ├── Layout.tsx      # Wrapper utama (Header, Navigasi Bawah, Sidebar Menu)
│   ├── PrayerTimes.tsx # Komponen jadwal sholat & notifikasi
│   ├── QiblaFinder.tsx # Komponen kompas arah kiblat
│   └── ZakatCalculator.tsx # Komponen kalkulator zakat
├── /context            # Global State
│   ├── AuthContext.tsx # Manajemen login/user session
│   └── NotificationContext.tsx # Manajemen izin & setting notifikasi
├── /pages              # Halaman Utama
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx   # Halaman Home
│   ├── Ibadah.tsx
│   ├── Productivity.tsx
│   ├── Finance.tsx
│   └── Reports.tsx
├── /api.ts             # File simulasi backend (Mock API interceptor)
├── /App.tsx            # Routing utama
└── /main.tsx           # Entry point
```

---

## 4. Alur Pengguna (User Flow)

1.  **Unauthenticated**: User membuka web -> Redirect ke `/login` -> Jika belum punya akun ke `/register`.
2.  **Authenticated**: Masuk ke Dashboard (`/`).
3.  **Navigasi**: User berpindah antar modul (Ibadah, Habits, Finance) melalui *Floating Bottom Bar*.
4.  **Menu Overlay**: User mengakses pengaturan profil, notifikasi, dan logout melalui tombol "Menu" di header.

---

## 5. Detail Spesifikasi Per Halaman

### A. Halaman Login & Register
**Tampilan Visual (Wajib Pixel-Perfect):**
*   **Background**: `bg-black` (Hitam pekat).
*   **Container**: `max-w-sm` (Lebar maksimal 384px), `p-6` (Padding 24px).
*   **Logo**:
    *   Wadah: `w-16 h-16 bg-[#ccff00] rounded-2xl rotate-3 shadow-[0_0_30px_rgba(204,255,0,0.3)]`.
    *   Ikon: `Moon` (Lucide) warna hitam (`text-black`).
*   **Tipografi**:
    *   Judul: `text-4xl font-bold tracking-tight text-white`.
    *   Subjudul: `text-gray-400`.
*   **Form Input**:
    *   Style: `bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-[#ccff00]`.
    *   Pastikan tidak ada outline default browser (`outline-none`).
*   **Tombol Utama**:
    *   Login: `bg-white text-black font-bold text-lg py-4 rounded-2xl hover:bg-gray-200`.
    *   Register: `bg-[#ccff00] text-black font-bold text-lg py-4 rounded-2xl hover:bg-lime-400`.
    *   Ikon Panah: `ArrowRight` di sebelah kanan teks.

**Fungsionalitas:**
*   Simulasi login/register menyimpan data user dummy ke `localStorage`.
*   Validasi input sederhana (email & password wajib diisi).
*   Redirect otomatis ke Dashboard setelah sukses.

### B. Layout Utama (Shell Aplikasi)
**Header (Sticky Top):**
*   **Kiri**: Avatar inisial nama (Gradient background) + Sapaan "Hai, [Nama]".
*   **Kanan**: 3 Tombol Bulat (FAQ, Dark Mode Toggle, Menu Burger).
*   **Efek**: Backdrop blur (`backdrop-blur-md`) agar konten di bawahnya terlihat samar saat discroll.

**Bottom Navigation (Floating):**
*   **Posisi**: Melayang di bawah tengah layar (`fixed bottom-6`), bukan menempel di dasar layar.
*   **Style**: Glassmorphism (transparan gelap/terang).
*   **Interaksi**: Ikon menu aktif memiliki background kotak solid (Hitam/Putih) dan sedikit membesar (`scale-105`).

**Menu Sidebar (Overlay):**
*   Muncul dari kanan layar (`slide-in`).
*   Berisi: Profil User, **Toggle Notifikasi Sholat** (List switch on/off), Link Laporan, dan Logout.

**Halaman FAQ (Overlay):**
*   Muncul dari bawah layar (`slide-up`).
*   Berisi daftar pertanyaan (Accordion) tentang cara penggunaan aplikasi.

### C. Halaman Dashboard (`/`)
**Konsep**: "Bento Grid" (Susunan kartu-kartu informasi).

1.  **Hero Card (Paling Atas)**:
    *   **Style**: `bg-black dark:bg-white text-white dark:text-black p-6 rounded-3xl shadow-2xl relative overflow-hidden`.
    *   **Ornamen**: `w-32 h-32 bg-[#ccff00] opacity-20 rounded-full blur-3xl absolute top-0 right-0`.
    *   **Konten**:
        *   Teks kecil: "Target Ramadan" (`opacity-70`).
        *   Judul Besar: "30 Hari Lagi" (`text-3xl font-bold`).
        *   Progress Bar: `h-1.5 bg-white/20 rounded-full` dengan indikator `w-[15%] bg-[#ccff00]`.
2.  **Statistik Grid (2 Kolom)**:
    *   **Kartu**: `bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800`.
    *   **Ikon**: Dalam lingkaran `w-10 h-10 rounded-full`.
        *   Skor Ibadah: `bg-emerald-100 text-emerald-600`.
        *   Kebiasaan: `bg-blue-100 text-blue-600`.
    *   **Angka**: `text-2xl font-bold`.
3.  **Chart Konsistensi**:
    *   **Container**: `bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800`.
    *   **Judul**: "Konsistensi" dengan ikon `TrendingUp` abu-abu.
    *   **Chart**: Bar chart tinggi `h-40`. Warna bar: `#ccff00` (saat dark mode) atau `#10b981` (saat light mode).
4.  **Mini Finance**:
    *   **Style**: `bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-3xl flex justify-between items-center`.
    *   **Konten**: Label "Total Pengeluaran" (kecil) dan Nominal "Rp X.XXX.XXX" (besar).
    *   **Ikon**: `DollarSign` dalam lingkaran transparan `bg-white/10`.

### D. Halaman Ibadah (`/ibadah`)
**Fitur Kunci: Mode Ramadan**
*   **Toggle**: `bg-gray-300` (Off) vs `bg-emerald-500` (On).
*   **Container**: `bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800`.
*   **Efek**: Saat aktif, seluruh aksen warna halaman berubah dari default menjadi Emerald.

**Tab 1: Tracker**
*   **Navigasi Tanggal**: Baris horizontal dengan tanggal di tengah dan panah `ChevronLeft`/`ChevronRight`.
*   **Checklist Sholat**:
    *   Item: `p-4 rounded-2xl border`.
    *   **Belum**: `bg-white border-gray-100`.
    *   **Sudah**: `bg-emerald-500 text-white border-emerald-500`.
    *   Interaksi: Klik mengubah state warna secara instan.
*   **Counter Tilawah**:
    *   Input angka besar di tengah (`text-2xl`).
    *   Tombol `+` dan `-` di sampingnya (`w-10 h-10 rounded-xl bg-gray-100`).
*   **Input Sedekah**: Input field dengan ikon `Heart` (Pink).

**Tab 2: Alat (Tools)**
*   **Jadwal Sholat**:
    *   Card besar `bg-gradient-to-br from-indigo-500 to-purple-600 text-white`.
    *   Menampilkan waktu sholat berikutnya (Next Prayer) dengan hitung mundur.
*   **Pencari Kiblat**:
    *   Lingkaran kompas `w-64 h-64` dengan jarum yang berputar (`rotate` style via framer-motion).
    *   Indikator status: "Menghadap Kiblat" (Hijau) vs "Belum Pas" (Abu-abu).
*   **Target Khatam**:
    *   Card gradient `from-orange-400 to-pink-500`.
    *   Menampilkan "Juz per Hari" yang harus dibaca.

### E. Halaman Produktivitas (`/productivity`)
**Konsep**: Gamifikasi sederhana ("Level Up").

*   **Header**:
    *   Style: `bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg`.
    *   Ikon: `Zap` besar transparan di latar belakang.
*   **Input Cepat**:
    *   Container: `relative`.
    *   Input: `w-full rounded-2xl pl-6 pr-14 py-4`.
    *   Tombol Plus: `absolute right-2 top-2 bottom-2 w-10 bg-blue-500 text-white rounded-xl`.
*   **List Kebiasaan**:
    *   Item: `bg-white p-4 rounded-2xl flex items-center justify-between`.
    *   **Tombol Ceklis**: `w-12 h-12 rounded-xl flex items-center justify-center`.
        *   Belum: `bg-gray-100 text-gray-400`.
        *   Selesai: `bg-blue-500 text-white`.
    *   **Teks**: Dicoret (`line-through`) dan abu-abu jika selesai.

### F. Halaman Keuangan (`/finance`)
**Tab 1: Pengeluaran**
*   **Visualisasi Utama**:
    *   Container: `bg-black text-white p-6 rounded-3xl`.
    *   Chart: `Doughnut` chart di tengah.
*   **Form Input**:
    *   Input Nominal: `text-lg font-bold` dengan prefix "Rp".
    *   Tombol Tambah: `w-full bg-purple-600 text-white py-4 rounded-xl`.
*   **List Transaksi**:
    *   Ikon Kategori: `bg-purple-50 text-purple-600 rounded-full w-10 h-10`.
    *   Nominal: `text-red-500 font-bold` (karena pengeluaran).

**Tab 2: Zakat (Kalkulator)**
*   **Header**: Ikon `Calculator` dalam lingkaran `bg-neon-lime/20`.
*   **Input**: 3 Field (Tabungan, Emas, Hutang) dengan style standar input.
*   **Tombol Hitung**: `bg-black text-white w-full py-4 rounded-xl`.
*   **Output**:
    *   Card hasil: `bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl`.
    *   Teks Nominal: `text-3xl font-bold font-display`.

### G. Halaman Laporan (`/reports`)
*   **Container**: `bg-black text-white p-8 rounded-3xl text-center relative overflow-hidden`.
*   **Ikon Utama**: `FileText` dalam lingkaran `w-20 h-20 bg-white/10`.
*   **Tombol Download**:
    *   Style: `w-full bg-[#ccff00] text-black font-bold py-4 rounded-2xl shadow-lg`.
    *   Ikon: `Download` di kiri teks.
*   **Placeholder**: Bar chart statis dengan opacity rendah (`opacity-50`) di bawahnya.

---

## 6. Fitur Global & UX (Wajib Pixel-Perfect)
1.  **Dark/Light Mode**:
    *   **Toggle**: Tombol bulat `w-10 h-10 bg-gray-100 dark:bg-gray-800` di header.
    *   **Implementasi**: Toggle class `dark` pada tag `<html>`.
2.  **Responsivitas**:
    *   **Mobile Container**: Bungkus seluruh konten dalam `div` dengan class `mobile-container flex flex-col h-screen`.
    *   **Max Width**: Pada desktop, batasi lebar konten utama agar tidak melebar (`max-w-md mx-auto`).
3.  **Menu Overlay**:
    *   **Animasi**: `initial={{ x: '100%' }}` ke `animate={{ x: 0 }}`.
    *   **Background**: `bg-white dark:bg-black` memenuhi layar (`fixed inset-0`).

---

## 7. Kriteria Penilaian (Untuk Mahasiswa)

1.  **Presisi Desain**: Seberapa mirip hasil akhir dengan deskripsi layout di atas.
2.  **Interaktivitas**: Kelancaran animasi transisi antar halaman dan feedback tombol (hover/active states).
3.  **Fungsionalitas**:
    *   Apakah data tersimpan saat di-refresh? (Wajib menggunakan `localStorage`).
    *   Apakah kalkulator zakat menghitung dengan benar?
    *   Apakah kompas kiblat merespons gerakan device?
4.  **Kualitas Kode**: Struktur folder, penamaan variabel, dan penggunaan TypeScript interface yang tepat.

---

*Selamat Mengerjakan! Buatlah aplikasi yang tidak hanya berfungsi, tapi juga menyenangkan untuk digunakan.*
