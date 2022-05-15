import { Camera } from "../engine/Camera.js";
import { Tileset } from "../universe_world_gen/TilesetTerrain.js";
import { Chunks } from "../universe_world_gen/UpdateChunks.js";
import { Planet } from "../universe_world_gen/Planet.js";
import { Earth } from "../universe_world_gen/Earth.js";
import { Inventory } from "../inventory_crafting_smelting/Inventory.js";
import { Crafting } from "../inventory_crafting_smelting/Crafting.js";
import { Furnace } from "../inventory_crafting_smelting/Furnace.js";

export class BlockPlacement {

	#inventory = new Inventory();
	#lastBlock = [];
	#lastPlacedBlock = [];
	#chunks = new Chunks();
	#character;
	#breakTimer;

	static mining = false;
	static breakPos;
	static #cursor = [0, 0, Planet.size, Planet.size];

	constructor(character) {
		//Initialise the inventory

		this.#chunks = new Chunks();

		this.#character = character;
	}

	setLastPlacedBlock(lastPlacedBlock) {
		this.#lastPlacedBlock = lastPlacedBlock;
	}

	XOR(a, b) {
		return (a || b) && !(a && b);
	}

	addBlock(x, y, camX, camY, startX, startY) {
		//Get position of the block
		let minus = Camera.startX - (Math.floor((window.innerWidth / 2) / Planet.size) * Planet.size),
			tile,
			Y = ((Math.floor((y + camY) / Planet.size) * Planet.size) / Planet.size) - Math.floor(startY / Planet.size),
			X = Math.floor((x - minus + camX) / Planet.size) - Math.floor((startX - minus) / Planet.size);
			//((Math.floor(((x+camX)/Planet.size))*Planet.size)/Planet.size)-Math.floor(startX/Planet.size);

		if (X >= 1000) {
			X -= 1000;
		} else if (X < 0) {
			X = 1000 + X;
		}

		/*
			1 1 0 0
			1 0 1 0
			1 1 1 1
		*/

		//Checks if the current block is air
		if ((this.#lastPlacedBlock[0] != X || this.#lastPlacedBlock[1] != Y)) {
			this.#lastPlacedBlock = [X, Y];
			if (((Math.floor(camX / Planet.size) != X || Math.floor(camY / Planet.size) - 1 != Y) && (Math.floor(camX / Planet.size) != X || Math.floor(camY / Planet.size) - 2 != Y))) {
				if (Earth.world[Y][X].id == "air" || Earth.world[Y][X].id == "water" || Earth.world[Y][X].id == "lava") {
					//Cheks if inventory has block
					if (this.#inventory.hasItem()) {
						//Checks if tree is at xy
						if ((Earth.trees[Y] == undefined || Earth.trees[Y][X] == undefined) && this.#inventory.getItem().canPlace == null) {
														
							if(this.#inventory.getItem().id == 'door_inventory' && Earth.world[Y+1][X].id != 'air' && Earth.world[Y-1][X].id != 'air') {
								return;
							}
							
							tile = this.#inventory.removeItem();
							tile = tile == null ? Tileset.AIR : tile;

							const xx = Math.floor(X / 10) * 10,
								yy = Math.floor(Y / 10) * 10;

							if(Earth.world[Y+1][X] == Tileset.AIR && tile == Tileset.DOOR_INVENTORY) {
								tile = Tileset.DOOR_TOP_CLOSED;
								Earth.world[Y+1][X] = Tileset.DOOR_BOTTOM_CLOSED;
								this.#chunks.updateChunk(xx, yy+10);
							}else if(Earth.world[Y-1][X] == Tileset.AIR && tile == Tileset.DOOR_INVENTORY) {
								tile = Tileset.DOOR_BOTTOM_CLOSED;
								Earth.world[Y-1][X] = Tileset.DOOR_TOP_CLOSED;
								this.#chunks.updateChunk(xx, yy-10);
							}

							Earth.world[Y][X] = JSON.parse(JSON.stringify(tile));
							//Checks if block y+1 = grass, set block to soil if true
							if (Earth.world[Y + 1][X].id == "grass" || Earth.world[Y + 1][X].id == "grass1" || Earth.world[Y + 1][X].id == "grass2") {
								Earth.world[Y + 1][X] = Tileset.SOIL;
							}

							if (Earth.world[Y][X].id == "torch") {
								window.dispatchEvent(new CustomEvent("lightAdded", { detail: [X, Y] }));
							}else if (Earth.world[Y][X].id == "crafting_bench") {
								Crafting.addCraftingBench(new Crafting());
								Earth.world[Y][X].craftingBench = Crafting.craftingBenches.length - 1;;
							}else if (Earth.world[Y][X].id == "furnace") {
								Furnace.addFurnace(new Furnace(X, Y));
								Earth.world[Y][X].furnace = Furnace.furnaces.length - 1;
							}
							//Update the chunks to the left/right/top/bottom of current chunk
							Earth.updateShadowMap(xx - 10, yy, Tileset);
							Earth.updateShadowMap(xx + 10, yy, Tileset);
							Earth.updateShadowMap(xx, yy, Tileset);
							Earth.updateShadowMap(xx, yy - 10, Tileset);
							Earth.updateShadowMap(xx, yy + 10, Tileset);
							this.#chunks.updateChunk(xx, yy);
							this.#chunks.updateShadow(xx, yy);
							this.#chunks.updateShadow(xx - 10, yy);
							this.#chunks.updateShadow(xx + 10, yy);
							this.#chunks.updateShadow(xx, yy - 10);
							this.#chunks.updateShadow(xx, yy + 10);
							//console.timeEnd("test");
						}
					}
				} else {
					try {
						//If crafting bench, open crafting bench
						switch (Earth.world[Y][X].id) {
							case "crafting_bench":
								setTimeout(function () {
									//set current crafting bench = to the crafting bench at the xy
									Crafting.currentCraftingBench = Earth.world[Y][X].craftingBench;
									window.dispatchEvent(new CustomEvent("openCrafting"));
								}, 200);
								break;
							case "furnace":
							case "hot_furnace":
								setTimeout(function () {
									Furnace.currentFurnace = Earth.world[Y][X].furnace;
									window.dispatchEvent(new CustomEvent("openFurnace", { detail: [X, Y] }));
								}, 200);
								break;
							case "door_top": case "door_top_closed":
								Earth.world[Y][X] =  Earth.world[Y][X] == Tileset.DOOR_TOP_OPEN ? Tileset.DOOR_TOP_CLOSED : Tileset.DOOR_TOP_OPEN;
								Earth.world[Y+1][X] =  Earth.world[Y+1][X] == Tileset.DOOR_BOTTOM_OPEN ? Tileset.DOOR_BOTTOM_CLOSED : Tileset.DOOR_BOTTOM_OPEN;
								var xx = Math.floor(X / 10) * 10,
									yy = Math.floor(Y / 10) * 10;
								this.#chunks.updateChunk(xx, yy);
								this.#chunks.updateChunk(xx, yy+10);
								break;
							case "door_bottom": case "door_bottom_closed":
								Earth.world[Y][X] =  Earth.world[Y][X] == Tileset.DOOR_BOTTOM_OPEN ? Tileset.DOOR_BOTTOM_CLOSED : Tileset.DOOR_BOTTOM_OPEN;
								Earth.world[Y-1][X] =  Earth.world[Y-1][X] == Tileset.DOOR_TOP_OPEN ? Tileset.DOOR_TOP_CLOSED : Tileset.DOOR_TOP_OPEN;
								var xx = Math.floor(X / 10) * 10,
									yy = Math.floor(Y / 10) * 10;
								this.#chunks.updateChunk(xx, yy);
								this.#chunks.updateChunk(xx, yy-10);
								break;
						}
					} catch (e) {
						console.log(e);
					}
				}
			}
		}
		return;
	}

	removeBlock(x, y, camX, camY, startX, startY) {
		let minus = Camera.startX - (Math.floor((window.innerWidth / 2) / Planet.size) * Planet.size),
			Y = ((Math.floor((y + camY) / Planet.size) * Planet.size) / Planet.size) - Math.floor(startY / Planet.size),
			X = Math.floor((x - minus + Camera.camX) / Planet.size) - Math.floor((Camera.startX - minus) / Planet.size);
		if (X >= 1000) {
			X -= 1000;
		} else if (X < 0) {
			X = 1000 + X;
		}

		let toAdd = Earth.world[Y][X];
		//Set toAdd to soild if mining grass of any type
		if (Earth.world[Y][X].id == "grass" || Earth.world[Y][X].id == "grass1" || Earth.world[Y][X].id == "grass2") {
			toAdd = Tileset.SOIL;
			//toAdd = Tileset.FRNC;
		}
		let _this = this;
		//Stop mining if not still mining current block
		if ((this.#lastBlock[0] != X || this.#lastBlock[1] != Y)) {
			this.stopMining();
			this.#lastBlock = [X, Y];
		}
		
		if (Earth.world[Y][X] != Tileset.AIR && Earth.world[Y][X] != Tileset.WATER && Earth.world[Y][X] != Tileset.LAVA) {
			if (!BlockPlacement.mining) {
				//If not mining
				BlockPlacement.mining = true;
				let miningIncrease = 1;
				try {
					let item = this.#inventory.getItem();
					/*Set the mining speed increase if the
					current inventory item has speed increase*/
					if (item.miningIncrease != undefined) {
						for (let i = 0; i < item.minableItems.length; i++) {
							if (item.minableItems[i] == toAdd.id) {
								miningIncrease = item.miningIncrease;
								break;
							}
						}
					}
				} catch (e) {
					//Nothing here. ESLint complains like a little b*tch tho
					//if this is empty :|
				}
				this.#breakTimer = setInterval(function () {
					//Increment break animation
					BlockPlacement.breakPos++;
				}, Earth.world[Y][X].miningSpeed / 10 / miningIncrease);
				BlockPlacement.miningTimer = setTimeout(function () {
					//When done mining
					//Remove block
					if(JSON.stringify(toAdd) != JSON.stringify(Tileset.DOOR_BOTTOM_CLOSED) &&
						JSON.stringify(toAdd) != JSON.stringify(Tileset.DOOR_TOP_CLOSED)
						&& JSON.stringify(toAdd) != JSON.stringify(Tileset.DOOR_BOTTOM_OPEN) &&
						JSON.stringify(toAdd) != JSON.stringify(Tileset.DOOR_TOP_OPEN)) {
						Earth.addDropItem(X, Y, toAdd);
					}else {
						Earth.addDropItem(X, Y, Tileset.DOOR_INVENTORY);
						if(Earth.world[Y-1][X] == Tileset.DOOR_TOP_CLOSED || Earth.world[Y-1][X] == Tileset.DOOR_TOP_OPEN) {
							Earth.world[Y-1][X] = Tileset.AIR;
						}else {
							Earth.world[Y+1][X] = Tileset.AIR;
						}
					}
					if (miningIncrease == 1) {
						_this.#character.damage(Earth.world[Y][X].damage);
					} else {
						window.dispatchEvent(new CustomEvent("damageItem"));
					}

					let id = Earth.world[Y][X].furnace || Earth.world[Y][X].craftingBench;

					Earth.world[Y][X] = Tileset.AIR;
					BlockPlacement.mining = false;

					let xx = Math.floor(X / 10) * 10,
						yy = Math.floor(Y / 10) * 10;

					if (toAdd.id == "torch") {
						window.dispatchEvent(new CustomEvent("lightRemoved", { detail: [X, Y] }));
					}
					
					//Flood fills the chunk with water or lava
					try {
						Earth.flood(X, Y, Tileset.WATER);
					}catch(e) {
						console.log(e);
					}
					try {
						Earth.flood(X, Y, Tileset.LAVA);
					}catch(e) {
						console.log(e);
					}

					//Adds all items to inventory if furnace or crafting bench was mined
					if(toAdd.id == "furnace" || toAdd.id == "hot_furnace") {
						const items = Furnace.furnaces[id].getFurnaceItems();
						items.forEach(item => {
							Earth.addDropItem(X, Y, item);
						});
					}else if(toAdd.id == "crafting_bench") {
						const items = Crafting.craftingBenches[id].getCraftingItems();
						items.forEach(item => {
							Earth.addDropItem(X, Y, item);
						});
					}


					//Update the chunks to the left/right/top/bottom of   current chunk
					Earth.updateShadowMap(xx - 10, yy, Tileset);
					Earth.updateShadowMap(xx + 10, yy, Tileset);
					Earth.updateShadowMap(xx, yy, Tileset);
					Earth.updateShadowMap(xx, yy - 10, Tileset, true);
					Earth.updateShadowMap(xx, yy + 10, Tileset);
					_this.#chunks.updateChunk(xx, yy);
					_this.#chunks.updateShadow(xx - 10, yy);
					_this.#chunks.updateShadow(xx + 10, yy);
					_this.#chunks.updateShadow(xx, yy);
					_this.#chunks.updateShadow(xx, yy - 10, true);
					_this.#chunks.updateShadow(xx, yy + 10);
					//Stop mining
					_this.stopMining();
					_this.#chunks.updateDroppables(xx, yy);
				}, Earth.world[Y][X].miningSpeed / miningIncrease);
			}
		} else {
			//Check if y row exists
			if (Earth.trees[Y] != undefined) {
				//Checks if block can be placed at xy
				if (Earth.trees[Y][X] != undefined) {
					if (!BlockPlacement.mining) {
						BlockPlacement.mining = true;
						let miningIncrease = 1;
						try {
							let item = this.#inventory.getItem();
							if (item.miningIncrease != undefined) {
								for (let i = 0; i < item.minableItems.length; i++) {
									if (item.minableItems[i] == "tree") {
										miningIncrease = item.miningIncrease;
										break;
									}
								}
							}
						} catch (e) {
							//Nothing here
						}
						this.#breakTimer = setInterval(function () {
							//Increment break animation
							BlockPlacement.breakPos++;
						}, Earth.trees[Y][X][4] / 10 / miningIncrease);
						BlockPlacement.miningTimer = setTimeout(function () {
							if (miningIncrease == 1) {
								_this.#character.damage(2);
							} else {
								window.dispatchEvent(new CustomEvent("damageItem"));
							}
							//Adds 2 logs and  leaf blocks
							if (Earth.trees[Y][X][2] == "tree") {
								for (let i = 0; i < 4; i++) {
									Earth.addDropItem(X, Y, Tileset.LEAVES);
									Earth.addDropItem(X, Y, Tileset.LOG);
								}
							} else {
								for (let i = 0; i < 2; i++) {
									Earth.addDropItem(X, Y, Tileset.CACTUS_LEAVES);
								}
							}
							//Remove the tree
							let xx = Math.floor(X / 10) * 10,
								yy = Math.floor(Y / 10) * 10;
								Earth.removeTree(X, Y);
							_this.#chunks.updateChunk(xx, yy);
							_this.#chunks.updateChunk(xx, yy - 10);
							_this.#chunks.updateChunk(xx, yy + 10);
							_this.#chunks.updateChunk(xx - 10, yy);
							_this.#chunks.updateChunk(xx + 10, yy);
							_this.#chunks.updateDroppables(xx, yy);
							_this.stopMining();
						}, Earth.trees[Y][X][4] / miningIncrease);
					}
				}
			}
		}
	}
	stopMining() {
		clearTimeout(BlockPlacement.miningTimer);
		BlockPlacement.mining = false;
		BlockPlacement.breakPos = 0;
		this.#character.checkCollision();
		clearInterval(this.#breakTimer);
	}

	static setCursor(x, y, w, h) {
		//this.#character.camX-this.#character.startX,this.#character.camY-character.startY
		BlockPlacement.#cursor = [x, y, w, h];
	}

	static getCursor(i) {
		return BlockPlacement.#cursor[i];
	}
}