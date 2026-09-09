// ========================================
// LATIHAN MIDDLE 5 — PROFIL UPDATE (KEYOF + COPYWITH)
// ========================================
// Level: Middle
// Konsep: setProperty pattern <T, K extends keyof T> (materi 5)
// Program: mengubah satu field profil secara immutable, ala copyWith Flutter.

// ========================================
// SOAL
// ========================================
// Aplikasi profil user perlu update satu field TANPA mengubah objek asli
// (persis pola copyWith di Flutter).
// 1. Buat interface Profile dengan name: string, age: number, city: string.
// 2. Buat function generic updateProfile<T, K extends keyof T>(profile: T,
//    field: K, value: T[K]): T yang mengembalikan SALINAN baru dengan satu
//    field diganti — objek asli tidak boleh berubah.
// 3. Uji: pindah kota (city) dan ulang tahun (age), lalu buktikan objek
//    asli masih utuh.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) INTERFACE PROFILE — data profil user.
// ------------------------------------------------------------------
interface Profile {
  name: string;
  age: number;
  city: string;
}

// ------------------------------------------------------------------
// (2) UPDATEPROFILE — spread ...profile menyalin semua field lama,
//     lalu [field]: value menimpa SATU field yang dituju.
//     value dikunci T[K]: string untuk "name", number untuk "age" —
//     tukar-tukar tipe langsung ditolak compiler.
//     (Jika di Dart: copyWith harus ditulis MANUAL per field:
//      Profile copyWith({String? name, int? age, String? city}) =>
//        Profile(name: name ?? this.name, ...);
//      updateProfile generic = copyWith serbaguna SEKALI tulis)
// ------------------------------------------------------------------
function updateProfile<T, K extends keyof T>(profile: T, field: K, value: T[K]): T {
  return { ...profile, [field]: value };
}

// ------------------------------------------------------------------
// (3) UJI IMMUTABLE — hasil baru lahir, objek asli tak tersentuh.
// ------------------------------------------------------------------
const budi: Profile = { name: "Budi", age: 30, city: "Jakarta" };

const pindah = updateProfile(budi, "city", "Bandung");
console.log(pindah); // { name: 'Budi', age: 30, city: 'Bandung' }
console.log(budi.city); // Jakarta  (asli TIDAK berubah — immutable)

const ulangTahun = updateProfile(budi, "age", 31);
console.log(ulangTahun); // { name: 'Budi', age: 31, city: 'Jakarta' }

// ========================================
// RANGKUMAN
// ========================================
// - { ...profile, [field]: value } = resep immutable update satu field.
// - value: T[K] mengunci tipe per field — salah tipe nilai = error compile.
// - Salah nama field juga ditolak: K extends keyof T (materi 5).
//   (Jika di Dart: copyWith per class ditulis tangan satu per satu;
//    di TS satu fungsi generic untuk SEMUA class/objek)
// - Objek asli tetap utuh — kebiasaan baik dari dunia Flutter/state management.
