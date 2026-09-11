// ==== GENERIC MULTIPLE TYPE PARAMETERS ====
// JUDUL: 3. GENERIC DENGAN MULTIPLE TYPE PARAMETERS (<T, U>)
// REFERENSI: docs/TypeScript Generic.pdf hlm. 25-28 (Programmer Zaman Now)
// ====

// (1) Dasar Multiple Type Parameters
// ==============================================
// Di materi 2 kita sempat lihat createPair<K, V> sebentar. Sekarang kita dalami:
// penamaan type parameter yang deskriptif, urutan type argument eksplisit,
// dan type inference untuk DUA parameter sekaligus.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: String attachUnit<T, U>(T value, U unit) => '$value $unit';
// TypeScript: Dua type parameter TValue dan TUnit, return string
function attachUnit<TValue, TUnit>(value: TValue, unit: TUnit): string {
  return `${value} ${unit}`;
}

// Cetak hasil
console.log("// (1) Hasil attachUnit<TValue, TUnit>:");
console.log(attachUnit<number, string>(170, "cm")); // 170 cm - eksplisit (TValue = number, TUnit = string)
console.log(attachUnit(2.5, "kg")); // 2.5 kg - inference (TValue = number, TUnit = string)
console.log(attachUnit("Lari", 10)); // Lari 10 - inference (TValue = string, TUnit = number)

// Analogi Dart: Generic dengan dua parameter seperti Map<K, V> — urutannya tetap: K dulu, V kemudian.
// TypeScript: Saat eksplisit, <number, string> berarti TValue = number DAN TUnit = string sesuai urutan.
// Jika tipe argumen tidak cocok dengan type argument eksplisit yang ditulis, TypeScript menolak:

// attachUnit<number, string>("tinggi", "cm");
// ERROR TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
// (TValue sudah dikunci number, tapi argumen pertama string → ditolak)

// Analogi Dart: attachUnit<num, String>("tinggi", "cm") juga error di Dart — konsepnya sama persis.
// TypeScript: Tipe argumen harus cocok dengan type argument eksplisit yang ditulis.

// (2) Tuple sebagai Return Type: [T, U]
// ==============================================
// TypeScript punya TUPLE: array dengan panjang tetap dan tipe per posisi.
// Tuple memungkinkan fungsi mengembalikan dua nilai beda tipe TANPA bikin class/objek.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: Dart 3 punya record (A, B): (A, B) zip<A, B>(List<A> a, List<B> b) => (a.first, b.first);
//       (sebelum Dart 3, harus bikin class Pair<A, B> manual)
// TypeScript: Tuple [T, U] — konsepnya sama seperti record Dart 3
function zipFirstTwo<T, U>(a: T[], b: U[]): [T, U] {
  return [a[0], b[0]];
}

// Cetak hasil
console.log("\n// (2) Hasil zipFirstTwo<T, U>:");
console.log(zipFirstTwo([1, 2, 3], ["a", "b", "c"])); // [ 1, 'a' ] - elemen pertama tiap array
console.log(zipFirstTwo([true, false], [10, 20])); // [ true, 10 ]

// Analogi Dart: Record Dart 3 diakses via $1/$2 (pair.$1); tuple TypeScript diakses via index [0]/[1].
// TypeScript: Tuple [T, U] — panjang tetap 2, tipe tiap posisi bisa beda.

// (3) Dua Type Parameter: Input → Output dengan Converter
// ==============================================
// Type parameter kedua bisa jadi tipe HASIL konversi dari type parameter pertama.
// Fungsinya menerima nilai TInput + fungsi converter, lalu mengembalikan TOutput.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: R convert<T, R>(T value, R Function(T) converter) => converter(value);
// TypeScript: Callback converter ditulis (v: TInput) => TOutput
function convert<TInput, TOutput>(value: TInput, converter: (v: TInput) => TOutput): TOutput {
  return converter(value);
}

// Cetak hasil
console.log("\n// (3) Hasil convert<TInput, TOutput>:");
console.log(convert("42", Number)); // 42 - TInput = string, TOutput = number
console.log(convert(100, String)); // '100' - TInput = number, TOutput = string
console.log(convert("2026-09-05", (s) => s.split("-")[0])); // '2026' - TOutput di-infer string

// Analogi Dart: convert<T, R>(value, converter) di Dart, misal int.parse untuk konversi String → int.
// TypeScript: Number dan String adalah converter bawaan; arrow function juga bisa.

// (4) Intersection Type: Menggabungkan Dua Tipe (T & U)
// ==============================================
// Intersection T & U = tipe hasil gabungan yang punya semua properti DARI T dan U sekaligus.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: tidak ada intersection type — harus bikin class gabungan manual:
//       class PersonAge { String name; int age; PersonAge(this.name, this.age); }
// TypeScript: Cukup tulis T & U, lalu spread {...a, ...b} untuk menggabungkan
function combine<T, U>(a: T, b: U): T & U {
  return { ...a, ...b };
}

// Cetak hasil
console.log("\n// (4) Hasil combine<T, U>:");
console.log(combine({ name: "Budi" }, { age: 30 })); // { name: 'Budi', age: 30 }
console.log(combine({ x: 1, y: 2 }, { z: 3 })); // { x: 1, y: 2, z: 3 }

// Analogi Dart: Tidak ada intersection type — gabungkan manual via class (atau record Dart 3).
// TypeScript: T & U otomatis "menempelkan" semua properti kedua objek jadi satu tipe.

// (5) Studi Kasus: Pattern Result<T, E>
// ==============================================
// Multiple type parameter sangat sering dipakai untuk wrapper hasil operasi
// yang bisa SUKSES (T) atau GAGAL (E) — tanpa perlu exception.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: sealed class + subclass (idiom Dart 3):
//         sealed class Result<T> {}
//         class Success<T> extends Result<T> { final T value; Success(this.value); }
//         class Failure<T> extends Result<T> { final String error; Failure(this.error); }
//       (paralel langsung dengan union type TypeScript di bawah!)
// TypeScript: Union type + literal type ok sebagai pembeda sukses/gagal
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function success<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function failure<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Catatan: never dipakai untuk sisi yang tidak dipakai — Success tidak punya error,
// Failure tidak punya value. Tetap assignable ke Result<number, string> di bawah.

// Fungsi nyata: pembagian yang aman tanpa try-catch
function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return failure("Tidak bisa membagi dengan nol");
  }
  return success(a / b);
}

// Cetak hasil
console.log("\n// (5) Hasil safeDivide (Result<T, E>):");
console.log(safeDivide(10, 2)); // { ok: true, value: 5 }
console.log(safeDivide(10, 0)); // { ok: false, error: 'Tidak bisa membagi dengan nol' }

// Analogi Dart: Pattern sealed class Success/Failure di Dart 3 (atau Either dari package dartz).
// TypeScript: Cukup union dua object type — ok: true membawa value, ok: false membawa error.

// ==== RANGKUMAN ====
// 1. Multiple type parameter ditulis dipisah koma: <T, U> — urutannya berperan saat eksplisit
// 2. Tuple [T, U] mengembalikan pasangan dua tipe beda (konsepnya seperti record Dart 3)
// 3. <TInput, TOutput> + callback converter menghasilkan tipe output yang tetap terjaga
// 4. Intersection T & U menggabungkan properti dua objek jadi satu tipe (Dart tidak punya)
// 5. Pattern Result<T, E> = contoh nyata multiple type parameter untuk sukses/gagal
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat fungsi generic 'makeTuple' yang menggabungkan dua nilai menjadi tuple [T, U]
function makeTuple<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

console.log("\n// Latihan 1: makeTuple");
console.log(makeTuple("id", 7)); // [ 'id', 7 ]
console.log(makeTuple(3.14, false)); // [ 3.14, false ]

// 2. Buat fungsi generic 'swapPair' yang menukar posisi tuple [T, U] menjadi [U, T]
function swapPair<T, U>(pair: [T, U]): [U, T] {
  return [pair[1], pair[0]];
}

console.log("\n// Latihan 2: swapPair");
console.log(swapPair(["a", 1])); // [ 1, 'a' ]
console.log(swapPair([100, true])); // [ true, 100 ]

// 3. Buat fungsi generic 'concatArrays' yang menggabungkan dua array beda tipe
//    menjadi satu array union (T | U)[]
function concatArrays<T, U>(a: T[], b: U[]): (T | U)[] {
  return [...a, ...b];
}

console.log("\n// Latihan 3: concatArrays");
console.log(concatArrays([1, 2], ["a", "b"])); // [ 1, 2, 'a', 'b' ]
console.log(concatArrays([true], [10, 20])); // [ true, 10, 20 ]

// 4. Buat fungsi generic 'pickValue' yang memilih salah satu dari dua nilai beda tipe
//    berdasarkan flag — return type-nya union T | U
function pickValue<T, U>(flag: boolean, whenTrue: T, whenFalse: U): T | U {
  return flag ? whenTrue : whenFalse;
}

console.log("\n// Latihan 4: pickValue");
console.log(pickValue(true, "aktif", 0)); // aktif
console.log(pickValue(false, "aktif", 0)); // 0

// 5. Buat fungsi generic 'formatPair' yang menerima key (K), value (V),
//    dan formatter callback, lalu mengembalikan string hasil format
function formatPair<K, V>(key: K, value: V, formatter: (k: K, v: V) => string): string {
  return formatter(key, value);
}

console.log("\n// Latihan 5: formatPair");
console.log(formatPair("price", 500, (k, v) => `${k}: Rp${v}`)); // price: Rp500
console.log(formatPair("ok", true, (k, v) => `${k.toUpperCase()}=${v ? "yes" : "no"}`)); // OK=yes
// ====
