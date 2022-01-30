import { Camera } from "./camera.js";

import { Planet } from "../universe_world_gen/planet.js";

export class Block {
	static imageShape(ctx, img, ix, iy, iw, ih, x, y, w, h) {
		//Draws image at x pos in block coords - camera position
		ctx.drawImage(img, ix, iy, iw, ih, Math.floor(x * Planet.size) - (Camera.camX - Camera.startX), Math.floor(y * Planet.size) - (Camera.camY - Camera.startY), w, h);
	}

	static shape(ctx, x, y, w, h, opacity) {
		ctx.fillStyle = "black";
		ctx.globalAlpha = opacity;
		//Draws shape at x pos in block coords - camera position
		ctx.fillRect(Math.floor(x * Planet.size) - (Camera.camX - Camera.startX), Math.floor(y * Planet.size) - (Camera.camY - Camera.startY), w, h);
		ctx.globalAlpha = 1;
	}

	//Absolute hollow shape
	static absHolShape(ctx, x, y, w, h) {
		let POS = Block.pos(x, y);
		//Draws image at x pos in block coords - camera position
		ctx.strokeRect(POS[0], POS[1], w, h);
	}

	static absImgShape(ctx, img, ix, iy, iw, ih, x, y, w, h) {
		ctx.drawImage(img, ix, iy, iw, ih, x, y, w, h);
	}

	static pos(x, y) {
		//Y = cursor position converted to block position - camera position
		let minus = Camera.startX - (Math.floor((window.innerWidth / 2) / Planet.size) * Planet.size),
			Y = (Math.floor((y + Camera.camY) / Planet.size) * Planet.size) - Camera.camY,
			X = (Camera.startX - (Math.floor((window.innerWidth / 2) / Planet.size) * Planet.size))
				+ (Math.floor((x - minus + Camera.camX) / Planet.size) * Planet.size) - Camera.camX;
		return [X, Y];
	}
}