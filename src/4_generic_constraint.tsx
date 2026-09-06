// ==== GENERIC CONSTRAINT ====
// JUDUL: 4. GENERIC CONSTRAINT (<T extends Bentuk>)
// REFERENSI: docs/TypeScript Generic.pdf (TypeScript Handbook - Generics)
// ====

// (1) Kenapa Constraint Dibutuhkan?
// ==============================================
// Di materi 2 kita sudah kenal constraint sederhana (T extends Lengthwise).
// Sekarang kita lihat MASALAHNYA dulu: tanpa constraint, TypeScript TIDAK TAHU
// apa yang bisa dilakukan T — operasi matematika pun ditolak.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: num sumAll<T extends num>(List<T> values) => values.fold<num>(0, (a, b) => a + b);
// TypeScript: Coba tanpa constraint dulu (GAGAL):
// function sumAllBad<T>(values: T[]): T {
//   return values.reduce((a, b) => a + b);
// }
// ERROR TS2365: Operator '+' cannot be applied to types 'T' and 'T'.
// (TypeScript tidak tahu apakah T mendukung operator + — bisa saja T = string, object, dll.)

// Solusi: batasi T hanya untuk tipe angka
function sumAll<T extends number>(values: T[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

// Cetak hasil
console.log("// (1) Hasil sumAll<T extends number>:");
console.log(sumAll([1, 2, 3])); // 6
console.log(sumAll([1.5, 2.5])); // 4

// Kalau memaksa memberi tipe yang tidak memenuhi constraint, TypeScript menolak:
// sumAll<string>(["1", "2"]);
// ERROR TS2344: Type 'string' does not satisfy the constraint 'number'.

// Analogi Dart: Dart punya hierarki num (int dan double sama-sama num).
// TypeScript: Hanya ada number (tidak ada int/double terpisah) — jadi cukup T extends number.

// (2) Constraint ke Interface: Menjaga Tipe Asli Hasil
// ==============================================
// Constraint paling sering dipakai dengan interface — dan ada BONUS penting:
// hasil pencarian tetap bertipe T lengkap (semua properti tetap terjaga).
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: abstract class Identifiable { int get id; }
//       T? findById<T extends Identifiable>(List<T> items, int id) { ... }
// TypeScript: Interface cukup deklarasi properti id
interface Identifiable {
  id: number;
}

function findById<T extends Identifiable>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

// Cetak hasil
console.log("\n// (2) Hasil findById<T extends Identifiable>:");
const users = [
  { id: 1, name: "Budi" },
  { id: 2, name: "Siti" },
];
const found = findById(users, 2); // T di-infer sebagai { id: number; name: string }
console.log(found); // { id: 2, name: 'Siti' }
console.log(found?.name); // Siti - properti name tetap tersedia TANPA cast!

// Analogi Dart: Sama seperti findById<T extends Identifiable> di Dart —
// hasilnya tetap T (mis. User), bukan sekadar Identifiable.
// TypeScript: .name aman diakses karena constraint menjaga tipe T tetap utuh.

// (3) Constraint ke Union Literal: Alternatif Ringan Enum
// ==============================================
// Constraint tidak harus interface — bisa union literal, sangat cocok untuk
// nilai yang cuma beberapa pilihan.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: enum Mode { light, dark, system }
//       Mode setMode(Mode mode) => mode;
// TypeScript: Cukup union literal "light" | "dark" | "system" — tanpa deklarasi enum
function setMode<T extends "light" | "dark" | "system">(mode: T): T {
  return mode;
}

// Cetak hasil
console.log("\n// (3) Hasil setMode<T extends literal union>:");
console.log(setMode("dark")); // dark
console.log(setMode("system")); // system

// Analogi Dart: Dart tidak punya union type — biasanya pakai enum.
// TypeScript: Union literal seperti "mini-enum" inline — nilai lain otomatis ditolak compiler.

// (4) Constraint Intersection: Gabungan Dua Batasan Sekaligus
// ==============================================
// TypeScript mengizinkan constraint berupa INTERSECTION (A & B):
// T harus memenuhi DUA bentuk sekaligus.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: TIDAK BISA T extends Named & Aged langsung — satu type parameter hanya
//       satu extends. Harus lewat perantara:
//       abstract class Person implements Named, Aged {
//         @override
//         final String name;
//         @override
//         final int age;
//         Person(this.name, this.age);
//       }
//       lalu T extends Person
// TypeScript: Bisa langsung T extends Named & Aged
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

function introduce<T extends Named & Aged>(person: T): string {
  return `${person.name}, ${person.age} tahun`;
}

// Cetak hasil
console.log("\n// (4) Hasil introduce<T extends Named & Aged>:");
console.log(introduce({ name: "Budi", age: 30, city: "Jakarta" })); // Budi, 30 tahun

// Analogi Dart: Perlu class Person perantara yang implements Named, Aged.
// TypeScript: T langsung dibatasi dua interface — tanpa class perantara.

// (5) Constraint Construct Signature: Factory Pattern
// ==============================================
// Constraint bisa berupa BENTUK KONSTRUKTOR — dipakai untuk membuat instance
// dari class yang dilewatkan sebagai parameter (factory pattern).
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: T create<T>(T Function() factory) => factory();
//       lalu panggil: create(Service.new) — constructor tear-off Dart 2.15+
// TypeScript: Bentuk konstruktor ditulis new () => T
class Service {
  log() {
    return "service ready";
  }
}

function createInstance<T>(factory: new () => T): T {
  return new factory();
}

// Cetak hasil
console.log("\n// (5) Hasil createInstance<T>(factory: new () => T):");
console.log(createInstance(Service).log()); // service ready

// Tanpa constraint construct signature, new ditolak:
// function badCreate<T>(factory: T): T {
//   return new factory();
// }
// ERROR TS2351: This expression is not constructable.
//   Type 'unknown' has no construct signatures.

// Analogi Dart: T Function() di Dart = new () => T di TypeScript — sama-sama
// "resep cara membuat T", bukan nilai T-nya.
// TypeScript: new factory() hanya sah jika factory berbentuk konstruktor.

// ==== RANGKUMAN ====
// 1. Tanpa constraint, TypeScript tidak tahu kemampuan T — operator + pun ditolak (TS2365)
// 2. <T extends number> membatasi T ke angka; pelanggaran ditolak (TS2344)
// 3. Constraint interface menjaga tipe T tetap utuh — hasil pencarian tidak perlu cast
// 4. Constraint bisa union literal (alternatif ringan enum Dart) atau intersection A & B
// 5. Constraint construct signature (new () => T) untuk factory — paralel T Function() di Dart
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat fungsi generic 'average' yang menghitung rata-rata array angka.
//    T dibatasi number supaya operasi aritmetika aman.
function average<T extends number>(values: T[]): number {
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

console.log("\n// Latihan 1: average");
console.log(average([10, 20, 30])); // 20
console.log(average([1.5, 2.5, 3.5])); // 2.5

// 2. Buat fungsi generic 'findByEmail' yang mencari item berdasarkan email.
//    Constraint { email: string } — hasil tetap bertipe T lengkap.
function findByEmail<T extends { email: string }>(items: T[], email: string): T | undefined {
  return items.find((item) => item.email === email);
}

console.log("\n// Latihan 2: findByEmail");
const members = [
  { id: 1, name: "Budi", email: "budi@mail.com" },
  { id: 2, name: "Siti", email: "siti@mail.com" },
];
console.log(findByEmail(members, "siti@mail.com")); // { id: 2, name: 'Siti', email: 'siti@mail.com' }
console.log(findByEmail(members, "no@mail.com")); // undefined

// 3. Buat fungsi generic 'setLogLevel' yang hanya menerima level tertentu
//    (debug, info, warn, error) dan mengembalikan label uppercase-nya.
function setLogLevel<T extends "debug" | "info" | "warn" | "error">(level: T): string {
  return `LOG: ${level.toUpperCase()}`;
}

console.log("\n// Latihan 3: setLogLevel");
console.log(setLogLevel("info")); // LOG: INFO
console.log(setLogLevel("debug")); // LOG: DEBUG

// 4. Buat fungsi generic 'createMany' yang membuat array berisi instance
//    dari sebuah class, sebanyak count — pakai construct signature.
function createMany<T>(factory: new () => T, count: number): T[] {
  return Array.from({ length: count }, () => new factory());
}

console.log("\n// Latihan 4: createMany");
console.log(createMany(Service, 2).map((s) => s.log())); // [ 'service ready', 'service ready' ]

// 5. Buat fungsi generic 'longestItem' yang mengembalikan item dengan
//    .length terbesar — constraint cukup punya properti length.
function longestItem<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

console.log("\n// Latihan 5: longestItem");
console.log(longestItem("hello", "hi")); // hello
console.log(longestItem([1, 2, 3], [1, 2])); // [ 1, 2, 3 ]
// ====
