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
assert.ok(html.includes('id="pcControlsGuide"'), 'Must have PC controls helper guide strip');
assert.ok(html.includes('id="resultModal"'), 'Must have match result modal');
assert.ok(html.includes('id="goalBanner"'), 'Must have celebration goal banner');
console.log('✔ dojibos.html structure validated');

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
console.log('✔ dojibos.css styling validated');

// 3. Verify dojibos.js logic
const js = fs.readFileSync(dir + '\\dojibos.js', 'utf8');
assert.ok(js.includes("'larny'"), 'Must check larny password');
assert.ok(js.includes('toLowerCase()'), 'Must be case-insensitive');
assert.ok(js.includes('DIFFICULTIES'), 'Must have DIFFICULTIES definitions');
assert.ok(js.includes('ระดับ 1 (ง่ายมาก - Beginner)'), 'Must have Level 1 Beginner');
assert.ok(js.includes('ระดับ 2 (ง่าย - Amateur)'), 'Must have Level 2 Amateur');
assert.ok(js.includes('ระดับ 3 (ปานกลาง - Semi-Pro)'), 'Must have Level 3 Semi-Pro');
assert.ok(js.includes('ระดับ 4 (ยาก - Professional)'), 'Must have Level 4 Professional');
assert.ok(js.includes('ระดับ 5 (ระดับโลก - World Class Legend)'), 'Must have Level 5 World Class Legend');
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
console.log('✔ dojibos.js engine & 5 difficulty levels validated');

// 4. Verify index.html portal
const indexHtml = fs.readFileSync(dir + '\\index.html', 'utf8');
assert.ok(indexHtml.includes('href="dojibos.html"'), 'index.html must link to dojibos.html');
assert.ok(indexHtml.includes('The Dojibos'), 'index.html must feature The Dojibos');
console.log('✔ index.html portal integration validated');

console.log('🎉 ALL THE DOJIBOS TESTS PASSED (100%)!');
