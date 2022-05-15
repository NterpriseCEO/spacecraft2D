export class Tileset {
	static image = document.getElementById("tileset");

	static AIR = {
		id: "air",
		x: 0, y: 0,
		canWalkThrough: true
	};
	static SOIL = {
		id: "soil",
		x: 20, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static GRASS = {
		id: "grass",
		x: 40, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static GRASS1 = {
		id: "grass1",
		x: 60, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static GRASS2 = {
		id: "grass2",
		x: 80, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static LEAVES = {
		id: "leaves",
		x: 100, y: 0,
		miningSpeed: 100,
		damage: 0,
		canWalkThrough: false,
		fuelLife: 1
	};
	static STRIPPED_LOG = {
		id: "stripped_log",
		x: 120, y: 0,
		miningSpeed: 0,
		damage: 0,
		canWalkThrough: false,
		canPlace: false,
		fuelLife: 4 
	};
	static LOG = {
		id: "log",
		x: 140, y: 0,
		miningSpeed: 0,
		damage: 0,
		canWalkThrough: false,
		canPlace: false,
		fuelLife: 5
	};
	static WOOD_BLOCK = {
		id: "wooden_block",
		x: 160, y: 0,
		miningSpeed: 2000,
		damage: 0,
		canWalkThrough: false,
		fuelLife: 4
	};
	static LAVA = {
		id: "lava",
		x: 180, y: 0,
		miningSpeed: 2000,
		damage: 0,
		canWalkThrough: true
	};
	static GLASS = {
		id: "glass",
		x: 220, y: 20,
		damage: 0,
		canWalkThrough: false,
		canPlace: false
	};
	static WINDOW = {
		id: "glass",
		x: 200, y: 20,
		damage: 0,
		miningSpeed: 2000,
		canWalkThrough: false,
	};
	static DOOR_INVENTORY = {
		id: "door_inventory",
		x: 240, y: 40,
		damage: 0,
		miningSpeed: 2000,
		canWalkThrough: false,
	};
	static DOOR_TOP_OPEN = {
		id: "door_top",
		x: 240, y: 20,
		damage: 0,
		miningSpeed: 2000,
		canWalkThrough: true
	};
	static DOOR_BOTTOM_OPEN = {
		id: "door_bottom",
		x: 260, y: 20,
		damage: 0,
		miningSpeed: 2000,
		canWalkThrough: true
	};
	static DOOR_TOP_CLOSED = {
		id: "door_top_closed",
		x: 300, y: 20,
		damage: 0,
		miningSpeed: 2000
	};
	static DOOR_BOTTOM_CLOSED = {
		id: "door_bottom_closed",
		x: 280, y: 20,
		damage: 0,
		miningSpeed: 2000
	};
	static SAND = {
		id: "sand",
		x: 200, y: 0,
		miningSpeed: 700,
		damage: 0,
		canWalkThrough: false,
		furnaceOutputAmount: 4,
		furnaceOutput: Tileset.GLASS
	};
	static BOULDER = {
		id: "boulder",
		x: 220, y: 0,
		miningSpeed: 100,
		damage: 0,
		canWalkThrough: true,
	};
	static ROCK = {
		id: "rock",
		x: 240, y: 0,
		miningSpeed: 4000,
		damage: 5,
		canWalkThrough: false
	};
	static GOLD_INGOT = {
		id: "gold_ingot",
		x: 700, y: 0,
		miningSpeed: 10000,
		damage: 0,
		canWalkThrough: true,
		canPlace: false
	};
	static GOLD = {
		id: "gold",
		x: 280, y: 0,
		miningSpeed: 8000,
		damage: 5,
		canWalkThrough: false,
		furnaceOutput: Tileset.GOLD_INGOT
	};
	static DIAMOND = {
		id: "diamond",
		x: 300, y: 0,
		miningSpeed: 12000,
		damage: 10,
		canWalkThrough: false
	};
	static COAL = {
		id: "coal",
		x: 320, y: 0,
		miningSpeed: 2000,
		damage: 5,
		canWalkThrough: false,
		fuelLife: 10
	};
	static STONE_PICKAXE = {
		id: "stone_pickaxe",
		x: 340, y: 0,
		miningSpeed: 100,
		itemHealth: 100,
		damage: 0,
		canPlace: false,
		miningIncrease: 3,
		minableItems: ["rock", "iron", "gold", "diamond", "furnace", "coal"]
	};
	static IRON_PICKAXE = {
		id: "iron_pickaxe",
		x: 360, y: 0,
		miningSpeed: 100,
		itemHealth: 300,
		damage: 0,
		canPlace: false,
		miningIncrease: 4,
		minableItems: ["rock", "iron", "gold", "diamond", "furnace", "coal"]
	};
	static GOLD_PICKAXE = {
		id: "gold_pickaxe",
		x: 340, y: 20,
		miningSpeed: 100,
		itemHealth: 200,
		damage: 0,
		canPlace: false,
		miningIncrease: 2,
		minableItems: ["rock", "iron", "gold", "diamond", "furnace", "coal"]
	};
	static DIAMOND_PICKAXE = {
		id: "diamond_pickaxe",
		x: 360, y: 20,
		miningSpeed: 100,
		itemHealth: 900,
		damage: 0,
		canPlace: false,
		miningIncrease: 6,
		minableItems: ["rock", "iron", "gold", "diamond", "furnace", "coal"]
	};
	static STONE_AXE = {
		id: "stone_axe",
		x: 400,y: 0,
		miningSpeed: 100,
		itemHealth: 100,
		damage: 0,
		canPlace: false,
		miningIncrease: 3,
		minableItems: ["tree"]
	};
	static IRON_AXE = {
		id: "iron_axe",
		x: 420,y: 0,
		miningSpeed: 100,
		itemHealth: 300,
		damage: 0,
		canPlace: false,
		miningIncrease: 5,
		minableItems: ["tree"]
	};
	static GOLD_AXE = {
		id: "gold_axe",
		x: 400,y: 20,
		miningSpeed: 100,
		itemHealth: 200,
		damage: 0,
		canPlace: false,
		miningIncrease: 2,
		minableItems: ["tree"]
	};
	static DIAMOND_AXE = {
		id: "diamond_axe",
		x: 420,y: 20,
		miningSpeed: 100,
		itemHealth: 900,
		damage: 0,
		canPlace: false,
		miningIncrease: 9,
		minableItems: ["tree"]
	};
	static STONE_SHOVEL = {
		id: "stone_shovel",
		x: 460,y: 0,
		miningSpeed: 100,
		itemHealth: 100,
		damage: 0,
		canPlace: false,
		miningIncrease: 3,
		minableItems: ["soil", "sand"]
	};
	static IRON_SHOVEL = {
		id: "iron_shovel",
		x: 480,y: 0,
		miningSpeed: 100,
		itemHealth: 300,
		damage: 0,
		canPlace: false,
		miningIncrease: 5,
		minableItems: ["soil", "sand"]
	};
	static GOLD_SHOVEL = {
		id: "gold_shovel",
		x: 460,y: 20,
		miningSpeed: 100,
		itemHealth: 200,
		damage: 0,
		canPlace: false,
		miningIncrease: 2,
		minableItems: ["soil", "sand"]
	};
	static DIAMOND_SHOVEL = {
		id: "diamond_shovel",
		x: 480,y: 20,
		miningSpeed: 100,
		itemHealth: 900,
		damage: 0,
		canPlace: false,
		miningIncrease: 9,
		minableItems: ["soil", "sand"]
	};
	//static LOG = {x:60,y:0,miningSpeed:2000,damage:2};
	static STICK = {
		id: "stick",
		x: 520, y: 0,
		miningSpeed: 0,
		damage: 0,
		canPlace: false,
		fuelLife: 1
	};
	static LADDER = {
		id: "ladder",
		x: 320, y: 20,
		miningSpeed: 0,
		damage: 0,
		canWalkThrough: true,
		fuelLife: 1
	};
	static STRING = {
		id: "string",
		x: 540, y: 0,
		miningSpeed: 0,
		damage: 0,
		canPlace: false
	}
	static CACTUS_LEAVES = {
		id: "cactus_leaves",
		x: 560, y: 0,
		miningSpeed: 100,
		damage: 3
	};
	static CRAFTING_BENCH = {
		id: "crafting_bench",
		x: 580, y: 0,
		miningSpeed: 100,
		damage: 3,
		canWalkThrough: true
	};
	static TORCH = {
		id: "torch",
		x: 600, y: 0,
		miningSpeed: 100,
		damage: 0,
		canWalkThrough: true,
		fuelLife: 2
	};
	static WATER = {
		id: "water",
		x: 620, y: 0,
		miningSpeed: 100,
		damage: 0,
		canWalkThrough: true,
		canMine: false
	};
	static FURNACE = {
		id: "furnace",
		x: 640, y: 0,
		miningSpeed: 10000,
		damage: 0,
		canWalkThrough: true
	};
	static FURNACE_HOT = {
		id: "hot_furnace",
		x: 660, y: 0,
		miningSpeed: 10000,
		damage: 0,
		canWalkThrough: true
	};
	static IRON_INGOT = {
		id: "iron_ingot",
		x: 680, y: 0,
		miningSpeed: 10000,
		damage: 0,
		canWalkThrough: true,
		canPlace: false
	};
	static IRON = {
		id: "iron",
		x: 260, y: 0,
		miningSpeed: 6000,
		damage: 5,
		canWalkThrough: false,
		furnaceOutput: Tileset.IRON_INGOT
	};

	static character = {
		id: "character",
		x: 0, y: 360
	};
	//Plant tileset
	static TREE = {
		id: "tree",
		x: 0, y: 0,
		w: 40, h: 120,
		miningSpeed: 10000,
		damage: 2
	};
	static CACTUS = {
		id: "cactus",
		x: 40, y: 0,
		w: 40, h: 120,
		miningSpeed: 10000,
		damage: 3
	};

	constructor() { }
}
