import * as camera from "./engine/camera.js"

import * as wrld from "./universe_world_gen/terrainGen.js"
import { RenderWorld } from "./universe_world_gen/renderWorld.js"
import { Click } from "./events/events.js"
import { Character } from "./character/character.js"
import { AtmosphereLighting } from "./atmosphere_lighting/atmosphereLighting.js"

//Checks if page is fully loaded
document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        //Runs init function
        init();
    }
}
function init() {
    //References the canvas
    let canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d");//Creates canvas context

    //Sets canvas width and height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Initialises the character and the world
    let character = new Character(ctx),
        atmosphereLighting = new AtmosphereLighting(ctx,canvas),
        world = new RenderWorld(ctx,character,canvas);

    window.addEventListener("resize",function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        character.reposition();
        atmosphereLighting.resize();
    });

    function addItems() {
        window.dispatchEvent(new CustomEvent("addNewItem",{
            detail:["furnace",1]
        }));
        window.dispatchEvent(new CustomEvent("addNewItem",{
            detail:["coal",10]
        }));
        window.dispatchEvent(new CustomEvent("addNewItem",{
            detail:["iron",10]
        }));
        window.removeEventListener("click",addItems);
    }
    window.addEventListener("click",addItems);

    //Disables anti-aliasing for pixel effect
    ctx.imageSmoothingEnabled = false;

    //Initialises the click events
    let click = new Click(world,character);
    click.events();

    //Renders game
    document.body.classList.add("skyColour")
    window.requestAnimationFrame(render);
    function render(time) {
        //console.time("speed");
        //Only if moving or clicking
        if(character.isMoving || click.clicking || character.health <= 0) {
            //Clears screen
            if(character.health <= 0) {
                character.reset(100);
            }
            //Renders the world at the characters X/Y coords
            click.renderCursor();
        }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //Renders the character
        character.renderCharacter();
        world.renderWorld(camera.camX-camera.startX,camera.camY-camera.startY,time);
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
