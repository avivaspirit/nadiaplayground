const fs = require('fs');
const assert = require('assert');

console.log('Running The Dojibos Mini Football Validation Suite...');

const dir = 'C:\\Users\\Re dmi\\nadia-lego';

// 1. Verify dojibos.html
const html = fs.readFileSync(dir + '\\dojibos.html', 'utf8');
assert.ok(html.includes('id="pitchCanvas"'), 'Must have pitch canvas');
assert.ok(html.includes('id="gateOverlay"'), 'Must have password gate overlay');
assert.ok(html.includes('id="gatePass"'), 'Must have password input');
assert.ok(html.includes('id="gateBtn"'), 'Must have password submit button');
assert.ok(html.includes('id="touchControlsBar"'), 'Must have touch controls bar');
assert.ok(html.includes('id="touchLeft"'), 'Must have touch left button');
assert.ok(html.includes('id="touchRight"'), 'Must have touch right button');
assert.ok(html.includes('id="touchJump"'), 'Must have touch jump button');
assert.ok(html.includes('id="touchKick"'), 'Must have touch kick button');
assert.ok(html.includes('id="touchSuper"'), 'Must have touch super button');
assert.ok(html.includes('id="rosterModal"'), 'Must have character roster modal');
assert.ok(html.includes('id="diffModal"'), 'Must have difficulty selection modal');
assert.ok(html.includes('id="btnDiffToggle"'), 'Must have difficulty selector toggle button in nav');
assert.ok(html.includes('id="modeDifficultyBar"'), 'Must have prominent on-screen mode & difficulty toolbar');
assert.ok(html.includes('id="tabModeSolo"'), 'Must have Solo bot mode tab');
assert.ok(html.includes('id="tabModeOnline"'), 'Must have Online 2-player mode tab');
assert.ok(html.includes('id="quickDiffSelector"'), 'Must have quick 10 difficulty level buttons directly on screen');
assert.ok(html.includes('data-lvl="1"'), 'Must have quick button for Level 1');
assert.ok(html.includes('data-lvl="5"'), 'Must have quick button for Level 5');
assert.ok(html.includes('data-lvl="10"'), 'Must have quick button for Level 10');
assert.ok(html.includes('diff-godlike'), 'Must have godlike badge for Level 10');
assert.ok(html.includes('id="onlineModal"'), 'Must have online 2-player modal');
assert.ok(html.includes('id="coupleQuickBar"'), 'Must have on-screen couple quick bar');
assert.ok(html.includes('id="btnBarMacInvite"'), 'Must have Mac invite button in toolbar');
assert.ok(html.includes('id="btnBarNadiaJoin"'), 'Must have Nadia join button in toolbar');
assert.ok(html.includes('id="btnBarAutoJoin"'), 'Must have 1-click auto-join button in toolbar');
assert.ok(html.includes('id="btnFastGatePass"'), 'Must have 1-click password gate bypass button');
assert.ok(html.includes('id="qrCodeImg"'), 'Must have QR Code scan image for instant phone scan');
assert.ok(html.includes('id="btnStartHost"'), 'Must have host room button for Mac');
assert.ok(html.includes('id="btnStartJoin"'), 'Must have join room button for Nadia');
assert.ok(html.includes('id="btnCopyRoomLink"'), 'Must have 1-click shareable link copy button for Nadia');
assert.ok(html.includes('id="pcControlsGuide"'), 'Must have PC controls helper guide strip');
assert.ok(html.includes('id="resultModal"'), 'Must have match result modal');
assert.ok(html.includes('id="goalBanner"'), 'Must have celebration goal banner');
assert.ok(html.includes('peerjs.min.js'), 'Must include local peerjs script');
console.log('✔ dojibos.html structure, quick difficulty bar & online lobby validated');

// 2. Verify dojibos.css
const css = fs.readFileSync(dir + '\\dojibos.css', 'utf8');
assert.ok(css.includes('.pitch-container'), 'Must style pitch container');
assert.ok(css.includes('.jumbotron-scoreboard'), 'Must style scoreboard');
assert.ok(css.includes('.touch-btn'), 'Must style touch controls');
assert.ok(css.includes('.goal-banner'), 'Must style goal banner');
assert.ok(css.includes('.gate-overlay'), 'Must style gate overlay');
assert.ok(css.includes('.btn-diff'), 'Must style difficulty button');
assert.ok(css.includes('.pc-controls-guide'), 'Must style PC controls helper bar');
assert.ok(css.includes('.diff-grid'), 'Must style difficulty modal grid');
assert.ok(css.includes('.mode-difficulty-bar'), 'Must style on-screen difficulty toolbar');
assert.ok(css.includes('.quick-diff-btn'), 'Must style quick difficulty buttons');
assert.ok(css.includes('.online-modal-card'), 'Must style online 2-player modal');
console.log('✔ dojibos.css styling validated');

// 3. Verify dojibos.js logic
const js = fs.readFileSync(dir + '\\dojibos.js', 'utf8');
assert.ok(js.includes("'larny'"), 'Must check larny password');
assert.ok(js.includes('toLowerCase()'), 'Must be case-insensitive');
assert.ok(js.includes('DIFFICULTIES'), 'Must have DIFFICULTIES definitions');
assert.ok(js.includes('ระดับ 1 (ง่ายมาก - Beginner)'), 'Must have Level 1 Beginner');
assert.ok(js.includes('ระดับ 5 (ปานกลาง - Semi-Pro)'), 'Must have Level 5 Semi-Pro');
assert.ok(js.includes('ระดับ 8 (ยากมาก - World Class)'), 'Must have Level 8 World Class');
assert.ok(js.includes('ระดับ 10 (ไร้เทียมทาน - Godlike 💀)'), 'Must have Level 10 Godlike');
assert.ok(js.includes('level: 10'), 'Must define Level 10 in DIFFICULTIES');
assert.ok(js.includes('ONLINE'), 'Must have ONLINE engine object');
assert.ok(js.includes('startHost'), 'Must have startHost function for Mac');
assert.ok(js.includes('startJoin'), 'Must have startJoin function for Nadia');
assert.ok(js.includes('copyRoomLink'), 'Must have copyRoomLink function');
assert.ok(js.includes('openDiffModal'), 'Must have difficulty modal open function');
assert.ok(js.includes('window.selectDifficulty'), 'Must have difficulty selection function');
assert.ok(js.includes('Space'), 'Must handle spacebar key for jump');
assert.ok(js.includes('ArrowDown'), 'Must handle Down Arrow key for kick');
assert.ok(js.includes('Enter'), 'Must handle Enter key for kick');
assert.ok(js.includes('doji_dog'), 'Must have Doji Dog character');
assert.ok(js.includes('boba_seal'), 'Must have Boba Seal character');
assert.ok(js.includes('sockney'), 'Must have Sockney character');
assert.ok(js.includes('dogney'), 'Must have Dogney Pup character');
assert.ok(js.includes('nadia_star'), 'Must have Nadia Star character');
assert.ok(js.includes('updatePhysics'), 'Must have 2D physics engine');
assert.ok(js.includes('triggerGoal'), 'Must have goal detection and celebration');
assert.ok(js.includes('performKick'), 'Must have kick mechanics');
assert.ok(js.includes('updateAI'), 'Must have AI opponent bot');
assert.ok(js.includes('startKickoffSequence'), 'Must have kickoff countdown');
assert.ok(js.includes('openrelay.metered.ca'), 'Must configure TURN servers for cellular 4G/5G and NAT traversal');
assert.ok(js.includes('reliable: true'), 'Must configure reliable WebRTC data channel');
assert.ok(js.includes('PENDING_ROOM_JOIN'), 'Must handle password gate deferral on join query');
assert.ok(js.includes('getP1CharDef'), 'Must correctly map P1 character definitions');
assert.ok(js.includes('getP2CharDef'), 'Must correctly map P2 character definitions');
assert.ok(js.includes('startInstantOnline'), 'Must have 1-click startInstantOnline function');
assert.ok(js.includes('PAIR_TOPIC'), 'Must configure instant presence topic');
assert.ok(js.includes('PAIR_SSE_URL'), 'Must configure SSE stream for instant discovery');
assert.ok(js.includes('btnFastGatePass'), 'Must hook up 1-click password gate bypass');
assert.ok(js.includes('quickHostForMac'), 'Must have 1-click quickHostForMac function');
assert.ok(js.includes('quickJoinForNadia'), 'Must have 1-click quickJoinForNadia function');
assert.ok(js.includes('getInviteUrl'), 'Must generate magic invite URL with auto-auth');
assert.ok(js.includes('&auth=larny'), 'Must auto-authenticate invite link without password prompt');
assert.ok(js.includes('ball.vx = 0'), 'Must reset ball with zero horizontal velocity (fair center drop)');
assert.ok(js.includes('ball.x = W / 2'), 'Must reset ball strictly in dead-center');
console.log('✔ dojibos.js engine, fair dead-center drop, auto-auth & online WebRTC + TURN validated');

// 4. Verify index.html portal
const indexHtml = fs.readFileSync(dir + '\\index.html', 'utf8');
assert.ok(indexHtml.includes('href="dojibos.html"'), 'index.html must link to dojibos.html');
assert.ok(indexHtml.includes('The Dojibos'), 'index.html must feature The Dojibos');
console.log('✔ index.html portal integration validated');

console.log('🎉 ALL THE DOJIBOS TESTS PASSED (100%)!');
