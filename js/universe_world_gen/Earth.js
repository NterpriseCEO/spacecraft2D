import { Planet } from "./Planet.js";
import { Tileset } from "./TilesetTerrain.js";

export class Earth extends Planet {

	static world = [];
	static shadowMap = [];
	static trees = [];
	static dropItems = [];

	static nextValue = 0;

	constructor() {
		super();
		this.createWorld();
	}

	static #mountain() {
		noise.seed(Math.random());
		for (let y = 0; y < 1; y++) {
			for (let x = Earth.nextValue; x < Earth.nextValue + 250; x++) {
				// All noise functions return values in the range of -1 to 1.
				// noise.simplex2 and noise.perlin2 for 2d noise

				//let value = Math.round(Math.abs((noise.perlin2(x/40,y/40,new Date().getTime())*300))/8)+170;
				let value = Math.round(Math.abs((noise.perlin2(noise.perlin2(x / 40, y / 40), noise.simplex2(x / 50, y / 50)) * 300)) / 8);

				Earth.world[value+165][x] = Tileset.ROCK;
			}
		}
		Earth.nextValue += 250;
	}

	static #desert() {
		noise.seed(Math.random());
		for (let y = 0; y < 1; y++) {
			for (let x = Earth.nextValue; x < Earth.nextValue + 250; x++) {
				// All noise functions return values in the range of -1 to 1.
				// noise.simplex2 and noise.perlin2 for 2d noise
				let value = Math.round((Math.abs(noise.perlin2(x / 40, Earth.nextValue / 40) * 10)));
				Earth.world[value + 165][x] = Tileset.SAND;
			}
		}
		Earth.nextValue += 250;
	}

	static #forest() {
		noise.seed(Math.random());
		for (let y = 0; y < 1; y++) {
			for (let x = Earth.nextValue; x < Earth.nextValue + 250; x++) {
				// All noise functions return values in the range of -1 to 1.
				// noise.simplex2 and noise.perlin2 for 2d noise
				let value = noise.simplex2(x / 75, y / 100);
				let value2 = noise.simplex2(x / 100, y / 75);
				let value3 = noise.simplex2(value, value2);
				// ... or noise.simplex3 and noise.perlin3:
				//Add grass and rock
				let Y = Math.abs(Math.round(value3 * 10));
				let Y2 = Math.floor(Math.random() * 1) - 1
				Earth.world[Y+165][x] = Tileset.GRASS;
				Earth.world[Y + 170 + Y2][x] = Tileset.ROCK;
			}
		}
		for(let y = 160; y < 500; y++) {
			for(let x = Earth.nextValue; x < Earth.nextValue+250; x++) {
				//Add soil under grass
				if ((Earth.world[y - 1][x].id == "grass" || Earth.world[y - 1][x].id == "grass1" || Earth.world[y - 1][x].id == "grass2" || Earth.world[y - 1][x].id == "soil") && Earth.world[y][x].id == "air") {
					Earth.world[y][x] = Tileset.SOIL;
				}
				if(y > 168) {
					//If y is more than 168 and block y / y-1 == air, add water axt XY
					if (Earth.world[y][x].id == "air" && (Earth.world[y - 1][x].id == "air" || Earth.world[y - 1][x].id == "water")) {
						Earth.world[y][x] = Tileset.WATER;
					}
				}
			}
		}
		//Adds lakes to the forest
		for(let y = 100; y < 500; y++) {
			if(Earth.world[y][Earth.nextValue] == Tileset.WATER) {
				Earth.world[y][Earth.nextValue] =
				Earth.world[y-1][Earth.nextValue] == Tileset.AIR ? Tileset.GRASS : Tileset.SOIL;
			}
			if(Earth.world[y][Earth.nextValue+249] == Tileset.WATER) {
				Earth.world[y][Earth.nextValue+249] =
				Earth.world[y-1][Earth.nextValue+249] == Tileset.AIR ? Tileset.GRASS : Tileset.SOIL;
			}
		}
		Earth.nextValue += 250;
	}

	static removeTree(x, y) {
		let index = y;
		//Loops un referenced tree part is base
		while (Earth.trees[index][x][1] == 0) {
			index++;
		}
		try {
			for (let i = 0; i < 6; i++) {
				/*Remove tree to the right if currently
				selected part is the left part of the tree*/
				if (Earth.trees[index][x][0] == 1) {
					Earth.trees[index][x + 1] = undefined;
				} else {
					/*Remove tree to the left if currently
					selected part is the right part of the tree*/
					Earth.trees[index][x - 1] = undefined;
				}
				//Remove the currently selected part of the tree.
				Earth.trees[index][x] = undefined;
				index--;
			}
		} catch (e) {
			//Nothing here
		}
	}

	//Flood fills a chunk downards and outwards with water or lava
	static flood(x, y, type) {
		if(Earth.world[y][x+1] == type
			|| Earth.world[y][x-1] == type
			|| Earth.world[y-1][x] == type) {
			Earth.world[y][x] = type;
			if(Earth.world[y][x+1] == Tileset.AIR) {
				Earth.floodHorizontal(x+1, y, 1, type);
			}
			if(Earth.world[y][x-1] == Tileset.AIR) {
				Earth.floodHorizontal(x-1, y, -1, type);
			}
			if(Earth.world[y+1][x] == Tileset.AIR) {
				Earth.floodDown(x, y+1, type);
			}
		}
	}

	static floodHorizontal(x, y, dir, type) {
		Earth.world[y][x] = type;
		if(Earth.world[y][x+dir] == Tileset.AIR) {
			Earth.floodHorizontal(x+dir, y, dir, type);
		}
		if(Earth.world[y+1][x] == Tileset.AIR) {
			Earth.floodDown(x, y+1, type);
		}

		//Updates the chunk if the next block is not air or if at the end of the chunk
		if(Earth.world[y][x+dir] != Tileset.AIR || Earth.world[y+1][x] != Tileset.AIR ||
			x%10 == 0 || y%10 == 0) {
			window.dispatchEvent(new CustomEvent("updateChunk", {
				detail: [Math.floor(x / 10) * 10, Math.floor(y / 10) * 10]
			}));
		}
	}

	static floodDown(x, y, type) {
		Earth.world[y][x] = type;
		if(Earth.world[y+1][x] == Tileset.AIR) {
			Earth.floodDown(x, y+1, type);
		}

		//Updates the chunk if the next block is not air or if at the end of the chunk
		if(Earth.world[y+1][x] != Tileset.AIR || y%10 == 0) {
			window.dispatchEvent(new CustomEvent("updateChunk", {
				detail: [Math.floor(x / 10) * 10, Math.floor(y / 10) * 10]
			}));
		}
	}

	createWorld() {
		let biomesList = document.getElementById("biomes");
		//Generate y row and shadow map y row
		for (let y = 0; y < 1000; y++) {
			Earth.world[y] = [];
			Earth.shadowMap[y] = [];
		}

		for (let y = 0; y < 1000; y++) {
			for (let x = 0; x < 1000; x++) {
				//Set xy (and +1/+2) to air if xy (+1/+2) is undefined
				if (Earth.world[y][x] == undefined) {
					Earth.world[y][x] = Tileset.AIR;
				}
				if (Earth.world[y][x + 1] == undefined) {
					Earth.world[y][x + 1] = Tileset.AIR;
				}
				if (Earth.world[y][x + 2] == undefined) {
					Earth.world[y][x + 2] = Tileset.AIR;
				}
			}
		}

		const biomes = ["forest", "desert", "mountain"];
		Earth.#forest();
		
		//Loops through all biomes and chooses a random biome until all biomes are loaded
		while(biomes.length > 0) {
			let rand = random(biomes.length);
			switch(biomes[rand-1]) {
				case "mountain":
					Earth.#mountain();
					biomesList.innerHTML += "Mountain<br>";
					break;
				case "desert":
					Earth.#desert();
					biomesList.innerHTML += "Desert<br>";
					break;
				case "forest":
					Earth.#forest();
					biomesList.innerHTML += "Forest<br>";
					break;
			}
			biomes.splice(rand-1, 1);
		}

		// for (let i = 0; i < 3; i++) {
		// 	let rand = random(3);
		// 	if (rand == 1) {
		// 		Earth.#mountain();
		// 		biomesList.innerHTML += "Mountain<br>";
		// 	} else if (rand == 2) {
		// 		Earth.#desert();
		// 		biomesList.innerHTML += "Desert<br>";
		// 	} else {
		// 		Earth.#forest();
		// 		biomesList.innerHTML += "Forest<br>";
		// 	}
		// }
	
		for (let y = 0; y < 1000; y++) {
			for (let x = 0; x < 1000; x++) {
				if (Earth.world[y - 1] != undefined) {
					//Check if xy-1 is rock/ore and randomly choose which ore to render
					if (Earth.world[y - 1][x].id == "rock" || Earth.world[y - 1][x].id == "iron" || Earth.world[y - 1][x].id == "gold" || Earth.world[y - 1][x].id == "diamond" || Earth.world[y - 1][x].id == "coal") {
						if (random(10) == 1) {
							Earth.world[y][x] = Tileset.COAL;
							this.clumpOres(Tileset.COAL, y, x);
						} else if (random(20) == 1) {
							Earth.world[y][x] = Tileset.IRON;
							this.clumpOres(Tileset.IRON, y, x);
						} else if (random(30) == 1) {
							Earth.world[y][x] = Tileset.GOLD;
							this.clumpOres(Tileset.GOLD, y, x);
						} else if (random(40) == 1 && y > 200) {
							Earth.world[y][x] = Tileset.DIAMOND;
							this.clumpOres(Tileset.DIAMOND, y, x);
						} else {
							Earth.world[y][x] = Tileset.ROCK;
						}
					}
					if (Earth.world[y - 5] != undefined) {
						if (Earth.world[y - 1][x].id == "sand" && Earth.world[y - 5][x].id != "sand") {
							Earth.world[y][x] = Tileset.SAND;
						}
					}
					//Add sand underneath sand
					if (Earth.world[y - 1][x].id == "sand") {
						Earth.world[y][x] = Tileset.SAND;
					}
				}
				//Add left corner grass if block is air and block to right is soil
				if (Earth.world[y][x - 1] != undefined) {
					if (Earth.world[y][x].id == "grass" && Earth.world[y][x - 1].id == "air") {
						Earth.world[y][x] = Tileset.GRASS1;
					}
				}
	
				//Add right corner grass if block is air and block to right is soil
				if (Earth.world[y][x + 1] != undefined) {
					if (Earth.world[y - 1] != undefined) {
						if (Earth.world[y][x].id == "grass" && Earth.world[y][x + 1].id == "air" && (Earth.world[y - 1][x + 1].id == "air")) {
							Earth.world[y][x] = Tileset.GRASS2;
						}
					}
				}
				let randRocks = random(5);
				if (randRocks == 5 && (
					Earth.world[y][x].id == "grass" ||
					Earth.world[y][x].id == "grass1" ||
					Earth.world[y][x].id == "grass2" ||
					Earth.world[y][x].id == "rock") && Earth.world[y - 1][x].id == "air") {
					Earth.world[y - 1][x] = Tileset.BOULDER;
				}
				if (Earth.world[y][x - 1] != undefined) {
					if (Earth.world[y][x].id == "grass" && Earth.world[y][x - 1].id == "air") {
						Earth.world[y][x] = Tileset.GRASS1;
					}
				}
				if (Earth.world[y + 1] != undefined) {
					let tRand = random(3);
					if (Earth.world[y][x].id == "grass" && Earth.world[y][x + 1].id == "grass" && Earth.world[y - 1][x].id == "air" && Earth.world[y - 1][x + 1].id == "air") {
						let canPlace = true;
						for (let i = 1; i < 7; i++) {
							if (Earth.trees[y - i] == undefined) {
								Earth.trees[y - i] = [];
							}
							//Tree[y][x] = [left,base,type,y]
							if (Earth.trees[y - 1][x - 1] == undefined) {
								if (i == 1) {
									Earth.trees[y - 1][x] = [1, 1, "tree", y, 10000];
									Earth.trees[y - 1][x + 1] = [0, 1, "tree", y, 10000];
								} else {
									Earth.trees[y - i][x] = [1, 0, "tree", y, 10000];
									Earth.trees[y - i][x + 1] = [0, 0, "tree", y, 10000];
								}
							}
						}
					}
				}
				if (Earth.world[y + 1] != undefined) {
					let tRand = random(10);
					if (Earth.world[y][x].id == "sand" && Earth.world[y][x + 1].id == "sand") {
						let canPlace = true;
						if (tRand == 1) {
							for (let i = 1; i < 3; i++) {
								if (Earth.trees[y - i] == undefined) {
									Earth.trees[y - i] = [];
								} else {
									if (Earth.trees[y - 1][x - 1] == undefined) {
										if (canPlace) {
											if (i == 1) {
												Earth.trees[y - 1][x] = [1, 1, "cactus", y, 1000];
												Earth.trees[y - 1][x + 1] = [0, 1, "cactus", y, 1000];
											} else {
												Earth.trees[y - i][x] = [1, 0, "cactus", y, 1000];
												Earth.trees[y - i][x + 1] = [0, 0, "cactus", y, 1000];
											}
										}
									} else {
										canPlace = false;
									}
								}
							}
						}
					}
				}

				if(y >= 950) {
					Earth.world[y][x] = Tileset.LAVA;
				}
			}
		}
		
		super.generateShadow(Earth.world, Earth.shadowMap);
		
	}

	clumpOres(type, Y, X) {
		if((Earth.world[Y][X+1] == Tileset.ROCK || Earth.world[Y][X+1] == Tileset.AIR || Earth.world[Y][X+1] == null) && random(2) == 1) {
			Earth.world[Y][X+1] = type;
			this.clumpOres(type, Y, X+1);
		}
	}
	
	//Adds droppable item to list of droppable items
	static addDropItem(x, y, item) {
		//Adds droppable item y axis is not defined
		if (Earth.dropItems[y] == undefined) {
			Earth.dropItems[y] = [];
		}
		if (Earth.dropItems[y][x] == undefined) {
			Earth.dropItems[y][x] = [];
		}
		Earth.dropItems[y][x].push(item);
	}

	static removeDropItem(x, y, i) {
		//dropItems[y][x].splice(dropItems[y][x].indexOf(dropItems[y][x][i]),1);
		Earth.dropItems[y][x].pop();
		if (Earth.dropItems[y][x].length == 0) {
			Earth.dropItems[y][x] = undefined;
		}
	}

	static updateShadowMap(X, Y, t, test) {
		try {
			let colour = "black";
			for (let y = Y; y < Y + 10; y++) {
				for (let x = X; x < X + 10; x++) {
					let x5 = x - 5,
						x4 = x - 4,
						x3 = x - 3,
						x2 = x - 2,
						x1 = x - 1,
						x5_5 = x + 5,
						x4_4 = x + 4,
						x3_3 = x + 3,
						x2_2 = x + 2,
						x1_1 = x + 1;
					try {
						if (x == 0) {
							x1 = 999;
							x2 = 998;
							x3 = 997;
							x4 = 996;
							x5 = 995;
						} else if (x == 1) {
							x2 = 999;
							x3 = 998;
							x4 = 997;
							x5 = 996;
						} else if (x == 2) {
							x3 = 999;
							x4 = 998;
							x5 = 997;
						} else if (x == 3) {
							x4 = 999;
							x5 = 998;
						} else if (x == 4) {
							x5 = 999;
						} else if (x == 999) {
							x1_1 = 0;
							x2_2 = 1;
							x3_3 = 2;
							x4_4 = 3;
							x5_5 = 4;
						} else if (x >= 998) {
							x2_2 = 0;
							x3_3 = 1;
							x4_4 = 2;
							x5_5 = 3;
						} else if (x >= 997) {
							x3_3 = 0;
							x4_4 = 1;
							x5_5 = 2;
						} else if (x >= 996) {
							x4_4 = 0;
							x5_5 = 1;
						} else if (x >= 995) {
							x5_5 = 0;
						}
						if (Earth.shadowMap[y][x][1] != "yellow" && Earth.world[y][x].id != "water" && Earth.world[y][x].id != "window" && Earth.world[y][x].id != "lava") {
							if ((Earth.world[y][x1_1].id == "air" || Earth.world[y][x1].id == "air" || Earth.world[y + 1][x].id == "air" || Earth.world[y - 1][x].id == "air") && Earth.world[y][x].id != "air") {
								Earth.shadowMap[y][x] = null;
							} else if ((Earth.world[y][x2_2].id == "air" || Earth.world[y][x2].id == "air" || Earth.world[y + 2][x].id == "air" || Earth.world[y - 2][x].id == "air") && Earth.world[y][x].id != "air") {
								Earth.shadowMap[y][x] = [0.2, colour];
							} else if ((Earth.world[y][x3_3].id == "air" || Earth.world[y][x3].id == "air" || Earth.world[y + 3][x].id == "air" || Earth.world[y - 3][x].id == "air") && Earth.world[y][x].id != "air") {
								Earth.shadowMap[y][x] = [0.4, colour];
							} else if ((Earth.world[y][x4_4].id == "air" || Earth.world[y][x4].id == "air" || Earth.world[y + 4][x].id == "air" || Earth.world[y - 4][x].id == "air") && Earth.world[y][x].id != "air") {
								Earth.shadowMap[y][x] = [0.6, colour];
							} else if ((Earth.world[y][x5_5].id == "air" || Earth.world[y][x5].id == "air" || Earth.world[y + 5][x].id == "air" || Earth.world[y - 5][x].id == "air") && Earth.world[y][x].id != "air") {
								Earth.shadowMap[y][x] = [0.8, colour];
							} else if (Earth.world[y][x].id != "air") {
								Earth.shadowMap[y][x] = [0.9, colour];
							}
						}
					} catch (e) {
						//LOL F U
					}
				}
			}
		} catch(e) {
			console.log(e);
		}
	}

	static addLight(x, y) {
		let i = -1;
		for (let Y = y - 3; Y < y + 4; Y++) {
			for (let X = x - 3; X < x + 4; X++) {
				i++;
				if (i != 0 && i != 1 && i != 5 && i != 6 && i != 7 && i != 13 && i != 35 && i != 41
					&& i != 42 && i != 43 && i != 47 && i != 48) {
					if (Earth.shadowMap[Y][X] == undefined) {
						Earth.shadowMap[Y][X] = [0.1, "yellow"];
					} else {
						Earth.shadowMap[Y][X] = [0.1, "yellow"];
					}
				}
			}
		}
	}

	static removeLight(x, y) {
		let i = -1;
		for (let Y = y - 3; Y < y + 4; Y++) {
			for (let X = x - 3; X < x + 4; X++) {
				i++;
				if (i != 0 && i != 1 && i != 5 && i != 6 && i != 7 && i != 13 && i != 35 && i != 41
					&& i != 42 && i != 43 && i != 47 && i != 48) {
					Earth.shadowMap[Y][X] = undefined;
				}
			}
		}
	}
}

function fBm(x, y, octaves, lacunarity, gain) {
	let amplitude = 1,
		frequency = 1,
		sum = 0;
	for (let i = 0; i < octaves; i++) {
		sum += amplitude * noise.simplex2(x * frequency, y * frequency);
		amplitude *= gain;
		frequency *= lacunarity;
	}
	return sum;
}

function random(limit) {
	return Math.floor(Math.random() * limit) + 1
}