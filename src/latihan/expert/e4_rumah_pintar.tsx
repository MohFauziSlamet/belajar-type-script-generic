// ========================================
// LATIHAN EXPERT 4 — RUMAH PINTAR
// ========================================
// Level: Expert
// Konsep: generic method dalam class + kapan eksplisit WAJIB (materi 10)
// Program: hub perangkat IoT — sensor mendaftarkan handler per topik,
//          dan setiap topik punya tipe payload berbeda.

// ========================================
// SOAL
// ========================================
// Rumah pintar punya banyak sensor dengan tipe event berbeda.
// 1. Buat class 'DeviceHub' (non-generic) dengan method generic
//    on<T>(topic, handler) dan emit<T>(topic, payload) — handler
//    disimpan di Map internal per topik.
// 2. Daftarkan dua handler dengan type argument EKSPLISIT:
//    on<TempReading>("suhu", ...) dan on<MotionAlert>("gerak", ...).
// 3. Emit dua event, jelaskan mengapa eksplisit WAJIB (T tidak punya
//    sumber inference dari argumen topic string), lalu cetak jumlah
//    handler per topik dengan method handlerCount.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) HUB DENGAN METHOD GENERIC — on<T> dan emit<T> punya type
//     parameter SENDIRI: satu hub menangani topik dengan tipe payload
//     berbeda tanpa class generic. Catatan jujur: Map internal
//     menyimpan handler lintas tipe, makanya butuh cast internal
//     (payload: unknown) — pola EventBus materi 10; konvensi satu
//     topik = satu tipe dijaga oleh pemanggil.
//     (Jika di Dart: StreamController<T> di Flutter menuntut SATU tipe
//       per controller; event bus berbasis string topik di Dart juga
//       tidak bisa menebak T dari nama topik — anotasi eksplisit di
//       handler sama wajibnya)
// ------------------------------------------------------------------
interface TempReading {
  room: string;
  celsius: number;
}

interface MotionAlert {
  sensor: string;
  at: string;
}

class DeviceHub {
  private handlers = new Map<string, Array<(payload: unknown) => void>>();

  on<T>(topic: string, handler: (payload: T) => void): void {
    const list = this.handlers.get(topic) ?? [];
    list.push(handler as (payload: unknown) => void);
    this.handlers.set(topic, list);
  }

  emit<T>(topic: string, payload: T): void {
    (this.handlers.get(topic) ?? []).forEach((h) => h(payload));
  }

  // pembeda dari studi kasus EventBus materi 10: laporan jumlah listener
  handlerCount(topic: string): number {
    return this.handlers.get(topic)?.length ?? 0;
  }
}

// ------------------------------------------------------------------
// (2) EKSPLISIT WAJIB — perhatikan T pada on<T> HANYA muncul di tipe
//     parameter handler; argumen "suhu" hanyalah string biasa yang
//     tidak membawa informasi tipe. Tanpa <TempReading>, T tidak punya
//     sumber inference → jatuh ke unknown → akses p.room ditolak
//     (error TS18046, recall studi kasus EventBus materi 10). Dengan
//     eksplisit, payload handler ter-infer lengkap.
// ------------------------------------------------------------------
const hub = new DeviceHub();
hub.on<TempReading>("suhu", (p) => console.log(`${p.room}: ${p.celsius}°C`)); // p = TempReading
hub.on<MotionAlert>("gerak", (p) => console.log(`gerak di ${p.sensor} (${p.at})`)); // p = MotionAlert

// ------------------------------------------------------------------
// (3) EMIT — handler terpanggil dengan payload yang tepat. emit<T>
//     sendiri tidak perlu eksplisit: argumen payload jadi sumber
//     inference-nya. handlerCount (method biasa non-generic) hidup
//     berdampingan dengan method generic dalam class yang sama.
// ------------------------------------------------------------------
hub.emit("suhu", { room: "Ruang Tamu", celsius: 26.5 }); // Ruang Tamu: 26.5°C
hub.emit("gerak", { sensor: "pintu depan", at: "22:10" }); // gerak di pintu depan (22:10)
console.log(hub.handlerCount("suhu")); // 1
console.log(hub.handlerCount("lainnya")); // 0  (topik tanpa listener)

// ========================================
// RANGKUMAN
// ========================================
// - Method generic membuat class non-generic menangani banyak tipe —
//   DeviceHub satu-satunya class, tipe per topik dikunci per pemanggilan.
// - Inference butuh T muncul di tipe ARGUMEN — topic string tidak
//   membawa tipe, jadi eksplisit on<TempReading> WAJIB; tanpanya
//   payload = unknown.
// - emit<T> tidak butuh eksplisit: payload-nya argumen inference.
//   (Jika di Dart: Dart juga tidak bisa menebak T dari string topik —
//     handler generic seperti void Function(T) menuntut anotasi tipe
//     eksplisit di parameter lambda; jalan paling lazim bebas anotasi
//     di Flutter adalah satu StreamController<T> per tipe event —
//     alternatif lain: sealed class + pattern matching Dart 3 pada
//     satu Stream<Event> induk)
