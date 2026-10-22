// ==========================================
// NadiaPlayground: Pet Society Canvas Renderer
// Authentic Pet Society Vector Drawing Engine
// ==========================================

class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
    this.blossomPetals = [];

    // Init ambient blossom petals for the town
    for (let i = 0; i < 24; i++) {
      this.blossomPetals.push({
        x: Math.random() * 2000,
        y: Math.random() * 800,
        size: 5 + Math.random() * 6,
        speedX: 0.6 + Math.random() * 0.8,
        speedY: 0.4 + Math.random() * 0.6,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.02 + Math.random() * 0.03
      });
    }
  }

  // Clear Canvas
  clear(width, height) {
    this.ctx.clearRect(0, 0, width, height);
  }

  // Update animated ambient particles
  update(dt) {
    this.time += dt;
    this.blossomPetals.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      if (p.x > 2100) p.x = -50;
      if (p.y > 700) p.y = -20;
    });
  }

  // -------------------------------------------------------------
  // DRAW SCENE: HOME INTERIOR
  // -------------------------------------------------------------
  drawHome(sceneState, cameraX = 0) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Room Wall
    const wallY = 0;
    const wallH = h * 0.62;
    const floorY = wallH;
    const floorH = h - wallH;

    // Wallpaper Pattern
    ctx.fillStyle = sceneState.wallpaper?.colorA || '#fff0f3';
    ctx.fillRect(0, wallY, w, wallH);

    // Wallpaper stripes or pattern
    ctx.fillStyle = sceneState.wallpaper?.colorB || '#ffccd5';
    for (let x = 0; x < w; x += 40) {
      ctx.fillRect(x, 0, 20, wallH);
    }

    // Baseboard moulding
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, wallH - 16, w, 16);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, wallH - 4, w, 4);

    // Floor
    ctx.fillStyle = sceneState.flooring?.colorA || '#ddb892';
    ctx.fillRect(0, floorY, w, floorH);

    // Floor wood planks or tiles
    ctx.strokeStyle = sceneState.flooring?.colorB || '#b08968';
    ctx.lineWidth = 1.5;
    for (let y = floorY; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Windows with sky and sun
    this.drawWindow(120, 70, 110, 140);
    this.drawWindow(w - 230, 70, 110, 140);

    // Wall Clock
    this.drawWallClock(w / 2, 80);
  }

  drawWindow(x, y, w, h) {
    const ctx = this.ctx;
    // Window Frame
    ctx.fillStyle = '#ffffff';
    this.roundRect(x - 8, y - 8, w + 16, h + 16, 12, true, false);

    // Sky inside window
    const skyGrad = ctx.createLinearGradient(x, y, x, y + h);
    skyGrad.addColorStop(0, '#bde0fe');
    skyGrad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = skyGrad;
    this.roundRect(x, y, w, h, 8, true, false);

    // Cute cloud in window
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 35, y + 45, 14, 0, Math.PI * 2);
    ctx.arc(x + 55, y + 40, 18, 0, Math.PI * 2);
    ctx.arc(x + 75, y + 45, 14, 0, Math.PI * 2);
    ctx.fill();

    // Window Panes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();

    // Cute Curtains
    ctx.fillStyle = '#ffb5a7';
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.bezierCurveTo(x + 20, y + 30, x + 5, y + 80, x - 6, y + h);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w + 6, y);
    ctx.bezierCurveTo(x + w - 20, y + 30, x + w - 5, y + 80, x + w + 6, y + h);
    ctx.fill();
  }

  drawWallClock(x, y) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Clock hands
    ctx.strokeStyle = '#4a4e69';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y - 10);
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y + 12);
    ctx.stroke();

    // Clock ears (bunny clock ears!)
    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.ellipse(x - 14, y - 32, 7, 16, -0.2, 0, Math.PI * 2);
    ctx.ellipse(x + 14, y - 32, 7, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // -------------------------------------------------------------
  // DRAW SCENE: OPEN WORLD TOWN
  // -------------------------------------------------------------
  drawTown(cameraX, worldWidth = 2000, canvasW = 900, canvasH = 600) {
    const ctx = this.ctx;
    const h = canvasH;

    // Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    sky.addColorStop(0, '#cce3de');
    sky.addColorStop(0.5, '#eaf4f4');
    sky.addColorStop(1, '#f6fff8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvasW, h);

    // Sun with soft halo
    ctx.fillStyle = 'rgba(255, 230, 109, 0.35)';
    ctx.beginPath();
    ctx.arc(220 - cameraX * 0.1, 90, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe66d';
    ctx.beginPath();
    ctx.arc(220 - cameraX * 0.1, 90, 36, 0, Math.PI * 2);
    ctx.fill();

    // Background rolling hills (Parallax)
    ctx.save();
    ctx.translate(-cameraX * 0.2, 0);
    ctx.fillStyle = '#b7e4c7';
    ctx.beginPath();
    ctx.moveTo(-100, h * 0.6);
    for (let x = -100; x < worldWidth + 200; x += 300) {
      ctx.quadraticCurveTo(x + 150, h * 0.42, x + 300, h * 0.6);
    }
    ctx.lineTo(worldWidth + 200, h);
    ctx.lineTo(-100, h);
    ctx.fill();
    ctx.restore();

    // Midground hills with cute pastel houses in background
    ctx.save();
    ctx.translate(-cameraX * 0.5, 0);
    ctx.fillStyle = '#95d5b2';
    ctx.beginPath();
    ctx.moveTo(-100, h * 0.65);
    for (let x = -100; x < worldWidth + 200; x += 260) {
      ctx.quadraticCurveTo(x + 130, h * 0.52, x + 260, h * 0.65);
    }
    ctx.lineTo(worldWidth + 200, h);
    ctx.lineTo(-100, h);
    ctx.fill();
    ctx.restore();

    // Foreground Town Ground (Street & Green Plaza)
    ctx.save();
    ctx.translate(-cameraX, 0);

    const groundY = h * 0.62;
    // Lawn
    ctx.fillStyle = '#74c69d';
    ctx.fillRect(0, groundY, worldWidth, h - groundY);

    // Stone Cobblestone Town Path
    const pathY = groundY + 45;
    const pathH = 140;
    ctx.fillStyle = '#eed7a1';
    ctx.fillRect(0, pathY, worldWidth, pathH);

    // Path Cobblestone texture lines
    ctx.strokeStyle = '#e0c080';
    ctx.lineWidth = 2;
    for (let x = 0; x < worldWidth; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, pathY);
      ctx.lineTo(x + 10, pathY + pathH);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, pathY + 45);
    ctx.lineTo(worldWidth, pathY + 45);
    ctx.moveTo(0, pathY + 95);
    ctx.lineTo(worldWidth, pathY + 95);
    ctx.stroke();

    // Town Road Border Curb
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, pathY - 6, worldWidth, 6);
    ctx.fillRect(0, pathY + pathH, worldWidth, 6);

    // Little flowers on grass
    for (let i = 0; i < worldWidth; i += 75) {
      const fy = groundY + 12 + ((i * 17) % 24);
      ctx.fillStyle = (i % 2 === 0) ? '#ff70a6' : '#ffd166';
      ctx.beginPath();
      ctx.arc(i, fy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(i, fy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Blossom petals blowing in wind
    ctx.fillStyle = 'rgba(255, 182, 193, 0.75)';
    this.blossomPetals.forEach(p => {
      const screenX = p.x - cameraX * 0.8;
      if (screenX >= -20 && screenX <= canvasW + 20) {
        ctx.save();
        ctx.translate(screenX, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }

  // -------------------------------------------------------------
  // DRAW PLACED BUILDINGS & FURNITURE
  // -------------------------------------------------------------
  drawObject(item, x, y, isHovered = false, isSelected = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.beginPath();
    ctx.ellipse(item.width / 2, item.height - 4, item.width * 0.45, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw specific object art
    switch (item.id) {
      case 'town_cottage':
        this.drawCottageArt(item.width, item.height);
        break;
      case 'town_bakery':
        this.drawBakeryArt(item.width, item.height);
        break;
      case 'town_boutique':
        this.drawBoutiqueArt(item.width, item.height);
        break;
      case 'town_windmill':
        this.drawWindmillArt(item.width, item.height);
        break;
      case 'town_fountain':
        this.drawFountainArt(item.width, item.height);
        break;
      case 'town_blossom_tree':
      case 'town_apple_tree':
        this.drawTreeArt(item.width, item.height, item.id === 'town_blossom_tree' ? 'cherry' : 'apple');
        break;
      case 'town_bench':
        this.drawBenchArt(item.width, item.height);
        break;
      case 'town_lamp':
        this.drawLampArt(item.width, item.height);
        break;
      case 'town_gazebo':
        this.drawGazeboArt(item.width, item.height);
        break;
      case 'town_flower_bed':
        this.drawFlowerBedArt(item.width, item.height);
        break;
      case 'town_fence':
        this.drawFenceArt(item.width, item.height);
        break;
      case 'town_stone_path':
        this.drawStonePathArt(item.width, item.height);
        break;
      // Furniture Interior
      case 'furn_sofa':
        this.drawSofaArt(item.width, item.height);
        break;
      case 'furn_bed':
        this.drawBedArt(item.width, item.height);
        break;
      case 'furn_table':
        this.drawTableArt(item.width, item.height);
        break;
      case 'furn_tv':
        this.drawTVArt(item.width, item.height);
        break;
      case 'furn_fridge':
        this.drawFridgeArt(item.width, item.height);
        break;
      case 'furn_tub':
        this.drawTubArt(item.width, item.height);
        break;
      case 'furn_fireplace':
        this.drawFireplaceArt(item.width, item.height);
        break;
      case 'furn_rug':
        this.drawRugArt(item.width, item.height);
        break;
      case 'furn_plant':
        this.drawPlantArt(item.width, item.height);
        break;
      case 'furn_lamp':
        this.drawNightLampArt(item.width, item.height);
        break;
      default:
        this.drawGenericIconObject(item);
    }

    // Selection / Hover Outline (Sims Style)
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#ff4081' : '#00e5ff';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      this.roundRect(-4, -4, item.width + 8, item.height + 8, 8, false, true);
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  // Individual Object Vector Art Renderers
  drawCottageArt(w, h) {
    const ctx = this.ctx;
    // Walls
    ctx.fillStyle = '#ffeedd';
    ctx.strokeStyle = '#e29578';
    ctx.lineWidth = 3;
    this.roundRect(10, 45, w - 20, h - 50, 10, true, true);

    // Roof (Pastel Pink with tiles)
    ctx.fillStyle = '#ff99c8';
    ctx.strokeStyle = '#ff70a6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w + 5, 48);
    ctx.lineTo(-5, 48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cute Chimney with smoke
    ctx.fillStyle = '#e29578';
    ctx.fillRect(w - 38, 12, 18, 26);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(w - 29, 4 + Math.sin(this.time * 2) * 2, 6, 0, Math.PI * 2);
    ctx.arc(w - 24, -8, 8, 0, Math.PI * 2);
    ctx.fill();

    // Door
    ctx.fillStyle = '#83c5be';
    this.roundRect(w / 2 - 16, h - 50, 32, 45, 6, true, true);
    // Door knob
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(w / 2 + 8, h - 28, 3, 0, Math.PI * 2);
    ctx.fill();

    // Window
    ctx.fillStyle = '#ffffff';
    this.roundRect(24, 60, 26, 26, 4, true, true);
    ctx.fillStyle = '#bde0fe';
    ctx.fillRect(26, 62, 22, 22);
    // Flowerbox on window
    ctx.fillStyle = '#ff70a6';
    ctx.fillRect(22, 85, 30, 7);
  }

  drawBakeryArt(w, h) {
    const ctx = this.ctx;
    // Walls
    ctx.fillStyle = '#fff1e6';
    ctx.strokeStyle = '#ddb892';
    ctx.lineWidth = 3;
    this.roundRect(10, 48, w - 20, h - 52, 8, true, true);

    // Awning stripes (Brown & Cream)
    const stripes = 7;
    const stripeW = (w + 10) / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = (i % 2 === 0) ? '#ffb703' : '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-5 + i * stripeW, 45);
      ctx.lineTo(-5 + (i + 1) * stripeW, 45);
      ctx.lineTo(-5 + (i + 1) * stripeW - 4, 66);
      ctx.lineTo(-5 + i * stripeW - 4, 66);
      ctx.closePath();
      ctx.fill();
    }

    // Signboard: Cupcake
    ctx.fillStyle = '#ffffff';
    this.roundRect(w / 2 - 28, 12, 56, 30, 8, true, true);
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧁', w / 2, 34);

    // Glass Display window
    ctx.fillStyle = '#e0fbfc';
    this.roundRect(18, 76, 55, 45, 6, true, true);
    ctx.font = '14px sans-serif';
    ctx.fillText('🥖🥐', 45, 104);

    // Bakery Door
    ctx.fillStyle = '#ddb892';
    this.roundRect(w - 55, 74, 34, h - 78, 6, true, true);
  }

  drawBoutiqueArt(w, h) {
    const ctx = this.ctx;
    // Walls
    ctx.fillStyle = '#fde2e4';
    ctx.strokeStyle = '#ffb5a7';
    ctx.lineWidth = 3;
    this.roundRect(10, 45, w - 20, h - 50, 10, true, true);

    // Roof (Purple / Magenta fashion roof)
    ctx.fillStyle = '#c77dff';
    this.roundRect(0, 20, w, 28, 6, true, false);

    // Ribbon crown on roof
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎀', w / 2, 22);

    // Large glass display window
    ctx.fillStyle = '#ffffff';
    this.roundRect(18, 60, 60, 60, 6, true, true);
    ctx.font = '24px sans-serif';
    ctx.fillText('👗', 48, 100);

    // Door
    ctx.fillStyle = '#e0aaff';
    this.roundRect(w - 50, 60, 34, h - 65, 6, true, true);
  }

  drawWindmillArt(w, h) {
    const ctx = this.ctx;
    // Windmill Tower
    ctx.fillStyle = '#eddcd2';
    ctx.strokeStyle = '#b7b7a4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, h - 10);
    ctx.lineTo(w - 30, h - 10);
    ctx.lineTo(w - 42, 45);
    ctx.lineTo(42, 45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Windmill Cap
    ctx.fillStyle = '#a5a58d';
    ctx.beginPath();
    ctx.arc(w / 2, 45, 24, Math.PI, 0);
    ctx.fill();

    // Rotating Blades
    const centerX = w / 2;
    const centerY = 45;
    const bladeAngle = this.time * 1.5;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(bladeAngle);

    ctx.strokeStyle = '#6b705c';
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(8, -8, 55, 16);
      ctx.strokeRect(8, -8, 55, 16);
    }
    // Center pin
    ctx.fillStyle = '#cb997e';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFountainArt(w, h) {
    const ctx = this.ctx;
    const cx = w / 2;
    const cy = h / 2 + 10;

    // Outer Basin
    ctx.fillStyle = '#ced4da';
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 48, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Water in basin
    ctx.fillStyle = '#48cae4';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 18, 42, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pillar
    ctx.fillStyle = '#dee2e6';
    ctx.fillRect(cx - 8, cy - 20, 16, 38);

    // Upper Basin
    ctx.beginPath();
    ctx.ellipse(cx, cy - 18, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Water jets animated
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    const jetH = 15 + Math.sin(this.time * 6) * 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 22);
    ctx.quadraticCurveTo(cx - 15, cy - 22 - jetH, cx - 24, cy - 10);
    ctx.moveTo(cx, cy - 22);
    ctx.quadraticCurveTo(cx + 15, cy - 22 - jetH, cx + 24, cy - 10);
    ctx.stroke();

    // Cute bunny fountain topper
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawTreeArt(w, h, type = 'cherry') {
    const ctx = this.ctx;
    const cx = w / 2;

    // Trunk
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.moveTo(cx - 10, h - 8);
    ctx.lineTo(cx + 10, h - 8);
    ctx.lineTo(cx + 6, h * 0.45);
    ctx.lineTo(cx - 6, h * 0.45);
    ctx.closePath();
    ctx.fill();

    // Leaves Foliage
    const sway = Math.sin(this.time * 1.8) * 3;
    ctx.fillStyle = (type === 'cherry') ? '#ffb5a7' : '#52b788';

    ctx.beginPath();
    ctx.arc(cx - 18 + sway, h * 0.4, 28, 0, Math.PI * 2);
    ctx.arc(cx + 18 + sway, h * 0.4, 28, 0, Math.PI * 2);
    ctx.arc(cx + sway, h * 0.28, 34, 0, Math.PI * 2);
    ctx.fill();

    // Fruits or Flowers on tree
    if (type === 'apple') {
      ctx.fillStyle = '#e63946';
      const apples = [[cx - 15, h * 0.35], [cx + 15, h * 0.32], [cx, h * 0.46], [cx + 8, h * 0.22]];
      apples.forEach(([ax, ay]) => {
        ctx.beginPath();
        ctx.arc(ax + sway, ay, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.fillStyle = '#ffffff';
      const blossoms = [[cx - 12, h * 0.3], [cx + 14, h * 0.38], [cx - 2, h * 0.44], [cx + 6, h * 0.22]];
      blossoms.forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(bx + sway, by, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  drawBenchArt(w, h) {
    const ctx = this.ctx;
    // Wood slats
    ctx.fillStyle = '#b08968';
    ctx.strokeStyle = '#7f5539';
    ctx.lineWidth = 2.5;

    // Backrest
    this.roundRect(6, 8, w - 12, 14, 4, true, true);
    // Seat
    this.roundRect(4, 24, w - 8, 12, 4, true, true);

    // Legs
    ctx.fillStyle = '#4a4e69';
    ctx.fillRect(10, 36, 6, h - 38);
    ctx.fillRect(w - 16, 36, 6, h - 38);
  }

  drawLampArt(w, h) {
    const ctx = this.ctx;
    const cx = w / 2;
    // Pole
    ctx.fillStyle = '#343a40';
    ctx.fillRect(cx - 3, 25, 6, h - 28);
    // Base
    ctx.fillRect(cx - 12, h - 8, 24, 6);

    // Lantern Glass
    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.arc(cx, 16, 12, 0, Math.PI * 2);
    ctx.fill();

    // Lantern Glow Halo
    ctx.fillStyle = 'rgba(255, 234, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(cx, 16, 28, 0, Math.PI * 2);
    ctx.fill();

    // Lantern Cap
    ctx.fillStyle = '#212529';
    ctx.beginPath();
    ctx.moveTo(cx - 16, 10);
    ctx.lineTo(cx + 16, 10);
    ctx.lineTo(cx, 0);
    ctx.closePath();
    ctx.fill();
  }

  drawGazeboArt(w, h) {
    const ctx = this.ctx;
    // Floor
    ctx.fillStyle = '#f8edeb';
    this.roundRect(10, h - 16, w - 20, 12, 4, true, true);
    // Pillars
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 32, 8, h - 48);
    ctx.fillRect(w - 24, 32, 8, h - 48);
    ctx.fillRect(w / 2 - 4, 32, 8, h - 48);
    // Roof Dome
    ctx.fillStyle = '#ffccd5';
    ctx.beginPath();
    ctx.arc(w / 2, 35, w * 0.45, Math.PI, 0);
    ctx.fill();
  }

  drawFlowerBedArt(w, h) {
    const ctx = this.ctx;
    // Soil bed
    ctx.fillStyle = '#6b4f3a';
    this.roundRect(4, h - 18, w - 8, 14, 6, true, false);

    // Tulips
    const colors = ['#e63946', '#ffb703', '#9d4edd', '#ff70a6'];
    for (let i = 0; i < 4; i++) {
      const tx = 14 + i * 14;
      // Stem
      ctx.strokeStyle = '#55a630';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx, h - 14);
      ctx.lineTo(tx, h - 26);
      ctx.stroke();

      // Flower petal
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(tx, h - 28, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawFenceArt(w, h) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1.5;

    // Cross beams
    ctx.fillRect(0, 14, w, 6);
    ctx.fillRect(0, 26, w, 6);

    // Pickets
    for (let x = 6; x < w; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, h - 6);
      ctx.lineTo(x, 8);
      ctx.lineTo(x + 5, 2);
      ctx.lineTo(x + 10, 8);
      ctx.lineTo(x + 10, h - 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  drawStonePathArt(w, h) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ced4da';
    ctx.beginPath();
    ctx.ellipse(w * 0.35, h * 0.5, 16, 10, 0.2, 0, Math.PI * 2);
    ctx.ellipse(w * 0.75, h * 0.55, 14, 9, -0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Furniture Vector Arts ---
  drawSofaArt(w, h) {
    const ctx = this.ctx;
    // Main cushions
    ctx.fillStyle = '#bde0fe';
    ctx.strokeStyle = '#a2d2ff';
    ctx.lineWidth = 3;
    // Backrest
    this.roundRect(8, 6, w - 16, h - 24, 16, true, true);
    // Seat Cushion
    ctx.fillStyle = '#a2d2ff';
    this.roundRect(12, h - 34, w - 24, 20, 10, true, true);
    // Armrests
    ctx.fillStyle = '#cdb4db';
    this.roundRect(2, 16, 16, h - 22, 8, true, true);
    this.roundRect(w - 18, 16, 16, h - 22, 8, true, true);
  }

  drawBedArt(w, h) {
    const ctx = this.ctx;
    // Wooden Frame
    ctx.fillStyle = '#ddb892';
    this.roundRect(4, 10, w - 8, h - 14, 8, true, false);
    // Mattress & Quilt
    ctx.fillStyle = '#ffafcc';
    this.roundRect(8, 28, w - 16, h - 34, 6, true, false);
    // Folded blanket
    ctx.fillStyle = '#bde0fe';
    this.roundRect(8, h - 32, w - 16, 26, 6, true, false);
    // Pillows
    ctx.fillStyle = '#ffffff';
    this.roundRect(16, 14, 28, 18, 6, true, false);
    this.roundRect(w - 44, 14, 28, 18, 6, true, false);
  }

  drawTableArt(w, h) {
    const ctx = this.ctx;
    // Tabletop
    ctx.fillStyle = '#ffe5d9';
    ctx.strokeStyle = '#d8b4a0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(w / 2, 22, w * 0.44, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Table legs
    ctx.fillStyle = '#d8b4a0';
    ctx.fillRect(w / 2 - 18, 30, 6, h - 34);
    ctx.fillRect(w / 2 + 12, 30, 6, h - 34);

    // Teacup on table
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w / 2 - 6, 12, 12, 9);
    ctx.fillStyle = '#ff70a6';
    ctx.fillRect(w / 2 - 5, 14, 10, 3);
  }

  drawTVArt(w, h) {
    const ctx = this.ctx;
    // TV Body (Cute Cat-ear TV)
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = '#f4a261';
    ctx.lineWidth = 3;
    this.roundRect(8, 16, w - 16, h - 24, 12, true, true);

    // Cat ears
    ctx.beginPath();
    ctx.moveTo(18, 16);
    ctx.lineTo(26, 4);
    ctx.lineTo(34, 16);
    ctx.moveTo(w - 34, 16);
    ctx.lineTo(w - 26, 4);
    ctx.lineTo(w - 18, 16);
    ctx.fill();
    ctx.stroke();

    // Screen
    ctx.fillStyle = '#3a0ca3';
    this.roundRect(16, 24, w - 38, h - 40, 8, true, false);

    // Animated screen broadcast
    ctx.fillStyle = '#4cc9f0';
    ctx.beginPath();
    ctx.arc(36, 42, 6, 0, Math.PI * 2);
    ctx.fill();

    // TV Knobs
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w - 16, 32, 4, 0, Math.PI * 2);
    ctx.arc(w - 16, 44, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFridgeArt(w, h) {
    const ctx = this.ctx;
    // Main body
    ctx.fillStyle = '#b5e2fa';
    ctx.strokeStyle = '#90e0ef';
    ctx.lineWidth = 3;
    this.roundRect(6, 6, w - 12, h - 12, 10, true, true);

    // Freezer line
    ctx.strokeStyle = '#0077b6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, 38);
    ctx.lineTo(w - 6, 38);
    ctx.stroke();

    // Cute handles
    ctx.fillStyle = '#ffffff';
    this.roundRect(w - 16, 18, 4, 12, 2, true, false);
    this.roundRect(w - 16, 46, 4, 20, 2, true, false);

    // Fridge magnet sticker
    ctx.font = '12px sans-serif';
    ctx.fillText('⭐', 14, 26);
  }

  drawTubArt(w, h) {
    const ctx = this.ctx;
    // Porcelain Tub
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ced4da';
    ctx.lineWidth = 3;
    this.roundRect(8, 18, w - 16, h - 28, 16, true, true);

    // Bubbles in Tub
    ctx.fillStyle = 'rgba(162, 210, 255, 0.7)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(20 + i * 12, 24 + Math.sin(this.time * 3 + i) * 3, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gold Clawfoot legs
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(16, h - 12, 8, 8);
    ctx.fillRect(w - 24, h - 12, 8, 8);

    // Shower Faucet
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(w - 22, 2, 6, 20);
  }

  drawFireplaceArt(w, h) {
    const ctx = this.ctx;
    // Brick mantle
    ctx.fillStyle = '#b08968';
    this.roundRect(6, 8, w - 12, h - 16, 6, true, false);

    // Fire pit opening
    ctx.fillStyle = '#212529';
    this.roundRect(18, 30, w - 36, h - 38, 8, true, false);

    // Animated Fire Flame
    const flicker = Math.sin(this.time * 10) * 4;
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 14, h - 14);
    ctx.lineTo(w / 2, h - 34 + flicker);
    ctx.lineTo(w / 2 + 14, h - 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#d90429';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 8, h - 14);
    ctx.lineTo(w / 2, h - 26 + flicker);
    ctx.lineTo(w / 2 + 8, h - 14);
    ctx.closePath();
    ctx.fill();
  }

  drawRugArt(w, h) {
    const ctx = this.ctx;
    // Star or Oval shaped rug
    ctx.fillStyle = '#fde2e4';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w * 0.46, h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPlantArt(w, h) {
    const ctx = this.ctx;
    // Terracotta Pot
    ctx.fillStyle = '#e07a5f';
    this.roundRect(12, h - 28, w - 24, 24, 4, true, false);

    // Large Monstera leaves
    ctx.fillStyle = '#52b788';
    ctx.beginPath();
    ctx.ellipse(w / 2 - 10, h * 0.38, 16, 22, -0.4, 0, Math.PI * 2);
    ctx.ellipse(w / 2 + 10, h * 0.38, 16, 22, 0.4, 0, Math.PI * 2);
    ctx.ellipse(w / 2, h * 0.25, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawNightLampArt(w, h) {
    const ctx = this.ctx;
    // Mushroom Lamp Stem
    ctx.fillStyle = '#ffffff';
    this.roundRect(w / 2 - 6, 26, 12, h - 30, 6, true, false);

    // Mushroom Cap
    ctx.fillStyle = '#ff70a6';
    ctx.beginPath();
    ctx.arc(w / 2, 28, 20, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // White Dots on mushroom
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w / 2 - 8, 20, 3, 0, Math.PI * 2);
    ctx.arc(w / 2 + 8, 20, 3, 0, Math.PI * 2);
    ctx.arc(w / 2, 14, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGenericIconObject(item) {
    const ctx = this.ctx;
    ctx.fillStyle = '#e2e8f0';
    this.roundRect(0, 0, item.width, item.height, 10, true, true);
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.icon || '📦', item.width / 2, item.height / 2 + 10);
  }

  // -------------------------------------------------------------
  // DRAW PET SOCIETY CHARACTER (VECTOR ENGINE)
  // -------------------------------------------------------------
  drawPet(pet, x, y, scale = 1, isWalking = false, facingRight = true, customAction = null) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facingRight ? scale : -scale, scale);

    // Walk bounce & bob
    let bobY = 0;
    let legAngle = 0;
    let armAngle = 0;
    let tilt = 0;

    if (customAction === 'dance') {
      bobY = Math.abs(Math.sin(this.time * 15)) * 14;
      legAngle = Math.sin(this.time * 15) * 0.45;
      armAngle = Math.sin(this.time * 15) * 0.95;
      tilt = Math.sin(this.time * 7.5) * 0.12;
    } else if (customAction === 'hug') {
      bobY = Math.sin(this.time * 4) * 2;
      armAngle = -0.65; // arms wrapped forward around partner!
      tilt = 0.08;
    } else if (customAction === 'rps_shake') {
      bobY = Math.abs(Math.sin(this.time * 18)) * 8;
      armAngle = Math.sin(this.time * 18) * 0.95;
    } else if (customAction === 'rps_win') {
      bobY = Math.abs(Math.sin(this.time * 12)) * 22;
      legAngle = Math.sin(this.time * 12) * 0.5;
      armAngle = 1.15; // hands raised high in triumph!
      tilt = Math.sin(this.time * 6) * 0.1;
    } else if (customAction === 'rps_lose') {
      bobY = 5;
      armAngle = -0.3;
      tilt = 0.16;
    } else if (isWalking) {
      bobY = Math.abs(Math.sin(this.time * 12)) * 6;
      legAngle = Math.sin(this.time * 12) * 0.35;
      armAngle = Math.cos(this.time * 12) * 0.3;
    } else {
      // Idle breathing
      bobY = Math.sin(this.time * 3) * 2;
    }

    // Shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
    ctx.ellipse(0, 52, 34, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Offset entire pet by bobY and tilt
    ctx.translate(0, -bobY);
    ctx.rotate(tilt);

    const species = GAME_DATA.species[pet.species] || GAME_DATA.species.bunny;
    const fur = pet.furColor || species.defaultColor;

    // 1. BACK TAIL
    this.drawPetTail(species, fur);

    // 2. BACK EARS (for bunny / cat / bear / dog)
    this.drawPetEars(pet, species, fur);

    // 3. BODY & LEGS
    this.drawPetBody(pet, species, fur, legAngle);

    // 4. CLOTHES - BODY (Dresses, sweaters, hoodies, tuxedo)
    if (pet.clothes && pet.clothes.body) {
      this.drawPetOutfit(pet.clothes.body);
    }

    // 5. SHOES
    if (pet.clothes && pet.clothes.shoes) {
      this.drawPetShoes(pet.clothes.shoes, legAngle);
    }

    // 6. HEAD
    this.drawPetHead(pet, species, fur);

    // 7. FACIAL FEATURES (Eyes, blush, nose, mouth)
    this.drawPetFace(pet, species, customAction);

    // 8. ACCESSORIES: GLASSES / FACE DECAL
    if (pet.clothes && pet.clothes.face) {
      this.drawPetGlasses(pet.clothes.face);
    }

    // 9. NECK ACCESSORY (Collar, scarf, bowtie)
    if (pet.clothes && pet.clothes.neck) {
      this.drawPetNeckwear(pet.clothes.neck);
    }

    // 10. HEADWEAR (Hats, ribbons, crowns, berets)
    if (pet.clothes && pet.clothes.head) {
      this.drawPetHeadwear(pet.clothes.head);
    }

    // 11. FRONT ARMS / FLIPPERS & HELD PROPS
    this.drawPetArmsAndProp(pet, species, fur, armAngle);

    // 12. DYNAMIC ACTION EFFECTS & OVERHEAD BALLOONS
    if (pet.rpsMove) {
      this.drawRpsBubble(pet.rpsMove);
    } else if (customAction === 'dance') {
      this.drawDanceNotes();
    } else if (customAction === 'rps_lose') {
      this.drawSweatDrop();
    } else if (customAction === 'rps_win') {
      this.drawVictorySparkles();
    }

    ctx.restore();
  }

  drawRpsBubble(move) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(0, -78);
    const icons = { rock: '✊', paper: '✋', scissors: '✌️' };
    const emoji = icons[move] || '✊';

    // Speech bubble background
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#4a4e69';
    ctx.lineWidth = 2.5;
    this.roundRect(-24, -24, 48, 44, 12, true, true);

    // Bubble pointer tail
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-6, 20);
    ctx.lineTo(6, 20);
    ctx.lineTo(0, 27);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillRect(-5, 18, 10, 4);

    // Big Emoji
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, 0, 8);
    ctx.restore();
  }

  drawDanceNotes() {
    const ctx = this.ctx;
    const offset1 = Math.sin(this.time * 6) * 5;
    const offset2 = Math.cos(this.time * 6) * 5;
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎵', -28 + offset1, -66 + offset2);
    ctx.fillText('🎶', 28 - offset1, -70 - offset2);
  }

  drawSweatDrop() {
    const ctx = this.ctx;
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💧', 24, -36);
  }

  drawVictorySparkles() {
    const ctx = this.ctx;
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    const s = Math.sin(this.time * 8) * 4;
    ctx.fillText('✨', -28 + s, -72);
    ctx.fillText('👑', 0, -84);
    ctx.fillText('✨', 28 - s, -72);
  }

  // Tail Drawing
  drawPetTail(species, fur) {
    const ctx = this.ctx;
    ctx.fillStyle = fur;
    ctx.strokeStyle = this.darkenColor(fur, 0.3);
    ctx.lineWidth = 2.5;

    if (species.id === 'bunny') {
      // Fluffy puff tail
      ctx.beginPath();
      ctx.arc(-24, 24, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (species.id === 'seal') {
      // Seal flipper tail
      ctx.beginPath();
      ctx.ellipse(-26, 32, 14, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (species.id === 'cat') {
      // Curved cat tail swaying
      const sway = Math.sin(this.time * 4) * 0.2;
      ctx.save();
      ctx.translate(-16, 26);
      ctx.rotate(sway);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-20, 10, -28, -10, -18, -25);
      ctx.lineWidth = 7;
      ctx.strokeStyle = fur;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    } else if (species.id === 'dog') {
      // Wagging tail
      const wag = Math.sin(this.time * 16) * 0.4;
      ctx.save();
      ctx.translate(-16, 22);
      ctx.rotate(wag);
      ctx.beginPath();
      ctx.ellipse(-10, -4, 14, 6, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (species.id === 'bear' || species.id === 'panda') {
      ctx.fillStyle = (species.id === 'panda') ? '#2b2d42' : fur;
      ctx.beginPath();
      ctx.arc(-20, 24, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ears Drawing
  drawPetEars(pet, species, fur) {
    const ctx = this.ctx;
    const stroke = this.darkenColor(fur, 0.3);
    ctx.lineWidth = 2.5;

    if (species.id === 'bunny') {
      // Long floppy or upright bunny ears with sweet inner pink
      const earFlop = Math.sin(this.time * 4) * 2;
      // Left ear
      ctx.fillStyle = fur;
      ctx.strokeStyle = stroke;
      ctx.beginPath();
      ctx.ellipse(-18, -48 + earFlop, 11, 26, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Inner pink
      ctx.fillStyle = '#ffccd5';
      ctx.beginPath();
      ctx.ellipse(-18, -46 + earFlop, 6, 18, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Right ear
      ctx.fillStyle = fur;
      ctx.strokeStyle = stroke;
      ctx.beginPath();
      ctx.ellipse(18, -48 - earFlop, 11, 26, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Inner pink
      ctx.fillStyle = '#ffccd5';
      ctx.beginPath();
      ctx.ellipse(18, -46 - earFlop, 6, 18, 0.15, 0, Math.PI * 2);
      ctx.fill();
    } else if (species.id === 'cat') {
      // Pointy cat ears
      ctx.fillStyle = fur;
      ctx.strokeStyle = stroke;
      // Left ear
      ctx.beginPath();
      ctx.moveTo(-28, -20);
      ctx.lineTo(-32, -45);
      ctx.lineTo(-12, -30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Pink inside
      ctx.fillStyle = '#ffccd5';
      ctx.beginPath();
      ctx.moveTo(-26, -22);
      ctx.lineTo(-29, -39);
      ctx.lineTo(-15, -29);
      ctx.closePath();
      ctx.fill();

      // Right ear
      ctx.fillStyle = fur;
      ctx.beginPath();
      ctx.moveTo(28, -20);
      ctx.lineTo(32, -45);
      ctx.lineTo(12, -30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Pink inside
      ctx.fillStyle = '#ffccd5';
      ctx.beginPath();
      ctx.moveTo(26, -22);
      ctx.lineTo(29, -39);
      ctx.lineTo(15, -29);
      ctx.closePath();
      ctx.fill();
    } else if (species.id === 'bear' || species.id === 'panda') {
      // Round teddy bear ears
      const earColor = (species.id === 'panda') ? '#2b2d42' : fur;
      ctx.fillStyle = earColor;
      ctx.strokeStyle = this.darkenColor(earColor, 0.3);
      // Left
      ctx.beginPath();
      ctx.arc(-26, -30, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Right
      ctx.beginPath();
      ctx.arc(26, -30, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (species.id === 'bear') {
        ctx.fillStyle = '#ffeedd';
        ctx.beginPath();
        ctx.arc(-26, -30, 7, 0, Math.PI * 2);
        ctx.arc(26, -30, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (species.id === 'dog') {
      // Floppy dog ears
      ctx.fillStyle = fur;
      ctx.strokeStyle = stroke;
      ctx.beginPath();
      ctx.ellipse(-26, -18, 10, 18, 0.3, 0, Math.PI * 2);
      ctx.ellipse(26, -18, 10, 18, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Body & Legs
  drawPetBody(pet, species, fur, legAngle = 0) {
    const ctx = this.ctx;
    const stroke = this.darkenColor(fur, 0.3);
    ctx.lineWidth = 2.5;

    // Legs / Feet
    if (species.id === 'seal') {
      // Sleek seal belly
    } else {
      // Paws
      const legColor = (species.id === 'panda') ? '#2b2d42' : fur;
      ctx.fillStyle = legColor;
      ctx.strokeStyle = this.darkenColor(legColor, 0.3);

      // Left foot
      ctx.save();
      ctx.translate(-14, 38);
      ctx.rotate(legAngle);
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Right foot
      ctx.save();
      ctx.translate(14, 38);
      ctx.rotate(-legAngle);
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Chubby Pear Body
    ctx.fillStyle = fur;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.ellipse(0, 20, 25, 23, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Belly patch (White/cream tummy for penguin, panda, cat, bunny)
    if (species.id === 'penguin' || species.id === 'panda' || species.id === 'cat') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 22, 16, 17, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Head Drawing
  drawPetHead(pet, species, fur) {
    const ctx = this.ctx;
    const stroke = this.darkenColor(fur, 0.3);
    ctx.lineWidth = 2.5;

    // Classic Pet Society Head: Chubby rounded oval
    ctx.fillStyle = fur;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.ellipse(0, -12, 34, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Panda Eye Patches
    if (species.id === 'panda') {
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.ellipse(-14, -13, 10, 13, -0.3, 0, Math.PI * 2);
      ctx.ellipse(14, -13, 10, 13, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Face Features (Eyes, Nose, Cheeks, Whiskers)
  drawPetFace(pet, species, customAction = null) {
    const ctx = this.ctx;
    const eyeShape = pet.eyeShape || 'classic';
    const blushStyle = pet.blush || 'circles';

    // Blink calculation: blink every ~4 seconds
    const isBlinking = (Math.sin(this.time * 2) > 0.96);

    // 1. EYES
    if (customAction === 'hug' || customAction === 'dance' || isBlinking || eyeShape === 'happy') {
      // Curved happy closed eyes
      ctx.strokeStyle = '#2b2d42';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-14, -14, 7, 0.8 * Math.PI, 0.2 * Math.PI, false);
      ctx.arc(14, -14, 7, 0.8 * Math.PI, 0.2 * Math.PI, false);
      ctx.stroke();
    } else if (customAction === 'rps_lose') {
      // Comical dizzy > < eyes
      ctx.strokeStyle = '#2b2d42';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-19, -17); ctx.lineTo(-11, -14); ctx.lineTo(-19, -11);
      ctx.moveTo(19, -17); ctx.lineTo(11, -14); ctx.lineTo(19, -11);
      ctx.stroke();
    } else if (customAction === 'rps_win') {
      // Star Sparkle victory eyes
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.arc(-14, -14, 8, 0, Math.PI * 2);
      ctx.arc(14, -14, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', -14, -9);
      ctx.fillText('✦', 14, -9);
    } else if (eyeShape === 'wink') {
      // One wink, one open
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.arc(-14, -14, 7.5, 0, Math.PI * 2);
      ctx.fill();
      // Catchlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-16, -17, 2.5, 0, Math.PI * 2);
      ctx.arc(-12, -12, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Wink right eye
      ctx.strokeStyle = '#2b2d42';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(14, -14, 7, 0.8 * Math.PI, 0.2 * Math.PI, false);
      ctx.stroke();
    } else if (eyeShape === 'sleepy') {
      // Half-closed cozy eyes
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.arc(-14, -13, 7, 0, Math.PI);
      ctx.arc(14, -13, 7, 0, Math.PI);
      ctx.fill();
    } else if (eyeShape === 'anime') {
      // Star Sparkle eyes
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.arc(-14, -14, 8, 0, Math.PI * 2);
      ctx.arc(14, -14, 8, 0, Math.PI * 2);
      ctx.fill();
      // Yellow stars in eyes
      ctx.fillStyle = '#ffd166';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', -14, -10);
      ctx.fillText('✦', 14, -10);
    } else {
      // CLASSIC PET SOCIETY SHINY EYES
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.ellipse(-14, -14, 7.5, 9, 0, 0, Math.PI * 2);
      ctx.ellipse(14, -14, 7.5, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Big glossy white reflections
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-16, -17, 3.2, 0, Math.PI * 2);
      ctx.arc(-12, -11, 1.5, 0, Math.PI * 2);
      ctx.arc(12, -17, 3.2, 0, Math.PI * 2);
      ctx.arc(16, -11, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. CHEEKS / BLUSH
    if (blushStyle === 'circles') {
      ctx.fillStyle = 'rgba(255, 112, 166, 0.45)';
      ctx.beginPath();
      ctx.arc(-22, -6, 6, 0, Math.PI * 2);
      ctx.arc(22, -6, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (blushStyle === 'hearts') {
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('❤️', -22, -2);
      ctx.fillText('❤️', 22, -2);
    } else if (blushStyle === 'stripes') {
      ctx.strokeStyle = '#ff70a6';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-25, -9); ctx.lineTo(-19, -3);
      ctx.moveTo(-22, -9); ctx.lineTo(-16, -3);
      ctx.moveTo(16, -9); ctx.lineTo(22, -3);
      ctx.moveTo(19, -9); ctx.lineTo(25, -3);
      ctx.stroke();
    }

    // 3. SNOUT & NOSE
    if (species.id === 'penguin') {
      // Little orange beak
      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.moveTo(-6, -8);
      ctx.lineTo(6, -8);
      ctx.lineTo(0, -1);
      ctx.closePath();
      ctx.fill();
    } else {
      // Cute nose
      ctx.fillStyle = (species.id === 'seal' || species.id === 'bunny') ? '#ff758f' : '#2b2d42';
      ctx.beginPath();
      ctx.ellipse(0, -8, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mouth (:3 style, smile, or laughing)
      if (customAction === 'rps_win' || customAction === 'dance') {
        ctx.fillStyle = '#ff758f';
        ctx.strokeStyle = '#4a4e69';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -5, 5.5, 0, Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#4a4e69';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-5, -6);
        ctx.quadraticCurveTo(-2, -3, 0, -5);
        ctx.quadraticCurveTo(2, -3, 5, -6);
        ctx.stroke();
      }
    }

    // 4. WHISKERS (Seal & Cat)
    if (species.hasWhiskers) {
      if (species.id === 'seal') {
        // Seal whiskers (cute dots)
        ctx.fillStyle = '#4a4e69';
        ctx.beginPath();
        ctx.arc(-9, -6, 1.2, 0, Math.PI * 2);
        ctx.arc(-13, -7, 1.2, 0, Math.PI * 2);
        ctx.arc(-11, -3, 1.2, 0, Math.PI * 2);
        ctx.arc(9, -6, 1.2, 0, Math.PI * 2);
        ctx.arc(13, -7, 1.2, 0, Math.PI * 2);
        ctx.arc(11, -3, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Cat whiskers
        ctx.strokeStyle = '#4a4e69';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12, -6); ctx.lineTo(-28, -8);
        ctx.moveTo(-12, -3); ctx.lineTo(-27, 0);
        ctx.moveTo(12, -6); ctx.lineTo(28, -8);
        ctx.moveTo(12, -3); ctx.lineTo(27, 0);
        ctx.stroke();
      }
    }
  }

  // Pet Arms & Held Props
  drawPetArmsAndProp(pet, species, fur, armAngle = 0) {
    const ctx = this.ctx;
    const stroke = this.darkenColor(fur, 0.3);
    ctx.lineWidth = 2.5;

    if (species.id === 'seal') {
      // Seal flippers
      ctx.fillStyle = fur;
      ctx.strokeStyle = stroke;
      // Left flipper
      ctx.save();
      ctx.translate(-22, 16);
      ctx.rotate(-armAngle * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 8, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Right flipper
      ctx.save();
      ctx.translate(22, 16);
      ctx.rotate(armAngle * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 8, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      // Regular paws
      const armColor = (species.id === 'panda') ? '#2b2d42' : fur;
      ctx.fillStyle = armColor;
      ctx.strokeStyle = this.darkenColor(armColor, 0.3);

      // Left paw
      ctx.save();
      ctx.translate(-20, 16);
      ctx.rotate(-armAngle);
      ctx.beginPath();
      ctx.ellipse(0, 4, 7, 10, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Right paw
      ctx.save();
      ctx.translate(20, 16);
      ctx.rotate(armAngle);
      ctx.beginPath();
      ctx.ellipse(0, 4, 7, 10, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw Held Prop in right hand
      if (pet.clothes && pet.clothes.hand) {
        this.drawPetProp(pet.clothes.hand);
      }
      ctx.restore();
    }
  }

  // --- Clothing Renderers ---
  drawPetOutfit(outfitId) {
    const ctx = this.ctx;
    const item = GAME_DATA.clothes.find(c => c.id === outfitId);
    if (!item) return;

    if (item.style === 'hoodie') {
      ctx.fillStyle = item.color;
      this.roundRect(-22, 8, 44, 26, 10, true, false);
      // Pocket
      ctx.fillStyle = '#ffffff';
      this.roundRect(-10, 20, 20, 10, 4, true, false);
    } else if (item.style === 'sailor_shirt') {
      ctx.fillStyle = '#ffffff';
      this.roundRect(-22, 8, 44, 26, 8, true, false);
      // Blue sailor collar
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(-16, 8);
      ctx.lineTo(16, 8);
      ctx.lineTo(0, 22);
      ctx.closePath();
      ctx.fill();
      // Red tie
      ctx.fillStyle = '#e63946';
      ctx.fillRect(-3, 14, 6, 8);
    } else if (item.style === 'striped_sweater') {
      ctx.fillStyle = item.color;
      this.roundRect(-22, 8, 44, 26, 8, true, false);
      // Stripes
      ctx.fillStyle = '#e76f51';
      ctx.fillRect(-22, 14, 44, 5);
      ctx.fillRect(-22, 24, 44, 5);
    } else if (item.style === 'frill_dress') {
      ctx.fillStyle = item.color;
      // Dress body
      this.roundRect(-20, 6, 40, 20, 6, true, false);
      // Skirt flare
      ctx.beginPath();
      ctx.moveTo(-20, 24);
      ctx.lineTo(-28, 38);
      ctx.lineTo(28, 38);
      ctx.lineTo(20, 24);
      ctx.closePath();
      ctx.fill();
      // White lace frill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-28, 36, 56, 3);
    } else if (item.style === 'overalls') {
      ctx.fillStyle = item.color;
      this.roundRect(-18, 12, 36, 26, 6, true, false);
      // Straps
      ctx.fillRect(-16, 2, 6, 16);
      ctx.fillRect(10, 2, 6, 16);
      // Yellow buttons
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(-13, 14, 2.5, 0, Math.PI * 2);
      ctx.arc(13, 14, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.style === 'tuxedo') {
      ctx.fillStyle = '#1d3557';
      this.roundRect(-22, 8, 44, 28, 8, true, false);
      // White shirt triangle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(10, 8);
      ctx.lineTo(0, 24);
      ctx.closePath();
      ctx.fill();
      // Red bowtie
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.ellipse(0, 12, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPetShoes(shoeId, legAngle = 0) {
    const ctx = this.ctx;
    const item = GAME_DATA.clothes.find(c => c.id === shoeId);
    if (!item) return;

    ctx.fillStyle = item.color;
    // Left shoe
    ctx.save();
    ctx.translate(-14, 42);
    ctx.rotate(legAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right shoe
    ctx.save();
    ctx.translate(14, 42);
    ctx.rotate(-legAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPetHeadwear(hatId) {
    const ctx = this.ctx;
    const item = GAME_DATA.clothes.find(c => c.id === hatId);
    if (!item) return;

    if (item.style === 'ribbon') {
      ctx.fillStyle = item.color;
      // Bow knot
      ctx.beginPath();
      ctx.arc(20, -38, 5, 0, Math.PI * 2);
      ctx.fill();
      // Bow loops
      ctx.beginPath();
      ctx.ellipse(12, -38, 9, 6, -0.4, 0, Math.PI * 2);
      ctx.ellipse(28, -38, 9, 6, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.style === 'crown') {
      ctx.fillStyle = '#ffd166';
      ctx.strokeStyle = '#f4a261';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-18, -36);
      ctx.lineTo(-14, -50);
      ctx.lineTo(-6, -42);
      ctx.lineTo(0, -53);
      ctx.lineTo(6, -42);
      ctx.lineTo(14, -50);
      ctx.lineTo(18, -36);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Red jewel on center tip
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.arc(0, -42, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.style === 'sailor') {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0077b6';
      ctx.lineWidth = 2;
      this.roundRect(-22, -48, 44, 16, 6, true, true);
      // Blue anchor ribbon
      ctx.fillStyle = '#0077b6';
      ctx.fillRect(-22, -38, 44, 4);
    } else if (item.style === 'beret') {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.ellipse(6, -38, 26, 12, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Little tip
      ctx.fillRect(8, -48, 3, 6);
    } else if (item.style === 'straw') {
      ctx.fillStyle = '#e9d8a6';
      // Brim
      ctx.beginPath();
      ctx.ellipse(0, -36, 36, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      // Crown
      this.roundRect(-18, -50, 36, 18, 8, true, false);
      // Red ribbon band
      ctx.fillStyle = '#ff70a6';
      ctx.fillRect(-18, -38, 36, 5);
    } else if (item.style === 'flower_crown') {
      const colors = ['#f72585', '#7209b7', '#4cc9f0', '#ffd166'];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(-22 + i * 11, -38, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (item.style === 'chef') {
      ctx.fillStyle = '#ffffff';
      this.roundRect(-16, -42, 32, 12, 4, true, false);
      ctx.beginPath();
      ctx.arc(-8, -48, 12, 0, Math.PI * 2);
      ctx.arc(8, -48, 12, 0, Math.PI * 2);
      ctx.arc(0, -56, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPetGlasses(glassId) {
    const ctx = this.ctx;
    const item = GAME_DATA.clothes.find(c => c.id === glassId);
    if (!item) return;

    if (item.style === 'round_glass') {
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2.5;
      // Left rim
      ctx.beginPath();
      ctx.arc(-14, -14, 9, 0, Math.PI * 2);
      ctx.stroke();
      // Right rim
      ctx.beginPath();
      ctx.arc(14, -14, 9, 0, Math.PI * 2);
      ctx.stroke();
      // Bridge
      ctx.beginPath();
      ctx.moveTo(-5, -14);
      ctx.lineTo(5, -14);
      ctx.stroke();
    } else if (item.style === 'heart_glass') {
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🕶️', 0, -8);
    } else if (item.style === 'star_decal') {
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⭐', 22, -18);
    }
  }

  drawPetNeckwear(neckId) {
    const ctx = this.ctx;
    const item = GAME_DATA.clothes.find(c => c.id === neckId);
    if (!item) return;

    if (item.style === 'bell_collar') {
      // Red collar band
      ctx.fillStyle = '#e63946';
      this.roundRect(-18, 4, 36, 5, 2, true, false);
      // Gold bell
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(0, 8, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.style === 'scarf') {
      ctx.fillStyle = item.color;
      this.roundRect(-20, 2, 40, 8, 4, true, false);
      // Dangling scarf end
      ctx.fillRect(8, 6, 8, 18);
    } else if (item.style === 'pearls') {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(-15 + i * 5, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (item.style === 'bowtie') {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.ellipse(-6, 6, 6, 4, -0.2, 0, Math.PI * 2);
      ctx.ellipse(6, 6, 6, 4, 0.2, 0, Math.PI * 2);
      ctx.arc(0, 6, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPetProp(propId) {
    const ctx = this.ctx;
    const item = GAME_DATA.clothes.find(c => c.id === propId);
    if (!item) return;

    ctx.save();
    ctx.translate(6, 4);

    if (item.style === 'icecream') {
      // Cone
      ctx.fillStyle = '#ddb892';
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(5, 0);
      ctx.lineTo(0, 14);
      ctx.closePath();
      ctx.fill();
      // Scoops
      ctx.fillStyle = '#ff70a6';
      ctx.beginPath();
      ctx.arc(0, -4, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#90e0ef';
      ctx.beginPath();
      ctx.arc(0, -12, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.style === 'wand') {
      // Stick
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(10, -14);
      ctx.stroke();
      // Star tip
      ctx.font = '16px sans-serif';
      ctx.fillText('✨', 10, -14);
    } else if (item.style === 'balloon') {
      // String
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(12, -30);
      ctx.stroke();
      // Heart balloon
      ctx.font = '22px sans-serif';
      ctx.fillText('🎈', 10, -30);
    } else if (item.style === 'lollipop') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(0, -6);
      ctx.stroke();
      ctx.font = '18px sans-serif';
      ctx.fillText('🍭', 0, -6);
    } else if (item.style === 'seal_plush') {
      ctx.font = '18px sans-serif';
      ctx.fillText('🦭', 0, 0);
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // DRAW FLOATING PARTICLES & UI EFFECTS
  // -------------------------------------------------------------
  drawBubble(b) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(b.x, b.y);

    // Iridescent Soap Bubble
    const grad = ctx.createRadialGradient(-b.radius * 0.3, -b.radius * 0.3, 1, 0, 0, b.radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.5, 'rgba(162, 210, 255, 0.5)');
    grad.addColorStop(0.85, 'rgba(255, 182, 193, 0.5)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bubble highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-b.radius * 0.4, -b.radius * 0.4, b.radius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHeart(h) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.font = `${Math.floor(h.size)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('💖', 0, 0);
    ctx.restore();
  }

  drawCoinFloat(c) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffb703';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.strokeText(`+${c.amount} 🪙`, 0, 0);
    ctx.fillText(`+${c.amount} 🪙`, 0, 0);
    ctx.restore();
  }

  // Helper: Round Rectangle
  roundRect(x, y, w, h, r, fill, stroke) {
    const ctx = this.ctx;
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  // Helper: Darken Color for strokes
  darkenColor(hex, factor = 0.2) {
    if (!hex || hex[0] !== '#') return '#4a4e69';
    let c = hex.slice(1);
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    let r = (num >> 16) * (1 - factor);
    let g = ((num >> 8) & 0x00FF) * (1 - factor);
    let b = (num & 0x0000FF) * (1 - factor);
    return `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
  }
}
