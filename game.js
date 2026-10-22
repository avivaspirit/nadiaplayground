// ==========================================
// NadiaPlayground: Pet Society Core Game Engine
// Multi-Account Save System (Nadia & Mac)
// ==========================================

const CHAR_ACCOUNTS = {
  nadia: {
    id: 'nadia',
    name: 'Nadia (นาเดีย)',
    password: 'Larny',
    avatar: '🐰',
    title: '👑 Town Princess & Stylist',
    defaultSpecies: 'bunny',
    defaultFur: '#fde2e4',
    defaultEye: 'classic',
    defaultBlush: 'circles',
    defaultClothes: {
      head: 'hat_ribbon',
      body: 'outfit_dress',
      face: null,
      neck: 'neck_bell',
      hand: 'prop_wand',
      shoes: 'shoe_bunny'
    },
    defaultInventory: {
      clothes: ['hat_ribbon', 'outfit_dress', 'shoe_bunny', 'hat_flower', 'outfit_hoodie', 'glass_heart', 'prop_wand', 'prop_icecream'],
      foods: [
        { id: 'food_carrot', count: 5 },
        { id: 'food_cake', count: 3 },
        { id: 'food_tea', count: 4 }
      ],
      furniture: ['town_bench', 'town_flower_bed']
    },
    partnerId: 'mac',
    welcomeMsg: 'ยินดีต้อนรับกลับจ้า Nadia! ขอให้สนุกกับสัตว์เลี้ยงแสนน่ารักนะ! 🌸'
  },
  mac: {
    id: 'mac',
    name: 'Mac (แม็ค)',
    password: 'Macky',
    avatar: '🐻',
    title: '🛠️ Town Mayor & Builder',
    defaultSpecies: 'bear',
    defaultFur: '#ddb892',
    defaultEye: 'classic',
    defaultBlush: 'none',
    defaultClothes: {
      head: 'hat_beret',
      body: 'outfit_hoodie',
      face: 'glass_round',
      neck: 'neck_bowtie',
      hand: 'prop_wand',
      shoes: 'shoe_sneakers'
    },
    defaultInventory: {
      clothes: ['hat_beret', 'outfit_hoodie', 'shoe_sneakers', 'hat_crown', 'outfit_tuxedo', 'glass_round', 'prop_wand', 'hat_sailor'],
      foods: [
        { id: 'food_honey', count: 5 },
        { id: 'food_donut', count: 4 },
        { id: 'food_sushi', count: 3 }
      ],
      furniture: ['town_lamp', 'town_bench']
    },
    partnerId: 'nadia',
    welcomeMsg: 'ยินดีต้อนรับกลับครับ Mac! พร้อมลุยสร้างเมืองสุดเท่กันหรือยัง! 🛠️'
  }
};

class NadiaPetGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.renderer = new GameRenderer(this.canvas);

    // Active User Session ('nadia' or 'mac')
    this.currentUser = localStorage.getItem('petsociety_active_user') || 'nadia';
    this.selectedLoginChar = 'nadia';
    this.isLoggedIn = false;
    this.saveToastTimer = null;

    // Game Scenes: 'town', 'home', 'partner_home'
    this.currentScene = 'town';
    this.worldWidth = 5600;
    this.cameraX = 0;
    this.targetCameraX = 0;
    this.zoom = 1.0;

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
      species: 'bunny',
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
      coins: 500,
      cash: 50,
      level: 1,
      xp: 0,
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

    // Town Layout: Placed Buildings & Nature across 5600px Open World
    this.defaultTownObjects = [
      // ZONE 1: Sweet Village Suburb (0 - 1200)
      { id: 'town_cottage', x: 160, y: 270, width: 140, height: 130 },
      { id: 'town_fence', x: 80, y: 390, width: 60, height: 40 },
      { id: 'town_stone_path', x: 270, y: 440, width: 50, height: 35 },
      { id: 'town_flower_bed', x: 330, y: 380, width: 70, height: 40 },
      { id: 'town_blossom_tree', x: 440, y: 260, width: 90, height: 120 },
      { id: 'town_lamp', x: 540, y: 320, width: 40, height: 100 },
      { id: 'town_cottage', x: 620, y: 270, width: 140, height: 130 },
      { id: 'town_flower_bed', x: 790, y: 380, width: 70, height: 40 },
      { id: 'town_fence', x: 880, y: 390, width: 60, height: 40 },
      { id: 'town_apple_tree', x: 1000, y: 260, width: 85, height: 115 },
      { id: 'town_lamp', x: 1120, y: 320, width: 40, height: 100 },

      // ZONE 2: Shopping Boulevard & Terrace Cafe (1200 - 2400)
      { id: 'town_bakery', x: 1320, y: 260, width: 150, height: 140 },
      { id: 'town_flower_bed', x: 1500, y: 385, width: 70, height: 40 },
      { id: 'town_boutique', x: 1620, y: 260, width: 150, height: 140 },
      { id: 'town_lamp', x: 1800, y: 320, width: 40, height: 100 },
      { id: 'furn_table', x: 1880, y: 350, width: 80, height: 60 },
      { id: 'town_bench', x: 1990, y: 390, width: 70, height: 50 },
      { id: 'town_lamp', x: 2100, y: 320, width: 40, height: 100 },
      { id: 'town_blossom_tree', x: 2220, y: 260, width: 90, height: 120 },

      // ZONE 3: Central Park & Grand Plaza (2400 - 3600)
      { id: 'town_flower_bed', x: 2480, y: 380, width: 70, height: 40 },
      { id: 'town_lamp', x: 2580, y: 320, width: 40, height: 100 },
      { id: 'town_bench', x: 2680, y: 390, width: 70, height: 50 },
      { id: 'town_fountain', x: 2840, y: 340, width: 100, height: 100 },
      { id: 'town_bench', x: 3020, y: 390, width: 70, height: 50 },
      { id: 'town_lamp', x: 3140, y: 320, width: 40, height: 100 },
      { id: 'town_blossom_tree', x: 3240, y: 260, width: 90, height: 120 },
      { id: 'town_gazebo', x: 3380, y: 250, width: 120, height: 140 },
      { id: 'town_apple_tree', x: 3540, y: 260, width: 85, height: 115 },

      // ZONE 4: Sunny Sandy Beach & Marina (3600 - 4700)
      { id: 'town_palm_tree', x: 3720, y: 250, width: 85, height: 130 },
      { id: 'town_beach_umbrella', x: 3850, y: 350, width: 75, height: 85 },
      { id: 'town_palm_tree', x: 4020, y: 250, width: 85, height: 130 },
      { id: 'town_beach_umbrella', x: 4160, y: 350, width: 75, height: 85 },
      { id: 'town_bench', x: 4320, y: 390, width: 70, height: 50 },
      { id: 'town_lighthouse', x: 4460, y: 240, width: 110, height: 160 },

      // ZONE 5: Windmill Meadow & Highland Vista (4700 - 5600)
      { id: 'town_fence', x: 4720, y: 390, width: 60, height: 40 },
      { id: 'town_blossom_tree', x: 4820, y: 260, width: 90, height: 120 },
      { id: 'town_bench', x: 4940, y: 390, width: 70, height: 50 },
      { id: 'town_windmill', x: 5060, y: 240, width: 130, height: 160 },
      { id: 'town_flower_bed', x: 5240, y: 380, width: 70, height: 40 },
      { id: 'town_gazebo', x: 5360, y: 250, width: 120, height: 140 }
    ];
    this.townObjects = JSON.parse(JSON.stringify(this.defaultTownObjects));

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

    // Partner Home Interior (for visiting partner)
    this.partnerHomeObjects = [];
    this.partnerRoomTheme = {
      wallpaper: GAME_DATA.wallpapers[1] || GAME_DATA.wallpapers[0],
      flooring: GAME_DATA.floorings[0]
    };

    // Room themes
    this.roomTheme = {
      wallpaper: GAME_DATA.wallpapers[0],
      flooring: GAME_DATA.floorings[0]
    };

    // Player Inventory
    this.inventory = {
      clothes: ['hat_ribbon', 'outfit_dress', 'shoe_bunny', 'hat_flower', 'outfit_hoodie'],
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

    // Load active profile state
    this.loadState(this.currentUser);

    // Init Event Listeners
    this.initEvents();

    // If first load in session, check if active user was remembered
    const hasSession = sessionStorage.getItem('petsociety_session_active');
    if (!hasSession) {
      setTimeout(() => this.openLoginModal(), 300);
    } else {
      this.isLoggedIn = true;
    }

    // Start Main Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  // ==========================================
  // MULTI-PROFILE SAVE / LOAD SYSTEM
  // ==========================================
  saveState(showToast = false) {
    if (!this.currentUser) return;
    const saveKey = `petsociety_save_${this.currentUser}`;
    const data = {
      user: this.currentUser,
      player: this.player,
      inventory: this.inventory,
      townObjects: this.townObjects,
      homeObjects: this.homeObjects,
      roomTheme: this.roomTheme,
      lastSaved: Date.now()
    };
    try {
      localStorage.setItem(saveKey, JSON.stringify(data));
      // Save public appearance for partner
      localStorage.setItem(`petsociety_public_${this.currentUser}`, JSON.stringify({
        name: this.player.name,
        species: this.player.species,
        furColor: this.player.furColor,
        eyeShape: this.player.eyeShape,
        blush: this.player.blush,
        clothes: this.player.clothes,
        level: this.player.level,
        roomTheme: this.roomTheme,
        homeObjects: this.homeObjects
      }));
      if (showToast) {
        this.showSaveToast('💾 บันทึกข้อมูลเรียบร้อยแล้ว! ✨');
      }
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  loadState(userId) {
    const acc = CHAR_ACCOUNTS[userId] || CHAR_ACCOUNTS.nadia;
    this.currentUser = acc.id;
    const saveKey = `petsociety_save_${this.currentUser}`;
    let loaded = false;

    try {
      const saved = localStorage.getItem(saveKey);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.player) Object.assign(this.player, d.player);
        if (d.inventory) this.inventory = d.inventory;
        if (d.townObjects) {
          const hasLighthouse = d.townObjects.some(o => o.id === 'town_lighthouse');
          if (!hasLighthouse) {
            const newLandmarks = this.defaultTownObjects.filter(o => o.x > 1400);
            this.townObjects = [...d.townObjects, ...newLandmarks];
          } else {
            this.townObjects = d.townObjects;
          }
        }
        if (d.homeObjects) this.homeObjects = d.homeObjects;
        if (d.roomTheme) this.roomTheme = d.roomTheme;
        loaded = true;
      }
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    }

    if (!loaded) {
      // First time initialization for this character
      this.player.name = acc.name;
      this.player.species = acc.defaultSpecies;
      this.player.furColor = acc.defaultFur;
      this.player.eyeShape = acc.defaultEye;
      this.player.blush = acc.defaultBlush;
      this.player.clothes = JSON.parse(JSON.stringify(acc.defaultClothes));
      this.player.coins = 500;
      this.player.cash = 50;
      this.player.level = 1;
      this.player.xp = 0;
      this.player.maxXp = 300;
      this.inventory = JSON.parse(JSON.stringify(acc.defaultInventory));
      this.saveState(false);
    }

    // Setup Partner VIP NPC in town
    this.setupPartnerNPC(acc.partnerId);

    // Update HUD display
    this.updateHUD();
  }

  setupPartnerNPC(partnerId) {
    const partnerAcc = CHAR_ACCOUNTS[partnerId];
    if (!partnerAcc) return;

    let partnerAppearance = {
      species: partnerAcc.defaultSpecies,
      furColor: partnerAcc.defaultFur,
      eyeShape: partnerAcc.defaultEye,
      blush: partnerAcc.defaultBlush,
      clothes: partnerAcc.defaultClothes
    };

    try {
      const pub = localStorage.getItem(`petsociety_public_${partnerId}`);
      if (pub) {
        const pData = JSON.parse(pub);
        if (pData.species) partnerAppearance.species = pData.species;
        if (pData.furColor) partnerAppearance.furColor = pData.furColor;
        if (pData.eyeShape) partnerAppearance.eyeShape = pData.eyeShape;
        if (pData.blush) partnerAppearance.blush = pData.blush;
        if (pData.clothes) partnerAppearance.clothes = pData.clothes;
        if (pData.homeObjects) this.partnerHomeObjects = pData.homeObjects;
        if (pData.roomTheme) this.partnerRoomTheme = pData.roomTheme;
      }
    } catch (e) {}

    // Filter out existing partner NPC
    this.neighbors = this.neighbors.filter(n => !n.isPartner);

    const partnerNPC = {
      id: `npc_partner_${partnerId}`,
      name: partnerAcc.name,
      species: partnerAppearance.species,
      title: partnerAcc.title,
      furColor: partnerAppearance.furColor,
      eyeShape: partnerAppearance.eyeShape,
      blush: partnerAppearance.blush,
      clothes: partnerAppearance.clothes,
      position: { x: 530, y: 405 },
      personality: 'sweet_partner',
      isPartner: true,
      partnerId: partnerId,
      quotes: (partnerId === 'mac') ? [
        'สวัสดีครับ Nadia! วันนี้เมืองสวยและน่ารักมากๆ เลยนะ! 🌸',
        'วันนี้มีไอเดียสร้างตึกใหม่ๆ เยอะเลย เดี๋ยวเค้าช่วยจัดผังเมืองให้นะ! 🛠️',
        'รัก Nadia ที่สุดเลยนะ! กอดกันหน่อยเร็ว! ❤️',
        'แวะไปดูบ้านของเค้าได้นะ ตกแต่งห้องไว้รอเธอมาเที่ยวเลย! 🏡'
      ] : [
        'ว่าไงจ๊ะ Macky! วันนี้แต่งตัวเท่มากเลยนะ! ✨',
        'เค้าเพิ่งเก็บผลไม้สดๆ มาจากต้นไม้ในสวน แบ่งกันกินมั้ย! 🍎',
        'คิดถึง Macky จังเลย! มากอดกันน้า! 💖',
        'อย่าลืมแวะไปเยี่ยมบ้านเค้านะ มีของตกแต่งน่ารักๆ เพียบเลย! 🎀'
      ]
    };

    // Place partner near town center
    this.neighbors.unshift(partnerNPC);
  }

  showSaveToast(msg = '💾 บันทึกข้อมูลเรียบร้อยแล้ว! ✨') {
    const toast = document.getElementById('saveToast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    if (this.saveToastTimer) clearTimeout(this.saveToastTimer);
    this.saveToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // ==========================================
  // LOGIN & CHARACTER SELECTION
  // ==========================================
  selectLoginChar(charId) {
    this.selectedLoginChar = charId;
    const cardNadia = document.getElementById('cardSelectNadia');
    const cardMac = document.getElementById('cardSelectMac');
    const targetName = document.getElementById('loginTargetName');
    const errText = document.getElementById('loginErrorText');
    if (errText) errText.style.display = 'none';

    if (charId === 'nadia') {
      cardNadia?.classList.add('active-nadia');
      cardMac?.classList.remove('active-mac');
      if (targetName) {
        targetName.innerText = 'Nadia';
        targetName.style.color = '#ff70a6';
      }
    } else {
      cardMac?.classList.add('active-mac');
      cardNadia?.classList.remove('active-nadia');
      if (targetName) {
        targetName.innerText = 'Mac';
        targetName.style.color = '#339af0';
      }
    }
    const input = document.getElementById('loginPasswordInput');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  submitLogin() {
    const input = document.getElementById('loginPasswordInput');
    const errText = document.getElementById('loginErrorText');
    const val = input ? input.value.trim() : '';

    const charId = this.selectedLoginChar || 'nadia';
    const acc = CHAR_ACCOUNTS[charId];

    // Password verification:
    // Nadia password: "Larny"
    // Mac password: "Macky"
    if (val.toLowerCase() === acc.password.toLowerCase()) {
      audio.init();
      audio.playFanfare();
      if (errText) errText.style.display = 'none';
      document.getElementById('loginModal')?.classList.add('hidden');
      this.isLoggedIn = true;
      sessionStorage.setItem('petsociety_session_active', 'true');
      localStorage.setItem('petsociety_active_user', charId);
      this.loadState(charId);
      this.showSaveToast(`✨ ยินดีต้อนรับ ${acc.name}!`);
    } else {
      audio.init();
      audio.playPop(300);
      if (errText) {
        errText.innerText = `❌ รหัสผ่านของ ${acc.name} ไม่ถูกต้อง! (Nadia: "Larny" | Mac: "Macky")`;
        errText.style.display = 'block';
      }
      if (input) {
        input.focus();
      }
    }
  }

  openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.selectLoginChar(this.currentUser || 'nadia');
  }

  resetGame() {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลของตัวละครนี้ใหม่ทั้งหมดหรือไม่?')) {
      localStorage.removeItem(`petsociety_save_${this.currentUser}`);
      window.location.reload();
    }
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
      let worldX, worldY;
      if (this.currentScene === 'town') {
        const zoom = this.zoom || 1.0;
        worldX = this.cameraX + pos.x / zoom;
        worldY = (pos.y - this.canvas.height * (1 - zoom)) / zoom;
      } else {
        worldX = pos.x;
        worldY = pos.y;
      }
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
            } else if (obj.id === 'town_windmill') {
              this.visitWindmill(obj);
              return;
            } else if (obj.id === 'town_lighthouse') {
              this.visitLighthouse(obj);
              return;
            } else if (obj.id === 'town_beach_umbrella') {
              this.relaxBeachUmbrella(obj);
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
      let worldX, worldY;
      if (this.currentScene === 'town') {
        const zoom = this.zoom || 1.0;
        worldX = this.cameraX + pos.x / zoom;
        worldY = (pos.y - this.canvas.height * (1 - zoom)) / zoom;
      } else {
        worldX = pos.x;
        worldY = pos.y;
      }
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

    // Switch User / Profile Button
    document.getElementById('btnSwitchUser')?.addEventListener('click', () => {
      audio.init();
      audio.playPop(600);
      this.openLoginModal();
    });

    // Manual Save Button
    document.getElementById('btnSaveGame')?.addEventListener('click', () => {
      audio.init();
      audio.playCoin();
      this.saveState(true);
    });

    // Password Enter Key
    document.getElementById('loginPasswordInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.submitLogin();
      }
    });

    // Audio & BGM Toggle
    document.getElementById('btnToggleMusic')?.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      const btn = document.getElementById('btnToggleMusic');
      if (btn) btn.innerText = isMuted ? '🔇 Audio Off' : '🎵 Audio On';
    });

    // Zoom Toggle Button
    document.getElementById('btnToggleZoom')?.addEventListener('click', () => this.toggleZoom());

    // Fullscreen / Large mode Toggle Button
    document.getElementById('btnToggleFullscreen')?.addEventListener('click', () => this.toggleFullscreen());

    // Window resize listener for responsive / fullscreen canvas
    window.addEventListener('resize', () => this.handleResize());

    // Mouse wheel zoom in town
    this.canvas.addEventListener('wheel', (e) => {
      if (this.currentScene === 'town') {
        e.preventDefault();
        const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
        this.zoom = Math.max(0.5, Math.min(1.2, (this.zoom || 1.0) + zoomDelta));
        const btn = document.getElementById('btnToggleZoom');
        if (btn) {
          btn.innerText = `🔍 ซูม: ${Math.round(this.zoom * 100)}%`;
        }
      }
    }, { passive: false });

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
      this.updateZonePills();
    } else {
      this.player.x = 450;
      this.player.y = 420;
      this.player.targetX = 450;
      this.player.targetY = 420;
      this.cameraX = 0;
      document.getElementById('worldNavBar')?.classList.add('hidden');
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
      const zoom = this.zoom || 1.0;
      const visibleW = this.canvas.width / zoom;
      const desiredCameraX = this.player.x - visibleW / 2;
      const maxCameraX = Math.max(0, this.worldWidth - visibleW);
      this.targetCameraX = Math.max(0, Math.min(maxCameraX, desiredCameraX));
      this.cameraX += (this.targetCameraX - this.cameraX) * 0.12;
      this.updateZonePills();
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

    const zoom = (this.currentScene === 'town') ? (this.zoom || 1.0) : 1.0;
    const ctx = this.renderer.ctx;

    // 1. Draw Background & Scene Environment
    if (this.currentScene === 'town') {
      ctx.save();
      if (zoom !== 1.0) {
        ctx.translate(0, this.canvas.height * (1 - zoom));
        ctx.scale(zoom, zoom);
      }
      this.renderer.drawTown(this.cameraX, this.worldWidth, this.canvas.width / zoom, this.canvas.height / zoom);
      ctx.restore();
    } else if (this.currentScene === 'partner_home') {
      this.renderer.drawHome(this.partnerRoomTheme, this.cameraX);
    } else {
      this.renderer.drawHome(this.roomTheme, this.cameraX);
    }

    // 2. Draw Placed Buildings & Furniture
    let objects = this.townObjects;
    if (this.currentScene === 'home') objects = this.homeObjects;
    if (this.currentScene === 'partner_home') objects = (this.partnerHomeObjects.length > 0) ? this.partnerHomeObjects : this.homeObjects;
    // Sort by Y for depth layering
    const sortedObjects = [...objects].sort((a, b) => (a.y + a.height) - (b.y + b.height));

    ctx.save();
    if (this.currentScene === 'town') {
      if (zoom !== 1.0) {
        ctx.translate(0, this.canvas.height * (1 - zoom));
        ctx.scale(zoom, zoom);
      }
      ctx.translate(-this.cameraX, 0);
    }

    // Draw objects behind player
    sortedObjects.forEach(obj => {
      const isHovered = (this.buildMode && this.isMouseOver(obj));
      const isSelected = (this.draggedObject === obj);
      this.renderer.drawObject(obj, obj.x, obj.y, isHovered, isSelected);
    });

    // Draw partner host if in partner_home
    if (this.currentScene === 'partner_home') {
      const partner = this.neighbors.find(n => n.isPartner);
      if (partner) {
        this.renderer.drawPet(partner, 640, 420, 0.95, false, false);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        this.renderer.roundRect(640 - 45, 420 - 75, 90, 20, 6, true, false);
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ff70a6';
        ctx.textAlign = 'center';
        ctx.fillText(partner.name.split(' ')[0], 640, 420 - 61);
      }
    }

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

  // Windmill Lookout
  visitWindmill(obj) {
    audio.playPop(700);
    this.spawnHearts(obj.x + obj.width / 2, obj.y + 40, 6);
    this.addCoins(20);
    this.addXP(25);
    this.showSaveToast('🎡 คุณขึ้นไปรับสายลมสดชื่นบนเนินกังหันลม! (+20 Coins, +25 XP) ✨');
  }

  // Harbor Lighthouse
  visitLighthouse(obj) {
    audio.playWaterSplash();
    this.spawnHearts(obj.x + obj.width / 2, obj.y + 30, 8);
    this.addCoins(30);
    this.addXP(40);
    this.showSaveToast('🗼 คุณปีนขึ้นประภาคารชมวิวทะเลกว้างสุดขอบฟ้า! (+30 Coins, +40 XP) 🌊');
  }

  // Beach Umbrella Lounge
  relaxBeachUmbrella(obj) {
    audio.playPop(620);
    this.player.stats.happiness = 100;
    this.player.stats.energy = 100;
    this.updateHUD();
    this.spawnHearts(this.player.x, this.player.y - 30, 8);
    this.showSaveToast('⛱️ นอนเล่นรับลมริมทะเล ดื่มน้ำมะพร้าวเย็นชื่นใจ! พลังงาน & ความสุข 100%! 🥥🍹');
  }

  // Quick Travel to Zone (Open World GPS)
  travelToZone(zoneKey) {
    audio.init();
    audio.playPop(750);
    if (this.currentScene !== 'town') {
      this.switchScene('town');
    }
    const zoneTargets = {
      village: { x: 380, name: 'หมู่บ้านแสนหวาน (Sweet Village)' },
      shopping: { x: 1650, name: 'ถนนช้อปปิ้ง & คาเฟ่ (Shopping Boulevard)' },
      plaza: { x: 2880, name: 'สวนน้ำพุกลางเมือง (Central Park Plaza)' },
      beach: { x: 3950, name: 'หาดทราย & ทะเลสายลม (Sunny Beach & Ocean)' },
      windmill: { x: 5100, name: 'เนินเขากังหันลม (Windmill Meadow)' }
    };
    const target = zoneTargets[zoneKey] || zoneTargets.village;
    this.player.x = target.x;
    this.player.targetX = target.x;
    this.player.y = 440;
    this.player.targetY = 440;
    this.showSaveToast(`🚀 เดินทางถึง: ${target.name} แล้ว! ✨`);
    this.spawnHearts(this.player.x, this.player.y - 40, 6);
    this.updateZonePills();
  }

  // Update Active World GPS Nav Pills
  updateZonePills() {
    const navBar = document.getElementById('worldNavBar');
    if (!navBar) return;
    if (this.currentScene !== 'town') {
      navBar.classList.add('hidden');
      return;
    }
    navBar.classList.remove('hidden');

    const x = this.player.x;
    let currentKey = 'village';
    if (x >= 4700) currentKey = 'windmill';
    else if (x >= 3600) currentKey = 'beach';
    else if (x >= 2400) currentKey = 'plaza';
    else if (x >= 1200) currentKey = 'shopping';

    ['village', 'shopping', 'plaza', 'beach', 'windmill'].forEach(k => {
      const el = document.getElementById(`pill_${k}`);
      if (el) {
        if (k === currentKey) el.classList.add('active');
        else el.classList.remove('active');
      }
    });
  }

  // Toggle Fullscreen / Large Canvas Mode
  toggleFullscreen() {
    audio.init();
    audio.playPop(650);
    const wrapper = document.getElementById('gameWrapper');
    if (!wrapper) return;
    const isFull = wrapper.classList.toggle('fullscreen-mode');
    const btn = document.getElementById('btnToggleFullscreen');
    if (btn) {
      btn.innerHTML = isFull ? '⛶ จอปกติ' : '⛶ จอใหญ่';
    }
    this.handleResize();
    this.showSaveToast(isFull ? '⛶ เปิดโหมดจอใหญ่เต็มตาแล้ว!' : '⛶ สลับกลับมุมมองปกติ');
  }

  // Toggle Camera View Zoom
  toggleZoom() {
    audio.init();
    audio.playPop(600);
    const zoomLevels = [1.0, 0.75, 0.58];
    const currentIndex = zoomLevels.findIndex(z => Math.abs(z - (this.zoom || 1.0)) < 0.05);
    const nextIndex = (currentIndex + 1) % zoomLevels.length;
    this.zoom = zoomLevels[nextIndex];
    const btn = document.getElementById('btnToggleZoom');
    if (btn) {
      const labels = {
        1.0: '🔍 ซูม: 100%',
        0.75: '🔍 ซูม: 75% (กว้าง)',
        0.58: '🔍 ซูม: 58% (พาโนรามา)'
      };
      btn.innerText = labels[this.zoom] || `🔍 ซูม: ${Math.round(this.zoom * 100)}%`;
    }
    this.showSaveToast(`🔍 มุมมองโลกกว้าง: ${Math.round(this.zoom * 100)}%`);
  }

  // Resize Handler for Responsive Fullscreen
  handleResize() {
    const wrapper = document.getElementById('gameWrapper');
    if (wrapper && wrapper.classList.contains('fullscreen-mode')) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    } else {
      this.canvas.width = 960;
      this.canvas.height = 640;
    }
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
      alert(`🎉 Level Up! ${this.player.name} เลเวล ${this.player.level} แล้ว! ได้รับรางวัล 100 เหรียญทอง!`);
      this.player.coins += 100;
    }
    this.updateHUD();
  }

  updateHUD() {
    // Active User Profile Badge
    const elActiveUser = document.getElementById('hudActiveUser');
    if (elActiveUser) {
      elActiveUser.innerText = (this.currentUser === 'mac') ? 'Mac' : 'Nadia';
    }

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

    // Toggle visit partner house button
    const btnVisit = document.getElementById('btnVisitPartnerHouse');
    if (btnVisit) {
      if (neighbor.isPartner) {
        btnVisit.style.display = 'flex';
        btnVisit.innerHTML = `<span>🏡</span> แวะไปเที่ยวบ้านของ ${neighbor.name.split(' ')[0]}!`;
      } else {
        btnVisit.style.display = 'none';
      }
    }
  }

  interactNeighbor(action) {
    if (!this.activeNeighbor) return;
    const n = this.activeNeighbor;

    if (action === 'visit_partner_house') {
      audio.playFanfare();
      document.getElementById('neighborModal')?.classList.add('hidden');
      this.switchScene('partner_home');
      this.showSaveToast(`🏡 มาถึงบ้านของ ${n.name.split(' ')[0]} แล้ว!`);
      return;
    }

    if (action === 'chat') {
      const randomQuote = n.quotes[Math.floor(Math.random() * n.quotes.length)];
      document.getElementById('neighborQuote').innerText = `"${randomQuote}"`;
      audio.playSqueak();
      this.spawnHearts(n.position.x, n.position.y - 40, 3);
      this.addXP(8);
      this.addCoins(5);
      this.updateHUD();
      this.saveState();
    } else if (action === 'hug') {
      document.getElementById('neighborModal')?.classList.add('hidden');
      this.performHugMotion(n);
    } else if (action === 'dance') {
      document.getElementById('neighborModal')?.classList.add('hidden');
      this.performDanceMotion(n);
    } else if (action === 'rps') {
      document.getElementById('neighborModal')?.classList.add('hidden');
      this.startRPSMiniGame(n);
    } else if (action === 'treat') {
      const favFood = GAME_DATA.foods.find(f => f.id === GAME_DATA.species[n.species].favFood);
      audio.playChew();
      this.spawnHearts(n.position.x, n.position.y - 40, 8);
      this.addCoins(20);
      this.addXP(25);
      document.getElementById('neighborQuote').innerText = `"โอ้โห! ให้ ${favFood ? favFood.name : 'ขนม'} กับฉันเหรอ! ดีใจที่สุดเลย รักเธอจัง! 💖"`;
      this.updateHUD();
      this.saveState();
    }
  }

  // ==========================================
  // REAL CHARACTER MOTION SEQUENCES
  // ==========================================

  // 1. REAL HUG MOTION
  performHugMotion(targetNeighbor) {
    this.inMotion = true;
    audio.playHug();

    // Move close to each other
    const midX = (this.player.x + targetNeighbor.position.x) / 2;
    this.player.x = midX - 22;
    this.player.targetX = midX - 22;
    targetNeighbor.position.x = midX + 22;

    this.player.facingRight = true;
    targetNeighbor.facingRight = false;

    // Trigger physical hug animation
    this.player.customAction = 'hug';
    targetNeighbor.customAction = 'hug';

    this.showMotionBanner('💖 กอดแสนอบอุ่น! (Warm Hug)');
    this.player.stats.happiness = 100;
    this.addXP(18);
    this.addCoins(15);
    this.updateHUD();

    // Continuous burst of floating hearts
    this.spawnHearts(midX, this.player.y - 40, 8);
    const heartTimer = setInterval(() => {
      this.spawnHearts(midX + (Math.random() - 0.5) * 24, this.player.y - 35, 3);
    }, 280);

    setTimeout(() => {
      clearInterval(heartTimer);
      this.player.customAction = null;
      targetNeighbor.customAction = null;
      this.inMotion = false;
      this.hideMotionBanner();
      this.showSaveToast('✨ กอดกันอย่างอบอุ่น อารมณ์ดีเต็มเปี่ยม!');
      this.saveState();
    }, 2800);
  }

  // 2. REAL DANCE MOTION
  performDanceMotion(targetNeighbor) {
    this.inMotion = true;
    audio.playFanfare();

    // Position side-by-side facing forward
    const midX = (this.player.x + targetNeighbor.position.x) / 2;
    this.player.x = midX - 35;
    this.player.targetX = midX - 35;
    targetNeighbor.position.x = midX + 35;

    this.player.facingRight = true;
    targetNeighbor.facingRight = true;

    // Trigger physical synchronized dance animation
    this.player.customAction = 'dance';
    targetNeighbor.customAction = 'dance';

    this.showMotionBanner('💃 แดนซ์ปาร์ตี้สนุกสุดเหวี่ยง! 🎶');
    this.player.stats.happiness = 100;
    this.addCoins(20);
    this.addXP(15);
    this.updateHUD();

    setTimeout(() => {
      audio.playSqueak();
    }, 1200);

    setTimeout(() => {
      this.player.customAction = null;
      targetNeighbor.customAction = null;
      this.inMotion = false;
      this.hideMotionBanner();
      this.showSaveToast('🎶 เต้นเสร็จแล้ว สดชื่นมากๆ!');
      this.saveState();
    }, 3600);
  }

  // 3. REAL ROCK-PAPER-SCISSORS MOTION
  startRPSMiniGame(targetNeighbor) {
    this.rpsNeighbor = targetNeighbor;
    this.inMotion = true;

    // Stand facing each other
    const midX = (this.player.x + targetNeighbor.position.x) / 2;
    this.player.x = midX - 48;
    this.player.targetX = midX - 48;
    targetNeighbor.position.x = midX + 48;

    this.player.facingRight = true;
    targetNeighbor.facingRight = false;

    // Show on-screen RPS choice overlay
    const overlay = document.getElementById('rpsChoiceOverlay');
    if (overlay) overlay.classList.remove('hidden');
  }

  cancelRPS() {
    const overlay = document.getElementById('rpsChoiceOverlay');
    if (overlay) overlay.classList.add('hidden');
    this.inMotion = false;
    this.rpsNeighbor = null;
  }

  chooseRPSMove(playerMove) {
    const overlay = document.getElementById('rpsChoiceOverlay');
    if (overlay) overlay.classList.add('hidden');
    if (!this.rpsNeighbor) return;

    // Phase 1: Countdown fist-pump shake!
    this.player.customAction = 'rps_shake';
    this.rpsNeighbor.customAction = 'rps_shake';
    this.showMotionBanner('✊ 1... ยิ้ง...');
    audio.playPop(450);

    // Phase 2: Second shake!
    setTimeout(() => {
      this.showMotionBanner('✌️ 2... ฉุบ...');
      audio.playPop(550);
    }, 750);

    // Phase 3: SHOW MOVE!
    setTimeout(() => {
      const choices = ['rock', 'paper', 'scissors'];
      const npcMove = choices[Math.floor(Math.random() * choices.length)];

      this.player.rpsMove = playerMove;
      this.rpsNeighbor.rpsMove = npcMove;
      audio.playPop(750);

      let result = 'draw';
      if (playerMove === npcMove) {
        result = 'draw';
      } else if (
        (playerMove === 'rock' && npcMove === 'scissors') ||
        (playerMove === 'paper' && npcMove === 'rock') ||
        (playerMove === 'scissors' && npcMove === 'paper')
      ) {
        result = 'win';
      } else {
        result = 'lose';
      }

      if (result === 'win') {
        this.player.customAction = 'rps_win';
        this.rpsNeighbor.customAction = 'rps_lose';
        audio.playFanfare();
        this.showMotionBanner('🎉 คุณชนะ! ได้รับ 30 🪙');
        this.addCoins(30);
        this.addXP(25);
      } else if (result === 'draw') {
        this.player.customAction = 'dance';
        this.rpsNeighbor.customAction = 'dance';
        audio.playPop(600);
        this.showMotionBanner('🤝 เสมอกัน! แบ่งคนละ 10 🪙');
        this.addCoins(10);
        this.addXP(10);
      } else {
        this.player.customAction = 'rps_lose';
        this.rpsNeighbor.customAction = 'rps_win';
        audio.playPop(300);
        this.showMotionBanner(`😅 ${this.rpsNeighbor.name.split(' ')[0]} ชนะรอบนี้!`);
      }

      // Phase 4: Reset & Return
      setTimeout(() => {
        this.player.rpsMove = null;
        if (this.rpsNeighbor) this.rpsNeighbor.rpsMove = null;
        this.player.customAction = null;
        if (this.rpsNeighbor) this.rpsNeighbor.customAction = null;
        this.rpsNeighbor = null;
        this.inMotion = false;
        this.hideMotionBanner();
        this.saveState();
      }, 2500);

    }, 1500);
  }

  showMotionBanner(text) {
    const banner = document.getElementById('motionActionBanner');
    const label = document.getElementById('motionActionText');
    if (banner && label) {
      label.innerText = text;
      banner.classList.remove('hidden');
    }
  }

  hideMotionBanner() {
    const banner = document.getElementById('motionActionBanner');
    if (banner) banner.classList.add('hidden');
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
