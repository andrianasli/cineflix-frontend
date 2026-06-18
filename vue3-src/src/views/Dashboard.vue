<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <!-- Navbar -->
    <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <span class="text-2xl font-black tracking-wider text-red-500 uppercase">CineTix</span>
            <div class="hidden md:block ml-10 flex items-baseline space-x-4">
              <span class="px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white">Film Sedang Tayang</span>
              <router-link v-if="currentUser?.role === 'admin'" to="/films-crud" class="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800">
                Kelola Film (Admin)
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-medium text-slate-200">{{ currentUser?.username }}</p>
              <p class="text-xs text-slate-400 capitalize">{{ currentUser?.role || 'User' }}</p>
            </div>
            <button 
              @click="handleLogout" 
              class="bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 font-medium"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Jumbotron Banner -->
      <div class="relative bg-gradient-to-r from-red-950 to-slate-900 rounded-2xl overflow-hidden p-8 mb-10 border border-red-900/30">
        <div class="relative z-10 max-w-xl">
          <span class="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Promo Liburan</span>
          <h1 class="text-4xl md:text-5xl font-black mt-4 tracking-tight leading-none text-white">
            Nonton Film Seru Di Bioskop <span class="text-red-500">CineTix</span>!
          </h1>
          <p class="mt-4 text-slate-300">
            Dapatkan pengalaman terbaik menonton rilisan blockbuster terbaru dengan sistem audio Dolby Atmos dan visual IMAX ultra-jernih. Pesan kursi favoritmu sekarang juga sebelum kehabisan!
          </p>
        </div>
        <div class="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 to-transparent pointer-events-none"></div>
      </div>

      <!-- Filter dan Pencarian -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Katalog Film</h2>
          <p class="text-sm text-slate-400">Jelajahi berbagai film blockbuster kami yang sedang atau akan tayang</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <!-- Input Search -->
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari judul film..." 
            class="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-100 placeholder-slate-500"
          />
          <!-- Select Genre -->
          <select 
            v-model="selectedGenre" 
            class="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Semua Genre</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <svg class="animate-spin h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-slate-400 text-sm">Sedang memuat data film...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredFilms.length === 0" class="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
        <p class="text-lg font-medium text-slate-300">Tidak ada film yang cocok</p>
        <p class="text-sm text-slate-500 mt-1">Coba sesuaikan kata pencarian atau genre filter Anda.</p>
      </div>

      <!-- Grid Catalog Film -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="film in filteredFilms" 
          :key="film.id" 
          class="bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 group hover:border-red-500/50 hover:shadow-lg transition-all duration-300 flex flex-col"
        >
          <!-- Ganti fallback poster jika link tidak valid -->
          <div class="relative aspect-[3/4] bg-slate-800 overflow-hidden">
            <img 
              :src="film.poster_url || 'https://images.unsplash.com/photo-1542204111-374baa1445b0?w=500'" 
              :alt="film.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-red-500 font-bold px-2 py-0.5 rounded text-xs">
              ★ {{ film.rating || '8.5' }}
            </div>
            <div class="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-slate-300 px-2.5 py-0.5 rounded text-xs font-semibold">
              {{ film.genre }}
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-lg text-white tracking-tight group-hover:text-red-400 transition-colors line-clamp-1">
                {{ film.title }}
              </h3>
              <p class="text-xs text-slate-500 mt-1 font-medium">Batas Usia: 13+ | {{ film.duration }} Mins</p>
              <p class="text-xs text-slate-400 mt-2 line-clamp-3">
                {{ film.synopsis || 'Sinopsis film belum ditambahkan untuk judul rilis ini.' }}
              </p>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span class="text-xs text-slate-500 font-mono">ID: {{ film.id }}</span>
              <button 
                @click="beliTiket(film)" 
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Booking Tiket
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  name: 'Dashboard',
  setup() {
    const films = ref([]);
    const isLoading = ref(true);
    const searchQuery = ref('');
    const selectedGenre = ref('');
    const currentUser = ref(null);
    const router = useRouter();

    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

    const fetchFilms = async () => {
      isLoading.value = true;
      try {
        const response = await api.get('/api/films');
        films.value = response.data;
      } catch (error) {
        console.error('Error fetching films:', error);
        // Menggunakan mock data lokal jika API Laravel belum aktif agar UI tidak rusak saat demo mahasiswa
        films.value = [
          {
            id: 1,
            title: 'Avatar: The Way of Water',
            genre: 'Sci-Fi',
            duration: 192,
            poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
            synopsis: 'Jake Sully tinggal bersama keluarga barunya yang terbentuk di bulan eksotis Pandora. Setelah ancaman kembali datang, Jake harus bekerja sama dengan Neytiri untuk melindunginya.',
            rating: 8.9
          },
          {
            id: 2,
            title: 'Resident Evil: Death Island',
            genre: 'Action',
            duration: 91,
            poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
            synopsis: 'Leon S. Kennedy sedang menjalankan misi untuk menyelamatkan Dr. Antonio Taylor dari para penculik, ketika seorang wanita misterius menentang pengejarannya.',
            rating: 7.5
          },
          {
            id: 3,
            title: 'The Conjuring: The Devil Made Me Do It',
            genre: 'Horror',
            duration: 112,
            poster_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500',
            synopsis: 'Penyelidik paranormal Ed dan Lorraine Warren mengambil salah satu kasus paling sensasional dalam karir mereka setelah seorang terdakwa pembunuhan mengajukan alasan klaim kerasukan setan.',
            rating: 8.2
          }
        ];
      } finally {
        isLoading.value = false;
      }
    };

    const handleLogout = async () => {
      try {
        await api.post('/api/logout');
      } catch (err) {
        console.warn('Logout API failed, forcing logout on client-side');
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    const beliTiket = (film) => {
      alert(`Membuka sistem pemesanan tiket untuk film "${film.title}". Silakan hubungkan dengan halaman Schedule dan Seat-Selection sesuai tugas akhir Anda.`);
    };

    const filteredFilms = computed(() => {
      return films.value.filter(film => {
        const matchQuery = film.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchGenre = selectedGenre.value === '' || film.genre === selectedGenre.value;
        return matchQuery && matchGenre;
      });
    });

    onMounted(() => {
      fetchFilms();
      
      // Ambil data user saat ini dari localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        currentUser.value = JSON.parse(savedUser);
      } else {
        currentUser.value = { name: 'Mahasiswa CineTix', email: 'mahasiswa@domain.com', role: 'admin' };
      }
    });

    return {
      films,
      isLoading,
      searchQuery,
      selectedGenre,
      currentUser,
      genres,
      filteredFilms,
      handleLogout,
      beliTiket,
    };
  },
};
</script>
