let items = [];
export function setInventoryItem(i,amount,type,itemHealth) {
    items[i] = {amount:amount,type:type,itemHealth:itemHealth};
}
export function setItemHealth(i,value) {
    items[i].itemHealth-=value;
}
export {
    items
}
