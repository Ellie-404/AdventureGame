
let Inv = []; //Player Inventory

// Bathroom items: Spray bottle, BathroomKey, barOfSoap
// Bedroom items:   SafeWithRecipe
// Storage room items:  Ingredient1
// Kitchen room items: Salt, Pepper, Spatula, Ingredient2
// Living room items: SafeCode, StorageKey

//Combine: Ingredient1 + Ingredient2 + SprayBottle = WeedKiller

const room = ["bathRoom", "hallway", "bedRoom", "livingRoom", "kitchen","storageRoom"]; //list of rooms

let playerHealth = 100;
let monsterHealth = 100;
let currentRoom = room[0];
let roomMemory = [];
let plantEvent = [];

//Tracks events
const eventTracker = {
    bathroomDoorLocked: true,
};

//Tracks if inspected objects
const inspected = {
    bedroomDoor:false,
    storageroomDoor:false,
}

//tracks if entered a room
const roomsVisited = {
    hallway: false, 
    bedRoom: false, 
    livingRoom: false,
    kitchen: false,
    storageRoom: false
};

const narratorText = document.getElementById("narrator");
const input = document.querySelector("#choiceBox");
const goBackBtn = document.querySelector("#goBackBtn");
const imageLink = document.getElementById("imgLink");

const healthPlayerDiv = document.getElementById("healthPlayer");
const healthMonsterDiv = document.getElementById("healthMonster");

// Updates player and monster health
function healthTracker(){
healthPlayerDiv.innerHTML = "Player HP:" + playerHealth;
healthMonsterDiv.innerHTML = "Monster HP:" + monsterHealth;
};

healthTracker();

// "show's" the player what is in their current location and gives actions based on this.
function lookAround(){
    image();
    if (currentRoom === room[0]){ //Bathroom
        narratorText.innerHTML = "You look around... <br> you're in what looks like an old and musty bathroom, there is a door a sink with a cabinet and an old toilet"
        const things = ["door","toilet","sink cabinet"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            const button = document.createElement("button");
            button.textContent = `Inspect ${thing}`;
            button.addEventListener("click", function(){
                inspect(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
    } else if (currentRoom === room[1]){ //Hallway
        narratorText.innerHTML = "You look around the hallway... <br> There is a door right in front of you, a door to your left. or you can walk down the hallway into what looks to be the living room"
        const things = ["firstDoor","secondDoor","downHallway","Bathroom"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            
            const button = document.createElement("button");
            button.textContent = `${thing}`;
            button.addEventListener("click", function(){
                inspect(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
    } else if (currentRoom === room[2]){ //Bedroom
        narratorText.innerHTML = "You look around you... you are standing in a bedroom. <br> to your left you spot a big closet, its doors barely hanging on their hinges. <br> to your right an old bed and straight a head a small window, it's curtains sheer <br> you... ? ? "
        const things = ["oldCloset","oldBed","window"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            
            const button = document.createElement("button");
            button.textContent = `Inspect ${thing}`;
            button.addEventListener("click", function(){
                inspect(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
        input.appendChild(createButton("Go back", () => goBack()));

    } else if (currentRoom === room[3]){ //Living room
        if(roomsVisited.livingRoom === false){
            narratorText.innerHTML = "You look around you... you are standing in the living room. <br> just as you step inside you spot an old lady sitting in a rocking chair in the corner. you jump a little as her head quickly snaps in you'r direction <br> she fixes you with a blank but intense stare <br> what do you do...?"
            roomsVisited.livingRoom = true;
        } else if (roomsVisited.livingRoom === true){
            narratorText.innerHTML = "You look around you... you are standing in the living room. <br> The old lady is still sitting in the corner just staring at you... <br> What do you do...?"
        }
        const things = ["approach lady","Inspect Fireplace"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            
            const button = document.createElement("button");
            button.textContent = `${thing}`;
            button.addEventListener("click", function(){
                inspect(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
        input.appendChild(createButton("Go back", () => goBack()));
    } else if (currentRoom === room[4]){ //Kitchen
        narratorText.innerHTML = "You look around you... you are standing the kitchen. <br> it's a simple kitchen.. the monsterous plant's roots are everywhere. <br> a big flower with a big eye sits on one of the vines..."
        const things = ["Inspect fridge","Inspect cupboards", "Inspect Sink","Approach plant"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            
            const button = document.createElement("button");
            button.textContent = `${thing}`;
            button.addEventListener("click", function(){
                inspect(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
        input.appendChild(createButton("Go back", () => goBack()));
    }else if (currentRoom === room[5]){ //Storage
        narratorText.innerHTML = "You look around you... you are standing in a storage room"
        input.innerHTML = ""; // clears input field
        
        input.appendChild(createButton("Go back", () => goBack()));
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
            image("door");
            if(!Inv.includes("bathroomKey") && eventTracker.bathroomDoorLocked){
                narratorText.innerHTML = "You approach the door and try the handle, it's locked";
                input.innerHTML="";
            } else if (Inv.includes("bathroomKey")){
                Inv.pop();
                eventTracker.bathroomDoorLocked = false;
                narratorText.innerHTML = "You approach the door and try the handle, it's locked, you use the key you found to unlock the door. <br> do you go trough ?";
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    action("enter")
                    currentRoom = room[1];
                }));
            }else {
                narratorText.innerHTML = "you approach the bathroom door";
                input.innerHTML="";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    action("enter")
                    currentRoom = room[1];
                }));
            }
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }else if (focus === "toilet"){
            image("toilet");
            if (Inv.includes("bathroomKey")){
                narratorText.innerHTML="you inspect the toilet, there is nothing here.";
                input.innerHTML = '';
                input.appendChild(createButton("Go back", () => goBack("inspect"))); //Calling createButton function and gives it parameters to specify it.

            }else{
                narratorText.innerHTML="you inspect the toilet, a shiny object hanging in the side catches your attention, as you inspect further you realize it's a key.";
                input.innerHTML = '';
                input.appendChild(createButton("Take key", () => action("takeKey")));
                input.appendChild(createButton("Go back", () => goBack("inspect"))); //Calling createButton function and gives it parameters to specify it.
            }
        } else if (focus === "sink cabinet"){
            if(Inv.includes("SprayBottle")){
                narratorText.innerHTML="you inspect the sink cabinet, there is nothing here.";
                input.innerHTML = '';
                input.appendChild(createButton("Go back", () => goBack("inspect"))); //Calling createButton function and gives it parameters to specify it.
            }else{
                narratorText.innerHTML="you inspect the sink cabinet... <br> you find an empty spray bottle";
                input.innerHTML = '';
                input.appendChild(createButton("Take bottle", () => action("takeSprayBottle")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
        }
    }else if (currentRoom === room[1]){ //Hallway
        if(focus === "firstDoor"){
                inspected.bedroomDoor = true;
                image("door");
                narratorText.innerHTML = "You approach the door, as you inspect it further you see the word ..Bedroom.. written on it. <br> do you enter ?";
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    currentRoom = room[2];
                    action("enter")
                }));
                input.appendChild(createButton("Go back", () => goBack("inspect")));

            }else if (focus === "secondDoor"){
                image("door");
                narratorText.innerHTML = "You approach the door, as you inspect it further you see the word ..storage.. written on it. <br> do you enter ?";
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    if(!Inv.includes("storageKey")){
                        narratorText.innerHTML = "As you try the handle you realize the door is locked."
                        input.innerHTML = "";
                        input.appendChild(createButton("Go back", () => goBack("inspect")));
                    }

                    if(Inv.includes("storageKey")){
                        roomMemory.push(currentRoom);
                        currentRoom = room[5];
                        action("enter") 
                    }

                }));
                input.appendChild(createButton("Go back", () => goBack("inspect")));

            }else if (focus === "downHallway"){
                image("downHallway");
                narratorText.innerHTML = "You make your way to the end of the hallway. what you see is a living room and a kitchen adjacent to each other <br> where do you go ?";
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
            }else if (focus === "Bathroom"){
                narratorText.innerHTML = "You approach the bathroom door";
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    currentRoom = room[0];
                    action("enter")
                }));
            }

    }else if (currentRoom === room[2]){ // Bedroom
        if(focus === "oldCloset"){
            if(!Inv.includes("safeCode")){
                narratorText.innerHTML = "You approach the old closet, you open the door and find a safe. it's secrets safely locked away <br> you need a combination to open the safe";
                input.innerHTML = "";
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            } else{
                narratorText.innerHTML = "You approach the old closet, you open the door and find a safe. it's secrets safely locked away <br> lucky for you, you have the code <br> what do you do..?";
                input.innerHTML = "";
                input.appendChild(createButton("Open it", () => action("open")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
            
        }else if(focus === "oldBed"){
            narratorText.innerHTML = "you walk towards the old bed. it's vacancy apparent by the thick layer of dust covering it like a blanket. <br> there is nothing more to see here. ";
            input.innerHTML = "";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }else if(focus === "window"){
            narratorText.innerHTML = "You approach the window. you can see trough the sheer curtains that it's boarded up from outside <br> from what little you can see trough the cracks you can make out that you are in a what seems to be a forrest. <br> the dim orange glow giving away the time of day.";
            input.innerHTML = "";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    }else if (currentRoom === room[3]){ // LivingRoom
        if(focus === "approach lady"){
            if(!plantEvent.includes("spatulaInEye")){
                narratorText.innerHTML = "as you approach the old lady her eyes follow your every move... <br> you...?"
                const things = ["Speak","Stare even more back", "Make a silly face"];
                input.innerHTML = ""; // clears input field
            
                things.forEach(function (thing){
                
                const button = document.createElement("button");
                button.textContent = `${thing}`;
                button.addEventListener("click", function(){
                    action(thing);
                });
                input.appendChild(button); //inserts buttons into "parent" Input div
            });
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            } else if (!Inv.includes("storageKey")){
                narratorText.innerHTML = "The old lady looks from you to where the giant plant eye was before. she starts to cackle hysterically <br> then she starts to cough loudly and spits out a key <br> you are shocked but you slowly pick up the key from the floor <br> as you do the old lady abruptly stops to laugh and looks away"
                input.innerHTML = ""
                Inv.push("storageKey");
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            } else{
                narratorText.innerHTML = "You now have the key and the giant eye is gone. but as you look at the old lady you notice that she's not just looking somewhere random... <br> she is focusing her eyes on one spot on the fireplace..."
                input.innerHTML = "";
                eventTracker.push("staringFireplace");
                input.appendChild(createButton("Inspect fireplace", () => inspect("Inspect Fireplace")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));

            }
            
        }else if(focus === "Inspect Fireplace"){
            if(!eventTracker.includes("staringFireplace")){
                narratorText.innerHTML = "You approach the fireplace inspecting it. the quiet crackling of embers quiet you'r mind. <br> there is nothing more to do here.";
                input.innerHTML ="";
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            } else{
                narratorText.innerHTML = "You look at where the old lady is staring. you realize that she is staring at one of the bricks on the fireplace <br> it is slightly askew. you go up to it and realize that it is loose <br> as you pull it out you find a small note tucked behind. <br> it's the safe code!";
                input.innerHTML ="";
                Inv.push("safeCode");
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
            
        }
    }else if (currentRoom === room[4]){ // Kitchen
        if(focus === "Inspect fridge"){
            narratorText.innerHTML =" you open the fridge, a foul smell hit's your nose. you cover it and peer inside. <br> something something...."
            input.innerHTML = "";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }else if(focus === "Inspect cupboards"){
            input.innerHTML ="";
            let things = [];
            if(!Inv.includes("salt")){
                things.push("salt")
            }
            if(!Inv.includes("pepper")){
                things.push("pepper")
            }
            if(!Inv.includes("spatula")){
                things.push("spatula")
            }
            things.forEach(function (thing){
            
            const button = document.createElement("button");
            button.textContent = `Grab ${thing}`;
            button.addEventListener("click", function(){
                action("grab", thing, button);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
            });
            input.appendChild(createButton("Go back", () => goBack("inspect")));
            if(
                Inv.includes("salt") &&
                Inv.includes("pepper") &&
                Inv.includes("spatula")
            ){
                narratorText.innerHTML ="you start rummage trough each cupboard. you have already grabbed each item here:  "
            } else{
                narratorText.innerHTML ="you start rummage trough each cupboard. you find a few items:...  "
            }

        }else if(focus === "Inspect Sink"){
            narratorText.innerHTML ="You look at the sink. when you try the faucet nothing happens. there is no water, <br> a black sludge like substance is coating the bottom of the sink... <br> there is nothing to do here..."
            input.innerHTML = ""; // clears input field
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }else if(focus === "Approach plant"){
            narratorText.innerHTML ="You approach the monsterous eye looking at you from the corner... <br> you...?"
            input.appendChild(createButton("Go back", () => goBack("inspect")));
            input.innerHTML ="";
            Inv.forEach(function (thing){
                const button = document.createElement("button");
                button.textContent = `use ${thing}`;
                button.addEventListener("click", function(){
                    action("use", thing, button);
                });
                input.appendChild(button);
            });
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    }else if(currentRoom === room[5]){ // StorageRoom
    }else{
        console.log("ERROR: inspect function did not work as intended")
    }
};

//makes it so the player can perform an action with the object in focus.
function action(action, item, button){
    if (currentRoom === room[0]){ //Bathroom logic
        if (action === "takeKey"){
            Inv.push("bathroomKey");
            narratorText.innerHTML = "You take the key";
            input.innerHTML ="";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        } else if (action === "enter") {
            narratorText.innerHTML = "You go through the door";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        } else if (action === "takeSprayBottle"){
            Inv.push("SprayBottle");
            narratorText.innerHTML = "You take the spray bottle";
            input.innerHTML ="";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    } else if (currentRoom === room[1]){//hallway action
        narratorText.innerHTML = "You go through the door";
        input.innerHTML = "";
        input.appendChild(createButton("look around", () => lookAround()));
        input.appendChild(createButton("Go back", () => goBack()));
    } else if (currentRoom === room[2]){//bedroom action
        if (action === "enter"){
            narratorText.innerHTML = "You go through the door";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        } else if (action =="open"){
            narratorText.innerHTML = "you open the safe, inside you find some old documents. <br> one paper in particular catches you'r interest. as you inspect it further you realize it's a recipe for weed killer. <br> you take it with you...";
            Inv.push("recipe");
            input.innerHTML = "";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
            
        }   
    } else if (currentRoom === room[3]){//livingRoom action
        if (action === "enter"){
            narratorText.innerHTML = "You step into the livingRoom";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }else if(action === "Speak"){
            narratorText.innerHTML = "You say hello to the old lady but she only keeps staring at you"
        }else if(action === "Stare even more back"){
            narratorText.innerHTML ="You stare back at the old lady as if having a staring contest. some time passes before you feel you'r eyes start to sting making you close them. <br> the old lady makes no sound or movement still staring intensely"
        }else if(action === "Make a silly face"){
            narratorText.innerHTML = "You take a deep breath before contorting your face into every funny and silly expression you can manage hoping to get a reaction <br> the old lady makes no sound or movement still staring intensely <br> you feel you'r cheeks warm up as embarrassment fills you "
        }
    } else if (currentRoom === room[4]){//Kitchen action
        if (action === "enter"){
            narratorText.innerHTML = "You step into the Kitchen";
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }else if(action === "grab"){
            if (!Inv.includes(item)){
                Inv.push(item);
            }
            
            if (button){
                button.remove();
            }

            narratorText.innerHTML += ` <br> You picked up ${item}`;
        }else if(action === "use"){
            if(item === "salt"){
                narratorText.innerHTML = "you throw salt at the monster plants eye <br> you hear a loud roar as the eye closes shut and start to water. the vines quiver slightly"
                monsterHealth -= 1;
                Inv = Inv.filter(i => i !== item);
                healthTracker();
            }else if(item === "pepper"){
                narratorText.innerHTML = "you decide to throw pepper at it, but as you do it back fires and you get a sneezing fit..."
                playerHealth -= 1;
                Inv = Inv.filter(i => i !== item);
                healthTracker();
            }else if(item === "spatula"){
                narratorText.innerHTML = "you pull out the spatula from your bag, wielding it like a weapon you charge at the plant poking it as hard as you can in the eye <br> the monster shrieks in response and retreats"
                monsterHealth -= 1;
                plantEvent.push("spatulaInEye")
                Inv = Inv.filter(i => i !== item);
                healthTracker();
            }
            if (button){
                button.remove();
            }
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

// gives player ending screen type based on choices etc
function theEnd(type){
    const ending = document.getElementById("endText");
    if (theEnd === "sleep"){
        ending.innerHTML = "You went to sleep and died...";
    }
}

// Changes game image based on location etc
function image(focus){
    console.log("image() running", currentRoom);
    if (currentRoom === "bathRoom"){ //Bathroom
        imageLink.src = "https://images.pexels.com/photos/31415128/pexels-photo-31415128.jpeg";
        if(focus === "toilet"){
            imageLink.src = "https://images.pexels.com/photos/5370033/pexels-photo-5370033.jpeg";
        } else if (focus === "door"){
            imageLink.src = "https://images.pexels.com/photos/33815007/pexels-photo-33815007.jpeg";
        }
    }else if (currentRoom === room[1]){ //Hallway
        imageLink.src = "https://images.pexels.com/photos/34572109/pexels-photo-34572109.jpeg";
        if (focus === "door"){
            imageLink.src = "https://images.pexels.com/photos/33815007/pexels-photo-33815007.jpeg";
        } else if (focus === "downHallway"){
            imageLink.src = "https://github.com/Ellie-404/AdventureGame/blob/main/img/Untitled%20design.png?raw=true";
        }
    }else if (currentRoom === room[2]){ //Bedroom
        imageLink.src = "https://images.pexels.com/photos/35839979/pexels-photo-35839979.jpeg";
        if (focus === "door"){
            imageLink.src = "https://images.pexels.com/photos/33815007/pexels-photo-33815007.jpeg";
        }
    }else if (currentRoom === room[3]){ //Living room
        imageLink.src = "https://images.pexels.com/photos/7859830/pexels-photo-7859830.jpeg";
        if (focus === "door"){
            imageLink.src = "https://images.pexels.com/photos/33815007/pexels-photo-33815007.jpeg";
        }
    }else if (currentRoom === room[4]){ //Kitchen
        imageLink.src = "https://images.pexels.com/photos/30715456/pexels-photo-30715456.jpeg";
        if (focus === "door"){
            imageLink.src = "https://images.pexels.com/photos/33815007/pexels-photo-33815007.jpeg";
        }
    }else if (currentRoom === room[5]){ //Storage
        imageLink.src = "https://images.pexels.com/photos/26346570/pexels-photo-26346570.jpeg";
        if (focus === "door"){
            imageLink.src = "https://images.pexels.com/photos/33815007/pexels-photo-33815007.jpeg";
        }
    }else{
        console.log("Image function did not work as intended...");
    }
}