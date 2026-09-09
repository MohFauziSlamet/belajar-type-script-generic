// ========================================
// LATIHAN ADVANCE 3 — PAPAN SKOR E-SPORT
// ========================================
// Level: Advance
// Konsep: generic class + constraint implements generic interface (materi 8)
// Program: papan skor turnamen yang hanya menerima peserta punya skor,
//          lengkap dengan papan peringkat dan total poin.

// ========================================
// SOAL
// ========================================
// Turnamen e-sport butuh papan skor.
// 1. Buat interface 'Scored' (name: string, points: number) dan tipe
//    'Player' yang menambahkan properti team.
// 2. Buat interface generic 'Board<T>' dengan method add, top(n), dan
//    totalPoints — kontrak untuk papan skor tipe apa pun.
// 3. Buat class generic 'Scoreboard<T extends Scored>' yang implements
//    Board<T>, lalu uji: masukkan 3 pemain, cetak top(2) dan totalPoints.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) BENTUK DATA — Scored = syarat minimal peserta (punya nama & poin).
//     Player menambah properti team — Player OTOMATIS memenuhi Scored
//     karena structural typing (recall materi 4 & m4 latihan middle).
// ------------------------------------------------------------------
interface Scored {
  name: string;
  points: number;
}

interface Player extends Scored {
  team: string;
}

// ------------------------------------------------------------------
// (2) KONTRAK Board<T> — generic interface murni berisi method.
//     (Jika di Dart: abstract class Board<T> { void add(T entry);
//       List<T> top(int n); int totalPoints(); } — kontrak serupa,
//       hanya penerapannya lewat class di Dart)
// ------------------------------------------------------------------
interface Board<T> {
  add(entry: T): void;
  top(n: number): T[];
  totalPoints(): number;
}

// ------------------------------------------------------------------
// (3) CLASS GENERIC + CONSTRAINT — T extends Scored membuka akses
//     e.points di dalam class (tanpanya compiler menolak). Semua method
//     kontrak diimplementasi; internal berupa array T[].
// ------------------------------------------------------------------
class Scoreboard<T extends Scored> implements Board<T> {
  private entries: T[] = [];

  add(entry: T): void {
    this.entries.push(entry);
  }

  top(n: number): T[] {
    return [...this.entries].sort((a, b) => b.points - a.points).slice(0, n);
  }

  totalPoints(): number {
    return this.entries.reduce((acc, e) => acc + e.points, 0);
  }
}

const board = new Scoreboard<Player>();
board.add({ name: "Rifqi", points: 120, team: "Merah" });
board.add({ name: "Sari", points: 200, team: "Biru" });
board.add({ name: "Tono", points: 150, team: "Merah" });
console.log(board.top(2));
// [
//   { name: 'Sari', points: 200, team: 'Biru' },
//   { name: 'Tono', points: 150, team: 'Merah' }
// ]
console.log(board.totalPoints()); // 470

// ========================================
// RANGKUMAN
// ========================================
// - Class generic bisa implements interface generic:
//   Scoreboard<T extends Scored> implements Board<T> — T mengalir dari
//   constraint ke kontrak tanpa duplikasi.
// - Constraint <T extends Scored> = tiket masuk: hanya tipe punya name &
//   points boleh masuk papan skor — dan e.points AMAN diakses di dalam.
// - top(n) mengembalikan T[] utuh (Player lengkap dengan team), bukan
//   proyeksi sebagian — sorting pakai spread [...] agar array asli tak berubah.
//   (Jika di Dart: class Scoreboard<T extends Scored> implements Board<T>
//     — sintaks dan maknanya identik persis di Dart; yang beda hanya
//     Board berupa abstract class, bukan interface murni)
