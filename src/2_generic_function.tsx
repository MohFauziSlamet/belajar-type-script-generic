// ==== GENERIC FUNCTION ====
// JUDUL: 2. GENERIC FUNCTION (FUNGSI GENERIC)
// REFERENSI: docs/TypeScript Generic.pdf (TypeScript Handbook - Generics)
// ====

// (1) Fungsi Generic Dasar
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: T identity<T>(T value) => value;
// TypeScript: Fungsi generic dengan type parameter
function identity<T>(arg: T): T {
  return arg;
}

// Cetak hasil
console.log("// (1) Hasil identity<T>:");
console.log(identity<string>("hello")); // 'hello' - explicit type
console.log(identity(42)); // 42 - type inference
console.log(identity(true)); // true - type inference

// Catatan: TypeScript menggunakan type inference secara otomatis
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: var result = identity("hello");
// TypeScript: TypeScript akan secara otomatis menentukan tipe T sebagai string
console.log("// (1) Hasil type inference:");
const result = identity("hello");
console.log(result); // 'hello' (tipe: string)

// Analogi Dart: Function generic di Dart
// TypeScript: <T> bekerja seperti T di Dart generic function

// (2) Fungsi dengan Multiple Type Parameters
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: MapEntry<K, V> createEntry<K, V>(K key, V value) => MapEntry(key, value);
// TypeScript: Fungsi dengan multiple type parameters
function createPair<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

// Cetak hasil
console.log("\n// (2) Hasil createPair<K, V>:");
console.log(createPair("name", "John")); // { key: 'name', value: 'John' }
console.log(createPair(1, "one")); // { key: 1, value: 'one' }
console.log(createPair(true, 100)); // { key: true, value: 100 }

// Analogi Dart: Function dengan multiple generic types di Dart
// TypeScript: <K, V> bekerja seperti dua type parameter di Dart

// (3) Fungsi dengan Return Type yang Berbeda
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: T? first<T>(List<T> list) => list.isEmpty ? null : list.first;
//       (list.first Dart melempar error saat kosong — versi TS kita aman undefined)
// TypeScript: Fungsi yang mengembalikan tipe yang sama dengan input
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Cetak hasil
console.log("\n// (3) Hasil firstElement<T>:");
console.log(firstElement([1, 2, 3])); // 1
console.log(firstElement(["a", "b", "c"])); // 'a'
console.log(firstElement([])); // undefined

// Analogi Dart: Function yang mengembalikan tipe yang sama dengan input di Dart
// TypeScript: Return type T sama dengan tipe input T

// (4) Fungsi dengan Constraint pada Type Parameter
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: int length<T extends List>(T list) => list.length;
// TypeScript: Fungsi dengan constraint pada type parameter
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Sekarang aman karena T memiliki .length
  return arg;
}

// Cetak hasil
console.log("\n// (4) Hasil loggingIdentity<T extends Lengthwise>:");
console.log(loggingIdentity({ length: 10, value: "test" })); // { length: 10, value: 'test' }
console.log(loggingIdentity([1, 2, 3, 4])); // [ 1, 2, 3, 4 ]

// Nilai tanpa .length ditolak:
// loggingIdentity(42);
// ERROR TS2345: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.

// Analogi Dart: Generic constraint di Dart (T extends num, T extends List — materi 4)
// TypeScript: T extends Lengthwise memastikan tipe memiliki .length property

// (5) Fungsi dengan Default Type Parameter
// ==============================================
// Default type parameter = tipe pengganti OTOMATIS saat T tidak ditentukan.
// Contoh yang bersih: T muncul di parameter sehingga TIDAK perlu paksaan cast.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: TIDAK punya default type parameter — tanpa argumen tipe jatuh ke
//       dynamic implisit dan tidak bisa dikontrol.
// TypeScript: T = string menjadi tipe pengganti default (didalami di materi 6).
function withDefault<T = string>(value: T | undefined, fallback: T): T {
  return value ?? fallback;
}

// Cetak hasil
console.log("\n// (5) Hasil withDefault<T = string>:");
console.log(withDefault("halo", "kosong")); // 'halo' - nilai ada, fallback tak dipakai
console.log(withDefault(undefined, "kosong")); // 'kosong' - nilai undefined → fallback
console.log(withDefault<number | undefined>(undefined, 0)); // 0 - eksplisit menimpa default

// Analogi Dart: value ?? fallback bekerja seperti ?? null-safety Dart — familier.
// TypeScript: Satu fungsi, dua perilaku tipe — string (default) atau number (eksplisit).

// ==== RANGKUMAN ====
// 1. Fungsi generic menggunakan type parameter (<T>) untuk bekerja dengan berbagai tipe
// 2. Multiple type parameters (<K, V>) memungkinkan bekerja dengan dua tipe berbeda
// 3. Constraint (<T extends Lengthwise>) membatasi tipe yang bisa digunakan
// 4. Default type parameter (<T = string>) = tipe pengganti saat T tidak ditentukan
// 5. Fungsi generic lebih fleksibel dari fungsi spesifik atau any
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================
// 1. Buat fungsi generic 'lastElement' yang mengembalikan elemen terakhir dari array
function lastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

console.log("\n// Latihan 1: lastElement");
console.log(lastElement([1, 2, 3])); // 3
console.log(lastElement(["a", "b", "c"])); // 'c'
console.log(lastElement([])); // undefined

// 2. Buat fungsi generic 'reverseArray' yang membalik urutan array
function reverseArray<T>(arr: T[]): T[] {
  return arr.slice().reverse();
}

console.log("\n// Latihan 2: reverseArray");
console.log(reverseArray([1, 2, 3])); // [ 3, 2, 1 ]
console.log(reverseArray(["a", "b", "c"])); // [ 'c', 'b', 'a' ]

// 3. Buat fungsi generic 'getProperty' yang mengambil properti dari objek
//    (constraint keyof didalami di materi 5 — di sini cukup pakai polanya)
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

console.log("\n// Latihan 3: getProperty");
const person = { name: "John", age: 30 };
console.log(getProperty(person, "name")); // 'John'
console.log(getProperty(person, "age")); // 30

// 4. Buat fungsi generic 'filterArray' yang memfilter array berdasarkan kondisi
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

console.log("\n// Latihan 4: filterArray");
console.log(filterArray([1, 2, 3, 4, 5], (num) => num > 2)); // [ 3, 4, 5 ]
console.log(filterArray(["a", "b", "c", "d"], (str) => str !== "b")); // [ 'a', 'c', 'd' ]

// 5. Buat fungsi generic 'wrapInArray' dengan default type parameter
function wrapInArray<T = string>(value: T): T[] {
  return [value];
}

console.log("\n// Latihan 5: wrapInArray");
console.log(wrapInArray("hello")); // [ 'hello' ] - T di-infer string dari argumen
console.log(wrapInArray<number>(42)); // [ 42 ] - eksplisit
console.log(wrapInArray([1, 2])); // [ [ 1, 2 ] ] - T di-infer number[]
// ====