/* Dogneystagram — Raise Dogney the Cute Golden Puppy! (dogney.js) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------------- SOUND SYNTHESIZER (Web Audio API) ---------------- */
  var Snd = (function () {
    var ctx = null;
    var enabled = lsGet('dogney_sound') !== 'off';

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

        if (kind === 'bork') {
          // Cheerful puppy bark! (Arf!)
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(750, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now); osc.stop(now + 0.17);
        } else if (kind === 'whine') {
          // Sweet puppy affectionate whine
          osc.type = 'sine';
          osc.frequency.setValueAtTime(620, now);
          osc.frequency.linearRampToValueAtTime(840, now + 0.15);
          osc.frequency.linearRampToValueAtTime(680, now + 0.32);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now); osc.stop(now + 0.36);
        } else if (kind === 'chomp') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now); osc.stop(now + 0.1);
        } else if (kind === 'pant') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(380, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now); osc.stop(now + 0.07);
        } else if (kind === 'bounce') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(680, now + 0.1);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.start(now); osc.stop(now + 0.15);
        } else if (kind === 'hug') {
          [440, 554, 659, 880].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.04;
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
            o.start(t); o.stop(t + 0.34);
          });
        } else if (kind === 'pearl') {
          [523, 659, 784, 1046].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.connect(g); g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            var t = now + i * 0.05;
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            o.start(t); o.stop(t + 0.23);
          });
        }
      } catch (e) {}
    }

    function toggle() {
      enabled = !enabled;
      lsSet('dogney_sound', enabled ? 'on' : 'off');
      return enabled;
    }

    return { play: play, toggle: toggle, isEnabled: function () { return enabled; } };
  })();

  /* ---------------- STATE MANAGEMENT ---------------- */
  var DEFAULT = {
    born: Date.now(),
    love: 0,
    bones: 20,
    food: 85,
    happy: 90,
    clean: 80,
    affection: 95,
    hugs: 0,
    bellyRubs: 0,
    boops: 0,
    days: 0,
    outfit: { hat: 'none', collar: 'collar_red', glasses: 'none', coat: 'none' },
    album: []
  };

  var S;
  try {
    S = JSON.parse(lsGet('dogneystagram') || 'null');
  } catch (e) { S = null; }
  if (!S) {
    S = JSON.parse(JSON.stringify(DEFAULT));
    save();
  } else {
    for (var k in DEFAULT) if (S[k] === undefined) S[k] = DEFAULT[k];
    if (!S.outfit) S.outfit = { hat: 'none', collar: 'collar_red', glasses: 'none', coat: 'none' };
    if (!S.outfit.glasses) S.outfit.glasses = 'none';
    if (!S.outfit.coat) S.outfit.coat = 'none';
    if (!S.album) S.album = [];
  }

  function save() { lsSet('dogneystagram', JSON.stringify(S)); }

  /* ---------------- FOODS & DRESS CATALOG ---------------- */
  var FOODS = [
    { id: 'bone', name: 'ฉ่ำกระดูกเนื้อ (Juicy Bone)', icon: '🦴', price: 0, fill: 25 },
    { id: 'steak', name: 'สเต๊กเนื้อริบอาย (Prime Steak)', icon: '🥩', price: 4, fill: 35 },
    { id: 'sausage', name: 'ไส้กรอกหมูรมควัน (Smoked Sausage)', icon: '🌭', price: 2, fill: 20 },
    { id: 'biscuit', name: 'บิสกิตรูปกระดูก (Puppy Biscuit)', icon: '🍪', price: 1, fill: 15 },
    { id: 'cheese', name: 'เชดด้าชีสหอมมัน (Cheddar Slice)', icon: '🧀', price: 2, fill: 18 },
    { id: 'donut', name: 'เบคอนโดนัท (Bacon Donut)', icon: '🍩', price: 3, fill: 22 }
  ];

  var DRESS_ITEMS = {
    collar: [
      { id: 'none', name: 'ไม่ใส่ปลอกคอ', icon: '❌' },
      { id: 'collar_red', name: 'ปลอกคอแดงกระดิ่งทอง', icon: '🔴' },
      { id: 'collar_blue', name: 'ปลอกคอน้ำเงินจี้ดาว', icon: '🔵' },
      { id: 'collar_gold', name: 'สร้อยโซ่ทองฮิปฮอปจอมซน', icon: '⛓️' },
      { id: 'bandana_star', name: 'ผ้าพันคอดาวฟ้าฮีโร่', icon: '⭐' },
      { id: 'bandana_plaid', name: 'ผ้าพันคอลายสก๊อตชมพู', icon: '🧣' },
      { id: 'bandana_pirate', name: 'ผ้าพันคอโจรสลัดสุดเท่', icon: '🏴‍☠️' },
      { id: 'bandana_rainbow', name: 'ผ้าพันคอสีรุ้งสดใส', icon: '🌈' },
      { id: 'bowtie', name: 'โบว์ไทสีทองสุภาพบุรุษ', icon: '🎀' }
    ],
    hat: [
      { id: 'none', name: 'ไม่มีหมวก', icon: '❌' },
      { id: 'hat_cap', name: 'หมวกแก๊ปสปอร์ตสีน้ำเงิน', icon: '🧢' },
      { id: 'hat_party', name: 'หมวกปาร์ตี้คอนเฟตติ', icon: '🎉' },
      { id: 'hat_flower', name: 'มงกุฎดอกไม้หวานแหวว', icon: '🌸' },
      { id: 'hat_straw', name: 'หมวกฟางชาวสวนฤดูร้อน', icon: '👒' },
      { id: 'hat_crown', name: 'มงกุฎทองเจ้าชายตูบ', icon: '👑' },
      { id: 'hat_beanie', name: 'หมวกไหมพรมสตรีทบีนนี่', icon: '🧶' },
      { id: 'hat_bunny', name: 'ที่คาดผมหูกระต่ายน่ารัก', icon: '🐰' },
      { id: 'hat_detective', name: 'หมวกนักสืบเชอร์ล็อกตูบ', icon: '🕵️' },
      { id: 'hat_propeller', name: 'หมวกใบพัดหมุนสายรุ้ง', icon: '🚁' }
    ],
    glasses: [
      { id: 'none', name: 'ไม่มีแว่นตา', icon: '❌' },
      { id: 'glass_shades', name: 'แว่นกันแดดนักบินสุดเท่', icon: '🕶️' },
      { id: 'glass_heart', name: 'แว่นหัวใจสีชมพูหวาน', icon: '💖' },
      { id: 'glass_smart', name: 'แว่นตากลมคุณศาสตราจารย์', icon: '👓' },
      { id: 'glass_star', name: 'แว่นตาดาวนีออนปาร์ตี้', icon: '🌟' }
    ],
    coat: [
      { id: 'none', name: 'ขนธรรมชาตินุ่มฟู', icon: '❌' },
      { id: 'coat_red_puffer', name: 'เสื้อกั๊กนวมกันหนาวสีแดง', icon: '🧥' },
      { id: 'coat_bee', name: 'ฮู้ดดี้ผึ้งน้อยลายทางมีหนวด', icon: '🐝' },
      { id: 'coat_sailor', name: 'เสื้อทหารเรือลายทางคราม', icon: '⛵' },
      { id: 'coat_super', name: 'ผ้าคลุมซูเปอร์ฮีโร่จอมพลัง', icon: '🦸' }
    ]
  };

  /* ---------------- CHARACTER ART (SVG) ---------------- */
  function dogneySVG(opts) {
    opts = opts || {};
    var mood = opts.mood || 'happy';
    var isHug = !!opts.hug;
    var isBelly = !!opts.belly;
    var isPet = !!opts.petting;
    var isEar = !!opts.earScratch;

    var cFur = '#fed18c', cFurDark = '#e29d52', cWhite = '#fff9f0', cInk = '#2c1b18', cPink = '#ff9ebb';

    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -75 200 175" style="display:block;width:100%;height:auto">';
    if (opts.bg) s += opts.bg;

    // Shadow
    s += '<ellipse cx="0" cy="74" rx="58" ry="10" fill="rgba(60,40,20,.12)"/>';

    // Tail (wagging)
    s += '<g class="wagTail">' +
      '<path d="M 28 42 Q 55 25 58 4 Q 54 20 36 48 Z" fill="' + cFurDark + '" stroke="' + cInk + '" stroke-width="2.2"/>' +
      '</g>';

    if (isBelly) {
      // Belly rub pose: rolled over on back
      s += '<g transform="rotate(85) translate(10,-10)">';
    }

    // Body
    s += '<path d="M -50 20 C -60 48, -50 70, 0 72 C 50 70, 60 48, 50 20 C 42 2, -42 2, -50 20 Z" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    // White chest patch
    s += '<path d="M -26 24 C -34 44, -22 66, 0 68 C 22 66, 34 44, 26 24 C 18 14, -18 14, -26 24 Z" fill="' + cWhite + '"/>';

    // Paws
    if (isBelly) {
      // Paws up in air!
      s += '<ellipse cx="-22" cy="18" rx="9" ry="12" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
      s += '<ellipse cx="22" cy="18" rx="9" ry="12" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
      s += '<circle cx="-22" cy="14" r="3.5" fill="' + cPink + '"/><circle cx="22" cy="14" r="3.5" fill="' + cPink + '"/>';
    } else {
      s += '<ellipse cx="-26" cy="66" rx="10" ry="7" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
      s += '<ellipse cx="26" cy="66" rx="10" ry="7" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
    }

    // Coat / Outfit
    var coat = (S.outfit && S.outfit.coat) || 'none';
    if (coat === 'coat_red_puffer') {
      s += '<ellipse cx="0" cy="46" rx="36" ry="24" fill="#e63946" stroke="#c1121f" stroke-width="2"/>';
      s += '<line x1="-32" y1="40" x2="32" y2="40" stroke="#fff" stroke-width="2" opacity=".6"/>';
      s += '<line x1="-34" y1="52" x2="34" y2="52" stroke="#fff" stroke-width="2" opacity=".6"/>';
      s += '<path d="M -22 28 Q 0 34 22 28" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>';
    } else if (coat === 'coat_bee') {
      s += '<ellipse cx="0" cy="46" rx="36" ry="24" fill="#ffd166" stroke="#b78600" stroke-width="2"/>';
      s += '<path d="M -32 40 Q 0 44 32 40 L 34 46 Q 0 50 -34 46 Z" fill="#2c1b18"/>';
      s += '<path d="M -30 52 Q 0 56 30 52 L 28 58 Q 0 62 -28 58 Z" fill="#2c1b18"/>';
      s += '<path d="M 0 28 L -10 14 M 0 28 L 10 14" stroke="#2c1b18" stroke-width="2" stroke-linecap="round"/>';
      s += '<circle cx="-10" cy="14" r="3" fill="#ffd166"/><circle cx="10" cy="14" r="3" fill="#ffd166"/>';
    } else if (coat === 'coat_sailor') {
      s += '<ellipse cx="0" cy="46" rx="36" ry="24" fill="#ffffff" stroke="#1d4e89" stroke-width="2"/>';
      s += '<path d="M -34 38 Q 0 42 34 38" stroke="#1d4e89" stroke-width="3" fill="none"/>';
      s += '<path d="M -36 46 Q 0 50 36 46" stroke="#1d4e89" stroke-width="3" fill="none"/>';
      s += '<path d="M -32 54 Q 0 58 32 54" stroke="#1d4e89" stroke-width="3" fill="none"/>';
    } else if (coat === 'coat_super') {
      s += '<path d="M -24 30 L -46 72 Q 0 78 46 72 L 24 30 Z" fill="#e63946" stroke="#c1121f" stroke-width="2"/>';
      s += '<polygon points="0,48 8,54 5,63 -5,63 -8,54" fill="#ffd166" stroke="#b78600" stroke-width="1.2"/>';
    }

    // Collar
    var col = (S.outfit && S.outfit.collar) || 'collar_red';
    if (col === 'collar_red') {
      s += '<path d="M -26 22 Q 0 32 26 22" stroke="#e63946" stroke-width="6.5" fill="none" stroke-linecap="round"/>';
      s += '<circle cx="0" cy="30" r="5" fill="#ffd166" stroke="#b78600" stroke-width="1.5"/><circle cx="0" cy="30" r="2" fill="#fff"/>';
    } else if (col === 'collar_blue') {
      s += '<path d="M -26 22 Q 0 32 26 22" stroke="#1d4e89" stroke-width="6.5" fill="none" stroke-linecap="round"/>';
      s += '<polygon points="0,26 2,30 6,30 3,33 4,37 0,34 -4,37 -3,33 -6,30 -2,30" fill="#ffd166"/>';
    } else if (col === 'collar_gold') {
      s += '<path d="M -26 22 Q 0 32 26 22" stroke="#ffd166" stroke-width="7" stroke-dasharray="6 3" fill="none" stroke-linecap="round"/>';
      s += '<circle cx="0" cy="30" r="6" fill="#ffd166" stroke="#b78600" stroke-width="1.5"/><text x="-3.5" y="34" font-size="9" fill="#7f4f24">🦴</text>';
    } else if (col === 'bandana_star') {
      s += '<polygon points="-28,20 0,38 28,20" fill="#3a86ff" stroke="#1d4e89" stroke-width="1.8"/>';
      s += '<text x="-4" y="30" font-size="9" fill="#ffd166">⭐</text>';
    } else if (col === 'bandana_plaid') {
      s += '<polygon points="-28,20 0,38 28,20" fill="#ff70a6" stroke="#c9184a" stroke-width="1.8"/>';
      s += '<line x1="-12" y1="24" x2="12" y2="24" stroke="#fff" stroke-width="2"/>';
    } else if (col === 'bandana_pirate') {
      s += '<polygon points="-28,20 0,38 28,20" fill="#212529" stroke="#000" stroke-width="1.8"/>';
      s += '<text x="-4" y="30" font-size="9" fill="#ffffff">☠️</text>';
    } else if (col === 'bandana_rainbow') {
      s += '<polygon points="-28,20 0,38 28,20" fill="#ff595e" stroke="#c1121f" stroke-width="1.5"/>';
      s += '<path d="M -20 25 Q 0 38 20 25" stroke="#ffca3a" stroke-width="3" fill="none"/>';
      s += '<path d="M -14 29 Q 0 40 14 29" stroke="#8ac926" stroke-width="3" fill="none"/>';
    } else if (col === 'bowtie') {
      s += '<polygon points="-14,24 -2,28 -14,32" fill="#ffbe0b"/><polygon points="14,24 2,28 14,32" fill="#ffbe0b"/><circle cx="0" cy="28" r="3.5" fill="#d48b00"/>';
    }

    if (isBelly) s += '</g>';

    // Head
    s += '<g transform="translate(0,-12)">';
    s += '<ellipse cx="0" cy="-6" rx="46" ry="40" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '<path d="M -16 -40 Q 0 -44 16 -40" stroke="rgba(255,255,255,0.7)" stroke-width="4" fill="none" stroke-linecap="round"/>';

    // Floppy Puppy Ears!
    s += '<g class="earL"><path d="M -40 -20 C -60 -10, -56 26, -42 28 C -32 28, -34 4, -36 -12 Z" fill="' + cFurDark + '" stroke="' + cInk + '" stroke-width="2.4"/></g>';
    s += '<g class="earR"><path d="M 40 -20 C 60 -10, 56 26, 42 28 C 32 28, 34 4, 36 -12 Z" fill="' + cFurDark + '" stroke="' + cInk + '" stroke-width="2.4"/></g>';

    // White Muzzle
    s += '<ellipse cx="0" cy="4" rx="22" ry="16" fill="' + cWhite + '" stroke="' + cFurDark + '" stroke-width="1.4"/>';

    // Blushing cheeks
    s += '<ellipse cx="-28" cy="2" rx="7.5" ry="5" fill="' + cPink + '" opacity=".75"/>';
    s += '<ellipse cx="28" cy="2" rx="7.5" ry="5" fill="' + cPink + '" opacity=".75"/>';

    // Eyes
    if (isHug || isEar || isBelly) {
      // Sweet crescent squint eyes
      s += '<path d="M -26 -10 Q -18 -18 -10 -10" stroke="' + cInk + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      s += '<path d="M 10 -10 Q 18 -18 26 -10" stroke="' + cInk + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    } else {
      // Big shiny boba puppy eyes
      function eye(cx) {
        return '<ellipse cx="' + cx + '" cy="-10" rx="9" ry="10" fill="' + cInk + '"/>' +
          '<ellipse cx="' + (cx - 3) + '" cy="-13" rx="3.5" ry="4" fill="#fff"/>' +
          '<circle cx="' + (cx + 3) + '" cy="-6" r="1.8" fill="#fff"/>';
      }
      s += eye(-18) + eye(18);
    }

    // Glasses / Eyewear
    var gl = (S.outfit && S.outfit.glasses) || 'none';
    if (gl === 'glass_shades') {
      s += '<g transform="translate(0, -10)">';
      s += '<path d="M -28 -4 L 28 -4" stroke="#212529" stroke-width="2.5"/>';
      s += '<path d="M -28 -4 C -28 10, -8 10, -8 -4 Z" fill="#212529" stroke="#000" stroke-width="1.8"/>';
      s += '<path d="M 8 -4 C 8 10, 28 10, 28 -4 Z" fill="#212529" stroke="#000" stroke-width="1.8"/>';
      s += '<line x1="-24" y1="-2" x2="-14" y2="6" stroke="#fff" stroke-width="1.6" opacity=".7"/>';
      s += '<line x1="12" y1="-2" x2="22" y2="6" stroke="#fff" stroke-width="1.6" opacity=".7"/>';
      s += '</g>';
    } else if (gl === 'glass_heart') {
      s += '<g transform="translate(0, -10)">';
      s += '<path d="M -28 -4 L 28 -4" stroke="#ff4d6d" stroke-width="2"/>';
      s += '<path d="M -18 -4 C -26 -12, -30 2, -18 8 C -6 2, -10 -12, -18 -4 Z" fill="#ff758f" stroke="#ff4d6d" stroke-width="2" opacity=".9"/>';
      s += '<path d="M 18 -4 C 10 -12, 6 2, 18 8 C 30 2, 26 -12, 18 -4 Z" fill="#ff758f" stroke="#ff4d6d" stroke-width="2" opacity=".9"/>';
      s += '</g>';
    } else if (gl === 'glass_smart') {
      s += '<g transform="translate(0, -10)">';
      s += '<circle cx="-18" cy="0" r="11" fill="none" stroke="#ffd166" stroke-width="2.4"/>';
      s += '<circle cx="18" cy="0" r="11" fill="none" stroke="#ffd166" stroke-width="2.4"/>';
      s += '<line x1="-7" y1="-2" x2="7" y2="-2" stroke="#ffd166" stroke-width="2.4"/>';
      s += '</g>';
    } else if (gl === 'glass_star') {
      s += '<g transform="translate(0, -10)">';
      s += '<polygon points="-18,-9 -14,-2 -7,-2 -12,2 -10,9 -18,5 -26,9 -24,2 -29,-2 -22,-2" fill="#70d6ff" stroke="#0077b6" stroke-width="1.6"/>';
      s += '<polygon points="18,-9 22,-2 29,-2 24,2 26,9 18,5 10,9 12,2 7,-2 14,-2" fill="#70d6ff" stroke="#0077b6" stroke-width="1.6"/>';
      s += '<line x1="-7" y1="-2" x2="7" y2="-2" stroke="#0077b6" stroke-width="2"/>';
      s += '</g>';
    }

    // Nose
    s += '<ellipse cx="0" cy="-1" rx="6" ry="4.5" fill="' + cInk + '"/>';
    s += '<ellipse cx="-2" cy="-2" rx="1.8" ry="1.2" fill="#fff"/>';

    // Mouth & Pink Tongue Blep!
    if (isHug || isBelly || isPet) {
      // Happy open smile with tongue blep
      s += '<path d="M -8 6 Q 0 10 8 6" stroke="' + cInk + '" stroke-width="2.4" fill="none"/>';
      s += '<path d="M -5 7 C -5 18, 5 18, 5 7 Z" fill="#ff70a6" stroke="' + cInk + '" stroke-width="1.8"/>';
      s += '<line x1="0" y1="8" x2="0" y2="15" stroke="#e05375" stroke-width="1.2"/>';
    } else {
      s += '<path d="M -7 5 Q -3 8 0 5 Q 3 8 7 5" stroke="' + cInk + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    }

    // Hat Accessory
    var hat = (S.outfit && S.outfit.hat) || 'none';
    if (hat === 'hat_cap') {
      s += '<path d="M -26 -40 Q 0 -58 26 -40 Z" fill="#3a86ff" stroke="#1d4e89" stroke-width="2"/>';
      s += '<ellipse cx="16" cy="-38" rx="18" ry="4" fill="#3a86ff" stroke="#1d4e89" stroke-width="1.8"/>';
    } else if (hat === 'hat_party') {
      s += '<polygon points="0,-72 -14,-40 14,-40" fill="#ffbe0b" stroke="#d48b00" stroke-width="2"/>';
      s += '<circle cx="0" cy="-73" r="4" fill="#fb5607"/>';
      s += '<circle cx="-4" cy="-52" r="2.5" fill="#ff006e"/><circle cx="3" cy="-60" r="2.5" fill="#3a86ff"/>';
    } else if (hat === 'hat_flower') {
      s += '<circle cx="-16" cy="-42" r="5" fill="#ff70a6"/><circle cx="0" cy="-45" r="5.5" fill="#ffd166"/><circle cx="16" cy="-42" r="5" fill="#ff70a6"/>';
      s += '<circle cx="-8" cy="-43" r="4.5" fill="#ff9ebb"/><circle cx="8" cy="-43" r="4.5" fill="#ff9ebb"/>';
    } else if (hat === 'hat_straw') {
      s += '<ellipse cx="0" cy="-42" rx="36" ry="7" fill="#ffe082" stroke="#b78600" stroke-width="2"/>';
      s += '<path d="M -18 -42 C -18 -60, 18 -60, 18 -42 Z" fill="#ffe082" stroke="#b78600" stroke-width="2"/>';
      s += '<rect x="-18" y="-45" width="36" height="5" fill="#e63946"/>';
    } else if (hat === 'hat_crown') {
      s += '<polygon points="-18,-40 -16,-58 -8,-48 0,-62 8,-48 16,-58 18,-40" fill="#ffd166" stroke="#b78600" stroke-width="2"/>';
      s += '<circle cx="0" cy="-52" r="3" fill="#e63946"/>';
    } else if (hat === 'hat_beanie') {
      s += '<path d="M -26 -40 C -28 -62, 28 -62, 26 -40 Z" fill="#7209b7" stroke="#3a0ca3" stroke-width="2"/>';
      s += '<circle cx="0" cy="-64" r="7" fill="#f72585"/>';
    } else if (hat === 'hat_bunny') {
      s += '<ellipse cx="0" cy="-42" rx="26" ry="4" fill="#fde2e4" stroke="#ff70a6" stroke-width="1.8"/>';
      s += '<ellipse cx="-12" cy="-60" rx="6" ry="16" fill="#ffffff" stroke="#ff70a6" stroke-width="1.8" transform="rotate(-8 -12 -60)"/>';
      s += '<ellipse cx="-12" cy="-60" rx="3" ry="11" fill="#ffb4d6" transform="rotate(-8 -12 -60)"/>';
      s += '<ellipse cx="12" cy="-60" rx="6" ry="16" fill="#ffffff" stroke="#ff70a6" stroke-width="1.8" transform="rotate(8 12 -60)"/>';
      s += '<ellipse cx="12" cy="-60" rx="3" ry="11" fill="#ffb4d6" transform="rotate(8 12 -60)"/>';
    } else if (hat === 'hat_detective') {
      s += '<path d="M -28 -40 C -28 -56, 28 -56, 28 -40 Z" fill="#7f4f24" stroke="#582f0e" stroke-width="2"/>';
      s += '<ellipse cx="0" cy="-40" rx="36" ry="5" fill="#936639" stroke="#582f0e" stroke-width="1.8"/>';
    } else if (hat === 'hat_propeller') {
      s += '<path d="M -24 -40 Q 0 -54 24 -40 Z" fill="#4cc9f0" stroke="#0077b6" stroke-width="2"/>';
      s += '<line x1="0" y1="-48" x2="0" y2="-56" stroke="#2b2d42" stroke-width="2"/>';
      s += '<ellipse cx="-10" cy="-56" rx="10" ry="3" fill="#f72585"/><ellipse cx="10" cy="-56" rx="10" ry="3" fill="#ffd166"/>';
      s += '<circle cx="0" cy="-56" r="3" fill="#2b2d42"/>';
    }

    s += '</g>';

    if (isHug) s += '<text x="-65" y="-45" font-size="22">💖</text><text x="45" y="-55" font-size="20">💕</text>';
    if (isEar) s += '<text x="-62" y="-55" font-size="20">✨</text><text x="46" y="-50" font-size="20">🥰</text>';
    if (isBelly) s += '<text x="-65" y="45" font-size="22">🌸</text><text x="45" y="45" font-size="22">🐾</text>';

    s += '</svg>';
    return s;
  }

  /* ---------------- HOME TAB LOGIC ---------------- */
  var petTimer = null, cozyState = null;

  function renderHome() {
    var homeBg = '<rect x="-100" y="-75" width="200" height="175" fill="#fffaf2"/>' +
      '<circle cx="-60" cy="-35" r="22" fill="#ffe8c2" opacity=".7"/>' +
      '<circle cx="65" cy="-25" r="16" fill="#ffe8c2" opacity=".7"/>';

    $('petBox').innerHTML = dogneySVG({
      bg: homeBg,
      hug: cozyState === 'hug',
      belly: cozyState === 'belly',
      earScratch: cozyState === 'ear',
      petting: cozyState === 'pet'
    });

    $('stAge').textContent = S.days;
    $('stLove').textContent = S.love;
    $('stBones').textContent = S.bones;

    $('bFood').style.width = Math.round(S.food) + '%';
    if ($('bFoodFeed')) $('bFoodFeed').style.width = Math.round(S.food) + '%';
    $('bHappy').style.width = Math.round(S.happy) + '%';
    $('bClean').style.width = Math.round(S.clean) + '%';
    if ($('bAffection')) $('bAffection').style.width = Math.round(S.affection) + '%';
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
    S.love += 4; S.happy = 100; S.affection = Math.min(100, S.affection + 6);
    cozyState = 'hug';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 1600);

    Snd.play('hug');
    setTimeout(function () { Snd.play('whine'); }, 180);

    spawnFloatingParticles($('petBox'), ['💖', '💕', '🐶', '🥰'], 6);
    $('say').textContent = 'งื้มมม~ กอดด็อกนี่แน่นๆ อุ่นที่สุดเลยโฮ่งงง! 💕';
    $('log').textContent = 'Dogney buries her snout in your arms happily! (+4 Love, 💖 Affection Up!)';
    save();
    renderHome();
  }

  function doBelly() {
    S.love += 3; S.happy = 100; S.affection = Math.min(100, S.affection + 5);
    cozyState = 'belly';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 1800);

    Snd.play('bork');
    setTimeout(function () { Snd.play('pant'); }, 200);

    spawnFloatingParticles($('petBox'), ['🌸', '🐾', '✨', '💛'], 6);
    $('say').textContent = 'แฮ่กๆๆ จั๊กจี้พุงจังเลยยย ฟินสุดๆ โฮ่ง! 🌸';
    $('log').textContent = 'Dogney rolls on her back, kicking her paws in joy! 🐶🐾';
    save();
    renderHome();
  }

  function doBoop() {
    S.boops = (S.boops || 0) + 1;
    S.love += 1; S.happy = Math.min(100, S.happy + 5);
    cozyState = 'pet';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 900);

    Snd.play('bork');
    spawnFloatingParticles($('petBox'), ['👉', '🦴', '✨'], 3);
    $('say').textContent = 'โฮ่ง! จิ้มจมูกเค้าหรอออ รักจังงง! 🐽✨';
    $('log').textContent = 'Dogney licks your fingers gently! 🐶';
    save();
    renderHome();
  }

  function doEarScratch() {
    S.love += 2; S.happy = Math.min(100, S.happy + 8); S.affection = Math.min(100, S.affection + 3);
    cozyState = 'ear';
    clearTimeout(petTimer);
    petTimer = setTimeout(function () { cozyState = null; renderHome(); }, 1500);

    Snd.play('whine');
    spawnFloatingParticles($('petBox'), ['✨', '⭐', '👂', '💕'], 5);
    $('say').textContent = 'งื้มมมม~ เกาหลังหูตรงนี้ฟินเคลิ้มเลยยยย 🥺✨';
    $('log').textContent = 'Dogney leans into your hand with happy whines! 🐶💛';
    save();
    renderHome();
  }

  $('actHug')?.addEventListener('click', doHug);
  $('actBelly')?.addEventListener('click', doBelly);
  $('actPet')?.addEventListener('click', doBoop);
  $('actEarScratch')?.addEventListener('click', doEarScratch);
  $('petBox')?.addEventListener('click', doHug);

  $('actBath')?.addEventListener('click', function () {
    S.clean = 100; S.happy = Math.min(100, S.happy + 10);
    Snd.play('bork');
    spawnFloatingParticles($('petBox'), ['🫧', '🧼', '✨'], 8);
    $('say').textContent = 'ตัวหอมฟุ้ง ขนฟูนุ่มนิ่มแล้วโฮ่ง! 🫧';
    $('log').textContent = 'Bubble bath time! Dogney shakes her silky fur clean! ✨';
    save();
    renderHome();
  });

  /* ---------------- FEEDING TAB ---------------- */
  var pickFood = FOODS[0];

  function renderFoodStage() {
    var box = $('feedBox');
    if (!box) return;
    box.innerHTML = dogneySVG({ mood: 'happy' });
  }

  function renderFood() {
    var g = $('foodGrid');
    if (!g) return;
    g.innerHTML = '';
    FOODS.forEach(function (f) {
      var d = document.createElement('div');
      d.className = 'it' + (pickFood.id === f.id ? ' on' : '');
      d.innerHTML = '<div class="e">' + f.icon + '</div><span>' + f.name.split(' ')[0] + '</span><small>+' + f.fill + ' Food</small>';
      d.addEventListener('click', function () {
        pickFood = f;
        renderFood();
        Snd.play('bork');
      });
      g.appendChild(d);
    });
  }

  $('feedBtn')?.addEventListener('click', function () {
    S.food = Math.min(100, S.food + pickFood.fill);
    S.happy = Math.min(100, S.happy + 8);
    S.love += 2;
    Snd.play('chomp');
    spawnFloatingParticles($('feedBox'), [pickFood.icon, '😋', '✨'], 5);
    $('feedLog').textContent = 'งั่มๆๆ! Dogney chomped down ' + pickFood.name + '! อร่อยจนหางกระดิก! 🦴';
    save();
    renderHome();
  });

  /* ---------------- DRESS UP TAB ---------------- */
  var dressCat = 'collar';
  var DRESS_LABELS = {
    collar: '🧣 ปลอกคอ & ผ้าพันคอ',
    hat: '👒 หมวกประดับหัว',
    glasses: '🕶️ แว่นตาสุดเท่',
    coat: '🧥 เสื้อกั๊ก & ฮู้ดดี้'
  };

  function renderDress() {
    $('petBox2').innerHTML = dogneySVG({});
    var cr = $('dressCats');
    cr.innerHTML = '';
    ['collar', 'hat', 'glasses', 'coat'].forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'place' + (dressCat === c ? ' on' : '');
      b.textContent = DRESS_LABELS[c] || c;
      b.addEventListener('click', function () {
        dressCat = c;
        renderDress();
        Snd.play('bork');
      });
      cr.appendChild(b);
    });

    var g = $('dressGrid');
    g.innerHTML = '';
    (DRESS_ITEMS[dressCat] || []).forEach(function (item) {
      var d = document.createElement('div');
      var isCurrent = (S.outfit && S.outfit[dressCat] === item.id);
      d.className = 'it' + (isCurrent ? ' on' : '');
      d.innerHTML = '<div class="e">' + item.icon + '</div><span>' + item.name + '</span>';
      d.addEventListener('click', function () {
        if (!S.outfit) S.outfit = {};
        S.outfit[dressCat] = item.id;
        renderDress();
        renderHome();
        Snd.play('bork');
        save();
      });
      g.appendChild(d);
    });
  }

  $('dressRandom')?.addEventListener('click', function () {
    var cKeys = DRESS_ITEMS.collar.map(function (i) { return i.id; });
    var hKeys = DRESS_ITEMS.hat.map(function (i) { return i.id; });
    var gKeys = DRESS_ITEMS.glasses.map(function (i) { return i.id; });
    var oKeys = DRESS_ITEMS.coat.map(function (i) { return i.id; });
    S.outfit = {
      collar: cKeys[Math.floor(Math.random() * cKeys.length)],
      hat: hKeys[Math.floor(Math.random() * hKeys.length)],
      glasses: gKeys[Math.floor(Math.random() * gKeys.length)],
      coat: oKeys[Math.floor(Math.random() * oKeys.length)]
    };
    renderDress();
    renderHome();
    Snd.play('bork');
    save();
  });

  $('dressClear')?.addEventListener('click', function () {
    S.outfit = { hat: 'none', collar: 'none', glasses: 'none', coat: 'none' };
    renderDress();
    renderHome();
    Snd.play('bork');
    save();
  });

  /* ---------------- PARK & FETCH TAB ---------------- */
  var ballX = 260, ballY = 175, isFetching = false;

  function drawParkScene() {
    var box = $('walkBox');
    if (!box) return;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" style="cursor:pointer" id="parkSvg">';
    // Sky
    s += '<rect width="400" height="240" fill="#cbe3fb"/>';
    s += '<circle cx="340" cy="40" r="24" fill="#fff7d6"/>';
    // Distant trees & hills
    s += '<path d="M 0 140 Q 100 110 220 140 T 400 140 L 400 240 L 0 240 Z" fill="#95d5b2"/>';
    s += '<path d="M 0 160 Q 120 145 240 160 T 400 160 L 400 240 L 0 240 Z" fill="#52b788"/>';
    // Grass
    s += '<rect y="170" width="400" height="70" fill="#74c69d"/>';

    // Tennis Ball
    s += '<circle cx="' + ballX + '" cy="' + ballY + '" r="8" fill="#d8f3dc" stroke="#2d6a4f" stroke-width="2"/>';
    s += '<path d="M ' + (ballX - 6) + ' ' + (ballY - 5) + ' Q ' + ballX + ' ' + ballY + ' ' + (ballX - 6) + ' ' + (ballY + 5) + '" stroke="#2d6a4f" stroke-width="1.4" fill="none"/>';

    // Dogney in park
    var dogX = isFetching ? ballX - 25 : 120;
    s += '<g transform="translate(' + dogX + ', 140) scale(0.68)">' +
      dogneySVG({ mood: 'happy' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
      '</g>';

    s += '</svg>';
    box.innerHTML = s;

    $('parkSvg')?.addEventListener('click', function (e) {
      var rect = this.getBoundingClientRect();
      var clickX = (e.clientX - rect.left) / rect.width * 400;
      ballX = Math.max(80, Math.min(350, clickX));
      playFetch();
    });
  }

  function playFetch() {
    isFetching = true;
    Snd.play('bounce');
    drawParkScene();
    $('walkLog').textContent = '🎾 โยนบอลไปแล้ว! Dogney วิ่งสุดแรงไปคาบบอล! 🐶💨';

    setTimeout(function () {
      Snd.play('bork');
      S.bones += 2;
      S.happy = 100;
      S.love += 2;
      $('walkLog').textContent = '🎉 Dogney คาบบอลกลับมาหาคุณอย่างภูมิใจ! โฮ่งๆๆ (+2 🦴 Bones!)';
      isFetching = false;
      drawParkScene();
      save();
      renderHome();
    }, 1100);
  }

  $('wPlay')?.addEventListener('click', function () {
    ballX = 180 + Math.random() * 140;
    playFetch();
  });

  /* ---------------- ALBUM TAB ---------------- */
  $('actSnap')?.addEventListener('click', function () {
    var p = {
      t: Date.now(),
      where: 'Dogney Home',
      likes: 1,
      svg: dogneySVG({ mood: 'happy' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
    };
    S.album.unshift(p);
    Snd.play('pearl');
    alert('📸 แชะ! ถ่ายรูป Dogney เก็บในอัลบั้มเรียบร้อยแล้ว!');
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
        '<div style="background:#fffaf2"><svg viewBox="-100 -75 200 175">' + p.svg + '</svg></div>' +
        '<div class="pm"><button class="ph-like" data-i="' + i + '">❤️ ' + (p.likes || 1) + '</button></div>';
      a.appendChild(d);
    });

    a.querySelectorAll('.ph-like').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = +this.getAttribute('data-i');
        S.album[idx].likes = (S.album[idx].likes || 0) + 1;
        Snd.play('bork');
        this.textContent = '❤️ ' + S.album[idx].likes;
        save();
      });
    });

    a.querySelectorAll('.ph-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = +this.getAttribute('data-i');
        S.album.splice(idx, 1);
        Snd.play('bork');
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
      if (on) Snd.play('bork');
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
      Snd.play('bork');
      if (t[1] === 'pWalk') drawParkScene();
      if (t[1] === 'pFeed') renderFoodStage();
      if (t[1] === 'pDress') renderDress();
      if (t[1] === 'pPhotos') renderAlbum();
    });
  });

  renderHome();
  renderFood();
  renderDress();
  drawParkScene();
  renderAlbum();

  if (window.GameStats) {
    GameStats.record('dogney', { score: S.love, bones: S.bones });
  }
})();
