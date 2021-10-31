import { items, setInventoryItem } from "../inventory_crafting_smelting/inventoryItems.js"
import { Tileset } from "../universe_world_gen/tilesetTerrain.js"

let furnace = 0;

export class Furnace {

    constructor() {
        this.furnaceNo = furnace++;
        this.clone = document.getElementById("invBox").content.querySelector(".inventoryItem");
        this.furnaceClone = document.getElementById("furnace").content.querySelector(".furnace").cloneNode(true);
        this.furnaceClone.setAttribute("data-furnace",this.furnaceNo);
        document.getElementById("inventory").append(this.furnaceClone);

        this.furnaceBoxes = document.getElementsByClassName("furnaceItem");
        this.t = new Tileset();

        this._addInvBox(43+this.furnaceNo,"furnaceItem","input");
        this._addInvBox(44+this.furnaceNo,"furnaceFuel","input");
        this._addInvBox(45+this.furnaceNo,"furnaceOutput","output");

        this.fuelLife = -1;
        this.output;
        this.interval;
        this.metre = document.querySelector(`.furnace[data-furnace="${this.furnaceNo}"] meter`);
        this.furnacePos = [0,0];

        let _this = this;

        window.addEventListener("openFurnace",function(e) {
            document.getElementById("crafting").classList.add("hide");
            document.getElementById("inventory").classList.remove("hide");
            document.getElementsByClassName("furnace")[_this.furnaceNo].classList.remove("hide");
            _this.furnacePos = e.detail;
        });
    }

    checkRecipes() {
        if(items[43+this.furnaceNo].type !== null && items[44+this.furnaceNo].type !== null) {
            if(items[45+this.furnaceNo].type === null || items[45+this.furnaceNo].type.id === this.output) {

                let box0 = this.furnaceBoxes[0+this.furnaceNo].getElementsByClassName("inventoryBlock")[0],
                    box1 = this.furnaceBoxes[1+this.furnaceNo].getElementsByClassName("inventoryBlock")[0],
                    box2 = this.furnaceBoxes[2+this.furnaceNo].getElementsByClassName("inventoryBlock")[0];
                if(items[45+this.furnaceNo].type === null) {
                    box2.classList.add("hide");
                    box2.style.backgroundPosition = "0 0";
                    box2.getElementsByTagName("span")[0].innerText = 0;
                }

                if(items[44+this.furnaceNo].type.id === "coal" || items[44+this.furnaceNo].type.id === "log" ||
                   items[44+this.furnaceNo].type.id === "stripped_log" || items[44+this.furnaceNo].type.id === "stick" ||
                   items[44+this.furnaceNo].type.id === "leaves"  || items[44+this.furnaceNo].type.id === "wooden_block") {

                    if(this.fuelLife === -1) {
                        this.fuelLife = items[44+this.furnaceNo].type.fuelLife;
                    }
                    for (let [key, value] of Object.entries(this.t)) {
                        if(value.id == items[43+this.furnaceNo].type.id) {
                            this.output = value.furnaceOutput;
                        }else if(value.id === this.output) {
                            //Set item health width to 0
                            //Set box backgroundPosition to tileset xy coords
                            this.metre.value = 0;

                            window.dispatchEvent(new CustomEvent("toggleFurnaceHeat",{detail:{open:true,x:this.furnacePos[0],y:this.furnacePos[1]}}));

                            let _this = this;
                            _this.interval = setInterval(function () {
                                _this.metre.value+=10;
                                if(_this.metre.value === 100) {
                                    if(items[45+_this.furnaceNo].type === null) {
                                        setInventoryItem(45+_this.furnaceNo,0,value);
                                    }

                                    items[43+_this.furnaceNo].amount--;
                                    items[45+_this.furnaceNo].amount++;
                                    _this.metre.value = 0;
                                    _this.fuelLife--;

                                    if(_this.fuelLife === 0) {
                                        _this.fuelLife = items[44+_this.furnaceNo].type.fuelLife;
                                        items[44+this.furnaceNo].amount--;
                                        box1.setAttribute("data-amount",items[44+_this.furnaceNo].amount);
                                        box1.getElementsByTagName("span")[0].innerText = items[44+_this.furnaceNo].amount;
                                    }
                                    if(items[44+_this.furnaceNo].amount === 0) {
                                        setInventoryItem(44+_this.furnaceNo,0,null);
                                        box1.classList.add("hide");
                                        box1.setAttribute("data-amount",0);
                                        box1.getElementsByTagName("span")[0].innerText = 0;
                                        box1.style.backgroundPosition = "0 0";
                                        _this.fuelLife = -1;
                                        window.dispatchEvent(new CustomEvent("toggleFurnaceHeat",{detail:{open:false,x:_this.furnacePos[0],y:_this.furnacePos[1]}}));
                                        clearInterval(_this.interval);
                                    }

                                    if(items[43+_this.furnaceNo].amount === 0) {
                                        setInventoryItem(43+_this.furnaceNo,0,null);
                                        box0.classList.add("hide");
                                        box0.setAttribute("data-amount",0);
                                        box0.getElementsByTagName("span")[0].innerText = 0;
                                        box0.style.backgroundPosition = "0 0";
                                        window.dispatchEvent(new CustomEvent("toggleFurnaceHeat",{detail:{open:false,x:_this.furnacePos[0],y:_this.furnacePos[1]}}));
                                        clearInterval(_this.interval);
                                    }
                                    box2.style.backgroundPosition = "-"+(value.x*4)+"px "+"-"+(value.y*4)+"px";
                                    box2.setAttribute("data-amount",items[45+_this.furnaceNo].amount);
                                    box2.classList.remove("hide")
                                    box2.getElementsByTagName("span")[0].innerText = items[45+_this.furnaceNo].amount;

                                    box0.setAttribute("data-amount",items[43+_this.furnaceNo].amount);
                                    box0.getElementsByTagName("span")[0].innerText = items[43+_this.furnaceNo].amount;
                                }
                            },1000);
                            return;
                        }
                    }
                }
            }
        }
    }

    cancelSmelting() {
        if(items[44+this.furnaceNo].amount === 0) {
            this.fuelLife = -1;
        }
        this.metre.value = 0;
        window.dispatchEvent(new CustomEvent("toggleFurnaceHeat",{detail:{open:false,x:this.furnacePos[0],y:this.furnacePos[1]}}));
        clearInterval(this.interval);
    }

    _addInvBox(i,selector,type) {
        //Sets the invitem to amount = 0, type = null
        setInventoryItem(i,0,null);
        //Creates inventoryItem from the template and adds it to the screen

        this.clone.getElementsByClassName("inventoryBlock")[0].setAttribute("data-index",i);
        let clone = this.clone.cloneNode(true);
        clone.classList.add("furnaceItem");
        clone.classList.add(type);
        clone.classList.add(selector);

        document.querySelector(`.furnace[data-furnace="${this.furnaceNo}"]`).append(clone);
    }
}
