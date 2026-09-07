// ==== EXTENDING GENERIC CLASS / INTERFACE ====
// JUDUL: 9. EXTENDING GENERIC CLASS / INTERFACE (PEWARISAN GENERIC)
// REFERENSI: docs/TypeScript Generic.pdf (TypeScript Handbook - Generics)
// ====

// (1) Interface extends Interface Generic
// ==============================================
// Pewarisan generic dimulai dari level interface: interface generic bisa
// extends interface generic lain — type parameter-nya DIOPER turun.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: abstract class BaseModel<T> {
//         final int id; final T data;
//         const BaseModel(this.id, this.data);
//       }
//       abstract class Revisioned<T> extends BaseModel<T> { final int version; }
// TypeScript: Bentuknya sama — Revisioned<T> mewarisi BaseModel<T>.
interface BaseModel<T> {
  id: number;
  data: T;
}

interface Revisioned<T> extends BaseModel<T> {
  version: number;
}

// Cetak hasil
console.log("// (1) Hasil Revisioned<string> (extends BaseModel<string>):");
const rev: Revisioned<string> = { id: 1, data: "draft", version: 3 };
console.log(rev); // { id: 1, data: 'draft', version: 3 }

// Analogi Dart: Revisioned<String> di Dart juga wajib punya id + data + version.
// TypeScript: Satu interface menambah kontrak baru tanpa menyalin ulang yang lama.

// (2) Class extends Class Generic (Generic → Generic)
// ==============================================
// Class generic mewarisi class generic lain — subclass tetap generic,
// mewarisi semua member, dan boleh OVERRIDE method dengan tipe sama.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class Collection<T> { final List<T> _items = [];
//         void add(T item) { _items.add(item); } }
//       class UniqueCollection<T> extends Collection<T> {
//         @override void add(T item) { ... }
//       }
// TypeScript: Override tanpa anotasi khusus — signature harus cocok.
class Collection<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  count(): number {
    return this.items.length;
  }
}

class UniqueCollection<T> extends Collection<T> {
  add(item: T): void {
    if (!this.items.includes(item)) {
      super.add(item);
    }
  }
}

// Cetak hasil
console.log("\n// (2) Hasil UniqueCollection<T> extends Collection<T>:");
const uniq = new UniqueCollection<string>();
uniq.add("a");
uniq.add("a"); // duplikat — ditolak override add
uniq.add("b");
console.log(uniq.count()); // 2

// `protected` berarti: bisa diakses subclass, TIDAK bisa dari luar:
// const col = new Collection<number>();
// console.log(col.items);
// ERROR TS2445: Property 'items' is protected and only accessible within class 'Collection<T>' and its subclasses.

// Analogi Dart: BEDA penting! `_items` di Dart = private per LIBRARY — subclass
// di file lain TIDAK bisa akses. `protected` TypeScript = subclass SELALU bisa.
// TypeScript: UniqueCollection membaca this.items langsung — itu kekuatan protected.

// (3) Specialization: extends dengan Type Argument Tetap
// ==============================================
// Subclass TIDAK harus generic — boleh MENGUNCI type argument induknya.
// Hasilnya: class spesifik dengan semua kemampuan induk, T sudah ditentukan.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class StringCollection extends Collection<String> { ... }
// TypeScript: Sama persis — parent dikunci <string>, subclass tidak generic.
class StringCollection extends Collection<string> {
  join(separator: string): string {
    return this.items.join(separator);
  }
}

// Cetak hasil
console.log("\n// (3) Hasil StringCollection extends Collection<string>:");
const strs = new StringCollection();
strs.add("x");
strs.add("y");
console.log(strs.join("-")); // x-y - method baru spesifik string
console.log(strs.count()); // 2 - method warisan tetap jalan

// T dikunci string — tipe lain ditolak:
// strs.add(42);
// ERROR TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

// Analogi Dart: StringCollection di Dart juga hanya menerima String.
// TypeScript: Specialization = jalan tengah: generiknya induk, spesifiknya anak.

// (4) Constraint Diperketat di Subclass
// ==============================================
// Subclass boleh MEMPERKETAT constraint type parameter-nya (lebih sempit
// dari induk) — berguna saat subclass butuh kemampuan tambahan dari T.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: class CachedRepository<T extends Identifiable>
//           extends Repository<T> { ... } — valid juga di Dart.
// TypeScript: Sama — anak menuntut T punya id, induk tidak. (Identifiable dan
// Repository kita sudah kenal di materi 8 — sekarang versi extends CLASS.)
interface Identifiable {
  id: number;
}

class Repository<T> {
  protected all: T[] = [];

  save(item: T): T {
    this.all.push(item);
    return item;
  }

  getAll(): T[] {
    return this.all;
  }
}

class CachedRepository<T extends Identifiable> extends Repository<T> {
  private cache = new Map<number, T>();

  save(item: T): T {
    this.cache.set(item.id, item); // butuh item.id — itu sebabnya constraint
    return super.save(item);
  }

  findCached(id: number): T | undefined {
    return this.cache.get(id);
  }
}

// Cetak hasil
console.log("\n// (4) Hasil CachedRepository<T extends Identifiable>:");
interface Doc extends Identifiable {
  title: string;
}
const docs = new CachedRepository<Doc>();
docs.save({ id: 1, title: "TS" });
docs.save({ id: 2, title: "Dart" });
console.log(docs.getAll()); // [ { id: 1, title: 'TS' }, { id: 2, title: 'Dart' } ]
console.log(docs.findCached(2)); // { id: 2, title: 'Dart' }

// Tipe tanpa id ditolak saat instantiate:
// type PlainData = { name: string };
// new CachedRepository<PlainData>();
// ERROR TS2344: Type 'PlainData' does not satisfy the constraint 'Identifiable'.
//   Property 'id' is missing in type 'PlainData' but required in type 'Identifiable'.

// Analogi Dart: CachedRepository<PlainData> di Dart juga error — sama logikanya.
// TypeScript: Constraint anak mempersempit jagat T yang diterima.

// (5) Studi Kasus: Hirarki Lengkap — Interface + Implements + Extends
// ==============================================
// Gabungan semuanya: interface Shape sebagai kontrak, class konkret
// implements Shape, dan collection generic ber-constraint extends Collection.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: abstract class Shape { double area(); }
//       class Circle implements Shape { ... }
//       class ShapeCollection<T extends Shape> extends Collection<T> { ... }
// TypeScript: Susunan identik — semua konsep materi 7-8 menyatu.
interface Shape {
  area(): number;
}

class Circle implements Shape {
  constructor(private radius: number) { }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rect implements Shape {
  constructor(private w: number, private h: number) { }

  area(): number {
    return this.w * this.h;
  }
}

class ShapeCollection<T extends Shape> extends Collection<T> {
  totalArea(): number {
    return this.items.reduce((acc, s) => acc + s.area(), 0);
  }
}

// Cetak hasil
console.log("\n// (5) Hasil hirarki Shape lengkap:");
const shapes = new ShapeCollection<Shape>();
shapes.add(new Circle(1));
shapes.add(new Rect(2, 3));
console.log(shapes.count()); // 2
console.log(shapes.totalArea()); // 9.141592653589793 - luas lingkaran (pi) + persegi (6)

// Analogi Dart: Hirarki identik di Dart — area() polimorfik lewat kontrak Shape.
// TypeScript: totalArea aman memanggil s.area() karena constraint T extends Shape.

// ==== RANGKUMAN ====
// 1. Interface generic bisa extends interface generic: Revisioned<T> extends BaseModel<T>
// 2. Class generic extends class generic: subclass tetap generik, boleh override method
// 3. protected TS = subclass selalu bisa akses (beda dengan _private per library di Dart)
// 4. Specialization: extends dengan type argument tetap (extends Collection<string>)
// 5. Subclass boleh memperketat constraint (<T extends Identifiable>) — T jadi lebih sempit
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat interface generic 'Tagged' lalu interface 'StringNote' yang
//    extends Tagged<string> (specialization di level interface) + field author.
interface Tagged<T> {
  tags: string[];
  data: T;
}

interface StringNote extends Tagged<string> {
  author: string;
}

console.log("\n// Latihan 1: StringNote");
const note: StringNote = { tags: ["ts", "generic"], data: "extends!", author: "Budi" };
console.log(note); // { tags: [ 'ts', 'generic' ], data: 'extends!', author: 'Budi' }

// 2. Buat class generic 'SimpleList' lalu 'UniqueList' extends SimpleList<T>
//    yang menolak duplikat.
class SimpleList<T> {
  protected values: T[] = [];

  add(value: T): void {
    this.values.push(value);
  }

  count(): number {
    return this.values.length;
  }
}

class UniqueList<T> extends SimpleList<T> {
  add(value: T): void {
    if (!this.values.includes(value)) {
      super.add(value);
    }
  }
}

console.log("\n// Latihan 2: UniqueList");
const ul = new UniqueList<number>();
ul.add(1);
ul.add(1);
ul.add(2);
console.log(ul.count()); // 2

// 3. Buat class 'NumberList' extends SimpleList<number> (specialization)
//    dengan method sum().
class NumberList extends SimpleList<number> {
  sum(): number {
    return this.values.reduce((acc, v) => acc + v, 0);
  }
}

console.log("\n// Latihan 3: NumberList");
const nl = new NumberList();
nl.add(10);
nl.add(20.5);
console.log(nl.sum()); // 30.5

// 4. Buat interface 'Priced' lalu class 'Inventory<T extends Priced>'
//    extends SimpleList<T> dengan method totalPrice().
interface Priced {
  price: number;
}

class Inventory<T extends Priced> extends SimpleList<T> {
  totalPrice(): number {
    return this.values.reduce((acc, p) => acc + p.price, 0);
  }
}

console.log("\n// Latihan 4: Inventory");
const inv = new Inventory<Priced>();
inv.add({ price: 5000 });
inv.add({ price: 15000 });
console.log(inv.totalPrice()); // 20000

// 5. Buat interface 'Vehicle' lalu class 'Fleet<T extends Vehicle>'
//    extends SimpleList<T> dengan method names().
interface Vehicle {
  name: string;
}

class Fleet<T extends Vehicle> extends SimpleList<T> {
  names(): string[] {
    return this.values.map((v) => v.name);
  }
}

console.log("\n// Latihan 5: Fleet");
const fleet = new Fleet<Vehicle>();
fleet.add({ name: "Avanza" });
fleet.add({ name: "Tesla" });
console.log(fleet.names()); // [ 'Avanza', 'Tesla' ]
// ====
