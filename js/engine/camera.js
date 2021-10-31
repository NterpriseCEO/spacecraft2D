import * as world from "../universe_world_gen/terrainGen.js"

let camX = 0,
    camY = 0,
    startX = (window.innerWidth/2)-(world.size/2),//Middle of screen
    startY = Math.floor(((window.innerHeight/2)+world.size)/world.size)*world.size;//Middle of screen
console.log(startX);
//Sets camera position in X/Y coords
export function setCameraPos(x,y) {
    camX = x;
    camY = y;
}

//Moves camera by X/Y units
export function moveCamera(x,y) {
    camX+=x;
    camY+=y;
}

export function reposition() {
    startX = (window.innerWidth/2)-(world.size/2);
    startY = Math.floor(((window.innerHeight/2)+world.size)/world.size)*world.size;
}

export {
    camX,
    camY,
    startX,
    startY
}
