<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Back Button & Nav -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <router-link to="/" class="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300 font-medium flex items-center gap-2">
            ← Kembali ke Dashboard
          </router-link>
          <div>
            <h1 class="text-3xl font-black text-white tracking-tight">Manajemen Katalog Film</h1>
            <p class="text-sm text-slate-400">Panel Administrator CineTix untuk Kelola Rilis Film Bioskop</p>
          </div>
        </div>

        <button 
          @click="openAddModal" 
          class="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all"
        >
          + Tambah Film Baru
        </button>
      </div>

      <!-- Alert Status -->
      <div v-if="alertMessage" :class="alertClass" class="mb-6 p-4 rounded-lg border text-sm text-center">
        {{ alertMessage }}
      </div>

      <!-- Form Dialog Modal (Tambah/Edit) -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
          <!-- Modal Header -->
          <div class="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-900/50">
            <h2 class="text-xl font-bold text-white">{{ isEditing ? 'Edit Data Film' : 'Tambah Film Baru' }}</h2>
            <button @click="showModal = false" class="text-slate-400 hover:text-white text-2xl font-light">×</button>
          </div>

          <!-- Modal Body Form -->
          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Judul Film</label>
                <input 
                  v-model="form.title" 
                  type="text" 
                  required 
                  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Misal: Spiderman No Way Home"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Genre</label>
                <select 
                  v-model="form.genre" 
                  required 
                  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Durasi (Menit)</label>
                <input 
                  v-model.number="form.duration" 
                  type="number" 
                  required 
                  min="1"
                  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Format menit (contoh: 120)"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Rating ★ (Skala 1 - 10)</label>
                <input 
                  v-model.number="form.rating" 
                  type="number" 
                  step="0.1" 
                  min="1" 
                  max="10" 
                  required 
                  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Contoh: 8.5"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Link URL Poster Film</label>
              <input 
                v-model="form.poster_url" 
                type="url" 
                required 
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://domain.com/path-ke-gambar.jpg"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Sinopsis Lengkap</label>
              <textarea 
                v-model="form.synopsis" 
                rows="4" 
                required 
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Cerita singkat atau alur sinopsis film..."
              ></textarea>
            </div>

            <!-- Modal Actions -->
            <div class="border-t border-slate-800 pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                @click="showModal = false" 
                class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm px-4 py-2 rounded-lg transition-all"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="isLoading" 
                class="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all"
              >
                {{ isLoading ? 'Menyimpan...' : 'Simpan Data' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isFetching" class="flex flex-col items-center justify-center py-20">
        <svg class="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-slate-400 text-xs mt-3">Mengambil data film dari backend...</p>
      </div>

      <!-- Grid/Table List Film -->
      <div v-else>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-900 border-b border-slate-800">
                  <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Poster & ID</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Judul Film</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Genre</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Durasi</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                <tr v-for="film in films" :key="film.id" class="hover:bg-slate-800/30 transition-all">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img :src="film.poster_url" alt="" class="w-10 h-14 rounded object-cover bg-slate-800" />
                      <span class="text-xs font-mono text-slate-500">#{{ film.id }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-bold text-slate-100">{{ film.title }}</td>
                  <td class="px-6 py-4 text-sm text-slate-300">
                    <span class="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-0.5 rounded-full">
                      {{ film.genre }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-300 font-mono">{{ film.duration }} Mins</td>
                  <td class="px-6 py-4 text-yellow-500 font-semibold text-sm">★ {{ film.rating }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button 
                        @click="editFilm(film)" 
                        class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        @click="deleteFilm(film.id)" 
                        class="bg-red-950 hover:bg-red-600/20 text-red-400 hover:text-white border border-red-900/50 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Row Empty -->
                <tr v-if="films.length === 0">
                  <td colspan="6" class="text-center py-12 text-slate-500 text-sm">
                    Katalog film masih kosong. Silakan tambahkan film pertama Anda!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  name: 'FilmCrud',
  setup() {
    const router = useRouter();
    const films = ref([]);
    const isFetching = ref(true);
    const isLoading = ref(false);
    const showModal = ref(false);
    const isEditing = ref(false);
    const editId = ref(null);

    const alertMessage = ref('');
    const alertClass = ref('');

    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

    const form = ref({
      title: '',
      genre: 'Action',
      duration: 120,
      poster_url: '',
      synopsis: '',
      rating: 8.0,
    });

    const triggerAlert = (message, type = 'success') => {
      alertMessage.value = message;
      if (type === 'success') {
        alertClass.value = 'bg-green-950/50 border-green-500 text-green-200';
      } else {
        alertClass.value = 'bg-red-950/50 border-red-500 text-red-200';
      }
      setTimeout(() => {
        alertMessage.value = '';
      }, 5000);
    };

    const fetchFilms = async () => {
      isFetching.value = true;
      try {
        const response = await api.get('/api/films');
        films.value = response.data;
      } catch (error) {
        console.error('Error fetching films:', error);
        // Fallback untuk mockup visual tugas akhir
        films.value = [
          {
            id: 1,
            title: 'Avatar: The Way of Water',
            genre: 'Sci-Fi',
            duration: 192,
            poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
            synopsis: 'Jake Sully tinggal bersama keluarga barunya yang terbentuk di bulan eksotis Pandora. Setelah ancaman kembali datang.',
            rating: 8.9
          }
        ];
      } finally {
        isFetching.value = false;
      }
    };

    const openAddModal = () => {
      isEditing.value = false;
      editId.value = null;
      form.value = {
        title: '',
        genre: 'Action',
        duration: 120,
        poster_url: '',
        synopsis: '',
        rating: 8.0,
      };
      showModal.value = true;
    };

    const editFilm = (film) => {
      isEditing.value = true;
      editId.value = film.id;
      form.value = { ...film };
      showModal.value = true;
    };

    const deleteFilm = async (id) => {
      if (!confirm('Apakah Anda yakin ingin menghapus film ini dari database bioskop?')) return;
      
      try {
        await api.delete(`/api/films/${id}`);
        triggerAlert('Film berhasil dihapus dari sistem CineTix.');
        fetchFilms();
      } catch (error) {
        // Hapus lokal untuk mock testing UI
        films.value = films.value.filter(f => f.id !== id);
        triggerAlert('Informasi terhapus secara lokal karena backend offline.', 'success');
      }
    };

    const submitForm = async () => {
      isLoading.value = true;
      try {
        if (isEditing.value) {
          await api.put(`/api/films/${editId.value}`, form.value);
          triggerAlert('Data film berhasil diperbarui.');
        } else {
          await api.post('/api/films', form.value);
          triggerAlert('Film baru berhasil ditambahkan ke sistem CineTix.');
        }
        showModal.value = false;
        fetchFilms();
      } catch (error) {
        // Mocking simulasi CRUD untuk demo mahasiswa jika backend bermasalah
        if (isEditing.value) {
          const idx = films.value.findIndex(f => f.id === editId.value);
          if (idx !== -1) {
            films.value[idx] = { id: editId.value, ...form.value };
          }
          triggerAlert('Data visual berhasil diperbarui (Simulasi Offline).');
        } else {
          const newId = films.value.length ? Math.max(...films.value.map(f => f.id)) + 1 : 1;
          films.value.push({ id: newId, ...form.value });
          triggerAlert('Film baru berhasil ditambahkan (Simulasi Offline).');
        }
        showModal.value = false;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'admin') {
        router.push('/');
      } else {
        fetchFilms();
      }
    });

    return {
      films,
      isFetching,
      isLoading,
      showModal,
      isEditing,
      genres,
      form,
      alertMessage,
      alertClass,
      openAddModal,
      editFilm,
      deleteFilm,
      submitForm,
    };
  },
};
</script>
