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
     3. GAME STATE
     ========================================================================== */
  var STATE = {
    coins: 500,
    trophies: 0,
    selectedCharId: 'doji_dog',
    p1Score: 0,
    p2Score: 0,
    timer: 60,
    isMatchRunning: false,
    isGoalPaused: false,
    p1SuperEnergy: 0,
    p2SuperEnergy: 0,
    aiOpponentIndex: 0
  };

  function loadSavedData() {
    var raw = lsGet('dojibos_save_v1');
    if (raw) {
      try {
        var d = JSON.parse(raw);
        if (typeof d.coins === 'number') STATE.coins = d.coins;
        if (typeof d.trophies === 'number') STATE.trophies = d.trophies;
        if (d.selectedCharId) STATE.selectedCharId = d.selectedCharId;
      } catch (e) {}
    }
  }

  function saveGameData() {
    lsSet('dojibos_save_v1', JSON.stringify({
      coins: STATE.coins,
      trophies: STATE.trophies,
      selectedCharId: STATE.selectedCharId
    }));
  }

  function getSelectedChar() {
    return CHARACTERS.find(function (c) { return c.id === STATE.selectedCharId; }) || CHARACTERS[0];
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
    kickTimer: 0
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
    kickTimer: 0
  };

  // Input states
  var keys = {
    left: false,
    right: false,
    jump: false,
    kick: false,
    super: false
  };

  /* RESET BALL & POSITIONS */
  function resetPositions(scorer) {
    p1.x = 220;
    p1.y = GROUND_Y;
    p1.vx = 0; p1.vy = 0;
    p1.facing = 1;

    p2.x = W - 220;
    p2.y = GROUND_Y;
    p2.vx = 0; p2.vy = 0;
    p2.facing = -1;

    ball.x = W / 2;
    ball.y = 200;
    ball.vx = scorer === 1 ? -1.5 : (scorer === 2 ? 1.5 : 0);
    ball.vy = -3;
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

    var curChar = getSelectedChar();

    // 1. Player 1 Movement
    if (keys.left) p1.vx = -curChar.speed;
    else if (keys.right) p1.vx = curChar.speed;
    else p1.vx *= 0.75;

    if (keys.jump && p1.isGrounded) {
      p1.vy = -curChar.jumpForce;
      p1.isGrounded = false;
      Snd.play('jump');
    }

    // Apply Gravity to P1
    p1.vy += 0.48;
    p1.x += p1.vx;
    p1.y += p1.vy;

    if (p1.y >= GROUND_Y) {
      p1.y = GROUND_Y;
      p1.vy = 0;
      p1.isGrounded = true;
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

    // 2. Player 2 (AI Bot) Movement
    updateAI();

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
  function performKick(player, isSuperShot) {
    var kickDir = player.facing;
    var kickRange = player.radius + 38;
    var dx = ball.x - player.x;
    var dy = ball.y - player.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Kick reaches if ball is in front of player
    if (dist < kickRange + ball.radius && (dx * kickDir > -10)) {
      var curChar = getSelectedChar();
      var power = curChar.kickPower;

      if (isSuperShot) {
        power *= 1.8;
        ball.isSuper = true;
        ball.superColor = curChar.superColor;
        Snd.play('super');
      } else {
        Snd.play('kick');
      }

      ball.vx = kickDir * (power + 4);
      ball.vy = -power * 0.65;
    }
  }

  /* SMART AI OPPONENT BEHAVIOR */
  function updateAI() {
    var targetX = ball.x + 30; // Position behind ball to defend or shoot
    var distToBall = Math.hypot(ball.x - p2.x, ball.y - p2.y);

    // Stay on own half unless attacking
    if (ball.x < W / 2) {
      targetX = Math.max(W - 240, ball.x + 80);
    }

    if (p2.x < targetX - 10) p2.vx = 4.4;
    else if (p2.x > targetX + 10) p2.vx = -4.4;
    else p2.vx *= 0.7;

    // AI Jump when ball is overhead
    if (distToBall < 110 && ball.y < p2.y - 30 && p2.isGrounded && Math.random() < 0.25) {
      p2.vy = -10.8;
      p2.isGrounded = false;
      Snd.play('jump');
    }

    // Apply Gravity to P2
    p2.vy += 0.48;
    p2.x += p2.vx;
    p2.y += p2.vy;

    if (p2.y >= GROUND_Y) {
      p2.y = GROUND_Y;
      p2.vy = 0;
      p2.isGrounded = true;
    }

    if (p2.x < GOAL_W + p2.radius) p2.x = GOAL_W + p2.radius;
    if (p2.x > W - GOAL_W - p2.radius) p2.x = W - GOAL_W - p2.radius;

    // AI Kick
    if (distToBall < p2.radius + 32 && ball.x < p2.x && Math.random() < 0.4) {
      if (STATE.p2SuperEnergy >= 100 && Math.random() < 0.7) {
        STATE.p2SuperEnergy = 0;
        updateSuperBars();
        performKick(p2, true);
      } else {
        performKick(p2, false);
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
      showGoalBanner('GOOOOAL! ⚽🔥', getSelectedChar().name + ' ทำประตูได้อย่างงดงาม!');
      Snd.play('goal');
    } else {
      STATE.p2Score++;
      $('p2Score').textContent = STATE.p2Score;
      showGoalBanner('GOAL! ⚽💥', AI_NAMES[STATE.aiOpponentIndex] + ' ซัดเข้าประตูไปแล้ว!');
      Snd.play('goal');
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
    drawPlayer(p1, getSelectedChar(), true);
    drawPlayer(p2, { avatar: '🤖', jerseyColor: '#e63946', name: AI_NAMES[STATE.aiOpponentIndex] }, false);

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
    var cy = player.y - player.radius;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(cx, GROUND_Y - 2, player.radius * 0.85, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rounded Chibi Body with Jersey
    ctx.fillStyle = charDef.jerseyColor || '#ffd166';
    ctx.beginPath();
    ctx.arc(cx, cy, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2d232e';
    ctx.stroke();

    // Jersey Stripe / Number
    ctx.fillStyle = isP1 ? '#1d3557' : '#ffffff';
    ctx.font = 'bold 16px "Nunito", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isP1 ? '10' : '7', cx, cy + 8);

    // Chibi Avatar Face
    ctx.font = '28px sans-serif';
    ctx.fillText(charDef.avatar || '🐶', cx, cy - 14);

    // Cleats / Boots
    var cleatX = isP1 ? (cx + player.radius * 0.4) : (cx - player.radius * 0.4);
    var cleatY = player.y - 4;
    if (player.isKicking) {
      cleatX += isP1 ? 16 : -16;
      cleatY -= 8;
    }
    ctx.fillStyle = '#1d3557';
    ctx.beginPath();
    ctx.ellipse(cleatX, cleatY, 10, 6, isP1 ? 0.3 : -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
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

    var curChar = getSelectedChar();
    $('p1AvatarDisplay').textContent = curChar.avatar;
    $('p1NameDisplay').textContent = curChar.name;
    $('p2AvatarDisplay').textContent = '🤖';
    $('p2NameDisplay').textContent = AI_NAMES[STATE.aiOpponentIndex];

    updateSuperBars();
    resetPositions(0);

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

    if (isWin) {
      $('resultBadge').textContent = '🏆';
      $('resultTitle').textContent = 'ชัยชนะอันยอดเยี่ยม!';
      $('resultSub').textContent = 'คุณเอาชนะแมตช์นี้ได้อย่างสมศักดิ์ศรี!';
      var winCoins = 150 + (STATE.p1Score * 25);
      STATE.coins += winCoins;
      STATE.trophies += 1;
      $('rewardCoins').textContent = '+' + winCoins;
      $('rewardTrophies').textContent = '+1';
      Snd.play('goal');
    } else if (isDraw) {
      $('resultBadge').textContent = '🤝';
      $('resultTitle').textContent = 'เสมอกันอย่างดุเดือด!';
      $('resultSub').textContent = 'ทั้งสองทีมสูสีกันมาก แข่งใหม่อีกนัดเพื่อตัดสิน!';
      STATE.coins += 60;
      $('rewardCoins').textContent = '+60';
      $('rewardTrophies').textContent = '+0';
    } else {
      $('resultBadge').textContent = '😢';
      $('resultTitle').textContent = 'พ่ายแพ้ในนัดนี้!';
      $('resultSub').textContent = 'อย่าเพิ่งท้อ! ปรับแผนแล้วแข่งใหม่อีกรอบ!';
      STATE.coins += 30;
      $('rewardCoins').textContent = '+30';
      $('rewardTrophies').textContent = '+0';
    }

    $('hudCoins').textContent = STATE.coins.toLocaleString();
    $('hudTrophies').textContent = STATE.trophies.toLocaleString();
    saveGameData();

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
    $('p1AvatarDisplay').textContent = cur.avatar;
    $('p1NameDisplay').textContent = cur.name;
    Snd.play('whistle');
    $('rosterModal').classList.remove('open');
  };

  /* ==========================================================================
     8. CONTROLS & EVENT LISTENERS
     ========================================================================== */
  function setupInputs() {
    // Keyboard
    window.addEventListener('keydown', function (e) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') keys.jump = true;
      if (e.key === 'k' || e.key === 'K' || e.key === 'z' || e.key === 'Z' || e.key === 'Enter') keys.kick = true;
      if (e.key === 'l' || e.key === 'L' || e.key === 'x' || e.key === 'X') keys.super = true;
    });

    window.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') keys.jump = false;
      if (e.key === 'k' || e.key === 'K' || e.key === 'z' || e.key === 'Z' || e.key === 'Enter') keys.kick = false;
      if (e.key === 'l' || e.key === 'L' || e.key === 'x' || e.key === 'X') keys.super = false;
    });

    // Touch Buttons
    function bindTouch(btnId, keyName) {
      var btn = $(btnId);
      if (!btn) return;
      var press = function (e) { e.preventDefault(); keys[keyName] = true; btn.classList.add('pressed'); };
      var release = function (e) { e.preventDefault(); keys[keyName] = false; btn.classList.remove('pressed'); };
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    }

    bindTouch('touchLeft', 'left');
    bindTouch('touchRight', 'right');
    bindTouch('touchJump', 'jump');
    bindTouch('touchKick', 'kick');
    bindTouch('touchSuper', 'super');

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
      startMatch();
    });

    $('btnNextOpponent')?.addEventListener('click', function () {
      STATE.aiOpponentIndex = (STATE.aiOpponentIndex + 1) % AI_NAMES.length;
      $('resultModal').classList.remove('open');
      startMatch();
    });
  }

  /* ==========================================================================
     9. PASSWORD GATE (VIP CHECK-IN)
     ========================================================================== */
  function setupPasswordGate() {
    var overlay = $('gateOverlay');
    var input = $('gatePass');
    var btn = $('gateBtn');
    var err = $('gateErr');
    var box = $('gateBox');
    if (!overlay || !input || !btn) return;

    function isAuthed() {
      try {
        return (localStorage.getItem('nadiaplayground_auth') || '').toLowerCase() === 'larny';
      } catch (e) {
        return false;
      }
    }

    if (!isAuthed()) {
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
     10. INITIALIZATION
     ========================================================================== */
  function init() {
    canvas = $('pitchCanvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    loadSavedData();
    setupPasswordGate();
    setupInputs();

    $('hudCoins').textContent = STATE.coins.toLocaleString();
    $('hudTrophies').textContent = STATE.trophies.toLocaleString();

    // Start 60fps Game Loop
    function loop() {
      updatePhysics();
      renderPitch();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Start first match
    startMatch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
