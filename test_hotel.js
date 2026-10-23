const fs = require('fs');
const assert = require('assert');

console.log('Running Hotel City Validation Suite...');

const dir = 'C:\\Users\\Re dmi\\nadia-lego';

// 1. Verify hotel.html
const html = fs.readFileSync(dir + '\\hotel.html', 'utf8');
assert.ok(html.includes('id="gateOverlay"'), 'Must have password gate overlay');
assert.ok(html.includes('id="gatePass"'), 'Must have password input');
assert.ok(html.includes('id="gateBtn"'), 'Must have password submit button');
assert.ok(html.includes('id="floorsStack"'), 'Must have building floors stack');
assert.ok(html.includes('id="neonSignBtn"'), 'Must have rooftop neon sign');
assert.ok(html.includes('id="buildShopModal"'), 'Must have room build shop modal');
assert.ok(html.includes('id="staffModal"'), 'Must have staff modal');
assert.ok(html.includes('id="vipModal"'), 'Must have VIP guest modal');
assert.ok(html.includes('id="renameModal"'), 'Must have rename modal');
assert.ok(html.includes('id="btnOpenBuildShop"'), 'Must have build room button');
assert.ok(html.includes('id="btnAddFloor"'), 'Must have add floor button');
assert.ok(html.includes('id="btnQuickCleanAll"'), 'Must have clean all button');
assert.ok(html.includes('id="btnInviteVIP"'), 'Must have invite VIP button');
console.log('✔ hotel.html structure validated');

// 2. Verify hotel.css
const css = fs.readFileSync(dir + '\\hotel.css', 'utf8');
assert.ok(css.includes('.floor-row'), 'Must style floor rows');
assert.ok(css.includes('.elevator-shaft'), 'Must style elevator shaft');
assert.ok(css.includes('.elevator-cabin'), 'Must style elevator cabin');
assert.ok(css.includes('.neon-sign-container'), 'Must style rooftop neon sign');
assert.ok(css.includes('.gate-overlay'), 'Must style password gate overlay');
console.log('✔ hotel.css styling validated');

// 3. Verify hotel.js logic
const js = fs.readFileSync(dir + '\\hotel.js', 'utf8');
assert.ok(js.includes("'larny'"), 'Must check larny password');
assert.ok(js.includes('toLowerCase()'), 'Must be case-insensitive');
assert.ok(js.includes('bedroom_single:'), 'Must have single bedroom');
assert.ok(js.includes('bedroom_double:'), 'Must have double bedroom');
assert.ok(js.includes('bedroom_suite:'), 'Must have honeymoon suite');
assert.ok(js.includes('bedroom_penthouse:'), 'Must have presidential penthouse');
assert.ok(js.includes('pool:'), 'Must have swimming pool');
assert.ok(js.includes('gym:'), 'Must have fitness gym');
assert.ok(js.includes('restaurant:'), 'Must have grand restaurant');
assert.ok(js.includes('disco:'), 'Must have disco club');
assert.ok(js.includes('spa:'), 'Must have zen spa');
assert.ok(js.includes('arcade:'), 'Must have arcade zone');
assert.ok(js.includes('spawnGuestArrival'), 'Must have guest arrival AI');
assert.ok(js.includes('addNewFloor'), 'Must have floor expansion logic');
assert.ok(js.includes('VIP_ROSTER'), 'Must have VIP guests roster');
assert.ok(js.includes('cleanAllDirtyRooms'), 'Must have cleaning logic');
assert.ok(js.includes('petsociety_save_'), 'Must cross-save with Pet Society coins');
console.log('✔ hotel.js engine validated');

// 4. Verify index.html portal
const indexHtml = fs.readFileSync(dir + '\\index.html', 'utf8');
assert.ok(indexHtml.includes('href="hotel.html"'), 'index.html must link to hotel.html');
assert.ok(indexHtml.includes('Hotel City'), 'index.html must feature Hotel City');
console.log('✔ index.html portal integration validated');

console.log('🎉 ALL HOTEL CITY TESTS PASSED (100%)!');
