let craftingRecipies = {
	"100000000": [
		{ ingredients: ["log"], output: [["stripped_log"]] },
		{ ingredients: ["stripped_log"], output: [["stick", 4], ["wooden_block"]] },
		{ ingredients: ["leaves"], output: [["string"], ["torch"]] },
	],
	"010010010": [
		{ ingredients: ["air", "boulder", "air", "air", "string", "air", "air", "stick", "air"], output: [["stone_pickaxe"]] }
	],
	"110010010": [
		{ ingredients: ["boulder", "boulder", "air", "air", "string", "air", "air", "stick", "air"], output: [["stone_axe"]] }
	],
	"100100000": [
		{ ingredients: ["coal", "air", "air", "stick", "air", "air", "air", "air", "air"], output: [["torch"]] }
	],
	"110110000": [
		{ ingredients: ["wooden_block", "wooden_block", "air", "stick", "stick", "air", "air", "air", "air"], output: [["crafting_bench"]] }
	],
	"111101111": [
		{ ingredients: ["rock", "rock", "rock", "rock", "air", "rock", "rock", "rock", "rock"], output: [["furnace"]] }
	]
};
export {
	craftingRecipies
};
