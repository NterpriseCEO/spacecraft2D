import { InventoryItems } from "../inventory_crafting_smelting/inventoryItems.js";
import { Tileset } from "../universe_world_gen/tilesetTerrain.js";

let furnace = 0;

export class Furnace {

	#furnaceNo = furnace++;
	#furnaceBoxes;
	#fuelLife;
	#output;
	#metre;
	#furnacePos;

	
	#furnaceItems = [null, null, null];
	
	static clone = document.getElementById("invBox").content.querySelector(".itemBox");
	static furnaces = [];
	static currentFurnace = 0;
	#furnaceID = 0;

	#smeltingTimer = 0;
	#smeltingTime = 0;

	constructor() {

		this.#furnaceBoxes = document.getElementsByClassName("furnaceItem");

		Furnace.clone.classList.remove("inventoryItem");

		for(let i = 0; i < this.#furnaceItems.length; i++) {
			this.setFurnaceItem(i, 0, Tileset.AIR, 0);
		}

		this.#fuelLife = -1;
		this.#metre = document.querySelector("#furnace meter");
		this.#furnacePos = [0, 0];

		this.#furnaceID = Furnace.furnaces.length;

		let _this = this;

		window.addEventListener("openFurnace", function (e) {
			if(_this.#furnaceID === Furnace.currentFurnace) {
				document.getElementById("crafting").classList.add("hide");
				document.getElementById("inventory").classList.remove("hide");
				document.getElementById("furnace").classList.remove("hide");

				_this.#renderFurnaceItems();

				_this.#furnacePos = e.detail;
			}
		});
	}

	static initFurnace() {
		Furnace.addFurnaceBox(0, "furnaceItem", "input");
		Furnace.addFurnaceBox(1, "furnaceFuel", "input");
		Furnace.addFurnaceBox(2, "furnaceOutput", "output");
	}

	setFurnaceItem(i, amount, type, itemHealth) {
		this.#furnaceItems[i] = { amount: amount, type: type, itemHealth: itemHealth };
	}

	decrementFurnaceItem(i) {
		let furnaceItem = this.getFurnaceItem(i);
		furnaceItem.amount--;
		this.setFurnaceItem(i, furnaceItem.amount, furnaceItem.type, furnaceItem.itemHealth);
	}

	setFuelLife(fuelLife) {
		this.#furnaceItems[1].fuelLife-fuelLife;
	}

	getFurnaceItem(i) {
		return this.#furnaceItems[i];
	}

	static addFurnace(furnace) {
		Furnace.furnaces.push(furnace);
	}

	#renderFurnaceItems() {
		for(let i = 0; i < this.#furnaceItems.length; i++) {
			let furnaceItem = this.getFurnaceItem(i),
				fType = furnaceItem.type;

			let furnaceItemBox = this.#furnaceBoxes[i],
				invBlock = furnaceItemBox.querySelector(".inventoryBlock");

			invBlock.style.backgroundPosition = "-" + (fType.x * 4) + "px -" + (fType.y * 4) + "px";
			invBlock.querySelector("span").innerHTML = furnaceItem.amount > 0 ? furnaceItem.amount : "";
		}
	}

	checkRecipes() {
		if(this.#furnaceItems[0].type == Tileset.AIR || this.#furnaceItems[1].type == Tileset.AIR) {
			return;
		}

		switch(this.#furnaceItems[1].type)	{
			case Tileset.LEA: case Tileset.STRPD_LOG:
			case Tileset.LOG: case Tileset.WD_BLK:
			case Tileset.COAL: case Tileset.STK:
			case Tileset.TRCH:
				break;
			default:
				return;
		}

		this.#fuelLife = this.#furnaceItems[1].type.fuelLife;

		let furnaceOutput = this.#furnaceItems[0].type.furnaceOutput;

		console.log(this.#furnaceItems[0]);

		if(furnaceOutput == null) {
			return;
		}

		let _this = this;

		this.#smeltingTimer = setInterval(() => {

			if(_this.#fuelLife === 0) {
				_this.#fuelLife = _this.getFurnaceItem(1).type.fuelLife;
				_this.decrementFurnaceItem(1);
			}

			if(_this.getFurnaceItem(1).amount == 0) {
				cancelInterval(_this.#smeltingTimer);
			}

			_this.#smeltingTime+=10;
			_this.#metre.value = _this.#smeltingTime;

			if(_this.#smeltingTime == 100) {
				_this.setFuelLife(--_this.#fuelLife);
				console.log("this is the fuel life: " + _this.#fuelLife);
				_this.setFurnaceItem(2, _this.getFurnaceItem(2).amount + 1, furnaceOutput, null);
				_this.decrementFurnaceItem(0);
				_this.#renderFurnaceItems();
				_this.#smeltingTime = 0;
			}
		},1000);
	}

	// checkRecipes() {
	// 	if (InventoryItems.items[43 + this.#furnaceNo].type !== null && InventoryItems.items[44 + this.#furnaceNo].type !== null) {
	// 		if (InventoryItems.items[45 + this.#furnaceNo].type === null || InventoryItems.items[45 + this.#furnaceNo].type.id === this.#output) {

	// 			let box0 = this.#furnaceBoxes[0 + this.#furnaceNo].getElementsByClassName("inventoryBlock")[0],
	// 				box1 = this.#furnaceBoxes[1 + this.#furnaceNo].getElementsByClassName("inventoryBlock")[0],
	// 				box2 = this.#furnaceBoxes[2 + this.#furnaceNo].getElementsByClassName("inventoryBlock")[0];
	// 			if (InventoryItems.items[45 + this.#furnaceNo].type === null) {
	// 				box2.classList.add("hide");
	// 				box2.style.backgroundPosition = "";
	// 				box2.getElementsByTagName("span")[0].innerText = 0;
	// 			}

	// 			if (InventoryItems.items[44 + this.#furnaceNo].type.id === "coal" || InventoryItems.items[44 + this.#furnaceNo].type.id === "log" ||
	// 				InventoryItems.items[44 + this.#furnaceNo].type.id === "stripped_log" || InventoryItems.items[44 + this.#furnaceNo].type.id === "stick" ||
	// 				InventoryItems.items[44 + this.#furnaceNo].type.id === "leaves" || InventoryItems.items[44 + this.#furnaceNo].type.id === "wooden_block") {

	// 				if (this.#fuelLife === -1) {
	// 					this.#fuelLife = InventoryItems.items[44 + this.#furnaceNo].type.fuelLife;
	// 				}
	// 				for (let [key, value] of Object.entries(Tileset)) {
	// 					if (value.id == InventoryItems.items[43 + this.#furnaceNo].type.id) {
	// 						this.#output = value.furnaceOutput;
	// 					} else if (value.id === this.#output) {
	// 						//Set item health width to 0
	// 						//Set box backgroundPosition to tileset xy coords
	// 						this.#metre.value = 0;

	// 						window.dispatchEvent(new CustomEvent("toggleFurnaceHeat", { detail: { open: true, x: this.#furnacePos[0], y: this.#furnacePos[1] } }));

	// 						let _this = this;
	// 						_this.#interval = setInterval(function () {
	// 							_this.#metre.value += 10;
	// 							if (_this.#metre.value === 100) {
	// 								if (InventoryItems.items[45 + _this.#furnaceNo].type === null) {
	// 									InventoryItems.setInventoryItem(45 + _this.#furnaceNo, 0, value);
	// 								}

	// 								InventoryItems.items[43 + _this.#furnaceNo].amount--;
	// 								InventoryItems.items[45 + _this.#furnaceNo].amount++;
	// 								_this.#metre.value = 0;
	// 								_this.#fuelLife--;

	// 								if (_this.#fuelLife === 0) {
	// 									_this.#fuelLife = InventoryItems.items[44 + _this.#furnaceNo].type.fuelLife;
	// 									InventoryItems.items[44 + this.#furnaceNo].amount--;
	// 									box1.setAttribute("data-amount", InventoryItems.items[44 + _this.#furnaceNo].amount);
	// 									box1.getElementsByTagName("span")[0].innerText = InventoryItems.items[44 + _this.#furnaceNo].amount;
	// 								}
	// 								if (InventoryItems.items[44 + _this.#furnaceNo].amount === 0) {
	// 									InventoryItems.setInventoryItem(44 + _this.#furnaceNo, 0, null);
	// 									box1.classList.add("hide");
	// 									box1.setAttribute("data-amount", 0);
	// 									box1.getElementsByTagName("span")[0].innerText = 0;
	// 									box1.style.backgroundPosition = "";
	// 									_this.#fuelLife = -1;
	// 									window.dispatchEvent(new CustomEvent("toggleFurnaceHeat", { detail: { open: false, x: _this.#furnacePos[0], y: _this.#furnacePos[1] } }));
	// 									clearInterval(_this.#interval);
	// 								}

	// 								if (InventoryItems.items[43 + _this.#furnaceNo].amount === 0) {
	// 									InventoryItems.setInventoryItem(43 + _this.#furnaceNo, 0, null);
	// 									box0.classList.add("hide");
	// 									box0.setAttribute("data-amount", 0);
	// 									box0.getElementsByTagName("span")[0].innerText = 0;
	// 									box0.style.backgroundPosition = "";
	// 									window.dispatchEvent(new CustomEvent("toggleFurnaceHeat", { detail: { open: false, x: _this.#furnacePos[0], y: _this.#furnacePos[1] } }));
	// 									clearInterval(_this.#interval);
	// 								}
	// 								box2.style.backgroundPosition = "-" + (value.x * 4) + "px " + "-" + (value.y * 4) + "px";
	// 								box2.setAttribute("data-amount", InventoryItems.items[45 + _this.#furnaceNo].amount);
	// 								box2.classList.remove("hide")
	// 								box2.getElementsByTagName("span")[0].innerText = InventoryItems.items[45 + _this.#furnaceNo].amount;

	// 								box0.setAttribute("data-amount", InventoryItems.items[43 + _this.#furnaceNo].amount);
	// 								box0.getElementsByTagName("span")[0].innerText = InventoryItems.items[43 + _this.#furnaceNo].amount;
	// 							}
	// 						}, 1000);
	// 						return;
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	cancelSmelting() {
		if (InventoryItems.items[44 + this.#furnaceNo].amount === 0) {
			this.#fuelLife = -1;
		}
		this.metre.value = 0;
		window.dispatchEvent(new CustomEvent("toggleFurnaceHeat", { detail: { open: false, x: this.#furnacePos[0], y: this.#furnacePos[1] } }));
		clearInterval(this.#smeltingTimer);
	}

	static addFurnaceBox(i, selector, type) {
		//Sets the invitem to amount = 0, type = null
		// InventoryItems.setInventoryItem(i, 0, null);
		//Creates inventoryItem from the template and adds it to the screen

		Furnace.clone.setAttribute("data-index", i);
		let clone = Furnace.clone.cloneNode(true);
		clone.classList.add("furnaceItem");
		clone.classList.add(type);
		clone.classList.add(selector);

		document.getElementById("furnace").append(clone);
	}
}
