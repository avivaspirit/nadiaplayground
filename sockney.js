/* Sockneystagram — Adopt Sockney the Cutest Living Sock Pet! (sockney.js) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------------- SOUND SYNTHESIZER (Web Audio API) ---------------- */
  var Snd = (function () {
    var ctx = null;
    var enabled = lsGet('sockney_sound') !== 'off';

    function getCtx() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
      return ctx;
    }

    function play(kind) {
      if (!enabled) return;
      try {
        var c = getCtx();
        if (!c) return;
        var now = c.currentTime;
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);

        if (kind === 'squish') {
          // Rubbery elastic squeak
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(740, now + 0.08);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.16);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now); osc.stop(now + 0.19);
        } else if (kind === 'snuggle') {
          // Warm harmonic laundry cuddle chord
          [523, 659, 784, 987].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.04;
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            o.start(t); o.stop(t + 0.36);
          });
        } else if (kind === 'tickle') {
          [880, 1100, 1320].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'triangle';
            o.frequency.value = f;
            var t = now + i * 0.035;
            g.gain.setValueAtTime(0.09, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            o.start(t); o.stop(t + 0.09);
          });
        } else if (kind === 'steam') {
          // Soft airy whoosh
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.linearRampToValueAtTime(140, now + 0.22);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now); osc.stop(now + 0.26);
        } else if (kind === 'chime') {
          [1046, 1318, 1568].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.05;
            g.gain.setValueAtTime(0.09, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            o.start(t); o.stop(t + 0.24);
          });
        }
      } catch (e) {}
    }

    function toggle() {
      enabled = !enabled;
      lsSet('sockney_sound', enabled ? 'on' : 'off');
      return enabled;
    }

    return { play: play, toggle: toggle, isEnabled: function () { return enabled; } };
  })();

  /* ---------------- STATE MANAGEMENT ---------------- */
  var SOCKNEY_DEFAULT_CUTE = {
    pattern: 'classic',
    eyes: 'sparkle_boba',
    brows: 'soft_dots',
    nose: 'pink_button',
    mouth: 'kitty_3',
    ears: 'ribbed_cuff',
    blush: 'rosy_glow',
    emotion: 'cheerful',
    hat: 'none',
    collar: 'none',
    glasses: 'none',
    pin: 'none'
  };

  var DEFAULT = {
    born: Date.now(),
    love: 0,
    buttons: 18,
    warmth: 95,
    fluff: 88,
    scent: 90,
    happy: 92,
    cuddles: 0,
    stretches: 0,
    days: 0,
    outfit: {
      pattern: 'classic',
      eyes: 'sparkle_boba',
      mouth: 'kitty_3',
      blush: 'rosy_glow',
      emotion: 'cheerful',
      hat: 'none',
      button: 'none',
      acc: 'acc_bell'
    },
    album: []
  };

  var S;
  try {
    S = JSON.parse(lsGet('sockneystagram') || 'null');
  } catch (e) { S = null; }
  if (!S) {
    S = JSON.parse(JSON.stringify(DEFAULT));
    save();
  } else {
    for (var k in DEFAULT) if (S[k] === undefined) S[k] = DEFAULT[k];
    if (!S.outfit) S.outfit = JSON.parse(JSON.stringify(DEFAULT.outfit));
    if (!S.outfit.pattern) S.outfit.pattern = 'classic';
    if (!S.outfit.eyes || S.outfit.eyes === 'btn_pearl') S.outfit.eyes = 'sparkle_boba';
    if (!S.outfit.mouth) S.outfit.mouth = 'kitty_3';
    if (!S.outfit.blush) S.outfit.blush = 'rosy_glow';
    if (!S.outfit.emotion) S.outfit.emotion = 'cheerful';
    if (!S.outfit.hat) S.outfit.hat = 'none';
    if (!S.outfit.button) S.outfit.button = 'none';
    if (!S.outfit.acc) S.outfit.acc = 'acc_bell';
    if (!S.album) S.album = [];
  }

  function save() { lsSet('sockneystagram', JSON.stringify(S)); }

  /* ---------------- TREATS & WARDROBE CATALOG ---------------- */
  var LAUNDRY_TREATS = [
    { id: 'sheet', name: 'แผ่นอบผ้าอุ่น (Dryer Sheet)', icon: '♨️', warmth: 25, fluff: 15 },
    { id: 'mist', name: 'สเปรย์ลาเวนเดอร์ (Fabric Mist)', icon: '🌸', warmth: 15, fluff: 20 },
    { id: 'fluff', name: 'สายไหมนุ่มฟู (Cotton Fluff)', icon: '🍬', warmth: 20, fluff: 30 },
    { id: 'yarn', name: 'คุกกี้ไหมพรม (Yarn Cookie)', icon: '🍪', warmth: 18, fluff: 18 },
    { id: 'sun', name: 'ไอแดดอุ่นธรรมชาติ (Sunshine Scent)', icon: '☀️', warmth: 30, fluff: 25 }
  ];

  var WARDROBE = {
    pattern: [
      { id: 'classic', name: 'พาสเทลเรนโบว์ (Pastel Rainbow)', icon: '🌈' },
      { id: 'strawberry', name: 'สตรอว์เบอร์รี่มิลค์ (Berry Milk)', icon: '🍓' },
      { id: 'ocean', name: 'โอเชียนบรีซ (Ocean Breeze)', icon: '🌊' },
      { id: 'sunshine', name: 'ฮันนี่ซันไชน์ (Sunshine Honey)', icon: '🍯' },
      { id: 'galaxy', name: 'กาแล็กซีไนท์ (Galaxy Starlight)', icon: '🌌' },
      { id: 'fairisle', name: 'วินเทอร์แฟร์ไอล์ (Nordic Winter)', icon: '❄️' }
    ],
    eyes: [
      { id: 'sparkle_boba', name: 'ตากลมโตวิ้งวับ (Sparkle Boba)', icon: '👀' },
      { id: 'heart_eyes', name: 'ตาหัวใจทับทิม (Sweet Heart)', icon: '💖' },
      { id: 'star_anime', name: 'ตาดาวเปล่งประกาย (Star Anime)', icon: '⭐' },
      { id: 'happy_arcs', name: 'ตายิ้มหยีฟินๆ (Happy Arcs)', icon: 'ᵔᵕᵔ' },
      { id: 'wink_star', name: 'ขยิบตาวิ้งขี้เล่น (Star Wink)', icon: '😉' },
      { id: 'sleepy_cozy', name: 'ตาปรือขี้เซาอุ่น (Sleepy Cozy)', icon: '😌' },
      { id: 'btn_pearl', name: 'กระดุมไข่มุกเงางาม (Pearl Button)', icon: '🔘' },
      { id: 'btn_daisy', name: 'กระดุมดอกเดซี่ (Daisy Button)', icon: '🌼' }
    ],
    mouth: [
      { id: 'kitty_3', name: 'ปากแมวน้อย (:3) มินิ', icon: '🐱' },
      { id: 'sweet_smile', name: 'ยิ้มหวานสดชื่น (Sweet Smile)', icon: '😊' },
      { id: 'blep_tongue', name: 'แลบลิ้นจิ๋วขี้อ้อน (Cute Blep 👅)', icon: '👅' },
      { id: 'happy_open', name: 'อ้าปากหัวเราะร่าเริง (Joyful Open)', icon: '😄' },
      { id: 'tiny_o', name: 'ปากจิ๋วทำหน้าสงสัย (Tiny \'o\')', icon: '😮' },
      { id: 'pout_cute', name: 'แก้มป่องงอนน่ารัก (Cute Pout)', icon: '😚' }
    ],
    blush: [
      { id: 'rosy_glow', name: 'แก้มชมพูกลมระเรื่อ (Rosy Glow)', icon: '🌸' },
      { id: 'hearts', name: 'หัวใจคู่หวาน (Double Hearts 💕)', icon: '💕' },
      { id: 'stars', name: 'ประกายดาววิบวับ (Star Glitters ✨)', icon: '✨' },
      { id: 'anime_lines', name: 'ขีดเขินอนิเมะ (Manga Lines ///)', icon: '///' },
      { id: 'peachy', name: 'พีชโกลว์ละมุน (Warm Peach)', icon: '🍑' }
    ],
    emotion: [
      { id: 'cheerful', name: 'ร่าเริงดึ๋งดั๋ง (Cheerful Bouncy)', icon: '🎈' },
      { id: 'cozy', name: 'อบอุ่นฟินกลิ่นแดด (Cozy Nap)', icon: '🧺' },
      { id: 'excited', name: 'ตื่นเต้นตาวาว (Excited & Hyper)', icon: '⚡' },
      { id: 'shy', name: 'ขี้อายตัวนิ่ม (Shy & Sweet)', icon: '🙈' },
      { id: 'silly', name: 'ทะเล้นกวนๆ (Silly & Playful)', icon: '🤪' }
    ],
    hat: [
      { id: 'none', name: 'ขอบพับเบเร่ต์เรียบง่าย', icon: '🧦' },
      { id: 'hat_beanie', name: 'หมวกบีนนี่ไหมพรมพู่ปอม', icon: '🧶' },
      { id: 'hat_crown', name: 'มงกุฎเจ้าหญิงถุงเท้าทอง', icon: '👑' },
      { id: 'hat_sprout', name: 'ต้นกล้าผลิใบสดชื่น', icon: '🌱' },
      { id: 'hat_cat', name: 'หูแมวเหมียวไหมพรม', icon: '🐱' },
      { id: 'hat_halo', name: 'วงแหวนเทวดานุ่มฟู', icon: '😇' },
      { id: 'hat_party', name: 'หมวกปาร์ตี้คอนเฟตติ', icon: '🎉' },
      { id: 'hat_chef', name: 'หมวกเชฟซักอบรีดจิ๋ว', icon: '🧑‍🍳' }
    ],
    button: [
      { id: 'none', name: 'ไม่มีกระดุมประดับตัว', icon: '❌' },
      { id: 'btn_pearl', name: 'กระดุมไข่มุกประกายรุ้ง', icon: '🔘' },
      { id: 'btn_heart', name: 'กระดุมทับทิมหัวใจหวาน', icon: '❤️' },
      { id: 'btn_star', name: 'กระดุมดวงดาวประกายทอง', icon: '⭐' },
      { id: 'btn_daisy', name: 'กระดุมดอกเดซี่สีขาว', icon: '🌼' },
      { id: 'btn_gem', name: 'กระดุมเพชรฟ้าน้ำงาม', icon: '💎' },
      { id: 'btn_wood', name: 'กระดุมไม้ธรรมชาติ 4 รู', icon: '🪵' },
      { id: 'btn_smiley', name: 'กระดุมยิ้มแฉ่งอารมณ์ดี', icon: '😊' }
    ],
    acc: [
      { id: 'none', name: 'ไม่มีเครื่องประดับ', icon: '❌' },
      { id: 'acc_bell', name: 'กระดิ่งกรุ๊งกริ๊งสีทอง', icon: '🔔' },
      { id: 'acc_pompom', name: 'ปอมปอมปุกปุยสีชมพู', icon: '🌸' },
      { id: 'acc_pin_bow', name: 'เข็มกลัดโบว์ซาตินมินต์', icon: '🎀' },
      { id: 'acc_ribbon', name: 'ริบบิ้นชมพูหวานฉ่ำ', icon: '✨' },
      { id: 'acc_pin_safety', name: 'เข็มกลัดซ่อนปลายร้อยลูกปัด', icon: '🧷' },
      { id: 'acc_clover', name: 'ใบโคลเวอร์ 4 แฉกนำโชค', icon: '🍀' },
      { id: 'acc_strawberry', name: 'จี้ผลสตรอว์เบอร์รี่ถัก', icon: '🍓' },
      { id: 'acc_star_badge', name: 'เข็มกลัดดาวนายอำเภอจิ๋ว', icon: '🌟' }
    ]
  };

  /* ---------------- SOCKNEY ART (SVG) ---------------- */
  function sockneySVG(opts) {
    opts = opts || {};
    var isHug = !!opts.hug;
    var isSquish = !!opts.squish;
    var isTickle = !!opts.tickle;
    var isSteam = !!opts.steam;

    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -75 200 175" style="display:block;width:100%;height:auto">';
    if (opts.bg) s += opts.bg;

    // Shadow on floor
    s += '<ellipse cx="8" cy="74" rx="55" ry="10" fill="rgba(100,50,90,.12)"/>';

    // Squish / Stretch transform scale
    var scaleTransform = '';
    if (isSquish) scaleTransform = 'scale(1.18, 0.82) translate(0, 16)';
    else if (isHug) scaleTransform = 'scale(0.94, 1.05) translate(0, -4)';
    else if (isTickle) scaleTransform = 'rotate(-6) translate(-6, 0)';

    s += '<g transform="' + scaleTransform + '">';

    // Theme & Knit Pattern Palette
    var pat = (S.outfit && S.outfit.pattern) || 'classic';
    var THEMES = {
      classic: {
        base: '#ffb4d6',
        cuff: '#ffd6e8',
        cuffLines: '#ff70a6',
        accent: '#ff70a6',
        stripes: ['#bbf2f6', '#fff6cc', '#e8dff5', '#ffb4d6', '#bbf2f6']
      },
      strawberry: {
        base: '#ff85a1',
        cuff: '#ffe3e8',
        cuffLines: '#e01e37',
        accent: '#c9184a',
        stripes: ['#fff0f3', '#ff4d6d', '#fff0f3', '#ff758f', '#ffccd5']
      },
      ocean: {
        base: '#48cae4',
        cuff: '#ade8f4',
        cuffLines: '#0077b6',
        accent: '#0096c7',
        stripes: ['#caf0f8', '#00b4d8', '#90e0ef', '#0077b6', '#caf0f8']
      },
      sunshine: {
        base: '#ffd166',
        cuff: '#ffeaae',
        cuffLines: '#f77f00',
        accent: '#e76f51',
        stripes: ['#fff4cc', '#fcbf49', '#f77f00', '#fff4cc', '#fcbf49']
      },
      galaxy: {
        base: '#5a189a',
        cuff: '#9d4edd',
        cuffLines: '#e0aaff',
        accent: '#7b2cbf',
        stripes: ['#3c096c', '#c77dff', '#240046', '#00f5d4', '#7b2cbf']
      },
      fairisle: {
        base: '#d90429',
        cuff: '#edf2f4',
        cuffLines: '#2b2d42',
        accent: '#ef233c',
        stripes: ['#edf2f4', '#2b2d42', '#edf2f4', '#2b2d42', '#edf2f4']
      }
    };
    var th = THEMES[pat] || THEMES.classic;

    s += '<defs><clipPath id="sockClipPath"><path d="M -30 -30 L 30 -30 L 30 24 C 30 52, 46 64, 66 66 C 74 67, 72 74, 60 74 C 40 74, -18 72, -26 40 L -30 -30 Z"/></clipPath></defs>';

    // Folded cuff (Top collar) that looks like a cute beret/ears
    s += '<g transform="translate(0,-34)">';
    s += '<rect x="-34" y="-14" width="68" height="18" rx="8" fill="' + th.cuff + '" stroke="#3c2a3e" stroke-width="2.4"/>';
    // Ribbed knit lines
    for (var x = -26; x <= 26; x += 6) {
      s += '<line x1="' + x + '" y1="-12" x2="' + x + '" y2="2" stroke="' + th.cuffLines + '" stroke-width="1.8" opacity=".75"/>';
    }
    s += '</g>';

    // Outer sock body outline path
    s += '<path d="M -30 -30 L 30 -30 L 30 24 C 30 52, 46 64, 66 66 C 74 67, 72 74, 60 74 C 40 74, -18 72, -26 40 L -30 -30 Z" fill="' + th.base + '" stroke="#3c2a3e" stroke-width="2.6" stroke-linejoin="round"/>';

    // Horizontal knit stripes inside sock
    s += '<g clip-path="url(#sockClipPath)">';
    s += '<rect x="-40" y="-18" width="80" height="12" fill="' + th.stripes[0] + '"/>';
    s += '<rect x="-40" y="-6" width="80" height="12" fill="' + th.stripes[1] + '"/>';
    s += '<rect x="-40" y="6" width="80" height="12" fill="' + th.stripes[2] + '"/>';
    s += '<rect x="-40" y="18" width="80" height="12" fill="' + th.stripes[3] + '"/>';
    s += '<rect x="-40" y="30" width="80" height="14" fill="' + th.stripes[4] + '"/>';
    if (pat === 'fairisle') {
      s += '<text x="-16" y="2" font-size="10" fill="#ffffff">❄️</text><text x="8" y="2" font-size="10" fill="#ffffff">❄️</text>';
    } else if (pat === 'strawberry') {
      s += '<text x="-14" y="2" font-size="10" fill="#e01e37">🍓</text><text x="10" y="2" font-size="10" fill="#e01e37">🍓</text>';
    } else if (pat === 'galaxy') {
      s += '<text x="-16" y="2" font-size="9" fill="#ffd166">✦</text><text x="10" y="2" font-size="9" fill="#00f5d4">✦</text>';
    }
    s += '</g>';

    // Heel (Back Curve)
    s += '<path d="M -28 32 C -36 44, -30 62, -14 66 C -24 58, -26 44, -28 32 Z" fill="' + th.accent + '" stroke="#3c2a3e" stroke-width="2"/>';

    // Toe (Front Curve)
    s += '<path d="M 40 54 C 54 54, 72 60, 68 74 C 52 74, 40 68, 40 54 Z" fill="' + th.accent + '" stroke="#3c2a3e" stroke-width="2"/>';

    // Toe blush & tickle sparkle
    if (isTickle) {
      s += '<circle cx="62" cy="65" r="4.5" fill="#ff4d88"/><circle cx="60" cy="63" r="1.5" fill="#fff"/>';
      s += '<text x="68" y="58" font-size="16">✨</text>';
    }

    // Rosy Cheeks
    var blushStyle = (S.outfit && S.outfit.blush) || 'rosy_glow';
    if (blushStyle === 'hearts') {
      s += '<text x="-30" y="8" font-size="12">💕</text><text x="18" y="8" font-size="12">💕</text>';
    } else if (blushStyle === 'stars') {
      s += '<text x="-29" y="8" font-size="12">✨</text><text x="17" y="8" font-size="12">✨</text>';
    } else if (blushStyle === 'anime_lines') {
      [-26, -23, -20].forEach(function(lx) { s += '<line x1="' + lx + '" y1="1" x2="' + (lx+3) + '" y2="7" stroke="#ff4d88" stroke-width="1.6" stroke-linecap="round"/>'; });
      [18, 21, 24].forEach(function(lx) { s += '<line x1="' + lx + '" y1="1" x2="' + (lx+3) + '" y2="7" stroke="#ff4d88" stroke-width="1.6" stroke-linecap="round"/>'; });
    } else if (blushStyle === 'peachy') {
      s += '<ellipse cx="-23" cy="4" rx="8" ry="5.5" fill="#ff9e7d" opacity=".8"/>';
      s += '<ellipse cx="23" cy="4" rx="8" ry="5.5" fill="#ff9e7d" opacity=".8"/>';
    } else {
      // Rosy Glow with white sparkle catchlights (Default)
      s += '<ellipse cx="-23" cy="4" rx="8" ry="5.2" fill="#ff70a6" opacity=".75"/>';
      s += '<ellipse cx="23" cy="4" rx="8" ry="5.2" fill="#ff70a6" opacity=".75"/>';
      s += '<path d="M -23 2 l 1 1.6 1.6 1 -1.6 1 -1 1.6 -1 -1.6 -1.6 -1 1.6 -1 Z" fill="#fff" opacity=".95"/>';
      s += '<path d="M 23 2 l 1 1.6 1.6 1 -1.6 1 -1 1.6 -1 -1.6 -1.6 -1 1.6 -1 Z" fill="#fff" opacity=".95"/>';
    }

    // Eyes: Ultra-Cute Chiikawa/Sanrio Style Eyes
    var eyeStyle = (S.outfit && S.outfit.eyes) || 'sparkle_boba';
    if (isHug || isSquish || isTickle || eyeStyle === 'happy_arcs') {
      // Sweet blissful closed smile eyes
      s += '<path d="M -20 -9 Q -13 -17 -6 -9" stroke="#3c2a3e" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      s += '<path d="M 6 -9 Q 13 -17 20 -9" stroke="#3c2a3e" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      s += '<text x="-16" y="-18" font-size="10">💕</text><text x="10" y="-18" font-size="10">💕</text>';
    } else if (eyeStyle === 'heart_eyes') {
      [-13, 13].forEach(function(cx) {
        s += '<path d="M ' + cx + ' -7 C ' + (cx - 7) + ' -15, ' + (cx - 12) + ' -6, ' + cx + ' 0 C ' + (cx + 12) + ' -6, ' + (cx + 7) + ' -15, ' + cx + ' -7 Z" fill="#ff3366" stroke="#3c2a3e" stroke-width="1.8"/>';
        s += '<circle cx="' + (cx - 2.5) + '" cy="-10" r="1.8" fill="#fff"/>';
        s += '<path d="M ' + (cx - 5) + ' -15 Q ' + cx + ' -17 ' + (cx + 5) + ' -15" stroke="#3c2a3e" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
      });
    } else if (eyeStyle === 'star_anime') {
      [-14, 14].forEach(function(cx) {
        s += '<ellipse cx="' + cx + '" cy="-10" rx="8" ry="9" fill="#2b1a32"/>';
        s += '<ellipse cx="' + cx + '" cy="-7" rx="5.5" ry="3.5" fill="#9d4edd" opacity=".5"/>';
        s += '<text x="' + (cx - 5) + '" y="-5" font-size="11" fill="#ffd166">✦</text>';
        s += '<ellipse cx="' + (cx - 2.5) + '" cy="-13" rx="2.5" ry="2.8" fill="#fff"/>';
        s += '<path d="M ' + (cx - 6) + ' -16 Q ' + cx + ' -18 ' + (cx + 6) + ' -16" stroke="#3c2a3e" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
      });
    } else if (eyeStyle === 'wink_star') {
      s += '<ellipse cx="-14" cy="-10" rx="8.5" ry="9.5" fill="#2b1a32"/>';
      s += '<ellipse cx="-14" cy="-7" rx="6" ry="4" fill="#ff7da7" opacity=".45"/>';
      s += '<ellipse cx="-16.8" cy="-13.2" rx="3.2" ry="3.6" fill="#ffffff"/>';
      s += '<circle cx="-11" cy="-7.8" r="1.6" fill="#ffffff"/>';
      s += '<path d="M -20 -16 Q -14 -18 -8 -16" stroke="#3c2a3e" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
      s += '<path d="M 7 -9 Q 14 -17 21 -9" stroke="#3c2a3e" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      s += '<text x="16" y="-16" font-size="11">✨</text>';
    } else if (eyeStyle === 'sleepy_cozy') {
      [-14, 14].forEach(function(cx) {
        s += '<path d="M ' + (cx - 8) + ' -9 Q ' + cx + ' -6 ' + (cx + 8) + ' -9" stroke="#3c2a3e" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
        s += '<ellipse cx="' + cx + '" cy="-8" rx="6" ry="3" fill="#ff7da7" opacity=".35"/>';
      });
    } else if (eyeStyle === 'btn_pearl') {
      [-13, 13].forEach(function(cx) {
        s += '<circle cx="' + cx + '" cy="-10" r="8" fill="#ffd6e8" stroke="#3c2a3e" stroke-width="1.8"/>';
        s += '<circle cx="' + (cx - 2.5) + '" cy="-12.5" r="2.2" fill="#fff" opacity=".9"/>';
        s += '<line x1="' + (cx - 3) + '" y1="-10" x2="' + (cx + 3) + '" y2="-10" stroke="#ff70a6" stroke-width="2" stroke-linecap="round"/>';
        s += '<line x1="' + cx + '" y1="-13" x2="' + cx + '" y2="-7" stroke="#ff70a6" stroke-width="2" stroke-linecap="round"/>';
      });
    } else if (eyeStyle === 'btn_daisy') {
      [-13, 13].forEach(function(cx) {
        s += '<circle cx="' + cx + '" cy="-10" r="8.5" fill="#fff" stroke="#3c2a3e" stroke-width="1.8"/>';
        s += '<circle cx="' + cx + '" cy="-10" r="3.8" fill="#ffd166"/>';
      });
    } else {
      function drawSparkleBobaEye(cx, cy) {
        var str = '';
        str += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="8.5" ry="9.5" fill="#2b1a32"/>';
        str += '<ellipse cx="' + cx + '" cy="' + (cy + 3) + '" rx="6" ry="4" fill="#ff7da7" opacity=".45"/>';
        str += '<ellipse cx="' + (cx - 2.8) + '" cy="' + (cy - 3.2) + '" rx="3.2" ry="3.6" fill="#ffffff"/>';
        str += '<circle cx="' + (cx + 3) + '" cy="' + (cy + 2.2) + '" r="1.6" fill="#ffffff"/>';
        str += '<circle cx="' + (cx - 1.2) + '" cy="' + (cy + 3.8) + '" r="0.9" fill="#ffffff"/>';
        str += '<path d="M ' + (cx - 6) + ' ' + (cy - 12) + ' Q ' + cx + ' ' + (cy - 14) + ' ' + (cx + 6) + ' ' + (cy - 12) + '" stroke="#3c2a3e" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
        return str;
      }
      s += drawSparkleBobaEye(-14, -10);
      s += drawSparkleBobaEye(14, -10);
    }

    // Eyebrows
    var browStyle = (S.outfit && S.outfit.brows) || 'soft_dots';
    if (browStyle === 'sweet_arcs') {
      s += '<path d="M -19 -21 Q -14 -25 -9 -21" stroke="#3c2a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
           '<path d="M 9 -21 Q 14 -25 19 -21" stroke="#3c2a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    } else if (browStyle === 'shy_slant') {
      s += '<path d="M -19 -20 L -9 -23" stroke="#3c2a3e" stroke-width="2" stroke-linecap="round"/>' +
           '<path d="M 19 -20 L 9 -23" stroke="#3c2a3e" stroke-width="2" stroke-linecap="round"/>';
    } else if (browStyle === 'bold_happy') {
      s += '<path d="M -20 -23 Q -14 -27 -8 -23" stroke="#3c2a3e" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
           '<path d="M 8 -23 Q 14 -27 20 -23" stroke="#3c2a3e" stroke-width="2.8" fill="none" stroke-linecap="round"/>';
    } else if (browStyle === 'none') {
      // none
    } else {
      // Default: Soft cute brow dots
      s += '<circle cx="-14" cy="-21" r="2.2" fill="#e08bb2"/>' +
           '<circle cx="14" cy="-21" r="2.2" fill="#e08bb2"/>';
    }

    // Nose
    var noseStyle = (S.outfit && S.outfit.nose) || 'pink_button';
    if (noseStyle === 'heart_nose') {
      s += '<path d="M -3 -1 C -4 -4, 4 -4, 3 -1 C 2 1.5, -2 1.5, -3 -1 Z" fill="#ff70a6"/>';
    } else if (noseStyle === 'btn_nose') {
      s += '<circle cx="0" cy="0" r="3.2" fill="#ffffff" stroke="#c94b7a" stroke-width="1.2"/><circle cx="0" cy="0" r="1.2" fill="#ffd166"/>';
    } else if (noseStyle === 'tiny_dot') {
      s += '<circle cx="0" cy="0" r="2.2" fill="#3c2a3e"/>';
    } else if (noseStyle === 'none') {
      // none
    } else {
      // Default: Soft Pink Button Nose
      s += '<ellipse cx="0" cy="0" rx="3.5" ry="2.6" fill="#ff70a6"/>' +
           '<ellipse cx="-1" cy="-0.8" rx="1.2" ry="0.8" fill="#ffffff" opacity=".8"/>';
    }

    // Mouth Selection
    var mouthStyle = (S.outfit && S.outfit.mouth) || 'kitty_3';
    if (mouthStyle === 'sweet_smile') {
      s += '<path d="M -5 3 Q 0 8 5 3" stroke="#3c2a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    } else if (mouthStyle === 'blep_tongue') {
      s += '<path d="M -5 3 Q 0 6 5 3" stroke="#3c2a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      s += '<path d="M -2.5 4 C -2.5 9, 2.5 9, 2.5 4 Z" fill="#ff758f" stroke="#3c2a3e" stroke-width="1.4"/>';
    } else if (mouthStyle === 'happy_open') {
      s += '<path d="M -5 2 Q 0 0 5 2 C 5 8, -5 8, -5 2 Z" fill="#912847" stroke="#3c2a3e" stroke-width="1.8"/>';
      s += '<ellipse cx="0" cy="5.2" rx="3.2" ry="1.8" fill="#ff7da7"/>';
    } else if (mouthStyle === 'tiny_o') {
      s += '<ellipse cx="0" cy="4" rx="2.5" ry="3.2" fill="#912847" stroke="#3c2a3e" stroke-width="1.6"/>';
    } else if (mouthStyle === 'pout_cute') {
      s += '<path d="M -4 4 Q 0 1 4 4" stroke="#3c2a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    } else {
      s += '<path d="M -6 4 Q -3 8 0 4.5 Q 3 8 6 4" stroke="#3c2a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    }

    // Emotion Floating Sparkles
    var emStyle = (S.outfit && S.outfit.emotion) || 'cheerful';
    if (emStyle === 'cozy') {
      s += '<text x="-56" y="-30" font-size="14">💕</text><text x="44" y="-25" font-size="13">☕</text>';
    } else if (emStyle === 'excited') {
      s += '<text x="-56" y="-32" font-size="14">⚡</text><text x="44" y="-28" font-size="14">✨</text>';
    } else if (emStyle === 'shy') {
      s += '<text x="-56" y="-28" font-size="14">🌸</text><text x="44" y="-26" font-size="13">🎀</text>';
    } else if (emStyle === 'silly') {
      s += '<text x="-54" y="-30" font-size="14">😋</text><text x="44" y="-28" font-size="13">🫧</text>';
    } else {
      s += '<text x="-54" y="-32" font-size="14">🎶</text><text x="44" y="-26" font-size="13">✨</text>';
    }

    // Decorative button on tummy
    var btnBadge = (S.outfit && S.outfit.button) || 'none';
    if (btnBadge && btnBadge !== 'none') {
      var bx = 0, by = 22;
      if (btnBadge === 'btn_heart') {
        s += '<path d="M ' + bx + ' ' + (by + 2) + ' C ' + (bx - 6) + ' ' + (by - 6) + ', ' + (bx - 10) + ' ' + (by + 2) + ', ' + bx + ' ' + (by + 8) + ' C ' + (bx + 10) + ' ' + (by + 2) + ', ' + (bx + 6) + ' ' + (by - 6) + ', ' + bx + ' ' + (by + 2) + ' Z" fill="#e63946" stroke="#3c2a3e" stroke-width="1.6"/>';
      } else if (btnBadge === 'btn_star') {
        s += '<polygon points="' + bx + ',' + (by - 8) + ' ' + (bx + 2.5) + ',' + (by - 2.5) + ' ' + (bx + 8) + ',' + (by - 2) + ' ' + (bx + 3.5) + ',' + (by + 2.5) + ' ' + (bx + 5) + ',' + (by + 8) + ' ' + bx + ',' + (by + 4.5) + ' ' + (bx - 5) + ',' + (by + 8) + ' ' + (bx - 3.5) + ',' + (by + 2.5) + ' ' + (bx - 8) + ',' + (by - 2) + ' ' + (bx - 2.5) + ',' + (by - 2.5) + '" fill="#ffd166" stroke="#b78600" stroke-width="1.5"/>';
      } else if (btnBadge === 'btn_daisy') {
        s += '<circle cx="' + bx + '" cy="' + by + '" r="7" fill="#fff" stroke="#3c2a3e" stroke-width="1.6"/><circle cx="' + bx + '" cy="' + by + '" r="2.8" fill="#ffd166"/>';
      } else if (btnBadge === 'btn_smiley') {
        s += '<circle cx="' + bx + '" cy="' + by + '" r="7" fill="#ffd166" stroke="#3c2a3e" stroke-width="1.5"/><circle cx="' + (bx - 2) + '" cy="' + (by - 1.5) + '" r="0.9" fill="#3c2a3e"/><circle cx="' + (bx + 2) + '" cy="' + (by - 1.5) + '" r="0.9" fill="#3c2a3e"/><path d="M ' + (bx - 2.5) + ' ' + (by + 1.5) + ' Q ' + bx + ' ' + (by + 4) + ' ' + (bx + 2.5) + ' ' + (by + 1.5) + '" stroke="#3c2a3e" stroke-width="1.2" fill="none"/>';
      } else {
        s += '<circle cx="' + bx + '" cy="' + by + '" r="6.5" fill="#ffb4d6" stroke="#3c2a3e" stroke-width="1.5"/><circle cx="' + (bx - 2) + '" cy="' + (by - 2) + '" r="1.5" fill="#fff"/>';
      }
    }

    // Hat Adornments on Cuff
    var hat = (S.outfit && S.outfit.hat) || 'none';
    if (hat === 'hat_beanie') {
      s += '<g transform="translate(0, -38)">';
      s += '<path d="M -26 0 C -26 -26, 26 -26, 26 0 Z" fill="#ff70a6" stroke="#3c2a3e" stroke-width="2"/>';
      s += '<line x1="-14" y1="-4" x2="-14" y2="-20" stroke="#fff" stroke-width="1.6" opacity=".8"/>';
      s += '<line x1="0" y1="-4" x2="0" y2="-24" stroke="#fff" stroke-width="1.6" opacity=".8"/>';
      s += '<line x1="14" y1="-4" x2="14" y2="-20" stroke="#fff" stroke-width="1.6" opacity=".8"/>';
      s += '<circle cx="0" cy="-24" r="8" fill="#ffffff" stroke="#ff70a6" stroke-width="1.8"/>';
      s += '</g>';
    } else if (hat === 'hat_crown') {
      s += '<g transform="translate(0, -42)">';
      s += '<polygon points="-16,4 -16,-8 -8,-2 0,-14 8,-2 16,-8 16,4" fill="#ffd166" stroke="#b78600" stroke-width="2"/>';
      s += '<circle cx="0" cy="-5" r="2.8" fill="#e63946"/>';
      s += '<circle cx="-8" cy="0" r="2" fill="#4cc9f0"/><circle cx="8" cy="0" r="2" fill="#4cc9f0"/>';
      s += '</g>';
    } else if (hat === 'hat_sprout') {
      s += '<g transform="translate(0, -38)">';
      s += '<path d="M 0 2 Q -2 -14 -14 -16 Q -4 -16 0 -6" fill="#52b788" stroke="#2d6a4f" stroke-width="1.8"/>';
      s += '<path d="M 0 2 Q 2 -14 14 -16 Q 4 -16 0 -6" fill="#74c69d" stroke="#2d6a4f" stroke-width="1.8"/>';
      s += '<circle cx="0" cy="2" r="2" fill="#2d6a4f"/>';
      s += '</g>';
    } else if (hat === 'hat_cat') {
      s += '<g transform="translate(0, -38)">';
      s += '<polygon points="-24,2 -28,-18 -12,-2" fill="#ffd6e8" stroke="#3c2a3e" stroke-width="2"/>';
      s += '<polygon points="24,2 28,-18 12,-2" fill="#ffd6e8" stroke="#3c2a3e" stroke-width="2"/>';
      s += '<polygon points="-23,0 -26,-13 -14,-2" fill="#ff70a6"/>';
      s += '<polygon points="23,0 26,-13 14,-2" fill="#ff70a6"/>';
      s += '</g>';
    } else if (hat === 'hat_halo') {
      s += '<ellipse cx="0" cy="-48" rx="26" ry="7" fill="none" stroke="#ffd166" stroke-width="3.5"/>';
      s += '<ellipse cx="0" cy="-48" rx="24" ry="5.5" fill="none" stroke="#fff" stroke-width="1.5"/>';
    } else if (hat === 'hat_party') {
      s += '<g transform="translate(0, -38)">';
      s += '<polygon points="-12,2 0,-30 12,2" fill="#f72585" stroke="#3c2a3e" stroke-width="2"/>';
      s += '<circle cx="0" cy="-30" r="4.5" fill="#ffd166"/>';
      s += '<circle cx="-3" cy="-10" r="2.2" fill="#4cc9f0"/><circle cx="3" cy="-18" r="2.2" fill="#ffd166"/>';
      s += '</g>';
    } else if (hat === 'hat_chef') {
      s += '<g transform="translate(0, -38)">';
      s += '<rect x="-18" y="-4" width="36" height="8" rx="3" fill="#ffffff" stroke="#3c2a3e" stroke-width="1.8"/>';
      s += '<path d="M -16 -4 C -26 -24, 26 -24, 16 -4 Z" fill="#ffffff" stroke="#3c2a3e" stroke-width="1.8"/>';
      s += '<circle cx="-6" cy="-14" r="8" fill="#ffffff"/><circle cx="6" cy="-14" r="8" fill="#ffffff"/><circle cx="0" cy="-18" r="9" fill="#ffffff"/>';
      s += '</g>';
    }

    // Accessory on Cuff / Body
    var acc = (S.outfit && S.outfit.acc) || 'acc_bell';
    if (acc === 'acc_bell') {
      s += '<g transform="translate(24, -38)">';
      s += '<circle cx="0" cy="0" r="6.5" fill="#ffd166" stroke="#b78600" stroke-width="1.6"/><circle cx="0" cy="2" r="1.8" fill="#594200"/>';
      s += '</g>';
    } else if (acc === 'acc_pompom') {
      s += '<circle cx="24" cy="-38" r="9" fill="#ffb4d6" stroke="#ff70a6" stroke-width="1.8"/>';
      s += '<circle cx="26" cy="-40" r="3" fill="#fff" opacity=".8"/>';
    } else if (acc === 'acc_pin_bow') {
      s += '<g transform="translate(-24, -38)">';
      s += '<polygon points="-7,-4 0,0 -7,4" fill="#70d6ff" stroke="#0077b6" stroke-width="1"/><polygon points="7,-4 0,0 7,4" fill="#70d6ff" stroke="#0077b6" stroke-width="1"/><circle cx="0" cy="0" r="2.8" fill="#ffd166"/>';
      s += '</g>';
    } else if (acc === 'acc_ribbon') {
      s += '<g transform="translate(0, -38)"><polygon points="-9,-5 0,0 -9,5" fill="#ff70a6"/><polygon points="9,-5 0,0 9,5" fill="#ff70a6"/><circle cx="0" cy="0" r="3.2" fill="#fff"/></g>';
    } else if (acc === 'acc_pin_safety') {
      s += '<g transform="translate(-20, -38)">';
      s += '<path d="M -8 -4 L 8 -4 C 12 -4, 12 4, 8 4 L -4 4" stroke="#c0c0c0" stroke-width="2" fill="none" stroke-linecap="round"/>';
      s += '<circle cx="-3" cy="-4" r="2.2" fill="#ff9ebb"/><circle cx="1" cy="-4" r="2.2" fill="#90e0ef"/><circle cx="5" cy="-4" r="2.2" fill="#ffd166"/>';
      s += '</g>';
    } else if (acc === 'acc_clover') {
      s += '<g transform="translate(24, -38)">';
      s += '<circle cx="-3" cy="-3" r="3.5" fill="#52b788"/><circle cx="3" cy="-3" r="3.5" fill="#52b788"/><circle cx="-3" cy="3" r="3.5" fill="#52b788"/><circle cx="3" cy="3" r="3.5" fill="#52b788"/><circle cx="0" cy="0" r="2" fill="#2d6a4f"/>';
      s += '</g>';
    } else if (acc === 'acc_strawberry') {
      s += '<g transform="translate(24, -38)">';
      s += '<path d="M -5 -2 C -6 6, 6 6, 5 -2 Z" fill="#e63946" stroke="#3c2a3e" stroke-width="1.2"/>';
      s += '<polygon points="-4,-4 0,-1 4,-4" fill="#52b788"/>';
      s += '<circle cx="-1" cy="1" r="0.8" fill="#ffd166"/><circle cx="2" cy="1" r="0.8" fill="#ffd166"/>';
      s += '</g>';
    } else if (acc === 'acc_star_badge') {
      s += '<g transform="translate(-22, -38)"><polygon points="0,-7 2,-2 7,-2 3,1 5,6 0,3 -5,6 -3,1 -7,-2 -2,-2" fill="#ffd166" stroke="#b78600" stroke-width="1.4"/></g>';
    }

    s += '</g>'; // end scale transform

    // Floating overlays
    if (isHug) s += '<text x="-65" y="-45" font-size="22">💖</text><text x="45" y="-55" font-size="20">💕</text><text x="-40" y="55" font-size="18">🧺</text>';
    if (isSquish) s += '<text x="-60" y="-40" font-size="20">✨</text><text x="45" y="-45" font-size="20">ดึ๋ง!</text>';
    if (isSteam) s += '<text x="-55" y="-45" font-size="22">💨</text><text x="40" y="-40" font-size="20">🫧</text>';

    s += '</svg>';
    return s;
  }

  /* ---------------- HOME TAB LOGIC ---------------- */
  var petTimer = null, cozyState = null;

  function renderHome() {
    var homeBg = '<rect x="-100" y="-75" width="200" height="175" fill="#fff8fb"/>' +
      '<circle cx="-60" cy="-35" r="22" fill="#ffe0ec" opacity=".7"/>' +
      '<circle cx="65" cy="-25" r="16" fill="#e8f4fd" opacity=".7"/>';

    $('petBox').innerHTML = sockneySVG({
      bg: homeBg,
      hug: cozyState === 'hug',
      squish: cozyState === 'squish',
      tickle: cozyState === 'tickle',
      steam: cozyState === 'steam'
    });

    $('stAge').textContent = S.days;
    $('stLove').textContent = S.love;
    $('stButtons').textContent = S.buttons;

    if ($('bWarmth')) $('bWarmth').style.width = Math.round(S.warmth) + '%';
    if ($('bWarmthFeed')) $('bWarmthFeed').style.width = Math.round(S.warmth) + '%';
    if ($('bFluff')) $('bFluff').style.width = Math.round(S.fluff) + '%';
    if ($('bScent')) $('bScent').style.width = Math.round(S.scent) + '%';
    if ($('bHappy')) $('bHappy').style.width = Math.round(S.happy) + '%';
  }

  function spawnFloatingParticles(container, emojis, count) {
    if (!container) return;
    for (var i = 0; i < (count || 5); i++) {
      var p = document.createElement('div');
      p.className = 'floating-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = (30 + Math.random() * 40) + '%';
      p.style.top = (35 + Math.random() * 30) + '%';
      p.style.animationDelay = (i * 0.12) + 's';
      container.appendChild(p);
      setTimeout(function (el) { el.remove(); }, 1500, p);
    }
  }

  function doHug() {
    S.love += 4; S.warmth = 100; S.happy = 100; S.cuddles = (S.cuddles || 0) + 1;
    cozyState = 'hug';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 1600);

    Snd.play('snuggle');
    spawnFloatingParticles($('petBox'), ['💖', '🧺', '✨', '🧦'], 6);
    $('say').textContent = 'งื้มมมม~ กอดน้องถุงเท้าอุ่นๆ เพิ่งอบผ้าเสร็จ หอมกลิ่นแดดที่สุดเลยยย! 💕';
    $('log').textContent = 'Sockney snuggles into your palms with cozy knit warmth! (+4 Love, 🔥 100% Warmth!)';
    save();
    renderHome();
  }

  function doSquish() {
    S.love += 2; S.fluff = Math.min(100, S.fluff + 12); S.stretches = (S.stretches || 0) + 1;
    cozyState = 'squish';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 1400);

    Snd.play('squish');
    spawnFloatingParticles($('petBox'), ['✨', 'ดึ๋ง!', '🌸', '🧦'], 5);
    $('say').textContent = 'บีบยืดดึ๋งดั๋งงง! นุ่มนิ่มเด้งดึ๋งเหมือนขนมโมจิเลยยย! ✨';
    $('log').textContent = 'Sockney stretches and squishes with cheerful elasticity! *boing!*';
    save();
    renderHome();
  }

  function doTickle() {
    S.love += 2; S.happy = 100;
    cozyState = 'tickle';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 1300);

    Snd.play('tickle');
    spawnFloatingParticles($('petBox'), ['🦶', 'คิกๆ', '✨', '💕'], 5);
    $('say').textContent = 'คิกคิกคิก~ อย่าเกาปลายเท้าน้าาา จั๊กจี้ดุ๊กดิ๊กกก! 🦶🌸';
    $('log').textContent = 'Sockney wiggles her striped toe and giggles happily!';
    save();
    renderHome();
  }

  function doSteam() {
    S.fluff = 100; S.scent = 100; S.warmth = Math.min(100, S.warmth + 10);
    cozyState = 'steam';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 1400);

    Snd.play('steam');
    spawnFloatingParticles($('petBox'), ['💨', '🌸', '✨', '🫧'], 6);
    $('say').textContent = 'ฟู่ๆๆ~ ไอน้ำอุ่นๆ พ่นฟู ขนไหมพรมนุ่มเรียบหอมฟุ้งแล้วจ้า! 💨✨';
    $('log').textContent = 'Warm steam puff! Sockney fluffs up like a cloud!';
    save();
    renderHome();
  }

  $('actFace')?.addEventListener('click', function () {
    var tabDress = $('tabDress');
    if (tabDress) tabDress.click();
    dressCat = 'eyes';
    renderWardrobe();
    Snd.play('chime');
  });
  $('actHug')?.addEventListener('click', doHug);
  $('actSquish')?.addEventListener('click', doSquish);
  $('actTickle')?.addEventListener('click', doTickle);
  $('actSteam')?.addEventListener('click', doSteam);
  $('actPet')?.addEventListener('click', doSquish);
  $('petBox')?.addEventListener('click', doHug);

  /* ---------------- LAUNDRY CAFE TAB ---------------- */
  var pickTreat = LAUNDRY_TREATS[0];

  function renderFoodStage() {
    var box = $('feedBox');
    if (!box) return;
    box.innerHTML = sockneySVG({});
  }

  function renderLaundryCafe() {
    var g = $('foodGrid');
    if (!g) return;
    g.innerHTML = '';
    LAUNDRY_TREATS.forEach(function (f) {
      var d = document.createElement('div');
      d.className = 'it' + (pickTreat.id === f.id ? ' on' : '');
      d.innerHTML = '<div class="e">' + f.icon + '</div><span>' + f.name.split(' ')[0] + '</span><small>+' + f.warmth + ' อบอุ่น</small>';
      d.addEventListener('click', function () {
        pickTreat = f;
        renderLaundryCafe();
        Snd.play('chime');
      });
      g.appendChild(d);
    });
  }

  $('feedBtn')?.addEventListener('click', function () {
    S.warmth = Math.min(100, S.warmth + pickTreat.warmth);
    S.fluff = Math.min(100, S.fluff + pickTreat.fluff);
    S.love += 2;
    Snd.play('snuggle');
    spawnFloatingParticles($('feedBox'), [pickTreat.icon, '✨', '🧺'], 5);
    $('feedLog').textContent = 'Sockney snuggled into ' + pickTreat.name + '! หอมฟู อบอุ่นใจเต็มร้อย! ✨';
    save();
    renderHome();
  });

  /* ---------------- KNIT WARDROBE TAB ---------------- */
  var dressCat = 'eyes';
  var DRESS_LABELS = {
    eyes: '👀 ลูกตา (Eyes)',
    mouth: '👄 ปาก (Mouth)',
    blush: '🌸 แก้ม (Cheeks)',
    emotion: '✨ อารมณ์ (Mood)',
    pattern: '🌈 ลายถุงเท้า (Knit)',
    hat: '👒 หมวกประดับ',
    acc: '🎀 เครื่องประดับ',
    button: '🔘 กระดุมเย็บ'
  };

  function renderWardrobe() {
    $('petBox2').innerHTML = sockneySVG({});
    renderSavedLooksUI();
    var cr = $('dressCats');
    cr.innerHTML = '';
    ['eyes', 'mouth', 'blush', 'emotion', 'pattern', 'hat', 'acc', 'button'].forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'place' + (dressCat === c ? ' on' : '');
      b.textContent = DRESS_LABELS[c] || c;
      b.addEventListener('click', function () {
        dressCat = c;
        renderWardrobe();
        Snd.play('chime');
      });
      cr.appendChild(b);
    });

    var g = $('dressGrid');
    g.innerHTML = '';
    (WARDROBE[dressCat] || []).forEach(function (item) {
      var d = document.createElement('div');
      var isCurrent = (S.outfit && S.outfit[dressCat] === item.id);
      d.className = 'it' + (isCurrent ? ' on' : '');
      d.innerHTML = '<div class="e">' + item.icon + '</div><span>' + item.name + '</span>';
      d.addEventListener('click', function () {
        if (!S.outfit) S.outfit = {};
        S.outfit[dressCat] = item.id;
        renderWardrobe();
        renderHome();
        Snd.play('chime');
        save();
      });
      g.appendChild(d);
    });
  }

  $('dressRandom')?.addEventListener('click', function () {
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)].id; }
    S.outfit = {
      pattern: pick(WARDROBE.pattern),
      eyes: pick(WARDROBE.eyes),
      mouth: pick(WARDROBE.mouth),
      blush: pick(WARDROBE.blush),
      emotion: pick(WARDROBE.emotion),
      hat: pick(WARDROBE.hat),
      button: pick(WARDROBE.button),
      acc: pick(WARDROBE.acc)
    };
    renderWardrobe();
    renderHome();
    Snd.play('snuggle');
    save();
  });

  $('btnSaveLook')?.addEventListener('click', saveCurrentLook);
  $('btnResetCute')?.addEventListener('click', resetToDefaultCute);
  $('dressClear')?.addEventListener('click', resetToDefaultCute);

  /* ---------------- YARN PLAYROOM TAB ---------------- */
  var yarnX = 250, yarnY = 175, isPlayingYarn = false;

  function drawPlayroomScene() {
    var box = $('walkBox');
    if (!box) return;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" style="cursor:pointer" id="playroomSvg">';
    // Cozy Wallpaper
    s += '<rect width="400" height="240" fill="#fdf0f5"/>';
    // Stripes wallpaper
    for (var i = 0; i < 400; i += 30) {
      s += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="160" stroke="#fae1ed" stroke-width="2"/>';
    }
    // Hardwood Floor
    s += '<rect y="160" width="400" height="80" fill="#dfb38e"/>';
    for (var fl = 160; fl < 240; fl += 25) {
      s += '<line x1="0" y1="' + fl + '" x2="400" y2="' + fl + '" stroke="#c9986f" stroke-width="2"/>';
    }

    // Big Colorful Yarn Ball
    s += '<circle cx="' + yarnX + '" cy="' + yarnY + '" r="18" fill="#ff70a6" stroke="#c9184a" stroke-width="2.5"/>';
    s += '<path d="M ' + (yarnX - 12) + ' ' + (yarnY - 8) + ' Q ' + yarnX + ' ' + (yarnY - 14) + ' ' + (yarnX + 12) + ' ' + (yarnY - 4) + '" stroke="#fff" stroke-width="2" fill="none"/>';
    s += '<path d="M ' + (yarnX - 14) + ' ' + yarnY + ' Q ' + yarnX + ' ' + (yarnY + 12) + ' ' + (yarnX + 14) + ' ' + (yarnY + 2) + '" stroke="#ffd166" stroke-width="2" fill="none"/>';
    s += '<path d="M ' + (yarnX - 6) + ' ' + (yarnY + 14) + ' Q ' + (yarnX + 20) + ' ' + (yarnY + 24) + ' ' + (yarnX + 45) + ' ' + (yarnY + 18) + '" stroke="#ff70a6" stroke-width="2.4" fill="none"/>';

    // Sockney sliding across the floor
    var sockX = isPlayingYarn ? yarnX - 35 : 110;
    s += '<g transform="translate(' + sockX + ', 145) scale(0.65)">' +
      sockneySVG({}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g>';

    s += '</svg>';
    box.innerHTML = s;

    $('playroomSvg')?.addEventListener('click', function (e) {
      var rect = this.getBoundingClientRect();
      var clickX = (e.clientX - rect.left) / rect.width * 400;
      yarnX = Math.max(70, Math.min(340, clickX));
      playYarn();
    });
  }

  function playYarn() {
    isPlayingYarn = true;
    Snd.play('squish');
    drawPlayroomScene();
    $('walkLog').textContent = '🧶 ฟิ้ววว! Sockney สไลด์เท้าบนพื้นไม้อย่างรวดเร็วไปคว้าไหมพรม!';

    setTimeout(function () {
      Snd.play('chime');
      S.buttons += 2;
      S.happy = 100;
      S.love += 2;
      $('walkLog').textContent = '🎉 Sockney กลิ้งม้วนไหมพรมเล่นอย่างเพลิดเพลิน! (+2 🔘 Buttons!)';
      isPlayingYarn = false;
      drawPlayroomScene();
      save();
      renderHome();
    }, 1100);
  }

  $('wPlay')?.addEventListener('click', function () {
    yarnX = 160 + Math.random() * 150;
    playYarn();
  });

  /* ---------------- ALBUM TAB ---------------- */
  $('actSnap')?.addEventListener('click', function () {
    var p = {
      t: Date.now(),
      where: 'Sockney Laundry Basket',
      likes: 1,
      svg: sockneySVG({}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
    };
    S.album.unshift(p);
    Snd.play('chime');
    alert('📸 แชะ! ถ่ายรูป Sockney เก็บในอัลบั้มความอบอุ่นเรียบร้อยแล้ว!');
    save();
    renderAlbum();
  });

  function renderAlbum() {
    var a = $('album');
    if (!a) return;
    a.innerHTML = '';
    if (!S.album.length) {
      a.innerHTML = '<p class="hint" style="grid-column:1/-1">ยังไม่มีรูปถ่ายเลย กด 📸 ถ่ายรูป ที่หน้าแรกได้เลยนะ!</p>';
      return;
    }
    S.album.forEach(function (p, i) {
      var d = document.createElement('div');
      d.className = 'ph';
      d.innerHTML =
        '<div class="pm"><span>📍 ' + p.where + '</span><button class="ph-del" data-i="' + i + '">🗑</button></div>' +
        '<div style="background:#fff8fb"><svg viewBox="-100 -75 200 175">' + p.svg + '</svg></div>' +
        '<div class="pm"><button class="ph-like" data-i="' + i + '">❤️ ' + (p.likes || 1) + '</button></div>';
      a.appendChild(d);
    });

    a.querySelectorAll('.ph-like').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = +this.getAttribute('data-i');
        S.album[idx].likes = (S.album[idx].likes || 0) + 1;
        Snd.play('chime');
        this.textContent = '❤️ ' + S.album[idx].likes;
        save();
      });
    });

    a.querySelectorAll('.ph-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = +this.getAttribute('data-i');
        S.album.splice(idx, 1);
        Snd.play('chime');
        save();
        renderAlbum();
      });
    });
  }

  /* ---------------- TABS & BOOT ---------------- */
  var sndBtn = $('sndBtn');
  if (sndBtn) {
    sndBtn.textContent = Snd.isEnabled() ? '🔊 Sound' : '🔇 Muted';
    sndBtn.addEventListener('click', function () {
      var on = Snd.toggle();
      sndBtn.textContent = on ? '🔊 Sound' : '🔇 Muted';
      if (on) Snd.play('chime');
    });
  }

  var TABS = [
    ['tabHome', 'pHome'],
    ['tabFeed', 'pFeed'],
    ['tabDress', 'pDress'],
    ['tabWalk', 'pWalk'],
    ['tabPhotos', 'pPhotos']
  ];
  TABS.forEach(function (t) {
    var btn = $(t[0]);
    if (!btn) return;
    btn.addEventListener('click', function () {
      TABS.forEach(function (x) {
        $(x[0]).classList.remove('on');
        $(x[1]).classList.remove('on');
      });
      $(t[0]).classList.add('on');
      $(t[1]).classList.add('on');
      Snd.play('chime');
      if (t[1] === 'pWalk') drawPlayroomScene();
      if (t[1] === 'pFeed') renderFoodStage();
      if (t[1] === 'pDress') renderWardrobe();
      if (t[1] === 'pPhotos') renderAlbum();
    });
  });

  renderHome();
  renderLaundryCafe();
  renderWardrobe();
  drawPlayroomScene();
  renderAlbum();

  if (window.GameStats) {
    GameStats.record('sockney', { score: S.love, buttons: S.buttons });
  }
})();
