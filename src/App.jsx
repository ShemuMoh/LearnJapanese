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
  { p: "は", r: "wa", role: "Topic/Subject", ex: "わたしは", exEn: "I (am the topic)", color: "#FF6B6B", bengali: "Like -ই/-টা marking the topic in Bengali" },
  { p: "を", r: "o", role: "Object of action", ex: "コーヒーを", exEn: "coffee (acting on it)", color: "#4ECDC4", bengali: "Like -কে/-টাকে marking the object" },
  { p: "の", r: "no", role: "Possession", ex: "わたしの", exEn: "my", color: "#45B7D1", bengali: "Like -র/-এর (āmār = my)" },
  { p: "に", r: "ni", role: "Target/Direction", ex: "がっこうに", exEn: "to school", color: "#96CEB4", bengali: "Like -তে/-এ for direction" },
  { p: "で", r: "de", role: "Location of action", ex: "カフェで", exEn: "at a café", color: "#FFEAA7", bengali: "Like -তে for 'at/in' a place" },
];

const BASIC_VERBS = [
  { dict: "たべる", masu: "たべます", past: "たべました", neg: "たべません", en: "eat", r: "taberu" },
  { dict: "のむ", masu: "のみます", past: "のみました", neg: "のみません", en: "drink", r: "nomu" },
  { dict: "いく", masu: "いきます", past: "いきました", neg: "いきません", en: "go", r: "iku" },
  { dict: "くる", masu: "きます", past: "きました", neg: "きません", en: "come", r: "kuru" },
  { dict: "みる", masu: "みます", past: "みました", neg: "みません", en: "see/watch", r: "miru" },
  { dict: "する", masu: "します", past: "しました", neg: "しません", en: "do", r: "suru" },
  { dict: "かう", masu: "かいます", past: "かいました", neg: "かいません", en: "buy", r: "kau" },
  { dict: "よむ", masu: "よみます", past: "よみました", neg: "よみません", en: "read", r: "yomu" },
  { dict: "かく", masu: "かきます", past: "かきました", neg: "かきません", en: "write", r: "kaku" },
  { dict: "はなす", masu: "はなします", past: "はなしました", neg: "はなしません", en: "speak", r: "hanasu" },
];

const BLOCK_COLORS = {
  who: "#FF6B6B",
  time: "#FFEAA7",
  place: "#96CEB4",
  what: "#4ECDC4",
  how: "#DDA0DD",
  verb: "#45B7D1",
};

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
        text: "Bengali is Subject-Object-Verb, just like Japanese! In Bengali you say 'আমি ভাত খাই' (ami bhat khai = I rice eat). Japanese works the same way: わたしは ごはんを たべます (watashi wa gohan o tabemasu = I rice eat). You already THINK in Japanese word order."
      },
      {
        type: "block-intro",
        title: "The Block Method — How Japanese Sentences Work",
        text: "Every Japanese sentence is built from blocks in this order. The verb ALWAYS goes last. Always.",
        blocks: ["Who は", "Time", "Place で", "What を", "How", "Verb"]
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
        text: "Watch how ONE word — わたし (watashi = I/me) — changes meaning with different particles:\n\nわたしは = I (topic)\nわたしの = my\nわたしに = to me\nわたしも = me too\n\nThe word never changes. Only the particle does. This is the opposite of Italian, where 'io/mi/mio/me' are all different words!"
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
        text: "In Italian, 'mangiare' becomes mangio, mangi, mangia, mangiamo, mangiate, mangiano... and that's just present tense! In Japanese, polite form has essentially 4 forms:\n\nたべます (eat) → たべました (ate) → たべません (don't eat) → たべませんでした (didn't eat)\n\nThat's it. No person agreement. No gender. Just these 4 patterns."
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
    subtitle: "じこしょうかい — Your first real conversation",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "Real-World Skill #1",
        text: "Self-introductions (じこしょうかい / jikoshoukai) are HUGE in Japanese culture. This is probably the first thing you'll actually use. Let's build yours block by block."
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
        title: "New Particle Alert: から (kara) = 'from'",
        text: "This is a new block! から marks where you came FROM.\n\nイギリスから = from England\nイタリアから = from Italy\nバングラデシュから = from Bangladesh\n\nIt works just like Bengali -থেকে (theke): লন্ডন থেকে = ロンドンから = from London"
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
        text: "Japanese borrowed THOUSANDS of English words and wrote them in a special alphabet called katakana (カタカナ). If you can say 'coffee', you can say コーヒー (koohii). If you can say 'restaurant', you can say レストラン (resutoran). Think of katakana as English words wearing a Japanese costume."
      },
      {
        type: "katakana",
        data: KATAKANA_COMMON
      },
      {
        type: "insight",
        title: "🇮🇹 Double Consonants = Italian Gemination",
        text: "Japanese has double consonants just like Italian! きっぷ (kippu = ticket) has the same 'pp' sound as 'coppa'. にっぽん (nippon = Japan) works like 'troppo'. Your Italian ear is already trained for this."
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
        text: "Time words in Japanese are just another block. They go near the front of the sentence, right after [Who]. No prepositions needed — no 'on Monday', 'at 3pm', 'in the morning'. Just drop the time word in the Time slot.\n\nきのう = yesterday\nきょう = today\nあした = tomorrow\nまいにち = every day"
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
        title: "Past Tense is Just ーました",
        text: "To make any polite verb past tense, swap ます → ました. That's it. No irregular forms to memorise (unlike Italian where every verb has its own passato remoto nightmare).\n\nたべます → たべました (eat → ate)\nのみます → のみました (drink → drank)\nいきます → いきました (go → went)"
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
    subtitle: "か turns anything into a question. ません says no.",
    phase: 1,
    content: [
      {
        type: "insight",
        title: "Questions Are FREE",
        text: "In English you rearrange the whole sentence to ask a question ('You eat sushi' → 'Do you eat sushi?'). In Japanese, you just add か (ka) to the end. That's it. The sentence stays exactly the same.\n\nたべます。= I eat.\nたべますか？= Do you eat?\n\nThis is like Bengali adding কি (ki) at the end: তুমি খাও (you eat) → তুমি খাও কি? (do you eat?)"
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
        title: "Negatives: ます → ません",
        text: "To say 'don't/doesn't', swap ます → ません.\nPast negative? ません → ませんでした.\n\nたべます → たべません (don't eat)\nたべました → たべませんでした (didn't eat)"
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
    subtitle: "い-adjectives and な-adjectives",
    phase: 2,
    content: [
      {
        type: "insight",
        title: "Two Flavours of Adjective",
        text: "Japanese has two types of adjective. The good news: they're easy to tell apart.\n\nい-adjectives end in い: おおきい (big), ちいさい (small), たかい (expensive), おいしい (delicious), あたらしい (new)\n\nな-adjectives need な before a noun: きれいな (beautiful), しずかな (quiet), ゆうめいな (famous), げんきな (energetic)"
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
        text: "い-adjectives: drop い, add くない\nおいしい → おいしくない (not delicious)\nたかい → たかくない (not expensive)\n\nな-adjectives: add じゃない\nしずかな → しずかじゃない (not quiet)"
      }
    ]
  },
  {
    id: 9,
    title: "Wanting & Reasons",
    subtitle: "～たい (want to) and から (because)",
    phase: 2,
    content: [
      {
        type: "insight",
        title: "Wanting To Do Something: ～たい",
        text: "Take any ます-form verb, drop ます, add たい.\n\nたべます → たべたい (want to eat)\nいきます → いきたい (want to go)\nのみます → のみたい (want to drink)\n\nThis たい ending works like an い-adjective! So 'didn't want to' = たべたくなかった."
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
        title: "New Block: から (because/so)",
        text: "から is a reason connector. It goes AFTER the reason clause.\n\nStructure: [Reason] + から + [Result]\n\nおいしいですから、まいにち たべます。\n= Because it's delicious, I eat it every day.\n\nThis is like Bengali কারণ (karon) but placed differently."
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
        title: "The て-Form: Your Multi-Tool",
        text: "The て-form is like a Swiss Army knife. It lets you:\n• Make requests (たべてください = please eat)\n• Connect actions (たべて、のんで = ate and drank)\n• Describe ongoing states (たべている = am eating)\n\nFor ます-form verbs, a simple rule: drop ます, add て.\nたべます → たべて\nみます → みて\n\n(Some verbs have irregular て-forms, but we'll learn the main ones.)"
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
        title: "Connecting Actions with て",
        text: "Use て to chain actions — like 'and then'.\n\nあさ おきて、コーヒーを のんで、しごとに いきます。\n= Morning, I wake up, (and then) drink coffee, (and then) go to work.\n\nOnly the LAST verb gets the tense ending (ます/ました)."
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
};

// ============================================================
// COMPONENTS
// ============================================================

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
      <span style={{ fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{romaji || jp}</span>
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
      case "chart":
        return (
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 16px", color: "var(--text)" }}>{item.title}</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {item.data.map((ch, i) => (
                <div key={i} style={{
                  width: 72, height: 80, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", background: "var(--card-alt)",
                  borderRadius: 12, border: "2px solid var(--border)",
                }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "var(--accent)" }}>{ch.h}</span>
                  <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{ch.r}</span>
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
                  <span style={{ fontSize: 28, fontWeight: 800, color: p.color, minWidth: 40, textAlign: "center" }}>{p.p}</span>
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
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: "var(--card-alt)", borderRadius: 10, flexWrap: "wrap",
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
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: "var(--card-alt)", borderRadius: 10, flexWrap: "wrap",
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
                <div key={i} style={{
                  padding: "12px", background: "var(--card-alt)", borderRadius: 10,
                  textAlign: "center", border: "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{w.k}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{w.r}</div>
                  <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>{w.en}</div>
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
                  }}>
                    <div style={{ fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{l.jp}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{l.r}</div>
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
  const [view, setView] = useState("home"); // home, lesson, quiz, minigame
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
    const xpMap = { blocks: 15, particles: 12, hiragana: 8 };
    const xp = score * (xpMap[name] || 10);
    updateProgress(p => ({
      ...p,
      minigameScores: { ...p.minigameScores, [name]: Math.max(p.minigameScores[name] || 0, score) },
      totalXP: p.totalXP + xp,
      lastActive: new Date().toISOString(),
    }));
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
    { name: "Expanding", weeks: "5–8+", lessons: LESSONS.filter(l => l.phase === 2) },
  ];

  const minigames = [
    { id: "blocks", name: "Block Builder", icon: "🏗️", desc: "Arrange blocks to build sentences", minLesson: 1 },
    { id: "particles", name: "Particle Fill", icon: "🧩", desc: "Choose the right particle", minLesson: 2 },
    { id: "hiragana", name: "Vocab Speed", icon: "⚡", desc: "Type the romaji as fast as you can", minLesson: 1 },
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            </div>
          </div>

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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
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
                {["Who は", "Time", "Place で", "What を", "How", "Verb"].map((b, i) => (
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
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setView("home")} style={btnSecondary}>Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
}
