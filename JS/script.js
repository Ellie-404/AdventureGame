
let Inv = []; //Player Inventory
let bathroomStuff = ["sprayBottle", "bathroomKey","barOfSoap"]; //Bathroom "inventory"
let bedroomStuff = ["recipe",];
let storageStuff = ["ingredient1", "axe"];
let kitchenStuff = ["ingredient2"];
let livingroomStuff = ["storageKey", "safeCode"];

const room = ["bathRoom", "hallway", "bedRoom", "livingRoom", "kitchen","storageRoom"]; //list of rooms

let playerHealth = 100;
let monsterHealth = 100;
let currentRoom = room[0];
let roomMemory = [];

const narratorText = document.getElementById("narrator");
const image = document.getElementById("imgBox");
const input = document.querySelector("#choiceBox");
const goBackBtn = document.querySelector("#goBackBtn");

// "show's" the player what is in their current location and gives actions based on this.
function lookAround(){
    if (currentRoom === room[0]){
        narratorText.innerHTML = "You look around... <br> you're in what looks like an old and musty bathroom, there is a door, window, sink, cabinet, mirror, trashcan and an old toilet"
        const things = ["door","toilet"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            const button = document.createElement("button");
            button.textContent = `Inspect ${thing}`;
            button.addEventListener("click", function(){
                inspect(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
    } else if (currentRoom === room[1]){
        narratorText.innerHTML = "You look around the hallway... <br> There is a door right in front of you, a door to your left. or you can walk down the hallway into what looks to be the living room"
        const things = ["firstDoor","secondDoor","downHallway"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            
            const button = document.createElement("button");
            button.textContent = `Inspect ${thing}`;
            button.addEventListener("click", function(){
                inspect(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
    } else if (currentRoom === room[2]){
        narratorText.innerHTML = "You look around you... you are standing in a bedroom."
    } else if (currentRoom === room[3]){
        narratorText.innerHTML = "You look around you... you are standing in the living room."
    } else if (currentRoom === room[4]){
        narratorText.innerHTML = "You look around you... you are standing the kitchen."
    } else {
        console.log("ERROR: lookAround function did not work as intended")
    }
};

// function to create buttons.
function createButton(text, onClick){ 
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", onClick);
    return btn;
};

//makes it so player can inspect and interact with objects etc.
function inspect(focus){
    if(currentRoom === room[0]){ //Bathroom
        if(focus === "door"){
            if(!Inv.includes("bathroomKey")){
                narratorText.innerHTML = "You approach the door and try the handle, it's locked";
                input.innerHTML="";
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            } else if (Inv.includes("bathroomKey")){
                narratorText.innerHTML = "You approach the door and try the handle, it's locked, you use the key you found to unlock the door. <br> do you go trough ?";
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    action("enter")
                    currentRoom = room[1];
                }));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
                }
        }else if (focus === "toilet"){
            if (Inv.includes("bathroomKey")){narratorText.innerHTML="you inspect the toilet, there is nothing here.";
            }else if(!Inv.includes("BathroomKey")){
                narratorText.innerHTML="you inspect the toilet, a shiny object hanging in the side catches your attention, as you inspect further you realize it's a key.";
                input.innerHTML = '';
                input.appendChild(createButton("Take key", () => action("takeKey")));
                input.appendChild(createButton("Go back", () => goBack("inspect"))); //Calling createButton function and gives it parameters to specify it.
            }
        }
    }else if (currentRoom === room[1]){ //Hallway
        if(focus === "firstDoor"){
                narratorText.innerHTML = "You approach the door, as you inspect it further you see the word ..Bedroom.. written on it. <br> do you enter ?";
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    currentRoom = room[2];
                    action("enter")
                }));
                input.appendChild(createButton("Go back", () => goBack("inspect")));

            }else if (focus === "secondDoor"){
                narratorText.innerHTML = "You approach the door, as you inspect it further you see the word ..storage.. written on it. <br> do you enter ?";
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    currentRoom = room[5];
                    action("enter")
                }));
                input.appendChild(createButton("Go back", () => goBack("inspect")));

            }else if (focus === "downHallway"){
                narratorText.innerHTML = "You make your way to the end of the hallway. what you see is a livingroom and a kitchen adjacent to eachother <br> where do you go ?";
                input.innerHTML = "";
                input.appendChild(createButton("Enter kitchen", () => {
                    roomMemory.push(currentRoom);
                    currentRoom = room[4];
                    action("enter")
                }));
                input.appendChild(createButton("Enter livingRoom", () => {
                    roomMemory.push(currentRoom);
                    currentRoom = room[3];
                    action("enter")}
                ));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }

    }else if (currentRoom === room[2]){ // Bedroom
    }else if (currentRoom === room[3]){ // LivingRoom
    }else if (currentRoom === room[4]){ // Kitchen
    }else if (currentRoom === room[5]){ // StorageRoom
    } else{
        console.log("ERROR: inspect function did not work as intended")
    }
};

//makes it so the player can perform an action with the object in focus.
function action(action){
    if (currentRoom === room[0]){ //Bathroom logic
        if (action === "takeKey"){
            Inv.push("bathroomKey");
            narratorText.innerHTML = "You take the key";
            input.innerHTML ="";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        } else if (action === "enter") {
            narratorText.innerHTML = "You go trough the door and end up in a hallway";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    } else if (currentRoom === room[1]){//hallway action
    } else if (currentRoom === room[2]){//bedroom action
        if (action === "enter"){
            narratorText.innerHTML = "You enter the bedroom";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }
    } else if (currentRoom === room[3]){//livingRoom action
        if (action === "enter"){
            narratorText.innerHTML = "You step into the livingRoom";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }
    } else if (currentRoom === room[4]){//Kitchen action
        if (action === "enter"){
            narratorText.innerHTML = "You step into the Kitchen";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }
    } else if ( currentRoom === room[5]){//storageRoom action
        if (action === "enter"){
            narratorText.innerHTML = "You enter the storageroom";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }
    }
    else {
        console.log("ERROR: action function did not work as intended")
    }
};

// removes previous room from memory array and puts it as current room. unless you are inspecting something.
function goBack(focus){ 
    if (focus === "inspect"){
        narratorText.innerHTML = "You go back";
        input.innerHTML = "";
        input.appendChild(createButton("look around", () => lookAround()));
    } else {
    input.innerHTML = "";
    let x = roomMemory.pop();
    currentRoom = x;
    narratorText.innerHTML = "You go back";
    input.appendChild(createButton("look around", () => lookAround()));
    }
};

function theEnd(type){
    const ending = document.getElementById("endText");
    if (theEnd === "sleep"){
        ending.innerHTML = "You went to sleep and died...";
    }
}