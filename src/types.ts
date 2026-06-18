/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Film {
  id: number;
  title: string;
  genre: string;
  duration: number; // in minutes
  release_date: string;
  poster_url: string;
  synopsis: string;
  rating: number; // e.g., 4.5
}

export interface Schedule {
  id: number;
  film_id: number;
  studio_name: string; // e.g., Studio 1, Studio 2
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  price: number;
}

export interface Booking {
  id: number;
  user_id: number;
  schedule_id: number;
  seats: string[]; // e.g., ["A1", "A2"]
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: string; // GoPay, OVO, Transfer, Credit Card
  payment_date: string;
  status: 'pending' | 'success' | 'failed';
}
