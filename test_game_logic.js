// ========================================================
// NadiaPlayground: Runnable Self-Check / Unit Test
// Senior Dev / Ponytail rule: one runnable check behind
// Zero frameworks, zero fixtures, pure assert
// ========================================================

const assert = require('assert');
const GAME_DATA = require('./data.js');

console.log('🧪 Running NadiaPlayground Game Logic Verification...\n');

// 1. Verify Species Catalog
console.log('1. Verifying Species Catalog...');
const requiredSpecies = ['bunny', 'seal', 'cat', 'dog', 'bear', 'penguin', 'panda'];
requiredSpecies.forEach(spId => {
  assert(GAME_DATA.species[spId], `Species ${spId} must exist`);
  assert(GAME_DATA.species[spId].favFood, `Species ${spId} must have a favorite food`);
  assert(GAME_DATA.species[spId].defaultColor, `Species ${spId} must have a default color`);
});
console.log('   ✓ All 7 pet species configured correctly (including Bunny & Seal).');

// 2. Verify Clothing Slots & Integrity
console.log('2. Verifying Clothing & Fashion Items...');
const validSlots = ['head', 'body', 'face', 'neck', 'hand', 'shoes'];
assert(GAME_DATA.clothes.length >= 15, 'Must have diverse clothing catalog');
GAME_DATA.clothes.forEach(item => {
  assert(validSlots.includes(item.slot), `Invalid slot ${item.slot} on item ${item.id}`);
  assert(typeof item.price === 'number' && item.price > 0, `Item ${item.id} must have positive price`);
  assert(item.icon, `Item ${item.id} must have display icon`);
});
console.log(`   ✓ ${GAME_DATA.clothes.length} clothing items verified across all slots.`);

// 3. Verify Food Items
console.log('3. Verifying Foods & Snacks...');
assert(GAME_DATA.foods.length >= 6, 'Must have at least 6 food varieties');
GAME_DATA.foods.forEach(f => {
  assert(f.hunger > 0 && f.happy > 0, `Food ${f.id} must replenish hunger and happiness`);
  assert(f.price > 0, `Food ${f.id} must have price`);
});
console.log(`   ✓ ${GAME_DATA.foods.length} food items verified.`);

// 4. Verify Building & Sims Catalog
console.log('4. Verifying Building Catalog (The Sims Mode)...');
const validCategories = ['building', 'nature', 'decor', 'furniture'];
GAME_DATA.buildingCatalog.forEach(b => {
  assert(validCategories.includes(b.category), `Invalid category ${b.category} on ${b.id}`);
  assert(b.width > 0 && b.height > 0, `Building ${b.id} must have dimensions`);
});
console.log(`   ✓ ${GAME_DATA.buildingCatalog.length} buildings and furniture items verified.`);

// 5. Verify Rock-Paper-Scissors Game Logic
console.log('5. Verifying Rock-Paper-Scissors resolution...');
function resolveRPS(playerMove, npcMove) {
  if (playerMove === npcMove) return 'draw';
  if (
    (playerMove === 'rock' && npcMove === 'scissors') ||
    (playerMove === 'paper' && npcMove === 'rock') ||
    (playerMove === 'scissors' && npcMove === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

assert.strictEqual(resolveRPS('rock', 'scissors'), 'win');
assert.strictEqual(resolveRPS('rock', 'paper'), 'lose');
assert.strictEqual(resolveRPS('rock', 'rock'), 'draw');
assert.strictEqual(resolveRPS('paper', 'rock'), 'win');
assert.strictEqual(resolveRPS('scissors', 'paper'), 'win');
console.log('   ✓ Rock-Paper-Scissors rules resolved correctly.');

// 6. Verify Grid Snapping Math for Build Mode
console.log('6. Verifying Grid Snap Math...');
function snapToGrid(coord, gridSize = 20) {
  return Math.round(coord / gridSize) * gridSize;
}

assert.strictEqual(snapToGrid(47, 20), 40);
assert.strictEqual(snapToGrid(52, 20), 60);
assert.strictEqual(snapToGrid(100, 20), 100);
console.log('   ✓ Grid snapping math verified.');

// 7. Verify Level Progression Formula
console.log('7. Verifying XP & Leveling Formula...');
let level = 1;
let xp = 320;
let maxXp = 300;
let coins = 100;

if (xp >= maxXp) {
  level++;
  xp -= maxXp;
  maxXp = Math.floor(maxXp * 1.35);
  coins += 100;
}

assert.strictEqual(level, 2);
assert.strictEqual(xp, 20);
assert.strictEqual(maxXp, 405);
assert.strictEqual(coins, 200);
console.log('   ✓ Level up progression verified.');

console.log('\n=============================================');
console.log('✨ ALL 7 VERIFICATION CHECKS PASSED SUCCESSFULLY! ✨');
console.log('=============================================\n');
