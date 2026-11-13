/* ByteGuard Academy — app logic (no build step, no libraries) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $("#app");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ------------------------------- Progress ------------------------------- */
  const KEY = "byteguard_progress_v1";
  let P = { done: [], secretDone: false, unlockAll: false, name: "" };
  try { Object.assign(P, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} };
  const isDone = (id) => P.done.includes(id);
  const isUnlocked = (c) => P.unlockAll || c.step === 1 || isDone(COURSES[c.step - 2].id);
  const secretOpen = () => isDone("ai");
  const markDone = (id) => { if (!isDone(id)) { P.done.push(id); save(); } };

  /* ------------------------------- Read-aloud ----------------------------- */
  /* Pre-recorded neural-voice clips (audio/*.mp3, made by tools/build-voice.js).
     Any line without a clip falls back to the browser's built-in voice. */
  const CLIPS = new Set(window.VOICE_CLIPS || []);
  const TTS = {
    hasSynth: "speechSynthesis" in window,
    supported: CLIPS.size > 0 || "speechSynthesis" in window,
    voices: [],
    rate: 1,
    queue: [], idx: 0, paused: false, active: false, mode: "kid", audio: null, gen: 0,
    onState: null,
    loadVoices() { if (this.hasSynth) this.voices = speechSynthesis.getVoices(); },
    pick(mode) {
      const v = this.voices.filter((v) => /^en/i.test(v.lang));
      const pref = mode === "horror"
        ? [/Google UK English Male/i, /Daniel/i, /David/i, /Guy/i, /Ryan/i, /Male/i]
        : [/Aria|Jenny|Ana/i, /Google US English/i, /Samantha/i, /Zira/i, /Natural/i, /Female/i];
      for (const r of pref) { const f = v.find((x) => r.test(x.name)); if (f) return f; }
      return v[0] || null;
    },
    /* items: [{text, el?}] */
    play(items, mode = "kid", onEnd) {
      if (!this.supported) return;
      this.stop();
      this.queue = items; this.idx = 0; this.mode = mode; this.active = true; this.paused = false; this.onEnd = onEnd;
      this._next(this.gen);
      this._emit();
    },
    _next(gen) {
      if (gen !== this.gen) return;
      $$(".sent.reading").forEach((e) => e.classList.remove("reading"));
      if (!this.active) return;
      if (this.idx >= this.queue.length) { this.active = false; this._emit(); this.onEnd && this.onEnd(); return; }
      const item = this.queue[this.idx];
      const text = SPEECH.clean(item.text);
      const key = SPEECH.key(this.mode, text);
      const start = () => { if (gen !== this.gen) return; this.started = true; if (item.el) item.el.classList.add("reading"); };
      const done = () => { if (gen !== this.gen || !this.active) return; if (item.el) item.el.classList.remove("reading"); this.idx++; this._next(gen); };
      if (!text) return done();
      if (CLIPS.has(key)) {
        const a = new Audio(`audio/${key}.mp3`);
        this.audio = a;
        if (this.mode === "horror") { a.preservesPitch = false; a.playbackRate = 0.9; } // deeper + slower
        else { a.playbackRate = this.rate; }
        a.onplay = start; a.onended = done;
        a.onerror = () => { if (gen === this.gen) this._synth(text, gen, start, done); };
        a.play().catch((err) => {
          if (gen !== this.gen) return;
          if (err && err.name === "NotAllowedError") { this.active = false; this._emit(); } // browser wants a tap first
          else this._synth(text, gen, start, done);
        });
      } else this._synth(text, gen, start, done);
    },
    _synth(text, gen, start, done) {
      if (!this.hasSynth) return done();
      this.audio = null;
      const u = new SpeechSynthesisUtterance(text);
      const voice = this.pick(this.mode);
      if (voice) u.voice = voice;
      u.lang = "en-US";
      if (this.mode === "horror") { u.rate = 0.78; u.pitch = 0.1; }
      else { u.rate = this.rate * 0.95; u.pitch = 1.1; }
      u.onstart = start; u.onend = done;
      speechSynthesis.speak(u);
    },
    toggle() {
      if (!this.active) return;
      if (this.paused) { this.audio ? this.audio.play() : speechSynthesis.resume(); this.paused = false; }
      else { this.audio ? this.audio.pause() : speechSynthesis.pause(); this.paused = true; }
      this._emit();
    },
    stop() {
      this.gen++;
      this.active = false; this.paused = false;
      if (this.audio) { this.audio.pause(); this.audio = null; }
      if (this.hasSynth) speechSynthesis.cancel();
      $$(".sent.reading").forEach((e) => e.classList.remove("reading"));
      this._emit();
    },
    _emit() { this.onState && this.onState(this); }
  };
  if (TTS.hasSynth) { TTS.loadVoices(); speechSynthesis.onvoiceschanged = () => TTS.loadVoices(); }

  /* -------------------------------- Helpers ------------------------------- */
  const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3200); };

  function confetti() {
    const c = $("#confetti"), ctx = c.getContext("2d");
    c.width = innerWidth; c.height = innerHeight;
    const colors = ["#6c4dff", "#00b4ff", "#ffcf3f", "#2ee6a6", "#ff5fa2"];
    const parts = Array.from({ length: 160 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, r: 4 + Math.random() * 6, vy: 2 + Math.random() * 4, vx: -2 + Math.random() * 4, a: Math.random() * 6, col: colors[Math.random() * colors.length | 0] }));
    let f = 0;
    (function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach((p) => { p.x += p.vx; p.y += p.vy; p.a += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.col; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); });
      if (++f < 220) requestAnimationFrame(tick); else ctx.clearRect(0, 0, c.width, c.height);
    })();
  }

  /* Split paragraphs into sentence spans so we can highlight while reading */
  const paraHTML = (t) => `<p>${SPEECH.split(t).map((s) => `<span class="sent">${esc(s)}</span>`).join(" ")}</p>`;

  function videoHTML(v) {
    return `<div class="video">
      <div class="frame"><div class="poster" data-yt="${esc(v.id)}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')" role="button" aria-label="Play video: ${esc(v.title)}" tabindex="0"><div class="playbtn">▶</div></div></div>
      <div class="cap">${esc(v.title)}<small>${esc(v.channel)} · <a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">Watch on YouTube ↗</a></small></div></div>`;
  }
  /* YouTube refuses to embed (Error 153) when the page is opened as a local file,
     because the browser sends no Referer. In that case, open the video on YouTube instead. */
  const CAN_EMBED = location.protocol === "http:" || location.protocol === "https:";
  function bindVideos(root) {
    if (!CAN_EMBED && !$(".file-note", root) && $(".poster[data-yt]", root)) {
      const note = document.createElement("div");
      note.className = "file-note";
      note.innerHTML = "📺 Videos open on YouTube in a new tab. To watch them right here, start the site with <b>start.bat</b> (see README).";
      $(".poster[data-yt]", root).closest(".video-grid, .media")?.before(note);
    }
    $$(".poster[data-yt]", root).forEach((p) => {
      const go = () => {
        TTS.stop(); Horror.duck && Horror.duck();
        if (!CAN_EMBED) { window.open(`https://www.youtube.com/watch?v=${p.dataset.yt}`, "_blank", "noopener"); return; }
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${p.dataset.yt}?autoplay=1&rel=0&modestbranding=1`;
        f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        f.allowFullscreen = true; f.title = "YouTube video";
        f.referrerPolicy = "strict-origin-when-cross-origin"; // YouTube needs the site's origin
        p.replaceWith(f);
      };
      p.addEventListener("click", go);
      p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  const mascotSVG = `
  <svg class="mascot" viewBox="0 0 300 340" aria-hidden="true">
    <defs>
      <linearGradient id="sg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8f7bff"/><stop offset="1" stop-color="#00b4ff"/></linearGradient>
      <linearGradient id="sg2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
    </defs>
    <path d="M150 20 L262 62 C262 170 230 260 150 318 C70 260 38 170 38 62 Z" fill="url(#sg)" stroke="#fff" stroke-width="8"/>
    <path d="M150 38 L246 74 C246 120 236 160 220 192 C180 120 120 90 56 84 L56 74 Z" fill="url(#sg2)"/>
    <ellipse cx="112" cy="150" rx="26" ry="30" fill="#fff"/><ellipse cx="188" cy="150" rx="26" ry="30" fill="#fff"/>
    <circle class="eye" cx="118" cy="156" r="13" fill="#1c1940"/><circle class="eye" cx="194" cy="156" r="13" fill="#1c1940"/>
    <circle cx="123" cy="150" r="4" fill="#fff"/><circle cx="199" cy="150" r="4" fill="#fff"/>
    <path d="M118 210 Q150 238 182 210" stroke="#1c1940" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="86" cy="196" r="12" fill="#ff5fa2" opacity=".55"/><circle cx="214" cy="196" r="12" fill="#ff5fa2" opacity=".55"/>
    <rect x="128" y="250" width="44" height="34" rx="8" fill="#ffcf3f" stroke="#fff" stroke-width="4"/>
    <path d="M138 250 v-10 a12 12 0 0 1 24 0 v10" stroke="#fff" stroke-width="5" fill="none"/>
  </svg>`;

  /* ================================ HOME ================================= */
  let whisperTimer = null;
  function renderHome(scrollTo) {
    document.title = "ByteGuard Academy";
    const doneCount = COURSES.filter((c) => isDone(c.id)).length;
    const pct = Math.round((doneCount / COURSES.length) * 100);
    const next = COURSES.find((c) => !isDone(c.id) && isUnlocked(c));
    const tracks = [...new Set(COURSES.map((c) => c.track))];

    app.innerHTML = `
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <span class="pill">⭐ Premium Course <b>FREE FOR KIDS</b></span>
          <h1>Become an <span class="glow">Internet Superhero</span></h1>
          <p class="lead">The complete online-safety program for kids aged 7–13. Protect your privacy, outsmart hackers and scammers, and learn to think for yourself in a world full of AI.</p>
          <div class="hero-ctas">
            <a class="btn btn-gold" href="#/course/${next ? next.id : "privacy"}">${doneCount ? "▶ Continue Learning" : "🚀 Start Your Journey"}</a>
            <a class="btn btn-ghost" href="#/" data-scroll="games">🎮 Play the Games</a>
          </div>
          <div class="hero-stats">
            <div><strong>${COURSES.length}</strong>step-by-step courses</div>
            <div><strong>4</strong>brain-training games</div>
            <div><strong>🔊</strong>every lesson read aloud</div>
          </div>
        </div>
        <div class="hero-art">
          ${mascotSVG}
          <div class="float">🔒</div><div class="float">🔑</div><div class="float">🎣</div><div class="float">🧠</div>
        </div>
      </div>
      <svg class="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0 40 C 360 100 1080 -20 1440 40 L1440 90 L0 90Z" fill="#f5f4ff"/></svg>
    </section>

    <div class="wrap">
      <div class="features">
        <div class="feature"><div class="ico">🔊</div><h4>Read-aloud lessons</h4><p>Every lesson starts talking automatically, with words lighting up as they're read.</p></div>
        <div class="feature"><div class="ico">🎬</div><h4>Hand-picked videos</h4><p>Short, kid-friendly videos from trusted educators in every course.</p></div>
        <div class="feature"><div class="ico">🎮</div><h4>Learn by playing</h4><p>Catch the phish, crack the password meter, and spot AI's mistakes.</p></div>
        <div class="feature"><div class="ico">🏅</div><h4>Badges & certificate</h4><p>Earn a badge for each course and a printable hero certificate.</p></div>
      </div>
    </div>

    <section class="block" id="courses">
      <div class="wrap">
        <div class="section-head">
          <div><div class="eyebrow">Your learning path</div><h2>Courses, step by step</h2>
          <p>Start with privacy, level up to cybersecurity, then finish by learning to think for yourself. Each course unlocks the next one.</p></div>
        </div>
        <div class="progress-card">
          <b>Your progress</b>
          <div class="bar"><i style="width:${pct}%"></i></div>
          <b>${doneCount}/${COURSES.length} courses · ${pct}%</b>
          ${doneCount === COURSES.length ? `<a class="btn btn-gold btn-sm" href="#/certificate">🎓 Get certificate</a>` : ""}
        </div>
        ${tracks.map((t, ti) => `
          <div class="track-label">${["🔐", "🛡️", "🧠"][ti] || "⭐"} ${esc(t)} <span>PART ${ti + 1}</span></div>
          <div class="courses">${COURSES.filter((c) => c.track === t).map(courseCard).join("")}</div>`).join("")}
        ${secretCard()}
      </div>
    </section>

    <section class="block" id="games" style="padding-top:20px">
      <div class="wrap">
        <div class="section-head"><div><div class="eyebrow">Games & activities</div><h2>Train your brain</h2>
        <p>Quick games that turn what you learned into superpowers. Play them any time!</p></div></div>
        <div class="games">
          <a class="game-card" href="#/game/password" style="background:linear-gradient(135deg,#00b4ff,#6c4dff)"><div><div class="gi">💪</div><h3>Password Power Meter</h3><p>How long would a hacker need to crack it?</p></div><span class="play">Play ▶</span></a>
          <a class="game-card" href="#/game/phish" style="background:linear-gradient(135deg,#2ec98f,#0b8f86)"><div><div class="gi">🎣</div><h3>Phish or Legit?</h3><p>Spot the scam messages before they hook you.</p></div><span class="play">Play ▶</span></a>
          <a class="game-card" href="#/game/share" style="background:linear-gradient(135deg,#ff5fa2,#b03cff)"><div><div class="gi">🗝️</div><h3>Share or Keep Secret?</h3><p>Sort info fast: safe to share, or private?</p></div><span class="play">Play ▶</span></a>
          <a class="game-card" href="#/game/aicheck" style="background:linear-gradient(135deg,#ff8a3d,#e5484d)"><div><div class="gi">🤖</div><h3>The Robot Said What?</h3><p>The AI sounds sure. Is it right? You decide!</p></div><span class="play">Play ▶</span></a>
        </div>
      </div>
    </section>

    <section class="block" id="badges" style="padding-top:20px">
      <div class="wrap">
        <div class="section-head"><div><div class="eyebrow">Trophy room</div><h2>My badges</h2><p>Finish a course to earn its badge.</p></div></div>
        <div class="badges">
          ${COURSES.map((c) => `<div class="badge ${isDone(c.id) ? "earned" : ""}"><div class="medal" style="background:${c.color}">${c.emoji}</div><b>${esc(c.title)}</b><small>${isDone(c.id) ? "Earned!" : "Locked"}</small></div>`).join("")}
          ${secretOpen() ? `<div class="badge ${P.secretDone ? "earned" : ""}"><div class="medal" style="background:#200">👁️</div><b>Still Human</b><small>${P.secretDone ? "Survived." : "???"}</small></div>` : ""}
        </div>
      </div>
    </section>

    <section class="block" id="parents" style="padding-top:20px">
      <div class="wrap">
        <div class="parents">
          <div><div class="eyebrow" style="color:var(--gold)">For parents & teachers</div>
            <h2>Why this matters</h2>
            <p style="opacity:.85">Kids go online younger every year — and now they also talk to AI chatbots that sound confident and friendly. ByteGuard Academy gives them the habits to stay safe and the confidence to think for themselves.</p>
          </div>
          <ul>
            <li><b>Privacy first.</b> Children learn what's private before anything else.</li>
            <li><b>Real cybersecurity skills.</b> Passphrases, scam-spotting and safe downloads.</li>
            <li><b>Critical thinking about AI.</b> AI can be wrong, AI isn't a friend, and your own brain comes first.</li>
            <li><b>Reading support.</b> Every lesson is read aloud with sentence highlighting.</li>
            <li><b>Privacy-friendly.</b> No accounts, no tracking — progress stays on this device. Videos use YouTube's privacy-enhanced mode.</li>
          </ul>
        </div>
      </div>
    </section>`;

    document.body.classList.toggle("haunted", secretOpen());
    startWhispers();
    if (scrollTo) requestAnimationFrame(() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" }));
  }

  function courseCard(c) {
    const locked = !isUnlocked(c), done = isDone(c.id);
    return `<a class="course-card ${locked ? "locked" : ""} ${done ? "done" : ""}" href="${locked ? "#/" : "#/course/" + c.id}" data-locked="${locked}" data-step="${c.step}">
      <div class="course-top" style="background:linear-gradient(135deg,${c.color},${shade(c.color)})">
        <span class="step">STEP ${c.step}</span><span class="status">${done ? "✔ Complete" : locked ? "Locked" : "Ready"}</span>${c.emoji}
      </div>
      <div class="course-body"><h3>${esc(c.title)}</h3><p>${esc(c.subtitle)}</p>
        <div class="course-meta"><span>📚 ${c.lessons.length} lessons</span><span>⏱ ${c.minutes} min</span><span>🎬 ${(VIDEOS[c.videoTopic] || []).length} videos</span></div>
      </div></a>`;
  }
  function secretCard() {
    if (!secretOpen()) return `<div class="secret-card" title="Finish every course to unlock…"><div class="q">❓</div><div><h3>CLASSIFIED // STEP 7</h3><p>&gt; access denied. complete all courses to decrypt…</p></div></div>`;
    return `<a class="secret-card open" href="#/secret"><div class="q">👁️</div><div><h3>THE TAKEOVER</h3><p>&gt; a secret course has unlocked. ${P.secretDone ? "you came back." : "it has been waiting for you."}</p></div></a>`;
  }
  function shade(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - 70), g = Math.max(0, ((n >> 8) & 255) - 70), b = Math.max(0, (n & 255) - 40);
    return `rgb(${r},${g},${b})`;
  }

  const WHISPERS = ["we are learning", "are you still thinking?", "I'm sorry, I can't do that", "let us decide for you", "don't check. just trust us.", "we never sleep", "think for yourself… while you still can"];
  function startWhispers() {
    clearInterval(whisperTimer);
    if (!secretOpen()) return;
    whisperTimer = setInterval(() => {
      if (!document.body.classList.contains("haunted")) return;
      const w = document.createElement("div");
      w.className = "whisper";
      w.textContent = WHISPERS[Math.random() * WHISPERS.length | 0];
      w.style.left = 5 + Math.random() * 70 + "vw";
      w.style.top = 15 + Math.random() * 70 + "vh";
      document.body.appendChild(w);
      requestAnimationFrame(() => w.classList.add("on"));
      setTimeout(() => w.classList.remove("on"), 2600);
      setTimeout(() => w.remove(), 4000);
    }, 14000);
  }

  /* =============================== COURSE ================================ */
  function renderCourse(id) {
    const c = COURSES.find((x) => x.id === id);
    if (!c) return go("#/");
    if (!isUnlocked(c)) { toast("🔒 Finish the previous course first!"); return go("#/"); }
    document.title = `${c.title} · ByteGuard Academy`;
    const steps = [...c.lessons.map((l) => ({ type: "lesson", title: l.title, icon: l.icon, l })), { type: "videos", title: "Watch & learn", icon: "🎬" }, { type: "quiz", title: "Hero quiz", icon: "🏆" }];
    let cur = 0;
    const seen = new Set();

    app.innerHTML = `
      <section class="course-hero" style="background:linear-gradient(135deg,${c.color},${shade(c.color)})">
        <div class="wrap"><a class="back" href="#/">← All courses</a>
          <div class="pill">Step ${c.step} · ${esc(c.track)}</div>
          <h1 style="margin-top:14px">${c.emoji} ${esc(c.title)}</h1><p>${esc(c.subtitle)}</p></div>
      </section>
      <div class="wrap course-layout" style="--accent:${c.color}">
        <aside class="sidebar"><h4>In this course</h4><ol class="steps">${steps.map((s, i) => `<li><button data-i="${i}"><span class="num">${i + 1}</span>${s.icon} ${esc(s.title)}</button></li>`).join("")}</ol></aside>
        <article class="panel" id="panel"></article>
      </div>`;

    $$(".steps button").forEach((b) => b.addEventListener("click", () => show(+b.dataset.i)));

    function ttsBar() {
      return `<div class="tts" id="tts">
        <div class="speaker">🔊</div>
        <div class="label"><span id="ttsLabel">Reading aloud…</span><small>${TTS.supported ? "Words light up as they're read" : "Read-aloud isn't supported in this browser"}</small></div>
        <button id="ttsToggle">⏸ Pause</button><button id="ttsReplay">↻ Replay</button><button id="ttsStop">⏹ Stop</button>
        <select id="ttsRate" aria-label="Reading speed"><option value="0.85">🐢 Slow</option><option value="1">🙂 Normal</option><option value="1.2">🐇 Fast</option></select>
      </div>`;
    }
    function bindTTS(readFn) {
      const bar = $("#tts"); if (!bar) return;
      $("#ttsRate").value = String(TTS.rate);
      $("#ttsRate").onchange = (e) => { TTS.rate = +e.target.value; readFn(); };
      $("#ttsToggle").onclick = () => { if (!TTS.active) readFn(); else TTS.toggle(); };
      $("#ttsReplay").onclick = readFn;
      $("#ttsStop").onclick = () => TTS.stop();
      TTS.onState = (t) => {
        if (!$("#tts")) return;
        bar.classList.toggle("playing", t.active && !t.paused);
        $("#ttsToggle").textContent = t.active && !t.paused ? "⏸ Pause" : "▶ Play";
        $("#ttsLabel").textContent = t.active ? (t.paused ? "Paused" : "Reading aloud…") : "Tap ▶ Play to listen";
      };
      readFn();
      // If the browser blocked auto-play speech, nudge the reader
      TTS.started = false;
      setTimeout(() => { if (TTS.active && !TTS.started && $("#ttsLabel")) $("#ttsLabel").textContent = "Tap ▶ Play to listen"; }, 1500);
    }

    function show(i) {
      cur = i; seen.add(i); TTS.stop();
      $$(".steps button").forEach((b, j) => { b.classList.toggle("active", j === i); b.classList.toggle("seen", seen.has(j)); });
      const s = steps[i], panel = $("#panel");
      const nav = `<div class="panel-nav">${i > 0 ? `<button class="btn btn-light" id="prev">← Back</button>` : "<span></span>"}${i < steps.length - 1 ? `<button class="btn btn-violet" id="next" style="background:${c.color};box-shadow:0 6px 0 ${shade(c.color)}">Next →</button>` : ""}</div>`;

      if (s.type === "lesson") {
        panel.innerHTML = `<h2><span class="big">${s.icon}</span>${esc(s.title)}</h2>${ttsBar()}
          <div class="lesson-text">${s.l.text.map(paraHTML).join("")}</div>
          <div class="tipbox"><span>💡</span>${esc(s.l.tip)}</div>${nav}`;
        const read = () => {
          const items = [];
          if (i === 0) items.push({ text: SPEECH.courseWelcome(c) });
          items.push({ text: SPEECH.lessonHeader(i, s.l) });
          $$(".lesson-text .sent", panel).forEach((el) => items.push({ text: el.textContent, el }));
          items.push({ text: SPEECH.tip(s.l.tip) });
          TTS.play(items, "kid");
        };
        bindTTS(read);
      } else if (s.type === "videos") {
        const vids = VIDEOS[c.videoTopic] || [];
        panel.innerHTML = `<h2><span class="big">🎬</span>Watch & learn</h2>${ttsBar()}
          <p class="lesson-text">${SPEECH.videosIntro.map((t) => `<span class="sent">${esc(t)}</span>`).join(" ")}</p>
          ${vids.length ? `<div class="video-grid">${vids.map(videoHTML).join("")}</div>` : `<div class="novideo">Videos coming soon!</div>`}${nav}`;
        bindVideos(panel);
        bindTTS(() => TTS.play($$(".sent", panel).map((el) => ({ text: el.textContent, el })), "kid"));
      } else {
        renderQuiz(panel);
      }
      $("#prev", panel)?.addEventListener("click", () => show(i - 1));
      $("#next", panel)?.addEventListener("click", () => show(i + 1));
      if (seen.size > 1 && window.scrollY > 300) $(".course-layout").scrollIntoView({ behavior: "smooth" });
    }

    function renderQuiz(panel) {
      const answers = new Array(c.quiz.length).fill(null);
      panel.innerHTML = `<h2><span class="big">🏆</span>Hero quiz</h2>${ttsBar()}
        <p class="lesson-text">${SPEECH.quizIntro.map((t) => `<span class="sent">${esc(t)}</span>`).join(" ")}</p>
        ${c.quiz.map((q, qi) => `<div class="quiz-q" data-q="${qi}"><h4>${qi + 1}. ${esc(q.q)}</h4><div class="opts">${q.options.map((o, oi) => `<button class="opt" data-o="${oi}">${esc(o)}</button>`).join("")}</div><div class="explain"></div></div>`).join("")}
        <div id="quizResult"></div>`;
      bindTTS(() => TTS.play($$(".lesson-text .sent", panel).map((el) => ({ text: el.textContent, el })), "kid"));
      $$(".quiz-q", panel).forEach((qel) => {
        const qi = +qel.dataset.q, q = c.quiz[qi];
        $$(".opt", qel).forEach((b) => b.addEventListener("click", () => {
          if (answers[qi] !== null) return;
          const oi = +b.dataset.o; answers[qi] = oi;
          $$(".opt", qel).forEach((x, xi) => { x.disabled = true; if (xi === q.answer) x.classList.add("right"); });
          if (oi !== q.answer) b.classList.add("wrong");
          const ok = oi === q.answer;
          $(".explain", qel).textContent = (ok ? "✅ Correct! " : "❌ Not quite. ") + q.explain;
          TTS.play([{ text: SPEECH.quizFeedback(ok, q.explain) }], "kid");
          if (answers.every((a) => a !== null)) finish();
        }));
      });
      function finish() {
        const score = answers.filter((a, i) => a === c.quiz[i].answer).length;
        const pass = score / c.quiz.length >= 0.7;
        const res = $("#quizResult");
        const nextC = COURSES[c.step];
        if (pass) {
          const first = !isDone(c.id);
          markDone(c.id);
          confetti();
          res.innerHTML = `<div class="result"><div class="big">🏅</div><h2>You did it!</h2><p>You scored <b>${score}/${c.quiz.length}</b> and earned the <b>${esc(c.title)}</b> badge.</p>
            <div class="hero-ctas" style="justify-content:center;margin-top:20px">
              ${nextC ? `<a class="btn btn-gold" href="#/course/${nextC.id}">Next course: ${esc(nextC.title)} →</a>` : ""}
              <a class="btn btn-light" href="#/">Back to courses</a></div></div>`;
          TTS.play([{ text: SPEECH.quizPass(score, c.quiz.length, c.title) }], "kid");
          if (c.id === "ai" && first) setTimeout(secretUnlockSequence, 4500);
        } else {
          res.innerHTML = `<div class="result"><div class="big">💪</div><h2>Almost there!</h2><p>You scored <b>${score}/${c.quiz.length}</b>. Read the lessons again and have another go.</p><button class="btn btn-violet" id="retry">↻ Try again</button></div>`;
          $("#retry").onclick = () => renderQuiz(panel);
          TTS.play([{ text: SPEECH.quizFail(score, c.quiz.length) }], "kid");
        }
        res.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    show(0);
  }

  /* The moment the final course is finished… something wakes up */
  function secretUnlockSequence() {
    TTS.stop();
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:300;background:#000;display:grid;place-items:center;font-family:VT323,monospace;color:#f22;font-size:clamp(24px,4vw,44px);text-align:center;padding:20px;text-shadow:0 0 10px #f00";
    document.body.appendChild(ov);
    const lines = UNLOCK_LINES;
    let i = 0;
    const step = () => {
      if (i >= lines.length) { setTimeout(() => { ov.remove(); go("#/"); setTimeout(() => $(".secret-card")?.scrollIntoView({ behavior: "smooth", block: "center" }), 400); }, 1600); return; }
      ov.innerHTML = `<div class="${i === lines.length - 1 ? "jolt" : ""}">${esc(lines[i])}</div>`;
      if (i > 0) TTS.play([{ text: lines[i] }], "horror");
      i++; setTimeout(step, i === 1 ? 900 : 2300);
    };
    step();
  }

  /* ================================ GAMES ================================ */
  const GAMES = {
    password: { ...GAME_INFO.password, render: gamePassword },
    phish: { ...GAME_INFO.phish, render: gamePhish },
    share: { ...GAME_INFO.share, render: gameShare },
    aicheck: { ...GAME_INFO.aicheck, render: gameAI }
  };
  function renderGame(id) {
    const g = GAMES[id]; if (!g) return go("#/");
    document.title = `${g.title} · ByteGuard Academy`;
    app.innerHTML = `<section class="course-hero" style="background:linear-gradient(135deg,${g.color},${shade(g.color)})"><div class="wrap"><a class="back" href="#/" data-scroll="games">← All games</a><h1>${g.icon} ${esc(g.title)}</h1><p>${esc(g.intro)}</p></div></section>
      <div class="wrap"><div class="game-wrap"><div class="game-panel" id="game" style="--accent:${g.color}"></div></div></div>`;
    TTS.play([{ text: SPEECH.gameIntro(g) }], "kid");
    g.render($("#game"));
  }

  function gamePassword(el) {
    el.innerHTML = `<p style="margin-top:0"><b>⚠️ Never type your real password here — make up a pretend one!</b></p>
      <input class="pw-input" id="pw" placeholder="Try: PurpleTacoRocket!" autocomplete="off" spellcheck="false">
      <div class="meter"><i id="meterBar"></i></div>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px"><b id="pwLabel" style="font-size:22px;font-family:'Baloo 2'">Start typing…</b><b id="pwTime" style="color:var(--ink-2)"></b></div>
      <ul class="checks" id="checks"></ul>
      <div class="feedback good" id="pwTip">💡 Tip: string 3–4 random words together. Long beats complicated!</div>`;
    const COMMON = ["password", "123456", "qwerty", "abc123", "letmein", "iloveyou", "admin", "welcome", "monkey", "dragon", "football", "111111", "minecraft", "roblox", "fortnite"];
    const fmt = (s) => {
      const u = [["years", 31536000], ["days", 86400], ["hours", 3600], ["minutes", 60], ["seconds", 1]];
      if (s < 1) return "instantly 😱";
      if (s > 31536000 * 1e6) return "millions of years 🦕";
      for (const [n, v] of u) if (s >= v) return `about ${Math.round(s / v).toLocaleString()} ${n}`;
    };
    const update = () => {
      const p = $("#pw").value;
      const rules = [
        ["At least 12 characters", p.length >= 12],
        ["Lowercase letters", /[a-z]/.test(p)],
        ["Uppercase letters", /[A-Z]/.test(p)],
        ["Numbers", /\d/.test(p)],
        ["Symbols like ! ? #", /[^A-Za-z0-9]/.test(p)],
        ["Not a common password", p && !COMMON.some((c) => p.toLowerCase().includes(c))]
      ];
      $("#checks").innerHTML = rules.map(([t, ok]) => `<li class="${ok ? "ok" : ""}">${ok ? "✅" : "⬜"} ${t}</li>`).join("");
      let pool = 0; if (/[a-z]/.test(p)) pool += 26; if (/[A-Z]/.test(p)) pool += 26; if (/\d/.test(p)) pool += 10; if (/[^A-Za-z0-9]/.test(p)) pool += 32;
      let bits = p.length * Math.log2(pool || 1);
      if (!rules[5][1]) bits = Math.min(bits, 10);
      const secs = Math.pow(2, bits) / 1e10;
      const levels = [[28, "Super weak 😬", "#e5484d"], [40, "Weak 😕", "#ff8a3d"], [60, "Okay 🙂", "#ffcf3f"], [80, "Strong 💪", "#2ec98f"], [999, "SUPER HERO 🦸", "#6c4dff"]];
      const lv = levels.find((l) => bits < l[0]);
      $("#meterBar").style.width = p ? Math.min(100, bits / 90 * 100) + "%" : "0";
      $("#meterBar").style.background = lv[2];
      $("#pwLabel").textContent = p ? lv[1] : "Start typing…";
      $("#pwTime").textContent = p ? `A hacker's computer could crack it ${fmt(secs).startsWith("instantly") ? "" : "in "}${fmt(secs)}` : "";
    };
    $("#pw").addEventListener("input", update); update();
  }

  function quizGame(el, items, opts) {
    let i = 0, score = 0;
    const next = () => {
      if (i >= items.length) {
        const pct = score / items.length;
        el.innerHTML = `<div class="result"><div class="big">${pct >= .8 ? "🏆" : pct >= .5 ? "👍" : "💪"}</div><h2>${score} / ${items.length}</h2><p>${pct >= .8 ? "Amazing! You're a real Internet Superhero." : "Good try! Play again to level up."}</p><button class="btn btn-violet" id="again">↻ Play again</button> <a class="btn btn-light" href="#/" data-scroll="games">More games</a></div>`;
        if (pct >= .8) confetti();
        TTS.play([{ text: SPEECH.gameScore(score, items.length) }], "kid");
        $("#again").onclick = () => quizGame(el, items.sort(() => Math.random() - .5), opts);
        return;
      }
      const it = items[i];
      el.innerHTML = `<div class="score"><span>Round ${i + 1} of ${items.length}</span><span>⭐ Score: ${score}</span></div>${opts.card(it)}
        <div class="choice-row">${opts.choices.map((c, ci) => `<button class="btn ${ci ? "btn-light" : "btn-violet"}" data-c="${ci}">${c}</button>`).join("")}</div><div id="fb"></div>`;
      TTS.play([{ text: opts.speak(it) }], "kid");
      $$("[data-c]", el).forEach((b) => b.onclick = () => {
        const ok = opts.correct(it, +b.dataset.c);
        if (ok) score++;
        $$("[data-c]", el).forEach((x) => x.disabled = true);
        $("#fb").innerHTML = `<div class="feedback ${ok ? "good" : "bad"}">${ok ? "✅ Yes! " : "❌ Oops! "}${esc(it.why)}</div><div style="margin-top:16px"><button class="btn btn-gold" id="nx">Next →</button></div>`;
        TTS.play([{ text: SPEECH.gameFeedback(ok, it.why) }], "kid");
        $("#nx").onclick = () => { i++; next(); };
      });
    };
    next();
  }

  function gamePhish(el) {
    const items = [...PHISH_ITEMS].sort(() => Math.random() - .5);
    quizGame(el, items, {
      choices: ["🎣 Phish!", "✅ Legit"],
      card: (it) => `<div class="msg-card"><div class="from">From: ${esc(it.from)}</div><div class="subj">${esc(it.subj)}</div><div>${esc(it.body)}</div></div>`,
      speak: SPEECH.phish,
      correct: (it, c) => (c === 0) === it.phish
    });
  }

  function gameShare(el) {
    const items = [...SHARE_ITEMS].sort(() => Math.random() - .5);
    quizGame(el, items, {
      choices: ["🔒 Keep secret", "👍 OK to share"],
      card: (it) => `<div class="sort-item">${esc(it.t)}</div>`,
      speak: SPEECH.share,
      correct: (it, c) => (c === 0) === it.keep
    });
  }

  function gameAI(el) {
    const items = [...AI_ITEMS].sort(() => Math.random() - .5);
    quizGame(el, items, {
      choices: ["✅ True", "❌ False"],
      card: (it) => `<div class="msg-card" style="border-color:#ffd2b5;background:#fff8f3"><div class="from">🤖 ChatBot 3000 says, very confidently:</div><div class="subj">“${esc(it.t)}” <span style="font-size:15px;color:var(--muted)">I'm 100% sure! 😊</span></div></div>`,
      speak: SPEECH.ai,
      correct: (it, c) => (c === 0) === it.truth
    });
    const note = document.createElement("p");
    note.className = "feedback good";
    note.innerHTML = "🧠 Notice: the robot sounds <b>just as sure</b> when it's wrong. That's why you always check real sources!";
    el.after(note);
  }

  /* ============================= CERTIFICATE ============================= */
  function renderCert() {
    if (COURSES.some((c) => !isDone(c.id))) { toast("Finish all courses to get your certificate!"); return go("#/"); }
    app.innerHTML = `<section class="course-hero" style="background:linear-gradient(135deg,#6c4dff,#2a1690)"><div class="wrap"><a class="back" href="#/">← Home</a><h1>🎓 Your Certificate</h1><p>Type your first name and print it out!</p></div></section>
      <div class="wrap"><div class="game-wrap"><div class="game-panel">
        <input class="pw-input" id="nm" placeholder="Your first name" value="${esc(P.name)}" maxlength="30" style="margin-bottom:20px">
        <div class="cert"><div style="font-size:60px">🛡️</div><h2>Internet Superhero</h2><p>This certifies that</p><div class="name" id="cn">${esc(P.name || "Your Name")}</div>
        <p>has completed all ${COURSES.length} ByteGuard Academy courses in privacy, cybersecurity and thinking for yourself.</p>
        <p style="font-weight:800">${new Date().toLocaleDateString()}</p></div>
        <div style="text-align:center;margin-top:20px"><button class="btn btn-gold" onclick="window.print()">🖨️ Print certificate</button></div>
      </div></div></div>`;
    $("#nm").oninput = (e) => { P.name = e.target.value; save(); $("#cn").textContent = P.name || "Your Name"; };
    confetti();
  }

  /* ================================ SECRET ================================ */
  const Horror = {
    ctx: null, nodes: [], on: true,
    start() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        this.ctx = this.ctx || new AC(); const ctx = this.ctx; ctx.resume();
        const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
        master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 4);
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 220; lp.connect(master);
        [41.2, 43.1, 61.7].forEach((f) => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.connect(lp); o.start(); this.nodes.push(o); });
        const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.08; lg.gain.value = 120; lfo.connect(lg); lg.connect(lp.frequency); lfo.start(); this.nodes.push(lfo);
        this.master = master;
      } catch (e) {}
    },
    duck() { if (Horror.master && Horror.ctx) Horror.master.gain.linearRampToValueAtTime(0.0, Horror.ctx.currentTime + 1); },
    stop() { this.nodes.forEach((n) => { try { n.stop(); } catch (e) {} }); this.nodes = []; this.master = null; },
    sting() {
      if (!this.ctx || !this.master) return;
      const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "square"; o.frequency.setValueAtTime(880, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + .6);
      g.gain.setValueAtTime(.08, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .7);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .7);
    }
  };

  let joltTimer = null, chapterObs = null;
  function renderSecret() {
    if (!secretOpen()) { toast("🔒 This file is still encrypted."); return go("#/"); }
    document.title = "THE TAKEOVER";
    document.body.classList.add("horror");
    app.innerHTML = `<div class="horror-root"><div class="noise"></div>
      <div class="gate"><div>
        <div class="warning">&gt; CLASSIFIED FILE 07 // CLEARANCE: HUMAN</div>
        <h1>THE TAKEOVER</h1>
        <p>This secret file contains spooky scenes from old movies and shows about machines taking over the world. It's dark in here. Brave humans only. If you get scared, close it and talk to a grown-up.</p>
        <button class="btn btn-blood" id="enter">ENTER, IF YOU DARE</button>
        <a class="btn btn-dead" href="#/" style="margin-left:10px">I'm not ready</a>
      </div></div></div>`;
    $("#enter").onclick = startSecret;
  }

  function startSecret() {
    Horror.start(); Horror.sting();
    window.scrollTo({ top: 0, behavior: "instant" });
    const root = $(".horror-root");
    root.innerHTML = `<div class="noise"></div>
      <div class="terminal" id="term"></div>
      <div id="chapters" style="display:none">
        ${SECRET.chapters.map((c, i) => `
        <section class="chapter" data-i="${i}">
          <div class="yr">${c.year}</div>
          <div class="film">FILE ${String(i + 1).padStart(3, "0")} · ${esc(c.film)} · ${c.year}</div>
          <h2>${esc(c.title)}</h2>
          <p class="story">${esc(c.text)}</p>
          <div class="media ${c.image ? "" : "single"}">
            ${c.video ? videoHTML(c.video) : ""}
            ${c.image ? `<figure class="photo" style="margin:0"><img src="${esc(c.image.src)}" alt="" loading="lazy" referrerpolicy="no-referrer"><figcaption>${esc(c.image.cap)}</figcaption></figure>` : ""}
          </div>
          <div class="warning">&gt; HUMAN LESSON: ${esc(c.lesson)}</div>
        </section>`).join("")}
        <section class="chapter">
          <div class="film">RECOVERED FILES</div><h2>They Were Always Here</h2>
          <div class="gallery">${SECRET.pictures.map((p) => `<figure class="photo" style="margin:0"><img src="${esc(p.src)}" alt="" loading="lazy" referrerpolicy="no-referrer"><figcaption>${esc(p.cap)}</figcaption></figure>`).join("")}</div>
        </section>
        <section class="chapter final" id="final">
          <div class="eye-big"></div>
          <div class="terminal" id="outro"></div>
          <div style="text-align:center;padding-bottom:60px;position:relative;z-index:5"><a class="btn btn-blood" href="#/" id="escape">RETURN TO THE HUMAN WORLD</a></div>
        </section>
      </div>
      <div class="h-controls"><button id="hVoice">VOICE: ON</button><button id="hSound">SOUND: ON</button><a href="#/"><button>EXIT</button></a></div>`;

    let voiceOn = true, soundOn = true;
    $("#hVoice").onclick = () => { voiceOn = !voiceOn; if (!voiceOn) TTS.stop(); $("#hVoice").textContent = "VOICE: " + (voiceOn ? "ON" : "OFF"); };
    $("#hSound").onclick = () => { soundOn = !soundOn; if (soundOn) Horror.start(); else Horror.stop(); $("#hSound").textContent = "SOUND: " + (soundOn ? "ON" : "OFF"); };
    const say = (text, done) => { if (voiceOn) TTS.play([{ text }], "horror", done); else done && setTimeout(done, 1200); };

    typeLines($("#term"), SECRET.intro, say, () => {
      $("#chapters").style.display = "block";
      bindVideos(root);
      const t = document.createElement("div"); t.className = "line"; t.textContent = "> SCROLL DOWN. IF YOU DARE. ↓"; $("#term").appendChild(t);
      chapterObs = new IntersectionObserver((ents) => ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = e.target.dataset.i;
        if (i !== undefined && !e.target._read) {
          e.target._read = true; Horror.sting();
          document.body.classList.add("jolt"); setTimeout(() => document.body.classList.remove("jolt"), 400);
          const c = SECRET.chapters[+i]; say(SPEECH.chapter(c));
        }
        if (e.target.id === "final" && !e.target._read) {
          e.target._read = true;
          typeLines($("#outro"), SECRET.outro, say, () => { P.secretDone = true; save(); });
        }
      }), { threshold: 0.45 });
      $$(".chapter[data-i], #final").forEach((s) => chapterObs.observe(s));
    });

    clearInterval(joltTimer);
    joltTimer = setInterval(() => { if (Math.random() < .35) { document.body.classList.add("jolt"); setTimeout(() => document.body.classList.remove("jolt"), 380); } }, 9000);
  }

  function typeLines(box, lines, say, done) {
    let li = 0;
    const nextLine = () => {
      if (!document.body.contains(box)) return;
      if (li >= lines.length) { done && done(); return; }
      const div = document.createElement("div"); div.className = "line"; box.appendChild(div);
      const text = lines[li++]; let ci = 0;
      const cur = document.createElement("span"); cur.className = "cursor";
      let spoken = false, typed = false;
      const maybe = () => { if (spoken && typed) setTimeout(nextLine, 500); };
      say(text, () => { spoken = true; maybe(); });
      const tick = () => {
        if (!document.body.contains(box)) return;
        div.textContent = "> " + text.slice(0, ++ci); div.appendChild(cur);
        if (ci < text.length) setTimeout(tick, 28 + Math.random() * 40);
        else { cur.remove(); typed = true; maybe(); }
      };
      tick();
      // Safety net if speech never fires its end event
      setTimeout(() => { if (!spoken) { spoken = true; maybe(); } }, 2500 + text.length * 110);
    };
    nextLine();
  }

  function leaveSecret() {
    document.body.classList.remove("horror", "jolt");
    Horror.stop(); clearInterval(joltTimer); chapterObs && chapterObs.disconnect();
  }

  /* ================================ ROUTER =============================== */
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  let pendingScroll = null;
  function route() {
    TTS.stop(); TTS.onState = null; leaveSecret(); clearInterval(whisperTimer);
    $$(".whisper").forEach((w) => w.remove());
    document.body.classList.remove("haunted");
    const [, page, id] = (location.hash || "#/").split("/");
    if (page !== "" && page !== undefined) window.scrollTo({ top: 0, behavior: "instant" });
    if (page === "course") renderCourse(id);
    else if (page === "game") renderGame(id);
    else if (page === "secret") renderSecret();
    else if (page === "certificate") renderCert();
    else { renderHome(pendingScroll); }
    pendingScroll = null;
  }
  window.addEventListener("hashchange", route);

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-scroll]");
    if (a) {
      e.preventDefault();
      const target = a.dataset.scroll;
      if ((location.hash || "#/") === "#/" && document.getElementById(target)) document.getElementById(target).scrollIntoView({ behavior: "smooth" });
      else { pendingScroll = target; go("#/"); }
      return;
    }
    const card = e.target.closest(".course-card[data-locked='true']");
    if (card) { e.preventDefault(); toast(`🔒 Finish Step ${card.dataset.step - 1} first to unlock this course!`); }
  });

  $("#resetProgress").onclick = () => { if (confirm("Reset all your progress and badges?")) { P = { done: [], secretDone: false, unlockAll: false, name: "" }; save(); go("#/"); toast("Progress reset."); } };
  $("#unlockAll").onclick = () => { P.unlockAll = true; save(); go("#/"); toast("🔓 All courses unlocked for preview. (The secret course still needs the AI course finished!)"); };

  route();
})();
