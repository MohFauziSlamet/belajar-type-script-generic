// ==== GENERIC METHOD DALAM CLASS ====
// JUDUL: 10. GENERIC METHOD DALAM CLASS (METHOD GENERIC)
// REFERENSI: docs/TypeScript Generic.pdf (TypeScript Handbook - Generics)
// ====

// (1) Method Generic di Class Biasa (Non-Generic)
// ==============================================
// Class TIDAK perlu menjadi generic hanya karena SATU method butuh type
// parameter — method boleh punya type parameter SENDIRI.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class Json { T parse<T>(String raw) => ...; }
// TypeScript: <T> ditulis di method, bukan di class.
class Json {
  parse<T>(raw: string): T {
    return JSON.parse(raw) as T;
  }
}

// Cetak hasil
console.log("// (1) Hasil Json.parse<T> (method generic di class biasa):");
const json = new Json();
console.log(json.parse<number>("42")); // 42
console.log(json.parse<string>('"halo"')); // halo

// Analogi Dart: parse<T> di Dart juga hidup di method — class Json tetap non-generic.
// TypeScript: Method generic = "generik lokal" — area pengaruhnya sebatas method itu.

// (2) Method Generic (U) + Type Parameter Class (T) Bersamaan
// ==============================================
// Ini pola PALING penting di materi ini — dan yang paling Anda kenal dari
// Dart: List<E> punya method map<R>(R Function(E) f). E milik CLASS,
// R milik METHOD — dua dunia type parameter yang bekerja sama.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: Iterable<R> map<R>(R Function(E e) f) — di Iterable<E>, diwarisi List<E>.
//       (SDK Dart menamainya T/toElement; di sini R/f agar tak tertukar T class TS)
// TypeScript: map<U>(fn: (item: T) => U): U[] — T dari class, U dari method.
class DataStore<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  map<U>(fn: (item: T) => U): U[] {
    return this.items.map(fn);
  }
}

// Cetak hasil
console.log("\n// (2) Hasil DataStore<string>.map<U>:");
const store = new DataStore<string>();
store.add("halo");
store.add("dunia");
const lengths = store.map((s) => s.length); // U di-infer number dari callback
const upper = store.map((s) => s.toUpperCase()); // U di-infer string
console.log(lengths); // [ 4, 5 ]
console.log(upper); // [ 'HALO', 'DUNIA' ]

// Callback dengan parameter salah tipe ditolak (item HARUS bertipe T = string):
// store.map<number>((n: number) => n * 2);
// ERROR TS2345: Argument of type '(n: number) => number' is not assignable to parameter of type '(item: string) => number'.
//   Types of parameters 'n' and 'item' are incompatible.
//     Type 'string' is not assignable to type 'number'.

// Analogi Dart: listString.map((int n) => n * 2) juga error di Dart — parameter
// callback harus terima E (String), hasilnya bebas jadi R apa pun.
// TypeScript: U fleksibel per pemanggilan — number, string, atau tipe lain.

// (3) Method Generic dengan Constraint
// ==============================================
// Sama seperti fungsi generic (materi 4), method generic juga bisa dibatasi
// constraint — pengetat area pengaruhnya tetap lokal di method.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: T max<T extends num>(T a, T b) — persis pola dart:math max.
// TypeScript: max<T extends number> — constraint milik method, bukan class.
class MathKit {
  max<T extends number>(a: T, b: T): T {
    return a >= b ? a : b;
  }
}

// Cetak hasil
console.log("\n// (3) Hasil MathKit.max<T extends number>:");
const mk = new MathKit();
console.log(mk.max(3, 7)); // 7
console.log(mk.max(2.5, 1.5)); // 2.5

// Tipe di luar constraint ditolak:
// mk.max<string>("a", "b");
// ERROR TS2344: Type 'string' does not satisfy the constraint 'number'.

// Analogi Dart: max<String>("a", "b") di Dart juga error — bound num tidak terpenuhi.
// TypeScript: Class tetap non-generic — hanya method max yang ketat.

// (4) Static Generic Method
// ==============================================
// Recall materi 8: static member TIDAK BOLEH memakai T class (TS2302).
// Tapi static method BOLEH punya type parameter sendiri — inilah jalurnya.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: static List<T> range<T>(int length, T Function(int) fill) — valid di Dart.
// TypeScript: Sama — static range<T> dengan T milik method static.
class Factory {
  static range<T>(length: number, fill: (i: number) => T): T[] {
    return Array.from({ length }, (_, i) => fill(i));
  }
}

// Cetak hasil
console.log("\n// (4) Hasil Factory.range<T> (static generic):");
console.log(Factory.range(3, (i) => i * 2)); // [ 0, 2, 4 ] - T di-infer number
console.log(Factory.range<string>(2, (i) => "x".repeat(i + 1))); // [ 'x', 'xx' ] - eksplisit

// Eksplisit <string> tapi callback mengembalikan number ditolak:
// Factory.range<string>(2, (i) => i * 2);
// ERROR TS2322: Type 'number' is not assignable to type 'string'.

// Analogi Dart: static generic di Dart juga terlepas dari T class — perilaku sama.
// TypeScript: Dipanggil via nama class (Factory.range) tanpa instance.

// (5) Studi Kasus: EventBus — Kapan Eksplisit Menjadi WAJIB
// ==============================================
// EventBus menyimpan handler per nama event. Perhatikan: T pada on<T> hanya
// muncul di parameter handler — TypeScript TIDAK punya sumber inference dari
// argumen "login" (string biasa). Tanpa eksplisit, T jatuh ke unknown!
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: void on<T>(String type, void Function(T) handler) — Dart juga tidak
//       bisa menebak T dari "login"; biasanya anotasi param eksplisit.
// TypeScript: Solusi terbersih: eksplisit on<LoginEvent>(...).
interface LoginEvent {
  userId: number;
}

class EventBus {
  private handlers = new Map<string, Array<(payload: unknown) => void>>();

  on<T>(type: string, handler: (payload: T) => void): void {
    const list = this.handlers.get(type) ?? [];
    list.push(handler as (payload: unknown) => void);
    this.handlers.set(type, list);
  }

  emit<T>(type: string, payload: T): void {
    (this.handlers.get(type) ?? []).forEach((h) => h(payload));
  }
}

// Cetak hasil
console.log("\n// (5) Hasil EventBus dengan on<LoginEvent>:");
const bus = new EventBus();
bus.on<LoginEvent>("login", (p) => console.log(`login user ${p.userId}`)); // p ter-infer LoginEvent
bus.emit("login", { userId: 7 }); // login user 7

// Tanpa eksplisit, payload tidak dikenal — akses properti ditolak:
// bus.on("login", (p) => console.log(p.userId));
// ERROR TS18046: 'p' is of type 'unknown'.

// Analogi Dart: Sama seperti Dart — T tak bisa di-infer dari argumen string.
// TypeScript: Inference hanya bekerja bila T muncul di tipe argumen; kalau
// tidak — tulis eksplisit (recall materi 6: eksplisit menang atas semuanya).

// ==== RANGKUMAN ====
// 1. Method generic hidup di method — class tidak perlu generic karena satu method
// 2. T (class) + U (method) bekerja sama: map<U>(fn: (item: T) => U) — pola List<E>.map<R> Dart
// 3. Constraint method generic bersifat lokal: max<T extends number> hanya mengetat method itu
// 4. Static method boleh punya T sendiri — solusi aturan TS2302 (static ≠ T class)
// 5. Jika T tak punya sumber inference (EventBus.on), eksplisit WAJIB — kalau tidak: unknown (TS18046)
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat class 'MathUtil' (non-generic) dengan static method generic
//    'sum<T extends number>' yang menjumlahkan array angka.
class MathUtil {
  static sum<T extends number>(values: T[]): number {
    return values.reduce((acc, v) => acc + v, 0);
  }
}

console.log("\n// Latihan 1: MathUtil.sum");
console.log(MathUtil.sum([1, 2, 3])); // 6

// 2. Buat class 'Picker' dengan method generic 'pick' yang mengambil item
//    array pada index tertentu (undefined jika index di luar batas).
class Picker {
  pick<T>(items: T[], index: number): T | undefined {
    return items[index];
  }
}

console.log("\n// Latihan 2: Picker.pick");
const picker = new Picker();
console.log(picker.pick(["a", "b"], 1)); // b
console.log(picker.pick([1], 5)); // undefined

// 3. Buat class 'Validator' dengan method generic 'isAll' yang memeriksa
//    apakah SEMUA item memenuhi predicate.
class Validator {
  isAll<T>(items: T[], predicate: (v: T) => boolean): boolean {
    return items.every(predicate);
  }
}

console.log("\n// Latihan 3: Validator.isAll");
console.log(new Validator().isAll([2, 4], (n) => n % 2 === 0)); // true
console.log(new Validator().isAll([2, 3], (n) => n % 2 === 0)); // false

// 4. Buat class generic 'Pipeline<T>' dengan method generic 'then<U>'
//    yang mengubah nilai dan mengembalikan Pipeline baru (chaining).
class Pipeline<T> {
  constructor(private value: T) {}

  then<U>(fn: (v: T) => U): Pipeline<U> {
    return new Pipeline(fn(this.value));
  }

  result(): T {
    return this.value;
  }
}

console.log("\n// Latihan 4: Pipeline.then (chaining generic)");
console.log(new Pipeline("42").then(Number).then((n) => n * 2).result()); // 84

// 5. Buat class 'Builder' dengan static method generic 'createMany' yang
//    membuat array berisi hasil maker() sebanyak count.
class Builder {
  static createMany<T>(maker: () => T, count: number): T[] {
    return Array.from({ length: count }, () => maker());
  }
}

console.log("\n// Latihan 5: Builder.createMany");
console.log(Builder.createMany(() => "ok", 3)); // [ 'ok', 'ok', 'ok' ]
// ====
