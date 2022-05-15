import { craftingRecipes } from "./craftingRecipes.js";
import { Tileset } from "../universe_world_gen/TilesetTerrain.js";

export class Crafting {
	static craftingBoxes;
	#invBoxTemp;
	#craftingInputsOutputs = [null, null, null, null, null, null, null, null, null, null, null];

	#current = 0;

	static #i = 0;
	static #clone;

	static craftingBenches = [];

	static currentCraftingBench = 0;

	constructor() {
		//Initializes the crafting boxes variables
		Crafting.craftingBoxes = document.getElementsByClassName("craftingItem");
		this.#invBoxTemp = document.getElementById("invBox");
		Crafting.#clone = this.#invBoxTemp.content.querySelector(".itemBox");
		Crafting.#clone.classList.remove("inventoryItem");

		//Sets the craftingItems to be air blocks
		for(let i = 0; i < this.#craftingInputsOutputs.length; i++) {
			this.setCraftingItem(i, 0, Tileset.AIR, 0);
		}

		//Sets the current crafting bench equal to the length of craftingBenches
		this.#current = Crafting.craftingBenches.length;

		let current = this.#current;

		let _this = this;

		//Opens the crafting table and shows all 9 crafting boxes
		window.addEventListener("openCrafting", function () {
			if(current == Crafting.currentCraftingBench) {
				_this.loadCraftingBench(true);
			}
		});
	}

	static initCrafting() {
		for (let i = 0; i < 11; i++) {
			//Sets the invitem to amount = 0, type = null
			//Creates craftingItem from the template and adds it to the screen

			Crafting.#clone.setAttribute("data-index", Crafting.#i);
			let clone = Crafting.#clone.cloneNode(true);
			clone.classList.add("craftingItem");
			clone.classList.add("input");
			//Adds the advancedCrafting class to the crafting table if neccessary
			if (Crafting.#i == 2 || Crafting.#i == 5 || Crafting.#i == 6 || Crafting.#i == 7 || Crafting.#i == 8) {
				clone.classList.add("advancedCrafting");
			}
			//Adds craftingOutput class to tje crafting table if neccessary
			if (Crafting.#i == 9 || Crafting.#i == 10) {
				clone.classList.add("craftingOutput");
				clone.classList.add("output");
			}

			Crafting.#i++;

			//Add the crafting box to the crafting table
			document.getElementById("crafting").append(clone);
		}
	}

	static addCraftingBench(craftingBench) {
		Crafting.craftingBenches.push(craftingBench);
	}

	loadCraftingBench(isAdvanced) {
		//Loads the crafting table that was clicked on
		document.getElementById("furnace").classList.add("hide");
		let craftingWrapper = document.getElementById("crafting");

		//Checks if the crafting items match a crafting recipe
		try {
			Crafting.craftingBenches[Crafting.currentCraftingBench].checkRecipes();
		} catch(e) {
			console.log(e);
		}

		//Shows the advanced crafting boxes when using a full sized crafting table
		craftingWrapper.classList.remove("advancedCrafting");
		if(isAdvanced) {
			let advancedCrafting = document.getElementsByClassName("advancedCrafting");
			craftingWrapper.classList.add("advancedCrafting");
			
			for (let i = 0; i < advancedCrafting.length; i++) {
				advancedCrafting[i].classList.remove("hide");
			}
			document.getElementById("crafting").classList.remove("smallCrafting");
			document.getElementById("inventory").classList.remove("hide");
		}
	
		//Renders all items in the crafting table
		for(let i = 0; i < 9; i++) {
			this.#renderCraftingItem(i);
		}
	}

	//Sets the values of a specific crafting item
	setCraftingItem(i, amount, type, itemHealth) {
		this.#craftingInputsOutputs[i] = { amount: amount, type: type, itemHealth: itemHealth };
	}

	//Gets a specific crafting item
	getCraftingItem(i) {
		return this.#craftingInputsOutputs[i];
	}

	getCraftingItems() {
		this.#craftingInputsOutputs.splice(9);
		return this.#craftingInputsOutputs.map(item => item.type).filter(item => item != Tileset.AIR);
	}

	//Decrements the value of a specific crafting item
	decrementCraftingItem(i) {
		let craftingItem = this.getCraftingItem(i);
		craftingItem.amount--;
		this.setCraftingItem(i, craftingItem.amount, craftingItem.amount > 0 ? craftingItem.type : Tileset.AIR, craftingItem.itemHealth);
	}

	//Renders a spefiic crafting item
	#renderCraftingItem(i) {
		let craftingItem = this.getCraftingItem(i),
			cType = craftingItem.type;

		let craftingItemBox = Crafting.craftingBoxes[i],
			invBlock = craftingItemBox.querySelector(".inventoryBlock");

		//Sets the position of the inventory block image which corresponds to a spefic item in the tileset
		invBlock.style.backgroundPosition = "-" + (cType.x * 4) + "px -" + (cType.y * 4) + "px";
		invBlock.querySelector("span").innerHTML = craftingItem.amount > 0 ? craftingItem.amount : "";

		// invBlock.querySelector(".itemHealth").max = cType.itemHealth;
	}

	checkRecipes() {
		//Clears the crafting table outputs
		for (let i = 0; i < 2; i++) {
			let output = Crafting.craftingBoxes[9 + i].getElementsByClassName("inventoryBlock")[0];
			output.style.backgroundPosition = "";
			output.getElementsByTagName("span")[0].innerText = "";

			this.setCraftingItem(9 + i, 0, Tileset.AIR, 0);
		}

		let value = "",
			count = 0,
			correct = true,
			correctRecipe;

		//Checks how many boxes in the crafting table are filled
		this.#craftingInputsOutputs.slice(0, 9).forEach((i) => {
			value+= i.type == Tileset.AIR ? "0" : "1";
			if(i.type !== Tileset.AIR) {
				count++;
			}
		});

		if(count == 1) {
			value = "100000000";
		}

		if(count == 0) {
			return;
		}

		//Loops through all recipes
		craftingRecipes[value].every((recipe) => {
			if(count > 1) {
				//Checks if each crafting item in the crafting table matches each item in the recipe
				correct = this.#craftingInputsOutputs.slice(0, -2).every((input, i) => JSON.stringify(input.type) == JSON.stringify(recipe.ingredients[i]));
			}else {
				//Checks if the amount of mataching crafting items in the crafting table = 1
				correct = this.#craftingInputsOutputs.filter((input, i) => JSON.stringify(input.type) == JSON.stringify(recipe.ingredients[0])).length == 1;
			}

			//Sets the correctRecipe and breaks the loop if the recipe is correct
			if(correct) {
				correctRecipe = recipe;
				return false;
			}
			return true;
		});

		//Sets the crafting table outputs
		correctRecipe.output.forEach((recipe, i) => {
			const itemHealth = recipe.type.miningIncrease ? recipe.type.itemHealth : null;

			this.setCraftingItem(9+i, recipe.amount, recipe.type, itemHealth);
			this.#renderCraftingItem(9+i);
		});
	}

	//Decrements each item in the crafting table
	completeRecipe() {
		for(let i = 0; i < 9; i++) {
			this.decrementCraftingItem(i);

			this.#renderCraftingItem(i);
		}
		this.checkRecipes();
	}
}
