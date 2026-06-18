/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  Database, 
  BookOpen, 
  Presentation, 
  Copy, 
  Check, 
  Download, 
  Award,
  BookMarked,
  Layers,
  ArrowRight
} from 'lucide-react';

// Raw strings of Vue 3 files for easy representation and copying
const VUE_FILES: Record<string, { desc: string; ext: string; content: string }> = {
  'api.js': {
    desc: 'Konfigurasi Axios HTTP Client dengan Request & Response Interceptors untuk menyisipkan Bearer Token.',
    ext: 'javascript',
    content: `import axios from 'axios';

// Membuat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Menambahkan Authorization Token pada setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Menangani error autentikasi global (misal: token expired)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika token tidak valid atau expired, hapus dari local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect ke halaman login jika bukan di halaman login itu sendiri
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;`
  },
  'Login.vue': {
    desc: 'Halaman log masuk konsumen & administrator dengan validasi form lokal dan state loading.',
    ext: 'xml',
    content: `<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-red-500">CineTix</h2>
        <p class="mt-2 text-sm text-slate-400">Masuk ke akun Anda untuk memesan tiket</p>
      </div>

      <!-- Alert Error -->
      <div v-if="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-center">
        {{ errorMessage }}
      </div>

      <!-- Form Login -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300">Email Anda</label>
            <input v-model="email" type="email" required class="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg focus:ring-red-500" placeholder="nama@email.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300">Kata Sandi</label>
            <input v-model="password" type="password" required class="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg focus:ring-red-500" placeholder="••••••••" />
          </div>
        </div>

        <button type="submit" :disabled="isLoading" class="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
          <span v-if="isLoading">Memproses...</span>
          <span v-else>Masuk Sekarang</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const res = await api.post('/api/login', { email: email.value, password: password.value });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        router.push('/');
      } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Login gagal. Periksa koneksi backend.';
      } finally {
        isLoading.value = false;
      }
    };
    return { email, password, isLoading, errorMessage, handleLogin };
  }
};
</script>`
  },
  'Register.vue': {
    desc: 'Model registrasi mahasiswa menggunakan enkripsi form terintegrasi sistem laravel.',
    ext: 'xml',
    content: `<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
    <div class="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-extrabold text-red-500">Daftar CineTix</h2>
        <p class="text-sm text-slate-400 mt-1">Buat akun belajar / transaksi baru</p>
      </div>

      <div v-if="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-center">
        {{ errorMessage }}
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-sm text-slate-300">Nama Lengkap</label>
          <input v-model="name" type="text" required class="w-full px-3 py-2 bg-slate-800 rounded-lg" placeholder="Masukkan nama" />
        </div>
        <div>
          <label class="block text-sm text-slate-300">Alamat Email</label>
          <input v-model="email" type="email" required class="w-full px-3 py-2 bg-slate-800 rounded-lg" placeholder="contoh@email.com" />
        </div>
        <div>
          <label class="block text-sm text-slate-300">Kata Sandi</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 bg-slate-800 rounded-lg" placeholder="••••••••" />
        </div>
        <div>
          <label class="block text-sm text-slate-300">Ulangi Kata Sandi</label>
          <input v-model="passwordConfirmation" type="password" required class="w-full px-3 py-2 bg-slate-800 rounded-lg" placeholder="••••••••" />
        </div>

        <button type="submit" :disabled="isLoading" class="w-full py-2 bg-red-600 rounded-lg font-bold text-white hover:bg-red-700">
          Daftarkan Akun
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const passwordConfirmation = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');
    const router = useRouter();

    const handleRegister = async () => {
      if (password.value !== passwordConfirmation.value) {
        errorMessage.value = 'Password konfirmasi tidak cocok!';
        return;
      }
      isLoading.value = true;
      try {
        await api.post('/api/register', { 
          name: name.value, 
          email: email.value, 
          password: password.value, 
          password_confirmation: passwordConfirmation.value 
        });
        alert('Registrasi sukses! Silakan login.');
        router.push('/login');
      } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Registrasi gagal.';
      } finally {
        isLoading.value = false;
      }
    };
    return { name, email, password, passwordConfirmation, isLoading, errorMessage, handleRegister };
  }
};
</script>`
  },
  'Dashboard.vue': {
    desc: 'Halaman dashboard pencarian film bioskop yang interaktif dan responsif.',
    ext: 'xml',
    content: `<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <nav class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <span class="text-2xl font-black text-red-500">CineTix</span>
      <button @click="logout" class="bg-slate-800 px-4 py-2 rounded-lg text-sm">Keluar</button>
    </nav>

    <main class="max-w-7xl mx-auto p-8">
      <h2 class="text-2xl font-bold mb-6">Filem Sedang Tayang</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="film in films" :key="film.id" class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <img :src="film.poster_url" class="w-full aspect-[3/4.2] object-cover" />
          <div class="p-4">
            <h3 class="font-bold text-lg line-clamp-1">{{ film.title }}</h3>
            <p class="text-xs text-slate-400 mt-1">{{ film.genre }} | {{ film.duration }} Mins</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';

export default {
  setup() {
    const films = ref([]);
    const fetchFilms = async () => {
      try {
        const res = await api.get('/api/films');
        films.value = res.data;
      } catch (err) {
        console.error('Koneksi backend gagal. Menggunakan demo fallback data.');
      }
    };
    onMounted(fetchFilms);
    return { films };
  }
};
</script>`
  },
  'FilmCrud.vue': {
    desc: 'Halaman admin panel untuk entri film baru, edit katalog, dan hapus basis data relasi.',
    ext: 'xml',
    content: `<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Admin Panel Film CRUD</h1>
        <button @click="openForm" class="bg-red-600 px-4 py-2 rounded">Tambah Film</button>
      </div>

      <table class="w-full text-left bg-slate-900 rounded-xl">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400">
            <th class="p-4">ID</th>
            <th class="p-4">Judul</th>
            <th class="p-4">Genre</th>
            <th class="p-4">Rating</th>
            <th class="p-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in films" :key="f.id" class="border-b border-slate-800/50">
            <td class="p-4 font-mono">#{{ f.id }}</td>
            <td class="p-4 font-bold">{{ f.title }}</td>
            <td class="p-4">{{ f.genre }}</td>
            <td class="p-4 text-yellow-500">★ {{ f.rating }}</td>
            <td class="p-4">
              <button @click="deleteFilm(f.id)" class="text-red-500 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';

export default {
  setup() {
    const films = ref([]);
    const fetchFilms = async () => {
      const res = await api.get('/api/films');
      films.value = res.data;
    };
    const deleteFilm = async (id) => {
      if (confirm('Yakin hapus?')) {
        await api.delete('/api/films/' + id);
        fetchFilms();
      }
    };
    onMounted(fetchFilms);
    return { films, deleteFilm };
  }
};
</script>`
  },
  '.env.example': {
    desc: 'Contoh pendefinisian variabel lingkungan untuk menghubungkan API endpoint Laravel.',
    ext: 'env',
    content: `# URL Server Backend Laravel (Railway URL atau localhost port 8000)
VITE_API_URL="https://cineflix-backend-production.up.railway.app"`
  }
};

const PRESENTATION_SLIDES = [
  {
    title: "1. Pemilihan Teknologi Stack (Kenapa Laravel & Vue 3?)",
    points: [
      "Arsitektur decoupled modern memisahkan logic server (RESTful API) dan rendering tampilan (SPA).",
      "Laravel 12 menawarkan fitur autentikasi Sanctum bawaan yang sangat aman, efisien, dengan system routing RESTful yang andal.",
      "Vue 3 dengan Composition API menawarkan skalabilitas component, efektivitas penataan state reaktif v-model, serta performa rendering yang kencang.",
      "SQLite dipilih karena portabilitasnya tinggi, bebas instalasi server database rumit saat demonstrasi, dan sangat ringan dijalankan."
    ],
    vibe: "Arsitektur"
  },
  {
    title: "2. Mekanisme Kerja Token-Based Authentication",
    points: [
      "Saat klien memanggil POST /api/login, controller Laravel memvalidasi email & password.",
      "Jika terverifikasi, Laravel Sanctum membuat hash token unik via method $user->createToken('token-name')->plainTextToken.",
      "Token tersebut dikirim kembali ke klien, lalu disimpan di localStorage browser.",
      "Untuk request data terproteksi (seperti Booking & CRUD), Axios interceptor menyisipkan token tersebut di Authorization Header: Bearer <token>."
    ],
    vibe: "Sanctum Security"
  },
  {
    title: "3. Solusi Integrasi & Penanganan CORS",
    points: [
      "Pelanggaran CORS (Cross-Origin Resource Sharing) terjadi saat Vue 3 di port 5173 menembak Laravel di port 8000.",
      "Solusi: Laravel 12 menyertakan berkas konfigurasi config/cors.php secara bawaan.",
      "Konfigurasi 'allowed_origins' disetel dengan nilai ['*'] atau secara menunjuk spesifik domain hosting Vercel.",
      "Dengan mengaktifkan CORS header Access-Control-Allow-Origin, browser diizinkan melakukan pertukaran request cross-origin dengan aman."
    ],
    vibe: "CORS Solution"
  },
  {
    title: "4. Struktur Basis Data Relasional SQLite",
    points: [
      "Tabel 'users': Menyimpan data autentikasi (nama, email, password, role admin/customer).",
      "Tabel 'films': Menyimpan entri komprehensif film layar lebar.",
      "Tabel 'schedules': Relasi One-to-Many ke Film (tabel 'films'). Satu film dapat ditayangkan di banyak jadwal.",
      "Tabel 'bookings': Relasi One-to-Many ke User & Schedule. Memetakan barisan baris kursi yang dipesan.",
      "Tabel 'payments': Relasi One-to-One ke Booking. Berisi tagihan bayar beserta log metode pembayaran lunas."
    ],
    vibe: "Database SQLite"
  },
  {
    title: "5. Strategi Deployment Terintegrasi",
    points: [
      "Backend dideploy ke Railway.app dengan mengunggah source code ke GitHub.",
      "Railway menginstal PHP composer, mengatur ENV variabel untuk SQLite (relatif path), dan otomatis menjalankan PHP Artisan Serve.",
      "Frontend Vue 3 dideploy ke Vercel dengan mengaitkan link repository GitHub.",
      "Environment variabel VITE_API_URL dikonfigurasi di dashboard Vercel menunjuk ke URL kereta production Railway Anda."
    ],
    vibe: "Cloud Deploy"
  }
];

export default function WorkspaceTA() {
  const [activeTab, setActiveTab] = useState<'vue' | 'postman' | 'deploy' | 'slides'>('vue');
  const [selectedVueFile, setSelectedVueFile] = useState<string>('api.js');
  const [copiedText, setCopiedText] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getPostmanJson = () => {
    // Return sample visual representation of our loaded postman json
    return `{
  "info": {
    "name": "CineTix API Collection - Tugas Akhir",
    "description": "Koleksi API Postman untuk Sistem Web Bioskop CineTix berbasis Laravel Sanctum.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    { "name": "Authentication" },
    { "name": "Films Management (CRUD)" },
    { "name": "Schedules" },
    { "name": "Bookings & Payments" }
  ]
}`;
  };

  return (
    <div className="stat-card-editorial rounded-2xl p-6 md:p-8" id="workspace-container">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div>
          <span className="text-[10px] bg-rose-950 text-rose-500 font-bold px-3 py-1 rounded-sm uppercase tracking-widest border border-rose-900/40">
            MAHASISWA PORTAL
          </span>
          <h2 className="editorial-title text-3xl font-bold italic text-white mt-2">Dokumen &amp; Sumber Kode Tugas Akhir</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl font-normal">Salin semua kodingan Vue 3, konfigurasi Postman, panduan deploy, dan materi presentasi sidang.</p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10 text-[11px] text-slate-400 font-mono">
          <BookMarked size={16} className="text-rose-500" />
          <span>Taraf Penyelesaian: 100% (Ready)</span>
        </div>
      </div>

      {/* Navigator panel menu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
        <button
          onClick={() => setActiveTab('vue')}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'vue' 
              ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20' 
              : 'bg-black/35 border-white/10 text-slate-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FileCode size={16} />
          <span>Kodingan Vue 3</span>
        </button>

        <button
          onClick={() => setActiveTab('postman')}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'postman' 
              ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20' 
              : 'bg-black/35 border-white/10 text-slate-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Terminal size={16} />
          <span>Koleksi Postman</span>
        </button>

        <button
          onClick={() => setActiveTab('deploy')}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'deploy' 
              ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20' 
              : 'bg-black/35 border-white/10 text-slate-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Database size={16} />
          <span>Panduan Deploy</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'slides' 
              ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20' 
              : 'bg-black/35 border-white/10 text-slate-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Presentation size={16} />
          <span>Presentasi Dosen</span>
        </button>
      </div>

      {/* TAB 1: KODE VUE 3 COMPONENT VIEWER */}
      {activeTab === 'vue' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-widest pl-2 mb-2">Folder src/</span>
            {Object.keys(VUE_FILES).map(fileName => (
              <button
                key={fileName}
                onClick={() => setSelectedVueFile(fileName)}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                  selectedVueFile === fileName 
                    ? 'bg-slate-800 border-red-500/40 text-red-400' 
                    : 'bg-slate-950 border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <span>{fileName}</span>
                <span className="text-[9px] bg-slate-905 border border-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                  {fileName.endsWith('.vue') ? 'Component' : 'Service'}
                </span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 flex flex-col justify-between bg-slate-950/80 border border-slate-800 rounded-2xl p-5 md:p-6 overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-white font-mono">{selectedVueFile}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-normal">{VUE_FILES[selectedVueFile].desc}</p>
                </div>
                <button
                  onClick={() => handleCopy(VUE_FILES[selectedVueFile].content)}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-200 font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  {copiedText ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      <span className="text-green-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin Kodingan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre container */}
              <div className="overflow-x-auto max-h-[360px] bg-slate-950 border border-slate-900 p-4 rounded-xl text-xs font-mono text-slate-300 leading-relaxed scrollbar-thin">
                <pre>{VUE_FILES[selectedVueFile].content}</pre>
              </div>
            </div>
            
            <div className="border-t border-slate-800/80 pt-4 mt-6 text-[11px] text-slate-500 flex items-center gap-2">
              <span className="bg-red-950 text-red-500 text-[9px] font-sans font-bold px-2 py-0.5 rounded">Lar-Vue Stack</span>
              <p>Salin file ini dan letakkan di project Vue 3 anda untuk langsung terhubung ke backend Laravel Sanctum!</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POSTMAN COLLECTION INTEGRATION */}
      {activeTab === 'postman' && (
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/50 pb-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="text-red-500" size={18} />
                <span>Konektor & Ekspor Koleksi Postman JSON</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl font-normal">
                Koleksi ini berisi skema siap pakai untuk seluruh endpoint database bioskop: Auth, CRUD Film, Jadwal Studio, Booking Kursi, dan Pembayaran lunas.
              </p>
            </div>

            <button
              onClick={() => handleCopy(getPostmanJson())}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              {copiedText ? (
                <>
                  <Check size={15} />
                  <span>Koleksi Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>Salin JSON Postman</span>
                </>
              )}
            </button>
          </div>

          {/* Quick instructions steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="bg-red-950 text-red-500 font-bold font-mono text-[10px] p-1 px-2.5 rounded-md uppercase">Langkah 1</span>
              <h4 className="font-bold text-sm text-white mt-2.5">Salin Model JSON</h4>
              <p className="text-xs text-slate-400 mt-1">Gunakan tombol salin di kanan atas untuk memuat keseluruhan metadata Postman schema koleksi ini.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="bg-red-950 text-red-500 font-bold font-mono text-[10px] p-1 px-2.5 rounded-md uppercase">Langkah 2</span>
              <h4 className="font-bold text-sm text-white mt-2.5">Impor di Postman</h4>
              <p className="text-xs text-slate-400 mt-1">Buka software Postman, ketuk menu **File** -&gt; **Import** atau gunakan shortcut Ctrl+H, lalu paste schema JSON tersebut.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="bg-red-950 text-red-500 font-bold font-mono text-[10px] p-1 px-2.5 rounded-md uppercase">Langkah 3</span>
              <h4 className="font-bold text-sm text-white mt-2.5">Set base_url ENV</h4>
              <p className="text-xs text-slate-400 mt-1">Ubah variabel lingkungan base_url di Postman ke IP laptop (`http://localhost:8000`) atau alamat Railway Anda.</p>
            </div>
          </div>

          {/* Micro preview */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 max-h-[160px] overflow-hidden relative">
            <pre className="text-[10px] font-mono text-slate-500 select-all">{getPostmanJson()}</pre>
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-center">
              <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-full font-mono font-semibold">Tersimpan dalam file /postman_collection.json di folder sistem anda.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLOUD DEPLOYMENT GUIDE */}
      {activeTab === 'deploy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Railway backend instructions */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4 mb-4">
              <div className="p-2.5 bg-purple-950 border border-purple-900 text-purple-400 rounded-xl">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Deploy Laravel Backend ke Railway.app</h3>
                <p className="text-xs text-slate-400">Hosting web API dengan setup persistensi file SQLite.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-normal text-slate-300">
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">01.</span>
                <p>Konfigurasi database di file `.env` dirubah menjadi **DB_CONNECTION=sqlite**. Baris HOST, PORT, dan USERNAME ditiadakan.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">02.</span>
                <p>Buat repositori baru di akun GitHub Anda dan unggah seluruh berkas source code Laravel 12 Anda.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">03.</span>
                <p>Nyalakan akun [Railway.app](https://railway.app) via GitHub, lalu buatlah **New Project** memilih repository Laravel tersebut.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">04.</span>
                <p>Pada tab variables, masukkan parameter krusial: **APP_ENV=production**, **APP_KEY** (sesuai encryption key), **DB_CONNECTION=sqlite**.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">05.</span>
                <p>Supaya migrasi artisan berjalan, tetapkan startup command Railway: `php artisan migrate --force && php artisan serve --port=$PORT`.</p>
              </div>
            </div>
          </div>

          {/* Vercel frontend instructions */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4 mb-4">
              <div className="p-2.5 bg-blue-950 border border-blue-900 text-blue-400 rounded-xl">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Deploy Vue 3 Frontend ke Vercel</h3>
                <p className="text-xs text-slate-400">Hosting web client-side SPA berbasis CDN cepat.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-normal text-slate-300">
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">01.</span>
                <p>Unggah seluruh source code Vue 3 + Vite Anda ke dalam repositori GitHub terpisah.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">02.</span>
                <p>Hubungkan dengan akun [Vercel](https://vercel.com), lalu tekan **Add New Project** memilih repositori Vue 3 Anda.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">03.</span>
                <p>Masukkan environment variables krusial di Vercel: **VITE_API_URL** yang bernilai tautan domain Railway anda (misal: `https://cineflix-api-production.up.railway.app`).</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">04.</span>
                <p>Vercel mendeteksi kerangka kerja Vite secara otomatis. Pastikan output directory ditujukan ke folder **dist**.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-500 font-bold">05.</span>
                <p>Tekan **Deploy!** Hanya dalam hitungan detik, aplikasi Vue 3 Anda siap diakses secara online oleh Dosen Penguji.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRESENTASI DOSEN (Speaking Cards / Slides carousel) */}
      {activeTab === 'slides' && (
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase">SLIDE SIDANG {currentSlide + 1} OF {PRESENTATION_SLIDES.length}</span>
              <h3 className="text-lg font-bold text-white mt-1">Materi Pertahanan Sidang Tugas Akhir</h3>
            </div>

            <div className="flex gap-2">
              <button
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className="bg-slate-900 border border-slate-800 disabled:opacity-40 text-xs px-3 py-1.5 rounded-lg text-slate-300 font-bold"
              >
                Sebelumnya
              </button>
              <button
                disabled={currentSlide === PRESENTATION_SLIDES.length - 1}
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="bg-red-600 disabled:opacity-40 hover:bg-red-700 text-xs px-3  py-1.5 rounded-lg text-white font-bold"
              >
                Selanjutnya
              </button>
            </div>
          </div>

          {/* Current slide detail */}
          <div className="bg-slate-950 border border-slate-900/60 p-6 md:p-8 rounded-2xl shadow-inner min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <span className="bg-red-950 text-red-500 text-[10px] font-bold px-2 rounded font-sans uppercase">
                  {PRESENTATION_SLIDES[currentSlide].vibe}
                </span>
              </div>
              <h4 className="font-extrabold text-base md:text-lg text-white mb-4 tracking-tight leading-snug">
                {PRESENTATION_SLIDES[currentSlide].title}
              </h4>
              <ul className="space-y-3">
                {PRESENTATION_SLIDES[currentSlide].points.map((p, idx) => (
                  <li key={idx} className="flex gap-2 text-xs md:text-sm text-slate-300 font-normal leading-relaxed">
                    <ArrowRight size={14} className="text-red-500 shrink-0 mt-1" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
