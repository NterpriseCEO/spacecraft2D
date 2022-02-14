import { Planet } from "./Planet.js";
import { Earth } from "./Earth.js";
import { Tileset } from "./TilesetTerrain.js";


export class Chunks {
	constructor() {
		this.hCanvas = document.getElementById("chunk");
		this.hCtx = this.hCanvas.getContext("2d");
		this.hCanvas.width = Planet.size * 10;
		this.hCanvas.height = Planet.size * 10;

		this.hCtx.imageSmoothingEnabled = false;

		this.lCanvas = document.getElementById("lightChunk");
		this.lCtx = this.lCanvas.getContext("2d");
		this.lCanvas.width = Planet.size * 10;
		this.lCanvas.height = Planet.size * 10;

		this.lCtx.imageSmoothingEnabled = false;

		this.plants = document.getElementById("plants");
	}

	static chunks = [];
	static shadowChunks = [];
	static droppablesChunks = [];

	updateChunk(X, Y, test) {
		//Clears the chunk canvas
		this.hCtx.clearRect(0, 0, (Planet.size * 10), (Planet.size * 10));

		//this.lines = [];
		//this.lines2 = [];
		let airCount = 0;
		//Creates chunk y row if not defined
		if (Chunks.chunks[Y / 10] == undefined) {
			Chunks.chunks[Y / 10] = [];
		}
		//Loops through blocks in chunk range
		for (let x = X; x < X + 10; x++) {
			for (let y = Y; y < Y + 10; y++) {
				//If block is air
				try {
					if (Earth.world[y][x].id == "air") {
						airCount++;
					}
				} catch (e) {
				}
				if (test) {
					console.log(Planet.world[y][x].id, x, y);
				}
				//If block is not air
				if (Earth.world[y][x] != undefined && Earth.world[y][x].id != "air") {
					/*if(Earth.world[y-1][x] == Tileset.AIR /*|| Earth.world[y][x-1] == Tileset.AIR || Earth.world[y][x+1] == Tileset.AIR) {
							let posY =  y ==  Y?Planet.size:0;
							//    posX =  x ==  X?0:(Planet.size/2);
	
							let p = { x:Math.round((x*Planet.size)-(X*Planet.size)),y:Math.round(((y+1)*Planet.size)-posY-(Y*Planet.size))};
							let p2 = { x:Math.round((x*Planet.size)+Planet.size-(X*Planet.size)),y:Math.round(((y+1)*Planet.size)-posY-(Y*Planet.size))};
							this.lines.push(p);
							this.lines.push(p2);
	
							let p3 = { x:Math.round((x*Planet.size)-(X*Planet.size)),y:Math.round(((y+2)*Planet.size)-posY-(Y*Planet.size))};
							let p4 = { x:Math.round((x*Planet.size)+Planet.size-(X*Planet.size)),y:Math.round(((y+2)*Planet.size)-posY-(Y*Planet.size))};
							this.lines2.push(p3);
							this.lines2.push(p4);
						}*/
					//Draws block
					this.hCtx.drawImage(Tileset.image, Math.round(Earth.world[y][x].x), Math.round(Earth.world[y][x].y), 20, 20, Math.round((x * Earth.size) - (X * Planet.size)), Math.round((y * Planet.size) - (Y * Planet.size)), Planet.size, Planet.size);
					/*if(Earth.shadowMap[y][x] != undefined) {
						//Sets colour
						this.hCtx.fillStyle = "black";
						//Sets opacity
						this.hCtx.globalAlpha = Earth.shadowMap[y][x];
						this.hCtx.fillRect(Math.round((x*Planet.size)-(X*Planet.size)),Math.round((y*Planet.size)-(Y*Planet.size)),Planet.size,Planet.size);
						this.hCtx.globalAlpha = 1;
					}*/
				} else {
					try {
						//If left of tree
						if (Earth.trees[y][x][0] == 1) {
							//If base of tree
							if (Earth.trees[y][x][1] == 1) {
								//If tree and not cactus
								if (Earth.trees[y][x][2] == "tree") {
									this.hCtx.drawImage(this.plants, Math.round(Tileset.TREE.x), Math.round(Tileset.TREE.y), Math.round(Tileset.TREE.w), Math.round(Tileset.TREE.h), Math.round((x * Planet.size) - (X * Planet.size)), Math.round(((y - 5) * Planet.size) - (Y * Planet.size)), Planet.size * 2, Planet.size * 6);
								} else {
									this.hCtx.drawImage(this.plants, Math.round(Tileset.CACTUS.x), Math.round(Tileset.CACTUS.y), Math.round(Tileset.CACTUS.w), Math.round(Tileset.CACTUS.h), Math.round((x * Planet.size) - (X * Planet.size)), Math.round(((y - 5) * Planet.size) - (Y * Planet.size)), Planet.size * 2, Planet.size * 6);
								}
							} else {
								//Draw rest of tree outside current chunk
								if (Earth.trees[y][x][3] >= Y + 10) {
									if (Earth.trees[y][x][2] == "tree") {
										this.hCtx.drawImage(this.plants, Math.round(Tileset.TREE.x), Math.round(Tileset.TREE.y), Math.round(Tileset.TREE.w), Math.round(Tileset.TREE.h), Math.round((x * Planet.size) - (X * Planet.size)), Math.round(((Earth.trees[y][x][3] - 6) * Planet.size) - (Y * Planet.size)), Planet.size * 2, Planet.size * 6);
									} else {
										this.hCtx.drawImage(this.plants, Math.round(Tileset.CACTUS.x), Math.round(Tileset.CACTUS.y), Math.round(Tileset.CACTUS.w), Math.round(Tileset.CACTUS.h), Math.round((x * Planet.size) - (X * Planet.size)), Math.round(((Earth.trees[y][x][3] - 6) * Planet.size) - (Y * Planet.size)), Planet.size * 2, Planet.size * 6);
									}
								}
							}
						} else if (Earth.trees[y][x - 1][0] == 1 && Earth.trees[y][x][0] == 0) {
							//Draw rest of tree outside current chunk
							if (x - 1 == X - 1) {
								if (Earth.trees[y][x - 1][2] == "tree") {
									this.hCtx.drawImage(this.plants, Math.round(Tileset.TREE.x), Math.round(Tileset.TREE.y), Math.round(Tileset.TREE.w), Math.round(Tileset.TREE.h), Math.round(((x - 1) * Planet.size) - (X * Planet.size)), Math.round(((Earth.trees[y][x][3] - 6) * Planet.size) - (Y * Planet.size)), Planet.size * 2, Planet.size * 6);
								} else {
									this.hCtx.drawImage(this.plants, Math.round(Tileset.CACTUS.x), Math.round(Tileset.CACTUS.y), Math.round(Tileset.CACTUS.w), Math.round(Tileset.CACTUS.h), Math.round(((x - 1) * Planet.size) - (X * Planet.size)), Math.round(((Earth.trees[y][x][3] - 6) * Planet.size) - (Y * Planet.size)), Planet.size * 2, Planet.size * 6);
								}
							}
						}
					} catch (e) {
					}
				}
			}
		}
		/*if((this.lines.length == 0 || this.lines2.length == 0) && airCount != 100) {
			this.lines = [{x:0,y:0},{x:Planet.size*10,y:0},{x:Planet.size*10,y:Planet.size*10},{x:0,y:Planet.size*10}]
			this.lines2 = [{x:0,y:0},{x:Planet.size*10,y:0},{x:Planet.size*10,y:Planet.size*10},{x:0,y:Planet.size*10}]
		}

		if(this.lines.length != 0 && this.lines2.length != 0) {
			//draw smooth line
			this.hCtx.globalAlpha = 0.6;
			this.hCtx.strokeStyle = "black";
			this.bzCurve(this.lines, 0, 1);
			this.hCtx.lineTo(Planet.size*10,Planet.size*10);
			this.hCtx.lineTo(0,Planet.size*10);
			this.hCtx.fill();

			this.hCtx.globalAlpha = 0.9;
			this.hCtx.strokeStyle = "black";
			this.bzCurve(this.lines2, 0, 1);
			this.hCtx.lineTo(Planet.size*10,Planet.size*10);
			this.hCtx.lineTo(0,Planet.size*10);
			this.hCtx.fill();
			this.hCtx.globalAlpha = 1;
		}*/

		//Converts canvas to image
		let img = document.createElement("img");
		img.src = this.hCanvas.toDataURL();
		Chunks.chunks[Y / 10][X / 10] = img;
	}
	updateShadow(X, Y, test) {
		//Clear chunk canvas
		let src = this.lCanvas.toDataURL();
		this.lCtx.clearRect(0, 0, this.lCanvas.width, this.lCanvas.height);
		this.lCtx.globalAlpha = 0;
		this.lCtx.fillRect(0, 0, 1, 1);
		if (Chunks.shadowChunks[Y / 10] == undefined) {
			Chunks.shadowChunks[Y / 10] = [];
		}
		//Loops through blocks in chunk range
		for (let x = X; x < X + 10; x++) {
			for (let y = Y; y < Y + 10; y++) {
				if (Earth.shadowMap[y][x] != undefined) {
					//Sets colour
					this.lCtx.fillStyle = Earth.shadowMap[y][x][1];
					//Sets opacity
					this.lCtx.globalAlpha = Earth.shadowMap[y][x][0];
					this.lCtx.fillRect(Math.round((x * Planet.size) - (X * Planet.size)), Math.round((y * Planet.size) - (Y * Planet.size)), Planet.size, Planet.size);
					this.lCtx.globalAlpha = 1;
				}
			}
		}
		let img = document.createElement("img");
		img.src = this.lCanvas.toDataURL();
		Chunks.shadowChunks[Y / 10][X / 10] = img;
	}
	updateDroppables(X, Y) {
		//Clear chunk canvas
		this.hCtx.clearRect(0, 0, (Planet.size * 10), (Planet.size * 10));
		let chunksToUpdate = [];
		//Create chunk y coord if undefined
		if (Chunks.droppablesChunks[Y / 10] == undefined) {
			Chunks.droppablesChunks[Y / 10] = [];
		}
		//Loop through droppables in range of 10 xy coords
		for (let y = Y; y < Y + 10; y++) {
			//Drop items at xy coords
			if (Earth.dropItems[y] != undefined) {
				for (let x = X; x < X + 10; x++) {
					if (Earth.dropItems[y][x] != undefined) {
						//Loop through all dropItem at xy coords and render
						let yy = y;
						//If block below is air, drop block
						while (Earth.world[yy + 1][x].id == "air") {
							yy++;
						}
						//If blocks has fallen update position in droppable items list
						if (yy != y) {
							const len = Earth.dropItems[y][x].length;
							for (let i = 0; i < len; i++) {
								Earth.addDropItem(x, yy, Earth.dropItems[y][x][Earth.dropItems[y][x].length - 1]);
								Earth.removeDropItem(x, y);
							}
						}
						//If droppables fell outside 10*10 range, update chunk above
						let cY = Math.floor(yy / 10) * 10;
						if (yy >= Y + 10) {
							chunksToUpdate.push([cY, Math.floor(x / 10) * 10]);
						} else if (y % 10 == 0) {
							//console.log((Y/10)-1);
							chunksToUpdate.push([((Y / 10) - 1) * 10, Math.floor(x / 10) * 10]);
						}
						//Draw droppables in chunk
						try {
							for (let i = 0; i < Earth.dropItems[yy][x].length; i++) {
								this.hCtx.drawImage(Tileset.image, Earth.dropItems[yy][x][i].x, Earth.dropItems[yy][x][i].y, 20, 20, Math.round((x * Planet.size) - (X * Planet.size)) + 5, Math.round((yy * Planet.size) - (Y * Planet.size)) + 5, Planet.size - 10, Planet.size - 10);
							}
						} catch (e) {
							console.log(e);
						}
						//Earth.dropItems[y][x] = [];
					}
				}
			}
		}
		let img = document.createElement("img");
		img.src = this.hCanvas.toDataURL();
		Chunks.droppablesChunks[Y / 10][X / 10] = img;
		for (let CY = 0; CY < chunksToUpdate.length; CY++) {
			for (let i = Y / 10; i < chunksToUpdate[CY]; i++) {
				this.updateDroppables(chunksToUpdate[CY][1], i);
			}
			this.updateDroppables(chunksToUpdate[CY][1], chunksToUpdate[CY][0]);
		}
		//this.updateDroppables(X,Y-10);
	}
}
