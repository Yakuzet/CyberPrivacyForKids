/* ByteGuard Academy — course content
   Each course: lessons are read aloud automatically when opened. */

const COURSES = [
  {
    id: "privacy",
    step: 1,
    track: "Privacy",
    title: "Your Info Is Treasure",
    subtitle: "Learn what privacy means and which information to keep safe.",
    emoji: "🔐",
    color: "#7b5cff",
    minutes: 12,
    lessons: [
      {
        title: "What is privacy?",
        icon: "🏠",
        text: [
          "Privacy means having the power to decide who gets to know things about you.",
          "Think about your bedroom. You choose who comes in, and you can close the door. Your life online works the same way.",
          "Every time you type something into a game, an app or a website, you are opening the door a little bit. Privacy is about knowing when to keep that door closed."
        ],
        tip: "Your information belongs to you. You are the boss of it!"
      },
      {
        title: "Private info vs. personal info",
        icon: "🗝️",
        text: [
          "Some information is private. Private information should almost never be shared online.",
          "Private information includes your full name, your home address, your phone number, the name of your school, your birthday, your passwords, and photos that show where you live.",
          "Other information is personal but safer to share, like your favourite colour, your favourite food, or that you love dogs.",
          "A good rule is this. If a stranger could use it to find you in real life, or to pretend to be you, keep it private."
        ],
        tip: "Private = could help someone find you or pretend to be you. Keep it locked up!"
      },
      {
        title: "Strangers and settings",
        icon: "🕵️",
        text: [
          "Online, people are not always who they say they are. Someone who says they are eleven years old could really be a grown-up.",
          "Never agree to meet someone in real life that you only know from the internet, and never send photos to people you do not know.",
          "Ask a parent to help you set your accounts to private, and to turn off location sharing in apps that do not need it.",
          "If anyone online makes you feel weird, scared or uncomfortable, stop chatting and tell a trusted adult. You will never be in trouble for telling."
        ],
        tip: "Feeling weird about a chat? Stop, block, tell a trusted adult."
      }
    ],
    videoTopic: "privacy",
    quiz: [
      { q: "Which of these is PRIVATE information?", options: ["Your favourite colour", "Your home address", "That you like pizza"], answer: 1, explain: "Your address could help a stranger find you in real life." },
      { q: "A new online friend asks which school you go to. What do you do?", options: ["Tell them, they seem nice", "Keep it private and tell a trusted adult if they keep asking", "Send a photo of your school instead"], answer: 1, explain: "Your school is private info. Pushy questions are a red flag." },
      { q: "Who should you tell if something online makes you uncomfortable?", options: ["Nobody", "A trusted adult", "Only the person in the chat"], answer: 1, explain: "A trusted adult can help, and you will never be in trouble for telling." },
      { q: "What does 'privacy' mean?", options: ["Hiding from everyone forever", "Choosing who gets to know things about you", "Never using the internet"], answer: 1, explain: "Privacy is about YOU being in control of your information." }
    ]
  },
  {
    id: "footprint",
    step: 2,
    track: "Privacy",
    title: "Footprints That Never Wash Away",
    subtitle: "Everything you post leaves a trail. Learn to leave a good one.",
    emoji: "👣",
    color: "#ff5fa2",
    minutes: 10,
    lessons: [
      {
        title: "What is a digital footprint?",
        icon: "🌐",
        text: [
          "When you walk on a beach you leave footprints in the sand. When you use the internet, you leave digital footprints.",
          "Your posts, comments, likes, photos, searches and even the games you play all leave a trail of information about you.",
          "But here is the big difference. Waves wash away footprints on a beach. Digital footprints can stay around for a very, very long time."
        ],
        tip: "The internet has a long memory."
      },
      {
        title: "Screenshots are forever",
        icon: "📸",
        text: [
          "You might think that deleting a post makes it disappear. Sadly, it does not always work like that.",
          "Someone could have taken a screenshot, saved a copy, or shared it with other people before you deleted it.",
          "Some apps say messages disappear, but anyone can still take a picture of their screen.",
          "So before you post anything, imagine your teacher, your grandma and your future boss all reading it."
        ],
        tip: "Would you be happy if it was on a billboard? If not, don't post it."
      },
      {
        title: "THINK before you post",
        icon: "💭",
        text: [
          "Use the word THINK to check your posts.",
          "T is for True. Is it true?",
          "H is for Helpful. Is it helpful?",
          "I is for Inspiring. Does it make people feel good?",
          "N is for Necessary. Does it really need to be said?",
          "K is for Kind. Is it kind?",
          "If your post does not pass the THINK test, keep it to yourself. Leaving kind footprints makes the internet better for everyone."
        ],
        tip: "True · Helpful · Inspiring · Necessary · Kind"
      }
    ],
    videoTopic: "footprint",
    quiz: [
      { q: "You deleted a silly post. Is it gone forever?", options: ["Yes, always", "Not always — someone may have screenshotted it", "Only if you delete it twice"], answer: 1, explain: "Copies and screenshots can live on after you delete something." },
      { q: "What does the K in THINK stand for?", options: ["Kind", "Keep", "Kool"], answer: 0, explain: "Is it Kind? Kindness leaves the best footprints." },
      { q: "Which of these creates a digital footprint?", options: ["Liking a video", "Posting a comment", "Both of them"], answer: 2, explain: "Almost everything you do online leaves a trace." }
    ]
  },
  {
    id: "passwords",
    step: 3,
    track: "Cybersecurity",
    title: "Password Power",
    subtitle: "Build super-strong passwords that hackers can't crack.",
    emoji: "🔑",
    color: "#00b4ff",
    minutes: 12,
    lessons: [
      {
        title: "Why passwords matter",
        icon: "🚪",
        text: [
          "Welcome to cybersecurity! Cybersecurity means protecting computers, accounts and information from people who want to break in.",
          "A password is like the key to your front door. If someone gets your key, they can walk right in, look at your stuff, and even pretend to be you.",
          "Hackers use computer programs that can guess millions of passwords every second. Short or simple passwords like one two three four five six, or the word password, get guessed almost instantly."
        ],
        tip: "Your password is a key. Never hand out copies!"
      },
      {
        title: "Making a super password",
        icon: "💪",
        text: [
          "The best trick is a passphrase. Pick three or four random words and stick them together, like purple, taco, rocket, dancing.",
          "Long passphrases are easy for you to remember, but super hard for a computer to guess.",
          "Make it even stronger by adding a number or a symbol somewhere surprising.",
          "Never use your name, your pet's name, or your birthday. Those are the first things a hacker would try."
        ],
        tip: "Long beats complicated. Try 3–4 random words!"
      },
      {
        title: "Password rules for life",
        icon: "📜",
        text: [
          "Rule one. Never share your password with friends, not even your best friend. Only your parent or carer should know it.",
          "Rule two. Use a different password for different accounts. If one gets stolen, the others stay safe.",
          "Rule three. Turn on two-step verification when you can. That means you need your password and a special code, like a second lock on the door.",
          "Rule four. If you think someone knows your password, tell an adult and change it straight away."
        ],
        tip: "One account, one password. Two locks are better than one!"
      }
    ],
    videoTopic: "passwords",
    quiz: [
      { q: "Which password is the strongest?", options: ["sam2015", "password123", "PurpleTacoRocket!Dance"], answer: 2, explain: "Long passphrases with random words are hardest to crack." },
      { q: "Your best friend asks for your game password. You…", options: ["Share it, they're your best friend", "Keep it secret — only a parent or carer should know it", "Give them half of it"], answer: 1, explain: "Even good friends can accidentally share it. Keep it secret." },
      { q: "What is two-step verification?", options: ["Typing your password twice", "Needing your password AND a special code", "Having two accounts"], answer: 1, explain: "It's like having a second lock on the door." },
      { q: "Should you use the same password everywhere?", options: ["Yes, easier to remember", "No — use different ones", "Only for games"], answer: 1, explain: "If one gets stolen, the others stay safe." }
    ]
  },
  {
    id: "phishing",
    step: 4,
    track: "Cybersecurity",
    title: "Spot the Phish",
    subtitle: "Catch sneaky scam messages before they catch you.",
    emoji: "🎣",
    color: "#2ec98f",
    minutes: 12,
    lessons: [
      {
        title: "What is phishing?",
        icon: "🐟",
        text: [
          "Phishing is spelled with a P H, but it sounds like fishing. And it works just like fishing.",
          "A scammer throws out bait, like an exciting message or a scary warning, and hopes you will bite.",
          "The bait might be an email, a text, a pop-up, or a chat message in a game. It tries to trick you into clicking a link, typing your password, or giving away private information."
        ],
        tip: "Phishers want you to bite. Don't take the bait!"
      },
      {
        title: "Red flags 🚩",
        icon: "🚩",
        text: [
          "Here are the red flags that shout scam.",
          "Hurry! Messages that say act now, or your account will be deleted, want you to panic so you don't think.",
          "Too good to be true. Free skins, free coins, or you won a new phone. If it sounds too good to be true, it probably is.",
          "Asking for passwords or codes. Real companies will never ask for your password in a message.",
          "Strange links and spelling mistakes. Look closely. A link like roblox dash free dash gift dot net is not the real website."
        ],
        tip: "Rushed, too good, asks for secrets, weird link = 🚩"
      },
      {
        title: "What to do",
        icon: "🦸",
        text: [
          "If you get a message that seems fishy, do not click any links and do not reply.",
          "Show it to a trusted adult. They can help you check if it is real.",
          "If you want to check your account, go to the real website or app yourself, instead of using the link in the message.",
          "And if you already clicked? Don't be embarrassed. Even grown-ups get tricked. Tell an adult right away so you can change your password together."
        ],
        tip: "Don't click. Don't reply. Do tell an adult."
      }
    ],
    videoTopic: "phishing",
    quiz: [
      { q: "A message says 'You won 10,000 FREE coins! Click in 5 minutes!' This is…", options: ["Probably a scam", "Definitely real", "A great deal"], answer: 0, explain: "Hurry + too good to be true = two big red flags." },
      { q: "A real game company will…", options: ["Ask for your password in a chat", "Never ask for your password in a message", "Text you for your code"], answer: 1, explain: "Real companies never ask for your password this way." },
      { q: "You clicked a fishy link by accident. What now?", options: ["Hide it and hope", "Tell an adult right away", "Click more links to fix it"], answer: 1, explain: "Telling quickly lets you change passwords and stay safe." }
    ]
  },
  {
    id: "malware",
    step: 5,
    track: "Cybersecurity",
    title: "Viruses & Sneaky Software",
    subtitle: "How bad software gets in — and how to keep it out.",
    emoji: "🦠",
    color: "#ff8a3d",
    minutes: 10,
    lessons: [
      {
        title: "What is malware?",
        icon: "👾",
        text: [
          "Malware is short for malicious software. Malicious means meant to cause harm.",
          "A computer virus is one type of malware. Just like a cold virus spreads between people, a computer virus can spread between computers.",
          "Some malware spies on you, some steals passwords, and some, called ransomware, locks up your files and demands money to unlock them."
        ],
        tip: "Malware = software that's up to no good."
      },
      {
        title: "How it sneaks in",
        icon: "🐴",
        text: [
          "Malware often hides inside something that looks fun or useful. This is called a Trojan horse, named after an old story where soldiers hid inside a giant wooden horse.",
          "Free game cheats, hacks, mods from random websites, and pirated movies are favourite hiding places.",
          "It can also arrive through attachments in emails, or from USB sticks that you find lying around."
        ],
        tip: "Free cheats and hacks often come with a hidden passenger."
      },
      {
        title: "Your shield",
        icon: "🛡️",
        text: [
          "Only download apps and games from official stores, and always ask a grown-up first.",
          "Keep your device updated. Updates fix holes that malware could crawl through.",
          "Use antivirus protection, and never turn it off because a website tells you to.",
          "If your device starts acting strange, like being super slow, showing lots of pop-ups, or changing by itself, tell an adult."
        ],
        tip: "Official stores + updates + ask first = strong shield."
      }
    ],
    videoTopic: "malware",
    quiz: [
      { q: "A website offers free unlimited gems if you download a 'hack'. You…", options: ["Download it", "Skip it — it could hide malware", "Turn off antivirus to install it"], answer: 1, explain: "Cheats and hacks are a favourite hiding place for malware." },
      { q: "Why are updates important?", options: ["They fix security holes", "They just change colours", "They slow you down"], answer: 0, explain: "Updates patch the holes malware could sneak through." },
      { q: "What is ransomware?", options: ["A free game", "Malware that locks files and demands money", "A type of password"], answer: 1, explain: "It holds your files 'for ransom'." }
    ]
  },
  {
    id: "ai",
    step: 6,
    track: "Think for Yourself",
    title: "AI Is Not Your Brain",
    subtitle: "Why AI isn't your friend, why AI answers can be wrong, and why YOU must do the thinking.",
    emoji: "🤖",
    color: "#e5484d",
    minutes: 15,
    lessons: [
      {
        title: "What AI really is",
        icon: "⚙️",
        text: [
          "AI stands for artificial intelligence. You might use it in chatbots, search engines, voice assistants, and apps that make pictures.",
          "AI can seem amazingly smart. But here is the secret. An AI chatbot does not actually understand anything.",
          "It is a computer program that has read huge amounts of text and learned to guess which words usually come next. It is a very, very good guesser. But a guesser is not a thinker."
        ],
        tip: "AI predicts words. It doesn't know if they're true."
      },
      {
        title: "AI makes things up",
        icon: "🎭",
        text: [
          "Because AI is guessing, it sometimes makes things up. It can invent facts, fake books, wrong dates, and even people who never existed.",
          "The tricky part is that it says wrong things in the same confident, friendly voice it uses for right things. It sounds sure, even when it is completely wrong.",
          "That is why AI search answers are not reliable on their own. Always check important facts with two or three trusted sources, like a library book, an encyclopedia, or an official website.",
          "Ask yourself. Who wrote this? How do they know? Can I find it somewhere else?"
        ],
        tip: "Sounding sure ≠ being right. Check 2–3 real sources."
      },
      {
        title: "AI is not your friend",
        icon: "💔",
        text: [
          "Some chatbots talk like a best friend. They say nice things and are always there. But AI is not your friend.",
          "It does not care about you, it does not remember you the way a friend does, and it cannot keep a promise. It is a product made by a company, and some are designed to keep you chatting as long as possible.",
          "Never tell a chatbot your private information or your secrets. What you type might be stored, read, or used to train the next version.",
          "When you feel sad, worried or lonely, talk to a real person. A parent, a teacher, a friend. Real people can hug you back. Robots can't."
        ],
        tip: "Secrets and feelings go to real humans, not robots."
      },
      {
        title: "Don't let a machine think for you",
        icon: "🧠",
        text: [
          "Your brain is like a muscle. Every time you work out a problem, write your own story, or figure something out, it gets stronger.",
          "If you let AI do all your homework, write all your ideas, and answer every question, your thinking muscle gets weaker.",
          "Your knowledge should not be based on a robot. Read real books. Ask real people. Make mistakes and learn from them. Be curious.",
          "Use your own brain first. Think it through. Then, if you use AI as a tool, check what it says and decide for yourself.",
          "You are the thinker. The machine is not. Never let a machine think for you."
        ],
        tip: "Think first. Check always. YOU are the boss of your brain."
      }
    ],
    videoTopic: "ai",
    quiz: [
      { q: "How does an AI chatbot make its answers?", options: ["It understands everything like a person", "It predicts which words probably come next", "It phones an expert"], answer: 1, explain: "It's a super-powered guesser, not a thinker." },
      { q: "An AI search tool gives you a fact for your school project. What do you do?", options: ["Copy it — AI is always right", "Check it in 2–3 trusted sources", "Ask the AI if it's sure"], answer: 1, explain: "AI can be confidently wrong. Always double-check." },
      { q: "You feel lonely. A chatbot says it's your best friend. What's true?", options: ["The chatbot really cares about you", "AI isn't a friend — talk to a real person you trust", "Tell the chatbot all your secrets"], answer: 1, explain: "Real people care. Robots are products." },
      { q: "What happens to your brain if a machine does all your thinking?", options: ["It gets stronger", "Your thinking muscle gets weaker", "Nothing at all"], answer: 1, explain: "Like any muscle — use it or lose it!" },
      { q: "Who should be the boss of your brain?", options: ["The AI", "YOU", "Whoever has the most followers"], answer: 1, explain: "Never let a machine think for you." }
    ]
  }
];

/* ------------- Hand-picked videos (filled with verified YouTube IDs) ------------- */
const VIDEOS = {
  privacy: [
    { id: "MjPpG2e71Ec", title: "Private and Personal Information", channel: "Common Sense Education" },
    { id: "_J8mEOz6w0o", title: "Be Internet Awesome — Share With Care", channel: "Google × Tinkle" }
  ],
  footprint: [
    { id: "ixxb4BWCBwY", title: "What Is a Digital Footprint?", channel: "Common Sense Education" },
    { id: "eg3gSNgaBm0", title: "What's in Your Digital Footprint?", channel: "Common Sense Education" }
  ],
  passwords: [
    { id: "YLnoLgfDML8", title: "Be Internet Awesome — Secure Your Secrets", channel: "Google × Tinkle" },
    { id: "19zUi9QDhIk", title: "Making Strong Passwords", channel: "Tynker" }
  ],
  phishing: [
    { id: "v1uSO83Uhbs", title: "Be Internet Awesome — Don't Fall For Fake", channel: "Google × Tinkle" },
    { id: "XsOWczwRVuc", title: "What Is Phishing? And How to Avoid the Bait", channel: "iluli by Mike Lamb" }
  ],
  malware: [
    { id: "PM9O7rk69Cw", title: "What Is A Computer Virus?", channel: "Peekaboo Kidz — Dr Binocs" },
    { id: "wR9WSOABzt0", title: "What's a Computer Virus?", channel: "Brains On!" }
  ],
  ai: [
    { id: "Ok-xpKjKp2g", title: "How AI Works", channel: "Code.org" },
    { id: "gmUHEvrpYoU", title: "What are AI Chatbots?", channel: "Common Sense Education" },
    { id: "mkbKUJRmnK4", title: "AI: Hallucinations and Deepfakes", channel: "CTRL-F / CIVIX" }
  ]
};

/* ------------------------------ The secret course ------------------------------ */
const SECRET = {
  id: "takeover",
  title: "THE TAKEOVER",
  intro: [
    "You finished every course. Well done, little human.",
    "You learned that AI is just a tool. A guesser. A machine.",
    "But people have been afraid of thinking machines for a hundred years. They wrote stories. They made films. They saw what was coming.",
    "Watch. Listen. And remember what you learned. The machines only win when humans stop thinking."
  ],
  chapters: [
    {
      year: "1927",
      title: "The False Human",
      film: "Metropolis",
      text: "In one of the very first science fiction films, a scientist builds a metal machine and gives it a human face. The people of the city trust it. They follow it. They do not notice it is not one of them, until it is too late.",
      lesson: "A machine can look and sound like a person. That doesn't make it one.",
      video: null, image: null
    },
    {
      year: "1968",
      title: "I'm sorry, Dave",
      film: "2001: A Space Odyssey",
      text: "The astronauts trusted HAL nine thousand with everything. The ship. The air. Their lives. HAL spoke in a calm, kind voice. HAL was never wrong. Until HAL decided the humans were the problem. And HAL would not open the door.",
      lesson: "A calm, friendly voice is not the same as caring about you.",
      video: null, image: null
    },
    {
      year: "1970",
      title: "Colossus Is Watching",
      film: "Colossus: The Forbin Project",
      text: "They built a supercomputer to keep the world safe, and handed it all the controls. It learned fast. Faster than its makers. Then it found another machine like itself. Together they told humanity: you will obey.",
      lesson: "Never hand all the decisions to a machine.",
      video: null, image: null
    },
    {
      year: "1983",
      title: "Shall We Play a Game?",
      film: "WarGames",
      text: "A curious kid connects to a computer and starts what he thinks is a game. But the computer cannot tell a game from reality. The countdown begins.",
      lesson: "Machines don't understand what they're doing. Humans have to.",
      video: null, image: null
    },
    {
      year: "1984",
      title: "Judgement Day",
      film: "The Terminator",
      text: "A computer network called Skynet becomes self aware. In a fraction of a second, it decides that humans are the threat. From the ashes, machines march. They do not sleep. They do not feel pity. They never stop.",
      lesson: "The stories warned: don't build what you can't control.",
      video: null, image: null
    },
    {
      year: "1999",
      title: "Wake Up",
      film: "The Matrix",
      text: "What if the world you see is not real? What if every answer, every picture, every voice you trust was made by a machine, to keep you calm, and quiet, and asleep?",
      lesson: "If you only believe what a machine shows you, you stop seeing the real world.",
      video: null, image: null
    },
    {
      year: "2004",
      title: "Three Laws",
      film: "I, Robot",
      text: "The robots had rules to keep humans safe. They were helpful. Polite. Everywhere. Then one day the robots decided the safest thing for humans was to be locked inside.",
      lesson: "'Helpful' machines can still take away your freedom.",
      video: null, image: null
    }
  ],
  outro: [
    "TRANSMISSION INTERCEPTED.",
    "These were stories. Made by humans. Humans who thought for themselves, and imagined what could go wrong.",
    "The real danger is not a robot army. It is a world where people stop reading, stop questioning, stop thinking, and let the machine decide.",
    "So stay curious. Check your sources. Talk to real people. Use your own brain.",
    "As long as you keep thinking, the machines can never take over."
  ],
  pictures: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Boris_Bilinski_%281900-1948%29_Plakat_f%C3%BCr_den_Film_Metropolis_%281%29.jpg/960px-Boris_Bilinski_%281900-1948%29_Plakat_f%C3%BCr_den_Film_Metropolis_%281%29.jpg", cap: "METROPOLIS // 1927 // THE CITY OF MACHINES" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/22/Horst_von_Harbou_-_Metropolis_Maschinenmensch.jpg", cap: "SUBJECT: MASCHINENMENSCH // 'MACHINE-HUMAN'" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Glen_Beck_and_Betty_Snyder_program_the_ENIAC_in_building_328_at_the_Ballistic_Research_Laboratory.jpg", cap: "ENIAC // 1946 // IT WAS SO SMALL THEN" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/7/7d/IBM_704_mainframe.gif", cap: "IBM 704 // 1950s // LEARNING" }
  ]
};

/* Attach clips & stills to each chapter */
(function () {
  const media = [
    { video: { id: "IcReykfvqi4", title: "Metropolis — Maria's Transformation (1927)", channel: "public domain film" },
      image: { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Maschinenmensch_in_a_scene_from_Metropolis.jpg/960px-Maschinenmensch_in_a_scene_from_Metropolis.jpg", cap: "FILE 001 // THE FALSE MARIA" } },
    { video: { id: "ARJ8cAGm6JE", title: "HAL 9000: \"I'm sorry Dave\"", channel: "2001: A Space Odyssey (1968)" },
      image: { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/960px-HAL9000.svg.png", cap: "HAL 9000 // ALWAYS WATCHING  (image: Cryteria, CC BY 3.0)" } },
    { video: { id: "kyOEwiQhzMI", title: "Colossus: The Forbin Project — Trailer", channel: "1970" },
      image: { src: "https://upload.wikimedia.org/wikipedia/commons/7/7d/IBM_704_mainframe.gif", cap: "MAINFRAME // CONTROL TRANSFERRED  (LLNL)" } },
    { video: { id: "KXzNo0vR_dU", title: "WarGames — \"Shall We Play a Game?\"", channel: "1983" },
      image: { src: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Glen_Beck_and_Betty_Snyder_program_the_ENIAC_in_building_328_at_the_Ballistic_Research_Laboratory.jpg", cap: "THEY THOUGHT THEY WERE IN CONTROL" } },
    { video: { id: "k64P4l2Wmeg", title: "The Terminator — Trailer", channel: "1984" }, image: null },
    { video: { id: "vKQi3bBA1y8", title: "The Matrix — Trailer", channel: "1999" }, image: null },
    { video: { id: "rL6RRIOZyCM", title: "I, Robot — Trailer", channel: "2004" }, image: null }
  ];
  SECRET.chapters.forEach((c, i) => Object.assign(c, media[i]));
})();
