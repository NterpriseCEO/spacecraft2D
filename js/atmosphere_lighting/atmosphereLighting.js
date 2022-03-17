import { Canvas } from "../engine/Canvas.js";
import { Camera } from "../engine/Camera.js";
import { Block } from "../engine/Block.js";

import { Planet } from "../universe_world_gen/Planet.js";

export class AtmosphereLighting {

	#lCanvas = null;
	#lCtx = null;
	#opacity = 0;
	#timer = 0;
	#counter = 0;
	#brightnessPoints = [];
	#minusCounter = 0;
	#difference = 0;
	#incrementTime = 0;
	#amount = 0;
	#lights = 0;
	#lightsChunk = [];
	#isHoldingTorch = false;
	#characterLightPos = [];
	#light = null;
	#lightsCanvas = null;
	#lcCtx = null;
	#sunMoonRotation = 0;
	#sunMoon = null;
	#sunPos = 0;

	constructor() {
		//Initialise the shadow canvas
		this.#lCanvas = document.getElementById("lighting");
		//Set canvas dimensions
		this.#lCanvas.width = Canvas.canvas.width;
		this.#lCanvas.height = Canvas.canvas.height;
		this.#lCtx = this.#lCanvas.getContext("2d");
		
		//Day segments (daytime/sunset/nightime/sunrise)
		this.#brightnessPoints = [[25200, 0], [10800, 0.9], [25200, 0.9], [10800, 0]];
		//this.#brightnessPoints = [[300,0],[300,0.9],[300,0.9],[300,0]];
		this.#minusCounter = this.#brightnessPoints.length - 1;
		//Difference between current alpha value and next alpha value
		this.#difference = (this.#brightnessPoints[0][1] - this.#brightnessPoints[this.#minusCounter][1]);
		//This time interval between opacity changes
		this.#incrementTime = this.#brightnessPoints[0][0] / (this.#difference * 10 * 10);
		this.#incrementTime = isFinite(this.#incrementTime) ? this.#incrementTime : 0;
		this.#amount = 0;
		Canvas.ctx.fillStyle = "black";

		this.#lights = [];
		this.#lightsChunk = [];

		//Variable checks if player is holding a torch
		this.#isHoldingTorch = false;
		//Position of torch held by player
		this.#characterLightPos = [(Math.floor(((window.innerWidth / 2) - (Planet.size / 2)) / Planet.size) * Planet.size) - 90, (Math.floor(((window.innerHeight / 2) - Planet.size) / Planet.size) * Planet.size) - Planet.size];

		//The light image
		this.#light = document.getElementById("light");
		//Canvas for preprocessing lighting on canvas
		this.#lightsCanvas = document.getElementById("lightsCanvas");
		this.#lightsCanvas.width = this.#lightsCanvas.height = 1050;
		//Canvas context
		this.#lcCtx = this.#lightsCanvas.getContext("2d");

		//Rotation of sun and moon
		this.#sunMoonRotation = -90;

		//Sun and moon image and it's position
		this.#sunMoon = document.getElementById("sunMoon");
		this.#sunPos = (window.innerWidth / 2) - (this.#sunMoon.width / 2);

		let _this = this;
		//Event called when light added to the game
		window.addEventListener("lightAdded", function (e) {
			_this.addLights(e, 1);
		});
		//Event called when light is removed from the game
		window.addEventListener("lightRemoved", function (e) {
			_this.addLights(e, 0);
		});
		window.addEventListener("showCharacterTorch", function (e) {
			//Shows the torch in the characters hand
			_this.#isHoldingTorch = e.detail;
		});
	}
	addLights(e, value) {
		//Lights chunk XY
		let X = Math.floor((e.detail[0] - 3) / 35),
			Y = Math.floor((e.detail[1] - 3) / 35),
			x = e.detail[0] - 3,
			y = e.detail[1] - 3;
		//Checks if lights y row exists (-3 blocks from lights centre)
		if (this.#lights[y] == undefined && value === 1) {
			this.#lights[y] = [];
		}
		//Checks if light exists at XY (-3 blocks from centre)
		if (this.#lights[y][x] == undefined && value === 1) {
			this.#lights[y][x] = value;
		} else {
			if (value === 0) {
				this.#lights[y][x] = value;
			}
		}
		//Rerender light chunk at XY
		this.updateLightChunk(X, Y);
		if ((e.detail[0] - 3) % 7 !== 0) {
			this.updateLightChunk(X + 1, Y);
		} else if ((e.detail[0] + 3) % 7 !== 0) {
			this.updateLightChunk(X - 1, Y);
		}
		if ((e.detail[1] - 3) % 7 !== 0) {
			this.updateLightChunk(X, Y + 1);
		} else if ((e.detail[1] + 3) % 7 !== 0) {
			this.updateLightChunk(X, Y - 1);
		}
	}

	updateLightChunk(X, Y) {
		//Clears the light chunk canvas
		this.#lcCtx.clearRect(0, 0, 35 * Planet.size, 35 * Planet.size);
		//Checks if the light chunk Y exists
		if (this.#lightsChunk[Y] == undefined) {
			//Creates chunk if non existent
			this.#lightsChunk[Y] = [];
		}
		//Loops through the possible light positions in the chunk
		for (let y = (Y * 35) - 3; y < (Y * 35) + 38; y++) {
			if (this.#lights[y] != undefined) {
				for (let x = (X * 35) - 3; x < (X * 35) + 38; x++) {
					if (this.#lights[y][x] !== 0 && this.#lights[y][x] !== undefined) {
						//If a light exists at XY, render it to the canvas
						this.#lcCtx.drawImage(this.#light, 0, 0, 140, 140, (x * Planet.size) - (X * 35 * Planet.size), (y * Planet.size) - (Y * 35 * Planet.size), 210, 210);
					}
				}
			}
		}
		/*Saves the canvas as an image and
		  sets the value of light chunk XY to the image */
		let img = document.createElement("img");
		img.src = this.#lightsCanvas.toDataURL();
		this.#lightsChunk[Y][X] = img;
	}

	//Currently unused
	round(num) {
		return parseFloat(num.toFixed(2));
	}

	update() {
		//console.time("speed");

		this.#sunMoonRotation += 360 / 72000;

		if (this.#timer == this.#brightnessPoints[this.#counter][0]) {
			//Increments counter and minusCounter
			this.#minusCounter = ++this.#counter - 1;
			this.#minusCounter = this.#minusCounter == 4 ? 0 : this.#minusCounter;
			this.#timer = 0;
			//Resets counter if it matches the array length (i.e is animating last segment)
			if (this.#counter == this.#brightnessPoints.length) {
				this.#counter = 0;
				this.#minusCounter = 1;
			}
			//Difference between current alpha value and next alpha value
			this.#difference = this.#brightnessPoints[this.#counter][1] - this.#brightnessPoints[this.#minusCounter][1];
			//This time interval between opacity changes
			this.#incrementTime = this.#brightnessPoints[this.#counter][0] / (this.#difference * 10 * 10);
			this.#incrementTime = isFinite(this.#incrementTime) ? this.#incrementTime : 0;
			//How much the opacity should increment/decrement by
			this.#amount = Math.sign(this.#incrementTime) == 1 ? 0.9 / 90 : -(0.9 / 90);
		} else {
			//Increment timer
			this.#timer++;
			if ((this.#timer % Math.floor(this.#incrementTime) == 0 || this.#timer % -Math.floor(this.#incrementTime) == 0) && this.#incrementTime != 0) {
				//Increment/decrement opacity if timer has incremented by incrementTime value
				this.#opacity = this.#opacity > 0.9 || this.#opacity == 0.91 ? 0.9 : this.#opacity < 0 ? 0 : this.#opacity + this.#amount;
			}
		}
		if (this.#opacity != 0) {
			//Colour the canvas black with opacity
			this.#lCtx.clearRect(0, 0, this.#lCanvas.width, this.#lCanvas.height);
			//this.#lCtx.fillStyle = "rgba(0,0,0,0.9)";
			this.#lCtx.fillStyle = "rgba(0,0,0," + this.#opacity + ")";

			//If holding torch, this renders the torch in the character's hand
			if (this.#isHoldingTorch) {
				this.#lCtx.drawImage(this.#light, 0, 0, 140, 140, this.#characterLightPos[0], this.#characterLightPos[1], 7 * Planet.size, 7 * Planet.size);
			}
			//Loops through all light cunks and renders them

			//Sets chunks to render
			this.chunksY = Math.floor(Math.round(window.innerHeight / Planet.size) / 35) + Math.floor(Math.round(Camera.camY / Planet.size) / 35) + 1;
			this.chunksX = Math.floor(Math.round(window.innerWidth / Planet.size) / 35) + Math.floor(Math.round(Camera.camX / Planet.size) / 35) + 1;

			//Loops through chunks to render
			for (var y = Math.floor(Math.round(Camera.camY / Planet.size) / 35) - 1; y < this.chunksY; y++) {
				if (this.#lightsChunk[y] != undefined) {
					for (var x = Math.floor(Math.round(Camera.camX / Planet.size) / 35) - 1; x < this.chunksX; x++) {
						if (this.#lightsChunk[y][x] != undefined) {
							//Render light chunks
							Block.imageShape(this.#lCtx, this.#lightsChunk[y][x], 0, 0, 1050, 1050, x * 35, y * 35, 1050, 1050);
						}
					}
					//If near left or right boudary of world, draw light chunks from the opposite side of map
					if (Camera.camX < 30 * Planet.size && this.#lightsChunk[y][28] != undefined) {
						Block.imageShape(this.#lCtx, this.#lightsChunk[y][28], 0, 0, 1050, 1050, -20, y * 35, 1050, 1050);
					} else if (Camera.camX > 950 * Planet.size && this.#lightsChunk[y][0] != undefined) {
						Block.imageShape(this.#lCtx, this.#lightsChunk[y][0], 0, 0, 1050, 1050, 1000, y * 35, 1050, 1050);
					}
				}
			}

			//This only draws the darkness on non alpha parts of the canvas
			this.#lCtx.globalCompositeOperation = "source-out";
			this.#lCtx.fillRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
			this.#lCtx.globalCompositeOperation = "source-over";

			//Draws the lights canvas on top of the main canvas
			Canvas.ctx.globalCompositeOperation = "source-atop";
			Canvas.ctx.drawImage(this.#lCanvas, 0, 0, Canvas.canvas.width, Canvas.canvas.height, 0, 0, Canvas.canvas.width, Canvas.canvas.height);
		}
		//Draws the sun and moon behind everything on the screen
		Canvas.ctx.globalCompositeOperation = "destination-over";
		//this.#ctx.rotate((Math.PI / 180) * -90);
		Canvas.ctx.translate(this.#sunPos + this.#sunMoon.width / 2, this.#sunMoon.height / 2);
		Canvas.ctx.rotate(this.#sunMoonRotation * Math.PI / 180);
		Canvas.ctx.translate(-this.#sunPos - this.#sunMoon.width / 2, -this.#sunMoon.height / 2);
		Canvas.ctx.drawImage(this.#sunMoon, 0, 0, this.#sunMoon.width, this.#sunMoon.height, this.#sunPos, 0, this.#sunMoon.width, this.#sunMoon.height);
		Canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
		//this.#ctx.rotate((Math.PI / 180) * 90);
		//Only draws the sky colour if it is not night time
		if (this.#opacity < 0.9) {
			Canvas.ctx.fillStyle = "rgba(137, 207, 240," + (0.9 - this.#opacity) + ")";
			//this.#ctx.fillStyle = "rgba(137, 207, 240,0.9)";
			Canvas.ctx.fillRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
		}
		Canvas.ctx.globalCompositeOperation = "source-over";
	}

	resize() {
		this.#lCanvas.width = Canvas.canvas.width;
		this.#lCanvas.height = Canvas.canvas.height;
	}
}
