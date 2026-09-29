import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Terminal, 
  Trash2, 
  Radio, 
  BookOpen, 
  UserCheck, 
  AlertTriangle, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Volume2, 
  Send, 
  Flame, 
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { useAppStore } from '../store/useAppStore';
import { useChatStore } from '../store/useChatStore';
import { DAILY_QUESTIONS, getDailyQuestion } from '../data/dailyQuestions';

const VOID_STORAGE_KEY = 'titikjeda-void-posts';

export default function AdminPanel() {
  const { 
    isAuthenticated, 
    adminPin, 
    login, 
    logout, 
    setAdminPin,
    adminAnnouncement,
    isAnnouncementActive,
    setAnnouncement,
    toggleAnnouncement,
    customQuestions,
    addCustomQuestion,
    deleteCustomQuestion,
    forcedQuestionId,
    setForcedQuestionId,
    clearForcedQuestion
  } = useAdminStore();

  const {
    studyTime,
    isLockedOut,
    oathSignature,
    dailyStatus,
    lastAnswerDate,
    alibiLogs,
    hasDoneAlibiToday,
    setDailyStatus,
    setLastAnswerDate,
    resetLockout,
    fastForward,
    setOathSignature,
    resetAlibiStatus,
    clearAlibiLogs
  } = useAppStore();

  const { aiMemory, setAiMemory } = useChatStore();

  // Login Gate State
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'void' | 'questions' | 'users' | 'security'

  // The Void Moderation State
  const [voidPosts, setVoidPosts] = useState([]);
  const [voidSearch, setVoidSearch] = useState('');
  const [adminPostText, setAdminPostText] = useState('');
  const [adminPostHugs, setAdminPostHugs] = useState(99);

  // Announcement State
  const [announcementText, setAnnouncementText] = useState(adminAnnouncement);

  // Security New PIN State
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  // New Question Form State
  const [newQSubject, setNewQSubject] = useState('Pengetahuan Kuantitatif');
  const [newQSubtopic, setNewQSubtopic] = useState('');
  const [newQQuestion, setNewQQuestion] = useState('');
  const [newQOptions, setNewQOptions] = useState(['', '', '', '', '']);
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQHint, setNewQHint] = useState('');
  const [newQKeyConcept, setNewQKeyConcept] = useState('');
  const [newQSteps, setNewQSteps] = useState('');
  const [newQTrap, setNewQTrap] = useState('');
  const [qFormSuccess, setQFormSuccess] = useState(false);

  // Load Void Posts from localStorage
  const loadVoidPosts = () => {
    try {
      const saved = localStorage.getItem(VOID_STORAGE_KEY);
      if (saved) {
        setVoidPosts(JSON.parse(saved));
      } else {
        setVoidPosts([
          { id: 1, text: "Gue bener-bener capek disuruh les terus padahal otak gue udah gak masuk apa-apa.", hugs: 12 },
          { id: 2, text: "Tryout hari ini hancur banget. Rasanya mau nyerah aja.", hugs: 5 },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadVoidPosts();
  }, [activeTab]);

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = login(pinInput);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    } else {
      setPinInput('');
      setPinError(false);
    }
  };

  // The Void Actions
  const handleDeleteVoidPost = (id) => {
    if (!window.confirm("Hapus postingan ini secara permanen dari The Void?")) return;
    const updated = voidPosts.filter(p => p.id !== id);
    setVoidPosts(updated);
    localStorage.setItem(VOID_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleBroadcastVoidPost = (e) => {
    e.preventDefault();
    if (!adminPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      text: `[PENGUMUMAN PUSAT] ${adminPostText.trim()}`,
      hugs: Number(adminPostHugs) || 50
    };

    const updated = [newPost, ...voidPosts];
    setVoidPosts(updated);
    localStorage.setItem(VOID_STORAGE_KEY, JSON.stringify(updated));
    setAdminPostText('');
    alert("Postingan resmi otoritas berhasil dilepas ke The Void!");
  };

  const handleResetVoidPosts = () => {
    if (!window.confirm("Kembalikan seluruh postingan The Void ke data awal?")) return;
    const defaultData = [
      { id: 1, text: "Gue bener-bener capek disuruh les terus padahal otak gue udah gak masuk apa-apa.", hugs: 12 },
      { id: 2, text: "Tryout hari ini hancur banget. Rasanya mau nyerah aja.", hugs: 5 },
    ];
    setVoidPosts(defaultData);
    localStorage.setItem(VOID_STORAGE_KEY, JSON.stringify(defaultData));
  };

  // Add Question Action
  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQQuestion.trim() || newQOptions.some(opt => !opt.trim())) {
      alert("Harap isi pertanyaan dan seluruh opsi A-E!");
      return;
    }

    const newQ = {
      id: Date.now(),
      subject: newQSubject,
      subtopic: newQSubtopic.trim() || "Materi Penting",
      code: `SOAL-${Date.now().toString().slice(-3)} // ${newQSubject.slice(0, 2).toUpperCase()}`,
      question: newQQuestion.trim(),
      options: newQOptions.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt.trim()}`),
      correctIndex: Number(newQCorrect),
      hint: newQHint.trim() || "Fokus pada konsep fundamental dasar.",
      explanation: {
        keyConcept: newQKeyConcept.trim() || "Analisis Logis & Eliminasi",
        steps: newQSteps.split('\n').filter(s => s.trim().length > 0),
        trap: newQTrap.trim() || "Kesalahan kalkulasi terburu-buru."
      }
    };

    addCustomQuestion(newQ);
    setQFormSuccess(true);
    setTimeout(() => setQFormSuccess(false), 3000);

    // Reset Form
    setNewQQuestion('');
    setNewQSubtopic('');
    setNewQOptions(['', '', '', '', '']);
    setNewQHint('');
    setNewQKeyConcept('');
    setNewQSteps('');
    setNewQTrap('');
  };

  // Change PIN Action
  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      alert("Kunci PIN minimal 4 karakter!");
      return;
    }
    setAdminPin(newPin.trim());
    setPinSuccess("Kunci PIN berhasil diperbarui!");
    setNewPin('');
    setTimeout(() => setPinSuccess(''), 3000);
  };

  const allQuestions = [...DAILY_QUESTIONS, ...customQuestions];
  const activeQuestion = getDailyQuestion(null, customQuestions, forcedQuestionId);

  // ==========================================
  // GATEKEEPER (LOGIN SCREEN)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 md:my-16 font-mono">
        <div className="bg-white border-8 border-zinc-950 p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-zinc-950 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-600" strokeWidth={3} />
              <span className="font-black text-xs uppercase tracking-widest text-red-600">OTORITAS PUSAT</span>
            </div>
            <span className="w-3 h-3 bg-red-600 animate-ping"></span>
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-950 leading-none mb-2">
            TERMINAL KONTROL
          </h2>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mb-6">
            Akses tingkat operator sistem. Masukkan kunci sandi kripto untuk membuka panel.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-950 mb-2">
                KUNCI SANDI ADMIN
              </label>
              <div className="relative">
                <input 
                  type={showPin ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="MASUKKAN PIN..."
                  autoFocus
                  className={`w-full bg-zinc-50 border-4 ${pinError ? 'border-red-600 bg-red-50 text-red-600' : 'border-zinc-950'} rounded-none px-4 py-3 text-lg font-black tracking-widest uppercase focus:outline-none focus:bg-white`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-950 p-1"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-red-600 font-black uppercase tracking-widest mt-2">
                  [AKSES DITOLAK] KUNCI TIDAK COCOK.
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-4 uppercase tracking-widest text-base active:scale-[0.98] transition-transform cursor-pointer border-4 border-zinc-950"
            >
              BUKA OTORITAS PUSAT
            </button>
          </form>

          <div className="mt-8 pt-4 border-t-2 border-zinc-200 text-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
              Petunjuk awal: PIN bawaan adalah <span className="font-bold text-zinc-950 underline">TITIKJEDA2026</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN PANEL
  // ==========================================
  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono">
      {/* Top Header Bar */}
      <div className="border-4 md:border-8 border-zinc-950 bg-zinc-950 text-white p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-none animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">SESI OPERATOR AKTIF</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
            PANEL KENDALI OTORITAS PUSAT
          </h1>
          <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">
            TitikJeda ZenUTBK // Full Superuser Governance
          </p>
        </div>

        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest border-2 border-white active:scale-95 transition-transform cursor-pointer"
        >
          KUNCI & KELUAR
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-4 border-zinc-950 pb-2">
        {[
          { id: 'overview', label: '1. Ikhtisar Pusat', icon: Terminal },
          { id: 'void', label: '2. Moderasi The Void', icon: MessageSquare },
          { id: 'questions', label: '3. Bank Soal UTBK', icon: BrainCircuit },
          { id: 'users', label: '4. Kendali Simulator User', icon: UserCheck },
          { id: 'security', label: '5. Keamanan & PIN', icon: Lock },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 font-bold uppercase text-xs md:text-sm border-2 md:border-4 border-zinc-950 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-zinc-950 text-white translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB 1: IKHTISAR PUSAT (OVERVIEW)
          ========================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border-4 border-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">POSTINGAN THE VOID</span>
              <span className="text-3xl font-black text-zinc-950">{voidPosts.length}</span>
            </div>
            <div className="bg-white border-4 border-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">PELUKAN TERKUMPUL</span>
              <span className="text-3xl font-black text-zinc-950">
                {voidPosts.reduce((acc, p) => acc + (p.hugs || 0), 0)}
              </span>
            </div>
            <div className="bg-white border-4 border-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">BANK SOAL HARIAN</span>
              <span className="text-3xl font-black text-zinc-950">{allQuestions.length}</span>
            </div>
            <div className="bg-white border-4 border-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">STATUS LOCKOUT USER</span>
              <span className={`text-xl font-black ${isLockedOut ? 'text-red-600' : 'text-emerald-600'}`}>
                {isLockedOut ? 'TERKUNCI' : 'BEBAS'}
              </span>
            </div>
          </div>

          {/* Broadcast Announcement Controller */}
          <div className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-4 border-zinc-950 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600" />
                <h3 className="font-black text-base md:text-lg uppercase text-zinc-950 tracking-wider">
                  SIARAN WARTA PUSAT (RUNNING BANNER)
                </h3>
              </div>
              <button 
                onClick={toggleAnnouncement}
                className={`text-xs font-black uppercase px-3 py-1 border-2 border-zinc-950 cursor-pointer ${
                  isAnnouncementActive ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {isAnnouncementActive ? 'STATUS: AKTIF TAYANG' : 'STATUS: NONAKTIF'}
              </button>
            </div>

            <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mb-3">
              Teks ini akan muncul sebagai banner resmi otoritas di bagian atas layar aplikasi seluruh siswa:
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="CONTOH: WARTA PUSAT: H-60 MENUJU UTBK 2026..."
                className="flex-1 bg-zinc-50 border-4 border-zinc-950 px-3 py-2 text-sm font-bold uppercase focus:outline-none focus:bg-white"
              />
              <button 
                onClick={() => {
                  setAnnouncement(announcementText, true);
                  alert("Warta pengumuman berhasil diperbarui dan ditayangkan!");
                }}
                className="bg-zinc-950 hover:bg-zinc-800 text-white font-black px-6 py-2 uppercase text-xs tracking-widest border-4 border-zinc-950 cursor-pointer active:scale-95"
              >
                TERBITKAN
              </button>
            </div>
          </div>

          {/* Active Question Preview */}
          <div className="bg-zinc-50 border-4 border-zinc-950 p-5">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 block mb-1">SOAL YANG AKTIF TAYANG HARI INI</span>
            <div className="flex items-center gap-3">
              <span className="bg-zinc-950 text-white text-xs font-black px-2 py-0.5">ID: {activeQuestion.id}</span>
              <span className="font-bold text-sm uppercase text-zinc-950">{activeQuestion.subject} - {activeQuestion.subtopic}</span>
              {forcedQuestionId && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase">FORCED OVERRIDE</span>
              )}
            </div>
            <p className="text-xs text-zinc-700 font-mono mt-2 line-clamp-2">{activeQuestion.question}</p>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: MODERASI THE VOID
          ========================================== */}
      {activeTab === 'void' && (
        <div className="space-y-6">
          {/* Post as Admin Form */}
          <form onSubmit={handleBroadcastVoidPost} className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg uppercase text-zinc-950 mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              LEPAS POSTINGAN RESMI OTORITAS KE THE VOID
            </h3>
            <p className="text-xs text-zinc-600 font-bold uppercase mb-4">
              Pesan akan bertanda [PENGUMUMAN PUSAT] dan langsung muncul di puncak The Void seluruh pengguna.
            </p>
            <textarea 
              value={adminPostText}
              onChange={(e) => setAdminPostText(e.target.value)}
              placeholder="PESAN RESMI DARI PENGELOLA SISTEM KEPADA SEMUA PEJUANG UTBK..."
              rows={3}
              className="w-full bg-zinc-50 border-4 border-zinc-950 p-3 text-sm font-bold uppercase focus:outline-none focus:bg-white resize-none mb-3"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase">PELUKAN AWAL:</label>
                <input 
                  type="number"
                  value={adminPostHugs}
                  onChange={(e) => setAdminPostHugs(e.target.value)}
                  className="w-20 bg-zinc-50 border-2 border-zinc-950 px-2 py-1 text-xs font-bold"
                />
              </div>
              <button 
                type="submit"
                disabled={!adminPostText.trim()}
                className="bg-zinc-950 hover:bg-zinc-800 text-white font-black px-6 py-2.5 text-xs uppercase tracking-widest disabled:opacity-50 cursor-pointer"
              >
                LEPAS KE THE VOID
              </button>
            </div>
          </form>

          {/* Void List Header & Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-100 p-3 border-4 border-zinc-950">
            <input 
              type="text"
              value={voidSearch}
              onChange={(e) => setVoidSearch(e.target.value)}
              placeholder="CARI CURHATAN BERDASARKAN KATA KUNCI..."
              className="w-full sm:w-80 bg-white border-2 border-zinc-950 px-3 py-1.5 text-xs font-bold uppercase focus:outline-none"
            />
            <button 
              onClick={handleResetVoidPosts}
              className="text-xs font-black uppercase text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 px-3 py-1.5 transition-colors cursor-pointer shrink-0"
            >
              [RESET THE VOID KE DATA AWAL]
            </button>
          </div>

          {/* Posts Feed Table/Cards */}
          <div className="space-y-3">
            {voidPosts
              .filter(p => !voidSearch || p.text.toLowerCase().includes(voidSearch.toLowerCase()))
              .map((post) => (
                <div 
                  key={post.id}
                  className="bg-white border-4 border-zinc-950 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-zinc-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black bg-zinc-950 text-white px-2 py-0.5">ID: {post.id}</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">🫂 {post.hugs || 0} PELUKAN</span>
                    </div>
                    <p className="text-sm font-bold uppercase text-zinc-950 leading-relaxed">{post.text}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteVoidPost(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-600 text-red-700 hover:text-white text-xs font-black uppercase tracking-wider border-2 border-red-600 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>HAPUS</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: BANK SOAL UTBK (QUESTIONS)
          ========================================== */}
      {activeTab === 'questions' && (
        <div className="space-y-8">
          {/* Force Override Controller */}
          <div className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg uppercase text-zinc-950 mb-2">
              KENDALI ROTASI SOAL HARIAN
            </h3>
            <p className="text-xs text-zinc-600 font-bold uppercase mb-4">
              Pilih soal tertentu untuk dipaksa tayang hari ini, atau biarkan sistem berotasi otomatis.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <select 
                value={forcedQuestionId || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) setForcedQuestionId(Number(val));
                  else clearForcedQuestion();
                }}
                className="w-full sm:w-96 bg-zinc-50 border-4 border-zinc-950 px-3 py-2 text-xs font-bold uppercase focus:outline-none"
              >
                <option value="">-- ROTASI OTOMATIS BERDASARKAN HARI --</option>
                {allQuestions.map((q) => (
                  <option key={q.id} value={q.id}>
                    ID {q.id}: [{q.subject}] {q.subtopic}
                  </option>
                ))}
              </select>

              {forcedQuestionId && (
                <button 
                  onClick={clearForcedQuestion}
                  className="bg-red-600 text-white font-black text-xs uppercase px-4 py-2 border-2 border-zinc-950 cursor-pointer"
                >
                  KEMBALIKAN KE ROTASI NORMAL
                </button>
              )}
            </div>
          </div>

          {/* Add New Question Form */}
          <form onSubmit={handleAddQuestionSubmit} className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex items-center justify-between border-b-4 border-zinc-950 pb-3 mb-2">
              <h3 className="font-black text-lg uppercase text-zinc-950 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                TAMBAH SOAL BARU KE BANK SOAL
              </h3>
              {qFormSuccess && (
                <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1">
                  SOAL BERHASIL DISIMPAN!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Subtes UTBK</label>
                <select 
                  value={newQSubject}
                  onChange={(e) => setNewQSubject(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold uppercase"
                >
                  <option value="Penalaran Umum">Penalaran Umum (PU)</option>
                  <option value="Pengetahuan Kuantitatif">Pengetahuan Kuantitatif (PK)</option>
                  <option value="Pemahaman Bacaan & Menulis">Pemahaman Bacaan & Menulis (PBM)</option>
                  <option value="Penalaran Matematika">Penalaran Matematika (PM)</option>
                  <option value="Literasi Bahasa Indonesia">Literasi Bahasa Indonesia</option>
                  <option value="Literasi Bahasa Inggris">Literasi Bahasa Inggris</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Topik Materi</label>
                <input 
                  type="text"
                  value={newQSubtopic}
                  onChange={(e) => setNewQSubtopic(e.target.value)}
                  placeholder="CONTOH: Persamaan Kuadrat & IRT"
                  className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Pertanyaan / Soal Teks</label>
              <textarea 
                value={newQQuestion}
                onChange={(e) => setNewQQuestion(e.target.value)}
                placeholder="TULISKAN PERTANYAAN SOAL LENGKAP..."
                rows={3}
                className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold uppercase resize-none"
              />
            </div>

            {/* Options A to E */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase">Pilihan Jawaban (A - E)</label>
              {['A', 'B', 'C', 'D', 'E'].map((letter, idx) => (
                <div key={letter} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-black">{letter}.</span>
                  <input 
                    type="text"
                    value={newQOptions[idx]}
                    onChange={(e) => {
                      const updated = [...newQOptions];
                      updated[idx] = e.target.value;
                      setNewQOptions(updated);
                    }}
                    placeholder={`Jawaban Opsi ${letter}...`}
                    className="flex-1 bg-zinc-50 border-2 border-zinc-950 p-1.5 text-xs font-bold"
                  />
                  <input 
                    type="radio" 
                    name="correctAnswer"
                    checked={newQCorrect === idx}
                    onChange={() => setNewQCorrect(idx)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">BENAR</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Petunjuk Singkat (Hint)</label>
              <input 
                type="text"
                value={newQHint}
                onChange={(e) => setNewQHint(e.target.value)}
                placeholder="Petunjuk pengerjaan cepat..."
                className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Konsep Kunci</label>
                <input 
                  type="text"
                  value={newQKeyConcept}
                  onChange={(e) => setNewQKeyConcept(e.target.value)}
                  placeholder="Rumus/Teorema dasar..."
                  className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase mb-1">Langkah Pembahasan (1 per baris)</label>
                <textarea 
                  value={newQSteps}
                  onChange={(e) => setNewQSteps(e.target.value)}
                  placeholder="1. Langkah pertama...&#10;2. Langkah kedua..."
                  rows={2}
                  className="w-full bg-zinc-50 border-2 border-zinc-950 p-2 text-xs font-bold"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-3 text-xs uppercase tracking-widest border-2 border-zinc-950 cursor-pointer"
            >
              SIMPAN SOAL KE DATABASE
            </button>
          </form>

          {/* Custom Questions List */}
          {customQuestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-black text-sm uppercase text-zinc-950">SOAL KUSTOM DARI ADMIN ({customQuestions.length})</h4>
              {customQuestions.map((q) => (
                <div key={q.id} className="bg-white border-4 border-zinc-950 p-4 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-black bg-zinc-950 text-white px-2 py-0.5 mr-2">ID: {q.id}</span>
                    <span className="font-bold text-xs uppercase text-zinc-950">{q.subject} - {q.subtopic}</span>
                    <p className="text-xs text-zinc-700 mt-2 line-clamp-2">{q.question}</p>
                  </div>
                  <button 
                    onClick={() => deleteCustomQuestion(q.id)}
                    className="text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 px-3 py-1 text-xs font-bold uppercase shrink-0"
                  >
                    HAPUS
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 4: KENDALI SIMULATOR USER (USER STATE)
          ========================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Study Lockout Controls */}
          <div className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg uppercase text-zinc-950 mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              KENDALI LOCKOUT 90 MENIT (ANTI-BURNOUT)
            </h3>
            <p className="text-xs text-zinc-600 font-bold uppercase mb-4">
              Status waktu belajar user saat ini: <span className="font-black text-zinc-950">{studyTime} detik ({Math.floor(studyTime / 60)} menit)</span>. 
              Status gembok: <span className={`font-black ${isLockedOut ? 'text-red-600' : 'text-emerald-600'}`}>{isLockedOut ? 'TERKUNCI' : 'AKTIF'}</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={resetLockout}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 text-xs uppercase tracking-widest border-2 border-zinc-950 cursor-pointer"
              >
                [BUKA GEMBOK & RESET KE 0 MENIT]
              </button>
              <button 
                onClick={fastForward}
                className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 text-xs uppercase tracking-widest border-2 border-zinc-950 cursor-pointer"
              >
                [PAKSA GEMBOK LOCKOUT SEKARANG (5400 DETIK)]
              </button>
            </div>
          </div>

          {/* One Question User Status */}
          <div className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg uppercase text-zinc-950 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              STATUS 1 SOAL SEHARI
            </h3>
            <p className="text-xs text-zinc-600 font-bold uppercase mb-4">
              Jawaban terakhir: <span className="font-black text-zinc-950">{lastAnswerDate || 'BELUM PERNAH'}</span> | 
              Status: <span className="font-black text-zinc-950">{dailyStatus || 'BELUM MENJAWAB'}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  setDailyStatus(null);
                  setLastAnswerDate(null);
                  alert("Status soal di-reset! Siswa dapat mengerjakan kembali sekarang.");
                }}
                className="bg-zinc-950 hover:bg-zinc-800 text-white font-black px-4 py-2 text-xs uppercase tracking-widest border-2 border-zinc-950 cursor-pointer"
              >
                [RESET STATUS (BISA KERJAKAN ULANG HARI INI)]
              </button>
              <button 
                onClick={() => {
                  const today = new Date().toLocaleDateString('id-ID');
                  setLastAnswerDate(today);
                  setDailyStatus('passed');
                  alert("Status soal diset LOLOS!");
                }}
                className="bg-emerald-600 text-white font-black px-4 py-2 text-xs uppercase tracking-widest cursor-pointer"
              >
                [SET LOLOS]
              </button>
              <button 
                onClick={() => {
                  const today = new Date().toLocaleDateString('id-ID');
                  setLastAnswerDate(today);
                  setDailyStatus('failed');
                  alert("Status soal diset GAGAL & DIHUKUM!");
                }}
                className="bg-red-600 text-white font-black px-4 py-2 text-xs uppercase tracking-widest cursor-pointer"
              >
                [SET GAGAL]
              </button>
            </div>
          </div>

          {/* Blood Oath & Alibi Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Oath */}
            <div className="bg-white border-4 border-zinc-950 p-5">
              <h4 className="font-black text-base uppercase text-zinc-950 mb-2">SUMPAH DARAH (PACTA)</h4>
              <p className="text-xs text-zinc-600 font-bold uppercase mb-3">
                Status Tanda Tangan: {oathSignature ? 'TERCATAT DI KANVAS' : 'BELUM TANDATANGAN'}
              </p>
              {oathSignature && (
                <div className="border-2 border-zinc-950 bg-zinc-50 p-2 mb-3 max-w-[200px]">
                  <img src={oathSignature} alt="Tanda Tangan Sumpah" className="w-full h-auto" />
                </div>
              )}
              <button 
                onClick={() => {
                  setOathSignature(null);
                  alert("Tanda tangan sumpah darah berhasil dibatalkan!");
                }}
                className="bg-red-600 text-white font-black px-3 py-1.5 text-xs uppercase cursor-pointer"
              >
                [BATALKAN TTD SUMPAH]
              </button>
            </div>

            {/* Jurnal Alibi */}
            <div className="bg-white border-4 border-zinc-950 p-5">
              <h4 className="font-black text-base uppercase text-zinc-950 mb-2">JURNAL ALIBI ({alibiLogs?.length || 0})</h4>
              <p className="text-xs text-zinc-600 font-bold uppercase mb-3">
                Sudah isi hari ini: {hasDoneAlibiToday ? 'YA' : 'BELUM'}
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    resetAlibiStatus();
                    alert("Status alibi hari ini direset! User bisa mengisi alibi lagi.");
                  }}
                  className="bg-zinc-950 text-white font-black px-3 py-1.5 text-xs uppercase cursor-pointer"
                >
                  [IZINKAN ISI LAGI]
                </button>
                <button 
                  onClick={() => {
                    clearAlibiLogs();
                    alert("Seluruh log alibi telah dikosongkan!");
                  }}
                  className="bg-red-600 text-white font-black px-3 py-1.5 text-xs uppercase cursor-pointer"
                >
                  [KOSONGKAN LOG]
                </button>
              </div>
            </div>
          </div>

          {/* AI Mentor Memory */}
          <div className="bg-white border-4 border-zinc-950 p-5">
            <h4 className="font-black text-base uppercase text-zinc-950 mb-2">MEMORI BILIK KONSULTASI (AI MENTOR)</h4>
            <p className="text-xs text-zinc-600 font-bold uppercase mb-3">
              Ringkasan memori yang diingat AI:
            </p>
            <div className="bg-zinc-100 p-3 border-2 border-zinc-950 mb-3 text-xs font-mono font-bold">
              {aiMemory || "[BELUM ADA MEMORI TERSIMPAN]"}
            </div>
            <button 
              onClick={() => {
                setAiMemory('');
                alert("Memori AI berhasil dikosongkan (Amnesia total)!");
              }}
              className="bg-red-600 text-white font-black px-4 py-2 text-xs uppercase cursor-pointer"
            >
              [HAPUS MEMORI AI]
            </button>
          </div>

          {/* Heatmap & Streak Simulator */}
          <div className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg uppercase text-zinc-950 mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              KENDALI HEATMAP & STREAK DISIPLIN
            </h3>
            <p className="text-xs text-zinc-600 font-bold uppercase mb-4">
              Uji coba dan simulasikan status kedisiplinan pada grid heatmap 12 minggu.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={() => {
                  const todayKey = new Date().toISOString().split('T')[0];
                  useAppStore.getState().recordHabitDate(todayKey, 'passed');
                  alert("Hari ini diset LOLOS di Heatmap!");
                }}
                className="bg-zinc-950 text-white font-black px-3 py-1.5 text-xs uppercase cursor-pointer"
              >
                [SET HARI INI: LOLOS]
              </button>
              <button 
                onClick={() => {
                  const todayKey = new Date().toISOString().split('T')[0];
                  useAppStore.getState().recordHabitDate(todayKey, 'alibi');
                  alert("Hari ini diset ALIBI di Heatmap!");
                }}
                className="bg-amber-400 text-black font-black px-3 py-1.5 text-xs uppercase cursor-pointer"
              >
                [SET HARI INI: ALIBI]
              </button>
              <button 
                onClick={() => {
                  const todayKey = new Date().toISOString().split('T')[0];
                  useAppStore.getState().recordHabitDate(todayKey, 'failed');
                  alert("Hari ini diset GAGAL di Heatmap!");
                }}
                className="bg-red-600 text-white font-black px-3 py-1.5 text-xs uppercase cursor-pointer"
              >
                [SET HARI INI: GAGAL]
              </button>
              <button 
                onClick={() => {
                  useAppStore.getState().clearHabitHistory();
                  alert("Rekam jejak Heatmap telah dikosongkan!");
                }}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-black px-3 py-1.5 text-xs uppercase cursor-pointer"
              >
                [KOSONGKAN HEATMAP]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 5: KEAMANAN & PIN
          ========================================== */}
      {activeTab === 'security' && (
        <div className="bg-white border-4 md:border-8 border-zinc-950 p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-xl">
          <h3 className="font-black text-lg uppercase text-zinc-950 mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            UBAH KUNCI SANDI ADMIN (PIN)
          </h3>
          <p className="text-xs text-zinc-600 font-bold uppercase mb-4">
            Ganti PIN otorisasi saat ini dengan sandi baru (minimal 4 karakter).
          </p>

          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">PIN SANDI BARU</label>
              <input 
                type="text"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="CONTOH: ADMINRAHASIA2026"
                className="w-full bg-zinc-50 border-4 border-zinc-950 px-3 py-2 text-sm font-black uppercase focus:outline-none focus:bg-white"
              />
            </div>
            {pinSuccess && (
              <p className="text-xs text-emerald-600 font-black uppercase">{pinSuccess}</p>
            )}
            <button 
              type="submit"
              className="bg-zinc-950 hover:bg-zinc-800 text-white font-black px-6 py-3 text-xs uppercase tracking-widest border-2 border-zinc-950 cursor-pointer"
            >
              PERBARUI PIN
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
