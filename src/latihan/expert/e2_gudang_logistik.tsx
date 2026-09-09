// ========================================
// LATIHAN EXPERT 2 — GUDANG LOGISTIK
// ========================================
// Level: Expert
// Konsep: class extends class generic + override + super (materi 9)
// Program: gudang dengan kapasitas terbatas — barang kelebihan ditolak
//          oleh subclass yang meng-override method store induk.

// ========================================
// SOAL
// ========================================
// Gudang logistik punya aturan: kapasitas maksimal.
// 1. Buat class generic 'Storage<T>' dengan protected items, method
//    store(item): boolean dan size(): number.
// 2. Buat class 'LimitedStorage<T> extends Storage<T>' dengan field
//    capacity — override store agar menolak (return false) saat penuh,
//    dan menerima via super.store saat masih ada ruang.
// 3. Uji dengan kapasitas 2: dua paket masuk, paket ketiga ditolak —
//    size tetap 2.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) INDUK GENERIC — store mengembalikan boolean dari awal agar
//     SUBCLASS bisa override dengan signature sama dan mengubah
//     maknanya (diterima/ditolak). items protected = subclass boleh
//     membaca, dunia luar tidak.
//     (Jika di Dart: Dart TIDAK punya keyword protected — yang ada
//       konvensi _items (private per LIBRARY): subclass di file lain
//       tidak bisa akses. protected TS = subclass SELALU bisa —
//       recall materi 9 bagian protected)
// ------------------------------------------------------------------
class Storage<T> {
  protected items: T[] = [];

  store(item: T): boolean {
    this.items.push(item);
    return true;
  }

  size(): number {
    return this.items.length;
  }
}

// ------------------------------------------------------------------
// (2) SUBCLASS + OVERRIDE + SUPER — LimitedStorage mengecek this.items
//     (akses protected dari induk) sebelum menerima. Pengecekan BARU
//     di anak, penyimpanan tetap di induk lewat super.store(item) —
//     tidak ada duplikasi logika push.
//     (Jika di Dart: @override bool store(T item) { if (_items.length
//       >= capacity) return false; return super.store(item); } —
//       bentuknya sama persis; Dart lazimnya menandai override dengan
//       @override — opsional di level bahasa, diwajibkan lint)
// ------------------------------------------------------------------
interface Package {
  code: string;
  weight: number;
}

class LimitedStorage<T> extends Storage<T> {
  constructor(private capacity: number) {
    super();
  }

  store(item: T): boolean {
    if (this.items.length >= this.capacity) {
      return false;
    }
    return super.store(item);
  }
}

// ------------------------------------------------------------------
// (3) UJI KAPASITAS — dua paket pertama diterima (true), paket ketiga
//     ditolak (false) karena this.items.length >= capacity.
// ------------------------------------------------------------------
const gudang = new LimitedStorage<Package>(2);
console.log(gudang.store({ code: "PKG-1", weight: 3 })); // true
console.log(gudang.store({ code: "PKG-2", weight: 1 })); // true
console.log(gudang.store({ code: "PKG-3", weight: 5 })); // false  (gudang penuh)
console.log(gudang.size()); // 2

// ========================================
// RANGKUMAN
// ========================================
// - Class generic mewarisi class generic: LimitedStorage<T> extends
//   Storage<T> — subclass tetap generik, T tetap mengalir.
// - Override menambah aturan SEBELUM menerima; super.store(item)
//   memakai logika induk tanpa menyalinnya.
// - Return type override HARUS sama dengan induk (boolean = boolean) —
//   signature cocok, perilakunya yang diperketat.
// - protected memungkinkan subclass membaca this.items langsung.
//   (Jika di Dart: tidak ada keyword protected — _items underscore berarti
//     private per LIBRARY, subclass di file lain tidak bisa akses;
//     protected TypeScript = subclass selalu bisa)
