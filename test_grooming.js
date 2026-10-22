const fs = require('fs');
const assert = require('assert');

console.log('Running Pet Grooming Salon Validation Suite...');

const dir = 'C:\\Users\\Re dmi\\nadia-lego';

// 1. Verify grooming.html
const html = fs.readFileSync(dir + '\\grooming.html', 'utf8');
assert.ok(html.includes('id="stationNav"'), 'Must have station navigation');
assert.ok(html.includes('data-station="bath"'), 'Must have bath station');
assert.ok(html.includes('data-station="nails"'), 'Must have nails station');
assert.ok(html.includes('data-station="styling"'), 'Must have styling station');
assert.ok(html.includes('data-station="spa"'), 'Must have spa station');
assert.ok(html.includes('data-station="photo"'), 'Must have photo station');
assert.ok(html.includes('data-station="board"'), 'Must have board station');
assert.ok(html.includes('id="petCarousel"'), 'Must have pet carousel');
assert.ok(html.includes('id="nailModal"'), 'Must have nail modal');
assert.ok(html.includes('id="photoModal"'), 'Must have photo modal');
assert.ok(html.includes('id="polaroidCanvas"'), 'Must have polaroid canvas');
assert.ok(html.includes('id="coinDisplay"'), 'Must have coin display');
console.log('✔ grooming.html structure validated');

// 2. Verify grooming.js
const js = fs.readFileSync(dir + '\\grooming.js', 'utf8');
assert.ok(js.includes('dogney:'), 'Must include dogney in PETS');
assert.ok(js.includes('boba:'), 'Must include boba seal in PETS');
assert.ok(js.includes('sockney:'), 'Must include sockney in PETS');
assert.ok(js.includes('bunny:'), 'Must include bunny in PETS');
assert.ok(js.includes('kitty:'), 'Must include kitty in PETS');

assert.ok(js.includes("'teddy'"), 'Must include teddy style');
assert.ok(js.includes("'cloud'"), 'Must include cloud style');
assert.ok(js.includes("'lion'"), 'Must include lion style');

assert.ok(js.includes('drawDogney'), 'Must have drawDogney function');
assert.ok(js.includes('drawBobaSeal'), 'Must have drawBobaSeal function');
assert.ok(js.includes('drawSockney'), 'Must have drawSockney function');
assert.ok(js.includes('drawBunny'), 'Must have drawBunny function');
assert.ok(js.includes('drawKitty'), 'Must have drawKitty function');

assert.ok(js.includes('handleSnipAttempt'), 'Must have nail snip game collision logic');
assert.ok(js.includes('pushCoinsToPetSociety'), 'Must synchronize coins with Pet Society');
assert.ok(js.includes('snapPolaroidCertificate'), 'Must generate polaroid certificate');
console.log('✔ grooming.js logic validated');

// 3. Verify index.html portal
const indexHtml = fs.readFileSync(dir + '\\index.html', 'utf8');
assert.ok(indexHtml.includes('href="grooming.html"'), 'index.html must have Pet Grooming card');
assert.ok(indexHtml.includes("grooming: { e: '🛁'"), 'index.html must have grooming in META');
console.log('✔ index.html portal integration validated');

// 4. Verify pet game cross-links
const dogHtml = fs.readFileSync(dir + '\\dogney.html', 'utf8');
assert.ok(dogHtml.includes('href="grooming.html"'), 'dogney.html must have grooming link');

const sealHtml = fs.readFileSync(dir + '\\seal.html', 'utf8');
assert.ok(sealHtml.includes('href="grooming.html"'), 'seal.html must have grooming link');

const sockHtml = fs.readFileSync(dir + '\\sockney.html', 'utf8');
assert.ok(sockHtml.includes('href="grooming.html"'), 'sockney.html must have grooming link');

const psHtml = fs.readFileSync(dir + '\\petsociety.html', 'utf8');
assert.ok(psHtml.includes('href="grooming.html"'), 'petsociety.html must have grooming tool button');

const psCss = fs.readFileSync(dir + '\\petsociety.css', 'utf8');
assert.ok(psCss.includes('.tool-grooming'), 'petsociety.css must style tool-grooming');
console.log('✔ Pet game cross-links validated');

console.log('🎉 ALL PET GROOMING TESTS PASSED (100%)!');
