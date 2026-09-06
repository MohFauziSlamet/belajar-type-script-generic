// ==== GENERIC KEYOF CONSTRAINT ====
// JUDUL: 5. CONSTRAINT keyof (<T, K extends keyof T>)
// REFERENSI: docs/TypeScript Generic.pdf (TypeScript Handbook - Generics)
// ====

// (1) Masalah: Akses Properti via String
// ==============================================
// Sering kita butuh mengambil properti objek dari NILAI string (mis. dari input
// user atau config). Tanpa keyof, TypeScript menolak akses tersebut.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: Objek biasa TIDAK BISA diakses via string (obj["name"] hanya untuk Map).
//       Data dinamis biasanya pakai Map<String, dynamic> — type safety hilang.
//       (dart:mirrors/reflection tidak tersedia di Flutter.)
// TypeScript: Coba akses properti via string biasa (GAGAL):
interface Person {
  id: number;
  name: string;
  email: string;
}

// function getByString(obj: Person, key: string) {
//   return obj[key];
// }
// ERROR TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Person'.
//   No index signature with a parameter of type 'string' was found on type 'Person'.

// Kalau dipaksa pakai any, key salah ketik tidak ketahuan compiler.
// Solusinya: batasi key hanya ke nama properti yang ADA → itulah keyof.

// (2) keyof T = Union Semua Key
// ==============================================
// keyof T menghasilkan UNION LITERAL semua nama properti milik T.
// keyof hanya hidup di LEVEL TIPE — hilang saat kompilasi ke JS (seperti generic).
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: Tidak ada fitur setara — yang paling dekat adalah daftar nama field yang
//       dijaga MANUAL. keyof menghitungnya OTOMATIS dari tipe.
// TypeScript: type PersonKeys = keyof Person → "id" | "name" | "email"
type PersonKeys = keyof Person;

// Cetak hasil (nilai keyof tidak bisa dicetak — tapi nilai valid bisa disimpan)
console.log("// (2) Hasil keyof Person:");
const kValid: PersonKeys = "name"; // valid — "name" termasuk union
console.log(kValid); // name

// Nilai di luar daftar key ditolak compiler:
// const kSalah: PersonKeys = "nama";
// ERROR TS2322: Type '"nama"' is not assignable to type 'keyof Person'.

// Analogi Dart: Seperti enum yang isinya semua nama field, tapi di-generate otomatis.
// TypeScript: Salah ketik "nama" vs "name" langsung ketahuan SEBELUM program jalan.

// (3) getProperty: <T, K extends keyof T> + Indexed Access T[K]
// ==============================================
// Di latihan materi 2 kita sudah memakai getProperty. Sekarang kita pahami
// cara kerjanya: K dibatasi keyof T, dan tipe HASILNYA adalah T[K]
// (dibaca: "tipe nilai properti K pada T") — disebut indexed access type.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: map["name"] as String — butuh cast manual dan bisa salah saat runtime.
// TypeScript: T[K] dihitung otomatis — tanpa cast, tanpa risiko runtime.
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Cetak hasil
console.log("\n// (3) Hasil getProperty<T, K extends keyof T>:");
const person: Person = { id: 1, name: "Budi", email: "budi@mail.com" };
console.log(getProperty(person, "name")); // Budi
console.log(typeof getProperty(person, "id")); // number - T[K] = number, terjaga!
console.log(typeof getProperty(person, "email")); // string - T[K] = string, terjaga!

// Key yang tidak ada ditolak compiler:
// getProperty(person, "nama");
// ERROR TS2345: Argument of type '"nama"' is not assignable to parameter of type 'keyof Person'.

// Analogi Dart: Map<String, dynamic> + cast vs TypeScript akses aman via keyof.
// TypeScript: Salah key = error compile, bukan undefined misterius saat runtime.

// (4) setProperty: Pattern copyWith ala Flutter
// ==============================================
// keyof juga dipakai untuk UPDATE properti secara immutable — persis pola
// copyWith yang sangat familier di Flutter.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class Person { final String name; ...
//       Person copyWith({String? name, ...}) => Person(name: name ?? this.name, ...);
//       (copyWith harus ditulis MANUAL per field!)
// TypeScript: setProperty generic SEKALI untuk semua field di semua tipe
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

// Cetak hasil
console.log("\n// (4) Hasil setProperty<T, K extends keyof T>:");
console.log(setProperty(person, "email", "baru@mail.com")); // { id: 1, name: 'Budi', email: 'baru@mail.com' }
console.log(person.email); // budi@mail.com - objek asli TIDAK berubah (immutable)

// Analogi Dart: copyWith per class di Dart; setProperty satu fungsi untuk semua.
// TypeScript: value juga dikunci T[K] — isi string untuk key "id" (number) ditolak.

// (5) Studi Kasus: pluck — Ambil Satu Kolom dari Array Objek
// ==============================================
// Pattern nyata: ambil daftar nama dari daftar user, daftar id dari daftar
// produk, dst — cukup satu fungsi generic.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: users.map((u) => u.name).toList(); — harus tulis per field.
// TypeScript: pluck(people, "name") — satu fungsi untuk SEMUA field.
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

// Cetak hasil
console.log("\n// (5) Hasil pluck<T, K extends keyof T>:");
const people: Person[] = [
  { id: 1, name: "Budi", email: "budi@mail.com" },
  { id: 2, name: "Siti", email: "siti@mail.com" },
];
console.log(pluck(people, "name")); // [ 'Budi', 'Siti' ] - hasil bertipe string[]
console.log(pluck(people, "id")); // [ 1, 2 ] - hasil bertipe number[]

// Analogi Dart: map + akses field manual di Dart per kasus.
// TypeScript: Tipe hasil (T[K][]) ikut menyesuaikan key — number[] atau string[].

// ==== RANGKUMAN ====
// 1. keyof T = union literal semua nama properti T ("id" | "name" | "email")
// 2. keyof hidup di level tipe saja — hilang saat kompilasi ke JS
// 3. <K extends keyof T> membatasi key hanya properti yang ADA — salah ketik = error compile
// 4. T[K] (indexed access) = tipe nilai properti — hasil akses tetap type-safe tanpa cast
// 5. Pattern umum: getProperty (baca), setProperty (copyWith immutable), pluck (kolom array)
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat fungsi generic 'keys' yang mengembalikan semua nama properti objek
//    dengan tipe (keyof T)[] — bukan sekadar string[].
function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

console.log("\n// Latihan 1: keys");
console.log(keys(person)); // [ 'id', 'name', 'email' ]

// 2. Buat fungsi generic 'getOrDefault' yang mengembalikan nilai properti,
//    atau fallback jika properti optional dan belum diisi (undefined).
function getOrDefault<T, K extends keyof T>(obj: T, key: K, fallback: T[K]): T[K] {
  return obj[key] ?? fallback;
}

console.log("\n// Latihan 2: getOrDefault");
interface Settings {
  theme?: string;
  volume?: number;
}
const settings: Settings = { theme: "dark" };
console.log(getOrDefault(settings, "volume", 50)); // 50 - volume belum diisi
console.log(getOrDefault(settings, "theme", "light")); // dark - sudah ada isinya

// 3. Buat fungsi generic 'pick' yang mengambil sebagian properti objek.
//    Return type memakai utility type bawaan: Pick<T, K> (subset properti T).
function pick<T, K extends keyof T>(obj: T, props: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of props) {
    result[key] = obj[key];
  }
  return result;
}

console.log("\n// Latihan 3: pick");
console.log(pick(person, ["id", "name"])); // { id: 1, name: 'Budi' }

// 4. Buat fungsi generic 'describeProperty' yang mengembalikan deskripsi
//    "namaProperti bertipe x" berdasarkan tipe nilainya saat runtime.
function describeProperty<T, K extends keyof T>(obj: T, key: K): string {
  return `${String(key)} bertipe ${typeof obj[key]}`;
}

console.log("\n// Latihan 4: describeProperty");
console.log(describeProperty(person, "id")); // id bertipe number
console.log(describeProperty(person, "email")); // email bertipe string

// 5. Buat fungsi generic 'setAll' yang mengubah SATU properti pada SEMUA item
//    array secara immutable — gabungan setProperty + map.
function setAll<T, K extends keyof T>(items: T[], key: K, value: T[K]): T[] {
  return items.map((item) => setProperty(item, key, value));
}

console.log("\n// Latihan 5: setAll");
console.log(setAll(people, "email", "updated@mail.com"));
// [
//   { id: 1, name: 'Budi', email: 'updated@mail.com' },
//   { id: 2, name: 'Siti', email: 'updated@mail.com' }
// ]
// ====
