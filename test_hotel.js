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
assert.ok(html.includes('id="btnOpenDecorModal"'), 'Must have decor studio button');
assert.ok(html.includes('id="decorModal"'), 'Must have decor modal');
assert.ok(html.includes('id="roomManageModal"'), 'Must have room management modal');
assert.ok(html.includes('id="sidewalkWalkers"'), 'Must have sidewalk walkers layer');
assert.ok(html.includes('id="itemShopModal"'), 'Must have item shop modal');
assert.ok(html.includes('id="starMilestonesModal"'), 'Must have star milestones modal');
assert.ok(html.includes('id="btnOpenItemShop"'), 'Must have open item shop button');
assert.ok(html.includes('id="btnCallTourBus"'), 'Must have call tour bus button');
assert.ok(html.includes('id="rushHourBanner"'), 'Must have rush hour banner');
assert.ok(html.includes('id="tourBusCab"'), 'Must have tour bus element');
assert.ok(html.includes('id="mysteryLuggage"'), 'Must have mystery luggage element');
console.log('✔ hotel.html structure validated');

// 2. Verify hotel.css
const css = fs.readFileSync(dir + '\\hotel.css', 'utf8');
assert.ok(css.includes('.floor-row'), 'Must style floor rows');
assert.ok(css.includes('.elevator-shaft'), 'Must style elevator shaft');
assert.ok(css.includes('.elevator-cabin'), 'Must style elevator cabin');
assert.ok(css.includes('.neon-sign-container'), 'Must style rooftop neon sign');
assert.ok(css.includes('.gate-overlay'), 'Must style password gate overlay');
assert.ok(css.includes('.decor-card'), 'Must style decor cards');
assert.ok(css.includes('.guest-thought-bubble'), 'Must style guest thought bubbles');
assert.ok(css.includes('.sidewalk-walker'), 'Must style sidewalk walkers');
assert.ok(css.includes('.rush-hour-banner'), 'Must style rush hour banner');
assert.ok(css.includes('.tour-bus-cab'), 'Must style tour bus');
assert.ok(css.includes('.mystery-luggage'), 'Must style mystery luggage');
assert.ok(css.includes('.room-service-bubble'), 'Must style room service bubble');
assert.ok(css.includes('.item-card'), 'Must style item shop cards');
assert.ok(css.includes('.milestone-card'), 'Must style star milestone cards');
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
assert.ok(js.includes('openRoomManageModal'), 'Must have room management logic');
assert.ok(js.includes('openDecorModal'), 'Must have decor studio logic');
assert.ok(js.includes('applyWallpaper'), 'Must have wallpaper application logic');
assert.ok(js.includes('applyFlooring'), 'Must have flooring application logic');
assert.ok(js.includes('serveGuestThought'), 'Must have guest interactive thought bubbles');
assert.ok(js.includes('updateElevatorCabinSlide'), 'Must have continuous elevator slide');
assert.ok(js.includes('spawnSidewalkWalker'), 'Must have sidewalk walker AI');
assert.ok(js.includes('startAmbientBGM'), 'Must have ambient retro elevator BGM');
assert.ok(js.includes('demolishCurrentRoom'), 'Must have room demolition logic with refund');
assert.ok(js.includes('upgradeCurrentRoom'), 'Must have room upgrade logic');
assert.ok(js.includes('bedroom_ryokan:'), 'Must have Japanese Zen Ryokan');
assert.ok(js.includes('bedroom_kawaii:'), 'Must have Pastel Kawaii Suite');
assert.ok(js.includes('cinema:'), 'Must have VIP Cinema');
assert.ok(js.includes('aquarium:'), 'Must have Underwater Aquarium Suite');
assert.ok(js.includes('HOTEL_ITEMS ='), 'Must have boutique item catalog');
assert.ok(js.includes('MILESTONES ='), 'Must have star milestones');
assert.ok(js.includes('openItemShop'), 'Must have item shop modal logic');
assert.ok(js.includes('callTourBus'), 'Must have tour bus rush hour logic');
assert.ok(js.includes('serveRoomService'), 'Must have room service minigame');
assert.ok(js.includes('openMysteryLuggage'), 'Must have mystery luggage logic');
console.log('✔ hotel.js engine validated');

// 4. Verify index.html portal
const indexHtml = fs.readFileSync(dir + '\\index.html', 'utf8');
assert.ok(indexHtml.includes('href="hotel.html"'), 'index.html must link to hotel.html');
assert.ok(indexHtml.includes('Hotel City'), 'index.html must feature Hotel City');
console.log('✔ index.html portal integration validated');

console.log('🎉 ALL HOTEL CITY TESTS PASSED (100%)!');
