<div align="center">

# ⚡ FINAL SENTENCE

### 🎮 لعبة رعب نفسي لتعلّم الإنجليزية — Psychological Horror Typing Game

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Now-success?logo=githubpages&logoColor=white)](https://masterv00-hub.github.io/final-sentence/)

### ▶️ [العب الآن مباشرة — Play Live](https://Master-V00.github.io/final-sentence/)

**اكتب الترجمة الصحيحة قبل انتهاء الوقت… أو الجملة الأخيرة ستكون الأخيرة فعلاً.**

**Type the correct translation before time runs out… or your final sentence will be your last.**

</div>

---

<div align="center">

## 🌍 اختار اللغة — Choose Language

### [🇪🇬 العربية](#-النسخة-العربية) &nbsp;&nbsp;|&nbsp;&nbsp; [🇬🇧 English](#-english-version)

</div>

---

<a id="-النسخة-العربية"></a>

<div dir="rtl">

## 🇪🇬 النسخة العربية

### 📖 الفكرة

**Final Sentence** لعبة typing بطابع رعب نفسي موجهة لمتعلمي الإنجليزية من العرب. تظهر لك كلمة عربية، والمطلوب كتابة ترجمتها الإنجليزية تحت ضغط عدّاد زمني — الغلط أو انتهاء الوقت يعني **Game Over فوري** وتقرير تحقيق (`INTERROGATION REPORT / TERMINATED`).

اللعبة تغطي مستويات **CEFR من A1 لـ C2** بالإضافة لمنهج الصف الأول المصري.

### 🕹️ مراحل اللعب

| المرحلة | الوصف |
|---|---|
| `IntroSequence` | مشهد افتتاحي يجهّز الأجواء |
| `DifficultyMenu` | اختيار مستوى الصعوبة (A1 → C2) |
| `GameSession` | جلسة اللعب: رقم القضية + شريط الوقت + مؤشر التوتر |
| `ResultDossier` | ملف النتيجة النهائي بأسلوب تقرير تحقيق |

### ✨ المميزات

- 🚪 شاشة دخول (`click to enter...`) — المتصفح يشترط تفاعل المستخدم قبل تشغيل الصوت، فالضغطة الأولى تفتح الموسيقى لبقية الجلسة
- ⏭️ زر تخطي صغير (`[ skip → ]`) أسفل بطاقة اللعب لتجاوز الكلمة الحالية بدون تسجيلها (لا عقوبة ولا مكافأة)

- 🤖 توليد كلمات ديناميكي عبر **Gemini 2.5 Flash** مع كلمات احتياطية عند انقطاع الخدمة
- 📚 أرشيف مناهج (`data/units.ts` + `data/firstTerm.ts`)
- 🔊 مؤثرات صوتية مولّدة بتقنية Web Audio + موسيقى خلفية (`Dark-Pulse-Monitor.mp3`)
- 🎛️ زر التحكم في الموسيقى (`MusicToggle`)
- 🌫️ أجواء بصرية (`Atmosphere`) وزر تواصل عائم (`ContactFab`)
- 📱 واجهة عربية كاملة (RTL) بخطوط أميري وCourier Prime

### 🛠️ التقنيات

`React 19` • `Vite 6` • `TypeScript 5` • `@google/genai` • `Tailwind (CDN)` • `Web Audio API`

### 🚀 التشغيل محلياً

**المتطلبات:** `Node.js` (يفضل 20+)

```bash
# 1. ثبّت الحزم
npm install

# 2. انسخ ملف البيئة وحط مفتاحك
cp .env.example .env.local
# ثم ضع مفتاح Gemini داخل GEMINI_API_KEY

# 3. شغّل وضع التطوير
npm run dev

# 4. ابنِ نسخة الإنتاج
npm run build
```

### 📁 هيكل المشروع

```
final-sentence/
├── App.tsx / src/App.tsx        # شاشات اللعبة والمنطق الرئيسي
├── components/                  # Atmosphere • ContactFab • MusicToggle
├── services/
│   ├── geminiService.ts         # توليد الكلمات عبر Gemini
│   └── soundService.ts          # المؤثرات + موسيقى الخلفية
├── data/                        # units.ts • firstTerm.ts (المناهج)
├── public/
│   └── Dark-Pulse-Monitor.mp3   # موسيقى الخلفية (تُعرض على /...)
├── index.html / index.tsx       # نقطة الدخول
└── vite.config.ts               # يربط GEMINI_API_KEY بـ process.env.API_KEY
```

<details>
<summary><b>🕰️ تاريخ تطور المشروع (4 إصدارات مدموجة في Git)</b></summary>

| الإصدار | التاريخ | الوصف |
|---|---|---|
| `v00` | 2025-11-17 | نموذج أولي بـ Vanilla JS + Three.js |
| `v01` | 2025-12-04 | إعادة كتابة كاملة بـ React + Vite + Gemini |
| `v02` | 2025-12-06 | أرشيف المناهج + ContactFab + مؤثرات صوتية |
| `v03` | 2025-12-06 | MusicToggle + موسيقى الخلفية MP3 |
| `v04` | 2026-10-11 | بوابة الدخول + زر التخطي + ضغط الموسيقى (5.4MB ← 1.3MB) |

كل إصدار محفوظ كـ commit بتاريخه الأصلي — استخدم `git log` لاستعراض الرحلة.

</details>

</div>

---

<a id="-english-version"></a>

## 🇬🇧 English Version

### 📖 Overview

**Final Sentence** is a psychological-horror typing game for Arabic-speaking English learners. You are shown an Arabic word and must type its English translation under a countdown — a mistake or timeout means **instant game over** and an `INTERROGATION REPORT / TERMINATED` dossier.

Covers **CEFR levels A1–C2** plus the Egyptian 1st-grade curriculum.

### 🕹️ Game Flow

| Stage | Description |
|---|---|
| `IntroSequence` | Atmospheric opening scene |
| `DifficultyMenu` | Difficulty select (A1 → C2) |
| `GameSession` | Gameplay: case number + timer bar + stress indicator |
| `ResultDossier` | Final result as an interrogation report |

### ✨ Features

- 🚪 Entry gate (`click to enter...`) — browsers require a user gesture before audio can start, so the first click unlocks the music for the whole session
- ⏭️ Small skip button (`[ skip → ]`) at the bottom of the play card to skip the current word without recording it (no penalty, no reward)

- 🤖 Dynamic word generation via **Gemini 2.5 Flash** with offline fallback words
- 📚 Curriculum archives (`data/units.ts` + `data/firstTerm.ts`)
- 🔊 Web Audio synthesized SFX + background music (`Dark-Pulse-Monitor.mp3`)
- 🎛️ Music toggle (`MusicToggle`)
- 🌫️ Visual atmosphere (`Atmosphere`) + floating contact button (`ContactFab`)
- 📱 Fully Arabic RTL interface (Amiri + Courier Prime fonts)

### 🛠️ Stack

`React 19` • `Vite 6` • `TypeScript 5` • `@google/genai` • `Tailwind (CDN)` • `Web Audio API`

### 🚀 Run Locally

**Prerequisites:** `Node.js` (20+ recommended)

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and add your key
cp .env.example .env.local
# then put your Gemini key in GEMINI_API_KEY

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build
```

### 📁 Project Structure

```
final-sentence/
├── App.tsx / src/App.tsx        # Game screens & core logic
├── components/                  # Atmosphere • ContactFab • MusicToggle
├── services/
│   ├── geminiService.ts         # Word generation via Gemini
│   └── soundService.ts          # SFX + background music
├── data/                        # units.ts • firstTerm.ts (curriculum)
├── public/
│   └── Dark-Pulse-Monitor.mp3   # Background music (served at /...)
├── index.html / index.tsx       # Entry point
└── vite.config.ts               # Maps GEMINI_API_KEY to process.env.API_KEY
```

<details>
<summary><b>🕰️ Project evolution (4 versions merged in Git)</b></summary>

| Version | Date | Description |
|---|---|---|
| `v00` | 2025-11-17 | Vanilla JS + Three.js prototype |
| `v01` | 2025-12-04 | Full rewrite to React + Vite + Gemini |
| `v02` | 2025-12-06 | Curriculum archives + ContactFab + SFX |
| `v03` | 2025-12-06 | MusicToggle + MP3 background music |
| `v04` | 2026-10-11 | Entry gate + skip button + compressed music (5.4MB → 1.3MB) |

Each version is preserved as a commit with its original date — run `git log` to walk the journey.

</details>

---

<div align="center">

### [⬆️ back to top / العودة للأعلى](#-final-sentence)

MIT License — game assets and curriculum data belong to their respective owners.

</div>
