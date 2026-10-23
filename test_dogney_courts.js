const fs = require('fs');
const assert = require('assert');

console.log('Running Dogney Courts (Wii Sports Edition) Validation Suite...');

const dir = 'C:\\Users\\Re dmi\\nadia-lego';

// 1. Verify dogney-courts.html
const html = fs.readFileSync(dir + '\\dogney-courts.html', 'utf8');
assert.ok(html.includes('id="arenaCanvas"'), 'Must have arena canvas');
assert.ok(html.includes('id="gateOverlay"'), 'Must have password gate overlay');
assert.ok(html.includes('id="gatePass"'), 'Must have password input');
assert.ok(html.includes('id="gateBtn"'), 'Must have password submit button');
assert.ok(html.includes('id="tabTennis"'), 'Must have tennis sport tab');
assert.ok(html.includes('id="tabBowling"'), 'Must have bowling sport tab');
assert.ok(html.includes('id="tabBaseball"'), 'Must have baseball sport tab');
assert.ok(html.includes('id="tabBoxing"'), 'Must have boxing sport tab');
assert.ok(html.includes('id="arenaControlsBar"'), 'Must have arena controls bar');
assert.ok(html.includes('id="btnMainAction"'), 'Must have main action button');
assert.ok(html.includes('id="btnSubAction"'), 'Must have sub action button');
assert.ok(html.includes('id="powerMeterBox"'), 'Must have power meter box');
assert.ok(html.includes('id="courtsBanner"'), 'Must have floating impact banner');
assert.ok(html.includes('id="rosterModal"'), 'Must have character roster modal');
assert.ok(html.includes('id="resultModal"'), 'Must have match result modal');
console.log('✔ dogney-courts.html structure validated');

// 2. Verify dogney-courts.css
const css = fs.readFileSync(dir + '\\dogney-courts.css', 'utf8');
assert.ok(css.includes('.arena-container'), 'Must style arena container');
assert.ok(css.includes('.sports-selector-strip'), 'Must style sports selector strip');
assert.ok(css.includes('.sport-tab'), 'Must style sport tabs');
assert.ok(css.includes('.courts-banner'), 'Must style punchy impact banner');
assert.ok(css.includes('.power-meter-box'), 'Must style power meter');
assert.ok(css.includes('.ctrl-btn'), 'Must style control buttons');
assert.ok(css.includes('.gate-overlay'), 'Must style password gate');
console.log('✔ dogney-courts.css styling validated');

// 3. Verify dogney-courts.js
const js = fs.readFileSync(dir + '\\dogney-courts.js', 'utf8');
assert.ok(js.includes("'larny'"), 'Must verify larny password');
assert.ok(js.includes('toLowerCase()'), 'Must be case-insensitive');
assert.ok(js.includes('Tennis'), 'Must have Tennis module');
assert.ok(js.includes('Bowling'), 'Must have Bowling module');
assert.ok(js.includes('Baseball'), 'Must have Baseball module');
assert.ok(js.includes('Boxing'), 'Must have Boxing module');
assert.ok(js.includes('dogney'), 'Must have Dogney character');
assert.ok(js.includes('doji_dog'), 'Must have Doji Dog character');
assert.ok(js.includes('boba_seal'), 'Must have Boba Seal character');
assert.ok(js.includes('sockney'), 'Must have Sockney character');
assert.ok(js.includes('nadia_star'), 'Must have Nadia Star character');
assert.ok(js.includes('switchSport'), 'Must have switchSport function');
assert.ok(js.includes('showBanner'), 'Must have punchy banner announcements');
assert.ok(js.includes('endSportMatch'), 'Must have match end and rewards');
console.log('✔ dogney-courts.js 4-in-1 sports engine validated');

// 4. Verify index.html integration
const indexHtml = fs.readFileSync(dir + '\\index.html', 'utf8');
assert.ok(indexHtml.includes('href="dogney-courts.html"'), 'index.html must link to dogney-courts.html');
assert.ok(indexHtml.includes('Dogney Courts'), 'index.html must feature Dogney Courts');
console.log('✔ index.html portal integration validated');

console.log('🎉 ALL DOGNEY COURTS TESTS PASSED (100%)!');
