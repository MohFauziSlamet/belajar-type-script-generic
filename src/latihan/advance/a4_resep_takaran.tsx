// ========================================
// LATIHAN ADVANCE 4 — TAKARAN RESEP MASAK
// ========================================
// Level: Advance
// Konsep: static member di class generic (materi 8)
// Program: membaca takaran resep dari teks ("250gr", "180°C") dengan
//          parser yang punya resep bawaan siap pakai.

// ========================================
// SOAL
// ========================================
// Aplikasi resep masak membaca takaran berupa teks dari input pengguna.
// 1. Buat class generic 'Measure<T>' yang menyimpan callback parse
//    (raw: string) => T | null, plus method parseOr(raw, fallback): T.
// 2. Buat static helper 'toNumber' DAN dua parser bawaan: Measure.gram
//    dan Measure.celsius — keduanya instantiation KONKRET Measure<number>.
// 3. Uji: teks valid ("250gr", "180°C") dan teks rusak ("sejumput")
//    yang harus jatuh ke fallback.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) CLASS GENERIC + FALLBACK — callback parse mengembalikan T | null:
//     null berarti teks rusak, lalu parseOr mengembalikan fallback.
//     (Jika di Dart: class Measure<T> { final T? Function(String) parse;
//       Measure(this.parse); T parseOr(String raw, T fallback) ... }
//       — bentuknya sama; null-safety Dart pas dengan pola T | null)
// ------------------------------------------------------------------
class Measure<T> {
  constructor(private parse: (raw: string) => T | null) {}

  parseOr(raw: string, fallback: T): T {
    const parsed = this.parse(raw);
    return parsed === null ? fallback : parsed;
  }

  // ----------------------------------------------------------------
  // (2) STATIC HELPER + PARSER BAWAAN — aturan penting: static member
  // milik CLASS, bukan instance, jadi TIDAK boleh memakai T class
  // (coba saja: error TS2302 "Static members cannot reference class
  // type parameters"). Solusinya dua macam, dua-duanya dipakai di sini:
  //   a. static METHOD tanpa T sama sekali (toNumber memakai tipe konkret)
  //   b. static PROPERTY berupa instantiation konkret Measure<number>
  // ----------------------------------------------------------------
  private static toNumber(raw: string, suffix: string): number | null {
    if (!raw.endsWith(suffix)) {
      return null;
    }
    const n = Number(raw.slice(0, -suffix.length));
    return Number.isNaN(n) ? null : n;
  }

  static gram = new Measure<number>((raw) => Measure.toNumber(raw, "gr"));
  static celsius = new Measure<number>((raw) => Measure.toNumber(raw, "°C"));
}

// ------------------------------------------------------------------
// (3) PEMAKAIAN — "250gr" → 250, "180°C" → 180, "sejumput" tidak
//     berakhiran gr/°C → null → fallback 0. Semua hasil number aman,
//     tidak ada any atau cast.
// ------------------------------------------------------------------
console.log(Measure.gram.parseOr("250gr", 0)); // 250
console.log(Measure.gram.parseOr("sejumput", 0)); // 0  (teks rusak → fallback)
console.log(Measure.celsius.parseOr("180°C", 0)); // 180

// ========================================
// RANGKUMAN
// ========================================
// - Static member TIDAK boleh mereferensikan T class — T hanya hidup
//   per-instance, static milik class (TS2302).
// - Dua jalan keluar: static method dengan tipe konkret (toNumber) atau
//   static property berupa instantiation konkret (Measure.gram).
// - Pola "callback T | null + parseOr fallback" = parser yang aman gagal
//   tanpa exception — fallback bertipe T menjaga hasil tetap presisi.
//   (Jika di Dart: aturannya SAMA PERSIS — "Static members can't reference
//     type parameters of the class" — dan solusinya pun sama:
//     static gram = Measure<int>(...) konkret, bukan Measure<T>)
