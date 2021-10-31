import { items,setInventoryItem } from "../inventory_crafting_smelting/inventoryItems.js"
import { craftingRecipies } from "../inventory_crafting_smelting/craftingRecipies.js"
import { Tileset } from "../universe_world_gen/tilesetTerrain.js"

export class Crafting {
    constructor() {
        this.craftingBoxes = document.getElementsByClassName("craftingItem");
        let _this = this,
            values = [];
        this.invBoxTemp = document.getElementById("invBox");
        this.clone = this.invBoxTemp.content.querySelector(".inventoryItem");
        for(let i = 32; i < 43; i++) {
            this._addInvBox(i);
        }
        this.t = new Tileset();

        //Opens the crafting table and shows all 9 crafting boxes
        window.addEventListener("openCrafting",function() {
            let advancedCrafting = document.getElementsByClassName("advancedCrafting");
            for(let i = 0; i < advancedCrafting.length; i++) {
                advancedCrafting[i].classList.remove("hide");
            }
            document.getElementById("crafting").classList.remove("smallCrafting");
            document.getElementById("inventory").classList.remove("hide");
        });
    }
    checkRecipes() {
        //Loop through all crafting boxes and reset their contents
        for(let j = 0; j < 2; j++) {
            let box2 = this.craftingBoxes[9+j].getElementsByClassName("inventoryBlock")[0];
            box2.classList.add("hide");
            box2.style.backgroundPosition = "";
            box2.setAttribute("data-amount",0);
            box2.getElementsByTagName("span")[0].innerText = 0;
            setInventoryItem(41+j,0,null);
            console.log(items[41+j]);
        }

        let value = "",
            count = 0,
            correct = true,
            //itemsAmnt = 0,
            output;
        //Loop through all crafting boxes
        for(let i = 32; i < 41; i++) {
            //Append 1/0 to value variables depending on if crafting box has content
            if(items[i].type != null) {
                value+="1";
                count++;
            }else {
                value+="0";
            }
        }

        if(count == 1) {
            value = "100000000";
        }
        try {
            //Loop through crafting recipes within the object property of "value"
            for(let i = 0; i < craftingRecipies[value].length; i++) {
                let recipe = craftingRecipies[value][i];
                //If there was more than 1 item in the crafting table
                if(value != "100000000") {
                    //Loop through all boxes in crafting table
                    for(let k = 32; k < 41; k++) {
                        /*If there's an item in the box check if it matches
                          the item at that position in the crafting recipe*/
                        if(items[k].type != null) {
                            //If not matching, set correct to false
                            if(recipe.ingredients[k-32] != items[k].type.id) {
                                correct = false;
                            }
                            //If all recipe ingredients checked, set output to recipe output
                            if(k-31 == recipe.ingredients.length) {
                                output = recipe.output;
                                break;
                            }
                        }
                    }
                    //If loop finished and still correct, set output to recipe output
                    if(correct) {
                        output = recipe.output;
                        break;
                    }
                }else {
                    /*If only one ingredient, loop through crafting boxes
                      and check if one of them matches the crafting recipe*/
                    try {
                        for(let k = 32; k < 41; k++) {
                            if(items[k].type != null) {
                                if(recipe.ingredients[0] == items[k].type.id) {
                                    output = recipe.output;
                                    break;
                                    //itemsAmnt++;
                                }
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        } catch (e) {
            correct = false;
        }
        if(correct) {
            console.log(output[0]);
            //If correct, loop through objects in tileset
            for(let i = 0; i < output.length; i++) {
                //If output id matches id of object set crafting outputs to this item
                for (let [key, value] of Object.entries(this.t)) {
                    if(value.id == output[i][0]) {
                        console.log(output[i]);
                        let itemHealth = (value.id != "stone_pickaxe") && (value.id != "stone_axe")?null:100;
                        setInventoryItem(41+i,1,value,itemHealth);
                        let box = this.craftingBoxes[9+i].getElementsByClassName("inventoryBlock")[0];
                        //Set item health width to 0
                        box.getElementsByClassName("itemHealth")[0].style.width = 0;
                        //Set box backgroundPosition to tileset xy coords
                        let val = (parseInt(box.getAttribute("data-amount")) || 0)+(output[i][1] || 1);

                        box.style.backgroundPosition = "-"+(value.x*4)+"px "+"-"+(value.y*4)+"px";
                        box.setAttribute("data-amount",val);

                        box.classList.remove("hide");
                        box.getElementsByTagName("span")[0].innerText = val;
                        //If item should have health, set health to 100%
                        if(itemHealth == 100) {
                            box.getElementsByClassName("itemHealth")[0].style.width = "100%";
                        }
                        break;
                    }
                }
            }
        }else {
            //If not correct, hide crafting output item
            let box = this.craftingBoxes[9].getElementsByClassName("inventoryBlock")[0];
            box.classList.add("hide");
        }
    }
    completeCrafting() {
        let complete = false;
        //Loop through boxes in crafting table
        for(let i = 32; i < 42; i++) {
            //Loop through boxes in crafting
            let box = this.craftingBoxes[i-32].getElementsByClassName("inventoryBlock")[0];
            //If not crafting output remove 1 item
            if(i != 41 && i != 42) {
                let amnt = parseInt(box.getAttribute("data-amount"))-1;
                box.setAttribute("data-amount",amnt);
                box.getElementsByTagName("span")[0].innerText = box.getAttribute("data-amount");
            }
            //If no items in box, set complete to true and hide item in box
            if(parseInt(box.getAttribute("data-amount")) == 0) {
                complete = true;
                box.classList.add("hide");
                box.style.backgroundPosition = "";
                box.getElementsByTagName("span")[0].innerText = 0;
                setInventoryItem(i,0,null);
            }
            //console.log(i,box.getAttribute("data-amount"),amnt);
            if(complete) {
                /*If cannot craft anything else, hide
                  crafting outputs and set outputs amount to 0*/
                for(let j = 0; j < 2; j++) {
                    let box2 = this.craftingBoxes[9+j].getElementsByClassName("inventoryBlock")[0];
                    box2.classList.add("hide");
                    box2.style.backgroundPosition = "";
                    box2.getElementsByTagName("span")[0].innerText = 0;
                    setInventoryItem(41+j,0,null);
                }
            }
        }
    }
    _addInvBox(i) {
        //Sets the invitem to amount = 0, type = null
        setInventoryItem(i,0,null);
        //Creates inventoryItem from the template and adds it to the screen

        this.clone.getElementsByClassName("inventoryBlock")[0].setAttribute("data-index",i);
        let clone = this.clone.cloneNode(true);
        clone.classList.add("craftingItem");
        clone.classList.add("input");
        if(i == 34 || i == 37 || i == 38 || i == 39 || i == 40) {
            clone.classList.add("advancedCrafting");
        }
        if(i == 41 || i == 42) {
            clone.classList.add("craftingOutput");
            clone.classList.add("output");
        }
        document.getElementById("crafting").append(clone);
    }
}
