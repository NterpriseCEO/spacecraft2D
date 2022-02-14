export class Tileset {
	static image = document.getElementById("tileset");

	static AIR = {
		id: "air",
		x: 0, y: 0,
		canWalkThrough: true
	};
	static S = {
		id: "soil",
		x: 20, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static G = {
		id: "grass",
		x: 40, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static G1 = {
		id: "grass1",
		x: 60, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static G2 = {
		id: "grass2",
		x: 80, y: 0,
		miningSpeed: 1000,
		damage: 0,
		canWalkThrough: false
	};
	static LEA = {
		id: "leaves",
		x: 100, y: 0,
		miningSpeed: 100,
		damage: 0,
		canWalkThrough: false,
		fuelLife: 1
	};
	static STRPD_LOG = {
		id: "stripped_log",
		x: 120, y: 0,
		miningSpeed: 0,
		damage: 0,
		canWalkThrough: false,
		fuelLife: 4 
	};
	static LOG = {
		id: "log",
		x: 140, y: 0,
		miningSpeed: 0,
		damage: 0,
		canWalkThrough: false,
		fuelLife: 5
	};
	static WD_BLK = {
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
	static SA = {
		id: "sand",
		x: 200, y: 0,
		miningSpeed: 700,
		damage: 0,
		canWalkThrough: false
	};
	static BLDR = {
		id: "boulder",
		x: 220, y: 0,
		miningSpeed: 100,
		damage: 0,
		canWalkThrough: true,
	};
	static R = {
		id: "rock",
		x: 240, y: 0,
		miningSpeed: 4000,
		damage: 5,
		canWalkThrough: false
	};
	static GLD = {
		id: "gold",
		x: 280, y: 0,
		miningSpeed: 8000,
		damage: 5,
		canWalkThrough: false,
		furnaceOutput: Tileset.GLD_INGOT
	};
	static DMND = {
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
	static STN_PKX = {
		id: "stone_pickaxe",
		x: 340, y: 0,
		miningSpeed: 100,
		damage: 0,
		canPlace: false,
		miningIncrease: 3,
		minableItems: ["rock", "iron", "gold", "diamond", "furnace"]
	};
	static STN_AXE = {
		id: "stone_axe",
		x: 400,y: 0,
		miningSpeed: 100,
		damage: 0,
		canPlace: false,
		miningIncrease: 3,
		minableItems: ["tree"]
	};
	static IRON_PICKAXE = {
		id: "iron_pickaxe",
		x: 340, y: 0,
		miningSpeed: 100,
		damage: 0,
		canPlace: false,
		miningIncrease: 3,
		minableItems: ["rock", "iron", "gold", "diamond", "furnace"]
	};
	//static LOG = {x:60,y:0,miningSpeed:2000,damage:2};
	static STK = {
		id: "stick",
		x: 520, y: 0,
		miningSpeed: 0,
		damage: 0,
		canPlace: false,
		fuelLife: 1
	};
	static STRING = {
		id: "string",
		x: 540, y: 0,
		miningSpeed: 0,
		damage: 0,
		canPlace: false
	}
	static C_LEAVE = {
		id: "cactus_leaves",
		x: 560, y: 0,
		miningSpeed: 100,
		damage: 3
	};
	static C_BENCH = {
		id: "crafting_bench",
		x: 580, y: 0,
		miningSpeed: 100,
		damage: 3,
		canWalkThrough: true
	};
	static TRCH = {
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
		canWalkThrough: true
	};
	static FRNC = {
		id: "furnace",
		x: 640, y: 0,
		miningSpeed: 10000,
		damage: 0,
		canWalkThrough: true
	};
	static FRNC_HOT = {
		id: "hot_furnace",
		x: 660, y: 0,
		miningSpeed: 10000,
		damage: 0,
		canWalkThrough: true
	};
	static IR_NGT = {
		id: "iron_ingot",
		x: 680, y: 0,
		miningSpeed: 10000,
		damage: 0,
		canWalkThrough: true,
		canPlace: false
	};
	static IR = {
		id: "iron",
		x: 260, y: 0,
		miningSpeed: 6000,
		damage: 5,
		canWalkThrough: false,
		furnaceOutput: Tileset.IR_NGT
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
