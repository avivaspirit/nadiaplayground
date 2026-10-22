// ==========================================
// NadiaPlayground: Pet Society Data Catalog
// ==========================================

const GAME_DATA = {
  // Available Species with unique anatomy & traits
  species: {
    bunny: {
      id: 'bunny',
      name: 'Bunny (กระต่าย)',
      earType: 'long',
      tailType: 'fluffy_puff',
      muzzleType: 'twitchy_nose',
      favFood: 'food_carrot',
      defaultColor: '#fde2e4',
      description: 'กระต่ายน้อยหูยาว ร่าเริง ชอบกระโดดและกินแครอทสด!'
    },
    seal: {
      id: 'seal',
      name: 'Seal (แมวน้ำ)',
      earType: 'tiny_dots',
      tailType: 'seal_fin',
      hasFlippers: true,
      hasWhiskers: true,
      favFood: 'food_fish',
      defaultColor: '#d8e2dc',
      description: 'แมวน้ำอุ๋งๆ ตัวกลม มีครีบดุ๊กดิ๊ก ชอบเล่นลูกบอลและกินปลา!'
    },
    cat: {
      id: 'cat',
      name: 'Cat (น้องแมว)',
      earType: 'pointy',
      tailType: 'long_curved',
      hasWhiskers: true,
      favFood: 'food_sushi',
      defaultColor: '#fed1b2',
      description: 'น้องแมวขี้อ้อน ปลายหูแหลม หางแกว่งไปมาอย่างสง่างาม'
    },
    dog: {
      id: 'dog',
      name: 'Puppy (ลูกหมา)',
      earType: 'floppy',
      tailType: 'wagging',
      favFood: 'food_bone',
      defaultColor: '#e9d8a6',
      description: 'เจ้าตูบแสนซื่อ หูพับ หางกระดิกตลอดเวลาเมื่อเจอเพื่อน'
    },
    bear: {
      id: 'bear',
      name: 'Teddy Bear (หมีน้อย)',
      earType: 'round',
      tailType: 'nub',
      favFood: 'food_honey',
      defaultColor: '#ddb892',
      description: 'หมีน้อยตัวนุ่ม อบอุ่น หูทรงกลมสุดคลาสสิก'
    },
    penguin: {
      id: 'penguin',
      name: 'Penguin (เพนกวิน)',
      earType: 'none',
      tailType: 'small_wedge',
      isBeak: true,
      hasFlippers: true,
      favFood: 'food_icecream',
      defaultColor: '#bde0fe',
      description: 'เพนกวินจอมซน ปีกกระพือ เดินเตาะแตะน่ารัก'
    },
    panda: {
      id: 'panda',
      name: 'Panda (แพนด้า)',
      earType: 'round',
      tailType: 'nub',
      hasEyePatches: true,
      favFood: 'food_bamboo',
      defaultColor: '#ffffff',
      description: 'แพนด้ากลมปุ๊ก ขอบตาดำสุดน่ารัก รักสงบและชอบขนมหวาน'
    },
    sock: {
      id: 'sock',
      name: 'Sockney (น้องถุงเท้า)',
      earType: 'cuff_ears',
      tailType: 'heel_fluff',
      isSock: true,
      favFood: 'food_cupcake',
      defaultColor: '#ffb4d6',
      description: 'น้องถุงเท้ามีชีวิตแสนน่ารัก ลายทางพาสเทล ตากระดุมแวววาว นุ่มฟูอบอุ่นใจ'
    }
  },

  // Color Palettes
  furColors: [
    { id: 'c_snow', name: 'Snow White', hex: '#ffffff' },
    { id: 'c_cream', name: 'Warm Cream', hex: '#fff1e6' },
    { id: 'c_pink', name: 'Pastel Pink', hex: '#ffd1dc' },
    { id: 'c_lavender', name: 'Lavender', hex: '#e2d4f0' },
    { id: 'c_sky', name: 'Sky Blue', hex: '#cdeac0' },
    { id: 'c_mint', name: 'Soft Mint', hex: '#d8f3dc' },
    { id: 'c_banana', name: 'Banana Yellow', hex: '#ffedb3' },
    { id: 'c_peach', name: 'Sweet Peach', hex: '#ffd7ba' },
    { id: 'c_caramel', name: 'Caramel Brown', hex: '#ddb892' },
    { id: 'c_choco', name: 'Milk Chocolate', hex: '#9c6644' },
    { id: 'c_silver', name: 'Silver Gray', hex: '#ced4da' },
    { id: 'c_seal', name: 'Aqua Seal', hex: '#b5e2fa' }
  ],

  eyeShapes: [
    { id: 'classic', name: 'Classic Shiny (ตาโตเป็นประกาย)' },
    { id: 'happy', name: 'Happy Arcs (ตายิ้ม)' },
    { id: 'sleepy', name: 'Sleepy / Chill (ตาเยิ้มขี้เซา)' },
    { id: 'anime', name: 'Star Sparkle (ตาเปล่งประกายดาว)' },
    { id: 'wink', name: 'Playful Wink (ขยิบตา 1 ข้าง)' }
  ],

  blushStyles: [
    { id: 'circles', name: 'Rosy Circles (แก้มชมพูกลม)' },
    { id: 'hearts', name: 'Sweet Hearts (แก้มรูปหัวใจ)' },
    { id: 'stripes', name: 'Anime Manga Lines (ขีดแก้มเขิน)' },
    { id: 'none', name: 'Natural (ไม่มีบลัช)' }
  ],

  // Clothing & Fashion Items
  clothes: [
    // Headwear
    { id: 'hat_ribbon', slot: 'head', name: 'Pink Ribbon Bow', price: 40, icon: '🎀', color: '#ff70a6', style: 'ribbon' },
    { id: 'hat_crown', slot: 'head', name: 'Royal Gold Crown', price: 120, icon: '👑', color: '#ffd166', style: 'crown' },
    { id: 'hat_sailor', slot: 'head', name: 'Sailor Cap', price: 65, icon: '⚓', color: '#0077b6', style: 'sailor' },
    { id: 'hat_flower', slot: 'head', name: 'Daisy Flower Crown', price: 50, icon: '🌸', color: '#f72585', style: 'flower_crown' },
    { id: 'hat_beret', slot: 'head', name: 'Artist Beret', price: 60, icon: '🎨', color: '#8338ec', style: 'beret' },
    { id: 'hat_straw', slot: 'head', name: 'Summer Straw Hat', price: 55, icon: '👒', color: '#e9d8a6', style: 'straw' },
    { id: 'hat_bunny_ears', slot: 'head', name: 'Fluffy Bunny Headband', price: 75, icon: '🐰', color: '#fde2e4', style: 'bunny_headband' },
    { id: 'hat_chef', slot: 'head', name: 'Master Chef Hat', price: 70, icon: '🧑‍🍳', color: '#ffffff', style: 'chef' },

    // Glasses / Face
    { id: 'glass_round', slot: 'face', name: 'Smart Round Glasses', price: 45, icon: '👓', color: '#4a4e69', style: 'round_glass' },
    { id: 'glass_heart', slot: 'face', name: 'Heart Sunglasses', price: 60, icon: '🕶️', color: '#ff4d6d', style: 'heart_glass' },
    { id: 'face_star', slot: 'face', name: 'Star Face Decal', price: 30, icon: '⭐', color: '#ffd166', style: 'star_decal' },

    // Neck
    { id: 'neck_bell', slot: 'neck', name: 'Golden Bell Collar', price: 50, icon: '🔔', color: '#ffb703', style: 'bell_collar' },
    { id: 'neck_scarf', slot: 'neck', name: 'Cozy Red Scarf', price: 55, icon: '🧣', color: '#e63946', style: 'scarf' },
    { id: 'neck_pearl', slot: 'neck', name: 'Princess Pearl Necklace', price: 80, icon: '📿', color: '#f8f9fa', style: 'pearls' },
    { id: 'neck_bowtie', slot: 'neck', name: 'Dapper Bowtie', price: 40, icon: '👔', color: '#2b2d42', style: 'bowtie' },

    // Tops & Outfits
    { id: 'outfit_hoodie', slot: 'body', name: 'Pastel Bunny Hoodie', price: 90, icon: '🧥', color: '#fbc3bc', style: 'hoodie' },
    { id: 'outfit_sailor', slot: 'body', name: 'Sailor Uniform', price: 100, icon: '⛵', color: '#48cae4', style: 'sailor_shirt' },
    { id: 'outfit_sweater', slot: 'body', name: 'Striped Cozy Sweater', price: 85, icon: '🧶', color: '#ffb703', style: 'striped_sweater' },
    { id: 'outfit_dress', slot: 'body', name: 'Princess Frill Dress', price: 130, icon: '👗', color: '#ff758f', style: 'frill_dress' },
    { id: 'outfit_overalls', slot: 'body', name: 'Gardener Overalls', price: 95, icon: '👖', color: '#457b9d', style: 'overalls' },
    { id: 'outfit_tuxedo', slot: 'body', name: 'Gentleman Tuxedo', price: 150, icon: '🤵', color: '#1d3557', style: 'tuxedo' },
    { id: 'outfit_cape', slot: 'body', name: 'Magical Star Cape', price: 140, icon: '🪄', color: '#7209b7', style: 'magic_cape' },

    // Handheld Props
    { id: 'prop_icecream', slot: 'hand', name: 'Triple Berry Ice Cream', price: 35, icon: '🍦', color: '#ffb5a7', style: 'icecream' },
    { id: 'prop_wand', slot: 'hand', name: 'Sparkle Star Wand', price: 75, icon: '✨', color: '#f72585', style: 'wand' },
    { id: 'prop_balloon', slot: 'hand', name: 'Heart Balloon', price: 30, icon: '🎈', color: '#ff4d6d', style: 'balloon' },
    { id: 'prop_lollipop', slot: 'hand', name: 'Rainbow Swirl Lollipop', price: 25, icon: '🍭', color: '#f72585', style: 'lollipop' },
    { id: 'prop_fish', slot: 'hand', name: 'Seal Plushie Toy', price: 50, icon: '🦭', color: '#a0c4ff', style: 'seal_plush' },

    // Shoes
    { id: 'shoe_bunny', slot: 'shoes', name: 'Fluffy Bunny Slippers', price: 45, icon: '🥿', color: '#ffd1dc', style: 'bunny_slippers' },
    { id: 'shoe_sneakers', slot: 'shoes', name: 'Red Sport Sneakers', price: 55, icon: '👟', color: '#e63946', style: 'sneakers' },
    { id: 'shoe_boots', slot: 'shoes', name: 'Yellow Rain Boots', price: 50, icon: '👢', color: '#ffb703', style: 'rain_boots' }
  ],

  // Food Items
  foods: [
    { id: 'food_carrot', name: 'Crunchy Sweet Carrot', price: 15, hunger: 25, happy: 20, icon: '🥕', desc: 'แครอทสดกรุบกรอบ ของโปรดเจ้ากระต่าย!' },
    { id: 'food_fish', name: 'Fresh Silver Fish', price: 20, hunger: 30, happy: 25, icon: '🐟', desc: 'ปลาทะเลสดใหม่ กัดคำเดียวอุ๋งๆ ร้องดีใจ!' },
    { id: 'food_cake', name: 'Strawberry Shortcake', price: 35, hunger: 40, happy: 40, icon: '🍰', desc: 'เค้กสตรอว์เบอร์รี่หวานละมุน ฟินสุดๆ' },
    { id: 'food_sushi', name: 'Salmon Nigiri Sushi', price: 25, hunger: 30, happy: 30, icon: '🍣', desc: 'ซูชิแซลมอนเนื้อนุ่ม ละลายในปาก' },
    { id: 'food_honey', name: 'Golden Honey Pot', price: 25, hunger: 35, happy: 35, icon: '🍯', desc: 'น้ำผึ้งป่าหวานฉ่ำ หมีน้อยชื่นชอบมาก' },
    { id: 'food_icecream', name: 'Vanilla Sundae', price: 20, hunger: 20, happy: 35, icon: '🍨', desc: 'ไอศกรีมซันเดย์เย็นสดชื่น หวานชื่นใจ' },
    { id: 'food_donut', name: 'Pink Frosted Donut', price: 18, hunger: 25, happy: 25, icon: '🍩', desc: 'โดนัทเคลือบช็อกโกแลตชมพูโรยสปริงเคิล' },
    { id: 'food_tea', name: 'Boba Milk Tea', price: 22, hunger: 20, happy: 30, icon: '🧋', desc: 'ชานมไข่มุกเหนียวนุ่ม ดื่มแล้วอารมณ์ดี' },
    { id: 'food_icecream_sundae', name: 'Rainbow Sundae Cup', price: 30, hunger: 25, happy: 45, icon: '🍨', desc: 'ไอศกรีมซันเดย์สายรุ้ง 3 ลูกโต หวานเย็นฉ่ำใจ' },
    { id: 'food_icecream_mint', name: 'Mint Choco Chip Cone', price: 25, hunger: 20, happy: 40, icon: '🍦', desc: 'ไอศกรีมโคนมินต์ช็อกโกแลต เย็นสดชื่นกระปรี้กระเปร่า' },
    { id: 'food_smoothie', name: 'Berry Energy Smoothie', price: 26, hunger: 25, happy: 35, icon: '🥤', desc: 'สมูทตี้ผลไม้รวมเพื่อสุขภาพ เพิ่มพลังกายเต็มเปี่ยม' },
    { id: 'food_market_apple', name: 'Crunchy Honeycrisp Apple', price: 18, hunger: 25, happy: 25, icon: '🍎', desc: 'แอปเปิ้ลฮันนี่คริสป์หวานกรอบจากตลาดสด' }
  ],

  // Building & Town Decorating Objects (The Sims + Pet Society Open World)
  buildingCatalog: [
    // Town Exterior Buildings & Infrastructure
    { id: 'town_cottage', category: 'building', name: 'Cozy Pastel Cottage', price: 250, icon: '🏡', width: 140, height: 130, desc: 'บ้านพักสไตล์ชนบทสีพาสเทล' },
    { id: 'town_bakery', category: 'building', name: 'Sweet Bakery Shop', price: 320, icon: '🧁', width: 150, height: 140, desc: 'ร้านเบเกอรี่อบขนมหอมกรุ่น เข้าชมร้านได้' },
    { id: 'town_boutique', category: 'building', name: 'Fashion Boutique', price: 300, icon: '👗', width: 150, height: 140, desc: 'ร้านเสื้อผ้าแฟชั่นยอดฮิต เข้าชมร้านได้' },
    { id: 'town_market', category: 'building', name: 'Fresh Farmers Market', price: 310, icon: '🥕', width: 140, height: 130, desc: 'ตลาดสดสัตว์เลี้ยง มีผักผลไม้สดใหม่ เข้าชมตลาดได้' },
    { id: 'town_icecream', category: 'building', name: 'Sweet Scoops Ice Cream', price: 290, icon: '🍦', width: 130, height: 140, desc: 'ร้านไอศกรีมพาสเทลแสนหวาน เข้าชมร้านได้' },
    { id: 'town_bookshop', category: 'building', name: 'Storybook Haven Library', price: 330, icon: '📚', width: 130, height: 140, desc: 'ร้านหนังสือ & ห้องสมุดแสนอบอุ่น เข้าชมนั่งอ่านได้' },
    { id: 'town_fitness', category: 'building', name: 'Pet Power Gym', price: 350, icon: '⚡', width: 140, height: 135, desc: 'ยิมออกกำลังกายและฟิตเนส มีลู่วิ่ง เข้าเล่นได้' },
    { id: 'town_spa', category: 'building', name: 'Zen Blossom Spa & Onsen', price: 360, icon: '🌸', width: 135, height: 135, desc: 'สปาและออนเซ็นแช่น้ำแร่ผ่อนคลาย เข้าแช่น้ำได้' },
    { id: 'town_windmill', category: 'building', name: 'Pet Windmill', price: 280, icon: '🎡', width: 120, height: 150, desc: 'กังหันลมโบราณหมุนล้อสายลม' },
    { id: 'town_gazebo', category: 'building', name: 'Rose Gazebo', price: 180, icon: '🏛️', width: 110, height: 110, desc: 'ศาลากุหลาบสำหรับนั่งพักผ่อน' },

    // Town Landscape & Nature
    { id: 'town_fountain', category: 'decor', name: 'Grand Angel Fountain', price: 150, icon: '⛲', width: 100, height: 100, desc: 'น้ำพุกระต่ายนำโชค โยนเหรียญขอพรได้' },
    { id: 'town_blossom_tree', category: 'nature', name: 'Cherry Blossom Tree', price: 90, icon: '🌸', width: 90, height: 120, desc: 'ต้นซากุระผลิดอกสีชมพูโปรยปราย' },
    { id: 'town_apple_tree', category: 'nature', name: 'Fruit Apple Tree', price: 80, icon: '🍎', width: 85, height: 115, desc: 'ต้นแอปเปิ้ลเขย่าเก็บผลไม้ได้!' },
    { id: 'town_flower_bed', category: 'nature', name: 'Tulip Flower Bed', price: 40, icon: '🌷', width: 70, height: 40, desc: 'แปลงดอกทิวลิปหลากสีสัน' },
    { id: 'town_bench', category: 'decor', name: 'Park Wooden Bench', price: 60, icon: '🪵', width: 70, height: 50, desc: 'ม้านั่งไม้ในสวน นั่งรับลมสบายๆ' },
    { id: 'town_lamp', category: 'decor', name: 'Vintage Street Lamp', price: 50, icon: '🏮', width: 40, height: 100, desc: 'เสาไฟถนนสไตล์วินเทจ ส่องสว่างยามค่ำ' },
    { id: 'town_fence', category: 'decor', name: 'White Picket Fence', price: 25, icon: '🪜', width: 60, height: 40, desc: 'รั้วไม้สีขาวสไตล์คันทรี' },
    { id: 'town_stone_path', category: 'decor', name: 'Cobblestone Path', price: 20, icon: '🪨', width: 50, height: 35, desc: 'ทางเดินหินแม่น้ำโบราณ' },
    { id: 'town_beach_umbrella', category: 'decor', name: 'Beach Umbrella & Chair', price: 65, icon: '⛱️', width: 75, height: 85, desc: 'ร่มชายหาดลายทางสีสดใสพร้อมเก้าอี้ผ้าใบ' },
    { id: 'town_palm_tree', category: 'nature', name: 'Coconut Palm Tree', price: 85, icon: '🌴', width: 85, height: 130, desc: 'ต้นมะพร้าวริมชายหาดโยกตามสายลม' },
    { id: 'town_lighthouse', category: 'building', name: 'Harbor Lighthouse', price: 340, icon: '🗼', width: 110, height: 160, desc: 'ประภาคารริมทะเลส่องไฟนำทาง' },

    // Home Interior Furniture
    { id: 'furn_sofa', category: 'furniture', name: 'Pastel Cloud Sofa', price: 120, icon: '🛋️', width: 90, height: 60, desc: 'โซฟานุ่มรูปก้อนเมฆ นั่งสบายสุดๆ' },
    { id: 'furn_bed', category: 'furniture', name: 'Royal Canopy Bed', price: 200, icon: '🛏️', width: 100, height: 90, desc: 'เตียงนอนเจ้าหญิง ชวนให้ฝันหวาน' },
    { id: 'furn_table', category: 'furniture', name: 'Teatime Table & Chairs', price: 85, icon: '🪑', width: 80, height: 60, desc: 'โต๊ะน้ำชากลางห้องสำหรับปาร์ตี้' },
    { id: 'furn_tv', category: 'furniture', name: 'Retro Cat TV', price: 110, icon: '📺', width: 70, height: 65, desc: 'ทีวีจอแก้วทรงหูแมว มีการ์ตูนเล่นตลอด' },
    { id: 'furn_fridge', category: 'furniture', name: 'Pastel Fridge', price: 130, icon: '🧊', width: 60, height: 90, desc: 'ตู้เย็นใส่อาหารและขนมอร่อย' },
    { id: 'furn_tub', category: 'furniture', name: 'Bubble Clawfoot Tub', price: 160, icon: '🛁', width: 90, height: 70, desc: 'อ่างอาบน้ำฟองสบู่สุดหรู' },
    { id: 'furn_fireplace', category: 'furniture', name: 'Cozy Brick Fireplace', price: 175, icon: '🔥', width: 80, height: 90, desc: 'เตาผิงอิฐอุ่นสบายยามหนาว' },
    { id: 'furn_rug', category: 'furniture', name: 'Rainbow Star Rug', price: 50, icon: '⭐', width: 90, height: 60, desc: 'พรมปูพื้นรูปดาวสีรุ้งสดใส' },
    { id: 'furn_plant', category: 'furniture', name: 'Potted Monstera', price: 40, icon: '🪴', width: 50, height: 70, desc: 'ต้นไม้ฟอกอากาศในกระถางดินเผา' },
    { id: 'furn_lamp', category: 'furniture', name: 'Mushroom Night Lamp', price: 45, icon: '🍄', width: 45, height: 60, desc: 'โคมไฟเห็ดเรืองแสงอบอุ่น' }
  ],

  // Wallpapers & Floors for rooms
  wallpapers: [
    { id: 'wall_pink_stripe', name: 'Pink Candy Stripes', price: 50, colorA: '#fff0f3', colorB: '#ffccd5', pattern: 'stripe' },
    { id: 'wall_sky_cloud', name: 'Dreamy Sky Clouds', price: 65, colorA: '#e0f2fe', colorB: '#bae6fd', pattern: 'cloud' },
    { id: 'wall_mint_dots', name: 'Mint Polka Dots', price: 55, colorA: '#e8f5e9', colorB: '#c8e6c9', pattern: 'dot' },
    { id: 'wall_wood_panel', name: 'Warm Oak Wood', price: 70, colorA: '#faedcd', colorB: '#d4a373', pattern: 'wood' }
  ],

  floorings: [
    { id: 'floor_wood_plank', name: 'Cozy Hardwood Parquet', price: 50, colorA: '#ddb892', colorB: '#b08968', pattern: 'wood_plank' },
    { id: 'floor_pink_tiles', name: 'Checkerboard Sweet Pink', price: 60, colorA: '#ffffff', colorB: '#ffccd5', pattern: 'checker' },
    { id: 'floor_green_carpet', name: 'Fluffy Grass Carpet', price: 55, colorA: '#a7c957', colorB: '#6a994e', pattern: 'carpet' },
    { id: 'floor_blue_tiles', name: 'Ocean Wave Mosaic', price: 65, colorA: '#e0fbfc', colorB: '#98c1d9', pattern: 'mosaic' }
  ],

  // NPC Neighbor Characters
  neighbors: [
    {
      id: 'npc_mimi',
      name: 'Mimi (มิมิ)',
      species: 'bunny',
      title: 'Town Florist (ชาวสวนกระต่าย)',
      furColor: '#fde2e4',
      eyeShape: 'classic',
      blush: 'circles',
      clothes: { head: 'hat_ribbon', body: 'outfit_dress', face: null, neck: null, hand: 'prop_lollipop', shoes: 'shoe_bunny' },
      position: { x: 380, y: 390 },
      personality: 'bubbly',
      quotes: [
        'สวัสดีจ้า! วันนี้อากาศดีมากเลย เหมาะกับการปลูกดอกไม้สุดๆ 🌸',
        'อุ๊ย! ชุดเธอวันนี้น่ารักจังเลย แมทช์สีได้เก่งมากๆ ✨',
        'ถ้ามีแครอทหวานๆ มาแบ่งกันชิมนะ ฉันชอบมากเลยล่ะ 🥕'
      ],
      houseColor: '#ffe5ec',
      giftGiven: false
    },
    {
      id: 'npc_bubbles',
      name: 'Bubbles (น้องอุ๋ง บับเบิลส์)',
      species: 'seal',
      title: 'Beach Sailor (กัปตันอุ๋งริมหาด)',
      furColor: '#b5e2fa',
      eyeShape: 'happy',
      blush: 'hearts',
      clothes: { head: 'hat_sailor', body: 'outfit_sailor', face: null, neck: 'neck_bell', hand: 'prop_fish', shoes: null },
      position: { x: 3920, y: 400 },
      personality: 'playful',
      quotes: [
        'อุ๋งๆ! ทะเลเมืองนี้สีครามสดใสมาก! มานอนเล่นริมหาดทรายกันมั้ย? 🦭🌊',
        'ฉันเพิ่งอบพายปลาทะเลหอมๆ เสร็จพอดีเลย รับลมทะเลแล้วอร่อยขึ้น 2 เท่า!',
        'เป่ายิ้งฉุบกันมั้ยล่ะ ถ้าเธอชนะ ฉันมีเหรียญทองชายหาดให้ด้วยนะ!'
      ],
      houseColor: '#d0f4de',
      giftGiven: false
    },
    {
      id: 'npc_luna',
      name: 'Luna (ลูน่า)',
      species: 'cat',
      title: 'Cafe Barista (บาริสต้าสาว)',
      furColor: '#fed1b2',
      eyeShape: 'wink',
      blush: 'stripes',
      clothes: { head: 'hat_beret', body: 'outfit_sweater', face: 'glass_round', neck: null, hand: null, shoes: 'shoe_sneakers' },
      position: { x: 1960, y: 390 },
      personality: 'cool_sweet',
      quotes: [
        'เหมียว~ ยินดีต้อนรับสู่ถนนช้อปปิ้ง! ชานมไข่มุกร้านฉันรสเด็ดที่สุดในเมืองนะ 🧋',
        'อย่าลืมแวะลองเสื้อผ้าคอลเลกชันใหม่ที่บูติกข้างๆ นะ ขนนุ่มเหมาะกับชุดเดรสมาก!',
        'ฉันชอบนั่งจิบกาแฟริมเทอเรซมองดูเพื่อนๆ เดินช้อปปิ้ง สบายใจจังเลย'
      ],
      houseColor: '#faedcd',
      giftGiven: false
    },
    {
      id: 'npc_barnaby',
      name: 'Mayor Barnaby (นายกเทศมนตรี บาร์นาบี)',
      species: 'bear',
      title: 'Town Mayor & Builder (นายกฯ หมีใจดี)',
      furColor: '#ddb892',
      eyeShape: 'classic',
      blush: 'none',
      clothes: { head: 'hat_crown', body: 'outfit_tuxedo', face: null, neck: 'neck_bowtie', hand: 'prop_wand', shoes: null },
      position: { x: 2980, y: 400 },
      personality: 'wise_friendly',
      quotes: [
        'โฮะๆ ยินดีต้อนรับสู่ Central Park สวนใจกลางเมืองที่กว้างใหญ่ที่สุด! ⛲',
        'เมืองของเราขยายใหญ่ถึง 5,600 เมตร มีทั้งชายหาด คาเฟ่ และเนินเขากังหันลม!',
        'อยากตกแต่งเมืองเพิ่มเติม กดปุ่ม 🛠️ แต่งเมือง แล้วจัดวางได้ตามใจชอบเลยนะ!'
      ],
      houseColor: '#e2ece9',
      giftGiven: false
    },
    {
      id: 'npc_pippin',
      name: 'Pippin (ปิ๊ปปิ้น)',
      species: 'penguin',
      title: 'Beach Dancer (นักเต้นเพนกวิน)',
      furColor: '#bde0fe',
      eyeShape: 'anime',
      blush: 'circles',
      clothes: { head: 'hat_straw', body: 'outfit_overalls', face: 'glass_heart', neck: null, hand: 'prop_icecream', shoes: 'shoe_boots' },
      position: { x: 4260, y: 405 },
      personality: 'energetic',
      quotes: [
        'วู้ววว! เล่นน้ำทะเลริมสะพานปลาเย็นชื่นใจสุดๆ! มาแดนซ์รับลมทะเลกัน! 💃🌊',
        'ไอศกรีมรสสตรอว์เบอร์รี่ริมหาดคือที่สุดของความสุขในฤดูร้อน!',
        'มาแข่งเป่ายิ้งฉุบกันหน่อย เร็วเข้า! ค้อน กรรไกร กระดาษ!'
      ],
      houseColor: '#d7e3fc',
      giftGiven: false
    },
    {
      id: 'npc_baobao',
      name: 'Bao Bao (เปาเปา)',
      species: 'panda',
      title: 'Meadow Artist (จิตรกรแพนด้า)',
      furColor: '#ffffff',
      eyeShape: 'happy',
      blush: 'circles',
      clothes: { head: 'hat_beret', body: 'outfit_sweater', face: 'glass_round', neck: null, hand: null, shoes: null },
      position: { x: 5180, y: 400 },
      personality: 'zen_artistic',
      quotes: [
        'มองวิวจากเนินกังหันลมสิ ท้องฟ้ากว้างใหญ่และสวยงามจับใจจริงๆ 🎨',
        'การวาดภาพทุ่งดอกไม้ทำให้หัวใจสงบและมีความสุขที่สุดเลย!',
        'มาเป่ายิ้งฉุบกันสักตาไหม ถ้าเธอชนะ ฉันจะวาดรูปสวยๆ ให้เป็นของขวัญนะ!'
      ],
      houseColor: '#e9ecef',
      giftGiven: false
    },
    {
      id: 'npc_daisy',
      name: 'Daisy (เดซี่)',
      species: 'dog',
      title: 'Highland Explorer (นักสำรวจน้อย)',
      furColor: '#fed1b2',
      eyeShape: 'anime',
      blush: 'hearts',
      clothes: { head: 'hat_straw', body: 'outfit_overalls', face: null, neck: 'neck_bell', hand: 'prop_wand', shoes: 'shoe_sneakers' },
      position: { x: 4860, y: 405 },
      personality: 'energetic',
      quotes: [
        'โฮ่งๆ! เมืองของเรากว้างใหญ่และมีที่วิ่งเล่นเยอะแยะเลย! วิ่งแข่งกันมั้ย! 🐶✨',
        'ลมพัดกังหันลมหมุนติ้วๆ เย็นสบายที่สุดเลย!',
        'ฉันเก็บเปลือกหอยสวยๆ มาจากชายหาดด้วยนะ เธอชอบมั้ย!'
      ],
      houseColor: '#fff1e6',
      giftGiven: false
    }
  ],

  // Playable Character Presets (Direct Character Selection)
  characterPresets: [
    {
      id: 'nadia',
      name: 'Nadia (นาเดีย)',
      species: 'bunny',
      title: '👑 Town Princess & Stylist',
      badge: 'เจ้าหญิงกระต่ายน้อย',
      avatar: '🐰',
      furColor: '#fde2e4',
      eyeShape: 'classic',
      blush: 'circles',
      clothes: { head: 'hat_ribbon', body: 'outfit_dress', face: null, neck: null, hand: 'prop_wand', shoes: 'shoe_bunny' },
      desc: 'กระต่ายน้อยแสนหวาน เจ้าหญิงแห่งเมือง ผู้รักการแต่งตัว ปลูกดอกไม้ และดูแลเพื่อนๆ'
    },
    {
      id: 'mac',
      name: 'Mac (แม็ค)',
      species: 'bear',
      title: '🛠️ Town Mayor & Builder',
      badge: 'พี่หมีนักสร้างเมือง',
      avatar: '🐻',
      furColor: '#ddb892',
      eyeShape: 'classic',
      blush: 'none',
      clothes: { head: 'hat_crown', body: 'outfit_tuxedo', face: null, neck: 'neck_bowtie', hand: 'prop_wand', shoes: 'shoe_sneakers' },
      desc: 'พี่หมีใจดีและเท่ ผู้ดูแลเมืองแสนสุข ชอบออกแบบและสร้างสิ่งก่อสร้างใหม่ๆ ในเมือง'
    },
    {
      id: 'bubbles',
      name: 'Bubbles (น้องอุ๋ง บับเบิลส์)',
      species: 'seal',
      title: '⛵ Beach Sailor & Baker',
      badge: 'กัปตันแมวน้ำริมหาด',
      avatar: '🦭',
      furColor: '#b5e2fa',
      eyeShape: 'happy',
      blush: 'hearts',
      clothes: { head: 'hat_sailor', body: 'outfit_sailor', face: null, neck: 'neck_bell', hand: 'prop_fish', shoes: null },
      desc: 'น้องอุ๋งแมวน้ำจอมซน ตัวกลมดุ๊กดิ๊ก ชอบเล่นคลื่นทะเลและอบพายปลาหอมกรุ่น'
    },
    {
      id: 'luna',
      name: 'Luna (ลูน่า)',
      species: 'cat',
      title: '🧋 Cafe Barista & Fashionista',
      badge: 'แมวสาวบาริสต้าสุดชิค',
      avatar: '🐱',
      furColor: '#fed1b2',
      eyeShape: 'wink',
      blush: 'stripes',
      clothes: { head: 'hat_beret', body: 'outfit_sweater', face: 'glass_round', neck: null, hand: 'prop_lollipop', shoes: 'shoe_sneakers' },
      desc: 'แมวสาวบาริสต้าตากลมโต รักการอ่านหนังสือในบุ๊คช็อปและชงชานมไข่มุกแสนอร่อย'
    },
    {
      id: 'pippin',
      name: 'Pippin (ปิ๊ปปิ้น)',
      species: 'penguin',
      title: '💃 Star Athlete & Ice Dancer',
      badge: 'เพนกวินนักเต้นพลังล้น',
      avatar: '🐧',
      furColor: '#bde0fe',
      eyeShape: 'anime',
      blush: 'circles',
      clothes: { head: 'hat_straw', body: 'outfit_overalls', face: 'glass_heart', neck: null, hand: 'prop_icecream', shoes: 'shoe_boots' },
      desc: 'เพนกวินน้อยพลังล้นเหลือ ชอบเต้น ออกกำลังกายในยิม และกินไอศกรีมดับร้อน'
    },
    {
      id: 'baobao',
      name: 'Bao Bao (เปาเปา)',
      species: 'panda',
      title: '🎨 Highland Artist & Philosopher',
      badge: 'แพนด้าจิตรกรเซน',
      avatar: '🐼',
      furColor: '#ffffff',
      eyeShape: 'happy',
      blush: 'circles',
      clothes: { head: 'hat_beret', body: 'outfit_sweater', face: 'glass_round', neck: null, hand: null, shoes: null },
      desc: 'แพนด้าอารมณ์ดี จิตรกรแห่งทุ่งกังหันลม ชอบแช่สปาออนเซ็นและวาดภาพวิวทิวทัศน์'
    },
    {
      id: 'daisy',
      name: 'Daisy (เดซี่)',
      species: 'dog',
      title: '🌻 Golden Pup & Market Scout',
      badge: 'ลูกสุนัขโกลเด้นผู้ร่าเริง',
      avatar: '🐶',
      furColor: '#fed1b2',
      eyeShape: 'anime',
      blush: 'hearts',
      clothes: { head: 'hat_straw', body: 'outfit_overalls', face: null, neck: 'neck_bell', hand: 'prop_wand', shoes: 'shoe_sneakers' },
      desc: 'ลูกสุนัขโกลเด้นหางกระดิกดุ๊กดิ๊ก ชอบวิ่งเล่นในตลาดสดและชวนทุกคนยิ้มอย่างมีความสุข'
    },
    {
      id: 'dogney',
      name: 'Dogney (ด็อกนี่)',
      species: 'dog',
      title: '🐶 The Fluffy Golden Pup',
      badge: 'น้องหมาด็อกนี่หูตูบแสนซน',
      avatar: '🐶',
      furColor: '#fed18c',
      eyeShape: 'anime',
      blush: 'hearts',
      clothes: { head: 'hat_cap', body: 'outfit_overalls', face: null, neck: 'neck_bell', hand: 'prop_wand', shoes: 'shoe_sneakers' },
      desc: 'น้องหมาด็อกนี่ตัวกลมหูตูบแสนน่ารัก รักการวิ่งคาบบอล เกาพุง และอ้อนขอกอดตลอดเวลา'
    },
    {
      id: 'sockney',
      name: 'Sockney (ซ็อคนี่)',
      species: 'sock',
      title: '🧦 The Living Cozy Sock Pet',
      badge: 'น้องถุงเท้านุ่มฟูมีชีวิต',
      avatar: '🧦',
      furColor: '#ffb4d6',
      eyeShape: 'anime',
      blush: 'circles',
      clothes: { head: 'hat_ribbon', body: 'outfit_sweater', face: 'glass_round', neck: 'neck_bowtie', hand: 'prop_wand', shoes: 'shoe_bunny' },
      desc: 'น้องถุงเท้านุ่มฟูมีชีวิต ลายทางพาสเทล ตากระดุมแวววาว นุ่มฟูอบอุ่นเหมือนออกจากเครื่องอบผ้า'
    }
  ]
};

// Export for node tests if required
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_DATA;
}
