import { Canvas } from "./engine/Canvas.js";
import { Camera } from "./engine/Camera.js";
import { Block } from "./engine/Block.js";

import { Tileset } from "./universe_world_gen/TilesetTerrain.js";

import { RenderWorld } from "./universe_world_gen/RenderWorld.js";
import { Click } from "./events/Events.js";
import { Character } from "./character/Character.js";
import { AtmosphereLighting } from "./atmosphere_lighting/AtmosphereLighting.js";
import { BlockPlacement } from "./object_placement/BlockPlacement.js";

//Checks if page is fully loaded
document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		//Runs init function
		init();
	}
};
function init() {
	//Sets canvas width and height
	Canvas.canvas.width = window.innerWidth;
	Canvas.canvas.height = window.innerHeight;

	//Initialises the character and the world
	let character = new Character(),
		atmosphereLighting = new AtmosphereLighting(),
		world = new RenderWorld(character);

	window.addEventListener("resize", function () {
		Canvas.canvas.width = window.innerWidth;
		Canvas.canvas.height = window.innerHeight;
		character.reposition();
		atmosphereLighting.resize();
	});

	function addItems() {
		window.dispatchEvent(new CustomEvent("addNewItem", {
			detail: ["furnace", 2]
		}));
		window.dispatchEvent(new CustomEvent("addNewItem", {
			detail: ["log", 64]
		}));
		window.dispatchEvent(new CustomEvent("addNewItem", {
			detail: ["iron", 64]
		}));
		window.dispatchEvent(new CustomEvent("addNewItem", {
			detail: ["string", 6]
		}));
		window.dispatchEvent(new CustomEvent("addNewItem", {
			detail: ["stick", 10]
		}));
		window.removeEventListener("click", addItems);
	}
	window.addEventListener("click", addItems);

	//Disables anti-aliasing for pixel effect
	Canvas.ctx.imageSmoothingEnabled = false;

	//Initialises the click events
	let click = new Click(character);
	click.events();

	//Renders game
	document.body.classList.add("skyColour");
	window.requestAnimationFrame(render);


	function render(timestamp) {
		//console.time("speed");
		//Only if moving or clicking
		if (character.isMoving || click.clicking || character.health <= 0) {
			//Clears screen
			if (character.health <= 0) {
				character.reset(100);
			}
			//Renders the world at the characters X/Y coords
			click.renderCursor();
		}
		Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
		//Renders the character
		character.renderCharacter();
		world.renderWorld(Camera.camX - Camera.startX, Camera.camY - Camera.startY, timestamp);
		//Show mining animation
		
		if (BlockPlacement.mining) {
			Block.absImgShape(Canvas.ctx, Tileset.image, BlockPlacement.breakPos * 20, 20, 20, 20, BlockPlacement.getCursor(0), BlockPlacement.getCursor(1), BlockPlacement.getCursor(2), BlockPlacement.getCursor(3), "test");
		}
		atmosphereLighting.update();

		//Requests next animation frame
		//console.timeEnd("speed");
		window.requestAnimationFrame(render);
	}
	/*function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

		showPoints  = showPoints ? showPoints : false;

		ctx.beginPath();

		drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

		if(showPoints) {
			ctx.stroke();
			ctx.beginPath();
			for(var i=0;i<ptsa.length-1;i+=2) {
				ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
			}
		}
	}*/
}

/*function random(limit) {
	return Math.floor(Math.random() * limit) + 1
}*/
