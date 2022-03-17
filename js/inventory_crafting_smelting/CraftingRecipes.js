import { Tileset } from "../universe_world_gen/TilesetTerrain.js";

const T = Tileset;

let craftingRecipes = {
	"100000000": [
		{ ingredients: [T.LOG], output: [{type: T.STRPD_LOG, amount:1}, {type: T.WD_BLK, amount: 4}] },
		{ ingredients: [T.STRPD_LOG], output: [{type: T.WD_BLK, amount: 4}] },
		{ ingredients: [T.LEA], output: [{type: T.STRING, amount: 1}, {type: T.TRCH, amount: 1}] },
	],
	"010010010": [
		{ ingredients: [T.AIR, T.BLDR, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STK, T.AIR], output: [{type: T.STN_PKX, amount: 1}] },
		{ ingredients: [T.AIR, T.IR_NGT, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STK, T.AIR], output: [{type: T.IRON_PICKAXE, amount: 1}] }
	],
	"110010010": [
		{ ingredients: [T.BLDR, T.BLDR, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STK, T.AIR], output: [{type: T.STN_AXE, amount: 1}] }
	],
	"100100000": [
		{ ingredients: [T.COAL, T.AIR, T.AIR, T.STK, T.AIR, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.TRCH, amount: 1}] }
	],
	"110110000": [
		{ ingredients: [T.WD_BLK, T.WD_BLK, T.AIR, T.STK, T.STK, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.C_BENCH, amount: 1}] }
	],
	"111101111": [
		{ ingredients: [T.R, T.R, T.R, T.R, T.AIR, T.R, T.R, T.R, T.R], output: [{type: T.FRNC}] }
	]
};
export {
	craftingRecipes
};
