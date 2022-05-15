import { InventoryItems } from "./InventoryItems.js";
import { Tileset } from "../universe_world_gen/TilesetTerrain.js";

let furnace = 0;

export class Furnace {

	#furnaceNo = furnace++;
	#furnaceBoxes;
	#fuelLife;
	#output;
	#metre;
	#furnacePos;

	#xPos = 0;
	#yPos = 0;
	
	#furnaceItems = [null, null, null];
	
	static clone = document.getElementById("invBox").content.querySelector(".itemBox");
	static furnaces = [];
	static currentFurnace = 0;
	#furnaceID = 0;

	#smeltingTimer = 0;
	#smeltingTime = 0;

	constructor(x, y) {

		this.#xPos = x;
		this.#yPos = y;

		//References all the furnace boxes
		this.#furnaceBoxes = document.getElementsByClassName("furnaceItem");

		//removes sthe inventoryItem class from the clone
		Furnace.clone.classList.remove("inventoryItem");

		//Sets each furnace item to air
		for(let i = 0; i < this.#furnaceItems.length; i++) {
			this.setFurnaceItem(i, 0, Tileset.AIR, 0);
		}

		//Furnace variables
		this.#fuelLife = -1;
		this.#metre = document.querySelector("#furnace meter");

		//The id of the furnace
		this.#furnaceID = Furnace.furnaces.length;

		let _this = this;

		//Hides the crafting table and shows the furnace and the inventory
		window.addEventListener("openFurnace", function (e) {
			if(_this.#furnaceID === Furnace.currentFurnace) {
				document.getElementById("crafting").classList.add("hide");
				document.getElementById("inventory").classList.remove("hide");
				document.getElementById("furnace").classList.remove("hide");

				//Renders the furnace items in the current furnace
				_this.#renderFurnaceItems();
			}
		});
	}

	//Adds the 3 furnace boxes to the furnace
	static initFurnace() {
		Furnace.addFurnaceBox(0, "furnaceItem", "input");
		Furnace.addFurnaceBox(1, "furnaceFuel", "input");
		Furnace.addFurnaceBox(2, "furnaceOutput", "output");
	}

	//Sets a specific furnace item
	setFurnaceItem(i, amount, type, itemHealth) {
		this.#furnaceItems[i] = { amount: amount, type: type, itemHealth: itemHealth };
	}

	//Decrements a furnace item by 1
	decrementFurnaceItem(i) {
		let furnaceItem = this.getFurnaceItem(i);
		furnaceItem.amount--;
		this.setFurnaceItem(i, furnaceItem.amount, furnaceItem.type, furnaceItem.itemHealth);
	}

	//Decrements (or increments) the fuel life of a specific furnace item
	setFuelLife(fuelLife) {
		this.#furnaceItems[1].fuelLife-fuelLife;
	}

	//Gets a specific furnace item
	getFurnaceItem(i) {
		return this.#furnaceItems[i];
	}

	static addFurnace(furnace) {
		Furnace.furnaces.push(furnace);
	}

	getFurnaceItems() {
		return this.#furnaceItems.map(item => item.type).filter(item => item !== null && item !== Tileset.AIR);
	}

	//Renders all of the furnace items
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

	//Checks if a furnace recipe is correct
	checkRecipes() {
		if(this.#furnaceItems[0].type == Tileset.AIR || this.#furnaceItems[1].type == Tileset.AIR) {
			return;
		}

		//Checks if the furnace fuel is one of the items below
		switch(this.#furnaceItems[1].type)	{
			case Tileset.LEAVES: case Tileset.STRIPPED_LOG:
			case Tileset.LOG: case Tileset.WOOD_BLOCK:
			case Tileset.COAL: case Tileset.STICK:
			case Tileset.TORCH:
				break;
			default:
				return;
		}

		//Sets the fuel life of the current item in the furnace
		this.#fuelLife = this.#furnaceItems[1].type.fuelLife;

		//Gets the output of the current item in the furnace
		let furnaceOutput = this.#furnaceItems[0].type.furnaceOutput;

		//Stops the furnace if the output is null
		if(furnaceOutput == null) {
			return;
		}

		let _this = this;
		
		window.dispatchEvent(new CustomEvent("toggleFurnaceHeat", { detail: { open: true, x: this.#xPos, y: this.#yPos } }));

		//Smelts an item over 1 second intervals
		this.#smeltingTimer = setInterval(() => {

			//Gets the input amount and fuel amount
			let inputAmount = _this.getFurnaceItem(0).amount,
				fuelAmount = _this.getFurnaceItem(1).amount;

			//If the input amount is 0
			//Sets the input item to air
			if(inputAmount === 0) {
				_this.setFurnaceItem(0, 0, Tileset.AIR, null);
			}

			//If the fuel amount is 0
			//Sets the fuel item to air
			if(fuelAmount == 0) {
				_this.setFurnaceItem(1, 0, Tileset.AIR, null);
			}

			//Sets the furnace counntdown to 0 and render the furnace items
			if(inputAmount === 0 || fuelAmount === 0) {
				this.#metre.value = 0;
				if(Furnace.currentFurnace == _this.#furnaceID) {
					_this.#renderFurnaceItems();
				}
				setTimeout(() => {
					window.dispatchEvent(new CustomEvent("toggleFurnaceHeat", { detail: { open: false, x: this.#xPos, y: this.#yPos } }));
				}, 3000)
				//Cancels the interval
				clearInterval(_this.#smeltingTimer);
				return;
			}

			//Increments the smelting counter by 10
			_this.#smeltingTime+=10;

			//If the smelting time is 100
			//Decrement the fuel life
			//Decrement the input amount
			//Increment the fuel amount
			if(_this.#smeltingTime == 100) {
				_this.setFuelLife(--_this.#fuelLife);
				_this.setFurnaceItem(2, _this.getFurnaceItem(2).amount + (furnaceOutput.furnaceOutputAmount || 1), furnaceOutput, null);
				_this.decrementFurnaceItem(0);

				//Removes the fuel item if it is depleted
				if(_this.#fuelLife === 0) {
					_this.#fuelLife = _this.getFurnaceItem(1).type.fuelLife;
					_this.decrementFurnaceItem(1);
				}

				//Renders the furnace items
				if(Furnace.currentFurnace == _this.#furnaceID) {
					_this.#renderFurnaceItems();
				}
				_this.#smeltingTime = 0;
			}

			//Sets the furnace meter to the smelting time
			if(Furnace.currentFurnace == _this.#furnaceID) {
				_this.#metre.value = _this.#smeltingTime;
			}
		},1000);
	}

	static addFurnaceBox(i, selector, type) {
		//Creates inventoryItem from the template and adds it to the screen

		Furnace.clone.setAttribute("data-index", i);
		let clone = Furnace.clone.cloneNode(true);
		clone.classList.add("furnaceItem");
		clone.classList.add(type);
		clone.classList.add(selector);

		document.getElementById("furnace").append(clone);
	}
}
