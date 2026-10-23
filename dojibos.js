/**
 * The Dojibos — 1v1 Mini Football
 * Authentic, cute, arcade 1-a-side soccer for Nadia Playground.
 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ==========================================================================
     1. WEB AUDIO SYNTHESIZER
     ========================================================================== */
  var Snd = (function () {
    var ctx = null;
    var enabled = true;

    function getCtx() {
      if (!ctx && typeof AudioContext !== 'undefined') ctx = new AudioContext();
      if (!ctx && typeof webkitAudioContext !== 'undefined') ctx = new webkitAudioContext();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      return ctx;
    }

    function play(kind) {
      if (!enabled) return;
      try {
        var c = getCtx();
        if (!c) return;
        var now = c.currentTime;

        if (kind === 'kick') {
          // Punchy low thud
          var o = c.createOscillator(), g = c.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(180, now);
          o.frequency.exponentialRampToValueAtTime(45, now + 0.12);
          g.gain.setValueAtTime(0.3, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          o.connect(g); g.connect(c.destination);
          o.start(now); o.stop(now + 0.15);
        } else if (kind === 'whistle') {
          // Referee whistle (two chirps)
          [2400, 2600].forEach(function (f, i) {
            var o = c.createOscillator(), g = c.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(f, now + i * 0.12);
            g.gain.setValueAtTime(0.18, now + i * 0.12);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);
            o.connect(g); g.connect(c.destination);
            o.start(now + i * 0.12); o.stop(now + i * 0.12 + 0.11);
          });
        } else if (kind === 'crossbar') {
          // Metallic ping
          var oP = c.createOscillator(), gP = c.createGain();
          oP.type = 'sine';
          oP.frequency.setValueAtTime(1050, now);
          gP.gain.setValueAtTime(0.25, now);
          gP.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          oP.connect(gP); gP.connect(c.destination);
          oP.start(now); oP.stop(now + 0.36);
        } else if (kind === 'goal') {
          // Stadium Goal Airhorn & Fanfare
          [440, 554, 659, 880].forEach(function (f, i) {
            var oG = c.createOscillator(), gG = c.createGain();
            oG.type = 'sawtooth';
            oG.frequency.setValueAtTime(f, now + i * 0.08);
            gG.gain.setValueAtTime(0.18, now + i * 0.08);
            gG.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
            oG.connect(gG); gG.connect(c.destination);
            oG.start(now + i * 0.08); oG.stop(now + i * 0.08 + 0.65);
          });
        } else if (kind === 'super') {
          // Super Shot Energy Charge & Blast
          var oS = c.createOscillator(), gS = c.createGain();
          oS.type = 'sawtooth';
          oS.frequency.setValueAtTime(300, now);
          oS.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
          gS.gain.setValueAtTime(0.28, now);
          gS.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          oS.connect(gS); gS.connect(c.destination);
          oS.start(now); oS.stop(now + 0.42);
        } else if (kind === 'jump') {
          var oJ = c.createOscillator(), gJ = c.createGain();
          oJ.type = 'sine';
          oJ.frequency.setValueAtTime(220, now);
          oJ.frequency.exponentialRampToValueAtTime(480, now + 0.12);
          gJ.gain.setValueAtTime(0.12, now);
          gJ.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
          oJ.connect(gJ); gJ.connect(c.destination);
          oJ.start(now); oJ.stop(now + 0.14);
        }
      } catch (e) {}
    }

    return {
      play: play,
      isEnabled: function () { return enabled; },
      setEnabled: function (v) { enabled = !!v; }
    };
  })();

  /* ==========================================================================
     2. CHARACTER ROSTER DEFINITIONS
     ========================================================================== */
  var CHARACTERS = [
    {
      id: 'doji_dog',
      name: 'Doji Dog 🐶',
      avatar: '🐶',
      jerseyColor: '#ffd166',
      numberColor: '#1d3557',
      speed: 5.0,
      jumpForce: 11.2,
      kickPower: 12.5,
      trait: 'กัปตันทีมสมดุลรอบด้าน',
      superName: '🚀 Rocket Blast',
      superColor: '#ffaa00'
    },
    {
      id: 'boba_seal',
      name: 'Boba Seal 🦭',
      avatar: '🦭',
      jerseyColor: '#7bdff2',
      numberColor: '#03045e',
      speed: 4.6,
      jumpForce: 10.5,
      kickPower: 14.5,
      trait: 'จอมพลังลูกหนัก ยิงไซด์โค้ง',
      superName: '🌊 Tidal Wave',
      superColor: '#0077b6'
    },
    {
      id: 'sockney',
      name: 'Sockney 🧦',
      avatar: '🧦',
      jerseyColor: '#ff70a6',
      numberColor: '#7209b7',
      speed: 5.3,
      jumpForce: 12.8,
      kickPower: 11.8,
      trait: 'กระโดดสูง ว่องไวสายฟ้า',
      superName: '⚡ Lightning Zap',
      superColor: '#ffd60a'
    },
    {
      id: 'dogney',
      name: 'Dogney Pup 🐕',
      avatar: '🐕',
      jerseyColor: '#e63946',
      numberColor: '#ffffff',
      speed: 5.6,
      jumpForce: 11.0,
      kickPower: 12.2,
      trait: 'สปรินต์ฉับไว เลี้ยงบอลติดเท้า',
      superName: '🔥 Flaming Tornado',
      superColor: '#ff4d6d'
    },
    {
      id: 'nadia_star',
      name: 'Nadia Star ⭐',
      avatar: '⭐',
      jerseyColor: '#d6336c',
      numberColor: '#fff',
      speed: 5.2,
      jumpForce: 11.6,
      kickPower: 13.5,
      trait: 'ดาวเด่นฟุตบอล เทคนิค 5 ดาว',
      superName: '🌈 Rainbow Meteor',
      superColor: '#9b5de5'
    }
  ];

  var AI_NAMES = ['Robo-Bibo 🤖', 'Captain Bounce 🦘', 'Professor Kick 🦉', 'Striker Cat 🐱', 'Super Doji 🦁'];

  /* ==========================================================================
     3. 10-LEVEL DIFFICULTY SETTINGS (ระดับ 1 ถึง 10 โหดนรกแตก)
     ========================================================================== */
  var DIFFICULTIES = [
    {
      level: 1,
      name: 'ระดับ 1 (ง่ายมาก - Beginner)',
      shortName: '🟢 เลเวล 1 (ง่ายมาก)',
      icon: '🟢',
      badgeColor: '#2b9348',
      tagText: 'ง่ายมาก',
      aiSpeed: 2.0,
      aiJumpChance: 0.03,
      aiKickPower: 6.5,
      aiKickChance: 0.15,
      aiSuperChance: 0.0,
      desc: 'เหมาะสำหรับทุกคน ยิงสบาย AI เดินช้าและแทบไม่กระโดดขวาง'
    },
    {
      level: 2,
      name: 'ระดับ 2 (มือใหม่ - Novice)',
      shortName: '🟢 เลเวล 2 (มือใหม่)',
      icon: '🟢',
      badgeColor: '#10b981',
      tagText: 'มือใหม่',
      aiSpeed: 2.6,
      aiJumpChance: 0.08,
      aiKickPower: 7.6,
      aiKickChance: 0.22,
      aiSuperChance: 0.05,
      desc: 'AI เริ่มขยับตามบอลช้าๆ เว้นระยะห่างสบายๆ เหมาะกับการวอร์มอัป'
    },
    {
      level: 3,
      name: 'ระดับ 3 (ง่าย - Amateur)',
      shortName: '🟡 เลเวล 3 (ง่าย)',
      icon: '🟡',
      badgeColor: '#eab308',
      tagText: 'ง่าย',
      aiSpeed: 3.2,
      aiJumpChance: 0.14,
      aiKickPower: 8.8,
      aiKickChance: 0.30,
      aiSuperChance: 0.12,
      desc: 'เริ่มมีการสกัดบอลเบาๆ ขยับตามบอลพอดีๆ เหมาะกับฝึกซ้อม'
    },
    {
      level: 4,
      name: 'ระดับ 4 (ทั่วไป - Casual)',
      shortName: '🟡 เลเวล 4 (ทั่วไป)',
      icon: '🟡',
      badgeColor: '#f59e0b',
      tagText: 'ทั่วไป',
      aiSpeed: 3.8,
      aiJumpChance: 0.20,
      aiKickPower: 10.0,
      aiKickChance: 0.38,
      aiSuperChance: 0.22,
      desc: 'ระดับมาตรฐานเล่นสบาย มีทั้งรับและรุกพอเหมาะ'
    },
    {
      level: 5,
      name: 'ระดับ 5 (ปานกลาง - Semi-Pro)',
      shortName: '🟠 เลเวล 5 (ปานกลาง)',
      icon: '🟠',
      badgeColor: '#f97316',
      tagText: 'ปานกลาง',
      aiSpeed: 4.4,
      aiJumpChance: 0.26,
      aiKickPower: 11.2,
      aiKickChance: 0.45,
      aiSuperChance: 0.35,
      desc: 'ความท้าทายระดับปานกลาง สู้กันสูสี มีทั้งบล็อกและยิงสวนกลับ'
    },
    {
      level: 6,
      name: 'ระดับ 6 (ชำนาญ - Veteran)',
      shortName: '🟠 เลเวล 6 (ชำนาญ)',
      icon: '🟠',
      badgeColor: '#ea580c',
      tagText: 'ชำนาญ',
      aiSpeed: 5.0,
      aiJumpChance: 0.33,
      aiKickPower: 12.5,
      aiKickChance: 0.52,
      aiSuperChance: 0.48,
      desc: 'บอทวิ่งไวเท่าผู้เล่น อ่านทิศทางบอลไว สกัดลูกโด่งแม่นยำ'
    },
    {
      level: 7,
      name: 'ระดับ 7 (ยาก - Professional)',
      shortName: '🔴 เลเวล 7 (ยาก)',
      icon: '🔴',
      badgeColor: '#ef4444',
      tagText: 'ยาก',
      aiSpeed: 5.6,
      aiJumpChance: 0.40,
      aiKickPower: 13.8,
      aiKickChance: 0.60,
      aiSuperChance: 0.62,
      desc: 'AI ว่องไว ดักสกัดลูกโด่งฉับไว ยิงสวนกลับอันตราย'
    },
    {
      level: 8,
      name: 'ระดับ 8 (ยากมาก - World Class)',
      shortName: '🔴 เลเวล 8 (ยากมาก)',
      icon: '🔴',
      badgeColor: '#dc2626',
      tagText: 'ยากมาก',
      aiSpeed: 6.2,
      aiJumpChance: 0.48,
      aiKickPower: 15.2,
      aiKickChance: 0.68,
      aiSuperChance: 0.75,
      desc: 'ระดับโลก วิ่งไวกว่าผู้เล่น ดักโหม่งกลางอากาศ ซัดเต็มข้อ'
    },
    {
      level: 9,
      name: 'ระดับ 9 (ตำนาน - Legend)',
      shortName: '🟣 เลเวล 9 (ตำนาน)',
      icon: '🟣',
      badgeColor: '#7c3aed',
      tagText: 'ตำนาน',
      aiSpeed: 6.8,
      aiJumpChance: 0.58,
      aiKickPower: 16.8,
      aiKickChance: 0.78,
      aiSuperChance: 0.88,
      desc: 'บอสระดับตำนาน ไวปานสายฟ้า ดักทุกลูก เล็งมุมแม่นยำ!'
    },
    {
      level: 10,
      name: 'ระดับ 10 (ไร้เทียมทาน - Godlike 💀)',
      shortName: '💀 เลเวล 10 (ไร้เทียมทาน)',
      icon: '💀',
      badgeColor: '#0f172a',
      tagText: 'โหดนรกแตก 💀',
      aiSpeed: 7.5,
      aiJumpChance: 0.70,
      aiKickPower: 18.5,
      aiKickChance: 0.90,
      aiSuperChance: 0.98,
      desc: 'โหดนรกแตก! สปีดปีศาจ ดักสกัดทุกลูกเตะ โหม่งพุ่งชน และซัดไม้ตายทะลวงตาข่าย!'
    }
  ];

  /* ==========================================================================
     4. GAME STATE & ONLINE 2-PLAYER STATE
     ========================================================================== */
  var STATE = {
    coins: 500,
    trophies: 0,
    selectedCharId: 'doji_dog',
    difficulty: 1, // Default Level 1 (Beginner) for an easy, fun experience
    p1Score: 0,
    p2Score: 0,
    timer: 60,
    isMatchRunning: false,
    isGoalPaused: false,
    p1SuperEnergy: 0,
    p2SuperEnergy: 0,
    aiOpponentIndex: 0
  };

  var ONLINE = {
    isOnline: false,
    isHost: false,
    peer: null,
    conn: null,
    roomCode: '',
    hostCharId: 'doji_dog',
    guestCharId: 'nadia_star',
    remotePlayerName: 'นาเดีย (P2)',
    remotePlayerCharId: 'nadia_star',
    guestKeys: { left: false, right: false, jump: false, kick: false, super: false },
    lastInputSentTime: 0,
    lastSentKeys: null
  };

  function getP1CharDef() {
    if (ONLINE.isOnline) {
      var id = ONLINE.isHost ? STATE.selectedCharId : (ONLINE.hostCharId || 'doji_dog');
      return CHARACTERS.find(function (c) { return c.id === id; }) || CHARACTERS[0];
    }
    return getSelectedChar();
  }

  function getP2CharDef() {
    if (ONLINE.isOnline) {
      var id = ONLINE.isHost ? (ONLINE.guestCharId || 'nadia_star') : STATE.selectedCharId;
      return CHARACTERS.find(function (c) { return c.id === id; }) || CHARACTERS[4];
    }
    return { avatar: '🤖', jerseyColor: '#e63946', name: AI_NAMES[STATE.aiOpponentIndex] };
  }

  function loadSavedData() {
    var raw = lsGet('dojibos_save_v1');
    if (raw) {
      try {
        var d = JSON.parse(raw);
        if (typeof d.coins === 'number') STATE.coins = d.coins;
        if (typeof d.trophies === 'number') STATE.trophies = d.trophies;
        if (d.selectedCharId) STATE.selectedCharId = d.selectedCharId;
        if (typeof d.difficulty === 'number' && d.difficulty >= 1 && d.difficulty <= 10) {
          STATE.difficulty = d.difficulty;
        }
      } catch (e) {}
    }
  }

  function saveGameData() {
    lsSet('dojibos_save_v1', JSON.stringify({
      coins: STATE.coins,
      trophies: STATE.trophies,
      selectedCharId: STATE.selectedCharId,
      difficulty: STATE.difficulty
    }));
  }

  function getSelectedChar() {
    return CHARACTERS.find(function (c) { return c.id === STATE.selectedCharId; }) || CHARACTERS[0];
  }

  function getCurrentDifficulty() {
    return DIFFICULTIES.find(function (d) { return d.level === STATE.difficulty; }) || DIFFICULTIES[0];
  }

  function updateDifficultyUI() {
    var diff = getCurrentDifficulty();
    var iconEl = $('diffPillIcon');
    var textEl = $('diffPillText');
    if (iconEl) iconEl.textContent = diff.icon;
    if (textEl) textEl.textContent = diff.name.split(' (')[0] + ' (' + diff.tagText + ')';

    // Highlight the active button in the quick difficulty bar above pitch
    var btns = document.querySelectorAll('.quick-diff-btn');
    btns.forEach(function (btn) {
      var lvl = parseInt(btn.dataset.lvl, 10);
      if (lvl === STATE.difficulty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Also update diff cards inside modal if open
    var cards = document.querySelectorAll('.diff-card');
    cards.forEach(function (card, idx) {
      if (idx + 1 === STATE.difficulty) card.classList.add('active');
      else card.classList.remove('active');
    });
  }

  /* ==========================================================================
     4. 2D ARCADE FOOTBALL PHYSICS ENGINE
     ========================================================================== */
  var canvas, ctx;
  var W = 960, H = 540;
  var GROUND_Y = 465;
  var GOAL_W = 75;
  var GOAL_H = 175;
  var GOAL_TOP_Y = GROUND_Y - GOAL_H;

  // Ball
  var ball = {
    x: W / 2,
    y: 200,
    vx: 0,
    vy: 0,
    radius: 16,
    rotation: 0,
    isSuper: false,
    superColor: '#fff',
    trail: []
  };

  // Players
  var p1 = {
    x: 220,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    radius: 32,
    isGrounded: true,
    facing: 1, // 1 = right, -1 = left
    kickAngle: 0,
    isKicking: false,
    kickTimer: 0,
    scaleX: 1,
    scaleY: 1,
    tilt: 0,
    bob: 0
  };

  var p2 = {
    x: W - 220,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    radius: 32,
    isGrounded: true,
    facing: -1,
    kickAngle: 0,
    isKicking: false,
    kickTimer: 0,
    scaleX: 1,
    scaleY: 1,
    tilt: 0,
    bob: 0
  };

  // Input states
  var keys = {
    left: false,
    right: false,
    jump: false,
    kick: false,
    super: false
  };

  /* RESET BALL & POSITIONS - ALWAYS FAIR DEAD-CENTER DROP */
  function resetPositions(scorer) {
    p1.x = 220;
    p1.y = GROUND_Y;
    p1.vx = 0; p1.vy = 0;
    p1.facing = 1;
    p1.scaleX = 1; p1.scaleY = 1; p1.tilt = 0; p1.bob = 0;

    p2.x = W - 220;
    p2.y = GROUND_Y;
    p2.vx = 0; p2.vy = 0;
    p2.facing = -1;
    p2.scaleX = 1; p2.scaleY = 1; p2.tilt = 0; p2.bob = 0;

    // ponytail: Drop strictly dead center (x = W/2 = 480) with zero horizontal velocity (vx = 0)
    // so both players have an equal, completely neutral sprint to the ball without any bias.
    ball.x = W / 2;
    ball.y = 120;
    ball.vx = 0;
    ball.vy = 0;
    ball.rotation = 0;
    ball.isSuper = false;
    ball.trail = [];
  }

  /* KICK OFF COUNTDOWN */
  function startKickoffSequence(onComplete) {
    var overlay = $('kickoffOverlay');
    var numEl = $('kickoffNum');
    if (!overlay || !numEl) {
      if (onComplete) onComplete();
      return;
    }

    var count = 3;
    overlay.style.display = 'flex';
    numEl.textContent = count;
    Snd.play('whistle');

    var timer = setInterval(function () {
      count--;
      if (count > 0) {
        numEl.textContent = count;
        Snd.play('whistle');
      } else if (count === 0) {
        numEl.textContent = 'KICK OFF! ⚽';
        Snd.play('whistle');
      } else {
        clearInterval(timer);
        overlay.style.display = 'none';
        if (onComplete) onComplete();
      }
    }, 650);
  }

  /* UPDATE PHYSICS */
  function updatePhysics() {
    if (!STATE.isMatchRunning || STATE.isGoalPaused) return;

    // IF GUEST (Nadia): send local input to Host, Host is authoritative!
    if (ONLINE.isOnline && !ONLINE.isHost) {
      if (ONLINE.conn && ONLINE.conn.open) {
        var now = performance.now();
        var k = keys;
        var changed = !ONLINE.lastSentKeys ||
          ONLINE.lastSentKeys.left !== k.left ||
          ONLINE.lastSentKeys.right !== k.right ||
          ONLINE.lastSentKeys.jump !== k.jump ||
          ONLINE.lastSentKeys.kick !== k.kick ||
          ONLINE.lastSentKeys.super !== k.super;

        // Send immediately upon any keypress change, or heartbeat every 33ms (~30Hz)
        if (changed || (now - ONLINE.lastInputSentTime > 33)) {
          ONLINE.conn.send({
            type: 'input',
            keys: {
              left: k.left,
              right: k.right,
              jump: k.jump,
              kick: k.kick,
              super: k.super
            }
          });
          ONLINE.lastInputSentTime = now;
          ONLINE.lastSentKeys = { left: k.left, right: k.right, jump: k.jump, kick: k.kick, super: k.super };
        }
      }
      if (ball.isSuper) {
        ball.trail.push({ x: ball.x, y: ball.y, color: ball.superColor, r: ball.radius });
        if (ball.trail.length > 10) ball.trail.shift();
      } else {
        if (ball.trail.length > 0) ball.trail.shift();
      }
      return;
    }

    var curChar = getSelectedChar();

    // 1. Player 1 Movement (Local Mac or Solo Player)
    var targetVx = 0;
    if (keys.left) {
      targetVx = -curChar.speed;
      p1.facing = -1;
    } else if (keys.right) {
      targetVx = curChar.speed;
      p1.facing = 1;
    }

    // Smooth responsive acceleration & friction (buttery motion on phone)
    var accel = p1.isGrounded ? (targetVx !== 0 ? 0.38 : 0.26) : 0.20;
    p1.vx += (targetVx - p1.vx) * accel;
    if (Math.abs(p1.vx) < 0.04) p1.vx = 0;

    if (keys.jump && p1.isGrounded) {
      p1.vy = -curChar.jumpForce;
      p1.isGrounded = false;
      p1.scaleX = 0.88;
      p1.scaleY = 1.15;
      Snd.play('jump');
    }

    // Apply Gravity to P1
    p1.vy += 0.48;
    p1.x += p1.vx;
    p1.y += p1.vy;

    var wasGroundedP1 = p1.isGrounded;
    if (p1.y >= GROUND_Y) {
      p1.y = GROUND_Y;
      p1.vy = 0;
      p1.isGrounded = true;
      if (!wasGroundedP1) {
        // Landing elastic squash
        p1.scaleX = 1.16;
        p1.scaleY = 0.86;
      }
    } else {
      p1.isGrounded = false;
    }

    // Squash/stretch recovery & animated running lean
    p1.scaleX += (1 - p1.scaleX) * 0.16;
    p1.scaleY += (1 - p1.scaleY) * 0.16;
    var targetTiltP1 = (p1.vx / Math.max(1, curChar.speed)) * 0.15;
    p1.tilt = (p1.tilt || 0) + (targetTiltP1 - (p1.tilt || 0)) * 0.22;
    if (p1.isGrounded && Math.abs(p1.vx) > 0.4) {
      p1.bob = Math.sin(Date.now() * 0.02) * 2.5;
    } else {
      p1.bob = (p1.bob || 0) * 0.8;
    }

    // P1 Boundaries
    if (p1.x < GOAL_W + p1.radius) p1.x = GOAL_W + p1.radius;
    if (p1.x > W - GOAL_W - p1.radius) p1.x = W - GOAL_W - p1.radius;

    // P1 Kick
    if (keys.kick && !p1.isKicking) {
      p1.isKicking = true;
      p1.kickTimer = 10;
      performKick(p1, false);
    }
    if (keys.super && STATE.p1SuperEnergy >= 100) {
      STATE.p1SuperEnergy = 0;
      updateSuperBars();
      performKick(p1, true);
    }

    if (p1.kickTimer > 0) {
      p1.kickTimer--;
      if (p1.kickTimer === 0) p1.isKicking = false;
    }

    // 2. Player 2 Movement (Nadia via WebRTC if Online Host, otherwise AI Bot)
    if (ONLINE.isOnline && ONLINE.isHost) {
      var p2Char = CHARACTERS.find(function (c) { return c.id === ONLINE.remotePlayerCharId; }) || CHARACTERS[4];
      var targetVx2 = 0;
      if (ONLINE.guestKeys.left) {
        targetVx2 = -p2Char.speed;
        p2.facing = -1;
      } else if (ONLINE.guestKeys.right) {
        targetVx2 = p2Char.speed;
        p2.facing = 1;
      }
      var accel2 = p2.isGrounded ? (targetVx2 !== 0 ? 0.38 : 0.26) : 0.20;
      p2.vx += (targetVx2 - p2.vx) * accel2;
      if (Math.abs(p2.vx) < 0.04) p2.vx = 0;

      if (ONLINE.guestKeys.jump && p2.isGrounded) {
        p2.vy = -p2Char.jumpForce;
        p2.isGrounded = false;
        p2.scaleX = 0.88;
        p2.scaleY = 1.15;
        Snd.play('jump');
      }

      p2.vy += 0.48;
      p2.x += p2.vx;
      p2.y += p2.vy;

      var wasGroundedP2 = p2.isGrounded;
      if (p2.y >= GROUND_Y) {
        p2.y = GROUND_Y;
        p2.vy = 0;
        p2.isGrounded = true;
        if (!wasGroundedP2) {
          p2.scaleX = 1.16;
          p2.scaleY = 0.86;
        }
      } else {
        p2.isGrounded = false;
      }

      p2.scaleX += (1 - p2.scaleX) * 0.16;
      p2.scaleY += (1 - p2.scaleY) * 0.16;
      var targetTiltP2 = (p2.vx / Math.max(1, p2Char.speed)) * 0.15;
      p2.tilt = (p2.tilt || 0) + (targetTiltP2 - (p2.tilt || 0)) * 0.22;
      if (p2.isGrounded && Math.abs(p2.vx) > 0.4) {
        p2.bob = Math.sin(Date.now() * 0.02) * 2.5;
      } else {
        p2.bob = (p2.bob || 0) * 0.8;
      }

      if (p2.x < GOAL_W + p2.radius) p2.x = GOAL_W + p2.radius;
      if (p2.x > W - GOAL_W - p2.radius) p2.x = W - GOAL_W - p2.radius;

      if (ONLINE.guestKeys.kick && !p2.isKicking) {
        p2.isKicking = true;
        p2.kickTimer = 10;
        performKick(p2, false, p2Char.kickPower);
      }
      if (ONLINE.guestKeys.super && STATE.p2SuperEnergy >= 100) {
        STATE.p2SuperEnergy = 0;
        updateSuperBars();
        performKick(p2, true, p2Char.kickPower);
      }
      if (p2.kickTimer > 0) {
        p2.kickTimer--;
        if (p2.kickTimer === 0) p2.isKicking = false;
      }
    } else {
      updateAI();
    }

    // 3. Ball Physics
    ball.vy += 0.36; // Gravity
    ball.vx *= 0.992; // Air resistance

    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.rotation += ball.vx * 0.05;

    // Ball Ground Bounce
    if (ball.y >= GROUND_Y - ball.radius) {
      ball.y = GROUND_Y - ball.radius;
      ball.vy = -ball.vy * 0.76;
      if (Math.abs(ball.vy) < 1) ball.vy = 0;
      ball.vx *= 0.94; // Grass friction
    }

    // Ball Wall & Goal Post Collisions
    // Ceiling
    if (ball.y < ball.radius) {
      ball.y = ball.radius;
      ball.vy = -ball.vy * 0.7;
    }

    // Left Goal Post / Crossbar
    if (ball.x <= GOAL_W + ball.radius && ball.y <= GOAL_TOP_Y + 12 && ball.y >= GOAL_TOP_Y - 12) {
      ball.vy = -Math.abs(ball.vy) * 0.85;
      ball.vx = Math.abs(ball.vx) + 2;
      Snd.play('crossbar');
    }
    // Right Goal Post / Crossbar
    if (ball.x >= W - GOAL_W - ball.radius && ball.y <= GOAL_TOP_Y + 12 && ball.y >= GOAL_TOP_Y - 12) {
      ball.vy = -Math.abs(ball.vy) * 0.85;
      ball.vx = -Math.abs(ball.vx) - 2;
      Snd.play('crossbar');
    }

    // CHECK GOAL!
    // Left Goal: Ball goes behind goal line (x < GOAL_W) below crossbar
    if (ball.x < GOAL_W - 4 && ball.y > GOAL_TOP_Y) {
      triggerGoal(2); // P2 scores!
      return;
    }
    // Right Goal: Ball goes behind goal line (x > W - GOAL_W) below crossbar
    if (ball.x > W - GOAL_W + 4 && ball.y > GOAL_TOP_Y) {
      triggerGoal(1); // P1 scores!
      return;
    }

    // Outer Side Walls (Above crossbar)
    if (ball.x < ball.radius && ball.y < GOAL_TOP_Y) {
      ball.x = ball.radius;
      ball.vx = -ball.vx * 0.8;
    }
    if (ball.x > W - ball.radius && ball.y < GOAL_TOP_Y) {
      ball.x = W - ball.radius;
      ball.vx = -ball.vx * 0.8;
    }

    // 4. Player-Ball Collisions (Headers & Body Hits)
    checkPlayerBallCollision(p1, 1);
    checkPlayerBallCollision(p2, 2);

    // Player-Player Collisions
    var pDist = Math.abs(p1.x - p2.x);
    if (pDist < p1.radius + p2.radius) {
      var overlap = (p1.radius + p2.radius) - pDist;
      p1.x -= overlap * 0.5;
      p2.x += overlap * 0.5;
    }

    // Ball Trail for Super Shots
    if (ball.isSuper) {
      ball.trail.push({ x: ball.x, y: ball.y, color: ball.superColor, r: ball.radius });
      if (ball.trail.length > 10) ball.trail.shift();
    } else {
      if (ball.trail.length > 0) ball.trail.shift();
    }

    // 5. If Host, broadcast updated authoritative state to Guest (Nadia)
    if (ONLINE.isOnline && ONLINE.isHost && ONLINE.conn && ONLINE.conn.open) {
      ONLINE.conn.send({
        type: 'state',
        p1: { x: Math.round(p1.x), y: Math.round(p1.y), vx: p1.vx, vy: p1.vy, facing: p1.facing, isKicking: p1.isKicking, scaleX: p1.scaleX, scaleY: p1.scaleY, tilt: p1.tilt, bob: p1.bob },
        p2: { x: Math.round(p2.x), y: Math.round(p2.y), vx: p2.vx, vy: p2.vy, facing: p2.facing, isKicking: p2.isKicking, scaleX: p2.scaleX, scaleY: p2.scaleY, tilt: p2.tilt, bob: p2.bob },
        ball: { x: Math.round(ball.x), y: Math.round(ball.y), vx: ball.vx, vy: ball.vy, rotation: ball.rotation, isSuper: ball.isSuper, superColor: ball.superColor },
        score1: STATE.p1Score,
        score2: STATE.p2Score,
        timer: STATE.timer,
        p1Super: STATE.p1SuperEnergy,
        p2Super: STATE.p2SuperEnergy
      });
    }
  }

  /* PLAYER-BALL COLLISION */
  function checkPlayerBallCollision(player, playerIdx) {
    var dx = ball.x - player.x;
    var dy = ball.y - (player.y - 18);
    var dist = Math.sqrt(dx * dx + dy * dy);
    var minDist = player.radius + ball.radius;

    if (dist < minDist) {
      // Elastic impulse bounce
      var angle = Math.atan2(dy, dx);
      var push = (minDist - dist);
      ball.x += Math.cos(angle) * push;
      ball.y += Math.sin(angle) * push;

      var speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      var force = Math.max(7, speed * 0.9 + 4);
      ball.vx = Math.cos(angle) * force;
      ball.vy = Math.sin(angle) * force - 1.5;

      // Charge super energy on touches
      if (playerIdx === 1 && STATE.p1SuperEnergy < 100) {
        STATE.p1SuperEnergy = Math.min(100, STATE.p1SuperEnergy + 12);
        updateSuperBars();
      } else if (playerIdx === 2 && STATE.p2SuperEnergy < 100) {
        STATE.p2SuperEnergy = Math.min(100, STATE.p2SuperEnergy + 10);
        updateSuperBars();
      }

      Snd.play('kick');
    }
  }

  /* KICK ACTION */
  function performKick(player, isSuperShot, customPower) {
    var kickDir = player.facing;
    var kickRange = player.radius + 38;
    var dx = ball.x - player.x;
    var dy = ball.y - player.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Kick reaches if ball is in front of player
    if (dist < kickRange + ball.radius && (dx * kickDir > -10)) {
      var curChar = getSelectedChar();
      var power = (typeof customPower === 'number') ? customPower : curChar.kickPower;

      if (isSuperShot) {
        power *= 1.8;
        ball.isSuper = true;
        ball.superColor = (player === p1) ? curChar.superColor : '#00f5d4';
        Snd.play('super');
      } else {
        Snd.play('kick');
      }

      ball.vx = kickDir * (power + 4);
      ball.vy = -power * 0.65;
    }
  }

  /* SMART AI OPPONENT BEHAVIOR WITH 10 DIFFICULTY LEVELS */
  function updateAI() {
    var diff = getCurrentDifficulty();
    var speed = diff.aiSpeed;

    // AI positioning logic scaled by difficulty (1 to 10)
    var distToBall = Math.hypot(ball.x - p2.x, ball.y - p2.y);
    var targetOffset = diff.level <= 2 ? 65 : (diff.level <= 5 ? 40 : 20);
    var targetX = ball.x + targetOffset;

    // Advanced ball trajectory prediction at high difficulties (Level 6-10)
    if (diff.level >= 6) {
      targetX = ball.x + targetOffset + (ball.vx * (diff.level >= 8 ? 3.5 : 2.0));
    }

    // Defensive positioning on own half
    if (ball.x < W / 2) {
      var retreatBound = diff.level <= 2 ? (W - 180) : (diff.level <= 5 ? (W - 220) : (W - 250));
      var roomOffset = diff.level <= 2 ? 110 : (diff.level <= 5 ? 80 : 50);
      targetX = Math.max(retreatBound, ball.x + roomOffset);
    }

    // Emergency goal-line save for high levels (7-10)
    if (diff.level >= 7 && ball.x > W - GOAL_W - 130 && ball.y > GOAL_TOP_Y - 20) {
      targetX = ball.x + 10;
    }

    if (p2.x < targetX - 10) p2.vx = speed;
    else if (p2.x > targetX + 10) p2.vx = -speed;
    else p2.vx *= 0.65;

    // AI Jump / Header when ball is overhead (scaled strictly by difficulty)
    var jumpDistThreshold = diff.level >= 8 ? 135 : 110;
    if (distToBall < jumpDistThreshold && ball.y < p2.y - 25 && p2.isGrounded && Math.random() < diff.aiJumpChance) {
      p2.vy = -(9.2 + diff.level * 0.42);
      // High level AI adds extra forward thrust on jump!
      if (diff.level >= 7 && ball.x < p2.x) {
        p2.vx = -speed * 1.15;
      }
      p2.isGrounded = false;
      Snd.play('jump');
    }

    // Apply Gravity to P2
    p2.vy += 0.48;
    p2.x += p2.vx;
    p2.y += p2.vy;

    var wasGroundedAI = p2.isGrounded;
    if (p2.y >= GROUND_Y) {
      p2.y = GROUND_Y;
      p2.vy = 0;
      p2.isGrounded = true;
      if (!wasGroundedAI) {
        p2.scaleX = 1.16;
        p2.scaleY = 0.86;
      }
    } else {
      p2.isGrounded = false;
    }

    p2.scaleX += (1 - p2.scaleX) * 0.16;
    p2.scaleY += (1 - p2.scaleY) * 0.16;
    var targetTiltAI = (p2.vx / Math.max(1, speed)) * 0.15;
    p2.tilt = (p2.tilt || 0) + (targetTiltAI - (p2.tilt || 0)) * 0.22;
    if (p2.isGrounded && Math.abs(p2.vx) > 0.4) {
      p2.bob = Math.sin(Date.now() * 0.02) * 2.5;
    } else {
      p2.bob = (p2.bob || 0) * 0.8;
    }

    if (p2.x < GOAL_W + p2.radius) p2.x = GOAL_W + p2.radius;
    if (p2.x > W - GOAL_W - p2.radius) p2.x = W - GOAL_W - p2.radius;

    // AI Kick (scaled by difficulty 1 to 10)
    var kickRange = p2.radius + (diff.level >= 8 ? 40 : 32);
    if (distToBall < kickRange && ball.x < p2.x && Math.random() < diff.aiKickChance) {
      if (STATE.p2SuperEnergy >= 100 && Math.random() < diff.aiSuperChance) {
        STATE.p2SuperEnergy = 0;
        updateSuperBars();
        performKick(p2, true, diff.aiKickPower);
      } else {
        performKick(p2, false, diff.aiKickPower);
      }
    }
  }

  /* TRIGGER GOAL */
  function triggerGoal(scorer) {
    if (STATE.isGoalPaused) return;
    STATE.isGoalPaused = true;

    if (scorer === 1) {
      STATE.p1Score++;
      $('p1Score').textContent = STATE.p1Score;
      var p1Title = ONLINE.isOnline ? (ONLINE.isHost ? 'คุณ (แมค)' : 'แมค') : getSelectedChar().name;
      showGoalBanner('GOOOOAL! ⚽🔥', p1Title + ' ทำประตูได้อย่างงดงาม!');
      Snd.play('goal');
    } else {
      STATE.p2Score++;
      $('p2Score').textContent = STATE.p2Score;
      var p2Title = ONLINE.isOnline ? (!ONLINE.isHost ? 'คุณ (นาเดีย)' : 'นาเดีย') : AI_NAMES[STATE.aiOpponentIndex];
      showGoalBanner(ONLINE.isOnline ? 'GOOOOAL! ⚽🔥' : 'GOAL! ⚽💥', p2Title + ' ซัดเข้าประตูไปแล้ว!');
      Snd.play('goal');
    }

    if (ONLINE.isOnline && ONLINE.isHost && ONLINE.conn && ONLINE.conn.open) {
      ONLINE.conn.send({
        type: 'goal',
        scorer: scorer,
        s1: STATE.p1Score,
        s2: STATE.p2Score
      });
    }

    setTimeout(function () {
      hideGoalBanner();
      resetPositions(scorer);
      startKickoffSequence(function () {
        STATE.isGoalPaused = false;
      });
    }, 2200);
  }

  function showGoalBanner(main, sub) {
    var b = $('goalBanner');
    if (!b) return;
    $('goalBannerText').textContent = main;
    $('goalBannerSub').textContent = sub;
    b.style.display = 'block';
  }

  function hideGoalBanner() {
    var b = $('goalBanner');
    if (b) b.style.display = 'none';
  }

  function updateSuperBars() {
    var b1 = $('p1SuperBar');
    if (b1) b1.style.width = STATE.p1SuperEnergy + '%';
    var b2 = $('p2SuperBar');
    if (b2) b2.style.width = STATE.p2SuperEnergy + '%';

    var btnSup = $('touchSuper');
    if (btnSup) {
      btnSup.style.opacity = STATE.p1SuperEnergy >= 100 ? '1' : '0.45';
      btnSup.style.transform = STATE.p1SuperEnergy >= 100 ? 'scale(1.08)' : 'scale(1)';
    }
  }

  /* ==========================================================================
     5. CANVAS RENDERING ENGINE
     ========================================================================== */
  function renderPitch() {
    if (!ctx) return;

    // 1. Sky & Stadium Floodlights
    var skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGrad.addColorStop(0, '#0a192f');
    skyGrad.addColorStop(0.7, '#1b3a4b');
    skyGrad.addColorStop(1, '#2d6a4f');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Stadium Crowd in Stands
    ctx.fillStyle = '#15251d';
    ctx.fillRect(0, 160, W, 120);
    // Draw cute crowd heads
    for (var i = 20; i < W; i += 28) {
      ctx.fillStyle = (i % 56 === 0) ? '#ffd166' : '#ff70a6';
      ctx.beginPath();
      ctx.arc(i, 210 + Math.sin(Date.now() * 0.005 + i) * 3, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stadium Floodlight Beams
    ctx.fillStyle = 'rgba(255, 255, 230, 0.08)';
    ctx.beginPath();
    ctx.moveTo(80, 0); ctx.lineTo(0, GROUND_Y); ctx.lineTo(350, GROUND_Y); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W - 80, 0); ctx.lineTo(W, GROUND_Y); ctx.lineTo(W - 350, GROUND_Y); ctx.closePath();
    ctx.fill();

    // 2. Lush Green Pitch with Striped Grass
    for (var x = 0; x < W; x += 60) {
      ctx.fillStyle = (Math.floor(x / 60) % 2 === 0) ? '#2b9348' : '#38b000';
      ctx.fillRect(x, GROUND_Y, 60, H - GROUND_Y);
    }

    // Pitch White Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 4;
    // Ground line
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(W, GROUND_Y); ctx.stroke();
    // Center line & circle
    ctx.beginPath(); ctx.moveTo(W / 2, GROUND_Y); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, GROUND_Y, 70, Math.PI, 0); ctx.stroke();

    // 3. Goal Posts & Nets
    // Left Goal
    drawGoal(0, GOAL_TOP_Y, GOAL_W, GOAL_H, true);
    // Right Goal
    drawGoal(W - GOAL_W, GOAL_TOP_Y, GOAL_W, GOAL_H, false);

    // 4. Ball Trail (Super Shot Effect)
    if (ball.trail && ball.trail.length > 0) {
      ball.trail.forEach(function (t, idx) {
        var alpha = (idx + 1) / ball.trail.length;
        ctx.fillStyle = t.color;
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r * (0.6 + alpha * 0.4), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    // 5. Draw Players
    var p1Def = getP1CharDef();
    var p2Def = getP2CharDef();
    drawPlayer(p1, p1Def, true);
    drawPlayer(p2, p2Def, false);

    // 6. Draw Soccer Ball
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    // Ball Body
    ctx.fillStyle = ball.isSuper ? ball.superColor : '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#2d232e';
    ctx.stroke();

    // Classic Soccer Pentagon Pattern
    ctx.fillStyle = ball.isSuper ? '#ffffff' : '#2d232e';
    ctx.beginPath();
    for (var p = 0; p < 5; p++) {
      var a = (p * Math.PI * 2) / 5;
      var px = Math.cos(a) * (ball.radius * 0.5);
      var py = Math.sin(a) * (ball.radius * 0.5);
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawGoal(x, y, w, h, isLeft) {
    ctx.save();
    // Goal Net pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    for (var ny = y; ny < y + h; ny += 14) {
      ctx.beginPath(); ctx.moveTo(x, ny); ctx.lineTo(x + w, ny); ctx.stroke();
    }
    for (var nx = x; nx < x + w; nx += 14) {
      ctx.beginPath(); ctx.moveTo(nx, y); ctx.lineTo(nx, y + h); ctx.stroke();
    }

    // Solid White Goal Posts
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    if (isLeft) {
      ctx.moveTo(x + w, y + h);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y);
      ctx.lineTo(x + w, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawPlayer(player, charDef, isP1) {
    ctx.save();
    var cx = player.x;
    var cy = player.y - player.radius + (player.bob || 0);

    // Dynamic drop shadow (scales realistically with jump height)
    var shadowScale = Math.max(0.35, 1 - (GROUND_Y - player.y) / 240);
    ctx.fillStyle = 'rgba(0, 0, 0, ' + (0.28 * shadowScale) + ')';
    ctx.beginPath();
    ctx.ellipse(player.x, GROUND_Y - 2, player.radius * 0.85 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Center transform for fluid squash, stretch, and lean
    ctx.translate(cx, cy);
    ctx.rotate(player.tilt || 0);
    ctx.scale(player.scaleX || 1, player.scaleY || 1);

    // Rounded Chibi Body with Jersey
    ctx.fillStyle = charDef.jerseyColor || '#ffd166';
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2d232e';
    ctx.stroke();

    // Jersey Stripe / Number
    ctx.fillStyle = isP1 ? '#1d3557' : '#ffffff';
    ctx.font = 'bold 16px "Nunito", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isP1 ? '10' : '7', 0, 8);

    // Chibi Avatar Face
    ctx.font = '28px sans-serif';
    ctx.fillText(charDef.avatar || '🐶', 0, -14);

    // Cleats / Boots with dynamic kick swing arc
    var cleatOffX = isP1 ? (player.radius * 0.4) : (-player.radius * 0.4);
    var cleatOffY = player.radius - 4;
    if (player.isKicking) {
      cleatOffX += isP1 ? 18 : -18;
      cleatOffY -= 10;
    }
    ctx.fillStyle = '#1d3557';
    ctx.beginPath();
    ctx.ellipse(cleatOffX, cleatOffY, 11, 7, isP1 ? 0.35 : -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Floating YOU indicator above the active local player
    var isLocalPlayer = (!ONLINE.isOnline && isP1) ||
      (ONLINE.isOnline && ((ONLINE.isHost && isP1) || (!ONLINE.isHost && !isP1)));

    if (isLocalPlayer) {
      ctx.save();
      var arrowBob = Math.sin(Date.now() * 0.007) * 3;
      var tagY = cy - player.radius - 18 + arrowBob;

      // Glow pill
      ctx.fillStyle = '#06d6a0';
      ctx.strokeStyle = '#023020';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(cx - 18, tagY - 14, 36, 17, 8);
      } else {
        ctx.rect(cx - 18, tagY - 14, 36, 17);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#023020';
      ctx.font = '900 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('YOU', cx, tagY - 5);

      // Down arrow tip
      ctx.fillStyle = '#06d6a0';
      ctx.beginPath();
      ctx.moveTo(cx - 4, tagY + 3);
      ctx.lineTo(cx + 4, tagY + 3);
      ctx.lineTo(cx, tagY + 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }

  /* ==========================================================================
     6. MATCH LOOP & TIMERS
     ========================================================================== */
  var matchInterval = null;

  function startMatch() {
    STATE.p1Score = 0;
    STATE.p2Score = 0;
    STATE.timer = 60;
    STATE.p1SuperEnergy = 0;
    STATE.p2SuperEnergy = 0;
    STATE.isMatchRunning = true;
    STATE.isGoalPaused = false;

    $('p1Score').textContent = '0';
    $('p2Score').textContent = '0';
    $('matchTimer').textContent = '60';
    $('matchPeriod').textContent = '1ST HALF';

    var p1Def = getP1CharDef();
    var p2Def = getP2CharDef();
    $('p1AvatarDisplay').textContent = p1Def.avatar;
    $('p2AvatarDisplay').textContent = p2Def.avatar;

    if (ONLINE.isOnline) {
      $('p1NameDisplay').textContent = ONLINE.isHost ? 'แมค (คุณ)' : 'แมค (P1)';
      $('p2NameDisplay').textContent = ONLINE.isHost ? 'นาเดีย (P2)' : 'นาเดีย (คุณ)';
    } else {
      $('p1NameDisplay').textContent = p1Def.name;
      $('p2NameDisplay').textContent = AI_NAMES[STATE.aiOpponentIndex];
    }

    updateSuperBars();
    resetPositions(0);

    // If Online and Guest (Nadia), do not run local timer (Host is authoritative clock)
    if (ONLINE.isOnline && !ONLINE.isHost) {
      if (matchInterval) clearInterval(matchInterval);
      matchInterval = null;
      return;
    }

    startKickoffSequence(function () {
      if (matchInterval) clearInterval(matchInterval);
      matchInterval = setInterval(function () {
        if (!STATE.isMatchRunning || STATE.isGoalPaused) return;

        STATE.timer--;
        $('matchTimer').textContent = STATE.timer;

        if (STATE.timer === 30) {
          $('matchPeriod').textContent = '2ND HALF';
        }

        if (STATE.timer <= 0) {
          endMatch();
        }
      }, 1000);
    });
  }

  function endMatch() {
    STATE.isMatchRunning = false;
    if (matchInterval) clearInterval(matchInterval);
    Snd.play('whistle');

    var modal = $('resultModal');
    var isWin = STATE.p1Score > STATE.p2Score;
    var isDraw = STATE.p1Score === STATE.p2Score;

    $('resP1Score').textContent = STATE.p1Score;
    $('resP2Score').textContent = STATE.p2Score;

    if (ONLINE.isOnline) {
      var amIWinner = (ONLINE.isHost && isWin) || (!ONLINE.isHost && !isWin && !isDraw);

      if (isDraw) {
        $('resultBadge').textContent = '🤝';
        $('resultTitle').textContent = 'เสมอกันอย่างดุเดือด!';
        $('resultSub').textContent = 'แมค และ นาเดีย ฝีมือสูสีกันมาก แข่งใหม่อีกนัดเพื่อตัดสิน!';
      } else if (amIWinner) {
        $('resultBadge').textContent = '🏆';
        $('resultTitle').textContent = '🎉 คุณชนะการแข่งขัน!';
        $('resultSub').textContent = 'ฝีเท้าสุดยอด เอาชนะการดวลแข้ง 1 ต่อ 1 สำเร็จ!';
      } else {
        $('resultBadge').textContent = '⚽';
        $('resultTitle').textContent = (ONLINE.isHost ? 'นาเดีย' : 'แมค') + ' เป็นฝ่ายชนะ!';
        $('resultSub').textContent = 'แมตช์ออนไลน์ 1 ต่อ 1 สุดมันส์ กดเล่นอีกรอบเพื่อแก้มือ!';
      }

      var rewBox = $('rewardBox');
      if (rewBox) rewBox.style.display = 'none';

      if (ONLINE.isHost && ONLINE.conn && ONLINE.conn.open) {
        ONLINE.conn.send({
          type: 'end',
          s1: STATE.p1Score,
          s2: STATE.p2Score
        });
      }
    } else {
      var diffObj = getCurrentDifficulty();

      if (isWin) {
        $('resultBadge').textContent = '🏆';
        $('resultTitle').textContent = 'ชัยชนะอันยอดเยี่ยม!';
        $('resultSub').textContent = 'คุณเอาชนะ ' + AI_NAMES[STATE.aiOpponentIndex] + ' ใน ' + diffObj.name.split(' (')[0] + ' (' + diffObj.tagText + ') ได้สำเร็จ!';
        var winCoins = 150 + (STATE.p1Score * 25);
        STATE.coins += winCoins;
        STATE.trophies += 1;
        $('rewardCoins').textContent = '+' + winCoins;
        $('rewardTrophies').textContent = '+1';
        Snd.play('goal');
      } else if (isDraw) {
        $('resultBadge').textContent = '🤝';
        $('resultTitle').textContent = 'เสมอกันอย่างดุเดือด!';
        $('resultSub').textContent = 'สูสีกันมากใน ' + diffObj.name.split(' (')[0] + ' (' + diffObj.tagText + ') แข่งใหม่อีกนัดเพื่อตัดสิน!';
        STATE.coins += 60;
        $('rewardCoins').textContent = '+60';
        $('rewardTrophies').textContent = '+0';
      } else {
        $('resultBadge').textContent = '😢';
        $('resultTitle').textContent = 'พ่ายแพ้ในนัดนี้!';
        $('resultSub').textContent = 'แข่งใน ' + diffObj.name.split(' (')[0] + ' (' + diffObj.tagText + ') อย่าเพิ่งท้อ ลองปรับระดับความยากหรือแข่งใหม่!';
        STATE.coins += 30;
        $('rewardCoins').textContent = '+30';
        $('rewardTrophies').textContent = '+0';
      }

      $('hudCoins').textContent = STATE.coins.toLocaleString();
      $('hudTrophies').textContent = STATE.trophies.toLocaleString();
      saveGameData();
    }

    if (modal) modal.classList.add('open');
  }

  /* ==========================================================================
     7. ROSTER MODAL
     ========================================================================== */
  function openRosterModal() {
    var modal = $('rosterModal');
    if (!modal) return;

    var grid = $('rosterGrid');
    if (grid) {
      var html = '';
      CHARACTERS.forEach(function (c) {
        var isAct = c.id === STATE.selectedCharId;
        html += '<div class="roster-card ' + (isAct ? 'active' : '') + '" onclick="window.selectDojiChar(\'' + c.id + '\')">';
        html += '<div class="roster-avatar">' + c.avatar + '</div>';
        html += '<div class="roster-name">' + c.name + '</div>';
        html += '<div class="roster-trait">' + c.trait + '</div>';
        html += '<div class="roster-super">ท่าไม้ตาย: ' + c.superName + '</div>';
        html += '</div>';
      });
      grid.innerHTML = html;
    }

    modal.classList.add('open');
  }

  window.selectDojiChar = function (charId) {
    STATE.selectedCharId = charId;
    saveGameData();
    var cur = getSelectedChar();
    if (ONLINE.isOnline) {
      if (ONLINE.isHost) {
        $('p1AvatarDisplay').textContent = cur.avatar;
        if (ONLINE.conn && ONLINE.conn.open) {
          ONLINE.conn.send({ type: 'init', p1Char: charId, p1Name: 'แมค (P1)' });
        }
      } else {
        $('p2AvatarDisplay').textContent = cur.avatar;
        if (ONLINE.conn && ONLINE.conn.open) {
          ONLINE.conn.send({ type: 'ready', p2Char: charId, p2Name: 'นาเดีย (P2)' });
        }
      }
    } else {
      $('p1AvatarDisplay').textContent = cur.avatar;
      $('p1NameDisplay').textContent = cur.name;
    }
    Snd.play('whistle');
    $('rosterModal').classList.remove('open');
  };

  /* ==========================================================================
     8. DIFFICULTY MODAL (5 ระดับความยาก)
     ========================================================================== */
  function openDiffModal() {
    var modal = $('diffModal');
    if (!modal) return;

    var grid = $('diffGrid');
    if (grid) {
      var html = '';
      DIFFICULTIES.forEach(function (d) {
        var isAct = d.level === STATE.difficulty;
        html += '<div class="diff-card ' + (isAct ? 'active' : '') + '" onclick="window.selectDifficulty(' + d.level + ')">';
        html += '  <div class="diff-left">';
        html += '    <div class="diff-icon">' + d.icon + '</div>';
        html += '    <div class="diff-info">';
        html += '      <div class="diff-title">' + d.name + ' <span class="diff-tag" style="background:' + d.badgeColor + '">' + d.tagText + '</span></div>';
        html += '      <div class="diff-desc">' + d.desc + '</div>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="diff-check">✔</div>';
        html += '</div>';
      });
      grid.innerHTML = html;
    }

    modal.classList.add('open');
  }

  window.selectDifficulty = function (lvl) {
    STATE.difficulty = parseInt(lvl, 10) || 1;
    saveGameData();
    updateDifficultyUI();
    Snd.play('whistle');
    var modal = $('diffModal');
    if (modal) modal.classList.remove('open');
  };

  /* ==========================================================================
     9. CONTROLS & EVENT LISTENERS
     ========================================================================== */
  function setupInputs() {
    // Keyboard Controls:
    // - Spacebar / Up Arrow / W = Jump
    // - Left / Right / A / D = Move
    // - Down Arrow / Enter / X / Z / S / K = Kick
    // - Shift / C / L / E = Super Kick
    window.addEventListener('keydown', function (e) {
      var k = e.key;
      var c = e.code;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k) || c === 'Space') {
        e.preventDefault();
      }

      if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = true;
      if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = true;
      if (c === 'Space' || k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') keys.jump = true;
      if (k === 'ArrowDown' || k === 'Enter' || k === 'x' || k === 'X' || k === 'z' || k === 'Z' || k === 's' || k === 'S' || k === 'k' || k === 'K') keys.kick = true;
      if (k === 'Shift' || k === 'c' || k === 'C' || k === 'l' || k === 'L' || k === 'e' || k === 'E') keys.super = true;
    });

    window.addEventListener('keyup', function (e) {
      var k = e.key;
      var c = e.code;

      if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
      if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
      if (c === 'Space' || k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') keys.jump = false;
      if (k === 'ArrowDown' || k === 'Enter' || k === 'x' || k === 'X' || k === 'z' || k === 'Z' || k === 's' || k === 'S' || k === 'k' || k === 'K') keys.kick = false;
      if (k === 'Shift' || k === 'c' || k === 'C' || k === 'l' || k === 'L' || k === 'e' || k === 'E') keys.super = false;
    });

    // ========================================================================
    // MOBILE TOUCHSCREEN CONTROLS (ULTRA-FLUID GLIDE D-PAD + MULTI-TOUCH)
    // ========================================================================
    var dpad = document.querySelector('.touch-dpad');
    var btnLeft = $('touchLeft');
    var btnRight = $('touchRight');
    var dpadTouchId = null;

    function updateDpadFromTouch(t) {
      if (!dpad || !t) return;
      var rect = dpad.getBoundingClientRect();
      var midX = rect.left + rect.width * 0.5;
      if (t.clientX < midX) {
        keys.left = true;
        keys.right = false;
        btnLeft?.classList.add('pressed');
        btnRight?.classList.remove('pressed');
      } else {
        keys.right = true;
        keys.left = false;
        btnRight?.classList.add('pressed');
        btnLeft?.classList.remove('pressed');
      }
    }

    function clearDpad() {
      dpadTouchId = null;
      keys.left = false;
      keys.right = false;
      btnLeft?.classList.remove('pressed');
      btnRight?.classList.remove('pressed');
    }

    if (dpad) {
      dpad.addEventListener('touchstart', function (e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
          dpadTouchId = e.changedTouches[i].identifier;
          updateDpadFromTouch(e.changedTouches[i]);
          break;
        }
      }, { passive: false });

      window.addEventListener('touchmove', function (e) {
        if (dpadTouchId === null) return;
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === dpadTouchId) {
            updateDpadFromTouch(e.touches[i]);
            break;
          }
        }
      }, { passive: false });

      window.addEventListener('touchend', function (e) {
        if (dpadTouchId === null) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === dpadTouchId) {
            clearDpad();
            break;
          }
        }
      });

      window.addEventListener('touchcancel', function (e) {
        if (dpadTouchId === null) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === dpadTouchId) {
            clearDpad();
            break;
          }
        }
      });

      // Mouse drag fallback for PC testing
      var isMouseDownDpad = false;
      dpad.addEventListener('mousedown', function (e) {
        isMouseDownDpad = true;
        updateDpadFromTouch(e);
      });
      window.addEventListener('mousemove', function (e) {
        if (isMouseDownDpad) updateDpadFromTouch(e);
      });
      window.addEventListener('mouseup', function () {
        if (isMouseDownDpad) {
          isMouseDownDpad = false;
          clearDpad();
        }
      });
    }

    // Independent multi-touch action buttons (Jump, Kick, Super)
    function bindActionTouch(btnId, keyName, hapticMs) {
      var btn = $(btnId);
      if (!btn) return;
      var activeTouchId = null;

      btn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
          activeTouchId = e.changedTouches[i].identifier;
          keys[keyName] = true;
          btn.classList.add('pressed');
          if (navigator.vibrate && hapticMs) {
            try { navigator.vibrate(hapticMs); } catch (_) {}
          }
          break;
        }
      }, { passive: false });

      window.addEventListener('touchend', function (e) {
        if (activeTouchId === null) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === activeTouchId) {
            activeTouchId = null;
            keys[keyName] = false;
            btn.classList.remove('pressed');
            break;
          }
        }
      });

      window.addEventListener('touchcancel', function (e) {
        if (activeTouchId === null) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === activeTouchId) {
            activeTouchId = null;
            keys[keyName] = false;
            btn.classList.remove('pressed');
            break;
          }
        }
      });

      // Desktop click / mouse support
      btn.addEventListener('mousedown', function (e) {
        e.preventDefault();
        keys[keyName] = true;
        btn.classList.add('pressed');
      });
      window.addEventListener('mouseup', function () {
        if (keys[keyName] && activeTouchId === null) {
          keys[keyName] = false;
          btn.classList.remove('pressed');
        }
      });
    }

    bindActionTouch('touchJump', 'jump', 10);
    bindActionTouch('touchKick', 'kick', 15);
    bindActionTouch('touchSuper', 'super', [25, 40, 30]);

    // Direct pitch canvas touch controls
    if (canvas) {
      var pitchTouchId = null;
      canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        var rect = canvas.getBoundingClientRect();
        var scaleX = W / rect.width;
        var scaleY = H / rect.height;

        for (var i = 0; i < e.changedTouches.length; i++) {
          var t = e.changedTouches[i];
          var tx = (t.clientX - rect.left) * scaleX;
          var ty = (t.clientY - rect.top) * scaleY;

          if (tx < W * 0.55) {
            // Left side = move & jump
            pitchTouchId = t.identifier;
            if (tx < p1.x - 20) { keys.left = true; keys.right = false; }
            else if (tx > p1.x + 20) { keys.right = true; keys.left = false; }
            if (ty < p1.y - 70) {
              keys.jump = true;
              setTimeout(function () { keys.jump = false; }, 160);
            }
          } else {
            // Right side = action
            if (ty < H * 0.45) {
              keys.jump = true;
              setTimeout(function () { keys.jump = false; }, 160);
            } else {
              keys.kick = true;
              setTimeout(function () { keys.kick = false; }, 140);
            }
          }
          break;
        }
      }, { passive: false });

      window.addEventListener('touchmove', function (e) {
        if (pitchTouchId === null || !canvas) return;
        var rect = canvas.getBoundingClientRect();
        var scaleX = W / rect.width;
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === pitchTouchId) {
            var tx = (e.touches[i].clientX - rect.left) * scaleX;
            if (tx < p1.x - 20) { keys.left = true; keys.right = false; }
            else if (tx > p1.x + 20) { keys.right = true; keys.left = false; }
            else { keys.left = false; keys.right = false; }
            break;
          }
        }
      }, { passive: false });

      window.addEventListener('touchend', function (e) {
        if (pitchTouchId === null) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === pitchTouchId) {
            pitchTouchId = null;
            keys.left = false;
            keys.right = false;
            break;
          }
        }
      });
      window.addEventListener('touchcancel', function (e) {
        if (pitchTouchId === null) return;
        pitchTouchId = null;
        keys.left = false;
        keys.right = false;
      });
    }

    // UI Buttons
    $('btnAudioToggle')?.addEventListener('click', function () {
      var next = !Snd.isEnabled();
      Snd.setEnabled(next);
      this.textContent = next ? '🔊' : '🔇';
      if (next) Snd.play('kick');
    });

    $('btnRosterModal')?.addEventListener('click', openRosterModal);
    $('closeRosterModal')?.addEventListener('click', function () {
      $('rosterModal').classList.remove('open');
    });

    $('btnPlayAgain')?.addEventListener('click', function () {
      $('resultModal').classList.remove('open');
      if (ONLINE.isOnline && ONLINE.conn && ONLINE.conn.open) {
        if (ONLINE.isHost) {
          ONLINE.conn.send({ type: 'start_match' });
          startMatch();
        } else {
          ONLINE.conn.send({ type: 'rematch' });
        }
      } else {
        startMatch();
      }
    });

    $('btnRndHostCode')?.addEventListener('click', function () {
      var rnd = 'doji-' + Math.floor(1000 + Math.random() * 9000);
      if ($('hostRoomInput')) $('hostRoomInput').value = rnd;
    });
    $('btnShareRoomLink')?.addEventListener('click', function () {
      shareRoomLink($('lblRoomCode')?.textContent);
    });

    $('btnChangeDiff')?.addEventListener('click', function () {
      openDiffModal();
    });

    $('btnNextOpponent')?.addEventListener('click', function () {
      STATE.aiOpponentIndex = (STATE.aiOpponentIndex + 1) % AI_NAMES.length;
      $('resultModal').classList.remove('open');
      startMatch();
    });

    $('btnDiffToggle')?.addEventListener('click', openDiffModal);
    $('closeDiffModal')?.addEventListener('click', function () {
      $('diffModal').classList.remove('open');
    });

    // Quick Difficulty Buttons on pitch toolbar
    document.querySelectorAll('.quick-diff-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lvl = parseInt(this.dataset.lvl, 10);
        window.selectDifficulty(lvl);
      });
    });

    // Game Mode Switcher
    $('tabModeSolo')?.addEventListener('click', function () {
      if (ONLINE.isOnline) leaveOnlineMode();
      cleanupPairingMgr();
      setOnlineModeUI(false);
    });
    $('tabModeOnline')?.addEventListener('click', function () {
      var barSolo = $('tabModeSolo');
      var barOnline = $('tabModeOnline');
      var diffSelector = $('quickDiffSelector');
      var coupleBar = $('coupleQuickBar');
      barSolo?.classList.remove('active');
      barOnline?.classList.add('active');
      if (diffSelector) diffSelector.style.display = 'none';
      if (coupleBar) coupleBar.style.display = 'flex';

      if (!ONLINE.isOnline) {
        startInstantOnline('auto');
      } else {
        openOnlineModal();
      }
    });
    $('btnOnlineNav')?.addEventListener('click', openOnlineModal);
    $('closeOnlineModal')?.addEventListener('click', closeOnlineModal);

    // Couple 1-Click Fast Buttons
    $('btnBarAutoJoin')?.addEventListener('click', function () {
      startInstantOnline('auto');
    });
    $('btnBarMacInvite')?.addEventListener('click', function () {
      startInstantOnline('mac');
    });
    $('btnModalFastMac')?.addEventListener('click', function () {
      startInstantOnline('mac');
    });
    $('btnBarNadiaJoin')?.addEventListener('click', function () {
      startInstantOnline('nadia');
    });
    $('btnModalFastNadia')?.addEventListener('click', function () {
      startInstantOnline('nadia');
    });
    $('btnOpenAdvancedLobby')?.addEventListener('click', openOnlineModal);

    // Online Lobby Buttons
    $('btnStartHost')?.addEventListener('click', function () {
      var room = ($('hostRoomInput')?.value || 'mac-nadia').trim();
      startHost(room);
    });
    $('btnStartJoin')?.addEventListener('click', function () {
      var room = ($('joinRoomInput')?.value || 'mac-nadia').trim();
      startJoin(room);
    });
    $('btnCopyRoomLink')?.addEventListener('click', function () {
      copyRoomLink($('lblRoomCode')?.textContent);
    });
    $('btnCopyRoomLinkInline')?.addEventListener('click', function () {
      copyRoomLink(ONLINE.roomCode);
    });
    $('btnLeaveOnline')?.addEventListener('click', function () {
      leaveOnlineMode();
    });
  }

  /* ==========================================================================
     9. ONLINE 2-PLAYER ENGINE (WEBRTC PEERJS + OPENRELAY TURN + INSTANT DISCOVERY)
     ========================================================================== */
  var ICE_CONFIG = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp'
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      }
    ],
    iceCandidatePoolSize: 10
  };

  // Real-time zero-friction matchmaking relay for Mac & Nadia
  var PAIR_TOPIC = 'nadia-mac-dojibos-pair-2026';
  var PAIR_SSE_URL = 'https://ntfy.sh/' + PAIR_TOPIC + '/sse';
  var PAIR_POST_URL = 'https://ntfy.sh/' + PAIR_TOPIC;
  var PAIR_POLL_URL = 'https://ntfy.sh/' + PAIR_TOPIC + '/json?poll=1&since=30s';

  var PAIRING_MGR = {
    eventSource: null,
    heartbeatInterval: null,
    myPeerId: null,
    preferredRole: 'auto', // 'mac' | 'nadia' | 'auto'
    hasDialed: false,
    active: false
  };

  function cleanupPairingMgr() {
    PAIRING_MGR.active = false;
    PAIRING_MGR.hasDialed = false;
    if (PAIRING_MGR.heartbeatInterval) {
      clearInterval(PAIRING_MGR.heartbeatInterval);
      PAIRING_MGR.heartbeatInterval = null;
    }
    if (PAIRING_MGR.eventSource) {
      try { PAIRING_MGR.eventSource.close(); } catch (e) {}
      PAIRING_MGR.eventSource = null;
    }
  }

  function getInviteUrl(code) {
    var room = code || ONLINE.roomCode || 'mac-nadia';
    return window.location.origin + window.location.pathname + '?room=' + encodeURIComponent(room) + '&auth=larny';
  }

  function updateQRCode(url) {
    var img = $('qrCodeImg');
    if (img) {
      img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + encodeURIComponent(url);
      img.style.display = 'block';
    }
  }

  function ensurePeerJS(callback) {
    if (typeof Peer !== 'undefined') {
      callback();
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';
    s.onload = function () { callback(); };
    s.onerror = function () {
      alert('ไม่สามารถโหลดไลบรารี PeerJS ได้ กรุณาลองใหม่อีกครั้ง');
    };
    document.head.appendChild(s);
  }

  function openOnlineModal() {
    var modal = $('onlineModal');
    if (modal) modal.classList.add('open');
  }

  function closeOnlineModal() {
    var modal = $('onlineModal');
    if (modal) modal.classList.remove('open');
  }

  function setOnlineModeUI(active, statusText) {
    var barSolo = $('tabModeSolo');
    var barOnline = $('tabModeOnline');
    var diffSelector = $('quickDiffSelector');
    var coupleBar = $('coupleQuickBar');
    var onlineStrip = $('onlineMatchStrip');
    var statusEl = $('onlineStatusText');
    var copyBtn = $('btnCopyRoomLinkInline');

    if (active) {
      barSolo?.classList.remove('active');
      barOnline?.classList.add('active');
      if (diffSelector) diffSelector.style.display = 'none';
      if (coupleBar) coupleBar.style.display = 'none';
      if (onlineStrip) onlineStrip.style.display = 'flex';
      if (statusEl) statusEl.textContent = statusText || '🟢 ออนไลน์: แมค vs นาเดีย';
      if (copyBtn) copyBtn.style.display = ONLINE.isHost ? 'inline-block' : 'none';
    } else {
      barSolo?.classList.add('active');
      barOnline?.classList.remove('active');
      if (diffSelector) diffSelector.style.display = 'flex';
      if (coupleBar) coupleBar.style.display = 'none';
      if (onlineStrip) onlineStrip.style.display = 'none';
    }
  }

  function attachConnectionEvents(conn, isHost) {
    if (ONLINE.conn && ONLINE.conn.open) return;
    ONLINE.conn = conn;

    conn.on('open', function () {
      cleanupPairingMgr();
      ONLINE.isOnline = true;
      ONLINE.isHost = isHost;
      closeOnlineModal();

      if (isHost) {
        setOnlineModeUI(true, '🟢 แข่งขัน Real-Time: คุณ (แมค) vs นาเดีย');
        conn.send({
          type: 'init',
          p1Char: STATE.selectedCharId,
          p1Name: PAIRING_MGR.preferredRole === 'nadia' ? 'นาเดีย (P1)' : 'แมค (P1)'
        });
        $('p1NameDisplay').textContent = PAIRING_MGR.preferredRole === 'nadia' ? 'นาเดีย (คุณ)' : 'แมค (คุณ)';
        $('p2NameDisplay').textContent = PAIRING_MGR.preferredRole === 'nadia' ? 'แมค (P2)' : 'นาเดีย (P2)';
        Snd.play('whistle');
        showGoalBanner('แมค & นาเดีย เชื่อมต่อสำเร็จ! ⚽✨', 'เริ่มดวล 1v1 สุดมันส์');
        setTimeout(hideGoalBanner, 1800);
        startMatch();
      } else {
        if (matchInterval) {
          clearInterval(matchInterval);
          matchInterval = null;
        }
        STATE.isMatchRunning = true;
        STATE.isGoalPaused = false;
        setOnlineModeUI(true, '🟢 เชื่อมต่อสำเร็จ: คุณ (นาเดีย) vs แมค');

        conn.send({
          type: 'ready',
          p2Char: STATE.selectedCharId,
          p2Name: PAIRING_MGR.preferredRole === 'mac' ? 'แมค (P2)' : 'นาเดีย (P2)'
        });

        $('p1NameDisplay').textContent = PAIRING_MGR.preferredRole === 'mac' ? 'นาเดีย (P1)' : 'แมค (P1)';
        $('p2NameDisplay').textContent = PAIRING_MGR.preferredRole === 'mac' ? 'แมค (คุณ)' : 'นาเดีย (คุณ)';
        var p2Char = getP2CharDef();
        $('p2AvatarDisplay').textContent = p2Char.avatar;

        Snd.play('whistle');
        showGoalBanner('เชื่อมต่อสำเร็จ! ⚽✨', 'พร้อมดวล 1v1 แมค vs นาเดีย!');
        setTimeout(hideGoalBanner, 1800);
      }
    });

    conn.on('data', function (data) {
      if (!data) return;
      if (isHost) {
        if (data.type === 'ready') {
          ONLINE.guestCharId = data.p2Char || 'nadia_star';
          ONLINE.guestName = data.p2Name || 'นาเดีย (P2)';
          ONLINE.remotePlayerCharId = ONLINE.guestCharId;
          $('p2NameDisplay').textContent = ONLINE.guestName;
          $('p2AvatarDisplay').textContent = getP2CharDef().avatar;
        } else if (data.type === 'input') {
          if (data.keys) ONLINE.guestKeys = data.keys;
        } else if (data.type === 'rematch') {
          $('resultModal').classList.remove('open');
          if (ONLINE.conn && ONLINE.conn.open) {
            ONLINE.conn.send({ type: 'start_match' });
          }
          startMatch();
        }
      } else {
        if (data.type === 'init') {
          ONLINE.hostCharId = data.p1Char || 'doji_dog';
          $('p1AvatarDisplay').textContent = getP1CharDef().avatar;
        } else if (data.type === 'state') {
          p1.x = data.p1.x; p1.y = data.p1.y; p1.vx = data.p1.vx; p1.vy = data.p1.vy; p1.facing = data.p1.facing; p1.isKicking = data.p1.isKicking;
          p1.scaleX = data.p1.scaleX || 1; p1.scaleY = data.p1.scaleY || 1; p1.tilt = data.p1.tilt || 0; p1.bob = data.p1.bob || 0;
          p2.x = data.p2.x; p2.y = data.p2.y; p2.vx = data.p2.vx; p2.vy = data.p2.vy; p2.facing = data.p2.facing; p2.isKicking = data.p2.isKicking;
          p2.scaleX = data.p2.scaleX || 1; p2.scaleY = data.p2.scaleY || 1; p2.tilt = data.p2.tilt || 0; p2.bob = data.p2.bob || 0;
          ball.x = data.ball.x; ball.y = data.ball.y; ball.vx = data.ball.vx; ball.vy = data.ball.vy;
          ball.rotation = data.ball.rotation; ball.isSuper = data.ball.isSuper; ball.superColor = data.ball.superColor;

          STATE.isMatchRunning = true;
          STATE.p1Score = data.score1; STATE.p2Score = data.score2;
          $('p1Score').textContent = data.score1; $('p2Score').textContent = data.score2;
          STATE.timer = data.timer; $('matchTimer').textContent = data.timer;
          STATE.p1SuperEnergy = data.p1Super; STATE.p2SuperEnergy = data.p2Super;
          updateSuperBars();
        } else if (data.type === 'goal') {
          STATE.p1Score = data.s1; STATE.p2Score = data.s2;
          STATE.isGoalPaused = true;
          $('p1Score').textContent = data.s1; $('p2Score').textContent = data.s2;
          var who = data.scorer === 2 ? 'นาเดีย (คุณ)' : 'แมค';
          showGoalBanner(data.scorer === 2 ? 'GOOOOOAL! ⚽🔥' : 'GOAL! ⚽💥', who + ' ยิงประตูได้แล้ว!');
          Snd.play('goal');
          setTimeout(function () {
            hideGoalBanner();
            STATE.isGoalPaused = false;
          }, 2200);
        } else if (data.type === 'start_match') {
          $('resultModal').classList.remove('open');
          STATE.p1Score = 0; STATE.p2Score = 0; STATE.timer = 60;
          $('p1Score').textContent = '0'; $('p2Score').textContent = '0'; $('matchTimer').textContent = '60';
          STATE.isMatchRunning = true;
          STATE.isGoalPaused = false;
          Snd.play('whistle');
          showGoalBanner('แมตช์ใหม่เริ่มต้น! ⚽⚡', 'ลุยกันต่อเลย!');
          setTimeout(hideGoalBanner, 1500);
        } else if (data.type === 'end') {
          STATE.p1Score = data.s1; STATE.p2Score = data.s2;
          endMatch();
        }
      }
    });

    conn.on('close', function () {
      showGoalBanner('⚠️ ขาดการเชื่อมต่อ', 'ผู้เล่นออกจากเกมแล้ว');
      setTimeout(function () {
        leaveOnlineMode();
      }, 2000);
    });

    conn.on('error', function (err) {
      console.warn('WebRTC conn error:', err);
    });
  }

  // 1-Click Instant Matchmaking for Mac & Nadia
  function startInstantOnline(preferredRole) {
    try {
      localStorage.setItem('nadiaplayground_auth', 'larny');
      var overlay = $('gateOverlay');
      if (overlay) overlay.style.display = 'none';
      document.body.style.overflow = '';
    } catch (e) {}

    ensurePeerJS(function () {
      cleanupPairingMgr();
      PAIRING_MGR.active = true;
      PAIRING_MGR.preferredRole = preferredRole || 'auto';

      var roleLabel = PAIRING_MGR.preferredRole === 'mac' ? '👑 แมค' : (PAIRING_MGR.preferredRole === 'nadia' ? '💖 นาเดีย' : '⚡ 1-Click');
      var statusEl = $('instantMatchStatus');
      if (statusEl) {
        statusEl.textContent = '⚡ กำลังจับคู่ ' + roleLabel + ' อัตโนมัติ...';
      }

      var coupleBar = $('coupleQuickBar');
      if (coupleBar) coupleBar.style.display = 'flex';
      $('quickDiffSelector') && ($('quickDiffSelector').style.display = 'none');
      $('tabModeSolo')?.classList.remove('active');
      $('tabModeOnline')?.classList.add('active');

      var myId = 'doji-' + (PAIRING_MGR.preferredRole === 'mac' ? 'm' : (PAIRING_MGR.preferredRole === 'nadia' ? 'n' : 'x')) + '-' + Math.random().toString(36).substring(2, 9);
      PAIRING_MGR.myPeerId = myId;
      ONLINE.roomCode = 'instant-' + PAIRING_MGR.preferredRole;

      if (ONLINE.peer) {
        try { ONLINE.peer.destroy(); } catch (e) {}
        ONLINE.peer = null;
      }

      try {
        ONLINE.peer = new Peer(myId, {
          config: ICE_CONFIG,
          debug: 1
        });
      } catch (e) {
        alert('ไม่สามารถเริ่มระบบจับคู่ออนไลน์ได้: ' + (e.message || e));
        return;
      }

      ONLINE.peer.on('connection', function (conn) {
        attachConnectionEvents(conn, true);
      });

      ONLINE.peer.on('open', function (id) {
        if (!PAIRING_MGR.active) return;
        setOnlineModeUI(true, '⏳ รอเชื่อมต่อ: ' + roleLabel + ' พร้อมแล้ว...');

        function broadcastPresence() {
          if (!PAIRING_MGR.active || (ONLINE.conn && ONLINE.conn.open)) return;
          var payload = {
            senderId: id,
            role: PAIRING_MGR.preferredRole,
            charId: STATE.selectedCharId,
            ts: Date.now()
          };
          fetch(PAIR_POST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(function () {});
        }

        function handlePresenceMessage(raw) {
          if (!PAIRING_MGR.active || (ONLINE.conn && ONLINE.conn.open)) return;
          var payload = null;
          try {
            var outer = typeof raw === 'string' ? JSON.parse(raw) : raw;
            var inner = outer.message ? JSON.parse(outer.message) : outer;
            payload = inner;
          } catch (e) {
            return;
          }
          if (!payload || !payload.senderId || payload.senderId === id) return;
          if (payload.ts && (Date.now() - payload.ts > 45000)) return;

          var shouldIDial = false;
          if (PAIRING_MGR.preferredRole === 'nadia' && payload.role === 'mac') {
            shouldIDial = true;
          } else if (PAIRING_MGR.preferredRole === 'mac' && payload.role === 'nadia') {
            shouldIDial = false;
          } else {
            shouldIDial = id > payload.senderId;
          }

          if (shouldIDial && !PAIRING_MGR.hasDialed) {
            PAIRING_MGR.hasDialed = true;
            if (statusEl) statusEl.textContent = '💖 กำลังเชื่อมต่อไปยังอีกฝั่ง...';
            var conn = ONLINE.peer.connect(payload.senderId, { reliable: true });
            attachConnectionEvents(conn, false);
          }
        }

        broadcastPresence();
        PAIRING_MGR.heartbeatInterval = setInterval(broadcastPresence, 2500);

        fetch(PAIR_POLL_URL)
          .then(function (res) { return res.text(); })
          .then(function (text) {
            if (!text) return;
            var lines = text.trim().split('\n');
            lines.forEach(function (line) {
              if (line) handlePresenceMessage(line);
            });
          })
          .catch(function () {});

        try {
          if (typeof EventSource !== 'undefined') {
            var es = new EventSource(PAIR_SSE_URL);
            PAIRING_MGR.eventSource = es;
            es.onmessage = function (ev) {
              handlePresenceMessage(ev.data);
            };
          }
        } catch (e) {}
      });

      ONLINE.peer.on('error', function (err) {
        console.warn('Peer error in instant pairing:', err);
      });
    });
  }

  function quickHostForMac() {
    startInstantOnline('mac');
  }

  function quickJoinForNadia() {
    startInstantOnline('nadia');
  }

  function startHost(roomCode) {
    ensurePeerJS(function () {
      var cleanCode = (roomCode || 'mac-nadia').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'mac-nadia';
      ONLINE.roomCode = cleanCode;

      if (ONLINE.peer) {
        try { ONLINE.peer.destroy(); } catch (e) {}
        ONLINE.peer = null;
      }

      var peerId = 'dojibos-' + cleanCode;
      try {
        ONLINE.peer = new Peer(peerId, {
          config: ICE_CONFIG,
          debug: 1
        });
      } catch (e) {
        alert('ไม่สามารถสร้าง Peer ได้: ' + (e.message || e));
        return;
      }

      $('hostActivePanel').style.display = 'flex';
      $('lblRoomCode').textContent = cleanCode;
      if ($('hostRoomInput')) $('hostRoomInput').value = cleanCode;

      var fullInviteUrl = getInviteUrl(cleanCode);
      updateQRCode(fullInviteUrl);

      setOnlineModeUI(true, '⏳ กำลังเปิดห้อง ' + cleanCode + ' กับเครือข่ายกลาง...');
      if ($('hostWaitingText')) {
        $('hostWaitingText').innerHTML = '⏳ กำลังเปิดห้อง <strong>"' + cleanCode + '"</strong>...';
      }

      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', fullInviteUrl);
      }

      ONLINE.peer.on('open', function (id) {
        setOnlineModeUI(true, '⏳ ห้องพร้อมแล้ว: รอนาเดียเข้าห้อง (' + cleanCode + ')...');
        if ($('hostWaitingText')) {
          $('hostWaitingText').innerHTML = '⏳ ห้อง <strong>"' + cleanCode + '"</strong> พร้อมแล้ว! ส่งลิงก์ให้นาเดียเปิดใน LINE หรือเปิดกล้องสแกน QR Code ด้านบนได้เลย';
        }
      });

      ONLINE.peer.on('connection', function (conn) {
        attachConnectionEvents(conn, true);
      });

      ONLINE.peer.on('error', function (err) {
        if (err.type === 'unavailable-id') {
          var altCode = cleanCode + '-' + Math.floor(10 + Math.random() * 89);
          if ($('hostRoomInput')) $('hostRoomInput').value = altCode;
          if ($('lblRoomCode')) $('lblRoomCode').textContent = altCode;
          if ($('hostWaitingText')) {
            $('hostWaitingText').innerHTML = '⚠️ รหัสเดิมยังติดค้างในระบบ จึงเปลี่ยนเป็น <strong>"' + altCode + '"</strong> ให้อัตโนมัติ (กรุณาส่งลิงก์ใหม่นี้นะคะ)';
          }
          var altUrl = getInviteUrl(altCode);
          updateQRCode(altUrl);
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, '', altUrl);
          }
          startHost(altCode);
          return;
        }
        setOnlineModeUI(false);
        var msg = err.message || err.type || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
        alert('การเชื่อมต่อขัดข้อง: ' + msg);
      });
    });
  }

  function startJoin(roomCode, retryCount, probeIndex) {
    ensurePeerJS(function () {
      var rawCode = (roomCode || 'mac-nadia').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'mac-nadia';
      var retries = retryCount || 0;
      var probe = probeIndex || 0;
      var MAX_RETRIES = 3;

      var probeList = [rawCode];
      if (rawCode === 'mac-nadia') {
        probeList = ['mac-nadia', 'mac-nadia-1', 'mac-nadia-2', 'mac-nadia-3', 'mac-nadia-4'];
      }
      var cleanCode = probeList[probe] || rawCode;
      ONLINE.roomCode = cleanCode;

      var statusEl = $('joinStatusDisplay');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.innerHTML = '<div class="online-connecting-box">💖 กำลังเชื่อมต่อไปยังห้องของแมค <strong>"' + cleanCode + '"</strong>... ' + (retries > 0 ? '(รอบที่ ' + (retries + 1) + '/' + (MAX_RETRIES + 1) + ')' : '') + '</div>';
      }

      if (ONLINE.peer) {
        try { ONLINE.peer.destroy(); } catch (e) {}
        ONLINE.peer = null;
      }

      try {
        ONLINE.peer = new Peer({
          config: ICE_CONFIG,
          debug: 1
        });
      } catch (e) {
        if (statusEl) {
          statusEl.innerHTML = '<div class="online-error-box">❌ เริ่ม WebRTC ไม่สำเร็จ: ' + (e.message || e) + '</div>';
        }
        return;
      }

      ONLINE.peer.on('open', function () {
        var targetId = 'dojibos-' + cleanCode;
        var conn = ONLINE.peer.connect(targetId, {
          reliable: true
        });
        attachConnectionEvents(conn, false);
      });

      ONLINE.peer.on('error', function (err) {
        if (probe < probeList.length - 1) {
          setTimeout(function () {
            startJoin(rawCode, retries, probe + 1);
          }, 1000);
          return;
        }

        if (retries < MAX_RETRIES) {
          if (statusEl) {
            statusEl.innerHTML = '<div class="online-connecting-box">⏳ กำลังรอห้องของแมค... จะลองใหม่อัตโนมัติ (ครั้งที่ ' + (retries + 1) + '/' + MAX_RETRIES + ')...</div>';
          }
          setTimeout(function () {
            startJoin(rawCode, retries + 1, 0);
          }, 2000);
          return;
        }

        if (statusEl) {
          statusEl.innerHTML = '<div class="online-error-box">' +
            '<div style="font-size:1.02rem;font-weight:900;color:#dc2626;margin-bottom:6px;">❌ ยังไม่พบห้อง "' + cleanCode + '"</div>' +
            '<div style="font-size:0.83rem;color:#475569;margin-bottom:10px;line-height:1.5;">' +
              '• แมคอาจจะยังไม่ได้กดปุ่ม <strong>"👑 แมคเปิดห้อง"</strong><br>' +
              '• หรือให้นาเดียเปิดจากลิงก์ที่แมคส่งให้ใน LINE' +
            '</div>' +
            '<button class="btn-retry-join" id="btnManualRetryJoin">🔄 ลองเชื่อมต่อใหม่อีกครั้ง</button>' +
          '</div>';

          $('btnManualRetryJoin')?.addEventListener('click', function () {
            var code = ($('joinRoomInput')?.value || cleanCode).trim();
            startJoin(code, 0, 0);
          });
        }
      });
    });
  }

  function leaveOnlineMode() {
    cleanupPairingMgr();
    ONLINE.isOnline = false;
    ONLINE.isHost = false;
    if (ONLINE.conn) {
      try { ONLINE.conn.close(); } catch (e) {}
      ONLINE.conn = null;
    }
    if (ONLINE.peer) {
      try { ONLINE.peer.destroy(); } catch (e) {}
      ONLINE.peer = null;
    }
    setOnlineModeUI(false);
    startMatch();
  }

  function copyRoomLink(code) {
    var url = getInviteUrl(code);
    function onSuccess() {
      var a = $('copyAlert');
      if (a) {
        a.style.display = 'block';
        setTimeout(function () { a.style.display = 'none'; }, 3500);
      }
      var b = $('btnCopyRoomLinkInline');
      if (b) {
        var old = b.textContent;
        b.textContent = '✅ คัดลอกแล้ว!';
        setTimeout(function () { b.textContent = old; }, 2000);
      }
      var c = $('btnCopyRoomLink');
      if (c) {
        var oldC = c.textContent;
        c.textContent = '✅ คัดลอกลิงก์สำเร็จ!';
        setTimeout(function () { c.textContent = oldC; }, 2000);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(onSuccess).catch(function () {
        prompt('คัดลอกลิงก์นี้ส่งให้นาเดีย:', url);
      });
    } else {
      prompt('คัดลอกลิงก์นี้ส่งให้นาเดีย:', url);
    }
  }

  function shareRoomLink(code) {
    var url = getInviteUrl(code);
    if (navigator.share) {
      navigator.share({
        title: 'The Dojibos - แมคชวนนาเดียดวลฟุตบอล!',
        text: '⚽ ที่รักเข้าห้องมาดวลฟุตบอลกัน! (คลิกลิงก์นี้เข้าเล่นได้เลย ไม่ต้องกรอกรหัสผ่าน)',
        url: url
      }).catch(function () {});
    } else {
      copyRoomLink(code);
    }
  }

  /* ==========================================================================
     10. PASSWORD GATE (VIP CHECK-IN)
     ========================================================================== */
  var PENDING_ROOM_JOIN = null;

  function isGateAuthed() {
    try {
      // Auto-unlock immediately if arriving via invite link (?room=, ?join=, ?auth=larny)
      var p = new URLSearchParams(window.location.search);
      if (p.get('room') || p.get('join') || (p.get('auth') || '').toLowerCase() === 'larny') {
        localStorage.setItem('nadiaplayground_auth', 'larny');
        return true;
      }
      return (localStorage.getItem('nadiaplayground_auth') || '').toLowerCase() === 'larny';
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

    if (!isGateAuthed()) {
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
          localStorage.setItem('nadiaplayground_auth', 'larny');
        } catch (e) {}
        overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.04)';
        document.body.style.overflow = '';
        setTimeout(function () {
          overlay.style.display = 'none';
        }, 300);
        Snd.play('whistle');

        if (PENDING_ROOM_JOIN) {
          var targetRoom = PENDING_ROOM_JOIN;
          PENDING_ROOM_JOIN = null;
          setTimeout(function () {
            startJoin(targetRoom, 0);
          }, 350);
        }
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

    $('btnFastGatePass')?.addEventListener('click', function () {
      try {
        localStorage.setItem('nadiaplayground_auth', 'larny');
      } catch (e) {}
      overlay.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(1.04)';
      document.body.style.overflow = '';
      setTimeout(function () {
        overlay.style.display = 'none';
      }, 250);
      Snd.play('whistle');

      if (PENDING_ROOM_JOIN) {
        var targetRoom = PENDING_ROOM_JOIN;
        PENDING_ROOM_JOIN = null;
        setTimeout(function () {
          startJoin(targetRoom, 0);
        }, 350);
      }
    });

    $('btnRelock')?.addEventListener('click', function () {
      try {
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

  /* ==========================================================================
     11. INITIALIZATION
     ========================================================================== */
  function init() {
    canvas = $('pitchCanvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    loadSavedData();
    updateDifficultyUI();
    setupPasswordGate();
    setupInputs();

    $('hudCoins').textContent = STATE.coins.toLocaleString();
    $('hudTrophies').textContent = STATE.trophies.toLocaleString();

    // Fixed 60Hz Physics Timestep Loop (Buttery smooth on 60Hz / 90Hz / 120Hz phone screens)
    var lastFrameTime = performance.now();
    var accumulator = 0;
    var FIXED_TIMESTEP = 1000 / 60; // 16.666ms

    function loop(currentTime) {
      if (!currentTime) currentTime = performance.now();
      var dt = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      // Clamp dt to 100ms to avoid spiral of death on backgrounding / sleep
      if (dt > 100) dt = 100;
      accumulator += dt;

      while (accumulator >= FIXED_TIMESTEP) {
        updatePhysics();
        accumulator -= FIXED_TIMESTEP;
      }

      renderPitch();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Start first match
    startMatch();

    // Auto-detect room parameter in URL (e.g. ?room=mac-nadia)
    var urlParams = new URLSearchParams(window.location.search);
    var roomQuery = urlParams.get('room') || urlParams.get('join');
    if (roomQuery) {
      if ($('joinRoomInput')) $('joinRoomInput').value = roomQuery;
      if (isGateAuthed()) {
        setTimeout(function () {
          startJoin(roomQuery, 0);
        }, 500);
      } else {
        PENDING_ROOM_JOIN = roomQuery;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
