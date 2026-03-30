import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// DATA: All lessons, quizzes, and minigame content
// ============================================================

const HIRAGANA_CHART = {
  vowels: [
    { h: "あ", r: "a" }, { h: "い", r: "i" }, { h: "う", r: "u" }, { h: "え", r: "e" }, { h: "お", r: "o" }
  ],
  k: [
    { h: "か", r: "ka" }, { h: "き", r: "ki" }, { h: "く", r: "ku" }, { h: "け", r: "ke" }, { h: "こ", r: "ko" }
  ],
  s: [
    { h: "さ", r: "sa" }, { h: "し", r: "shi" }, { h: "す", r: "su" }, { h: "せ", r: "se" }, { h: "そ", r: "so" }
  ],
  t: [
    { h: "た", r: "ta" }, { h: "ち", r: "chi" }, { h: "つ", r: "tsu" }, { h: "て", r: "te" }, { h: "と", r: "to" }
  ],
  n: [
    { h: "な", r: "na" }, { h: "に", r: "ni" }, { h: "ぬ", r: "nu" }, { h: "ね", r: "ne" }, { h: "の", r: "no" }
  ],
  h: [
    { h: "は", r: "ha" }, { h: "ひ", r: "hi" }, { h: "ふ", r: "fu" }, { h: "へ", r: "he" }, { h: "ほ", r: "ho" }
  ],
  m: [
    { h: "ま", r: "ma" }, { h: "み", r: "mi" }, { h: "む", r: "mu" }, { h: "め", r: "me" }, { h: "も", r: "mo" }
  ],
  y: [
    { h: "や", r: "ya" }, null, { h: "ゆ", r: "yu" }, null, { h: "よ", r: "yo" }
  ],
  r: [
    { h: "ら", r: "ra" }, { h: "り", r: "ri" }, { h: "る", r: "ru" }, { h: "れ", r: "re" }, { h: "ろ", r: "ro" }
  ],
  w: [
    { h: "わ", r: "wa" }, null, null, null, { h: "を", r: "wo" }
  ],
  nn: [{ h: "ん", r: "n" }]
};

const KATAKANA_COMMON = [
  { k: "コーヒー", r: "koohii", en: "coffee" },
  { k: "レストラン", r: "resutoran", en: "restaurant" },
  { k: "テレビ", r: "terebi", en: "television" },
  { k: "コンピューター", r: "konpyuutaa", en: "computer" },
  { k: "ビール", r: "biiru", en: "beer" },
  { k: "タクシー", r: "takushii", en: "taxi" },
  { k: "ホテル", r: "hoteru", en: "hotel" },
  { k: "パン", r: "pan", en: "bread" },
];

const PARTICLES_DATA = [
  { p: "は", r: "wa", role: "Topic/Subject", ex: "watashi wa", exEn: "I (am the topic)", color: "#FF6B6B", bengali: "Like -ই/-টা marking the topic in Bengali" },
  { p: "を", r: "o", role: "Object of action", ex: "koohii o", exEn: "coffee (acting on it)", color: "#4ECDC4", bengali: "Like -কে/-টাকে marking the object" },
  { p: "の", r: "no", role: "Possession", ex: "watashi no", exEn: "my", color: "#45B7D1", bengali: "Like -র/-এর (āmār = my)" },
  { p: "に", r: "ni", role: "Target/Direction", ex: "gakkou ni", exEn: "to school", color: "#96CEB4", bengali: "Like -তে/-এ for direction" },
  { p: "で", r: "de", role: "Location of action", ex: "kafe de", exEn: "at a café", color: "#FFEAA7", bengali: "Like -তে for 'at/in' a place" },
];

const BASIC_VERBS = [
  { dict: "taberu", masu: "tabemasu", past: "tabemashita", neg: "tabemasen", en: "eat", r: "taberu" },
  { dict: "nomu", masu: "nomimasu", past: "nomimashita", neg: "nomimasen", en: "drink", r: "nomu" },
  { dict: "iku", masu: "ikimasu", past: "ikimashita", neg: "ikimasen", en: "go", r: "iku" },
  { dict: "kuru", masu: "kimasu", past: "kimashita", neg: "kimasen", en: "come", r: "kuru" },
  { dict: "miru", masu: "mimasu", past: "mimashita", neg: "mimasen", en: "see/watch", r: "miru" },
  { dict: "suru", masu: "shimasu", past: "shimashita", neg: "shimasen", en: "do", r: "suru" },
  { dict: "kau", masu: "kaimasu", past: "kaimashita", neg: "kaimasen", en: "buy", r: "kau" },
  { dict: "yomu", masu: "yomimasu", past: "yomimashita", neg: "yomimasen", en: "read", r: "yomu" },
  { dict: "kaku", masu: "kakimasu", past: "kakimashita", neg: "kakimasen", en: "write", r: "kaku" },
  { dict: "hanasu", masu: "hanashimasu", past: "hanashimashita", neg: "hanashimasen", en: "speak", r: "hanasu" },
];

const BLOCK_COLORS = {
  who: "#FF6B6B",
  time: "#FFEAA7",
  place: "#96CEB4",
  what: "#4ECDC4",
  how: "#DDA0DD",
  verb: "#45B7D1",
};

// ============================================================
// GRAMMAR NOTES — explains WHY things work
// ============================================================
const GRAMMAR_NOTES = {
  wa: {
    title: "Why 'wa' (は)?",
    text: "は is written 'ha' in hiragana but pronounced 'wa' when used as a particle. It marks what you're talking ABOUT — the topic. Think of it as saying 'As for...' — 'watashi wa' = 'As for me...'. Unlike English subjects, the topic can be anything — 'kyou wa' = 'As for today...'.",
    tip: "If you can replace it with 'As for...', use wa."
  },
  o: {
    title: "Why 'o' (を)?",
    text: "を marks the direct object — the thing being acted upon. 'koohii o nomimasu' = 'I drink coffee'. Coffee is the thing being drunk, so it gets 'o'. を is written 'wo' in hiragana but pronounced 'o'.",
    tip: "Ask: 'What is being [verbed]?' That word gets o."
  },
  ni: {
    title: "Why 'ni' (に)?",
    text: "に marks a specific target, destination, or point in time. 'gakkou ni ikimasu' = 'I go TO school'. 'sanji ni' = 'AT 3 o'clock'. Think of ni as a precise pin on a map — it points to exactly where or when.",
    tip: "ni = specific destination or exact time."
  },
  de: {
    title: "Why 'de' (で)?",
    text: "で marks WHERE an action takes place, or the means/tool used. 'kafe de nomimasu' = 'I drink AT a café'. 'basu de ikimasu' = 'I go BY bus'. The key difference from ni: de is about the location/method of an ACTION.",
    tip: "ni = destination (going TO). de = activity location (doing AT)."
  },
  masu: {
    title: "The -masu System",
    text: "The -masu ending is polite/formal Japanese. It's the default you use with strangers, colleagues, and anyone you don't know well. There are exactly 4 patterns:\n\n-masu (present/future positive)\n-mashita (past positive)\n-masen (present/future negative)\n-masen deshita (past negative)\n\nThe subject (I/you/they) is almost always dropped because context makes it clear.",
    tip: "Always use -masu form until someone invites you to use casual speech."
  },
  te: {
    title: "The te-Form Explained",
    text: "The te-form is the most versatile conjugation. It connects actions ('ate AND drank'), makes requests ('please eat'), describes ongoing states ('am eating'), and more. For Group 2 verbs (ichidan), just drop -ru and add -te. Group 1 verbs (godan) have sound-change rules.",
    tip: "te-form = the 'connecting' form. Master it and Japanese opens up."
  },
  adjectives: {
    title: "i vs na Adjectives",
    text: "i-adjectives are native Japanese words ending in -i. They conjugate by themselves: oishii → oishikunai (not delicious) → oishikatta (was delicious). na-adjectives are often borrowed words and need 'na' before nouns: kirei na hana (beautiful flower). They use 'ja nai' for negation.",
    tip: "If it ends in -i and isn't a known na-adj, it's an i-adj."
  },
  counters: {
    title: "Why Counters?",
    text: "In English we say '3 books'. In Japanese, you need a counter word between the number and noun — like English 'sheets' in '3 sheets of paper'. Different shapes/types of objects use different counters. This sounds complex, but you really only need 5–6 counters for daily life.",
    tip: "Start with -tsu (general), -nin (people), -hon (long things), -mai (flat things)."
  },
  casual: {
    title: "Polite vs Casual Speech",
    text: "Casual speech drops -masu and uses the dictionary form of verbs. 'tabemasu' → 'taberu'. This is what friends, family, and close colleagues use. Using casual too early can be rude; using polite too long with friends can feel cold. Japanese people will signal when to switch by using casual speech themselves.",
    tip: "Match the other person's level. When in doubt, stay polite."
  }
};

// ============================================================
// ALL VOCAB — for spaced repetition
// ============================================================
const ALL_VOCAB = [
  { id: "v1", en: "I / me", r: "watashi", jp: "わたし", lesson: 1 },
  { id: "v2", en: "sushi", r: "sushi", jp: "すし", lesson: 1 },
  { id: "v3", en: "eat (polite)", r: "tabemasu", jp: "たべます", lesson: 1 },
  { id: "v4", en: "drink (polite)", r: "nomimasu", jp: "のみます", lesson: 1 },
  { id: "v5", en: "friend", r: "tomodachi", jp: "ともだち", lesson: 2 },
  { id: "v6", en: "school", r: "gakkou", jp: "がっこう", lesson: 2 },
  { id: "v7", en: "house / home", r: "ie", jp: "いえ", lesson: 2 },
  { id: "v8", en: "television", r: "terebi", jp: "テレビ", lesson: 2 },
  { id: "v9", en: "go (polite)", r: "ikimasu", jp: "いきます", lesson: 3 },
  { id: "v10", en: "come (polite)", r: "kimasu", jp: "きます", lesson: 3 },
  { id: "v11", en: "see (polite)", r: "mimasu", jp: "みます", lesson: 3 },
  { id: "v12", en: "do (polite)", r: "shimasu", jp: "します", lesson: 3 },
  { id: "v13", en: "buy (polite)", r: "kaimasu", jp: "かいます", lesson: 3 },
  { id: "v14", en: "read (polite)", r: "yomimasu", jp: "よみます", lesson: 3 },
  { id: "v15", en: "write (polite)", r: "kakimasu", jp: "かきます", lesson: 3 },
  { id: "v16", en: "speak (polite)", r: "hanashimasu", jp: "はなします", lesson: 3 },
  { id: "v17", en: "ramen", r: "raamen", jp: "ラーメン", lesson: 3 },
  { id: "v18", en: "beer", r: "biiru", jp: "ビール", lesson: 3 },
  { id: "v19", en: "nice to meet you", r: "hajimemashite", jp: "はじめまして", lesson: 4 },
  { id: "v20", en: "please (formal)", r: "onegaishimasu", jp: "おねがいします", lesson: 4 },
  { id: "v21", en: "coffee", r: "koohii", jp: "コーヒー", lesson: 5 },
  { id: "v22", en: "restaurant", r: "resutoran", jp: "レストラン", lesson: 5 },
  { id: "v23", en: "hotel", r: "hoteru", jp: "ホテル", lesson: 5 },
  { id: "v24", en: "taxi", r: "takushii", jp: "タクシー", lesson: 5 },
  { id: "v25", en: "bread", r: "pan", jp: "パン", lesson: 5 },
  { id: "v26", en: "yesterday", r: "kinou", jp: "きのう", lesson: 6 },
  { id: "v27", en: "today", r: "kyou", jp: "きょう", lesson: 6 },
  { id: "v28", en: "tomorrow", r: "ashita", jp: "あした", lesson: 6 },
  { id: "v29", en: "every day", r: "mainichi", jp: "まいにち", lesson: 6 },
  { id: "v30", en: "book", r: "hon", jp: "ほん", lesson: 6 },
  { id: "v31", en: "what", r: "nani", jp: "なに", lesson: 7 },
  { id: "v32", en: "milk", r: "miruku", jp: "ミルク", lesson: 7 },
  { id: "v33", en: "delicious", r: "oishii", jp: "おいしい", lesson: 8 },
  { id: "v34", en: "big", r: "ookii", jp: "おおきい", lesson: 8 },
  { id: "v35", en: "small", r: "chiisai", jp: "ちいさい", lesson: 8 },
  { id: "v36", en: "expensive", r: "takai", jp: "たかい", lesson: 8 },
  { id: "v37", en: "beautiful", r: "kirei", jp: "きれい", lesson: 8 },
  { id: "v38", en: "quiet", r: "shizuka", jp: "しずか", lesson: 8 },
  { id: "v39", en: "want to eat", r: "tabetai", jp: "たべたい", lesson: 9 },
  { id: "v40", en: "want to go", r: "ikitai", jp: "いきたい", lesson: 9 },
  { id: "v41", en: "cheap", r: "yasui", jp: "やすい", lesson: 9 },
  { id: "v42", en: "name", r: "namae", jp: "なまえ", lesson: 10 },
  { id: "v43", en: "here", r: "koko", jp: "ここ", lesson: 10 },
  { id: "v44", en: "one (general)", r: "hitotsu", jp: "ひとつ", lesson: 11 },
  { id: "v45", en: "two (general)", r: "futatsu", jp: "ふたつ", lesson: 11 },
  { id: "v46", en: "one person", r: "hitori", jp: "ひとり", lesson: 11 },
  { id: "v47", en: "two people", r: "futari", jp: "ふたり", lesson: 11 },
  { id: "v48", en: "water", r: "mizu", jp: "みず", lesson: 11 },
  { id: "v49", en: "please give me", r: "kudasai", jp: "ください", lesson: 11 },
  { id: "v50", en: "morning", r: "asa", jp: "あさ", lesson: 12 },
  { id: "v51", en: "night", r: "yoru", jp: "よる", lesson: 12 },
  { id: "v52", en: "wake up (polite)", r: "okimasu", jp: "おきます", lesson: 12 },
  { id: "v53", en: "sleep (polite)", r: "nemasu", jp: "ねます", lesson: 12 },
  { id: "v54", en: "work (polite)", r: "hatarakimasu", jp: "はたらきます", lesson: 12 },
  { id: "v55", en: "company", r: "kaisha", jp: "かいしゃ", lesson: 12 },
  { id: "v56", en: "train", r: "densha", jp: "でんしゃ", lesson: 12 },
  { id: "v57", en: "eat (casual)", r: "taberu", jp: "たべる", lesson: 13 },
  { id: "v58", en: "go (casual)", r: "iku", jp: "いく", lesson: 13 },
  { id: "v59", en: "it's okay", r: "daijoubu", jp: "だいじょうぶ", lesson: 13 },
  { id: "v60", en: "really?", r: "hontou", jp: "ほんとう", lesson: 13 },
  { id: "v61", en: "amazing", r: "sugoi", jp: "すごい", lesson: 13 },
  { id: "v62", en: "right", r: "migi", jp: "みぎ", lesson: 14 },
  { id: "v63", en: "left", r: "hidari", jp: "ひだり", lesson: 14 },
  { id: "v64", en: "straight ahead", r: "massugu", jp: "まっすぐ", lesson: 14 },
  { id: "v65", en: "where", r: "doko", jp: "どこ", lesson: 14 },
  { id: "v66", en: "station", r: "eki", jp: "えき", lesson: 14 },
  { id: "v67", en: "convenience store", r: "konbini", jp: "コンビニ", lesson: 14 },
  { id: "v68", en: "mountain", r: "yama", jp: "山", lesson: 15 },
  { id: "v69", en: "river", r: "kawa", jp: "川", lesson: 15 },
  { id: "v70", en: "sun / day", r: "nichi", jp: "日", lesson: 15 },
  { id: "v71", en: "moon / month", r: "tsuki", jp: "月", lesson: 15 },
  { id: "v72", en: "person", r: "hito", jp: "人", lesson: 15 },
  { id: "v73", en: "big (kanji)", r: "dai", jp: "大", lesson: 15 },
  { id: "v74", en: "small (kanji)", r: "shou", jp: "小", lesson: 15 },
];

// SRS helpers
function getVocabForReview(progress) {
  const available = ALL_VOCAB.filter(v => progress.completedLessons.includes(v.lesson));
  if (available.length === 0) return [];
  const srsData = progress.srsData || {};
  const now = Date.now();
  const scored = available.map(v => {
    const data = srsData[v.id] || { interval: 0, lastReview: 0, correct: 0, wrong: 0 };
    const timeSince = now - data.lastReview;
    const priority = data.lastReview === 0 ? -Infinity : (data.interval - timeSince);
    return { ...v, srs: data, priority };
  });
  scored.sort((a, b) => a.priority - b.priority);
  return scored.slice(0, 10);
}

function updateSRS(srsData, vocabId, correct) {
  const data = srsData[vocabId] || { interval: 0, lastReview: 0, correct: 0, wrong: 0 };
  const now = Date.now();
  const intervals = [60000, 600000, 3600000, 28800000, 86400000, 259200000, 604800000, 1209600000, 2592000000];
  if (correct) {
    const idx = intervals.findIndex(i => i >= data.interval);
    const next = Math.min((idx >= 0 ? idx : 0) + 1, intervals.length - 1);
    return { ...data, interval: intervals[next], lastReview: now, correct: data.correct + 1 };
  }
  return { ...data, interval: 60000, lastReview: now, wrong: data.wrong + 1 };
}

// Audio pronunciation — optimised Web Speech API
let _jaVoices = [];
function _loadVoices() {
  if (!window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  // Rank Japanese voices: prefer enhanced/premium voices, then female, then any
  _jaVoices = voices
    .filter(v => v.lang === "ja-JP" || v.lang === "ja_JP" || v.lang.startsWith("ja"))
    .sort((a, b) => {
      const aScore = (a.name.toLowerCase().includes("enhanced") || a.name.toLowerCase().includes("premium") ? 100 : 0)
        + (a.name.toLowerCase().includes("kyoko") || a.name.toLowerCase().includes("o-ren") ? 50 : 0)
        + (a.localService ? 0 : 10);
      const bScore = (b.name.toLowerCase().includes("enhanced") || b.name.toLowerCase().includes("premium") ? 100 : 0)
        + (b.name.toLowerCase().includes("kyoko") || b.name.toLowerCase().includes("o-ren") ? 50 : 0)
        + (b.localService ? 0 : 10);
      return bScore - aScore;
    });
}

function speakJapanese(text) {
  if (!text || !window.speechSynthesis) return;
  const clean = text.replace(/[。、！？「」]/g, '').trim();
  if (!clean) return;

  window.speechSynthesis.cancel();
  if (_jaVoices.length === 0) _loadVoices();

  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = "ja-JP";
  utter.rate = 0.8;
  utter.pitch = 1.05;
  if (_jaVoices.length > 0) utter.voice = _jaVoices[0];
  window.speechSynthesis.speak(utter);
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = _loadVoices;
  _loadVoices();
}

const LESSONS = [
  {
    id: 1,
    title: "The Sound System",
    subtitle: "Japanese vowels = Italian vowels",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "🇮🇹 Your Italian Superpower",
        text: "Japanese has exactly 5 vowels: a, i, u, e, o — and they sound almost identical to Italian vowels. Say 'pasta' — that 'a' is perfect Japanese. Say 'vino' — that 'i' and 'o' are perfect too. You already know how to pronounce 50% of Japanese."
      },
      {
        type: "chart",
        title: "The Hiragana Vowels",
        data: HIRAGANA_CHART.vowels
      },
      {
        type: "insight",
        title: "🇧🇩 Your Bengali Superpower",
        text: "Bengali is Subject-Object-Verb, just like Japanese! In Bengali you say 'আমি ভাত খাই' (ami bhat khai = I rice eat). Japanese works the same way: watashi wa gohan o tabemasu = I rice eat. You already THINK in Japanese word order."
      },
      {
        type: "block-intro",
        title: "The Block Method — How Japanese Sentences Work",
        text: "Every Japanese sentence is built from blocks in this order. The verb ALWAYS goes last. Always.",
        blocks: ["Who wa", "Time", "Place de", "What o", "How", "Verb"]
      },
      {
        type: "example",
        en: "I eat sushi.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "What", jp: "すしを", r: "sushi o" },
          { label: "Verb", jp: "たべます", r: "tabemasu" },
        ]
      },
      {
        type: "example",
        en: "I drink coffee at a café.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Place", jp: "カフェで", r: "kafe de" },
          { label: "What", jp: "コーヒーを", r: "koohii o" },
          { label: "Verb", jp: "のみます", r: "nomimasu" },
        ]
      }
    ]
  },
  {
    id: 2,
    title: "The 5 Core Particles",
    subtitle: "One word, swap the particle, change the meaning",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "🇧🇩 Particles = Bengali Postpositions",
        text: "In English you say 'to school', 'at school', 'from school' — the little word goes BEFORE. In Bengali, like Japanese, it goes AFTER: স্কুলে (skule = school-at), স্কুলের (skuler = school's). Japanese particles work exactly the same way. They attach AFTER the noun."
      },
      {
        type: "particles",
        data: PARTICLES_DATA
      },
      {
        type: "insight",
        title: "The Magic Trick",
        text: "Watch how ONE word — watashi (I/me) — changes meaning with different particles:\n\nwatashi wa = I (topic)\nwatashi no = my\nwatashi ni = to me\nwatashi mo = me too\n\nThe word never changes. Only the particle does. This is the opposite of Italian, where 'io/mi/mio/me' are all different words!"
      },
      {
        type: "example",
        en: "I watch TV at home.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Place", jp: "いえで", r: "ie de" },
          { label: "What", jp: "テレビを", r: "terebi o" },
          { label: "Verb", jp: "みます", r: "mimasu" },
        ]
      },
      {
        type: "example",
        en: "My friend goes to school.",
        blocks: [
          { label: "Who", jp: "わたしの ともだちは", r: "watashi no tomodachi wa" },
          { label: "Place", jp: "がっこうに", r: "gakkou ni" },
          { label: "Verb", jp: "いきます", r: "ikimasu" },
        ]
      }
    ]
  },
  {
    id: 3,
    title: "10 Essential Verbs",
    subtitle: "The engine of every sentence",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "🇮🇹 Italian Has 50+ Verb Forms. Japanese Has... 4.",
        text: "In Italian, 'mangiare' becomes mangio, mangi, mangia, mangiamo, mangiate, mangiano... and that's just present tense! In Japanese, polite form has essentially 4 forms:\n\ntabemasu (eat) → tabemashita (ate) → tabemasen (don't eat) → tabemasen deshita (didn't eat)\n\nThat's it. No person agreement. No gender. Just these 4 patterns."
      },
      {
        type: "verbs",
        data: BASIC_VERBS
      },
      {
        type: "example",
        en: "Yesterday I ate ramen at a restaurant.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Time", jp: "きのう", r: "kinou" },
          { label: "Place", jp: "レストランで", r: "resutoran de" },
          { label: "What", jp: "ラーメンを", r: "raamen o" },
          { label: "Verb", jp: "たべました", r: "tabemashita" },
        ]
      },
      {
        type: "example",
        en: "I don't drink beer.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "What", jp: "ビールを", r: "biiru o" },
          { label: "Verb", jp: "のみません", r: "nomimasen" },
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Self-Introduction",
    subtitle: "jikoshoukai — Your first real conversation",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "Real-World Skill #1",
        text: "Self-introductions (jikoshoukai) are HUGE in Japanese culture. This is probably the first thing you'll actually use. Let's build yours block by block."
      },
      {
        type: "conversation",
        title: "A Self-Introduction",
        lines: [
          { speaker: "You", jp: "はじめまして。", r: "hajimemashite.", en: "Nice to meet you (first time)." },
          { speaker: "You", jp: "わたしは ______です。", r: "watashi wa ______ desu.", en: "I am ______." },
          { speaker: "You", jp: "イギリスから きました。", r: "igirisu kara kimashita.", en: "I came from England." },
          { speaker: "You", jp: "どうぞ よろしく おねがいします。", r: "douzo yoroshiku onegaishimasu.", en: "Please treat me well (formal closing)." },
        ]
      },
      {
        type: "insight",
        title: "New Particle Alert: kara = 'from'",
        text: "This is a new block! 'kara' marks where you came FROM.\n\nigirisu kara = from England\nitaria kara = from Italy\nbanguradesh kara = from Bangladesh\n\nIt works just like Bengali -থেকে (theke): London theke = rondon kara = from London"
      },
      {
        type: "example",
        en: "I came from London.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "How", jp: "ロンドンから", r: "rondon kara" },
          { label: "Verb", jp: "きました", r: "kimashita" },
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Katakana — English in Disguise",
    subtitle: "You already know hundreds of Japanese words",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "🇬🇧 Your English Superpower",
        text: "Japanese borrowed THOUSANDS of English words and wrote them in a special alphabet called katakana. If you can say 'coffee', you can say koohii. If you can say 'restaurant', you can say resutoran. Think of katakana as English words wearing a Japanese costume."
      },
      {
        type: "katakana",
        data: KATAKANA_COMMON
      },
      {
        type: "insight",
        title: "🇮🇹 Double Consonants = Italian Gemination",
        text: "Japanese has double consonants just like Italian! kippu (ticket) has the same 'pp' sound as 'coppa'. nippon (Japan) works like 'troppo'. Your Italian ear is already trained for this."
      },
      {
        type: "example",
        en: "I drink coffee at a hotel.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Place", jp: "ホテルで", r: "hoteru de" },
          { label: "What", jp: "コーヒーを", r: "koohii o" },
          { label: "Verb", jp: "のみます", r: "nomimasu" },
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Time Blocks & Past Tense",
    subtitle: "Yesterday, today, tomorrow — placing events in time",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "Time = A Block That Slots In",
        text: "Time words in Japanese are just another block. They go near the front of the sentence, right after [Who]. No prepositions needed — no 'on Monday', 'at 3pm', 'in the morning'. Just drop the time word in the Time slot.\n\nkinou = yesterday\nkyou = today\nashita = tomorrow\nmainichi = every day"
      },
      {
        type: "example",
        en: "Tomorrow I will go to Tokyo.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Time", jp: "あした", r: "ashita" },
          { label: "Place", jp: "とうきょうに", r: "toukyou ni" },
          { label: "Verb", jp: "いきます", r: "ikimasu" },
        ]
      },
      {
        type: "insight",
        title: "Past Tense is Just -mashita",
        text: "To make any polite verb past tense, swap -masu → -mashita. That's it. No irregular forms to memorise (unlike Italian where every verb has its own passato remoto nightmare).\n\ntabemasu → tabemashita (eat → ate)\nnomimasu → nomimashita (drink → drank)\nikimasu → ikimashita (go → went)"
      },
      {
        type: "example",
        en: "Yesterday I bought bread at the shop.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Time", jp: "きのう", r: "kinou" },
          { label: "Place", jp: "みせで", r: "mise de" },
          { label: "What", jp: "パンを", r: "pan o" },
          { label: "Verb", jp: "かいました", r: "kaimashita" },
        ]
      },
      {
        type: "example",
        en: "I read a book every day.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Time", jp: "まいにち", r: "mainichi" },
          { label: "What", jp: "ほんを", r: "hon o" },
          { label: "Verb", jp: "よみます", r: "yomimasu" },
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Questions & Negatives",
    subtitle: "'ka' turns anything into a question. '-masen' says no.",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "Questions Are FREE",
        text: "In English you rearrange the whole sentence to ask a question ('You eat sushi' → 'Do you eat sushi?'). In Japanese, you just add 'ka' to the end. That's it. The sentence stays exactly the same.\n\ntabemasu = I eat.\ntabemasu ka? = Do you eat?\n\nThis is like Bengali adding কি (ki) at the end: tumi khao (you eat) → tumi khao ki? (do you eat?)"
      },
      {
        type: "example",
        en: "Do you drink coffee?",
        blocks: [
          { label: "What", jp: "コーヒーを", r: "koohii o" },
          { label: "Verb", jp: "のみますか？", r: "nomimasu ka?" },
        ]
      },
      {
        type: "insight",
        title: "Negatives: -masu → -masen",
        text: "To say 'don't/doesn't', swap -masu → -masen.\nPast negative? -masen → -masen deshita.\n\ntabemasu → tabemasen (don't eat)\ntabemashita → tabemasen deshita (didn't eat)"
      },
      {
        type: "example",
        en: "I didn't go to the restaurant yesterday.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Time", jp: "きのう", r: "kinou" },
          { label: "Place", jp: "レストランに", r: "resutoran ni" },
          { label: "Verb", jp: "いきませんでした", r: "ikimasendeshita" },
        ]
      },
      {
        type: "conversation",
        title: "At a Restaurant",
        lines: [
          { speaker: "Staff", jp: "なにを のみますか？", r: "nani o nomimasu ka?", en: "What will you drink?" },
          { speaker: "You", jp: "コーヒーを おねがいします。", r: "koohii o onegaishimasu.", en: "Coffee, please." },
          { speaker: "Staff", jp: "ミルクは？", r: "miruku wa?", en: "Milk?" },
          { speaker: "You", jp: "いいえ、けっこうです。", r: "iie, kekkou desu.", en: "No, I'm fine (polite decline)." },
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Describing Things",
    subtitle: "i-adjectives and na-adjectives",
    phase: 2,
    content: [
      {
        type: "insight",
        title: "Two Flavours of Adjective",
        text: "Japanese has two types of adjective. The good news: they're easy to tell apart.\n\ni-adjectives end in -i: ookii (big), chiisai (small), takai (expensive), oishii (delicious), atarashii (new)\n\nna-adjectives need 'na' before a noun: kirei na (beautiful), shizuka na (quiet), yuumei na (famous), genki na (energetic)"
      },
      {
        type: "example",
        en: "This sushi is delicious!",
        blocks: [
          { label: "Who", jp: "このすしは", r: "kono sushi wa" },
          { label: "Verb", jp: "おいしいです", r: "oishii desu" },
        ]
      },
      {
        type: "example",
        en: "I went to a famous, quiet restaurant.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Place", jp: "ゆうめいな しずかな レストランに", r: "yuumei na shizuka na resutoran ni" },
          { label: "Verb", jp: "いきました", r: "ikimashita" },
        ]
      },
      {
        type: "insight",
        title: "Negative Adjectives",
        text: "i-adjectives: drop -i, add -kunai\noishii → oishikunai (not delicious)\ntakai → takakunai (not expensive)\n\nna-adjectives: add ja nai\nshizuka na → shizuka ja nai (not quiet)"
      }
    ]
  },
  {
    id: 9,
    title: "Wanting & Reasons",
    subtitle: "-tai (want to) and kara (because)",
    phase: 2,
    content: [
      {
        type: "insight",
        title: "Wanting To Do Something: -tai",
        text: "Take any -masu form verb, drop -masu, add -tai.\n\ntabemasu → tabetai (want to eat)\nikimasu → ikitai (want to go)\nnomimasu → nomitai (want to drink)\n\nThis -tai ending works like an i-adjective! So 'didn't want to' = tabetakunakatta."
      },
      {
        type: "example",
        en: "I want to eat ramen tomorrow.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "Time", jp: "あした", r: "ashita" },
          { label: "What", jp: "ラーメンを", r: "raamen o" },
          { label: "Verb", jp: "たべたいです", r: "tabetai desu" },
        ]
      },
      {
        type: "insight",
        title: "New Block: kara (because/so)",
        text: "kara is a reason connector. It goes AFTER the reason clause.\n\nStructure: [Reason] + kara + [Result]\n\noishii desu kara, mainichi tabemasu.\n= Because it's delicious, I eat it every day.\n\nThis is like Bengali কারণ (karon) but placed differently."
      },
      {
        type: "example",
        en: "Because it's cheap, I want to buy it.",
        blocks: [
          { label: "How", jp: "やすいですから", r: "yasui desu kara" },
          { label: "Verb", jp: "かいたいです", r: "kaitai desu" },
        ]
      }
    ]
  },
  {
    id: 10,
    title: "て-Form & Requests",
    subtitle: "The most useful conjugation in Japanese",
    phase: 2,
    content: [
      {
        type: "insight",
        title: "The te-Form: Your Multi-Tool",
        text: "The te-form is like a Swiss Army knife. It lets you:\n• Make requests (tabete kudasai = please eat)\n• Connect actions (tabete, nonde = ate and drank)\n• Describe ongoing states (tabete iru = am eating)\n\nFor -masu form verbs, a simple rule: drop -masu, add -te.\ntabemasu → tabete\nmimasu → mite\n\n(Some verbs have irregular te-forms, but we'll learn the main ones.)"
      },
      {
        type: "example",
        en: "Please write your name here.",
        blocks: [
          { label: "Place", jp: "ここに", r: "koko ni" },
          { label: "What", jp: "なまえを", r: "namae o" },
          { label: "Verb", jp: "かいてください", r: "kaite kudasai" },
        ]
      },
      {
        type: "insight",
        title: "Connecting Actions with te",
        text: "Use te to chain actions — like 'and then'.\n\nasa okite, koohii o nonde, shigoto ni ikimasu.\n= Morning, I wake up, (and then) drink coffee, (and then) go to work.\n\nOnly the LAST verb gets the tense ending (-masu / -mashita)."
      },
      {
        type: "example",
        en: "I ate sushi and drank beer.",
        blocks: [
          { label: "Who", jp: "わたしは", r: "watashi wa" },
          { label: "What", jp: "すしを たべて、", r: "sushi o tabete," },
          { label: "What", jp: "ビールを", r: "biiru o" },
          { label: "Verb", jp: "のみました", r: "nomimashita" },
        ]
      }
    ]
  },
  // ===== NEW LESSONS 11-15 =====
  {
    id: 11, title: "Counting & Ordering", subtitle: "Japanese counters — numbers with purpose", phase: 2,
    content: [
      { type: "insight", title: "🔢 Why Counters Exist",
        text: "In English you can say '3 books'. In Japanese, you need a special counter word — like English 'sheets' in '3 sheets of paper'. Japanese does this for EVERYTHING.\n\nThe good news: the general counter -tsu works for most things when you're starting out." },
      { type: "insight", title: "The General Counter: -tsu",
        text: "hitotsu = 1 thing\nfutatsu = 2 things\nmittsu = 3 things\nyottsu = 4 things\nitsutsu = 5 things\n\nFor 6+, use the Chinese number + specific counter. But -tsu covers you in most daily situations." },
      { type: "insight", title: "Essential Counters",
        text: "-nin (人) = people: hitori (1 person), futari (2 people), sannin (3 people)\n-hon (本) = long/thin things: ippon, nihon, sanbon (pens, bottles, trains)\n-mai (枚) = flat things: ichimai, nimai, sanmai (paper, tickets, plates)\n-hai / -pai / -bai = cups/glasses: ippai, nihai, sanbai" },
      { type: "conversation", title: "Ordering at a Restaurant", lines: [
        { speaker: "You", jp: "すみません。", r: "sumimasen.", en: "Excuse me." },
        { speaker: "Staff", jp: "なんめいさまですか？", r: "nanmei-sama desu ka?", en: "How many people?" },
        { speaker: "You", jp: "ふたりです。", r: "futari desu.", en: "Two people." },
        { speaker: "You", jp: "ビールを にはい おねがいします。", r: "biiru o nihai onegaishimasu.", en: "Two beers, please." },
        { speaker: "Staff", jp: "かしこまりました。", r: "kashikomarimashita.", en: "Certainly. (very polite)" },
      ]},
      { type: "example", en: "Please give me three of those.", blocks: [
        { label: "What", jp: "それを", r: "sore o" },
        { label: "How", jp: "みっつ", r: "mittsu" },
        { label: "Verb", jp: "ください", r: "kudasai" },
      ]},
      { type: "grammar-note", noteKey: "counters" }
    ]
  },
  {
    id: 12, title: "Daily Routines", subtitle: "Describing your day with te-form chains", phase: 2,
    content: [
      { type: "insight", title: "Real-World Skill: Talking About Your Day",
        text: "Now you can chain actions with te-form, let's describe a whole day. This is one of the most common real conversations — 'What did you do today?'\n\nNew verbs:\nokimasu = wake up\nnemasu = sleep\nhatarakimasu = work\nshawaa o abimasu = take a shower" },
      { type: "conversation", title: "What Did You Do Today?", lines: [
        { speaker: "Friend", jp: "きょう なにを しましたか？", r: "kyou nani o shimashita ka?", en: "What did you do today?" },
        { speaker: "You", jp: "あさ おきて、シャワーを あびて、コーヒーを のみました。", r: "asa okite, shawaa o abite, koohii o nomimashita.", en: "I woke up, took a shower, and drank coffee." },
        { speaker: "Friend", jp: "しごとは？", r: "shigoto wa?", en: "How about work?" },
        { speaker: "You", jp: "でんしゃで かいしゃに いきました。", r: "densha de kaisha ni ikimashita.", en: "I went to the office by train." },
      ]},
      { type: "example", en: "Every morning I wake up, eat bread, and go to work.", blocks: [
        { label: "Time", jp: "まいあさ", r: "maiasa" },
        { label: "What", jp: "おきて、パンを たべて、", r: "okite, pan o tabete," },
        { label: "Place", jp: "しごとに", r: "shigoto ni" },
        { label: "Verb", jp: "いきます", r: "ikimasu" },
      ]},
      { type: "insight", title: "Time Words: Expanding Your Toolkit",
        text: "maiasa = every morning\nmaiban = every evening\nsenshuu = last week\nkonshuu = this week\nraishuu = next week\nsengetsu = last month\nkongetsu = this month\nraigetsu = next month" },
      { type: "example", en: "Last week I went to Tokyo by train.", blocks: [
        { label: "Who", jp: "わたしは", r: "watashi wa" },
        { label: "Time", jp: "せんしゅう", r: "senshuu" },
        { label: "How", jp: "でんしゃで", r: "densha de" },
        { label: "Place", jp: "とうきょうに", r: "toukyou ni" },
        { label: "Verb", jp: "いきました", r: "ikimashita" },
      ]}
    ]
  },
  {
    id: 13, title: "Casual Speech", subtitle: "Dropping -masu — talking like a real person", phase: 3,
    content: [
      { type: "insight", title: "🎭 Two Modes of Japanese",
        text: "Everything so far has been polite (-masu) form. But with friends, family, and close colleagues, speakers use casual (dictionary) form.\n\ntabemasu → taberu (eat)\nikimasu → iku (go)\nnomimasu → nomu (drink)\nmimasu → miru (watch)\nshimasu → suru (do)" },
      { type: "insight", title: "Casual Past & Negative",
        text: "Casual past: taberu → tabeta (ate)\nCasual negative: taberu → tabenai (don't eat)\nCasual past negative: taberu → tabenakatta (didn't eat)\n\nGroup 1 (godan) verbs have sound changes:\niku → itta (went), ikanai, ikanakatta\nnomu → nonda (drank), nomanai, nomanakatta" },
      { type: "conversation", title: "Chatting With a Friend", lines: [
        { speaker: "Friend", jp: "きのう なに した？", r: "kinou nani shita?", en: "What'd you do yesterday?" },
        { speaker: "You", jp: "ラーメン たべた。すごく おいしかった！", r: "raamen tabeta. sugoku oishikatta!", en: "Ate ramen. It was really delicious!" },
        { speaker: "Friend", jp: "いいなあ。どこで？", r: "ii naa. doko de?", en: "Nice. Where?" },
        { speaker: "You", jp: "えきの ちかくの みせ。いっしょに いく？", r: "eki no chikaku no mise. issho ni iku?", en: "A shop near the station. Wanna go together?" },
        { speaker: "Friend", jp: "いこう！", r: "ikou!", en: "Let's go!" },
      ]},
      { type: "insight", title: "Casual Phrases You'll Hear Everywhere",
        text: "daijoubu = it's fine / I'm okay / no thanks\nhontou? = really?\nsugoi! = amazing! / wow!\nchotto... = um... / a little... (polite hesitation)\nmaji de? = seriously? (very casual)" },
      { type: "example", en: "I didn't go yesterday.", blocks: [
        { label: "Time", jp: "きのう", r: "kinou" },
        { label: "Verb", jp: "いかなかった", r: "ikanakatta" },
      ]},
      { type: "grammar-note", noteKey: "casual" }
    ]
  },
  {
    id: 14, title: "Getting Around", subtitle: "Directions, locations, and asking where things are", phase: 3,
    content: [
      { type: "insight", title: "Real-World Skill: Finding Your Way",
        text: "Getting lost in Japan? These words will save you:\n\nmigi = right\nhidari = left\nmassugu = straight ahead\nchikaku = nearby\ntoi = far\n\n'sumimasen' (excuse me) is your best friend when asking for directions." },
      { type: "conversation", title: "Asking for Directions", lines: [
        { speaker: "You", jp: "すみません、えきは どこ ですか？", r: "sumimasen, eki wa doko desu ka?", en: "Excuse me, where is the station?" },
        { speaker: "Person", jp: "まっすぐ いって、みぎに まがって ください。", r: "massugu itte, migi ni magatte kudasai.", en: "Go straight, then turn right." },
        { speaker: "You", jp: "どのぐらい かかりますか？", r: "dono gurai kakarimasu ka?", en: "About how long does it take?" },
        { speaker: "Person", jp: "あるいて ごふんぐらい です。", r: "aruite gofun gurai desu.", en: "About 5 minutes walking." },
        { speaker: "You", jp: "ありがとうございます！", r: "arigatou gozaimasu!", en: "Thank you very much!" },
      ]},
      { type: "insight", title: "Location Words: koko, soko, asoko",
        text: "Japanese has a neat 'ko-so-a-do' system:\n\nkoko = here (near me)\nsoko = there (near you)\nasoko = over there (far from both)\ndoko = where? (question)\n\nThis pattern repeats: kore/sore/are/dore (this/that/that over there/which)" },
      { type: "example", en: "Where is the convenience store?", blocks: [
        { label: "Who", jp: "コンビニは", r: "konbini wa" },
        { label: "Verb", jp: "どこですか？", r: "doko desu ka?" },
      ]},
      { type: "example", en: "Please turn left at the station.", blocks: [
        { label: "Place", jp: "えきで", r: "eki de" },
        { label: "How", jp: "ひだりに", r: "hidari ni" },
        { label: "Verb", jp: "まがってください", r: "magatte kudasai" },
      ]}
    ]
  },
  {
    id: 15, title: "First Kanji", subtitle: "10 kanji that tell visual stories", phase: 3,
    content: [
      { type: "insight", title: "🎨 Kanji Are Pictures",
        text: "Don't panic. Kanji started as pictures. 山 (yama) literally looks like a mountain with three peaks. 川 (kawa) looks like flowing water. 日 (hi) is the sun boxed up. 月 (tsuki) is a crescent moon.\n\nYou DON'T need thousands. Start with 10 that tell visual stories." },
      { type: "insight", title: "The First 10 Kanji",
        text: "山 = yama = mountain (three peaks)\n川 = kawa = river (flowing lines)\n日 = hi/nichi = sun/day\n月 = tsuki/getsu = moon/month\n火 = hi/ka = fire\n水 = mizu/sui = water\n木 = ki/moku = tree (trunk + branches)\n人 = hito/jin = person (walking legs)\n大 = ookii/dai = big (person stretching)\n小 = chiisai/shou = small (person shrinking)" },
      { type: "insight", title: "Kanji Readings: On & Kun",
        text: "Most kanji have TWO readings:\n\nKun-yomi = native Japanese (used when kanji stands alone)\nOn-yomi = Chinese-derived (used in compound words)\n\n山: kun = yama, on = san/zan (Fujisan = Mt. Fuji)\n人: kun = hito, on = jin/nin (nihonjin = Japanese person)\n\nDon't memorise both — learn them naturally through words." },
      { type: "example", en: "That person is Japanese.", blocks: [
        { label: "Who", jp: "あのひとは", r: "ano hito wa" },
        { label: "Verb", jp: "にほんじんです", r: "nihonjin desu" },
      ]},
      { type: "insight", title: "Days of the Week — Kanji in Action",
        text: "getsuyoubi (月曜日) = Monday (moon day)\nkayoubi (火曜日) = Tuesday (fire day)\nsuiyoubi (水曜日) = Wednesday (water day)\nmokuyoubi (木曜日) = Thursday (tree day)\nkinyoubi (金曜日) = Friday (gold day)\ndoyoubi (土曜日) = Saturday (earth day)\nnichiyoubi (日曜日) = Sunday (sun day)" }
    ]
  },
];

const QUIZZES = [
  {
    afterLesson: 1,
    title: "Sound System Check",
    questions: [
      { q: "What does 'a' sound like in Japanese?", options: ["a (as in 'pasta')", "e (as in 'egg')", "o (as in 'go')", "u (as in 'blue')"], correct: 0 },
      { q: "In the block method, where does the verb go?", options: ["First", "Middle", "Last", "Anywhere"], correct: 2 },
      { q: "Which language shares the same word order as Japanese?", options: ["English", "Italian", "Bengali", "French"], correct: 2 },
      { q: "What is the correct block order?", options: ["Verb → Who → What", "Who → Time → Place → What → How → Verb", "What → Who → Verb", "Time → Verb → Who"], correct: 1 },
    ]
  },
  {
    afterLesson: 2,
    title: "Particle Power",
    questions: [
      { q: "Which particle marks the topic/subject?", options: ["o", "wa", "no", "ni"], correct: 1 },
      { q: "'watashi no' means:", options: ["I (topic)", "to me", "my", "me too"], correct: 2 },
      { q: "Which particle marks where an action happens?", options: ["wa", "de", "o", "no"], correct: 1 },
      { q: "'kafe de' means:", options: ["café's", "to a café", "at a café", "café (object)"], correct: 2 },
      { q: "Which particle marks the object of an action?", options: ["wa", "ni", "de", "o"], correct: 3 },
    ]
  },
  {
    afterLesson: 3,
    title: "Verb Master",
    questions: [
      { q: "What is the polite form of 'taberu' (eat)?", options: ["tabemasu", "tabemashita", "tabemasen", "tabete"], correct: 0 },
      { q: "How do you say 'drank' in polite Japanese?", options: ["nomimasu", "nomimasen", "nomimashita", "nonde"], correct: 2 },
      { q: "How many basic polite forms does a Japanese verb have?", options: ["2", "4", "8", "50+"], correct: 1 },
      { q: "What is the negative of 'ikimasu' (go)?", options: ["ikimashita", "ikimasen", "ikanai", "itte"], correct: 1 },
    ]
  },
  {
    afterLesson: 5,
    title: "Katakana Detective",
    questions: [
      { q: "'koohii' means:", options: ["tea", "coffee", "milk", "water"], correct: 1 },
      { q: "Which writing system is used for borrowed English words?", options: ["Hiragana", "Kanji", "Katakana", "Romaji"], correct: 2 },
      { q: "'resutoran' means:", options: ["restroom", "restaurant", "reception", "rental"], correct: 1 },
      { q: "Japanese double consonants (kippu) are similar to:", options: ["English contractions", "Italian gemination (fatto, pizza)", "Bengali conjuncts", "French liaison"], correct: 1 },
    ]
  },
  {
    afterLesson: 7,
    title: "Questions & Negatives",
    questions: [
      { q: "How do you turn a statement into a question?", options: ["Change word order", "Add 'ka' at the end", "Change the verb", "Add a question mark only"], correct: 1 },
      { q: "'tabemasen' means:", options: ["I ate", "I eat", "I don't eat", "Do I eat?"], correct: 2 },
      { q: "What is 'didn't go' in polite Japanese?", options: ["ikimasen", "ikimasen deshita", "ikanakatta", "ikimashita ka"], correct: 1 },
      { q: "Bengali 'ki' at the end of a sentence is like Japanese:", options: ["wa", "ka", "o", "ne"], correct: 1 },
    ]
  },
  {
    afterLesson: 9,
    title: "Wants & Reasons",
    questions: [
      { q: "How do you say 'want to eat'?", options: ["tabemasu", "tabetai", "tabete", "tabe kara"], correct: 1 },
      { q: "'kara' means:", options: ["but", "and", "because", "if"], correct: 2 },
      { q: "'tabetai' works like what type of word?", options: ["A verb", "An i-adjective", "A na-adjective", "A particle"], correct: 1 },
      { q: "'ikitai desu' means:", options: ["I went", "I will go", "I want to go", "Please go"], correct: 2 },
    ]
  },
  {
    afterLesson: 11, title: "Counting Master",
    questions: [
      { q: "What is the general counter for '2 things'?", options: ["niko", "futatsu", "nihai", "ninin"], correct: 1 },
      { q: "Which counter is used for people?", options: ["-hon", "-mai", "-nin", "-tsu"], correct: 2 },
      { q: "How do you say '3 people'?", options: ["sannin", "mittsu", "sanmai", "sanbon"], correct: 0 },
      { q: "'biiru o nihai' means:", options: ["Two beers", "Beer twice", "Second beer", "No beer"], correct: 0 },
    ]
  },
  {
    afterLesson: 13, title: "Casual vs Polite",
    questions: [
      { q: "What is the casual form of 'tabemasu'?", options: ["tabete", "tabetai", "taberu", "tabemashita"], correct: 2 },
      { q: "'ikanakatta' means:", options: ["want to go", "didn't go (casual)", "went", "let's go"], correct: 1 },
      { q: "When should you use casual speech?", options: ["With strangers", "In job interviews", "With close friends", "With your boss"], correct: 2 },
      { q: "'hontou?' means:", options: ["I'm sorry", "Really?", "Let's go", "I understand"], correct: 1 },
    ]
  },
  {
    afterLesson: 15, title: "First Kanji",
    questions: [
      { q: "What does 山 mean?", options: ["river", "mountain", "fire", "tree"], correct: 1 },
      { q: "Which kanji looks like flowing water?", options: ["山", "火", "川", "木"], correct: 2 },
      { q: "月 means:", options: ["sun", "fire", "moon/month", "water"], correct: 2 },
      { q: "getsuyoubi (月曜日) means:", options: ["Sunday", "Monday", "Friday", "Saturday"], correct: 1 },
    ]
  },
];

// MINIGAME DATA
const BLOCK_BUILDER_SENTENCES = [
  {
    en: "I eat sushi.",
    blocks: [
      { jp: "watashi wa", label: "Who" },
      { jp: "sushi o", label: "What" },
      { jp: "tabemasu", label: "Verb" },
    ],
    distractors: ["kinou", "gakkou de"]
  },
  {
    en: "Yesterday I drank coffee.",
    blocks: [
      { jp: "watashi wa", label: "Who" },
      { jp: "kinou", label: "Time" },
      { jp: "koohii o", label: "What" },
      { jp: "nomimashita", label: "Verb" },
    ],
    distractors: ["resutoran de", "tabemasu"]
  },
  {
    en: "I go to school every day.",
    blocks: [
      { jp: "watashi wa", label: "Who" },
      { jp: "mainichi", label: "Time" },
      { jp: "gakkou ni", label: "Place" },
      { jp: "ikimasu", label: "Verb" },
    ],
    distractors: ["koohii o", "nomimashita"]
  },
  {
    en: "I watched TV at home yesterday.",
    blocks: [
      { jp: "watashi wa", label: "Who" },
      { jp: "kinou", label: "Time" },
      { jp: "ie de", label: "Place" },
      { jp: "terebi o", label: "What" },
      { jp: "mimashita", label: "Verb" },
    ],
    distractors: ["gakkou ni"]
  },
  {
    en: "I want to eat ramen tomorrow.",
    blocks: [
      { jp: "watashi wa", label: "Who" },
      { jp: "ashita", label: "Time" },
      { jp: "raamen o", label: "What" },
      { jp: "tabetai desu", label: "Verb" },
    ],
    distractors: ["kinou", "nomimasu"]
  },
];

const PARTICLE_FILL_SENTENCES = [
  { before: "watashi", after: "koohii o nomimasu", particle: "wa", hint: "I (topic) drink coffee" },
  { before: "kafe", after: "koohii o nomimasu", particle: "de", hint: "I drink coffee at a café" },
  { before: "koohii", after: "nomimasu", particle: "o", hint: "I drink coffee" },
  { before: "gakkou", after: "ikimasu", particle: "ni", hint: "I go to school" },
  { before: "watashi", after: "tomodachi", particle: "no", hint: "My friend" },
  { before: "resutoran", after: "sushi o tabemashita", particle: "de", hint: "I ate sushi at a restaurant" },
  { before: "hon", after: "yomimasu", particle: "o", hint: "I read a book" },
  { before: "tomodachi", after: "ikimasu", particle: "to", hint: "I go with a friend" },
];

// SENTENCE SCRAMBLE DATA — individual words, no labels
const SCRAMBLE_SENTENCES = [
  { en: "I eat sushi every day.", words: ["watashi", "wa", "mainichi", "sushi", "o", "tabemasu"] },
  { en: "Yesterday I drank coffee at a café.", words: ["kinou", "watashi", "wa", "kafe", "de", "koohii", "o", "nomimashita"] },
  { en: "My friend goes to school.", words: ["watashi", "no", "tomodachi", "wa", "gakkou", "ni", "ikimasu"] },
  { en: "I don't drink beer.", words: ["watashi", "wa", "biiru", "o", "nomimasen"] },
  { en: "Do you eat ramen?", words: ["raamen", "o", "tabemasu", "ka"] },
  { en: "Tomorrow I want to go to Tokyo.", words: ["ashita", "toukyou", "ni", "ikitai", "desu"] },
  { en: "I bought bread at the shop yesterday.", words: ["kinou", "mise", "de", "pan", "o", "kaimashita"] },
  { en: "Because it's delicious, I eat it every day.", words: ["oishii", "desu", "kara", "mainichi", "tabemasu"] },
  { en: "Please write your name here.", words: ["koko", "ni", "namae", "o", "kaite", "kudasai"] },
  { en: "I woke up and drank coffee.", words: ["okite", "koohii", "o", "nomimashita"] },
];

// CONVERSATION SIMULATOR DATA
const CONVO_SCENARIOS = [
  {
    title: "At a Restaurant",
    icon: "🍜",
    steps: [
      { speaker: "Staff", line: "irasshaimase! nanmei-sama desu ka?", en: "Welcome! How many people?",
        options: ["futari desu", "genki desu", "sumimasen"], correct: 0,
        responses: ["Please follow me!", "Um... how many people?", "Yes, can I help you?"] },
      { speaker: "Staff", line: "gochuumon wa?", en: "What would you like to order?",
        options: ["raamen o onegaishimasu", "gakkou ni ikimasu", "watashi wa tanaka desu"], correct: 0,
        responses: ["One ramen, coming up!", "This is a restaurant...", "Nice to meet you, but what do you want to eat?"] },
      { speaker: "Staff", line: "nani o nomimasu ka?", en: "What will you drink?",
        options: ["biiru o kudasai", "hon o yomimasu", "ashita ikimasu"], correct: 0,
        responses: ["One beer, certainly!", "You want to read a book here?", "Come back tomorrow?"] },
      { speaker: "Staff", line: "ijou de yoroshii desu ka?", en: "Will that be all?",
        options: ["hai, onegaishimasu", "iie, mizu mo kudasai", "tabemasu"], correct: 1,
        responses: ["I'll bring it right out.", "Water too, of course!", "...yes, you're here to eat."] },
    ]
  },
  {
    title: "Meeting Someone New",
    icon: "🤝",
    steps: [
      { speaker: "Person", line: "hajimemashite. tanaka desu.", en: "Nice to meet you. I'm Tanaka.",
        options: ["hajimemashite. watashi wa ___ desu.", "sayounara", "nani o tabemasu ka"], correct: 0,
        responses: ["Nice to meet you too!", "Goodbye already?!", "We just met and you want to eat?"] },
      { speaker: "Person", line: "dochira kara desu ka?", en: "Where are you from?",
        options: ["igirisu kara kimashita", "koohii o nomimasu", "gakkou ni ikimasu"], correct: 0,
        responses: ["Oh, England! Wonderful!", "Coffee? I asked where you're from.", "School? I asked where you're from."] },
      { speaker: "Person", line: "nihongo ga jouzu desu ne!", en: "Your Japanese is good!",
        options: ["arigatou gozaimasu! mada mada desu.", "tabemasu", "massugu itte kudasai"], correct: 0,
        responses: ["So humble! Keep it up!", "...eat?", "Go straight? We're having a conversation!"] },
    ]
  },
  {
    title: "Asking Directions",
    icon: "🗺️",
    steps: [
      { speaker: "You", line: "(You need to find the station)", en: "How do you get someone's attention?",
        options: ["sumimasen", "itadakimasu", "sayounara"], correct: 0,
        responses: ["Yes, how can I help?", "That's for before eating...", "Goodbye? But you need directions!"] },
      { speaker: "Person", line: "hai, nan desu ka?", en: "Yes, what is it?",
        options: ["eki wa doko desu ka", "sushi o tabemasu", "watashi wa genki desu"], correct: 0,
        responses: ["The station? Let me think...", "There's a restaurant down the street.", "Good for you, but did you need something?"] },
      { speaker: "Person", line: "massugu itte, migi ni magatte kudasai.", en: "Go straight and turn right.",
        options: ["arigatou gozaimasu!", "mou ichido onegaishimasu", "iie, kekkou desu"], correct: 0,
        responses: ["You're welcome! Good luck!", "Straight, then right.", "You don't want to know? But you asked!"] },
    ]
  },
];

// SPEED CONJUGATION DATA
const CONJUGATION_DRILLS = [
  { verb: "taberu", en: "eat", target: "polite present", answer: "tabemasu" },
  { verb: "taberu", en: "eat", target: "polite past", answer: "tabemashita" },
  { verb: "taberu", en: "eat", target: "polite negative", answer: "tabemasen" },
  { verb: "taberu", en: "eat", target: "te-form", answer: "tabete" },
  { verb: "taberu", en: "eat", target: "want to (-tai)", answer: "tabetai" },
  { verb: "taberu", en: "eat", target: "casual past", answer: "tabeta" },
  { verb: "nomu", en: "drink", target: "polite present", answer: "nomimasu" },
  { verb: "nomu", en: "drink", target: "polite past", answer: "nomimashita" },
  { verb: "nomu", en: "drink", target: "polite negative", answer: "nomimasen" },
  { verb: "nomu", en: "drink", target: "casual past", answer: "nonda" },
  { verb: "iku", en: "go", target: "polite present", answer: "ikimasu" },
  { verb: "iku", en: "go", target: "polite past", answer: "ikimashita" },
  { verb: "iku", en: "go", target: "polite negative", answer: "ikimasen" },
  { verb: "iku", en: "go", target: "want to (-tai)", answer: "ikitai" },
  { verb: "iku", en: "go", target: "casual past", answer: "itta" },
  { verb: "iku", en: "go", target: "casual negative", answer: "ikanai" },
  { verb: "miru", en: "see", target: "polite present", answer: "mimasu" },
  { verb: "miru", en: "see", target: "te-form", answer: "mite" },
  { verb: "kau", en: "buy", target: "polite past", answer: "kaimashita" },
  { verb: "kau", en: "buy", target: "te-form", answer: "katte" },
  { verb: "kaku", en: "write", target: "polite present", answer: "kakimasu" },
  { verb: "kaku", en: "write", target: "te-form", answer: "kaite" },
  { verb: "hanasu", en: "speak", target: "polite present", answer: "hanashimasu" },
  { verb: "hanasu", en: "speak", target: "te-form", answer: "hanashite" },
  { verb: "suru", en: "do", target: "polite present", answer: "shimasu" },
  { verb: "suru", en: "do", target: "casual past", answer: "shita" },
  { verb: "kuru", en: "come", target: "polite present", answer: "kimasu" },
  { verb: "kuru", en: "come", target: "casual past", answer: "kita" },
  { verb: "yomu", en: "read", target: "polite past", answer: "yomimashita" },
  { verb: "yomu", en: "read", target: "casual past", answer: "yonda" },
];

// PARTICLE SNIPER DATA — full sentences with multiple blanks
const PARTICLE_SNIPER_SENTENCES = [
  { words: ["watashi", "___", "kafe", "___", "koohii", "___", "nomimasu"], particles: ["wa", "de", "o"], en: "I drink coffee at a café." },
  { words: ["watashi", "___", "tomodachi", "___", "gakkou", "___", "ikimasu"], particles: ["no", "wa", "ni"], en: "My friend goes to school." },
  { words: ["kinou", "resutoran", "___", "sushi", "___", "tabemashita"], particles: ["de", "o"], en: "Yesterday I ate sushi at a restaurant." },
  { words: ["watashi", "___", "mainichi", "hon", "___", "yomimasu"], particles: ["wa", "o"], en: "I read a book every day." },
  { words: ["watashi", "___", "ashita", "toukyou", "___", "ikitai", "desu"], particles: ["wa", "ni"], en: "I want to go to Tokyo tomorrow." },
  { words: ["tomodachi", "___", "ie", "___", "terebi", "___", "mimashita"], particles: ["wa", "de", "o"], en: "My friend watched TV at home." },
  { words: ["tanaka-san", "___", "densha", "___", "kaisha", "___", "ikimasu"], particles: ["wa", "de", "ni"], en: "Tanaka goes to work by train." },
  { words: ["kono", "resutoran", "___", "koohii", "___", "oishii", "desu"], particles: ["no", "wa"], en: "This restaurant's coffee is delicious." },
];

// ============================================================
// STORAGE HELPERS
// ============================================================
const STORAGE_KEY = "japanese-learning-progress";

async function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROGRESS, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
}

async function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

const DEFAULT_PROGRESS = {
  completedLessons: [],
  quizScores: {},
  minigameScores: {},
  currentLesson: 1,
  totalXP: 0,
  streak: 0,
  lastActive: null,
  displayMode: "romaji",
  srsData: {},
};

// ============================================================
// COMPONENTS
// ============================================================

// Audio button
function AudioBtn({ text, size = 28 }) {
  const [playing, setPlaying] = useState(false);
  const play = (e) => { e.stopPropagation(); setPlaying(true); speakJapanese(text); setTimeout(() => setPlaying(false), 1500); };
  return (
    <button onClick={play} style={{
      background: playing ? "var(--accent)" + "30" : "transparent", border: "none", cursor: "pointer",
      padding: 4, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s", minWidth: size, minHeight: size,
    }} title="Listen to pronunciation">
      <span style={{ fontSize: size * 0.55, opacity: playing ? 1 : 0.6 }}>🔊</span>
    </button>
  );
}

// Display mode toggle
function DisplayModeToggle({ mode, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, background: "var(--card)", borderRadius: 10, padding: 2, border: "1px solid var(--border)" }}>
      {[{ key: "romaji", label: "Abc" }, { key: "both", label: "Both" }, { key: "kana", label: "あ" }].map(m => (
        <button key={m.key} onClick={() => onChange(m.key)} style={{
          padding: "5px 9px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 700,
          cursor: "pointer", transition: "all 0.15s",
          background: mode === m.key ? "var(--accent)" : "transparent",
          color: mode === m.key ? "#fff" : "var(--text-dim)",
        }}>{m.label}</button>
      ))}
    </div>
  );
}

// Grammar note (expandable)
function GrammarNote({ noteKey }) {
  const [expanded, setExpanded] = useState(false);
  const note = GRAMMAR_NOTES[noteKey];
  if (!note) return null;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 14, marginBottom: 16, border: "1px solid #2a2a4a", overflow: "hidden" }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: "100%", padding: "14px 18px", background: "none", border: "none",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "var(--text)", textAlign: "left",
      }}>
        <span style={{ fontSize: 18 }}>📖</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#a78bfa" }}>{note.title}</span>
        <span style={{ fontSize: 14, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </button>
      {expanded && (
        <div style={{ padding: "0 18px 18px", animation: "fadeIn 0.2s ease" }}>
          <p style={{ margin: "0 0 12px", lineHeight: 1.7, whiteSpace: "pre-line", color: "var(--text)", fontSize: 14 }}>{note.text}</p>
          <div style={{ padding: "10px 14px", borderRadius: 10, background: "#a78bfa18", border: "1px solid #a78bfa30" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa" }}>💡 Tip: </span>
            <span style={{ fontSize: 13, color: "var(--text)" }}>{note.tip}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Vocab Review (Spaced Repetition)
function VocabReview({ progress, onComplete }) {
  const [words] = useState(() => getVocabForReview(progress));
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  if (words.length === 0) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>All caught up!</h2>
      <p style={{ color: "var(--text-dim)" }}>Complete more lessons to unlock new vocabulary.</p>
    </div>
  );
  const handleAnswer = (correct) => {
    const w = words[current]; const newResults = [...results, { id: w.id, correct }];
    setResults(newResults);
    if (current < words.length - 1) { setCurrent(c => c + 1); setShowAnswer(false); }
    else { setFinished(true); onComplete(newResults, newResults.filter(r => r.correct).length); }
  };
  if (finished) {
    const totalCorrect = results.filter(r => r.correct).length;
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🧠</div>
        <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Review Complete!</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{totalCorrect}/{words.length} recalled correctly</p>
        <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{totalCorrect * 5} XP earned!</p>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 12 }}>Words you got wrong will appear sooner next time.</p>
      </div>
    );
  }
  const w = words[current];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{current + 1}/{words.length}</span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2 }}>
          <div style={{ width: `${((current + 1) / words.length) * 100}%`, height: "100%", background: "#a78bfa", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 11, color: "var(--text-dim)", padding: "3px 8px", background: "var(--card)", borderRadius: 6 }}>
          {w.srs.correct > 0 ? `${w.srs.correct}✓ ${w.srs.wrong}✗` : "New"}
        </span>
      </div>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 40, textAlign: "center", marginBottom: 20, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 8 }}>What is the Japanese for:</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent)", marginBottom: 20 }}>{w.en}</div>
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} style={{ ...btnPrimary, background: "#a78bfa", padding: "14px 32px", fontSize: 16 }}>Show Answer</button>
        ) : (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{w.r}</span>
              <AudioBtn text={w.jp} size={32} />
            </div>
            <div style={{ fontSize: 16, color: "var(--text-dim)" }}>{w.jp}</div>
          </div>
        )}
      </div>
      {showAnswer && (
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => handleAnswer(false)} style={{ flex: 1, padding: 16, borderRadius: 12, border: "2px solid #ef4444", background: "#ef444418", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#ef4444" }}>✗ Wrong</button>
          <button onClick={() => handleAnswer(true)} style={{ flex: 1, padding: 16, borderRadius: 12, border: "2px solid #22c55e", background: "#22c55e18", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#22c55e" }}>✓ Right</button>
        </div>
      )}
    </div>
  );
}

// Animated block component
function Block({ label, jp, romaji, animate = false, index = 0 }) {
  const color = BLOCK_COLORS[label.toLowerCase()] || "#999";
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      background: color + "18", border: `2px solid ${color}`,
      borderRadius: 12, padding: "8px 14px", margin: 4, minWidth: 70,
      animation: animate ? `slideUp 0.4s ease ${index * 0.1}s both` : "none",
      position: "relative",
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{romaji || jp}</span>
        {jp && <AudioBtn text={jp} size={20} />}
      </div>
      {romaji && <span style={{ fontSize: 11, color: "var(--text-dim)", fontStyle: "italic" }}>{jp}</span>}
    </div>
  );
}

// Lesson content renderer
function LessonContent({ lesson, onComplete, progress }) {
  const [step, setStep] = useState(0);
  const items = lesson.content;
  const item = items[step];
  const isLast = step === items.length - 1;

  const renderItem = (item) => {
    switch (item.type) {
      case "insight":
        return (
          <div style={{ background: "var(--card-alt)", borderRadius: 16, padding: 24, marginBottom: 16, borderLeft: "4px solid var(--accent)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18, color: "var(--accent)" }}>{item.title}</h3>
            <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-line", color: "var(--text)" }}>{item.text}</p>
          </div>
        );
      case "grammar-note":
        return <GrammarNote noteKey={item.noteKey} />;
      case "chart":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 16px", color: "var(--text)" }}>{item.title}</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {item.data.map((ch, i) => (
                <div key={i} onClick={() => speakJapanese(ch.h)} style={{
                  width: 72, height: 80, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", background: "var(--card-alt)",
                  borderRadius: 12, border: "2px solid var(--border)", cursor: "pointer",
                }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "var(--accent)" }}>{ch.r}</span>
                  <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{ch.h}</span>
                  <span style={{ fontSize: 9, opacity: 0.4 }}>🔊</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "block-intro":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 8px", color: "var(--text)" }}>{item.title}</h3>
            <p style={{ margin: "0 0 16px", color: "var(--text-dim)" }}>{item.text}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {item.blocks.map((b, i) => {
                const label = b.split(" ")[0].replace("は","").replace("で","").replace("を","") || b;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{
                      padding: "10px 16px", borderRadius: 10, fontWeight: 700, fontSize: 15,
                      background: Object.values(BLOCK_COLORS)[i] + "22",
                      border: `2px solid ${Object.values(BLOCK_COLORS)[i]}`,
                      color: Object.values(BLOCK_COLORS)[i],
                    }}>{b}</div>
                    {i < item.blocks.length - 1 && <span style={{ color: "var(--text-dim)", fontSize: 18 }}>→</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "example":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 4, fontWeight: 600 }}>EXAMPLE</div>
            <div style={{ fontSize: 17, color: "var(--text)", marginBottom: 16, fontStyle: "italic" }}>"{item.en}"</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
              {item.blocks.map((b, i) => (
                <Block key={i} label={b.label} jp={b.jp} romaji={b.r} animate={true} index={i} />
              ))}
            </div>
          </div>
        );
      case "particles":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 16px", color: "var(--text)" }}>The 5 Core Particles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {item.data.map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  background: p.color + "12", borderRadius: 12, border: `1px solid ${p.color}40`,
                  flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: p.color, minWidth: 40, textAlign: "center" }}>{p.r}</span>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 14 }}>{p.role} ({p.r})</div>
                    <div style={{ color: "var(--text-dim)", fontSize: 13 }}>{p.ex} = "{p.exEn}"</div>
                    <div style={{ color: p.color, fontSize: 12, marginTop: 2 }}>{p.bengali}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "verbs":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16, overflowX: "auto" }}>
            <h3 style={{ margin: "0 0 16px", color: "var(--text)" }}>10 Essential Verbs</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {item.data.slice(0, 5).map((v, i) => (
                <div key={i} onClick={() => speakJapanese(v.masu)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: "var(--card-alt)", borderRadius: 10, flexWrap: "wrap", cursor: "pointer",
                }}>
                  <span style={{ fontSize: 13, color: "var(--text-dim)", minWidth: 50 }}>{v.en}</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "var(--accent)", minWidth: 80 }}>{v.masu}</span>
                  <span style={{ fontSize: 14, color: BLOCK_COLORS.time, minWidth: 80 }}>→ {v.past}</span>
                  <span style={{ fontSize: 14, color: BLOCK_COLORS.who, minWidth: 80 }}>✗ {v.neg}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
              {item.data.slice(5).map((v, i) => (
                <div key={i} onClick={() => speakJapanese(v.masu)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: "var(--card-alt)", borderRadius: 10, flexWrap: "wrap", cursor: "pointer",
                }}>
                  <span style={{ fontSize: 13, color: "var(--text-dim)", minWidth: 50 }}>{v.en}</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "var(--accent)", minWidth: 80 }}>{v.masu}</span>
                  <span style={{ fontSize: 14, color: BLOCK_COLORS.time, minWidth: 80 }}>→ {v.past}</span>
                  <span style={{ fontSize: 14, color: BLOCK_COLORS.who, minWidth: 80 }}>✗ {v.neg}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "katakana":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 16px", color: "var(--text)" }}>Katakana = English in Disguise</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
              {item.data.map((w, i) => (
                <div key={i} onClick={() => speakJapanese(w.k)} style={{
                  padding: "12px", background: "var(--card-alt)", borderRadius: 10,
                  textAlign: "center", border: "1px solid var(--border)", cursor: "pointer",
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{w.en}</div>
                  <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 600 }}>{w.r}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{w.k}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "conversation":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 16px", color: "var(--text)" }}>💬 {item.title}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {item.lines.map((l, i) => (
                <div key={i} style={{
                  display: "flex", flexDirection: "column",
                  alignItems: l.speaker === "You" ? "flex-end" : "flex-start",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", marginBottom: 2 }}>{l.speaker}</span>
                  <div style={{
                    padding: "10px 16px", borderRadius: 14, maxWidth: "85%",
                    background: l.speaker === "You" ? "var(--accent)" + "22" : "var(--card-alt)",
                    border: `1px solid ${l.speaker === "You" ? "var(--accent)" : "var(--border)"}`,
                    cursor: "pointer",
                  }} onClick={() => speakJapanese(l.jp)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: "var(--text)", flex: 1 }}>{l.r}</div>
                      <span style={{ fontSize: 12, opacity: 0.5 }}>🔊</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{l.jp}</div>
                    <div style={{ fontSize: 13, color: "var(--text-dim)", fontStyle: "italic", marginTop: 2 }}>{l.en}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>
          {step + 1} / {items.length}
        </span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2 }}>
          <div style={{ width: `${((step + 1) / items.length) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>
      
      <div key={step} style={{ animation: "fadeIn 0.3s ease" }}>
        {renderItem(item)}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={btnSecondary}>← Back</button>
        )}
        <div style={{ flex: 1 }} />
        {!isLast ? (
          <button onClick={() => setStep(s => s + 1)} style={btnPrimary}>Continue →</button>
        ) : (
          <button onClick={onComplete} style={{ ...btnPrimary, background: "#22c55e" }}>
            ✓ Complete Lesson (+50 XP)
          </button>
        )}
      </div>
    </div>
  );
}

// Quiz component
function Quiz({ quiz, onComplete, bestScore }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const q = quiz.questions[current];

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      onComplete(score + (selected === q.correct ? 0 : 0));
    }
  };

  if (finished) {
    const total = quiz.questions.length;
    const finalScore = score;
    const pct = Math.round((finalScore / total) * 100);
    const passed = pct >= 70;
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>{passed ? "🎉" : "📚"}</div>
        <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>{passed ? "Great job!" : "Keep studying!"}</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 18, margin: "0 0 8px" }}>{finalScore}/{total} correct ({pct}%)</p>
        {bestScore !== undefined && <p style={{ color: "var(--text-dim)", fontSize: 14 }}>Personal best: {bestScore}/{total}</p>}
        <p style={{ color: passed ? "#22c55e" : "var(--accent)", fontWeight: 600, marginTop: 12 }}>
          {passed ? `+${finalScore * 10} XP earned!` : "Review the lesson and try again!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{current + 1}/{quiz.questions.length}</span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2 }}>
          <div style={{ width: `${((current + 1) / quiz.questions.length) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>🏆 {score}</span>
      </div>

      <h3 style={{ color: "var(--text)", margin: "0 0 20px", fontSize: 19, lineHeight: 1.4 }}>{q.q}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg = "var(--card-alt)";
          let border = "var(--border)";
          if (showResult) {
            if (i === q.correct) { bg = "#22c55e22"; border = "#22c55e"; }
            else if (i === selected && i !== q.correct) { bg = "#ef444422"; border = "#ef4444"; }
          } else if (i === selected) {
            bg = "var(--accent)" + "22"; border = "var(--accent)";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{
              padding: "14px 18px", borderRadius: 12, border: `2px solid ${border}`,
              background: bg, cursor: showResult ? "default" : "pointer", textAlign: "left",
              fontSize: 15, color: "var(--text)", fontWeight: 500, transition: "all 0.2s",
            }}>
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button onClick={handleNext} style={btnPrimary}>
            {current < quiz.questions.length - 1 ? "Next →" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

// Block Builder Minigame
function BlockBuilder({ onComplete }) {
  const [level, setLevel] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [available, setAvailable] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const sentences = BLOCK_BUILDER_SENTENCES;
  const current = sentences[level];

  useEffect(() => {
    if (current) {
      const all = [...current.blocks.map(b => ({ ...b, id: Math.random() }))];
      current.distractors.forEach(d => all.push({ jp: d, label: "?", id: Math.random(), distractor: true }));
      setAvailable(all.sort(() => Math.random() - 0.5));
      setPlaced([]);
      setShowResult(false);
    }
  }, [level]);

  const addBlock = (block) => {
    if (showResult) return;
    setPlaced(p => [...p, block]);
    setAvailable(a => a.filter(b => b.id !== block.id));
  };

  const removeBlock = (block) => {
    if (showResult) return;
    setAvailable(a => [...a, block]);
    setPlaced(p => p.filter(b => b.id !== block.id));
  };

  const checkAnswer = () => {
    const correct = placed.length === current.blocks.length &&
      placed.every((b, i) => b.jp === current.blocks[i].jp && !b.distractor);
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    if (level < sentences.length - 1) {
      setLevel(l => l + 1);
    } else {
      setFinished(true);
      onComplete(score);
    }
  };

  if (finished) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🏗️</div>
        <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Block Builder Complete!</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{score}/{sentences.length} sentences built correctly</p>
        <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{score * 15} XP earned!</p>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>Sentence {level + 1}/{sentences.length}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>🏆 {score}</span>
      </div>

      <div style={{ background: "var(--card-alt)", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Build this sentence:</span>
        <p style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", margin: "8px 0 0" }}>"{current.en}"</p>
      </div>

      <div style={{
        minHeight: 80, background: "var(--card)", borderRadius: 12, padding: 12,
        border: "2px dashed var(--border)", marginBottom: 16, display: "flex",
        flexWrap: "wrap", gap: 6, alignItems: "center",
        justifyContent: placed.length === 0 ? "center" : "flex-start",
      }}>
        {placed.length === 0 ? (
          <span style={{ color: "var(--text-dim)", fontSize: 14 }}>Tap blocks below to build the sentence →</span>
        ) : (
          placed.map((b, i) => (
            <button key={b.id} onClick={() => removeBlock(b)} style={{
              padding: "8px 14px", borderRadius: 10, border: `2px solid ${BLOCK_COLORS[b.label?.toLowerCase()] || "#666"}`,
              background: (BLOCK_COLORS[b.label?.toLowerCase()] || "#666") + "18",
              cursor: "pointer", fontSize: 17, color: "var(--text)", fontWeight: 600,
            }}>
              {b.jp}
            </button>
          ))
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {available.map(b => (
          <button key={b.id} onClick={() => addBlock(b)} style={{
            padding: "10px 16px", borderRadius: 10, border: "2px solid var(--border)",
            background: "var(--card-alt)", cursor: "pointer", fontSize: 17,
            color: "var(--text)", fontWeight: 500, transition: "all 0.15s",
          }}>
            {b.jp}
          </button>
        ))}
      </div>

      {showResult && (
        <div style={{
          padding: 16, borderRadius: 12, marginBottom: 16, textAlign: "center",
          background: isCorrect ? "#22c55e18" : "#ef444418",
          border: `2px solid ${isCorrect ? "#22c55e" : "#ef4444"}`,
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: isCorrect ? "#22c55e" : "#ef4444", margin: 0 }}>
            {isCorrect ? "✓ Perfect!" : "✗ Not quite!"}
          </p>
          {!isCorrect && (
            <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "8px 0 0" }}>
              Correct: {current.blocks.map(b => b.jp).join(" ")}
            </p>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        {!showResult ? (
          <button onClick={checkAnswer} disabled={placed.length === 0}
            style={{ ...btnPrimary, opacity: placed.length === 0 ? 0.4 : 1, flex: 1 }}>
            Check Answer
          </button>
        ) : (
          <button onClick={next} style={{ ...btnPrimary, flex: 1 }}>
            {level < sentences.length - 1 ? "Next Sentence →" : "See Results"}
          </button>
        )}
      </div>
    </div>
  );
}

// Particle Fill Minigame
function ParticleFill({ onComplete }) {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const particles = ["wa", "o", "no", "ni", "de", "to"];
  const items = PARTICLE_FILL_SENTENCES;
  const current = items[level];

  const handleSelect = (p) => {
    if (showResult) return;
    setSelected(p);
    setShowResult(true);
    if (p === current.particle) setScore(s => s + 1);
  };

  const next = () => {
    if (level < items.length - 1) {
      setLevel(l => l + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      onComplete(score);
    }
  };

  if (finished) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🧩</div>
        <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Particle Fill Complete!</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{score}/{items.length} correct</p>
        <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{score * 12} XP earned!</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{level + 1}/{items.length}</span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2 }}>
          <div style={{ width: `${((level + 1) / items.length) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>🏆 {score}</span>
      </div>

      <div style={{ background: "var(--card-alt)", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Fill in the correct particle:</span>
        <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "4px 0 0", fontStyle: "italic" }}>({current.hint})</p>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: 20, background: "var(--card)", borderRadius: 12, marginBottom: 20, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: "var(--text)" }}>{current.before}</span>
        <span style={{
          fontSize: 24, fontWeight: 800, minWidth: 40, textAlign: "center", padding: "4px 12px",
          borderRadius: 8, border: `2px dashed ${showResult ? (selected === current.particle ? "#22c55e" : "#ef4444") : "var(--accent)"}`,
          color: showResult ? (selected === current.particle ? "#22c55e" : "#ef4444") : "var(--accent)",
          background: showResult ? (selected === current.particle ? "#22c55e18" : "#ef444418") : "var(--accent)" + "12",
        }}>
          {selected || "?"}
        </span>
        <span style={{ fontSize: 22, fontWeight: 600, color: "var(--text)" }}>{current.after}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        {particles.map(p => {
          const pData = PARTICLES_DATA.find(pd => pd.r === p);
          const color = pData?.color || "var(--accent)";
          let bg = color + "12";
          let borderC = color + "60";
          if (showResult && p === current.particle) { bg = "#22c55e22"; borderC = "#22c55e"; }
          else if (showResult && p === selected && p !== current.particle) { bg = "#ef444422"; borderC = "#ef4444"; }
          return (
            <button key={p} onClick={() => handleSelect(p)} style={{
              minWidth: 56, height: 56, borderRadius: 12, border: `2px solid ${borderC}`,
              background: bg, cursor: showResult ? "default" : "pointer",
              fontSize: 20, fontWeight: 700, color: "var(--text)", display: "flex",
              alignItems: "center", justifyContent: "center", padding: "0 14px",
            }}>
              {p}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div style={{ textAlign: "center" }}>
          {selected !== current.particle && (
            <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 12 }}>
              The correct particle is <strong>{current.particle}</strong> ({PARTICLES_DATA.find(p => p.r === current.particle)?.role})
            </p>
          )}
          <button onClick={next} style={btnPrimary}>
            {level < items.length - 1 ? "Next →" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

// Vocab Speed Minigame — shows English, type the romaji
function HiraganaMatch({ onComplete }) {
  const vocabPool = [
    { en: "eat (polite)", r: "tabemasu" },
    { en: "drink (polite)", r: "nomimasu" },
    { en: "go (polite)", r: "ikimasu" },
    { en: "come (polite)", r: "kimasu" },
    { en: "see (polite)", r: "mimasu" },
    { en: "do (polite)", r: "shimasu" },
    { en: "buy (polite)", r: "kaimasu" },
    { en: "read (polite)", r: "yomimasu" },
    { en: "yesterday", r: "kinou" },
    { en: "tomorrow", r: "ashita" },
    { en: "today", r: "kyou" },
    { en: "every day", r: "mainichi" },
    { en: "coffee", r: "koohii" },
    { en: "restaurant", r: "resutoran" },
    { en: "school", r: "gakkou" },
    { en: "friend", r: "tomodachi" },
    { en: "book", r: "hon" },
    { en: "I / me", r: "watashi" },
    { en: "sushi", r: "sushi" },
    { en: "house / home", r: "ie" },
  ];
  const [words] = useState(() => {
    return [...vocabPool].sort(() => Math.random() - 0.5).slice(0, 10);
  });
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !finished) inputRef.current.focus();
  }, [current, finished]);

  const check = () => {
    const correct = input.trim().toLowerCase() === words[current].r;
    setShowResult(true);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current < words.length - 1) {
        setCurrent(c => c + 1);
        setInput("");
        setShowResult(false);
      } else {
        setFinished(true);
        onComplete(score + (correct ? 1 : 0));
      }
    }, 1200);
  };

  if (finished) {
    const time = Math.round((Date.now() - startTime) / 1000);
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>⚡</div>
        <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Vocab Speed Complete!</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{score}/{words.length} correct in {time}s</p>
        <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{score * 8} XP earned!</p>
      </div>
    );
  }

  const w = words[current];

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{current + 1}/{words.length}</span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2 }}>
          <div style={{ width: `${((current + 1) / words.length) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>🏆 {score}</span>
      </div>

      <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 8 }}>Type the Japanese (romaji) for:</p>

      <div style={{
        fontSize: 36, fontWeight: 700, color: "var(--accent)", marginBottom: 24,
        animation: "fadeIn 0.3s ease",
      }}>
        {w.en}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && input) check(); }}
          style={{
            padding: "12px 20px", fontSize: 20, borderRadius: 12, border: `2px solid ${showResult ? (input.trim().toLowerCase() === w.r ? "#22c55e" : "#ef4444") : "var(--border)"}`,
            background: "var(--card)", color: "var(--text)", textAlign: "center", width: 200,
            outline: "none",
          }}
          placeholder="type romaji..."
          disabled={showResult}
        />
        <button onClick={check} disabled={!input || showResult} style={{ ...btnPrimary, opacity: (!input || showResult) ? 0.4 : 1 }}>Go</button>
      </div>

      {showResult && input.trim().toLowerCase() !== w.r && (
        <p style={{ color: "#ef4444", fontSize: 14, marginTop: 12 }}>It's <strong>{w.r}</strong></p>
      )}
      {showResult && input.trim().toLowerCase() === w.r && (
        <p style={{ color: "#22c55e", fontSize: 14, marginTop: 12 }}>✓ Correct!</p>
      )}
    </div>
  );
}


// Sentence Scramble Minigame
function SentenceScramble({ onComplete }) {
  const [level, setLevel] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [available, setAvailable] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
  const items = useState(() => [...SCRAMBLE_SENTENCES].sort(() => Math.random() - 0.5).slice(0, 7))[0];
  const current = items[level];

  useEffect(() => {
    if (current) {
      const shuffled = current.words.map((w, i) => ({ word: w, id: i + Math.random() }));
      setAvailable(shuffled.sort(() => Math.random() - 0.5));
      setPlaced([]);
      setShowResult(false);
    }
  }, [level]);

  const add = (item) => { if (showResult) return; setPlaced(p => [...p, item]); setAvailable(a => a.filter(x => x.id !== item.id)); };
  const remove = (item) => { if (showResult) return; setAvailable(a => [...a, item]); setPlaced(p => p.filter(x => x.id !== item.id)); };

  const check = () => {
    const correct = placed.map(p => p.word).join(" ") === current.words.join(" ");
    setIsCorrect(correct); setShowResult(true);
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    if (level < items.length - 1) setLevel(l => l + 1);
    else { setFinished(true); onComplete(score); }
  };

  if (finished) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🔀</div>
      <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Scramble Complete!</h2>
      <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{score}/{items.length} sentences correct</p>
      <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{score * 20} XP earned!</p>
    </div>
  );
  if (!current) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{level + 1}/{items.length}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>🏆 {score}</span>
      </div>
      <div style={{ background: "var(--card-alt)", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Unscramble this sentence:</span>
        <p style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", margin: "8px 0 0" }}>"{current.en}"</p>
      </div>
      <div style={{
        minHeight: 60, background: "var(--card)", borderRadius: 12, padding: 12,
        border: "2px dashed var(--border)", marginBottom: 16, display: "flex",
        flexWrap: "wrap", gap: 6, alignItems: "center",
        justifyContent: placed.length === 0 ? "center" : "flex-start",
      }}>
        {placed.length === 0 ? (
          <span style={{ color: "var(--text-dim)", fontSize: 14 }}>Tap words in the right order →</span>
        ) : placed.map((b) => (
          <button key={b.id} onClick={() => remove(b)} style={{
            padding: "8px 14px", borderRadius: 10, border: "2px solid var(--accent)",
            background: "var(--accent)" + "18", cursor: "pointer", fontSize: 17, color: "var(--text)", fontWeight: 600,
          }}>{b.word}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {available.map(b => (
          <button key={b.id} onClick={() => add(b)} style={{
            padding: "10px 16px", borderRadius: 10, border: "2px solid var(--border)",
            background: "var(--card-alt)", cursor: "pointer", fontSize: 17, color: "var(--text)", fontWeight: 500,
          }}>{b.word}</button>
        ))}
      </div>
      {showResult && (
        <div style={{
          padding: 16, borderRadius: 12, marginBottom: 16, textAlign: "center",
          background: isCorrect ? "#22c55e18" : "#ef444418", border: `2px solid ${isCorrect ? "#22c55e" : "#ef4444"}`,
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: isCorrect ? "#22c55e" : "#ef4444", margin: 0 }}>
            {isCorrect ? "✓ Perfect!" : "✗ Not quite!"}
          </p>
          {!isCorrect && <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "8px 0 0" }}>Correct: {current.words.join(" ")}</p>}
          <button onClick={() => speakJapanese(current.words.join(" "))} style={{
            marginTop: 12, padding: "10px 20px", borderRadius: 10, border: "1px solid var(--accent)",
            background: "var(--accent)" + "18", cursor: "pointer", fontSize: 14, fontWeight: 600,
            color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 8,
          }}>🔊 Listen to sentence</button>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        {!showResult ? (
          <button onClick={check} disabled={placed.length === 0} style={{ ...btnPrimary, opacity: placed.length === 0 ? 0.4 : 1, flex: 1 }}>Check Answer</button>
        ) : (
          <button onClick={next} style={{ ...btnPrimary, flex: 1 }}>{level < items.length - 1 ? "Next →" : "See Results"}</button>
        )}
      </div>
    </div>
  );
}

// Conversation Simulator Minigame
function ConvoSim({ onComplete }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [finished, setFinished] = useState(false);
  const scenarios = CONVO_SCENARIOS;
  const scenario = scenarios[scenarioIdx];
  const step = scenario?.steps[stepIdx];

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === step.correct;
    if (correct) setScore(s => s + 1);
    setChatLog(log => [
      ...log,
      { speaker: step.speaker !== "You" ? step.speaker : step.speaker, text: step.line, en: step.en, isNpc: step.speaker !== "You" },
      { speaker: "You", text: step.options[idx], isNpc: false, correct },
      { speaker: step.speaker !== "You" ? step.speaker : "Response", text: step.responses[idx], isNpc: true, isResponse: true },
    ]);
  };

  const next = () => {
    if (stepIdx < scenario.steps.length - 1) {
      setStepIdx(s => s + 1); setSelected(null); setShowResult(false);
    } else if (scenarioIdx < scenarios.length - 1) {
      setScenarioIdx(s => s + 1); setStepIdx(0); setSelected(null); setShowResult(false); setChatLog([]);
    } else {
      setFinished(true); onComplete(score);
    }
  };

  if (finished) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>💬</div>
      <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Conversations Complete!</h2>
      <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{score} correct responses across {scenarios.length} scenarios</p>
      <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{score * 15} XP earned!</p>
    </div>
  );

  if (!step) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{scenario.icon} {scenario.title}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Scenario {scenarioIdx + 1}/{scenarios.length}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", marginLeft: 8 }}>🏆 {score}</span>
      </div>

      {/* Chat log */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
        {chatLog.map((msg, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column",
            alignItems: msg.isNpc ? "flex-start" : "flex-end",
          }}>
            <div style={{
              padding: "8px 14px", borderRadius: 12, maxWidth: "80%", fontSize: 14,
              background: msg.isResponse ? "var(--card-alt)" : msg.isNpc ? "var(--card)" : (msg.correct !== false ? "var(--accent)" + "22" : "#ef444422"),
              border: `1px solid ${msg.isResponse ? "var(--border)" : msg.isNpc ? "var(--border)" : (msg.correct !== false ? "var(--accent)" : "#ef4444")}`,
              color: "var(--text)", fontStyle: msg.isResponse ? "italic" : "normal",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Current prompt */}
      <div style={{ background: "var(--card)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>{step.speaker === "You" ? "Situation:" : step.speaker + " says:"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", flex: 1 }}>{step.line}</div>
          {step.speaker !== "You" && <span onClick={() => speakJapanese(step.line.replace(/[()]/g, ""))} style={{ cursor: "pointer", fontSize: 16, opacity: 0.6 }}>🔊</span>}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", fontStyle: "italic", marginTop: 4 }}>{step.en}</div>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {step.options.map((opt, i) => {
          let bg = "var(--card-alt)"; let border = "var(--border)";
          if (showResult) {
            if (i === step.correct) { bg = "#22c55e22"; border = "#22c55e"; }
            else if (i === selected && i !== step.correct) { bg = "#ef444422"; border = "#ef4444"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{
              padding: "14px 18px", borderRadius: 12, border: `2px solid ${border}`,
              background: bg, cursor: showResult ? "default" : "pointer", textAlign: "left",
              fontSize: 16, color: "var(--text)", fontWeight: 600,
            }}>{opt}</button>
          );
        })}
      </div>

      {showResult && (
        <div style={{ textAlign: "center" }}>
          <button onClick={next} style={btnPrimary}>{
            stepIdx < scenario.steps.length - 1 ? "Next Line →" :
            scenarioIdx < scenarios.length - 1 ? "Next Scenario →" : "See Results"
          }</button>
        </div>
      )}
    </div>
  );
}

// Speed Conjugation Minigame
function SpeedConjugation({ onComplete }) {
  const [drills] = useState(() => [...CONJUGATION_DRILLS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const inputRef = useRef(null);

  useEffect(() => { if (inputRef.current && !finished) inputRef.current.focus(); }, [current, finished]);

  const check = () => {
    const correct = input.trim().toLowerCase() === drills[current].answer;
    setShowResult(true);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current < drills.length - 1) { setCurrent(c => c + 1); setInput(""); setShowResult(false); }
      else { setFinished(true); onComplete(score + (correct ? 1 : 0)); }
    }, 1500);
  };

  if (finished) {
    const time = Math.round((Date.now() - startTime) / 1000);
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>⚔️</div>
        <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Speed Conjugation Complete!</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{score}/{drills.length} correct in {time}s</p>
        <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{score * 12} XP earned!</p>
      </div>
    );
  }

  const d = drills[current];
  const isCorrect = showResult && input.trim().toLowerCase() === d.answer;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{current + 1}/{drills.length}</span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2 }}>
          <div style={{ width: `${((current + 1) / drills.length) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>🏆 {score}</span>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 8 }}>Conjugate:</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>{d.verb}</div>
        <div style={{ fontSize: 14, color: "var(--text-dim)" }}>({d.en})</div>
        <div style={{
          display: "inline-block", marginTop: 12, padding: "8px 20px", borderRadius: 20,
          background: "#f59e0b22", border: "1px solid #f59e0b40", color: "#f59e0b", fontSize: 15, fontWeight: 700,
        }}>→ {d.target}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && input) check(); }}
          style={{
            padding: "12px 20px", fontSize: 20, borderRadius: 12,
            border: `2px solid ${showResult ? (isCorrect ? "#22c55e" : "#ef4444") : "var(--border)"}`,
            background: "var(--card)", color: "var(--text)", textAlign: "center", width: 220, outline: "none",
          }}
          placeholder="type answer..."
          disabled={showResult}
        />
        <button onClick={check} disabled={!input || showResult} style={{ ...btnPrimary, opacity: (!input || showResult) ? 0.4 : 1 }}>Go</button>
      </div>

      {showResult && !isCorrect && <p style={{ color: "#ef4444", fontSize: 14, marginTop: 12 }}>It's <strong>{d.answer}</strong></p>}
      {showResult && isCorrect && <p style={{ color: "#22c55e", fontSize: 14, marginTop: 12 }}>✓ Correct!</p>}
    </div>
  );
}

// Particle Sniper Minigame
function ParticleSniper({ onComplete }) {
  const [level, setLevel] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentBlank, setCurrentBlank] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const items = useState(() => [...PARTICLE_SNIPER_SENTENCES].sort(() => Math.random() - 0.5).slice(0, 6))[0];
  const current = items[level];
  const allParticles = ["wa", "o", "no", "ni", "de", "to", "ka", "mo"];

  useEffect(() => { setAnswers([]); setCurrentBlank(0); setShowResult(false); }, [level]);

  const handleSelect = (p) => {
    if (showResult) return;
    const newAnswers = [...answers, p];
    setAnswers(newAnswers);
    if (newAnswers.length >= current.particles.length) {
      setShowResult(true);
      const correct = newAnswers.every((a, i) => a === current.particles[i]);
      if (correct) setScore(s => s + 1);
    } else {
      setCurrentBlank(b => b + 1);
    }
  };

  const isAllCorrect = showResult && answers.every((a, i) => a === current.particles[i]);

  const next = () => {
    if (level < items.length - 1) setLevel(l => l + 1);
    else { setFinished(true); onComplete(score + (isAllCorrect ? 0 : 0)); }
  };

  if (finished) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🎯</div>
      <h2 style={{ color: "var(--text)", margin: "0 0 8px" }}>Particle Sniper Complete!</h2>
      <p style={{ color: "var(--text-dim)", fontSize: 18 }}>{score}/{items.length} sentences correct</p>
      <p style={{ color: "#22c55e", fontWeight: 600, marginTop: 8 }}>+{score * 18} XP earned!</p>
    </div>
  );
  if (!current) return null;

  // Build display with blanks filled
  let blankIdx = 0;
  const display = current.words.map((w, i) => {
    if (w === "___") {
      const thisBlank = blankIdx;
      blankIdx++;
      const filled = answers[thisBlank];
      const isActive = thisBlank === currentBlank && !showResult;
      const isCorrectBlank = showResult && filled === current.particles[thisBlank];
      const isWrongBlank = showResult && filled && filled !== current.particles[thisBlank];
      return (
        <span key={i} style={{
          display: "inline-block", minWidth: 40, textAlign: "center", padding: "4px 10px",
          margin: "0 2px", borderRadius: 8, fontSize: 20, fontWeight: 700,
          border: `2px ${isActive ? "dashed" : "solid"} ${isCorrectBlank ? "#22c55e" : isWrongBlank ? "#ef4444" : isActive ? "var(--accent)" : "var(--border)"}`,
          background: isCorrectBlank ? "#22c55e18" : isWrongBlank ? "#ef444418" : isActive ? "var(--accent)" + "12" : "var(--card)",
          color: isCorrectBlank ? "#22c55e" : isWrongBlank ? "#ef4444" : filled ? "var(--text)" : "var(--accent)",
        }}>
          {filled || (isActive ? "?" : "·")}
        </span>
      );
    }
    return <span key={i} style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 2px" }}>{w}</span>;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{level + 1}/{items.length}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>🏆 {score}</span>
      </div>

      <div style={{ background: "var(--card-alt)", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Fill ALL the particles:</span>
        <p style={{ fontSize: 15, color: "var(--text-dim)", margin: "4px 0 0", fontStyle: "italic" }}>{current.en}</p>
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
        gap: 4, padding: 20, background: "var(--card)", borderRadius: 12, marginBottom: 20, lineHeight: 2.2,
      }}>
        {display}
      </div>

      {!showResult && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 20 }}>
          {allParticles.map(p => {
            const pData = PARTICLES_DATA.find(pd => pd.r === p);
            const color = pData?.color || "var(--accent)";
            return (
              <button key={p} onClick={() => handleSelect(p)} style={{
                minWidth: 52, height: 52, borderRadius: 12, border: `2px solid ${color}60`,
                background: color + "12", cursor: "pointer", fontSize: 18, fontWeight: 700, color: "var(--text)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{p}</button>
            );
          })}
        </div>
      )}

      {showResult && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            padding: 16, borderRadius: 12, marginBottom: 16,
            background: isAllCorrect ? "#22c55e18" : "#ef444418",
            border: `2px solid ${isAllCorrect ? "#22c55e" : "#ef4444"}`,
          }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: isAllCorrect ? "#22c55e" : "#ef4444", margin: 0 }}>
              {isAllCorrect ? "✓ All particles correct!" : "✗ Not quite!"}
            </p>
            {!isAllCorrect && <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "8px 0 0" }}>Correct: {current.particles.join(", ")}</p>}
          </div>
          <button onClick={next} style={btnPrimary}>{level < items.length - 1 ? "Next →" : "See Results"}</button>
        </div>
      )}
    </div>
  );
}


// ============================================================
// STYLES
// ============================================================
const btnPrimary = {
  padding: "12px 24px", borderRadius: 12, border: "none",
  background: "var(--accent)", color: "#fff", fontSize: 15,
  fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
};

const btnSecondary = {
  padding: "12px 24px", borderRadius: 12, border: "2px solid var(--border)",
  background: "transparent", color: "var(--text)", fontSize: 15,
  fontWeight: 600, cursor: "pointer",
};

// ============================================================
// MAIN APP
// ============================================================
export default function JapaneseLearningApp() {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("home"); // home, lesson, quiz, minigame, review
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeMinigame, setActiveMinigame] = useState(null);
  const [sessionKey, setSessionKey] = useState(0); // stable key for quiz/minigame instances
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved", "error"
  const saveTimeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // Load progress on mount
  useEffect(() => {
    (async () => {
      const saved = await loadProgress();
      if (saved) {
        setProgress(saved);
      }
      hasLoadedRef.current = true;
      setLoaded(true);
    })();
  }, []);

  // Save progress whenever it changes — but ONLY after initial load is done
  useEffect(() => {
    if (!loaded || !hasLoadedRef.current) return;
    
    // Debounce saves to avoid hammering storage
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setSaveStatus("saving");
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveProgress(progress);
        setSaveStatus("saved");
        // Clear "saved" indicator after 2s
        setTimeout(() => setSaveStatus(""), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 300);
    
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [progress, loaded]);

  const updateProgress = useCallback((updater) => {
    setProgress(p => {
      const updated = typeof updater === "function" ? updater(p) : { ...p, ...updater };
      return updated;
    });
  }, []);

  const completeLesson = (lessonId) => {
    updateProgress(p => ({
      ...p,
      completedLessons: p.completedLessons.includes(lessonId) ? p.completedLessons : [...p.completedLessons, lessonId],
      totalXP: p.totalXP + (p.completedLessons.includes(lessonId) ? 0 : 50),
      currentLesson: Math.max(p.currentLesson, lessonId + 1),
      lastActive: new Date().toISOString(),
    }));
    // Check if there's a quiz after this lesson
    const quiz = QUIZZES.find(q => q.afterLesson === lessonId);
    if (quiz) {
      setSessionKey(k => k + 1);
      setActiveQuiz(quiz);
      setView("quiz");
    } else {
      setView("home");
    }
  };

  const completeQuiz = (quizAfterLesson, score) => {
    const total = QUIZZES.find(q => q.afterLesson === quizAfterLesson)?.questions.length || 0;
    const xp = score * 10;
    updateProgress(p => ({
      ...p,
      quizScores: { ...p.quizScores, [quizAfterLesson]: Math.max(p.quizScores[quizAfterLesson] || 0, score) },
      totalXP: p.totalXP + xp,
      lastActive: new Date().toISOString(),
    }));
  };

  const completeMinigame = (name, score) => {
    const xpMap = { blocks: 15, particles: 12, hiragana: 8, scramble: 20, convo: 15, conjugation: 12, sniper: 18 };
    const xp = score * (xpMap[name] || 10);
    updateProgress(p => ({
      ...p,
      minigameScores: { ...p.minigameScores, [name]: Math.max(p.minigameScores[name] || 0, score) },
      totalXP: p.totalXP + xp,
      lastActive: new Date().toISOString(),
    }));
  };

  const completeReview = (results, totalCorrect) => {
    updateProgress(p => {
      const newSRS = { ...(p.srsData || {}) };
      results.forEach(r => { newSRS[r.id] = updateSRS(newSRS, r.id, r.correct); });
      return { ...p, srsData: newSRS, totalXP: p.totalXP + totalCorrect * 5, lastActive: new Date().toISOString() };
    });
  };

  const changeDisplayMode = (mode) => {
    updateProgress(p => ({ ...p, displayMode: mode }));
  };

  const resetProgress = async () => {
    if (!window.confirm("Reset all progress? This cannot be undone.")) return;
    const fresh = { ...DEFAULT_PROGRESS };
    setProgress(fresh);
    try { 
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {}
  };

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{ color: "var(--text-dim)", fontSize: 18 }}>Loading...</div>
      </div>
    );
  }

  const phases = [
    { name: "Foundation", weeks: "1–4", lessons: LESSONS.filter(l => l.phase === 1) },
    { name: "Expanding", weeks: "5–8", lessons: LESSONS.filter(l => l.phase === 2) },
    { name: "Real World", weeks: "9–12+", lessons: LESSONS.filter(l => l.phase === 3) },
  ];

  const minigames = [
    { id: "blocks", name: "Block Builder", icon: "🏗️", desc: "Arrange blocks to build sentences", minLesson: 1 },
    { id: "particles", name: "Particle Fill", icon: "🧩", desc: "Choose the right particle", minLesson: 2 },
    { id: "hiragana", name: "Vocab Speed", icon: "⚡", desc: "Type the romaji as fast as you can", minLesson: 1 },
    { id: "scramble", name: "Scramble", icon: "🔀", desc: "Put the words in the right order", minLesson: 3 },
    { id: "convo", name: "Convo Sim", icon: "💬", desc: "Survive real-world conversations", minLesson: 4 },
    { id: "conjugation", name: "Conjugation", icon: "⚔️", desc: "Conjugate verbs at speed", minLesson: 3 },
    { id: "sniper", name: "Particle Sniper", icon: "🎯", desc: "Fill ALL the particles in a sentence", minLesson: 5 },
  ];

  return (
    <div style={{
      "--bg": "#0a0a0f",
      "--card": "#13131a",
      "--card-alt": "#1a1a24",
      "--border": "#2a2a3a",
      "--text": "#e8e8ef",
      "--text-dim": "#7a7a8f",
      "--accent": "#6366f1",
      "--accent-glow": "#6366f140",
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      fontFamily: "'DM Sans', 'Noto Sans JP', -apple-system, sans-serif",
      maxWidth: 680,
      margin: "0 auto",
      padding: "0 16px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        button:hover { filter: brightness(1.1); }
        input { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
      `}</style>

      {/* HEADER */}
      <div style={{
        padding: "20px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "var(--bg)", zIndex: 10,
        borderBottom: view !== "home" ? "1px solid var(--border)" : "none",
      }}>
        {view !== "home" ? (
          <button onClick={() => setView("home")} style={{
            background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer",
            fontSize: 14, fontWeight: 600, padding: "8px 0", display: "flex", alignItems: "center", gap: 6,
          }}>
            ← Back
          </button>
        ) : (
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              <span style={{ color: "var(--accent)" }}>日本語</span> Journey
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-dim)" }}>Block-based Japanese for trilingual minds</p>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {view === "home" && <DisplayModeToggle mode={progress.displayMode || "romaji"} onChange={changeDisplayMode} />}
          {saveStatus && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 8,
              color: saveStatus === "saved" ? "#22c55e" : saveStatus === "error" ? "#ef4444" : "var(--text-dim)",
              background: saveStatus === "saved" ? "#22c55e12" : saveStatus === "error" ? "#ef444412" : "var(--card)",
              transition: "all 0.3s",
            }}>
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "✓ Saved" : "Save error"}
            </span>
          )}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: "6px 14px", fontSize: 14, fontWeight: 700 }}>
            ⚡ {progress.totalXP} XP
          </div>
        </div>
      </div>

      {/* HOME VIEW */}
      {view === "home" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {/* Progress overview */}
          <div style={{
            background: "linear-gradient(135deg, #6366f120, #8b5cf620)", borderRadius: 16,
            padding: 20, marginTop: 16, marginBottom: 24, border: "1px solid var(--accent)" + "30",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Overall Progress</span>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
                {progress.completedLessons.length}/{LESSONS.length} lessons
              </span>
            </div>
            <div style={{ height: 8, background: "var(--border)", borderRadius: 4 }}>
              <div style={{
                width: `${(progress.completedLessons.length / LESSONS.length) * 100}%`,
                height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                borderRadius: 4, transition: "width 0.5s ease",
              }} />
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>{progress.completedLessons.length}</span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 4 }}>lessons done</span>
              </div>
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}>{Object.keys(progress.quizScores).length}</span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 4 }}>quizzes passed</span>
              </div>
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#a78bfa" }}>{ALL_VOCAB.filter(v => progress.completedLessons.includes(v.lesson)).length}</span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 4 }}>words</span>
              </div>
            </div>
          </div>

          {/* Vocab Review (SRS) */}
          {progress.completedLessons.length > 0 && (
            <button onClick={() => { setSessionKey(k => k + 1); setView("review"); }} style={{
              width: "100%", padding: "18px 20px", borderRadius: 14,
              background: "linear-gradient(135deg, #a78bfa20, #8b5cf620)",
              border: "1px solid #a78bfa40", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 14, marginBottom: 24,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "#a78bfa22" }}>🧠</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Vocab Review</div>
                <div style={{ fontSize: 12, color: "#a78bfa" }}>Spaced repetition — words you struggle with appear more often</div>
              </div>
              <span style={{ fontSize: 20, animation: "pulse 2s ease infinite" }}>→</span>
            </button>
          )}

          {/* Lessons by phase */}
          {phases.map((phase, pi) => (
            <div key={pi} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--text)" }}>Phase {pi + 1}: {phase.name}</h2>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Weeks {phase.weeks}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {phase.lessons.map((lesson, i) => {
                  const completed = progress.completedLessons.includes(lesson.id);
                  const locked = lesson.id > progress.currentLesson;
                  const quiz = QUIZZES.find(q => q.afterLesson === lesson.id);
                  const quizScore = quiz ? progress.quizScores[lesson.id] : null;

                  return (
                    <div key={lesson.id}>
                      <button
                        onClick={() => {
                          if (!locked) { setActiveLesson(lesson); setView("lesson"); }
                        }}
                        style={{
                          width: "100%", padding: "16px 18px", borderRadius: 14,
                          border: `1px solid ${completed ? "#22c55e40" : locked ? "var(--border)" : "var(--accent)" + "40"}`,
                          background: completed ? "#22c55e08" : locked ? "var(--card)" : "var(--card)",
                          cursor: locked ? "not-allowed" : "pointer",
                          textAlign: "left", display: "flex", alignItems: "center", gap: 14,
                          opacity: locked ? 0.4 : 1, transition: "all 0.15s",
                        }}
                      >
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 18, fontWeight: 800, flexShrink: 0,
                          background: completed ? "#22c55e22" : "var(--accent)" + "18",
                          color: completed ? "#22c55e" : "var(--accent)",
                        }}>
                          {completed ? "✓" : lesson.id}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{lesson.title}</div>
                          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{lesson.subtitle}</div>
                        </div>
                        {locked && <span style={{ fontSize: 18 }}>🔒</span>}
                      </button>
                      {quiz && completed && (
                        <button
                          onClick={() => { setSessionKey(k => k + 1); setActiveQuiz(quiz); setView("quiz"); }}
                          style={{
                            width: "calc(100% - 32px)", marginLeft: 32, padding: "10px 16px",
                            borderRadius: 10, border: `1px solid ${quizScore != null ? "#22c55e40" : "#f59e0b40"}`,
                            background: quizScore != null ? "#22c55e08" : "#f59e0b08",
                            cursor: "pointer", textAlign: "left", display: "flex",
                            alignItems: "center", gap: 10, marginTop: 4,
                          }}
                        >
                          <span style={{ fontSize: 16 }}>📝</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", flex: 1 }}>
                            Quiz: {quiz.title}
                          </span>
                          {quizScore != null && (
                            <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>
                              Best: {quizScore}/{quiz.questions.length}
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Minigames */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 17, fontWeight: 800, color: "var(--text)" }}>🎮 Practice Games</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {minigames.map(mg => {
                const unlocked = progress.completedLessons.length >= mg.minLesson;
                return (
                  <button
                    key={mg.id}
                    onClick={() => { if (unlocked) { setSessionKey(k => k + 1); setActiveMinigame(mg.id); setView("minigame"); } }}
                    style={{
                      padding: "18px 10px", borderRadius: 14, border: "1px solid var(--border)",
                      background: "var(--card)", cursor: unlocked ? "pointer" : "not-allowed",
                      textAlign: "center", opacity: unlocked ? 1 : 0.3, transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{mg.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{mg.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{mg.desc}</div>
                    {progress.minigameScores[mg.id] != null && (
                      <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 4, fontWeight: 700 }}>
                        Best: {progress.minigameScores[mg.id]}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Reference */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 17, fontWeight: 800, color: "var(--text)" }}>📌 Quick Reference</h2>
            <div style={{
              background: "var(--card)", borderRadius: 14, padding: 18, border: "1px solid var(--border)",
            }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>THE BLOCK ORDER:</p>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                {["Who wa", "Time", "Place de", "What o", "How", "Verb"].map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                      background: Object.values(BLOCK_COLORS)[i] + "22",
                      color: Object.values(BLOCK_COLORS)[i],
                      border: `1px solid ${Object.values(BLOCK_COLORS)[i]}40`,
                    }}>{b}</span>
                    {i < 5 && <span style={{ color: "var(--text-dim)", fontSize: 12 }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reset */}
          <div style={{ textAlign: "center", paddingTop: 12 }}>
            <button onClick={resetProgress} style={{
              background: "none", border: "none", color: "var(--text-dim)", fontSize: 12,
              cursor: "pointer", textDecoration: "underline",
            }}>
              Reset all progress
            </button>
          </div>
        </div>
      )}

      {/* LESSON VIEW */}
      {view === "lesson" && activeLesson && (
        <div style={{ paddingTop: 16, animation: "fadeIn 0.3s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 1 }}>
              Lesson {activeLesson.id}
            </span>
            <h2 style={{ margin: "4px 0", fontSize: 22, fontWeight: 800 }}>{activeLesson.title}</h2>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-dim)" }}>{activeLesson.subtitle}</p>
          </div>
          <LessonContent
            lesson={activeLesson}
            progress={progress}
            onComplete={() => completeLesson(activeLesson.id)}
          />
        </div>
      )}

      {/* QUIZ VIEW */}
      {view === "quiz" && activeQuiz && (
        <div style={{ paddingTop: 16, animation: "fadeIn 0.3s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1 }}>Quiz</span>
            <h2 style={{ margin: "4px 0", fontSize: 22, fontWeight: 800 }}>📝 {activeQuiz.title}</h2>
          </div>
          <Quiz
            key={activeQuiz.afterLesson + "-" + sessionKey}
            quiz={activeQuiz}
            bestScore={progress.quizScores[activeQuiz.afterLesson]}
            onComplete={(score) => {
              completeQuiz(activeQuiz.afterLesson, score);
            }}
          />
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setView("home")} style={btnSecondary}>Back to Home</button>
          </div>
        </div>
      )}

      {/* MINIGAME VIEW */}
      {view === "minigame" && activeMinigame && (
        <div style={{ paddingTop: 16, animation: "fadeIn 0.3s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: 1 }}>Mini-Game</span>
            <h2 style={{ margin: "4px 0", fontSize: 22, fontWeight: 800 }}>
              {minigames.find(m => m.id === activeMinigame)?.icon} {minigames.find(m => m.id === activeMinigame)?.name}
            </h2>
          </div>
          {activeMinigame === "blocks" && (
            <BlockBuilder key={"blocks-" + sessionKey} onComplete={(s) => completeMinigame("blocks", s)} />
          )}
          {activeMinigame === "particles" && (
            <ParticleFill key={"particles-" + sessionKey} onComplete={(s) => completeMinigame("particles", s)} />
          )}
          {activeMinigame === "hiragana" && (
            <HiraganaMatch key={"hiragana-" + sessionKey} onComplete={(s) => completeMinigame("hiragana", s)} />
          )}
          {activeMinigame === "scramble" && (
            <SentenceScramble key={"scramble-" + sessionKey} onComplete={(s) => completeMinigame("scramble", s)} />
          )}
          {activeMinigame === "convo" && (
            <ConvoSim key={"convo-" + sessionKey} onComplete={(s) => completeMinigame("convo", s)} />
          )}
          {activeMinigame === "conjugation" && (
            <SpeedConjugation key={"conjugation-" + sessionKey} onComplete={(s) => completeMinigame("conjugation", s)} />
          )}
          {activeMinigame === "sniper" && (
            <ParticleSniper key={"sniper-" + sessionKey} onComplete={(s) => completeMinigame("sniper", s)} />
          )}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setView("home")} style={btnSecondary}>Back to Home</button>
          </div>
        </div>
      )}

      {/* VOCAB REVIEW VIEW */}
      {view === "review" && (
        <div style={{ paddingTop: 16, animation: "fadeIn 0.3s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1 }}>Spaced Repetition</span>
            <h2 style={{ margin: "4px 0", fontSize: 22, fontWeight: 800 }}>🧠 Vocab Review</h2>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)" }}>Words you struggle with appear more often</p>
          </div>
          <VocabReview
            key={"review-" + sessionKey}
            progress={progress}
            onComplete={completeReview}
          />
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setView("home")} style={btnSecondary}>Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}
