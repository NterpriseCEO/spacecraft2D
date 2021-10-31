export class Tileset {
    constructor() {

        this.image = document.getElementById("tileset");

        this.AIR = {id:"air",x:0,y:0,canWalkThrough:true};
        this.S = {id:"soil",x:20,y:0,miningSpeed:1000,damage:0,canWalkThrough:false};
        this.G = {id:"grass",x:40,y:0,miningSpeed:1000,damage:0,canWalkThrough:false};
        this.G1 = {id:"grass1",x:60,y:0,miningSpeed:1000,damage:0,canWalkThrough:false};
        this.G2 = {id:"grass2",x:80,y:0,miningSpeed:1000,damage:0,canWalkThrough:false};
        this.LEA = {id:"leaves",x:100,y:0,miningSpeed:100,damage:0,canWalkThrough:false,fuelLife:1};
        this.STRPD_LOG = {id:"stripped_log",x:120,y:0,miningSpeed:0,damage:0,canWalkThrough:false,fuelLife:4};
        this.LOG = {id:"log",x:140,y:0,miningSpeed:0,damage:0,canWalkThrough:false,fuelLife:5};
        this.WD_BLK = {id:"wooden_block",x:160,y:0,miningSpeed:2000,damage:0,canWalkThrough:false,fuelLife:4};
        this.LAVA = {id:"lava",x:180,y:0,miningSpeed:2000,damage:0,canWalkThrough:true};
        this.SA = {id:"sand",x:200,y:0,miningSpeed:700,damage:0,canWalkThrough:false};
        this.BLDR = {id:"boulder",x:220,y:0,miningSpeed:100,damage:0,canWalkThrough:true,furnaceOutput:"iron_ingot"};
        this.R = {id:"rock",x:240,y:0,miningSpeed:4000,damage:5,canWalkThrough:false};
        this.IR = {id:"iron",x:260,y:0,miningSpeed:6000,damage:5,canWalkThrough:false,furnaceOutput:"iron_ingot"};
        this.GLD = {id:"gold",x:280,y:0,miningSpeed:8000,damage:5,canWalkThrough:false,furnaceOutput:"gold_ingot"};
        this.DMND = {id:"diamond",x:300,y:0,miningSpeed:12000,damage:10,canWalkThrough:false};
        this.COAL = {id:"coal",x:320,y:0,miningSpeed:2000,damage:5,canWalkThrough:false,fuelLife:10,furnaceOutput:"gold_ingot"};
        this.STN_PKX = {id:"stone_pickaxe",x:340,y:0,miningSpeed:100,damage:0,canPlace:false,miningIncrease:3,minableItems:["rock","iron","gold","diamond","furnace"]};
        this.STN_AXE = {id:"stone_axe",x:400,y:0,miningSpeed:100,damage:0,canPlace:false,miningIncrease:3,minableItems:["tree"]};
        //this.LOG = {x:60,y:0,miningSpeed:2000,damage:2};
        this.STK = {id:"stick",x:520,y:0,miningSpeed:0,damage:0,canPlace:false,fuelLife:1};
        this.STRING = {id:"string",x:540,y:0,miningSpeed:0,damage:0,canPlace:false}
        this.C_LEAVE = {id:"cactus_leaves",x:560,y:0,miningSpeed:100,damage:3};
        this.C_BENCH = {id:"crafting_bench",x:580,y:0,miningSpeed:100,damage:3,canWalkThrough:true};
        this.TRCH = {id:"torch",x:600,y:0,miningSpeed:100,damage:0,canWalkThrough:true};
        this.WATER = {id:"water",x:620,y:0,miningSpeed:100,damage:0,canWalkThrough:true};
        this.FRNC = {id:"furnace",x:640,y:0,miningSpeed:10000,damage:0,canWalkThrough:true};
        this.FRNC_HOT = {id:"hot_furnace",x:660,y:0,miningSpeed:10000,damage:0,canWalkThrough:true};
        this.IR_NGT = {id:"iron_ingot",x:680,y:0,miningSpeed:10000,damage:0,canWalkThrough:true,canPlace:false};

        this.character = {id:"character",x:0,y:360};
        //Plant tileset
        this.TREE = {id:"tree",x:0,y:0,w:40,h:120,miningSpeed:10000,damage:2};
        this.CACTUS = {id:"cactus",x:40,y:0,w:40,h:120,miningSpeed:10000,damage:3};
    }
}
