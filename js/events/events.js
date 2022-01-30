import { Camera } from "../engine/camera.js";
import { Block } from "../engine/block.js";

import { Planet } from "../universe_world_gen/planet.js";
import { Earth } from "../universe_world_gen/Earth.js";
import { BlockPlacement } from "../object_placement/blockPlacement.js";

export class Click {

	#character;

	constructor(character) {
		//References blocks array
		
		this.blockPlacement = new BlockPlacement(character);

		this.#character = character;

		this.isDown = false;
		this.button = 0;
		this.mouseMoving = false;
		this.clicking = false;
		//References cursor element
		this.cursor = document.getElementById("cursor");
		this.cursorWidth = this.cursorHeight = Planet.size;
		this.cursorX = this.cursorY = 0;
	}

	XOR(a, b) {
		return (a || b) && !(a && b);
	}

	events() {
		let _this = this,
			interval;
		canvas.addEventListener("mousedown", function (e) {
			_this.isDown = true;
			_this.button = e.button;
			_this.clicking = true;
			interval = setInterval(function () {
				//Edit blocks if mouse not moving
				if (!_this.mouseMoving) {
					_this.blockEditing(e);
				}
			}, 1);
		});
		setTimeout(function () {
			canvas.dispatchEvent(new MouseEvent("mousedown"));
			setTimeout(function () {
				_this.clicking = false;
			}, 300);
		}, 100);
		canvas.addEventListener("mouseup", function (e) {
			_this.isDown = false;
			_this.mouseMoving = false;
			//Stop mining blocks
			_this.blockPlacement.stopMining();
			_this.blockPlacement.setLastPlacedBlock([]);
			setTimeout(function () {
				_this.clicking = false;
			}, 200);
			clearInterval(interval);
		});
		canvas.addEventListener("mousemove", function (e) {
			//_this.mouseMoving = true;
			//Edit blocks
			_this.blockEditing(e);
			_this.isMoving = true;
			_this.clientX = e.clientX;
			_this.clientY = e.clientY;
			//Render cursor and set position
			_this.renderCursor();
			BlockPlacement.setCursor(_this.cursorX, _this.cursorY, _this.cursorWidth, _this.cursorHeight);
			_this.#character.changeDirection(_this.cursorX);
			setTimeout(function () {
				_this.isMoving = false;
			}, 200);
		});
	}
	blockEditing(e) {
		if (this.isDown) {
			let x = this.clientX || e.clientX,
				y = this.clientY || e.clientY;
			if (this.button == 0) {
				//Left click: add blocks
				this.blockPlacement.addBlock(x, y, Camera.camX, Camera.camY,  Camera.startX, Camera.startY);
			} else if (this.button == 2) {
				//Right click: break blocks
				this.blockPlacement.removeBlock(x, y, Camera.camX, Camera.camY,  Camera.startX, Camera.startY);
			}
		}
	}
	renderCursor() {
		let pos = Block.pos(this.clientX, this.clientY);
		//Set curosr position in block coords
		let minusX = 0,
			minusY = 0;

		//Sets the cursor size to the world block size
		this.cursorWidth = this.cursorHeight = Planet.size;
		this.cursor.style.width = this.cursor.style.height = Planet.size + "px";

		let minus = Camera.startX - (Math.floor((window.innerWidth / 2) / Planet.size) * Planet.size);

		try {
			let y = ((Math.floor((this.clientY + Camera.camY) / Planet.size) * Planet.size) / Planet.size) - Math.floor(Camera.startY / Planet.size),
				x = ((Math.floor((this.clientX - minus + Camera.camX) / Planet.size) * Planet.size) / Planet.size) - Math.floor((Camera.startX - minus) / Planet.size);

			if (Earth.trees[y][x] != undefined) {
				//If trees exists at XY and selected tree part is on the right (0)
				if (Earth.trees[y][x][0] == 0) {
					minusX = Planet.size;
				}
				//Sets cursor size to tree size
				this.cursorWidth = (Planet.size * 2);
				this.cursorHeight = Earth.trees[y][x][2] == "tree" ? (Planet.size * 6) : (Planet.size * 2);
				this.cursor.style.width = this.cursorWidth + "px";
				this.cursor.style.height = this.cursorHeight + "px";

				//Loops through tree until at top of tree
				for (let Y = y; Y > y - 6; y--) {
					if (Earth.trees[y][x] != undefined) {
						//When at top, set cursor positon (minusY) to this value
						minusY = (Y - y) * Planet.size;
					} else {
						break;
					}
				}
			}
		} catch (e) {
			//Nothing here
		}
		//Sets css of cursor
		this.cursorX = (pos[0] - minusX);
		this.cursorY = (pos[1] - minusY);
		this.cursor.style.left = this.cursorX + "px";
		this.cursor.style.top = this.cursorY + "px";
		//this.world.setCursorPosition(this.clientX,this.clientY);
	}
}
