/* =========================================================
   HIROKE // NINKY — I18N + THEME ENGINE
   Two languages (ID/EN), two lightings (Rift/Dawn), one sigil.
   ========================================================= */

const HK_LANG_KEY  = 'hiroke-lang';
const HK_THEME_KEY = 'hiroke-theme';

const HK_DICT = {
  id: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.schedule': 'Jadwal',
    'nav.social': 'Social Feed',
    'nav.admin': 'Control Panel',
    'nav.contact': 'Contact',
    'brand.sub': 'HALF-DEMON // HYBRID CREATOR',

    'loader.home': 'OPENING THE <span>RIFT</span>',
    'loader.about': 'READING <span>LORE FILE</span>',
    'loader.schedule': 'SYNCING <span>CALENDAR</span>',
    'loader.social': 'CONNECTING <span>CHANNELS</span>',

    'hero.eyebrow': 'LIVE FROM THE RIFT',
    'hero.tag.fallback': 'Half in the light, half in the abyss.',
    'hero.desc.fallback': 'A hybrid entity torn between two worlds.',
    'hero.cta.youtube': 'Tonton di YouTube',
    'hero.cta.schedule': 'Lihat Jadwal Stream',
    'hero.status.next.fallback': 'Next stream soon.',

    'stats.eyebrow': 'REALTIME PRESENCE',
    'stats.title.html': 'Dua sisi, <span class="grad-text">satu kehadiran</span>',
    'stats.yt': 'YouTube Subscribers',
    'stats.tt': 'TikTok Followers',
    'stats.views': 'Total Views',
    'stats.dev': 'Dev Discipline',
    'stats.note': 'Angka diperbarui berkala. Sambungkan API YouTube Data v3 &amp; proxy TikTok di versi Full-Stack untuk data 100% live.',

    'duality.demon.eyebrow': 'SISI IBLIS',
    'duality.demon.title': 'VTuber & Entertainer',
    'duality.demon.text': 'Stream, nyanyi, ngobrol bareng chat, dan momen-momen kacau yang lahir dari sisi liar Hiroke.',
    'duality.circuit.eyebrow': 'SISI MESIN',
    'duality.circuit.title': 'Designer & Developer',
    'duality.circuit.text': 'Ngoding fitur baru, live-coding project open-source, jasa freelance, dan membangun tools untuk komunitas creator.',

    'quick.eyebrow': 'JELAJAHI',
    'quick.about.title': 'About',
    'quick.about.text': 'Lore, kepribadian, dan asal-usul Hiroke.',
    'quick.schedule.title': 'Jadwal Stream',
    'quick.schedule.text': 'Kalender minggu ini & reminder.',
    'quick.social.title': 'Social Feed',
    'quick.social.text': 'YouTube, TikTok, dan semua channel promosi.',

    'footer.brand': 'HIROKE // NINKY',
    'footer.bio.fallback': 'Half-demon hybrid creator.',
    'footer.nav': 'Navigasi',
    'footer.support': 'Support',
    'footer.merch': 'Merch Store',
    'footer.donate': 'Donasi / Tip',
    'footer.rights': '© 2026 HIROKE NINKY — ALL RIFTS RESERVED',
    'footer.built': 'BUILT HALF BY MAGIC, HALF BY JAVASCRIPT',

    'about.eyebrow': 'DOSSIER // ENTITY FILE 001',
    'about.title.html': 'Mengenal <span class="grad-text">Hiroke</span>',
    'about.portrait.caption': 'Emblem resmi Hiroke Ninky. Ganti dengan full character art lewat Control Panel &rarr; Konten, atau replace file di /assets/logo.png',
    'about.origin.title': 'Asal-Usul',
    'about.origin.text': 'Konon, Hiroke lahir dari retakan antara dua dunia: satu dipenuhi api, tanduk, dan bisikan iblis kuno; satu lagi dipenuhi neon, baris kode, dan detak server yang tak pernah tidur. Alih-alih memilih salah satu, ia membawa keduanya — dan menjadikan keduanya panggung.',
    'about.personality.title': 'Kepribadian',
    'about.personality.text': 'Jahil di chat, serius di terminal. Hiroke bisa meledak tertawa di tengah sesi karaoke, lalu lima menit kemudian debugging race-condition dengan tenang seolah tidak terjadi apa-apa.',
    'about.trait.1': 'Chaotic-Good',
    'about.trait.2': 'Night Owl',
    'about.trait.3': 'Sarcastic',
    'about.trait.4': 'Loyal ke Chat',

    'about.duality.eyebrow': 'DUALITAS',
    'about.duality.title.html': 'Satu tubuh, <span class="grad-text">dua disiplin</span>',
    'about.card1.title': 'VTuber / Entertainer',
    'about.card1.li1': 'Streaming variety, karaoke, dan reaction',
    'about.card1.li2': 'Kolaborasi lintas komunitas VTuber',
    'about.card1.li3': 'Konten short-form untuk TikTok & YouTube Shorts',
    'about.card2.title': 'Programmer / Developer',
    'about.card2.li1': 'Web development (frontend & backend)',
    'about.card2.li2': 'Automation tools untuk sesama creator',
    'about.card2.li3': 'Jasa freelance: website, bot, dashboard',
    'about.card3.title': 'Freelancer',
    'about.card3.li1': 'Terbuka untuk project komersial',
    'about.card3.li2': 'Branding & identitas visual creator',
    'about.card3.li3': 'Konsultasi teknis untuk channel/komunitas',

    'about.skills.eyebrow': 'TECH STACK',
    'about.skills.title.html': 'Senjata <span class="grad-text">sisi mesin</span>',

    'schedule.eyebrow': 'RITUAL TIMETABLE',
    'schedule.title.html': 'Jadwal <span class="grad-text">Streaming</span>',
    'schedule.lead': 'Semua jam dalam WIB (GMT+7). Jadwal bisa berubah — cek pengumuman di halaman utama.',
    'schedule.next.eyebrow': 'STREAM BERIKUTNYA',
    'schedule.cd.d': 'Hari', 'schedule.cd.h': 'Jam', 'schedule.cd.m': 'Menit', 'schedule.cd.s': 'Detik',
    'schedule.cta': 'Set Reminder di YouTube',
    'schedule.week.eyebrow': 'MINGGU INI',

    'social.eyebrow': 'SEMUA GERBANG',
    'social.title.html': 'Social <span class="grad-text">Feed</span>',
    'social.lead': 'Semua channel resmi Hiroke ada di sini. Follow biar nggak ketinggalan ritual berikutnya.',
    'social.yt.desc': '@hiroke_ninky — VOD, live stream, dan shorts.',
    'social.yt.stat': 'subscribers',
    'social.tt.desc': '@hiroke.ninky — clip, behind the scene, komedi.',
    'social.tt.stat': 'followers',
    'social.other.eyebrow': 'GERBANG LAINNYA',
    'social.custom.eyebrow': 'GERBANG TAMBAHAN',
    'social.discord.desc': 'Join server komunitas',
    'social.x.desc': 'Update singkat & interaksi',
    'social.ig.desc': 'Foto & story harian',
    'social.gh.desc': 'Project & open-source tools',
    'social.komisi.title': 'Komisi Freelance',
    'social.komisi.desc': 'Order jasa dev / desain',
    'social.merch.desc': 'Merchandise resmi',
    'social.embed.eyebrow': 'VIDEO TERBARU',
    'social.embed.title.html': 'Tonton di <span class="grad-text">YouTube</span>',
    'social.embed.placeholder.title': 'Tempel ID video / live terbaru di sini',
    'social.embed.placeholder.text': 'Buka Control Panel &rarr; Media, masukkan Video ID YouTube (contoh: dQw4w9WgXcQ), lalu embed akan tampil otomatis di halaman ini.',
    'social.embed.note': 'Video ID disimpan lewat Admin Panel dan dibaca otomatis oleh halaman ini.',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.schedule': 'Schedule',
    'nav.social': 'Social Feed',
    'nav.admin': 'Control Panel',
    'nav.contact': 'Contact',
    'brand.sub': 'HALF-DEMON // HYBRID CREATOR',

    'loader.home': 'OPENING THE <span>RIFT</span>',
    'loader.about': 'READING <span>LORE FILE</span>',
    'loader.schedule': 'SYNCING <span>CALENDAR</span>',
    'loader.social': 'CONNECTING <span>CHANNELS</span>',

    'hero.eyebrow': 'LIVE FROM THE RIFT',
    'hero.tag.fallback': 'Half in the light, half in the abyss.',
    'hero.desc.fallback': 'A hybrid entity torn between two worlds.',
    'hero.cta.youtube': 'Watch on YouTube',
    'hero.cta.schedule': 'View Stream Schedule',
    'hero.status.next.fallback': 'Next stream soon.',

    'stats.eyebrow': 'REALTIME PRESENCE',
    'stats.title.html': 'Two halves, <span class="grad-text">one presence</span>',
    'stats.yt': 'YouTube Subscribers',
    'stats.tt': 'TikTok Followers',
    'stats.views': 'Total Views',
    'stats.dev': 'Dev Discipline',
    'stats.note': 'Numbers refresh periodically. Connect the YouTube Data API v3 &amp; a TikTok proxy in the full-stack build for 100% live data.',

    'duality.demon.eyebrow': 'THE DEMON SIDE',
    'duality.demon.title': 'VTuber & Entertainer',
    'duality.demon.text': 'Streams, karaoke, chatting with the audience, and the chaotic moments born from Hiroke\u2019s wild side.',
    'duality.circuit.eyebrow': 'THE MACHINE SIDE',
    'duality.circuit.title': 'Designer & Developer',
    'duality.circuit.text': 'Coding new features, live-coding open-source projects, freelance work, and building tools for the creator community.',

    'quick.eyebrow': 'EXPLORE',
    'quick.about.title': 'About',
    'quick.about.text': 'Hiroke\u2019s lore, personality, and origin.',
    'quick.schedule.title': 'Stream Schedule',
    'quick.schedule.text': 'This week\u2019s calendar & reminders.',
    'quick.social.title': 'Social Feed',
    'quick.social.text': 'YouTube, TikTok, and every promo channel.',

    'footer.brand': 'HIROKE // NINKY',
    'footer.bio.fallback': 'Half-demon hybrid creator.',
    'footer.nav': 'Navigation',
    'footer.support': 'Support',
    'footer.merch': 'Merch Store',
    'footer.donate': 'Donate / Tip',
    'footer.rights': '© 2026 HIROKE NINKY — ALL RIFTS RESERVED',
    'footer.built': 'BUILT HALF BY MAGIC, HALF BY JAVASCRIPT',

    'about.eyebrow': 'DOSSIER // ENTITY FILE 001',
    'about.title.html': 'Meet <span class="grad-text">Hiroke</span>',
    'about.portrait.caption': 'Hiroke Ninky\u2019s official emblem. Replace with full character art via Control Panel &rarr; Content, or swap the file at /assets/logo.png',
    'about.origin.title': 'Origin',
    'about.origin.text': 'Legend says Hiroke was born from the crack between two worlds: one full of fire, horns, and ancient demon whispers; the other full of neon, code, and servers that never sleep. Rather than choosing one, Hiroke carries both — and made both a stage.',
    'about.personality.title': 'Personality',
    'about.personality.text': 'Mischievous in chat, focused in the terminal. Hiroke can burst out laughing mid-karaoke, then five minutes later calmly debug a race condition as if nothing happened.',
    'about.trait.1': 'Chaotic-Good',
    'about.trait.2': 'Night Owl',
    'about.trait.3': 'Sarcastic',
    'about.trait.4': 'Loyal to Chat',

    'about.duality.eyebrow': 'DUALITY',
    'about.duality.title.html': 'One body, <span class="grad-text">two disciplines</span>',
    'about.card1.title': 'VTuber / Entertainer',
    'about.card1.li1': 'Variety streams, karaoke, and reactions',
    'about.card1.li2': 'Cross-community VTuber collabs',
    'about.card1.li3': 'Short-form content for TikTok & YouTube Shorts',
    'about.card2.title': 'Programmer / Developer',
    'about.card2.li1': 'Web development (frontend & backend)',
    'about.card2.li2': 'Automation tools for fellow creators',
    'about.card2.li3': 'Freelance services: websites, bots, dashboards',
    'about.card3.title': 'Freelancer',
    'about.card3.li1': 'Open to commercial projects',
    'about.card3.li2': 'Branding & visual identity for creators',
    'about.card3.li3': 'Technical consulting for channels/communities',

    'about.skills.eyebrow': 'TECH STACK',
    'about.skills.title.html': 'Weapons of the <span class="grad-text">machine side</span>',

    'schedule.eyebrow': 'RITUAL TIMETABLE',
    'schedule.title.html': 'Stream <span class="grad-text">Schedule</span>',
    'schedule.lead': 'All times in WIB (GMT+7). Schedule may change — check the announcement on the home page.',
    'schedule.next.eyebrow': 'NEXT STREAM',
    'schedule.cd.d': 'Days', 'schedule.cd.h': 'Hours', 'schedule.cd.m': 'Minutes', 'schedule.cd.s': 'Seconds',
    'schedule.cta': 'Set Reminder on YouTube',
    'schedule.week.eyebrow': 'THIS WEEK',

    'social.eyebrow': 'ALL THE GATES',
    'social.title.html': 'Social <span class="grad-text">Feed</span>',
    'social.lead': 'Every official Hiroke channel lives here. Follow so you don\u2019t miss the next ritual.',
    'social.yt.desc': '@hiroke_ninky — VODs, live streams, and shorts.',
    'social.yt.stat': 'subscribers',
    'social.tt.desc': '@hiroke.ninky — clips, behind the scenes, comedy.',
    'social.tt.stat': 'followers',
    'social.other.eyebrow': 'OTHER GATES',
    'social.custom.eyebrow': 'MORE GATES',
    'social.discord.desc': 'Join the community server',
    'social.x.desc': 'Short updates & interaction',
    'social.ig.desc': 'Daily photos & stories',
    'social.gh.desc': 'Projects & open-source tools',
    'social.komisi.title': 'Freelance Commissions',
    'social.komisi.desc': 'Order dev / design services',
    'social.merch.desc': 'Official merchandise',
    'social.embed.eyebrow': 'LATEST VIDEO',
    'social.embed.title.html': 'Watch on <span class="grad-text">YouTube</span>',
    'social.embed.placeholder.title': 'Paste the latest video / live ID here',
    'social.embed.placeholder.text': 'Open Control Panel &rarr; Media, enter the YouTube Video ID (e.g. dQw4w9WgXcQ), and the embed will show automatically on this page.',
    'social.embed.note': 'The Video ID is saved through the Admin Panel and read automatically by this page.',
  }
};

function hkApplyLang(lang){
  const dict = HK_DICT[lang] || HK_DICT.id;
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.dataset.i18n;
    if(dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const key = el.dataset.i18nHtml;
    if(dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('.lang-switch button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  localStorage.setItem(HK_LANG_KEY, lang);
  window.hkLang = lang;
  window.hkDict = dict;
}

function initLang(){
  const saved = localStorage.getItem(HK_LANG_KEY);
  const browserGuess = (navigator.language || 'id').toLowerCase().startsWith('en') ? 'en' : 'id';
  const lang = saved || browserGuess;
  hkApplyLang(lang);
  document.querySelectorAll('.lang-switch button').forEach(b=>{
    b.addEventListener('click', () => hkApplyLang(b.dataset.lang));
  });
}

function initTheme(){
  const saved = localStorage.getItem(HK_THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const toggle = document.querySelector('.theme-toggle');
  if(toggle){
    toggle.addEventListener('click', () => {
      const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', now);
      localStorage.setItem(HK_THEME_KEY, now);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
});
