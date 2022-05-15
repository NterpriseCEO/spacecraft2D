import { Tileset } from "../universe_world_gen/TilesetTerrain.js";

const T = Tileset;

let craftingRecipes = {
	"100000000": [
		{ ingredients: [T.LOG], output: [{type: T.STRIPPED_LOG, amount:1}, {type: T.WOOD_BLOCK, amount: 4}] },
		{ ingredients: [T.STRIPPED_LOG], output: [{type: T.WOOD_BLOCK, amount: 4}, {type: T.STICK, amount: 8}] },
		{ ingredients: [T.LEAVES], output: [{type: T.STRING, amount: 1}, {type: T.STICK, amount: 4}] },
	],
	"010010000": [
		{ ingredients: [T.AIR, T.BOULDER, T.AIR, T.AIR, T.STICK, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.STONE_SHOVEL, amount: 1}] },
		{ ingredients: [T.AIR, T.IRON_INGOT, T.AIR, T.AIR, T.STICK, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.IRON_SHOVEL, amount: 1}] },
		{ ingredients: [T.AIR, T.GOLD_INGOT, T.AIR, T.AIR, T.STICK, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.GOLD_SHOVEL, amount: 1}] },
		{ ingredients: [T.AIR, T.DIAMOND, T.AIR, T.AIR, T.STICK, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.DIAMOND_SHOVEL, amount: 1}] }
	],
	"010010010": [
		{ ingredients: [T.AIR, T.BOULDER, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.STONE_PICKAXE, amount: 1}] },
		{ ingredients: [T.AIR, T.IRON_INGOT, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.IRON_PICKAXE, amount: 1}] },
		{ ingredients: [T.AIR, T.GOLD_INGOT, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.GOLD_PICKAXE, amount: 1}] },
		{ ingredients: [T.AIR, T.DIAMOND, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.DIAMOND_PICKAXE, amount: 1}] }
	],
	"110010010": [
		{ ingredients: [T.BOULDER, T.BOULDER, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.STONE_AXE, amount: 1}] },
		{ ingredients: [T.IRON_INGOT, T.IRON_INGOT, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.IRON_AXE, amount: 1}] },
		{ ingredients: [T.GOLD_INGOT, T.GOLD_INGOT, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.GOLD_AXE, amount: 1}] },
		{ ingredients: [T.DIAMOND, T.DIAMOND, T.AIR, T.AIR, T.STRING, T.AIR, T.AIR, T.STICK, T.AIR], output: [{type: T.DIAMOND_AXE, amount: 1}] }
	],
	"100100000": [
		{ ingredients: [T.COAL, T.AIR, T.AIR, T.STICK, T.AIR, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.TORCH, amount: 1}] }
	],
	"110110000": [
		{ ingredients: [T.WOOD_BLOCK, T.WOOD_BLOCK, T.AIR, T.STICK, T.STICK, T.AIR, T.AIR, T.AIR, T.AIR], output: [{type: T.CRAFTING_BENCH, amount: 1}] }
	],
	"010111010": [
		{ ingredients: [T.AIR, T.STICK, T.AIR, T.STICK, T.GLASS, T.STICK, T.AIR, T.STICK, T.AIR], output: [{type: T.WINDOW, amount:1}] }
	],
	"111101111": [
		{ ingredients: [T.ROCK, T.ROCK, T.ROCK, T.ROCK, T.AIR, T.ROCK, T.ROCK, T.ROCK, T.ROCK], output: [{type: T.FURNACE, amount: 1}] }
	],
	"101111101": [
		{ ingredients: [T.STICK, T.AIR, T.STICK, T.STICK, T.STICK, T.STICK, T.STICK, T.AIR, T.STICK], output: [{type: T.LADDER, amount: 4}] }
	],
	"111111111": [
		{ ingredients: [T.STICK, T.WOOD_BLOCK, T.WOOD_BLOCK, T.STICK, T.GLASS, T.WOOD_BLOCK, T.STICK, T.WOOD_BLOCK, T.WOOD_BLOCK], output: [{type: T.DOOR_INVENTORY, amount: 1}] }
	]
};
export {
	craftingRecipes
};
