import { Tileset } from "../universe_world_gen/tilesetTerrain.js"
import { Crafting } from "../inventory_crafting_smelting/crafting.js"
import { Furnace } from "../inventory_crafting_smelting/furnace.js"
import { items,setInventoryItem,setItemHealth } from "../inventory_crafting_smelting/inventoryItems.js"

let _this;
export class Inventory {
    constructor() {
        this.t = new Tileset();
        this.invPos = 0;
        //References the inventory element
        this.fullInventory = document.getElementById("inventory");
        this.invBoxTemp = document.getElementById("invBox");
        this.crafting = new Crafting();
        this.furnace = new Furnace();
        this.clone = this.invBoxTemp.content.querySelector(".inventoryItem");
        this.shiftPressed = false;
        _this = this;

        this.items = [];
        for(let i = 0; i < 8; i++) {
            //Creates an inventory box and adds it to the inventory bar
            this._addInvBox(i,"inventorySmall");
        }
        for(let i = 8; i < 32; i++) {
            //Creates an inventory box and adds it to the full inventory
            let c = this._addInvBox(i,"fullInventory");
        }

        //Intialises dragging/dropping on the inventory boxes
        let blocks = document.getElementsByClassName('inventoryBlock');
        for(const block of blocks) {
            block.addEventListener("dragstart", this.dragstart);
        }

        const containers = document.getElementsByClassName('inventoryItem');
        //Intialises dragging on the inventory items
        for(const container of containers) {
            container.addEventListener("dragover", this.dragover);
            container.addEventListener("dragenter", this.dragenter);
            container.addEventListener("dragleave", this.dragleave);
            container.addEventListener("drop",function(e) {
                _this.drop(e,this);
            });
        }

        //References invBoxes/invBlocks as inventory items/boxes
        this.invBoxes = document.querySelectorAll(".inventoryItem:not(.input)");
        this.invBlocks = document.querySelectorAll(".inventoryItem:not(.input) .inventoryBlock");

        //Sets first inventory bar item as selected
        this.invBoxes[0].classList.add("selected");

        window.items = items;

        this._events();
    }

    hasItem() {
        return items[this.invPos].amount > 0;
    }

    getItem() {
        return items[this.invPos].type;
    }

    removeItem() {
        let item = items[this.invPos];
        //If > 0 remove item
        if(item.amount > 0) {
            item.amount--;
            //Set new amount
            this.invBlocks[this.invPos].setAttribute("data-amount",item.amount);
            let type = item.type;
            this.invBlocks[this.invPos].getElementsByTagName("span")[0].innerText = items[this.invPos].amount;
            //If amount = 0, item type = null
            if(item.amount == 0) {
                setInventoryItem(this.invPos,0,null);
                //item.type = null;
                //Hide inventory item
                this.invBlocks[this.invPos].style.backgroundPosition = "";
                this.invBlocks[this.invPos].classList.add("hide");
            }
            this.toggleCharacterTorch();
            return type;
        }
    }
    addItem(blockType,callback) {
        let index = 0,
            choose = 0;
        for(let i = 0; i < 32; i++) {
            //If block exists add block
            if(items[i].type != null) {
                //check if item / blockType match each other
                if(items[i].type.id == blockType.id && items[i].amount < 64) {
                    index = i;
                    choose = 1;
                    break;
                }
            }
        }
        //If invbox with < 64 blocks
        if(choose == 0) {
            for(let i = 0; i < 32; i++) {
                //If invbox is empty
                if(items[i].type == null) {
                    index = i;
                    break;
                }
                if(i == 31) {
                    return callback(false);
                }
            }
        }
        console.log(blockType);
        setInventoryItem(index,items[index].amount,blockType,null);
        let type = items[index].type;
        //Increment amount of block
        items[index].amount++;
        this.invBlocks[index].classList.remove("hide");
        //Change the backgroundPosition to the correct block pos
        this.invBlocks[index].style.backgroundPosition = "-"+(type.x*4)+"px -"+(type.y*4)+"px";
        this.invBlocks[index].setAttribute("data-amount",items[index].amount);
        this.invBlocks[index].getElementsByTagName("span")[0].innerText = items[index].amount;
        return callback(true);
    }
    _addInvBox(i,location) {
        //Sets the invitem to amount = 0, type = null
        setInventoryItem(i,0,null,null);
        //Creates inventoryItem from the template and adds it to the screen

        this.clone.getElementsByClassName("inventoryBlock")[0].setAttribute("data-index",i);
        document.getElementById(location).append(this.clone.cloneNode(true));
    }

    dragstart(e) {
        _this.srcElement = e.target;
    }

    dragover(e) {
        e.preventDefault()
    }

    dragenter(e) {
        e.preventDefault()
    }
    XOR(a,b,c) {
        return ( a || b || c) && !( a && b && c);
    }
    drop(e,target) {
        let trgt = target.getElementsByClassName("inventoryBlock")[0],
            srcElm = _this.srcElement,
            pNodeC = srcElm.parentNode.classList,
            pNodeId = srcElm.parentNode.id;
        //If dragged blocks are same as dropzone blocks
        let item = items[trgt.getAttribute("data-index")],
            srcItem = items[srcElm.getAttribute("data-index")],
            isCraftingItem = ((pNodeC.contains("output") &&
                                !trgt.parentNode.classList.contains("input")) ||
                                this.srcElement.parentNode.classList.contains("input")) &&
                                item.amount < 64 && (item.type == undefined ||
                                item.type?.id == srcItem.type.id);
            /*isCraftingInput = (pNodeC.contains("input") &&
                                !trgt.parentNode.classList.contains("input") &&
                                item.amount < 64 && (item.type == undefined ||
                                item.type?.id == srcItem.type.id));*/
        if(isCraftingItem || (!pNodeC.contains("output")
            && trgt.parentNode.classList.contains("inventoryItem")
            && !trgt.parentNode.classList.contains("output"))) {
            if(trgt.style.backgroundPosition == srcElm.style.backgroundPosition && trgt != srcElm) {
                let amount = parseInt(trgt.getAttribute("data-amount"))+
                             parseInt(srcElm.getAttribute("data-amount")),
                    srcAmnt = 0;
                //< 64 blocks
                if(amount <= 64) {
                    //Remove dragged item and icrement dropzone value to amount
                    if(_this.shiftPressed) {
                        amount = parseInt(trgt.getAttribute("data-amount"))+1;
                        srcAmnt = parseInt(srcElm.getAttribute("data-amount"))-1;
                    }
                    trgt.setAttribute("data-amount",amount);
                    target.querySelector("span").innerText = amount;
                    srcElm.setAttribute("data-amount",srcAmnt);
                    srcElm.querySelector("span").innerText = srcAmnt;
                    if(srcAmnt == 0) {
                        srcElm.style.backgroundPosition = "";
                        srcElm.classList.add("hide");
                        setInventoryItem(parseInt(srcElm.getAttribute("data-index")),0,null);
                    }else {
                        setInventoryItem(parseInt(srcElm.getAttribute("data-index")),parseInt(srcElm.getAttribute("data-amount")),items[parseInt(srcElm.getAttribute("data-index"))].type);
                    }

                    setInventoryItem(parseInt(trgt.getAttribute("data-index")),amount,items[parseInt(trgt.getAttribute("data-index"))].type);
                    //this.items[parseInt(srcElm.getAttribute("data-index"))] = {amount:0,type:null};
                    //this.items[parseInt(trgt.getAttribute("data-index"))].amount = amount;
                }else {
                    //If amount is more than 64, switch blocks
                    let val = target.getElementsByClassName("inventoryBlock")[0].getAttribute("data-amount"),
                        trgtVal = parseInt(srcElm.getAttribute("data-amount"));

                    trgt.setAttribute("data-amount",trgtVal);
                    target.querySelector("span").innerText = trgtVal;
                    setInventoryItem(parseInt(trgt.getAttribute("data-index")),trgtVal,items[parseInt(trgt.getAttribute("data-index"))].type);
                    //this.items[parseInt(trgt.getAttribute("data-index"))].amount = trgtVal;
                    srcElm.setAttribute("data-amount",val);
                    srcElm.querySelector("span").innerText = val;
                    setInventoryItem(parseInt(srcElm.getAttribute("data-index")),val,items[parseInt(srcElm.getAttribute("data-index"))].type);
                    //this.items[parseInt(srcElm.getAttribute("data-index"))].amount = val;
                }
                //this.srcElement
            }else if(trgt.style.backgroundPosition == "0px 0px" || trgt.style.backgroundPosition == "") {
                //If no blocks at dropzone,remove draggable blocks and add to dropzone
                let amount = parseInt(srcElm.getAttribute("data-amount")),
                    srcType = items[parseInt(srcElm.getAttribute("data-index"))].type;
                trgt.getElementsByClassName("itemHealth")[0].style.width = 0;
                trgt.classList.remove("hide");
                trgt.style.backgroundPosition = srcElm.style.backgroundPosition;
                let item = items[parseInt(srcElm.getAttribute("data-index"))],
                    itemHealth = item.itemHealth != null?item.itemHealth:null;
                trgt.querySelector(".itemHealth").style.width = itemHealth+"%";
                if(_this.shiftPressed) {
                    trgt.setAttribute("data-amount",1);
                    target.querySelector("span").innerText = 1;
                    srcElm.setAttribute("data-amount",amount-1);
                    srcElm.querySelector("span").innerText = amount-1;
                    if(amount-1 == 0) {
                        srcElm.style.backgroundPosition = "";
                        srcElm.classList.add("hide");
                        srcElm.querySelector(".itemHealth").style.width = 0;
                        setInventoryItem(parseInt(srcElm.getAttribute("data-index")),0,null,null);
                    }else {
                        setInventoryItem(parseInt(srcElm.getAttribute("data-index")),0,srcType);
                    }
                    setInventoryItem(parseInt(trgt.getAttribute("data-index")),amount,srcType,itemHealth,itemHealth);
                }else {
                    trgt.setAttribute("data-amount",amount);
                    target.querySelector("span").innerText = amount;
                    srcElm.setAttribute("data-amount",0);
                    srcElm.querySelector("span").innerText = 0;
                    srcElm.style.backgroundPosition = "";
                    srcElm.classList.add("hide");
                    srcElm.querySelector(".itemHealth").style.width = 0;
                    setInventoryItem(parseInt(trgt.getAttribute("data-index")),amount,srcType,itemHealth);
                    setInventoryItem(parseInt(srcElm.getAttribute("data-index")),0,null,null);
                }
                //this.items[parseInt(trgt.getAttribute("data-index"))] = {amount:amount,type:srcType};
                //this.items[parseInt(srcElm.getAttribute("data-index"))] = {amount:0,type:null};
            }else {
                //Switch blocks around if different
                console.log("test3");
                let val = trgt.getAttribute("data-amount"),
                    trgtAmount = parseInt(srcElm.getAttribute("data-amount")),
                    bgPos = trgt.style.backgroundPosition,
                    srcType = items[parseInt(srcElm.getAttribute("data-index"))].type,
                    targetType = items[parseInt(trgt.getAttribute("data-index"))].type,
                    item = items[parseInt(srcElm.getAttribute("data-index"))],
                    itemHealth = item.itemHealth != null?item.itemHealth:null,
                    item2 = items[parseInt(trgt.getAttribute("data-index"))],
                    item2Health = item2.itemHealth != null?item2.itemHealth:null;

                console.log(itemHealth,item2Health);

                trgt.setAttribute("data-amount",trgtAmount);
                trgt.style.backgroundPosition = srcElm.style.backgroundPosition;
                target.querySelector("span").innerText = trgtAmount;
                srcElm.setAttribute("data-amount",val);
                srcElm.querySelector("span").innerText = val;
                srcElm.style.backgroundPosition = bgPos;
                setInventoryItem(parseInt(srcElm.getAttribute("data-index")),val,targetType,item2Health);
                setInventoryItem(parseInt(trgt.getAttribute("data-index")),trgtAmount,srcType,itemHealth);
                itemHealth = itemHealth == null?0:itemHealth;
                item2Health = item2Health == null?0:item2Health;
                trgt.querySelector(".itemHealth").style.width = itemHealth+"%";
                srcElm.querySelector(".itemHealth").style.width = item2Health+"%";
                //this.items[parseInt(srcElm.getAttribute("data-index"))] = {amount:val,type:targetType};
                //this.items[parseInt(trgt.getAttribute("data-index"))] = {amount:trgtAmount,type:srcType};
            }
            //If box that was dragged from was crafting output complete crafting recipe
            if(pNodeC.contains("craftingOutput") &&
                !trgt.parentNode.classList.contains("craftingOutput") &&
                !trgt.parentNode.classList.contains("craftingItem")) {
                this.crafting.completeCrafting();
                this.crafting.checkRecipes();
            }else if((trgt.parentNode.classList.contains("craftingItem") &&
                !trgt.parentNode.classList.contains("craftingOutput") &&
                !pNodeC.contains("craftingOutput")))  {
                //If box that was dragged to was crafting box, check if crafting recipe was correct
                this.crafting.checkRecipes();
            }else if(pNodeC.contains("craftingItem") && !trgt.parentNode.classList.contains("input")) {
                this.crafting.checkRecipes();
            }else if(trgt.parentNode.classList.contains("input") &&
                !trgt.parentNode.classList.contains("furnaceOutput") &&
                !pNodeC.contains("furnaceOutput")) {
                //If box that was dragged to was crafting box, check if crafting recipe was correct
                this.furnace.checkRecipes();
            }else if((pNodeC.contains("furnaceItem") || pNodeC.contains("furnaceFuel")) && !trgt.parentNode.classList.contains("input")) {
                this.furnace.cancelSmelting();
            }
            if(items[parseInt(srcElm.getAttribute("data-index"))].itemHealth == null) {
                srcElm.querySelector(".itemHealthWrapper").classList.add("hide");
            }else {
                srcElm.querySelector(".itemHealthWrapper").classList.remove("hide");
            }
            if(items[parseInt(trgt.getAttribute("data-index"))].itemHealth == null) {
                trgt.querySelector(".itemHealthWrapper").classList.add("hide");
            }else {
                trgt.querySelector(".itemHealthWrapper").classList.remove("hide");
            }
        }
        _this.toggleCharacterTorch();
        //this.append(this.srcElement)
    }

    toggleCharacterTorch() {
        let isTorch = (items[this.invPos].type != null && items[this.invPos].type.id == "torch");
        window.dispatchEvent(new CustomEvent("showCharacterTorch",{detail:isTorch}));
    }

    _events() {
        window.addEventListener("wheel", function(e) {
            //var pos = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            document.getElementsByClassName("selected")[0].classList.remove("selected");
            if(e.deltaY == -100){
                //If scrolling up move to next selected inventory item
                _this.invPos++;
                //If last inv item selected, select first item
                if(_this.invPos == 8) {
                    _this.invPos = 0;
                }
            }else {
                //Move to previous inv item
                _this.invPos--;
                //If first item selected, select last item
                if(_this.invPos == -1) {
                    _this.invPos = 7;
                }
            }
            //Add selected class
            _this.invBoxes[_this.invPos].classList.add("selected");

            _this.toggleCharacterTorch();
        }, false);

        let advancedCrafting = document.getElementsByClassName("advancedCrafting");
        document.addEventListener("keydown",function(e) {
            switch(e.keyCode) {
                case 39:case 38:
                    //Select next inv item
                    document.getElementsByClassName("selected")[0].classList.remove("selected");
                    _this.invPos++;
                    if(_this.invPos == 8) {
                        _this.invPos = 0;
                    }
                    _this.invBoxes[_this.invPos].classList.add("selected");
                    _this.toggleCharacterTorch();
                    break;
                case 37:case 40:
                    //Select previous inv item
                    document.getElementsByClassName("selected")[0].classList.remove("selected");
                    _this.invPos--;
                    if(_this.invPos == -1) {
                        _this.invPos = 7;
                    }
                    _this.invBoxes[_this.invPos].classList.add("selected");
                    _this.toggleCharacterTorch();
                    break;
                case 69:
                    //Toggle inventory visibility
                    _this.fullInventory.classList.toggle("hide");
                    for(let i = 0; i < advancedCrafting.length; i++) {
                        advancedCrafting[i].classList.add("hide");
                    }
                    document.getElementById("crafting").classList.add("smallCrafting");
                    document.getElementById("crafting").classList.remove("hide");
                    document.getElementsByClassName("furnace")[0].classList.add("hide");
                    break;
                case 27:
                    //Hide inventory
                    _this.fullInventory.classList.add("hide");
                    for(let i = 0; i < advancedCrafting.length; i++) {
                        advancedCrafting[i].classList.add("hide");
                    }
                    document.getElementById("crafting").classList.add("smallCrafting");
                    break;
                case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:
                    //Select invbar item based on number selected
                    document.getElementsByClassName("selected")[0].classList.remove("selected");
                    document.getElementById("crafting").classList.remove("hide");
                    //keyCode-49 = (0->7)
                    _this.invPos = e.keyCode-49;
                    _this.invBoxes[_this.invPos].classList.add("selected");
                    _this.toggleCharacterTorch();
                    break;
                case 16:
                    _this.shiftPressed = true;
            }
        });
        document.addEventListener("keyup",function(e) {
            _this.shiftPressed = false;
        });

        window.addEventListener("damageItem",function(e) {
            let selected = document.querySelector(".selected .inventoryBlock");
            //Decement item health by 2 units
            setItemHealth(parseInt(selected.getAttribute("data-index")),2);
            selected.querySelector(".itemHealth").style.width = items[parseInt(selected.getAttribute("data-index"))].itemHealth+"%";
            //If item health is <= 0, remove the item
            if(items[parseInt(selected.getAttribute("data-index"))].itemHealth <= 0) {
                _this.removeItem();
            }
        });

        window.addEventListener("addInventoryItem",function(e) {
            _this.addItem(e.detail,function(hasSpace) {
                if(hasSpace) {
                    //Remvoe block from world if space in inventory
                    _this.toggleCharacterTorch();
                    window.dispatchEvent(new CustomEvent("hasSpace",{
                        detail:true
                    }));
                }
            })
        });

        window.addEventListener("addNewItem",function(e) {
            for (let [key, value] of Object.entries(_this.t)) {
                if(value.id == e.detail[0]) {
                    for(let i = 0; i < e.detail[1]; i++) {
                        _this.addItem(value,function(hasSpace) {});
                    }
                }
            }
        });
    }
}
