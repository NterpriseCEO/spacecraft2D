import { Canvas } from "../engine/Canvas.js";
import { Camera } from "../engine/Camera.js";
import { Animation } from "../engine/Animations.js";

import { Tileset } from "../universe_world_gen/TilesetTerrain.js";
import { Planet } from "../universe_world_gen/Planet.js";
import { Earth } from "../universe_world_gen/Earth.js";
import { Key } from "../events/Keys.js";


export class Character {

	#posY = 0;
	#posX = 0;
	#canFall = true;
	#canJump = true;
	#isJumping = false;
	#jumpCounter = 0;
	#spd = 0;
	#speed = [];
	#fallSpeed = 0;
	#dir = 0;
	#health = 0;
	// #fallTimer = 0;
	isMoving = true;
	#blockFall = 0;
	#isFalling = false;
	// #lastPosX = 0;
	// #lastPosY = 0;
	#healthBar = null;
	#coords = null;

	constructor() {

		this.characterAnimation = new Animation(20);

		//super()
		//Refenreces the main canvas context
		this.#posY = Math.floor(((window.innerHeight / 2) - Planet.size) / Planet.size) * Planet.size;
		this.#posX = (window.innerWidth / 2) - (Planet.size / 2);
		console.log(this.#posX / 30);

		Camera.setCameraPos(0, Planet.size * 165);

		//References the coordinates element
		this.#coords = document.getElementById("coords");

		//Intialies character variables
		this.#spd = 2;
		this.#speed = [this.#spd, this.#spd];
		this.#fallSpeed = 2;
		this.#health = 100;
		// this.#lastPosX = Camera.camX / Planet.size;
		// this.#lastPosY = Camera.camY / Planet.size;

		//References the healthBar element
		this.#healthBar = document.getElementById("healthIndicator");
	}

	changeDirection(x) {
		this.#dir = x < window.innerWidth / 2 ? 3 : 0;
	}

	renderCharacter() {
		//Set moving to false
		this.checkCollision();
		this.isMoving = false;

		if (Key.isDown("d") || Key.isDown("D")) {
			//Move camera right
			Camera.moveCamera(this.#speed[1], 0);
			this.isMoving = true;
		}
		if (Key.isDown("w") || Key.isDown("W")) {
			this.#canFall = false;
			Camera.moveCamera(0, -this.#speed[0]);
			this.#spd = 7;
		} else {
			if (!this.#isFalling) {
				this.#spd = 2;
			}
		}
		if (Key.isDown("a") || Key.isDown("A")) {
			//Move camera left
			Camera.moveCamera(-this.#speed[0], 0);
			this.isMoving = true;
		}

		//Jump if not jumping
		if (Key.isDown(" ") && !this.#isJumping && !this.#canFall) {
			this.#isJumping = true;
			this.#isFalling = false;
			this.isMoving = true;
		}
		//Move to other side of world
		if (Camera.camX + 1 < 1) {
			Camera.setCameraPos(Planet.size * 1000, Camera.camY);
		} else if (Math.floor(Camera.camX) / Planet.size > 1000) {
			Camera.setCameraPos(0, Camera.camY);
		}
		//Run moving animation if moving
		if (!this.#isJumping && !this.#isFalling) {
			if (this.isMoving) {
				this.characterAnimation.animate(0 + this.#dir, 1 + this.#dir, 15);
			} else {
				//Switch animation to correct one for corresponding direction
				//Loop standing animation
				this.characterAnimation.animateList([0 + this.#dir, 2 + this.#dir], 60);
			}
		}

		//If can fall and not jumping: move camera down (fall)
		if (this.#canFall && !this.#isJumping) {
			if (!this.#isFalling) {
				this.#isFalling = true;
				//Height player fell from
				this.#blockFall = Camera.camY;
				//this.#spd = 0.5;
			}
			this.isMoving = true;
			Camera.moveCamera(0, this.#fallSpeed);
			this.#jumpCounter = 0;
		}

		if (this.#canJump) {
			//If jumping and counter < 30, increase counter
			if (this.#isJumping && this.#jumpCounter < 30) {
				this.#jumpCounter++;
			} else {
				//Set counter to 0 jumping false
				this.#jumpCounter = 0;
				this.#isJumping = false;
			}
			//If can jump move camera up (jump)
			if (this.#isJumping) {
				Camera.moveCamera(0, -this.#fallSpeed);
				this.isMoving = true;
			}
		}
		//Draw the character and correct frames
		Canvas.ctx.drawImage(Tileset.image, this.characterAnimation.getFrame(), Math.round(Tileset.character.y), 20, 40, this.#posX, this.#posY, Math.round(Planet.size), Math.round(Planet.size * 2));
		//console.log(this.#spd);
		//Show the characters coordinates position
		this.#coords.innerHTML = "X: " + Math.floor(Camera.camX / Planet.size) + "<br>Y: " + Math.floor(Camera.camY / Planet.size);
	}
	XOR(a, b) {
		return (a || b) && !(a && b);
	}
	checkCollision() {
		//console.log(this.#spd,this.#isFalling);
		//Get characters X/Y coords in block coords
		let x = Math.floor(Camera.camX / Planet.size),
			y = Math.floor(Camera.camY / Planet.size);
		//Can fall/jump = true
		this.#canFall = true;
		this.#canJump = true;
		//Set character speed
		this.#speed = [this.#spd, this.#spd];

		// this.#fallTimer++;

		//Checks if world y exists
		if (Earth.world[y] != undefined) {
			if (Earth.world[y][x] != undefined) {
				let x1 = x + 1 >= 1000 ? 0 : x + 1,
					pos = Earth.world[y][x],
					c = Earth.world[y][x1];
				//Checks if world xy pos is air or camera pos is at block boundary
				if (Camera.camY == y * Planet.size && (!pos.canWalkThrough || !c.canWalkThrough)) {
					//Checks if camera x is colliding with block at feet
					if ((Camera.camX + Planet.size != x1 * Planet.size && x1 != 0) || !pos.canWalkThrough || (x1 == 0 && Camera.camX > Planet.size * 999 && Camera.camX <= Planet.size * 1000)) {
						this.#canFall = false;
						//If player has fallen a certain distance, calculate damage to player
						if (this.#blockFall != 0 && Camera.camY - this.#blockFall > Planet.size * 4) {
							this.#blockFall = 0;

							this.#health -= (Camera.camY - this.#blockFall) / 150;
							this.#healthBar.style.width = (this.#health * 2) + "px";
						}
						this.#isFalling = false;
						// this.#fallTimer = 0;
					}
				}
			}
		}

		//Checks for collisions on each side of character
		this.sideChecker(x, y, -1, -1, 0);
		this.sideChecker(x, y, 1, -1, 1);
		this.sideChecker(x, y, -1, -2, 0);
		this.sideChecker(x, y, 1, -2, 1);

		//Checks if blocks y-3 exists
		if (Earth.world[y - 3] != undefined) {
			//Checks if x not undefined
			if (Earth.world[y - 3][x] != undefined) {
				//Checks if pos xy is not air or cameraY pos is at block boundary
				let x1 = x + 1 >= 1000 ? 0 : x + 1,
					pos = Earth.world[y - 3][x],
					c = Earth.world[y - 3][x1];
				//console.log(Camera.camX,Camera.camX+Planet.size-(Planet.size*999),x1*Planet.size,"  ",Camera.camX+Planet.size,x1*Planet.size);
				//Checks if world xy pos is air or camera pos is at block boundary
				if (Camera.camY == y * Planet.size && (!pos.canWalkThrough || !c.canWalkThrough)) {
					//Checks if camera x is colliding with block at feet
					if ((Camera.camX + Planet.size != x1 * Planet.size && x1 != 0) || !pos.canWalkThrough || (x1 == 0 && Camera.camX > Planet.size * 999 && Camera.camX <= Planet.size * 1000)) {
						//Prevent movement upwards
						this.#canJump = false;
						this.#isJumping = false;
						this.isMoving = false;
					}
				}
			}
		}
		let X = Math.floor(Camera.camX / Planet.size),
			Y = Math.floor(Camera.camY / Planet.size) - 1;
		//check if drop XY exists
		if (Earth.dropItems[Y] != undefined) {
			if (Earth.dropItems[Y][X] != undefined) {
				let length = Earth.dropItems[Y][X].length;
				//Loop through all blocks at drop point
				for (let i = 0; i < length; i++) {
					//Add block to inventory
					window.dispatchEvent(new CustomEvent("addInventoryItem", {
						detail: Earth.dropItems[Y][X][Earth.dropItems[Y][X].length - 1]
					}));
					window.addEventListener("hasSpace", this.removeDropItem(X, Y, i));
				}
				let xx = Math.floor(X / 10) * 10,
					yy = Math.floor(Y / 10) * 10;
				window.dispatchEvent(new CustomEvent("updateDroppables", { detail: [xx, yy] }));
			}
		}
	}
	sideChecker(x, y, mx, my, d) {
		if (my == -1) {
			//XY position
		}
		if (Earth.world[y + my] != undefined) {
			//console.log(x+mx);
			let x1 = x + mx >= 1000 ? 0 : x + mx == -1 ? 999 : x + mx,
				x2 = x == 1000 ? 0 : x;
			if (Earth.world[y + my][x1] != undefined) {
				let pos = Earth.world[y + my][x1],
					c = Earth.world[y][x1],
					r = Earth.world[y][x2];
				if (Camera.camX == x2 * Planet.size && (!pos.canWalkThrough || (!c.canWalkThrough && r.canWalkThrough))) {
					//console.log(x1,x2);
					this.#speed[d] = 0;
					//console.log(this.#speed[d],x);
					this.isMoving = false;
				}
			}
		}
	}
	moving() {
		return this.isMoving;
	}
	damage(value) {
		this.#health -= value;
	}
	setHealth(value) {
		this.#health = value;
	}
	reset() {
		//Reset health
		let cameraPos = 0;
		//Sets camera position to first block with
		for (let y = 100; y < 1000; y++) {
			if (Earth.world[y][0].id == "air") {
				cameraPos = y + 1;
			} else {
				break;
			}
		}
		this.#health = 100;
		this.#healthBar.style.width = "100%";
		Camera.setCameraPos(0, Planet.size * cameraPos);
	}

	removeDropItem(X, Y, i) {
		Earth.removeDropItem(X, Y, i);
		window.removeEventListener("hasSpace", this.removeDropItem);
	}

	reposition() {
		this.#posY = Math.floor(((window.innerHeight / 2) - Planet.size) / Planet.size) * Planet.size;
		this.#posX = (window.innerWidth / 2) - (Planet.size / 2);
		Camera.reposition();
	}
}
