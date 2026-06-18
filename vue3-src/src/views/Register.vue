<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-red-500">
          Daftar CineTix
        </h2>
        <p class="mt-2 text-sm text-slate-400">
          Buat akun baru untuk mulai menikmati layanan bioskop online
        </p>
      </div>

      <!-- Alert Error -->
      <div v-if="errorMessage" class="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-center">
        {{ errorMessage }}
      </div>

      <!-- Alert Success -->
      <div v-if="successMessage" class="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded-lg text-sm text-center">
        {{ successMessage }}
      </div>

      <!-- Form Register -->
      <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
        <div class="space-y-4 rounded-md">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-300 mb-1">Username / Nama Pengguna</label>
            <input
              id="name"
              v-model="name"
              name="name"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Masukkan username Anda"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-1">Alamat Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="contoh@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-1">Kata Sandi (Min 8 karakter)</label>
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

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-slate-300 mb-1">Konfirmasi Kata Sandi</label>
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              name="password_confirmation"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800/50 text-slate-100 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Ulangi kata sandi Anda"
            />
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mendaftarkan Akun...
            </span>
            <span v-else>Daftar Akun</span>
          </button>
        </div>

        <div class="text-center text-sm text-slate-400 mt-4">
          Sudah memiliki akun?
          <router-link to="/login" class="font-medium text-red-500 hover:text-red-400">
            Masuk disini
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
  name: 'Register',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const passwordConfirmation = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const router = useRouter();

    const handleRegister = async () => {
      // Validasi lokal
      if (password.value !== passwordConfirmation.value) {
        errorMessage.value = 'Konfirmasi password tidak cocok.';
        return;
      }

      if (password.value.length < 8) {
        errorMessage.value = 'Password harus memiliki panjang minimal 8 karakter.';
        return;
      }

      isLoading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      try {
        const response = await api.post('/api/register', {
          username: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value,
        });

        successMessage.value = 'Registrasi berhasil! Mengalihkan ke halaman login...';
        
        // Bersihkan isian form
        name.value = '';
        email.value = '';
        password.value = '';
        passwordConfirmation.value = '';

        // Alihkan setelah 2 detik
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.errors) {
            // Gabungkan pesan error dari Laravel validasi
            const validationErrors = Object.values(error.response.data.errors).flat();
            errorMessage.value = validationErrors.join(' ');
          } else {
            errorMessage.value = error.response.data.message || 'Registrasi gagal. Coba lagi.';
          }
        } else {
          errorMessage.value = 'Koneksi ke backend bermasalah. Pastikan Laravel sudah di-running.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      name,
      email,
      password,
      passwordConfirmation,
      isLoading,
      errorMessage,
      successMessage,
      handleRegister,
    };
  },
};
</script>
