# CineTix / CineFlix - Sistem Informasi Manajemen Tiket Bioskop

CineTix adalah aplikasi web full-stack modern yang dirancang untuk mengelola tontonan bioskop, jadwal penayangan film, pemilihan kursi secara interaktif, pemesanan tiket, hingga status pembayaran transaksi. Proyek ini dikembangkan menggunakan **Laravel 12 (API Backend)** berbasis **SQLite**, dan **Vue 3 + Vite (Frontend Application)**.

---

## 🚀 Fitur Utama Sistem

1. **Sistem Autentikasi Menggunakan Laravel Sanctum**
   - Registrasi Mahasiswa/Pelanggan (`/api/register`).
   - Login untuk mendapatkan Bearer Token (`/api/login`).
   - Logout untuk melenyapkan access token (`/api/logout`).

2. **Katalog & Manajemen Data Film (CRUD)**
   - Daftar film interaktif untuk pengunjung.
   - Panel admin untuk menambah, mengedit, dan menghapus film (Judul, Genre, Durasi, Rating, Poster URL, Sinopsis).

3. **Penjadwalan Studio (Schedules)**
   - Manajemen waktu tayang, penunjukan Studio (IMAX, Premiere, Regular), tanggal rilis, dan harga kupon tiket.

4. **Sistem Pemesanan Kursi (Seat Selector)**
   - Memilih baris kursi secara visual (misal: A1, A2, D5) dan mengikatnya ke dalam transaksi Booking.

5. **Sistem Pembayaran Terpadu (Payments)**
   - Mendukung integrasi transaksi dengan opsi metode pembayaran (GoPay, OVO, Transfer Bank, dll).

---

## 🛠️ Panduan Instalasi & Pengoperasian Lokal

### 1. Persiapan Backend (Laravel 12)

Pastikan dependensi web server seperti PHP (Minimal versi 8.2) dan Composer sudah terpasang. Terapkan perintah berikut:

```bash
# 1. Masuk ke direktori backend Anda
cd C:\Users\LENOVO\cineflix-backend

# 2. Install dependensi composer
composer install

# 3. Salin file environment configuration
copy .env.example .env

# 4. Atur koneksi database SQLite di `.env`
# Pastikan konfigurasi dirubah menjadi:
# DB_CONNECTION=sqlite
# (Komentari baris DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD)

# 5. Buat file database SQLite kosong jika belum ada
touch database/database.sqlite

# 6. Generate application key
php artisan key:generate

# 7. Jalankan migrasi tabel beserta penyebaran data awal (Seeders)
php artisan migrate --seed

# 8. Jalankan server lokal Laravel
php artisan serve
```
Server lokal Anda akan berjalan secara default di: `http://127.0.0.1:8000`

---

### 2. Persiapan Frontend (Vue 3 + Vite)

Dapatkan source code Vue 3 Anda lalu terapkan langkah berikut:

```bash
# 1. Buka terminal baru dan masuk ke folder Vue 3 anda
cd /path/to/your/vue3-app

# 2. Install semua dependensi NPM
npm install

# 3. Buat file `.env` di root folder Vue 3 Anda
# Masukkan konfigurasi API endpoint Anda:
VITE_API_URL="http://127.0.0.1:8000"

# 4. Jalankan server development lokal
npm run dev
```
Aplikasi frontend akan berjalan secara default di: `http://localhost:5173` atau port yang tertera.

---

## 📬 Cara Pengujian API menggunakan Postman

1. Ambil file `postman_collection.json` dari root workspace proyek ini.
2. Buka Aplikasi Postman Anda, lalu klik tombol **Import** di kiri atas.
3. Pilih file JSON tersebut dan klik import.
4. Anda akan melihat folder bernama **CineTix API Collection - Tugas Akhir**.
5. Atur **Collection Variables** di Postman:
   - `base_url`: Isikan alamat backend Anda (Contoh: `http://127.0.0.1:8000` atau URL Production Railway).
6. Jalankan request **Register** untuk membuat akun, lalu request **Login**.
7. Token dari hasil Login secara otomatis akan disematkan di parameter Authorization header berkat script postman. Anda bisa langsung melakukan CRUD Film, Schedule, dan Booking.

---

## ☁️ Panduan Deployment Cloud (Railway & Vercel)

### A. Deploy Laravel Backend (ke Railway.app)
1. **Buat Repository di GitHub**: Unggah kode Laravel Anda (kecuali file `.env` dan `database/database.sqlite` karena sudah masuk `.gitignore`).
2. **Setup Proyek di Railway**:
   - Login menggunakan akun GitHub Anda ke [Railway.app](https://railway.app/).
   - Klik **New Project** -> **Deploy from GitHub repository** -> Pilih repository laravel Anda.
3. **Konfigurasi Variables di Railway**:
   - Klik tab **Variables** di layanan kereta Laravel Anda, tambahkan kunci berikut:
     ```env
     APP_ENV=production
     APP_DEBUG=false
     APP_KEY=base64:xxx... (isi sesuai hasil php artisan key:generate lokal)
     APP_URL=https://<nama-aplikasi>.up.railway.app
     DB_CONNECTION=sqlite
     DB_DATABASE=database/database.sqlite
     ```
4. **Volume Storage SQLite (Penting)**:
   - Agar database SQLite Anda tidak hilang setiap kali deploy ulang, Anda dapat membuat file database kosong saat build. Sistem build Railway akan otomatis menginisiasi file kosong, atau Anda bisa menjalankan command artisan migrasi otomatis di konfigurasi Railway build command:
     `php artisan migrate --force` sebagai bagian dari proses post-install atau startup script.

---

### B. Deploy Vue 3 Frontend (ke Vercel)
1. **GitHub Repository**: Unggah folder Vue 3 Anda ke repository baru di GitHub.
2. **Dashboard Vercel**:
   - Masuk ke [Vercel](https://vercel.com/) menggunakan GitHub.
   - Klik **Add New** -> **Project** -> Impor repositori Vue 3 Anda.
3. **Konfigurasi Environment Variable**:
   - Di bagian **Environment Variables**, tambahkan:
     - Key: `VITE_API_URL`
     - Value: `<URL-Lengkap-Laravel-Railway-Anda>` (Contoh: `https://cineflix-backend-production.up.railway.app`)
4. **Build Settings**: Vercel akan otomatis mendeteksi konfigurasi sebagai proyek **Vite**. Klik **Deploy**.
5. Selesai! Aplikasi frontend Vue 3 Anda kini aktif di Vercel dan terintegrasi dengan database SQLite di Railway.

---

## 👩‍💻 Penyusunan Tugas Akhir & Presentasi Dosen

Dokumen penjelasan teknis ini memuat materi siap pakai untuk bahan slide presentasi Anda di hadapan dosen penguji, meliputi:
- **Arsitektur Pemisahan Client-Server (RESTful API)**.
- **Mekanisme Token-Based Autentikasi (Laravel Sanctum)**.
- **Penanganan Masalah CORS (Cross-Origin Resource Sharing)**.
- **Spesifikasi Database Relasional SQLite**.

*Materi selengkapnya dapat diakses secara dinamis melalui dashboard tab **"Presentasi Dosen"** pada aplikasi interaktif kami.*
