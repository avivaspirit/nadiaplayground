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
    outfit: { button: 'btn_pearl', acc: 'acc_bell' },
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
    if (!S.outfit) S.outfit = { button: 'btn_pearl', acc: 'acc_bell' };
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
    button: [
      { id: 'none', name: 'ตาเย็บไหมพรมคลาสสิก', icon: '🧶' },
      { id: 'btn_pearl', name: 'กระดุมไข่มุกประกายรุ้ง', icon: '🔘' },
      { id: 'btn_heart', name: 'กระดุมรูปหัวใจไม้', icon: '🤎' },
      { id: 'btn_star', name: 'กระดุมดวงดาวสีทอง', icon: '⭐' },
      { id: 'btn_daisy', name: 'กระดุมดอกเดซี่น่ารัก', icon: '🌼' }
    ],
    acc: [
      { id: 'none', name: 'ไม่มีเครื่องประดับ', icon: '❌' },
      { id: 'acc_bell', name: 'กระดิ่งกรุ๊งกริ๊งสีทอง', icon: '🔔' },
      { id: 'acc_pompom', name: 'ปอมปอมปุกปุยสีชมพู', icon: '🌸' },
      { id: 'acc_pin_bow', name: 'เข็มกลัดโบว์สีมินต์', icon: '🎀' },
      { id: 'acc_ribbon', name: 'ริบบิ้นผ้าซาตินหวาน', icon: '✨' }
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

    // Folded cuff (Top collar) that looks like a cute beret/ears
    s += '<g transform="translate(0,-34)">';
    s += '<rect x="-34" y="-14" width="68" height="18" rx="8" fill="#ffd6e8" stroke="#3c2a3e" stroke-width="2.4"/>';
    // Ribbed knit lines
    for (var x = -26; x <= 26; x += 6) {
      s += '<line x1="' + x + '" y1="-12" x2="' + x + '" y2="2" stroke="#ff70a6" stroke-width="1.8" opacity=".7"/>';
    }
    s += '</g>';

    // Sock Body (Curved Tube Shape)
    // Striped segments: Candy Pink, Pale Mint, Soft Lavender, Cream
    var stripes = ['#ffb4d6', '#bbf2f6', '#fff6cc', '#e8dff5', '#ffb4d6', '#bbf2f6'];

    // Outer sock body outline path
    s += '<path d="M -30 -30 L 30 -30 L 30 24 C 30 52, 46 64, 66 66 C 74 67, 72 74, 60 74 C 40 74, -18 72, -26 40 L -30 -30 Z" fill="#ffb4d6" stroke="#3c2a3e" stroke-width="2.6" stroke-linejoin="round"/>';

    // Horizontal knit stripes inside sock
    s += '<g clip-path="url(#sockClip)">';
    s += '<rect x="-40" y="-18" width="80" height="12" fill="#bbf2f6"/>';
    s += '<rect x="-40" y="-6" width="80" height="12" fill="#fff6cc"/>';
    s += '<rect x="-40" y="6" width="80" height="12" fill="#e8dff5"/>';
    s += '<rect x="-40" y="18" width="80" height="12" fill="#ffb4d6"/>';
    s += '<rect x="-40" y="30" width="80" height="14" fill="#bbf2f6"/>';
    s += '</g>';

    // Soft Pink Heel (Back Curve)
    s += '<path d="M -28 32 C -36 44, -30 62, -14 66 C -24 58, -26 44, -28 32 Z" fill="#ff70a6" stroke="#3c2a3e" stroke-width="2"/>';

    // Soft Pink Toe (Front Curve)
    s += '<path d="M 40 54 C 54 54, 72 60, 68 74 C 52 74, 40 68, 40 54 Z" fill="#ff70a6" stroke="#3c2a3e" stroke-width="2"/>';

    // Toe blush & tickle sparkle
    if (isTickle) {
      s += '<circle cx="62" cy="65" r="4.5" fill="#ff4d88"/><circle cx="60" cy="63" r="1.5" fill="#fff"/>';
      s += '<text x="68" y="58" font-size="16">✨</text>';
    }

    // Rosy Cheeks
    s += '<ellipse cx="-20" cy="4" rx="7" ry="4.5" fill="#ff70a6" opacity=".8"/>';
    s += '<ellipse cx="18" cy="4" rx="7" ry="4.5" fill="#ff70a6" opacity=".8"/>';

    // Eyes: Cute Button Eyes or Happy Closed Eyes
    var btnStyle = S.outfit.button || 'btn_pearl';
    if (isHug || isSquish || isTickle) {
      // Sweet blissful closed smile eyes
      s += '<path d="M -18 -8 Q -10 -16 -2 -8" stroke="#3c2a3e" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      s += '<path d="M 2 -8 Q 10 -16 18 -8" stroke="#3c2a3e" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    } else {
      // Big Shiny Button Eyes!
      function drawButtonEye(cx, cy) {
        var str = '';
        if (btnStyle === 'btn_heart') {
          str += '<path d="M ' + cx + ' ' + (cy + 2) + ' C ' + (cx - 7) + ' ' + (cy - 7) + ', ' + (cx - 12) + ' ' + (cy + 2) + ', ' + cx + ' ' + (cy + 9) + ' C ' + (cx + 12) + ' ' + (cy + 2) + ', ' + (cx + 7) + ' ' + (cy - 7) + ', ' + cx + ' ' + (cy + 2) + ' Z" fill="#b07d62" stroke="#3c2a3e" stroke-width="1.8"/>';
        } else if (btnStyle === 'btn_star') {
          str += '<polygon points="' + cx + ',' + (cy - 9) + ' ' + (cx + 3) + ',' + (cy - 3) + ' ' + (cx + 9) + ',' + (cy - 2) + ' ' + (cx + 4) + ',' + (cy + 3) + ' ' + (cx + 6) + ',' + (cy + 9) + ' ' + cx + ',' + (cy + 5) + ' ' + (cx - 6) + ',' + (cy + 9) + ' ' + (cx - 4) + ',' + (cy + 3) + ' ' + (cx - 9) + ',' + (cy - 2) + ' ' + (cx - 3) + ',' + (cy - 3) + '" fill="#ffd166" stroke="#3c2a3e" stroke-width="1.6"/>';
        } else if (btnStyle === 'btn_daisy') {
          str += '<circle cx="' + cx + '" cy="' + cy + '" r="8.5" fill="#fff" stroke="#3c2a3e" stroke-width="1.8"/><circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="#ffd166"/>';
        } else {
          // Classic Round Button with Thread Cross
          str += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="#3c2a3e" stroke="#221824" stroke-width="1.6"/>';
          str += '<circle cx="' + (cx - 2.5) + '" cy="' + (cy - 2.5) + '" r="2.2" fill="#fff"/>';
          str += '<circle cx="' + (cx + 2.5) + '" cy="' + (cy + 2.5) + '" r="1.4" fill="#fff" opacity=".8"/>';
          str += '<line x1="' + (cx - 3) + '" y1="' + (cy - 3) + '" x2="' + (cx + 3) + '" y2="' + (cy + 3) + '" stroke="#fff" stroke-width="1.2"/>';
          str += '<line x1="' + (cx + 3) + '" y1="' + (cy - 3) + '" x2="' + (cx - 3) + '" y2="' + (cy + 3) + '" stroke="#fff" stroke-width="1.2"/>';
        }
        return str;
      }
      s += drawButtonEye(-12, -8);
      s += drawButtonEye(10, -8);
    }

    // Embroidered Mouth :3
    s += '<path d="M -7 5 Q -3 9 0 5 Q 3 9 7 5" stroke="#3c2a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>';

    // Accessory on Cuff
    var acc = S.outfit.acc || 'acc_bell';
    if (acc === 'acc_bell') {
      s += '<g transform="translate(24, -38)">';
      s += '<circle cx="0" cy="0" r="6" fill="#ffd166" stroke="#b78600" stroke-width="1.6"/><circle cx="0" cy="2" r="1.5" fill="#594200"/>';
      s += '</g>';
    } else if (acc === 'acc_pompom') {
      s += '<circle cx="24" cy="-38" r="8.5" fill="#ffb4d6" stroke="#ff70a6" stroke-width="1.8"/>';
    } else if (acc === 'acc_pin_bow') {
      s += '<g transform="translate(-24, -38)">';
      s += '<polygon points="-6,-4 0,0 -6,4" fill="#70d6ff"/><polygon points="6,-4 0,0 6,4" fill="#70d6ff"/><circle cx="0" cy="0" r="2.5" fill="#ffd166"/>';
      s += '</g>';
    } else if (acc === 'acc_ribbon') {
      s += '<g transform="translate(0, -38)"><polygon points="-8,-4 0,0 -8,4" fill="#ff70a6"/><polygon points="8,-4 0,0 8,4" fill="#ff70a6"/><circle cx="0" cy="0" r="3" fill="#fff"/></g>';
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
  var dressCat = 'button';

  function renderWardrobe() {
    $('petBox2').innerHTML = sockneySVG({});
    var cr = $('dressCats');
    cr.innerHTML = '';
    ['button', 'acc'].forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'place' + (dressCat === c ? ' on' : '');
      b.textContent = (c === 'button' ? '🔘 กระดุมตาน่ารัก' : '🎀 ของประดับขอบถุงเท้า');
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
      var isCurrent = S.outfit[dressCat] === item.id;
      d.className = 'it' + (isCurrent ? ' on' : '');
      d.innerHTML = '<div class="e">' + item.icon + '</div><span>' + item.name + '</span>';
      d.addEventListener('click', function () {
        S.outfit[dressCat] = item.id;
        renderWardrobe();
        Snd.play('chime');
        save();
      });
      g.appendChild(d);
    });
  }

  $('dressClear')?.addEventListener('click', function () {
    S.outfit = { button: 'none', acc: 'none' };
    renderWardrobe();
    Snd.play('chime');
    save();
  });

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
