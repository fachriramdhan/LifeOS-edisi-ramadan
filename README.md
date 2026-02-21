
```markdown
# 🌙 MyLifeOS: Ramadan Edition 
> **Aesthetic Productivity & Islamic Lifestyle Management Web App**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**MyLifeOS** adalah aplikasi manajemen gaya hidup digital yang dirancang khusus untuk Gen Z. Menggabungkan estetika modern (Neon Lime & Black) dengan fitur spiritual, aplikasi ini membantu pengguna menyeimbangkan produktivitas harian dan ibadah, khususnya selama bulan suci Ramadan.



---

## ✨ Fitur Utama

Aplikasi ini dibangun dengan pendekatan **Mobile-First** dan **Pixel-Perfect Design**:

* **🕋 Ibadah Tracker & Ramadan Mode**: Pelacakan sholat, tilawah (counter), dan target khatam dengan transisi warna cerdas (Emerald Mode).
* **⚡ Productivity Hub**: Manajemen tugas harian dengan sistem "Level Up" untuk memotivasi pengguna.
* **💰 Smart Finance & Zakat**: Pencatatan pengeluaran harian dan kalkulator zakat otomatis.
* **🧭 Tool Sholat**: Jadwal sholat real-time dan kompas arah kiblat interaktif.
* **📊 Bento Dashboard**: Visualisasi data konsistensi ibadah menggunakan Chart.js.

---

## 🛠️ Tech Stack & Standar Pengembangan

Proyek ini wajib memenuhi spesifikasi teknis berikut:

| Kategori | Teknologi |
| :--- | :--- |
| **Frontend** | React (Vite) + TypeScript |
| **Styling** | Tailwind CSS (Pure Utility Classes) |
| **Animation** | Framer Motion (Micro-interactions) |
| **Icons** | Lucide React |
| **Data Viz** | Chart.js + React-chartjs-2 |
| **Persistence** | LocalStorage API (Mock Backend) |
| **Date Engine** | Date-fns |

---

## 🎨 Design System

Aplikasi menggunakan palet warna kontras tinggi untuk kesan futuristik:

* **Neon Lime (`#ccff00`)**: Aksen utama untuk energi dan fokus.
* **Deep Black (`#000000`)**: Background utama untuk estetika OLED.
* **Ramadan Emerald (`#10b981`)**: Digunakan saat "Mode Ramadan" aktif.
* **Shapes**: Radius besar (`rounded-3xl`) untuk elemen kartu agar terlihat modern.

---

## 📂 Struktur Proyek

```bash
/src
├── /components      # UI Reusable (Layout, PrayerTimes, Qibla, Zakat)
├── /context         # Global State (Auth & Notifications)
├── /pages           # App Pages (Dashboard, Ibadah, Finance, etc.)
├── /api.ts          # LocalStorage Interceptor
├── App.tsx          # Main Router
└── main.tsx         # Entry Point

```

---

## 🚀 Cara Menjalankan

1. **Clone Repositori**
```bash
git clone [https://github.com/username/mylifeos-ramadan.git](https://github.com/username/mylifeos-ramadan.git)
cd mylifeos-ramadan

```


2. **Instal Dependensi**
```bash
npm install

```


3. **Jalankan Development Server**
```bash
npm run dev

```

---

## 📋 Kriteria Penilaian (QA)

* [ ] **Pixel-Perfect**: Layout sesuai dengan spesifikasi desain bento-grid.
* [ ] **Responsive**: Tampilan sempurna di layar mobile (Max-width: 448px).
* [ ] **State Persistence**: Data tidak hilang saat halaman di-refresh.
* [ ] **Interactive**: Animasi masuk (slide-in/up) pada setiap navigasi halaman.

---

## 📝 Catatan Tugas Akhir

Dokumen ini disusun sebagai panduan teknis pengembangan aplikasi. Mahasiswa diharapkan mengikuti standar folder dan teknologi yang telah ditentukan untuk memastikan skalabilitas dan kebersihan kode.
