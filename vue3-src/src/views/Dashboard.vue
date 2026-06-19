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
              <button 
                @click="openHistoryModal" 
                class="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Riwayat Transaksi
              </button>
              <button 
                @click="showSaranModal = true" 
                class="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Beri Saran
              </button>
              <router-link v-if="currentUser?.role === 'admin'" to="/films-crud" class="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800">
                Kelola Film (Admin)
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="hidden sm:block text-right">
              <div class="flex items-center justify-end gap-1.5">
                <p class="text-sm font-bold text-slate-200">{{ currentUser?.username }}</p>
                <!-- Member Tier Badge -->
                <span 
                  v-if="currentUser?.role !== 'admin'"
                  :class="{
                    'bg-slate-800 text-slate-300 border-slate-700': currentUser?.member_tier === 'Silver',
                    'bg-yellow-950/40 text-yellow-400 border-yellow-800/80': currentUser?.member_tier === 'Gold',
                    'bg-cyan-950/40 text-cyan-400 border-cyan-800/80': currentUser?.member_tier === 'Platinum'
                  }"
                  class="border text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                >
                  {{ currentUser?.member_tier || 'Silver' }}
                </span>
              </div>
              <p class="text-xs text-slate-400 capitalize">{{ currentUser?.role || 'User' }}</p>
            </div>
            <button 
              @click="handleLogout" 
              class="bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 font-medium"
            >
              Keluar
            </button>

            <!-- Mobile Menu Button -->
            <div class="flex md:hidden items-center">
              <button 
                @click="showMobileMenu = !showMobileMenu" 
                class="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    v-if="showMobileMenu" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                  <path 
                    v-else 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div v-show="showMobileMenu" class="md:hidden border-t border-slate-800 bg-slate-900 px-2 pt-2 pb-4 space-y-1">
        <!-- Profile Info (Mobile) -->
        <div class="px-3 py-2 border-b border-slate-800 mb-2">
          <div class="flex items-center gap-2">
            <p class="text-sm font-bold text-slate-200">{{ currentUser?.username }}</p>
            <span 
              v-if="currentUser?.role !== 'admin'"
              :class="{
                'bg-slate-800 text-slate-300 border-slate-700': currentUser?.member_tier === 'Silver',
                'bg-yellow-950/40 text-yellow-400 border-yellow-800/80': currentUser?.member_tier === 'Gold',
                'bg-cyan-950/40 text-cyan-400 border-cyan-800/80': currentUser?.member_tier === 'Platinum'
              }"
              class="border text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
            >
              {{ currentUser?.member_tier || 'Silver' }}
            </span>
          </div>
          <p class="text-xs text-slate-400 capitalize">{{ currentUser?.role || 'User' }}</p>
        </div>

        <span class="block px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white">Film Sedang Tayang</span>
        
        <button 
          @click="openHistoryModalMobile" 
          class="w-full text-left block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Riwayat Transaksi
        </button>
        
        <button 
          @click="openSaranModalMobile" 
          class="w-full text-left block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Beri Saran
        </button>
        
        <router-link 
          v-if="currentUser?.role === 'admin'" 
          to="/films-crud" 
          class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Kelola Film (Admin)
        </router-link>
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

      <!-- Booking Modal -->
      <div v-if="showBookingModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 class="font-bold text-xl text-white">Booking Tiket</h3>
            <button @click="closeBookingModal" class="text-slate-400 hover:text-white font-bold text-xl">&times;</button>
          </div>

          <!-- Film Info -->
          <div class="flex gap-4">
            <img :src="bookingFilm.poster_url || 'https://images.unsplash.com/photo-1542204111-374baa1445b0?w=500'" class="w-20 h-28 object-cover rounded-lg border border-slate-800" />
            <div>
              <h4 class="font-bold text-base text-white line-clamp-2">{{ bookingFilm.title }}</h4>
              <p class="text-xs text-slate-400 mt-1">{{ bookingFilm.genre }} | {{ bookingFilm.duration }} Mins</p>
              <p class="text-xs text-red-500 font-bold mt-2">★ {{ bookingFilm.rating }}</p>
            </div>
          </div>

          <!-- Select Schedule -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-300">Pilih Jadwal Studio</label>
            <div v-if="schedulesLoading" class="text-xs text-slate-400">Memuat jadwal...</div>
            <div v-else-if="filteredSchedules.length === 0" class="text-xs text-red-400">Tidak ada jadwal tersedia untuk film ini.</div>
            <select v-else v-model="selectedScheduleId" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-red-500 focus:border-red-500">
              <option value="">-- Pilih Jadwal --</option>
              <option v-for="sch in filteredSchedules" :key="sch.schedule_id" :value="sch.schedule_id">
                {{ sch.studio }} - {{ sch.show_time }} (Rp {{ parseFloat(sch.price).toLocaleString('id-ID') }})
              </option>
            </select>
          </div>

          <!-- Select Seats Count -->
          <div v-if="selectedScheduleId" class="space-y-2">
            <label class="block text-sm font-medium text-slate-300">Jumlah Kursi</label>
            <input type="number" v-model.number="seatCount" min="1" max="10" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:ring-red-500 focus:border-red-500" />
          </div>

          <!-- Select Payment Method -->
          <div v-if="selectedScheduleId" class="space-y-2">
            <label class="block text-sm font-medium text-slate-300">Metode Pembayaran</label>
            <select v-model="paymentMethod" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-red-500 focus:border-red-500">
              <option value="QRIS">QRIS</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Bank Transfer</option>
            </select>
          </div>

          <!-- Pricing & Pay -->
          <div v-if="selectedScheduleId" class="border-t border-slate-800 pt-4 flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400">Total Harga</p>
              <p class="text-lg font-black text-white">Rp {{ (selectedSchedulePrice * seatCount).toLocaleString('id-ID') }}</p>
            </div>
            <button @click="processBooking" :disabled="bookingProcessing" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50 transition-all">
              {{ bookingProcessing ? 'Memproses...' : 'Bayar Sekarang' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Receipt / Nota Modal -->
      <div v-if="showReceiptModal && receiptData" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
          <!-- Receipt Decorative Header -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-orange-500 to-green-500"></div>
          
          <div class="text-center pt-2">
            <span class="text-2xl font-black tracking-wider text-red-500 uppercase">CineTix Receipt</span>
            <p class="text-xs text-slate-400 mt-1">Bukti Transaksi Pembayaran Resmi</p>
          </div>

          <!-- Divider -->
          <div class="border-b border-dashed border-slate-700 py-1"></div>

          <!-- Transaction details -->
          <div class="space-y-4">
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">ID Transaksi (Booking):</span>
              <span class="font-mono font-bold text-white">#{{ receiptData.bookingId }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Tanggal & Waktu:</span>
              <span class="text-white">{{ receiptData.dateTime }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Nama Pelanggan:</span>
              <span class="text-white font-medium">{{ currentUser?.username }}</span>
            </div>
            
            <div class="border-t border-slate-800 pt-3">
              <span class="text-xs text-slate-400 block uppercase font-bold tracking-wider">Detail Tiket</span>
              <div class="mt-2 flex gap-3">
                <img :src="receiptData.posterUrl || 'https://images.unsplash.com/photo-1542204111-374baa1445b0?w=500'" class="w-12 h-16 object-cover rounded border border-slate-800" />
                <div>
                  <h4 class="font-bold text-sm text-white line-clamp-1">{{ receiptData.title }}</h4>
                  <p class="text-xs text-slate-400">{{ receiptData.studio }} | Durasi: {{ receiptData.duration }} Mins</p>
                  <p class="text-xs text-slate-400 font-mono">{{ receiptData.showTime }} | Rating: ★ {{ receiptData.rating }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-800 pt-3 space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-slate-400">Jumlah Kursi:</span>
                <span class="text-white font-bold">{{ receiptData.seatCount }} Kursi</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-400">Metode Pembayaran:</span>
                <span class="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{{ receiptData.paymentMethod }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-400">Status Pembayaran:</span>
                <span class="bg-green-950/60 border border-green-800 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Lunas / Paid</span>
              </div>
            </div>

            <!-- Total Price -->
            <div class="border-t border-dashed border-slate-700 pt-4 flex justify-between items-center">
              <span class="text-sm font-bold text-white">TOTAL BAYAR</span>
              <span class="text-xl font-black text-green-400">Rp {{ receiptData.totalPrice.toLocaleString('id-ID') }}</span>
            </div>
          </div>

          <!-- Receipt Footer / Button -->
          <div class="pt-4 flex gap-3">
            <button @click="printReceipt" class="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all">
              Cetak / Simpan PDF
            </button>
            <button @click="showReceiptModal = false" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all">
              Selesai & Tutup
            </button>
          </div>
        </div>
      </div>

      <!-- History / Riwayat Transaksi Modal -->
      <div v-if="showHistoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 flex flex-col max-h-[85vh]">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="font-bold text-xl text-white">Riwayat Transaksi</h3>
              <p class="text-xs text-slate-400 mt-1">Daftar tiket bioskop yang pernah Anda pesan</p>
            </div>
            <button @click="showHistoryModal = false" class="text-slate-400 hover:text-white font-bold text-2xl">&times;</button>
          </div>

          <!-- Loading State -->
          <div v-if="historyLoading" class="flex flex-col items-center justify-center py-12 space-y-3">
            <svg class="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs text-slate-400">Memuat riwayat transaksi...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="userBookings.length === 0" class="text-center py-16 text-slate-500">
            <p class="text-sm font-medium">Anda belum memiliki riwayat pemesanan tiket.</p>
            <p class="text-xs mt-1">Mulai memesan kursi dari katalog film kami!</p>
          </div>

          <!-- Bookings List -->
          <div v-else class="flex-1 overflow-y-auto space-y-4 pr-1">
            <div 
              v-for="b in userBookings" 
              :key="b.booking_id" 
              class="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div class="flex gap-4">
                <img 
                  :src="b.schedule?.film?.poster_url || 'https://images.unsplash.com/photo-1542204111-374baa1445b0?w=500'" 
                  class="w-12 h-16 object-cover rounded border border-slate-800" 
                />
                <div>
                  <h4 class="font-bold text-sm text-white">{{ b.schedule?.film?.title || 'Film Terhapus' }}</h4>
                  <p class="text-xs text-slate-400 mt-0.5">{{ b.schedule?.studio || 'Studio' }} | {{ b.seat_count }} Kursi | Durasi: {{ b.schedule?.film?.duration || 120 }} Mins</p>
                  <p class="text-[10px] text-slate-500 font-mono mt-1">Waktu: {{ b.schedule?.show_time || '-' }} | Rating: ★ {{ b.schedule?.film?.rating || '8.5' }}</p>
                </div>
              </div>

              <div class="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
                <div class="text-right">
                  <p class="text-xs text-slate-500">Total Bayar</p>
                  <p class="text-sm font-black text-green-400">Rp {{ parseFloat(b.total_price).toLocaleString('id-ID') }}</p>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <!-- Status Badge -->
                  <span 
                    :class="{
                      'bg-green-950/60 border-green-800 text-green-400': b.status === 'Confirmed',
                      'bg-amber-950/60 border-amber-800 text-amber-400': b.status === 'Pending',
                      'bg-red-950/60 border-red-800 text-red-400': b.status === 'Cancelled'
                    }"
                    class="border px-2 py-0.5 rounded text-[10px] uppercase font-bold"
                  >
                    {{ b.status }}
                  </span>
                  
                  <!-- Lihat Nota Button -->
                  <button 
                    @click="showReceiptFromHistory(b)" 
                    class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer"
                  >
                    Lihat Nota
                  </button>

                  <!-- Beri Rating Button (Only if Confirmed) -->
                  <button 
                    v-if="b.status === 'Confirmed'"
                    @click="openRateModal(b)" 
                    class="bg-yellow-600 hover:bg-yellow-700 text-white text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer ml-1.5"
                  >
                    Beri Rating
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-800 pt-4 flex justify-end">
            <button @click="showHistoryModal = false" class="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all">
              Tutup
            </button>
          </div>
        </div>
      </div>

      <!-- Saran Modal -->
      <div v-if="showSaranModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="font-bold text-lg text-white">Saran & Masukan</h3>
            <button @click="showSaranModal = false" class="text-slate-400 hover:text-white text-2xl font-light">&times;</button>
          </div>
          <form @submit.prevent="submitSaran" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Subjek / Topik</label>
              <input v-model="saranSubject" type="text" required class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" placeholder="Masukan judul saran..." />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Isi Masukan</label>
              <textarea v-model="saranContent" rows="4" required class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" placeholder="Tuliskan masukan atau kritik untuk bioskop CineTix..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showSaranModal = false" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg">Batal</button>
              <button type="submit" :disabled="saranSubmitting" class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-50">
                {{ saranSubmitting ? 'Mengirim...' : 'Kirim Saran' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Rate Modal -->
      <div v-if="showRateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="font-bold text-lg text-white">Beri Rating Film</h3>
            <button @click="showRateModal = false" class="text-slate-400 hover:text-white text-2xl font-light">&times;</button>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-slate-300">Bagikan penilaian Anda untuk film <span class="font-bold text-red-500">"{{ rateFilmTitle }}"</span></p>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Penilaian (Bintang)</label>
              <div class="flex gap-2 text-2xl text-yellow-500 py-1">
                <span v-for="star in 5" :key="star" @click="rateStars = star" class="cursor-pointer hover:scale-110 transition-transform select-none">
                  {{ star <= rateStars ? '★' : '☆' }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1 uppercase">Ulasan / Kritik</label>
              <textarea v-model="rateComment" rows="3" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 outline-none" placeholder="Tulis komentar tentang film ini..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showRateModal = false" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg">Batal</button>
              <button @click="submitRating" class="bg-yellow-600 hover:bg-yellow-750 text-white text-xs font-bold px-4 py-2 rounded-lg">Kirim Ulasan</button>
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

    const genres = computed(() => {
      const list = films.value.map(film => film.genre).filter(Boolean);
      return [...new Set(list)].sort();
    });

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

    // Reactive States for Booking Modal
    const showBookingModal = ref(false);
    const bookingFilm = ref(null);
    const schedules = ref([]);
    const schedulesLoading = ref(false);
    const selectedScheduleId = ref('');
    const seatCount = ref(1);
    const paymentMethod = ref('QRIS');
    const bookingProcessing = ref(false);
    const showReceiptModal = ref(false);
    const receiptData = ref(null);

    const showHistoryModal = ref(false);
    const historyLoading = ref(false);
    const bookings = ref([]);
    const payments = ref([]);

    const showSaranModal = ref(false);
    const saranSubject = ref('');
    const saranContent = ref('');
    const saranSubmitting = ref(false);

    const showMobileMenu = ref(false);

    const showRateModal = ref(false);
    const rateStars = ref(5);
    const rateComment = ref('');
    const rateFilmTitle = ref('');

    const fetchSchedules = async () => {
      schedulesLoading.value = true;
      try {
        const response = await api.get('/api/schedules');
        schedules.value = response.data;
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        schedulesLoading.value = false;
      }
    };

    const filteredSchedules = computed(() => {
      if (!bookingFilm.value) return [];
      return schedules.value.filter(s => s.film_id === bookingFilm.value.id);
    });

    const selectedSchedulePrice = computed(() => {
      const sch = schedules.value.find(s => s.schedule_id === Number(selectedScheduleId.value));
      return sch ? parseFloat(sch.price) : 0;
    });

    const beliTiket = (film) => {
      bookingFilm.value = film;
      showBookingModal.value = true;
      selectedScheduleId.value = '';
      seatCount.value = 1;
      fetchSchedules();
    };

    const closeBookingModal = () => {
      showBookingModal.value = false;
      bookingFilm.value = null;
      selectedScheduleId.value = '';
    };

    const processBooking = async () => {
      if (!selectedScheduleId.value) return;
      bookingProcessing.value = true;
      try {
        const userId = currentUser.value?.user_id || 1;
        const total = selectedSchedulePrice.value * seatCount.value;
        
        // 1. Post Booking
        const bookingResponse = await api.post('/api/bookings', {
          user_id: userId,
          schedule_id: Number(selectedScheduleId.value),
          seat_count: seatCount.value,
          total_price: total,
          status: 'Confirmed'
        });

        const newBookingId = bookingResponse.data.booking_id;

        // 2. Post Payment
        await api.post('/api/payments', {
          booking_id: newBookingId,
          payment_method: paymentMethod.value,
          payment_status: 'Paid'
        });

        // Set Receipt Data
        const selectedSch = schedules.value.find(s => s.schedule_id === Number(selectedScheduleId.value));
        receiptData.value = {
          bookingId: newBookingId,
          dateTime: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          title: bookingFilm.value.title,
          posterUrl: bookingFilm.value.poster_url,
          studio: selectedSch ? selectedSch.studio : 'Studio 1',
          showTime: selectedSch ? selectedSch.show_time : '',
          seatCount: seatCount.value,
          paymentMethod: paymentMethod.value,
          totalPrice: total,
          duration: bookingFilm.value.duration || 120,
          rating: bookingFilm.value.rating || '8.5'
        };

        showReceiptModal.value = true;
        closeBookingModal();
      } catch (error) {
        console.error('Error processing booking:', error);
        alert('Gagal melakukan pemesanan tiket. Silakan coba lagi.');
      } finally {
        bookingProcessing.value = false;
      }
    };

    const printReceipt = () => {
      window.print();
    };

    const fetchHistoryData = async () => {
      historyLoading.value = true;
      try {
        const [bookingsRes, paymentsRes] = await Promise.all([
          api.get('/api/bookings'),
          api.get('/api/payments')
        ]);
        bookings.value = bookingsRes.data;
        payments.value = paymentsRes.data;
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        historyLoading.value = false;
      }
    };

    const openHistoryModal = () => {
      showHistoryModal.value = true;
      fetchHistoryData();
    };

    const userBookings = computed(() => {
      const userId = currentUser.value?.user_id || 1;
      return bookings.value
        .filter(b => b.user_id === userId)
        .sort((a, b) => b.booking_id - a.booking_id);
    });

    const showReceiptFromHistory = (b) => {
      // populate receiptData
      receiptData.value = {
        bookingId: b.booking_id,
        dateTime: new Date(b.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        title: b.schedule?.film?.title || 'Film',
        posterUrl: b.schedule?.film?.poster_url,
        studio: b.schedule?.studio || 'Studio 1',
        showTime: b.schedule?.show_time || '',
        seatCount: b.seat_count,
        paymentMethod: 'Online Payment',
        totalPrice: parseFloat(b.total_price),
        duration: b.schedule?.film?.duration || 120,
        rating: b.schedule?.film?.rating || '8.5'
      };
      
      const payment = payments.value.find(p => p.booking_id === b.booking_id);
      if (payment) {
        receiptData.value.paymentMethod = payment.payment_method;
      }

      showHistoryModal.value = false;
      showReceiptModal.value = true;
    };

    const submitSaran = () => {
      saranSubmitting.value = true;
      setTimeout(() => {
        saranSubmitting.value = false;
        showSaranModal.value = false;
        alert(`Terima kasih! Saran Anda bertopik "${saranSubject.value}" telah berhasil terkirim ke administrator.`);
        saranSubject.value = '';
        saranContent.value = '';
      }, 850);
    };

    const openRateModal = (b) => {
      rateFilmTitle.value = b.schedule?.film?.title || 'Film';
      rateStars.value = 5;
      rateComment.value = '';
      showRateModal.value = true;
    };

    const submitRating = () => {
      alert(`Terima kasih! Penilaian ${rateStars.value} bintang Anda untuk film "${rateFilmTitle.value}" berhasil dikirim.`);
      showRateModal.value = false;
    };

    const openHistoryModalMobile = () => {
      showMobileMenu.value = false;
      openHistoryModal();
    };

    const openSaranModalMobile = () => {
      showMobileMenu.value = false;
      showSaranModal.value = true;
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
      showBookingModal,
      bookingFilm,
      schedulesLoading,
      filteredSchedules,
      selectedScheduleId,
      seatCount,
      paymentMethod,
      bookingProcessing,
      selectedSchedulePrice,
      closeBookingModal,
      processBooking,
      showReceiptModal,
      receiptData,
      printReceipt,
      showHistoryModal,
      historyLoading,
      openHistoryModal,
      userBookings,
      showReceiptFromHistory,
      showSaranModal,
      saranSubject,
      saranContent,
      saranSubmitting,
      showRateModal,
      rateStars,
      rateComment,
      rateFilmTitle,
      submitSaran,
      openRateModal,
      submitRating,
      showMobileMenu,
      openHistoryModalMobile,
      openSaranModalMobile
    };
  },
};
</script>
