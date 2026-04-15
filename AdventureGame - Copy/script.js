
let Inv = []; //Player Inventory
let bathroomSthuff = ["sprayBottle", "bathroomKey","barOfSoap"]; //Bathroom "inventory"
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
    goBackBtn.classList.add("hidden");
    if (currentRoom === room[0]){
        narratorText.innerHTML = "You look around... <br> you're in what looks like an old and musty bathroom, there is a door, window, sink, cabinet, mirror, trashcan and an old toilet"
        const things = ["door", "window", "sink", "toilet", "cabinet", "mirror"];
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
        narratorText.innerHTML = "You look around you... <br> There is a door right in front of you, a door to your left. or you can walk down the hallway into what looks to be the living room"
        const things = ["doorOne","doorLeft","walkHallway"];
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
    } 
};

//makes it so player can inspect and interact with objects etc.
function inspect(focus){
    if(currentRoom === room[0]){ //Bathroom
        if(focus === "door"){
            if(!Inv.includes("bathroomKey")){
                narratorText.innerHTML = "You approach the door and try the handle, it's locked";
                goBackBtn.setAttribute('onclick', "goBack('door')");
                goBackBtn.classList.remove("hidden");
                /* 
                const button2 = document.createElement("button");
                button2.textContent = `Go back`;
                button2.addEventListener("click", function(){
                    goBack("inspect");
                });
                input.appendChild(button2); */ 
            }
            else if (Inv.includes("bathroomKey")){
                narratorText.innerHTML = "You approach the door and try the handle, it's locked, you use the key you found to unlock the door. <br> do you go trough ?";
                const button = document.createElement("button");
                button.textContent =`Enter`;
                button.addEventListener("click", function(){
                    action("open");
                    roomMemory.push(currentRoom); //put's current room into roomMemory array for later use. 
                    currentRoom = room[1]; // updates current room. 
                });
                input.appendChild(button);
            }
        } else if (focus === "window"){
                narratorText.innerHTML = "you inspect the window";
        } else if (focus === "mirror"){
            narratorText.innerHTML = "you inspect the mirror";
        } else if (focus === "sink"){
            narratorText.innerHTML = "you inspect the sink";
        } else if (focus === "cabinet"){
            narratorText.innerHTML="you inspect the cabinet";
        } else if (focus === "toilet"){
            narratorText.innerHTML="you inspect the toilet";
        }
    }else if (currentRoom === room[1]){ //Hallway
        if(focus === "doorOne"){

        }else if (focus === "doorLeft"){

        }else if (focus === "walkHallway"){

        }

    }else if (currentRoom === room[2]){ // Bedroom

    }else if (currentRoom === room[3]){ // LivingRoom

    }else if (currentRoom === room[4]){ // Kitchen

    }else if (currentRoom === room[5]){ // StorageRoom

    }
};

//makes it so the player can perform an action with the object in focus.
function action(action){
    if (currentRoom === room[0]){
        if (action === "open"){
            narratorText.innerHTML = "You go trough the door and end up in what seems to be a hallway";
            input.innerHTML = "";

            const button1 = document.createElement("button"); //makes and inputs lookAround button
            button1.textContent =`Look around`;
            button1.addEventListener("click", function(){
                lookAround();
            })
            input.appendChild(button1);

            const button2 = document.createElement("button"); //makes and inputs goBack button
            button2.textContent = `Go back`;
            button2.addEventListener("click", function(){
                goBack();
            })
            input.appendChild(button2);
        }
    }
};

// removes previous room from memory array and puts it as current room. unless you are inspecting something.
function goBack(focus){ 
    if (focus === "inspect"){
        narratorText.innerHTML = "You go back";
        input.innerHTML = "";
        const button1 = document.createElement("button");
        button1.textContent =`Look around`;
        button1.addEventListener("click", function(){
            lookAround();
        })
        input.appendChild(button1);
    } else {
        let x = roomMemory.pop();
    currentRoom = x;
    narratorText.innerHTML = "You go back";
    }
};