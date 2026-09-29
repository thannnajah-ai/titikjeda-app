// Mesin AI Bedah Soal Bebas Pareto
// Mengurai soal rumit menjadi jalan pintas < 60 detik + menghasilkan Soal Kembaran (Twin Drill)

export async function analyzeQuestionWithAI(questionText) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

      const prompt = `Kamu adalah pakar strategi UTBK/SNBT dengan filosofi Prinsip Pareto 80/20.
Tugasmu: Bedah soal berikut dengan cepat, ungkap cara pintas < 60 detik (bukan cara konvensional sekolah yang panjang), identifikasi jebakan pembuat soal, dan buatkan 1 soal kembaran (twin question) dengan angka/konteks berbeda untuk latihan uji pemahaman.

Soal Pejuang:
"""
${questionText}
"""

Balas HANYA dalam format JSON murni (tanpa markdown backtick, tanpa teks pengantar):
{
  "subtest": "Nama Subtes (PU / PK / LITINDO / LITING / PM)",
  "subtopic": "Topik Spesifik",
  "difficulty": "TIER 1 (DASAR) / TIER 2 (SEDANG) / TIER 3 (SULIT)",
  "coreConcept": "Intisari konsep Pareto yang harus dipahami dalam 1 kalimat padat.",
  "slowWay": "Langkah konvensional sekolah/bimbel yang memakan waktu 3-4 menit.",
  "fastWay": "Jalan pintas taktis Pareto yang menyelesaikan soal dalam < 60 detik (trik eliminasi, rumus sakti, atau substitusi cepat).",
  "trapExplanation": "Jebakan pembuat soal paling fatal yang sering membuat peserta terkecoh.",
  "twinQuestion": {
    "question": "Teks soal kembaran baru dengan tipe yang sama persis namun angka/cerita diubah.",
    "options": ["A. ...", "B. ...", "C. ...", "D. ...", "E. ..."],
    "correctIndex": 0,
    "fastSolution": "Kunci dan jalan cepat pengerjaan soal kembaran ini."
  }
}`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TitikJeda-BedahSoal'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          // Parse JSON if possible
          const cleanJson = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
          const parsed = JSON.parse(cleanJson);
          return parsed;
        }
      }
    } catch (e) {
      console.warn("AI API timeout or parse error, fallback to local Pareto parser:", e);
    }
  }

  // Fallback Rule-Based Pareto Intelligence Engine
  return generateLocalParetoAnalysis(questionText);
}

// Local Fallback Pareto Analysis Engine
export function generateLocalParetoAnalysis(text) {
  const lower = text.toLowerCase();

  // 1. Kuantitatif / Aljabar / Kuadrat / Akar
  if (lower.includes('kuadrat') || lower.includes('akar') || lower.includes('diskriminan') || lower.includes('f(x)') || lower.includes('x²') || lower.includes('x^2') || lower.includes('persamaan')) {
    return {
      subtest: "Pengetahuan Kuantitatif",
      subtopic: "Fungsi & Manipulasi Aljabar Kuadrat",
      difficulty: "TIER 3 (SULIT)",
      coreConcept: "Gunakan identitas Vieta (x₁ + x₂ = -b/a dan x₁ · x₂ = c/a) untuk menghindari pencarian akar manual satu per satu.",
      slowWay: "Mencari nilai akar satu per satu dengan rumus abc panjang, lalu memasukkan akar berkoma ke dalam persamaan target (memakan waktu 3-4 menit).",
      fastWay: "Jalan Pintas Pareto (30 Detik): Faktorkan bentuk target menjadi kombinasi jumlah (α + β) dan hasil kali (αβ). Semua ekspresi simetris derajat 2 dan 3 dapat diselesaikan tanpa pernah menghitung nilai akar aslinya.",
      trapExplanation: "Jebakan pembuat soal: Memberikan angka yang menghasilkan akar irasional / koma agar peserta panik menghitung manual.",
      twinQuestion: {
        question: "Jika persamaan kuadrat x² - 6x + 4 = 0 memiliki akar-akar m dan n, berapakah nilai dari (m² + n²)?",
        options: [
          "A. 20",
          "B. 28",
          "C. 32",
          "D. 36",
          "E. 44"
        ],
        correctIndex: 1, // B (36 - 8 = 28)
        fastSolution: "Gunakan identitas: m² + n² = (m + n)² - 2mn. Diketahui m + n = 6 dan mn = 4. Maka m² + n² = 6² - 2(4) = 36 - 8 = 28. Waktu: 15 detik!"
      }
    };
  }

  // 2. Penalaran Umum / Silogisme / Logika
  if (lower.includes('premis') || lower.includes('silogisme') || lower.includes('jika') || lower.includes('maka') || lower.includes('kesimpulan') || lower.includes('logika')) {
    return {
      subtest: "Penalaran Umum",
      subtopic: "Logika Proposisi & Modus Tollens Negasi",
      difficulty: "TIER 2 (SEDANG)",
      coreConcept: "Hukum kontraposisi: Pernyataan (p → q) mutlak setara dengan (~q → ~p). Ingat: (~p) TIDAK membuktikan (~q).",
      slowWay: "Membayangkan skenario kehidupan nyata atau membuat diagram venn berbelit-belit yang memicu bias subjektif (menghabiskan 2-3 menit).",
      fastWay: "Jalan Pintas Pareto (25 Detik): Simbolkan kalimat menjadi huruf p, q, r. Coret premis yang berulang. Jika diketahui ingkaran akibat (~q), langsung tarik kesimpulan ingkaran sebab (~p) seketika.",
      trapExplanation: "Jebakan konfirmasi akibat: Menyimpulkan p terjadi hanya karena q terjadi, padahal q bisa terjadi dari penyebab lain.",
      twinQuestion: {
        question: "Premis 1: Jika cadangan devisa negara mencukupi, maka nilai tukar rupiah menguat terhadap dolar.\nPremis 2: Nilai tukar rupiah TIDAK menguat terhadap dolar.\n\nManakah kesimpulan yang mutlak benar?",
        options: [
          "A. Cadangan devisa negara berlebih.",
          "B. Cadangan devisa negara TIDAK mencukupi.",
          "C. Dolar mengalami penurunan nilai.",
          "D. Pemerintah mencetak uang baru.",
          "E. Tidak dapat ditarik kesimpulan apa pun."
        ],
        correctIndex: 1, // B
        fastSolution: "Bentuk dasar Modus Tollens: Premis 1: (p → q). Premis 2: (~q). Maka kesimpulan mutlak: (~p), yaitu cadangan devisa tidak mencukupi. Selesai dalam 10 detik!"
      }
    };
  }

  // 3. Literasi B. Indonesia / Paragraf / PUEBI
  if (lower.includes('paragraf') || lower.includes('kalimat') || lower.includes('bacaan') || lower.includes('gagasan') || lower.includes('ide pokok') || lower.includes('teks')) {
    return {
      subtest: "Literasi Bahasa Indonesia",
      subtopic: "Ide Pokok & Koherensi Struktur Kalimat",
      difficulty: "TIER 2 (SEDANG)",
      coreConcept: "Gagasan pokok selalu berada di kalimat awal (deduktif) atau kalimat akhir (induktif berkonjungsi kesimpulan). Jangan baca detail angka di kalimat penjelas.",
      slowWay: "Membaca seluruh teks kata per kata dari awal sampai akhir, lalu membaca ulang setiap opsi satu per satu (menghabiskan 2,5 menit).",
      fastWay: "Jalan Pintas Pareto (30 Detik): Baca kalimat ke-1. Jika kalimat ke-2 memuat kata rujukan ('hal ini', 'tersebut', atau pengulangan kata kunci), maka kalimat ke-1 PASTI ide pokoknya. Langsung eliminasi opsi yang terlalu spesifik!",
      trapExplanation: "Jebakan opsi distractor: Opsi yang kalimatnya mengutip fakta di dalam teks kata-per-kata, namun faktanya hanya merupakan contoh penjelas kecil, bukan ide utama.",
      twinQuestion: {
        question: "Perhatikan teks: 'Konsumsi gula berlebih terbukti menjadi katalisator utama resistensi insulin pada usia muda. Fenomena ini diperparah oleh masifnya peredaran minuman manis kemasan siap saji tanpa label nutrisi yang jelas.'\n\nGagasan utama penggalan teks di atas adalah...",
        options: [
          "A. Label nutrisi minuman kemasan sangat membingungkan.",
          "B. Bahaya konsumsi gula berlebih terhadap resistensi insulin.",
          "C. Usia muda rentan terhadap penyakit menular.",
          "D. Minuman manis harus dilarang peredarannya di sekolah.",
          "E. Industri pangan tidak transparan mengenai kadar gula."
        ],
        correctIndex: 1, // B
        fastSolution: "Kalimat pertama adalah induk ide ('Konsumsi gula berlebih katalisator resistensi insulin'). Kalimat kedua hanya menjelaskan faktor pemicu tambahan. Opsi B tepat merangkum kalimat pertama."
      }
    };
  }

  // 4. Default Universal Pareto Analysis
  return {
    subtest: "Penalaran Umum & Analitik",
    subtopic: "Dekomposisi Logika & Eliminasi Opsi Ekstrem",
    difficulty: "TIER 2 (SEDANG)",
    coreConcept: "Pisahkan premis fakta dari jebakan asumsi. Gunakan teknik eliminasi opsi ekstrem (always, never, mutlak) untuk menyaring 3 dari 5 pilihan.",
    slowWay: "Mencoba menghitung atau memverifikasi semua 5 opsi secara terpisah tanpa mencari pola inti pertanyaan.",
    fastWay: "Jalan Pintas Pareto (40 Detik): Fokus pada kata kunci inti pertanyaan. Coret 2 opsi yang terlalu ekstrem, coret 1 opsi yang keluar dari konteks. Uji sisa 2 opsi berdasarkan data teks murni.",
    trapExplanation: "Jebakan asumsi luar teks: Menggunakan pengetahuan umum pribadi yang tidak didukung atau bertentangan dengan teks soal.",
    twinQuestion: {
      question: "Dalam suatu seleksi beasiswa: Jika kandidat memiliki skor TOEFL ≥ 550 dan IPK ≥ 3.50, maka kandidat lolos tahap wawancara. Budi memiliki skor TOEFL 580 namun TIDAK lolos tahap wawancara. Manakah kesimpulan yang pasti benar?",
      options: [
        "A. Budi mengundurkan diri dari beasiswa.",
        "B. IPK Budi dipastikan kurang dari 3.50.",
        "C. Skor TOEFL Budi tidak diakui panitia.",
        "D. Budi gagal pada tes kesehatan.",
        "E. Budi terlambat menyerahkan berkas."
      ],
      correctIndex: 1, // B
      fastSolution: "Syarat lolos: (TOEFL ≥ 550 ∧ IPK ≥ 3.50) → Lolos. Karena Budi tidak lolos (~Lolos), maka ~(TOEFL ≥ 550 ∧ IPK ≥ 3.50) harus benar. Karena TOEFL-nya 580 (memenuhi), maka penyebab mutlak ketidaklolosannya adalah IPK-nya < 3.50."
    }
  };
}

// Preset Soal Nyata yang bisa langsung di-load dengan 1 klik
export const PRESET_SAMPLE_QUESTIONS = [
  {
    label: "PK: Aljabar Simetris Akar Kuadrat",
    subtest: "Pengetahuan Kuantitatif",
    text: "Persamaan kuadrat 2x² - 8x + 3 = 0 memiliki akar-akar p dan q. Berapakah nilai dari (1/p + 1/q)?"
  },
  {
    label: "PU: Rantai Silogisme Bertingkat",
    subtest: "Penalaran Umum",
    text: "Premis 1: Jika pasokan minyak mentah dunia anjlok, maka harga bahan bakar subsidi naik.\nPremis 2: Jika harga bahan bakar subsidi naik, maka inflasi bahan pangan melonjak.\nPremis 3: Inflasi bahan pangan TIDAK melonjak.\n\nManakah kesimpulan yang mutlak benar secara logika formal?"
  },
  {
    label: "LITINDO: Jebakan Kalimat Buntung",
    subtest: "Literasi Bahasa Indonesia",
    text: "Dalam laporan hasil survei demografi kependudukan tahun 2025 mengungkapkan bahwa angka pernikahan usia dini di wilayah pedesaan mengalami penurunan sebesar 14%.\n\nKalimat di atas rancu dan tidak baku karena..."
  },
  {
    label: "LITING: Author Tone & Stance",
    subtest: "Literasi Bahasa Inggris",
    text: "\"While renewable geoengineering presents audacious promises for thermal mitigation, unilateral atmospheric dispersion without multilateral treaties risks catastrophically destabilizing equatorial precipitation patterns.\"\n\nThe author's perspective toward geoengineering is best characterized as..."
  }
];
