<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-red-500">
          CineTix
        </h2>
        <p class="mt-2 text-sm text-slate-400">
          Masuk ke akun Anda untuk memesan tiket bioskop
        </p>
      </div>

      <!-- Alert Error -->
      <div v-if="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-center">
        {{ errorMessage }}
      </div>

      <!-- Form Login -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 rounded-md">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-1">Email Anda</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-1">Kata Sandi</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <!-- Loading Spinner -->
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
            <span v-else>Masuk Sekarang</span>
          </button>
        </div>

        <div class="text-center text-sm text-slate-400 mt-4">
          Belum punya akun?
          <router-link to="/register" class="font-medium text-red-500 hover:text-red-400">
            Daftar disini
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  name: 'Login',
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
        const response = await api.post('/api/login', {
          email: email.value,
          password: password.value,
        });

        // Simpan token Bearer dan data User di LocalStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect ke dashboard
        router.push('/');
      } catch (error) {
        if (error.response && error.response.data) {
          errorMessage.value = error.response.data.message || 'Login gagal. Periksa kembali email & password Anda.';
        } else {
          errorMessage.value = 'Tidak dapat menghubungi server. Pastikan server backend Anda berjalan.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      isLoading,
      errorMessage,
      handleLogin,
    };
  },
};
</script>
