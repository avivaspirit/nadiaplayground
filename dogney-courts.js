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

      if (STATE.activeSport === 'boxing') {
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') Boxing.punchLeft();
        else if (k === 'ArrowRight' || k === 'd' || k === 'D' || c === 'Space' || k === 'Enter') Boxing.punchRight();
        else if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === 'q' || k === 'e') Boxing.dodge();
        else if (k === 'ArrowDown' || k === 's' || k === 'S') Boxing.setGuard(true);
      } else {
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
      }
    });

    window.addEventListener('keyup', function (e) {
      var k = e.key;
      var c = e.code;
      if (STATE.activeSport === 'boxing') {
        if (k === 'ArrowDown' || k === 's' || k === 'S') Boxing.setGuard(false);
      } else {
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
        if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
        if (k === 'ArrowUp' || k === 'w' || k === 'W') keys.up = false;
        if (k === 'ArrowDown' || k === 's' || k === 'S') keys.down = false;
        if (c === 'Space' || k === 'Enter' || k === 'x' || k === 'X') keys.action = false;
        if (k === 'Shift' || k === 'c' || k === 'C') keys.superAction = false;
      }
    });

    // Touch & Button bindings
    function bindActionBtn(btnId, onDown, onUp, hapticMs) {
      var b = $(btnId);
      if (!b) return;
      var tId = null;

      b.addEventListener('touchstart', function (e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
          tId = e.changedTouches[i].identifier;
          b.classList.add('pressed');
          if (onDown) onDown();
          if (navigator.vibrate && hapticMs) {
            try { navigator.vibrate(hapticMs); } catch (_) {}
          }
          break;
        }
      }, { passive: false });

      window.addEventListener('touchend', function (e) {
        if (tId === null) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === tId) {
            tId = null;
            b.classList.remove('pressed');
            if (onUp) onUp();
            break;
          }
        }
      });

      window.addEventListener('touchcancel', function (e) {
        if (tId === null) return;
        tId = null;
        b.classList.remove('pressed');
        if (onUp) onUp();
      });

      b.addEventListener('mousedown', function (e) {
        e.preventDefault();
        b.classList.add('pressed');
        if (onDown) onDown();
      });
      window.addEventListener('mouseup', function () {
        if (b.classList.contains('pressed') && tId === null) {
          b.classList.remove('pressed');
          if (onUp) onUp();
        }
      });
    }

    bindActionBtn('btnActionLeft', function () {
      if (STATE.activeSport === 'boxing') Boxing.punchLeft();
      else keys.left = true;
    }, function () {
      if (STATE.activeSport !== 'boxing') keys.left = false;
    }, 10);

    bindActionBtn('btnActionRight', function () {
      if (STATE.activeSport === 'boxing') Boxing.punchRight();
      else keys.right = true;
    }, function () {
      if (STATE.activeSport !== 'boxing') keys.right = false;
    }, 10);

    bindActionBtn('btnActionUp', function () {
      if (STATE.activeSport === 'boxing') Boxing.dodge();
      else keys.up = true;
    }, function () {
      if (STATE.activeSport !== 'boxing') keys.up = false;
    }, 8);

    bindActionBtn('btnActionDown', function () {
      if (STATE.activeSport === 'boxing') Boxing.setGuard(true);
      else keys.down = true;
    }, function () {
      if (STATE.activeSport === 'boxing') Boxing.setGuard(false);
      else keys.down = false;
    }, 8);

    bindActionBtn('btnMainAction', function () {
      keys.action = true;
      if (STATE.activeSport === 'boxing') Boxing.setGuard(true);
      else handleActionPress();
    }, function () {
      keys.action = false;
      if (STATE.activeSport === 'boxing') Boxing.setGuard(false);
    }, 12);

    bindActionBtn('btnSubAction', function () {
      keys.superAction = true;
      if (STATE.activeSport === 'boxing') Boxing.dodge();
      else handleSuperActionPress();
    }, function () {
      keys.superAction = false;
    }, 16);

    // Canvas click
    $('arenaCanvas')?.addEventListener('click', function (e) {
      if (STATE.activeSport === 'boxing') {
        var rect = this.getBoundingClientRect();
        var clickX = e.clientX || (rect.left + rect.width / 2);
        if (clickX < rect.left + rect.width * 0.5) {
          Boxing.punchLeft();
        } else {
          Boxing.punchRight();
        }
      } else {
        handleActionPress();
      }
    });
  }

  function handleActionPress() {
    if (STATE.activeSport === 'tennis') Tennis.onAction();
    else if (STATE.activeSport === 'bowling') Bowling.onAction();
    else if (STATE.activeSport === 'baseball') Baseball.onAction();
    else if (STATE.activeSport === 'boxing') Boxing.punchRight();
  }

  function handleSuperActionPress() {
    if (STATE.activeSport === 'tennis') Tennis.onSuper();
    else if (STATE.activeSport === 'boxing') Boxing.dodge();
    else handleActionPress();
  }

  /* ==========================================================================
     5. SPORT 1: 🎾 DOGNEY TENNIS (SATISFYING 1V1 RALLIES, LOBS & SMASHES)
     ========================================================================== */
  var Tennis = (function () {
    var p1Score = 0, p2Score = 0;
    var rallyCount = 0;
    var state = 'serve'; // 'serve' | 'rally' | 'scored'
    var serveTiming = 50, serveDir = 1;

    // Ball with z-lob height and court bounce
    var ball = {
      x: 480, y: 390, z: 25,
      vx: 0, vy: 0, vz: 0,
      r: 11,
      isSmash: false,
      isSmashChance: false,
      trail: []
    };

    var p1 = { x: 480, y: 440, vx: 0, swingTimer: 0 };
    var p2 = { x: 480, y: 155, vx: 0, swingTimer: 0 };

    function initSport() {
      p1Score = 0; p2Score = 0; rallyCount = 0;
      updateScores();
      $('btnActionLeft').textContent = '◀ ซ้าย';
      $('btnActionRight').textContent = 'ขวา ▶';
      $('btnActionLeft').style.display = 'inline-flex';
      $('btnActionRight').style.display = 'inline-flex';
      $('btnActionUp').style.display = 'none';
      $('btnActionDown').style.display = 'none';
      $('btnMainAction').textContent = '🎾 เสิร์ฟ / หวดลูก (Space)';
      $('btnSubAction').textContent = '⚡ กระโดดสแมช (W)';
      $('hintText').textContent = '💡 เทคนิค: รอจังหวะลูกตกลงถึงเป้าบนพื้นคอร์ด [ 🎯 ] แล้วกด Spacebar เพื่อหวดลูกโต้กลับ!';
      resetServe();
    }

    function resetServe() {
      state = 'serve';
      ball.x = p1.x; ball.y = 405; ball.z = 25;
      ball.vx = 0; ball.vy = 0; ball.vz = 0;
      ball.isSmash = false;
      ball.isSmashChance = false;
      ball.trail = [];
      $('hudSubStatus').textContent = '🎾 กด Spacebar ในจังหวะหลอดพลังสีเขียวเพื่อเสิร์ฟ!';
      $('powerMeterBox').style.display = 'block';
    }

    function updateScores() {
      $('p1ScoreDisplay').textContent = p1Score + ' แต้ม';
      $('p2ScoreDisplay').textContent = p2Score + ' แต้ม';
      if (rallyCount > 1) {
        $('hudSubStatus').textContent = '🎾 แรลลี่ดวลมันส์: ' + rallyCount + ' ครั้ง! 🔥';
      }
    }

    function onAction() {
      if (state === 'serve') {
        state = 'rally';
        $('powerMeterBox').style.display = 'none';
        var char = getSelectedChar();
        var perfect = (serveTiming > 68 && serveTiming < 92);
        rallyCount = 1;
        updateScores();

        if (perfect) {
          showBanner('NICE SERVE! ⚡', 'เสิร์ฟสายฟ้าความเร็วสูง!');
          Snd.play('tennis_smash');
          ball.isSmash = true;
          ball.vx = (keys.left ? -3.2 : (keys.right ? 3.2 : (Math.random() - 0.5) * 1.8));
          ball.vy = -5.8;
          ball.vz = 6.2;
        } else {
          Snd.play('tennis_hit');
          ball.isSmash = false;
          ball.vx = (keys.left ? -2.2 : (keys.right ? 2.2 : (Math.random() - 0.5) * 1.2));
          ball.vy = -5.0;
          ball.vz = 5.5;
        }
        p1.swingTimer = 14;
      } else if (state === 'rally') {
        p1.swingTimer = 14;

        // Comfortable, readable hit window
        var inYRange = (ball.y >= 340 && ball.y <= 475);
        var inXRange = Math.abs(ball.x - p1.x) < 130;

        if (inYRange && inXRange && ball.vy > 0) {
          rallyCount++;
          updateScores();
          var char = getSelectedChar();
          var timingDiff = Math.abs(ball.y - 425);
          var isPerfect = timingDiff < 22;

          p1.x += (ball.x - p1.x) * 0.42;
          var aimX = keys.left ? -3.6 : (keys.right ? 3.6 : ((ball.x - p1.x) * 0.08));

          if (ball.isSmashChance) {
            ball.isSmash = true;
            ball.isSmashChance = false;
            ball.vx = aimX * 1.35;
            ball.vy = -6.8 * char.power;
            ball.vz = 3.8;
            Snd.play('tennis_smash');
            showBanner('SMASH! 🔥', char.name + ' กระโดดสแมชเต็มแรง!');
          } else if (isPerfect) {
            ball.isSmash = false;
            ball.vx = aimX * 1.15;
            ball.vy = -5.6 * char.power;
            ball.vz = 5.8;
            Snd.play('tennis_hit');
            showBanner('GREAT RETURN! 🎾✨', 'หวดลูกโค้งลงมุมคอร์ด!');
          } else {
            ball.isSmash = false;
            ball.vx = aimX;
            ball.vy = -4.9;
            ball.vz = 6.0;
            Snd.play('tennis_hit');
          }
        }
      }
    }

    function onSuper() {
      if (state === 'rally' && ball.vy > 0 && ball.y >= 320 && ball.y <= 460) {
        ball.isSmashChance = true;
      }
      onAction();
    }

    function update() {
      if (state === 'serve') {
        serveTiming += serveDir * 2.2;
        if (serveTiming > 100) { serveTiming = 100; serveDir = -1; }
        if (serveTiming < 0) { serveTiming = 0; serveDir = 1; }
        var mBar = $('meterBar');
        if (mBar) mBar.style.width = serveTiming + '%';
      }

      var curChar = getSelectedChar();
      var speed = 7.0 * curChar.speed;
      if (keys.left) p1.x -= speed;
      if (keys.right) p1.x += speed;
      if (p1.x < 150) p1.x = 150;
      if (p1.x > 810) p1.x = 810;

      if (p1.swingTimer > 0) p1.swingTimer--;
      if (p2.swingTimer > 0) p2.swingTimer--;

      if (state === 'rally') {
        ball.x += ball.vx;
        ball.y += ball.vy;

        ball.z += ball.vz;
        ball.vz -= 0.22;

        if (ball.z <= 0) {
          ball.z = 0;
          ball.vz = -ball.vz * 0.72;
          if (Math.abs(ball.vz) < 0.6) ball.vz = 0;
          Snd.play('tennis_hit');
        }

        if (ball.x < 130) { ball.x = 130; ball.vx = Math.abs(ball.vx) * 0.9; }
        if (ball.x > 830) { ball.x = 830; ball.vx = -Math.abs(ball.vx) * 0.9; }

        ball.trail.push({ x: ball.x, y: ball.y - ball.z, r: ball.r * (1 + ball.z * 0.012), isSmash: ball.isSmash });
        if (ball.trail.length > 8) ball.trail.shift();

        var p2TargetX = ball.x + (Math.sin(Date.now() * 0.005) * 20);
        if (p2.x < p2TargetX - 8) p2.x += 5.2;
        else if (p2.x > p2TargetX + 8) p2.x -= 5.2;

        if (ball.y < 195 && ball.vy < 0) {
          var distP2 = Math.hypot(ball.x - p2.x, ball.y - p2.y);
          if (distP2 < 95) {
            p2.swingTimer = 12;
            rallyCount++;
            updateScores();

            var p2AimX = (p2.x > 480 ? -2.4 : 2.4) + (Math.random() - 0.5) * 1.6;
            ball.vx = p2AimX;
            ball.vy = 4.8 + Math.random() * 0.8;
            ball.vz = 5.8;
            ball.isSmash = false;
            Snd.play('tennis_hit');

            if (rallyCount >= 3 && Math.random() < 0.35) {
              ball.isSmashChance = true;
              ball.vz = 7.6;
              showBanner('LOB! 🎈', 'ลูกลอยโด่ง! โอกาสกระโดดสแมช!');
            }
          }
        }

        if (ball.y < 70) {
          state = 'scored';
          p1Score++;
          updateScores();
          Snd.play('homerun');
          showBanner('POINT! 🎾✨', getSelectedChar().name + ' ได้แต้มงดงาม!');
          checkWin();
        } else if (ball.y > 515) {
          state = 'scored';
          p2Score++;
          updateScores();
          Snd.play('whistle');
          showBanner('OUT! 🎾💥', 'Robo-Bot ได้แต้ม!');
          checkWin();
        }
      }
    }

    function checkWin() {
      if (p1Score >= 3 || p2Score >= 3) {
        var won = p1Score > p2Score;
        setTimeout(function () {
          endSportMatch(won, p1Score + ' - ' + p2Score + ' (Rallies: ' + rallyCount + ')', 'Grand Slam Tennis 🎾');
        }, 2200);
      } else {
        setTimeout(resetServe, 1800);
      }
    }

    function render(c) {
      c.fillStyle = '#0f172a';
      c.fillRect(0, 0, 960, 540);

      c.fillStyle = '#065f46';
      c.fillRect(70, 40, 820, 470);

      c.fillStyle = '#1e40af';
      c.fillRect(150, 70, 660, 410);

      c.strokeStyle = '#ffffff';
      c.lineWidth = 3.5;
      c.strokeRect(150, 70, 660, 410);

      c.beginPath();
      c.moveTo(210, 70); c.lineTo(210, 480);
      c.moveTo(750, 70); c.lineTo(750, 480);
      c.stroke();

      c.beginPath();
      c.moveTo(210, 175); c.lineTo(750, 175);
      c.moveTo(210, 375); c.lineTo(750, 375);
      c.moveTo(480, 175); c.lineTo(480, 375);
      c.stroke();

      c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      c.lineWidth = 1.5;
      for (var ny = 265; ny <= 285; ny += 6) {
        c.beginPath(); c.moveTo(130, ny); c.lineTo(830, ny); c.stroke();
      }
      for (var nx = 130; nx <= 830; nx += 16) {
        c.beginPath(); c.moveTo(nx, 265); c.lineTo(nx, 285); c.stroke();
      }
      c.strokeStyle = '#ffffff';
      c.lineWidth = 5;
      c.beginPath(); c.moveTo(130, 265); c.lineTo(830, 265); c.stroke();

      c.fillStyle = '#334155';
      c.fillRect(124, 255, 8, 32);
      c.fillRect(828, 255, 8, 32);

      // Pulsing Landing Target
      if (state === 'rally' && ball.vy > 0 && ball.y < 460) {
        var targetY = Math.min(450, ball.y + ball.vy * 16);
        var pulse = (Math.sin(Date.now() * 0.015) + 1) * 0.5;
        c.save();
        c.strokeStyle = ball.isSmashChance ? '#f59e0b' : '#38bdf8';
        c.lineWidth = 2.5;
        c.beginPath();
        c.ellipse(ball.x, targetY, 26 + pulse * 8, 12 + pulse * 4, 0, 0, Math.PI * 2);
        c.stroke();
        c.fillStyle = ball.isSmashChance ? 'rgba(245, 158, 11, 0.25)' : 'rgba(56, 189, 248, 0.2)';
        c.fill();
        c.font = 'bold 13px sans-serif';
        c.fillStyle = '#ffffff';
        c.textAlign = 'center';
        c.fillText(ball.isSmashChance ? '🔥 SMASH' : '🎯 HIT', ball.x, targetY + 4);
        c.restore();
      }

      // Ball Shadow
      var shadowR = Math.max(4, ball.r * 0.85 - ball.z * 0.12);
      c.fillStyle = 'rgba(0, 0, 0, 0.4)';
      c.beginPath();
      c.ellipse(ball.x, ball.y, shadowR * 1.2, shadowR * 0.6, 0, 0, Math.PI * 2);
      c.fill();

      // Trail
      ball.trail.forEach(function (t, idx) {
        var a = (idx + 1) / ball.trail.length;
        c.fillStyle = t.isSmash ? '#f97316' : '#a3e635';
        c.globalAlpha = a * 0.45;
        c.beginPath();
        c.arc(t.x, t.y, t.r * 0.8, 0, Math.PI * 2);
        c.fill();
      });
      c.globalAlpha = 1;

      // Ball
      var ballDrawY = ball.y - ball.z;
      var curR = ball.r * (1 + ball.z * 0.014);
      c.fillStyle = ball.isSmash ? '#ff4500' : '#ccff00';
      c.beginPath();
      c.arc(ball.x, ballDrawY, curR, 0, Math.PI * 2);
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = ball.isSmash ? '#ffffff' : '#1e293b';
      c.stroke();

      drawTennisPlayer(c, p2.x, p2.y, '🤖', '#ef4444', false, p2.swingTimer > 0);
      drawTennisPlayer(c, p1.x, p1.y, getSelectedChar().avatar, getSelectedChar().color || '#ffd166', true, p1.swingTimer > 0);
    }

    function drawTennisPlayer(c, x, y, avatar, color, isP1, isSwinging) {
      c.save();
      c.fillStyle = 'rgba(0, 0, 0, 0.35)';
      c.beginPath();
      c.ellipse(x, y + 16, 28, 10, 0, 0, Math.PI * 2);
      c.fill();

      c.font = isP1 ? '38px sans-serif' : '32px sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(avatar, x, y - 6);

      var rx = isSwinging ? (x + (isP1 ? 38 : -38)) : (x + (isP1 ? 30 : -30));
      var ry = isSwinging ? (y - 18) : (y + 2);
      c.fillStyle = '#ffd166';
      c.beginPath();
      c.ellipse(rx, ry, 14, 20, isSwinging ? (isP1 ? 0.7 : -0.7) : 0.25, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#1e293b';
      c.lineWidth = 2.5;
      c.stroke();

      c.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(rx - 8, ry); c.lineTo(rx + 8, ry);
      c.moveTo(rx, ry - 12); c.lineTo(rx, ry + 12);
      c.stroke();
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
     7. SPORT 3: ⚾ DOGNEY BASEBALL (REAL STADIUM MATCH & HOME RUN DERBY)
     ========================================================================== */
  var Baseball = (function () {
    var inning = 1;
    var outs = 0;
    var runs = 0;
    var strikes = 0;
    var pitchCount = 0;
    var bases = { first: false, second: false, third: false };
    var state = 'ready'; // 'ready' | 'pitch' | 'flying' | 'resolved'
    var pitchType = 'Fastball ⚡';
    var pitchSpeedKm = 142;

    var ball = {
      x: 480, y: 220, z: 12,
      vx: 0, vy: 0, vz: 0,
      scale: 0.38,
      isHit: false,
      flightTimer: 0,
      trail: []
    };

    var bat = { isSwinging: false, swingTimer: 0 };

    // Real stadium fielders
    var fielders = [
      { role: 'LF', x: 230, y: 150, avatar: '🤖' },
      { role: 'CF', x: 480, y: 110, avatar: '🤖' },
      { role: 'RF', x: 730, y: 150, avatar: '🤖' },
      { role: 'SS', x: 380, y: 230, avatar: '🤖' },
      { role: '2B', x: 580, y: 230, avatar: '🤖' },
      { role: '3B', x: 300, y: 310, avatar: '🤖' },
      { role: '1B', x: 660, y: 310, avatar: '🤖' },
      { role: 'P',  x: 480, y: 240, avatar: '🤖' }
    ];

    function initSport() {
      inning = 1; outs = 0; runs = 0; strikes = 0; pitchCount = 0;
      bases = { first: false, second: false, third: false };
      updateHud();

      $('btnActionLeft').style.display = 'none';
      $('btnActionRight').style.display = 'none';
      $('btnActionUp').style.display = 'none';
      $('btnActionDown').style.display = 'none';
      $('btnMainAction').textContent = '⚾ หวดไม้เบสบอล (Space)';
      $('btnSubAction').textContent = '⚡ สวิงเต็มแรง (W)';
      $('hintText').textContent = '💡 เทคนิค: จับตาดูวิถีลูกพิตเชอร์ แล้วกด Spacebar ในจังหวะที่ลูกเข้าสู่ Home Plate!';
      nextPitch();
    }

    function updateHud() {
      $('p1ScoreDisplay').textContent = runs + ' RUNS';
      var outDisplay = (outs === 0 ? '○ ○ ○' : (outs === 1 ? '● ○ ○' : (outs === 2 ? '● ● ○' : '● ● ●')));
      $('p2ScoreDisplay').textContent = 'OUT: ' + outDisplay;

      var baseStr = (bases.third ? '3B ' : '') + (bases.second ? '2B ' : '') + (bases.first ? '1B' : '');
      $('hudSportTitle').textContent = '⚾ BASEBALL · INNING ' + inning + ' (Bases: ' + (baseStr.trim() || 'ว่าง') + ')';
    }

    function nextPitch() {
      if (outs >= 3) {
        endSportMatch(runs >= 3, runs + ' Runs (' + inning + ' Innings)', 'Slugger MVP ⚾');
        return;
      }

      pitchCount++;
      state = 'pitch';
      ball.x = 480; ball.y = 240; ball.z = 12;
      ball.isHit = false;
      ball.trail = [];

      var r = Math.random();
      if (r < 0.48) {
        pitchType = 'Fastball ⚡';
        pitchSpeedKm = 140 + Math.floor(Math.random() * 8);
        ball.vy = 4.6;
        ball.vx = (Math.random() - 0.5) * 0.8;
      } else if (r < 0.78) {
        pitchType = 'Curveball 🌀';
        pitchSpeedKm = 114 + Math.floor(Math.random() * 8);
        ball.vy = 3.8;
        ball.vx = (Math.random() > 0.5 ? 1.6 : -1.6);
      } else {
        pitchType = 'Changeup 🎈';
        pitchSpeedKm = 94 + Math.floor(Math.random() * 6);
        ball.vy = 2.9;
        ball.vx = (Math.random() - 0.5) * 0.5;
      }

      $('hudSubStatus').textContent = '⚾ พิตเชอร์ขว้าง: ' + pitchType + ' (' + pitchSpeedKm + ' km/h) — กะจังหวะหวด!';
    }

    function onAction() {
      if (bat.isSwinging) return;
      bat.isSwinging = true;
      bat.swingTimer = 14;

      if (state === 'pitch' && !ball.isHit) {
        // Strike zone: ball.y around 410 (370 - 440)
        var diff = Math.abs(ball.y - 410);
        if (diff < 44) {
          ball.isHit = true;
          state = 'flying';
          Snd.play('bat_crack');
          var char = getSelectedChar();

          if (diff < 14) {
            // PERFECT HOME RUN!
            resolveHit('HOMERUN', char);
          } else if (diff < 26) {
            var isTriple = Math.random() < 0.35;
            resolveHit(isTriple ? 'TRIPLE' : 'DOUBLE', char);
          } else {
            var isFielderCatch = Math.random() < 0.4;
            resolveHit(isFielderCatch ? 'FLYOUT' : 'SINGLE', char);
          }
        }
      }
    }

    function resolveHit(type, char) {
      if (type === 'HOMERUN') {
        var dist = Math.floor(135 * char.power + Math.random() * 38);
        var scored = 1;
        if (bases.first) scored++;
        if (bases.second) scored++;
        if (bases.third) scored++;
        runs += scored;
        bases = { first: false, second: false, third: false };
        updateHud();
        Snd.play('homerun');
        showBanner(scored >= 4 ? 'GRAND SLAM! ⚾🔥🎉' : 'HOME RUN! ⚾🔥', char.name + ' ซัดทะลุสเตเดียม ' + dist + 'm! ได้ ' + scored + ' คะแนน!');
        ball.vx = (Math.random() - 0.5) * 4;
        ball.vy = -9.5;
        ball.vz = 14;
        setTimeout(nextPitch, 2800);
      } else if (type === 'TRIPLE') {
        var scored = 0;
        if (bases.third) scored++;
        if (bases.second) scored++;
        if (bases.first) scored++;
        runs += scored;
        bases = { first: false, second: false, third: true };
        updateHud();
        Snd.play('tennis_hit');
        showBanner('TRIPLE HIT! ⚾💨', 'ลูกชนกำแพงสนาม! สปรินต์เข้าเบส 3!');
        ball.vx = (Math.random() > 0.5 ? 4.5 : -4.5);
        ball.vy = -7;
        ball.vz = 9;
        setTimeout(nextPitch, 2200);
      } else if (type === 'DOUBLE') {
        var scored = 0;
        if (bases.third) scored++;
        if (bases.second) scored++;
        if (bases.first) { bases.third = true; bases.first = false; }
        runs += scored;
        bases.second = true;
        updateHud();
        Snd.play('tennis_hit');
        showBanner('DOUBLE HIT! ⚾✨', 'ลูกพุ่งทะลุช่องว่างเอาต์ฟิลด์! เข้าเบส 2!');
        ball.vx = (Math.random() - 0.5) * 5;
        ball.vy = -6;
        ball.vz = 7;
        setTimeout(nextPitch, 2000);
      } else if (type === 'SINGLE') {
        var scored = 0;
        if (bases.third) scored++;
        bases.third = bases.second;
        bases.second = bases.first;
        bases.first = true;
        runs += scored;
        updateHud();
        Snd.play('tennis_hit');
        showBanner('BASE HIT! ⚾', 'ลูกตกหน้าแผงรับ! วิ่งเข้าเบส 1 สำเร็จ!');
        ball.vx = (Math.random() - 0.5) * 3;
        ball.vy = -4.5;
        ball.vz = 5;
        setTimeout(nextPitch, 1800);
      } else if (type === 'FLYOUT') {
        outs++;
        updateHud();
        Snd.play('whistle');
        showBanner('FLY OUT! 🧤', 'เอาต์ฟิลเดอร์รับลูกกลางอากาศได้! (' + outs + ' OUT)');
        ball.vx = (Math.random() - 0.5) * 2;
        ball.vy = -5;
        ball.vz = 8;
        setTimeout(nextPitch, 1800);
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
          ball.scale = 0.38 + (ball.y - 240) / 200 * 0.7;

          // Strike / Missed
          if (ball.y > 465) {
            state = 'ready';
            strikes++;
            Snd.play('whistle');
            if (strikes >= 3) {
              strikes = 0;
              outs++;
              updateHud();
              showBanner('STRIKE OUT! ⚾💥', 'สไตรค์ 3 ครั้ง = 1 OUT!');
            } else {
              showBanner('STRIKE! ⚾', 'สไตรค์ครั้งที่ ' + strikes);
            }
            setTimeout(nextPitch, 1500);
          }
        }
      } else if (state === 'flying') {
        ball.y += ball.vy;
        ball.x += ball.vx;
        ball.z += ball.vz;
        ball.vz -= 0.35;
        if (ball.z < 0) ball.z = 0;
        ball.trail.push({ x: ball.x, y: ball.y - ball.z, r: 6 });
        if (ball.trail.length > 8) ball.trail.shift();
      }
    }

    function render(c) {
      // 1. Stadium Atmosphere & Sky
      c.fillStyle = '#0f172a';
      c.fillRect(0, 0, 960, 540);

      // Stadium Upper Deck & Crowd
      c.fillStyle = '#1e293b';
      c.fillRect(60, 20, 840, 110);
      for (var ci = 70; ci < 890; ci += 18) {
        c.fillStyle = (ci % 36 === 0) ? '#f59e0b' : '#38bdf8';
        c.beginPath(); c.arc(ci, 60 + Math.sin(ci) * 12, 5, 0, Math.PI * 2); c.fill();
      }

      // Outfield Wall (Deep Green with Distance Markers)
      c.fillStyle = '#064e3b';
      c.beginPath();
      c.arc(480, 480, 460, Math.PI * 1.15, Math.PI * 1.85);
      c.lineTo(480, 480);
      c.fill();

      c.font = 'bold 14px sans-serif';
      c.fillStyle = '#facc15';
      c.fillText('380 FT', 200, 175);
      c.fillText('400 FT', 480, 100);
      c.fillText('380 FT', 760, 175);

      // Infield Dirt Diamond
      c.fillStyle = '#92400e';
      c.beginPath();
      c.moveTo(480, 200); // 2nd Base
      c.lineTo(660, 320); // 1st Base
      c.lineTo(480, 440); // Home Plate
      c.lineTo(300, 320); // 3rd Base
      c.closePath();
      c.fill();

      // Infield Inner Grass
      c.fillStyle = '#15803d';
      c.beginPath();
      c.moveTo(480, 230);
      c.lineTo(620, 320);
      c.lineTo(480, 410);
      c.lineTo(340, 320);
      c.closePath();
      c.fill();

      // White Chalk Foul Lines & Bases
      c.strokeStyle = '#ffffff';
      c.lineWidth = 3;
      c.beginPath();
      // 3rd Base foul line to left pole
      c.moveTo(480, 440); c.lineTo(130, 150);
      // 1st Base foul line to right pole
      c.moveTo(480, 440); c.lineTo(830, 150);
      c.stroke();

      // Draw Bases (White Squares)
      function drawBase(bx, by, occupied) {
        c.save();
        c.fillStyle = occupied ? '#facc15' : '#ffffff';
        c.beginPath();
        c.rect(bx - 10, by - 10, 20, 20);
        c.fill();
        c.strokeStyle = '#1e293b'; c.lineWidth = 2; c.stroke();
        if (occupied) {
          c.font = '16px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillText('🏃', bx, by);
        }
        c.restore();
      }

      drawBase(650, 310, bases.first);  // 1st
      drawBase(480, 200, bases.second); // 2nd
      drawBase(310, 310, bases.third);  // 3rd

      // Home Plate (Pentagon)
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.moveTo(480, 440); c.lineTo(494, 430); c.lineTo(494, 420); c.lineTo(466, 420); c.lineTo(466, 430);
      c.closePath(); c.fill();

      // Pitcher Mound & Rubber
      c.fillStyle = '#b45309';
      c.beginPath(); c.ellipse(480, 240, 34, 16, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff'; c.fillRect(472, 238, 16, 4);

      // Draw Fielders
      fielders.forEach(function (f) {
        c.font = '26px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(f.avatar, f.x, f.y);
      });

      // Draw Batter (Player) at Home Plate
      var char = getSelectedChar();
      c.save();
      c.font = '36px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(char.avatar, 440, 425);

      // Wooden Bat
      var batAngle = bat.isSwinging ? -0.8 : 0.6;
      c.save();
      c.translate(452, 422);
      c.rotate(batAngle);
      c.fillStyle = '#d97706';
      c.fillRect(0, -28, 7, 28);
      c.strokeStyle = '#78350f'; c.lineWidth = 1.5; c.strokeRect(0, -28, 7, 28);
      c.restore();
      c.restore();

      // Draw Ball
      if (state === 'pitch' || state === 'flying') {
        var drawY = ball.y - (ball.z || 0);
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(ball.x, drawY, Math.max(5, 12 * (ball.scale || 0.5)), 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#ef4444'; c.lineWidth = 1.5; c.stroke();
      }

      // Mini Diamond HUD at Top-Left
      c.save();
      c.fillStyle = 'rgba(15, 23, 42, 0.85)';
      c.strokeStyle = '#38bdf8'; c.lineWidth = 1.5;
      c.beginPath(); c.roundRect(30, 60, 90, 85, 12); c.fill(); c.stroke();

      // Diamond lines
      c.strokeStyle = '#64748b'; c.lineWidth = 2;
      c.beginPath();
      c.moveTo(75, 78); c.lineTo(100, 98); c.lineTo(75, 118); c.lineTo(50, 98); c.closePath();
      c.stroke();

      // Small Bases
      function drawMiniBase(mx, my, on) {
        c.fillStyle = on ? '#facc15' : '#334155';
        c.fillRect(mx - 4, my - 4, 8, 8);
      }
      drawMiniBase(100, 98, bases.first);
      drawMiniBase(75, 78, bases.second);
      drawMiniBase(50, 98, bases.third);
      c.fillStyle = '#ffffff'; c.fillRect(73, 116, 5, 5); // Home plate

      c.font = 'bold 11px sans-serif'; c.fillStyle = '#cbd5e1'; c.textAlign = 'center';
      c.fillText('BASES', 75, 137);
      c.restore();
    }

    return {
      init: initSport,
      onAction: onAction,
      onSuper: onAction,
      update: update,
      render: render
    };
  })();

  /* ==========================================================================
     8. SPORT 4: 🥊 DOGNEY BOXING (PUNCH, GUARD, WEAVE & KNOCKOUT)
     ========================================================================== */
  var Boxing = (function () {
    var p1Hp = 100, p2Hp = 100;
    var state = 'fight'; // 'fight' | 'ko'
    var p1 = {
      guard: false,
      dodge: 0, // -1 = left, 0 = center, 1 = right
      punchLeftTimer: 0,
      punchRightTimer: 0,
      combo: 0
    };
    var p2 = {
      x: 480, y: 215,
      state: 'idle', // 'idle' | 'windup' | 'punching' | 'stunned' | 'hit'
      windupTimer: 0,
      punchTimer: 0,
      stunTimer: 0,
      hitReactionTimer: 0,
      atkTimer: 65
    };
    var sparks = [];

    function initSport() {
      p1Hp = 100; p2Hp = 100; state = 'fight';
      p1.guard = false; p1.dodge = 0; p1.combo = 0;
      p2.state = 'idle'; p2.atkTimer = 65;
      updateHud();

      $('btnActionLeft').textContent = '🥊 ชกซ้าย (A)';
      $('btnActionRight').textContent = '🥊 ชกขวา (D)';
      $('btnActionLeft').style.display = 'inline-flex';
      $('btnActionRight').style.display = 'inline-flex';
      $('btnActionUp').style.display = 'none';
      $('btnActionDown').style.display = 'none';
      $('btnMainAction').textContent = '🛡️ ยกการ์ด (S / Space)';
      $('btnSubAction').textContent = '💨 โยกหลบ (W)';
      $('hintText').textContent = '💡 เทคนิค: สังเกตสัญญาณ ⚠️ เมื่อบอทจะชก ให้กด "ยกการ์ด" บล็อก หรือ "โยกหลบ" แล้วสวนหมัดกลับ!';
      $('hudSubStatus').textContent = '🥊 ยกที่ 1 ระฆังดังแล้ว! ลุยเลย!';
      Snd.play('whistle');
    }

    function updateHud() {
      $('p1ScoreDisplay').textContent = Math.max(0, Math.round(p1Hp)) + ' HP';
      $('p2ScoreDisplay').textContent = Math.max(0, Math.round(p2Hp)) + ' HP';
    }

    function punchLeft() {
      if (state !== 'fight' || p1.punchLeftTimer > 0) return;
      p1.punchLeftTimer = 11;
      p1.guard = false;
      deliverPunch('left', 12);
    }

    function punchRight() {
      if (state !== 'fight' || p1.punchRightTimer > 0) return;
      p1.punchRightTimer = 13;
      p1.guard = false;
      deliverPunch('right', 16);
    }

    function deliverPunch(hand, baseDmg) {
      var char = getSelectedChar();
      var dmg = baseDmg * char.power;
      Snd.play('box_punch');

      if (p2.state === 'stunned') {
        dmg *= 2.2;
        showBanner('COUNTER PUNCH! ⚡💥', 'เคาน์เตอร์คริติคอลรุนแรง!');
        addSparks(480, 210, 16, '#facc15');
      } else {
        addSparks(hand === 'left' ? 440 : 520, 215, 8, '#f87171');
      }

      p1.combo++;
      if (p1.combo >= 2) {
        dmg += 6;
        showBanner('1-2 COMBO! 🥊🥊', 'คอมโบหมัดเข้าเป้า!');
        p1.combo = 0;
      }

      p2Hp -= dmg;
      p2.hitReactionTimer = 10;
      p2.state = 'hit';
      updateHud();

      if (p2Hp <= 0) {
        state = 'ko';
        Snd.play('box_ko');
        showBanner('K.O.! 🥊🏆', 'น็อกเอาต์คู่แข่งลงไปกองกับพื้น!');
        setTimeout(function () {
          endSportMatch(true, 'K.O. Heavyweight Champion', 'Boxing MVP 🥊');
        }, 2600);
      }
    }

    function setGuard(isGuarding) {
      if (state !== 'fight') return;
      p1.guard = isGuarding;
    }

    function dodge() {
      if (state !== 'fight') return;
      p1.dodge = (p1.dodge === 0) ? -1 : (p1.dodge === -1 ? 1 : -1);
      p1.guard = false;
      setTimeout(function () { p1.dodge = 0; }, 400);
    }

    function addSparks(x, y, count, color) {
      for (var i = 0; i < count; i++) {
        sparks.push({
          x: x, y: y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          color: color || '#facc15',
          life: 12
        });
      }
    }

    function update() {
      if (p1.punchLeftTimer > 0) p1.punchLeftTimer--;
      if (p1.punchRightTimer > 0) p1.punchRightTimer--;

      sparks.forEach(function (s) {
        s.x += s.vx; s.y += s.vy; s.life--;
      });
      sparks = sparks.filter(function (s) { return s.life > 0; });

      if (state === 'fight') {
        if (p2.state === 'hit') {
          p2.hitReactionTimer--;
          if (p2.hitReactionTimer <= 0) p2.state = 'idle';
        } else if (p2.state === 'stunned') {
          p2.stunTimer--;
          if (p2.stunTimer <= 0) p2.state = 'idle';
        } else if (p2.state === 'windup') {
          p2.windupTimer--;
          if (p2.windupTimer <= 0) {
            // Deliver Opponent Punch!
            p2.state = 'punching';
            p2.punchTimer = 14;

            if (p1.dodge !== 0) {
              // Successfully Dodged!
              p2.state = 'stunned';
              p2.stunTimer = 65;
              Snd.play('tennis_hit');
              showBanner('DODGED! 💨', 'โยกหลบสวยงาม! โอกาสเคาน์เตอร์!');
            } else if (p1.guard) {
              // Guard Blocked!
              p1Hp -= 3;
              p2.state = 'idle';
              Snd.play('tennis_hit');
              showBanner('GUARD BLOCKED! 🛡️', 'การ์ดยกบล็อกหมัดได้!');
              updateHud();
            } else {
              // Direct Hit to Player!
              p1Hp -= 16;
              p2.state = 'idle';
              Snd.play('box_punch');
              addSparks(480, 420, 10, '#ef4444');
              showBanner('TAKEN HIT! 💥', 'โดนหมัดคู่แข่ง!');
              updateHud();

              if (p1Hp <= 0) {
                state = 'ko';
                Snd.play('box_ko');
                showBanner('DOWN! 😢', 'คุณพ่ายแพ้ในยกนี้!');
                setTimeout(function () {
                  endSportMatch(false, 'Defeated in Round 1', 'Boxing Contender');
                }, 2200);
              }
            }
          }
        } else if (p2.state === 'idle') {
          p2.atkTimer--;
          if (p2.atkTimer <= 0) {
            p2.atkTimer = 60 + Math.floor(Math.random() * 30);
            p2.state = 'windup';
            p2.windupTimer = 26; // 0.43s warning telegraph
          }
        }
      }
    }

    function render(c) {
      // 1. Boxing Arena & Ropes
      c.fillStyle = '#090d16';
      c.fillRect(0, 0, 960, 540);

      // Ring Canvas (Deep Blue Mat)
      c.fillStyle = '#1e3a8a';
      c.beginPath();
      c.moveTo(170, 160); c.lineTo(790, 160);
      c.lineTo(890, 510); c.lineTo(70, 510);
      c.closePath(); c.fill();

      // Ring Ropes (Red, White, Blue)
      [140, 175, 210].forEach(function (ry, idx) {
        c.strokeStyle = (idx === 0) ? '#ef4444' : (idx === 1 ? '#ffffff' : '#3b82f6');
        c.lineWidth = 5;
        c.beginPath();
        c.moveTo(70, ry + 120); c.lineTo(170, ry);
        c.lineTo(790, ry); c.lineTo(890, ry + 120);
        c.stroke();
      });

      // Sparks
      sparks.forEach(function (s) {
        c.fillStyle = s.color;
        c.beginPath(); c.arc(s.x, s.y, 4, 0, Math.PI * 2); c.fill();
      });

      // 2. Opponent Boxer (Robo-Bot)
      var p2HeadX = p2.x + (p2.state === 'hit' ? (p1.punchLeftTimer > 0 ? 18 : -18) : 0);
      var p2HeadY = p2.y;

      // Opponent Shadow
      c.fillStyle = 'rgba(0,0,0,0.4)';
      c.beginPath(); c.ellipse(p2.x, 260, 45, 14, 0, 0, Math.PI * 2); c.fill();

      // Opponent Body / Shorts
      c.fillStyle = '#b91c1c';
      c.fillRect(p2HeadX - 25, p2HeadY + 10, 50, 40);

      // Opponent Head (Robo-Bot)
      c.font = '54px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('🤖', p2HeadX, p2HeadY - 15);

      // Warning Indicator (Telegraph before attacking)
      if (p2.state === 'windup') {
        c.save();
        c.font = 'bold 24px sans-serif';
        c.fillStyle = '#ef4444';
        c.fillText('⚠️ ATTACK!', p2.x, p2.y - 65);
        c.restore();
      } else if (p2.state === 'stunned') {
        c.save();
        c.font = 'bold 22px sans-serif';
        c.fillStyle = '#facc15';
        c.fillText('💫 STUNNED! ⚡', p2.x, p2.y - 65);
        c.restore();
      }

      // Opponent Gloves
      c.fillStyle = '#ef4444';
      var p2GlovesOffset = (p2.state === 'windup') ? -12 : (p2.state === 'punching' ? 22 : 0);
      c.beginPath(); c.arc(p2HeadX - 42, p2HeadY + 10 + p2GlovesOffset, 16, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(p2HeadX + 42, p2HeadY + 10 + p2GlovesOffset, 16, 0, Math.PI * 2); c.fill();

      // 3. Player Foreground Dual Cartoon Boxing Gloves (First-Person Perspective!)
      var bob = Math.sin(Date.now() * 0.008) * 6;
      var dodgeOffset = p1.dodge * 65;

      // Left Glove
      var lGloveX = 390 + dodgeOffset;
      var lGloveY = (p1.punchLeftTimer > 0) ? 310 : (p1.guard ? 350 : (420 + bob));
      if (p1.guard) lGloveX = 450 + dodgeOffset;

      c.save();
      c.fillStyle = '#dc2626';
      c.beginPath();
      c.arc(lGloveX, lGloveY, (p1.punchLeftTimer > 0) ? 34 : 40, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.stroke();
      c.fillStyle = '#ffffff'; c.font = 'bold 16px sans-serif'; c.textAlign = 'center';
      c.fillText('🥊 L', lGloveX, lGloveY + 5);
      c.restore();

      // Right Glove
      var rGloveX = 570 + dodgeOffset;
      var rGloveY = (p1.punchRightTimer > 0) ? 300 : (p1.guard ? 350 : (420 - bob));
      if (p1.guard) rGloveX = 510 + dodgeOffset;

      c.save();
      c.fillStyle = '#dc2626';
      c.beginPath();
      c.arc(rGloveX, rGloveY, (p1.punchRightTimer > 0) ? 36 : 40, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.stroke();
      c.fillStyle = '#ffffff'; c.font = 'bold 16px sans-serif'; c.textAlign = 'center';
      c.fillText('🥊 R', rGloveX, rGloveY + 5);
      c.restore();

      // Guard Shield Visual
      if (p1.guard) {
        c.save();
        c.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        c.lineWidth = 4;
        c.beginPath();
        c.arc(480 + dodgeOffset, 360, 60, 0, Math.PI * 2);
        c.stroke();
        c.fillStyle = 'rgba(56, 189, 248, 0.2)';
        c.fill();
        c.restore();
      }
    }

    return {
      init: initSport,
      punchLeft: punchLeft,
      punchRight: punchRight,
      setGuard: setGuard,
      dodge: dodge,
      onAction: function (isSuper) { if (isSuper) punchRight(); else punchLeft(); },
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

    document.querySelectorAll('.sport-tab').forEach(function (tab) {
      if (tab.dataset.sport === sportName) tab.classList.add('active');
      else tab.classList.remove('active');
    });

    var titles = {
      tennis: '🎾 DOGNEY TENNIS',
      bowling: '🎳 DOGNEY BOWLING',
      baseball: '⚾ DOGNEY BASEBALL',
      boxing: '🥊 DOGNEY BOXING'
    };
    $('hudSportTitle').textContent = titles[sportName] || 'DOGNEY COURTS';

    var guides = {
      tennis: '<span class="guide-tag">⌨️ PC Tennis:</span> <span class="guide-key"><kbd>A</kbd><kbd>D</kbd> / <kbd>◀</kbd><kbd>▶</kbd> ขยับซ้าย-ขวา</span> <span class="guide-key highlight"><kbd>Spacebar</kbd> / คลิก = หวดลูก / เสิร์ฟ</span> <span class="guide-key"><kbd>W</kbd> / <kbd>Shift</kbd> สแมช</span>',
      bowling: '<span class="guide-tag">⌨️ PC Bowling:</span> <span class="guide-key"><kbd>A</kbd><kbd>D</kbd> ยืนเล็ง & สปินโค้ง</span> <span class="guide-key highlight"><kbd>Spacebar</kbd> / คลิก = กลิ้งลูก</span> <span class="guide-key"><kbd>R</kbd> เล็งใหม่</span>',
      baseball: '<span class="guide-tag">⌨️ PC Baseball:</span> <span class="guide-key highlight"><kbd>Spacebar</kbd> / <kbd>Enter</kbd> / คลิกเมาส์ = หวดไม้เบสบอล ซัด Home Run!</span> <span class="guide-key"><kbd>W</kbd> สวิงเต็มแรง</span>',
      boxing: '<span class="guide-tag">⌨️ PC Boxing:</span> <span class="guide-key highlight"><kbd>A</kbd> / <kbd>◀</kbd> ชกซ้าย</span> <span class="guide-key highlight"><kbd>D</kbd> / <kbd>▶</kbd> ชกขวา</span> <span class="guide-key"><kbd>S</kbd> / <kbd>▼</kbd> / <kbd>Space</kbd> ยกการ์ด</span> <span class="guide-key"><kbd>W</kbd> / <kbd>▲</kbd> / <kbd>Q</kbd> / <kbd>E</kbd> โยกหลบ</span>'
    };
    var guideEl = $('pcGuideStrip');
    if (guideEl && guides[sportName]) guideEl.innerHTML = guides[sportName];

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

    // Fixed 60Hz Physics Timestep Loop (Buttery smooth on 60Hz / 90Hz / 120Hz phone screens)
    var lastFrameTime = performance.now();
    var accumulator = 0;
    var FIXED_TIMESTEP = 1000 / 60; // 16.666ms

    function loop(currentTime) {
      if (!currentTime) currentTime = performance.now();
      var dt = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      if (dt > 100) dt = 100;
      accumulator += dt;

      while (accumulator >= FIXED_TIMESTEP) {
        if (STATE.activeSport === 'tennis') Tennis.update();
        else if (STATE.activeSport === 'bowling') Bowling.update();
        else if (STATE.activeSport === 'baseball') Baseball.update();
        else if (STATE.activeSport === 'boxing') Boxing.update();
        accumulator -= FIXED_TIMESTEP;
      }

      if (ctx) {
        if (STATE.activeSport === 'tennis') Tennis.render(ctx);
        else if (STATE.activeSport === 'bowling') Bowling.render(ctx);
        else if (STATE.activeSport === 'baseball') Baseball.render(ctx);
        else if (STATE.activeSport === 'boxing') Boxing.render(ctx);
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
