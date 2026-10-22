/* Sealstagram — raise Boba the baby seal & explore the Seal Society! (seal.js)
   Features:
   - Living animated kawaii Boba the Seal with boba-pearl dark eyes & squishy physics
   - The Seal Society: Dads, moms, newborn baby twins, surfer bro, wise grandpa, stylish aunt, explorer uncle
   - Seal Society Interactions: Nose kisses, snack gifting, family photos & play-as character switching
   - Twin Baby Pups Nursery: Milk bottles, rattle toys, lullabies
   - Seal Family Choir: Musical interactive keyboard with unique vocal arf pitches & harmony song
   - Pure Web Audio API squishy sound synthesis (boops, squeaks, chomps, splashes, pops, choir notes)
   - Live 60fps feeding animation with 8 illustrated ocean snacks (featuring Boba's favorite Squid!)
   - Kawaii seal boutique wardrobe (hats, collars, outfits, randomizer)
   - Ocean swimming exploration (6 scenic ocean worlds, swim-to-tap, pearl collecting)
   - Beach ball volley mini-game with timing bounce & combo scoring
   - Interactive bubble bath mode with poppable soap bubbles
   - Sealstagram photo album with Polaroid cards, like counters & PNG image downloads
*/
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------------- SOUND SYNTHESIZER (Web Audio API) ----------------
     ponytail: 100% zero-asset sound synthesizer using native Web Audio API. */
  var Snd = (function () {
    var ctx = null;
    var enabled = lsGet('seal_sound') !== 'off';

    function getCtx() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(function () {});
      }
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

        if (kind === 'boop') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(920, now + 0.09);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.start(now); osc.stop(now + 0.15);
        } else if (kind === 'squeak') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(760, now);
          osc.frequency.linearRampToValueAtTime(1180, now + 0.07);
          osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now); osc.stop(now + 0.21);
        } else if (kind === 'pop') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          osc.start(now); osc.stop(now + 0.08);
        } else if (kind === 'chomp') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now); osc.stop(now + 0.1);
        } else if (kind === 'splash') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);
          gain.gain.setValueAtTime(0.13, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now); osc.stop(now + 0.26);
        } else if (kind === 'bounce') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(310, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.11);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now); osc.stop(now + 0.17);
        } else if (kind === 'pearl') {
          [523, 659, 784, 1046].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.045;
            g.gain.setValueAtTime(0.07, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            o.start(t); o.stop(t + 0.23);
          });
        } else if (kind === 'snap') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(1100, now);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          osc.start(now); osc.stop(now + 0.05);
        } else if (kind === 'rattle') {
          [800, 1200, 950, 1400].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'triangle';
            o.frequency.value = f;
            var t = now + i * 0.04;
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            o.start(t); o.stop(t + 0.09);
          });
        } else if (kind === 'lullaby') {
          [523, 587, 659, 784, 880].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.15;
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            o.start(t); o.stop(t + 0.42);
          });
        } else if (kind === 'hug') {
          [440, 554.37, 659.25, 880].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.035;
            g.gain.setValueAtTime(0.09, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            o.start(t); o.stop(t + 0.36);
          });
        } else if (kind === 'purr') {
          var o = c.createOscillator(), g = c.createGain();
          o.connect(g); g.connect(c.destination);
          o.type = 'triangle';
          o.frequency.setValueAtTime(180, now);
          o.frequency.linearRampToValueAtTime(240, now + 0.12);
          o.frequency.linearRampToValueAtTime(170, now + 0.28);
          g.gain.setValueAtTime(0.08, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
          o.start(now); o.stop(now + 0.33);
        } else if (kind === 'coo') {
          var o = c.createOscillator(), g = c.createGain();
          o.connect(g); g.connect(c.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(460, now);
          o.frequency.exponentialRampToValueAtTime(680, now + 0.08);
          o.frequency.exponentialRampToValueAtTime(520, now + 0.24);
          g.gain.setValueAtTime(0.12, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
          o.start(now); o.stop(now + 0.28);
        } else if (kind === 'quizCorrect') {
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'triangle';
            o.frequency.value = f;
            var t = now + i * 0.06;
            g.gain.setValueAtTime(0.1, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            o.start(t); o.stop(t + 0.26);
          });
        } else if (kind === 'quizWrong') {
          [392, 329.63].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.1;
            g.gain.setValueAtTime(0.09, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            o.start(t); o.stop(t + 0.24);
          });
        }
      } catch (e) {}
    }

    var CHOIR_NOTES = {
      oolong:  { f: 130, type: 'triangle', name: 'OOONG!' },
      barnaby: { f: 175, type: 'sawtooth', name: 'AH-HOY!' },
      chai:    { f: 220, type: 'sine',     name: 'HO-HO!' },
      matcha:  { f: 290, type: 'sine',     name: 'MRRRP~' },
      taro:    { f: 370, type: 'triangle', name: 'ARF!' },
      sakura:  { f: 440, type: 'sine',     name: 'LAA~' },
      boba:    { f: 550, type: 'sine',     name: 'SQUEAK!' },
      mochi:   { f: 880, type: 'sine',     name: 'PIP!' }
    };

    function playChoirNote(k) {
      if (!enabled) return;
      try {
        var c = getCtx();
        if (!c) return;
        var info = CHOIR_NOTES[k] || CHOIR_NOTES.boba;
        var now = c.currentTime;
        var osc = c.createOscillator(), gain = c.createGain();
        osc.connect(gain); gain.connect(c.destination);
        osc.type = info.type;
        osc.frequency.setValueAtTime(info.f, now);
        osc.frequency.exponentialRampToValueAtTime(info.f * 1.05, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.start(now); osc.stop(now + 0.4);
      } catch (e) {}
    }

    function playChoirHarmony() {
      if (!enabled) return;
      try {
        var c = getCtx();
        if (!c) return;
        var keys = Object.keys(CHOIR_NOTES);
        var now = c.currentTime;
        keys.forEach(function (k, i) {
          var info = CHOIR_NOTES[k];
          var osc = c.createOscillator(), gain = c.createGain();
          osc.connect(gain); gain.connect(c.destination);
          osc.type = info.type;
          var t = now + i * 0.12;
          osc.frequency.setValueAtTime(info.f, t);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.start(t); osc.stop(t + 0.46);
        });
        // Finale chord
        var chord = [130, 260, 390, 520, 650];
        chord.forEach(function (f) {
          var osc = c.createOscillator(), gain = c.createGain();
          osc.connect(gain); gain.connect(c.destination);
          osc.type = 'sine';
          var t = now + keys.length * 0.12 + 0.1;
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
          osc.start(t); osc.stop(t + 0.82);
        });
      } catch (e) {}
    }

    function toggle() {
      enabled = !enabled;
      lsSet('seal_sound', enabled ? 'on' : 'off');
      return enabled;
    }

    return {
      play: play,
      toggle: toggle,
      isEnabled: function () { return enabled; },
      playChoirNote: playChoirNote,
      playChoirHarmony: playChoirHarmony,
      CHOIR_NOTES: CHOIR_NOTES
    };
  })();

  /* ---------------- SPEECH SYNTHESIZER (Web Speech API) ----------------
     ponytail: Native Web Speech API for cute English, Chinese, and Japanese pronunciation. */
  var Voice = (function () {
    var enabled = lsGet('seal_voice') !== 'off';

    function speak(text, lang) {
      if (!enabled) return;
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        var cleanText = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu, '').replace(/[~✨💕💖🌸🫧🥺👉🐽🦭💙]/g, '').trim();
        if (!cleanText) return;
        var u = new SpeechSynthesisUtterance(cleanText);
        u.rate = 0.9;
        u.pitch = 1.25;

        var langMap = { en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', th: 'th-TH' };
        u.lang = langMap[lang] || 'th-TH';

        var voices = window.speechSynthesis.getVoices();
        if (voices && voices.length) {
          var targetPrefix = (lang === 'en') ? 'en' : (lang === 'zh') ? 'zh' : (lang === 'ja') ? 'ja' : 'th';
          var v = voices.find(function (item) {
            return item.lang && item.lang.toLowerCase().startsWith(targetPrefix);
          });
          if (v) u.voice = v;
        }
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }

    function toggle() {
      enabled = !enabled;
      lsSet('seal_voice', enabled ? 'on' : 'off');
      return enabled;
    }

    return {
      speak: speak,
      toggle: toggle,
      isEnabled: function () { return enabled; }
    };
  })();

  /* ---------------- STATE MANAGEMENT ---------------- */
  var DEFAULT = {
    born: Date.now(),
    love: 0,
    coins: 15,
    food: 80,
    happy: 80,
    clean: 80,
    affection: 85,
    hugs: 0,
    pats: 0,
    lang: 'th',
    polyglot: {
      xp: 0,
      streak: 0,
      quizzesDone: 0
    },
    lastTick: Date.now(),
    days: 0,
    outfit: { hat: 'none', collar: 'none', cloth: 'none' },
    favFood: 'squid',
    album: [],
    boops: 0,
    comboMax: 0,
    society: {
      activeChar: 'boba',
      selectedMember: 'oolong',
      harmony: 25,
      aff: {
        oolong: 2,
        matcha: 2,
        taro: 2,
        mochi: 2,
        chai: 1,
        sakura: 1,
        barnaby: 1
      },
      giftsGiven: 0
    }
  };

  var S;
  try {
    S = JSON.parse(lsGet('sealstagram') || lsGet('sealtagram') || 'null');
  } catch (e) {
    S = null;
  }
  if (!S) {
    S = JSON.parse(JSON.stringify(DEFAULT));
    save();
  } else {
    for (var k in DEFAULT) if (S[k] === undefined) S[k] = DEFAULT[k];
    if (!S.outfit) S.outfit = { hat: 'none', collar: 'none', cloth: 'none' };
    if (!S.album) S.album = [];
    if (!S.society) S.society = JSON.parse(JSON.stringify(DEFAULT.society));
    if (!S.society.aff) S.society.aff = JSON.parse(JSON.stringify(DEFAULT.society.aff));
    if (S.affection === undefined) S.affection = 85;
    if (S.hugs === undefined) S.hugs = 0;
    if (S.pats === undefined) S.pats = 0;
    if (!S.lang) S.lang = 'th';
    if (!S.polyglot) S.polyglot = { xp: 0, streak: 0, quizzesDone: 0 };
  }

  function save() {
    lsSet('sealstagram', JSON.stringify(S));
    lsSet('sealtagram', JSON.stringify(S));
  }

  /* ---------------- THE SEAL SOCIETY CATALOG ---------------- */
  var SEALS = {
    boba: {
      id: 'boba', name: 'Boba', thai: 'โบบา',
      gender: 'female', role: 'Little Sister · ลูกสาวตัวน้อย (You!)',
      tag: 'Protagonist', emoji: '🦭',
      gr: '#e8f2f9', grd: '#b5cde0', grl: '#7b9cb8', wh: '#ffffff',
      favFood: 'squid',
      greeting: "Arf arf! I'm Boba, the roundest baby seal in the family! Let's play together 💙",
      bio: 'Cute, squishy, and curious. Loves bouncing beach balls and eating fresh squid.'
    },
    oolong: {
      id: 'oolong', name: 'Papa Oolong', thai: 'ปะป๊า อู่หลง',
      gender: 'male', role: 'Dad · ตัวผู้ (The Chonky Dad)',
      tag: 'Father', emoji: '👨⚓',
      gr: '#8ca2b9', grd: '#6c85a0', grl: '#526b85', wh: '#dbe5ef',
      favFood: 'herring',
      greeting: "Ho ho! Look at my sweet little Boba! Want to take a warm nap on Papa's belly? ⚓",
      bio: 'Big warm chonky dad. Master fisherman and protective guardian of the clan.'
    },
    matcha: {
      id: 'matcha', name: 'Mama Matcha', thai: 'หม่าม้า มัทฉะ',
      gender: 'female', role: 'Mom · ตัวเมีย (The Sweet Mom)',
      tag: 'Mother', emoji: '👩🌸',
      gr: '#eee3d3', grd: '#d2c0a9', grl: '#99846b', wh: '#fffaf2',
      favFood: 'shrimp',
      greeting: "My precious pup! Have you eaten well today? Mama baked fresh sea kelp cookies for you! 💖",
      bio: 'Gentle harbor seal mom. Known for her sweet melodic voice and caring hugs.'
    },
    taro: {
      id: 'taro', name: 'Taro', thai: 'พี่ชาย ทาโร่',
      gender: 'male', role: 'Big Brother · ตัวผู้ (Surfer Teen)',
      tag: 'Brother', emoji: '🏄‍♂️🌊',
      gr: '#deb992', grd: '#ba946b', grl: '#8c673d', wh: '#fff5ea',
      favFood: 'crab',
      greeting: "Yo Boba! Race you to the coral reef! Watch my triple wave backflip! 🏄",
      bio: 'Fastest swimmer in the bay. Always wearing his surf bandana and practicing water tricks.'
    },
    mochi: {
      id: 'mochi', name: 'Mochi & Pudding', thai: 'น้องแฝด โมจิ & พุดดิ้ง',
      gender: 'pups', role: 'Twin Newborn Pups · ลูกแฝด',
      tag: 'Newborns', emoji: '🍼👶',
      gr: '#ffffff', grd: '#e1eaf2', grl: '#a5b8c9', wh: '#ffffff',
      favFood: 'boba',
      greeting: "Pip pip! *suckles milk bottle* ... *snoozes in clam cradle* 🍼✨",
      bio: 'Fluffy white baby seal twins! They sleep in a pink clam cradle and love lullabies.'
    },
    chai: {
      id: 'chai', name: 'Grandpa Chai', thai: 'คุณปู่ ชัย',
      gender: 'male', role: 'Grandpa · ญาติผู้ใหญ่ ตัวผู้ (Arctic Elder)',
      tag: 'Grandpa', emoji: '👴👓',
      gr: '#cfdbe6', grd: '#a9bccd', grl: '#70869a', wh: '#f5f9fc',
      favFood: 'clam',
      greeting: "Ho ho ho, little one! Gather round, let Grandpa tell you the tale of the ancient Ice Kingdom... 👓",
      bio: 'Wise silver Arctic elder with reading spectacles and majestic walrus whiskers.'
    },
    sakura: {
      id: 'sakura', name: 'Auntie Sakura', thai: 'คุณน้า ซากุระ',
      gender: 'female', role: 'Aunt · ญาติคุณน้า ตัวเมีย (Fashion Icon)',
      tag: 'Aunt', emoji: '🌸✨',
      gr: '#f0e6eb', grd: '#d6c0cc', grl: '#9d7c8f', wh: '#fff8fb',
      favFood: 'jelly',
      greeting: "Ara ara Boba darling! That ribbon looks stunning on you! Let's take a glamorous selfie together! 🌸",
      bio: 'Fashionista aunt from Japan Sea. Sealstagram influencer with 100,000 followers.'
    },
    barnaby: {
      id: 'barnaby', name: 'Uncle Barnaby', thai: 'คุณอา บาร์นาบี',
      gender: 'male', role: 'Uncle · ญาติคุณอา ตัวผู้ (Ocean Voyager)',
      tag: 'Uncle', emoji: '🧭🗺️',
      gr: '#7389a0', grd: '#586e85', grl: '#3e5267', wh: '#cddae7',
      favFood: 'ice',
      greeting: "Ahoy matey! I just returned from the Antarctic trench with shimmering rainbow pearls! 🧭",
      bio: 'World traveler seal. Navigates by the stars with his trusty golden compass.'
    }
  };

  /* ---------------- CHARACTER ART (SVG) ---------------- */
  function drawSealCharacter(sealKey, opts) {
    opts = opts || {};
    var c = SEALS[sealKey] || SEALS.boba;
    var GR = c.gr, GR_D = c.grd, GR_LINE = c.grl, WH = c.wh, INK = '#1b222c', PK = '#ff9eb5', BL = '#4facfe';

    // Special twin pups representation (Mochi & Pudding)
    if (sealKey === 'mochi') {
      var sM = '';
      sM += '<ellipse cx="0" cy="74" rx="55" ry="9" fill="rgba(40,70,120,.12)"/>';
      sM += '<path d="M -56 56 Q 0 86 56 56 Q 44 24 0 32 Q -44 24 -56 56 Z" fill="#ffe2ec" stroke="#ff9eb5" stroke-width="2.5"/>';
      sM += '<ellipse cx="0" cy="54" rx="46" ry="14" fill="#fff5f8"/>';
      // Left pup
      sM += '<g transform="translate(-18, 30) scale(0.68)">' +
        '<circle cx="0" cy="0" r="32" fill="#fff" stroke="#9bb6ce" stroke-width="2.6"/>' +
        '<ellipse cx="-12" cy="-4" rx="6" ry="7" fill="#1b222c"/><circle cx="-14" cy="-6" r="2.2" fill="#fff"/>' +
        '<ellipse cx="12" cy="-4" rx="6" ry="7" fill="#1b222c"/><circle cx="10" cy="-6" r="2.2" fill="#fff"/>' +
        '<ellipse cx="-16" cy="6" rx="5" ry="3" fill="#ff9eb5" opacity=".7"/><ellipse cx="16" cy="6" rx="5" ry="3" fill="#ff9eb5" opacity=".7"/>' +
        '<ellipse cx="0" cy="5" rx="3.5" ry="2.2" fill="#1b222c"/>' +
        '<path d="M -4 9 Q 0 12 4 9" stroke="#1b222c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '</g>';
      // Right pup
      sM += '<g transform="translate(18, 34) scale(0.64)">' +
        '<circle cx="0" cy="0" r="32" fill="#fff" stroke="#9bb6ce" stroke-width="2.6"/>' +
        '<ellipse cx="-12" cy="-4" rx="6" ry="7" fill="#1b222c"/><circle cx="-14" cy="-6" r="2.2" fill="#fff"/>' +
        '<ellipse cx="12" cy="-4" rx="6" ry="7" fill="#1b222c"/><circle cx="10" cy="-6" r="2.2" fill="#fff"/>' +
        '<ellipse cx="-16" cy="6" rx="5" ry="3" fill="#ff9eb5" opacity=".7"/><ellipse cx="16" cy="6" rx="5" ry="3" fill="#ff9eb5" opacity=".7"/>' +
        '<ellipse cx="0" cy="5" rx="3.5" ry="2.2" fill="#1b222c"/>' +
        '<path d="M -4 9 Q 0 12 4 9" stroke="#1b222c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<circle cx="0" cy="11" r="4.5" fill="#ff8fab"/><circle cx="0" cy="11" r="2" fill="#fff"/>' +
        '</g>';
      sM += '<path d="M -44 48 Q 0 62 44 48 Q 40 70 0 72 Q -40 70 -44 48 Z" fill="#bfe8f7" stroke="#7bdff2" stroke-width="2"/>';
      sM += '<text x="-12" y="66" font-size="12">🍼</text>';
      return wrap(sM, opts);
    }

    var s = '';
    if (!opts.noShadow) {
      s += '<ellipse cx="0" cy="74" rx="60" ry="10" fill="rgba(40,70,120,.14)"/>';
      s += '<ellipse cx="0" cy="72" rx="66" ry="12" fill="none" stroke="#a2d6f9" stroke-width="2.2" opacity=".6" stroke-dasharray="8 6"/>';
    }

    // Tail flippers
    s += '<g class="sealTail">' +
      '<path d="M -22 54 C -46 62, -64 48, -52 34 C -44 44, -24 46, -12 44 Z" fill="' + GR_D + '" stroke="' + GR_LINE + '" stroke-width="2.4"/>' +
      '<path d="M 22 54 C 46 62, 64 48, 52 34 C 44 44, 24 46, 12 44 Z" fill="' + GR_D + '" stroke="' + GR_LINE + '" stroke-width="2.4"/>' +
      '</g>';

    // Body
    s += '<path d="M -58 20 C -70 46, -60 70, 0 73 C 60 70, 70 46, 58 20 C 50 2, -50 2, -58 20 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.8" stroke-linejoin="round"/>';
    s += '<path d="M -38 26 C -48 48, -38 66, 0 68 C 38 66, 48 48, 38 26 C 28 14, -28 14, -38 26 Z" fill="' + WH + '"/>';

    // Character specific body accents
    if (sealKey === 'taro') {
      s += '<ellipse cx="-42" cy="26" rx="4" ry="2.5" fill="' + GR_D + '" opacity=".7"/><ellipse cx="-38" cy="40" rx="3.5" ry="2" fill="' + GR_D + '" opacity=".7"/><ellipse cx="40" cy="30" rx="4" ry="2.5" fill="' + GR_D + '" opacity=".7"/>';
    } else if (sealKey === 'oolong') {
      s += '<path d="M 44 42 L 44 50 M 40 44 H 48 M 41 49 Q 44 53 47 49" stroke="#1d4e89" stroke-width="1.8" fill="none"/>';
    } else if (sealKey === 'barnaby') {
      s += '<path d="M -22 22 Q 0 34 22 22" stroke="#b08968" stroke-width="3" fill="none"/>';
      s += '<circle cx="0" cy="34" r="7" fill="#ffd166" stroke="#c9931a" stroke-width="1.8"/><polygon points="0,30 3,34 0,38 -3,34" fill="#e53e3e"/>';
    } else if (sealKey === 'matcha') {
      s += '<g transform="translate(0,22)">';
      for (var i = -3; i <= 3; i++) s += '<circle cx="' + (i * 7) + '" cy="' + (Math.abs(i) * -1) + '" r="3.2" fill="#fff" stroke="#dfc7b0" stroke-width="1.2"/>';
      s += '</g>';
    } else if (sealKey === 'sakura') {
      s += '<path d="M -28 22 Q 0 34 28 22" stroke="#b28dff" stroke-width="7" fill="none" stroke-linecap="round"/>';
    }

    // Flippers
    var clap = opts.clap || false;
    if (clap) {
      s += '<g class="sealFlipClapL"><path d="M -44 32 C -24 38, -14 48, -4 44 C 4 40, -18 24, -36 24 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="-8" cy="42" r="1.4" fill="' + GR_LINE + '"/><circle cx="-13" cy="45" r="1.4" fill="' + GR_LINE + '"/></g>';
      s += '<g class="sealFlipClapR"><path d="M 44 32 C 24 38, 14 48, 4 44 C -4 40, 18 24, 36 24 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="8" cy="42" r="1.4" fill="' + GR_LINE + '"/><circle cx="13" cy="45" r="1.4" fill="' + GR_LINE + '"/></g>';
    } else {
      s += '<g class="sealFlipL"><path d="M -46 28 C -66 38, -68 56, -42 54 C -36 46, -34 36, -46 28 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="-56" cy="46" r="1.5" fill="' + GR_LINE + '"/><circle cx="-51" cy="51" r="1.5" fill="' + GR_LINE + '"/></g>';
      s += '<g class="sealFlipR"><path d="M 46 28 C 66 38, 68 56, 42 54 C 36 46, 34 36, 46 28 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="56" cy="46" r="1.5" fill="' + GR_LINE + '"/><circle cx="51" cy="51" r="1.5" fill="' + GR_LINE + '"/></g>';
    }

    // Head group
    s += '<g transform="translate(0,-12)">';
    s += '<path d="M 0 -54 C 42 -54, 56 -32, 56 -4 C 56 26, 38 34, 0 36 C -38 34, -56 26, -56 -4 C -56 -32, -42 -54, 0 -54 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.8"/>';
    s += '<path d="M -22 -44 Q 0 -50 22 -44" stroke="rgba(255,255,255,0.7)" stroke-width="4.5" fill="none" stroke-linecap="round"/>';

    // Muzzle pads
    s += '<path d="M -30 2 C -38 2, -40 18, -24 22 C -12 24, 0 16, 0 8 C 0 16, 12 24, 24 22 C 40 18, 38 2, 30 2 C 18 2, 10 4, 0 4 C -10 4, -18 2, -30 2 Z" fill="' + WH + '" stroke="' + GR_D + '" stroke-width="1.8"/>';
    s += '<ellipse cx="-34" cy="2" rx="9.5" ry="5.8" fill="' + PK + '" opacity=".72"/><ellipse cx="34" cy="2" rx="9.5" ry="5.8" fill="' + PK + '" opacity=".72"/>';

    // Whiskers
    if (sealKey === 'chai') {
      s += '<path d="M -24 12 Q -38 26 -46 44 M -20 16 Q -30 32 -38 50 M 24 12 Q 38 26 46 44 M 20 16 Q 30 32 38 50" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
    } else if (sealKey === 'oolong') {
      s += '<path d="M -22 14 C -12 24, 0 16, 0 14 C 0 16, 12 24, 22 14" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>';
      s += '<g class="sealWhiskerL"><path d="M -26 12 Q -48 10 -60 6" stroke="' + GR_LINE + '" stroke-width="2" fill="none"/></g>';
      s += '<g class="sealWhiskerR"><path d="M 26 12 Q 48 10 60 6" stroke="' + GR_LINE + '" stroke-width="2" fill="none"/></g>';
    } else {
      s += '<g class="sealWhiskerL"><path d="M -26 12 Q -48 10 -62 6 M -26 16 Q -48 18 -60 22 M -24 20 Q -44 26 -56 32" stroke="' + GR_LINE + '" stroke-width="2" stroke-linecap="round" fill="none"/></g>';
      s += '<g class="sealWhiskerR"><path d="M 26 12 Q 48 10 62 6 M 26 16 Q 48 18 60 22 M 24 20 Q 44 26 56 32" stroke="' + GR_LINE + '" stroke-width="2" stroke-linecap="round" fill="none"/></g>';
    }

    // Eyes
    if (sealKey === 'barnaby') {
      s += '<ellipse cx="-23" cy="-14" rx="12" ry="13" fill="#2d3748"/><path d="M -36 -28 L -12 2" stroke="#1b222c" stroke-width="2.4"/>';
      s += '<ellipse cx="23" cy="-14" rx="11.5" ry="12.5" fill="' + INK + '"/><ellipse cx="23" cy="-9" rx="8" ry="5.5" fill="' + BL + '" opacity=".55"/><ellipse cx="19.2" cy="-18" rx="4.5" ry="4.8" fill="#fff"/><circle cx="27.2" cy="-10" r="2.2" fill="#fff"/>';
    } else if (sealKey === 'taro') {
      s += '<path d="M -32 -13 Q -22 -20 -12 -13" stroke="' + INK + '" stroke-width="3.8" fill="none" stroke-linecap="round"/>';
      s += '<ellipse cx="23" cy="-14" rx="11.5" ry="12.5" fill="' + INK + '"/><ellipse cx="23" cy="-9" rx="8" ry="5.5" fill="' + BL + '" opacity=".55"/><ellipse cx="19.2" cy="-18" rx="4.5" ry="4.8" fill="#fff"/><circle cx="27.2" cy="-10" r="2.2" fill="#fff"/>';
    } else {
      function eye(cx) {
        return '<ellipse cx="' + cx + '" cy="-14" rx="11.5" ry="12.5" fill="' + INK + '"/>' +
          '<ellipse cx="' + cx + '" cy="-9" rx="8" ry="5.5" fill="' + BL + '" opacity=".55"/>' +
          '<ellipse cx="' + (cx - 3.8) + '" cy="-18" rx="4.5" ry="4.8" fill="#fff"/>' +
          '<circle cx="' + (cx + 4.2) + '" cy="-10" r="2.2" fill="#fff" opacity=".95"/>';
      }
      s += '<g class="sealBlink">' + eye(-23) + eye(23) + '</g>';
    }

    if (sealKey === 'chai') {
      s += '<circle cx="-23" cy="-14" r="12" fill="none" stroke="#b08968" stroke-width="2.2"/><circle cx="23" cy="-14" r="12" fill="none" stroke="#b08968" stroke-width="2.2"/><line x1="-11" y1="-14" x2="11" y2="-14" stroke="#b08968" stroke-width="2.2"/>';
    }

    // Head Accessories
    if (sealKey === 'oolong') {
      s += '<path d="M -26 -44 Q 0 -66 26 -44 Z" fill="#e65100" stroke="#bf360c" stroke-width="2.2"/><rect x="-28" y="-46" width="56" height="8" rx="4" fill="#ff9800"/>';
    } else if (sealKey === 'taro') {
      s += '<path d="M -38 -34 Q 0 -44 38 -34" stroke="#00b4d8" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="28" cy="-30" r="4.5" fill="#00b4d8"/>';
    } else if (sealKey === 'matcha') {
      s += '<g transform="translate(26,-46)"><circle r="7" fill="#ff8fab"/><circle r="2.5" fill="#ffd166"/></g>';
    } else if (sealKey === 'sakura') {
      s += '<g transform="translate(26,-46)"><circle cx="-4" cy="-4" r="4.5" fill="#ffb3c6"/><circle cx="4" cy="-4" r="4.5" fill="#ffb3c6"/><circle cx="0" cy="4" r="4.5" fill="#ffb3c6"/><circle r="2.5" fill="#ffd166"/></g>';
    }

    // Nose & mouth
    s += '<path d="M -6.5 5 C -7 0, 7 0, 6.5 5 C 6 9.5, -6 9.5, -6.5 5 Z" fill="' + INK + '"/><ellipse cx="-2.2" cy="3.8" rx="2.2" ry="1.2" fill="#fff" opacity=".85"/>';
    s += '<path d="M -8 11 Q -4 16 0 11 Q 4 16 8 11" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';

    s += '</g>';
    return wrap(s, opts);
  }

  function sealSVG(opts) {
    opts = opts || {};
    var charKey = opts.sealKey || S.society.activeChar || 'boba';
    if (charKey !== 'boba' && SEALS[charKey]) {
      return drawSealCharacter(charKey, opts);
    }
    // Boba primary character
    var mood = opts.mood || moodOf();
    var o = S.outfit;
    var clap = opts.clap || opts.petting || opts.hug || opts.tummy || false;
    var bobY = opts.bobY || 0;
    var s = '';
    var GR = '#e8f2f9', GR_D = '#b5cde0', GR_LINE = '#7b9cb8', WH = '#ffffff', INK = '#1b222c', PK = '#ff9eb5', BL = '#4facfe';

    if (!opts.noShadow) {
      s += '<ellipse cx="0" cy="74" rx="60" ry="10" fill="rgba(40,70,120,.14)"/>';
      s += '<ellipse cx="0" cy="72" rx="66" ry="12" fill="none" stroke="#a2d6f9" stroke-width="2.2" opacity=".6" stroke-dasharray="8 6"/>';
    }

    s += '<g class="sealTail">' +
      '<path d="M -22 54 C -46 62, -64 48, -52 34 C -44 44, -24 46, -12 44 Z" fill="' + GR_D + '" stroke="' + GR_LINE + '" stroke-width="2.4"/>' +
      '<path d="M 22 54 C 46 62, 64 48, 52 34 C 44 44, 24 46, 12 44 Z" fill="' + GR_D + '" stroke="' + GR_LINE + '" stroke-width="2.4"/>' +
      '</g>';

    s += '<path d="M -58 20 C -70 46, -60 70, 0 73 C 60 70, 70 46, 58 20 C 50 2, -50 2, -58 20 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.8" stroke-linejoin="round"/>';
    s += '<path d="M -38 26 C -48 48, -38 66, 0 68 C 38 66, 48 48, 38 26 C 28 14, -28 14, -38 26 Z" fill="' + WH + '"/>';

    if (CLOTHES[o.cloth]) s += CLOTHES[o.cloth].draw();

    if (clap) {
      s += '<g class="sealFlipClapL"><path d="M -44 32 C -24 38, -14 48, -4 44 C 4 40, -18 24, -36 24 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="-8" cy="42" r="1.4" fill="' + GR_LINE + '"/><circle cx="-13" cy="45" r="1.4" fill="' + GR_LINE + '"/></g>';
      s += '<g class="sealFlipClapR"><path d="M 44 32 C 24 38, 14 48, 4 44 C -4 40, 18 24, 36 24 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="8" cy="42" r="1.4" fill="' + GR_LINE + '"/><circle cx="13" cy="45" r="1.4" fill="' + GR_LINE + '"/></g>';
    } else {
      s += '<g class="sealFlipL"><path d="M -46 28 C -66 38, -68 56, -42 54 C -36 46, -34 36, -46 28 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="-56" cy="46" r="1.5" fill="' + GR_LINE + '"/><circle cx="-51" cy="51" r="1.5" fill="' + GR_LINE + '"/></g>';
      s += '<g class="sealFlipR"><path d="M 46 28 C 66 38, 68 56, 42 54 C 36 46, 34 36, 46 28 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.4"/><circle cx="56" cy="46" r="1.5" fill="' + GR_LINE + '"/><circle cx="51" cy="51" r="1.5" fill="' + GR_LINE + '"/></g>';
    }

    if (COLLARS[o.collar]) s += COLLARS[o.collar].draw();

    s += '<g transform="translate(0,' + (-12 + bobY).toFixed(1) + ')">';
    s += headSVG(mood, opts);
    if (HATS[o.hat] && !opts.bathing && !opts.tutor) s += HATS[o.hat].draw();
    s += '</g>';

    if (opts.extra) s += opts.extra;
    if (opts.petting) s += '<text x="-64" y="-60" font-size="20">💕</text><text x="44" y="-68" font-size="18">🫧</text>';

    // Cozy Overlays
    if (opts.hug) {
      s += '<g transform="translate(0, 36) scale(0.92)"><path d="M 0 10 C -18 -12 -38 6 0 32 C 38 6 18 -12 0 10 Z" fill="#ff4d6d" stroke="#c9184a" stroke-width="2.2"/><circle cx="-8" cy="8" r="3" fill="#fff" opacity=".5"/></g>';
      s += '<text x="-70" y="-45" font-size="22">💖</text><text x="48" y="-55" font-size="20">💕</text><text x="-48" y="60" font-size="18">✨</text>';
    }
    if (opts.pat) {
      s += '<g transform="translate(18, -75)"><text font-size="26">🫳</text><circle cx="6" cy="18" r="3" fill="#ffd166"/><circle cx="18" cy="12" r="2.5" fill="#ffd166"/></g>';
      s += '<text x="-62" y="-55" font-size="20">✨</text><text x="45" y="-50" font-size="18">🌸</text>';
    }
    if (opts.tummy) {
      s += '<text x="-65" y="40" font-size="20">🌸</text><text x="50" y="38" font-size="20">🌸</text><text x="0" y="85" font-size="16">✨</text>';
    }
    if (opts.beg) {
      s += '<text x="-58" y="-55" font-size="20">🥺</text><text x="42" y="-55" font-size="20">💕</text>';
    }
    if (opts.tutor) {
      s += '<g transform="translate(0, -68)">' +
        '<polygon points="0,-18 36,-6 0,6 -36,-6" fill="#1d3557" stroke="#112233" stroke-width="2.2"/>' +
        '<rect x="-14" y="2" width="28" height="12" rx="4" fill="#1d3557"/>' +
        '<line x1="26" y1="-3" x2="30" y2="14" stroke="#ffd166" stroke-width="2.5"/>' +
        '<circle cx="30" cy="15" r="3" fill="#e76f51"/>' +
        '</g>';
      s += '<g transform="translate(0, -26)">' +
        '<circle cx="-23" cy="0" r="13" fill="none" stroke="#2b2d42" stroke-width="2.6"/>' +
        '<circle cx="23" cy="0" r="13" fill="none" stroke="#2b2d42" stroke-width="2.6"/>' +
        '<line x1="-10" y1="0" x2="10" y2="0" stroke="#2b2d42" stroke-width="2.6"/>' +
        '</g>';
      s += '<g transform="translate(42, 38)">' +
        '<rect x="-6" y="-12" width="16" height="24" rx="3" fill="#ff70a6" stroke="#c9184a" stroke-width="1.8"/>' +
        '<line x1="-3" y1="-6" x2="7" y2="-6" stroke="#fff" stroke-width="1.5"/>' +
        '<line x1="-3" y1="0" x2="7" y2="0" stroke="#fff" stroke-width="1.5"/>' +
        '<line x1="-3" y1="6" x2="7" y2="6" stroke="#fff" stroke-width="1.5"/>' +
        '</g>';
    }

    return wrap(s, opts);
  }

  function headSVG(mood, opts) {
    opts = opts || {};
    var isPet = !!opts.petting;
    var isHug = !!opts.hug;
    var isPat = !!opts.pat;
    var isTummy = !!opts.tummy;
    var isBeg = !!opts.beg;
    var effMood = (isHug || isPat || isTummy) ? 'cozy' : (isBeg ? 'beg' : (isPet ? 'happy' : mood));
    var h = '';
    var GR = '#e8f2f9', GR_D = '#b5cde0', GR_LINE = '#7b9cb8', WH = '#ffffff', INK = '#1b222c', PK = '#ff9eb5', BL = '#4facfe';

    h += '<path d="M 0 -54 C 42 -54, 56 -32, 56 -4 C 56 26, 38 34, 0 36 C -38 34, -56 26, -56 -4 C -56 -32, -42 -54, 0 -54 Z" fill="' + GR + '" stroke="' + GR_LINE + '" stroke-width="2.8"/>';
    h += '<path d="M -22 -44 Q 0 -50 22 -44" stroke="rgba(255,255,255,0.75)" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
    h += '<ellipse cx="-51" cy="-10" rx="2.5" ry="4" fill="' + GR_LINE + '" opacity=".55"/>';
    h += '<ellipse cx="51" cy="-10" rx="2.5" ry="4" fill="' + GR_LINE + '" opacity=".55"/>';

    h += '<path d="M -30 2 C -38 2, -40 18, -24 22 C -12 24, 0 16, 0 8 C 0 16, 12 24, 24 22 C 40 18, 38 2, 30 2 C 18 2, 10 4, 0 4 C -10 4, -18 2, -30 2 Z" fill="' + WH + '" stroke="' + GR_D + '" stroke-width="1.8"/>';

    // Deep blushes if cozy or hugging
    if (effMood === 'cozy') {
      h += '<ellipse cx="-34" cy="2" rx="12" ry="7.5" fill="#ff6b8b" opacity=".85"/><ellipse cx="34" cy="2" rx="12" ry="7.5" fill="#ff6b8b" opacity=".85"/>';
    } else {
      h += '<ellipse cx="-34" cy="2" rx="9.5" ry="5.8" fill="' + PK + '" opacity=".72"/><ellipse cx="34" cy="2" rx="9.5" ry="5.8" fill="' + PK + '" opacity=".72"/>';
    }
    h += '<path d="M -34 -3 l 1.2 2 2 1.2 -2 1.2 -1.2 2 -1.2 -2 -2 -1.2 2 -1.2 Z" fill="#fff" opacity=".9"/>';
    h += '<path d="M 34 -3 l 1.2 2 2 1.2 -2 1.2 -1.2 2 -1.2 -2 -2 -1.2 2 -1.2 Z" fill="#fff" opacity=".9"/>';

    var eyeGroup = bigEye(-23, effMood, effMood === 'sad') + bigEye(23, effMood, effMood === 'sad');
    h += '<g class="sealBlink">' + eyeGroup + '</g>';

    h += '<circle cx="-16" cy="11" r="1.5" fill="' + GR_LINE + '"/><circle cx="-22" cy="14" r="1.5" fill="' + GR_LINE + '"/><circle cx="-15" cy="17" r="1.5" fill="' + GR_LINE + '"/>';
    h += '<circle cx="16" cy="11" r="1.5" fill="' + GR_LINE + '"/><circle cx="22" cy="14" r="1.5" fill="' + GR_LINE + '"/><circle cx="15" cy="17" r="1.5" fill="' + GR_LINE + '"/>';
    h += '<g class="sealWhiskerL"><path d="M -26 12 Q -48 10 -62 6 M -26 16 Q -48 18 -60 22 M -24 20 Q -44 26 -56 32" stroke="' + GR_LINE + '" stroke-width="2" stroke-linecap="round" fill="none"/></g>';
    h += '<g class="sealWhiskerR"><path d="M 26 12 Q 48 10 62 6 M 26 16 Q 48 18 60 22 M 24 20 Q 44 26 56 32" stroke="' + GR_LINE + '" stroke-width="2" stroke-linecap="round" fill="none"/></g>';

    h += '<path d="M -6.5 5 C -7 0, 7 0, 6.5 5 C 6 9.5, -6 9.5, -6.5 5 Z" fill="' + INK + '"/>';
    h += '<ellipse cx="-2.2" cy="3.8" rx="2.2" ry="1.2" fill="#fff" opacity=".85"/>';

    if (opts.chomp) {
      h += '<path d="M -11 10 C -12 25, 12 25, 11 10 Z" fill="#912847" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<ellipse cx="0" cy="18" rx="6" ry="4" fill="#ff7da7"/>';
    } else if (effMood === 'sad') {
      h += '<path d="M -7 20 Q 0 14 7 20" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    } else if (effMood === 'beg') {
      h += '<path d="M -6 13 Q 0 9 6 13" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    } else if (effMood === 'happy' || effMood === 'cozy' || isPet) {
      h += '<path d="M -8 11 C -8 22, 8 22, 8 11 Z" fill="#e05375" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M -4 16 Q 0 20 4 16 Z" fill="#ff9ebb"/>' +
        '<path d="M -8 11 Q -4 14 0 11 Q 4 14 8 11" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    } else {
      h += '<path d="M -8 11 Q -4 15 0 11 Q 4 15 8 11" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    }

    if (opts.bathing) {
      h += '<g transform="translate(0,-52)">' +
        '<circle cx="-16" cy="4" r="10" fill="#fff" stroke="#cae5ff" stroke-width="1.8"/>' +
        '<circle cx="0" cy="0" r="12" fill="#fff" stroke="#cae5ff" stroke-width="1.8"/>' +
        '<circle cx="16" cy="4" r="10" fill="#fff" stroke="#cae5ff" stroke-width="1.8"/>' +
        '<circle cx="-7" cy="-8" r="8" fill="#fff" stroke="#cae5ff" stroke-width="1.8"/>' +
        '<circle cx="7" cy="-8" r="8" fill="#fff" stroke="#cae5ff" stroke-width="1.8"/>' +
        '<g transform="translate(0,-16)">' +
        '<path d="M -12 6 C -14 0, -4 -4, 4 -4 C 12 -4, 16 0, 14 6 C 10 12, -8 12, -12 6 Z" fill="#ffd166" stroke="#c9931a" stroke-width="1.6"/>' +
        '<circle cx="-4" cy="-3" r="6" fill="#ffd166" stroke="#c9931a" stroke-width="1.6"/>' +
        '<circle cx="-6" cy="-4" r="1.2" fill="#1b222c"/>' +
        '<path d="M -9 -2 L -14 -1 L -9 0 Z" fill="#ff7043"/>' +
        '</g></g>';
    }
    return h;
  }

  function bigEye(cx, mood, teary) {
    var INK = '#1b222c', BL = '#4facfe', PK = '#ff9eb5', GR_LINE = '#7b9cb8';
    if (mood === 'sleep') {
      return '<path d="M ' + (cx - 12) + ' -14 Q ' + cx + ' -6 ' + (cx + 12) + ' -14" stroke="' + INK + '" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
    }
    if (mood === 'happy') {
      return '<path d="M ' + (cx - 12) + ' -12 Q ' + cx + ' -24 ' + (cx + 12) + ' -12" stroke="' + INK + '" stroke-width="4.2" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="' + cx + '" cy="-8" rx="8" ry="4" fill="' + PK + '" opacity=".35"/>';
    }
    if (mood === 'cozy') {
      return '<path d="M ' + (cx - 12) + ' -12 Q ' + cx + ' -24 ' + (cx + 12) + ' -12" stroke="' + INK + '" stroke-width="4.2" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="' + cx + '" cy="-7" rx="9" ry="4.5" fill="#ff7da7" opacity=".5"/>' +
        '<text x="' + (cx - 6) + '" y="-16" font-size="11">💕</text>';
    }
    if (mood === 'beg') {
      return '<ellipse cx="' + cx + '" cy="-14" rx="13" ry="14" fill="' + INK + '"/>' +
        '<ellipse cx="' + (cx - 4) + '" cy="-19" rx="5.5" ry="5.8" fill="#fff"/>' +
        '<circle cx="' + (cx + 5) + '" cy="-10" r="3.2" fill="#fff"/>' +
        '<circle cx="' + (cx - 2) + '" cy="-8" r="1.8" fill="#fff"/>' +
        '<ellipse cx="' + cx + '" cy="-6" rx="7" ry="4" fill="#4facfe" opacity=".4"/>';
    }
    return '<ellipse cx="' + cx + '" cy="-14" rx="11.5" ry="12.5" fill="' + INK + '"/>' +
      '<ellipse cx="' + cx + '" cy="-9" rx="8" ry="5.5" fill="' + BL + '" opacity=".55"/>' +
      '<ellipse cx="' + (cx - 3.8) + '" cy="-18" rx="4.5" ry="4.8" fill="#fff"/>' +
      '<circle cx="' + (cx + 4.2) + '" cy="-10" r="2.2" fill="#fff" opacity=".95"/>' +
      '<circle cx="' + (cx - 2) + '" cy="-8.5" r="1.2" fill="#fff" opacity=".8"/>' +
      '<path d="M ' + (cx - 12) + ' -27 Q ' + cx + ' -34 ${cx + 12} -27" stroke="' + GR_LINE + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      (teary ? '<circle cx="' + (cx + (cx < 0 ? -6 : 6)) + '" cy="-4" r="3.5" fill="#7bdff2"/>' : '');
  }

  function wrap(inner, opts) {
    opts = opts || {};
    var vb = opts.viewBox || '-100 -80 200 180';
    var w = opts.w ? ' width="' + opts.w + '"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"' + w + ' class="sealsvg">' +
      (opts.bg || '') + inner + '</svg>';
  }

  function moodOf() {
    var avg = (S.food + S.happy) / 2;
    if (avg < 25) return 'sad';
    if (avg > 72) return 'happy';
    return 'normal';
  }

  /* ---------------- DRESS CATALOGS ---------------- */
  var HATS = {
    none:   { name: 'None', draw: function () { return ''; } },
    bow:    { name: 'Pink Ribbon 🎀', draw: function () {
      return '<g transform="translate(0,-64)"><path d="M0 0 L-20 -12 Q-30 -2 -22 10 Z" fill="#ff9eb5" stroke="#e05375" stroke-width="2"/><path d="M0 0 L20 -12 Q30 -2 22 10 Z" fill="#ff9eb5" stroke="#e05375" stroke-width="2"/><circle r="5.5" fill="#ff6b8b" stroke="#e05375" stroke-width="2"/></g>';
    } },
    shell:  { name: 'Shell Clip 🐚', draw: function () {
      return '<g transform="translate(22,-56)"><path d="M0 10 Q-14 -3 0 -14 Q14 -3 0 10 Z" fill="#ffe2ec" stroke="#ff9eb5" stroke-width="2.2"/><path d="M0 10 V-13 M-6 6 Q-8 -4 -4 -11 M6 6 Q8 -4 4 -11" stroke="#ff9eb5" stroke-width="1.6" fill="none"/><circle cx="0" cy="4" r="3" fill="#fff" stroke="#ff9eb5" stroke-width="1"/></g>';
    } },
    crown:  { name: 'Ocean Crown 👑', draw: function () {
      return '<g transform="translate(0,-68)"><path d="M-20 8 L-20 -9 L-10 0 L0 -13 L10 0 L20 -9 L20 8 Z" fill="#ffd166" stroke="#c9931a" stroke-width="2.2" stroke-linejoin="round"/><circle cx="0" cy="-2" r="3" fill="#4facfe"/><circle cx="-12" cy="0" r="2.2" fill="#ff6b8b"/><circle cx="12" cy="0" r="2.2" fill="#ff6b8b"/></g>';
    } },
    flower: { name: 'Sea Flower 🌺', draw: function () {
      return '<g transform="translate(20,-56)"><circle r="4.8" fill="#ffd166"/>' +
        '<circle cx="0" cy="-10" r="5.5" fill="#ff6b8b"/><circle cx="9.5" cy="-3" r="5.5" fill="#ff6b8b"/><circle cx="6" cy="8" r="5.5" fill="#ff6b8b"/><circle cx="-6" cy="8" r="5.5" fill="#ff6b8b"/><circle cx="-9.5" cy="-3" r="5.5" fill="#ff6b8b"/></g>';
    } },
    beanie: { name: 'Winter Beanie ❄️', draw: function () {
      return '<g transform="translate(0,-62)"><path d="M-32 6 Q0 -36 32 6 Z" fill="#7ba5e4" stroke="#4873b3" stroke-width="2.4"/><rect x="-34" y="3" width="68" height="10" rx="5" fill="#e8f2fc" stroke="#4873b3" stroke-width="2.2"/><circle cy="-28" r="7" fill="#e8f2fc" stroke="#4873b3" stroke-width="2"/></g>';
    } },
    party:  { name: 'Party Cone 🎉', draw: function () {
      return '<g transform="translate(0,-68)"><path d="M-14 6 L0 -28 L14 6 Z" fill="#b28dff" stroke="#7e57c2" stroke-width="2.2" stroke-linejoin="round"/><circle cy="-30" r="4.8" fill="#ffd166"/><circle cx="-3" cy="-8" r="2.2" fill="#ffd166"/><circle cx="4" cy="-2" r="2.2" fill="#ff9eb5"/></g>';
    } },
    sailor: { name: 'Captain Sailor ⚓', draw: function () {
      return '<g transform="translate(0,-66)"><path d="M-28 6 C-30 -16, 30 -16, 28 6 Z" fill="#ffffff" stroke="#1d4e89" stroke-width="2.4"/><rect x="-30" y="3" width="60" height="7" rx="3.5" fill="#1d4e89"/><path d="M-3 2 L0 -4 L3 2 M-4 -1 H4" stroke="#ffd166" stroke-width="1.6" fill="none"/></g>';
    } },
    ducky:  { name: 'Rubber Ducky 🐥', draw: function () {
      return '<g transform="translate(0,-62)"><path d="M -12 6 C -14 0, -4 -4, 4 -4 C 12 -4, 16 0, 14 6 C 10 12, -8 12, -12 6 Z" fill="#ffd166" stroke="#c9931a" stroke-width="1.8"/>' +
        '<circle cx="-4" cy="-3" r="6" fill="#ffd166" stroke="#c9931a" stroke-width="1.8"/><circle cx="-6" cy="-4" r="1.3" fill="#1b222c"/><path d="M -9 -2 L -15 -1 L -9 0 Z" fill="#ff7043"/></g>';
    } },
    boba:   { name: 'Boba Headband 🧋', draw: function () {
      return '<g transform="translate(0,-64)"><path d="M-30 8 Q0 -12 30 8" stroke="#8d6e63" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
        '<g transform="translate(14,-14)"><rect x="-7" y="-12" width="14" height="20" rx="4" fill="#d7ccc8" stroke="#5d4037" stroke-width="1.6"/><circle cx="-3" cy="2" r="2" fill="#3e2723"/><circle cx="2" cy="3" r="2" fill="#3e2723"/><circle cx="0" cy="-2" r="2" fill="#3e2723"/><rect x="-1.5" y="-18" width="3" height="8" rx="1.5" fill="#ab47bc"/></g></g>';
    } },
    sprout: { name: 'Leaf Sprout 🌱', draw: function () {
      return '<g transform="translate(0,-66)"><path d="M0 0 Q-3 -14 -12 -14 Q-4 -14 0 -5" fill="#52b788" stroke="#2d6a4f" stroke-width="2"/><path d="M0 0 Q3 -14 12 -14 Q4 -14 0 -5" fill="#74c69d" stroke="#2d6a4f" stroke-width="2"/></g>';
    } },
    frog:   { name: 'Froggy Hat 🐸', draw: function () {
      return '<g transform="translate(0,-66)"><path d="M-22 4 C-24 -16, 24 -16, 22 4 Z" fill="#52b788" stroke="#2d6a4f" stroke-width="2.2"/><circle cx="-10" cy="-14" r="5" fill="#52b788" stroke="#2d6a4f" stroke-width="1.8"/><circle cx="10" cy="-14" r="5" fill="#52b788" stroke="#2d6a4f" stroke-width="1.8"/><circle cx="-10" cy="-14" r="2" fill="#1b222c"/><circle cx="10" cy="-14" r="2" fill="#1b222c"/></g>';
    } },
    halo:   { name: 'Angel Halo 😇', draw: function () {
      return '<ellipse cx="0" cy="-72" rx="22" ry="5.5" fill="none" stroke="#ffd166" stroke-width="3"/>';
    } }
  };

  var COLLARS = {
    none:    { name: 'None', draw: function () { return ''; } },
    bell:    { name: 'Shell Collar 🐚', draw: function () {
      return '<path d="M-28 22 Q0 38 28 22" stroke="#4facfe" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="0" cy="34" r="6.5" fill="#ffd166" stroke="#c9931a" stroke-width="1.8"/><circle cx="0" cy="34" r="2" fill="#8c620e"/>';
    } },
    heart:   { name: 'Ruby Heart 💖', draw: function () {
      return '<path d="M-28 22 Q0 38 28 22" stroke="#ff9eb5" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 31 C-4 26 -11 28 -10 33 C-9 37 -4 40 0 44 C4 40 9 37 10 33 C11 28 4 26 0 31 Z" fill="#e03158" stroke="#fff" stroke-width="1.2"/>';
    } },
    pearl:   { name: 'Lustrous Pearls 📿', draw: function () {
      var d = '';
      for (var i = -4; i <= 4; i++) {
        d += '<circle cx="' + (i * 7.4) + '" cy="' + (28 + Math.abs(i) * -1.2) + '" r="3.6" fill="#ffffff" stroke="#c0d4e5" stroke-width="1.2"/>';
      }
      return d;
    } },
    scarf:   { name: 'Knit Scarf 🧣', draw: function () {
      return '<path d="M-32 20 Q0 36 32 20 L30 32 Q0 46 -30 32 Z" fill="#ffb3c7" stroke="#e05375" stroke-width="2.2" stroke-linejoin="round"/><path d="M14 30 L22 52 L10 50 Z" fill="#ff9eb5" stroke="#e05375" stroke-width="2" stroke-linejoin="round"/>';
    } },
    lei:     { name: 'Floral Lei 🌸', draw: function () {
      return '<g transform="translate(0,26)">' +
        '<circle cx="-22" cy="0" r="5" fill="#ffd166"/><circle cx="-11" cy="4" r="5" fill="#ff8fab"/><circle cx="0" cy="6" r="5.5" fill="#7bdff2"/><circle cx="11" cy="4" r="5" fill="#ff8fab"/><circle cx="22" cy="0" r="5" fill="#ffd166"/>' +
        '</g>';
    } },
    gold:    { name: 'Bling Gold ⛓️', draw: function () {
      return '<path d="M-26 22 Q0 38 26 22" stroke="#ffd166" stroke-width="6" stroke-dasharray="5 3" fill="none" stroke-linecap="round"/><circle cx="0" cy="34" r="5" fill="#ffd166" stroke="#b78600" stroke-width="1.5"/>';
    } },
    bow_tie: { name: 'Navy Bowtie 👔', draw: function () {
      return '<path d="M-28 22 Q0 38 28 22" stroke="#1d4e89" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<g transform="translate(0,32)"><polygon points="0,0 -12,-6 -12,6" fill="#1d4e89"/><polygon points="0,0 12,-6 12,6" fill="#1d4e89"/><circle r="3.5" fill="#ffd166"/></g>';
    } }
  };

  var CLOTHES = {
    none:     { name: 'None', draw: function () { return ''; } },
    vest:     { name: 'Sailor Vest ⚓', draw: function () {
      return '<path d="M-42 22 Q0 36 42 22 L38 64 Q0 74 -38 64 Z" fill="#ffffff" stroke="#9bb6ce" stroke-width="2.4"/><path d="M-10 40 h20 l-10 12 Z" fill="#1d4e89"/><circle cx="-16" cy="48" r="2.2" fill="#ffd166"/><circle cx="16" cy="48" r="2.2" fill="#ffd166"/>';
    } },
    sweater:  { name: 'Honey Sweater 🧶', draw: function () {
      return '<path d="M-40 20 Q0 34 40 20 L36 66 Q0 76 -36 66 Z" fill="#ffd166" stroke="#c9931a" stroke-width="2.4"/><path d="M-26 36 Q0 46 26 36 M-30 48 Q0 58 30 48" stroke="#fff8e1" stroke-width="3" fill="none" stroke-linecap="round"/>';
    } },
    kimono:   { name: 'Sakura Kimono 👘', draw: function () {
      return '<path d="M-40 22 Q0 36 40 22 L36 68 Q0 78 -36 68 Z" fill="#ffb4d6" stroke="#ff758f" stroke-width="2.4"/><rect x="-38" y="42" width="76" height="9" fill="#e63946"/>';
    } },
    dino:     { name: 'Dino Onesie 🦖', draw: function () {
      return '<path d="M-40 22 Q0 36 40 22 L36 68 Q0 78 -36 68 Z" fill="#52b788" stroke="#2d6a4f" stroke-width="2.4"/><circle cx="0" cy="46" r="14" fill="#ffeaa7"/>';
    } },
    cape:     { name: 'Mermaid Cape 🧜‍♀️', draw: function () {
      return '<path d="M-12 22 L12 22 L26 68 Q0 78 -26 68 Z" fill="#2ec4b6" opacity=".92" stroke="#1d867c" stroke-width="2.2"/><circle cx="-6" cy="46" r="3.2" fill="#ffd166"/><circle cx="8" cy="58" r="3.2" fill="#ff9eb5"/>';
    } },
    tutu:     { name: 'Wave Tutu 🩰', draw: function () {
      return '<path d="M-40 54 Q0 40 40 54 Q46 68 32 70 Q16 60 0 70 Q-16 60 -32 70 Q-46 68 -40 54 Z" fill="#bfe8f7" stroke="#4facfe" stroke-width="2.2"/>';
    } },
    bandana:  { name: 'Surf Bandana 🏄', draw: function () {
      return '<path d="M-26 22 L26 22 L16 46 Q0 52 -16 46 Z" fill="#ff7043" stroke="#d84315" stroke-width="2.2"/><path d="M-10 32 q5 -5 10 0 t10 0" stroke="#fff" stroke-width="2.2" fill="none"/>';
    } },
    raincoat: { name: 'Yellow Slicker 🌧️', draw: function () {
      return '<path d="M-42 22 Q0 36 42 22 L38 66 Q0 76 -38 66 Z" fill="#ffee55" stroke="#cbb200" stroke-width="2.4"/><circle cx="0" cy="38" r="2.8" fill="#333"/><circle cx="0" cy="52" r="2.8" fill="#333"/>';
    } },
    goggles:  { name: 'Scuba Goggles 🤿', draw: function () {
      return '<g transform="translate(0,6)"><rect x="-36" y="-8" width="72" height="16" rx="8" fill="#7bdff2" opacity=".85" stroke="#1d4e89" stroke-width="2.4"/><circle cx="-16" cy="0" r="5.5" fill="#fff" opacity=".5"/><circle cx="16" cy="0" r="5.5" fill="#fff" opacity=".5"/><path d="M28 0 L36 -14 L36 -24" stroke="#ff7043" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
    } }
  };

  var DRESS_CATS = [
    { key: 'hat', name: '👑 Hats' },
    { key: 'collar', name: '📿 Neckwear' },
    { key: 'cloth', name: '👕 Outfits' }
  ];
  var DRESS_MAP = { hat: HATS, collar: COLLARS, cloth: CLOTHES };

  /* ---------------- FOODS & ANIMATED FOOD SVGS ---------------- */
  var FOODS = [
    { id: 'squid',   e: '🦑', name: 'Fresh Squid',     food: 28, happy: 16, fav: true, tip: "Boba's favorite!" },
    { id: 'herring', e: '🐟', name: 'Silver Herring',  food: 24, happy: 12 },
    { id: 'shrimp',  e: '🦐', name: 'Coral Shrimp',    food: 22, happy: 14 },
    { id: 'crab',    e: '🦀', name: 'Blue Mini Crab',  food: 24, happy: 10 },
    { id: 'clam',    e: '🦪', name: 'Deep Sea Clam',   food: 20, happy: 10 },
    { id: 'jelly',   e: '🍮', name: 'Jelly Pudding',   food: 16, happy: 18 },
    { id: 'ice',     e: '🧊', name: 'Berry Ice Pop',   food: 14, happy: 12 },
    { id: 'boba',    e: '🧋', name: 'Boba Milk Tea',   food: 18, happy: 20 }
  ];

  function foodSVG(id) {
    switch (id) {
      case 'squid':
        return '<g><path d="M-18 -2 C-16 -18, 16 -18, 18 -2 C12 12, -12 12, -18 -2 Z" fill="#ff708f" stroke="#c92a54" stroke-width="2.2" stroke-linejoin="round"/><path d="M-6 8 Q-10 22 -14 28 M-2 9 Q-3 24 -4 30 M2 9 Q3 24 4 30 M6 8 Q10 22 14 28" stroke="#ff8da7" stroke-width="2.8" stroke-linecap="round" fill="none"/><circle cx="-7" cy="-2" r="3" fill="#1b222c"/><circle cx="-8" cy="-3" r="1" fill="#fff"/><circle cx="7" cy="-2" r="3" fill="#1b222c"/><circle cx="6" cy="-3" r="1" fill="#fff"/></g>';
      case 'herring':
        return '<g><path d="M-24 0 C-20 -10, 14 -12, 24 0 C14 12, -20 10, -24 0 Z" fill="#a0c4ff" stroke="#3d68b8" stroke-width="2.2" stroke-linejoin="round"/><polygon points="22,0 32,-7 30,0 32,7" fill="#8db8ff" stroke="#3d68b8" stroke-width="1.8"/><circle cx="-16" cy="-2" r="2.6" fill="#1b222c"/><circle cx="-17" cy="-3" r="0.9" fill="#fff"/><path d="M-8 -3 Q-2 0 -6 5 M2 -3 Q8 0 4 5" stroke="#fff" stroke-width="1.8" fill="none"/></g>';
      case 'shrimp':
        return '<g><path d="M12 -4 L23 -11 L20 -1 L25 3 L13 3 Z" fill="#ff7352" stroke="#b5381a" stroke-width="1.8" stroke-linejoin="round"/><path d="M-20 4 C-22 -10, 2 -14, 15 -2 C17 5, 4 12, -16 10 Z" fill="#ff9f7a" stroke="#d84315" stroke-width="2.2"/><circle cx="-8" cy="-3" r="2" fill="#ffd166"/><circle cx="0" cy="-2" r="2" fill="#ffd166"/></g>';
      case 'crab':
        return '<g><ellipse cx="0" cy="0" rx="16" ry="12" fill="#ff5252" stroke="#b71c1c" stroke-width="2.2"/><circle cx="-6" cy="-4" r="2.2" fill="#1b222c"/><circle cx="6" cy="-4" r="2.2" fill="#1b222c"/><path d="M-14 -4 Q-22 -10 -18 -16 M14 -4 Q22 -10 18 -16" stroke="#ff5252" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="-18" cy="-16" r="3.5" fill="#ff5252"/><circle cx="18" cy="-16" r="3.5" fill="#ff5252"/></g>';
      case 'clam':
        return '<g><path d="M-18 6 Q0 -16 18 6 Q0 18 -18 6 Z" fill="#90caf9" stroke="#1565c0" stroke-width="2.2"/><path d="M0 -10 V10 M-8 -4 L-4 10 M8 -4 L4 10" stroke="#bbdefb" stroke-width="1.8" fill="none"/><circle cx="0" cy="3" r="5" fill="#ffffff" stroke="#90caf9" stroke-width="1.5"/></g>';
      case 'jelly':
        return '<g><path d="M-16 8 L-12 -8 L12 -8 L16 8 Z" fill="#ffd166" stroke="#f57f17" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="0" cy="-8" rx="12" ry="4" fill="#fff9c4"/><circle cx="0" cy="-12" r="3.5" fill="#e91e63"/></g>';
      case 'ice':
        return '<g><rect x="-10" y="-14" width="20" height="26" rx="6" fill="#4facfe" stroke="#1976d2" stroke-width="2.2"/><rect x="-3" y="12" width="6" height="12" rx="2" fill="#d7ccc8" stroke="#8d6e63" stroke-width="1.6"/><line x1="-5" y1="-8" x2="-5" y2="6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>';
      default:
        return '<g><rect x="-12" y="-14" width="24" height="28" rx="5" fill="#d7ccc8" stroke="#5d4037" stroke-width="2.2"/><rect x="-14" y="-16" width="28" height="5" rx="2.5" fill="#8d6e63"/><circle cx="-6" cy="6" r="2.4" fill="#3e2723"/><circle cx="0" cy="7" r="2.4" fill="#3e2723"/><circle cx="6" cy="6" r="2.4" fill="#3e2723"/><line x1="0" y1="-22" x2="0" y2="-14" stroke="#ab47bc" stroke-width="3" stroke-linecap="round"/></g>';
    }
  }

  function sealBowlSVG(foodHtml) {
    return '<g transform="translate(0, 72)">' +
      '<ellipse cx="0" cy="10" rx="36" ry="7" fill="rgba(30,70,120,.15)"/>' +
      '<ellipse cx="0" cy="-2" rx="28" ry="8.5" fill="#f0f7ff" stroke="#3880c9" stroke-width="2.4"/>' +
      '<ellipse cx="0" cy="-1" rx="23" ry="6" fill="#d8ecff"/>' +
      (foodHtml || '') +
      '<path d="M-28 -2 L-33 8 C-21 15, 21 15, 33 8 L28 -2 C16 4, -16 4, -28 -2 Z" fill="#7bdff2" stroke="#3880c9" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<circle cx="0" cy="5" r="3.2" fill="#fff" opacity=".9"/>' +
      '</g>';
  }

  /* ---------------- OCEAN SCENES ---------------- */
  function oceanScene(kind) {
    var sky, sea, extra = '';
    if (kind === 'lagoon') {
      sky = '#bdebf7'; sea = '#5ec8e6';
      extra = '<circle cx="68" cy="44" r="26" fill="#fff7d6"/>' +
        '<path d="M280 80 Q320 62 360 80 Z" fill="#e8d5b5"/>' +
        '<path d="M320 64 Q326 40 334 32 M334 32 Q316 28 304 36 M334 32 Q344 24 356 30" stroke="#3d8558" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M0 86 Q40 76 80 86 T160 86 T240 86 T320 86 T400 86" stroke="#fff" stroke-width="3.5" fill="none" opacity=".8"/>';
    } else if (kind === 'reef') {
      sky = '#a2ddf5'; sea = '#389bd6';
      extra = '<path d="M24 96 q6 -30 14 0 M44 96 q6 -36 14 0" stroke="#ff6b8b" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<path d="M340 96 q-6 -26 -12 0 M358 96 q-6 -32 -12 0" stroke="#b28dff" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<polygon points="310,65 316,77 304,77" fill="#ffd166"/>' +
        '<circle cx="80" cy="72" r="5" fill="#ffd166"/><circle cx="92" cy="74" r="4" fill="#ffd166"/>';
    } else if (kind === 'night') {
      sky = '#1a1f3d'; sea = '#242e56';
      extra = '<circle cx="330" cy="40" r="18" fill="#fff9db"/>' +
        '<circle cx="50" cy="24" r="1.8" fill="#fff"/><circle cx="120" cy="40" r="2" fill="#fff"/><circle cx="210" cy="20" r="1.6" fill="#fff"/><circle cx="270" cy="48" r="2" fill="#fff"/>' +
        '<path d="M0 86 Q40 78 80 86 T160 86 T240 86 T320 86 T400 86" stroke="#4facfe" stroke-width="3" fill="none" opacity=".7"/>' +
        '<circle cx="140" cy="130" r="3" fill="#7bdff2" opacity=".7"/><circle cx="260" cy="150" r="2.5" fill="#7bdff2" opacity=".7"/>';
    } else if (kind === 'arctic') {
      sky = '#d4eaf7'; sea = '#89bde0';
      extra = '<path d="M20 86 L60 30 L100 86 Z" fill="#ffffff" stroke="#b5d3e8" stroke-width="2"/>' +
        '<path d="M280 86 L324 24 L368 86 Z" fill="#ffffff" stroke="#b5d3e8" stroke-width="2"/>' +
        '<path d="M0 38 Q100 18 200 38 T400 38" stroke="#8ce99a" stroke-width="12" fill="none" opacity=".35"/>' +
        '<circle cx="200" cy="34" r="16" fill="#fffbf0" opacity=".9"/>';
    } else if (kind === 'kelp') {
      sky = '#b8e6d2'; sea = '#4da888';
      extra = '<path d="M30 100 Q18 60 36 20 M60 100 Q74 60 56 22 M340 100 Q326 62 346 24" stroke="#2d734c" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>' +
        '<circle cx="180" cy="38" r="5" fill="#ffd166"/><circle cx="210" cy="46" r="4" fill="#ff9eb5"/>';
    } else {
      sky = '#ffc299'; sea = '#ff7b7b';
      extra = '<circle cx="200" cy="64" r="32" fill="#ffd166"/>' +
        '<path d="M0 86 Q40 76 80 86 T160 86 T240 86 T320 86 T400 86" stroke="#fff" stroke-width="3.5" fill="none" opacity=".85"/>' +
        '<path d="M80 34 q8 -6 16 0 M110 40 q6 -5 12 0" stroke="#68341a" stroke-width="2" fill="none" stroke-linecap="round"/>';
    }
    return '<rect width="400" height="240" fill="' + sky + '"/>' +
      '<rect y="74" width="400" height="166" fill="' + sea + '"/>' + extra;
  }

  var PLACES = [
    { key: 'lagoon', e: '🏝️', name: 'Blue Lagoon' },
    { key: 'reef',   e: '🐠', name: 'Coral Reef' },
    { key: 'night',  e: '🌙', name: 'Moonlit Bay' },
    { key: 'arctic', e: '🏔️', name: 'Arctic Ice' },
    { key: 'kelp',   e: '🌿', name: 'Kelp Forest' },
    { key: 'sunset', e: '🌅', name: 'Sunset Bay' }
  ];

  /* ---------------- TICK / DECAY ---------------- */
  function tick() {
    var now = Date.now();
    var mins = (now - (S.lastTick || now)) / 60000;
    if (mins >= 1) {
      S.food = Math.max(0, S.food - mins * 0.6);
      S.happy = Math.max(0, S.happy - mins * 0.4);
      S.clean = Math.max(0, S.clean - mins * 0.2);
      S.lastTick = now;
      var day = Math.floor((now - S.born) / 86400000);
      if (day > S.days) {
        S.days = day;
        S.coins += 5;
        say('🌊 A new day with the Seal Society! +5 pearls 🫧');
        Snd.play('pearl');
      }
      save();
    }
  }
  setInterval(tick, 30000);
  setInterval(function () { if (!walkOn && !feedAnim && !ballActive) renderHome(); }, 6000);

  function say(t) { if ($('say')) $('say').textContent = t; }
  function log(t) { if ($('log')) $('log').textContent = t; }

  /* ---------------- COZY & AFFECTION DIALOGUES ---------------- */
  var BOBA_DIALOGUE = {
    hug: {
      th: [
        'งื้มมมอุ๋ง~ กอดแน่นๆ อุ่นที่สุดในโลกเลยยย 💕',
        'กอดอีกน้าาา ชอบให้กอดที่สุดเลยงับ! 🥰',
        'อบอุ่นหัวใจจังเลยยย ตัวนุ่มนิ่มเพื่อเธอคนเดียวเลยนะ 🦭💖',
        'อุ๋งๆ~ ใจละลายหมดแล้ววว รักเธอจังงง! ✨'
      ],
      en: [
        'Mmm~ warmest cuddle ever! I love your hugs! 💕',
        'Hug me tight~ Boba feels so safe and happy! 🥰',
        'My heart is melting! You are the best! 🦭💖',
        'Squishy seal cuddle time! Arf arf~ ✨'
      ],
      zh: [
        '抱紧紧~ 好温暖呀！最喜欢你抱我了 💕',
        '好舒服哦~ 心都要化掉了 🥰',
        '小海豹最爱你了！永远不分开 🦭💖',
        '蹭蹭你~ 软绵绵的拥抱最棒啦 ✨'
      ],
      ja: [
        'ぎゅーっ！世界で一番あたたかいよ〜 💕',
        'だーいすき！ぎゅーってされるの幸せ〜 🥰',
        'きゅんきゅんしちゃう！もちもちボバだよ 🦭💖',
        'あったかいね〜 ずっとぎゅーしててね ✨'
      ]
    },
    pat: {
      th: [
        'ฟินจังเลยยย ลูบหัวอีกนะฮับบบ~ 🥰✨',
        'งื้มมม~ ลูบตรงนี้สบายตัวที่สุดเลยยย 🦭💕',
        'เคลิ้มเลยงับบบ ตาจะปิดแล้ววว~ 🌸',
        'ลูบหัวเบาๆ แบบนี้ อบอุ่นจังเลยนะฮะ ✨'
      ],
      en: [
        'Pat pat~ that feels so blissful! 🥰✨',
        'Aww~ Boba loves head pats so much! 🦭💕',
        'So gentle and soothing... getting sleepy~ 🌸',
        'Purr purr~ Boba is in heaven! ✨'
      ],
      zh: [
        '摸摸头好舒服呀~ 还要摸摸 🥰✨',
        '呼噜噜~ 乖乖地让你摸头 🦭💕',
        '好温柔哦~ 眼睛都要闭上啦 🌸',
        '最喜欢被你摸摸啦！好乖巧 ✨'
      ],
      ja: [
        'なでなで〜 すごく気持ちいいよぉ〜 🥰✨',
        'もっと撫でて〜 ボバうっとりしちゃう 🦭💕',
        'ふわふわ〜 ねむくなっちゃいそう 🌸',
        'やさしい手だね〜 ご機嫌だよ ✨'
      ]
    },
    tummy: {
      th: [
        'คิกคิก~ จั๊กจี้พุงจังเลยยย ตัวกลมดุ๊กดิ๊ก! 🌸',
        'พุงขาวนุ่มนิ่มให้เกาคนเดียวเลยน้าาา 🦭💖',
        'กลิ้งดุ๊กๆ ไปมา อ้อนเธอสุดๆ ไปเล้ยยย! 🥰'
      ],
      en: [
        'Hehe~ tickles! Round tummy wiggles! 🌸',
        'Only you get to rub Boba\'s soft tummy! 🦭💖',
        'Rolling over happily~ arf arf! 🥰'
      ],
      zh: [
        '嘻嘻~ 挠肚皮好痒呀！软乎乎的小肚子 🌸',
        '只给你摸小海豹的小圆肚肚哦 🦭💖',
        '打滚滚~ 开心地摇尾巴！🥰'
      ],
      ja: [
        'くすぐったいよ〜！ぽんぽこお腹もちもち 🌸',
        'お腹なでなで〜 ボバころころ転がっちゃう 🦭💖',
        'ゴロゴロ〜 甘えん坊モードだよ！🥰'
      ]
    },
    beg: {
      th: [
        'อย่าเพิ่งไปไหนน้าาา กอดเค้าหน่อยยยงับ 🥺💕',
        'คิดถึงจังเลยยย มาลูบหัวน้องหน่อยนะฮับ 🥺',
        'อุ๋งๆ ขอกอดแน่นๆ สักทีได้มั้ยงับบ 🥺💖'
      ],
      en: [
        'Don\'t go away~ cuddle Boba please! 🥺💕',
        'I miss you... can I have head pats? 🥺',
        'Boba wants a warm hug so much! 🥺💖'
      ],
      zh: [
        '不要走嘛~ 抱抱我好不好 🥺💕',
        '好想你呀... 摸摸小海豹的头吧 🥺',
        '想求一个暖呼呼的拥抱嘛 🥺💖'
      ],
      ja: [
        'どこにも行かないで〜 ぎゅーしてよぉ 🥺💕',
        'さびしいな… なでなでしてほしいな 🥺',
        'ボバをぎゅーって抱きしめて？🥺💖'
      ]
    }
  };

  /* ---------------- POLYGLOT OCEAN SCHOOL DATA ---------------- */
  var LEARN_DATA = {
    categories: [
      { id: 'greetings', name: '🐾 ทักทาย & คำอ้อน', icon: '🐾' },
      { id: 'food', name: '🍰 ของกิน & คาเฟ่', icon: '🍰' },
      { id: 'ocean', name: '🌊 ทะเล & สัตว์โลก', icon: '🌊' },
      { id: 'cozy', name: '💖 ความรู้สึกอบอุ่น', icon: '💖' }
    ],
    words: [
      // Greetings & Cuddles
      {
        cat: 'greetings',
        icon: '🫂',
        en: { word: 'Hug me please!', sub: '/hʌɡ miː pliːz/', thai: 'กอดเค้าหน่อยนะ' },
        zh: { word: '抱抱我嘛~', sub: 'Bào bào wǒ ma~', thai: 'กอดเค้าหน่อยนะ' },
        ja: { word: 'ぎゅーってして〜', sub: 'Gyū tte shite~', thai: 'กอดแน่นๆ หน่อยนะ' }
      },
      {
        cat: 'greetings',
        icon: '💖',
        en: { word: 'I love you so much!', sub: '/aɪ lʌv juː soʊ mʌtʃ/', thai: 'ฉันรักเธอมากๆ เลย' },
        zh: { word: '我好爱你呀！', sub: 'Wǒ hǎo ài nǐ ya!', thai: 'ฉันรักเธอจังเลย!' },
        ja: { word: 'だいすきだよ！', sub: 'Daisuki da yo!', thai: 'รักที่สุดเลยนะ!' }
      },
      {
        cat: 'greetings',
        icon: '☀️',
        en: { word: 'Good morning!', sub: '/ɡʊd ˈmɔːrnɪŋ/', thai: 'อรุณสวัสดิ์นะคนเก่ง' },
        zh: { word: '早安，小可爱！', sub: 'Zǎo ān, xiǎo kě\'ài!', thai: 'อรุณสวัสดิ์นะคนน่ารัก' },
        ja: { word: 'おはよう！', sub: 'Ohayō!', thai: 'อรุณสวัสดิ์นะเด็กดี' }
      },
      {
        cat: 'greetings',
        icon: '🌙',
        en: { word: 'Sweet dreams~', sub: '/swiːt driːmz/', thai: 'ฝันดีนะคนดี' },
        zh: { word: '晚安，做个好梦~', sub: 'Wǎn\'ān, zuò gè hǎo mèng~', thai: 'ราตรีสวัสดิ์ ฝันดีนะ' },
        ja: { word: 'おやすみ〜', sub: 'Oyasumi~', thai: 'ราตรีสวัสดิ์ ฝันดีนะ' }
      },
      {
        cat: 'greetings',
        icon: '🫳',
        en: { word: 'Pat my head!', sub: '/pæt maɪ hed/', thai: 'ลูบหัวเค้าหน่อยยย' },
        zh: { word: '摸摸头~', sub: 'Mō mō tóu~', thai: 'ลูบหัวเค้าหน่อยยย' },
        ja: { word: 'なでなでして〜', sub: 'Nade nade shite~', thai: 'ลูบหัวเค้าหน่อยยย' }
      },
      {
        cat: 'greetings',
        icon: '🥺',
        en: { word: 'Don\'t leave me~', sub: '/doʊnt liːv miː/', thai: 'อย่าทิ้งเค้าไว้คนเดียวน้า' },
        zh: { word: '不要走嘛~', sub: 'Bú yào zǒu ma~', thai: 'อย่าเพิ่งไปไหนน้า' },
        ja: { word: 'さびしいよ〜', sub: 'Sabishii yo~', thai: 'เหงาจังเลย อย่าเพิ่งไปนะ' }
      },

      // Food & Cafe
      {
        cat: 'food',
        icon: '🧋',
        en: { word: 'Boba Milk Tea', sub: '/ˈboʊbə mɪlk tiː/', thai: 'ชานมไข่มุกโบบา' },
        zh: { word: '珍珠奶茶', sub: 'Zhēnzhū nǎichá', thai: 'ชานมไข่มุก' },
        ja: { word: 'タピオカミルクティー', sub: 'Tapioka mirukutī', thai: 'ชานมไข่มุก' }
      },
      {
        cat: 'food',
        icon: '🍣',
        en: { word: 'Fresh Salmon', sub: '/freʃ ˈsæmən/', thai: 'ปลาแซลมอนสด' },
        zh: { word: '新鲜三文鱼', sub: 'Xīnxiān sānwènyú', thai: 'ปลาแซลมอนสด' },
        ja: { word: '新鮮なサーモン', sub: 'Shinsen na sāmon', thai: 'ปลาแซลมอนสด' }
      },
      {
        cat: 'food',
        icon: '🍨',
        en: { word: 'Sweet Ice Cream', sub: '/swiːt aɪs kriːm/', thai: 'ไอศกรีมหวานฉ่ำ' },
        zh: { word: '甜甜冰淇淋', sub: 'Tián tián bīngqílín', thai: 'ไอศกรีมหวานอร่อย' },
        ja: { word: 'アイスクリーム', sub: 'Aisukurīmu', thai: 'ไอศกรีมหวานอร่อย' }
      },
      {
        cat: 'food',
        icon: '🦑',
        en: { word: 'Crispy Squid', sub: '/ˈkrɪspi skwɪd/', thai: 'ปลาหมึกย่างหอมกรอบ' },
        zh: { word: '香烤鱿鱼', sub: 'Xiāng kǎo yóuyú', thai: 'ปลาหมึกย่างหอมกรอบ' },
        ja: { word: '香ばしいイカ焼き', sub: 'Kōbashii ikayaki', thai: 'ปลาหมึกย่างหอมอร่อย' }
      },
      {
        cat: 'food',
        icon: '🥞',
        en: { word: 'Fluffy Pancake', sub: '/ˈflʌfi ˈpænkeɪk/', thai: 'แพนเค้กนุ่มฟู' },
        zh: { word: '松软松饼', sub: 'Sōngruǎn sōngbǐng', thai: 'แพนเค้กนุ่มฟู' },
        ja: { word: 'ふわふわパンケーキ', sub: 'Fuwafuwa pankēki', thai: 'แพนเค้กนุ่มฟู' }
      },
      {
        cat: 'food',
        icon: '☕',
        en: { word: 'Hot Chocolate', sub: '/hɑːt ˈtʃɔːklət/', thai: 'ช็อกโกแลตร้อนอุ่นๆ' },
        zh: { word: '热巧克力', sub: 'Rè qiǎokèlì', thai: 'ช็อกโกแลตร้อนอุ่นๆ' },
        ja: { word: 'ホットチョコレート', sub: 'Hotto chokorēto', thai: 'ช็อกโกแลตร้อนอุ่นๆ' }
      },

      // Ocean Friends
      {
        cat: 'ocean',
        icon: '🦭',
        en: { word: 'Baby Seal', sub: '/ˈbeɪbi siːl/', thai: 'ลูกแมวน้ำตัวกลม' },
        zh: { word: '可爱小海豹', sub: 'Kě\'ài xiǎo hǎibào', thai: 'ลูกแมวน้ำน่ารัก' },
        ja: { word: '赤ちゃんあざらし', sub: 'Akachan azarashi', thai: 'ลูกแมวน้ำตัวน้อย' }
      },
      {
        cat: 'ocean',
        icon: '🌊',
        en: { word: 'Deep Blue Ocean', sub: '/diːp bluː ˈoʊʃn/', thai: 'มหาสมุทรสีคราม' },
        zh: { word: '蔚蓝大海', sub: 'Wèilán dàhǎi', thai: 'ทะเลสีครามสดใส' },
        ja: { word: '青い海', sub: 'Aoi umi', thai: 'ทะเลสีครามกว้างใหญ่' }
      },
      {
        cat: 'ocean',
        icon: '🐬',
        en: { word: 'Playful Dolphin', sub: '/ˈpleɪfl ˈdɑːlfɪn/', thai: 'โลมาขี้เล่น' },
        zh: { word: '活泼海豚', sub: 'Huópō hǎitún', thai: 'โลมาแสนรู้ขี้เล่น' },
        ja: { word: 'かわいいイルカ', sub: 'Kawaii iruka', thai: 'ปลาโลมาน่ารัก' }
      },
      {
        cat: 'ocean',
        icon: '⭐',
        en: { word: 'Shiny Starfish', sub: '/ˈʃaɪni ˈstɑːrfɪʃ/', thai: 'ปลาดาวเปล่งประกาย' },
        zh: { word: '闪亮海星', sub: 'Shǎnliàng hǎixīng', thai: 'ปลาดาวประกายระยิบ' },
        ja: { word: 'きらきらヒトデ', sub: 'Kirakira hitode', thai: 'ปลาดาวระยิบระยับ' }
      },
      {
        cat: 'ocean',
        icon: '🪼',
        en: { word: 'Drifting Jellyfish', sub: '/ˈdrɪftɪŋ ˈdʒelifɪʃ/', thai: 'แมงกะพรุนลอยละล่อง' },
        zh: { word: '梦幻水母', sub: 'Mènghuàn shuǐmǔ', thai: 'แมงกะพรุนชวนฝัน' },
        ja: { word: 'ゆらゆらクラゲ', sub: 'Yurayura kurage', thai: 'แมงกะพรุนลอยพริ้ว' }
      },

      // Feelings & Warmth
      {
        cat: 'cozy',
        icon: '🛋️',
        en: { word: 'Cozy & Warm', sub: '/ˈkoʊzi ænd wɔːrm/', thai: 'อบอุ่นสบายใจ' },
        zh: { word: '温暖舒服', sub: 'Wēnnuǎn shūfu', thai: 'อบอุ่นสบายใจ' },
        ja: { word: 'ほっこりあたたかい', sub: 'Hokkori atatakai', thai: 'อบอุ่นสบายหัวใจ' }
      },
      {
        cat: 'cozy',
        icon: '🥰',
        en: { word: 'Heart is Melting', sub: '/hɑːrt ɪz ˈmeltɪŋ/', thai: 'ใจละลายไปหมดแล้ว' },
        zh: { word: '心都要化了~', sub: 'Xīn dōu yào huà le~', thai: 'ใจละลายหมดแล้ว' },
        ja: { word: 'きゅんきゅんする〜', sub: 'Kyun kyun suru~', thai: 'ใจเต้นตึกตักละลาย' }
      },
      {
        cat: 'cozy',
        icon: '😴',
        en: { word: 'Sleepy baby', sub: '/ˈsliːpi ˈbeɪbi/', thai: 'ง่วงนอนตาจะปิด' },
        zh: { word: '困困的小宝宝', sub: 'Kùn kùn de xiǎo bǎobao', thai: 'เบบี๋ง่วงนอนตาปรือ' },
        ja: { word: 'ねむねむ赤ちゃん', sub: 'Nemu nemu akachan', thai: 'เบบี๋ง่วงนอนตาปรือ' }
      },
      {
        cat: 'cozy',
        icon: '✨',
        en: { word: 'Very Happy', sub: '/ˈveri ˈhæpi/', thai: 'มีความสุขมากๆ' },
        zh: { word: '超级开心！', sub: 'Chāojí kāixīn!', thai: 'มีความสุขที่สุดเลย' },
        ja: { word: 'とってもうれしい！', sub: 'Tottemo ureshii!', thai: 'ดีใจและมีความสุขมาก' }
      },
      {
        cat: 'cozy',
        icon: '🫧',
        en: { word: 'Soft & Squishy', sub: '/sɔːft ænd ˈskwɪʃi/', thai: 'นุ่มนิ่มดุ๊กดิ๊ก' },
        zh: { word: '软绵绵弹弹', sub: 'Ruǎnmiánmián tán tán', thai: 'นุ่มนิ่มเด้งดึ๋ง' },
        ja: { word: 'もちもちぷにぷに', sub: 'Mochi mochi puni puni', thai: 'นุ่มนิ่มเด้งดึ๋งแก้มป่อง' }
      }
    ]
  };

  /* ---------------- HOME TAB ---------------- */
  var petting = false, petTimer = null, bathing = false;
  var cozyAction = null; // 'hug', 'pat', 'tummy'
  var lastInteractionTime = Date.now();
  var isBegging = false;

  function renderHome() {
    tick();
    var mood = moodOf();
    if (!feedAnim) {
      var homeBg = '<rect x="-100" y="-80" width="200" height="180" fill="#f2f8ff"/>' +
        '<circle cx="-60" cy="-40" r="24" fill="#e1f0fc" opacity=".7"/>' +
        '<circle cx="65" cy="-30" r="18" fill="#e1f0fc" opacity=".7"/>';
      var opts = {
        mood: mood,
        petting: petting,
        bathing: bathing,
        hug: cozyAction === 'hug',
        pat: cozyAction === 'pat',
        tummy: cozyAction === 'tummy',
        beg: isBegging,
        bg: homeBg
      };
      if ($('petBox')) $('petBox').innerHTML = sealSVG(opts);
    }
    if ($('stAge')) $('stAge').textContent = S.days;
    if ($('stLove')) $('stLove').textContent = S.love;
    if ($('stCoin')) $('stCoin').textContent = S.coins;
    if ($('bFood')) $('bFood').style.width = Math.round(S.food) + '%';
    if ($('bFoodFeed')) $('bFoodFeed').style.width = Math.round(S.food) + '%';
    if ($('bHappy')) $('bHappy').style.width = Math.round(S.happy) + '%';
    if ($('bClean')) $('bClean').style.width = Math.round(S.clean) + '%';

    // Update Affection Bar
    var affPct = Math.min(100, Math.max(0, S.affection !== undefined ? S.affection : 85));
    if ($('bAffection')) $('bAffection').style.width = affPct + '%';
    if ($('cozyBadge')) {
      var affTitle = '🥰 ระดับความอ้อน: ';
      if (affPct >= 90) affTitle += 'ติดหนึบ x100% (ขอเกาะแขนไม่ปล่อย!) 💖';
      else if (affPct >= 70) affTitle += 'อ้อนตัวละลาย x' + affPct + '% (ชอบซบแก้ม) 💕';
      else if (affPct >= 50) affTitle += 'อ้อนปานกลาง x' + affPct + '% (ชอบให้ลูบหัว) 🌸';
      else affTitle += 'เบบี๋ขี้อาย x' + affPct + '% (กำลังปรับตัว) 🥺';
      $('cozyBadge').textContent = affTitle;
    }

    var curSeal = SEALS[S.society.activeChar] || SEALS.boba;
    if (!petting && !bathing && !cozyAction && !isBegging) {
      if (mood === 'sad') say('Arf… 🥺 (' + curSeal.name + ' needs love & a snack!)');
      else if (mood === 'happy') say('Arf arf! 💙 ' + curSeal.name + ' is super happy!');
    }
  }

  function spawnFloatingParticles(container, emojis, count) {
    if (!container) return;
    for (var i = 0; i < (count || 5); i++) {
      var p = document.createElement('div');
      p.className = 'floating-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      var leftPct = 25 + Math.random() * 50;
      var topPct = 30 + Math.random() * 35;
      p.style.left = leftPct + '%';
      p.style.top = topPct + '%';
      p.style.animationDelay = (i * 0.12) + 's';
      container.appendChild(p);
      setTimeout(function (el) { el.remove(); }, 1500, p);
    }
  }

  // 1. Cozy Hug
  function doHug() {
    tick();
    lastInteractionTime = Date.now();
    isBegging = false;
    S.hugs = (S.hugs || 0) + 1;
    S.love += 4;
    S.happy = 100;
    S.affection = Math.min(100, (S.affection || 85) + 6);
    cozyAction = 'hug';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyAction = null; renderHome(); }, 1800);

    var pbox = $('petBox');
    if (pbox) {
      pbox.classList.remove('squish');
      void pbox.offsetWidth;
      pbox.classList.add('squish');
      spawnFloatingParticles(pbox, ['💖', '💕', '🥰', '✨', '🦭'], 7);
    }

    Snd.play('hug');
    setTimeout(function () { Snd.play('coo'); }, 200);

    var lang = S.lang || 'th';
    var lines = BOBA_DIALOGUE.hug[lang] || BOBA_DIALOGUE.hug.th;
    var line = lines[S.hugs % lines.length];
    say(line);
    log('Boba cuddles warmly into your arms with soft purrs~ 🫂💕 (+4 Love, 💖 Affection Up!)');
    Voice.speak(line, lang);

    if (S.hugs % 5 === 0) {
      S.coins += 2;
      Snd.play('pearl');
      log('Sweetest hug bonus! +2 🫧 pearls from Boba!');
    }
    save();
    renderHome();
  }

  // 2. Head Pat / Stroking
  function doPat() {
    tick();
    lastInteractionTime = Date.now();
    isBegging = false;
    S.pats = (S.pats || 0) + 1;
    S.love += 2;
    S.happy = Math.min(100, S.happy + 10);
    S.affection = Math.min(100, (S.affection || 85) + 4);
    cozyAction = 'pat';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyAction = null; renderHome(); }, 1500);

    var pbox = $('petBox');
    if (pbox) {
      pbox.classList.remove('squish');
      void pbox.offsetWidth;
      pbox.classList.add('squish');
      spawnFloatingParticles(pbox, ['✨', '🌸', '💕', '⭐', '🫳'], 6);
    }

    Snd.play('purr');
    var lang = S.lang || 'th';
    var lines = BOBA_DIALOGUE.pat[lang] || BOBA_DIALOGUE.pat.th;
    var line = lines[S.pats % lines.length];
    say(line);
    log('Gentle head stroking~ Boba closes her eyes in blissful purrs! 🥰✨');
    Voice.speak(line, lang);

    save();
    renderHome();
  }

  // 3. Tummy Tickle
  function doTummy() {
    tick();
    lastInteractionTime = Date.now();
    isBegging = false;
    S.happy = 100;
    S.love += 3;
    S.affection = Math.min(100, (S.affection || 85) + 5);
    cozyAction = 'tummy';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyAction = null; renderHome(); }, 1600);

    var pbox = $('petBox');
    if (pbox) {
      pbox.classList.remove('squish');
      void pbox.offsetWidth;
      pbox.classList.add('squish');
      spawnFloatingParticles(pbox, ['🌸', '✨', '🐾', '🥰'], 6);
    }

    Snd.play('squeak');
    setTimeout(function () { Snd.play('pop'); }, 180);

    var lang = S.lang || 'th';
    var lines = BOBA_DIALOGUE.tummy[lang] || BOBA_DIALOGUE.tummy.th;
    var line = lines[Math.floor(Math.random() * lines.length)];
    say(line);
    log('Tummy tickles! Boba rolls around with cute flipper wiggles~ 🌸');
    Voice.speak(line, lang);

    save();
    renderHome();
  }

  // 4. Boop Nose
  function doBoop() {
    tick();
    lastInteractionTime = Date.now();
    isBegging = false;
    S.boops = (S.boops || 0) + 1;
    S.happy = Math.min(100, S.happy + 3);
    S.love += 1;
    S.affection = Math.min(100, (S.affection || 85) + 2);
    petting = true;
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { petting = false; renderHome(); }, 900);

    var pbox = $('petBox');
    if (pbox) {
      pbox.classList.remove('squish');
      void pbox.offsetWidth;
      pbox.classList.add('squish');
      spawnFloatingParticles(pbox, ['🫧', '👉', '✨'], 3);
    }

    Snd.play('boop');
    var curSeal = SEALS[S.society.activeChar] || SEALS.boba;
    var msgs = [
      'Arf arf! 💙 ' + curSeal.name + ' loves boops!',
      '*squeeeak!* So soft and squishy~ 👉🐽',
      'Mrrrp! 💕 Happy flipper claps!',
      'So round! So kawaii! 🦭✨',
      '*happy seal wiggle* 🫧'
    ];
    say(msgs[S.boops % msgs.length]);

    if (S.boops % 8 === 0) {
      S.coins += 1;
      log(curSeal.name + ' is delighted! +1 🫧 pearl');
      Snd.play('pearl');
    }
    save();
    renderHome();
  }

  // Attach Action Button Handlers
  $('actHug')?.addEventListener('click', doHug);
  $('actPat')?.addEventListener('click', doPat);
  $('actTummy')?.addEventListener('click', doTummy);
  $('actPet')?.addEventListener('click', doBoop);

  // Pointer drag on #petBox (Drag = Pat head, Tap = Hug/Boop)
  (function () {
    var pbox = $('petBox');
    if (!pbox) return;
    var startX = 0, startY = 0, isDragging = false;
    pbox.addEventListener('pointerdown', function (e) {
      startX = e.clientX; startY = e.clientY; isDragging = false;
    });
    pbox.addEventListener('pointermove', function (e) {
      if (e.buttons > 0) {
        var dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist > 18 && !isDragging) {
          isDragging = true;
          doPat();
        }
      }
    });
    pbox.addEventListener('pointerup', function () {
      if (!isDragging) {
        // Simple tap on Boba
        if (isBegging) doHug();
        else doBoop();
      }
    });
  })();

  // Language switch buttons in Home
  ['th', 'en', 'zh', 'ja'].forEach(function (l) {
    var b = $('btnLang' + l.charAt(0).toUpperCase() + l.slice(1));
    if (!b) return;
    b.addEventListener('click', function () {
      S.lang = l;
      ['th', 'en', 'zh', 'ja'].forEach(function (x) {
        var btn = $('btnLang' + x.charAt(0).toUpperCase() + x.slice(1));
        if (btn) btn.classList.toggle('on', x === l);
      });
      Snd.play('pop');
      save();
      var sampleGreetings = {
        th: 'สวัสดีฮับ! อุ๋งๆ พูดภาษาไทยแล้วนะงับ 🇹🇭',
        en: 'Hello! Boba is speaking English now! 🇬🇧 arf arf~',
        zh: '你好！小海豹开始说中文啦！🇨🇳 抱抱~',
        ja: 'こんにちは！ボバ日本語でお話しするよ！🇯🇵 だいすき〜'
      };
      var text = sampleGreetings[l] || sampleGreetings.th;
      say(text);
      Voice.speak(text, l);
    });
  });

  // Voice toggle button in Home
  var btnVoice = $('btnVoiceToggle');
  if (btnVoice) {
    btnVoice.addEventListener('click', function () {
      var on = Voice.toggle();
      btnVoice.classList.toggle('off', !on);
      btnVoice.textContent = on ? '🔊 เสียงพูด' : '🔇 ปิดเสียง';
      Snd.play('pop');
    });
  }

  // Idle begging check
  setInterval(function () {
    if (walkOn || feedAnim || ballActive || bathing || cozyAction || petting) return;
    var idleTime = Date.now() - lastInteractionTime;
    if (idleTime > 14000 && !isBegging) {
      isBegging = true;
      var lang = S.lang || 'th';
      var lines = BOBA_DIALOGUE.beg[lang] || BOBA_DIALOGUE.beg.th;
      var line = lines[Math.floor(Math.random() * lines.length)];
      say(line);
      log('Boba is looking at you with big watery eyes... she wants a warm hug! 🥺🫂');
      renderHome();
    }
  }, 4000);

  $('actGroom').addEventListener('click', function () {
    tick();
    bathing = true;
    S.clean = Math.min(100, S.clean + 35);
    S.happy = Math.min(100, S.happy + 8);
    say('🫧 Pop the bubbles on the seal! So shiny~');
    log('Tap floating bubbles to pop them!');
    Snd.play('splash');
    renderHome();
    spawnBathBubbles();
  });

  function spawnBathBubbles() {
    var box = $('petBox');
    var oldBubbles = box.querySelectorAll('.bath-bubble');
    oldBubbles.forEach(function (b) { b.remove(); });

    var total = 8, popped = 0;
    for (var i = 0; i < total; i++) {
      var b = document.createElement('div');
      b.className = 'bath-bubble';
      var sz = 24 + Math.random() * 22;
      b.style.width = sz + 'px';
      b.style.height = sz + 'px';
      b.style.left = (15 + Math.random() * 70) + '%';
      b.style.top = (15 + Math.random() * 65) + '%';
      b.addEventListener('pointerdown', function (e) {
        e.stopPropagation();
        this.style.transform = 'scale(1.5)';
        this.style.opacity = '0';
        Snd.play('pop');
        popped++;
        var self = this;
        setTimeout(function () { self.remove(); }, 140);
        if (popped >= total) {
          bathing = false;
          S.clean = 100;
          S.coins += 2;
          say('✨ Squeaky clean & sparkling! (+2 🫧)');
          log('All bubbles popped! Rubber ducky is proud 🐥');
          Snd.play('pearl');
          save();
          renderHome();
        }
      });
      box.appendChild(b);
    }
  }

  $('actSnap').addEventListener('click', function () { snapPhoto('Home'); });

  /* ---------------- FEEDING TAB ---------------- */
  var pickFood = 'squid';
  var feedAnim = null, feedRaf = 0;

  function renderFoodStage() {
    var box = $('feedBox');
    if (!box) return;
    if (!feedAnim) {
      var floatFood = '<g transform="translate(0,-6) scale(0.92)">' + foodSVG(pickFood) + '</g>';
      var extra = sealBowlSVG(floatFood);
      box.innerHTML = sealSVG({ mood: 'happy', extra: extra, viewBox: '-100 -80 200 185' });
      return;
    }

    var a = feedAnim;
    var t = a.t;
    var bobY = 0, chomp = false;
    var foodHtml = '';

    if (t < 20) {
      var p = t / 20;
      var ease = 1 - Math.pow(1 - p, 2.2);
      var dropY = -100 * (1 - ease) - 6;
      foodHtml = '<g transform="translate(0,' + dropY.toFixed(1) + ') scale(0.95)">' + foodSVG(a.food.id) + '</g>';
      bobY = p * 4;
    } else if (t < 68) {
      var chew = Math.sin((t - 20) * 0.45);
      chomp = chew > 0.15;
      bobY = 5 + chew * 3;
      var scale = Math.max(0.2, 1 - (t - 20) / 48);
      foodHtml = '<g transform="translate(0,-6) scale(' + scale.toFixed(2) + ')">' + foodSVG(a.food.id) + '</g>';
      if (t % 12 === 0) Snd.play('chomp');
    } else {
      bobY = 0;
      foodHtml = '<circle cx="0" cy="0" r="1.5" fill="#fff" opacity=".5"/>';
    }

    var bowl = sealBowlSVG(foodHtml);
    box.innerHTML = sealSVG({ mood: 'happy', chomp: chomp, clap: t >= 68, bobY: bobY, extra: bowl, viewBox: '-100 -80 200 185' });
  }

  function renderFood() {
    var g = $('foodGrid');
    if (!g) return;
    g.innerHTML = '';
    FOODS.forEach(function (f) {
      var d = document.createElement('div');
      d.className = 'it' + (pickFood === f.id ? ' on' : '');
      var curSeal = SEALS[S.society.activeChar] || SEALS.boba;
      var isFav = f.id === curSeal.favFood;
      d.innerHTML = '<span class="e">' + f.e + (isFav ? '💛' : '') + '</span>' +
        '<span>' + f.name + '</span>' +
        '<small>+' + f.food + ' 🍽 +' + f.happy + ' 💕</small>';
      d.addEventListener('click', function () {
        pickFood = f.id;
        renderFood();
        renderFoodStage();
        Snd.play('boop');
      });
      g.appendChild(d);
    });
    renderFoodStage();
  }

  $('feedBtn').addEventListener('click', function () {
    tick();
    if (feedAnim) return;
    var f = FOODS.filter(function (x) { return x.id === pickFood; })[0];
    if (S.food >= 100) {
      $('feedLog').textContent = "Boba is completely full and round right now! 🦭✨";
      Snd.play('squeak');
      return;
    }

    var curSeal = SEALS[S.society.activeChar] || SEALS.boba;
    S.food = Math.min(100, S.food + f.food);
    S.happy = Math.min(100, S.happy + f.happy);
    var isFav = f.id === curSeal.favFood;
    if (isFav) {
      S.love += 4;
      S.coins += 2;
      $('feedLog').textContent = '💛 ' + curSeal.name + '\'s favorite snack! ARF ARF! (+4 love, +2 🫧)';
    } else {
      S.love += 2;
      $('feedLog').textContent = f.e + ' Nom nom nom! ' + curSeal.name + ' gulped down the ' + f.name + '~';
    }

    feedAnim = { food: f, t: 0 };
    Snd.play('splash');

    function step() {
      if (!feedAnim) return;
      feedAnim.t++;
      renderFoodStage();
      if (feedAnim.t < 88) {
        feedRaf = requestAnimationFrame(step);
      } else {
        feedAnim = null;
        renderFoodStage();
        renderHome();
        Snd.play('pearl');
        say(isFav ? 'ARF ARF! DELICIOUS! 💙' : 'Thank you for the delicious treat! 🦭');
        save();
      }
    }
    step();
  });

  /* ---------------- DRESS UP TAB ---------------- */
  var dressCat = 'hat';

  function renderDress() {
    $('petBox2').innerHTML = sealSVG({});
    var cr = $('dressCats');
    cr.innerHTML = '';
    DRESS_CATS.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'place' + (dressCat === c.key ? ' on' : '');
      b.textContent = c.name;
      b.addEventListener('click', function () {
        dressCat = c.key;
        renderDress();
        Snd.play('boop');
      });
      cr.appendChild(b);
    });

    var g = $('dressGrid');
    g.innerHTML = '';
    var cat = DRESS_MAP[dressCat];
    Object.keys(cat).forEach(function (k) {
      var it = cat[k];
      var d = document.createElement('div');
      d.className = 'it' + (S.outfit[dressCat] === k ? ' on' : '');
      var keep = S.outfit[dressCat];
      S.outfit[dressCat] = k;
      d.innerHTML = sealSVG({ w: 90, noShadow: true }).replace(/^<svg[^>]*>/, '<svg viewBox="-100 -80 200 180">');
      S.outfit[dressCat] = keep;
      d.innerHTML += '<span>' + it.name + '</span>';
      d.addEventListener('click', function () {
        S.outfit[dressCat] = k;
        S.happy = Math.min(100, S.happy + 2);
        Snd.play('pop');
        save();
        renderDress();
        renderHome();
        say('How do I look? 🦭✨');
      });
      g.appendChild(d);
    });
  }

  $('dressClear').addEventListener('click', function () {
    S.outfit = { hat: 'none', collar: 'none', cloth: 'none' };
    save();
    renderDress();
    renderHome();
    say('Natural silky coat! 💙');
    Snd.play('boop');
  });

  var rndBtn = document.createElement('button');
  rndBtn.className = 'abtn';
  rndBtn.style.marginLeft = '8px';
  rndBtn.textContent = '🎲 Surprise me!';
  rndBtn.addEventListener('click', function () {
    var hatKeys = Object.keys(HATS);
    var colKeys = Object.keys(COLLARS);
    var cloKeys = Object.keys(CLOTHES);
    S.outfit.hat = hatKeys[Math.floor(Math.random() * hatKeys.length)];
    S.outfit.collar = colKeys[Math.floor(Math.random() * colKeys.length)];
    S.outfit.cloth = cloKeys[Math.floor(Math.random() * cloKeys.length)];
    save();
    renderDress();
    renderHome();
    say('Ooh! Brand new outfit! 🦭✨');
    Snd.play('pearl');
  });
  $('pDress').querySelector('.acts').appendChild(rndBtn);

  /* ---------------- OCEAN SWIMMING & BEACH BALL GAME ---------------- */
  var place = PLACES[0];
  var walkX = 50, walkDir = 1, walkOn = false, walkRaf = 0;
  var ballActive = false, ballX = 180, ballY = 20, ballVy = 2, ballCombo = 0;
  var pearlsInSea = [];

  function renderPlaces() {
    var row = $('placeRow');
    row.innerHTML = '';
    PLACES.forEach(function (p) {
      var b = document.createElement('button');
      b.className = 'place' + (place.key === p.key ? ' on' : '');
      b.textContent = p.e + ' ' + p.name;
      b.addEventListener('click', function () {
        place = p;
        renderPlaces();
        drawSwim(false);
        say('Swimming to ' + p.name + '! ' + p.e);
        Snd.play('splash');
      });
      row.appendChild(b);
    });
  }

  function drawSwim(moving) {
    var bob = moving ? Math.sin(Date.now() / 150) * 5 : Math.sin(Date.now() / 650) * 2.5;
    var px = 100 + walkX;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" id="swimSvg" style="cursor:pointer">';
    s += '<g>' + oceanScene(place.key) + '</g>';

    pearlsInSea.forEach(function (pr) {
      s += '<circle cx="' + pr.x + '" cy="' + pr.y + '" r="6" fill="#fff" stroke="#cae5ff" stroke-width="1.8"/>' +
        '<circle cx="' + (pr.x - 2) + '" cy="' + (pr.y - 2) + '" r="2" fill="#fff"/>' +
        '<text x="' + (pr.x - 7) + '" y="' + (pr.y + 4) + '" font-size="9">🫧</text>';
    });

    s += '<ellipse cx="' + px + '" cy="198" rx="42" ry="8" fill="rgba(20,50,90,.18)"/>';
    var flipX = walkDir < 0 ? ' scale(-0.72, 0.72)' : ' scale(0.72, 0.72)';
    s += '<g transform="translate(' + px + ',' + (152 + bob) + ')' + flipX + '">' +
      sealSVG({ noShadow: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g>';

    if (moving) {
      var trailX = walkDir > 0 ? px - 52 : px + 52;
      s += '<circle cx="' + trailX + '" cy="' + (156 + bob) + '" r="4.5" fill="#fff" opacity=".7"/>';
      s += '<circle cx="' + (trailX - walkDir * 12) + '" cy="' + (150 + bob) + '" r="3" fill="#fff" opacity=".6"/>';
    }

    if (ballActive) {
      s += '<g transform="translate(' + ballX + ',' + ballY + ')">' +
        '<circle r="16" fill="#ffd166" stroke="#c9931a" stroke-width="2"/>' +
        '<path d="M-16 0 A16 16 0 0 1 16 0 Z" fill="#ff6b8b"/>' +
        '<path d="M0 -16 A16 16 0 0 1 0 16 Z" fill="#4facfe"/>' +
        '<circle r="4" fill="#fff"/>' +
        '</g>';
      if (Math.abs(ballX - px) < 40 && ballY > 90) {
        s += '<circle cx="' + px + '" cy="120" r="18" fill="none" stroke="#ffd166" stroke-width="3" stroke-dasharray="5 4"/>' +
          '<text x="' + (px - 26) + '" y="105" font-family="Inter,sans-serif" font-weight="900" font-size="12" fill="#ffd166">BOUNCE!</text>';
      }
    }

    s += '</svg>';
    $('walkBox').innerHTML = s;

    var svgEl = $('swimSvg');
    if (svgEl) {
      svgEl.addEventListener('pointerdown', function (e) {
        var rect = svgEl.getBoundingClientRect();
        var clickX = ((e.clientX - rect.left) / rect.width) * 400;
        var targetWalkX = Math.max(0, Math.min(200, clickX - 100));
        walkDir = targetWalkX >= walkX ? 1 : -1;
        walkTargetX = targetWalkX;
        if (!walkOn) { walkOn = true; swimStep(); }
      });
    }
  }

  var walkTargetX = null;

  function swimStep() {
    if (!walkOn) return;
    if (walkTargetX !== null) {
      var dist = walkTargetX - walkX;
      if (Math.abs(dist) < 3) {
        walkTargetX = null;
        stopSwim();
        return;
      }
      walkDir = dist > 0 ? 1 : -1;
      walkX += walkDir * 2.6;
    } else {
      walkX += walkDir * 2.2;
      if (walkX > 200) walkDir = -1;
      if (walkX < 0) walkDir = 1;
    }

    var px = 100 + walkX;
    for (var i = pearlsInSea.length - 1; i >= 0; i--) {
      if (Math.abs(pearlsInSea[i].x - px) < 35) {
        pearlsInSea.splice(i, 1);
        S.coins += 1;
        S.happy = Math.min(100, S.happy + 2);
        Snd.play('pearl');
        $('walkLog').textContent = '✨ You caught a floating ocean pearl! (+1 🫧)';
        save();
        renderHome();
      }
    }

    if (Math.random() < 0.01) {
      S.happy = Math.min(100, S.happy + 2);
      S.love += 1;
      var finds = [
        'Found a shiny pearl shell! +1 🫧',
        'A little fishy swims along 🐟 +1 love',
        'Joyful aquatic backflip splash! 💦',
        'Waving flippers happily 👋'
      ];
      $('walkLog').textContent = finds[Math.floor(Math.random() * finds.length)];
      if (pearlsInSea.length < 3 && Math.random() < 0.5) {
        pearlsInSea.push({ x: 60 + Math.random() * 280, y: 150 + Math.random() * 30 });
      }
      save();
    }

    drawSwim(true);
    walkRaf = requestAnimationFrame(swimStep);
  }

  $('wLeft').addEventListener('pointerdown', function () {
    walkTargetX = null;
    walkDir = -1;
    if (!walkOn) { walkOn = true; swimStep(); }
  });
  $('wRight').addEventListener('pointerdown', function () {
    walkTargetX = null;
    walkDir = 1;
    if (!walkOn) { walkOn = true; swimStep(); }
  });
  ['pointerup', 'pointerleave'].forEach(function (ev) {
    $('wLeft').addEventListener(ev, stopSwim);
    $('wRight').addEventListener(ev, stopSwim);
  });

  function stopSwim() {
    walkOn = false;
    if (walkRaf) cancelAnimationFrame(walkRaf);
    drawSwim(false);
  }

  var ballRaf = 0;
  $('wPlay').addEventListener('click', function () {
    if (ballActive) {
      var px = 100 + walkX;
      var diff = Math.abs(ballX - px);
      if (diff < 45 && ballY > 70 && ballY < 165) {
        ballCombo++;
        ballVy = -7.5 - Math.min(4, ballCombo * 0.4);
        Snd.play('bounce');
        S.happy = Math.min(100, S.happy + 5);
        S.love += 2;
        S.coins += 1;
        var cheer = ballCombo >= 3 ? '⭐⭐⭐ SUPER BOUNCE! x' + ballCombo + ' (+1 🫧)' : '🤽 Bounce! Combo x' + ballCombo;
        $('walkLog').textContent = cheer;
        say('Yay! Nice catch! 🤽💙');
        drawSwim(false);
        save();
        renderHome();
      } else {
        Snd.play('splash');
        $('walkLog').textContent = 'Too early or too far! Swim under the ball to bounce it!';
      }
      return;
    }

    ballActive = true;
    ballCombo = 0;
    var px = 100 + walkX;
    ballX = px + (Math.random() > 0.5 ? 20 : -20);
    ballY = 10;
    ballVy = 2;
    Snd.play('bounce');
    $('wPlay').textContent = '🤽 BOUNCE!';
    $('wPlay').style.background = 'linear-gradient(135deg,#ffd166,#ff922b)';
    $('walkLog').textContent = 'Get under the ball and tap BOUNCE to volley it!';

    function ballLoop() {
      if (!ballActive) return;
      ballY += ballVy;
      ballVy += 0.16;
      if (ballY > 175) {
        Snd.play('splash');
        $('walkLog').textContent = 'Splash! The ball landed in the water~ Final combo: ' + ballCombo;
        ballActive = false;
        $('wPlay').textContent = '🤽 Play ball';
        $('wPlay').style.background = '';
        drawSwim(false);
        return;
      }
      drawSwim(false);
      ballRaf = requestAnimationFrame(ballLoop);
    }
    ballLoop();
  });

  var snapSwim = document.createElement('button');
  snapSwim.className = 'abtn alt';
  snapSwim.textContent = '📸 Snap swim';
  snapSwim.addEventListener('click', function () {
    var mini = '<g transform="translate(-100,-70) scale(1.02)">' + oceanScene(place.key) + '</g>';
    snapPhoto(place.name, mini);
  });
  $('pWalk').querySelector('.walkctl').appendChild(snapSwim);

  /* ---------------- THE SEAL SOCIETY SYSTEM ---------------- */
  function getHarmonyTitle(score) {
    if (score > 60) return 'Royal Clan 👑';
    if (score > 35) return 'Warm & Loving 💖';
    if (score > 15) return 'Cozy Family 💙';
    return 'Playful Tribe ❄️';
  }

  function renderSociety() {
    var soc = S.society;
    $('stClanSize').textContent = Object.keys(SEALS).length + ' seals';
    $('stHarmony').textContent = getHarmonyTitle(soc.harmony);
    var act = SEALS[soc.activeChar] || SEALS.boba;
    $('stActiveChar').textContent = act.emoji + ' ' + act.name;

    // Gathering Stage: Boba + Selected Relative side-by-side
    var selKey = soc.selectedMember || 'oolong';
    var sel = SEALS[selKey] || SEALS.oolong;

    var gSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">' +
      // Sky & water backdrop
      '<rect width="420" height="220" fill="#d8effc"/>' +
      '<circle cx="370" cy="40" r="24" fill="#fff9db"/>' +
      '<rect y="120" width="420" height="100" fill="#58bde3"/>' +
      // Ice floe where family gathers
      '<ellipse cx="210" cy="154" rx="180" ry="46" fill="#f4faff" stroke="#c0e2f5" stroke-width="3"/>' +
      '<ellipse cx="210" cy="158" rx="160" ry="34" fill="#ffffff" opacity=".7"/>';

    // Left: Boba
    gSvg += '<g transform="translate(130, 138) scale(0.68)">' +
      drawSealCharacter('boba', { noShadow: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g>';

    // Right: Selected relative
    gSvg += '<g transform="translate(290, 138) scale(0.68)">' +
      drawSealCharacter(selKey, { noShadow: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g>';

    // Affection hearts floating between them
    gSvg += '<text x="195" y="85" font-size="24">💕</text>';
    gSvg += '</svg>';

    $('socStageBox').innerHTML = gSvg;
    $('socSay').textContent = sel.greeting;

    // Roster Grid
    var grid = $('socGrid');
    grid.innerHTML = '';
    Object.keys(SEALS).forEach(function (k) {
      var item = SEALS[k];
      var card = document.createElement('div');
      card.className = 'soc-card' + (k === selKey ? ' on' : '');

      var badgeClass = item.gender === 'male' ? 'badge-male' : item.gender === 'pups' ? 'badge-pup' : 'badge-female';
      var badgeText = item.gender === 'male' ? '♂ ตัวผู้' : item.gender === 'pups' ? '👶 แฝด' : '♀ ตัวเมีย';

      var hearts = '';
      var count = (soc.aff && soc.aff[k]) || (k === 'boba' ? 5 : 1);
      for (var h = 0; h < 5; h++) hearts += (h < count ? '❤️' : '🤍');

      card.innerHTML =
        '<span class="soc-badge ' + badgeClass + '">' + badgeText + '</span>' +
        '<div class="soc-thumb">' + drawSealCharacter(k, { noShadow: true, w: 100 }) + '</div>' +
        '<div class="soc-name">' + item.emoji + ' ' + item.name + '</div>' +
        '<div class="soc-role">' + item.role + '</div>' +
        '<div class="soc-bio">' + item.bio + '</div>' +
        '<div class="soc-aff">Affection: ' + hearts + '</div>';

      card.addEventListener('click', function () {
        soc.selectedMember = k;
        Snd.play('boop');
        save();
        renderSociety();
      });
      grid.appendChild(card);
    });

    // Nursery Stage for Twin Pups
    $('nurseryStage').innerHTML = drawSealCharacter('mochi', { noShadow: false });

    // Choir Row
    renderChoir();
  }

  // Society Interactions
  $('actNoseRub').addEventListener('click', function () {
    var soc = S.society;
    var sel = SEALS[soc.selectedMember] || SEALS.oolong;
    soc.aff[soc.selectedMember] = Math.min(5, (soc.aff[soc.selectedMember] || 1) + 1);
    soc.harmony += 2;
    S.love += 2;
    Snd.play('squeak');
    say('*Rub rub rub~* Boba and ' + sel.name + ' share a warm Eskimo nose kiss! 💙');
    $('socSay').textContent = '*Happy arf!* ' + sel.name + ' nuzzles Boba tenderly~ 💕';
    $('socLog').textContent = sel.name + ' loved the nose rub! Affection increased! 💕';
    save();
    renderSociety();
    renderHome();
  });

  $('actGiftMember').addEventListener('click', function () {
    var soc = S.society;
    var sel = SEALS[soc.selectedMember] || SEALS.oolong;
    if (S.coins < 2) {
      $('socLog').textContent = 'You need at least 2 pearls 🫧 to buy a gift treat!';
      Snd.play('squeak');
      return;
    }
    S.coins -= 2;
    soc.aff[soc.selectedMember] = Math.min(5, (soc.aff[soc.selectedMember] || 1) + 1);
    soc.harmony += 3;
    S.love += 3;
    soc.giftsGiven = (soc.giftsGiven || 0) + 1;
    Snd.play('pearl');
    $('socSay').textContent = '🎁 "Thank you so much, sweet Boba!" — ' + sel.name + ' is thrilled!';
    $('socLog').textContent = 'You gifted ' + sel.favFood + ' to ' + sel.name + '! Affection +1, Harmony +3!';
    save();
    renderSociety();
    renderHome();
  });

  $('actFamilyPhoto').addEventListener('click', function () {
    var soc = S.society;
    var selKey = soc.selectedMember || 'oolong';
    var sel = SEALS[selKey] || SEALS.oolong;
    var duoScene = '<rect x="-100" y="-70" width="200" height="190" fill="#e1f3fc"/>' +
      '<ellipse cx="0" cy="62" rx="90" ry="24" fill="#ffffff" stroke="#c0e2f5" stroke-width="2"/>' +
      '<g transform="translate(-38, 20) scale(0.6)">' +
      drawSealCharacter('boba', { noShadow: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g>' +
      '<g transform="translate(38, 20) scale(0.6)">' +
      drawSealCharacter(selKey, { noShadow: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g>' +
      '<text x="-12" y="-20" font-size="20">💕</text>';

    S.album.unshift({
      svg: duoScene,
      where: 'Seal Society · With ' + sel.name,
      t: Date.now(),
      likes: Math.floor(Math.random() * 12) + 8
    });
    if (S.album.length > 24) S.album.pop();
    Snd.play('snap');
    say('📸 Family photo with ' + sel.name + ' added to Sealstagram!');
    $('socLog').textContent = 'Photo saved to album! Check the Album tab 📸';
    save();
    renderAlbum();
  });

  $('actSwitchChar').addEventListener('click', function () {
    var soc = S.society;
    soc.activeChar = soc.selectedMember || 'boba';
    var newActive = SEALS[soc.activeChar] || SEALS.boba;
    Snd.play('pearl');
    say('Now playing as ' + newActive.emoji + ' ' + newActive.name + '!');
    $('socLog').textContent = 'You are now controlling ' + newActive.name + '! Visit Home & Swimming to explore!';
    save();
    renderSociety();
    renderHome();
    renderFood();
  });

  // Nursery Actions
  $('btnNurseMilk').addEventListener('click', function () {
    S.society.harmony += 1;
    S.coins += 1;
    Snd.play('squeak');
    $('nurseryLog').textContent = '🍼 Slurp slurp! Mochi & Pudding happily drank warm milk (+1 🫧)';
    save();
    renderSociety();
  });

  $('btnNurseRattle').addEventListener('click', function () {
    S.love += 1;
    Snd.play('rattle');
    $('nurseryLog').textContent = '🪇 Clack clack! The twin pups giggled and clapped their tiny flippers!';
    save();
    renderSociety();
  });

  $('btnNurseLullaby').addEventListener('click', function () {
    S.society.harmony += 2;
    Snd.play('lullaby');
    $('nurseryLog').textContent = '🎵 *Brahms Lullaby* ... The baby pups snuggled deep and fell asleep z Z 💤';
    save();
    renderSociety();
  });

  // Choir Musical Feature
  function renderChoir() {
    var row = $('choirRow');
    if (!row) return;
    row.innerHTML = '';
    Object.keys(Snd.CHOIR_NOTES).forEach(function (k) {
      var item = SEALS[k] || SEALS.boba;
      var note = Snd.CHOIR_NOTES[k];
      var btn = document.createElement('div');
      btn.className = 'choir-seal';
      btn.innerHTML =
        '<div style="width:36px;margin:0 auto">' + item.emoji + '</div>' +
        '<span>' + item.name + '</span>' +
        '<small>' + note.name + '</small>';
      btn.addEventListener('click', function () {
        Snd.playChoirNote(k);
        $('choirLog').textContent = item.name + ' sings: "' + note.name + '" 🎶';
      });
      row.appendChild(btn);
    });
  }

  $('btnPlayChoir').addEventListener('click', function () {
    Snd.playChoirHarmony();
    S.society.harmony += 3;
    S.coins += 2;
    $('choirLog').textContent = '🎶 The entire Seal Society harmonized together! ARF ARF! (+2 🫧)';
    say('Such a magnificent deep sea seal choir! 🎶💙');
    save();
    renderSociety();
  });

  /* ---------------- PHOTO ALBUM ---------------- */
  function snapPhoto(where, bgSvg) {
    var photo = '<g>' + (bgSvg || '<rect x="-100" y="-80" width="200" height="180" fill="#f0f7ff"/>') +
      '<g transform="translate(0,6) scale(0.92)">' +
      sealSVG({ noShadow: false }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g></g>';
    S.album.unshift({
      svg: photo,
      where: where,
      t: Date.now(),
      likes: Math.floor(Math.random() * 8) + 3
    });
    if (S.album.length > 24) S.album.pop();
    save();
    Snd.play('snap');
    say('📸 Photo saved to Sealstagram album!');
    renderAlbum();
  }

  function renderAlbum() {
    var a = $('album');
    if (!a) return;
    a.innerHTML = '';
    if (!S.album.length) {
      a.innerHTML = '<p class="hint" style="grid-column:1/-1">No photos yet — snap one at Home, Ocean Swim or Family Gathering! 📸</p>';
      return;
    }

    S.album.forEach(function (p, i) {
      var d = document.createElement('div');
      d.className = 'ph';
      var dStr = new Date(p.t).toLocaleDateString();
      d.innerHTML =
        '<div class="ph-top"><span class="ph-user">🦭 @seal.society</span><span class="ph-loc">📍 ' + p.where + '</span></div>' +
        '<div class="ph-img"><svg viewBox="-100 -70 200 180">' + p.svg + '</svg></div>' +
        '<div class="pm">' +
        '  <button class="ph-like" data-i="' + i + '">❤️ <span>' + (p.likes || 1) + '</span></button>' +
        '  <div class="ph-actions">' +
        '    <button class="ph-dl" data-i="' + i + '" title="Download photo">💾</button>' +
        '    <button class="ph-del" data-i="' + i + '" title="Delete photo">🗑</button>' +
        '  </div>' +
        '</div>' +
        '<div class="ph-date">' + dStr + '</div>';
      a.appendChild(d);
    });

    a.querySelectorAll('.ph-like').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = +this.getAttribute('data-i');
        S.album[idx].likes = (S.album[idx].likes || 0) + 1;
        Snd.play('boop');
        this.querySelector('span').textContent = S.album[idx].likes;
        save();
      });
    });

    a.querySelectorAll('.ph-del').forEach(function (b) {
      b.addEventListener('click', function () {
        var idx = +this.getAttribute('data-i');
        S.album.splice(idx, 1);
        Snd.play('pop');
        save();
        renderAlbum();
      });
    });

    a.querySelectorAll('.ph-dl').forEach(function (b) {
      b.addEventListener('click', function () {
        var idx = +this.getAttribute('data-i');
        savePhotoPNG(S.album[idx], idx);
      });
    });
  }

  function savePhotoPNG(photoObj, idx) {
    try {
      var svgStr = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="540" viewBox="-100 -70 200 180">' +
        photoObj.svg + '</svg>';
      var blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 540;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f7ff';
        ctx.fillRect(0, 0, 600, 540);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        var a = document.createElement('a');
        a.download = 'sealstagram_family_' + (idx + 1) + '.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
        Snd.play('pearl');
      };
      img.src = url;
    } catch (e) {
      alert('Could not export image: ' + e.message);
    }
  }

  /* ---------------- SOUND TOGGLE ---------------- */
  var sndBtn = $('sndBtn');
  if (sndBtn) {
    sndBtn.textContent = Snd.isEnabled() ? '🔊 Sound' : '🔇 Muted';
    sndBtn.addEventListener('click', function () {
      var on = Snd.toggle();
      sndBtn.textContent = on ? '🔊 Sound' : '🔇 Muted';
      if (on) Snd.play('boop');
    });
  }

  /* ---------------- LANGUAGE TUTOR TAB (POLYGLOT OCEAN CAFE) ---------------- */
  var currentLearnLang = 'en';
  var currentLearnCat = 'all';
  var currentQuiz = null;

  function initLearn() {
    $('langTabEn')?.addEventListener('click', function () { setLearnLang('en'); });
    $('langTabZh')?.addEventListener('click', function () { setLearnLang('zh'); });
    $('langTabJa')?.addEventListener('click', function () { setLearnLang('ja'); });

    $('btnModeCards')?.addEventListener('click', function () { setLearnMode('cards'); });
    $('btnModeQuiz')?.addEventListener('click', function () { setLearnMode('quiz'); });

    $('btnQuizListen')?.addEventListener('click', function () {
      if (currentQuiz) {
        Voice.speak(currentQuiz.promptWord, currentLearnLang);
        Snd.play('coo');
      }
    });

    $('tutorBox')?.addEventListener('click', function () {
      var lines = {
        en: 'Hello student! Ready to learn with Boba? arf arf~ 🎓💙',
        zh: '你好呀！跟小海豹一起开心学外语吧~ 🎓💙',
        ja: 'こんにちは！ボバと一緒に楽しくお勉強しようね〜 🎓💙'
      };
      var t = lines[currentLearnLang] || lines.en;
      if ($('tutorSay')) $('tutorSay').textContent = t;
      Voice.speak(t, currentLearnLang);
      Snd.play('coo');
    });
  }

  function setLearnLang(l) {
    currentLearnLang = l;
    ['En', 'Zh', 'Ja'].forEach(function (x) {
      $('langTab' + x)?.classList.toggle('on', x.toLowerCase() === l);
    });
    Snd.play('pop');
    renderLearn();
  }

  function setLearnMode(m) {
    $('btnModeCards')?.classList.toggle('alt', m !== 'cards');
    $('btnModeQuiz')?.classList.toggle('alt', m !== 'quiz');
    if (m === 'cards') {
      $('quizContainer')?.classList.add('hidden');
      $('learnCardsGrid')?.classList.remove('hidden');
      $('learnCatsRow')?.classList.remove('hidden');
      renderLearnCards();
    } else {
      $('quizContainer')?.classList.remove('hidden');
      $('learnCardsGrid')?.classList.add('hidden');
      $('learnCatsRow')?.classList.add('hidden');
      nextQuizQuestion();
    }
    Snd.play('boop');
  }

  function renderLearn() {
    // 1. Tutor Stage
    var tutorEl = $('tutorBox');
    if (tutorEl) {
      tutorEl.innerHTML = sealSVG({ tutor: true, mood: 'happy' });
    }

    // 2. Category Pills
    var catRow = $('learnCatsRow');
    if (catRow) {
      catRow.innerHTML = '';
      var allBtn = document.createElement('button');
      allBtn.className = 'place' + (currentLearnCat === 'all' ? ' on' : '');
      allBtn.textContent = '🌟 ทั้งหมด (All)';
      allBtn.addEventListener('click', function () {
        currentLearnCat = 'all';
        renderLearn();
        Snd.play('boop');
      });
      catRow.appendChild(allBtn);

      LEARN_DATA.categories.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'place' + (currentLearnCat === c.id ? ' on' : '');
        btn.textContent = c.name;
        btn.addEventListener('click', function () {
          currentLearnCat = c.id;
          renderLearn();
          Snd.play('boop');
        });
        catRow.appendChild(btn);
      });
    }

    // 3. Cards Grid
    renderLearnCards();
  }

  function renderLearnCards() {
    var grid = $('learnCardsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    var filtered = LEARN_DATA.words.filter(function (w) {
      return (currentLearnCat === 'all' || w.cat === currentLearnCat);
    });

    filtered.forEach(function (item) {
      var langData = item[currentLearnLang] || item.en;
      var card = document.createElement('div');
      card.className = 'learn-card';
      card.innerHTML =
        '<div>' +
        '  <div class="learn-card-top">' +
        '    <span class="learn-card-icon">' + item.icon + '</span>' +
        '    <span style="font-size:0.75rem; font-weight:800; color:var(--ink-soft);">' + currentLearnLang.toUpperCase() + '</span>' +
        '  </div>' +
        '  <div class="learn-card-word">' + langData.word + '</div>' +
        '  <div class="learn-card-sub">' + langData.sub + '</div>' +
        '  <div class="learn-card-thai">🇹🇭 ' + langData.thai + '</div>' +
        '</div>' +
        '<button class="btn-card-listen">🔊 ฟังเสียง Boba</button>';

      card.querySelector('.btn-card-listen').addEventListener('click', function () {
        Voice.speak(langData.word, currentLearnLang);
        Snd.play('coo');
      });

      grid.appendChild(card);
    });
  }

  function nextQuizQuestion() {
    var words = LEARN_DATA.words;
    var target = words[Math.floor(Math.random() * words.length)];
    var targetLangData = target[currentLearnLang] || target.en;

    // Pick 2 other distractors
    var others = words.filter(function (w) { return w !== target; });
    others.sort(function () { return 0.5 - Math.random(); });
    var distractors = others.slice(0, 2).map(function (w) { return (w[currentLearnLang] || w.en).thai; });

    var choices = [targetLangData.thai, distractors[0], distractors[1]];
    choices.sort(function () { return 0.5 - Math.random(); });

    currentQuiz = {
      target: target,
      promptWord: targetLangData.word,
      correctThai: targetLangData.thai
    };

    if ($('quizTargetWord')) $('quizTargetWord').textContent = targetLangData.word;
    if ($('quizSubWord')) $('quizSubWord').textContent = targetLangData.sub;
    if ($('quizQuestion')) $('quizQuestion').textContent = 'คำนี้แปลว่าอะไรในภาษาไทย? (' + currentLearnLang.toUpperCase() + ')';
    if ($('quizStreak')) $('quizStreak').textContent = '🔥 ต่อเนื่อง: ' + (S.polyglot.streak || 0) + ' ข้อ';
    if ($('quizScore')) $('quizScore').textContent = '🫧 ไข่มุกที่ได้: ' + S.coins;
    if ($('quizFeedback')) $('quizFeedback').textContent = 'เลือกคำตอบที่ถูกต้องเพื่อรับไข่มุก 🫧 และคะแนนความรู้!';

    var optGrid = $('quizOptions');
    if (!optGrid) return;
    optGrid.innerHTML = '';
    choices.forEach(function (ch) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = ch;
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        optGrid.querySelectorAll('button').forEach(function (b) { b.disabled = true; });

        if (ch === targetLangData.thai) {
          btn.classList.add('correct');
          Snd.play('quizCorrect');
          Voice.speak(targetLangData.word, currentLearnLang);

          S.coins += 5;
          S.love += 2;
          S.polyglot.xp = (S.polyglot.xp || 0) + 10;
          S.polyglot.streak = (S.polyglot.streak || 0) + 1;
          S.polyglot.quizzesDone = (S.polyglot.quizzesDone || 0) + 1;
          save();

          if ($('quizStreak')) $('quizStreak').textContent = '🔥 ต่อเนื่อง: ' + S.polyglot.streak + ' ข้อ';
          if ($('quizScore')) $('quizScore').textContent = '🫧 ไข่มุกที่ได้: ' + S.coins;
          if ($('quizFeedback')) $('quizFeedback').innerHTML = '<span style="color:#2b8a3e;font-weight:800;">🎉 ถูกต้องนะฮับบ! เก่งมากๆ เลยยย! (+5 🫧, +10 XP)</span>';

          setTimeout(function () { nextQuizQuestion(); }, 1400);
        } else {
          btn.classList.add('wrong');
          Snd.play('quizWrong');
          S.polyglot.streak = 0;
          save();
          if ($('quizStreak')) $('quizStreak').textContent = '🔥 ต่อเนื่อง: 0 ข้อ';
          if ($('quizFeedback')) $('quizFeedback').innerHTML = '<span style="color:#c92a2a;font-weight:800;">🥺 ยังไม่ถูกนะฮับ! คำตอบคือ "' + targetLangData.thai + '" ลองข้อถัดไปกันนะ!</span>';
          setTimeout(function () { nextQuizQuestion(); }, 2000);
        }
      });
      optGrid.appendChild(btn);
    });

    Voice.speak(targetLangData.word, currentLearnLang);
  }

  /* ---------------- TABS NAVIGATION ---------------- */
  var TABS = [
    ['tabHome', 'pHome'],
    ['tabLearn', 'pLearn'],
    ['tabFeed', 'pFeed'],
    ['tabDress', 'pDress'],
    ['tabWalk', 'pWalk'],
    ['tabSociety', 'pSociety'],
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
      Snd.play('boop');
      if (t[1] === 'pWalk') drawSwim(false);
      if (t[1] === 'pFeed') renderFoodStage();
      if (t[1] === 'pSociety') renderSociety();
      if (t[1] === 'pLearn') renderLearn();
    });
  });

  /* ---------------- BOOT ---------------- */
  initLearn();
  renderHome();
  renderFood();
  renderDress();
  renderPlaces();
  drawSwim(false);
  renderSociety();
  renderAlbum();

  if (window.GameStats) {
    GameStats.record('seal', { score: S.love, loves: S.love, day: S.days, pearls: S.coins });
  }
})();
