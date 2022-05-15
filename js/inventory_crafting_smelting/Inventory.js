import { Tileset } from "../universe_world_gen/TilesetTerrain.js";

import { Crafting } from "./Crafting.js";
import { Furnace } from "./Furnace.js";
import { InventoryItems } from "./InventoryItems.js";
import { instructionsOpen } from "../index.js";

let _this;
export class Inventory {

	static #i = 0;

	#invPos;
	#fullInventory;
	#invBoxTemp;
	#crafting;
	#furnace;
	#clone;
	#shiftPressed;

	constructor() {
		this.#invPos = 0;
		//References the inventory element
		this.#fullInventory = document.getElementById("inventory");
		this.#invBoxTemp = document.getElementById("invBox");

		this.#clone = this.#invBoxTemp.content.querySelector(".itemBox");
		this.#shiftPressed = false;
		_this = this;

		this.#clone.classList.add("inventoryItem");

		this.items = [];
		for (let i = 0; i < 8; i++) {
			//Creates an inventory box and adds it to the inventory bar
			this.#addInvBox("inventorySmall");
		}
		for (let i = 0; i < 24; i++) {
			//Creates an inventory box and adds it to the full inventory
			this.#addInvBox("fullInventory");
		}

		Crafting.addCraftingBench(new Crafting());

		Crafting.initCrafting();
		Furnace.initFurnace();

		//Intialises dragging/dropping on the inventory boxes
		let blocks = document.getElementsByClassName("inventoryBlock");
		for (const block of blocks) {
			block.addEventListener("dragstart", this.dragstart);
		}

		const containers = document.getElementsByClassName("itemBox");
		//Intialises dragging on the inventory items
		for (const container of containers) {
			container.addEventListener("dragover", this.dragover);
			container.addEventListener("dragenter", this.dragenter);
			container.addEventListener("dragleave", this.dragleave);
			container.addEventListener("drop", function (e) {
				_this.drop(e, this);
			});
		}

		//References invBoxes/invBlocks as inventory items/boxes
		this.invBoxes = document.querySelectorAll(".itemBox:not(.input):not(.furnaceItem)");
		this.invBlocks = document.querySelectorAll(".itemBox:not(.input):not(.furnaceItem) .inventoryBlock");

		//Sets first inventory bar item as selected
		this.invBoxes[0].classList.add("selected");

		window.items = InventoryItems.items;

		this.#events();
	}

	hasItem() {
		return InventoryItems.items[this.#invPos].amount > 0;
	}

	getItem() {
		return InventoryItems.items[this.#invPos].type;
	}

	removeItem() {
		let item = InventoryItems.getInventoryItem(this.#invPos, 0);
		//If > 0 remove item
		if (item.amount > 0) {
			item.amount--;
			//Set new amount
			let type = item.type;
			this.invBlocks[this.#invPos].getElementsByTagName("span")[0].innerText = item.amount > 0 ? item.amount : "";
			//If amount = 0, item type = null
			if (item.amount == 0) {
				InventoryItems.setInventoryItem(this.#invPos, 0, null, null, 0);
				//item.type = null;
				//Hide inventory item
				this.invBlocks[this.#invPos].style.backgroundPosition = "";
			}
			this.toggleCharacterTorch();
			return type;
		}
	}
	addItem(blockType, itemHealth, callback) {
		let index = 0,
			choose = 0;
		for (let i = 0; i < 32; i++) {
			//If block exists add block
			if (InventoryItems.items[i].type != null || InventoryItems.items[i].type == Tileset.AIR) {
				//check if item / blockType match each other
				if (InventoryItems.items[i].type.id == blockType.id && InventoryItems.items[i].amount < 64) {
					index = i;
					choose = 1;
					break;
				}
			}
		}
		//If invbox with < 64 blocks
		if (choose == 0) {
			for (let i = 0; i < 32; i++) {
				//If invbox is empty
				if (InventoryItems.items[i].type == null || InventoryItems.items[i].type == Tileset.AIR) {
					index = i;
					break;
				}
				if (i == 31) {
					return callback(false);
				}
			}
		}

		InventoryItems.setInventoryItem(index, InventoryItems.items[index].amount, blockType, itemHealth, 0);
		let item = InventoryItems.getInventoryItem(index, 0);
		//Increment amount of block
		item.amount++;
		//Change the backgroundPosition to the correct block pos
		this.invBlocks[index].style.backgroundPosition = "-" + (item.type.x * 4) + "px -" + (item.type.y * 4) + "px";
		this.invBlocks[index].getElementsByTagName("span")[0].innerText = item.amount;
		return callback(true);
	}

	#addInvBox(location) {
		//Sets the invitem to amount = 0, type = null
		InventoryItems.addInventoryItem(0, Tileset.AIR, null);
		//Creates inventoryItem from the template and adds it to the screen

		this.#clone.setAttribute("data-index", Inventory.#i);
		document.getElementById(location).append(this.#clone.cloneNode(true));
		Inventory.#i++;
	}

	dragstart(e) {
		_this.srcElement = e.target;
	}

	dragover(e) {
		e.preventDefault();
	}

	dragenter(e) {
		e.preventDefault();
	}
	XOR(a, b, c) {
		return (a || b || c) && !(a && b && c);
	}

	drop(e, target) {
		e.preventDefault();
		//Gets the index of the target inventory item
		//the source inventory item
		//Gets the current crafting bench
		let tIndex = parseInt(target.getAttribute("data-index")),
			sIndex = parseInt(this.srcElement.parentNode.getAttribute("data-index")),
			cBench = Crafting.craftingBenches[Crafting.currentCraftingBench];

		//Checks which type of inventory item the source item is being dragged to
		let type = target.classList.contains("inventoryItem") ? 0
			: ["craftingItem", "input"].every(e=>target.classList.contains(e)) ? 1
			: ["furnaceItem", "input"].every(e=>target.classList.contains(e)) ? 2
			: target.classList.contains("craftingOutput") ? 3
			: ["furnaceItem", "output"].every(e=>target.classList.contains(e)) ? 4
			: null;

		//Checks which type of inventory item the target item is being dragged to
		let type2 = this.srcElement.parentNode.classList.contains("inventoryItem") ? 0
			: this.srcElement.parentNode.classList.contains("craftingOutput") ? 3
			: ["furnaceItem", "input"].every(e=>this.srcElement.parentNode.classList.contains(e)) ? 2
			: ["craftingItem", "input"].every(e=>this.srcElement.parentNode.classList.contains(e)) ? 1
			: ["furnaceItem", "output"].every(e=>this.srcElement.parentNode.classList.contains(e)) ? 4
			: null;

		//Gets the child element of the source and target inventory item
		let tChild = target.querySelector(".inventoryBlock"),
			sChild = this.srcElement;
		
		let tItemHealthWrapper = tChild.querySelector(".itemHealthWrapper"),
			sItemHealthWrapper = sChild.querySelector(".itemHealthWrapper");

		let tAmount = 0,
			sAmount = 0;

		//Prevents dragging on these target inventory item types
		if(type === 3 || type === 4 || (type2 === 3 && type === 1) || (type2 === 4 && type === 2)) {
			return;
		}

		//Gets the target and source item
		let tItem = InventoryItems.getInventoryItem(tIndex, type),
			sItem = InventoryItems.getInventoryItem(sIndex, type2);

		//Prevents draggin from crafting bench and furnace outputs to non empty inventory boxes
		if((type2 === 3 || type2 === 4) && tItem.amount > 0) {
			return;
		}

		//Returns if the source type is air or the source type is the same as the target type 
		if(sItem == tItem || sItem.type == Tileset.AIR) {
			return;
		}

		//Gets the source and target item type
		let tType = tItem.type,
			sType = sItem.type;

		let tBGPos,
			sBGPos = sChild.style.backgroundPosition;

		//Determines how many items are to be moved
		let divide = Math.floor(sItem.amount/4) > 1 ? Math.floor(sItem.amount/4) : 1;

		//If the target inventory item is empty
		//move all items over
		if(tItem.amount === 0) {
			tAmount = this.#shiftPressed ? divide : sItem.amount;
			sAmount = sItem.amount - tAmount;
			tType = sType;

			if(sAmount == 0) {
				sType = Tileset.AIR;
			}
		}else if(tItem.type != sItem.type) {
			//If the target inventory item is not empty
			//and the target item is not the same type as the source item
			//swap the items
			let temp = tType;
			tType = sType;
			sType = temp;

			sAmount  = tItem.amount;
			tAmount = sItem.amount;
		}else {
			tAmount = this.#shiftPressed ? divide : sItem.amount;

			//If the target item plus the new amount is less than or equal to the max amount
			//move the required amount of items
			if(tItem.amount+tAmount <= 64) {
				sAmount = sItem.amount - tAmount;
				tAmount = tItem.amount+tAmount;
			}else {
				//Sets the target amount to the max amount#
				//and decrements the source amount by the amount moved
				tAmount = 64;
				sAmount = (tItem.amount+sItem.amount)-64;
			}

			//If the source amount is 0
			//set the source type to air
			if(sAmount === 0) {
				sType = Tileset.AIR;
			}
		}

		//Sets the 2 inventory items to the new values
		InventoryItems.setInventoryItem(tIndex, tAmount, tType, sItem.itemHealth, type);
		InventoryItems.setInventoryItem(sIndex, sAmount, sType, tItem.itemHealth, type2);
		
		//Renders the 2 inventory items
		tBGPos = "-" + (tType.x * 4) + "px -" + (tType.y * 4) + "px";
		tChild.style.backgroundPosition = tBGPos;
		tChild.querySelector("span").innerText = tAmount;
		//Sets the max value of the item health bar
		tChild.querySelector(".itemHealth").max = tType.itemHealth || 0;

		//Shows the item health bar if the item has health or is damaged
		if(sItem.itemHealth > 0 && sItem.itemHealth < tType.itemHealth) {
			tItemHealthWrapper.classList.remove("hide");
			tChild.querySelector(".itemHealth").value = sItem.itemHealth;
		} else {
			tItemHealthWrapper.classList.add("hide");
		}

		sBGPos = "-" + (sType.x * 4) + "px -" + (sType.y * 4) + "px";
		sChild.style.backgroundPosition = sBGPos;
		sChild.querySelector("span").innerText = sAmount > 0 ? sAmount : "";
		sChild.querySelector(".itemHealth").max = sType.itemHealth || 0;

		if(tItem.itemHealth > 0 && tItem.itemHealth < sType.itemHealth) {
			sItemHealthWrapper.classList.remove("hide");
			sChild.querySelector(".itemHealth").value = tItem.itemHealth;
		} else {
			sItemHealthWrapper.classList.add("hide");
		}

		//If the target item is a crafting bench item
		//checks the crafting recipes
		if(type2 === 3) {
			cBench.completeRecipe();
			return;
		}

		//The same as above but for the furnace and moving items
		//between crafting items
		if(type === 1 || type2 === 1) {
			cBench.checkRecipes();
		}else if(type === 2 || type2 === 2) {
			Furnace.furnaces[Furnace.currentFurnace].checkRecipes();
		}
	}

	//Toggles the characters torch
	toggleCharacterTorch() {
		let isTorch = (InventoryItems.items[this.#invPos].type != null && InventoryItems.items[this.#invPos].type.id == "torch");
		window.dispatchEvent(new CustomEvent("showCharacterTorch", { detail: isTorch }));
	}

	#events() {
		window.addEventListener("wheel", function (e) {
			if(!instructionsOpen) {
				//var pos = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
				document.getElementsByClassName("selected")[0].classList.remove("selected");
				if (e.deltaY == -100) {
					//If scrolling up move to next selected inventory item
					_this.#invPos++;
					//If last inv item selected, select first item
					if (_this.#invPos == 8) {
						_this.#invPos = 0;
					}
				} else {
					//Move to previous inv item
					_this.#invPos--;
					//If first item selected, select last item
					if (_this.#invPos == -1) {
						_this.#invPos = 7;
					}
				}
				//Add selected class
				_this.invBoxes[_this.#invPos].classList.add("selected");
	
				_this.toggleCharacterTorch();
			}
		}, false);

		let advancedCrafting = document.getElementsByClassName("advancedCrafting");
		document.addEventListener("keydown", function (e) {
			switch (e.keyCode) {
				case 39: case 38:
					if(!instructionsOpen) {
						//Select next inv item
						document.getElementsByClassName("selected")[0].classList.remove("selected");
						_this.#invPos++;
						if (_this.#invPos == 8) {
							_this.#invPos = 0;
						}
						_this.invBoxes[_this.#invPos].classList.add("selected");
						_this.toggleCharacterTorch();
					}
					break;
				case 37: case 40:
					if(!instructionsOpen) {
						//Select previous inv item
						document.getElementsByClassName("selected")[0].classList.remove("selected");
						_this.#invPos--;
						if (_this.#invPos == -1) {
							_this.#invPos = 7;
						}
						_this.invBoxes[_this.#invPos].classList.add("selected");
						_this.toggleCharacterTorch();
					}
					break;
				case 69:
					if(!instructionsOpen) {
						//Toggle inventory visibility
						_this.#fullInventory.classList.toggle("hide");
						for (let i = 0; i < advancedCrafting.length; i++) {
							advancedCrafting[i].classList.add("hide");
						}
						Crafting.currentCraftingBench = 0;
						//check crafting recipes for current crafting bench
						Crafting.craftingBenches[Crafting.currentCraftingBench].loadCraftingBench();
						document.getElementById("crafting").classList.add("smallCrafting");
						document.getElementById("crafting").classList.remove("hide");
						document.getElementById("furnace").classList.add("hide");
					}
					break;
				case 27:
					if(!instructionsOpen) {
						//Hide inventory
						_this.#fullInventory.classList.add("hide");
						for (let i = 0; i < advancedCrafting.length; i++) {
							advancedCrafting[i].classList.add("hide");
						}
						document.getElementById("crafting").classList.add("smallCrafting");
					}
					break;
				case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56:
					if(!instructionsOpen) {
						//Select invbar item based on number selected
						document.getElementsByClassName("selected")[0].classList.remove("selected");
						document.getElementById("crafting").classList.remove("hide");
						//keyCode-49 = (0->7)
						_this.#invPos = e.keyCode - 49;
						_this.invBoxes[_this.#invPos].classList.add("selected");
						_this.toggleCharacterTorch();
					}
					break;
				case 16:
					_this.#shiftPressed = true;
			}
		});
		document.addEventListener("keyup", function (e) {
			_this.#shiftPressed = false;
		});

		window.addEventListener("damageItem", function (e) {
			let index = parseInt(document.querySelector(".selected").getAttribute("data-index"));
			let selected = document.querySelector(".selected .inventoryBlock");
			
			//Decement item health by 2 units
			InventoryItems.setItemHealth(index, 2);

			selected.querySelector(".itemHealthWrapper").classList.remove("hide");
			selected.querySelector(".itemHealth").value = InventoryItems.items[index].itemHealth;
			if (InventoryItems.items[index].itemHealth <= 0) {
				//If item health is <= 0, remove the item
				selected.querySelector(".itemHealthWrapper").classList.add("hide");
				_this.removeItem();
			}
		});

		window.addEventListener("addInventoryItem", function (e) {
			_this.addItem(e.detail, 0, function (hasSpace) {
				if (hasSpace) {
					//Remvoe block from world if space in inventory
					_this.toggleCharacterTorch();
					window.dispatchEvent(new CustomEvent("hasSpace", {
						detail: true
					}));
				}
			});
		});

		//Adds new items to the inventory via the developer shortcut thingy
		window.addEventListener("addNewItems", function (e) {
			for (let i = 0; i < e.detail.length; i++) {
				for (let j = 0; j < e.detail[i][1]; j++) {
					_this.addItem(e.detail[i][0], e.detail[i][2], function (hasSpace) { });
				}
			}
		});
	}
}
