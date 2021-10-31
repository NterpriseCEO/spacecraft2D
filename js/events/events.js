import * as camera from "../engine/camera.js"
import * as shape from "../engine/block.js"

import * as world from "../universe_world_gen/terrainGen.js"

export class Click {
    constructor(world) {
        //References blocks array
        this.world = world;

        this.isDown = false;
        this.button = 0;
        this.mouseMoving = false;
        this.clicking = false;
        //References cursor element
        this.cursor = document.getElementById("cursor");
        this.cursorWidth = this.cursorHeight = world.size;
        this.cursorX = this.cursorY = 0;
    }

    XOR(a,b) {
        return ( a || b ) && !( a && b );
    }

    events() {
        let _this = this,
            interval;
        canvas.addEventListener("mousedown",function(e) {
            _this.isDown = true;
            _this.button = e.button;
            _this.clicking = true;
            interval = setInterval(function() {
                //Edit blocks if mouse not moving
                if(!_this.mouseMoving) {
                    _this.blockEditing(e);
                }
            },1);
        });
        setTimeout(function() {
            canvas.dispatchEvent(new MouseEvent("mousedown"));
            setTimeout(function() {
                _this.clicking = false;
            },300);
        },100);
        canvas.addEventListener("mouseup",function(e) {
            _this.isDown = false;
            _this.mouseMoving = false;
            //Stop mining blocks
            _this.world.stopMining();
            _this.world.lastPlacedBlock = [];
            setTimeout(function() {
                _this.clicking = false;
            },200);
            clearInterval(interval);
        });
        canvas.addEventListener("mousemove",function(e) {
            //_this.mouseMoving = true;
            //Edit blocks
            _this.blockEditing(e);
            _this.isMoving = true;
            _this.clientX = e.clientX;
            _this.clientY = e.clientY;
            //Render cursor and set position
            _this.renderCursor();
            _this.world.setCursor(_this.cursorX,_this.cursorY,_this.cursorWidth,_this.cursorHeight);
            setTimeout(function() {
                _this.isMoving = false;
            },200);
        });
    }
    blockEditing(e) {
        if(this.isDown) {
            let x = this.clientX || e.clientX,
                y = this.clientY || e.clientY,
                camX = camera.camX,
                camY = camera.camY,
                sX = camera.startX,
                sY = camera.startY;
            if(this.button == 0) {
                //Left click: add blocks
                this.world.addBlock(x,y,camX,camY,sX,sY);
            }else if(this.button == 2) {
                //Right click: break blocks
                this.world.removeBlock(x,y,camX,camY,sX,sY);
            }
        }
    }
    renderCursor() {
        let pos = shape.pos(this.clientX,this.clientY);
        //Set curosr position in block coords
        let minusX = 0,
            minusY = 0;

        //Sets the cursor size to the world block size
        this.cursorWidth = this.cursorHeight = world.size;
        this.cursor.style.width = this.cursor.style.height = world.size+"px";

        let minus = camera.startX-(Math.floor((window.innerWidth/2)/world.size)*world.size);

        try {
            let y = ((Math.floor((this.clientY+camera.camY)/world.size)*world.size)/world.size)-Math.floor(camera.startY/world.size),
                x = ((Math.floor((this.clientX-minus+camera.camX)/world.size)*world.size)/world.size)-Math.floor((camera.startX-minus)/world.size);

            if(world.trees[y][x] != undefined) {
                //If trees exists at XY and selected tree part is on the right (0)
                if(world.trees[y][x][0] == 0) {
                    minusX = world.size;
                }
                //Sets cursor size to tree size
                this.cursorWidth = (world.size*2);
                this.cursorHeight = world.trees[y][x][2] == "tree"?(world.size*6):(world.size*2);
                this.cursor.style.width = this.cursorWidth+"px";
                this.cursor.style.height = this.cursorHeight+"px";

                //Loops through tree until at top of tree
                for(let Y = y; Y > y-6; y--) {
                    if(world.trees[y][x] != undefined) {
                        //When at top, set cursor positon (minusY) to this value
                        minusY = (Y-y)*world.size;
                    }else {
                        break;
                    }
                }
            }
        } catch (e) {
        }
        //Sets css of cursor
        this.cursorX = (pos[0]-minusX);
        this.cursorY = (pos[1]-minusY);
        this.cursor.style.left = this.cursorX+"px";
        this.cursor.style.top = this.cursorY+"px";
        //this.world.setCursorPosition(this.clientX,this.clientY);
    }
}
