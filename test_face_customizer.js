const fs = require('fs');
const assert = require('assert');

console.log('Running Face Customizer & Cute Overhaul Validation Suite...');

const dir = 'C:\\Users\\Re dmi\\nadia-lego';

// 1. Sockney Verification
const sockHtml = fs.readFileSync(dir + '\\sockney.html', 'utf8');
const sockJs = fs.readFileSync(dir + '\\sockney.js', 'utf8');

assert.ok(sockHtml.includes('id="actFace"'), 'Sockney must have Face & Mood button in home tab');
assert.ok(sockJs.includes('sparkle_boba'), 'Sockney must have sparkle_boba anime eyes');
assert.ok(sockJs.includes('drawSparkleBobaEye'), 'Sockney must have drawSparkleBobaEye function');
assert.ok(sockJs.includes('kitty_3'), 'Sockney must have kitty_3 (:3) mouth');
assert.ok(sockJs.includes('blep_tongue'), 'Sockney must have blep_tongue mouth');
assert.ok(sockJs.includes('rosy_glow'), 'Sockney must have rosy_glow blush');
assert.ok(sockJs.includes('eyes:'), 'Sockney WARDROBE must have eyes category');
assert.ok(sockJs.includes('mouth:'), 'Sockney WARDROBE must have mouth category');
assert.ok(sockJs.includes('blush:'), 'Sockney WARDROBE must have blush category');
assert.ok(sockJs.includes('emotion:'), 'Sockney WARDROBE must have emotion category');

// 2. Pet Society Boba Seal & Universal Face Customizer
const petData = fs.readFileSync(dir + '\\petsociety_data.js', 'utf8');
const petRenderer = fs.readFileSync(dir + '\\petsociety_renderer.js', 'utf8');
const petGame = fs.readFileSync(dir + '\\petsociety_game.js', 'utf8');
const petHtml = fs.readFileSync(dir + '\\petsociety.html', 'utf8');
const petCss = fs.readFileSync(dir + '\\petsociety.css', 'utf8');

assert.ok(petData.includes('boba_sparkle'), 'petsociety_data must include boba_sparkle eyes');
assert.ok(petData.includes('mouthShapes:'), 'petsociety_data must include mouthShapes catalog');
assert.ok(petData.includes('noseShapes:'), 'petsociety_data must include noseShapes catalog');
assert.ok(petData.includes('blushStyles:'), 'petsociety_data must include blushStyles catalog');
assert.ok(petData.includes('emotions:'), 'petsociety_data must include emotions catalog');
assert.ok(petData.includes("id: 'boba'"), 'petsociety_data must include Boba preset character');

assert.ok(petRenderer.includes("species.id === 'seal'"), 'petsociety_renderer must handle seal species');
assert.ok(petRenderer.includes('AUTHENTIC BOBA THE SEAL HEAD'), 'petsociety_renderer must draw authentic Boba seal head');
assert.ok(petRenderer.includes('Signature Authentic White Muzzle Patch'), 'petsociety_renderer must draw Boba white heart muzzle patch');
assert.ok(petRenderer.includes('eyeShape === \'boba_sparkle\''), 'petsociety_renderer must draw boba_sparkle eyes');
assert.ok(petRenderer.includes('species.id === \'sock\''), 'petsociety_renderer must handle sock species head');

assert.ok(petHtml.includes('id="btnOpenFaceModal"'), 'petsociety.html must have btnOpenFaceModal');
assert.ok(petHtml.includes('id="faceModal"'), 'petsociety.html must have faceModal dialog');
assert.ok(petHtml.includes('id="facePreviewCanvas"'), 'petsociety.html must have facePreviewCanvas');
assert.ok(petHtml.includes('id="btnRandomFace"'), 'petsociety.html must have btnRandomFace');
assert.ok(petCss.includes('.tool-circle-btn.tool-face'), 'petsociety.css must have tool-face styling');

assert.ok(petGame.includes('openFaceModal()'), 'petsociety_game must have openFaceModal');
assert.ok(petGame.includes('renderFaceFeatures'), 'petsociety_game must have renderFaceFeatures');
assert.ok(petGame.includes('renderFacePreview'), 'petsociety_game must have renderFacePreview');

// 3. Boba Seal (seal.js & seal.html)
const sealHtml = fs.readFileSync(dir + '\\seal.html', 'utf8');
const sealJs = fs.readFileSync(dir + '\\seal.js', 'utf8');

assert.ok(sealHtml.includes('id="actFace"'), 'seal.html must have actFace button');
assert.ok(sealJs.includes('boba_pearl'), 'seal.js must include boba_pearl');
assert.ok(sealJs.includes('heart_sparkle'), 'seal.js must include heart_sparkle');
assert.ok(sealJs.includes('kitty_smile'), 'seal.js must include kitty_smile');
assert.ok(sealJs.includes('blep_tongue'), 'seal.js must include blep_tongue');

// 4. Dogney (dogney.js & dogney.html)
const dogHtml = fs.readFileSync(dir + '\\dogney.html', 'utf8');
const dogJs = fs.readFileSync(dir + '\\dogney.js', 'utf8');

assert.ok(dogHtml.includes('id="actFace"'), 'dogney.html must have actFace button');
assert.ok(dogJs.includes('boba_sparkle'), 'dogney.js must include boba_sparkle');
assert.ok(dogJs.includes('kitty_3'), 'dogney.js must include kitty_3');
assert.ok(dogJs.includes('blep_tongue'), 'dogney.js must include blep_tongue');

// 5. Password & Privacy Check
const indexHtml = fs.readFileSync(dir + '\\index.html', 'utf8');
assert.ok(indexHtml.includes('larny'), 'index.html password gate must require larny');
assert.ok(indexHtml.includes('toLowerCase()'), 'index.html password check must be case-insensitive');
assert.ok(!petHtml.includes('(ใบ้:'), 'pet society must not have password hints');
assert.ok(!petGame.includes('Macky / Larny'), 'pet society code must not expose password hints');

console.log('🎉 ALL INVARIANTS CHECKED AND PASSED SUCCESSFULLY!');
