// ========================================
// LATIHAN MIDDLE 1 — STATISTIK NILAI UJIAN
// ========================================
// Level: Middle
// Konsep: constraint <T extends number> (materi 4)
// Program: menghitung rata-rata dan nilai terendah dari nilai ujian siswa.

// ========================================
// SOAL
// ========================================
// Guru ingin mengolah nilai ujian (bisa int atau desimal).
// 1. Buat function generic averageScore<T extends number>(scores: T[]): number
//    yang menghitung rata-rata nilai.
// 2. Buat function generic minScore<T extends number>(scores: T[]): T | undefined
//    yang mencari nilai TERENDAH (array kosong → undefined) — TANPA cast.
// 3. Uji dengan nilai int, nilai desimal campur, dan array kosong.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) RATA-RATA — constraint T extends number diperlukan agar operasi
//     aritmetika di dalamnya aman (tanpa constraint: error TS2365).
//     (Jika di Dart: double average<T extends num>(List<T> scores) =>
//       scores.fold<num>(0, (a, b) => a + b) / scores.length; —
//       T extends num di Dart setara T extends number di TS)
// ------------------------------------------------------------------
function averageScore<T extends number>(scores: T[]): number {
  return scores.reduce((acc, v) => acc + v, 0) / scores.length;
}

console.log(averageScore([80, 90, 100])); // 90

// ------------------------------------------------------------------
// (2) NILAI TERENDAH — JEBAKAN: Math.min(...scores) mengembalikan number,
//     BUKAN T — padahal return type kita T | undefined. number tidak bisa
//     di-assign ke T meskipun T extends number (T bisa sub-tipe lain).
//     Solusi bersih: iterasi manual — membandingkan dan menyimpan T asli.
// ------------------------------------------------------------------
function minScore<T extends number>(scores: T[]): T | undefined {
  let min: T | undefined;
  for (const s of scores) {
    if (min === undefined || s < min) {
      min = s;
    }
  }
  return min;
}

console.log(minScore([80, 75.5, 90])); // 75.5  (desimal menang, tetap T)
console.log(minScore([])); // undefined  (kosong: aman)
console.log(minScore([100])); // 100

// ========================================
// RANGKUMAN
// ========================================
// - <T extends number> membuka operasi aritmetika — tanpanya compiler menolak (materi 4).
// - Math.min(...) = number, BUKAN T — hasil library builtin sering melebar ke tipe dasar;
//   iterasi manual menjaga T tetap utuh tanpa cast.
//   (Jika di Dart: math.min justru generic — T min<T extends num>(T a, T b) → T;
//    Math.min di TS SELALU number — kontras dengan Dart, makanya iterasi manual diperlukan)
// - T | undefined untuk kasus array kosong — konsisten dengan pola null-safety TS.
// - Return T (bukan number) membuat hasil tetap presisi tipenya untuk pemanggil.
