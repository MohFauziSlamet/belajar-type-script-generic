// ==== GENERIC CLASS ====
// JUDUL: 8. GENERIC CLASS (CLASS GENERIC)
// REFERENSI: docs/TypeScript Generic.pdf hlm. 17-21 + 29-33 (Programmer Zaman Now)
// ====

// (1) Dasar Generic Class
// ==============================================
// Di latihan materi 7 kita bikin Wrapper via closure. Versi CLASS lebih kaya:
// state jelas, method banyak, dan bisa dipakai ulang sebagai kontrak.
// Inilah bentuk generic yang paling mirip dengan Dart.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class Box<T> { final T value; const Box(this.value); }
// TypeScript: Sintaksnya nyaris identik — T di class, dipakai di property & method.
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
  }
}

// Cetak hasil
console.log("// (1) Hasil Box<T>:");
const box1 = new Box<string>("halo"); // eksplisit
console.log(box1.get()); // halo
const box2 = new Box(42); // inference T = number
console.log(box2.get()); // 42
box1.set("dunia");
console.log(box1.get()); // dunia

// Generic class TIDAK kompatibel antar tipe berbeda (invariance):
// const boxStr = new Box("hi");
// const boxNum: Box<number> = boxStr;
// ERROR TS2322: Type 'Box<string>' is not assignable to type 'Box<number>'.
//   Type 'string' is not assignable to type 'number'.

// Analogi Dart: Box<String> dan Box<int> adalah DUA tipe beda di Dart —
// sama-sama tidak bisa saling assigned. Perilaku identik.
// TypeScript: Box<string> ≠ Box<number> — tipe argument mengunci seluruh class.

// (2) Struktur Data Klasik: Stack<T>
// ==============================================
// Class generic bersinar untuk struktur data: sekali tulis Stack<T>,
// dipakai untuk string, number, atau tipe apa pun.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class Stack<T> { final List<T> _items = []; void push(T item) {...} }
// TypeScript: Struktur sama — List<T> jadi T[], method sama.
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }
}

// Cetak hasil
console.log("\n// (2) Hasil Stack<T>:");
const stack = new Stack<string>();
stack.push("a");
stack.push("b");
console.log(stack.size()); // 2
console.log(stack.pop()); // b
console.log(stack.peek()); // a
console.log(stack.size()); // 1

// Item dengan tipe salah ditolak:
// const numStack = new Stack<number>();
// numStack.push("satu");
// ERROR TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

// Analogi Dart: Stack<int> di Dart juga menolak push("satu") — kontrak sama.
// TypeScript: T terkunci saat new Stack<number>() — semua method ikut ketat.

// (3) Class Generic implements Interface Generic
// ==============================================
// Gabungan materi 7 (interface) + materi 4 (constraint): class generic
// mengimplementasikan interface generic, dengan T dibatasi constraint.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class InMemoryRepository<T extends Identifiable>
//           implements Repository<T> { ... }
// TypeScript: Bentuknya sama persis — hanya interface jadi kontrak murni.
interface Identifiable {
  id: number;
}

interface Repository<T> {
  getAll(): T[];
  save(item: T): T;
}

interface Item extends Identifiable {
  title: string;
}

class InMemoryRepository<T extends Identifiable> implements Repository<T> {
  private items: T[] = [];

  getAll(): T[] {
    return this.items;
  }

  save(item: T): T {
    this.items.push(item);
    return item;
  }
}

// Cetak hasil
console.log("\n// (3) Hasil InMemoryRepository<T extends Identifiable>:");
const repo = new InMemoryRepository<Item>();
repo.save({ id: 1, title: "Belajar TS" });
repo.save({ id: 2, title: "Belajar Generic" });
console.log(repo.getAll()); // [ { id: 1, title: 'Belajar TS' }, { id: 2, title: 'Belajar Generic' } ]

// Analogi Dart: Repository pattern identik di Dart — hanya class yang implements.
// TypeScript: T extends Identifiable menjaga item selalu punya id (recall materi 4).

// (4) Static Member TIDAK Bisa Memakai T Class
// ==============================================
// Aturan penting: static member milik CLASS, bukan instance — jadi tidak
// boleh mereferensikan type parameter T (yang hanya hidup per-instance).
// Dan kejutan: Dart punya ATURAN YANG SAMA PERSIS.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: static di class generic Dart juga TIDAK BISA memakai T
//       (error: static members can't reference type parameters of the class)
// TypeScript: Error yang sama — TS2302.
// class BadStatic<T> {
//   static defaultValue: T;
// }
// ERROR TS2302: Static members cannot reference class type parameters.
//
// Solusinya: static boleh MEMAKAI instantiation konkret, atau punya
// type parameter sendiri. Studi kasus: Parser dengan callback T | null.
class Parser<T> {
  constructor(private parse: (raw: string) => T | null) {}

  static number = new Parser<number>((raw) => {
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  });

  parseOr(raw: string, fallback: T): T {
    const result = this.parse(raw);
    return result === null ? fallback : result;
  }
}

// Cetak hasil
console.log("\n// (4) Hasil Parser<T> + static number:");
console.log(Parser.number.parseOr("42", 0)); // 42 - parse sukses
console.log(Parser.number.parseOr("rusak", -1)); // -1 - NaN jadi null → fallback

// Analogi Dart: static number di Dart juga harus konkret (Parser<int>) —
// tidak bisa Parser<T>. Perilaku identik di kedua bahasa.
// TypeScript: static number = new Parser<number>(...) AMAN karena bukan T class.

// (5) Studi Kasus: Cache<K, V> Dua Type Parameter
// ==============================================
// Class generic dua parameter — pola cache/Map dengan tipe terkunci.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class Cache<K, V> { final Map<K, V> _map = {}; }
// TypeScript: Map<K, V> bawaan TS — struktur persis Dart.
class Cache<K, V> {
  private map = new Map<K, V>();

  set(key: K, value: V): void {
    this.map.set(key, value);
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }
}

// Cetak hasil
console.log("\n// (5) Hasil Cache<K, V>:");
const cache = new Cache<string, number>();
cache.set("umur", 30);
console.log(cache.get("umur")); // 30
console.log(cache.has("nama")); // false

// Analogi Dart: Cache<String, int> di Dart — Map<K, V> Dart juga generic dua
// parameter. TypeScript: kunci & nilai terkunci sekali di constructor.

// ==== RANGKUMAN ====
// 1. Class generic: T dipakai di property, constructor, dan method — nyaris identik dengan Dart
// 2. Box<string> ≠ Box<number> (invariance) — tipe berbeda tidak saling assignable (TS2322)
// 3. Class generic bisa implements interface generic + constraint: <T extends Identifiable>
// 4. Static member TIDAK boleh mereferensi T class (TS2302) — aturan yang sama di Dart!
// 5. Dua type parameter di class (Cache<K, V>) bekerja persis seperti Map<K, V> Dart
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat class generic 'Pair' dengan dua type parameter dan method swap()
//    yang mengembalikan Pair dengan posisi tertukar.
class Pair<A, B> {
  constructor(public first: A, public second: B) {}

  swap(): Pair<B, A> {
    return new Pair(this.second, this.first);
  }
}

console.log("\n// Latihan 1: Pair");
const p = new Pair("id", 7);
console.log(p.first, p.second); // id 7
const sw = p.swap();
console.log(sw.first, sw.second); // 7 id

// 2. Buat class generic 'Queue' (FIFO) dengan enqueue dan dequeue.
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  size(): number {
    return this.items.length;
  }
}

console.log("\n// Latihan 2: Queue");
const q = new Queue<number>();
q.enqueue(1);
q.enqueue(2);
console.log(q.dequeue()); // 1
console.log(q.size()); // 1

// 3. Buat interface 'Savable' generic lalu class 'Database' yang
//    mengimplementasikannya.
interface Savable<T> {
  save(item: T): T;
  count(): number;
}

class Database<T> implements Savable<T> {
  private rows: T[] = [];

  save(item: T): T {
    this.rows.push(item);
    return item;
  }

  count(): number {
    return this.rows.length;
  }
}

console.log("\n// Latihan 3: Database");
const db = new Database<string>();
db.save("baris-1");
db.save("baris-2");
console.log(db.count()); // 2

// 4. Buat class generic 'Stats' dengan constraint T extends number —
//    method add untuk menambah nilai dan sum untuk menjumlahkan.
class Stats<T extends number> {
  private values: T[] = [];

  add(value: T): void {
    this.values.push(value);
  }

  sum(): number {
    return this.values.reduce((acc, v) => acc + v, 0);
  }
}

console.log("\n// Latihan 4: Stats");
const stats = new Stats<number>();
stats.add(10);
stats.add(20.5);
console.log(stats.sum()); // 30.5

// 5. Buat class generic 'Table' dua type parameter dengan method
//    keys() dan values() yang mengembalikan array dari Map internal.
class Table<K, V> {
  private map = new Map<K, V>();

  set(key: K, value: V): void {
    this.map.set(key, value);
  }

  keys(): K[] {
    return [...this.map.keys()];
  }

  values(): V[] {
    return [...this.map.values()];
  }
}

console.log("\n// Latihan 5: Table");
const table = new Table<string, boolean>();
table.set("aktif", true);
table.set("premium", false);
console.log(table.keys()); // [ 'aktif', 'premium' ]
console.log(table.values()); // [ true, false ]
// ====
