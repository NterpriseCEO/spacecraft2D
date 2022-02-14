import { craftingRecipies } from "./CraftingRecipies.js";
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
		Crafting.craftingBoxes = document.getElementsByClassName("craftingItem");
		this.#invBoxTemp = document.getElementById("invBox");
		Crafting.#clone = this.#invBoxTemp.content.querySelector(".itemBox");
		Crafting.#clone.classList.remove("inventoryItem");

		for(let i = 0; i < this.#craftingInputsOutputs.length; i++) {
			this.setCraftingItem(i, 0, Tileset.AIR, 0);
		}

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
			//Creates inventoryItem from the template and adds it to the screen

			Crafting.#clone.setAttribute("data-index", Crafting.#i);
			let clone = Crafting.#clone.cloneNode(true);
			clone.classList.add("craftingItem");
			clone.classList.add("input");
			if (Crafting.#i == 2 || Crafting.#i == 5 || Crafting.#i == 6 || Crafting.#i == 7 || Crafting.#i == 8) {
				clone.classList.add("advancedCrafting");
			}
			if (Crafting.#i == 9 || Crafting.#i == 10) {
				clone.classList.add("craftingOutput");
				clone.classList.add("output");
			}

			Crafting.#i++;

			document.getElementById("crafting").append(clone);
		}
	}

	static addCraftingBench(craftingBench) {
		Crafting.craftingBenches.push(craftingBench);
	}

	loadCraftingBench(isAdvanced) {

		document.getElementById("furnace").classList.add("hide");

		Crafting.craftingBenches[Crafting.currentCraftingBench].checkRecipes();
		
		if(isAdvanced) {
			let advancedCrafting = document.getElementsByClassName("advancedCrafting");
			for (let i = 0; i < advancedCrafting.length; i++) {
				advancedCrafting[i].classList.remove("hide");
			}
			document.getElementById("crafting").classList.remove("smallCrafting");
			document.getElementById("inventory").classList.remove("hide");
		}
		
		let cBench = Crafting.craftingBenches[Crafting.currentCraftingBench];
	
		for(let i = 0; i < 9; i++) {
			let craftingItem = cBench.getCraftingItem(i),
				cType = craftingItem.type;

			let craftingItemBox = Crafting.craftingBoxes[i],
				invBlock = craftingItemBox.querySelector(".inventoryBlock");
			
			invBlock.style.backgroundPosition = "-" + (cType.x * 4) + "px -" + (cType.y * 4) + "px";
			invBlock.querySelector("span").innerHTML = craftingItem.amount > 0 ? craftingItem.amount : "";
		}
	}

	setCraftingItem(i, amount, type, itemHealth) {
		this.#craftingInputsOutputs[i] = { amount: amount, type: type, itemHealth: itemHealth };
	}

	getCraftingItem(i) {
		return this.#craftingInputsOutputs[i];
	}

	checkRecipes() {
		for (let i = 0; i < 2; i++) {

			let box2 = Crafting.craftingBoxes[9 + i].getElementsByClassName("inventoryBlock")[0];
			box2.style.backgroundPosition = "";
			box2.setAttribute("data-amount", 0);
			box2.getElementsByTagName("span")[0].innerText = "";

			this.setCraftingItem(9 + i, 0, Tileset.AIR, 0);
		}

		let value = "",
			count = 0,
			correct = true,
			//itemsAmnt = 0,
			output;
		//Loop through all crafting boxes
		for (let i = 0; i < 9; i++) {
			//Append 1/0 to value variables depending on if crafting box has content
			if (this.getCraftingItem(i).type != Tileset.AIR) {
				value += "1";
				count++;
			} else {
				value += "0";
			}
		}

		if (count == 1) {
			value = "100000000";
		}

		try {
			//Loop through crafting recipes within the object property of "value"
			for (let i = 0; i < craftingRecipies[value].length; i++) {
				let recipe = craftingRecipies[value][i];

				//If there was more than 1 item in the crafting table
				if (value != "100000000") {
					//Loop through all boxes in crafting table
					for (let k = 0; k < 9; k++) {
						/*If there's an item in the box check if it matches
						  the item at that position in the crafting recipe*/
						let type = this.getCraftingItem(k).type;
						console.log("This is the type: " + JSON.stringify(type));
						if (type != Tileset.AIR) {
							//If not matching, set correct to false
							if (recipe.ingredients[k] != type.id) {
								correct = false;
							}
							//If all recipe ingredients checked, set output to recipe output
							if (k == recipe.ingredients.length) {
								output = recipe.output;
								break;
							}
						}
					}
					//If loop finished and still correct, set output to recipe output
					console.log("correct: " + correct);
					if (correct) {
						output = recipe.output;
						break;
					}
				} else {
					/*If only one ingredient, loop through crafting boxes
					  and check if one of them matches the crafting recipe*/
					try {
						for (let k = 0; k < 9; k++) {
							let type = this.getCraftingItem(k).type;
							if (type != null) {
								if (recipe.ingredients[0] == type.id) {
									output = recipe.output;
									break;
									//itemsAmnt++;
								}
							}
						}
					} catch (e) {
						console.log(e);
					}
				}
			}
		} catch (e) {
			correct = false;
		}
		try {
			if (correct) {
				//If correct, loop through objects in tileset
				for (let i = 0; i < output.length; i++) {
					//If output id matches id of object set crafting outputs to this item
					for (let [key, value] of Object.entries(Tileset)) {
						if (value.id == output[i][0]) {
							let itemHealth = (value.id != "stone_pickaxe") && (value.id != "stone_axe") ? null : 100;
							
							let box = Crafting.craftingBoxes[9 + i].getElementsByClassName("inventoryBlock")[0];
							//Set item health width to 0
							box.getElementsByClassName("itemHealth")[0].style.width = 0;
							//Set box backgroundPosition to tileset xy coords
							let val = (output[i][1] || 1);
							this.setCraftingItem(9 + i, val, value, itemHealth);
	
							box.style.backgroundPosition = "-" + (value.x * 4) + "px " + "-" + (value.y * 4) + "px";
	
							box.classList.remove("hide");
							box.getElementsByTagName("span")[0].innerText = val;
							//If item should have health, set health to 100%
							if (itemHealth == 100) {
								box.getElementsByClassName("itemHealth")[0].style.width = "100%";
							}
							break;
						}
					}
				}
			} else {
				//If not correct, hide crafting output item
				let box = Crafting.craftingBoxes[9].getElementsByClassName("inventoryBlock")[0];
				box.classList.add("hide");
			}
		} catch(e) {
			//Error in recipe
		}
	}

	completeRecipe() {
		let complete = false;
		//Loop through boxes in crafting table
		for (let i = 0; i < 11; i++) {
			//Loop through boxes in crafting
			let box = Crafting.craftingBoxes[i].getElementsByClassName("inventoryBlock")[0];
			//If not crafting output remove 1 item
			if (i != 9 && i != 10) {
				let item = this.getCraftingItem(i);
				console.log(item.amount);
				if(item.amount-1 > 0) {
					this.setCraftingItem(i, item.amount - 1, item.type, item.health);
				}else {
					this.setCraftingItem(i, 0, Tileset.AIR, 0);
					for(let j = 0; j < 2; j++) {
						let box2 = Crafting.craftingBoxes[9 + j].getElementsByClassName("inventoryBlock")[0];
						box2.style.backgroundPosition = "";
						box2.querySelector("span").innerText = "";
						this.setCraftingItem(9 + j, 0, Tileset.AIR, 0);
					}
					box.style.backgroundPosition = "";
				}
				box.querySelector("span").innerText = item.amount > 1 ? item.amount - 1 : "";
			}

			//If no items in box, set complete to true and hide item in box
			// if (parseInt(box.getAttribute("data-amount")) == 0) {
			// 	complete = true;
			// 	this.setCraftingItem(i, 0, null, null);

			// 	box.classList.add("hide");
			// 	box.style.backgroundPosition = "";
			// 	box.getElementsByTagName("span")[0].innerText = 0;
			// }
			// if (complete) {
			// 	/*If cannot craft anything else, hide
			// 	  crafting outputs and set outputs amount to 0*/
			// 	for (let j = 0; j < 2; j++) {
			// 		let box2 = Crafting.#craftingBoxes[9 + j].getElementsByClassName("inventoryBlock")[0];
			// 		box2.classList.add("hide");
			// 		box2.style.backgroundPosition = "";
			// 		box2.getElementsByTagName("span")[0].innerText = 0;
			// 	}
			// }
		}
		this.checkRecipes();
	}
	// static #addInvBox(i) {
	// 	//Sets the invitem to amount = 0, type = null
	// 	InventoryItems.E(0, null, null);
	// 	//Creates inventoryItem from the template and adds it to the screen

	// 	Crafting.#clone.getElementsByClassName("inventoryBlock")[0].setAttribute("data-index", i);
	// 	let clone = Crafting.#clone.cloneNode(true);
	// 	clone.classList.add("craftingItem");
	// 	clone.classList.add("input");
	// 	if (i == 34 || i == 37 || i == 38 || i == 39 || i == 40) {
	// 		clone.classList.add("advancedCrafting");
	// 	}
	// 	if (i == 41 || i == 42) {
	// 		clone.classList.add("craftingOutput");
	// 		clone.classList.add("output");
	// 	}
	// 	document.getElementById("crafting").append(clone);
	// }

	// static #addCraftingBox() {
	// 	//Sets the invitem to amount = 0, type = null
	// 	InventoryItems.addInventoryItem(0, null, null);
	// 	//Creates inventoryItem from the template and adds it to the screen

	// 	Crafting.#clone.getElementsByClassName("inventoryBlock")[0].setAttribute("data-index", Crafting.#i);
	// 	let clone = Crafting.#clone.cloneNode(true);
	// 	clone.classList.add("craftingItem");
	// 	clone.classList.add("input");
	// 	if (Crafting.#i == 2 || Crafting.#i == 5 || Crafting.#i == 6 || Crafting.#i == 7 || Crafting.#i == 8) {
	// 		clone.classList.add("advancedCrafting");
	// 	}
	// 	if (Crafting.#i == 9 || Crafting.#i == 10) {
	// 		clone.classList.add("craftingOutput");
	// 		clone.classList.add("output");
	// 	}

	// 	Crafting.#i++;

	// 	document.getElementById("crafting").append(clone);
	// }
}
