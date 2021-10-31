import * as camera from "./camera.js";

import * as world from "../universe_world_gen/terrainGen.js"

export function imageShape(ctx,img,ix,iy,iw,ih,x,y,w,h) {
    //Draws image at x pos in block coords - camera position
    ctx.drawImage(img,ix,iy,iw,ih,Math.floor(x*world.size)-(camera.camX-camera.startX),Math.floor(y*world.size)-(camera.camY-camera.startY),w,h);
}
export function shape(ctx,x,y,w,h,opacity) {
    ctx.fillStyle = "black";
    ctx.globalAlpha = opacity;
    //Draws shape at x pos in block coords - camera position
    ctx.fillRect(Math.floor(x*world.size)-(camera.camX-camera.startX),Math.floor(y*world.size)-(camera.camY-camera.startY),w,h);
    ctx.globalAlpha = 1;
}
//Absolute hollow shape
export function absHolShape(ctx,x,y,w,h) {
    let POS = pos(x,y);
    //Draws image at x pos in block coords - camera position
    ctx.strokeRect(POS[0],POS[1],w,h);
}
export function absImgShape(ctx,img,ix,iy,iw,ih,x,y,w,h,t) {
    ctx.drawImage(img,ix,iy,iw,ih,x,y,w,h);
}

function pos(x,y) {
    //Y = cursor position converted to block position - camera position
    let minus = camera.startX-(Math.floor((window.innerWidth/2)/world.size)*world.size),
        Y = (Math.floor((y+camera.camY)/world.size)*world.size)-camera.camY,
        X = (camera.startX-(Math.floor((window.innerWidth/2)/world.size)*world.size))
            +(Math.floor((x-minus+camera.camX)/world.size)*world.size)-camera.camX;
    return [X,Y];
}

export {
    pos
}
