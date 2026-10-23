/**
 * Dogney Courts 🎾🎳⚾🥊 — Wii Sports Pet Edition
 * Authentic, juicy, punchy multi-sport arcade suite for Nadia Playground.
 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ==========================================================================
     1. WEB AUDIO SYNTHESIZER (PUNCHY & JUICY SFX)
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

        if (kind === 'tennis_hit') {
          // Sharp synthetic racket pop
          var o = c.createOscillator(), g = c.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(320, now);
          o.frequency.exponentialRampToValueAtTime(70, now + 0.1);
          g.gain.setValueAtTime(0.35, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          o.connect(g); g.connect(c.destination);
          o.start(now); o.stop(now + 0.13);
        } else if (kind === 'tennis_smash') {
          // Explosive flame smash
          var o1 = c.createOscillator(), o2 = c.createOscillator(), gS = c.createGain();
          o1.type = 'sawtooth'; o2.type = 'square';
          o1.frequency.setValueAtTime(550, now);
          o1.frequency.exponentialRampToValueAtTime(90, now + 0.22);
          o2.frequency.setValueAtTime(880, now);
          o2.frequency.exponentialRampToValueAtTime(120, now + 0.22);
          gS.gain.setValueAtTime(0.4, now);
          gS.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          o1.connect(gS); o2.connect(gS); gS.connect(c.destination);
          o1.start(now); o2.start(now); o1.stop(now + 0.25); o2.stop(now + 0.25);
        } else if (kind === 'bowling_roll') {
          // Low wooden lane rumble
          var oR = c.createOscillator(), gR = c.createGain();
          oR.type = 'sine';
          oR.frequency.setValueAtTime(90, now);
          oR.frequency.linearRampToValueAtTime(140, now + 0.4);
          gR.gain.setValueAtTime(0.18, now);
          gR.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          oR.connect(gR); gR.connect(c.destination);
          oR.start(now); oR.stop(now + 0.46);
        } else if (kind === 'bowling_pin') {
          // High-frequency wooden pin crash
          [1100, 1450, 1800, 2200].forEach(function (f, idx) {
            var oP = c.createOscillator(), gP = c.createGain();
            oP.type = 'triangle';
            oP.frequency.setValueAtTime(f, now + idx * 0.02);
            oP.frequency.exponentialRampToValueAtTime(200, now + idx * 0.02 + 0.15);
            gP.gain.setValueAtTime(0.2, now + idx * 0.02);
            gP.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.02 + 0.18);
            oP.connect(gP); gP.connect(c.destination);
            oP.start(now + idx * 0.02); oP.stop(now + idx * 0.02 + 0.19);
          });
        } else if (kind === 'strike') {
          // Bowling strike fanfare
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, idx) {
            var oSt = c.createOscillator(), gSt = c.createGain();
            oSt.type = 'square';
            oSt.frequency.setValueAtTime(f, now + idx * 0.08);
            gSt.gain.setValueAtTime(0.22, now + idx * 0.08);
            gSt.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
            oSt.connect(gSt); gSt.connect(c.destination);
            oSt.start(now + idx * 0.08); oSt.stop(now + idx * 0.08 + 0.42);
          });
        } else if (kind === 'bat_crack') {
          // Pure solid wooden bat crack
          var oB = c.createOscillator(), gB = c.createGain();
          oB.type = 'sawtooth';
          oB.frequency.setValueAtTime(800, now);
          oB.frequency.exponentialRampToValueAtTime(110, now + 0.15);
          gB.gain.setValueAtTime(0.5, now);
          gB.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          oB.connect(gB); gB.connect(c.destination);
          oB.start(now); oB.stop(now + 0.17);
        } else if (kind === 'homerun') {
          // Stadium fireworks & roar
          [440, 554, 659, 880, 1108].forEach(function (f, idx) {
            var oH = c.createOscillator(), gH = c.createGain();
            oH.type = 'triangle';
            oH.frequency.setValueAtTime(f, now + idx * 0.1);
            gH.gain.setValueAtTime(0.25, now + idx * 0.1);
            gH.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
            oH.connect(gH); gH.connect(c.destination);
            oH.start(now + idx * 0.1); oH.stop(now + idx * 0.1 + 0.65);
          });
        } else if (kind === 'box_punch') {
          // Heavy leather boxing hook impact
          var oBx = c.createOscillator(), gBx = c.createGain();
          oBx.type = 'square';
          oBx.frequency.setValueAtTime(260, now);
          oBx.frequency.exponentialRampToValueAtTime(50, now + 0.14);
          gBx.gain.setValueAtTime(0.4, now);
          gBx.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          oBx.connect(gBx); gBx.connect(c.destination);
          oBx.start(now); oBx.stop(now + 0.16);
        } else if (kind === 'box_ko') {
          // 3-bell knockout
          [900, 900, 900].forEach(function (f, idx) {
            var oBell = c.createOscillator(), gBell = c.createGain();
            oBell.type = 'sine';
            oBell.frequency.setValueAtTime(f, now + idx * 0.2);
            gBell.gain.setValueAtTime(0.35, now + idx * 0.2);
            gBell.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.4);
            oBell.connect(gBell); gBell.connect(c.destination);
            oBell.start(now + idx * 0.2); oBell.stop(now + idx * 0.2 + 0.42);
          });
        } else if (kind === 'whistle') {
          var oW = c.createOscillator(), gW = c.createGain();
          oW.type = 'sine';
          oW.frequency.setValueAtTime(2500, now);
          gW.gain.setValueAtTime(0.18, now);
          gW.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          oW.connect(gW); gW.connect(c.destination);
          oW.start(now); oW.stop(now + 0.2);
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
     2. CHARACTER ROSTER
     ========================================================================== */
  var CHARACTERS = [
    {
      id: 'dogney',
      name: 'Dogney Pup 🐕',
      avatar: '🐕',
      role: 'สปีดสายฟ้า ดวลแต้มไว',
      power: 1.15,
      speed: 1.25,
      specialty: 'Tennis & Boxing Counter'
    },
    {
      id: 'doji_dog',
      name: 'Doji Dog 🐶',
      avatar: '🐶',
      role: 'กัปตันจอมพลัง ตีหนักทุกลูก',
      power: 1.3,
      speed: 1.0,
      specialty: 'Baseball Home Run King'
    },
    {
      id: 'boba_seal',
      name: 'Boba Seal 🦭',
      avatar: '🦭',
      role: 'จอมพลังลูกสปิน หมุนเข้าเป้า',
      power: 1.2,
      speed: 0.9,
      specialty: 'Bowling Hook Master'
    },
    {
      id: 'sockney',
      name: 'Sockney 🧦',
      avatar: '🧦',
      role: 'ลูกเล่นแพรวพราว ยิงไซด์โค้ง',
      power: 1.05,
      speed: 1.2,
      specialty: 'Tennis Slices & Curveball'
    },
    {
      id: 'nadia_star',
      name: 'Nadia Star ⭐',
      avatar: '⭐',
      role: 'ดาวเด่นแชมเปียนครบเครื่อง',
      power: 1.35,
      speed: 1.35,
      specialty: 'All-Round Champion'
    }
  ];

  /* ==========================================================================
     3. GLOBAL GAME STATE
     ========================================================================== */
  var STATE = {
    coins: 600,
    trophies: 0,
    selectedCharId: 'dogney',
    activeSport: 'tennis', // 'tennis' | 'bowling' | 'baseball' | 'boxing'
    isPaused: false
  };

  function loadSavedData() {
    var raw = lsGet('dogney_courts_save_v1');
    if (raw) {
      try {
        var d = JSON.parse(raw);
        if (typeof d.coins === 'number') STATE.coins = d.coins;
        if (typeof d.trophies === 'number') STATE.trophies = d.trophies;
        if (d.selectedCharId) STATE.selectedCharId = d.selectedCharId;
        if (d.activeSport) STATE.activeSport = d.activeSport;
      } catch (e) {}
    }
  }

  function saveGameData() {
    lsSet('dogney_courts_save_v1', JSON.stringify({
      coins: STATE.coins,
      trophies: STATE.trophies,
      selectedCharId: STATE.selectedCharId,
      activeSport: STATE.activeSport
    }));
  }

  function getSelectedChar() {
    return CHARACTERS.find(function (c) { return c.id === STATE.selectedCharId; }) || CHARACTERS[0];
  }

  /* ==========================================================================
     4. CONTROLS & INPUT SYSTEM
     ========================================================================== */
  var keys = { left: false, right: false, up: false, down: false, action: false, superAction: false };

  function setupInputs() {
    window.addEventListener('keydown', function (e) {
      var k = e.key;
      var c = e.code;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k) || c === 'Space') {
        e.preventDefault();
      }
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = true;
      if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = true;
      if (k === 'ArrowUp' || k === 'w' || k === 'W') keys.up = true;
      if (k === 'ArrowDown' || k === 's' || k === 'S') keys.down = true;
      if (c === 'Space' || k === 'Enter' || k === 'x' || k === 'X') {
        keys.action = true;
        handleActionPress();
      }
      if (k === 'Shift' || k === 'c' || k === 'C') {
        keys.superAction = true;
        handleSuperActionPress();
      }
    });

    window.addEventListener('keyup', function (e) {
      var k = e.key;
      var c = e.code;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
      if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
      if (k === 'ArrowUp' || k === 'w' || k === 'W') keys.up = false;
      if (k === 'ArrowDown' || k === 's' || k === 'S') keys.down = false;
      if (c === 'Space' || k === 'Enter' || k === 'x' || k === 'X') keys.action = false;
      if (k === 'Shift' || k === 'c' || k === 'C') keys.superAction = false;
    });

    // Touch button bindings
    function bindBtn(btnId, onDown, onUp) {
      var b = $(btnId);
      if (!b) return;
      var press = function (e) { e.preventDefault(); b.classList.add('pressed'); if (onDown) onDown(); };
      var release = function (e) { e.preventDefault(); b.classList.remove('pressed'); if (onUp) onUp(); };
      b.addEventListener('touchstart', press, { passive: false });
      b.addEventListener('touchend', release, { passive: false });
      b.addEventListener('mousedown', press);
      b.addEventListener('mouseup', release);
      b.addEventListener('mouseleave', release);
    }

    bindBtn('btnActionLeft', function () { keys.left = true; }, function () { keys.left = false; });
    bindBtn('btnActionRight', function () { keys.right = true; }, function () { keys.right = false; });
    bindBtn('btnActionUp', function () { keys.up = true; }, function () { keys.up = false; });
    bindBtn('btnActionDown', function () { keys.down = true; }, function () { keys.down = false; });
    bindBtn('btnMainAction', function () { keys.action = true; handleActionPress(); }, function () { keys.action = false; });
    bindBtn('btnSubAction', function () { keys.superAction = true; handleSuperActionPress(); }, function () { keys.superAction = false; });

    // Canvas click also triggers main action
    $('arenaCanvas')?.addEventListener('click', function () {
      handleActionPress();
    });
  }

  function handleActionPress() {
    if (STATE.activeSport === 'tennis') Tennis.onAction();
    else if (STATE.activeSport === 'bowling') Bowling.onAction();
    else if (STATE.activeSport === 'baseball') Baseball.onAction();
    else if (STATE.activeSport === 'boxing') Boxing.onAction(false);
  }

  function handleSuperActionPress() {
    if (STATE.activeSport === 'tennis') Tennis.onSuper();
    else if (STATE.activeSport === 'boxing') Boxing.onAction(true);
    else handleActionPress();
  }

  /* ==========================================================================
     5. SPORT 1: 🎾 DOGNEY TENNIS (FAST 1V1 RALLIES & SMASHES)
     ========================================================================== */
  var Tennis = (function () {
    var p1Score = 0, p2Score = 0;
    var state = 'serve'; // 'serve' | 'rally' | 'scored'
    var serveTiming = 0, serveDir = 1;
    var ball = { x: 480, y: 380, vx: 0, vy: 0, r: 12, z: 0, isSmash: false };
    var p1 = { x: 480, y: 440, vx: 0, swingTimer: 0 };
    var p2 = { x: 480, y: 150, vx: 0, swingTimer: 0 };

    function initSport() {
      p1Score = 0; p2Score = 0;
      updateScores();
      $('btnMainAction').textContent = '🎾 เสิร์ฟ / หวดบอล (Space)';
      $('btnSubAction').textContent = '⚡ กระโดดสแมช (W)';
      $('hintText').textContent = '💡 เทคนิค: เล็งลูกขณะลอยเข้าหาระยะไม้ แล้วกด Spacebar เพื่อหวดลูกโค้งความเร็วสูง!';
      resetServe();
    }

    function resetServe() {
      state = 'serve';
      ball.x = p1.x; ball.y = 400; ball.vx = 0; ball.vy = 0; ball.isSmash = false;
      $('hudSubStatus').textContent = '🎾 กด Spacebar หรือคลิกเพื่อเสิร์ฟบอล!';
      $('powerMeterBox').style.display = 'block';
    }

    function updateScores() {
      $('p1ScoreDisplay').textContent = p1Score;
      $('p2ScoreDisplay').textContent = p2Score;
    }

    function onAction() {
      if (state === 'serve') {
        state = 'rally';
        $('powerMeterBox').style.display = 'none';
        var char = getSelectedChar();
        var power = char.power;
        var perfect = (serveTiming > 68 && serveTiming < 92);
        if (perfect) {
          showBanner('NICE SERVE! ⚡', 'เสิร์ฟระดับความเร็ว 195 km/h!');
          Snd.play('tennis_smash');
          ball.isSmash = true;
          ball.vx = (Math.random() - 0.5) * 6;
          ball.vy = -14 * power;
        } else {
          Snd.play('tennis_hit');
          ball.isSmash = false;
          ball.vx = (Math.random() - 0.5) * 4;
          ball.vy = -10 * power;
        }
        $('hudSubStatus').textContent = '🎾 แรลลี่ดวลความเร็ว! ขยับซ้ายขวาเพื่อตีโต้!';
      } else if (state === 'rally') {
        p1.swingTimer = 12;
        // Check if ball is in hit zone
        var dist = Math.hypot(ball.x - p1.x, ball.y - p1.y);
        if (dist < 85 && ball.vy > 0) {
          var char = getSelectedChar();
          var offset = (ball.x - p1.x) / 50;
          ball.vx = offset * 9;
          ball.vy = -11 * char.power;
          ball.isSmash = false;
          Snd.play('tennis_hit');
        }
      }
    }

    function onSuper() {
      if (state === 'rally') {
        p1.swingTimer = 16;
        var dist = Math.hypot(ball.x - p1.x, ball.y - p1.y);
        if (dist < 100 && ball.vy > 0) {
          var char = getSelectedChar();
          var offset = (ball.x - p1.x) / 50;
          ball.vx = offset * 12;
          ball.vy = -16 * char.power;
          ball.isSmash = true;
          Snd.play('tennis_smash');
          showBanner('SMASH! 🔥', char.name + ' กระโดดตบลูกไฟเต็มข้อ!');
        }
      }
    }

    function update() {
      // Serve meter tick
      if (state === 'serve') {
        serveTiming += serveDir * 2.5;
        if (serveTiming > 100) { serveTiming = 100; serveDir = -1; }
        if (serveTiming < 0) { serveTiming = 0; serveDir = 1; }
        var mBar = $('meterBar');
        if (mBar) mBar.style.width = serveTiming + '%';
      }

      // P1 movement
      var curChar = getSelectedChar();
      var speed = 7.5 * curChar.speed;
      if (keys.left) p1.x -= speed;
      if (keys.right) p1.x += speed;
      if (p1.x < 140) p1.x = 140;
      if (p1.x > 820) p1.x = 820;

      if (p1.swingTimer > 0) p1.swingTimer--;
      if (p2.swingTimer > 0) p2.swingTimer--;

      if (state === 'rally') {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall bounds
        if (ball.x < 110) { ball.x = 110; ball.vx = Math.abs(ball.vx); }
        if (ball.x > 850) { ball.x = 850; ball.vx = -Math.abs(ball.vx); }

        // AI (P2) Movement & return
        var targetX = ball.x + (Math.random() - 0.5) * 15;
        if (p2.x < targetX - 6) p2.x += 6.5;
        else if (p2.x > targetX + 6) p2.x -= 6.5;

        // P2 hit
        if (ball.y < 185 && ball.vy < 0) {
          var distP2 = Math.hypot(ball.x - p2.x, ball.y - p2.y);
          if (distP2 < 75) {
            p2.swingTimer = 12;
            ball.vx = (ball.x - p2.x) * 0.16 + (Math.random() - 0.5) * 4;
            ball.vy = Math.min(14, Math.abs(ball.vy) + 0.5);
            ball.isSmash = false;
            Snd.play('tennis_hit');
          }
        }

        // Check Point
        if (ball.y < 60) {
          // P1 scores!
          p1Score++;
          updateScores();
          Snd.play('homerun');
          showBanner('POINT! 🎾✨', getSelectedChar().name + ' ได้แต้มสวยงาม!');
          checkWin();
        } else if (ball.y > 510) {
          // P2 scores!
          p2Score++;
          updateScores();
          Snd.play('whistle');
          showBanner('OUT! 🎾💥', 'Robo-Bot ได้แต้ม!');
          checkWin();
        }
      }
    }

    function checkWin() {
      state = 'scored';
      setTimeout(function () {
        if (p1Score >= 3 || p2Score >= 3) {
          endSportMatch(p1Score > p2Score, p1Score + ' - ' + p2Score, 'Tennis Master 🎾');
        } else {
          resetServe();
        }
      }, 1600);
    }

    function render(c) {
      // 1. Tennis court background
      c.fillStyle = '#065f46';
      c.fillRect(0, 0, 960, 540);

      // Court surface (Blue/Green Hardcourt)
      c.fillStyle = '#0284c7';
      c.fillRect(100, 70, 760, 420);

      // Court Inner Lines
      c.strokeStyle = '#ffffff';
      c.lineWidth = 4;
      c.strokeRect(100, 70, 760, 420);

      // Baseline, service lines
      c.strokeRect(180, 140, 600, 280);
      c.beginPath();
      // Center line
      c.moveTo(480, 140); c.lineTo(480, 420);
      c.stroke();

      // Net
      c.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      c.lineWidth = 8;
      c.beginPath();
      c.moveTo(80, 275); c.lineTo(880, 275);
      c.stroke();
      // Net mesh pattern
      c.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      c.lineWidth = 1.5;
      for (var nx = 80; nx < 880; nx += 16) {
        c.beginPath(); c.moveTo(nx, 268); c.lineTo(nx, 282); c.stroke();
      }

      // Ball Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.beginPath();
      c.ellipse(ball.x, ball.y + 14, ball.r * 1.1, 6, 0, 0, Math.PI * 2);
      c.fill();

      // Ball
      c.fillStyle = ball.isSmash ? '#ff0055' : '#ccff00';
      c.beginPath();
      c.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#1e293b'; c.lineWidth = 2; c.stroke();

      // Draw P2 (AI)
      drawTennisPlayer(c, p2.x, p2.y, '🤖', '#ef4444', p2.swingTimer > 0, false);

      // Draw P1 (Player)
      var char = getSelectedChar();
      drawTennisPlayer(c, p1.x, p1.y, char.avatar, '#0284c7', p1.swingTimer > 0, true);
    }

    function drawTennisPlayer(c, x, y, avatar, color, isSwinging, isP1) {
      c.save();
      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.beginPath(); c.ellipse(x, y + 15, 26, 8, 0, 0, Math.PI * 2); c.fill();

      // Body
      c.fillStyle = color;
      c.beginPath(); c.arc(x, y, 22, 0, Math.PI * 2); c.fill();
      c.lineWidth = 2.5; c.strokeStyle = '#fff'; c.stroke();

      // Avatar
      c.font = '26px sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(avatar, x, y);

      // Racket
      var rx = isSwinging ? (x + (isP1 ? 32 : -32)) : (x + 28);
      var ry = isSwinging ? (y - 12) : (y + 4);
      c.fillStyle = '#ffd166';
      c.beginPath(); c.ellipse(rx, ry, 12, 18, isSwinging ? 0.6 : 0.2, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#1e293b'; c.lineWidth = 2; c.stroke();
      c.restore();
    }

    return {
      init: initSport,
      onAction: onAction,
      onSuper: onSuper,
      update: update,
      render: render
    };
  })();

  /* ==========================================================================
     6. SPORT 2: 🎳 DOGNEY BOWLING (10 PINS SCATTER PHYSICS)
     ========================================================================== */
  var Bowling = (function () {
    var frame = 1, totalScore = 0;
    var state = 'position'; // 'position' | 'aim' | 'roll' | 'reset'
    var ball = { x: 480, y: 470, vx: 0, vy: 0, r: 16, spin: 0 };
    var aimAngle = 0, aimDir = 1;
    var pins = [];
    var rollPower = 0;

    function initPins() {
      pins = [];
      var rows = [
        [0],
        [-18, 18],
        [-36, 0, 36],
        [-54, -18, 18, 54]
      ];
      var startY = 130;
      rows.forEach(function (r, rowIdx) {
        r.forEach(function (offset) {
          pins.push({
            x: 480 + offset,
            y: startY - rowIdx * 20,
            r: 10,
            isStanding: true,
            vx: 0,
            vy: 0,
            rot: 0
          });
        });
      });
    }

    function initSport() {
      frame = 1; totalScore = 0;
      initPins();
      resetBall();
      $('btnMainAction').textContent = '🎳 กลิ้งลูกโบว์ลิ่ง (Space)';
      $('btnSubAction').textContent = '🎯 ล็อคเป้าหมาย';
      $('hintText').textContent = '💡 เทคนิค: เล็งลูกให้อยู่กึ่งกลาง หรือใส่สปินเบี่ยงเข้าซอกพิน 1 กับ 3 เพื่อทำ Strike!';
      updateHud();
    }

    function updateHud() {
      $('p1ScoreDisplay').textContent = totalScore;
      $('p2ScoreDisplay').textContent = 'เฟรม ' + frame + '/5';
    }

    function resetBall() {
      state = 'position';
      ball.x = 480; ball.y = 470; ball.vx = 0; ball.vy = 0; ball.spin = 0;
      aimAngle = 0;
      $('hudSubStatus').textContent = '🎳 ขยับลูกซ้าย-ขวา แล้วกด Space เพื่อเล็งมุม!';
    }

    function onAction() {
      if (state === 'position') {
        state = 'aim';
        $('hudSubStatus').textContent = '🎯 ดูมุมเล็ง แล้วกด Space เพื่อปล่อยลูก!';
      } else if (state === 'aim') {
        state = 'roll';
        var char = getSelectedChar();
        ball.vx = Math.sin(aimAngle) * 9 * char.power;
        ball.vy = -12 * char.power;
        Snd.play('bowling_roll');
        $('hudSubStatus').textContent = '🎳 ลูกกำลังพุ่งเข้าหาพิน...';
      }
    }

    function update() {
      if (state === 'position') {
        if (keys.left) ball.x -= 4;
        if (keys.right) ball.x += 4;
        if (ball.x < 360) ball.x = 360;
        if (ball.x > 600) ball.x = 600;
      } else if (state === 'aim') {
        aimAngle += aimDir * 0.025;
        if (aimAngle > 0.35) { aimAngle = 0.35; aimDir = -1; }
        if (aimAngle < -0.35) { aimAngle = -0.35; aimDir = 1; }
      } else if (state === 'roll') {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Gutter check
        if (ball.x < 330 || ball.x > 630) {
          ball.vx = 0;
          $('hudSubStatus').textContent = 'ลงราง (Gutter)!';
        }

        // Collision with pins
        var hitAny = false;
        pins.forEach(function (pin) {
          if (pin.isStanding) {
            var dist = Math.hypot(ball.x - pin.x, ball.y - pin.y);
            if (dist < ball.r + pin.r) {
              pin.isStanding = false;
              pin.vx = ball.vx * 0.7 + (Math.random() - 0.5) * 6;
              pin.vy = ball.vy * 0.7 - Math.random() * 4;
              hitAny = true;
            }
          }
        });

        if (hitAny) {
          Snd.play('bowling_pin');
        }

        // Pins knocking other pins
        pins.forEach(function (p1) {
          if (!p1.isStanding && (Math.abs(p1.vx) > 0.5 || Math.abs(p1.vy) > 0.5)) {
            pins.forEach(function (p2) {
              if (p2.isStanding) {
                var d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (d < 22) {
                  p2.isStanding = false;
                  p2.vx = p1.vx * 0.6 + (Math.random() - 0.5) * 4;
                  p2.vy = p1.vy * 0.6 - Math.random() * 3;
                }
              }
            });
          }
        });

        // Pin physics updates
        pins.forEach(function (p) {
          if (!p.isStanding) {
            p.x += p.vx; p.y += p.vy;
            p.vx *= 0.9; p.vy *= 0.9;
            p.rot += 0.1;
          }
        });

        // End roll
        if (ball.y < 40) {
          state = 'reset';
          var downCount = pins.filter(function (p) { return !p.isStanding; }).length;
          var frameScore = downCount * 10;
          totalScore += frameScore;
          updateHud();

          if (downCount === 10) {
            Snd.play('strike');
            showBanner('STRIKE! 🎳🔥', 'สไตรค์สมบูรณ์แบบ ล้มทั้ง 10 พิน!');
          } else {
            showBanner(downCount + ' PINS!', 'ล้มไป ' + downCount + ' พิน ได้ ' + frameScore + ' แต้ม!');
          }

          setTimeout(function () {
            frame++;
            if (frame > 5) {
              endSportMatch(totalScore >= 250, totalScore + ' แต้ม', 'Bowling King 🎳');
            } else {
              initPins();
              resetBall();
            }
          }, 2000);
        }
      }
    }

    function render(c) {
      // Stadium floor
      c.fillStyle = '#0f172a';
      c.fillRect(0, 0, 960, 540);

      // Polished Maple Bowling Lane
      var grad = c.createLinearGradient(310, 0, 650, 0);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.1, '#fef3c7');
      grad.addColorStop(0.5, '#fde68a');
      grad.addColorStop(0.9, '#fef3c7');
      grad.addColorStop(1, '#78350f');
      c.fillStyle = grad;
      c.fillRect(310, 40, 340, 470);

      // Gutters on left & right
      c.fillStyle = '#1e293b';
      c.fillRect(280, 40, 30, 470);
      c.fillRect(650, 40, 30, 470);

      // Lane Guide Arrows (Chevron dots)
      c.fillStyle = '#92400e';
      [400, 440, 480, 520, 560].forEach(function (ax) {
        c.beginPath();
        c.moveTo(ax, 320); c.lineTo(ax - 6, 335); c.lineTo(ax + 6, 335); c.closePath();
        c.fill();
      });

      // Draw Pins
      pins.forEach(function (p) {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        if (p.isStanding) {
          // Standing pin
          c.fillStyle = '#ffffff';
          c.beginPath(); c.ellipse(0, 0, 7, 14, 0, 0, Math.PI * 2); c.fill();
          // Red stripes
          c.fillStyle = '#ef4444';
          c.fillRect(-6, -4, 12, 3);
          c.fillRect(-5, 2, 10, 3);
          c.strokeStyle = '#334155'; c.lineWidth = 1; c.stroke();
        } else {
          // Knocked down pin
          c.fillStyle = 'rgba(255, 255, 255, 0.6)';
          c.beginPath(); c.ellipse(0, 0, 5, 12, 1.2, 0, Math.PI * 2); c.fill();
        }
        c.restore();
      });

      // Aim Arrow Line
      if (state === 'aim') {
        c.save();
        c.strokeStyle = '#ef4444';
        c.lineWidth = 3;
        c.setLineDash([8, 6]);
        c.beginPath();
        c.moveTo(ball.x, ball.y);
        c.lineTo(ball.x + Math.sin(aimAngle) * 320, ball.y - 320);
        c.stroke();
        c.restore();
      }

      // Draw Bowling Ball
      c.save();
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.beginPath(); c.ellipse(ball.x, ball.y + 6, ball.r, 6, 0, 0, Math.PI * 2); c.fill();
      // Shiny Marble Bowling Ball
      var bGrad = c.createRadialGradient(ball.x - 4, ball.y - 4, 2, ball.x, ball.y, ball.r);
      bGrad.addColorStop(0, '#38bdf8');
      bGrad.addColorStop(0.7, '#0284c7');
      bGrad.addColorStop(1, '#082f49');
      c.fillStyle = bGrad;
      c.beginPath(); c.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); c.fill();

      // Finger Holes
      c.fillStyle = '#0f172a';
      c.beginPath(); c.arc(ball.x - 4, ball.y - 5, 2.5, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(ball.x + 4, ball.y - 5, 2.5, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(ball.x, ball.y + 3, 2.5, 0, Math.PI * 2); c.fill();
      c.restore();
    }

    return {
      init: initSport,
      onAction: onAction,
      update: update,
      render: render
    };
  })();

  /* ==========================================================================
     7. SPORT 3: ⚾ DOGNEY BASEBALL (HOME RUN DERBY)
     ========================================================================== */
  var Baseball = (function () {
    var pitchCount = 0, homeRuns = 0, totalDist = 0;
    var state = 'ready'; // 'ready' | 'pitch' | 'flying'
    var ball = { x: 480, y: 160, vx: 0, vy: 0, scale: 0.35, isHit: false, hitText: '' };
    var bat = { angle: 0, isSwinging: false, swingTimer: 0 };
    var pitchSpeed = 145;

    function initSport() {
      pitchCount = 0; homeRuns = 0; totalDist = 0;
      updateHud();
      $('btnMainAction').textContent = '⚾ หวดไม้เบสบอล (Space)';
      $('btnSubAction').textContent = '⚡ สวิงเต็มแรง';
      $('hintText').textContent = '💡 เทคนิค: ดูจังหวะบอลพุ่งเข้ามาใกล้จุดโฮมเพลท แล้วกด Spacebar เพื่อซัด Home Run!';
      nextPitch();
    }

    function updateHud() {
      $('p1ScoreDisplay').textContent = homeRuns + ' HR';
      $('p2ScoreDisplay').textContent = 'ลูกที่ ' + pitchCount + '/10';
    }

    function nextPitch() {
      if (pitchCount >= 10) {
        endSportMatch(homeRuns >= 4, homeRuns + ' Home Runs (' + totalDist + 'm)', 'Slugger Champion ⚾');
        return;
      }
      pitchCount++;
      updateHud();
      state = 'pitch';
      ball.x = 480; ball.y = 160; ball.scale = 0.35; ball.isHit = false;
      pitchSpeed = 135 + Math.floor(Math.random() * 25);
      ball.vy = (pitchSpeed / 140) * 8.5;
      ball.vx = (Math.random() - 0.5) * 2;
      $('hudSubStatus').textContent = '⚾ พิตเชอร์ขว้างลูกความเร็ว ' + pitchSpeed + ' km/h! กะจังหวะหวด!';
    }

    function onAction() {
      if (bat.isSwinging) return;
      bat.isSwinging = true;
      bat.swingTimer = 12;

      // Check hit timing
      if (state === 'pitch' && !ball.isHit) {
        // Ideal hit zone: ball.y between 380 and 440
        var diff = Math.abs(ball.y - 410);
        if (diff < 40) {
          ball.isHit = true;
          Snd.play('bat_crack');
          var char = getSelectedChar();

          if (diff < 15) {
            // PERFECT HOME RUN!
            var dist = Math.floor(130 * char.power + Math.random() * 30);
            homeRuns++;
            totalDist += dist;
            updateHud();
            Snd.play('homerun');
            showBanner('HOME RUN! ⚾🔥', char.name + ' ซัดไกลข้ามสเตเดียม ' + dist + ' เมตร!');
            ball.vy = -18;
            ball.vx = (Math.random() - 0.5) * 8;
          } else {
            showBanner('LINE DRIVE HIT! ⚾', 'ลูกพุ่งลงกลางสนาม!');
            ball.vy = -11;
            ball.vx = (ball.x - 480) * 0.1;
          }

          setTimeout(function () {
            nextPitch();
          }, 2000);
        } else if (ball.y < 340) {
          // Swung too early
          showBanner('TOO EARLY!', 'สวิงเร็วเกินไป!');
        }
      }
    }

    function update() {
      if (bat.swingTimer > 0) {
        bat.swingTimer--;
        if (bat.swingTimer === 0) bat.isSwinging = false;
      }

      if (state === 'pitch') {
        if (!ball.isHit) {
          ball.y += ball.vy;
          ball.x += ball.vx;
          ball.scale = 0.35 + (ball.y - 160) / 300 * 0.9;

          // Strike / Missed
          if (ball.y > 470) {
            state = 'ready';
            Snd.play('whistle');
            showBanner('STRIKE! ⚾', 'ไม่โดนลูก!');
            setTimeout(nextPitch, 1500);
          }
        } else {
          // Ball flying away
          ball.y += ball.vy;
          ball.x += ball.vx;
          ball.scale = Math.max(0.2, ball.scale - 0.02);
        }
      }
    }

    function render(c) {
      // Baseball Diamond Stadium Background
      c.fillStyle = '#1e3a5f';
      c.fillRect(0, 0, 960, 540);

      // Outfield Grass
      c.fillStyle = '#15803d';
      c.beginPath();
      c.arc(480, 540, 520, Math.PI, 0);
      c.fill();

      // Infield Dirt Diamond
      c.fillStyle = '#b45309';
      c.beginPath();
      c.moveTo(480, 160); // Pitcher mound
      c.lineTo(660, 320); // 1st Base
      c.lineTo(480, 480); // Home Plate
      c.lineTo(300, 320); // 3rd Base
      c.closePath();
      c.fill();

      // Pitcher's Mound & Pitcher (Robo-Bot)
      c.fillStyle = '#d97706';
      c.beginPath(); c.ellipse(480, 160, 36, 14, 0, 0, Math.PI * 2); c.fill();
      c.font = '32px sans-serif'; c.textAlign = 'center';
      c.fillText('🤖', 480, 150);

      // Home Plate (White Pentagon)
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.moveTo(480, 460); c.lineTo(465, 440); c.lineTo(465, 425); c.lineTo(495, 425); c.lineTo(495, 440);
      c.closePath(); c.fill();

      // Batter (Selected Character)
      var char = getSelectedChar();
      c.save();
      c.font = '46px sans-serif';
      c.textAlign = 'center';
      c.fillText(char.avatar, 420, 430);

      // Bat
      var batAngle = bat.isSwinging ? -0.8 : 0.6;
      c.translate(450, 420);
      c.rotate(batAngle);
      c.fillStyle = '#d97706';
      c.beginPath(); c.roundRect(0, -6, 48, 12, 4); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.stroke();
      c.restore();

      // Baseball Ball
      if (state === 'pitch') {
        c.save();
        c.translate(ball.x, ball.y);
        c.scale(ball.scale, ball.scale);

        // Shadow
        c.fillStyle = 'rgba(0,0,0,0.25)';
        c.beginPath(); c.ellipse(0, 16, 14, 6, 0, 0, Math.PI * 2); c.fill();

        // Ball with red seams
        c.fillStyle = '#ffffff';
        c.beginPath(); c.arc(0, 0, 14, 0, Math.PI * 2); c.fill();
        c.strokeStyle = '#ef4444'; c.lineWidth = 2.5; c.setLineDash([3, 3]);
        c.beginPath(); c.arc(0, 0, 10, -0.6, 0.6); c.stroke();
        c.beginPath(); c.arc(0, 0, 10, 2.5, 3.7); c.stroke();
        c.restore();
      }
    }

    return {
      init: initSport,
      onAction: onAction,
      update: update,
      render: render
    };
  })();

  /* ==========================================================================
     8. SPORT 4: 🥊 DOGNEY BOXING (PUNCH, WEAVE & KNOCKOUT)
     ========================================================================== */
  var Boxing = (function () {
    var p1Hp = 100, p2Hp = 100;
    var state = 'fight'; // 'fight' | 'ko'
    var p1 = { x: 480, y: 380, punchHand: '', punchTimer: 0, guard: false, dodge: 0 };
    var p2 = { x: 480, y: 220, punchTimer: 0, atkTimer: 40, isStunned: false };
    var hitSparks = [];

    function initSport() {
      p1Hp = 100; p2Hp = 100; state = 'fight';
      updateHud();
      $('btnMainAction').textContent = '🥊 ชกหมัดซ้าย / ขวา (A / D)';
      $('btnSubAction').textContent = '⚡ หมัดรัวไม้ตาย (Shift)';
      $('hintText').textContent = '💡 เทคนิค: โยกหลบหมัดบอท (Q/E) แล้วสวนกลับด้วยหมัดเคาน์เตอร์ติดคริติคอล!';
      $('hudSubStatus').textContent = '🥊 เสียงระฆังดังขึ้นแล้ว! ลุยเลย!';
      Snd.play('whistle');
    }

    function updateHud() {
      $('p1ScoreDisplay').textContent = Math.max(0, p1Hp) + ' HP';
      $('p2ScoreDisplay').textContent = Math.max(0, p2Hp) + ' HP';
    }

    function onAction(isSuper) {
      if (state !== 'fight') return;
      var char = getSelectedChar();
      var dmg = (isSuper ? 24 : 14) * char.power;

      p1.punchHand = (p1.punchHand === 'left') ? 'right' : 'left';
      p1.punchTimer = 10;
      Snd.play('box_punch');

      // Check hit
      var dist = Math.hypot((p1.x + p1.dodge) - p2.x, p1.y - p2.y);
      if (dist < 180) {
        if (p2.isStunned) dmg *= 1.5;
        p2Hp -= dmg;
        updateHud();
        addSpark(p2.x, p2.y - 10);

        if (isSuper) {
          showBanner('CRITICAL PUNCH! 💥', char.name + ' อัดหมัดเต็มข้อ!');
        }

        if (p2Hp <= 0) {
          state = 'ko';
          Snd.play('box_ko');
          showBanner('K.O.! 🥊🏆', 'น็อกเอาต์คู่แข่งอย่างสมศักดิ์ศรี!');
          setTimeout(function () {
            endSportMatch(true, 'K.O. Victory!', 'Boxing Heavyweight 🥊');
          }, 2400);
        }
      }
    }

    function addSpark(x, y) {
      for (var i = 0; i < 8; i++) {
        hitSparks.push({
          x: x, y: y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 12
        });
      }
    }

    function update() {
      if (p1.punchTimer > 0) p1.punchTimer--;
      if (p2.punchTimer > 0) p2.punchTimer--;

      // Dodge controls
      if (keys.left) p1.dodge = -45;
      else if (keys.right) p1.dodge = 45;
      else p1.dodge *= 0.8;

      p1.guard = keys.down;

      // Spark particles
      hitSparks.forEach(function (s) {
        s.x += s.vx; s.y += s.vy; s.life--;
      });
      hitSparks = hitSparks.filter(function (s) { return s.life > 0; });

      // AI Bot Boxer Behavior
      if (state === 'fight') {
        p2.atkTimer--;
        if (p2.atkTimer <= 0) {
          p2.atkTimer = 45 + Math.floor(Math.random() * 25);
          p2.punchTimer = 14;

          // AI punches player!
          if (Math.abs(p1.dodge) < 20) {
            if (p1.guard) {
              p1Hp -= 4; // Blocked chip damage
              Snd.play('box_punch');
              showBanner('GUARD! 🛡️', 'การ์ดป้องกันหมัดได้!');
            } else {
              p1Hp -= 15;
              Snd.play('box_punch');
              addSpark(p1.x, p1.y);
            }
            updateHud();

            if (p1Hp <= 0) {
              state = 'ko';
              Snd.play('box_ko');
              showBanner('DOWN! 😢', 'คุณพ่ายแพ้ในยกนี้!');
              setTimeout(function () {
                endSportMatch(false, 'Defeated', 'Boxing Contender');
              }, 2200);
            }
          } else {
            // Player successfully dodged! Opponent stunned!
            p2.isStunned = true;
            showBanner('DODGED! 💨', 'โยกหลบได้สวย! สวนหมัดด่วน!');
            setTimeout(function () { p2.isStunned = false; }, 1400);
          }
        }
      }
    }

    function render(c) {
      // Boxing Arena Stadium Crowd & Ring
      c.fillStyle = '#090d16';
      c.fillRect(0, 0, 960, 540);

      // Ring Mat (Blue Canvas)
      c.fillStyle = '#1e3a8a';
      c.beginPath();
      c.moveTo(180, 160); c.lineTo(780, 160);
      c.lineTo(880, 500); c.lineTo(80, 500);
      c.closePath(); c.fill();

      // Ring Ropes (Red, White, Blue)
      [140, 180, 220].forEach(function (ry, idx) {
        c.strokeStyle = (idx === 0) ? '#ef4444' : (idx === 1 ? '#fff' : '#3b82f6');
        c.lineWidth = 5;
        c.beginPath();
        c.moveTo(80, ry + 120); c.lineTo(180, ry);
        c.lineTo(780, ry); c.lineTo(880, ry + 120);
        c.stroke();
      });

      // Sparks
      hitSparks.forEach(function (s) {
        c.fillStyle = '#fde047';
        c.beginPath(); c.arc(s.x, s.y, 4, 0, Math.PI * 2); c.fill();
      });

      // Draw Opponent (P2 - Robo-Bot)
      c.save();
      c.translate(p2.x, p2.y);
      c.font = '54px sans-serif'; c.textAlign = 'center';
      c.fillText('🤖', 0, 0);
      // Red gloves
      var gOffset = (p2.punchTimer > 0) ? 28 : 0;
      c.fillStyle = '#ef4444';
      c.beginPath(); c.arc(-35, 10 + gOffset, 16, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(35, 10 + gOffset, 16, 0, Math.PI * 2); c.fill();
      c.restore();

      // Draw Player 1 (Over-the-shoulder view)
      var char = getSelectedChar();
      c.save();
      var px = p1.x + p1.dodge;
      c.translate(px, p1.y);
      c.font = '72px sans-serif'; c.textAlign = 'center';
      c.fillText(char.avatar, 0, 0);

      // Blue Gloves
      var lY = (p1.punchHand === 'left' && p1.punchTimer > 0) ? -40 : 15;
      var rY = (p1.punchHand === 'right' && p1.punchTimer > 0) ? -40 : 15;
      c.fillStyle = '#0284c7';
      c.beginPath(); c.arc(-45, lY, 22, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke();
      c.beginPath(); c.arc(45, rY, 22, 0, Math.PI * 2); c.fill();
      c.stroke();
      c.restore();
    }

    return {
      init: initSport,
      onAction: onAction,
      update: update,
      render: render
    };
  })();

  /* ==========================================================================
     9. COMMON BANNER & END MATCH LOGIC
     ========================================================================== */
  var bannerTimer = null;
  function showBanner(head, sub) {
    var b = $('courtsBanner');
    if (!b) return;
    $('bannerHeadline').textContent = head;
    $('bannerSub').textContent = sub;
    b.style.display = 'block';
    if (bannerTimer) clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () {
      b.style.display = 'none';
    }, 1800);
  }

  function endSportMatch(isWin, scoreText, sportTitle) {
    var modal = $('resultModal');
    if (!modal) return;

    $('resFinalScore').textContent = scoreText;
    $('resSportName').textContent = sportTitle;

    if (isWin) {
      $('resultBadge').textContent = '🏆';
      $('resultTitle').textContent = 'CHAMPION! ชัยชนะอันยอดเยี่ยม!';
      $('resultSub').textContent = 'คุณเอาชนะการแข่งขันใน Dogney Courts ได้อย่างสมศักดิ์ศรี!';
      STATE.coins += 250;
      STATE.trophies += 1;
      $('rewardCoins').textContent = '+250';
      $('rewardTrophies').textContent = '+1';
      Snd.play('homerun');
    } else {
      $('resultBadge').textContent = '🥈';
      $('resultTitle').textContent = 'จบการแข่งขัน!';
      $('resultSub').textContent = 'พยายามได้ดีมาก! ฝึกซ้อมอีกนิดคว้าแชมป์แน่นอน!';
      STATE.coins += 60;
      $('rewardCoins').textContent = '+60';
      $('rewardTrophies').textContent = '+0';
      Snd.play('whistle');
    }

    $('hudCoins').textContent = STATE.coins.toLocaleString();
    $('hudTrophies').textContent = STATE.trophies.toLocaleString();
    saveGameData();

    modal.classList.add('open');
  }

  /* ==========================================================================
     10. SPORT SWITCHER & MODALS
     ========================================================================== */
  function switchSport(sportName) {
    STATE.activeSport = sportName;
    saveGameData();

    // Update active tab styling
    document.querySelectorAll('.sport-tab').forEach(function (tab) {
      if (tab.dataset.sport === sportName) tab.classList.add('active');
      else tab.classList.remove('active');
    });

    // Update title
    var titles = {
      tennis: '🎾 DOGNEY TENNIS',
      bowling: '🎳 DOGNEY BOWLING',
      baseball: '⚾ DOGNEY BASEBALL',
      boxing: '🥊 DOGNEY BOXING'
    };
    $('hudSportTitle').textContent = titles[sportName] || 'DOGNEY COURTS';

    // Init active sport
    if (sportName === 'tennis') Tennis.init();
    else if (sportName === 'bowling') Bowling.init();
    else if (sportName === 'baseball') Baseball.init();
    else if (sportName === 'boxing') Boxing.init();
  }

  function openRosterModal() {
    var modal = $('rosterModal');
    if (!modal) return;

    var grid = $('rosterGrid');
    if (grid) {
      var html = '';
      CHARACTERS.forEach(function (c) {
        var isAct = c.id === STATE.selectedCharId;
        html += '<div class="roster-card ' + (isAct ? 'active' : '') + '" onclick="window.selectCourtsChar(\'' + c.id + '\')">';
        html += '<div class="roster-avatar">' + c.avatar + '</div>';
        html += '<div class="roster-name">' + c.name + '</div>';
        html += '<div class="roster-trait">' + c.role + '</div>';
        html += '<div class="roster-super">ท่าเด่น: ' + c.specialty + '</div>';
        html += '</div>';
      });
      grid.innerHTML = html;
    }

    modal.classList.add('open');
  }

  window.selectCourtsChar = function (charId) {
    STATE.selectedCharId = charId;
    saveGameData();
    var cur = getSelectedChar();
    $('p1AvatarDisplay').textContent = cur.avatar;
    $('p1NameDisplay').textContent = cur.name;
    $('p1RoleDisplay').textContent = cur.role;
    Snd.play('whistle');
    $('rosterModal').classList.remove('open');
  };

  /* ==========================================================================
     11. PASSWORD GATE (VIP CHECK-IN: PASSWORD "larny")
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
      if (val === 'larny') {
        try { localStorage.setItem('nadiaplayground_auth', 'larny'); } catch (e) {}
        overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.04)';
        document.body.style.overflow = '';
        setTimeout(function () { overlay.style.display = 'none'; }, 300);
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
      try { localStorage.removeItem('nadiaplayground_auth'); } catch (e) {}
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
     12. INITIALIZATION & MAIN 60 FPS LOOP
     ========================================================================== */
  var canvas, ctx;

  function init() {
    canvas = $('arenaCanvas');
    if (canvas) ctx = canvas.getContext('2d');

    loadSavedData();
    setupPasswordGate();
    setupInputs();

    $('hudCoins').textContent = STATE.coins.toLocaleString();
    $('hudTrophies').textContent = STATE.trophies.toLocaleString();

    var cur = getSelectedChar();
    $('p1AvatarDisplay').textContent = cur.avatar;
    $('p1NameDisplay').textContent = cur.name;
    $('p1RoleDisplay').textContent = cur.role;

    // Hook tab switches
    document.querySelectorAll('.sport-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchSport(this.dataset.sport);
      });
    });

    $('btnAudioToggle')?.addEventListener('click', function () {
      var next = !Snd.isEnabled();
      Snd.setEnabled(next);
      this.textContent = next ? '🔊' : '🔇';
      if (next) Snd.play('tennis_hit');
    });

    $('btnRosterModal')?.addEventListener('click', openRosterModal);
    $('closeRosterModal')?.addEventListener('click', function () {
      $('rosterModal').classList.remove('open');
    });

    $('btnPlayAgain')?.addEventListener('click', function () {
      $('resultModal').classList.remove('open');
      switchSport(STATE.activeSport);
    });

    $('btnNextSport')?.addEventListener('click', function () {
      $('resultModal').classList.remove('open');
      var list = ['tennis', 'bowling', 'baseball', 'boxing'];
      var idx = list.indexOf(STATE.activeSport);
      var next = list[(idx + 1) % list.length];
      switchSport(next);
    });

    // Start initial sport
    switchSport(STATE.activeSport || 'tennis');

    // 60 FPS Engine Loop
    function loop() {
      if (ctx) {
        if (STATE.activeSport === 'tennis') {
          Tennis.update();
          Tennis.render(ctx);
        } else if (STATE.activeSport === 'bowling') {
          Bowling.update();
          Bowling.render(ctx);
        } else if (STATE.activeSport === 'baseball') {
          Baseball.update();
          Baseball.render(ctx);
        } else if (STATE.activeSport === 'boxing') {
          Boxing.update();
          Boxing.render(ctx);
        }
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
