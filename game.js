// ==========================================
// NadiaPlayground: Pet Society Core Game Engine
// ==========================================

class NadiaPetGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.renderer = new GameRenderer(this.canvas);

    // Game Scenes: 'town', 'home', 'neighbor'
    this.currentScene = 'town';
    this.worldWidth = 2000;
    this.cameraX = 0;
    this.targetCameraX = 0;

    // Simulation Clock
    this.lastTime = performance.now();
    this.activeTool = null; // 'soap', 'shower', 'brush', 'ball', 'feed'
    this.selectedFood = null;

    // Ball physics for play
    this.ball = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 14,
      bounces: 0
    };

    // Dynamic particles
    this.bubbles = [];
    this.hearts = [];
    this.coinsFloat = [];

    // Interaction & Modal states
    this.activeNeighbor = null;
    this.selectedBuildItem = null;
    this.buildMode = false;
    this.draggedObject = null;
    this.dragOffset = { x: 0, y: 0 };
    this.mouseWorldPos = { x: 0, y: 0 };

    // Neighbor AI Roam timers
    this.neighborWanderTimer = 0;

    // Default Player State
    this.player = {
      name: 'Nadia (นาเดีย)',
      species: 'bunny', // Can switch to seal, cat, bear, etc.
      furColor: '#fde2e4',
      eyeShape: 'classic',
      blush: 'circles',
      clothes: {
        head: 'hat_ribbon',
        body: 'outfit_dress',
        face: null,
        neck: null,
        hand: 'prop_wand',
        shoes: 'shoe_bunny'
      },
      stats: {
        happiness: 90,
        hunger: 80,
        hygiene: 75,
        energy: 95
      },
      coins: 380,
      cash: 25,
      level: 1,
      xp: 150,
      maxXp: 300,
      x: 450,
      y: 440,
      targetX: 450,
      targetY: 440,
      speed: 180,
      isWalking: false,
      facingRight: true,
      customAction: null
    };

    // Town Layout: Placed Buildings & Nature
    this.townObjects = [
      { id: 'town_cottage', x: 180, y: 270, width: 140, height: 130 },
      { id: 'town_fountain', x: 740, y: 350, width: 100, height: 100 },
      { id: 'town_blossom_tree', x: 420, y: 260, width: 90, height: 120 },
      { id: 'town_apple_tree', x: 920, y: 260, width: 85, height: 115 },
      { id: 'town_bakery', x: 1060, y: 260, width: 150, height: 140 },
      { id: 'town_boutique', x: 1260, y: 260, width: 150, height: 140 },
      { id: 'town_windmill', x: 1500, y: 250, width: 120, height: 150 },
      { id: 'town_bench', x: 640, y: 390, width: 70, height: 50 },
      { id: 'town_lamp', x: 570, y: 320, width: 40, height: 100 },
      { id: 'town_lamp', x: 860, y: 320, width: 40, height: 100 },
      { id: 'town_flower_bed', x: 340, y: 380, width: 70, height: 40 }
    ];

    // Home Interior: Placed Furniture & Decor
    this.homeObjects = [
      { id: 'furn_bed', x: 80, y: 280, width: 100, height: 90 },
      { id: 'furn_sofa', x: 260, y: 320, width: 90, height: 60 },
      { id: 'furn_rug', x: 270, y: 370, width: 90, height: 60 },
      { id: 'furn_tv', x: 400, y: 310, width: 70, height: 65 },
      { id: 'furn_table', x: 520, y: 320, width: 80, height: 60 },
      { id: 'furn_fridge', x: 650, y: 280, width: 60, height: 90 },
      { id: 'furn_fireplace', x: 740, y: 280, width: 80, height: 90 }
    ];

    // Room themes
    this.roomTheme = {
      wallpaper: GAME_DATA.wallpapers[0],
      flooring: GAME_DATA.floorings[0]
    };

    // Player Inventory
    this.inventory = {
      clothes: ['hat_ribbon', 'outfit_dress', 'shoe_bunny', 'hat_sailor', 'outfit_sailor', 'hat_flower', 'outfit_hoodie'],
      foods: [
        { id: 'food_carrot', count: 4 },
        { id: 'food_fish', count: 3 },
        { id: 'food_cake', count: 2 },
        { id: 'food_tea', count: 3 }
      ],
      furniture: ['town_bench', 'town_flower_bed']
    };

    // Clone Neighbors
    this.neighbors = JSON.parse(JSON.stringify(GAME_DATA.neighbors));

    // Load saved game if exists
    this.loadState();

    // Init Event Listeners
    this.initEvents();

    // Start Main Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  // ==========================================
  // SAVE / LOAD SYSTEM
  // ==========================================
  saveState() {
    const data = {
      player: this.player,
      inventory: this.inventory,
      townObjects: this.townObjects,
      homeObjects: this.homeObjects,
      roomTheme: this.roomTheme
    };
    try {
      localStorage.setItem('nadiaplayground_save_v1', JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem('nadiaplayground_save_v1');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.player) Object.assign(this.player, d.player);
        if (d.inventory) this.inventory = d.inventory;
        if (d.townObjects) this.townObjects = d.townObjects;
        if (d.homeObjects) this.homeObjects = d.homeObjects;
        if (d.roomTheme) this.roomTheme = d.roomTheme;
      }
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    }
  }

  resetGame() {
    localStorage.removeItem('nadiaplayground_save_v1');
    window.location.reload();
  }

  // ==========================================
  // INPUT & EVENT LISTENERS
  // ==========================================
  initEvents() {
    // Canvas Click / Drag Handler
    let isMouseDown = false;
    let soapScrubCounter = 0;

    const getCanvasPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const handlePointerDown = (e) => {
      isMouseDown = true;
      audio.init();
      const pos = getCanvasPos(e);
      const worldX = (this.currentScene === 'town') ? pos.x + this.cameraX : pos.x;
      const worldY = pos.y;
      this.mouseWorldPos = { x: worldX, y: worldY };

      // 1. Build Mode Handling: Pick / Place Object
      if (this.buildMode) {
        if (this.selectedBuildItem) {
          // Place item from catalog
          this.placeNewObject(this.selectedBuildItem, worldX, worldY);
          return;
        } else {
          // Check if clicking existing object to drag
          const objs = (this.currentScene === 'town') ? this.townObjects : this.homeObjects;
          for (let i = objs.length - 1; i >= 0; i--) {
            const obj = objs[i];
            if (worldX >= obj.x && worldX <= obj.x + obj.width &&
                worldY >= obj.y && worldY <= obj.y + obj.height) {
              this.draggedObject = obj;
              this.dragOffset = { x: worldX - obj.x, y: worldY - obj.y };
              audio.playPop(520);
              return;
            }
          }
        }
        return;
      }

      // 2. Care Tools Handling on Pet
      const distToPlayer = Math.hypot(worldX - this.player.x, worldY - (this.player.y - 10));

      if (this.activeTool === 'soap') {
        if (distToPlayer < 60) {
          this.spawnBubbles(this.player.x, this.player.y - 20, 4);
          audio.playBubble();
          this.player.stats.hygiene = Math.min(100, this.player.stats.hygiene + 2);
          this.updateHUD();
        }
        return;
      } else if (this.activeTool === 'shower') {
        if (distToPlayer < 60) {
          this.rinseBubbles();
          audio.playWaterSplash();
          return;
        }
      } else if (this.activeTool === 'brush') {
        if (distToPlayer < 60) {
          audio.playBrush();
          audio.playSqueak();
          this.spawnHearts(this.player.x, this.player.y - 40, 3);
          this.player.stats.happiness = Math.min(100, this.player.stats.happiness + 3);
          this.addXP(5);
          this.updateHUD();
          return;
        }
      } else if (this.activeTool === 'ball') {
        this.tossBall(worldX, worldY);
        return;
      } else if (this.activeTool === 'feed') {
        if (distToPlayer < 60 && this.selectedFood) {
          this.feedPlayerPet(this.selectedFood);
          return;
        }
      }

      // 3. Click Neighbor to Interact
      if (this.currentScene === 'town') {
        for (const n of this.neighbors) {
          const d = Math.hypot(worldX - n.position.x, worldY - n.position.y);
          if (d < 50) {
            this.openNeighborModal(n);
            audio.playPop(650);
            return;
          }
        }

        // 4. Click Town Apple Tree / Fountain / Cottage to interact
        for (const obj of this.townObjects) {
          if (worldX >= obj.x && worldX <= obj.x + obj.width &&
              worldY >= obj.y && worldY <= obj.y + obj.height) {
            if (obj.id === 'town_cottage') {
              this.switchScene('home');
              return;
            } else if (obj.id === 'town_apple_tree') {
              this.shakeTree(obj);
              return;
            } else if (obj.id === 'town_fountain') {
              this.wishFountain(obj);
              return;
            } else if (obj.id === 'town_bakery') {
              this.openShopModal('bakery');
              return;
            } else if (obj.id === 'town_boutique') {
              this.openShopModal('boutique');
              return;
            }
          }
        }
      }

      // 5. Normal Movement: Walk to clicked point
      // Clamp Y to walking ground
      const minY = (this.currentScene === 'town') ? 370 : 330;
      const maxY = 510;
      const targetYClamped = Math.max(minY, Math.min(maxY, worldY));
      this.player.targetX = worldX;
      this.player.targetY = targetYClamped;
    };

    const handlePointerMove = (e) => {
      const pos = getCanvasPos(e);
      const worldX = (this.currentScene === 'town') ? pos.x + this.cameraX : pos.x;
      const worldY = pos.y;
      this.mouseWorldPos = { x: worldX, y: worldY };

      if (isMouseDown && this.draggedObject) {
        this.draggedObject.x = Math.round((worldX - this.dragOffset.x) / 10) * 10;
        this.draggedObject.y = Math.round((worldY - this.dragOffset.y) / 10) * 10;
      }

      // Continuous scrub with soap
      if (isMouseDown && this.activeTool === 'soap') {
        const distToPlayer = Math.hypot(worldX - this.player.x, worldY - (this.player.y - 10));
        if (distToPlayer < 55) {
          soapScrubCounter++;
          if (soapScrubCounter % 4 === 0) {
            this.spawnBubbles(this.player.x + (Math.random() - 0.5) * 30, this.player.y - 15 + (Math.random() - 0.5) * 30, 2);
            audio.playBubble();
            this.player.stats.hygiene = Math.min(100, this.player.stats.hygiene + 1);
            this.updateHUD();
          }
        }
      }
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      if (this.draggedObject) {
        audio.playPop(480);
        this.draggedObject = null;
        this.saveState();
      }
    };

    // Attach mouse & touch handlers
    this.canvas.addEventListener('mousedown', handlePointerDown);
    this.canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    this.canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    this.canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    // Keyboard WASD / Arrow movement
    window.addEventListener('keydown', (e) => {
      const step = 40;
      let moved = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.player.targetX = Math.max(30, this.player.x - step);
        moved = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        const maxX = (this.currentScene === 'town') ? this.worldWidth - 50 : this.canvas.width - 50;
        this.player.targetX = Math.min(maxX, this.player.x + step);
        moved = true;
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        const minY = (this.currentScene === 'town') ? 370 : 330;
        this.player.targetY = Math.max(minY, this.player.y - step);
        moved = true;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.player.targetY = Math.min(510, this.player.y + step);
        moved = true;
      }
      if (moved) {
        audio.init();
      }
    });

    // Navigation Buttons (Town vs Home)
    document.getElementById('btnNavTown')?.addEventListener('click', () => this.switchScene('town'));
    document.getElementById('btnNavHome')?.addEventListener('click', () => this.switchScene('home'));

    // Audio & BGM Toggle
    document.getElementById('btnToggleMusic')?.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      const btn = document.getElementById('btnToggleMusic');
      if (btn) btn.innerText = isMuted ? '🔇 Audio Off' : '🎵 Audio On';
    });

    // Care Toolbar Buttons
    const tools = ['soap', 'shower', 'brush', 'ball', 'feed'];
    tools.forEach(tool => {
      const btn = document.getElementById(`tool_${tool}`);
      if (btn) {
        btn.addEventListener('click', () => {
          audio.init();
          audio.playPop(600);
          if (this.activeTool === tool) {
            this.setTool(null);
          } else {
            this.setTool(tool);
          }
        });
      }
    });

    // Wardrobe Dress-up Button
    document.getElementById('btnOpenWardrobe')?.addEventListener('click', () => {
      audio.playPop(580);
      this.openWardrobeModal();
    });

    // Pet Customizer / Stylist Button
    document.getElementById('btnOpenStylist')?.addEventListener('click', () => {
      audio.playPop(620);
      this.openStylistModal();
    });

    // The Sims Build Mode Button
    document.getElementById('btnToggleBuild')?.addEventListener('click', () => {
      audio.playPop(700);
      this.toggleBuildMode();
    });

    // Initial HUD update
    this.updateHUD();
  }

  // ==========================================
  // SCENE SWITCHING
  // ==========================================
  switchScene(sceneName) {
    if (this.currentScene === sceneName) return;
    this.currentScene = sceneName;
    audio.playPop(550);

    // Update active nav button
    document.getElementById('btnNavTown')?.classList.toggle('active', sceneName === 'town');
    document.getElementById('btnNavHome')?.classList.toggle('active', sceneName === 'home');

    if (sceneName === 'town') {
      this.player.x = 420;
      this.player.y = 440;
      this.player.targetX = 420;
      this.player.targetY = 440;
    } else {
      this.player.x = 450;
      this.player.y = 420;
      this.player.targetX = 450;
      this.player.targetY = 420;
      this.cameraX = 0;
    }
  }

  // Set Active Care Tool
  setTool(toolName) {
    this.activeTool = toolName;
    const tools = ['soap', 'shower', 'brush', 'ball', 'feed'];
    tools.forEach(t => {
      const btn = document.getElementById(`tool_${t}`);
      if (btn) {
        btn.classList.toggle('active-tool', t === toolName);
      }
    });

    // If feed tool, open quick food drawer
    if (toolName === 'feed') {
      this.openFoodDrawer();
    } else {
      document.getElementById('foodDrawer')?.classList.add('hidden');
    }
  }

  // ==========================================
  // GAME SIMULATION LOOP
  // ==========================================
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // Update physics, AI, particles
    this.update(dt);

    // Render Canvas
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Move Player towards target
    const dx = this.player.targetX - this.player.x;
    const dy = this.player.targetY - this.player.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      this.player.isWalking = true;
      const moveDist = Math.min(dist, this.player.speed * dt);
      this.player.x += (dx / dist) * moveDist;
      this.player.y += (dy / dist) * moveDist;
      this.player.facingRight = dx >= 0;
    } else {
      this.player.isWalking = false;
    }

    // 2. Camera Follows Player in Town (smooth lerp)
    if (this.currentScene === 'town') {
      const desiredCameraX = this.player.x - this.canvas.width / 2;
      const maxCameraX = this.worldWidth - this.canvas.width;
      this.targetCameraX = Math.max(0, Math.min(maxCameraX, desiredCameraX));
      this.cameraX += (this.targetCameraX - this.cameraX) * 0.1;
    } else {
      this.cameraX = 0;
    }

    // 3. Neighbor AI Autonomous Roaming
    this.neighborWanderTimer += dt;
    if (this.neighborWanderTimer > 3.5) {
      this.neighborWanderTimer = 0;
      this.neighbors.forEach(n => {
        // Random chance to wander slightly
        if (Math.random() < 0.6) {
          const wanderOffset = (Math.random() - 0.5) * 120;
          n.position.x = Math.max(100, Math.min(this.worldWidth - 100, n.position.x + wanderOffset));
        }
      });
    }

    // 4. Ball Toy Physics
    if (this.ball.active) {
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      this.ball.vy += 650 * dt; // gravity

      const groundY = 460;
      if (this.ball.y >= groundY) {
        this.ball.y = groundY;
        this.ball.vy = -this.ball.vy * 0.65;
        this.ball.vx *= 0.8;
        this.ball.bounces++;
        if (Math.abs(this.ball.vy) < 40 && this.ball.bounces > 4) {
          // Pet chases ball!
          this.player.targetX = this.ball.x;
          this.player.targetY = this.ball.y;
        }
      }

      // If player touches ball
      const dToBall = Math.hypot(this.player.x - this.ball.x, this.player.y - this.ball.y);
      if (dToBall < 35) {
        this.ball.active = false;
        audio.playSqueak();
        this.spawnHearts(this.player.x, this.player.y - 40, 4);
        this.player.stats.happiness = Math.min(100, this.player.stats.happiness + 5);
        this.addCoins(5);
        this.addXP(8);
        this.updateHUD();
      }
    }

    // 5. Update Particles
    // Bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y -= b.vy * dt;
      b.x += Math.sin(b.y * 0.05) * 0.4;
      b.life -= dt;
      if (b.life <= 0) this.bubbles.splice(i, 1);
    }

    // Hearts
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.y -= h.vy * dt;
      h.life -= dt;
      if (h.life <= 0) this.hearts.splice(i, 1);
    }

    // Coins Float
    for (let i = this.coinsFloat.length - 1; i >= 0; i--) {
      const c = this.coinsFloat[i];
      c.y -= 35 * dt;
      c.life -= dt;
      if (c.life <= 0) this.coinsFloat.splice(i, 1);
    }

    // Update ambient renderer particles
    this.renderer.update(dt);
  }

  // ==========================================
  // RENDER PIPELINE
  // ==========================================
  render() {
    this.renderer.clear(this.canvas.width, this.canvas.height);

    // 1. Draw Background & Scene Environment
    if (this.currentScene === 'town') {
      this.renderer.drawTown(this.cameraX, this.worldWidth, this.canvas.width, this.canvas.height);
    } else {
      this.renderer.drawHome(this.roomTheme, this.cameraX);
    }

    // 2. Draw Placed Buildings & Furniture
    const objects = (this.currentScene === 'town') ? this.townObjects : this.homeObjects;
    // Sort by Y for depth layering
    const sortedObjects = [...objects].sort((a, b) => (a.y + a.height) - (b.y + b.height));

    const ctx = this.renderer.ctx;
    ctx.save();
    if (this.currentScene === 'town') {
      ctx.translate(-this.cameraX, 0);
    }

    // Draw objects behind player
    sortedObjects.forEach(obj => {
      const isHovered = (this.buildMode && this.isMouseOver(obj));
      const isSelected = (this.draggedObject === obj);
      this.renderer.drawObject(obj, obj.x, obj.y, isHovered, isSelected);
    });

    // 3. Draw Neighbor Pets in Town
    if (this.currentScene === 'town') {
      this.neighbors.forEach(n => {
        this.renderer.drawPet(n, n.position.x, n.position.y, 0.88, false, true);

        // Draw cute name tag over neighbor
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        this.renderer.roundRect(n.position.x - 45, n.position.y - 75, 90, 20, 6, true, false);
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#4a4e69';
        ctx.textAlign = 'center';
        ctx.fillText(n.name.split(' ')[0], n.position.x, n.position.y - 61);
      });
    }

    // 4. Draw Player Pet
    this.renderer.drawPet(
      this.player,
      this.player.x,
      this.player.y,
      1,
      this.player.isWalking,
      this.player.facingRight,
      this.player.customAction
    );

    // Player Name Tag
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.renderer.roundRect(this.player.x - 40, this.player.y - 82, 80, 20, 6, true, false);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#ff70a6';
    ctx.textAlign = 'center';
    ctx.fillText(this.player.name.split(' ')[0], this.player.x, this.player.y - 68);

    // 5. Draw Toy Ball
    if (this.ball.active) {
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      ctx.fill();
      // Beach ball stripes
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Draw Particles (Bubbles, Hearts, Coin texts)
    this.bubbles.forEach(b => this.renderer.drawBubble(b));
    this.hearts.forEach(h => this.renderer.drawHeart(h));
    this.coinsFloat.forEach(c => this.renderer.drawCoinFloat(c));

    // 7. Build Mode Grid Overlay
    if (this.buildMode) {
      this.drawBuildGrid();
    }

    ctx.restore();
  }

  // Draw Grid Overlay when in Build Mode
  drawBuildGrid() {
    const ctx = this.renderer.ctx;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    const maxX = (this.currentScene === 'town') ? this.worldWidth : this.canvas.width;
    for (let x = 0; x < maxX; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 260);
      ctx.lineTo(x, 560);
      ctx.stroke();
    }
    for (let y = 260; y < 560; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(maxX, y);
      ctx.stroke();
    }

    // If catalog item selected, draw placement ghost
    if (this.selectedBuildItem) {
      const snapX = Math.round(this.mouseWorldPos.x / 20) * 20;
      const snapY = Math.round(this.mouseWorldPos.y / 20) * 20;
      ctx.globalAlpha = 0.65;
      this.renderer.drawObject(this.selectedBuildItem, snapX, snapY, true, true);
      ctx.globalAlpha = 1.0;
    }
  }

  isMouseOver(obj) {
    return (this.mouseWorldPos.x >= obj.x && this.mouseWorldPos.x <= obj.x + obj.width &&
            this.mouseWorldPos.y >= obj.y && this.mouseWorldPos.y <= obj.y + obj.height);
  }

  // ==========================================
  // PET CARE MECHANICS
  // ==========================================
  spawnBubbles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        x: x + (Math.random() - 0.5) * 35,
        y: y + (Math.random() - 0.5) * 35,
        radius: 7 + Math.random() * 8,
        vy: 20 + Math.random() * 25,
        life: 4.5
      });
    }
  }

  rinseBubbles() {
    if (this.bubbles.length > 0) {
      this.bubbles = [];
      this.spawnHearts(this.player.x, this.player.y - 40, 5);
      this.addCoins(10);
      this.addXP(15);
      this.player.stats.hygiene = 100;
      this.player.stats.happiness = Math.min(100, this.player.stats.happiness + 10);
      this.updateHUD();
      this.saveState();
    }
  }

  spawnHearts(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      this.hearts.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 30,
        size: 16 + Math.random() * 10,
        vy: 40 + Math.random() * 30,
        life: 1.5
      });
    }
  }

  tossBall(targetX, targetY) {
    audio.playPop(750);
    this.ball.active = true;
    this.ball.x = this.player.x;
    this.ball.y = this.player.y - 20;
    this.ball.vx = (targetX - this.player.x) * 2.2;
    this.ball.vy = -320;
    this.ball.bounces = 0;
  }

  feedPlayerPet(foodItem) {
    audio.playChew();
    this.spawnHearts(this.player.x, this.player.y - 35, 4);
    this.player.stats.hunger = Math.min(100, this.player.stats.hunger + foodItem.hunger);
    this.player.stats.happiness = Math.min(100, this.player.stats.happiness + foodItem.happy);
    this.addXP(10);
    this.addCoins(5);

    // Reduce food count in inventory
    const invFood = this.inventory.foods.find(f => f.id === foodItem.id);
    if (invFood) {
      invFood.count--;
      if (invFood.count <= 0) {
        this.inventory.foods = this.inventory.foods.filter(f => f.id !== foodItem.id);
        this.selectedFood = null;
      }
    }
    this.updateHUD();
    this.openFoodDrawer();
    this.saveState();
  }

  // Fruit Tree Shake
  shakeTree(treeObj) {
    audio.playSqueak();
    this.addCoins(15);
    this.addXP(10);
    this.spawnHearts(treeObj.x + treeObj.width / 2, treeObj.y + 40, 4);
    // Add apple to food inventory
    let apple = this.inventory.foods.find(f => f.id === 'food_carrot');
    if (apple) apple.count += 1;
    this.updateHUD();
    this.saveState();
  }

  // Fountain Wish
  wishFountain(fountainObj) {
    if (this.player.coins < 5) return;
    this.player.coins -= 5;
    audio.playCoin();
    this.spawnHearts(fountainObj.x + fountainObj.width / 2, fountainObj.y + 30, 5);
    // Chance for bonus prize!
    const winBonus = Math.random() < 0.5;
    if (winBonus) {
      setTimeout(() => {
        audio.playFanfare();
        this.addCoins(25);
        this.addXP(20);
      }, 600);
    }
    this.updateHUD();
  }

  // ==========================================
  // ECONOMY & XP SYSTEM
  // ==========================================
  addCoins(amount) {
    this.player.coins += amount;
    audio.playCoin();
    this.coinsFloat.push({
      x: this.player.x,
      y: this.player.y - 60,
      amount: amount,
      life: 1.2
    });
    this.updateHUD();
  }

  addXP(amount) {
    this.player.xp += amount;
    if (this.player.xp >= this.player.maxXp) {
      this.player.level++;
      this.player.xp -= this.player.maxXp;
      this.player.maxXp = Math.floor(this.player.maxXp * 1.35);
      audio.playFanfare();
      this.spawnHearts(this.player.x, this.player.y - 50, 8);
      alert(`🎉 Level Up! นาเดียเลเวล ${this.player.level} แล้ว! ได้รับรางวัล 100 เหรียญทอง!`);
      this.player.coins += 100;
    }
    this.updateHUD();
  }

  updateHUD() {
    // Avatar Icon based on species
    const speciesIcons = {
      bunny: '🐰',
      seal: '🦭',
      cat: '🐱',
      dog: '🐶',
      bear: '🐻',
      penguin: '🐧',
      panda: '🐼'
    };
    const elAvatar = document.getElementById('hudAvatar');
    if (elAvatar) elAvatar.innerText = speciesIcons[this.player.species] || '🐾';

    // Coins & Cash
    const elCoins = document.getElementById('hudCoins');
    const elCash = document.getElementById('hudCash');
    const elLevel = document.getElementById('hudLevel');
    const elPetName = document.getElementById('hudPetName');
    const elXpBar = document.getElementById('hudXpBar');

    if (elCoins) elCoins.innerText = this.player.coins;
    if (elCash) elCash.innerText = this.player.cash;
    if (elLevel) elLevel.innerText = `Lv. ${this.player.level}`;
    if (elPetName) elPetName.innerText = this.player.name;
    if (elXpBar) {
      const pct = Math.floor((this.player.xp / this.player.maxXp) * 100);
      elXpBar.style.width = `${pct}%`;
    }

    // Care Status Bars
    const meters = ['happiness', 'hunger', 'hygiene', 'energy'];
    meters.forEach(m => {
      const bar = document.getElementById(`bar_${m}`);
      const val = document.getElementById(`val_${m}`);
      const statVal = Math.round(this.player.stats[m]);
      if (bar) bar.style.width = `${statVal}%`;
      if (val) val.innerText = `${statVal}%`;
    });
  }

  // ==========================================
  // THE SIMS BUILD MODE & TOWN DECORATING
  // ==========================================
  toggleBuildMode() {
    this.buildMode = !this.buildMode;
    const btn = document.getElementById('btnToggleBuild');
    const catalog = document.getElementById('buildCatalogDrawer');

    if (btn) btn.classList.toggle('active-mode', this.buildMode);
    if (catalog) catalog.classList.toggle('hidden', !this.buildMode);

    if (this.buildMode) {
      this.renderBuildCatalog('all');
      this.setTool(null);
    } else {
      this.selectedBuildItem = null;
      this.saveState();
    }
  }

  renderBuildCatalog(category = 'all') {
    const container = document.getElementById('buildCatalogList');
    if (!container) return;
    container.innerHTML = '';

    const items = GAME_DATA.buildingCatalog.filter(i => {
      if (this.currentScene === 'town') {
        return i.category === 'building' || i.category === 'nature' || i.category === 'decor';
      } else {
        return i.category === 'furniture';
      }
    });

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'catalog-card';
      div.innerHTML = `
        <div class="catalog-icon">${item.icon}</div>
        <div class="catalog-name">${item.name}</div>
        <div class="catalog-price">🪙 ${item.price}</div>
      `;
      div.addEventListener('click', () => {
        audio.playPop(600);
        this.selectedBuildItem = item;
        // Highlight selected card
        document.querySelectorAll('.catalog-card').forEach(c => c.classList.remove('selected'));
        div.classList.add('selected');
      });
      container.appendChild(div);
    });
  }

  placeNewObject(item, x, y) {
    if (this.player.coins < item.price) {
      alert('เหรียญทองไม่พอจ้า! ไปเล่นกับเพื่อนๆ หรือเขย่าต้นไม้หาเหรียญก่อนนะ!');
      return;
    }

    this.player.coins -= item.price;
    audio.playFanfare();

    const newObj = {
      id: item.id,
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      width: item.width,
      height: item.height
    };

    if (this.currentScene === 'town') {
      this.townObjects.push(newObj);
    } else {
      this.homeObjects.push(newObj);
    }

    this.selectedBuildItem = null;
    document.querySelectorAll('.catalog-card').forEach(c => c.classList.remove('selected'));
    this.updateHUD();
    this.saveState();
  }

  // ==========================================
  // WARDROBE & DRESS-UP SYSTEM
  // ==========================================
  openWardrobeModal() {
    const modal = document.getElementById('wardrobeModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.renderWardrobeItems('all');
    this.renderWardrobePreview();
  }

  renderWardrobeItems(slotFilter = 'all') {
    const list = document.getElementById('wardrobeItemList');
    if (!list) return;
    list.innerHTML = '';

    const availableClothes = GAME_DATA.clothes.filter(c => {
      if (slotFilter !== 'all' && c.slot !== slotFilter) return false;
      return true;
    });

    availableClothes.forEach(cloth => {
      const isOwned = this.inventory.clothes.includes(cloth.id);
      const isEquipped = (this.player.clothes[cloth.slot] === cloth.id);

      const div = document.createElement('div');
      div.className = `wardrobe-item-card ${isEquipped ? 'equipped' : ''}`;
      div.innerHTML = `
        <div class="item-icon">${cloth.icon}</div>
        <div class="item-name">${cloth.name}</div>
        <div class="item-status">${isEquipped ? 'สวมใส่อยู่ ✨' : (isOwned ? 'มีแล้ว' : `🪙 ${cloth.price}`)}</div>
      `;

      div.addEventListener('click', () => {
        audio.playPop(620);
        if (isEquipped) {
          // Unequip
          this.player.clothes[cloth.slot] = null;
        } else if (isOwned) {
          // Equip
          this.player.clothes[cloth.slot] = cloth.id;
        } else {
          // Buy and Equip
          if (this.player.coins >= cloth.price) {
            this.player.coins -= cloth.price;
            this.inventory.clothes.push(cloth.id);
            this.player.clothes[cloth.slot] = cloth.id;
            audio.playCoin();
          } else {
            alert('เหรียญทองไม่พอจ้า!');
            return;
          }
        }
        this.updateHUD();
        this.renderWardrobeItems(slotFilter);
        this.renderWardrobePreview();
        this.saveState();
      });

      list.appendChild(div);
    });
  }

  renderWardrobePreview() {
    const pCanvas = document.getElementById('wardrobePreviewCanvas');
    if (!pCanvas) return;
    const pCtx = pCanvas.getContext('2d');
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    // Draw preview pet in center of dressing mirror
    const prevRenderer = new GameRenderer(pCanvas);
    prevRenderer.drawPet(this.player, pCanvas.width / 2, pCanvas.height / 2 + 30, 1.35, false, true);
  }

  // ==========================================
  // PET STYLIST & SPECIES CUSTOMIZER
  // ==========================================
  openStylistModal() {
    const modal = document.getElementById('stylistModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    // Species Selector
    const speciesContainer = document.getElementById('speciesChoiceList');
    if (speciesContainer) {
      speciesContainer.innerHTML = '';
      Object.values(GAME_DATA.species).forEach(sp => {
        const btn = document.createElement('button');
        btn.className = `btn-species ${this.player.species === sp.id ? 'active' : ''}`;
        btn.innerText = sp.name;
        btn.addEventListener('click', () => {
          audio.playPop(640);
          this.player.species = sp.id;
          this.player.furColor = sp.defaultColor;
          document.querySelectorAll('.btn-species').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderStylistPreview();
          this.updateHUD();
          this.saveState();
        });
        speciesContainer.appendChild(btn);
      });
    }

    // Color Swatches
    const colorContainer = document.getElementById('colorSwatchList');
    if (colorContainer) {
      colorContainer.innerHTML = '';
      GAME_DATA.furColors.forEach(c => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = c.hex;
        swatch.title = c.name;
        swatch.addEventListener('click', () => {
          audio.playPop(560);
          this.player.furColor = c.hex;
          this.renderStylistPreview();
          this.saveState();
        });
        colorContainer.appendChild(swatch);
      });
    }

    // Eye Shape Selector
    const eyeContainer = document.getElementById('eyeShapeList');
    if (eyeContainer) {
      eyeContainer.innerHTML = '';
      GAME_DATA.eyeShapes.forEach(e => {
        const btn = document.createElement('button');
        btn.className = `btn-stylist-opt ${this.player.eyeShape === e.id ? 'active' : ''}`;
        btn.innerText = e.name;
        btn.addEventListener('click', () => {
          audio.playPop(580);
          this.player.eyeShape = e.id;
          this.renderStylistPreview();
          this.saveState();
        });
        eyeContainer.appendChild(btn);
      });
    }

    // Blush Selector
    const blushContainer = document.getElementById('blushStyleList');
    if (blushContainer) {
      blushContainer.innerHTML = '';
      GAME_DATA.blushStyles.forEach(b => {
        const btn = document.createElement('button');
        btn.className = `btn-stylist-opt ${this.player.blush === b.id ? 'active' : ''}`;
        btn.innerText = b.name;
        btn.addEventListener('click', () => {
          audio.playPop(580);
          this.player.blush = b.id;
          this.renderStylistPreview();
          this.saveState();
        });
        blushContainer.appendChild(btn);
      });
    }

    this.renderStylistPreview();
  }

  renderStylistPreview() {
    const sCanvas = document.getElementById('stylistPreviewCanvas');
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
    const prevRenderer = new GameRenderer(sCanvas);
    prevRenderer.drawPet(this.player, sCanvas.width / 2, sCanvas.height / 2 + 25, 1.4, false, true);
  }

  // ==========================================
  // NEIGHBOR SOCIAL INTERACTIONS (THE SIMS STYLE!)
  // ==========================================
  openNeighborModal(neighbor) {
    this.activeNeighbor = neighbor;
    const modal = document.getElementById('neighborModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    document.getElementById('neighborName').innerText = neighbor.name;
    document.getElementById('neighborTitle').innerText = neighbor.title;
    document.getElementById('neighborQuote').innerText = `"${neighbor.quotes[0]}"`;

    // Draw neighbor portrait
    const nCanvas = document.getElementById('neighborPortraitCanvas');
    if (nCanvas) {
      const nCtx = nCanvas.getContext('2d');
      nCtx.clearRect(0, 0, nCanvas.width, nCanvas.height);
      const prevRenderer = new GameRenderer(nCanvas);
      prevRenderer.drawPet(neighbor, nCanvas.width / 2, nCanvas.height / 2 + 20, 1.3, false, true);
    }
  }

  interactNeighbor(action) {
    if (!this.activeNeighbor) return;
    const n = this.activeNeighbor;

    if (action === 'chat') {
      const randomQuote = n.quotes[Math.floor(Math.random() * n.quotes.length)];
      document.getElementById('neighborQuote').innerText = `"${randomQuote}"`;
      audio.playSqueak();
      this.spawnHearts(n.position.x, n.position.y - 40, 3);
      this.addXP(8);
      this.addCoins(5);
    } else if (action === 'hug') {
      audio.playHug();
      this.spawnHearts(n.position.x, n.position.y - 40, 6);
      this.spawnHearts(this.player.x, this.player.y - 40, 6);
      this.player.stats.happiness = 100;
      this.addXP(15);
      this.addCoins(10);
      document.getElementById('neighborQuote').innerText = `"${n.name.split(' ')[0]} กอดตอบอย่างอบอุ่น ขนนุ่มฟูจังเลย! ❤️"`;
    } else if (action === 'dance') {
      audio.playFanfare();
      this.player.customAction = 'dance';
      setTimeout(() => { this.player.customAction = null; }, 3000);
      this.spawnHearts(this.player.x, this.player.y - 30, 5);
      this.addXP(12);
      this.addCoins(15);
      document.getElementById('neighborQuote').innerText = `"ว้าววว! สเต็ปแดนซ์น่ารักที่สุดในโลกเลย! 💃🎶"`;
    } else if (action === 'rps') {
      // Launch Rock Paper Scissors mini-game
      this.startRPSMiniGame(n);
    } else if (action === 'treat') {
      // Give favorite food
      const favFood = GAME_DATA.foods.find(f => f.id === GAME_DATA.species[n.species].favFood);
      audio.playChew();
      this.spawnHearts(n.position.x, n.position.y - 40, 8);
      this.addCoins(20);
      this.addXP(25);
      document.getElementById('neighborQuote').innerText = `"โอ้โห! ให้ ${favFood ? favFood.name : 'ขนม'} กับฉันเหรอ! ดีใจที่สุดเลย รักเธอจัง! 💖"`;
    }
    this.updateHUD();
    this.saveState();
  }

  // Rock Paper Scissors Mini-game
  startRPSMiniGame(neighbor) {
    const choices = ['rock', 'paper', 'scissors'];
    const icons = { rock: '✊ ค้อน', paper: '✋ กระดาษ', scissors: '✌️ กรรไกร' };

    const playerChoice = prompt(`เป่ายิ้งฉุบกับ ${neighbor.name}!\nพิมพ์ตัวเลือกของคุณ:\n1: ค้อน ✊\n2: กระดาษ ✋\n3: กรรไกร ✌️\n(หรือพิมพ์ rock / paper / scissors)`);
    if (!playerChoice) return;

    let pMove = 'rock';
    if (playerChoice === '2' || playerChoice.includes('กระดาษ') || playerChoice.toLowerCase() === 'paper') pMove = 'paper';
    if (playerChoice === '3' || playerChoice.includes('กรรไกร') || playerChoice.toLowerCase() === 'scissors') pMove = 'scissors';

    const nMove = choices[Math.floor(Math.random() * choices.length)];

    let result = 'draw';
    if (pMove === nMove) result = 'draw';
    else if (
      (pMove === 'rock' && nMove === 'scissors') ||
      (pMove === 'paper' && nMove === 'rock') ||
      (pMove === 'scissors' && nMove === 'paper')
    ) {
      result = 'win';
    } else {
      result = 'lose';
    }

    if (result === 'win') {
      audio.playFanfare();
      this.addCoins(30);
      this.addXP(25);
      alert(`🎉 คุณออก: ${icons[pMove]}\n${neighbor.name} ออก: ${icons[nMove]}\n\n✨ คุณชนะแล้ว! ได้รับ 30 เหรียญทอง!`);
    } else if (result === 'draw') {
      audio.playPop(500);
      this.addCoins(10);
      alert(`🤝 คุณออก: ${icons[pMove]}\n${neighbor.name} ออก: ${icons[nMove]}\n\nเสมอจ้า! แบ่งกันคนละ 10 เหรียญ!`);
    } else {
      audio.playPop(300);
      alert(`😅 คุณออก: ${icons[pMove]}\n${neighbor.name} ออก: ${icons[nMove]}\n\n${neighbor.name} ชนะรอบนี้! ไว้มาแก้มือใหม่นะ!`);
    }
  }

  // ==========================================
  // FOOD DRAWER
  // ==========================================
  openFoodDrawer() {
    const drawer = document.getElementById('foodDrawer');
    const list = document.getElementById('foodDrawerList');
    if (!drawer || !list) return;
    drawer.classList.remove('hidden');
    list.innerHTML = '';

    if (this.inventory.foods.length === 0) {
      list.innerHTML = '<div style="padding:10px;color:#888;">ไม่มีอาหารเหลือแล้ว แวะซื้อที่ร้านเบเกอรี่นะ!</div>';
      return;
    }

    this.inventory.foods.forEach(f => {
      const foodData = GAME_DATA.foods.find(item => item.id === f.id);
      if (!foodData) return;
      const card = document.createElement('div');
      card.className = `food-card ${this.selectedFood && this.selectedFood.id === f.id ? 'active' : ''}`;
      card.innerHTML = `
        <div class="food-icon">${foodData.icon}</div>
        <div class="food-count">x${f.count}</div>
        <div class="food-name">${foodData.name.split(' ')[0]}</div>
      `;
      card.addEventListener('click', () => {
        audio.playPop(600);
        this.selectedFood = foodData;
        document.querySelectorAll('.food-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
      list.appendChild(card);
    });

    if (!this.selectedFood && this.inventory.foods.length > 0) {
      this.selectedFood = GAME_DATA.foods.find(i => i.id === this.inventory.foods[0].id);
    }
  }

  // Shop Modals (Bakery & Boutique)
  openShopModal(shopType) {
    audio.playPop(680);
    if (shopType === 'bakery') {
      const promptText = GAME_DATA.foods.map((f, i) => `${i + 1}. ${f.icon} ${f.name} - 🪙 ${f.price}`).join('\n');
      const pick = prompt(`🧁 ยินดีต้อนรับสู่ Bubbles' Bakery!\nเลือกอาหารที่ต้องการซื้อ (พิมพ์หมายเลข 1-${GAME_DATA.foods.length}):\n\n${promptText}`);
      if (!pick) return;
      const idx = parseInt(pick) - 1;
      const item = GAME_DATA.foods[idx];
      if (item) {
        if (this.player.coins >= item.price) {
          this.player.coins -= item.price;
          audio.playCoin();
          let inv = this.inventory.foods.find(f => f.id === item.id);
          if (inv) inv.count += 1;
          else this.inventory.foods.push({ id: item.id, count: 1 });
          alert(`ซื้อ ${item.name} สำเร็จ! อร่อยแน่นอน!`);
          this.updateHUD();
          this.saveState();
        } else {
          alert('เหรียญทองไม่พอจ้า!');
        }
      }
    } else if (shopType === 'boutique') {
      this.openWardrobeModal();
    }
  }
}

// Global game instance handle
let gameInstance = null;
window.addEventListener('DOMContentLoaded', () => {
  gameInstance = new NadiaPetGame();
});
