// ==== GENERIC INTERFACE ====
// JUDUL: 7. GENERIC INTERFACE (INTERFACE GENERIC)
// REFERENSI: TypeScript Handbook (pengayaan — topik tidak ada di PDF kelas)
// ====

// (1) Dasar: Generic Interface untuk Bentuk Data
// ==============================================
// Kita sudah banyak menyentuh generic interface kecil (Box, ApiResponse di
// materi 6). Sekarang sistematis: interface generic mendeskripsikan KONTRAK
// BENTUK — properti sekaligus method — untuk tipe apapun.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: abstract class Paged<T> { List<T> items; int page; ... }
//       (Dart klasik memakai abstract class sebagai interface;
//        Dart 3 juga punya modifier interface class)
// TypeScript: interface murni kontrak bentuk — tanpa implementasi apa pun.
interface User {
  id: number;
  name: string;
}

interface Paged<T> {
  items: T[];
  page: number;
  total: number;
  describe(): string;
}

// Cetak hasil
console.log("// (1) Hasil Paged<User>:");
const userPage: Paged<User> = {
  items: [
    { id: 1, name: "Budi" },
    { id: 2, name: "Siti" },
  ],
  page: 1,
  total: 2,
  describe() {
    return `halaman ${this.page} dari ${this.total}, isi ${this.items.length}`;
  },
};
console.log(userPage.describe()); // halaman 1 dari 2, isi 2
console.log(userPage.items); // [ { id: 1, name: 'Budi' }, { id: 2, name: 'Siti' } ]

// Analogi Dart: Paged<User> di Dart juga menampung List<User> — kontrak sama.
// TypeScript: Satu interface dipakai ulang untuk semua T: Paged<User>, Paged<Product>, dst.

// (2) Call Signature: Interface untuk Bentuk Fungsi
// ==============================================
// Interface bisa mendeskripsikan BENTUK FUNGSI lewat call signature —
// materi 1 sempat melihat GenericIdentityFn, sekarang kita dalami.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: typedef Mapper<S, R> = R Function(S); — typedef = cara Dart
//       mendeskripsikan bentuk fungsi.
// TypeScript: Call signature (input: T): U di dalam interface.
interface Mapper<T, U> {
  (input: T): U;
}

// Cetak hasil
console.log("\n// (2) Hasil Mapper<string, number>:");
const lengthOf: Mapper<string, number> = (s) => s.length;
console.log(lengthOf("hello")); // 5 - s ter-infer string dari Mapper, tanpa anotasi!

// Pemanggilan dengan tipe salah ditolak:
// lengthOf(42);
// ERROR TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

// Analogi Dart: lengthOf bertipe Mapper<String, int> di Dart — panggil dengan int ditolak.
// TypeScript: Sekali kontrak ditulis, semua pemakaian diperiksa compiler.

// (3) Interface dengan Method: Kontrak Repository
// ==============================================
// Generic interface paling sering dipakai sebagai KONTRAK OPERASI —
// repository pattern: sekali definisikan kontrak, implementasi bebas.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: abstract class Repository<T> { List<T> getAll(); ... }
//       lalu class konkret yang extends/implements.
// TypeScript: Object literal langsung bisa mengimplementasikan interface.
interface Repository<T> {
  getAll(): T[];
  findById(id: number): T | undefined;
  save(item: T): T;
}

// Cetak hasil
console.log("\n// (3) Hasil Repository<User> (implementasi object literal):");
const userRepo: Repository<User> = {
  getAll() {
    return [
      { id: 1, name: "Budi" },
      { id: 2, name: "Siti" },
    ];
  },
  findById(id) {
    return this.getAll().find((u) => u.id === id);
  },
  save(item) {
    return item;
  },
};
console.log(userRepo.getAll()); // [ { id: 1, name: 'Budi' }, { id: 2, name: 'Siti' } ]
console.log(userRepo.findById(2)); // { id: 2, name: 'Siti' }
console.log(userRepo.findById(9)); // undefined
console.log(userRepo.save({ id: 3, name: "Ani" })); // { id: 3, name: 'Ani' }

// Implementasi yang tidak lengkap langsung ditolak:
// const badRepo: Repository<User> = {
//   getAll() {
//     return [];
//   },
// };
// ERROR TS2739: Type '{ getAll(): never[]; }' is missing the following properties from type 'Repository<User>': findById, save

// Analogi Dart: class Dart yang implements Repository<User> tapi lupa findById
// juga error compile — jaminan kontrak sama.
// TypeScript: findById(id) dan save(item) tidak perlu anotasi tipe — ter-infer dari interface!

// (4) Multiple Type Parameters + Properti dalam Interface
// ==============================================
// Interface generic boleh punya BANYAK type parameter, properti biasa,
// DAN method sekaligus — pas untuk kontrak "mesin konversi".
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: abstract class Converter<From, To> { String get name; To convert(From value); }
// TypeScript: Sama persis strukturnya — hanya tanpa get keyword.
interface Converter<From, To> {
  name: string;
  convert(value: From): To;
}

// Cetak hasil
console.log("\n// (4) Hasil Converter<From, To>:");
const toLength: Converter<string, number> = {
  name: "toLength",
  convert(value) {
    return value.length;
  },
};
const toHex: Converter<number, string> = {
  name: "toHex",
  convert(value) {
    return `0x${value.toString(16).toUpperCase()}`;
  },
};
console.log(toLength.convert("kilo")); // 4
console.log(toHex.convert(255)); // 0xFF

// Analogi Dart: Converter<String, int> dan Converter<int, String> dua konfigurasi
// dari kontrak yang sama — tidak perlu dua abstract class berbeda.
// TypeScript: convert(value) ter-infer parameternya: string untuk toLength, number untuk toHex.

// (5) Studi Kasus: Emitter ala Listener Flutter
// ==============================================
// Pola paling familier buat Flutter developer: daftarkan listener, panggil
// event — semua bertipe aman lewat generic interface.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: Flutter: controller.addListener(() { ... }) dan typedef ValueChanged<T>;
//       listener menerima nilai bertipe T.
// TypeScript: Emitter<E> dengan listener (e: E) => void — E dikunci saat dibuat.
interface ClickEvent {
  x: number;
  y: number;
}

interface Emitter<E> {
  on(listener: (e: E) => void): void;
  emit(e: E): void;
}

function createEmitter<E>(): Emitter<E> {
  const listeners: Array<(e: E) => void> = [];
  return {
    on(listener) {
      listeners.push(listener);
    },
    emit(e) {
      listeners.forEach((l) => l(e));
    },
  };
}

// Cetak hasil
console.log("\n// (5) Hasil Emitter<ClickEvent>:");
const clickEmitter = createEmitter<ClickEvent>();
clickEmitter.on((e) => console.log(`klik di ${e.x},${e.y}`)); // e ter-infer ClickEvent!
clickEmitter.emit({ x: 10, y: 20 }); // klik di 10,20

// Parameter listener yang salah ketik langsung ketahuan:
// clickEmitter.on((e) => console.log(e.z));
// ERROR TS2339: Property 'z' does not exist on type 'ClickEvent'.

// Analogi Dart: addListener di Flutter + ValueChanged<T> — listener mengetahui
// tipe event tanpa cast. Sama rasa, sama jaminan.
// TypeScript: createEmitter<ClickEvent>() sekali — semua listener terkunci tipe event itu.

// ==== RANGKUMAN ====
// 1. Generic interface = kontrak bentuk untuk tipe apapun: properti + method sekaligus
// 2. Call signature ((input: T): U) mendeskripsikan bentuk fungsi — paralel typedef Dart
// 3. Object literal bisa langsung mengimplementasikan interface — implementasi tidak
//    lengkap ditolak (TS2739)
// 4. Parameter method object literal ter-infer dari interface — tanpa anotasi manual
// 5. Studi kasus Emitter<E> = listener pattern Flutter dengan tipe event terkunci aman
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat interface generic 'Wrapper' dengan method get() dan set(value),
//    lalu fungsi createWrapper yang memakai closure untuk menyimpan nilai.
interface Wrapper<T> {
  get(): T;
  set(value: T): void;
}

function createWrapper<T>(initial: T): Wrapper<T> {
  let value = initial;
  return {
    get: () => value,
    set: (v) => {
      value = v;
    },
  };
}

console.log("\n// Latihan 1: Wrapper");
const w = createWrapper(10); // Wrapper<number>
console.log(w.get()); // 10
w.set(99);
console.log(w.get()); // 99

// 2. Buat interface generic 'Predicate' (call signature) yang menerima T dan
//    mengembalikan boolean — lalu buat isLong untuk string panjang > 3.
interface Predicate<T> {
  (value: T): boolean;
}

const isLong: Predicate<string> = (s) => s.length > 3;

console.log("\n// Latihan 2: Predicate");
console.log(isLong("hello")); // true
console.log(isLong("hi")); // false

// 3. Buat interface generic 'Store' dengan dua type parameter (key, value)
//    dan implementasi berbasis Map.
interface Store<K, V> {
  set(key: K, value: V): void;
  get(key: K): V | undefined;
}

function createStore<K, V>(): Store<K, V> {
  const map = new Map<K, V>();
  return {
    set(key, value) {
      map.set(key, value);
    },
    get(key) {
      return map.get(key);
    },
  };
}

console.log("\n// Latihan 3: Store");
const store = createStore<string, number>();
store.set("a", 1);
store.set("b", 2);
console.log(store.get("a")); // 1
console.log(store.get("z")); // undefined

// 4. Buat interface generic 'Formatter' dengan properti label dan method
//    format — lalu implementasi rupiah untuk number.
interface Formatter<T> {
  label: string;
  format(value: T): string;
}

const rupiah: Formatter<number> = {
  label: "IDR",
  format(value) {
    return `Rp${value.toLocaleString("id-ID")}`;
  },
};

console.log("\n// Latihan 4: Formatter");
console.log(rupiah.format(1500000)); // Rp1.500.000

// 5. Buat interface generic 'Comparator' (call signature dua parameter)
//    dan pakai untuk sort array string berdasarkan panjangnya.
interface Comparator<T> {
  (a: T, b: T): number;
}

const byLength: Comparator<string> = (a, b) => a.length - b.length;

console.log("\n// Latihan 5: Comparator");
console.log(["pear", "fig", "apple"].sort(byLength)); // [ 'fig', 'pear', 'apple' ]
// ====
