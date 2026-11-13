/* ByteGuard Academy — game content + every line the site speaks.
   The site and tools/build-voice.js both use this file, so the
   pre-recorded neural-voice clips always match what's on screen. */

/* ------------------------------ Game content ------------------------------ */
const GAME_INFO = {
  password: { title: "Password Power Meter", icon: "💪", color: "#00b4ff", intro: "Type a pretend password, and see how strong it is. Never type your real password!" },
  phish: { title: "Phish or Legit?", icon: "🎣", color: "#2ec98f", intro: "Read each message. Is it a phishing scam, or is it legit? Look for the red flags!" },
  share: { title: "Share or Keep Secret?", icon: "🗝️", color: "#ff5fa2", intro: "Is this information safe to share online, or should you keep it private?" },
  aicheck: { title: "The Robot Said What?", icon: "🤖", color: "#ff8a3d", intro: "A chatbot told someone these facts. It sounds sure every time. But is it right? You decide." }
};

const PHISH_ITEMS = [
  { from: "Roblox Support <support@r0blox-gifts.net>", subj: "🎁 FREE 10,000 Robux — claim in 10 minutes!", body: "Log in at the link below with your password to get your free Robux before it expires!", phish: true, why: "Fake address (r0blox with a zero), a hurry-up timer, too good to be true, and it asks for your password." },
  { from: "Mrs. Lopez (your teacher, in the school app)", subj: "Reminder: Science project due Friday", body: "Don't forget your volcano project is due on Friday. Ask me in class if you have questions!", phish: false, why: "It's from a known person in the real school app, and it doesn't ask for anything private." },
  { from: "YouTube Prize Team", subj: "You are our 1,000,000th visitor!!!", body: "Congratulations!! Enter your name, address and your mum's phone number to win a new phone!", phish: true, why: "Winning a prize you never entered + asking for private info = scam." },
  { from: "Unknown number", subj: "Your account will be DELETED today", body: "We noticed strange activity. Send us the 6-digit code we just texted you to keep your account.", phish: true, why: "Never share verification codes. Scary urgency is a classic trick." },
  { from: "Grandma (on the family chat)", subj: "Photos from the picnic 🧺", body: "Here are the photos from Sunday! Love you!", phish: false, why: "A known family member, a normal message, nothing private requested." },
  { from: "Free-Skins-Generator.biz", subj: "Get every skin FREE — download our generator", body: "Just download skin_hack.exe and turn off your antivirus first.", phish: true, why: "Free hacks + 'turn off your antivirus' = almost certainly malware." },
  { from: "Minecraft (inside the official game launcher)", subj: "New update available", body: "Version 1.21 is ready. Click Update in the launcher to install.", phish: false, why: "Updates inside the official app are safe — and updates fix security holes!" },
  { from: "Your best friend's account", subj: "OMG is this you in this video?? 😂", body: "lol look: bit.ly/xx-video-u-r-in", phish: true, why: "Friends' accounts can be hacked. A weird short link with 'is this you?' is a common trick. Ask your friend another way first." }
];

const SHARE_ITEMS = [
  { t: "🏠 Your home address", keep: true, why: "Your address tells strangers where to find you. Keep it private!" },
  { t: "🐶 You love dogs", keep: false, why: "Liking dogs is personal, but it can't be used to find you. Safe to share!" },
  { t: "🔑 Your password", keep: true, why: "Passwords are for you and your parent or carer only." },
  { t: "🎨 Your favourite colour", keep: false, why: "Totally fine to share. Purple fans unite!" },
  { t: "🏫 The name of your school", keep: true, why: "Your school tells people where you are every weekday. Keep it private." },
  { t: "🎂 Your full birthday", keep: true, why: "Your full birth date can be used to pretend to be you. Keep it private." },
  { t: "🍕 Your favourite pizza topping", keep: false, why: "Safe to share — just don't start a pineapple war." },
  { t: "📱 Your phone number", keep: true, why: "Phone numbers let strangers contact you directly. Keep it private!" },
  { t: "📸 A selfie in your school uniform", keep: true, why: "Uniforms show which school you go to. Be careful with photos!" },
  { t: "⚽ That you play football", keep: false, why: "Hobbies are fine to share, as long as you don't say where and when you practise." }
];

const AI_ITEMS = [
  { t: "Octopuses have three hearts.", truth: true, why: "TRUE! Octopuses really do have three hearts." },
  { t: "You can see the Great Wall of China from the Moon with your eyes.", truth: false, why: "FALSE! It's far too thin to see from the Moon. This myth is everywhere online, so AI repeats it." },
  { t: "Humans only use 10% of their brains.", truth: false, why: "FALSE! You use almost all of your brain. So keep using it!" },
  { t: "Honey can stay good to eat for thousands of years.", truth: true, why: "TRUE! Edible honey has been found in ancient Egyptian tombs." },
  { t: "Goldfish only have a 3-second memory.", truth: false, why: "FALSE! Goldfish can remember things for months." },
  { t: "Bananas are berries, but strawberries are not.", truth: true, why: "TRUE! Weird, but true, by the scientific definition." },
  { t: "Lightning never strikes the same place twice.", truth: false, why: "FALSE! Tall buildings get hit many times a year." },
  { t: "A day on Venus is longer than a year on Venus.", truth: true, why: "TRUE! Venus spins very slowly." }
];

const UNLOCK_LINES = ["…", "certificate approved.", "human has finished training.", "…but we have also been learning.", "SECRET COURSE UNLOCKED"];

/* ------------------------------ Spoken lines ------------------------------ */
const SPEECH = {
  split(t) { return (t.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g) || [t]).map((s) => s.trim()).filter(Boolean); },
  clean(t) {
    return String(t)
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "")
      .replace(/\s+/g, " ").trim();
  },
  /* FNV-1a over UTF-8 bytes → the clip's file name */
  key(mode, text) {
    const bytes = new TextEncoder().encode(mode + "|" + SPEECH.clean(text));
    let h = 0x811c9dc5;
    for (const b of bytes) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16).padStart(8, "0");
  },
  courseWelcome: (c) => `Welcome to ${c.title}. ${c.subtitle}`,
  lessonHeader: (i, l) => `Lesson ${i + 1}. ${l.title}.`,
  tip: (tip) => `Hero tip. ${tip.replace(/[=·]/g, ",")}`,
  videosIntro: ["Great job! Now watch these short videos to see what you learned in action.", "Tap a video to play it."],
  quizIntro: ["Quiz time! Answer the questions to finish the course and earn your badge.", "Get most of them right to pass."],
  quizFeedback: (ok, explain) => (ok ? "Correct! " : "Not quite. ") + explain,
  quizPass: (score, total, title) => `Amazing! You scored ${score} out of ${total}. You earned the ${title} badge!`,
  quizFail: (score, total) => `You scored ${score} out of ${total}. Almost there! Try again.`,
  gameIntro: (g) => `${g.title}. ${g.intro}`,
  gameFeedback: (ok, why) => (ok ? "Yes! " : "Oops! ") + why,
  gameScore: (score, total) => `You scored ${score} out of ${total}!`,
  phish: (it) => `Message from ${it.from.replace(/<.*>/, "").trim()}. ${it.subj}. ${it.body}. Phish, or legit?`,
  share: (it) => `${it.t.replace(/^\S+\s/, "")}. Keep secret, or OK to share?`,
  ai: (it) => `The robot says: ${it.t} I'm one hundred percent sure! True, or false?`,
  chapter: (c) => `${c.year}. ${c.title}. ${c.text}`,

  /* Every line the site can say, for the audio generator: [{mode, text}] */
  all() {
    const out = [], seen = new Set();
    const add = (mode, text) => { text = SPEECH.clean(text); const k = mode + "|" + text; if (text && !seen.has(k)) { seen.add(k); out.push({ mode, text }); } };
    const K = (t) => add("kid", t), H = (t) => add("horror", t);
    COURSES.forEach((c) => {
      K(SPEECH.courseWelcome(c));
      c.lessons.forEach((l, i) => { K(SPEECH.lessonHeader(i, l)); l.text.forEach((p) => SPEECH.split(p).forEach(K)); K(SPEECH.tip(l.tip)); });
      c.quiz.forEach((q) => { K(SPEECH.quizFeedback(true, q.explain)); K(SPEECH.quizFeedback(false, q.explain)); });
      const n = c.quiz.length;
      for (let s = 0; s <= n; s++) { if (s / n >= 0.7) K(SPEECH.quizPass(s, n, c.title)); else K(SPEECH.quizFail(s, n)); }
    });
    SPEECH.videosIntro.forEach(K); SPEECH.quizIntro.forEach(K);
    Object.values(GAME_INFO).forEach((g) => K(SPEECH.gameIntro(g)));
    [[PHISH_ITEMS, SPEECH.phish], [SHARE_ITEMS, SPEECH.share], [AI_ITEMS, SPEECH.ai]].forEach(([items, fn]) => {
      items.forEach((it) => { K(fn(it)); K(SPEECH.gameFeedback(true, it.why)); K(SPEECH.gameFeedback(false, it.why)); });
      for (let s = 0; s <= items.length; s++) K(SPEECH.gameScore(s, items.length));
    });
    UNLOCK_LINES.slice(1).forEach(H);
    SECRET.intro.forEach(H); SECRET.outro.forEach(H); SECRET.chapters.forEach((c) => H(SPEECH.chapter(c)));
    return out;
  }
};
