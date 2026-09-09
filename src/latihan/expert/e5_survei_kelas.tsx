// ========================================
// LATIHAN EXPERT 5 — SURVEI KELAS (CAPSTONE)
// ========================================
// Level: Expert
// Konsep: capstone gabungan materi 1-10 — interface generic + constraint,
//          class implements, extends + override + super, method generic
//          dengan keyof, dan indexed access T[K].
// Program: penyimpanan pertanyaan survei yang bisa diaudit dan
//          melaporkan nilai satu kolom untuk semua baris.

// ========================================
// SOAL
// ========================================
// Aplikasi survei butuh lapisan data yang aman dan fleksibel.
// 1. Buat interface 'Entity' dan kontrak generic 'Repository<T extends
//    Entity>' (save + getAll), lalu class 'MemoryRepo<T extends Entity>'
//    implements kontrak itu + method generic valuesOf<K extends keyof T>(key: K):
//    Array<T[K]> — laporan nilai satu kolom semua baris.
// 2. Buat class 'AuditedRepo<T extends Entity> extends MemoryRepo<T>' yang
//    override save untuk mencatat log id sebelum super.save.
// 3. Uji dengan tipe Question (id, text, votes): simpan dua pertanyaan,
//    cetak valuesOf("text"), valuesOf("votes"), isi log, dan jumlah baris.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) KONTRAK + IMPLEMENTASI + METHOD GENERIC keyof — tiga konsep
//     menyatu: Repository<T extends Entity> (materi 7 + 4), MemoryRepo
//     implements (materi 8), valuesOf<K extends keyof T> (materi 5 di
//     dalam method generic — materi 10). K dikunci ke nama properti T;
//     T[K] = tipe nilai kolom itu — valuesOf("text") pasti string[].
//     (Jika di Dart: hirarki abstract class Repository<T extends Entity>
//       + implements/extends identik di Dart; tapi Dart TIDAK punya
//       keyof — daftar nama field tidak bisa dikunci compile-time tanpa
//       code generation; keyof + T[K] adalah keunggulan type-level TS)
// ------------------------------------------------------------------
interface Entity {
  id: number;
}

interface Repository<T extends Entity> {
  save(item: T): T;
  getAll(): T[];
}

class MemoryRepo<T extends Entity> implements Repository<T> {
  protected rows: T[] = [];

  save(item: T): T {
    this.rows.push(item);
    return item;
  }

  getAll(): T[] {
    return this.rows;
  }

  valuesOf<K extends keyof T>(key: K): Array<T[K]> {
    return this.rows.map((row) => row[key]);
  }
}

// ------------------------------------------------------------------
// (2) SUBCLASS DENGAN OVERRIDE + SUPER — AuditedRepo menambah audit
//     log SEBELUM menyimpan, lalu memanggil super.save(item) agar
//     logika penyimpanan induk tetap satu-satunya tempat push.
//     Constraint <T extends Entity> diwarisi kebutuhannya: log memakai
//     item.id, jadi T wajib punya id (recall CachedRepository materi 9).
// ------------------------------------------------------------------
class AuditedRepo<T extends Entity> extends MemoryRepo<T> {
  log: string[] = [];

  save(item: T): T {
    this.log.push(`simpan #${item.id}`);
    return super.save(item);
  }
}

// ------------------------------------------------------------------
// (3) UJI LENGKAP — Question memenuhi Entity via extends (id + 2 kolom
//     baru). valuesOf dipanggil dengan "text" dan "votes" — salah
//     ketik nama kolom langsung error compile, itulah keyof bekerja.
// ------------------------------------------------------------------
interface Question extends Entity {
  text: string;
  votes: number;
}

const surveys = new AuditedRepo<Question>();
surveys.save({ id: 1, text: "Materi favorit?", votes: 12 });
surveys.save({ id: 2, text: "Konsep tersulit?", votes: 8 });
console.log(surveys.valuesOf("text")); // [ 'Materi favorit?', 'Konsep tersulit?' ]
console.log(surveys.valuesOf("votes")); // [ 12, 8 ]
console.log(surveys.log); // [ 'simpan #1', 'simpan #2' ]
console.log(surveys.getAll().length); // 2

// ========================================
// RANGKUMAN
// ========================================
// - Kontrak: Repository<T extends Entity> — generic interface + constraint
//   dalam satu kontrak (materi 7 + 4).
// - Implementasi: MemoryRepo implements kontrak, AuditedRepo extends +
//   override + super — penyimpanan tetap satu tempat, audit lapisan baru.
// - Method generic valuesOf<K extends keyof T>: K = nama kolom, T[K] =
//   tipe nilainya — laporan kolom apa pun type-safe tanpa perulangan kode.
// - Capstone ini merangkai: generic interface, constraint, class generic,
//   implements, extends, override/super, method generic, keyof, T[K].
//   (Jika di Dart: seluruh hirarki class/interface-nya bisa ditulis
//     hampir baris-per-baris sama di Dart — kecuali valuesOf keyof:
//     kolom by-name compile-time adalah fitur yang tidak dimiliki Dart
//     tanpa code generation)
