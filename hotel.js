/* ==========================================================================
   HOTEL CITY — PLAYFISH RETRO RECREATION GAME ENGINE (hotel.js)
   ========================================================================== */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ==========================================================================
     1. SOUND SYNTHESIZER (Native Web Audio API)
     ========================================================================== */
  var Snd = (function () {
    var ctx = null;
    var enabled = lsGet('hotel_city_sound') !== 'off';

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
      lsSet('hotel_city_sound', enabled ? 'on' : 'off');
    }

    function play(kind) {
      if (!enabled) return;
      try {
        var c = getCtx();
        if (!c) return;
        var now = c.currentTime;

        if (kind === 'ding' || kind === 'bell') {
          // Front Desk & Elevator Crystal Ding
          var o = c.createOscillator(), g = c.createGain();
          o.type = 'sine';
          o.connect(g); g.connect(c.destination);
          o.frequency.setValueAtTime(1760, now); // A6
          o.frequency.exponentialRampToValueAtTime(1318.5, now + 0.15); // E6
          g.gain.setValueAtTime(0.2, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          o.start(now); o.stop(now + 0.72);
        } else if (kind === 'coin') {
          // Cash Register Ka-ching!
          [987.77, 1318.5, 1567.98, 2093.0].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'triangle';
            o.connect(g); g.connect(c.destination);
            o.frequency.setValueAtTime(f, now + i * 0.05);
            g.gain.setValueAtTime(0.14, now + i * 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.22);
            o.start(now + i * 0.05); o.stop(now + i * 0.05 + 0.24);
          });
        } else if (kind === 'clean') {
          // Broom sweep / vacuum whoosh
          var o2 = c.createOscillator(), g2 = c.createGain();
          o2.type = 'sine';
          o2.connect(g2); g2.connect(c.destination);
          o2.frequency.setValueAtTime(450, now);
          o2.frequency.linearRampToValueAtTime(800, now + 0.08);
          o2.frequency.exponentialRampToValueAtTime(220, now + 0.18);
          g2.gain.setValueAtTime(0.12, now);
          g2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          o2.start(now); o2.stop(now + 0.22);
        } else if (kind === 'splash') {
          // Swimming Pool Splash
          var o3 = c.createOscillator(), g3 = c.createGain();
          o3.type = 'triangle';
          o3.connect(g3); g3.connect(c.destination);
          o3.frequency.setValueAtTime(280, now);
          o3.frequency.linearRampToValueAtTime(500, now + 0.08);
          o3.frequency.exponentialRampToValueAtTime(150, now + 0.24);
          g3.gain.setValueAtTime(0.15, now);
          g3.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          o3.start(now); o3.stop(now + 0.26);
        } else if (kind === 'cheer' || kind === 'fanfare') {
          // Level up fanfare
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'sine';
            o.connect(g); g.connect(c.destination);
            o.frequency.setValueAtTime(f, now + i * 0.08);
            g.gain.setValueAtTime(0.16, now + i * 0.08);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
            o.start(now + i * 0.08); o.stop(now + i * 0.08 + 0.38);
          });
        } else if (kind === 'keycard') {
          // VIP Keycard unlock
          [659.25, 880.0, 1318.5].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'sine';
            o.connect(g); g.connect(c.destination);
            o.frequency.setValueAtTime(f, now + i * 0.07);
            g.gain.setValueAtTime(0.15, now + i * 0.07);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
            o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.28);
          });
        }
      } catch (err) {}
    }

    return { play: play, isEnabled: isEnabled, setEnabled: setEnabled };
  })();

  /* ==========================================================================
     2. ROOM CATALOG & SHOP DEFINITIONS
     ========================================================================== */
  var ROOM_TYPES = {
    bedroom_single: {
      id: 'bedroom_single',
      name: 'Cozy Single Room (ห้องเดี่ยวอบอุ่น)',
      category: 'bedrooms',
      icon: '🛏️',
      costCoins: 300,
      costCash: 0,
      payout: 50,
      xp: 15,
      stayDuration: 12000, // 12 seconds
      desc: 'เตียงเดี่ยวนุ่มสบาย โต๊ะข้างเตียง และหน้าต่างชมวิวเมือง'
    },
    bedroom_double: {
      id: 'bedroom_double',
      name: 'Deluxe Double Room (ห้องคู่ดีลักซ์)',
      category: 'bedrooms',
      icon: '🛋️',
      costCoins: 650,
      costCash: 0,
      payout: 110,
      xp: 30,
      stayDuration: 15000,
      desc: 'เตียงคิงไซส์ ตู้เสื้อผ้า พรมขนนุ่ม และทีวีจอแบน'
    },
    bedroom_suite: {
      id: 'bedroom_suite',
      name: 'Honeymoon Jacuzzi Suite (ฮันนีมูนสูท)',
      category: 'bedrooms',
      icon: '💖',
      costCoins: 1400,
      costCash: 2,
      payout: 240,
      xp: 65,
      stayDuration: 18000,
      desc: 'เตียงสี่เสาผ้าโปร่ง อ่างจากุซซี่รูปหัวใจ และแชมเปญบาร์'
    },
    bedroom_penthouse: {
      id: 'bedroom_penthouse',
      name: 'Presidential Penthouse (เพนต์เฮาส์หรู)',
      category: 'bedrooms',
      icon: '👑',
      costCoins: 2800,
      costCash: 5,
      payout: 500,
      xp: 120,
      stayDuration: 22000,
      desc: 'ห้องสูทประธานาธิบดี แชนเดอเลียร์คริสตัล โซฟาหลุยส์ และพรมแดง'
    },
    pool: {
      id: 'pool',
      name: 'Sky Swimming Pool (สระว่ายน้ำลอยฟ้า)',
      category: 'leisure',
      icon: '🏊',
      costCoins: 850,
      costCash: 0,
      payout: 95,
      xp: 40,
      stayDuration: 14000,
      desc: 'สระว่ายน้ำสีฟ้าคราม ห่วงยางฟลามิงโก้ และเก้าอี้อาบแดด'
    },
    gym: {
      id: 'gym',
      name: 'Fitness Club & Gym (ฟิตเนสคลับ)',
      category: 'leisure',
      icon: '🏋️',
      costCoins: 750,
      costCash: 0,
      payout: 85,
      xp: 35,
      stayDuration: 13000,
      desc: 'ลู่วิ่งไฟฟ้า ดัมเบลล์ บาร์โหน และเครื่องดื่มเกลือแร่'
    },
    restaurant: {
      id: 'restaurant',
      name: 'Grand Buffet Restaurant (ห้องอาหารบุฟเฟต์)',
      category: 'dining',
      icon: '🍽️',
      costCoins: 1200,
      costCash: 1,
      payout: 160,
      xp: 55,
      stayDuration: 16000,
      desc: 'โต๊ะอาหารบุฟเฟต์นานาชาติ เชฟทำอาหารสด และไวน์ชั้นเลิศ'
    },
    disco: {
      id: 'disco',
      name: 'Rooftop Disco Club (ไนท์คลับดิสโก้)',
      category: 'dining',
      icon: '🍸',
      costCoins: 1600,
      costCash: 3,
      payout: 220,
      xp: 75,
      stayDuration: 17000,
      desc: 'ฟลอร์เต้นรำไฟนีออน ลูกแก้วดิสโก้ และดีเจเปิดเพลงมันส์'
    },
    spa: {
      id: 'spa',
      name: 'Zen Onsen & Spa (ออนเซ็น & สปาหรู)',
      category: 'entertainment',
      icon: '💆',
      costCoins: 1100,
      costCash: 1,
      payout: 140,
      xp: 50,
      stayDuration: 15000,
      desc: 'อ่างแช่น้ำแร่ออนเซ็น เตียงนวดอโรมา และไอควันสมุนไพร'
    },
    arcade: {
      id: 'arcade',
      name: 'Retro Arcade Zone (โซนเกมอาร์เคด)',
      category: 'entertainment',
      icon: '🎮',
      costCoins: 600,
      costCash: 0,
      payout: 75,
      xp: 25,
      stayDuration: 12000,
      desc: 'ตู้เกมตู้พินบอล ตู้คีบตุ๊กตา และแสงไฟนีออนย้อนยุค'
    }
  };

  /* ==========================================================================
     3. GAME STATE MANAGEMENT & PERSISTENCE
     ========================================================================== */
  var STATE = {
    hotelName: 'Nadia Hotel City',
    coins: 1250,
    cash: 25,
    level: 3,
    xp: 220,
    nextXp: 500,
    stars: 3,
    popularity: 96,
    isNight: false,
    elevatorPos: 1, // floor index
    floors: [],
    staff: {
      receptionist: true,
      maid: false,
      lifeguard: false,
      chef: false,
      bartender: false
    },
    activeGuests: [],
    selectedSlotToBuild: null
  };

  function createInitialFloors() {
    return [
      {
        floorNum: 1,
        isGround: true,
        rooms: [
          { id: 'f1_lobby', type: 'lobby', status: 'ready', occupant: null },
          { id: 'f1_boutique', type: 'boutique', status: 'ready', occupant: null }
        ]
      },
      {
        floorNum: 2,
        isGround: false,
        rooms: [
          { id: 'f2_r1', type: 'bedroom_single', status: 'ready', occupant: null, coinsReady: 0 },
          { id: 'f2_r2', type: 'bedroom_double', status: 'ready', occupant: null, coinsReady: 0 }
        ]
      },
      {
        floorNum: 3,
        isGround: false,
        rooms: [
          { id: 'f3_r1', type: 'pool', status: 'ready', occupant: null, coinsReady: 0 },
          { id: 'f3_r2', type: 'gym', status: 'ready', occupant: null, coinsReady: 0 }
        ]
      },
      {
        floorNum: 4,
        isGround: false,
        rooms: [
          { id: 'f4_r1', type: 'restaurant', status: 'ready', occupant: null, coinsReady: 0 },
          { id: 'f4_r2', type: 'empty', status: 'empty' }
        ]
      }
    ];
  }

  function loadGameState() {
    var raw = lsGet('hotel_city_save_v1');
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed) {
          STATE.hotelName = parsed.hotelName || 'Nadia Hotel City';
          STATE.coins = typeof parsed.coins === 'number' ? parsed.coins : 1250;
          STATE.cash = typeof parsed.cash === 'number' ? parsed.cash : 25;
          STATE.level = parsed.level || 3;
          STATE.xp = parsed.xp || 220;
          STATE.nextXp = parsed.nextXp || 500;
          STATE.stars = parsed.stars || 3;
          STATE.popularity = parsed.popularity || 96;
          STATE.isNight = !!parsed.isNight;
          STATE.staff = parsed.staff || STATE.staff;
          if (Array.isArray(parsed.floors) && parsed.floors.length > 0) {
            STATE.floors = parsed.floors;
          } else {
            STATE.floors = createInitialFloors();
          }
        }
      } catch (e) {
        STATE.floors = createInitialFloors();
      }
    } else {
      STATE.floors = createInitialFloors();
    }
  }

  function saveGameState() {
    var toSave = {
      hotelName: STATE.hotelName,
      coins: STATE.coins,
      cash: STATE.cash,
      level: STATE.level,
      xp: STATE.xp,
      nextXp: STATE.nextXp,
      stars: STATE.stars,
      popularity: STATE.popularity,
      isNight: STATE.isNight,
      staff: STATE.staff,
      floors: STATE.floors,
      lastSaved: Date.now()
    };
    lsSet('hotel_city_save_v1', JSON.stringify(toSave));

    // Cross-push coins to Pet Society saves
    ['nadia', 'mac'].forEach(function (user) {
      try {
        var k = 'petsociety_save_' + user;
        var r = lsGet(k);
        if (r) {
          var save = JSON.parse(r);
          if (save && save.player) {
            save.player.coins = Math.max(save.player.coins || 0, STATE.coins);
            lsSet(k, JSON.stringify(save));
          }
        }
      } catch (e) {}
    });
  }

  function addCoins(amt) {
    STATE.coins = Math.max(0, (STATE.coins || 0) + amt);
    updateHUD();
    saveGameState();
  }

  function addXP(amt) {
    STATE.xp = (STATE.xp || 0) + amt;
    if (STATE.xp >= STATE.nextXp) {
      STATE.level++;
      STATE.xp -= STATE.nextXp;
      STATE.nextXp = Math.floor(STATE.nextXp * 1.5);
      STATE.stars = Math.min(5, Math.floor(STATE.level / 2) + 1);
      Snd.play('cheer');
      showToast('🎉 ยินดีด้วย! โรงแรมเลเวลอัปเป็น LV ' + STATE.level + ' ได้รับการเลื่อนขั้น ' + getStarsString(STATE.stars) + '!');
    }
    updateHUD();
    saveGameState();
  }

  function getStarsString(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '⭐';
    return s;
  }

  function updateHUD() {
    var elCoins = $('hudCoins');
    if (elCoins) elCoins.textContent = STATE.coins.toLocaleString();

    var elCash = $('hudCash');
    if (elCash) elCash.textContent = STATE.cash.toLocaleString();

    var elLvl = $('hudLevel');
    if (elLvl) elLvl.textContent = STATE.level;

    var elXp = $('xpBarFill');
    if (elXp) {
      var pct = Math.min(100, Math.floor((STATE.xp / STATE.nextXp) * 100));
      elXp.style.width = pct + '%';
    }

    var elPop = $('popPercent');
    if (elPop) elPop.textContent = STATE.popularity + '%';

    var elStar = $('hotelStarDisplay');
    if (elStar) elStar.textContent = getStarsString(STATE.stars);

    var elNeonStars = $('neonStars');
    if (elNeonStars) elNeonStars.textContent = getStarsString(STATE.stars);

    var elNeonText = $('neonText');
    if (elNeonText) elNeonText.textContent = STATE.hotelName.toUpperCase();

    var elBrand = $('hotelBrandName');
    if (elBrand) elBrand.textContent = STATE.hotelName;
  }

  /* ==========================================================================
     4. DOLLHOUSE BUILDING RENDERER (SVG ROOM INTERIORS)
     ========================================================================== */
  function renderHotelFloors() {
    var stack = $('floorsStack');
    if (!stack) return;

    var html = '';
    // In cross section, top floor renders first, down to ground floor
    for (var i = STATE.floors.length - 1; i >= 0; i--) {
      var fl = STATE.floors[i];
      html += renderFloorRow(fl, i);
    }
    stack.innerHTML = html;

    // Attach click listeners to room slots
    stack.querySelectorAll('.room-slot').forEach(function (slot) {
      slot.addEventListener('click', function (e) {
        var roomId = slot.dataset.roomId;
        var floorIdx = parseInt(slot.dataset.floorIdx, 10);
        handleRoomClick(floorIdx, roomId, e);
      });
    });

    updateElevatorCabinPosition();
  }

  function renderFloorRow(floor, floorIdx) {
    var html = '<div class="floor-row" data-floor-idx="' + floorIdx + '">';

    // Floor number badge
    var floorName = floor.isGround ? 'G' : 'F' + floor.floorNum;
    html += '<div class="floor-number-badge">' + floorName + '</div>';

    // Room slots on this floor
    html += '<div class="room-slots-container">';
    floor.rooms.forEach(function (room) {
      html += renderRoomSlot(room, floorIdx);
    });
    html += '</div>';

    // Glass Elevator Column
    html += '<div class="elevator-shaft" id="shaft_' + floorIdx + '">';
    // If elevator is on this floor, render cabin
    if (STATE.elevatorPos === floorIdx) {
      html += renderElevatorCabin();
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderElevatorCabin() {
    return '<div class="elevator-cabin" id="elevatorCabin">' +
      '<div class="elevator-roof-light"></div>' +
      '<div class="elevator-door-glass"></div>' +
      '<div class="elevator-occupants">' + (STATE.elevatorGuestAvatar || '🛎️') + '</div>' +
      '<div class="elevator-door-glass"></div>' +
      '</div>';
  }

  function updateElevatorCabinPosition() {
    // Elevator is rendered in current floor shaft
  }

  function renderRoomSlot(room, floorIdx) {
    var isNight = STATE.isNight;
    var html = '<div class="room-slot ' + (room.type === 'empty' ? 'empty-plot' : '') + '" data-room-id="' + room.id + '" data-floor-idx="' + floorIdx + '">';

    if (room.type === 'empty') {
      html += '<button class="btn-build-slot">➕ สร้างห้องพัก</button>';
      html += '<span style="font-size:0.75rem;font-weight:700">พื้นที่ว่างรอต่อเติม</span>';
    } else {
      // Room SVG graphic
      html += '<svg class="room-interior-svg" viewBox="0 0 200 140" preserveAspectRatio="none">';
      html += drawRoomInterior(room, isNight);
      html += '</svg>';

      // Status Bubble (Coins ready or Dirty needs clean)
      if (room.status === 'checkout' && room.coinsReady > 0) {
        html += '<div class="room-status-bubble bubble-cash" title="แตะเพื่อเก็บเหรียญ!">' +
          '<span>🪙 +' + room.coinsReady + '</span>' +
          '</div>';
      } else if (room.status === 'dirty') {
        html += '<div class="room-status-bubble bubble-clean" title="ห้องต้องการทำความสะอาด!">' +
          '<span>🧹 ทำความสะอาด</span>' +
          '</div>';
      } else if (room.occupant && room.occupant.avatar) {
        html += '<div class="room-status-bubble bubble-sleep">' +
          '<span>' + (room.type.includes('bedroom') ? '💤' : '✨') + '</span>' +
          '</div>';
      }
    }

    html += '</div>';
    return html;
  }

  /* DRAW ROOM INTERIOR SVGS */
  function drawRoomInterior(room, isNight) {
    var type = room.type;
    var s = '';

    // Room wall background & floor base
    var wallColor = isNight ? '#2b212f' : '#fefae0';
    var floorColor = '#d4a373';

    if (type === 'bedroom_single') {
      s += '<rect width="200" height="120" fill="' + wallColor + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#c2956c"/>'; // wood floor
      // Window with city skyline
      s += '<rect x="130" y="20" width="50" height="50" rx="4" fill="#a2d2ff" stroke="#4a3b32" stroke-width="3"/>';
      s += '<line x1="155" y1="20" x2="155" y2="70" stroke="#4a3b32" stroke-width="2"/>';
      s += '<line x1="130" y1="45" x2="180" y2="45" stroke="#4a3b32" stroke-width="2"/>';
      // Cozy Bed
      s += '<rect x="20" y="70" width="75" height="48" rx="6" fill="#ff70a6" stroke="#4a3b32" stroke-width="2.5"/>';
      s += '<rect x="22" y="72" width="22" height="44" rx="4" fill="#ffffff"/>'; // pillow
      s += '<path d="M 44 72 L 93 72 L 93 116 L 44 116 Z" fill="#ffccd5"/>'; // blanket
      // Table & Lamp
      s += '<rect x="100" y="85" width="24" height="33" fill="#e9ecef" stroke="#4a3b32" stroke-width="2"/>';
      s += '<path d="M 106 85 L 118 85 L 122 70 L 102 70 Z" fill="#ffd166"/>';
      // Wall poster
      s += '<rect x="35" y="25" width="28" height="32" fill="#fff" stroke="#4a3b32" stroke-width="2"/>';
      s += '<circle cx="49" cy="41" r="8" fill="#ffd166"/>';
    } else if (type === 'bedroom_double') {
      s += '<rect width="200" height="120" fill="' + (isNight ? '#38222f' : '#ffe5ec') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#9b5de5"/>'; // velvet carpet
      // Large Double Bed
      s += '<rect x="30" y="60" width="90" height="58" rx="8" fill="#d90429" stroke="#4a3b32" stroke-width="2.8"/>';
      s += '<rect x="34" y="64" width="24" height="24" rx="4" fill="#fff"/>';
      s += '<rect x="34" y="90" width="24" height="24" rx="4" fill="#fff"/>';
      s += '<rect x="58" y="64" width="60" height="50" rx="4" fill="#ff4d6d"/>';
      // Wardrobe
      s += '<rect x="135" y="30" width="45" height="88" rx="4" fill="#8d5b4c" stroke="#4a3b32" stroke-width="2.5"/>';
      s += '<line x1="157" y1="30" x2="157" y2="118" stroke="#4a3b32" stroke-width="2"/>';
      s += '<circle cx="152" cy="74" r="2.5" fill="#ffd166"/>';
      s += '<circle cx="162" cy="74" r="2.5" fill="#ffd166"/>';
    } else if (type === 'bedroom_suite') {
      s += '<rect width="200" height="120" fill="' + (isNight ? '#2a1824' : '#fff0f3') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#ff70a6"/>';
      // Four-poster canopy bed
      s += '<rect x="25" y="45" width="80" height="72" fill="#c9184a" stroke="#800f2f" stroke-width="2.5"/>';
      s += '<line x1="25" y1="20" x2="25" y2="117" stroke="#ffd166" stroke-width="4"/>';
      s += '<line x1="105" y1="20" x2="105" y2="117" stroke="#ffd166" stroke-width="4"/>';
      s += '<path d="M 23 20 Q 65 30 107 20" stroke="#ffd166" stroke-width="4" fill="none"/>';
      // Jacuzzi with bubbles
      s += '<ellipse cx="155" cy="88" rx="35" ry="24" fill="#a2d2ff" stroke="#0077b6" stroke-width="3"/>';
      s += '<circle cx="145" cy="85" r="5" fill="#fff" opacity="0.8"/>';
      s += '<circle cx="162" cy="88" r="4" fill="#fff" opacity="0.8"/>';
    } else if (type === 'bedroom_penthouse') {
      s += '<rect width="200" height="120" fill="' + (isNight ? '#1f132b' : '#f3e8ff') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#ffd166"/>'; // gold floor
      // Crystal chandelier
      s += '<path d="M 90 0 L 110 0 L 100 28 Z" fill="#ffd166"/>';
      s += '<circle cx="100" cy="30" r="14" fill="#ffffff" stroke="#ffd166" stroke-width="2" filter="url(#softGlow)"/>';
      // Royal King Bed
      s += '<rect x="20" y="55" width="95" height="62" rx="8" fill="#7209b7" stroke="#480ca8" stroke-width="3"/>';
      s += '<rect x="45" y="60" width="66" height="52" rx="4" fill="#b5179e"/>';
      // Champagne Table
      s += '<rect x="140" y="80" width="40" height="38" rx="4" fill="#ffffff" stroke="#4a3b32" stroke-width="2"/>';
      s += '<path d="M 155 70 L 165 70 L 160 80 Z" fill="#ffd166"/>';
    } else if (type === 'pool') {
      s += '<rect width="200" height="140" fill="#bbf2f6"/>';
      // Pool basin with water
      s += '<rect x="15" y="45" width="140" height="85" rx="14" fill="#48cae4" stroke="#0077b6" stroke-width="3.5"/>';
      s += '<path d="M 25 70 Q 55 64 85 70 Q 115 76 145 70" stroke="rgba(255,255,255,0.7)" stroke-width="3" fill="none"/>';
      // Floating flamingo floatie
      s += '<ellipse cx="65" cy="85" rx="14" ry="9" fill="#ff70a6"/>';
      s += '<circle cx="58" cy="78" r="5" fill="#ff70a6"/>';
      // Sun lounger & umbrella
      s += '<rect x="165" y="70" width="26" height="50" rx="3" fill="#ffffff" stroke="#e07a5f" stroke-width="2"/>';
      s += '<path d="M 160 25 L 195 25 L 178 50 Z" fill="#ffd166"/>';
    } else if (type === 'gym') {
      s += '<rect width="200" height="120" fill="' + (isNight ? '#262930' : '#e9ecef') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#343a40"/>'; // rubber gym floor
      // Treadmill
      s += '<rect x="25" y="92" width="60" height="14" rx="4" fill="#495057" stroke="#212529" stroke-width="2"/>';
      s += '<line x1="75" y1="92" x2="85" y2="60" stroke="#adb5bd" stroke-width="4"/>';
      s += '<rect x="80" y="55" width="14" height="10" rx="2" fill="#212529"/>';
      // Dumbbells rack
      s += '<rect x="120" y="65" width="65" height="52" rx="4" fill="#6c757d" stroke="#343a40" stroke-width="2"/>';
      s += '<circle cx="135" cy="80" r="7" fill="#212529"/>';
      s += '<circle cx="155" cy="80" r="7" fill="#212529"/>';
      s += '<circle cx="172" cy="80" r="7" fill="#212529"/>';
    } else if (type === 'restaurant') {
      s += '<rect width="200" height="120" fill="' + (isNight ? '#301e22' : '#faedcd') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#d4a373"/>';
      // Buffet counter
      s += '<rect x="110" y="55" width="75" height="62" rx="4" fill="#bc6c25" stroke="#4a3b32" stroke-width="2.5"/>';
      s += '<ellipse cx="130" cy="55" rx="12" ry="6" fill="#e9ecef"/>';
      s += '<ellipse cx="160" cy="55" rx="12" ry="6" fill="#e9ecef"/>';
      // Dining table with chairs
      s += '<rect x="30" y="75" width="50" height="42" rx="4" fill="#ffffff" stroke="#4a3b32" stroke-width="2"/>';
      s += '<ellipse cx="55" cy="75" rx="8" ry="4" fill="#e63946"/>'; // cake
    } else if (type === 'disco') {
      s += '<rect width="200" height="120" fill="#140d21"/>';
      // Neon dance floor grid
      s += '<rect y="115" width="200" height="25" fill="#240046"/>';
      s += '<line x1="40" y1="115" x2="40" y2="140" stroke="#ff007f" stroke-width="2"/>';
      s += '<line x1="80" y1="115" x2="80" y2="140" stroke="#00f5d4" stroke-width="2"/>';
      s += '<line x1="120" y1="115" x2="120" y2="140" stroke="#fee440" stroke-width="2"/>';
      s += '<line x1="160" y1="115" x2="160" y2="140" stroke="#7209b7" stroke-width="2"/>';
      // Disco ball
      s += '<line x1="100" y1="0" x2="100" y2="25" stroke="#ccc" stroke-width="2"/>';
      s += '<circle cx="100" cy="35" r="15" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>';
      // DJ Booth
      s += '<rect x="140" y="65" width="50" height="48" rx="4" fill="#7209b7" stroke="#ff007f" stroke-width="2"/>';
      s += '<circle cx="155" cy="65" r="6" fill="#000"/>';
      s += '<circle cx="175" cy="65" r="6" fill="#000"/>';
    } else if (type === 'spa') {
      s += '<rect width="200" height="120" fill="' + (isNight ? '#222823' : '#e8f5e9') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#606c38"/>'; // tatami
      // Hot spring tub
      s += '<ellipse cx="65" cy="85" rx="42" ry="26" fill="#84a59d" stroke="#52796f" stroke-width="3"/>';
      s += '<ellipse cx="65" cy="87" rx="34" ry="18" fill="#cad2c5"/>';
      // Bamboo screen
      s += '<rect x="135" y="30" width="50" height="88" fill="#dda15e" stroke="#bc6c25" stroke-width="2"/>';
      s += '<line x1="150" y1="30" x2="150" y2="118" stroke="#bc6c25" stroke-width="1.5"/>';
      s += '<line x1="165" y1="30" x2="165" y2="118" stroke="#bc6c25" stroke-width="1.5"/>';
    } else if (type === 'arcade') {
      s += '<rect width="200" height="120" fill="#1b1b2f"/>';
      s += '<rect y="120" width="200" height="20" fill="#e43f5a"/>';
      // Arcade Cabinet 1
      s += '<rect x="30" y="35" width="40" height="82" rx="4" fill="#1f4068" stroke="#e43f5a" stroke-width="2.5"/>';
      s += '<rect x="36" y="46" width="28" height="24" rx="2" fill="#ffd166"/>';
      // Arcade Cabinet 2
      s += '<rect x="85" y="35" width="40" height="82" rx="4" fill="#162447" stroke="#00f5d4" stroke-width="2.5"/>';
      s += '<rect x="91" y="46" width="28" height="24" rx="2" fill="#ff70a6"/>';
      // Claw Machine
      s += '<rect x="140" y="30" width="45" height="88" rx="4" fill="#f72585" stroke="#7209b7" stroke-width="2.5"/>';
      s += '<rect x="146" y="38" width="33" height="40" fill="rgba(255,255,255,0.7)"/>';
    } else if (type === 'lobby') {
      // Grand Front Desk Lobby
      s += '<rect width="200" height="120" fill="' + (isNight ? '#352128' : '#fff5f8') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#d90429"/>'; // royal red carpet
      // Grand Reception Counter
      s += '<rect x="40" y="62" width="120" height="55" rx="8" fill="#6a040f" stroke="#ffd166" stroke-width="3"/>';
      s += '<rect x="44" y="65" width="112" height="14" rx="3" fill="#ffd166"/>';
      // Bellhop Desk Bell
      s += '<circle cx="100" cy="62" r="5" fill="#ffd166" stroke="#b58300" stroke-width="1.5"/>';
      // Wall Keycard Grid
      s += '<rect x="65" y="20" width="70" height="32" rx="4" fill="#9d0208" stroke="#ffd166" stroke-width="2"/>';
      for (var kx = 72; kx <= 125; kx += 12) {
        s += '<rect x="' + kx + '" y="25" width="7" height="10" rx="2" fill="#ffd166"/>';
      }
      // Receptionist Chibi Bellhop
      s += '<circle cx="100" cy="50" r="10" fill="#ffccd5"/>'; // face
      s += '<rect x="92" y="36" width="16" height="7" rx="3" fill="#d90429" stroke="#ffd166" stroke-width="1.5"/>'; // pillbox hat
    } else if (type === 'boutique') {
      // Gift Boutique
      s += '<rect width="200" height="120" fill="' + (isNight ? '#261b2f' : '#f0f3f8') + '"/>';
      s += '<rect y="120" width="200" height="20" fill="#adb5bd"/>';
      // Shelves with gifts
      s += '<rect x="25" y="30" width="150" height="88" rx="6" fill="#ffffff" stroke="#4a3b32" stroke-width="2"/>';
      s += '<line x1="25" y1="60" x2="175" y2="60" stroke="#4a3b32" stroke-width="2"/>';
      s += '<line x1="25" y1="90" x2="175" y2="90" stroke="#4a3b32" stroke-width="2"/>';
      s += '<text x="45" y="52" font-size="16">🧸</text>';
      s += '<text x="90" y="52" font-size="16">🕶️</text>';
      s += '<text x="135" y="52" font-size="16">🛍️</text>';
      s += '<text x="45" y="82" font-size="16">🎁</text>';
      s += '<text x="90" y="82" font-size="16">🧴</text>';
      s += '<text x="135" y="82" font-size="16">👑</text>';
    }

    // Render Occupant Chibi in Room
    if (room.occupant && room.occupant.avatar) {
      var occ = room.occupant;
      var cx = occ.posX || 80;
      var cy = 110;

      s += '<g transform="translate(' + cx + ',' + cy + ')">';
      if (type.includes('bedroom')) {
        // Sleeping Chibi with blanket
        s += '<text x="-12" y="-12" font-size="22">' + occ.avatar + '</text>';
        s += '<text x="8" y="-28" font-size="16" fill="#9b5de5">💤</text>';
      } else if (type === 'pool') {
        // Swimming Chibi
        s += '<text x="-12" y="-14" font-size="22">' + occ.avatar + '</text>';
        s += '<text x="-16" y="2" font-size="14">💦</text>';
      } else if (type === 'gym') {
        // Working out Chibi
        s += '<text x="-12" y="-12" font-size="22">' + occ.avatar + '</text>';
        s += '<text x="8" y="-24" font-size="14">💪</text>';
      } else if (type === 'restaurant') {
        // Dining Chibi
        s += '<text x="-12" y="-12" font-size="22">' + occ.avatar + '</text>';
        s += '<text x="8" y="-24" font-size="14">🍰</text>';
      } else if (type === 'disco') {
        // Dancing Chibi
        s += '<text x="-12" y="-14" font-size="22">' + occ.avatar + '</text>';
        s += '<text x="10" y="-24" font-size="14">🎵</text>';
      } else {
        s += '<text x="-12" y="-12" font-size="22">' + occ.avatar + '</text>';
      }
      s += '</g>';
    }

    return s;
  }

  /* ==========================================================================
     5. INTERACTIVE ROOM CLICKS (BUILD, CLEAN, COLLECT)
     ========================================================================== */
  function handleRoomClick(floorIdx, roomId, e) {
    var floor = STATE.floors[floorIdx];
    if (!floor) return;
    var room = floor.rooms.find(function (r) { return r.id === roomId; });
    if (!room) return;

    if (room.type === 'empty') {
      // Open Shop to build in this slot
      STATE.selectedSlotToBuild = { floorIdx: floorIdx, roomId: roomId };
      openBuildShop();
    } else if (room.status === 'checkout' && room.coinsReady > 0) {
      // Collect coins!
      var earned = room.coinsReady;
      room.coinsReady = 0;
      room.status = 'dirty';
      addCoins(earned);
      addXP(Math.floor(earned / 3));
      Snd.play('coin');

      spawnCoinParticle(e.clientX, e.clientY, earned);
      showToast('💰 เก็บค่าห้องพัก +' + earned + ' เหรียญ!');
      renderHotelFloors();
    } else if (room.status === 'dirty') {
      // Clean room!
      room.status = 'ready';
      Snd.play('clean');
      addXP(10);
      showToast('🧹 ทำความสะอาดห้องเรียบร้อย สะอาดเอี่ยม 100%!');
      renderHotelFloors();
    } else if (room.occupant) {
      // Pet or guest interaction
      Snd.play('ding');
      showToast('💖 แขก ' + room.occupant.name + ' กำลังพักผ่อนอย่างมีความสุข!');
    } else {
      // Room info
      var def = ROOM_TYPES[room.type];
      if (def) {
        showToast('ℹ️ ' + def.name + ' (พร้อมต้อนรับแขกคนถัดไป)');
      }
    }
  }

  /* ==========================================================================
     6. GUEST ARRIVAL & LIFE CYCLE ENGINE
     ========================================================================== */
  var GUEST_NAMES = [
    'Emily (นักท่องเที่ยว)', 'Leo (นักธุรกิจ)', 'Aria (อินฟลูเอนเซอร์)',
    'Kenji (แบ็กแพกเกอร์)', 'Chloe (แฟชั่นนิสต้า)', 'Lucas (นักชิม)',
    'Maya (ศิลปิน)', 'Oliver (เซเลบริตี้)', 'Nadia (VIP)', 'Boba Seal (VIP)'
  ];
  var GUEST_AVATARS = ['👩‍🦰', '👨‍💼', '👩‍🎤', '🧑‍🌾', '👱‍♀️', '👨‍🍳', '👩‍🎨', '🤵', '🌸', '🦭'];

  function spawnGuestArrival() {
    // Check if there is any available ready room
    var availableRooms = [];
    STATE.floors.forEach(function (fl, flIdx) {
      fl.rooms.forEach(function (r) {
        if (r.type !== 'empty' && r.type !== 'lobby' && r.status === 'ready' && !r.occupant) {
          availableRooms.push({ floorIdx: flIdx, room: r });
        }
      });
    });

    if (availableRooms.length === 0) return; // Hotel full

    var target = availableRooms[Math.floor(Math.random() * availableRooms.length)];
    var randIdx = Math.floor(Math.random() * GUEST_NAMES.length);

    var guest = {
      id: 'g_' + Date.now(),
      name: GUEST_NAMES[randIdx],
      avatar: GUEST_AVATARS[randIdx],
      assignedRoom: target.room,
      assignedFloorIdx: target.floorIdx,
      posX: 60 + Math.random() * 40
    };

    // Elevator picks up guest
    animateElevatorAndCheckIn(guest, target.floorIdx, target.room);
  }

  function animateElevatorAndCheckIn(guest, floorIdx, room) {
    // Elevator arrives at Ground (0)
    STATE.elevatorPos = 0;
    STATE.elevatorGuestAvatar = guest.avatar;
    Snd.play('bell');

    setTimeout(function () {
      // Elevator ascends to target floor
      STATE.elevatorPos = floorIdx;
      renderHotelFloors();
      Snd.play('ding');

      setTimeout(function () {
        // Guest checks into room
        room.occupant = guest;
        room.status = 'occupied';
        STATE.elevatorGuestAvatar = null;
        renderHotelFloors();

        // Guest stays for duration
        var def = ROOM_TYPES[room.type] || { stayDuration: 14000, payout: 60 };
        setTimeout(function () {
          // Checkout
          room.occupant = null;
          room.status = 'checkout';
          room.coinsReady = def.payout;
          renderHotelFloors();
        }, def.stayDuration);

      }, 800);
    }, 600);
  }

  /* ==========================================================================
     7. BUILD SHOP & ROOM EXPANSION
     ========================================================================== */
  function openBuildShop() {
    var modal = $('buildShopModal');
    if (!modal) return;
    modal.classList.add('open');
    renderShopItems('bedrooms');
  }

  function closeBuildShop() {
    var modal = $('buildShopModal');
    if (!modal) return;
    modal.classList.remove('open');
    STATE.selectedSlotToBuild = null;
  }

  function renderShopItems(cat) {
    var grid = $('shopItemsGrid');
    if (!grid) return;

    var html = '';
    Object.keys(ROOM_TYPES).forEach(function (typeId) {
      var item = ROOM_TYPES[typeId];
      if (item.category !== cat) return;

      var canAfford = (STATE.coins >= item.costCoins && STATE.cash >= item.costCash);

      html += '<div class="shop-card" data-room-type="' + typeId + '">';
      html += '<div class="shop-card-icon">' + item.icon + '</div>';
      html += '<div class="shop-card-name">' + item.name + '</div>';
      html += '<div class="shop-card-income">รายได้: 🪙 +' + item.payout + ' / พัก</div>';
      html += '<div class="shop-card-cost">🪙 ' + item.costCoins.toLocaleString() + (item.costCash > 0 ? ' + ⭐ ' + item.costCash : '') + '</div>';
      html += '<button class="btn-primary" style="margin-top:6px;padding:6px 12px;font-size:0.8rem" ' + (canAfford ? '' : 'disabled') + '>สร้างห้องนี้</button>';
      html += '</div>';
    });

    grid.innerHTML = html;

    grid.querySelectorAll('.shop-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var typeId = card.dataset.roomType;
        executeBuildRoom(typeId);
      });
    });
  }

  function executeBuildRoom(typeId) {
    var def = ROOM_TYPES[typeId];
    if (!def) return;

    if (STATE.coins < def.costCoins || STATE.cash < def.costCash) {
      showToast('❌ เหรียญไม่เพียงพอสำหรับการสร้างห้องนี้!');
      return;
    }

    // Find slot to build
    var targetSlot = STATE.selectedSlotToBuild;
    if (!targetSlot) {
      // Find first empty slot
      for (var f = 0; f < STATE.floors.length; f++) {
        var fl = STATE.floors[f];
        for (var r = 0; r < fl.rooms.length; r++) {
          if (fl.rooms[r].type === 'empty') {
            targetSlot = { floorIdx: f, roomId: fl.rooms[r].id };
            break;
          }
        }
        if (targetSlot) break;
      }
    }

    if (!targetSlot) {
      showToast('⚠️ โรงแรมไม่มีพื้นที่ว่างแล้ว! กรุณากด "⬆️ ต่อชั้นเพิ่ม" ก่อนนะจ๊ะ');
      closeBuildShop();
      return;
    }

    // Deduct coins & cash
    STATE.coins -= def.costCoins;
    STATE.cash -= def.costCash;

    var floor = STATE.floors[targetSlot.floorIdx];
    var room = floor.rooms.find(function (r) { return r.id === targetSlot.roomId; });
    if (room) {
      room.type = typeId;
      room.status = 'ready';
      room.occupant = null;
      room.coinsReady = 0;
    }

    addXP(def.xp);
    Snd.play('fanfare');
    showToast('🎉 สร้าง ' + def.name + ' เสร็จสมบูรณ์แล้ว!');
    closeBuildShop();
    renderHotelFloors();
    saveGameState();
  }

  /* ADD NEW FLOOR (ต่อชั้นเพิ่ม) */
  function addNewFloor() {
    var floorCost = (STATE.floors.length) * 1200;
    if (STATE.coins < floorCost) {
      showToast('❌ ต้องการ 🪙 ' + floorCost.toLocaleString() + ' เหรียญเพื่อสร้างชั้นใหม่!');
      return;
    }

    STATE.coins -= floorCost;
    var newFloorNum = STATE.floors.length + 1;
    var newFloor = {
      floorNum: newFloorNum,
      isGround: false,
      rooms: [
        { id: 'f' + newFloorNum + '_r1', type: 'empty', status: 'empty' },
        { id: 'f' + newFloorNum + '_r2', type: 'empty', status: 'empty' }
      ]
    };

    STATE.floors.push(newFloor);
    addXP(100);
    Snd.play('fanfare');
    showToast('🏗️ สร้างชั้น ' + newFloorNum + ' เพิ่มขึ้นสำเร็จ! ขยายโรงแรมอลังการขึ้นแล้ว!');
    renderHotelFloors();
    saveGameState();
  }

  /* QUICK CLEAN ALL DIRTY ROOMS */
  function cleanAllDirtyRooms() {
    var cleanedCount = 0;
    STATE.floors.forEach(function (fl) {
      fl.rooms.forEach(function (r) {
        if (r.status === 'dirty') {
          r.status = 'ready';
          cleanedCount++;
        }
      });
    });

    if (cleanedCount > 0) {
      Snd.play('clean');
      addXP(cleanedCount * 12);
      showToast('✨ แม่บ้านทำความสะอาดครบ ' + cleanedCount + ' ห้องเรียบร้อยแล้ว!');
      renderHotelFloors();
      saveGameState();
    } else {
      showToast('🧹 ทุกล็อบบี้และห้องพักสะอาดเอี่ยมอยู่แล้วจ้า!');
    }
  }

  /* ==========================================================================
     8. VIP GUESTS (SPECIAL GUESTS FROM NADIA PLAYGROUND)
     ========================================================================== */
  var VIP_ROSTER = [
    { id: 'vip_nadia', name: 'Nadia (VIP Guest of Honor)', avatar: '🌸', tip: 800, desc: 'แขกคนพิเศษระดับโกลด์การ์ด ทิปหนัก 800 เหรียญ!' },
    { id: 'vip_boba', name: 'Boba Seal (น้องอุ๋งโบโบ้)', avatar: '🦭', tip: 500, desc: 'น้องแมวน้ำตาดำมุก ชอบแช่สระว่ายน้ำ ทิป 500 เหรียญ!' },
    { id: 'vip_dogney', name: 'Dogney Pup (น้องหมาโกลเด้น)', avatar: '🐶', tip: 450, desc: 'ลูกหมาโกลเด้นหางดุ๊กดิ๊ก ทิป 450 เหรียญ!' },
    { id: 'vip_sockney', name: 'Sockney Plush (น้องถุงเท้า)', avatar: '🧦', tip: 400, desc: 'น้องถุงเท้าสุดคิ้วท์สไตล์ Sanrio ทิป 400 เหรียญ!' },
    { id: 'vip_puffy', name: 'Puffy Cat (น้องแมวพัฟฟี่)', avatar: '🐱', tip: 450, desc: 'แมวส้มตาโต อ้อนเก่ง ทิป 450 เหรียญ!' }
  ];

  function openVipModal() {
    var modal = $('vipModal');
    if (!modal) return;
    modal.classList.add('open');

    var grid = $('vipGrid');
    if (!grid) return;

    var html = '';
    VIP_ROSTER.forEach(function (vip) {
      html += '<div class="vip-card" onclick="window.inviteVipGuest(\'' + vip.id + '\')">';
      html += '<div class="vip-avatar">' + vip.avatar + '</div>';
      html += '<div class="vip-name">' + vip.name + '</div>';
      html += '<div style="font-size:0.75rem;color:var(--ink-soft)">' + vip.desc + '</div>';
      html += '<button class="btn-invite-pill" style="margin-top:6px">เชิญมาพักเลย 👑</button>';
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  window.inviteVipGuest = function (vipId) {
    var vip = VIP_ROSTER.find(function (v) { return v.id === vipId; });
    if (!vip) return;

    // Find best suite or room
    var bestRoom = null;
    var bestFloorIdx = 0;
    for (var f = STATE.floors.length - 1; f >= 0; f--) {
      var fl = STATE.floors[f];
      for (var r = 0; r < fl.rooms.length; r++) {
        var rm = fl.rooms[r];
        if (rm.type !== 'empty' && rm.type !== 'lobby' && rm.status === 'ready' && !rm.occupant) {
          bestRoom = rm;
          bestFloorIdx = f;
          break;
        }
      }
      if (bestRoom) break;
    }

    if (!bestRoom) {
      showToast('⚠️ โรงแรมเต็มแล้ว! กรุณาทำความสะอาดห้องหรือสร้างห้องเพิ่มนะจ๊ะ');
      return;
    }

    $('vipModal').classList.remove('open');
    Snd.play('fanfare');

    var vipGuest = {
      id: 'vip_' + Date.now(),
      name: vip.name,
      avatar: vip.avatar,
      isVip: true
    };

    animateElevatorAndCheckIn(vipGuest, bestFloorIdx, bestRoom);
    showToast('👑 ' + vip.name + ' นั่งรถลีมูซีนมาถึงโรงแรมแล้ว! (+ทิปพิเศษ ' + vip.tip + ' เหรียญ)');

    // Award bonus VIP tip
    setTimeout(function () {
      addCoins(vip.tip);
      addXP(150);
      Snd.play('coin');
    }, 4000);
  };

  /* ==========================================================================
     9. STAFF MANAGEMENT & HIRES
     ========================================================================== */
  var STAFF_CATALOG = [
    { key: 'receptionist', name: 'คุณโรเบิร์ต (Front Desk Bellhop)', avatar: '🛎️', desc: 'ต้อนรับแขกและแจกคีย์การ์ดรวดเร็วขึ้น 2 เท่า', cost: 0, hired: true },
    { key: 'maid', name: 'แม่บ้านคลีโอ (Housekeeper Maid)', avatar: '🧹', desc: 'ทำความสะอาดห้องที่สกปรกให้อัตโนมัติทุกๆ 10 วินาที', cost: 800, hired: false },
    { key: 'lifeguard', name: 'ครูสอนว่ายน้ำฟินน์ (Pool Lifeguard)', avatar: '🏊', desc: 'ดูแลสระว่ายน้ำ เพิ่มรายได้สระว่ายน้ำขึ้น +30%', cost: 1000, hired: false },
    { key: 'chef', name: 'เชฟปิแอร์ (Executive Chef)', avatar: '👨‍🍳', desc: 'เสิร์ฟอาหารจานหรู เพิ่มรายได้ห้องอาหารขึ้น +40%', cost: 1500, hired: false }
  ];

  function openStaffModal() {
    var modal = $('staffModal');
    if (!modal) return;
    modal.classList.add('open');

    var list = $('staffListContainer');
    if (!list) return;

    var html = '';
    STAFF_CATALOG.forEach(function (st) {
      var isHired = STATE.staff[st.key];
      html += '<div class="staff-row">';
      html += '<div class="staff-avatar">' + st.avatar + '</div>';
      html += '<div class="staff-info">';
      html += '<div class="staff-name">' + st.name + '</div>';
      html += '<div class="staff-desc">' + st.desc + '</div>';
      html += '</div>';
      if (isHired) {
        html += '<span style="font-weight:900;color:#2d6a4f;font-size:0.85rem">✅ ประจำการอยู่</span>';
      } else {
        html += '<button class="btn-hire" onclick="window.hireStaff(\'' + st.key + '\',' + st.cost + ')">จ้างงาน (🪙 ' + st.cost + ')</button>';
      }
      html += '</div>';
    });
    list.innerHTML = html;
  }

  window.hireStaff = function (key, cost) {
    if (STATE.coins < cost) {
      showToast('❌ เหรียญไม่เพียงพอสำหรับการจ้างพนักงานคนนี้!');
      return;
    }
    STATE.coins -= cost;
    STATE.staff[key] = true;
    Snd.play('fanfare');
    showToast('🎉 จ้างพนักงานคนใหม่เรียบร้อยแล้ว!');
    openStaffModal();
    saveGameState();
  };

  /* AUTO MAID CLEANER LOOP */
  setInterval(function () {
    if (STATE.staff && STATE.staff.maid) {
      var foundDirty = false;
      STATE.floors.forEach(function (fl) {
        fl.rooms.forEach(function (r) {
          if (!foundDirty && r.status === 'dirty') {
            r.status = 'ready';
            foundDirty = true;
          }
        });
      });
      if (foundDirty) {
        renderHotelFloors();
        saveGameState();
      }
    }
  }, 9000);

  /* GUEST ARRIVAL AUTO-SPAWN LOOP */
  setInterval(function () {
    spawnGuestArrival();
  }, 7500);

  /* ==========================================================================
     10. HOTEL RENAMING
     ========================================================================== */
  function openRenameModal() {
    var modal = $('renameModal');
    var input = $('hotelNameInput');
    if (!modal || !input) return;
    input.value = STATE.hotelName;
    modal.classList.add('open');
    input.focus();
  }

  function saveHotelName() {
    var input = $('hotelNameInput');
    if (!input) return;
    var val = (input.value || '').trim();
    if (val) {
      STATE.hotelName = val;
      updateHUD();
      saveGameState();
      Snd.play('ding');
      showToast('✨ เปลี่ยนชื่อโรงแรมเป็น "' + val + '" เรียบร้อยแล้ว!');
    }
    $('renameModal').classList.remove('open');
  }

  /* ==========================================================================
     11. TOAST NOTIFICATIONS & FX
     ========================================================================== */
  function showToast(msg) {
    var t = $('hotelToast');
    var txt = $('toastMsg');
    if (!t || !txt) return;
    txt.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.classList.remove('show');
    }, 2800);
  }

  function spawnCoinParticle(x, y, amt) {
    var fx = $('fxLayer');
    if (!fx) return;
    var c = document.createElement('div');
    c.className = 'floating-coin-fx';
    c.textContent = '🪙 +' + amt;
    c.style.left = (x - 20) + 'px';
    c.style.top = (y - 30) + 'px';
    fx.appendChild(c);
    setTimeout(function () { c.remove(); }, 1200);
  }

  /* ==========================================================================
     12. PASSWORD GATE & AUTHENTICATION (PASSWORD: "larny")
     ========================================================================== */
  function isHotelAuthed() {
    try {
      var a = (localStorage.getItem('hotel_city_auth') || '').toLowerCase();
      var b = (localStorage.getItem('nadiaplayground_auth') || '').toLowerCase();
      return (a === 'larny' || b === 'larny');
    } catch (e) {
      return false;
    }
  }

  function setupPasswordGate() {
    var overlay = $('gateOverlay');
    var input = $('gatePass');
    var btn = $('gateBtn');
    var err = $('gateErr');
    var box = $('gateBox');
    if (!overlay || !input || !btn) return;

    if (!isHotelAuthed()) {
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(function () { input.focus(); }, 150);
    } else {
      overlay.style.display = 'none';
    }

    function tryUnlock() {
      var val = (input.value || '').trim().toLowerCase();
      // Capital-insensitive check: "larny", "Larny", "LARNY"
      if (val === 'larny') {
        try {
          localStorage.setItem('hotel_city_auth', 'larny');
          localStorage.setItem('nadiaplayground_auth', 'larny');
        } catch (e) {}

        Snd.play('keycard');
        overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.05)';
        document.body.style.overflow = '';
        setTimeout(function () {
          overlay.style.display = 'none';
        }, 300);
        showToast('🔑 ยินดีต้อนรับสู่ ' + STATE.hotelName + '!');
      } else {
        if (err) err.style.display = 'block';
        if (box) {
          box.style.animation = 'gateShake 0.4s ease';
          setTimeout(function () { box.style.animation = ''; }, 400);
        }
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryUnlock();
    });

    var relockBtn = $('btnRelockHotel');
    if (relockBtn) {
      relockBtn.addEventListener('click', function () {
        try {
          localStorage.removeItem('hotel_city_auth');
          localStorage.removeItem('nadiaplayground_auth');
        } catch (e) {}
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        overlay.style.transform = 'none';
        document.body.style.overflow = 'hidden';
        if (err) err.style.display = 'none';
        input.value = '';
        input.focus();
      });
    }
  }

  /* ==========================================================================
     13. INITIALIZATION & EVENT LISTENERS
     ========================================================================== */
  function setupEventListeners() {
    // Sound Toggle
    var btnAudio = $('btnAudioToggle');
    if (btnAudio) {
      btnAudio.textContent = Snd.isEnabled() ? '🔊' : '🔇';
      btnAudio.addEventListener('click', function () {
        var next = !Snd.isEnabled();
        Snd.setEnabled(next);
        btnAudio.textContent = next ? '🔊' : '🔇';
        if (next) Snd.play('ding');
      });
    }

    // Day / Night Toggle
    var btnDayNight = $('btnDayNightToggle');
    if (btnDayNight) {
      btnDayNight.addEventListener('click', function () {
        STATE.isNight = !STATE.isNight;
        var sky = $('skyBg');
        if (sky) sky.classList.toggle('night', STATE.isNight);
        btnDayNight.textContent = STATE.isNight ? '☀️' : '🌙';
        Snd.play('bell');
        renderHotelFloors();
        saveGameState();
      });
    }

    // Neon Sign Click to Rename
    var neonSign = $('neonSignBtn');
    if (neonSign) neonSign.addEventListener('click', openRenameModal);

    var btnSaveName = $('btnSaveHotelName');
    if (btnSaveName) btnSaveName.addEventListener('click', saveHotelName);

    var closeRename = $('closeRenameModal');
    if (closeRename) closeRename.addEventListener('click', function () {
      $('renameModal').classList.remove('open');
    });

    // Toolbar Buttons
    var btnBuild = $('btnOpenBuildShop');
    if (btnBuild) btnBuild.addEventListener('click', openBuildShop);

    var closeBuild = $('closeBuildShop');
    if (closeBuild) closeBuild.addEventListener('click', closeBuildShop);

    var btnAddFl = $('btnAddFloor');
    if (btnAddFl) btnAddFl.addEventListener('click', addNewFloor);

    var btnClean = $('btnQuickCleanAll');
    if (btnClean) btnClean.addEventListener('click', cleanAllDirtyRooms);

    var btnStaff = $('btnOpenStaffModal');
    if (btnStaff) btnStaff.addEventListener('click', openStaffModal);

    var closeStaff = $('closeStaffModal');
    if (closeStaff) closeStaff.addEventListener('click', function () {
      $('staffModal').classList.remove('open');
    });

    var btnVip = $('btnInviteVIP');
    if (btnVip) btnVip.addEventListener('click', openVipModal);

    var closeVip = $('closeVipModal');
    if (closeVip) closeVip.addEventListener('click', function () {
      $('vipModal').classList.remove('open');
    });

    // Shop Category Tabs
    var shopTabs = document.querySelectorAll('.shop-tab');
    shopTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        shopTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        renderShopItems(tab.dataset.cat);
        Snd.play('ding');
      });
    });
  }

  function init() {
    loadGameState();
    setupPasswordGate();
    renderHotelFloors();
    updateHUD();
    setupEventListeners();

    // Initial guest arrivals after warm-up
    setTimeout(function () {
      spawnGuestArrival();
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
