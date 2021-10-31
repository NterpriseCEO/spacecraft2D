import * as camera from "../engine/camera.js"
import * as shape from "../engine/block.js"

import { Tileset } from "../universe_world_gen/tilesetTerrain.js"
import * as world from "../universe_world_gen/terrainGen.js"
import { Inventory } from "../inventory_crafting_smelting/inventory.js"

export class RenderWorld {

    constructor(ctx,character) {
        //super()

        //Initialise the inventory
        this.inventory = new Inventory();

        this.plants = document.getElementById("plants");

        //Create a reference to the canvas context
        this.ctx = ctx;
        //Create a reference to the character
        this.character = character;

        this.t = new Tileset();
        this.image = this.t.image;

        this.chunks = [];
        this.shadowChunks = [];
        this.droppablesChunks = [];

        this.cursor = [0,0,world.size,world.size];
        this.mining = false;
        this.lastBlock = [];
        this.lastPlacedBlock = [];
        this.isFirstBlock = true;

        this.breakPos = 0;

        world.createWorld(this.t);

        this.hCanvas = document.getElementById("chunk");
        this.hCtx = this.hCanvas.getContext("2d");
        this.hCanvas.width = world.size*10;
        this.hCanvas.height = world.size*10;

        this.hCtx.imageSmoothingEnabled = false;

        // Generate random data
        this.lines = [];
        this.lines2 = [];

        //Sets the amount of chunks to load
        this.chunksX = Math.floor(Math.round(window.innerWidth/world.size)/10);
        this.chunksY = Math.floor(Math.round(window.innerHeight/world.size)/10)+Math.floor(Math.round(camera.camY/world.size)/10)+1;


        //Renders those chunks
        for(let y = 0; y < this.chunksY; y++) {
            for(let x = 0; x < this.chunksX; x++) {
                //console.log("test");
                this.updateChunk(x*10,y*10);
                this.updateShadow(x*10,y*10);
            }
        }
        //Sets the camera position to the first solid block at x = 0
        let cameraPos = 0;
        for(let y = 100; y < 1000; y++) {
            if(world.world[y][0].id == "air") {
                cameraPos = y+1;
            }else {
                break;
            }
        }
        camera.setCameraPos(0,world.size*cameraPos);

        let _this = this;
        window.addEventListener("updateDroppables",function(e) {
            //Update droppable chunks
            _this.updateDroppables(e.detail[0],e.detail[1]);
        });

        window.addEventListener("toggleFurnaceHeat",function(e) {
            let X = e.detail.x,
                Y = e.detail.y,
                x = Math.floor(X/10)*10,
                y = Math.floor(Y/10)*10;
            let type = e.detail.open ? _this.t.FRNC_HOT : _this.t.FRNC;
            world.world[Y][X] = type;
            if(e.detail.open) {
                window.dispatchEvent(new CustomEvent("lightAdded",{detail:[X,Y]}));
            }else {
                window.dispatchEvent(new CustomEvent("lightRemoved",{detail:[X,Y]}));
            }
            _this.updateChunk(x,y,true);
        });
    }
    random(limit) {
        return Math.floor(Math.random() * limit) + 1
    }
    updateChunk(X,Y,test) {
        //Clears the chunk canvas
        this.hCtx.clearRect(0,0,(world.size*10),(world.size*10));

        //this.lines = [];
        //this.lines2 = [];
        let airCount = 0;
        //Creates chunk y row if not defined
        if(this.chunks[Y/10] == undefined) {
            this.chunks[Y/10] = [];
        }
        //Loops through blocks in chunk range
        for(let x = X; x < X+10; x++) {
            for(let y = Y; y < Y+10; y++) {
                //If block is air
                try {
                    if(world.world[y][x].id == "air") {
                        airCount++;
                    }
                } catch (e) {
                }
                if(test) {
                    console.log(world.world[y][x].id,x,y);
                }
                //If block is not air
                if(world.world[y][x] != undefined && world.world[y][x].id != "air") {
                /*if(world.world[y-1][x] == this.t.AIR /*|| world.world[y][x-1] == this.t.AIR || world.world[y][x+1] == this.t.AIR) {
                        let posY =  y ==  Y?world.size:0;
                        //    posX =  x ==  X?0:(world.size/2);

                        let p = { x:Math.round((x*world.size)-(X*world.size)),y:Math.round(((y+1)*world.size)-posY-(Y*world.size))};
                        let p2 = { x:Math.round((x*world.size)+world.size-(X*world.size)),y:Math.round(((y+1)*world.size)-posY-(Y*world.size))};
                        this.lines.push(p);
                        this.lines.push(p2);

                        let p3 = { x:Math.round((x*world.size)-(X*world.size)),y:Math.round(((y+2)*world.size)-posY-(Y*world.size))};
                        let p4 = { x:Math.round((x*world.size)+world.size-(X*world.size)),y:Math.round(((y+2)*world.size)-posY-(Y*world.size))};
                        this.lines2.push(p3);
                        this.lines2.push(p4);
                    }*/
                    //Draws block
                    this.hCtx.drawImage(this.image,Math.round(world.world[y][x].x),Math.round(world.world[y][x].y),20,20,Math.round((x*world.size)-(X*world.size)),Math.round((y*world.size)-(Y*world.size)),world.size,world.size);
                    /*if(world.shadowMap[y][x] != undefined) {
                        //Sets colour
                        this.hCtx.fillStyle = "black";
                        //Sets opacity
                        this.hCtx.globalAlpha = world.shadowMap[y][x];
                        this.hCtx.fillRect(Math.round((x*world.size)-(X*world.size)),Math.round((y*world.size)-(Y*world.size)),world.size,world.size);
                        this.hCtx.globalAlpha = 1;
                    }*/
                }else {
                    try {
                        //If left of tree
                        if(world.trees[y][x][0] == 1) {
                            //If base of tree
                            if(world.trees[y][x][1] == 1) {
                                //If tree and not cactus
                                if(world.trees[y][x][2] == "tree") {
                                    this.hCtx.drawImage(this.plants,Math.round(this.t.TREE.x),Math.round(this.t.TREE.y),Math.round(this.t.TREE.w),Math.round(this.t.TREE.h),Math.round((x*world.size)-(X*world.size)),Math.round(((y-5)*world.size)-(Y*world.size)),world.size*2,world.size*6);
                                }else {
                                    this.hCtx.drawImage(this.plants,Math.round(this.t.CACTUS.x),Math.round(this.t.CACTUS.y),Math.round(this.t.CACTUS.w),Math.round(this.t.CACTUS.h),Math.round((x*world.size)-(X*world.size)),Math.round(((y-5)*world.size)-(Y*world.size)),world.size*2,world.size*6);
                                }
                            }else {
                                //Draw rest of tree outside current chunk
                                if(world.trees[y][x][3] >= Y+10) {
                                    if(world.trees[y][x][2] == "tree") {
                                        this.hCtx.drawImage(this.plants,Math.round(this.t.TREE.x),Math.round(this.t.TREE.y),Math.round(this.t.TREE.w),Math.round(this.t.TREE.h),Math.round((x*world.size)-(X*world.size)),Math.round(((world.trees[y][x][3]-6)*world.size)-(Y*world.size)),world.size*2,world.size*6);
                                    }else {
                                        this.hCtx.drawImage(this.plants,Math.round(this.t.CACTUS.x),Math.round(this.t.CACTUS.y),Math.round(this.t.CACTUS.w),Math.round(this.t.CACTUS.h),Math.round((x*world.size)-(X*world.size)),Math.round(((world.trees[y][x][3]-6)*world.size)-(Y*world.size)),world.size*2,world.size*6);
                                    }
                                }
                            }
                        }else if(world.trees[y][x-1][0] == 1 && world.trees[y][x][0] == 0){
                            //Draw rest of tree outside current chunk
                            if(x-1 == X-1) {
                                if(world.trees[y][x-1][2] == "tree") {
                                    this.hCtx.drawImage(this.plants,Math.round(this.t.TREE.x),Math.round(this.t.TREE.y),Math.round(this.t.TREE.w),Math.round(this.t.TREE.h),Math.round(((x-1)*world.size)-(X*world.size)),Math.round(((world.trees[y][x][3]-6)*world.size)-(Y*world.size)),world.size*2,world.size*6);
                                }else {
                                    this.hCtx.drawImage(this.plants,Math.round(this.t.CACTUS.x),Math.round(this.t.CACTUS.y),Math.round(this.t.CACTUS.w),Math.round(this.t.CACTUS.h),Math.round(((x-1)*world.size)-(X*world.size)),Math.round(((world.trees[y][x][3]-6)*world.size)-(Y*world.size)),world.size*2,world.size*6);
                                }
                            }
                        }
                    }catch (e) {
                    }
                }
            }
        }
        /*if((this.lines.length == 0 || this.lines2.length == 0) && airCount != 100) {
            this.lines = [{x:0,y:0},{x:world.size*10,y:0},{x:world.size*10,y:world.size*10},{x:0,y:world.size*10}]
            this.lines2 = [{x:0,y:0},{x:world.size*10,y:0},{x:world.size*10,y:world.size*10},{x:0,y:world.size*10}]
        }

        if(this.lines.length != 0 && this.lines2.length != 0) {
            //draw smooth line
            this.hCtx.globalAlpha = 0.6;
            this.hCtx.strokeStyle = "black";
            this.bzCurve(this.lines, 0, 1);
            this.hCtx.lineTo(world.size*10,world.size*10);
            this.hCtx.lineTo(0,world.size*10);
            this.hCtx.fill();

            this.hCtx.globalAlpha = 0.9;
            this.hCtx.strokeStyle = "black";
            this.bzCurve(this.lines2, 0, 1);
            this.hCtx.lineTo(world.size*10,world.size*10);
            this.hCtx.lineTo(0,world.size*10);
            this.hCtx.fill();
            this.hCtx.globalAlpha = 1;
        }*/

        //Converts canvas to image
        let img = document.createElement("img");
        img.src = this.hCanvas.toDataURL();
        this.chunks[Y/10][X/10] = img;
    }
    updateShadow(X,Y) {
        //Clear chunk canvas
        this.hCtx.clearRect(0,0,(world.size*10),(world.size*10));
        if(this.shadowChunks[Y/10] == undefined) {
            this.shadowChunks[Y/10] = [];
        }
        //Loops through blocks in chunk range
        for(let x = X; x < X+10; x++) {
            for(let y = Y; y < Y+10; y++) {
                if(world.shadowMap[y][x] != undefined) {
                    //Sets colour
                    this.hCtx.fillStyle = world.shadowMap[y][x][1];
                    //Sets opacity
                    this.hCtx.globalAlpha = world.shadowMap[y][x][0];
                    this.hCtx.fillRect(Math.round((x*world.size)-(X*world.size)),Math.round((y*world.size)-(Y*world.size)),world.size,world.size);
                    this.hCtx.globalAlpha = 1;
                }
            }
        }
        let img = document.createElement("img");
        img.src = this.hCanvas.toDataURL();
        this.shadowChunks[Y/10][X/10] = img;
    }
    updateDroppables(X,Y) {
        //Clear chunk canvas
        this.hCtx.clearRect(0,0,(world.size*10),(world.size*10));
        let chunksToUpdate = [];
        //Create chunk y coord if undefined
        if(this.droppablesChunks[Y/10] == undefined) {
            this.droppablesChunks[Y/10] = [];
        }
        //Loop through droppables in range of 10 xy coords
        for(let y = Y; y < Y+10; y++) {
            //Drop items at xy coords
            if(world.dropItems[y] != undefined) {
                for(let x = X; x < X+10; x++) {
                    if(world.dropItems[y][x] != undefined) {
                        //Loop through all dropItem at xy coords and render
                        let yy = y;
                        //If block below is air, drop block
                        while(world.world[yy+1][x].id == "air") {
                            yy++;
                        }
                        //If blocks has fallen update position in droppable items list
                        if(yy != y) {
                            const len = world.dropItems[y][x].length;
                            for(let i = 0; i < len; i++) {
                                world.addDropItem(x,yy,world.dropItems[y][x][world.dropItems[y][x].length-1]);
                                world.removeDropItem(x,y);
                            }
                        }
                        //If droppables fell outside 10*10 range, update chunk above
                        let cY = Math.floor(yy/10)*10;
                        if(yy >= Y+10) {
                            chunksToUpdate.push([cY,Math.floor(x/10)*10]);
                        }else if(y%10 == 0) {
                            //console.log((Y/10)-1);
                            chunksToUpdate.push([((Y/10)-1)*10,Math.floor(x/10)*10]);
                        }
                        //Draw droppables in chunk
                        try {
                            for(let i = 0; i <world.dropItems[yy][x].length; i++) {
                                this.hCtx.drawImage(this.image,world.dropItems[yy][x][i].x,world.dropItems[yy][x][i].y,20,20,Math.round((x*world.size)-(X*world.size))+5,Math.round((yy*world.size)-(Y*world.size))+5,world.size-10,world.size-10);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        //world.dropItems[y][x] = [];
                    }
                }
            }
        }
        let img = document.createElement("img");
        img.src = this.hCanvas.toDataURL();
        this.droppablesChunks[Y/10][X/10] = img;
        for(let CY = 0; CY < chunksToUpdate.length; CY++) {
            for(let i = Y/10; i < chunksToUpdate[CY]; i++) {
                this.updateDroppables(chunksToUpdate[CY][1],i);
            }
            this.updateDroppables(chunksToUpdate[CY][1],chunksToUpdate[CY][0]);
        }
        //this.updateDroppables(X,Y-10);
    }
    renderWorld(X,Y,time) {
        //console.time("Render speed");
        //Converts camera X/Y to imageX
        let yPos = Math.floor(Y/world.size),
            xPos = Math.floor(X/world.size),
            startX = xPos > 2?xPos-2:0;
        //Sets chunks to render
        this.chunksY = Math.floor(Math.round(window.innerHeight/world.size)/10)+Math.floor(Math.round(camera.camY/world.size)/10)+1;
        this.chunksX = Math.floor(Math.round(window.innerWidth/world.size)/10)+Math.floor(Math.round(camera.camX/world.size)/10)+1;
        //Loops through chunks and renders them
        for(var y = Math.floor(Math.round(camera.camY/world.size)/10)-2; y < this.chunksY; y++) {
            for (var x = Math.floor(Math.round(camera.camX/world.size)/10)-4; x < this.chunksX; x++) {
                //If chunks y row undefined, create chunks
                if(this.chunks[y] == undefined) {
                    this.updateChunk(x*10,y*10);
                    this.updateShadow(x*10,y*10);
                }else if(this.chunks[y][x] == undefined) {
                    this.updateChunk(x*10,y*10);
                    this.updateShadow(x*10,y*10);
                }
                if(this.droppablesChunks[y] == undefined) {
                    this.updateDroppables(x*10,y*10);
                }else if(this.droppablesChunks[y][x] == undefined){
                    this.updateDroppables(x*10,y*10);
                }
                //Draw chunk
                shape.imageShape(this.ctx,this.chunks[y][x],0,0,world.size*10,world.size*10,x*10,y*10,world.size*10,world.size*10);
                shape.imageShape(this.ctx,this.droppablesChunks[y][x],0,0,world.size*10,world.size*10,x*10,y*10,world.size*10,world.size*10);
                shape.imageShape(this.ctx,this.shadowChunks[y][x],0,0,world.size*10,world.size*10,x*10,y*10,world.size*10,world.size*10);
            }
            if(camera.camX < 30*world.size || camera.camX > 950*world.size) {
                for (var x = 1; x < 5; x++) {
                    //If camera is near start of map, render end of map
                    if(camera.camX < 30*world.size) {
                        if(this.chunks[y] == undefined) {
                            this.updateChunk(1000-(x*10),y*10);
                            this.updateShadow(1000-(x*10),y*10);
                        }else if(this.chunks[y][100-x] == undefined) {
                            this.updateChunk(1000-(x*10),y*10);
                            this.updateShadow(1000-(x*10),y*10);
                        }
                        if(this.droppablesChunks[y] == undefined) {
                            this.updateDroppables(1000-(x*10),y*10);
                        }else if(this.droppablesChunks[y][100-x] == undefined){
                            this.updateDroppables(1000-(x*10),y*10);
                        }
                        shape.imageShape(this.ctx,this.chunks[y][100-x],0,0,world.size*10,world.size*10,-x*10,y*10,world.size*10,world.size*10);
                        shape.imageShape(this.ctx,this.droppablesChunks[y][100-x],0,0,world.size*10,world.size*10,-x*10,y*10,world.size*10,world.size*10);
                        shape.imageShape(this.ctx,this.shadowChunks[y][100-x],0,0,world.size*10,world.size*10,-x*10,y*10,world.size*10,world.size*10);
                    }else if(camera.camX > 950*world.size) {
                        //If camera is near end of map, render start of map
                        if(this.chunks[y] == undefined) {
                            this.updateChunk((x-1)*10,y*10);
                            this.updateShadow((x-1)*10,y*10);
                        }else if(this.chunks[y][x-1] == undefined) {
                            this.updateChunk((x-1)*10,y*10);
                            this.updateShadow((x-1)*10,y*10);
                        }
                        if(this.droppablesChunks[y] == undefined) {
                            this.updateDroppables((x-1)*10,y*10);
                        }else if(this.droppablesChunks[y][x] == undefined){
                            this.updateDroppables((x-1)*10,y*10);
                        }
                        //1000 = 100*10
                        shape.imageShape(this.ctx,this.chunks[y][x-1],0,0,world.size*10,world.size*10,(1000)+((x-1)*10),y*10,world.size*10,world.size*10);
                        shape.imageShape(this.ctx,this.droppablesChunks[y][x-1],0,0,world.size*10,world.size*10,(1000)+((x-1)*10),y*10,world.size*10,world.size*10);
                        shape.imageShape(this.ctx,this.shadowChunks[y][x-1],0,0,world.size*10,world.size*10,(1000)+((x-1)*10),y*10,world.size*10,world.size*10);
                    }
                }
            }
        }
        //Show mining animation
        if(this.mining) {
            shape.absImgShape(this.ctx,this.image,this.breakPos*20,20,20,20,this.cursor[0],this.cursor[1],this.cursor[2],this.cursor[3],"test");
        }
        //this.ctx.strokeRect(this.cursorPosition[0],this.cursorPosition[1],world.size,world.size);
        //console.timeEnd("Render speed");
    }

    addBlock(x,y,camX,camY,startX,startY) {
        //Get position of the block
        let minus = camera.startX-(Math.floor((window.innerWidth/2)/world.size)*world.size),
            tile,
            Y = ((Math.floor((y+camY)/world.size)*world.size)/world.size)-Math.floor(startY/world.size),
            X = Math.floor((x-minus+camX)/world.size)-Math.floor((startX-minus)/world.size),
            _this = this;
            //((Math.floor(((x+camX)/world.size))*world.size)/world.size)-Math.floor(startX/world.size);

        if(X >= 1000) {
            X-=1000;
        }else if(X < 0) {
            X=1000+X;
        }

        //Checks if the current block is air
        if((this.lastPlacedBlock[0] != X || this.lastPlacedBlock[1] != Y)) {
            this.lastPlacedBlock = [X,Y];
            if(((Math.floor(camX/world.size) != X || Math.floor(camY/world.size)-1 != Y) && (Math.floor(camX/world.size) != X || Math.floor(camY/world.size)-2 != Y))) {
                if(world.world[Y][X].id == "air") {
                    //Cheks if inventory has block
                    if(this.inventory.hasItem()) {
                        //Checks if tree is at xy
                        if((world.trees[Y] == undefined || world.trees[Y][X] == undefined) && this.inventory.getItem().canPlace == null) {
                            tile = this.inventory.removeItem();
                            tile = tile == null?this.t.AIR:tile;
                            world.world[Y][X] = tile;
                            //Checks if block y+1 = grass, set block to soil if true
                            if(world.world[Y+1][X].id == "grass" || world.world[Y+1][X].id == "grass1" || world.world[Y+1][X].id == "grass2") {
                                world.world[Y+1][X] = this.t.S;
                            }
                            let xx = Math.floor(X/10)*10,
                                yy = Math.floor(Y/10)*10;
                            if(world.world[Y][X].id == "torch") {
                                window.dispatchEvent(new CustomEvent("lightAdded",{detail:[X,Y]}));
                            }
                            //Update the chunks to the left/right/top/bottom of current chunk
                            world.updateShadowMap(xx-10,yy,this.t);
                            world.updateShadowMap(xx+10,yy,this.t);
                            world.updateShadowMap(xx,yy,this.t);
                            world.updateShadowMap(xx,yy-10,this.t);
                            world.updateShadowMap(xx,yy+10,this.t);
                            this.updateChunk(xx,yy);
                            this.updateShadow(xx,yy);
                            this.updateShadow(xx-10,yy);
                            this.updateShadow(xx+10,yy);
                            this.updateShadow(xx,yy-10);
                            this.updateShadow(xx,yy+10);
                            //console.timeEnd("test");
                        }
                    }
                }else {
                    try {
                        //If crafting bench, open crafting bench
                        switch(world.world[Y][X].id) {
                            case "crafting_bench":
                                setTimeout(function() {
                                    window.dispatchEvent(new CustomEvent("openCrafting"));
                                },200);
                                break;
                            case "furnace":
                                setTimeout(function() {
                                    window.dispatchEvent(new CustomEvent("openFurnace",{detail:[X,Y]}));
                                },200);
                                break;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }

    removeBlock(x,y,camX,camY,startX,startY) {
        let minus = camera.startX-(Math.floor((window.innerWidth/2)/world.size)*world.size),
            Y = ((Math.floor((y+camY)/world.size)*world.size)/world.size)-Math.floor(startY/world.size),
            X = Math.floor((x-minus+camera.camX)/world.size)-Math.floor((camera.startX-minus)/world.size);
        if(X >= 1000) {
            X-=1000;
        }else if(X < 0) {
            X=1000+X;
        }

        let toAdd = world.world[Y][X];
        //Set toAdd to soild if mining grass of any type
        if(world.world[Y][X].id == "grass" || world.world[Y][X].id == "grass1" || world.world[Y][X].id == "grass2") {
            toAdd = this.t.S;
            //toAdd = this.t.FRNC;
        }
        let _this = this;
        //Stop mining if not still mining current block
        if((this.lastBlock[0] != X || this.lastBlock[1] != Y)) {
            this.stopMining();
            this.lastBlock = [X,Y];
        }
        if(world.world[Y][X].id != "air") {
            if(!this.mining) {
                //If not mining
                this.mining = true;
                let miningIncrease = 1;
                try {
                    let item = this.inventory.getItem();
                    /*Set the mining speed increase if the
                    current inventory item has speed increase*/
                    if(item.miningIncrease != undefined) {
                        for(let i = 0; i < item.minableItems.length; i++) {
                            if(item.minableItems[i] == toAdd.id) {
                                miningIncrease = item.miningIncrease;
                                break;
                            }
                        }
                    }
                } catch (e) {
                }
                this.breakTimer = setInterval(function() {
                    //Increment break animation
                    _this.breakPos++;
                },world.world[Y][X].miningSpeed/10/miningIncrease);
                this.miningTimer = setTimeout(function() {
                    //When done mining
                    //Remove block
                    world.addDropItem(X,Y,toAdd);
                    if(miningIncrease == 1) {
                        _this.character.damage(world.world[Y][X].damage);
                    }else {
                        window.dispatchEvent(new CustomEvent("damageItem"));
                    }

                    world.world[Y][X] = _this.t.AIR;
                    _this.mining = false;

                    let xx = Math.floor(X/10)*10,
                        yy = Math.floor(Y/10)*10;

                    if(toAdd.id == "torch") {
                        window.dispatchEvent(new CustomEvent("lightRemoved",{detail:[X,Y]}));
                    }

                    //Update the chunks to the left/right/top/bottom of   current chunk

                    world.updateShadowMap(xx-10,yy,this.t);
                    world.updateShadowMap(xx+10,yy,this.t);
                    world.updateShadowMap(xx,yy,this.t);
                    world.updateShadowMap(xx,yy-10,this.t);
                    world.updateShadowMap(xx,yy+10,this.t);
                    _this.updateChunk(xx,yy);
                    _this.updateShadow(xx-10,yy);
                    _this.updateShadow(xx+10,yy);
                    _this.updateShadow(xx,yy);
                    _this.updateShadow(xx,yy-10);
                    _this.updateShadow(xx,yy+10);
                    //Stop mining
                    _this.stopMining();
                    _this.updateDroppables(xx,yy);
                },world.world[Y][X].miningSpeed/miningIncrease);
            }
        }else {
            //Check if y row exists
            if(world.trees[Y] != undefined) {
                //Checks if block can be placed at xy
                if(world.trees[Y][X] != undefined) {
                    if(!this.mining) {
                        this.mining = true;
                        let miningIncrease = 1;
                        try {
                            let item = this.inventory.getItem();
                            if(item.miningIncrease != undefined) {
                                for(let i = 0; i < item.minableItems.length; i++) {
                                    if(item.minableItems[i] == "tree") {
                                        miningIncrease = item.miningIncrease;
                                        break;
                                    }
                                }
                            }
                        } catch (e) {
                        }
                        this.breakTimer = setInterval(function() {
                            //Increment break animation
                            _this.breakPos++;
                        },world.trees[Y][X][4]/10/miningIncrease);
                        this.miningTimer = setTimeout(function() {
                            if(miningIncrease == 1) {
                                _this.character.damage(2);
                            }else {
                                window.dispatchEvent(new CustomEvent("damageItem"));
                            }
                            //Adds 2 logs and  leaf blocks
                            if(world.trees[Y][X][2] == "tree") {
                                for(let i = 0; i < 4; i++) {
                                    //_this.inventory.addItem(_this.t.LEA);
                                    //_this.inventory.addItem(_this.t.LOG);
                                    world.addDropItem(X,Y,_this.t.LEA);
                                    world.addDropItem(X,Y,_this.t.LOG);
                                }
                            }else {
                                for(let i = 0; i < 2; i++) {
                                    world.addDropItem(X,Y,_this.t.C_LEAVE);
                                }
                            }
                            //Remove the tree
                            let xx = Math.floor(X/10)*10,
                                yy = Math.floor(Y/10)*10;
                            world.removeTree(X,Y);
                            _this.updateChunk(xx,yy);
                            _this.updateChunk(xx,yy-10);
                            _this.updateChunk(xx,yy+10);
                            _this.updateChunk(xx-10,yy);
                            _this.updateChunk(xx+10,yy);
                            _this.updateDroppables(xx,yy);
                            _this.stopMining();
                        },world.trees[Y][X][4]/miningIncrease);
                    }
                }
            }
        }
    }

    setCursor(x,y,w,h) {
        //this.character.camX-this.character.startX,this.character.camY-character.startY
        this.cursor = [x,y,w,h];
        this.character.changeDirection(x);
    }
    stopMining() {
        clearTimeout(this.miningTimer);
        this.mining = false;
        this.breakPos = 0;
        this.character.checkCollision();
        clearInterval(this.breakTimer);
    }
    gradient(a, b) {
        return (b.y-a.y)/(b.x-a.x);
    }

    bzCurve(points, f, t) {
        //f = 0, will be straight line
        //t suppose to be 1, but changing the value can control the smoothness too
        if (typeof(f) == 'undefined') f = 0.3;
        if (typeof(t) == 'undefined') t = 0.6;

        this.hCtx.beginPath();
        this.hCtx.moveTo(points[0].x, points[0].y);

        var m = 0;
        var dx1 = 0;
        var dy1 = 0;

        var preP = points[0],
            dx2,dy2;
        for (var i = 1; i < points.length; i++) {
            var curP = points[i],
                nexP = points[i + 1];
            if(nexP) {
                m = this.gradient(preP, nexP);
                dx2 = (nexP.x - curP.x) * -f;
                dy2 = dx2 * m * t;
            } else {
                dx2 = 0;
                dy2 = 0;
            }
            this.hCtx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
            dx1 = dx2;
            dy1 = dy2;
            preP = curP;
        }
        this.hCtx.stroke();
    }
}
