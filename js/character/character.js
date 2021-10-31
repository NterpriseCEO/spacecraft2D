import * as camera from "../engine/camera.js"
import { Animation } from "../engine/animations.js"

import { Tileset } from "../universe_world_gen/tilesetTerrain.js"
import * as world from "../universe_world_gen/terrainGen.js"
import { Key } from "../events/keys.js";


export class Character {
    constructor(ctx) {

        this.characterAnimation = new Animation(20);

        //super()
        //Refenreces the main canvas context
        this.ctx = ctx;
        this.posY = Math.floor(((window.innerHeight/2)-world.size)/world.size)*world.size;
        this.posX = (window.innerWidth/2)-(world.size/2);
        console.log(this.posX/30);

        //Intialies the tileset
        this.t = new Tileset();
        this.image = this.t.image;

        let _this = this;

        camera.setCameraPos(0,world.size*165);

        //References the coordinates element
        this.coords = document.getElementById("coords");

        //Intialies character variables
        this.canFall = true;
        this.canJump = true;
        this.isJumping = false;
        this.jumpCounter = 0;
        this.spd = 2;
        this.speed = [this.spd,this.spd];
        this.fallSpeed = 2;
        this.dir = 0;
        this.health = 100;
        this.fallTimer = 0;
        this.isMoving = true;
        this.blockFall = 0;
        this.isFalling = false;
        this.lastPosX = camera.camX/world.size;
        this.lastPosY = camera.camY/world.size;

        //References the healthBar element
        this.healthBar = document.getElementById("healthIndicator");
    }

    changeDirection(x) {
        this.dir = x < window.innerWidth/2?3:0;
    }

    renderCharacter() {
        //Set moving to false
        this.checkCollision();
        this.isMoving = false;

        if(Key.isDown("d") || Key.isDown("D")) {
            //Move camera right
            camera.moveCamera(this.speed[1],0);
            this.isMoving = true;
        }
        if(Key.isDown("w") || Key.isDown("W")) {
            this.canFall = false;
            camera.moveCamera(0,-this.speed[0]);
            this.spd = 7;
        }else {
            if(!this.isFalling) {
                this.spd = 2;
            }
        }
        if(Key.isDown("a") || Key.isDown("A")) {
            //Move camera left
            camera.moveCamera(-this.speed[0],0);
            this.isMoving = true;
        }

        //Jump if not jumping
        if(Key.isDown(" ") && !this.isJumping && !this.canFall) {
            this.isJumping = true;
            this.isFalling = false;
            this.isMoving = true;
        }
        //Move to other side of world
        if(camera.camX+1 < 1) {
            camera.setCameraPos(world.size*1000,camera.camY)
        }else if(Math.floor(camera.camX)/world.size > 1000) {
            camera.setCameraPos(0,camera.camY)
        }
        //Run moving animation if moving
        if(!this.isJumping && !this.isFalling) {
            if(this.isMoving) {
                this.characterAnimation.animate(0+this.dir,1+this.dir,15);
            }else {
                //Switch animation to correct one for corresponding direction
                //Loop standing animation
                this.characterAnimation.animateList([0+this.dir,2+this.dir],30);
            }
        }

        //If can fall and not jumping: move camera down (fall)
        if(this.canFall && !this.isJumping) {
            if(!this.isFalling) {
                this.isFalling = true;
                //Height player fell from
                this.blockFall = camera.camY;
                //this.spd = 0.5;
            }
            this.isMoving = true;
            camera.moveCamera(0,this.fallSpeed);
            this.jumpCounter = 0;
        }

        if(this.canJump) {
            //If jumping and counter < 30, increase counter
            if(this.isJumping && this.jumpCounter < 30) {
                this.jumpCounter++;
            }else {
                //Set counter to 0 jumping false
                this.jumpCounter = 0;
                this.isJumping = false;
            }
            //If can jump move camera up (jump)
            if(this.isJumping) {
                camera.moveCamera(0,-this.fallSpeed);
                this.isMoving = true;
            }
        }
        //Draw the character and correct frames
        this.ctx.drawImage(this.image,this.characterAnimation.getFrame(),Math.round(this.t.character.y),20,40,this.posX,this.posY,Math.round(world.size),Math.round(world.size*2));
        //console.log(this.spd);
        //Show the characters coordinates position
        this.coords.innerHTML = "X: "+Math.floor(camera.camX/world.size)+"<br>Y: "+Math.floor(camera.camY/world.size);
    }
    XOR(a,b) {
        return ( a || b ) && !( a && b );
    }
    checkCollision() {
        //console.log(this.spd,this.isFalling);
        //Get characters X/Y coords in block coords
        let x = Math.floor(camera.camX/world.size),
            y = Math.floor(camera.camY/world.size);
        //Can fall/jump = true
        this.canFall = true;
        this.canJump = true;
        //Set character speed
        this.speed = [this.spd,this.spd];

        this.fallTimer++;
        //Checks if world y exists
        if(world.world[y] != undefined) {
            if(world.world[y][x] != undefined) {
                let x1 = x+1>=1000?0:x+1,
                    pos = world.world[y][x],
                    c = world.world[y][x1];
                //Checks if world xy pos is air or camera pos is at block boundary
                if(camera.camY == y*world.size && (!pos.canWalkThrough || !c.canWalkThrough)) {
                    //Checks if camera x is colliding with block at feet
                    if((camera.camX+world.size != x1*world.size && x1 != 0) || !pos.canWalkThrough || (x1 == 0 && camera.camX > world.size*999 && camera.camX <= world.size*1000)) {
                        this.canFall = false;
                        //If player has fallen a certain distance, calculate damage to player
                        if(this.blockFall != 0 && camera.camY-this.blockFall > world.size*4) {
                            this.blockFall = 0;

                            this.health-=(camera.camY-this.blockFall)/150;
                            this.healthBar.style.width = (this.health*2)+"px";
                        }
                        this.isFalling = false;
                        this.fallTimer = 0;
                    }
                }
            }
        }

        //Checks for collisions on each side of character
        this.sideChecker(x,y,-1,-1,0);
        this.sideChecker(x,y,1,-1,1);
        this.sideChecker(x,y,-1,-2,0);
        this.sideChecker(x,y,1,-2,1);

        //Checks if blocks y-3 exists
        if(world.world[y-3] != undefined) {
            //Checks if x not undefined
            if(world.world[y-3][x] != undefined) {
                //Checks if pos xy is not air or cameraY pos is at block boundary
                let x1 = x+1>=1000?0:x+1,
                    pos = world.world[y-3][x],
                    c = world.world[y-3][x1];
                //console.log(camera.camX,camera.camX+world.size-(world.size*999),x1*world.size,"  ",camera.camX+world.size,x1*world.size);
                //Checks if world xy pos is air or camera pos is at block boundary
                if(camera.camY == y*world.size && (!pos.canWalkThrough || !c.canWalkThrough)) {
                    //Checks if camera x is colliding with block at feet
                    if((camera.camX+world.size != x1*world.size && x1 != 0) || !pos.canWalkThrough || (x1 == 0 && camera.camX > world.size*999 && camera.camX <= world.size*1000)) {
                        //Prevent movement upwards
                        this.canJump = false;
                        this.isJumping = false;
                        this.isMoving = false;
                    }
                }
            }
        }
        let X = Math.floor(camera.camX/world.size),
            Y = Math.floor(camera.camY/world.size)-1;
        //check if drop XY exists
        if(world.dropItems[Y] != undefined) {
            if(world.dropItems[Y][X] != undefined) {
                let length = world.dropItems[Y][X].length;
                //Loop through all blocks at drop point
                for(let i = 0; i < length; i++) {
                    //Add block to inventory
                    window.dispatchEvent(new CustomEvent("addInventoryItem",{
                        detail:world.dropItems[Y][X][world.dropItems[Y][X].length-1]
                    }));
                    window.addEventListener("hasSpace",removeDropItem(X,Y,i));
                }
                function removeDropItem(X,Y,i) {
                    world.removeDropItem(X,Y,i);
                    window.removeEventListener("hasSpace",removeDropItem);
                }
                let xx = Math.floor(X/10)*10,
                    yy = Math.floor(Y/10)*10;
                window.dispatchEvent(new CustomEvent("updateDroppables",{detail:[xx,yy]}));
            }
        }
    }
    sideChecker(x,y,mx,my,d) {
        if(my == -1) {
            //XY position
        }
        if(world.world[y+my] != undefined) {
            //console.log(x+mx);
            let x1 = x+mx>=1000?0:x+mx==-1?999:x+mx,
                x2 = x==1000?0:x;
            if(world.world[y+my][x1] != undefined) {
                let pos = world.world[y+my][x1],
                    c = world.world[y][x1],
                    r = world.world[y][x2];
                if(camera.camX == x2*world.size && (!pos.canWalkThrough || (!c.canWalkThrough && r.canWalkThrough))) {
                    //console.log(x1,x2);
                    this.speed[d] = 0;
                    //console.log(this.speed[d],x);
                    this.isMoving = false;
                }
            }
        }
    }
    moving() {
        return this.isMoving;
    }
    damage(value) {
        this.health-=value;
    }
    setHealth(value) {
        this.health = value;
    }
    reset() {
        //Reset health
        let cameraPos = 0;
        //Sets camera position to first block with
        for(let y = 100; y < 1000; y++) {
            if(world.world[y][0].id == "air") {
                cameraPos = y+1;
            }else {
                break;
            }
        }
        this.health = 100;
        this.healthBar.style.width = "100%";
        camera.setCameraPos(0,world.size*cameraPos);
    }

    reposition() {
        this.posY = Math.floor(((window.innerHeight/2)-world.size)/world.size)*world.size;
        this.posX = (window.innerWidth/2)-(world.size/2);
        camera.reposition();
    }
}
