/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Film, Schedule, Booking, Payment, User } from '../types';
import { 
  Film as FilmIcon, 
  Tv, 
  Calendar, 
  Clock, 
  CreditCard, 
  User as UserIcon, 
  LogOut, 
  Lock, 
  Mail, 
  Search, 
  Star, 
  Trash2, 
  Edit2, 
  Plus, 
  PlusCircle, 
  Check, 
  Sparkles,
  ChevronRight,
  Ticket
} from 'lucide-react';

const INITIAL_FILMS: Film[] = [
  {
    id: 1,
    title: 'Avatar: The Way of Water',
    genre: 'Sci-Fi',
    duration: 192,
    release_date: '2023-12-16',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    synopsis: 'Jake Sully dan Neytiri telah membentuk keluarga dan melakukan segalanya untuk tetap bersama. Namun, mereka harus meninggalkan rumah mereka dan menjelajahi wilayah baru di Pandora ketika ancaman kuno muncul kembali.',
    rating: 8.9
  },
  {
    id: 2,
    title: 'Resident Evil: Death Island',
    genre: 'Action',
    duration: 91,
    release_date: '2023-07-07',
    poster_url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop',
    synopsis: 'Agen D.S.O. Leon S. Kennedy sedang dalam misi menyelamatkan Dr. Antonio Taylor dari para penculik, ketika seorang wanita misterius merintangi pengejarannya. Sementara itu, agen B.S.A.A. Chris Redfield sedang menyelidiki wabah zombie di San Francisco.',
    rating: 7.6
  },
  {
    id: 3,
    title: 'The Conjuring: The Devil Made Me Do It',
    genre: 'Horror',
    duration: 112,
    release_date: '2021-06-04',
    poster_url: 'https://images.unsplash.com/photo-1505775561242-727b7fbf203c?q=80&w=600&auto=format&fit=crop',
    synopsis: 'Kisah mengerikan tentang teror, pembunuhan, dan kejahatan tak dikenal yang mengejutkan bahkan penyelidik paranormal kehidupan nyata yang berpengalaman, Ed dan Lorraine Warren.',
    rating: 8.2
  },
  {
    id: 4,
    title: 'Spiderman: Across the Spiderverse',
    genre: 'Animation',
    duration: 140,
    release_date: '2023-06-02',
    poster_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop',
    synopsis: 'Miles Morales kembali untuk babak berikutnya dari saga Spider-Verse pemenang Oscar, sebuah petualangan epik yang akan membawa jaring penuh waktu ramah lingkungan Brooklyn melintasi Multiverse.',
    rating: 9.1
  }
];

const INITIAL_SCHEDULES: Schedule[] = [
  { id: 1, film_id: 1, studio_name: 'Studio 1 (IMAX)', date: '2026-06-20', time: '13:00', price: 50000 },
  { id: 2, film_id: 1, studio_name: 'Studio 1 (IMAX)', date: '2026-06-20', time: '18:30', price: 55000 },
  { id: 3, film_id: 2, studio_name: 'Studio 2 (Dolby Atmos)', date: '2026-06-20', time: '14:15', price: 40000 },
  { id: 4, film_id: 2, studio_name: 'Studio 2 (Dolby Atmos)', date: '2026-06-20', time: '20:00', price: 45000 },
  { id: 5, film_id: 3, studio_name: 'Studio 3 (Regular)', date: '2026-06-21', time: '16:00', price: 35000 },
  { id: 6, film_id: 3, studio_name: 'Studio 3 (Regular)', date: '2026-06-21', time: '21:15', price: 35000 },
  { id: 7, film_id: 4, studio_name: 'Studio 1 (IMAX)', date: '2026-06-21', time: '12:00', price: 50000 },
  { id: 8, film_id: 4, studio_name: 'Studio 2 (Dolby Atmos)', date: '2026-06-21', time: '15:30', price: 45000 }
];

export default function CineTixDemo() {
  // Global States loaded from local storage
  const [films, setFilms] = useState<Film[]>(() => {
    const saved = localStorage.getItem('cinetix_films');
    return saved ? JSON.parse(saved) : INITIAL_FILMS;
  });

  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('cinetix_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cinetix_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('cinetix_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cinetix_user');
    return saved ? JSON.parse(saved) : null;
  });

  // UI Flow States
  const [activeTab, setActiveTab] = useState<'katalog' | 'riwayat' | 'admin'>('katalog');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  // Selection state for Booking
  const [selectedFilmForDetails, setSelectedFilmForDetails] = useState<Film | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('GoPay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Admin CRUD Form state
  const [crudAction, setCrudAction] = useState<'create' | 'edit' | null>(null);
  const [formFilmId, setFormFilmId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formGenre, setFormGenre] = useState('Action');
  const [formDuration, setFormDuration] = useState(120);
  const [formPoster, setFormPoster] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formRating, setFormRating] = useState(8.0);

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('cinetix_films', JSON.stringify(films));
  }, [films]);

  useEffect(() => {
    localStorage.setItem('cinetix_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('cinetix_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cinetix_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cinetix_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cinetix_user');
    }
  }, [currentUser]);

  // Auth Operations
  const handleAuth = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailInput || !passwordInput) {
      setErrorMessage('Harap isi semua kolom!');
      return;
    }

    if (authMode === 'login') {
      // Simulate login
      if (emailInput === 'admin@cinetix.com' && passwordInput === 'admin123') {
        const user: User = { id: 1, name: 'Rian Admin', email: 'admin@cinetix.com', role: 'admin' };
        setCurrentUser(user);
        setSuccessMessage('Login sukses sebagai Administrator!');
      } else {
        // Just log any other customer in
        const user: User = { 
          id: Date.now(), 
          name: nameInput || emailInput.split('@')[0], 
          email: emailInput, 
          role: 'customer' 
        };
        setCurrentUser(user);
        setSuccessMessage('Login sukses sebagai Pelanggan!');
      }
    } else {
      // Register
      if (!nameInput) {
        setErrorMessage('Harap isi nama lengkap Anda!');
        return;
      }
      setSuccessMessage('Akun baru berhasil didaftarkan! Silakan masuk.');
      setAuthMode('login');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('katalog');
    setSelectedFilmForDetails(null);
    setSelectedSchedule(null);
    setSelectedSeats([]);
  };

  const loginAsDemoUser = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      const user: User = { id: 1, name: 'Rian Admin (Tugas Akhir)', email: 'admin@cinetix.com', role: 'admin' };
      setCurrentUser(user);
    } else {
      const user: User = { id: 2, name: 'Budi Santoso', email: 'budi@email.com', role: 'customer' };
      setCurrentUser(user);
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Seat map configurations
  const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSeatClick = (seatCode: string) => {
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const handleCreateBooking = () => {
    if (!currentUser) {
      setErrorMessage('Harap masuk terlebih dahulu untuk memesan tiket!');
      return;
    }
    if (!selectedSchedule) return;
    if (selectedSeats.length === 0) {
      alert('Harap pilih minimal satu kursi!');
      return;
    }

    // Process variables
    const bookingId = Date.now();
    const newBooking: Booking = {
      id: bookingId,
      user_id: currentUser.id,
      schedule_id: selectedSchedule.id,
      seats: selectedSeats,
      booking_date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setCompletedBooking(newBooking);
  };

  const handleProcessPayment = () => {
    if (!completedBooking || !selectedSchedule) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      // Create payment
      const paymentId = Date.now();
      const amount = selectedSchedule.price * completedBooking.seats.length;
      
      const newPayment: Payment = {
        id: paymentId,
        booking_id: completedBooking.id,
        amount: amount,
        payment_method: paymentMethod,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'success'
      };

      const finalBooking: Booking = {
        ...completedBooking,
        status: 'confirmed'
      };

      // Save to state
      setBookings([finalBooking, ...bookings]);
      setPayments([newPayment, ...payments]);

      setCompletedPayment(newPayment);
      setIsProcessingPayment(false);
    }, 1500);
  };

  const checkSeatIsTaken = (seatCode: string) => {
    if (!selectedSchedule) return false;
    // Check bookings for this schedule
    return bookings
      .filter(b => b.schedule_id === selectedSchedule.id && b.status === 'confirmed')
      .some(b => b.seats.includes(seatCode));
  };

  // Admin Film Operations
  const handleOpenCreateFilm = () => {
    setCrudAction('create');
    setFormTitle('');
    setFormGenre('Action');
    setFormDuration(120);
    setFormPoster('https://images.unsplash.com/photo-1542204111-374baa1445b0?w=500');
    setFormSynopsis('');
    setFormRating(8.0);
  };

  const handleOpenEditFilm = (film: Film) => {
    setCrudAction('edit');
    setFormFilmId(film.id);
    setFormTitle(film.title);
    setFormGenre(film.genre);
    setFormDuration(film.duration);
    setFormPoster(film.poster_url);
    setFormSynopsis(film.synopsis);
    setFormRating(film.rating);
  };

  const handleSubmitFilmForm = (e: FormEvent) => {
    e.preventDefault();
    if (crudAction === 'create') {
      const newId = films.length ? Math.max(...films.map(f => f.id)) + 1 : 1;
      const newFilm: Film = {
        id: newId,
        title: formTitle,
        genre: formGenre,
        duration: formDuration,
        release_date: new Date().toISOString().split('T')[0],
        poster_url: formPoster || 'https://images.unsplash.com/photo-1542204111-374baa1445b0?w=500',
        synopsis: formSynopsis,
        rating: formRating
      };
      setFilms([...films, newFilm]);
      alert('Film baru berhasil ditambahkan secara lokal!');
    } else if (crudAction === 'edit' && formFilmId !== null) {
      setFilms(films.map(f => f.id === formFilmId ? {
        ...f,
        title: formTitle,
        genre: formGenre,
        duration: formDuration,
        poster_url: formPoster,
        synopsis: formSynopsis,
        rating: formRating
      } : f));
      alert('Data film berhasil diperbarui!');
    }
    setCrudAction(null);
  };

  const handleDeleteFilm = (id: number) => {
    if (confirm('Anda yakin ingin menghapus film ini dari database bioskop?')) {
      setFilms(films.filter(f => f.id !== id));
      // Delete any associated schedules
      setSchedules(schedules.filter(s => s.film_id !== id));
    }
  };

  // Filter films based on query and genre
  const filteredFilms = films.filter(f => {
    const matchSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGenre = selectedGenre === '' || f.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  const getMovieSchedules = (movieId: number) => {
    return schedules.filter(s => s.film_id === movieId);
  };

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

  return (
    <div className="bg-[#0A0A0B] text-slate-100 min-h-[500px]" id="cinetix-demo-container">

      {/* Header Panel */}
      <header className="bg-black/40 border-b border-white/10 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-rose-600 p-2 rounded">
            <Tv className="text-white" size={22} />
          </div>
          <div>
            <h1 className="editorial-title text-3xl font-black italic text-rose-500 flex items-center gap-2">
              CineTix
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Sistem Informasi Tiket & Bioskop Terintegrasi</p>
          </div>
        </div>

        {/* Quick Auth Status */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-4 bg-black/60 p-2 rounded border border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-600/20 text-rose-500 flex items-center justify-center font-bold">
                  {currentUser.name[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentUser.role} Role</p>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-white/5 rounded transition-colors"
                title="Log Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden sm:inline">Pilihan Login:</span>
              <button 
                onClick={() => loginAsDemoUser('customer')}
                className="bg-white/5 hover:bg-white/10 text-slate-100 border border-white/15 uppercase tracking-wide font-bold px-3 py-1.5 rounded text-xs transition-all"
              >
                Pelanggan
              </button>
              <button 
                onClick={() => loginAsDemoUser('admin')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wide px-3 py-1.5 rounded text-xs transition-all"
              >
                Admin Panel
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="p-6">
        {currentUser ? (
          <div>
            {/* Navigasi Tab */}
            <div className="flex items-center space-x-1 border-b border-white/10 mb-6">
              <button
                onClick={() => { setActiveTab('katalog'); setSelectedSchedule(null); setSelectedSeats([]); setCompletedBooking(null); setCompletedPayment(null); }}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'katalog' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                Katalog & Pemesanan
              </button>
              <button
                onClick={() => { setActiveTab('riwayat'); setSelectedSchedule(null); setSelectedSeats([]); setCompletedBooking(null); setCompletedPayment(null); }}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'riwayat' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                Riwayat Tiket Saya ({bookings.length})
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => { setActiveTab('admin'); setSelectedSchedule(null); setSelectedSeats([]); setCompletedBooking(null); setCompletedPayment(null); }}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === 'admin' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-400 hover:text-slate-100'
                  }`}
                >
                  Manajemen CRUD Film
                </button>
              )}
            </div>

            {/* TAB 1: KATALOG */}
            {activeTab === 'katalog' && (
              <div>
                {!selectedSchedule ? (
                  <div>
                    {/* Search bar */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-2.5 text-slate-500" size={18} />
                        <input
                          type="text"
                          placeholder="Cari judul film..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded py-2.5 pl-10 pr-4 text-xs tracking-wider focus:outline-none focus:border-rose-500/50"
                        />
                      </div>
                      <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="bg-black/40 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded focus:outline-none focus:border-rose-500/50"
                      >
                        <option value="" className="bg-neutral-900">Semua Genre</option>
                        {genres.map(g => (
                          <option key={g} value={g} className="bg-neutral-900">{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* Movie Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredFilms.map(film => (
                        <div 
                          key={film.id} 
                          className="bg-black/45 border border-white/10 rounded overflow-hidden shadow-xl hover:border-rose-500/50 transition-all flex flex-col justify-between group"
                        >
                          <div className="relative">
                            <img 
                              src={film.poster_url} 
                              alt={film.title}
                              className="w-full aspect-[3/4.2] object-cover" 
                            />
                            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-yellow-500 flex items-center gap-1 text-xs font-bold">
                              <Star size={12} fill="currentColor" />
                              <span>{film.rating}</span>
                            </div>
                            <div className="absolute bottom-3 left-3 bg-rose-600 text-white font-mono font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm">
                              {film.genre}
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="editorial-title font-bold text-lg line-clamp-1 group-hover:text-rose-500 transition-colors">{film.title}</h3>
                              <p className="text-xs text-slate-400 mt-1">Durasi: {film.duration} menit</p>
                              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{film.synopsis}</p>
                            </div>

                            <button
                              onClick={() => setSelectedFilmForDetails(film)}
                              className="mt-4 w-full bg-white/5 hover:bg-rose-600 hover:text-white border border-white/10 text-slate-200 font-bold uppercase tracking-wider text-[10px] py-2.5 rounded transition-all"
                            >
                              Detail & Pilih Jadwal
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // SEAT MAP & CHECKOUT ZONE
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pembeli memilih kursi */}
                    <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded p-6">
                      <div className="flex items-center justify-between mb-6">
                        <button 
                          onClick={() => { setSelectedSchedule(null); setSelectedSeats([]); setCompletedBooking(null); }}
                          className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                        >
                          ← Batal & Pilih Lainnya
                        </button>
                        <h2 className="editorial-title text-xl font-bold italic">Pilih Kursi Bioskop</h2>
                      </div>

                      {/* Screen element */}
                      <div className="w-full bg-white/5 text-slate-500 text-[10px] text-center py-2.5 rounded mb-10 border-t border-rose-500 font-bold tracking-[0.25em] uppercase">
                        LAYAR UTAMA BIOSKOP (IMAX / DOLBY)
                      </div>

                      {/* Map grid */}
                      <div className="space-y-3.5 max-w-lg mx-auto mb-10">
                        {SEAT_ROWS.map(row => (
                          <div key={row} className="flex items-center justify-between gap-2">
                            <span className="w-6 text-slate-500 font-mono text-sm font-bold">{row}</span>
                            <div className="flex-1 grid grid-cols-8 gap-2.5">
                              {SEAT_COLS.map(col => {
                                const seatCode = `${row}${col}`;
                                const isTaken = checkSeatIsTaken(seatCode);
                                const isSelected = selectedSeats.includes(seatCode);

                                return (
                                  <button
                                    key={col}
                                    disabled={isTaken}
                                    onClick={() => handleSeatClick(seatCode)}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                      isTaken 
                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                        : isSelected
                                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400'
                                          : 'bg-slate-950 hover:bg-slate-700 border border-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                            <span className="w-6 text-slate-500 font-mono text-sm font-bold text-right">{row}</span>
                          </div>
                        ))}
                      </div>

                      {/* Seat Map Legend */}
                      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/50 pt-5">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-slate-950 border border-slate-800"></div>
                          <span>Tersedia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-red-600"></div>
                          <span>Pilihan Anda</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-slate-800"></div>
                          <span>Terjual / Diisi</span>
                        </div>
                      </div>
                    </div>

                    {/* Ringkasan pembayaran di sebelah kanan */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-4 border-b border-slate-800 pb-3 text-white">Ringkasan Tiket</h3>
                        
                        {/* Film & Schedule meta */}
                        <div className="flex items-start gap-3.5 mb-6">
                          <img 
                            src={films.find(f => f.id === selectedSchedule.film_id)?.poster_url} 
                            alt=""
                            className="w-16 h-22 rounded object-cover bg-slate-800" 
                          />
                          <div>
                            <h4 className="font-bold text-sm tracking-tight text-white leading-snug">
                              {films.find(f => f.id === selectedSchedule.film_id)?.title}
                            </h4>
                            <p className="text-xs text-red-500 font-semibold mt-1">{selectedSchedule.studio_name}</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">{selectedSchedule.date} | {selectedSchedule.time}</p>
                          </div>
                        </div>

                        {/* Order breakdown */}
                        <div className="space-y-3.5 text-xs text-slate-400 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                          <div className="flex justify-between">
                            <span>Harga Satuan Kursi</span>
                            <span className="font-mono text-white">Rp {selectedSchedule.price.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800/60 pt-2">
                            <span>Kursi Terpilih</span>
                            <span className="font-mono text-white">
                              {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'Belum memilih'}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800/60 pt-2">
                            <span>Jumlah Pengunjung</span>
                            <span className="font-mono text-white">{selectedSeats.length} Orang</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                            <span>Total Tagihan</span>
                            <span className="font-mono text-red-500">
                              Rp {(selectedSchedule.price * selectedSeats.length).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        {!completedBooking ? (
                          <button
                            onClick={handleCreateBooking}
                            disabled={selectedSeats.length === 0}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-sm py-2.5 rounded-xl transition-all"
                          >
                            Konfirmasi Booking Kursi
                          </button>
                        ) : (
                          <div className="space-y-4">
                            {/* Payment checkout steps */}
                            <div>
                              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Metode Pembayaran</label>
                              <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:border-red-500/50"
                              >
                                <option value="GoPay">E-Wallet: GoPay</option>
                                <option value="OVO">E-Wallet: OVO</option>
                                <option value="Virtual Account">Bank Transfer: Mandiri/BCA</option>
                                <option value="Credit Card">Credit Card</option>
                              </select>
                            </div>

                            {!completedPayment ? (
                              <button
                                onClick={handleProcessPayment}
                                disabled={isProcessingPayment}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                              >
                                {isProcessingPayment ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Memproses Bayar...</span>
                                  </>
                                ) : (
                                  <span>Bayar Sekarang (Simulasi)</span>
                                )}
                              </button>
                            ) : (
                              <div className="bg-green-950/40 border border-green-500/50 rounded-xl p-4 text-center">
                                <p className="text-green-400 text-xs font-bold flex items-center justify-center gap-1">
                                  <Check size={14} /> PEMBAYARAN SUKSES!
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">E-Ticket diterbitkan secara otomatis.</p>
                                <button
                                  onClick={() => {
                                    setSelectedSchedule(null);
                                    setSelectedSeats([]);
                                    setCompletedBooking(null);
                                    setCompletedPayment(null);
                                    setActiveTab('riwayat');
                                  }}
                                  className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-xs py-1.5 rounded-lg text-white font-bold"
                                >
                                  Buka Tiket Saya
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL JADWAL (Triggered when film details is opened) */}
                {selectedFilmForDetails && !selectedSchedule && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h3 className="font-extrabold text-xl text-white">Pilih Waktu & Studio</h3>
                        <button 
                          onClick={() => setSelectedFilmForDetails(null)} 
                          className="text-slate-400 hover:text-white text-xl font-light"
                        >
                          ×
                        </button>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <img 
                            src={selectedFilmForDetails.poster_url} 
                            alt="" 
                            className="w-full aspect-[3/4.2] object-cover rounded-xl border border-slate-800 shadow-md"
                          />
                          <h4 className="font-bold text-center mt-3 text-white text-sm">{selectedFilmForDetails.title}</h4>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4">
                          <p className="text-xs text-slate-400 leading-relaxed font-normal italic border-l-2 border-red-500 pl-3">
                            "{selectedFilmForDetails.synopsis}"
                          </p>

                          <div className="pt-3">
                            <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Jadwal Screening Tersedia</span>
                            
                            {getMovieSchedules(selectedFilmForDetails.id).length === 0 ? (
                              <p className="text-slate-500 text-xs">Jadwal belum ditambahkan untuk film ini.</p>
                            ) : (
                              <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
                                {getMovieSchedules(selectedFilmForDetails.id).map(sched => (
                                  <div 
                                    key={sched.id} 
                                    className="bg-slate-950 border border-slate-800 hover:border-red-500/40 p-3 rounded-xl flex items-center justify-between"
                                  >
                                    <div>
                                      <span className="text-xs font-bold text-red-500 block">{sched.studio_name}</span>
                                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                                        <span className="flex items-center gap-1 font-medium">
                                          <Calendar size={12} /> {sched.date}
                                        </span>
                                        <span className="flex items-center gap-1 font-mono font-bold text-slate-200">
                                          <Clock size={12} /> {sched.time}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <span className="block font-mono text-xs font-bold text-white mb-1.5">
                                        Rp {sched.price.toLocaleString('id-ID')}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setSelectedSchedule(sched);
                                          setSelectedFilmForDetails(null);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                                      >
                                        Pesan Kursi
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RIWAYAT TIKET/BOOKINGS */}
            {activeTab === 'riwayat' && (
              <div>
                <h3 className="text-xl font-bold mb-1">Tiket Bioskop Anda</h3>
                <p className="text-xs text-slate-400 mb-6">Tunjukkan E-Ticket / Barcode ini ke loket pintu studio untuk scan masuk.</p>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
                    <p className="text-sm text-slate-400 font-medium">Anda belum memesan tiket bioskop apa pun.</p>
                    <button
                      onClick={() => setActiveTab('katalog')}
                      className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-1.5 text-xs font-bold rounded-lg transition-all text-white"
                    >
                      Beli Tiket Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map(book => {
                      const sched = schedules.find(s => s.id === book.schedule_id);
                      const film = sched ? films.find(f => f.id === sched.film_id) : null;
                      const associatedPay = payments.find(p => p.booking_id === book.id);

                      return (
                        <div 
                          key={book.id} 
                          className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                        >
                          {/* Inner ticket header */}
                          <div className="p-5 border-b border-dashed border-slate-800 bg-slate-950/60 relative">
                            {/* Left/right circular notches to resemble movie tickets */}
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950"></div>
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950"></div>

                            <div className="flex items-start justify-between">
                              <div>
                                <span className="bg-green-600/25 border border-green-500/50 text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                  {book.status === 'confirmed' ? 'TERKONFIRMASI (LUNAS)' : 'BELUM BAYAR'}
                                </span>
                                <h4 className="font-extrabold text-base text-white mt-2 leading-tight">{film?.title}</h4>
                                <p className="text-xs text-red-500 font-bold mt-1 uppercase tracking-tight">{sched?.studio_name}</p>
                              </div>
                              <span className="text-slate-500 font-mono text-[9px]">ID: #{book.id}</span>
                            </div>
                          </div>

                          {/* Detail body */}
                          <div className="p-5 grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Waktu Tayang</span>
                              <span className="text-white font-mono mt-0.5 block">{sched?.date} | {sched?.time}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Kursi Anda</span>
                              <span className="text-white mt-0.5 block font-bold text-sm tracking-widest">{book.seats.sort().join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Metode Pembayaran</span>
                              <span className="text-slate-300 mt-0.5 block font-medium">{associatedPay?.payment_method || 'GoPay (Demo)'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase font-semibold text-[10px]">Total Dibayar</span>
                              <span className="text-emerald-400 mt-0.5 block font-mono font-bold">
                                Rp {associatedPay?.amount.toLocaleString('id-ID') || '50.000'}
                              </span>
                            </div>
                          </div>

                          {/* Ticket barcode scanner emulation */}
                          <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col items-center justify-center">
                            {/* Barcode line emulator */}
                            <div className="h-10 w-full flex items-stretch gap-1 max-w-[240px] opacity-80 mb-2">
                              {[3,2,4,1,2,5,1,3,2,4,3,1,2,4,2,3,1,5,3,2,4,1,3,2].map((w,i) => (
                                <div key={i} className="bg-white flex-1" style={{ opacity: w/6 }}></div>
                              ))}
                            </div>
                            <span className="text-slate-500 font-mono text-[10px] tracking-[4px]">#{book.id * 2}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADMIN CRUD PANEL */}
            {activeTab === 'admin' && currentUser.role === 'admin' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Panel Manajemen Film</h3>
                    <p className="text-xs text-slate-400">Kelola rilis judul dan katalog film untuk seluruh studio.</p>
                  </div>
                  <button
                    onClick={handleOpenCreateFilm}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle size={15} />
                    <span>Upload Film</span>
                  </button>
                </div>

                {/* Form area if open */}
                {crudAction && (
                  <form onSubmit={handleSubmitFilmForm} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 space-y-4">
                    <h4 className="font-extrabold text-base text-white border-b border-slate-800 pb-3">
                      {crudAction === 'create' ? 'Input Form Film Bioskop Baru' : 'Edit Informasi Detail Film'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">JUDUL FILM</label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">GENRE</label>
                        <select
                          value={formGenre}
                          onChange={(e) => setFormGenre(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-300 focus:outline-none focus:border-red-500/50"
                        >
                          {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">DURASI (MENIT)</label>
                        <input
                          type="number"
                          required
                          value={formDuration}
                          onChange={(e) => setFormDuration(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">RATING (1.0 - 10.0)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          min="1"
                          max="10"
                          value={formRating}
                          onChange={(e) => setFormRating(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">POSTER IMAGE URL</label>
                      <input
                        type="url"
                        value={formPoster}
                        onChange={(e) => setFormPoster(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">SINOPSIS CERITA</label>
                      <textarea
                        rows={3}
                        required
                        value={formSynopsis}
                        onChange={(e) => setFormSynopsis(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setCrudAction(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        Simpan Data
                      </button>
                    </div>
                  </form>
                )}

                {/* Listing Grid for Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-slate-300">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 font-bold uppercase tracking-wider text-slate-400">
                          <th className="px-5 py-3">ID & Poster</th>
                          <th className="px-5 py-3">Judul Rilis</th>
                          <th className="px-5 py-3">Genre</th>
                          <th className="px-5 py-3">Durasi</th>
                          <th className="px-5 py-3">Rating</th>
                          <th className="px-5 py-3 text-right">Kelola</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {films.map(film => (
                          <tr key={film.id} className="hover:bg-slate-950/45 transition-all">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img src={film.poster_url} className="w-10 h-13 rounded object-cover bg-slate-800" alt="" />
                                <span className="font-mono text-[10px] text-slate-500">#{film.id}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-bold text-slate-100">{film.title}</td>
                            <td className="px-5 py-3.5 mb-1.5 inline-block mt-3.5 bg-slate-800 font-bold rounded px-2 text-[10px] uppercase text-slate-300">
                              {film.genre}
                            </td>
                            <td className="px-5 py-3.5 font-mono">{film.duration} Mins</td>
                            <td className="px-5 py-3.5 text-yellow-500 font-bold">★ {film.rating}</td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-400">
                                <button
                                  onClick={() => handleOpenEditFilm(film)}
                                  className="p-1.5 hover:text-amber-500 hover:bg-slate-800 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteFilm(film.id)}
                                  className="p-1.5 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* LOGGED OUT GATE */
          <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-500">Security Gate</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Autentikasi Pengguna</h3>
              <p className="text-xs text-slate-400 mt-1">Silakan isi form login atau daftarkan akun baru.</p>
            </div>

            {errorMessage && (
              <div className="bg-red-950/40 border border-red-500 text-red-200 p-3 rounded-xl text-xs text-center mb-4">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-950/40 border border-green-500 text-green-200 p-3 rounded-xl text-xs text-center mb-4 flex items-center justify-center gap-1">
                <Check size={14} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input
                      type="text"
                      placeholder="Masukkan nama Anda"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                {authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-red-500 hover:text-red-400 font-bold text-xs"
                >
                  {authMode === 'login' ? 'Belum punya akun? Buat baru' : 'Sudah punya akun? Masuk'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>


    </div>
  );
}
