let craftingRecipies = {
    "100000000":[
        {ingredients:["log"],output:[["stripped_log"]]},
        {ingredients:["stripped_log"],output:[["stick",4],["wooden_block"]]},
        {ingredients:["leaves"],output:[["string"],["torch"]]},
    ],
    "010010010":[
        {ingredients:[null,"boulder",null,null,"string",null,null,"stick",null],output:[["stone_pickaxe"]]}
    ],
    "110010010":[
        {ingredients:["boulder","boulder",null,null,"string",null,null,"stick",null],output:[["stone_axe"]]}
    ],
    "100100000":[
        {ingredients:["coal",null,null,"stick",null,null,null,null,null],output:[["torch"]]}
    ],
    "110110000":[
        {ingredients:["wooden_block","wooden_block",null,"stick","stick",null,null,null,null],output:[["crafting_bench"]]}
    ],
    "111101111":[
        {ingredients:["rock","rock","rock","rock",null,"rock","rock","rock","rock"],output:[["furnace"]]}
    ]
}
export {
    craftingRecipies
}
