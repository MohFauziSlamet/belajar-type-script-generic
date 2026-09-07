// ==== PENGANTAR TYPESCRIPT GENERIC ====
// JUDUL: 1. PENGENALAN GENERIC (INTRODUCTION TO GENERICS)
// REFERENSI: docs/TypeScript Generic.pdf (TypeScript Handbook - Generics)
// ====

// (1) Masalah Tanpa Generic: any Kehilangan Info Tipe
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: Function identity(dynamic value) => value;
// TypeScript: Function tanpa generic
function identityWithoutGeneric(arg: any): any {
  return arg;
}

// Cetak hasil
console.log("// (1) Hasil identityWithoutGeneric:");
console.log(identityWithoutGeneric(42)); // 42
console.log(identityWithoutGeneric("hello")); // 'hello' - tipe info hilang (any)
console.log(identityWithoutGeneric(true)); // true

// Analogi Dart: List<dynamic> di Dart bisa menyimpan semua tipe
// TypeScript: any sama seperti dynamic di Dart

// (2) Masalah Duplikasi Fungsi
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: String identityString(String value) => value;
// Dart: num identityNumber(num value) => value;
// TypeScript: Fungsi spesifik untuk setiap tipe
function identityString(arg: string): string {
  return arg;
}

function identityNumber(arg: number): number {
  return arg;
}

// Cetak hasil
console.log("\n// (2) Hasil fungsi spesifik:");
console.log(identityString("world")); // 'world'
console.log(identityNumber(100)); // 100

// Analogi Dart: Harus buat fungsi terpisah untuk setiap tipe
// TypeScript: Solusi tidak efisien - duplikasi kode

// (3) Solusi dengan Generic: Type Variable
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: T identity<T>(T value) => value;
// TypeScript: Generic function dengan type variable
function identity<Type>(arg: Type): Type {
  return arg;
}

// Cetak hasil
console.log("\n// (3) Hasil identity dengan generic:");
console.log(identity<string>("hello")); // 'hello' - explicit type
console.log(identity(42)); // 42 - type inference
console.log(identity(true)); // true - type inference

// Eksplisit <number> tapi argumen string ditolak:
// identity<number>("hello");
// ERROR TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

// Analogi Dart: List<T> di Dart menggunakan generic
// TypeScript: <Type> bekerja seperti T di Dart generic

// (4) Type Argument Inference
// ==============================================
// TypeScript bisa menebak tipe otomatis berdasarkan nilai yang diberikan
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length); // Array punya .length
  return arg;
}

// Cetak hasil
console.log("\n// (4) Hasil loggingIdentity:");
const numberArray = [1, 2, 3];
console.log(loggingIdentity(numberArray)); // [ 1, 2, 3 ]

const stringArray = ["a", "b", "c"];
console.log(loggingIdentity(stringArray)); // [ 'a', 'b', 'c' ]

// Type inference bekerja saat compiler bisa menebak tipe dari nilai yang diberikan
// Contoh: loggingIdentity(numberArray) → TypeScript infer Type = number
// Jika inference tidak bekerja (misal: loggingIdentity(getUnknownArray())),
// kita perlu secara eksplisit menentukan tipe: loggingIdentity<number>(getUnknownArray())
// (Type = number → argumen harus number[]; jangan <number[]> — itu menuntut number[][])

// Analogi Dart: List<String> di Dart - TypeScript infer string[]
// TypeScript: Compiler tahu arg adalah array berdasarkan input

// (5) Generic Interface
// ==============================================
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: abstract class Repository<T> { T getById(int id); }
//       (Dart klasik memakai abstract class sebagai kontrak;
//        Dart 3 juga punya modifier interface class)
// TypeScript: Generic interface — kontrak bentuk murni, tanpa implementasi.
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

function identityFn<Type>(arg: Type): Type {
  return arg;
}

let numberIdentityFn: GenericIdentityFn<number> = identityFn;

// Cetak hasil
console.log("\n// (5) Hasil generic interface:");
console.log(numberIdentityFn(123)); // 123

// Analogi Dart: abstract class Repository<T> di Dart sebagai kontrak —
// TypeScript: interface bisa jadi generic seperti class/abstract class Dart
// (call signature (arg: Type): Type mendeskripsikan bentuk fungsi —
//  didalami di materi 7).

// ==== RANGKUMAN ====
// 1. Generic memungkinkan komponen bekerja dengan berbagai tipe tanpa kehilangan informasi tipe
// 2. Type variable (<Type>) menangkap tipe yang diberikan pengguna
// 3. Type inference membuat kode lebih ringkas dan readable
// 4. Generic interface mirip dengan class generic di Dart
// 5. Solusi lebih baik dari any (tidak kehilangan info tipe) dan duplikasi fungsi
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================
// 1. Buat fungsi generic 'firstElement' yang mengembalikan elemen pertama dari array
// Menggunakan Type | undefined karena array kosong tidak memiliki elemen pertama
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

console.log("\n// Latihan 1: firstElement");
console.log(firstElement([1, 2, 3])); // 1
console.log(firstElement(["a", "b", "c"])); // 'a'
console.log(firstElement([])); // undefined - array kosong mengembalikan undefined

// 2. Buat interface generic 'Pair' dengan dua properti value dan label
interface Pair<K, V> {
  key: K;
  value: V;
}

function createPair<K, V>(key: K, value: V): Pair<K, V> {
  return { key, value };
}

console.log("\n// Latihan 2: Pair interface");
console.log(createPair(1, "one")); // { key: 1, value: 'one' }
console.log(createPair("id", 100)); // { key: 'id', value: 100 }

// 3. Buat fungsi generic 'mergeObjects' yang menggabungkan dua objek
// (intersection T & U dibahas lebih dalam di materi 3)
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

console.log("\n// Latihan 3: mergeObjects");
console.log(mergeObjects({ name: "John" }, { age: 30 })); // { name: 'John', age: 30 }
console.log(mergeObjects({ x: 1 }, { y: 2 })); // { x: 1, y: 2 }
// ====