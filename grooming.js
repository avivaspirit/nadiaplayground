/* Pet Grooming Salon — Nadia Playground (grooming.js) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ==========================================================================
     SOUND SYNTHESIZER (Native Web Audio API)
     ========================================================================== */
  var Snd = (function () {
    var ctx = null;
    var enabled = lsGet('pet_grooming_sound') !== 'off';

    function getCtx() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
      return ctx;
    }

    function isEnabled() { return enabled; }
    function setEnabled(val) {
      enabled = !!val;
      lsSet('pet_grooming_sound', enabled ? 'on' : 'off');
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

        if (kind === 'bubble') {
          // Soft soap bubble pop (chirp up and down)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520 + Math.random() * 200, now);
          osc.frequency.exponentialRampToValueAtTime(1100 + Math.random() * 300, now + 0.06);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (kind === 'splash') {
          // Warm water spray splash
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.linearRampToValueAtTime(480, now + 0.08);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (kind === 'dryer') {
          // Blow dryer warm breeze hum
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(160, now + 0.15);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (kind === 'snip') {
          // Crisp scissor snip
          osc.type = 'square';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (kind === 'sparkle') {
          // Rising harp glissando
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'sine';
            o.connect(g);
            g.connect(c.destination);
            o.frequency.setValueAtTime(f, now + i * 0.06);
            g.gain.setValueAtTime(0.12, now + i * 0.06);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);
            o.start(now + i * 0.06);
            o.stop(now + i * 0.06 + 0.22);
          });
        } else if (kind === 'ting') {
          // Sparkling tooth chime
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1318.5, now);
          osc.frequency.exponentialRampToValueAtTime(2093, now + 0.08);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.36);
        } else if (kind === 'perfume') {
          // Sweet floral chime chord
          [659.25, 880, 1174.66].forEach(function (f) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'triangle';
            o.connect(g);
            g.connect(c.destination);
            o.frequency.setValueAtTime(f, now);
            g.gain.setValueAtTime(0.1, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            o.start(now);
            o.stop(now + 0.48);
          });
        } else if (kind === 'shutter') {
          // Camera click
          osc.type = 'square';
          osc.frequency.setValueAtTime(1800, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.09);
        } else if (kind === 'bark') {
          // Cheerful puppy bark
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(750, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (kind === 'purr') {
          // Cat / Bunny cute purr chirp
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(620, now + 0.08);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (kind === 'seal') {
          // Boba Seal happy squeak
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(950, now + 0.07);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.16);
        } else if (kind === 'sock') {
          // Sockney squishy cute bounce
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(580, now + 0.06);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.start(now);
          osc.stop(now + 0.15);
        }
      } catch (err) {
        // audio context not allowed yet
      }
    }

    return { play: play, isEnabled: isEnabled, setEnabled: setEnabled };
  })();

  /* ==========================================================================
     PET ROSTER CONFIG & DEFINITIONS
     ========================================================================== */
  var PETS = {
    dogney: {
      id: 'dogney',
      name: 'น้องหมา Dogney',
      avatar: '🐶',
      species: 'dog',
      tagline: 'ลูกหมาโกลเด้นหูตูบ ขนฟูสีทองแสนซน',
      sound: 'bark',
      defaultFur: '#fed18c',
      speech: ['โฮ่งๆ สบายตัวจัง!', 'เกาพุงให้หนูด้วยนะ!', 'ขนหนูนุ่มไหมฮะ~', 'ชอบอาบน้ำที่สุดเลย!']
    },
    boba: {
      id: 'boba',
      name: 'น้องแมวน้ำ Boba Seal',
      avatar: '🦭',
      species: 'seal',
      tagline: 'แมวน้ำโบโบ้ตัวกลม ตาไข่มุกอ้อนๆ',
      sound: 'seal',
      defaultFur: '#e8f2f9',
      speech: ['งุ้ยย~ ฟองสบู่นุ่มจัง', 'โบโบ้ตัวหอมแล้วนะ!', 'แปรงฟันแล้วฟันวิ้งๆ', 'อยากแช่น้ำอุ่นทั้งวันเลย']
    },
    sockney: {
      id: 'sockney',
      name: 'น้องถุงเท้า Sockney',
      avatar: '🧦',
      species: 'sock',
      tagline: 'น้องถุงเท้านุ่มฟู นิตติ้งสุดคิ้วท์สไตล์ Sanrio',
      sound: 'sock',
      defaultFur: '#ffb4d6',
      speech: ['ปุ๊กปิ๊กที่สุดเลยย~', 'ขนนุ่มเหมือนสายไหมแล้ว!', 'ตัดเล็บไม่เจ็บเลย เก่งมาก!', 'พร้อมถ่ายรูปแล้วจ้า~']
    },
    bunny: {
      id: 'bunny',
      name: 'น้องกระต่าย Puffy Bunny',
      avatar: '🐰',
      species: 'bunny',
      tagline: 'กระต่ายพัฟฟี่หูยาว ขนปุยสีชมพูนวล',
      sound: 'purr',
      defaultFur: '#fde2e4',
      speech: ['ดุ๊กดิ๊กๆ หูสะอาดแล้ว!', 'ขนฟูนุ่มนิ่มน่ากอดที่สุด', 'ชอบกลิ่นสตรอว์เบอร์รีจัง', 'ยิ้มหวานให้อมยิ้มเลย']
    },
    kitty: {
      id: 'kitty',
      name: 'น้องแมว Mochi Kitty',
      avatar: '🐱',
      species: 'kitty',
      tagline: 'น้องแมวโมจิขาวนวล หูชมพูขี้อ้อน',
      sound: 'purr',
      defaultFur: '#ffffff',
      speech: ['เหมียวว~ สบายจนเคลิ้ม', 'เล็บสวยไม่ข่วนโซฟาแล้วน้า', 'แต่งทรงขนเท็ดดี้ชอบมาก!', 'รักพี่กรูมเมอร์ที่สุดเลย']
    }
  };

  /* STYLING PRESETS */
  var FUR_STYLES = [
    { id: 'teddy', name: '🧸 ทรงหมีเท็ดดี้ (Teddy Cut)' },
    { id: 'cloud', name: '☁️ ทรงก้อนเมฆ (Fluffy Cloud)' },
    { id: 'lion', name: '🦁 ทรงสิงโตจิ๋ว (Mini Lion)' },
    { id: 'heart', name: '💖 ทรงหัวใจ (Heart Pompom)' },
    { id: 'silk', name: '🪞 ทรงเรียบหรู (Smooth Silk)' }
  ];

  var FUR_COLORS = [
    { id: 'natural', name: '🌿 สีธรรมชาติ', hex: null },
    { id: 'sakura', name: '🌸 ซากุระพิงค์', hex: '#ffafcc' },
    { id: 'sky', name: '❄️ ไอซ์สกายบลู', hex: '#a2d2ff' },
    { id: 'lavender', name: '💜 ลาเวนเดอร์มิสต์', hex: '#cdb4db' },
    { id: 'honey', name: '🍯 สวีทฮันนี่', hex: '#ffd166' },
    { id: 'mint', name: '🍃 มินต์เฟรช', hex: '#b7e4c7' }
  ];

  var ACCESSORIES = [
    { id: 'none', name: '✨ ธรรมชาติ (None)' },
    { id: 'ribbon_pink', name: '🎀 โบว์ชมพูหวาน' },
    { id: 'crown_gold', name: '👑 มงกุฎทองคำ' },
    { id: 'flower_pin', name: '🌸 ดอกซากุระติดผม' },
    { id: 'angel_halo', name: '😇 วงแหวนเทวดา' },
    { id: 'sunglasses', name: '⭐ แว่นกันแดดดาว' },
    { id: 'bell_collar', name: '🔔 ปลอกคอกระดิ่ง' },
    { id: 'bandana_red', name: '🧣 ผ้าพันคอสีแดง' }
  ];

  var BACKDROPS = [
    { id: 'spa', name: '🛁 พาสเทลสปา', bg: 'radial-gradient(circle at center, #ffffff 0%, #fff0f5 70%, #f6e8f4 100%)' },
    { id: 'sakura', name: '🌸 สวนซากุระ', bg: 'radial-gradient(circle at center, #fff0f6 0%, #ffccd5 80%, #ffafcc 100%)' },
    { id: 'starry', name: '🌌 ราตรีดาวระยิบ', bg: 'radial-gradient(circle at center, #2b2d42 0%, #1e152a 75%, #0f0a17 100%)' },
    { id: 'rainbow', name: '🌈 ทุ่งหญ้าสีรุ้ง', bg: 'radial-gradient(circle at center, #e8f8f5 0%, #d8f3dc 70%, #b7e4c7 100%)' }
  ];

  /* ==========================================================================
     GAME STATE MANAGEMENT (Persistent LocalStorage)
     ========================================================================== */
  var STATE = {
    activePetId: 'dogney',
    activeStation: 'bath',
    activeTool: 'soap',
    coins: 250,
    pets: {},
    album: [],
    selectedBackdrop: 'spa'
  };

  function loadGameState() {
    var raw = lsGet('pet_grooming_state_v1');
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.pets) {
          STATE.pets = parsed.pets;
          STATE.coins = typeof parsed.coins === 'number' ? parsed.coins : 250;
          STATE.album = Array.isArray(parsed.album) ? parsed.album : [];
          if (parsed.activePetId && PETS[parsed.activePetId]) {
            STATE.activePetId = parsed.activePetId;
          }
        }
      } catch (e) {
        console.warn('Failed to parse grooming state', e);
      }
    }

    // Initialize pets if not present
    Object.keys(PETS).forEach(function (id) {
      if (!STATE.pets[id]) {
        STATE.pets[id] = {
          cleanliness: 45, // needs initial bath!
          fluffiness: 50,
          nails: 30, // needs trim!
          hygiene: 50,
          happiness: 70,
          furStyle: 'teddy',
          furColor: 'natural',
          accessory: 'none',
          dirtSpots: [
            { x: -25, y: -15, clean: false, type: 'mud' },
            { x: 25, y: 5, clean: false, type: 'leaf' },
            { x: -10, y: 35, clean: false, type: 'mud' },
            { x: 30, y: 38, clean: false, type: 'paw' },
            { x: 0, y: -38, clean: false, type: 'mud' }
          ],
          bubblesLevel: 0,
          teethClean: false,
          earsClean: false,
          perfumed: false,
          nailsDoneCount: 0,
          lastGroomed: Date.now() - 3600000 * 4
        };
      }
    });

    // Check Pet Society coin synchronization
    syncWithPetSocietyCoins();
  }

  function saveGameState() {
    var toSave = {
      activePetId: STATE.activePetId,
      coins: STATE.coins,
      pets: STATE.pets,
      album: STATE.album,
      lastSaved: Date.now()
    };
    lsSet('pet_grooming_state_v1', JSON.stringify(toSave));

    // Also push coins to Pet Society active saves so player can use their coins in Pet Society!
    pushCoinsToPetSociety(STATE.coins);
  }

  function syncWithPetSocietyCoins() {
    try {
      var nadiaRaw = lsGet('petsociety_save_nadia');
      if (nadiaRaw) {
        var nadiaSave = JSON.parse(nadiaRaw);
        if (nadiaSave && nadiaSave.player && typeof nadiaSave.player.coins === 'number') {
          if (nadiaSave.player.coins > STATE.coins) {
            STATE.coins = nadiaSave.player.coins;
          }
        }
      }
    } catch (e) {}
  }

  function pushCoinsToPetSociety(newTotal) {
    ['nadia', 'mac'].forEach(function (user) {
      try {
        var k = 'petsociety_save_' + user;
        var r = lsGet(k);
        if (r) {
          var save = JSON.parse(r);
          if (save && save.player) {
            save.player.coins = Math.max(save.player.coins || 0, newTotal);
            lsSet(k, JSON.stringify(save));
          }
        }
      } catch (e) {}
    });
  }

  function addCoins(amount) {
    STATE.coins = (STATE.coins || 0) + amount;
    saveGameState();
    updateCoinDisplay();
  }

  function updateCoinDisplay() {
    var el = $('coinAmount');
    if (el) el.textContent = STATE.coins.toLocaleString();
  }

  /* ==========================================================================
     SVG PET RENDERING ENGINE
     ========================================================================== */
  function getPetCurrentData() {
    return STATE.pets[STATE.activePetId] || {};
  }

  function renderPetSVG(opts) {
    opts = opts || {};
    var pDef = PETS[STATE.activePetId] || PETS.dogney;
    var pData = getPetCurrentData();

    var mood = opts.mood || (pData.happiness > 80 ? 'happy' : 'cozy');
    var isDirty = (pData.cleanliness || 0) < 90;
    var bubbles = pData.bubblesLevel || 0;
    var isFluffy = (pData.fluffiness || 0) >= 80;
    var furColorChoice = FUR_COLORS.find(function (c) { return c.id === pData.furColor; });
    var furColor = (furColorChoice && furColorChoice.hex) ? furColorChoice.hex : pDef.defaultFur;

    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -90 240 200" style="display:block;width:100%;height:100%">';

    // Defs & Gradients
    s += '<defs>';
    s += '<radialGradient id="blushGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff70a6" stop-opacity="0.6"/><stop offset="100%" stop-color="#ff70a6" stop-opacity="0"/></radialGradient>';
    s += '<linearGradient id="bubbleShine" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="rgba(255,255,255,0.95)"/><stop offset="40%" stop-color="rgba(162,210,255,0.5)"/><stop offset="100%" stop-color="rgba(255,182,193,0.6)"/></linearGradient>';
    s += '<filter id="softGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>';
    s += '</defs>';

    // Soft Shadow
    s += '<ellipse cx="0" cy="80" rx="66" ry="12" fill="rgba(60,30,60,0.12)"/>';

    // Pet Specific Silhouette
    if (pDef.species === 'dog') {
      s += drawDogney(furColor, isFluffy, pData.furStyle);
    } else if (pDef.species === 'seal') {
      s += drawBobaSeal(furColor, isFluffy, pData.furStyle);
    } else if (pDef.species === 'sock') {
      s += drawSockney(furColor, isFluffy, pData.furStyle);
    } else if (pDef.species === 'bunny') {
      s += drawBunny(furColor, isFluffy, pData.furStyle);
    } else if (pDef.species === 'kitty') {
      s += drawKitty(furColor, isFluffy, pData.furStyle);
    }

    // Dynamic Face Expressions (Eyes, Mouth, Cheeks)
    s += drawFaceFeatures(pDef.species, mood, pData.happiness);

    // Accessory Overlay
    if (pData.accessory && pData.accessory !== 'none') {
      s += drawAccessory(pData.accessory);
    }

    // Dirt Spots (When dirty)
    if (isDirty && Array.isArray(pData.dirtSpots)) {
      s += '<g id="dirtSpotsGroup">';
      pData.dirtSpots.forEach(function (spot, idx) {
        if (!spot.clean) {
          s += drawDirtSpot(spot, idx);
        }
      });
      s += '</g>';
    }

    // Bubbles Layer (When lathering)
    if (bubbles > 0) {
      s += drawBubblesOverlay(bubbles);
    }

    // Perfume / Fresh Sparkle Aura
    if (pData.perfumed || (pData.cleanliness >= 95 && pData.fluffiness >= 95)) {
      s += drawFreshSparkles();
    }

    s += '</svg>';
    return s;
  }

  /* SPECIES 1: DOGNEY PUP */
  function drawDogney(cFur, isFluffy, style) {
    var cInk = '#2c1b18', cPink = '#ff9ebb', cWhite = '#fff9f0';
    var s = '';

    // Fluffy tail
    s += '<g class="wagTail" style="animation:tailWag 0.3s ease-in-out infinite;transform-origin:30px 48px">';
    s += '<path d="M 28 44 Q 60 22 62 0 Q 56 18 36 50 Z" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '</g>';

    // Body
    s += '<ellipse cx="0" cy="46" rx="42" ry="32" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    // White chest patch
    s += '<ellipse cx="0" cy="48" rx="24" ry="20" fill="' + cWhite + '"/>';

    // Paws
    s += '<ellipse cx="-24" cy="70" rx="12" ry="8" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.4"/>';
    s += '<ellipse cx="24" cy="70" rx="12" ry="8" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.4"/>';
    // Toe lines
    s += '<path d="M -26 68 L -26 73 M -22 68 L -22 73" stroke="' + cInk + '" stroke-width="1.6" stroke-linecap="round"/>';
    s += '<path d="M 22 68 L 22 73 M 26 68 L 26 73" stroke="' + cInk + '" stroke-width="1.6" stroke-linecap="round"/>';

    // Fur style tufts
    if (style === 'cloud') {
      s += '<path d="M -44 38 Q -52 46 -40 54 M 44 38 Q 52 46 40 54" stroke="' + cFur + '" stroke-width="8" stroke-linecap="round" fill="none"/>';
    } else if (style === 'lion') {
      s += '<ellipse cx="0" cy="22" rx="46" ry="18" fill="none" stroke="' + cFur + '" stroke-width="10" stroke-dasharray="12 6"/>';
    }

    // Head
    s += '<ellipse cx="0" cy="6" rx="46" ry="38" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.8"/>';

    // Floppy Ears
    s += '<ellipse cx="-42" cy="-4" rx="15" ry="30" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6" transform="rotate(22 -42 -4)"/>';
    s += '<ellipse cx="42" cy="-4" rx="15" ry="30" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6" transform="rotate(-22 42 -4)"/>';

    // White snout patch
    s += '<ellipse cx="0" cy="18" rx="20" ry="15" fill="' + cWhite + '"/>';
    // Nose
    s += '<ellipse cx="0" cy="12" rx="7.5" ry="5.5" fill="' + cInk + '"/><ellipse cx="-2.5" cy="10.5" rx="2" ry="1.2" fill="#fff"/>';

    return s;
  }

  /* SPECIES 2: BOBA SEAL */
  function drawBobaSeal(cFur, isFluffy, style) {
    var cInk = '#1b222c', cLine = '#7b9cb8', cWhite = '#ffffff';
    var s = '';

    // Flippers / Tail
    s += '<path d="M -26 60 C -52 68, -70 54, -58 38 C -48 50, -28 52, -14 50 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.6"/>';
    s += '<path d="M 26 60 C 52 68, 70 54, 58 38 C 48 50, 28 52, 14 50 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.6"/>';

    // Plump Body
    s += '<path d="M -62 26 C -74 54, -64 78, 0 80 C 64 78, 74 54, 62 26 C 54 8, -54 8, -62 26 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.8"/>';
    // White chest tummy
    s += '<path d="M -42 32 C -52 56, -42 74, 0 76 C 42 74, 52 56, 42 32 C 32 18, -32 18, -42 32 Z" fill="' + cWhite + '"/>';

    // Round Head
    s += '<path d="M -54 -2 C -58 -32, 58 -32, 54 -2 C 58 28, -58 28, -54 -2 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.8"/>';

    // White heart muzzle patch (Authentic Boba Signature)
    s += '<path d="M 0 -2 C -18 -18, -36 4, -14 18 C -4 24, 0 25, 0 25 C 0 25, 4 24, 14 18 C 36 4, 18 -18, 0 -2 Z" fill="' + cWhite + '" stroke="#b5cde0" stroke-width="1.8"/>';

    // Side Flippers
    s += '<path d="M -48 30 C -62 44, -52 60, -36 50 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.4"/>';
    s += '<path d="M 48 30 C 62 44, 52 60, 36 50 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.4"/>';

    // Heart Nose & Whiskers
    s += '<path d="M -6 6 C -7 2, 7 2, 6 6 C 5 10, -5 10, -6 6 Z" fill="' + cInk + '"/>';
    s += '<path d="M -26 12 Q -42 10 -52 8 M -26 16 Q -42 18 -50 21 M 26 12 Q 42 10 52 8 M 26 16 Q 42 18 50 21" stroke="' + cLine + '" stroke-width="1.8" stroke-linecap="round" fill="none"/>';

    return s;
  }

  /* SPECIES 3: SOCKNEY (KAWAII PLUSH SOCK) */
  function drawSockney(cFur, isFluffy, style) {
    var cInk = '#2c1b18', cPink = '#ff70a6', cCyan = '#a0e7e5', cYellow = '#ffd166';
    var s = '';

    // Squishy Sock Body
    s += '<ellipse cx="-26" cy="44" rx="16" ry="12" fill="' + cPink + '" stroke="#c94b7a" stroke-width="2.4"/>';
    s += '<ellipse cx="0" cy="40" rx="38" ry="30" fill="' + cFur + '" stroke="#e08bb2" stroke-width="2.8"/>';

    // Decorative Knit Stripes
    s += '<path d="M -32 30 Q 0 38 32 30 L 32 38 Q 0 46 -32 38 Z" fill="' + cCyan + '"/>';
    s += '<path d="M -30 42 Q 0 50 30 42 L 30 50 Q 0 58 -30 50 Z" fill="' + cYellow + '"/>';

    // Big Head / Sock Top
    s += '<ellipse cx="0" cy="-2" rx="42" ry="34" fill="' + cFur + '" stroke="#e08bb2" stroke-width="2.8"/>';

    // Knit Ribbed Cuff
    s += '<rect x="-30" y="-42" width="60" height="18" rx="9" fill="' + cPink + '" stroke="#c94b7a" stroke-width="2.4"/>';
    s += '<path d="M -20 -40 L -20 -28 M -10 -40 L -10 -28 M 0 -40 L 0 -28 M 10 -40 L 10 -28 M 20 -40 L 20 -28" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/>';

    // Pompom on top
    s += '<circle cx="0" cy="-44" r="7" fill="' + cYellow + '" stroke="#d4a373" stroke-width="1.8"/>';

    // Tiny Plush Paws
    s += '<ellipse cx="-24" cy="64" rx="10" ry="7" fill="' + cFur + '" stroke="#e08bb2" stroke-width="2"/>';
    s += '<ellipse cx="24" cy="64" rx="10" ry="7" fill="' + cFur + '" stroke="#e08bb2" stroke-width="2"/>';

    return s;
  }

  /* SPECIES 4: PUFFY BUNNY */
  function drawBunny(cFur, isFluffy, style) {
    var cInk = '#2c1b18', cPinkInner = '#ffccd5';
    var s = '';

    // Fluffy Pompom Tail
    s += '<circle cx="-42" cy="50" r="14" fill="#ffffff" stroke="' + cInk + '" stroke-width="2.4"/>';

    // Body
    s += '<ellipse cx="0" cy="46" rx="40" ry="32" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '<ellipse cx="0" cy="48" rx="22" ry="18" fill="#ffffff"/>';

    // Little Paws
    s += '<ellipse cx="-20" cy="68" rx="11" ry="8" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
    s += '<ellipse cx="20" cy="68" rx="11" ry="8" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';

    // Long Bunny Ears
    s += '<g transform="rotate(-12 -22 -40)">' +
         '<ellipse cx="-22" cy="-40" rx="12" ry="32" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>' +
         '<ellipse cx="-22" cy="-40" rx="6.5" ry="24" fill="' + cPinkInner + '"/>' +
         '</g>';
    s += '<g transform="rotate(12 22 -40)">' +
         '<ellipse cx="22" cy="-40" rx="12" ry="32" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>' +
         '<ellipse cx="22" cy="-40" rx="6.5" ry="24" fill="' + cPinkInner + '"/>' +
         '</g>';

    // Head
    s += '<ellipse cx="0" cy="8" rx="44" ry="36" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.8"/>';

    // Twitchy Pink Nose
    s += '<polygon points="-4,14 4,14 0,18" fill="#ff70a6"/>';

    return s;
  }

  /* SPECIES 5: MOCHI KITTY */
  function drawKitty(cFur, isFluffy, style) {
    var cInk = '#2c1b18', cPinkInner = '#ffccd5';
    var s = '';

    // Waving Tail
    s += '<path d="M 32 44 Q 58 35 60 16 Q 52 14 38 48 Z" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';

    // Body
    s += '<ellipse cx="0" cy="46" rx="40" ry="30" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '<ellipse cx="0" cy="48" rx="22" ry="18" fill="#fff5ea"/>';

    // Paws
    s += '<ellipse cx="-22" cy="68" rx="11" ry="7.5" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
    s += '<ellipse cx="22" cy="68" rx="11" ry="7.5" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';

    // Pointy Triangle Ears
    s += '<polygon points="-42,0 -16,-34 -12,2" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '<polygon points="-36,-2 -18,-28 -15,0" fill="' + cPinkInner + '"/>';
    s += '<polygon points="42,0 16,-34 12,2" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '<polygon points="36,-2 18,-28 15,0" fill="' + cPinkInner + '"/>';

    // Head
    s += '<ellipse cx="0" cy="6" rx="45" ry="35" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.8"/>';

    // Tiny Pink Nose & Whiskers
    s += '<ellipse cx="0" cy="13" rx="4" ry="3" fill="#ff70a6"/>';
    s += '<path d="M -24 14 L -44 10 M -24 18 L -42 22 M 24 14 L 44 10 M 24 18 L 42 22" stroke="' + cInk + '" stroke-width="1.6" stroke-linecap="round"/>';

    return s;
  }

  /* DYNAMIC FACE & MOOD RENDERING */
  function drawFaceFeatures(species, mood, happiness) {
    var cInk = '#1b222c';
    var s = '';

    // Giant Anime Glossy Eyes
    if (mood === 'blink' || mood === 'sleepy') {
      s += '<path d="M -28 4 Q -20 -4 -12 4" stroke="' + cInk + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
      s += '<path d="M 12 4 Q 20 -4 28 4" stroke="' + cInk + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
    } else {
      // Big Boba Catchlight Eyes
      s += '<g>';
      s += '<ellipse cx="-20" cy="2" rx="10.5" ry="12.5" fill="' + cInk + '"/>';
      s += '<ellipse cx="-20" cy="5" rx="7" ry="5.5" fill="#4facfe" opacity=".45"/>';
      s += '<ellipse cx="-23.5" cy="-2.5" rx="4.2" ry="4.5" fill="#ffffff"/>';
      s += '<circle cx="-16" cy="5.5" r="2.2" fill="#ffffff"/>';

      s += '<ellipse cx="20" cy="2" rx="10.5" ry="12.5" fill="' + cInk + '"/>';
      s += '<ellipse cx="20" cy="5" rx="7" ry="5.5" fill="#4facfe" opacity=".45"/>';
      s += '<ellipse cx="16.5" cy="-2.5" rx="4.2" ry="4.5" fill="#ffffff"/>';
      s += '<circle cx="24" cy="5.5" r="2.2" fill="#ffffff"/>';
      s += '</g>';
    }

    // Blushing Cheeks
    s += '<circle cx="-34" cy="14" r="8.5" fill="url(#blushGlow)"/>';
    s += '<circle cx="34" cy="14" r="8.5" fill="url(#blushGlow)"/>';

    // Cute Kitty Mouth / Smile
    if (happiness > 85) {
      // Happy Open Mouth with Pink Tongue
      s += '<path d="M -9 20 C -9 29, 9 29, 9 20 Z" fill="#e05375" stroke="' + cInk + '" stroke-width="2"/>';
      s += '<path d="M -5 24 Q 0 27 5 24 Z" fill="#ff9ebb"/>';
      s += '<path d="M -9 20 Q 0 16 9 20" stroke="' + cInk + '" stroke-width="2" fill="none"/>';
    } else {
      // Sweet Kitty :3 Smile
      s += '<path d="M -7 20 Q -3.5 24 0 20 Q 3.5 24 7 20" stroke="' + cInk + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>';
    }

    return s;
  }

  /* ACCESSORIES OVERLAYS */
  function drawAccessory(accId) {
    var s = '';
    if (accId === 'ribbon_pink') {
      s += '<g transform="translate(26,-24) scale(0.9)">' +
           '<polygon points="0,0 24,-12 20,14" fill="#ff70a6" stroke="#c94b7a" stroke-width="1.8"/>' +
           '<polygon points="0,0 -24,-12 -20,14" fill="#ff70a6" stroke="#c94b7a" stroke-width="1.8"/>' +
           '<circle cx="0" cy="0" r="6" fill="#ffd166" stroke="#d4a373" stroke-width="1.6"/>' +
           '</g>';
    } else if (accId === 'crown_gold') {
      s += '<g transform="translate(0,-38)">' +
           '<polygon points="-24,10 -28,-14 -10,0 0,-18 10,0 28,-14 24,10" fill="#ffd166" stroke="#b58300" stroke-width="2"/>' +
           '<circle cx="0" cy="-6" r="3.5" fill="#e63946"/>' +
           '<circle cx="-16" cy="-4" r="2.8" fill="#48cae4"/>' +
           '<circle cx="16" cy="-4" r="2.8" fill="#48cae4"/>' +
           '</g>';
    } else if (accId === 'flower_pin') {
      s += '<g transform="translate(-28,-26) scale(0.85)">' +
           '<circle cx="0" cy="-8" r="6" fill="#ffccd5"/>' +
           '<circle cx="8" cy="-2" r="6" fill="#ffccd5"/>' +
           '<circle cx="5" cy="8" r="6" fill="#ffccd5"/>' +
           '<circle cx="-5" cy="8" r="6" fill="#ffccd5"/>' +
           '<circle cx="-8" cy="-2" r="6" fill="#ffccd5"/>' +
           '<circle cx="0" cy="2" r="4.5" fill="#ffd166"/>' +
           '</g>';
    } else if (accId === 'angel_halo') {
      s += '<ellipse cx="0" cy="-44" rx="26" ry="7" fill="none" stroke="#ffd166" stroke-width="4.5" filter="url(#softGlow)"/>';
      s += '<ellipse cx="0" cy="-44" rx="26" ry="7" fill="none" stroke="#ffffff" stroke-width="2"/>';
    } else if (accId === 'sunglasses') {
      s += '<g transform="translate(0,2)">' +
           '<polygon points="-20,-8 -12,-8 -9,2 -17,8 -25,2" fill="#ffd166" stroke="#2c1b18" stroke-width="2"/>' +
           '<polygon points="20,-8 12,-8 9,2 17,8 25,2" fill="#ffd166" stroke="#2c1b18" stroke-width="2"/>' +
           '<path d="M -9 -2 L 9 -2" stroke="#2c1b18" stroke-width="3"/>' +
           '</g>';
    } else if (accId === 'bell_collar') {
      s += '<g transform="translate(0,34)">' +
           '<path d="M -26 0 Q 0 8 26 0" stroke="#d90429" stroke-width="5" stroke-linecap="round" fill="none"/>' +
           '<circle cx="0" cy="8" r="6" fill="#ffd166" stroke="#b58300" stroke-width="1.8"/>' +
           '<circle cx="0" cy="9" r="1.5" fill="#2c1b18"/>' +
           '</g>';
    } else if (accId === 'bandana_red') {
      s += '<g transform="translate(0,32)">' +
           '<polygon points="-28,-2 28,-2 0,22" fill="#e63946" stroke="#9d0208" stroke-width="2"/>' +
           '<circle cx="0" cy="8" r="3" fill="#ffffff" opacity="0.8"/>' +
           '<circle cx="-10" cy="5" r="2.5" fill="#ffffff" opacity="0.8"/>' +
           '<circle cx="10" cy="5" r="2.5" fill="#ffffff" opacity="0.8"/>' +
           '</g>';
    }
    return s;
  }

  /* DIRT SPOTS RENDERING WITH INTERACTIVE HIT TARGETS */
  function drawDirtSpot(spot, idx) {
    var s = '<g class="dirt-spot" data-idx="' + idx + '" transform="translate(' + spot.x + ',' + spot.y + ')" style="cursor:pointer">';
    if (spot.type === 'leaf') {
      s += '<path d="M -8 0 Q 0 -12 12 -4 Q 8 8 -8 0 Z" fill="#52b788" stroke="#2d6a4f" stroke-width="1.8"/>';
      s += '<path d="M -4 -1 L 6 -3" stroke="#2d6a4f" stroke-width="1.2"/>';
    } else if (spot.type === 'paw') {
      s += '<ellipse cx="0" cy="0" rx="9" ry="7" fill="#8d6e63" opacity="0.85"/>';
      s += '<circle cx="-6" cy="-7" r="3" fill="#8d6e63" opacity="0.85"/>';
      s += '<circle cx="0" cy="-9" r="3" fill="#8d6e63" opacity="0.85"/>';
      s += '<circle cx="6" cy="-7" r="3" fill="#8d6e63" opacity="0.85"/>';
    } else {
      // Mud Splat
      s += '<path d="M -12 -2 C -15 -8, -6 -14, 0 -10 C 6 -14, 15 -8, 12 -1 C 16 6, 8 13, 0 11 C -8 13, -16 6, -12 -2 Z" fill="#795548" stroke="#5d4037" stroke-width="1.6" opacity="0.88"/>';
    }
    // Transparent expanded hit area for easy tapping
    s += '<circle cx="0" cy="0" r="24" fill="transparent"/>';
    s += '</g>';
    return s;
  }

  /* BUBBLES LAYER */
  function drawBubblesOverlay(level) {
    var s = '<g class="bubbles-overlay">';
    var bubbleCoords = [
      { x: -20, y: 15, r: 14 },
      { x: 18, y: 22, r: 16 },
      { x: 0, y: 35, r: 18 },
      { x: -30, y: -10, r: 12 },
      { x: 28, y: -8, r: 13 },
      { x: -8, y: -25, r: 15 },
      { x: 12, y: -24, r: 14 },
      { x: -25, y: 50, r: 12 },
      { x: 25, y: 50, r: 12 }
    ];
    var count = Math.min(bubbleCoords.length, Math.ceil(level / 12));
    for (var i = 0; i < count; i++) {
      var b = bubbleCoords[i];
      s += '<circle cx="' + b.x + '" cy="' + b.y + '" r="' + b.r + '" fill="url(#bubbleShine)" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"/>';
      s += '<circle cx="' + (b.x - b.r * 0.35) + '" cy="' + (b.y - b.r * 0.35) + '" r="' + (b.r * 0.25) + '" fill="#ffffff" opacity="0.85"/>';
    }
    s += '</g>';
    return s;
  }

  /* FRESH SPARKLES AURA */
  function drawFreshSparkles() {
    var s = '<g class="fresh-sparkles" style="animation:pulse 2s ease-in-out infinite">';
    s += '<text x="-64" y="-30" font-size="18">✨</text>';
    s += '<text x="52" y="-24" font-size="18">✨</text>';
    s += '<text x="-55" y="45" font-size="16">🌸</text>';
    s += '<text x="48" y="48" font-size="16">💖</text>';
    s += '</g>';
    return s;
  }

  /* ==========================================================================
     STATION 1: BUBBLE BATH & SPA (อาบน้ำฟองสบู่)
     ========================================================================== */
  function initBathStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    if (subBar) subBar.style.display = 'none';

    if (dockInstruction) dockInstruction.textContent = '🧼 เลือกสบู่ถูคราบเลอะ หรือใช้ฝักบัวล้างฟอง แล้วเป่าไดร์ให้ขนฟู!';

    toolList.innerHTML =
      '<button class="tool-btn ' + (STATE.activeTool === 'soap' ? 'active' : '') + '" data-tool="soap">' +
        '<span class="tool-icon">🧼</span>' +
        '<span>สบู่ฟองฟู</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'shower' ? 'active' : '') + '" data-tool="shower">' +
        '<span class="tool-icon">🚿</span>' +
        '<span>ฝักบัวน้ำอุ่น</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'dryer' ? 'active' : '') + '" data-tool="dryer">' +
        '<span class="tool-icon">💨</span>' +
        '<span>ไดร์เป่าขนฟู</span>' +
      '</button>';

    toolList.querySelectorAll('.tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toolList.querySelectorAll('.tool-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        STATE.activeTool = btn.dataset.tool;
        Snd.play('bubble');
        showPetSpeech('พร้อมแล้วฮะ~ ลุยเลย!');
      });
    });
  }

  function handleBathInteraction(e) {
    var pData = getPetCurrentData();
    var tool = STATE.activeTool;
    var rect = $('petStage').getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var relX = clientX - rect.left;
    var relY = clientY - rect.top;

    if (tool === 'soap') {
      // Create foaming bubbles
      spawnBubbleParticle(relX, relY);
      Snd.play('bubble');

      pData.bubblesLevel = Math.min(100, (pData.bubblesLevel || 0) + 12);

      // Clean remaining dirt spots
      var dirtyCount = 0;
      if (Array.isArray(pData.dirtSpots)) {
        pData.dirtSpots.forEach(function (spot) {
          if (!spot.clean) {
            spot.clean = true;
          }
        });
      }

      pData.cleanliness = Math.min(100, (pData.cleanliness || 40) + 15);
      pData.happiness = Math.min(100, (pData.happiness || 50) + 8);
      updateStatsHUD();
      renderCurrentPet();

      if (pData.cleanliness >= 90) {
        showToast('🧼 คราบเลอะหมดแล้ว! ใช้ฝักบัว 🚿 ล้างฟองสบู่ได้เลยจ้า');
        showPetSpeech('ฟองสบู่นุ่มฟู ฟินที่สุดเลย~');
      }
    } else if (tool === 'shower') {
      // Rinse bubbles
      spawnWaterSplashParticle(relX, relY);
      Snd.play('splash');

      pData.bubblesLevel = Math.max(0, (pData.bubblesLevel || 0) - 25);
      pData.cleanliness = 100;
      pData.happiness = Math.min(100, (pData.happiness || 50) + 5);
      updateStatsHUD();
      renderCurrentPet();

      if (pData.bubblesLevel === 0) {
        showToast('🚿 ฟองสบู่ล้างออกเกลี้ยงแล้ว! ต่อด้วยไดร์เป่าขน 💨 ให้ฟูนุ่ม');
        showPetSpeech('ตัวสะอาดวิ้งแล้วฮับบบ~');
      }
    } else if (tool === 'dryer') {
      // Warm breeze fluff
      spawnSteamParticle(relX, relY);
      Snd.play('dryer');

      pData.fluffiness = Math.min(100, (pData.fluffiness || 50) + 14);
      pData.happiness = Math.min(100, (pData.happiness || 50) + 6);
      updateStatsHUD();
      renderCurrentPet();

      if (pData.fluffiness >= 100) {
        showToast('💨 ขนแห้งฟูนุ่มเหมือนปุยเมฆแล้ว! (+20 เหรียญ 🎉)');
        showPetSpeech('ขนฟู นุ่มนิ่ม สบายตัวจัง!');
        addCoins(20);
      }
    }
    saveGameState();
  }

  /* ==========================================================================
     STATION 2: NAIL & PAW CARE MINI-GAME (ตัดเล็บอุ้งเท้า)
     ========================================================================== */
  var nailGame = {
    running: false,
    needlePos: 10,
    needleDir: 1.8,
    animId: null,
    currentNailIdx: 0,
    nailsTotal: 4,
    nailsCut: [false, false, false, false]
  };

  function initNailsStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    if (subBar) subBar.style.display = 'none';

    if (dockInstruction) dockInstruction.textContent = '💅 กดปุ่มด้านล่างเพื่อเริ่มมินิเกมตัดเล็บอุ้งเท้าสุดลุ้นและสนุก!';

    toolList.innerHTML =
      '<button class="tool-btn active" id="btnOpenNailGame">' +
        '<span class="tool-icon">✂️</span>' +
        '<span>เริ่มตัดเล็บอุ้งเท้า</span>' +
      '</button>' +
      '<button class="tool-btn" id="btnQuickNailBuff">' +
        '<span class="tool-icon">✨</span>' +
        '<span>ตะไบเล็บชิมเมอร์</span>' +
      '</button>';

    var btnOpen = $('btnOpenNailGame');
    if (btnOpen) {
      btnOpen.addEventListener('click', openNailModal);
    }
    var btnBuff = $('btnQuickNailBuff');
    if (btnBuff) {
      btnBuff.addEventListener('click', function () {
        Snd.play('sparkle');
        var p = getPetCurrentData();
        p.nails = 100;
        p.happiness = Math.min(100, (p.happiness || 50) + 10);
        updateStatsHUD();
        renderCurrentPet();
        saveGameState();
        showToast('✨ เล็บน้องได้รับการตะไบจนเงาวิ้ง สวยงาม 100%!');
        showPetSpeech('อุ้งเท้าหนูสวยวิ้งเลยฮะ!');
      });
    }
  }

  function openNailModal() {
    var modal = $('nailModal');
    if (!modal) return;
    modal.classList.add('open');

    nailGame.currentNailIdx = 0;
    nailGame.nailsCut = [false, false, false, false];
    nailGame.needlePos = 10;
    nailGame.needleDir = 2.2;
    nailGame.running = true;

    renderNailPawDisplay();
    updateNailProgressUI();
    startNailLoop();
  }

  function closeNailModal() {
    var modal = $('nailModal');
    if (!modal) return;
    modal.classList.remove('open');
    nailGame.running = false;
    if (nailGame.animId) cancelAnimationFrame(nailGame.animId);
  }

  function startNailLoop() {
    function step() {
      if (!nailGame.running) return;
      nailGame.needlePos += nailGame.needleDir;
      if (nailGame.needlePos >= 92) {
        nailGame.needlePos = 92;
        nailGame.needleDir = -2.2;
      } else if (nailGame.needlePos <= 8) {
        nailGame.needlePos = 8;
        nailGame.needleDir = 2.2;
      }
      var needle = $('timingNeedle');
      if (needle) needle.style.left = nailGame.needlePos + '%';
      nailGame.animId = requestAnimationFrame(step);
    }
    if (nailGame.animId) cancelAnimationFrame(nailGame.animId);
    nailGame.animId = requestAnimationFrame(step);
  }

  function renderNailPawDisplay() {
    var box = $('nailPawDisplay');
    if (!box) return;
    var s = '<svg viewBox="-60 -50 120 100" style="width:100%;height:100%">';
    // Paw Pad
    s += '<ellipse cx="0" cy="18" rx="34" ry="24" fill="#ffccd5" stroke="#2c1b18" stroke-width="2.5"/>';
    // Toe Beans & Nails
    var toes = [
      { x: -30, y: -8, rot: -28 },
      { x: -11, y: -20, rot: -10 },
      { x: 11, y: -20, rot: 10 },
      { x: 30, y: -8, rot: 28 }
    ];
    toes.forEach(function (t, i) {
      s += '<g transform="translate(' + t.x + ',' + t.y + ') rotate(' + t.rot + ')">';
      // Toe bean
      s += '<ellipse cx="0" cy="0" rx="9" ry="11" fill="#ffafcc" stroke="#2c1b18" stroke-width="2"/>';
      // Nail tip
      var isCut = nailGame.nailsCut[i];
      var isFocus = (i === nailGame.currentNailIdx);
      var nailColor = isCut ? '#ffffff' : (isFocus ? '#ffd166' : '#eee');
      var nailHeight = isCut ? 5 : 12;

      s += '<path d="M -4 -8 Q 0 ' + (-8 - nailHeight) + ' 4 -8 Z" fill="' + nailColor + '" stroke="#2c1b18" stroke-width="2"/>';
      if (isFocus) {
        s += '<circle cx="0" cy="' + (-8 - nailHeight - 4) + '" r="3" fill="#ff598f"/>';
      }
      s += '</g>';
    });
    s += '</svg>';
    box.innerHTML = s;
  }

  function updateNailProgressUI() {
    var txt = $('nailProgressTxt');
    if (txt) {
      if (nailGame.currentNailIdx < 4) {
        txt.textContent = 'เล็บที่ ' + (nailGame.currentNailIdx + 1) + ' / 4 (กำลังโฟกัส...)';
      } else {
        txt.textContent = '🎉 ตัดครบทั้ง 4 เล็บแล้ว! ตะไบเล็บชิมเมอร์ได้เลย!';
      }
    }
  }

  function handleSnipAttempt() {
    if (!nailGame.running || nailGame.currentNailIdx >= 4) return;
    var pos = nailGame.needlePos;
    // Safe Zone: 42% - 58%
    // Good Zone: 28% - 42% or 58% - 72%
    if (pos >= 42 && pos <= 58) {
      // PERFECT!
      Snd.play('snip');
      Snd.play('sparkle');
      nailGame.nailsCut[nailGame.currentNailIdx] = true;
      nailGame.currentNailIdx++;
      showToast('✨ PERFECT CUT! น้องฟินมาก ไม่เจ็บเลย (+15 เหรียญ)');
      addCoins(15);
    } else if ((pos >= 28 && pos < 42) || (pos > 58 && pos <= 72)) {
      // GOOD!
      Snd.play('snip');
      nailGame.nailsCut[nailGame.currentNailIdx] = true;
      nailGame.currentNailIdx++;
      showToast('👍 GOOD CUT! ตัดได้เรียบร้อย (+10 เหรียญ)');
      addCoins(10);
    } else {
      // MISS / TOO CLOSE
      Snd.play('purr');
      showToast('🐾 อุ๊ย! เกือบโดนเนื้อ น้องดึงอุ้งเท้าหลบ ลองเล็งใหม่อีกทีนะจ๊ะ');
    }

    renderNailPawDisplay();
    updateNailProgressUI();

    if (nailGame.currentNailIdx >= 4) {
      nailGame.running = false;
      var p = getPetCurrentData();
      p.nails = 100;
      p.happiness = Math.min(100, (p.happiness || 50) + 15);
      updateStatsHUD();
      renderCurrentPet();
      saveGameState();

      var btnBuffer = $('btnNailBuffer');
      if (btnBuffer) {
        btnBuffer.style.display = 'inline-flex';
        btnBuffer.onclick = function () {
          Snd.play('sparkle');
          closeNailModal();
          showToast('💅 ตัดเล็บและขัดเงาครบถ้วน 100% เรียบร้อยแล้ว!');
          showPetSpeech('เล็บสวยสบายเท้าที่สุดเลยฮับ!');
        };
      }
    }
  }

  /* ==========================================================================
     STATION 3: FUR STYLING & DYE (แต่งทรงขน & ย้อมสีพาสเทล)
     ========================================================================== */
  function initStylingStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    if (subBar) subBar.style.display = 'flex';

    if (dockInstruction) dockInstruction.textContent = '✂️ เลือกลวดลายทรงขน แปรงขนให้วิ้งๆ หรือย้อมสีปอยขนพาสเทลแสนหวาน!';

    toolList.innerHTML =
      '<button class="tool-btn ' + (STATE.activeTool === 'shears' ? 'active' : '') + '" data-tool="shears">' +
        '<span class="tool-icon">✂️</span>' +
        '<span>กรรไกรแต่งทรง</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'brush' ? 'active' : '') + '" data-tool="brush">' +
        '<span class="tool-icon">🪮</span>' +
        '<span>แปรงขนฟูนุ่ม</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'dye' ? 'active' : '') + '" data-tool="dye">' +
        '<span class="tool-icon">🎨</span>' +
        '<span>แต้มสีย้อมขน</span>' +
      '</button>';

    toolList.querySelectorAll('.tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toolList.querySelectorAll('.tool-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        STATE.activeTool = btn.dataset.tool;
        renderStylingSubOptions();
      });
    });

    renderStylingSubOptions();
  }

  function renderStylingSubOptions() {
    var subBar = $('subOptionsBar');
    if (!subBar) return;
    var tool = STATE.activeTool;
    var pData = getPetCurrentData();
    var html = '';

    if (tool === 'shears') {
      FUR_STYLES.forEach(function (st) {
        var active = (pData.furStyle === st.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-val="' + st.id + '">' + st.name + '</button>';
      });
    } else if (tool === 'dye') {
      FUR_COLORS.forEach(function (col) {
        var active = (pData.furColor === col.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-val="' + col.id + '">' + col.name + '</button>';
      });
    } else if (tool === 'brush') {
      html += '<span style="font-size:0.82rem;font-weight:700;color:var(--ink-soft);padding:4px 8px">✨ แตะหรือลากแปรงลงบนตัวน้องเพื่อเพิ่มความเงางามและขนฟู 100%!</span>';
    }

    subBar.innerHTML = html;

    subBar.querySelectorAll('.sub-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var val = chip.dataset.val;
        if (tool === 'shears') {
          pData.furStyle = val;
          Snd.play('snip');
          showToast('✂️ แต่งทรง ' + chip.textContent + ' สวยเก๋มาก!');
          showPetSpeech('ทรงนี้เท่/น่ารักจังเลย!');
        } else if (tool === 'dye') {
          pData.furColor = val;
          Snd.play('perfume');
          showToast('🎨 ย้อมสี ' + chip.textContent + ' สดใสหวานฉ่ำ!');
          showPetSpeech('สีนี้เข้ากับหนูมากเลยย~');
        }
        pData.happiness = Math.min(100, (pData.happiness || 50) + 8);
        updateStatsHUD();
        renderCurrentPet();
        saveGameState();
        renderStylingSubOptions();
      });
    });
  }

  function handleBrushInteraction(e) {
    if (STATE.activeTool !== 'brush') return;
    var rect = $('petStage').getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var relX = clientX - rect.left;
    var relY = clientY - rect.top;

    spawnSparkleParticle(relX, relY);
    Snd.play('sparkle');

    var p = getPetCurrentData();
    p.fluffiness = 100;
    p.happiness = Math.min(100, (p.happiness || 50) + 6);
    updateStatsHUD();
    renderCurrentPet();
    saveGameState();
  }

  /* ==========================================================================
     STATION 4: SPA & HYGIENE (แปรงฟัน, เช็ดหู & ฉีดสเปรย์หอม)
     ========================================================================== */
  function initSpaStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    if (subBar) subBar.style.display = 'none';

    if (dockInstruction) dockInstruction.textContent = '🩺 แปรงฟันวิ้งๆ เช็ดหู/คีบใบไม้ และฉีดสเปรย์หอมสดชื่นให้อารมณ์ดี!';

    toolList.innerHTML =
      '<button class="tool-btn ' + (STATE.activeTool === 'toothbrush' ? 'active' : '') + '" data-tool="toothbrush">' +
        '<span class="tool-icon">🪥</span>' +
        '<span>แปรงฟันวิ้งๆ</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'ear_swab' ? 'active' : '') + '" data-tool="ear_swab">' +
        '<span class="tool-icon">👂</span>' +
        '<span>เช็ดทำความสะอาดหู</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'perfume' ? 'active' : '') + '" data-tool="perfume">' +
        '<span class="tool-icon">🌸</span>' +
        '<span>สเปรย์หอมอโรมา</span>' +
      '</button>';

    toolList.querySelectorAll('.tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toolList.querySelectorAll('.tool-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        STATE.activeTool = btn.dataset.tool;
      });
    });
  }

  function handleSpaInteraction(e) {
    var pData = getPetCurrentData();
    var tool = STATE.activeTool;
    var rect = $('petStage').getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var relX = clientX - rect.left;
    var relY = clientY - rect.top;

    if (tool === 'toothbrush') {
      spawnSparkleParticle(relX, relY);
      Snd.play('ting');
      pData.teethClean = true;
      pData.hygiene = Math.min(100, (pData.hygiene || 50) + 25);
      pData.happiness = Math.min(100, (pData.happiness || 50) + 10);
      showToast('🪥 แปรงฟันกลิ่นสตรอว์เบอร์รีจนฟันขาววิ้งแล้ว! (+10 เหรียญ)');
      showPetSpeech('ฟันสะอาด ลมหายใจหอมสดชื่นน~');
      addCoins(10);
    } else if (tool === 'ear_swab') {
      spawnSparkleParticle(relX, relY);
      Snd.play('purr');
      pData.earsClean = true;
      pData.hygiene = Math.min(100, (pData.hygiene || 50) + 25);
      pData.happiness = Math.min(100, (pData.happiness || 50) + 10);
      showToast('👂 เช็ดทำความสะอาดหูเรียบร้อย สบายหูจังเลย!');
      showPetSpeech('เกาหูให้ด้วย ฟินที่สุดเลยฮะ!');
    } else if (tool === 'perfume') {
      spawnSparkleParticle(relX, relY);
      spawnSparkleParticle(relX + 20, relY - 20);
      Snd.play('perfume');
      pData.perfumed = true;
      pData.happiness = 100;
      showToast('🌸 ฉีดสเปรย์หอมอโรมา กลิ่นดอกไม้หอมฟุ้งทั้งตัว! (+15 เหรียญ)');
      showPetSpeech('ตัวหนูหอมฟุ้ง พร้อมกอดแล้วจ้า!');
      addCoins(15);
    }
    updateStatsHUD();
    renderCurrentPet();
    saveGameState();
  }

  /* ==========================================================================
     STATION 5: DRESS UP & PHOTO STUDIO (แต่งตัว & สตูดิโอถ่ายรูป)
     ========================================================================== */
  function initPhotoStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    if (subBar) subBar.style.display = 'flex';

    if (dockInstruction) dockInstruction.textContent = '🎀 เลือกพร็อพแต่งตัว ฉากหลัง และกดถ่ายรูปโพลารอยด์รับใบรับรอง 5 ดาว!';

    toolList.innerHTML =
      '<button class="tool-btn ' + (STATE.activeTool === 'accessories' ? 'active' : '') + '" data-tool="accessories">' +
        '<span class="tool-icon">🎀</span>' +
        '<span>เครื่องประดับ</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'backdrop' ? 'active' : '') + '" data-tool="backdrop">' +
        '<span class="tool-icon">🖼️</span>' +
        '<span>ฉากสตูดิโอ</span>' +
      '</button>' +
      '<button class="tool-btn" id="btnSnapPolaroid" style="background:linear-gradient(135deg,#ff70a6,#ffd166);color:#2d232e">' +
        '<span class="tool-icon">📸</span>' +
        '<span>แชะรูปเลย!</span>' +
      '</button>';

    var btnSnap = $('btnSnapPolaroid');
    if (btnSnap) {
      btnSnap.addEventListener('click', snapPolaroidCertificate);
    }

    toolList.querySelectorAll('.tool-btn').forEach(function (btn) {
      if (btn.id === 'btnSnapPolaroid') return;
      btn.addEventListener('click', function () {
        toolList.querySelectorAll('.tool-btn').forEach(function (b) { if (b.id !== 'btnSnapPolaroid') b.classList.remove('active'); });
        btn.classList.add('active');
        STATE.activeTool = btn.dataset.tool;
        renderPhotoSubOptions();
      });
    });

    renderPhotoSubOptions();
  }

  function renderPhotoSubOptions() {
    var subBar = $('subOptionsBar');
    if (!subBar) return;
    var tool = STATE.activeTool;
    var pData = getPetCurrentData();
    var html = '';

    if (tool === 'accessories') {
      ACCESSORIES.forEach(function (acc) {
        var active = (pData.accessory === acc.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-val="' + acc.id + '">' + acc.name + '</button>';
      });
    } else if (tool === 'backdrop') {
      BACKDROPS.forEach(function (bd) {
        var active = (STATE.selectedBackdrop === bd.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-val="' + bd.id + '">' + bd.name + '</button>';
      });
    }

    subBar.innerHTML = html;

    subBar.querySelectorAll('.sub-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var val = chip.dataset.val;
        if (tool === 'accessories') {
          pData.accessory = val;
          Snd.play('sparkle');
          showToast('🎀 สวมใส่ ' + chip.textContent + ' สวยเลิศ!');
        } else if (tool === 'backdrop') {
          STATE.selectedBackdrop = val;
          var found = BACKDROPS.find(function (b) { return b.id === val; });
          if (found) {
            var stage = $('petStage');
            if (stage) stage.style.background = found.bg;
          }
          Snd.play('bubble');
          showToast('🖼️ เปลี่ยนฉาก ' + chip.textContent);
        }
        renderCurrentPet();
        saveGameState();
        renderPhotoSubOptions();
      });
    });
  }

  function snapPolaroidCertificate() {
    Snd.play('shutter');
    Snd.play('sparkle');

    // Camera flash effect
    var flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = '#ffffff';
    flash.style.zIndex = '9999';
    flash.style.opacity = '0.9';
    flash.style.transition = 'opacity 0.4s ease-out';
    document.body.appendChild(flash);
    setTimeout(function () {
      flash.style.opacity = '0';
      setTimeout(function () { flash.remove(); }, 400);
    }, 50);

    // Render Canvas Polaroid
    var canvas = $('polaroidCanvas');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height;

      // Draw backdrop
      var foundBg = BACKDROPS.find(function (b) { return b.id === STATE.selectedBackdrop; });
      var grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#ffccd5');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw Pet SVG to Image
      var svgHtml = renderPetSVG({ mood: 'happy' });
      var img = new Image();
      var svgBlob = new Blob([svgHtml], { type: 'image/svg+xml;charset=utf-8' });
      var url = URL.createObjectURL(svgBlob);

      img.onload = function () {
        ctx.drawImage(img, 20, 10, w - 40, h - 20);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }

    var pDef = PETS[STATE.activePetId];
    var certName = $('certPetName');
    if (certName) certName.textContent = pDef.name;
    var certDate = $('certDate');
    if (certDate) {
      var d = new Date();
      certDate.textContent = 'วันที่ ' + d.toLocaleDateString('th-TH') + ' · Nadia Playground';
    }

    // Award salon & Pet Society coins
    addCoins(50);

    // Open Modal
    var modal = $('photoModal');
    if (modal) modal.classList.add('open');
  }

  /* ==========================================================================
     STATION 6: PET CARE BOARD & ALBUM (บอร์ดดูแลสัตว์เลี้ยง & อัลบั้ม)
     ========================================================================== */
  function initBoardStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    if (subBar) subBar.style.display = 'none';

    if (dockInstruction) dockInstruction.textContent = '📋 ตรวจสอบสถานะการดูแลสัตว์เลี้ยงทั้งหมด หรือดูอัลบั้มภาพความทรงจำ!';

    toolList.innerHTML =
      '<button class="tool-btn active" id="btnViewAllPets">' +
        '<span class="tool-icon">🐾</span>' +
        '<span>สถานะน้องทุกตัว</span>' +
      '</button>' +
      '<button class="tool-btn" id="btnViewAlbum">' +
        '<span class="tool-icon">🖼️</span>' +
        '<span>อัลบั้มโพลารอยด์</span>' +
      '</button>';

    var btnAll = $('btnViewAllPets');
    if (btnAll) {
      btnAll.addEventListener('click', function () {
        renderPetCareBoard();
      });
    }

    renderPetCareBoard();
  }

  function renderPetCareBoard() {
    var stage = $('petViewport');
    if (!stage) return;
    var html = '<div style="padding:14px;background:rgba(255,255,255,0.95);border-radius:20px;border:2px solid #ffd1dc;max-width:420px;margin:0 auto;box-shadow:0 8px 20px rgba(0,0,0,0.06)">';
    html += '<h3 style="font-family:\'Fraunces\',serif;font-size:1.15rem;color:#ff598f;text-align:center;margin-bottom:10px">🐾 ตารางการดูแลสัตว์เลี้ยง (Pet Care Board)</h3>';

    Object.keys(PETS).forEach(function (id) {
      var p = PETS[id];
      var d = STATE.pets[id] || {};
      var isReady = (d.cleanliness >= 90 && d.nails >= 90 && d.fluffiness >= 90);
      var statusColor = isReady ? '#2d6a4f' : '#e0246a';
      var statusText = isReady ? '✨ สะอาดฟู 100%' : '🛁 ต้องการการดูแล';

      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #ffe3ec">';
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<span style="font-size:1.6rem">' + p.avatar + '</span>';
      html += '<div><div style="font-weight:800;font-size:0.88rem">' + p.name + '</div><div style="font-size:0.75rem;color:' + statusColor + ';font-weight:700">' + statusText + '</div></div>';
      html += '</div>';
      html += '<button class="sub-chip" style="font-size:0.75rem;padding:4px 10px" onclick="window.switchPetTo(\'' + id + '\')">กรูมมิ่งตัวนี้</button>';
      html += '</div>';
    });

    html += '</div>';
    stage.innerHTML = html;
  }

  /* ==========================================================================
     GLOBAL UI UPDATES & PARTICLE EFFECTS
     ========================================================================== */
  function renderCurrentPet() {
    var stage = $('petViewport');
    if (!stage) return;
    stage.innerHTML = renderPetSVG();
  }

  function updateStatsHUD() {
    var pData = getPetCurrentData();
    var clean = pData.cleanliness || 0;
    var fluff = pData.fluffiness || 0;
    var nails = pData.nails || 0;
    var hygiene = pData.hygiene || 0;
    var happy = pData.happiness || 0;

    var elClean = $('barClean'), txtClean = $('txtClean');
    if (elClean && txtClean) { elClean.style.width = clean + '%'; txtClean.textContent = clean + '%'; }

    var elFluff = $('barFluff'), txtFluff = $('txtFluff');
    if (elFluff && txtFluff) { elFluff.style.width = fluff + '%'; txtFluff.textContent = fluff + '%'; }

    var elNails = $('barNails'), txtNails = $('txtNails');
    if (elNails && txtNails) { elNails.style.width = nails + '%'; txtNails.textContent = nails + '%'; }

    var elHygiene = $('barHygiene'), txtHygiene = $('txtHygiene');
    if (elHygiene && txtHygiene) { elHygiene.style.width = hygiene + '%'; txtHygiene.textContent = hygiene + '%'; }

    var elHappy = $('barHappy'), txtHappy = $('txtHappy');
    if (elHappy && txtHappy) { elHappy.style.width = happy + '%'; txtHappy.textContent = happy + '%'; }
  }

  function showPetSpeech(msg) {
    var sp = $('petSpeech');
    var txt = $('petSpeechText');
    if (!sp || !txt) return;
    txt.textContent = msg;
    sp.style.display = 'flex';
    clearTimeout(sp._timer);
    sp._timer = setTimeout(function () {
      sp.style.display = 'none';
    }, 3200);
  }

  function showToast(msg) {
    var t = $('toastNotice');
    var txt = $('toastMsg');
    if (!t || !txt) return;
    txt.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.classList.remove('show');
    }, 2800);
  }

  function spawnBubbleParticle(x, y) {
    var fx = $('fxLayer');
    if (!fx) return;
    var b = document.createElement('div');
    b.className = 'bubble-particle';
    var size = 18 + Math.random() * 22;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = (x - size / 2) + 'px';
    b.style.top = (y - size / 2) + 'px';
    b.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    fx.appendChild(b);
    setTimeout(function () { b.remove(); }, 1400);
  }

  function spawnSparkleParticle(x, y) {
    var fx = $('fxLayer');
    if (!fx) return;
    var s = document.createElement('div');
    s.className = 'sparkle-particle';
    s.textContent = Math.random() > 0.5 ? '✨' : '💖';
    s.style.left = (x - 10) + 'px';
    s.style.top = (y - 10) + 'px';
    s.style.setProperty('--dx', (Math.random() * 50 - 25) + 'px');
    fx.appendChild(s);
    setTimeout(function () { s.remove(); }, 1200);
  }

  function spawnWaterSplashParticle(x, y) {
    var fx = $('fxLayer');
    if (!fx) return;
    for (var i = 0; i < 3; i++) {
      var w = document.createElement('div');
      w.className = 'bubble-particle';
      w.style.width = '12px';
      w.style.height = '12px';
      w.style.left = (x + Math.random() * 30 - 15) + 'px';
      w.style.top = (y + Math.random() * 20 - 10) + 'px';
      w.style.background = '#a2d2ff';
      w.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      fx.appendChild(w);
      setTimeout(function () { w.remove(); }, 900);
    }
  }

  function spawnSteamParticle(x, y) {
    var fx = $('fxLayer');
    if (!fx) return;
    var st = document.createElement('div');
    st.className = 'steam-particle';
    st.textContent = '☁️';
    st.style.left = (x - 12) + 'px';
    st.style.top = (y - 12) + 'px';
    st.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
    fx.appendChild(st);
    setTimeout(function () { st.remove(); }, 1600);
  }

  /* PET CAROUSEL RENDERER */
  function renderPetCarousel() {
    var car = $('petCarousel');
    if (!car) return;
    var html = '';
    Object.keys(PETS).forEach(function (id) {
      var p = PETS[id];
      var d = STATE.pets[id] || {};
      var active = (STATE.activePetId === id) ? 'active' : '';
      var status = (d.cleanliness >= 90) ? '✨ สะอาดฟู' : '🛁 ต้องการอาบน้ำ';

      html += '<div class="pet-chip ' + active + '" data-id="' + id + '">' +
        '<div class="pet-chip-avatar">' + p.avatar + '</div>' +
        '<div class="pet-chip-info">' +
          '<div class="pet-chip-name">' + p.name + '</div>' +
          '<div class="pet-chip-status">' + status + '</div>' +
        '</div>' +
      '</div>';
    });
    car.innerHTML = html;

    car.querySelectorAll('.pet-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var id = chip.dataset.id;
        window.switchPetTo(id);
      });
    });
  }

  window.switchPetTo = function (petId) {
    if (!PETS[petId]) return;
    STATE.activePetId = petId;
    Snd.play(PETS[petId].sound);
    renderPetCarousel();
    renderCurrentPet();
    updateStatsHUD();
    saveGameState();

    var msgs = PETS[petId].speech;
    var randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    showPetSpeech(randomMsg);

    // If currently on board station, update it
    if (STATE.activeStation === 'board') {
      renderPetCareBoard();
    }
  };

  /* STATION NAVIGATION */
  function switchStation(stationId) {
    STATE.activeStation = stationId;
    var tabs = document.querySelectorAll('.station-tab');
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.dataset.station === stationId);
    });

    if (stationId === 'bath') {
      STATE.activeTool = 'soap';
      initBathStation();
      renderCurrentPet();
    } else if (stationId === 'nails') {
      initNailsStation();
      renderCurrentPet();
    } else if (stationId === 'styling') {
      STATE.activeTool = 'shears';
      initStylingStation();
      renderCurrentPet();
    } else if (stationId === 'spa') {
      STATE.activeTool = 'toothbrush';
      initSpaStation();
      renderCurrentPet();
    } else if (stationId === 'photo') {
      STATE.activeTool = 'accessories';
      initPhotoStation();
      renderCurrentPet();
    } else if (stationId === 'board') {
      initBoardStation();
    }
  }

  /* EVENT LISTENERS SETUP */
  function setupEventListeners() {
    // Sound Button Toggle
    var sndBtn = $('sndBtn');
    if (sndBtn) {
      sndBtn.textContent = Snd.isEnabled() ? '🔊 เสียง' : '🔇 ปิดเสียง';
      sndBtn.addEventListener('click', function () {
        var next = !Snd.isEnabled();
        Snd.setEnabled(next);
        sndBtn.textContent = next ? '🔊 เสียง' : '🔇 ปิดเสียง';
        if (next) Snd.play('sparkle');
      });
    }

    // Station Nav Tabs
    var nav = $('stationNav');
    if (nav) {
      nav.querySelectorAll('.station-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          switchStation(tab.dataset.station);
          Snd.play('bubble');
        });
      });
    }

    // Main Pet Stage Interactive Touch / Click
    var stage = $('petStage');
    if (stage) {
      var isPointerDown = false;
      function onPointerAction(e) {
        if (STATE.activeStation === 'bath') {
          handleBathInteraction(e);
        } else if (STATE.activeStation === 'styling' && STATE.activeTool === 'brush') {
          handleBrushInteraction(e);
        } else if (STATE.activeStation === 'spa') {
          handleSpaInteraction(e);
        }
      }

      stage.addEventListener('mousedown', function (e) {
        isPointerDown = true;
        onPointerAction(e);
      });
      stage.addEventListener('mousemove', function (e) {
        if (isPointerDown) onPointerAction(e);
      });
      window.addEventListener('mouseup', function () { isPointerDown = false; });

      stage.addEventListener('touchstart', function (e) {
        isPointerDown = true;
        onPointerAction(e);
      }, { passive: true });
      stage.addEventListener('touchmove', function (e) {
        if (isPointerDown) onPointerAction(e);
      }, { passive: true });
      window.addEventListener('touchend', function () { isPointerDown = false; });
    }

    // Nail Snip Button
    var btnSnip = $('btnSnipNail');
    if (btnSnip) {
      btnSnip.addEventListener('click', handleSnipAttempt);
    }
    window.addEventListener('keydown', function (e) {
      if (e.code === 'Space' && nailGame.running) {
        e.preventDefault();
        handleSnipAttempt();
      }
    });

    // Close Modals
    var closeNail = $('closeNailModal');
    if (closeNail) closeNail.addEventListener('click', closeNailModal);

    var closePhoto = $('closePhotoModal');
    if (closePhoto) closePhoto.addEventListener('click', function () {
      $('photoModal').classList.remove('open');
    });

    // Save & Download Polaroid
    var btnSaveAlbum = $('btnSaveAlbum');
    if (btnSaveAlbum) {
      btnSaveAlbum.addEventListener('click', function () {
        var canvas = $('polaroidCanvas');
        if (canvas) {
          try {
            var dataUrl = canvas.toDataURL('image/png');
            STATE.album.push({
              petId: STATE.activePetId,
              date: Date.now(),
              dataUrl: dataUrl
            });
            saveGameState();
            showToast('💾 บันทึกรูปลงอัลบั้มเรียบร้อยแล้ว!');
          } catch (e) {}
        }
        $('photoModal').classList.remove('open');
      });
    }

    var btnDownloadPNG = $('btnDownloadPNG');
    if (btnDownloadPNG) {
      btnDownloadPNG.addEventListener('click', function () {
        var canvas = $('polaroidCanvas');
        if (canvas) {
          var a = document.createElement('a');
          a.download = 'pet-grooming-' + STATE.activePetId + '-' + Date.now() + '.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
          showToast('📥 กำลังดาวน์โหลดรูปโพลารอยด์...');
        }
      });
    }
  }

  /* INIT GAME */
  function init() {
    loadGameState();
    renderPetCarousel();
    renderCurrentPet();
    updateStatsHUD();
    updateCoinDisplay();
    setupEventListeners();
    switchStation('bath');

    // Welcome greeting
    setTimeout(function () {
      var p = PETS[STATE.activePetId];
      if (p && p.speech) {
        showPetSpeech(p.speech[0]);
      }
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
