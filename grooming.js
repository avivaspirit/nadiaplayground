/* Pet Grooming Salon — Nadia Playground (grooming.js) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ==========================================================================
     SOUND SYNTHESIZER (Native Web Audio API with Full Realistic FX)
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

        if (kind === 'bubble') {
          // Soft soap bubble pop chirp
          var osc = c.createOscillator(), g = c.createGain();
          osc.connect(g); g.connect(c.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(540 + Math.random() * 220, now);
          osc.frequency.exponentialRampToValueAtTime(1150 + Math.random() * 250, now + 0.06);
          g.gain.setValueAtTime(0.15, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (kind === 'splash' || kind === 'shower') {
          // Running water splash
          var osc2 = c.createOscillator(), g2 = c.createGain();
          osc2.connect(g2); g2.connect(c.destination);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(260 + Math.random() * 80, now);
          osc2.frequency.linearRampToValueAtTime(460, now + 0.08);
          osc2.frequency.exponentialRampToValueAtTime(140, now + 0.22);
          g2.gain.setValueAtTime(0.12, now);
          g2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          osc2.start(now);
          osc2.stop(now + 0.25);
        } else if (kind === 'dryer') {
          // Blow dryer warm air breeze hum
          var osc3 = c.createOscillator(), g3 = c.createGain();
          osc3.connect(g3); g3.connect(c.destination);
          osc3.type = 'sawtooth';
          osc3.frequency.setValueAtTime(130, now);
          osc3.frequency.linearRampToValueAtTime(155, now + 0.14);
          g3.gain.setValueAtTime(0.07, now);
          g3.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc3.start(now);
          osc3.stop(now + 0.2);
        } else if (kind === 'snip') {
          // Crisp scissor snip
          var osc4 = c.createOscillator(), g4 = c.createGain();
          osc4.connect(g4); g4.connect(c.destination);
          osc4.type = 'square';
          osc4.frequency.setValueAtTime(1550, now);
          osc4.frequency.exponentialRampToValueAtTime(260, now + 0.04);
          g4.gain.setValueAtTime(0.16, now);
          g4.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc4.start(now);
          osc4.stop(now + 0.06);
        } else if (kind === 'clipper') {
          // Electric clipper buzzing hum
          var oscC = c.createOscillator(), gC = c.createGain();
          oscC.connect(gC); gC.connect(c.destination);
          oscC.type = 'sawtooth';
          oscC.frequency.setValueAtTime(95, now);
          oscC.frequency.linearRampToValueAtTime(110, now + 0.12);
          gC.gain.setValueAtTime(0.09, now);
          gC.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          oscC.start(now);
          oscC.stop(now + 0.18);
        } else if (kind === 'duck') {
          // Squeaky rubber duck squeak
          var oscD = c.createOscillator(), gD = c.createGain();
          oscD.connect(gD); gD.connect(c.destination);
          oscD.type = 'sine';
          oscD.frequency.setValueAtTime(800, now);
          oscD.frequency.exponentialRampToValueAtTime(1600, now + 0.07);
          oscD.frequency.exponentialRampToValueAtTime(1200, now + 0.14);
          gD.gain.setValueAtTime(0.18, now);
          gD.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          oscD.start(now);
          oscD.stop(now + 0.18);
        } else if (kind === 'sparkle') {
          // Harp chime
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'sine';
            o.connect(g); g.connect(c.destination);
            o.frequency.setValueAtTime(f, now + i * 0.05);
            g.gain.setValueAtTime(0.11, now + i * 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);
            o.start(now + i * 0.05);
            o.stop(now + i * 0.05 + 0.2);
          });
        } else if (kind === 'ting') {
          // Tooth chime
          var oscT = c.createOscillator(), gT = c.createGain();
          oscT.connect(gT); gT.connect(c.destination);
          oscT.type = 'sine';
          oscT.frequency.setValueAtTime(1318.5, now);
          oscT.frequency.exponentialRampToValueAtTime(2093, now + 0.08);
          gT.gain.setValueAtTime(0.15, now);
          gT.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          oscT.start(now);
          oscT.stop(now + 0.32);
        } else if (kind === 'perfume') {
          // Floral chord
          [659.25, 880, 1174.66].forEach(function (f) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'triangle';
            o.connect(g); g.connect(c.destination);
            o.frequency.setValueAtTime(f, now);
            g.gain.setValueAtTime(0.09, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            o.start(now);
            o.stop(now + 0.42);
          });
        } else if (kind === 'shutter') {
          // Camera click
          var oscS = c.createOscillator(), gS = c.createGain();
          oscS.connect(gS); gS.connect(c.destination);
          oscS.type = 'square';
          oscS.frequency.setValueAtTime(1800, now);
          oscS.frequency.exponentialRampToValueAtTime(220, now + 0.06);
          gS.gain.setValueAtTime(0.18, now);
          gS.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          oscS.start(now);
          oscS.stop(now + 0.09);
        } else if (kind === 'bark') {
          // Cheerful puppy bark
          var oscB = c.createOscillator(), gB = c.createGain();
          oscB.connect(gB); gB.connect(c.destination);
          oscB.type = 'triangle';
          oscB.frequency.setValueAtTime(450, now);
          oscB.frequency.exponentialRampToValueAtTime(750, now + 0.05);
          oscB.frequency.exponentialRampToValueAtTime(320, now + 0.14);
          gB.gain.setValueAtTime(0.17, now);
          gB.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          oscB.start(now);
          oscB.stop(now + 0.2);
        } else if (kind === 'purr') {
          // Cat / Bunny cute purr
          var oscP = c.createOscillator(), gP = c.createGain();
          oscP.connect(gP); gP.connect(c.destination);
          oscP.type = 'sine';
          oscP.frequency.setValueAtTime(360, now);
          oscP.frequency.exponentialRampToValueAtTime(640, now + 0.08);
          gP.gain.setValueAtTime(0.13, now);
          gP.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          oscP.start(now);
          oscP.stop(now + 0.17);
        } else if (kind === 'seal') {
          // Boba Seal happy squeak
          var oscSl = c.createOscillator(), gSl = c.createGain();
          oscSl.connect(gSl); gSl.connect(c.destination);
          oscSl.type = 'sine';
          oscSl.frequency.setValueAtTime(620, now);
          oscSl.frequency.exponentialRampToValueAtTime(980, now + 0.07);
          gSl.gain.setValueAtTime(0.15, now);
          gSl.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          oscSl.start(now);
          oscSl.stop(now + 0.16);
        } else if (kind === 'sock') {
          // Sockney squishy bounce
          var oscSk = c.createOscillator(), gSk = c.createGain();
          oscSk.connect(gSk); gSk.connect(c.destination);
          oscSk.type = 'triangle';
          oscSk.frequency.setValueAtTime(330, now);
          oscSk.frequency.exponentialRampToValueAtTime(600, now + 0.06);
          oscSk.frequency.exponentialRampToValueAtTime(450, now + 0.12);
          gSk.gain.setValueAtTime(0.15, now);
          gSk.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          oscSk.start(now);
          oscSk.stop(now + 0.15);
        }
      } catch (err) {}
    }

    return { play: play, isEnabled: isEnabled, setEnabled: setEnabled };
  })();

  /* ==========================================================================
     SAVED PET LOADER & SYNC ENGINE
     ========================================================================== */
  var SAVED_PETS = [];

  function scanAllSavedPets() {
    var list = [];

    // 1. Pet Society Nadia & Mac main characters
    ['nadia', 'mac'].forEach(function (user) {
      try {
        var raw = lsGet('petsociety_save_' + user);
        if (raw) {
          var save = JSON.parse(raw);
          if (save && save.pet) {
            list.push({
              id: 'ps_' + user,
              name: (save.pet.name || 'น้องของ ' + (user === 'nadia' ? 'Nadia' : 'Mac')),
              avatar: getAvatarForSpecies(save.pet.species),
              species: save.pet.species || 'seal',
              tagline: 'สัตว์เลี้ยงคู่ใจจาก Pet Society',
              sound: getSoundForSpecies(save.pet.species),
              defaultFur: save.pet.furColor || '#fed18c',
              source: 'petsociety',
              sourceLabel: 'Pet Society (' + user + ')',
              customLook: {
                eyeShape: save.pet.eyeShape || 'boba_sparkle',
                browStyle: save.pet.browStyle || 'sweet_arcs',
                noseShape: save.pet.noseShape || 'dark_heart',
                mouthShape: save.pet.mouthShape || 'kitty_3',
                earShape: save.pet.earShape || 'species_default',
                blush: save.pet.blush || 'circles',
                emotion: save.pet.emotion || 'happy',
                furColor: save.pet.furColor || '#fed18c',
                clothes: save.pet.clothes || {}
              },
              speech: ['ดีใจจังที่พาหนูมาสปา!', 'สบายตัวที่สุดเลยย~', 'รัก Nadia จังเลย!', 'หอมสดชื่นแล้วฮะ!']
            });
          }
        }
      } catch (e) {}
    });

    // 2. Dogney current & saved looks
    try {
      var dogOutfit = lsGet('dogney_outfit_v1');
      var dogSaved = lsGet('dogney_saved_looks_v1');
      var parsedDogOutfit = dogOutfit ? JSON.parse(dogOutfit) : null;
      list.push({
        id: 'saved_dogney_current',
        name: 'Dogney Pup (ลุคปัจจุบัน)',
        avatar: '🐶',
        species: 'dog',
        tagline: 'ลูกหมาโกลเด้นแต่งหน้าคิ้วท์จาก dogney.html',
        sound: 'bark',
        defaultFur: '#fed18c',
        source: 'dogney',
        sourceLabel: 'Dogney Pup',
        customLook: parsedDogOutfit || {
          eyes: 'golden_boba', brows: 'puppy_dots', nose: 'glossy_black',
          mouth: 'sweet_3', ears: 'golden_floppy', blush: 'rosy_airbrush', emotion: 'happy'
        },
        speech: ['โฮ่งๆ ขนหนูนุ่มไหมฮะ!', 'เกาพุงให้หนูด้วยน้า~', 'ชอบอาบน้ำที่สุดเลย!', 'สดชื่นวิ้งๆ เลยฮะ!']
      });

      if (dogSaved) {
        var arr = JSON.parse(dogSaved);
        if (Array.isArray(arr)) {
          arr.slice(0, 3).forEach(function (lk, i) {
            list.push({
              id: 'saved_dogney_' + lk.id,
              name: lk.name || ('Dogney ลุคที่ ' + (i + 1)),
              avatar: '🐶',
              species: 'dog',
              tagline: 'ลุคบันทึกไว้จาก Dogney Pup',
              sound: 'bark',
              defaultFur: '#fed18c',
              source: 'dogney',
              sourceLabel: 'Dogney Saved',
              customLook: lk.outfit,
              speech: ['โฮ่ง! จำลุคนี้ได้ไหมฮะ', 'สบายตัวจังเลยย!', 'พร้อมไปวิ่งเล่นแล้ว!']
            });
          });
        }
      }
    } catch (e) {}

    // 3. Boba Seal current & saved looks
    try {
      var bobaLook = lsGet('boba_custom_look_v1');
      var bobaSaved = lsGet('boba_saved_looks_v1');
      var parsedBoba = bobaLook ? JSON.parse(bobaLook) : null;
      list.push({
        id: 'saved_boba_current',
        name: 'Boba Seal (ลุคปัจจุบัน)',
        avatar: '🦭',
        species: 'seal',
        tagline: 'แมวน้ำโบโบ้ตาดำมุกแท้จาก seal.html',
        sound: 'seal',
        defaultFur: '#e8f2f9',
        source: 'boba',
        sourceLabel: 'Boba Seal',
        customLook: parsedBoba || {
          eyes: 'boba_pearl', brows: 'sweet_arcs', nose: 'heart_dark',
          mouth: 'kitty_3', flippers: 'classic_flipper', blush: 'airbrush_rosy', emotion: 'happy'
        },
        speech: ['งุ้ยย~ ฟองสบู่นุ่มจัง', 'โบโบ้ตัวหอมแล้วนะ!', 'แปรงฟันแล้วฟันวิ้งๆ', 'อยากแช่น้ำอุ่นทั้งวันเลย']
      });

      if (bobaSaved) {
        var arrB = JSON.parse(bobaSaved);
        if (Array.isArray(arrB)) {
          arrB.slice(0, 3).forEach(function (lk, i) {
            list.push({
              id: 'saved_boba_' + lk.id,
              name: lk.name || ('Boba ลุคที่ ' + (i + 1)),
              avatar: '🦭',
              species: 'seal',
              tagline: 'ลุคบันทึกไว้จาก Boba Seal',
              sound: 'seal',
              defaultFur: '#e8f2f9',
              source: 'boba',
              sourceLabel: 'Boba Saved',
              customLook: lk.outfit,
              speech: ['อุ๋งๆ สบายตัวจัง!', 'หอมกลิ่นดอกไม้มากเลย', 'รักการสปาที่สุด!']
            });
          });
        }
      }
    } catch (e) {}

    // 4. Sockney current & saved looks
    try {
      var sockWardrobe = lsGet('sockney_wardrobe_v1');
      var sockSaved = lsGet('sockney_saved_looks_v1');
      var parsedSock = sockWardrobe ? JSON.parse(sockWardrobe) : null;
      list.push({
        id: 'saved_sockney_current',
        name: 'Sockney Plush (ลุคปัจจุบัน)',
        avatar: '🧦',
        species: 'sock',
        tagline: 'น้องถุงเท้านุ่มฟูสไตล์ Sanrio จาก sockney.html',
        sound: 'sock',
        defaultFur: '#ffb4d6',
        source: 'sockney',
        sourceLabel: 'Sockney Plush',
        customLook: parsedSock || {
          eyes: 'kawaii_sparkle', brows: 'soft_dots', nose: 'pink_button',
          mouth: 'kitty_3', ears: 'ribbed_cuff', blush: 'rosy_glow', emotion: 'cheerful'
        },
        speech: ['ปุ๊กปิ๊กที่สุดเลยย~', 'ขนนุ่มเหมือนสายไหมแล้ว!', 'ตัดเล็บไม่เจ็บเลย เก่งมาก!', 'พร้อมถ่ายรูปแล้วจ้า~']
      });
    } catch (e) {}

    // 5. Puffy Cat current & saved looks
    try {
      var puffyOutfit = lsGet('puffy_outfit_v1');
      var parsedPuffy = puffyOutfit ? JSON.parse(puffyOutfit) : null;
      list.push({
        id: 'saved_puffy_current',
        name: 'Puffy Cat (ลุคปัจจุบัน)',
        avatar: '🐱',
        species: 'cat',
        tagline: 'น้องแมวพัฟฟี่ส้มตากลมหวานจาก puffy.html',
        sound: 'purr',
        defaultFur: '#ffecd1',
        source: 'puffy',
        sourceLabel: 'Puffy Cat',
        customLook: parsedPuffy || {
          eyes: 'cat_round', brows: 'ginger_dots', nose: 'pink_triangle',
          mouth: 'cat_3', ears: 'ginger_kitty', blush: 'soft_pink', emotion: 'happy'
        },
        speech: ['เหมียวว~ สบายจนเคลิ้ม', 'ขนฟูนุ่มนิ่มน่ากอดที่สุด', 'รักกรูมเมอร์ที่สุดเลย!', 'ตัวหอมแล้วนะเหมียว~']
      });
    } catch (e) {}

    SAVED_PETS = list;
    return list;
  }

  function getAvatarForSpecies(sp) {
    if (sp === 'seal') return '🦭';
    if (sp === 'dog') return '🐶';
    if (sp === 'cat' || sp === 'kitty') return '🐱';
    if (sp === 'sock') return '🧦';
    if (sp === 'bunny') return '🐰';
    if (sp === 'bear') return '🧸';
    if (sp === 'panda') return '🐼';
    if (sp === 'penguin') return '🐧';
    return '🐾';
  }

  function getSoundForSpecies(sp) {
    if (sp === 'seal') return 'seal';
    if (sp === 'dog') return 'bark';
    if (sp === 'sock') return 'sock';
    if (sp === 'cat' || sp === 'kitty' || sp === 'bunny') return 'purr';
    return 'sparkle';
  }

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
    puffy: {
      id: 'puffy',
      name: 'น้องแมว Puffy Cat',
      avatar: '🐱',
      species: 'cat',
      tagline: 'น้องแมวพัฟฟี่ส้มตากลมหวาน อ้อนเก่ง',
      sound: 'purr',
      defaultFur: '#ffecd1',
      speech: ['เหมียวว~ สบายจนเคลิ้ม', 'ขนฟูนุ่มนิ่มน่ากอดที่สุด', 'รักกรูมเมอร์ที่สุดเลย!', 'ตัวหอมแล้วนะเหมียว~']
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
    }
  };

  /* MOTION MODES & STYLING PRESETS */
  var SHOWER_MOTIONS = [
    { id: 'gentle', name: '🚿 สายน้ำอุ่นละมุน (Gentle Stream)' },
    { id: 'jet', name: '🫧 ไมโครบับเบิ้ลสปา (Micro-Bubble Jet)' },
    { id: 'rainbow', name: '🌈 เรนโบว์มิสต์ (Rainbow Mist)' }
  ];

  var SOAP_SCENTS = [
    { id: 'strawberry', name: '🍓 สตรอว์เบอร์รีฟองฟู (Sweet Foam)', color: '#ffafcc' },
    { id: 'honey', name: '🍯 ฮันนี่โอ๊ตมิลค์ (Honey Oat Sensitive)', color: '#ffd166' },
    { id: 'sakura', name: '🌸 ซากุระบลอสซั่ม (Sakura Blossom)', color: '#ffccd5' },
    { id: 'mint', name: '🍃 คูลลิ่งมินต์สปา (Fresh Mint)', color: '#b7e4c7' }
  ];

  var DRYER_MOTIONS = [
    { id: 'warm', name: '🍃 ลมอุ่นเบาๆ (Cozy Warm)' },
    { id: 'breeze', name: '💨 ลมเป่าจัดทรง (Styling Breeze)' },
    { id: 'ionic', name: '✨ ไอออนขนฟูวิ้ง (Max Fluff Ionic)' }
  ];

  var FUR_STYLES = [
    { id: 'teddy', name: '🧸 ทรงหมีเท็ดดี้ (Teddy Bear Cut)' },
    { id: 'cloud', name: '☁️ ทรงก้อนเมฆ (Fluffy Cloud)' },
    { id: 'lion', name: '🦁 ทรงสิงโตพรีเมียม (Royal Lion Mane)' },
    { id: 'puppy', name: '🎀 ทรงเล็มหน้าหวาน (Puppy Face Trim)' },
    { id: 'heart', name: '💖 ทรงหัวใจก้นฟู (Heart Pompom)' }
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
    showerMotion: 'gentle',
    soapScent: 'strawberry',
    dryerMotion: 'ionic',
    coins: 250,
    pets: {},
    album: [],
    selectedBackdrop: 'spa'
  };

  function loadGameState() {
    scanAllSavedPets();

    var raw = lsGet('pet_grooming_state_v1');
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.pets) {
          STATE.pets = parsed.pets;
          STATE.coins = typeof parsed.coins === 'number' ? parsed.coins : 250;
          STATE.album = Array.isArray(parsed.album) ? parsed.album : [];
          if (parsed.activePetId) {
            STATE.activePetId = parsed.activePetId;
          }
        }
      } catch (e) {}
    }

    // Merge saved pets into PETS dictionary
    SAVED_PETS.forEach(function (sp) {
      if (!PETS[sp.id]) {
        PETS[sp.id] = sp;
      }
    });

    // Ensure all pets have a state
    Object.keys(PETS).forEach(function (id) {
      if (!STATE.pets[id]) {
        STATE.pets[id] = {
          cleanliness: 45,
          fluffiness: 50,
          nails: 30,
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

  function getPetCurrentData() {
    return STATE.pets[STATE.activePetId] || {};
  }

  /* ==========================================================================
     SVG PET & LUXURY BATHTUB RENDERING ENGINE
     ========================================================================== */
  function renderPetSVG(opts) {
    opts = opts || {};
    var pDef = PETS[STATE.activePetId] || PETS.dogney;
    var pData = getPetCurrentData();
    var custom = pDef.customLook || {};

    var mood = opts.mood || (pData.happiness > 80 ? 'happy' : 'cozy');
    var isDirty = (pData.cleanliness || 0) < 90;
    var bubbles = pData.bubblesLevel || 0;
    var isFluffy = (pData.fluffiness || 0) >= 80;
    var isBathStation = (STATE.activeStation === 'bath');

    var furColorChoice = FUR_COLORS.find(function (c) { return c.id === pData.furColor; });
    var furColor = (furColorChoice && furColorChoice.hex) ? furColorChoice.hex : (custom.furColor || pDef.defaultFur);

    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -100 260 220" style="display:block;width:100%;height:100%">';

    // Defs & Gradients
    s += '<defs>';
    s += '<radialGradient id="blushGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff70a6" stop-opacity="0.65"/><stop offset="100%" stop-color="#ff70a6" stop-opacity="0"/></radialGradient>';
    s += '<linearGradient id="bubbleShine" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="rgba(255,255,255,0.95)"/><stop offset="40%" stop-color="rgba(162,210,255,0.55)"/><stop offset="100%" stop-color="rgba(255,182,193,0.65)"/></linearGradient>';
    s += '<linearGradient id="goldLegGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff275"/><stop offset="50%" stop-color="#ffd166"/><stop offset="100%" stop-color="#b58300"/></linearGradient>';
    s += '<linearGradient id="tubCeramic" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#fff0f5"/><stop offset="100%" stop-color="#f8d7da"/></linearGradient>';
    s += '<linearGradient id="bathWater" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="rgba(162,210,255,0.65)"/><stop offset="50%" stop-color="rgba(178,247,239,0.7)"/><stop offset="100%" stop-color="rgba(162,210,255,0.65)"/></linearGradient>';
    s += '<filter id="softGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>';
    s += '</defs>';

    // STATION 1: LUXURY BATHTUB BACK
    if (isBathStation) {
      // Bathtub shadow
      s += '<ellipse cx="0" cy="98" rx="88" ry="14" fill="rgba(60,30,60,0.12)"/>';
      // Golden claw feet (Back)
      s += '<path d="M -68 85 Q -76 100 -66 102 Q -60 100 -60 88 Z" fill="url(#goldLegGrad)" stroke="#8c6200" stroke-width="1.6"/>';
      s += '<path d="M 68 85 Q 76 100 66 102 Q 60 100 60 88 Z" fill="url(#goldLegGrad)" stroke="#8c6200" stroke-width="1.6"/>';
      // Bathtub back rim (pink porcelain inside)
      s += '<ellipse cx="0" cy="45" rx="84" ry="24" fill="#ffd1dc" stroke="#e0a1b2" stroke-width="2.5"/>';
      // Warm water layer
      s += '<ellipse cx="0" cy="47" rx="80" ry="20" fill="url(#bathWater)"/>';
      // Animated water ripples
      s += '<path d="M -60 46 Q -30 42 0 46 Q 30 50 60 46" stroke="rgba(255,255,255,0.8)" stroke-width="2" fill="none" stroke-linecap="round"/>';
    } else {
      // Standard cushion shadow
      s += '<ellipse cx="0" cy="85" rx="66" ry="12" fill="rgba(60,30,60,0.12)"/>';
      // Plush salon cushion
      s += '<ellipse cx="0" cy="80" rx="72" ry="15" fill="#fff0f5" stroke="#ffccd5" stroke-width="2.6"/>';
      s += '<path d="M -60 80 Q 0 86 60 80" stroke="#ffafcc" stroke-width="2" fill="none"/>';
    }

    // PET BODY (Sits inside tub if bath station)
    var petOffsetY = isBathStation ? 10 : 0;
    s += '<g transform="translate(0,' + petOffsetY + ')">';

    if (pDef.species === 'dog') {
      s += drawDogney(furColor, isFluffy, pData.furStyle, isBathStation);
    } else if (pDef.species === 'seal') {
      s += drawBobaSeal(furColor, isFluffy, pData.furStyle, isBathStation);
    } else if (pDef.species === 'sock') {
      s += drawSockney(furColor, isFluffy, pData.furStyle, isBathStation);
    } else if (pDef.species === 'cat' || pDef.species === 'kitty') {
      s += drawKitty(furColor, isFluffy, pData.furStyle, isBathStation);
    } else {
      s += drawBunny(furColor, isFluffy, pData.furStyle, isBathStation);
    }

    // Dynamic Face Features (Linked with Saved Look)
    s += drawFaceFeatures(pDef, pData, mood, custom);

    // Dirt spots (when dirty)
    if (isDirty && Array.isArray(pData.dirtSpots)) {
      s += '<g id="dirtSpotsGroup">';
      pData.dirtSpots.forEach(function (spot, idx) {
        if (!spot.clean) {
          s += drawDirtSpot(spot, idx);
        }
      });
      s += '</g>';
    }

    // Accessory Overlay (only outside bath)
    if (!isBathStation && pData.accessory && pData.accessory !== 'none') {
      s += drawAccessory(pData.accessory);
    }

    s += '</g>'; // end pet group

    // STATION 1: LUXURY BATHTUB FRONT (Pet sits inside!)
    if (isBathStation) {
      // Front ceramic tub wall
      s += '<path d="M -85 45 C -88 78, -65 95, 0 95 C 65 95, 88 78, 85 45 C 50 54, -50 54, -85 45 Z" fill="url(#tubCeramic)" stroke="#e0a1b2" stroke-width="2.8"/>';
      // Front golden claw feet
      s += '<path d="M -54 90 Q -62 106 -52 108 Q -44 106 -46 92 Z" fill="url(#goldLegGrad)" stroke="#8c6200" stroke-width="2"/>';
      s += '<path d="M 54 90 Q 62 106 52 108 Q 44 106 46 92 Z" fill="url(#goldLegGrad)" stroke="#8c6200" stroke-width="2"/>';
      // Golden Faucet with animated water drip
      s += '<g transform="translate(68,18)">' +
           '<path d="M 0 35 L 0 5 C 0 -12, -18 -12, -18 -4" fill="none" stroke="url(#goldLegGrad)" stroke-width="5" stroke-linecap="round"/>' +
           '<ellipse cx="-18" cy="-3" rx="4" ry="2.5" fill="#8c6200"/>' +
           '<circle cx="-18" cy="8" r="2" fill="#a2d2ff" opacity="0.8"/>' +
           '</g>';

      // Interactive Squeaky Rubber Duckie 🐥
      s += '<g class="rubber-duck" id="rubberDuckElem" transform="translate(-56,38)" style="cursor:pointer" onclick="window.squeakDuck()">';
      s += '<ellipse cx="0" cy="6" rx="14" ry="10" fill="#ffd166" stroke="#d4a373" stroke-width="1.8"/>';
      s += '<circle cx="-6" cy="-2" r="8" fill="#ffd166" stroke="#d4a373" stroke-width="1.8"/>';
      s += '<polygon points="-14,-2 -22,0 -14,3" fill="#ff70a6"/>';
      s += '<circle cx="-8" cy="-4" r="1.5" fill="#2c1b18"/>';
      s += '</g>';

      // Cute pet paws resting on tub rim
      s += '<ellipse cx="-24" cy="50" rx="9" ry="6" fill="' + furColor + '" stroke="#2c1b18" stroke-width="2"/>';
      s += '<ellipse cx="24" cy="50" rx="9" ry="6" fill="' + furColor + '" stroke="#2c1b18" stroke-width="2"/>';
    }

    // Bubbles Layer (When lathering)
    if (bubbles > 0) {
      s += drawBubblesOverlay(bubbles, isBathStation);
    }

    // Shower stream active overlay
    if (isBathStation && STATE.activeTool === 'shower') {
      s += drawShowerStreamRays();
    }

    // Perfume / Fresh Sparkle Aura
    if (pData.perfumed || (pData.cleanliness >= 95 && pData.fluffiness >= 95)) {
      s += drawFreshSparkles();
    }

    s += '</svg>';
    return s;
  }

  /* SPECIES 1: DOGNEY PUP */
  function drawDogney(cFur, isFluffy, style, inBath) {
    var cInk = '#2c1b18', cWhite = '#fff9f0';
    var s = '';

    if (!inBath) {
      // Wagging tail
      s += '<g class="wagTail" style="animation:tailWag 0.3s ease-in-out infinite;transform-origin:30px 48px">';
      s += '<path d="M 28 44 Q 60 22 62 0 Q 56 18 36 50 Z" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
      s += '</g>';

      // Body & paws
      s += '<ellipse cx="0" cy="46" rx="42" ry="32" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
      s += '<ellipse cx="0" cy="48" rx="24" ry="20" fill="' + cWhite + '"/>';
      s += '<ellipse cx="-24" cy="70" rx="12" ry="8" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.4"/>';
      s += '<ellipse cx="24" cy="70" rx="12" ry="8" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.4"/>';
    } else {
      // Upper chest in water
      s += '<ellipse cx="0" cy="38" rx="38" ry="24" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.4"/>';
      s += '<ellipse cx="0" cy="40" rx="20" ry="14" fill="' + cWhite + '"/>';
    }

    // Head
    s += '<ellipse cx="0" cy="6" rx="46" ry="38" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.8"/>';

    // Floppy Ears
    s += '<ellipse cx="-42" cy="-4" rx="15" ry="30" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6" transform="rotate(22 -42 -4)"/>';
    s += '<ellipse cx="42" cy="-4" rx="15" ry="30" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6" transform="rotate(-22 42 -4)"/>';

    // White snout patch
    s += '<ellipse cx="0" cy="18" rx="20" ry="15" fill="' + cWhite + '"/>';
    return s;
  }

  /* SPECIES 2: BOBA SEAL */
  function drawBobaSeal(cFur, isFluffy, style, inBath) {
    var cLine = '#7b9cb8', cWhite = '#ffffff';
    var s = '';

    if (!inBath) {
      // Flippers
      s += '<path d="M -26 60 C -52 68, -70 54, -58 38 C -48 50, -28 52, -14 50 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.6"/>';
      s += '<path d="M 26 60 C 52 68, 70 54, 58 38 C 48 50, 28 52, 14 50 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.6"/>';
      s += '<path d="M -62 26 C -74 54, -64 78, 0 80 C 64 78, 74 54, 62 26 C 54 8, -54 8, -62 26 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.8"/>';
    }

    // Round Head
    s += '<path d="M -54 -2 C -58 -32, 58 -32, 54 -2 C 58 28, -58 28, -54 -2 Z" fill="' + cFur + '" stroke="' + cLine + '" stroke-width="2.8"/>';
    // White heart muzzle patch (Authentic Boba Signature)
    s += '<path d="M 0 -2 C -18 -18, -36 4, -14 18 C -4 24, 0 25, 0 25 C 0 25, 4 24, 14 18 C 36 4, 18 -18, 0 -2 Z" fill="' + cWhite + '" stroke="#b5cde0" stroke-width="1.8"/>';

    // Whisker pads
    s += '<path d="M -26 12 Q -42 10 -52 8 M -26 16 Q -42 18 -50 21 M 26 12 Q 42 10 52 8 M 26 16 Q 42 18 50 21" stroke="' + cLine + '" stroke-width="1.8" stroke-linecap="round" fill="none"/>';
    return s;
  }

  /* SPECIES 3: SOCKNEY PLUSH */
  function drawSockney(cFur, isFluffy, style, inBath) {
    var cPink = '#ff70a6', cCyan = '#a0e7e5', cYellow = '#ffd166';
    var s = '';

    if (!inBath) {
      s += '<ellipse cx="-26" cy="44" rx="16" ry="12" fill="' + cPink + '" stroke="#c94b7a" stroke-width="2.4"/>';
      s += '<ellipse cx="0" cy="40" rx="38" ry="30" fill="' + cFur + '" stroke="#e08bb2" stroke-width="2.8"/>';
      s += '<path d="M -32 30 Q 0 38 32 30 L 32 38 Q 0 46 -32 38 Z" fill="' + cCyan + '"/>';
      s += '<path d="M -30 42 Q 0 50 30 42 L 30 50 Q 0 58 -30 50 Z" fill="' + cYellow + '"/>';
    }

    // Sock Head
    s += '<ellipse cx="0" cy="-2" rx="42" ry="34" fill="' + cFur + '" stroke="#e08bb2" stroke-width="2.8"/>';
    // Ribbed Cuff & pompom
    s += '<rect x="-30" y="-42" width="60" height="18" rx="9" fill="' + cPink + '" stroke="#c94b7a" stroke-width="2.4"/>';
    s += '<path d="M -20 -40 L -20 -28 M -10 -40 L -10 -28 M 0 -40 L 0 -28 M 10 -40 L 10 -28 M 20 -40 L 20 -28" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/>';
    s += '<circle cx="0" cy="-44" r="7" fill="' + cYellow + '" stroke="#d4a373" stroke-width="1.8"/>';
    return s;
  }

  /* SPECIES 4: PUFFY CAT */
  function drawKitty(cFur, isFluffy, style, inBath) {
    var cInk = '#2c1b18', cPinkInner = '#ffccd5';
    var s = '';

    if (!inBath) {
      s += '<ellipse cx="0" cy="46" rx="40" ry="30" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
      s += '<ellipse cx="0" cy="48" rx="22" ry="18" fill="#fff5ea"/>';
      s += '<ellipse cx="-22" cy="68" rx="11" ry="7.5" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
      s += '<ellipse cx="22" cy="68" rx="11" ry="7.5" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.2"/>';
    }

    // Pointy Triangle Ears
    s += '<polygon points="-42,0 -16,-34 -12,2" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '<polygon points="-36,-2 -18,-28 -15,0" fill="' + cPinkInner + '"/>';
    s += '<polygon points="42,0 16,-34 12,2" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
    s += '<polygon points="36,-2 18,-28 15,0" fill="' + cPinkInner + '"/>';

    // Head
    s += '<ellipse cx="0" cy="6" rx="45" ry="35" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.8"/>';
    // Whiskers
    s += '<path d="M -24 14 L -44 10 M -24 18 L -42 22 M 24 14 L 44 10 M 24 18 L 42 22" stroke="' + cInk + '" stroke-width="1.6" stroke-linecap="round"/>';
    return s;
  }

  /* SPECIES 5: BUNNY */
  function drawBunny(cFur, isFluffy, style, inBath) {
    var cInk = '#2c1b18', cPinkInner = '#ffccd5';
    var s = '';

    if (!inBath) {
      s += '<ellipse cx="0" cy="46" rx="40" ry="32" fill="' + cFur + '" stroke="' + cInk + '" stroke-width="2.6"/>';
      s += '<ellipse cx="0" cy="48" rx="22" ry="18" fill="#ffffff"/>';
    }

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
    return s;
  }

  /* DYNAMIC FACE & MOOD RENDERING WITH CUSTOM LOOK INTEGRATION */
  function drawFaceFeatures(pDef, pData, mood, custom) {
    var cInk = '#1b222c';
    var s = '';

    var eyeShape = custom.eyes || custom.eyeShape || 'boba_pearl';
    var browStyle = custom.brows || custom.browStyle || 'sweet_arcs';
    var noseShape = custom.nose || custom.noseShape || (pDef.species === 'seal' ? 'heart_dark' : 'pink_oval');
    var mouthShape = custom.mouth || custom.mouthShape || 'kitty_3';

    // 1. EYEBROWS
    var browColor = (pDef.species === 'seal') ? '#7b9cb8' : '#2b2d42';
    if (browStyle === 'soft_dots' || browStyle === 'puppy_dots') {
      s += '<circle cx="-20" cy="-14" r="2.4" fill="' + browColor + '"/>';
      s += '<circle cx="20" cy="-14" r="2.4" fill="' + browColor + '"/>';
    } else if (browStyle === 'sweet_arcs' || browStyle === 'sweet_curves') {
      s += '<path d="M -26 -13 Q -20 -18 -14 -13" stroke="' + browColor + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
      s += '<path d="M 14 -13 Q 20 -18 26 -13" stroke="' + browColor + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
    } else if (browStyle === 'slant_innocent') {
      s += '<path d="M -26 -12 L -15 -16" stroke="' + browColor + '" stroke-width="2.2" stroke-linecap="round"/>';
      s += '<path d="M 26 -12 L 15 -16" stroke="' + browColor + '" stroke-width="2.2" stroke-linecap="round"/>';
    } else if (browStyle === 'bold_happy') {
      s += '<path d="M -26 -13 Q -20 -20 -14 -13" stroke="' + browColor + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
      s += '<path d="M 14 -13 Q 20 -20 26 -13" stroke="' + browColor + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
    }

    // 2. EYES
    if (mood === 'sleepy' || eyeShape === 'sleepy') {
      s += '<path d="M -28 4 Q -20 -4 -12 4" stroke="' + cInk + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
      s += '<path d="M 12 4 Q 20 -4 28 4" stroke="' + cInk + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
    } else if (eyeShape === 'wink') {
      s += '<ellipse cx="-20" cy="2" rx="10.5" ry="12.5" fill="' + cInk + '"/>';
      s += '<ellipse cx="-23.5" cy="-2.5" rx="4.2" ry="4.5" fill="#ffffff"/>';
      s += '<circle cx="-16" cy="5.5" r="2.2" fill="#ffffff"/>';
      s += '<path d="M 12 4 Q 20 -4 28 4" stroke="' + cInk + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
    } else if (eyeShape === 'heart_eyes' || eyeShape === 'ruby_heart') {
      s += '<path d="M -20 2 C -24 -4 -30 2 -20 10 C -10 2 -16 -4 -20 2 Z" fill="#ff2a6d" stroke="' + cInk + '" stroke-width="1.8"/>';
      s += '<path d="M 20 2 C 16 -4 10 2 20 10 C 30 2 24 -4 20 2 Z" fill="#ff2a6d" stroke="' + cInk + '" stroke-width="1.8"/>';
    } else {
      // AUTHENTIC BOBA PEARL / KAWAII SPARKLE EYES
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

    // 3. NOSE
    if (noseShape === 'heart_dark' || noseShape === 'dark_heart') {
      s += '<path d="M 0 10 C -8 3, -12 12, 0 19 C 12 12, 8 3, 0 10 Z" fill="' + cInk + '"/>';
      s += '<circle cx="-2" cy="12" r="1.2" fill="#fff"/>';
    } else if (noseShape === 'glossy_black') {
      s += '<ellipse cx="0" cy="13" rx="7" ry="5" fill="' + cInk + '"/>';
      s += '<ellipse cx="-2" cy="11.5" rx="2" ry="1.2" fill="#fff"/>';
    } else {
      s += '<ellipse cx="0" cy="13" rx="4.5" ry="3.2" fill="#ff70a6"/>';
      s += '<circle cx="-1.5" cy="12" r="1" fill="#fff"/>';
    }

    // 4. BLUSHING CHEEKS
    s += '<circle cx="-34" cy="14" r="8.5" fill="url(#blushGlow)"/>';
    s += '<circle cx="34" cy="14" r="8.5" fill="url(#blushGlow)"/>';

    // 5. CUTE MOUTH
    if (mouthShape === 'happy_open' || (pData.happiness > 85)) {
      s += '<path d="M -9 20 C -9 29, 9 29, 9 20 Z" fill="#e05375" stroke="' + cInk + '" stroke-width="2"/>';
      s += '<path d="M -5 24 Q 0 27 5 24 Z" fill="#ff9ebb"/>';
      s += '<path d="M -9 20 Q 0 16 9 20" stroke="' + cInk + '" stroke-width="2" fill="none"/>';
    } else if (mouthShape === 'blep') {
      s += '<path d="M -7 20 Q 0 24 7 20" stroke="' + cInk + '" stroke-width="2.2" fill="none"/>';
      s += '<path d="M -3 21 C -3 28, 3 28, 3 21 Z" fill="#ff70a6" stroke="' + cInk + '" stroke-width="1.5"/>';
    } else if (mouthShape === 'smile') {
      s += '<path d="M -8 19 Q 0 27 8 19" stroke="' + cInk + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>';
    } else {
      // Kitty :3 smile
      s += '<path d="M -7 20 Q -3.5 24 0 20 Q 3.5 24 7 20" stroke="' + cInk + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>';
    }

    return s;
  }

  /* BUBBLES LAYER OVERLAY */
  function drawBubblesOverlay(level, inBath) {
    var s = '<g class="bubbles-overlay">';
    var bubbleCoords = [
      { x: -20, y: 15, r: 14 },
      { x: 18, y: 22, r: 16 },
      { x: 0, y: 35, r: 18 },
      { x: -30, y: -10, r: 12 },
      { x: 28, y: -8, r: 13 },
      { x: -8, y: -25, r: 15 },
      { x: 12, y: -24, r: 14 }
    ];
    if (inBath) {
      bubbleCoords.push({ x: -45, y: 45, r: 16 }, { x: 45, y: 45, r: 16 }, { x: -60, y: 40, r: 12 }, { x: 60, y: 40, r: 12 });
    }
    var count = Math.min(bubbleCoords.length, Math.ceil(level / 10));
    for (var i = 0; i < count; i++) {
      var b = bubbleCoords[i];
      s += '<circle cx="' + b.x + '" cy="' + b.y + '" r="' + b.r + '" fill="url(#bubbleShine)" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"/>';
      s += '<circle cx="' + (b.x - b.r * 0.35) + '" cy="' + (b.y - b.r * 0.35) + '" r="' + (b.r * 0.25) + '" fill="#ffffff" opacity="0.85"/>';
    }
    s += '</g>';
    return s;
  }

  /* ANIMATED WATER SHOWER SPRAY RAYS */
  function drawShowerStreamRays() {
    var s = '<g class="shower-stream-rays" style="opacity:0.85">';
    var motion = STATE.showerMotion;
    var rayColor = (motion === 'rainbow') ? 'url(#rainbowGrad)' : (motion === 'jet' ? '#b2f7ef' : '#a2d2ff');

    if (motion === 'rainbow') {
      s += '<defs><linearGradient id="rainbowGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff9ebb"/><stop offset="50%" stop-color="#ffd166"/><stop offset="100%" stop-color="#a2d2ff"/></linearGradient></defs>';
    }

    for (var i = -30; i <= 30; i += 12) {
      s += '<line x1="' + i + '" y1="-70" x2="' + (i * 1.5) + '" y2="50" stroke="' + rayColor + '" stroke-width="2.5" stroke-dasharray="8 6" stroke-linecap="round"/>';
    }
    s += '</g>';
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

  /* DIRT SPOTS RENDERING */
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
      s += '<path d="M -12 -2 C -15 -8, -6 -14, 0 -10 C 6 -14, 15 -8, 12 -1 C 16 6, 8 13, 0 11 C -8 13, -16 6, -12 -2 Z" fill="#795548" stroke="#5d4037" stroke-width="1.6" opacity="0.88"/>';
    }
    s += '<circle cx="0" cy="0" r="24" fill="transparent"/>';
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

  /* INTERACTIVE SQUEAKY DUCK ACTION */
  window.squeakDuck = function () {
    Snd.play('duck');
    var duck = $('rubberDuckElem');
    if (duck) {
      duck.style.transform = 'translate(-56,34) scale(1.18) rotate(-10deg)';
      setTimeout(function () {
        duck.style.transform = 'translate(-56,38) scale(1)';
      }, 200);
    }
    spawnSparkleParticle(160, 240);
    showToast('🐥 ปี๊บๆ! เจ้าเป็ดส่งเสียงทักทาย น้องอารมณ์ดีขึ้นทันที');
    var p = getPetCurrentData();
    p.happiness = Math.min(100, (p.happiness || 50) + 5);
    updateStatsHUD();
  };

  /* ==========================================================================
     STATION 1: BUBBLE BATH & SPA (อาบน้ำฟองสบู่)
     ========================================================================== */
  function initBathStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    var motionLabel = $('motionTitleLabel');

    if (dockInstruction) dockInstruction.textContent = '🧼 เลือกสบู่ถูฟองนุ่ม ใช้ฝักบัวล้างตัวในอ่างขาทอง แล้วเป่าไดร์ให้ขนฟู!';

    toolList.innerHTML =
      '<button class="tool-btn ' + (STATE.activeTool === 'soap' ? 'active' : '') + '" data-tool="soap">' +
        '<span class="tool-icon">🧼</span>' +
        '<span>สบู่สปาฟองฟู</span>' +
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
        updateBathSubOptions();
        renderCurrentPet();
      });
    });

    updateBathSubOptions();
  }

  function updateBathSubOptions() {
    var subBar = $('subOptionsBar');
    var motionLabel = $('motionTitleLabel');
    if (!subBar) return;

    var tool = STATE.activeTool;
    subBar.style.display = 'flex';
    if (motionLabel) motionLabel.style.display = 'flex';

    var html = '';
    if (tool === 'soap') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '🧼 เลือกกลิ่นสบู่ & เนื้อฟองสปา:';
      SOAP_SCENTS.forEach(function (sc) {
        var active = (STATE.soapScent === sc.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-soap="' + sc.id + '">' + sc.name + '</button>';
      });
    } else if (tool === 'shower') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '🚿 เลือกโหมดสายน้ำฝักบัว (Spray Motion):';
      SHOWER_MOTIONS.forEach(function (sh) {
        var active = (STATE.showerMotion === sh.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-shower="' + sh.id + '">' + sh.name + '</button>';
      });
    } else if (tool === 'dryer') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '💨 เลือกระดับความแรงลม & ไอออน:';
      DRYER_MOTIONS.forEach(function (dm) {
        var active = (STATE.dryerMotion === dm.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-dryer="' + dm.id + '">' + dm.name + '</button>';
      });
    }

    subBar.innerHTML = html;

    subBar.querySelectorAll('.sub-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (tool === 'soap') {
          STATE.soapScent = chip.dataset.soap;
          Snd.play('bubble');
          showToast('🧼 เปลี่ยนสบู่เป็น ' + chip.textContent);
        } else if (tool === 'shower') {
          STATE.showerMotion = chip.dataset.shower;
          Snd.play('splash');
          showToast('🚿 ปรับสายน้ำฝักบัวเป็น ' + chip.textContent);
        } else if (tool === 'dryer') {
          STATE.dryerMotion = chip.dataset.dryer;
          Snd.play('dryer');
          showToast('💨 ปรับความแรงไดร์เป็น ' + chip.textContent);
        }
        updateBathSubOptions();
        renderCurrentPet();
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
      spawnBubbleParticle(relX, relY);
      Snd.play('bubble');
      pData.bubblesLevel = Math.min(100, (pData.bubblesLevel || 0) + 14);

      if (Array.isArray(pData.dirtSpots)) {
        pData.dirtSpots.forEach(function (spot) {
          if (!spot.clean) spot.clean = true;
        });
      }

      pData.cleanliness = Math.min(100, (pData.cleanliness || 40) + 15);
      pData.happiness = Math.min(100, (pData.happiness || 50) + 8);
      updateStatsHUD();
      renderCurrentPet();

      if (pData.cleanliness >= 90) {
        showToast('🧼 ฟองสบู่นุ่มฟูเต็มตัวแล้ว! ใช้ฝักบัว 🚿 ล้างฟองออกได้เลยจ้า');
        showPetSpeech('ฟองสบู่นุ่มฟู ฟินที่สุดเลย~');
      }
    } else if (tool === 'shower') {
      spawnWaterSplashParticle(relX, relY);
      Snd.play('splash');

      pData.bubblesLevel = Math.max(0, (pData.bubblesLevel || 0) - 25);
      pData.cleanliness = 100;
      pData.happiness = Math.min(100, (pData.happiness || 50) + 6);
      updateStatsHUD();
      renderCurrentPet();

      if (pData.bubblesLevel === 0) {
        showToast('🚿 ฟองสบู่ล้างออกเกลี้ยงแล้ว! เป่าไดร์ 💨 ให้ขนฟูนุ่มกันเถอะ');
        showPetSpeech('ตัวสะอาดวิ้งแล้วฮับบบ~');
      }
    } else if (tool === 'dryer') {
      spawnSteamParticle(relX, relY);
      Snd.play('dryer');

      pData.fluffiness = Math.min(100, (pData.fluffiness || 50) + 16);
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
     STATION 2: NAIL & PAW CARE MINI-GAME (ตัดเล็บ & สปาอุ้งเท้า)
     ========================================================================== */
  var nailGame = {
    running: false,
    needlePos: 10,
    needleDir: 2.2,
    animId: null,
    currentNailIdx: 0,
    nailsTotal: 4,
    nailsCut: [false, false, false, false],
    buffed: false,
    balmed: false
  };

  function initNailsStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    var motionLabel = $('motionTitleLabel');
    if (subBar) subBar.style.display = 'none';
    if (motionLabel) motionLabel.style.display = 'none';

    if (dockInstruction) dockInstruction.textContent = '💅 กดปุ่มเพื่อเริ่มมินิเกมตัดเล็บอุ้งเท้า & สปาบำรุงอุ้งเท้านุ่มฟิน!';

    toolList.innerHTML =
      '<button class="tool-btn active" id="btnOpenNailGame">' +
        '<span class="tool-icon">✂️</span>' +
        '<span>ตัดเล็บอุ้งเท้า</span>' +
      '</button>' +
      '<button class="tool-btn" id="btnQuickNailBuff">' +
        '<span class="tool-icon">🪚</span>' +
        '<span>ตะไบ &amp; บาล์ม</span>' +
      '</button>';

    var btnOpen = $('btnOpenNailGame');
    if (btnOpen) btnOpen.addEventListener('click', openNailModal);

    var btnBuff = $('btnQuickNailBuff');
    if (btnBuff) {
      btnBuff.addEventListener('click', function () {
        Snd.play('sparkle');
        var p = getPetCurrentData();
        p.nails = 100;
        p.happiness = Math.min(100, (p.happiness || 50) + 12);
        updateStatsHUD();
        renderCurrentPet();
        saveGameState();
        showToast('✨ อุ้งเท้าได้รับการนวดบาล์มและตะไบเล็บเงาวับ 100%!');
        showPetSpeech('อุ้งเท้านุ่มสบายเท้าที่สุดเลยฮะ!');
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
    nailGame.needleDir = 2.4;
    nailGame.running = true;
    nailGame.buffed = false;
    nailGame.balmed = false;

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
        nailGame.needleDir = -2.4;
      } else if (nailGame.needlePos <= 8) {
        nailGame.needlePos = 8;
        nailGame.needleDir = 2.4;
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
    var padColor = nailGame.balmed ? '#ff9ebb' : '#ffccd5';
    s += '<ellipse cx="0" cy="18" rx="34" ry="24" fill="' + padColor + '" stroke="#2c1b18" stroke-width="2.5"/>';
    if (nailGame.balmed) {
      s += '<ellipse cx="0" cy="16" rx="20" ry="10" fill="#ffffff" opacity="0.4"/>';
    }

    // Toe Beans & Nails
    var toes = [
      { x: -30, y: -8, rot: -28 },
      { x: -11, y: -20, rot: -10 },
      { x: 11, y: -20, rot: 10 },
      { x: 30, y: -8, rot: 28 }
    ];
    toes.forEach(function (t, i) {
      s += '<g transform="translate(' + t.x + ',' + t.y + ') rotate(' + t.rot + ')">';
      s += '<ellipse cx="0" cy="0" rx="9" ry="11" fill="#ffafcc" stroke="#2c1b18" stroke-width="2"/>';

      var isCut = nailGame.nailsCut[i];
      var isFocus = (i === nailGame.currentNailIdx);
      var nailColor = isCut ? '#ffffff' : (isFocus ? '#ffd166' : '#eeeeee');
      var nailHeight = isCut ? 5 : 13;

      // Realistic Quick vs Free edge
      s += '<path d="M -4 -8 Q 0 ' + (-8 - nailHeight) + ' 4 -8 Z" fill="' + nailColor + '" stroke="#2c1b18" stroke-width="2"/>';
      if (!isCut) {
        // Quick line inside nail (Pink sensitive nerve)
        s += '<path d="M -2 -8 Q 0 -13 2 -8 Z" fill="#ff70a6" opacity="0.8"/>';
      }
      if (isFocus) {
        s += '<circle cx="0" cy="' + (-8 - nailHeight - 5) + '" r="3.5" fill="#ff598f"/>';
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
        txt.textContent = '🎉 ตัดครบทั้ง 4 เล็บแล้ว! ตะไบลบมุมคมหรือทาบาล์มได้เลย';
      }
    }
  }

  function handleSnipAttempt() {
    if (!nailGame.running || nailGame.currentNailIdx >= 4) return;
    var pos = nailGame.needlePos;

    if (pos >= 42 && pos <= 58) {
      // PERFECT CUT
      Snd.play('snip');
      Snd.play('sparkle');
      nailGame.nailsCut[nailGame.currentNailIdx] = true;
      nailGame.currentNailIdx++;
      showToast('✨ PERFECT! ตัดเฉพาะปลายเล็บ ปลอดภัย 100% (+15 เหรียญ)');
      addCoins(15);
    } else if ((pos >= 28 && pos < 42) || (pos > 58 && pos <= 72)) {
      // GOOD CUT
      Snd.play('snip');
      nailGame.nailsCut[nailGame.currentNailIdx] = true;
      nailGame.currentNailIdx++;
      showToast('👍 GOOD! ตัดได้เรียบร้อย (+10 เหรียญ)');
      addCoins(10);
    } else {
      // TOO CLOSE
      Snd.play('purr');
      showToast('🐾 อุ๊ย! ชิดเส้นเลือดไปนิด น้องดึงอุ้งเท้าหลบ เล็งใหม่อีกทีนะจ๊ะ');
    }

    renderNailPawDisplay();
    updateNailProgressUI();

    if (nailGame.currentNailIdx >= 4) {
      nailGame.running = false;
      var p = getPetCurrentData();
      p.nails = 90;
      p.happiness = Math.min(100, (p.happiness || 50) + 15);
      updateStatsHUD();
      renderCurrentPet();
      saveGameState();

      var btnBuffer = $('btnNailBuffer');
      if (btnBuffer) {
        btnBuffer.style.display = 'inline-flex';
        btnBuffer.onclick = function () {
          Snd.play('snip');
          Snd.play('sparkle');
          nailGame.buffed = true;
          showToast('🪚 ตะไบมุมเล็บเรียบมนเรียบร้อย ไม่คมแล้ว!');
          renderNailPawDisplay();
        };
      }

      var btnBalm = $('btnPawBalm');
      if (btnBalm) {
        btnBalm.style.display = 'inline-flex';
        btnBalm.onclick = function () {
          Snd.play('sparkle');
          nailGame.balmed = true;
          p.nails = 100;
          renderNailPawDisplay();
          showToast('🐾 นวดบาล์มชมพู อุ้งเท้านุ่มชุ่มชื้นเงาวับ 100%!');
          setTimeout(function () {
            closeNailModal();
            showPetSpeech('อุ้งเท้านุ่มฟินที่สุดเลยฮะ!');
          }, 1200);
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
    var motionLabel = $('motionTitleLabel');
    if (subBar) subBar.style.display = 'flex';
    if (motionLabel) motionLabel.style.display = 'flex';

    if (dockInstruction) dockInstruction.textContent = '✂️ เลือกลวดลายทรงขน ใช้ปัตตาเลี่ยนเล็ม หรือย้อมสีปอยขนพาสเทลแสนหวาน!';

    toolList.innerHTML =
      '<button class="tool-btn ' + (STATE.activeTool === 'shears' ? 'active' : '') + '" data-tool="shears">' +
        '<span class="tool-icon">✂️</span>' +
        '<span>กรรไกรแต่งทรง</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'clipper' ? 'active' : '') + '" data-tool="clipper">' +
        '<span class="tool-icon">💈</span>' +
        '<span>ปัตตาเลี่ยนสปา</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'brush' ? 'active' : '') + '" data-tool="brush">' +
        '<span class="tool-icon">🪮</span>' +
        '<span>แปรงขนฟูนุ่ม</span>' +
      '</button>' +
      '<button class="tool-btn ' + (STATE.activeTool === 'dye' ? 'active' : '') + '" data-tool="dye">' +
        '<span class="tool-icon">🎨</span>' +
        '<span>แอร์บรัชย้อมสี</span>' +
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
    var motionLabel = $('motionTitleLabel');
    if (!subBar) return;
    var tool = STATE.activeTool;
    var pData = getPetCurrentData();
    var html = '';

    if (tool === 'shears') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '✂️ เลือกทรงขนสไตล์ Pet Salon (Styling Cut):';
      FUR_STYLES.forEach(function (st) {
        var active = (pData.furStyle === st.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-val="' + st.id + '">' + st.name + '</button>';
      });
    } else if (tool === 'clipper') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '💈 แตะหรือลากปัตตาเลี่ยนเพื่อเล็มขนรอบอุ้งเท้าและลำตัวให้เรียบกริบ:';
      html += '<span style="font-size:0.82rem;font-weight:700;color:var(--ink-soft);padding:4px 8px">💈 เล็มขนซอกเท้า &amp; ขอบหูให้เรียบร้อยสวยงาม</span>';
    } else if (tool === 'dye') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '🎨 เลือกเฉดสีย้อมขนพาสเทล (Pastel Dye):';
      FUR_COLORS.forEach(function (col) {
        var active = (pData.furColor === col.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-val="' + col.id + '">' + col.name + '</button>';
      });
    } else if (tool === 'brush') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '🪮 แตะหรือลากแปรงลงบนตัวน้องเพื่อแปรงขนให้เงาวิ้ง 100%:';
      html += '<span style="font-size:0.82rem;font-weight:700;color:var(--ink-soft);padding:4px 8px">✨ แปรงหวีสลิกเกอร์ช่วยให้ขนฟูสวยไม่พันกัน</span>';
    }

    subBar.innerHTML = html;

    subBar.querySelectorAll('.sub-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var val = chip.dataset.val;
        if (tool === 'shears') {
          pData.furStyle = val;
          Snd.play('snip');
          spawnFurFallParticles();
          showToast('✂️ เล็มแต่งทรง ' + chip.textContent + ' สวยเก๋มาก!');
          showPetSpeech('ทรงนี้เท่/น่ารักจังเลย!');
        } else if (tool === 'dye') {
          pData.furColor = val;
          Snd.play('perfume');
          showToast('🎨 พ่นสีแอร์บรัช ' + chip.textContent + ' หวานละมุน!');
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

  function spawnFurFallParticles() {
    var fx = $('fxLayer');
    if (!fx) return;
    for (var i = 0; i < 6; i++) {
      var f = document.createElement('div');
      f.className = 'fur-fall-particle';
      f.textContent = '☁️';
      f.style.left = (120 + Math.random() * 120) + 'px';
      f.style.top = (120 + Math.random() * 80) + 'px';
      f.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      fx.appendChild(f);
      setTimeout(function () { f.remove(); }, 1200);
    }
  }

  /* ==========================================================================
     STATION 4: SPA & HYGIENE (แปรงฟัน, เช็ดหู & ฉีดสเปรย์หอม)
     ========================================================================== */
  function initSpaStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    var motionLabel = $('motionTitleLabel');
    if (subBar) subBar.style.display = 'none';
    if (motionLabel) motionLabel.style.display = 'none';

    if (dockInstruction) dockInstruction.textContent = '🩺 แปรงฟันวิ้งๆ เช็ดหูสะอาด และฉีดสเปรย์หอมอโรมาให้อารมณ์ดี!';

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
    var motionLabel = $('motionTitleLabel');
    if (subBar) subBar.style.display = 'flex';
    if (motionLabel) motionLabel.style.display = 'flex';

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
    if (btnSnap) btnSnap.addEventListener('click', snapPolaroidCertificate);

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
    var motionLabel = $('motionTitleLabel');
    if (!subBar) return;
    var tool = STATE.activeTool;
    var pData = getPetCurrentData();
    var html = '';

    if (tool === 'accessories') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '🎀 เลือกเครื่องประดับสวมใส่:';
      ACCESSORIES.forEach(function (acc) {
        var active = (pData.accessory === acc.id) ? 'active' : '';
        html += '<button class="sub-chip ' + active + '" data-val="' + acc.id + '">' + acc.name + '</button>';
      });
    } else if (tool === 'backdrop') {
      if (motionLabel) motionLabel.querySelector('span').textContent = '🖼️ เลือกธีมฉากหลังสตูดิโอ:';
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

    var canvas = $('polaroidCanvas');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height;

      var foundBg = BACKDROPS.find(function (b) { return b.id === STATE.selectedBackdrop; });
      var grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#ffccd5');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

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

    addCoins(50);
    var modal = $('photoModal');
    if (modal) modal.classList.add('open');
  }

  /* ==========================================================================
     STATION 6: CARE BOARD & ALBUM (บอร์ดดูแลสัตว์เลี้ยง)
     ========================================================================== */
  function initBoardStation() {
    var dockInstruction = $('dockInstruction');
    var toolList = $('toolList');
    var subBar = $('subOptionsBar');
    var motionLabel = $('motionTitleLabel');
    if (subBar) subBar.style.display = 'none';
    if (motionLabel) motionLabel.style.display = 'none';

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

    renderPetCareBoard();
  }

  function renderPetCareBoard() {
    var stage = $('petViewport');
    if (!stage) return;
    var html = '<div style="padding:14px;background:rgba(255,255,255,0.95);border-radius:20px;border:2px solid #ffd1dc;max-width:440px;margin:0 auto;box-shadow:0 8px 20px rgba(0,0,0,0.06)">';
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
     SAVED PET MODAL UI
     ========================================================================== */
  function openSavedPetsModal() {
    scanAllSavedPets();
    var modal = $('savedPetModal');
    if (!modal) return;
    modal.classList.add('open');
    renderSavedPetsGrid('all');
  }

  function renderSavedPetsGrid(filterTab) {
    var container = $('savedPetsList');
    if (!container) return;

    var filtered = SAVED_PETS.filter(function (sp) {
      if (filterTab === 'all') return true;
      return sp.source === filterTab;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--ink-soft);font-weight:700">ไม่พบตัวละครที่บันทึกไว้ในหมวดนี้<br><small>ลองแต่งน้องแล้วกด "💾 บันทึก" ในเกมนั้นๆ ได้เลยนะจ๊ะ</small></div>';
      return;
    }

    var html = '';
    filtered.forEach(function (sp) {
      html += '<div class="saved-pet-card" onclick="window.loadSavedPetToSalon(\'' + sp.id + '\')">';
      html += '<div class="saved-pet-avatar">' + sp.avatar + '</div>';
      html += '<div class="saved-pet-title">' + sp.name + '</div>';
      html += '<div class="saved-pet-source">' + (sp.sourceLabel || sp.source) + '</div>';
      html += '<button class="sub-chip" style="padding:4px 10px;font-size:0.75rem;background:#ff70a6;color:#fff;border-color:#ff70a6;margin-top:4px">พาน้องมาสปา</button>';
      html += '</div>';
    });

    container.innerHTML = html;
  }

  window.loadSavedPetToSalon = function (savedId) {
    var found = SAVED_PETS.find(function (p) { return p.id === savedId; });
    if (!found) return;

    PETS[found.id] = found;
    STATE.activePetId = found.id;
    if (!STATE.pets[found.id]) {
      STATE.pets[found.id] = {
        cleanliness: 45,
        fluffiness: 50,
        nails: 30,
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
        bubblesLevel: 0
      };
    }

    var modal = $('savedPetModal');
    if (modal) modal.classList.remove('open');

    renderPetCarousel();
    renderCurrentPet();
    updateStatsHUD();
    saveGameState();
    Snd.play(found.sound || 'sparkle');
    showToast('✨ พาน้อง ' + found.name + ' เข้าสู่ Pet Grooming Salon แล้ว!');
    showPetSpeech('พร้อมอาบน้ำสปาสุดหรูแล้วฮับ!');
  };

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
      var isSaved = p.sourceLabel ? '<span class="pet-chip-badge">⭐ เซฟไว้</span>' : '';

      html += '<div class="pet-chip ' + active + '" data-id="' + id + '">' +
        isSaved +
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
    Snd.play(PETS[petId].sound || 'bark');
    renderPetCarousel();
    renderCurrentPet();
    updateStatsHUD();
    saveGameState();

    var msgs = PETS[petId].speech || ['สบายตัวจังเลยย~'];
    var randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    showPetSpeech(randomMsg);

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

    var follower = $('showerHeadFollower');
    if (follower) follower.classList.remove('active');

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
    // Sound Button
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

    // Open Saved Pets Modal
    var btnOpenSaved = $('btnOpenSavedPets');
    if (btnOpenSaved) {
      btnOpenSaved.addEventListener('click', openSavedPetsModal);
    }
    var closeSaved = $('closeSavedPetModal');
    if (closeSaved) {
      closeSaved.addEventListener('click', function () {
        $('savedPetModal').classList.remove('open');
      });
    }

    // Saved Pet Filter Tabs
    var savedTabs = $('savedPetTabs');
    if (savedTabs) {
      savedTabs.querySelectorAll('.sub-chip').forEach(function (tab) {
        tab.addEventListener('click', function () {
          savedTabs.querySelectorAll('.sub-chip').forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
          renderSavedPetsGrid(tab.dataset.tab);
        });
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

    // Main Pet Stage Interactive Touch / Click / Drag
    var stage = $('petStage');
    var follower = $('showerHeadFollower');

    if (stage) {
      var isPointerDown = false;
      function onPointerAction(e) {
        if (STATE.activeStation === 'bath') {
          handleBathInteraction(e);
        } else if (STATE.activeStation === 'styling') {
          if (STATE.activeTool === 'brush') {
            spawnSparkleParticle(e.clientX - stage.getBoundingClientRect().left, e.clientY - stage.getBoundingClientRect().top);
            Snd.play('sparkle');
            var p = getPetCurrentData();
            p.fluffiness = 100;
            p.happiness = Math.min(100, (p.happiness || 50) + 5);
            updateStatsHUD();
            renderCurrentPet();
            saveGameState();
          } else if (STATE.activeTool === 'clipper') {
            Snd.play('clipper');
            spawnFurFallParticles();
            showToast('💈 ปัตตาเลี่ยนเล็มซอกขนเรียบกริบ!');
          }
        } else if (STATE.activeStation === 'spa') {
          handleSpaInteraction(e);
        }
      }

      function updateFollowerPos(e) {
        if (follower && STATE.activeStation === 'bath' && STATE.activeTool === 'shower') {
          follower.classList.add('active');
          var rect = stage.getBoundingClientRect();
          var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
          var y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
          follower.style.left = x + 'px';
          follower.style.top = y + 'px';
        } else if (follower) {
          follower.classList.remove('active');
        }
      }

      stage.addEventListener('mousedown', function (e) {
        isPointerDown = true;
        updateFollowerPos(e);
        onPointerAction(e);
      });
      stage.addEventListener('mousemove', function (e) {
        updateFollowerPos(e);
        if (isPointerDown) onPointerAction(e);
      });
      window.addEventListener('mouseup', function () { isPointerDown = false; });

      stage.addEventListener('touchstart', function (e) {
        isPointerDown = true;
        updateFollowerPos(e);
        onPointerAction(e);
      }, { passive: true });
      stage.addEventListener('touchmove', function (e) {
        updateFollowerPos(e);
        if (isPointerDown) onPointerAction(e);
      }, { passive: true });
      window.addEventListener('touchend', function () { isPointerDown = false; });
      stage.addEventListener('mouseleave', function () {
        if (follower) follower.classList.remove('active');
      });
    }

    // Nail Snip Button
    var btnSnip = $('btnSnipNail');
    if (btnSnip) btnSnip.addEventListener('click', handleSnipAttempt);
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
            STATE.album.push({ petId: STATE.activePetId, date: Date.now(), dataUrl: dataUrl });
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
