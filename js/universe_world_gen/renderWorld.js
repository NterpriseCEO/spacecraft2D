import { Canvas } from "../engine/Canvas.js";
import { Camera } from "../engine/Camera.js";
import { Block } from "../engine/Block.js";

import { Tileset } from "./TilesetTerrain.js";
import { Planet } from "./Planet.js";
import { Earth } from "./Earth.js";
import { Chunks } from "./UpdateChunks.js";

export class RenderWorld {

	#character;
	#isFirstBlock;
	#lines;
	#lines2;
	#chunksX;
	#chunksY;
	#chunks;

	constructor(character) {
		//super()

		//Create a reference to the canvas context
		//Create a reference to the character
		this.#character = character;

		this.#isFirstBlock = true;

		new Earth()

		// Generate random data
		this.#lines = [];
		this.#lines2 = [];

		//Sets the amount of chunks to load
		this.#chunksX = Math.floor(Math.round(window.innerWidth / Planet.size) / 10);
		this.#chunksY = Math.floor(Math.round(window.innerHeight / Planet.size) / 10) + Math.floor(Math.round(Camera.camY / Planet.size) / 10) + 1;

		this.#chunks = new Chunks();

		//Renders those chunks
		for (let y = 0; y < this.#chunksY; y++) {
			for (let x = 0; x < this.#chunksX; x++) {
				this.#chunks.updateChunk(x * 10, y * 10);
				this.#chunks.updateShadow(x * 10, y * 10);
			}
		}
		//Sets the camera position to the first solid block at x = 0
		let cameraPos = 0;
		for (let y = 100; y < 1000; y++) {
			if (Earth.world[y][0].id == "air") {
				cameraPos = y + 1;
			} else {
				break;
			}
		}
		Camera.setCameraPos(0, Planet.size * cameraPos);

		let _this = this;
		window.addEventListener("updateDroppables", function (e) {
			//Update droppable chunks
			_this.#chunks.updateDroppables(e.detail[0], e.detail[1]);
		});

		window.addEventListener("toggleFurnaceHeat", function (e) {
			let X = e.detail.x,
				Y = e.detail.y,
				x = Math.floor(X / 10) * 10,
				y = Math.floor(Y / 10) * 10;
			let type = e.detail.open ? Tileset.FRNC_HOT : Tileset.FRNC;
			Earth.world[Y][X] = type;
			if (e.detail.open) {
				window.dispatchEvent(new CustomEvent("lightAdded", { detail: [X, Y] }));
			} else {
				window.dispatchEvent(new CustomEvent("lightRemoved", { detail: [X, Y] }));
			}
			Chunks.updateChunk(x, y, true);
		});
	}
	random(limit) {
		return Math.floor(Math.random() * limit) + 1;
	}

	gradient(a, b) {
		return (b.y - a.y) / (b.x - a.x);
	}

	renderWorld() {
		//console.time("Render speed");
		//Converts camera X/Y to imageX
		
		// let yPos = Math.floor(Y / Planet.size),
		// xPos = Math.floor(X / Planet.size),
		// 	startX = xPos > 2 ? xPos - 2 : 0;
		
		//Sets chunks to render
		this.#chunksY = Math.floor(Math.round(window.innerHeight / Planet.size) / 10) + Math.floor(Math.round(Camera.camY / Planet.size) / 10) + 1;
		this.#chunksX = Math.floor(Math.round(window.innerWidth / Planet.size) / 10) + Math.floor(Math.round(Camera.camX / Planet.size) / 10) + 1;
		//Loops through chunks and renders them
		for (let y = Math.floor(Math.round(Camera.camY / Planet.size) / 10) - 2; y < this.#chunksY; y++) {
			for (let x = Math.floor(Math.round(Camera.camX / Planet.size) / 10) - 4; x < this.#chunksX; x++) {
				//If chunks y row undefined, create chunks
				if (Chunks.chunks[y] == undefined) {
					this.#chunks.updateChunk(x * 10, y * 10);
					this.#chunks.updateShadow(x * 10, y * 10);
				} else if (Chunks.chunks[y][x] == undefined) {
					this.#chunks.updateChunk(x * 10, y * 10);
					this.#chunks.updateShadow(x * 10, y * 10);
				}
				if (Chunks.droppablesChunks[y] == undefined) {
					this.#chunks.updateDroppables(x * 10, y * 10);
				} else if (Chunks.droppablesChunks[y][x] == undefined) {
					this.#chunks.updateDroppables(x * 10, y * 10);
				}
				//Draw chunk
				Block.imageShape(Canvas.ctx, Chunks.chunks[y][x], 0, 0, Planet.size * 10, Planet.size * 10, x * 10, y * 10, Planet.size * 10, Planet.size * 10);
				Block.imageShape(Canvas.ctx, Chunks.droppablesChunks[y][x], 0, 0, Planet.size * 10, Planet.size * 10, x * 10, y * 10, Planet.size * 10, Planet.size * 10);
				Block.imageShape(Canvas.ctx, Chunks.shadowChunks[y][x], 0, 0, Planet.size * 10, Planet.size * 10, x * 10, y * 10, Planet.size * 10, Planet.size * 10);
			}
			if (Camera.camX < 30 * Planet.size || Camera.camX > 950 * Planet.size) {
				for (let x = 1; x < 5; x++) {
					//If camera is near start of map, render end of map
					if (Camera.camX < 30 * Planet.size) {
						if (Chunks.chunks[y] == undefined) {
							this.#chunks.updateChunk(1000 - (x * 10), y * 10);
							this.#chunks.updateShadow(1000 - (x * 10), y * 10);
						} else if (Chunks.chunks[y][100 - x] == undefined) {
							this.#chunks.updateChunk(1000 - (x * 10), y * 10);
							this.#chunks.updateShadow(1000 - (x * 10), y * 10);
						}
						if (Chunks.droppablesChunks[y] == undefined) {
							this.#chunks.updateDroppables(1000 - (x * 10), y * 10);
						} else if (Chunks.droppablesChunks[y][100 - x] == undefined) {
							this.#chunks.updateDroppables(1000 - (x * 10), y * 10);
						}
						Block.imageShape(Canvas.ctx, Chunks.chunks[y][100 - x], 0, 0, Planet.size * 10, Planet.size * 10, -x * 10, y * 10, Planet.size * 10, Planet.size * 10);
						Block.imageShape(Canvas.ctx, Chunks.droppablesChunks[y][100 - x], 0, 0, Planet.size * 10, Planet.size * 10, -x * 10, y * 10, Planet.size * 10, Planet.size * 10);
						Block.imageShape(Canvas.ctx, Chunks.shadowChunks[y][100 - x], 0, 0, Planet.size * 10, Planet.size * 10, -x * 10, y * 10, Planet.size * 10, Planet.size * 10);
					} else if (Camera.camX > 950 * Planet.size) {
						//If camera is near end of map, render start of map
						if (Chunks.chunks[y] == undefined) {
							this.#chunks.updateChunk((x - 1) * 10, y * 10);
							this.#chunks.updateShadow((x - 1) * 10, y * 10);
						} else if (Chunks.chunks[y][x - 1] == undefined) {
							this.#chunks.updateChunk((x - 1) * 10, y * 10);
							this.#chunks.updateShadow((x - 1) * 10, y * 10);
						}
						if (Chunks.droppablesChunks[y] == undefined) {
							this.#chunks.updateDroppables((x - 1) * 10, y * 10);
						} else if (Chunks.droppablesChunks[y][x] == undefined) {
							this.#chunks.updateDroppables((x - 1) * 10, y * 10);
						}
						//1000 = 100*10
						Block.imageShape(Canvas.ctx, Chunks.chunks[y][x - 1], 0, 0, Planet.size * 10, Planet.size * 10, (1000) + ((x - 1) * 10), y * 10, Planet.size * 10, Planet.size * 10);
						Block.imageShape(Canvas.ctx, Chunks.droppablesChunks[y][x - 1], 0, 0, Planet.size * 10, Planet.size * 10, (1000) + ((x - 1) * 10), y * 10, Planet.size * 10, Planet.size * 10);
						Block.imageShape(Canvas.ctx, Chunks.shadowChunks[y][x - 1], 0, 0, Planet.size * 10, Planet.size * 10, (1000) + ((x - 1) * 10), y * 10, Planet.size * 10, Planet.size * 10);
					}
				}
			}
		}
		//this.#ctx.strokeRect(this.#cursorPosition[0],this.#cursorPosition[1],Planet.size,Planet.size);
		//console.timeEnd("Render speed");
	}

	// bzCurve(points, f, t) {
	//     //f = 0, will be straight line
	//     //t suppose to be 1, but changing the value can control the smoothness too
	//     if (typeof(f) == 'undefined') f = 0.3;
	//     if (typeof(t) == 'undefined') t = 0.6;
	//
	//     this.hCtx.beginPath();
	//     this.hCtx.moveTo(points[0].x, points[0].y);
	//
	//     var m = 0;
	//     var dx1 = 0;
	//     var dy1 = 0;
	//
	//     var preP = points[0],
	//         dx2,dy2;
	//     for (var i = 1; i < points.length; i++) {
	//         var curP = points[i],
	//             nexP = points[i + 1];
	//         if(nexP) {
	//             m = this.gradient(preP, nexP);
	//             dx2 = (nexP.x - curP.x) * -f;
	//             dy2 = dx2 * m * t;
	//         } else {
	//             dx2 = 0;
	//             dy2 = 0;
	//         }
	//         this.hCtx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
	//         dx1 = dx2;
	//         dy1 = dy2;
	//         preP = curP;
	//     }
	//     this.hCtx.stroke();
	// }
}
