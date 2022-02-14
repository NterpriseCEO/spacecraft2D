import { Crafting } from "./Crafting.js";
import { Furnace } from "./Furnace.js";

export class InventoryItems {
	static items = [];

	static setInventoryItem(i, amount, type, itemHealth, boxType) {
		switch(boxType) {
			case 0:
				InventoryItems.items[i] = { amount: amount, type: type, itemHealth: itemHealth };
				break;
			case 1:
				console.log(i, amount, type, itemHealth);
				Crafting.craftingBenches[Crafting.currentCraftingBench].setCraftingItem(i, amount, type, itemHealth);
				break;
			case 2: case 4:
				Furnace.furnaces[Furnace.currentFurnace].setFurnaceItem(i, amount, type, itemHealth);
				break;
		}
	}

	static addInventoryItem(amount, type, itemHealth) {
		InventoryItems.items.push({ amount: amount, type: type, itemHealth: itemHealth });
	}

	static setItemHealth(i, value) {
		InventoryItems.items[i].itemHealth -= value;
	}

	static getInventoryItem(i, boxType) {
		switch(boxType) {
			case 0:
				return InventoryItems.items[i];
			case 1: case 3:
				return Crafting.craftingBenches[Crafting.currentCraftingBench].getCraftingItem(i);
			case 2: case 4:
				return Furnace.furnaces[Furnace.currentFurnace].getFurnaceItem(i);
		}
	}
}
