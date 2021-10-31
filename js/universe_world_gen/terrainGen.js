let world = [],
    shadowMap = [],
    trees = [],
    dropItems = [],
    treesIndex = -1,
    nextValue = 0,
    joinValue = 165,
    size = 30;
function fBm(x,y,octaves,lacunarity,gain) {
    let amplitude = 1,
        frequency = 1,
        sum = 0;
    for(let i = 0; i < octaves; i++) {
        sum += amplitude * noise.simplex2(x * frequency, y * frequency);
        amplitude *= gain;
        frequency *= lacunarity;
    }
    return sum;
}

function createWorld(t) {
    let biomesList = document.getElementById("biomes");
    //Generate y row and shadow map y row
    for(let y = 0; y < 1000; y++) {
        world[y] = [];
        shadowMap[y] = [];
    }

    forest();
    for(let i = 0; i < 3; i++) {
        let rand = random(3);
        if(rand == 1) {
            mountain();
            biomesList.innerHTML+="Mountain<br>";
        }else if(rand == 2) {
            desert();
            biomesList.innerHTML+="Desert<br>";
        }else {
            forest();
            biomesList.innerHTML+="Forest<br>";
        }
    }

    for(let y = 0; y < 1000; y++) {
        for(let x = 0; x < 1000; x++) {
            //Set xy (and +1/+2) to air if xy (+1/+2) is undefined
            if(world[y][x] == undefined) {
                world[y][x] = t.AIR;
            }
            if(world[y][x+1] == undefined) {
                world[y][x+1] = t.AIR;
            }
            if(world[y][x+2] == undefined) {
                world[y][x+2] = t.AIR;
            }

            if(world[y-1] != undefined) {
                //Check if xy-1 is rock/ore and randomly choose which ore to render
                if(world[y-1][x].id == "rock" || world[y-1][x].id == "iron" || world[y-1][x].id == "gold" || world[y-1][x].id == "diamond" || world[y-1][x].id == "coal") {
                    if(random(10) == 1) {
                        world[y][x] = t.COAL;
                    }else if(random(20) == 1) {
                        world[y][x] = t.IR;
                    }else if(random(30) == 1) {
                        world[y][x] = t.GLD;
                    }else if(random(40) == 1) {
                        world[y][x] = t.DMND;
                    }else {
                        world[y][x] = t.R;
                    }
                }
                if(world[y-5] != undefined) {
                    if(world[y-1][x].id == "sand" && world[y-5][x].id != "sand") {
                        world[y][x] = t.SA;
                    }
                }
                //Add sand underneath sand
                if(world[y-1][x].id == "sand") {
                    world[y][x] = t.SA;
                }
                //Add soil under grass
                if((world[y-1][x].id == "grass" || world[y-1][x].id == "grass1" || world[y-1][x].id == "grass2" || world[y-1][x].id == "soil") && world[y][x].id == "air") {
                    world[y][x] = t.S;
                }
                if(y > 168) {
                    //If y is more than 168 and block y / y-1 == air, add water axt XY
                    if(world[y][x].id == "air" && (world[y-1][x].id == "air" || world[y-1][x].id == "water")) {
                        world[y][x] = t.WATER;
                    }
                }
            }
            //Add left corner grass if block is air and block to right is soil
            if(world[y][x-1] != undefined) {
                if(world[y][x].id == "grass" && world[y][x-1].id == "air") {
                    world[y][x] = t.G1;
                }
            }

            //Add right corner grass if block is air and block to right is soil
            if(world[y][x+1] != undefined) {
                if(world[y-1] != undefined) {
                    if(world[y][x].id == "grass" && world[y][x+1].id == "air" && (world[y-1][x+1].id == "air")) {
                        world[y][x] = t.G2;
                    }
                }
            }
            let randRocks = random(5);
            if(randRocks == 5 && (world[y][x].id == "grass" || world[y][x].id == "grass1" || world[y][x].id == "grass2") && world[y-1][x].id == "air") {
                world[y-1][x] = t.BLDR;
            }
            if(world[y][x-1] != undefined) {
                if(world[y][x].id == "grass" && world[y][x-1].id == "air") {
                    world[y][x] = t.G1;
                }
            }
            if(world[y+1] != undefined) {
                //if(world[y][x+2] == t.G && world[y][(x+2)+1] == t.G) {
                let tRand =  random(3);
                if(world[y][x].id == "grass" && world[y][x+1].id == "grass" && world[y-1][x].id == "air" && world[y-1][x+1].id == "air") {
                    let canPlace = true;
                    for(let i = 1; i < 7; i++) {
                        if(trees[y-i] == undefined) {
                            trees[y-i] = [];
                        }
                        //Tree[y][x] = [left,base,type,y]
                        if(trees[y-1][x-1] == undefined) {
                            if(i == 1) {
                                trees[y-1][x] = [1,1,"tree",y,10000];
                                trees[y-1][x+1] = [0,1,"tree",y,10000];
                            }else {
                                trees[y-i][x] = [1,0,"tree",y,10000];
                                trees[y-i][x+1] = [0,0,"tree",y,10000];
                            }
                        }
                    }
                }
            }
            if(world[y+1] != undefined) {
                let tRand =  random(10);
                if(world[y][x].id == "sand" && world[y][x+1].id == "sand") {
                    let canPlace = true;
                    if(tRand == 1) {
                        for(let i = 1; i < 3; i++) {
                            if(trees[y-i] == undefined) {
                                trees[y-i] = [];
                            }else {
                                if(trees[y-1][x-1] == undefined) {
                                    if(canPlace) {
                                        if(i == 1) {
                                            trees[y-1][x] = [1,1,"cactus",y,1000];
                                            trees[y-1][x+1] = [0,1,"cactus",y,1000];
                                        }else {
                                            trees[y-i][x] = [1,0,"cactus",y,1000];
                                            trees[y-i][x+1] = [0,0,"cactus",y,1000];
                                        }
                                    }
                                }else {
                                    canPlace = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    for(let y = 0; y < 1000; y++) {
        for(let x = 0; x < 1000; x++) {
            let x5 = x-5,
                x4 = x-4,
                x3 = x-3,
                x2 = x-2,
                x1 = x-1,
                x5_5 = x+5,
                x4_4 = x+4,
                x3_3 = x+3,
                x2_2 = x+2,
                x1_1 = x+1;

            if(world[y][x].id != "air") {
                if(x == 0) {
                    x1 = 999;
                    x2 = 998;
                    x3 = 997;
                    x4 = 996;
                    x5 = 995;
                }else if(x == 1) {
                    x2 = 999;
                    x3 = 998;
                    x4 = 997;
                    x5 = 996;
                }else if(x == 2) {
                    x3 = 999;
                    x4 = 998;
                    x5 = 997;
                }else if(x == 3) {
                    x4 = 999;
                    x5 = 998;
                }else if(x == 4) {
                    x5 = 999;
                }else if(x == 999) {
                    x1_1 = 0;
                    x2_2 = 1;
                    x3_3 = 2;
                    x4_4 = 3;
                    x5_5 = 4;
                }else if(x >= 998) {
                    x2_2 = 0;
                    x3_3 = 1;
                    x4_4 = 2;
                    x5_5 = 3;
                }else if(x >= 997) {
                    x3_3 = 0;
                    x4_4 = 1;
                    x5_5 = 2;
                }else if(x >= 996) {
                    x4_4 = 0;
                    x5_5 = 1;
                }else if(x >= 995) {
                    x5_5 = 0;
                }
            }
            if(world[y][x].id != "water") {
                try {
                    if((world[y][x1_1].id == "air" || world[y][x1].id == "air" || world[y+1][x].id == "air" || world[y-1][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = null;
                    }else if((world[y][x2_2].id == "air" || world[y][x2].id == "air" || world[y+2][x].id == "air" || world[y-2][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.2,"black"];
                    }else if((world[y][x3_3].id == "air" || world[y][x3].id == "air" || world[y+3][x].id == "air" || world[y-3][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.4,"black"];
                    }else if((world[y][x4_4].id == "air" || world[y][x4].id == "air" || world[y+4][x].id == "air" || world[y-4][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.6,"black"];
                    }else if((world[y][x5_5].id == "air" || world[y][x5].id == "air" || world[y+5][x].id == "air" || world[y-5][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.8,"black"];
                    }else if(world[y][x].id != "air") {
                        shadowMap[y][x] = [0.9,"black"];
                    }
                }catch (e) {
                }
            }
        }
    }

    function mountain() {
        noise.seed(Math.random());
        for (let y = 0; y < 1; y++) {
            for (let x = nextValue; x < nextValue+250; x++) {
                // All noise functions return values in the range of -1 to 1.
                // noise.simplex2 and noise.perlin2 for 2d noise

                //let value = Math.round(Math.abs((noise.perlin2(x/40,y/40,new Date().getTime())*300))/8)+170;
                let value = Math.round(Math.abs((noise.perlin2(noise.perlin2(x/40,y/40),noise.simplex2(x/50,y/50))*300))/8);

                world[value+joinValue][x] = t.R;
                if(x == nextValue+249) {
                    joinValue = value+joinValue;
                }
            }
        }
        nextValue+=250;
    }
    function desert() {
        noise.seed(Math.random());
        for (let y = 0; y < 1; y++) {
            for (let x = nextValue; x < nextValue+250; x++) {
                // All noise functions return values in the range of -1 to 1.
                // noise.simplex2 and noise.perlin2 for 2d noise
                let value = Math.round((Math.abs(noise.perlin2(x/40,nextValue/40)*10)));
                world[value+joinValue][x] = t.SA;
                if(x == nextValue+249) {
                    joinValue = value+joinValue;
                }
            }
        }
        nextValue+=250;
    }
    function forest() {
        noise.seed(Math.random());
        for (let y = 0; y < 1; y++) {
            for (let x = nextValue; x < nextValue+250; x++) {
                // All noise functions return values in the range of -1 to 1.
                // noise.simplex2 and noise.perlin2 for 2d noise
                let value = noise.simplex2(x/100, y/100);
                // ... or noise.simplex3 and noise.perlin3:
                //Add grass and rock
                let Y = Math.abs(Math.round(value*10))+joinValue;
                world[Y][x] = t.G;
                world[Y+joinValue+30][x] = t.R;
                if(x == nextValue+249) {
                    joinValue = Y;
                }
            }
        }
        nextValue+=250;
    }
}

function random(limit) {
    return Math.floor(Math.random() * limit) + 1
}

function removeTree(x,y) {
    let index = y;
    //Loops until referenced tree part is base
    while(trees[index][x][1] == 0) {
        index++;
    }
    try {
        for(let i = 0; i < 6; i++) {
            /*Remove tree to the right if currently
            selected part is the left part of the tree*/
            if(trees[index][x][0] == 1) {
                trees[index][x+1] = undefined;
            }else {
                /*Remove tree to the left if currently
                selected part is the right part of the tree*/
                trees[index][x-1] = undefined;
            }
            //Remove the currently selected part of the tree.
            trees[index][x] = undefined;
            index--;
        }
    } catch (e) {
    }
}
//Adds droppable item to list of droppable items
function addDropItem(x,y,item) {
    //Adds droppable item y axis is not defined
    if(dropItems[y] == undefined) {
        dropItems[y] = [];
    }
    if(dropItems[y][x] == undefined) {
        dropItems[y][x] = [];
    }
    dropItems[y][x].push(item);
}
function removeDropItem(x,y,i) {
    //dropItems[y][x].splice(dropItems[y][x].indexOf(dropItems[y][x][i]),1);
    dropItems[y][x].pop();
    if(dropItems[y][x].length == 0) {
        dropItems[y][x] = undefined;
    }
}
function updateShadowMap(X,Y,t) {
    let colour = "black";
    for(let y = Y; y < Y+10; y++) {
        for(let x = X; x < X+10; x++) {
            let x5 = x-5,
                x4 = x-4,
                x3 = x-3,
                x2 = x-2,
                x1 = x-1,
                x5_5 = x+5,
                x4_4 = x+4,
                x3_3 = x+3,
                x2_2 = x+2,
                x1_1 = x+1;
            try {
                if(x == 0) {
                    x1 = 999;
                    x2 = 998;
                    x3 = 997;
                    x4 = 996;
                    x5 = 995;
                }else if(x == 1) {
                    x2 = 999;
                    x3 = 998;
                    x4 = 997;
                    x5 = 996;
                }else if(x == 2) {
                    x3 = 999;
                    x4 = 998;
                    x5 = 997;
                }else if(x == 3) {
                    x4 = 999;
                    x5 = 998;
                }else if(x == 4) {
                    x5 = 999;
                }else if(x == 999) {
                    x1_1 = 0;
                    x2_2 = 1;
                    x3_3 = 2;
                    x4_4 = 3;
                    x5_5 = 4;
                }else if(x >= 998) {
                    x2_2 = 0;
                    x3_3 = 1;
                    x4_4 = 2;
                    x5_5 = 3;
                }else if(x >= 997) {
                    x3_3 = 0;
                    x4_4 = 1;
                    x5_5 = 2;
                }else if(x >= 996) {
                    x4_4 = 0;
                    x5_5 = 1;
                }else if(x >= 995) {
                    x5_5 = 0;
                }
                if(shadowMap[y][x][1] != "yellow" && world[y][x].id != "water") {
                    if((world[y][x1_1].id == "air" || world[y][x1].id == "air" || world[y+1][x].id == "air" || world[y-1][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = null;
                    }else if((world[y][x2_2].id == "air" || world[y][x2].id == "air" || world[y+2][x].id == "air" || world[y-2][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.2,colour];
                    }else if((world[y][x3_3].id == "air" || world[y][x3].id == "air" || world[y+3][x].id == "air" || world[y-3][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.4,colour];
                    }else if((world[y][x4_4].id == "air" || world[y][x4].id == "air" || world[y+4][x].id == "air" || world[y-4][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.6,colour];
                    }else if((world[y][x5_5].id == "air" || world[y][x5].id == "air" || world[y+5][x].id == "air" || world[y-5][x].id == "air") && world[y][x].id != "air") {
                        shadowMap[y][x] = [0.8,colour];
                    }else if(world[y][x].id != "air") {
                        shadowMap[y][x] = [0.9,colour];
                    }
                }
            }catch (e) {
            }
        }
    }
}

function addLight(x,y) {
    let i = -1;
    for(let Y = y-3; Y < y+4; Y++) {
        for(let X = x-3; X < x+4; X++) {
            i++;
            if(i != 0 && i != 1 && i != 5 && i != 6 && i != 7 && i != 13 && i != 35 && i != 41
                && i != 42 && i != 43 && i != 47 && i != 48) {
                if(shadowMap[Y][X] == undefined) {
                    shadowMap[Y][X] = [0.1,"yellow"];
                }else {
                    shadowMap[Y][X] = [0.1,"yellow"];
                }
            }
        }
    }
}
function removeLight(x,y) {
    let i = -1;
    for(let Y = y-3; Y < y+4; Y++) {
        for(let X = x-3; X < x+4; X++) {
            i++;
            if(i != 0 && i != 1 && i != 5 && i != 6 && i != 7 && i != 13 && i != 35 && i != 41
                && i != 42 && i != 43 && i != 47 && i != 48) {
                shadowMap[Y][X] = undefined;
            }
        }
    }
}

export {
    createWorld,
    world,
    shadowMap,
    updateShadowMap,
    addLight,
    removeLight,
    trees,
    removeTree,
    addDropItem,
    removeDropItem,
    dropItems,
    size
}
