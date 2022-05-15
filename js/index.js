import { Canvas } from "./engine/Canvas.js";
import { Camera } from "./engine/Camera.js";
import { Block } from "./engine/Block.js";

import { Tileset } from "./universe_world_gen/TilesetTerrain.js";

import { RenderWorld } from "./universe_world_gen/RenderWorld.js";
import { Click } from "./events/Events.js";
import { Character } from "./character/Character.js";
import { AtmosphereLighting } from "./atmosphere_lighting/AtmosphereLighting.js";
import { BlockPlacement } from "./object_placement/BlockPlacement.js";

let instructionsOpen = false;

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

	function addItems(e) {
		if(e.target.id == "canvas") {
			window.dispatchEvent(new CustomEvent("addNewItems", {
				detail: [
					[Tileset.LADDER, 1000, null],
				]
			}));
			window.removeEventListener("click", addItems);
		}
	}
	window.addEventListener("click", addItems);

	document.getElementById("instructionsButton").addEventListener("click", function () {
		instructionsOpen = true;
		document.getElementById("instructions").classList.remove("hide");
	});
	document.getElementById("closeInstructions").addEventListener("click", function () {
		instructionsOpen = false;
		document.getElementById("instructions").classList.add("hide");
	});

	//Disables anti-aliasing for pixel effect
	Canvas.ctx.imageSmoothingEnabled = false;

	//Initialises the click events
	let click = new Click(character);
	click.events();

	//Renders game
	document.body.classList.add("skyColour");
	window.requestAnimationFrame(render);

	function render(timestamp) {
		if(instructionsOpen) {
			window.requestAnimationFrame(render);
			return;
		}

		//console.time("speed");
		//Only if moving or clicking
		character.checkIfInWater();
		character.checkIfInLava();

		if (character.getHealth() <= 0) {
			character.reset(100);
		}
		if (character.isMoving || click.clicking) {
			//Clears screen
			click.renderCursor();
		}
		Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
		//Renders the character
		character.renderCharacter();
		try {
			world.renderWorld(Camera.camX - Camera.startX, Camera.camY - Camera.startY, timestamp);
		}catch(e) {
			console.log(e);
		}
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

export {
	instructionsOpen
}

/*function random(limit) {
	return Math.floor(Math.random() * limit) + 1
}*/
