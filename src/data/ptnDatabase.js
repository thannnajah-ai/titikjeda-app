// Basis Data Rasionalisasi Program Studi PTN SNBT/UTBK 2026
// Data referensi skor aman, batas minimum, daya tampung, dan rasio keketatan persaingan

export const PTN_DATABASE = [
  // ================= UNIVERSITAS INDONESIA (UI) =================
  {
    id: "ui-kedokteran",
    ptn: "Universitas Indonesia (UI)",
    kampusSingkat: "UI",
    prodi: "Pendidikan Dokter",
    rumpun: "SAINTEK",
    dayaTampung: 75,
    peminat: 3420,
    keketatan: "2.19%",
    passingScoreSafe: 765,
    passingScoreMin: 720,
    catatan: "Salah satu prodi dengan persaingan paling ketat di Indonesia. Wajib konsisten di atas 730."
  },
  {
    id: "ui-ilmu-komputer",
    ptn: "Universitas Indonesia (UI)",
    kampusSingkat: "UI",
    prodi: "Ilmu Komputer",
    rumpun: "SAINTEK",
    dayaTampung: 60,
    peminat: 2150,
    keketatan: "2.79%",
    passingScoreSafe: 745,
    passingScoreMin: 700,
    catatan: "Fasilitas Fasilkom UI berstandar internasional. Menuntut subtes Kuantitatif & Logika tinggi."
  },
  {
    id: "ui-sistem-informasi",
    ptn: "Universitas Indonesia (UI)",
    kampusSingkat: "UI",
    prodi: "Sistem Informasi",
    rumpun: "SAINTEK",
    dayaTampung: 60,
    peminat: 1890,
    keketatan: "3.17%",
    passingScoreSafe: 725,
    passingScoreMin: 680,
    catatan: "Kombinasi komputasi dan manajemen bisnis."
  },
  {
    id: "ui-ilmu-hukum",
    ptn: "Universitas Indonesia (UI)",
    kampusSingkat: "UI",
    prodi: "Ilmu Hukum",
    rumpun: "SOSHUM",
    dayaTampung: 150,
    peminat: 4100,
    keketatan: "3.65%",
    passingScoreSafe: 710,
    passingScoreMin: 665,
    catatan: "Fakultas Hukum tertua dan terkemuka. Membutuhkan Literasi Bahasa & Silogisme tinggi."
  },
  {
    id: "ui-akuntansi",
    ptn: "Universitas Indonesia (UI)",
    kampusSingkat: "UI",
    prodi: "Akuntansi",
    rumpun: "SOSHUM",
    dayaTampung: 80,
    peminat: 2340,
    keketatan: "3.41%",
    passingScoreSafe: 720,
    passingScoreMin: 675,
    catatan: "FEUI bereputasi tinggi di sektor perbankan dan multinasional."
  },
  {
    id: "ui-ilmu-komunikasi",
    ptn: "Universitas Indonesia (UI)",
    kampusSingkat: "UI",
    prodi: "Ilmu Komunikasi",
    rumpun: "SOSHUM",
    dayaTampung: 60,
    peminat: 2890,
    keketatan: "2.07%",
    passingScoreSafe: 715,
    passingScoreMin: 670,
    catatan: "Keketatan sangat tinggi di rumpun Soshum FISIP UI."
  },

  // ================= INSTITUT TEKNOLOGI BANDUNG (ITB) =================
  {
    id: "itb-stei-k",
    ptn: "Institut Teknologi Bandung (ITB)",
    kampusSingkat: "ITB",
    prodi: "STEI - Komputasi (Informatika & STI)",
    rumpun: "SAINTEK",
    dayaTampung: 110,
    peminat: 3820,
    keketatan: "2.87%",
    passingScoreSafe: 760,
    passingScoreMin: 715,
    catatan: "Kiblat teknik informatika Indonesia. Butuh skor PK & PU Tier-1."
  },
  {
    id: "itb-fti",
    ptn: "Institut Teknologi Bandung (ITB)",
    kampusSingkat: "ITB",
    prodi: "FTI - Rekayasa Industri & Kimia",
    rumpun: "SAINTEK",
    dayaTampung: 140,
    peminat: 2950,
    keketatan: "4.74%",
    passingScoreSafe: 725,
    passingScoreMin: 680,
    catatan: "Mencakup Teknik Industri dan Teknik Kimia bergengsi."
  },
  {
    id: "itb-sbm",
    ptn: "Institut Teknologi Bandung (ITB)",
    kampusSingkat: "ITB",
    prodi: "SBM - Manajemen Bisnis",
    rumpun: "SOSHUM",
    dayaTampung: 90,
    peminat: 2780,
    keketatan: "3.23%",
    passingScoreSafe: 730,
    passingScoreMin: 685,
    catatan: "Sekolah bisnis berbasis teknologi dengan akreditasi AACSB dunia."
  },
  {
    id: "itb-fttm",
    ptn: "Institut Teknologi Bandung (ITB)",
    kampusSingkat: "ITB",
    prodi: "FTTM - Tambang & Perminyakan",
    rumpun: "SAINTEK",
    dayaTampung: 120,
    peminat: 2600,
    keketatan: "4.61%",
    passingScoreSafe: 730,
    passingScoreMin: 685,
    catatan: "Rumpun teknik sumber daya energi terfavorit di ITB."
  },

  // ================= UNIVERSITAS GADJAH MADA (UGM) =================
  {
    id: "ugm-kedokteran",
    ptn: "Universitas Gadjah Mada (UGM)",
    kampusSingkat: "UGM",
    prodi: "Kedokteran",
    rumpun: "SAINTEK",
    dayaTampung: 70,
    peminat: 3650,
    keketatan: "1.91%",
    passingScoreSafe: 760,
    passingScoreMin: 715,
    catatan: "FK UGM legendaris. Passing grade masuk jajaran 3 besar tertinggi nasional."
  },
  {
    id: "ugm-teknik-sipil",
    ptn: "Universitas Gadjah Mada (UGM)",
    kampusSingkat: "UGM",
    prodi: "Teknik Sipil",
    rumpun: "SAINTEK",
    dayaTampung: 80,
    peminat: 1720,
    keketatan: "4.65%",
    passingScoreSafe: 705,
    passingScoreMin: 660,
    catatan: "Prodi teknik sipil rujukan infrastruktur nasional."
  },
  {
    id: "ugm-psikologi",
    ptn: "Universitas Gadjah Mada (UGM)",
    kampusSingkat: "UGM",
    prodi: "Psikologi",
    rumpun: "SOSHUM",
    dayaTampung: 90,
    peminat: 3890,
    keketatan: "2.31%",
    passingScoreSafe: 715,
    passingScoreMin: 670,
    catatan: "Fakultas Psikologi pertama di Indonesia dengan peminat sangat masif."
  },
  {
    id: "ugm-manajemen",
    ptn: "Universitas Gadjah Mada (UGM)",
    kampusSingkat: "UGM",
    prodi: "Manajemen",
    rumpun: "SOSHUM",
    dayaTampung: 65,
    peminat: 2640,
    keketatan: "2.46%",
    passingScoreSafe: 715,
    passingScoreMin: 670,
    catatan: "FEB UGM bereputasi tinggi dengan jaringan alumni kuat."
  },

  // ================= UNIVERSITAS AIRLANGGA (UNAIR) =================
  {
    id: "unair-kedokteran",
    ptn: "Universitas Airlangga (UNAIR)",
    kampusSingkat: "UNAIR",
    prodi: "Kedokteran",
    rumpun: "SAINTEK",
    dayaTampung: 100,
    peminat: 3150,
    keketatan: "3.17%",
    passingScoreSafe: 750,
    passingScoreMin: 705,
    catatan: "FK Unair adalah pusat rujukan medis tertua di Jawa Timur."
  },
  {
    id: "unair-farmasi",
    ptn: "Universitas Airlangga (UNAIR)",
    kampusSingkat: "UNAIR",
    prodi: "Farmasi",
    rumpun: "SAINTEK",
    dayaTampung: 85,
    peminat: 1820,
    keketatan: "4.67%",
    passingScoreSafe: 700,
    passingScoreMin: 655,
    catatan: "Fakultas Farmasi papan atas dengan industri riset klinis kuat."
  },
  {
    id: "unair-ilmu-hukum",
    ptn: "Universitas Airlangga (UNAIR)",
    kampusSingkat: "UNAIR",
    prodi: "Ilmu Hukum",
    rumpun: "SOSHUM",
    dayaTampung: 140,
    peminat: 2450,
    keketatan: "5.71%",
    passingScoreSafe: 685,
    passingScoreMin: 640,
    catatan: "FH Unair terkenal dengan spesialisasi hukum bisnis dan maritim."
  },

  // ================= INSTITUT TEKNOLOGI SEPULUH NOPEMBER (ITS) =================
  {
    id: "its-teknik-informatika",
    ptn: "Institut Teknologi Sepuluh Nopember (ITS)",
    kampusSingkat: "ITS",
    prodi: "Teknik Informatika",
    rumpun: "SAINTEK",
    dayaTampung: 90,
    peminat: 2560,
    keketatan: "3.51%",
    passingScoreSafe: 735,
    passingScoreMin: 690,
    catatan: "Juara bertahan lomba robotik dan pemrograman nasional."
  },
  {
    id: "its-sistem-informasi",
    ptn: "Institut Teknologi Sepuluh Nopember (ITS)",
    kampusSingkat: "ITS",
    prodi: "Sistem Informasi",
    rumpun: "SAINTEK",
    dayaTampung: 65,
    peminat: 1740,
    keketatan: "3.73%",
    passingScoreSafe: 710,
    passingScoreMin: 665,
    catatan: "Pilihan favorit bagi yang memadukan rekayasa sistem dan data korporat."
  },
  {
    id: "its-teknik-mesin",
    ptn: "Institut Teknologi Sepuluh Nopember (ITS)",
    kampusSingkat: "ITS",
    prodi: "Teknik Mesin",
    rumpun: "SAINTEK",
    dayaTampung: 80,
    peminat: 1420,
    keketatan: "5.63%",
    passingScoreSafe: 695,
    passingScoreMin: 650,
    catatan: "Kuat di bidang desain otomotif, konversi energi, dan manufaktur."
  },

  // ================= UNIVERSITAS DIPONEGORO (UNDIP) =================
  {
    id: "undip-kedokteran",
    ptn: "Universitas Diponegoro (UNDIP)",
    kampusSingkat: "UNDIP",
    prodi: "Kedokteran",
    rumpun: "SAINTEK",
    dayaTampung: 85,
    peminat: 2980,
    keketatan: "2.85%",
    passingScoreSafe: 740,
    passingScoreMin: 695,
    catatan: "FK Undip didukung Rumah Sakit Nasional Diponegoro yang megah."
  },
  {
    id: "undip-hukum",
    ptn: "Universitas Diponegoro (UNDIP)",
    kampusSingkat: "UNDIP",
    prodi: "Hukum",
    rumpun: "SOSHUM",
    dayaTampung: 220,
    peminat: 4200,
    keketatan: "5.23%",
    passingScoreSafe: 680,
    passingScoreMin: 635,
    catatan: "Salah satu fakultas hukum dengan pendaftar terbanyak di Indonesia."
  },
  {
    id: "undip-teknik-sipil",
    ptn: "Universitas Diponegoro (UNDIP)",
    kampusSingkat: "UNDIP",
    prodi: "Teknik Sipil",
    rumpun: "SAINTEK",
    dayaTampung: 100,
    peminat: 1950,
    keketatan: "5.12%",
    passingScoreSafe: 685,
    passingScoreMin: 640,
    catatan: "Fakultas Teknik tertua di Jawa Tengah."
  },

  // ================= UNIVERSITAS PADJADJARAN (UNPAD) =================
  {
    id: "unpad-kedokteran",
    ptn: "Universitas Padjadjaran (UNPAD)",
    kampusSingkat: "UNPAD",
    prodi: "Kedokteran",
    rumpun: "SAINTEK",
    dayaTampung: 95,
    peminat: 3300,
    keketatan: "2.87%",
    passingScoreSafe: 745,
    passingScoreMin: 700,
    catatan: "FK Unpad terkenal dengan pendekatan Kedokteran Komunitas di Jatinangor."
  },
  {
    id: "unpad-psikologi",
    ptn: "Universitas Padjadjaran (UNPAD)",
    kampusSingkat: "UNPAD",
    prodi: "Psikologi",
    rumpun: "SAINTEK",
    dayaTampung: 70,
    peminat: 2920,
    keketatan: "2.39%",
    passingScoreSafe: 710,
    passingScoreMin: 665,
    catatan: "Psikologi Unpad masuk rumpun Saintek dengan fokus neurobiologi perilaku."
  },
  {
    id: "unpad-ilmu-komunikasi",
    ptn: "Universitas Padjadjaran (UNPAD)",
    kampusSingkat: "UNPAD",
    prodi: "Ilmu Komunikasi",
    rumpun: "SOSHUM",
    dayaTampung: 80,
    peminat: 3450,
    keketatan: "2.31%",
    passingScoreSafe: 700,
    passingScoreMin: 655,
    catatan: "Fikom Unpad adalah pelopor pendidikan komunikasi di Indonesia."
  },

  // ================= INSTITUT PERTANIAN BOGOR (IPB) =================
  {
    id: "ipb-ilmu-komputer",
    ptn: "IPB University (IPB)",
    kampusSingkat: "IPB",
    prodi: "Ilmu Komputer",
    rumpun: "SAINTEK",
    dayaTampung: 70,
    peminat: 1650,
    keketatan: "4.24%",
    passingScoreSafe: 715,
    passingScoreMin: 670,
    catatan: "Kuat di bidang AI agromaritim dan pengolahan data bioinformatika."
  },
  {
    id: "ipb-aktuaria",
    ptn: "IPB University (IPB)",
    kampusSingkat: "IPB",
    prodi: "Aktuaria",
    rumpun: "SAINTEK",
    dayaTampung: 40,
    peminat: 1100,
    keketatan: "3.63%",
    passingScoreSafe: 720,
    passingScoreMin: 675,
    catatan: "Prodi langka dengan prospek profesi aktuaris bersertifikasi."
  },
  {
    id: "ipb-kedokteran-hewan",
    ptn: "IPB University (IPB)",
    kampusSingkat: "IPB",
    prodi: "Kedokteran Hewan",
    rumpun: "SAINTEK",
    dayaTampung: 95,
    peminat: 1480,
    keketatan: "6.41%",
    passingScoreSafe: 675,
    passingScoreMin: 630,
    catatan: "FKH tertua dan rujukan veteriner se-Asia Tenggara."
  },

  // ================= UNIVERSITAS BRAWIJAYA (UB) =================
  {
    id: "ub-kedokteran",
    ptn: "Universitas Brawijaya (UB)",
    kampusSingkat: "UB",
    prodi: "Kedokteran",
    rumpun: "SAINTEK",
    dayaTampung: 120,
    peminat: 3550,
    keketatan: "3.38%",
    passingScoreSafe: 740,
    passingScoreMin: 695,
    catatan: "FK UB di Malang dengan peminat pendaftar tertinggi di Jawa Timur."
  },
  {
    id: "ub-teknik-informatika",
    ptn: "Universitas Brawijaya (UB)",
    kampusSingkat: "UB",
    prodi: "Teknik Informatika",
    rumpun: "SAINTEK",
    dayaTampung: 110,
    peminat: 2800,
    keketatan: "3.92%",
    passingScoreSafe: 705,
    passingScoreMin: 660,
    catatan: "FILKOM UB dengan fasilitas laboratorium mutakhir."
  },
  {
    id: "ub-ilmu-hukum",
    ptn: "Universitas Brawijaya (UB)",
    kampusSingkat: "UB",
    prodi: "Ilmu Hukum",
    rumpun: "SOSHUM",
    dayaTampung: 180,
    peminat: 3100,
    keketatan: "5.80%",
    passingScoreSafe: 670,
    passingScoreMin: 625,
    catatan: "Kapasitas besar dan akreditasi internasional FIBAA."
  }
];

// Helper kalkulasi status rasionalisasi
export function evaluatePtnChance(userScore, major) {
  const safeScore = major.passingScoreSafe;
  const minScore = major.passingScoreMin;
  const scoreDiff = userScore - safeScore;

  if (userScore >= safeScore) {
    return {
      status: "ZONA AMAN (RASIONAL TINGGI)",
      statusColor: "text-emerald-500 border-emerald-500 bg-emerald-950/20",
      badgeColor: "bg-emerald-600 text-white",
      probabilityPct: Math.min(96, Math.round(85 + (userScore - safeScore) * 0.3)),
      verdict: "Pilihan Rasional Utama. Skor Anda melampaui ambang batas historis tahun lalu. Pertahankan disiplin pengerjaan soal setiap hari.",
      recommendation: "Sangat direkomendasikan ditempatkan sebagai Pilihan 1 SNBT."
    };
  } else if (userScore >= minScore) {
    return {
      status: "ZONA TARUNG (KOMPETITIF)",
      statusColor: "text-amber-500 border-amber-500 bg-amber-950/20",
      badgeColor: "bg-amber-500 text-black",
      probabilityPct: Math.max(45, Math.round(50 + ((userScore - minScore) / (safeScore - minScore)) * 30)),
      verdict: `Pilihan Berpeluang tapi Ketat. Anda hanya berjarak ${Math.abs(scoreDiff)} poin dari batas aman. Fokus perbaiki subtes terlemah Anda di Titik Buta.`,
      recommendation: "Cocok sebagai Pilihan 1, dengan syarat Pilihan 2 WAJIB memilih prodi di Zona Aman."
    };
  } else {
    return {
      status: "ZONA RISIKO TINGGI (HALUSINASI)",
      statusColor: "text-red-500 border-red-500 bg-red-950/20",
      badgeColor: "bg-red-600 text-white",
      probabilityPct: Math.max(12, Math.round(30 - ((minScore - userScore) * 0.4))),
      verdict: `Terlalu Berisiko. Skor saat ini berjarak ${Math.abs(scoreDiff)} poin di bawah batas aman. Menjadikan prodi ini pilihan tunggal sangat berbahaya bagi kelulusan.`,
      recommendation: "Gunakan strategi cadangan: Lakukan drilling Pareto minimal 3 minggu sebelum menetapkan prodi ini."
    };
  }
}
