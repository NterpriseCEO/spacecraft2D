import { Planet } from "../universe_world_gen/Planet.js";

export class Camera {
	static camX = 0;
	static camY = 0;
	static startX = (window.innerWidth / 2) - (Planet.size / 2);//Middle of screen
	static startY = Math.floor(((window.innerHeight / 2) + Planet.size) / Planet.size) * Planet.size;//Middle of screen

	//Sets camera position in X/Y coords
	static setCameraPos(x, y) {
		Camera.camX = x;
		Camera.camY = y;
	}

	//Moves camera by X/Y units
	static moveCamera(x, y) {
		Camera.camX += x;
		Camera.camY += y;
	}

	static reposition() {
		Camera.startX = (window.innerWidth / 2) - (Planet.size / 2);
		Camera.startY = Math.floor(((window.innerHeight / 2) + Planet.size) / Planet.size) * Planet.size;
	}
}
