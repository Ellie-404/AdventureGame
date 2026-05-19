
let Inv = []; //Player Inventory

// Bathroom items: Spray bottle, BathroomKey, barOfSoap
// Bedroom items:   SafeWithRecipe, Ingredient2
// Storage room items:  Ingredient1, broken rifle
// Kitchen room items: Salt, Pepper, Spatula
// Living room items: SafeCode, StorageKey

//Combine: Ingredient1 + Ingredient2 + SprayBottle = WeedKiller

const room = ["bathRoom", "hallway", "bedRoom", "livingRoom", "kitchen","storageRoom","outside"]; //list of rooms

let playerHealth = 100;
let monsterHealth = 100;
let currentRoom = room[3];
let roomMemory = [];
let plantEvent = [];

let playerInv = {
    bathroomKey: false,
    safeCode: false, 
    storageRoomKey: false, 
    sprayBottle: false, 
    ingredient1: false, 
    ingredient2: false, 
    salt: false, 
    pepper: false, 
    recipe: false, 
    spatula: false, 
    barOfSoap: false,  
    weedKiller: false,  
};

//Tracks events
let eventTracker = {
    bathroomDoorLocked: true,
    staringFireplace: false,
    spatulaInEye: false,
    weedKillerUsed: false,
};

//Tracks if inspected objects
let inspected = {
    bedroomDoor:false,
    storageroomDoor:false,
};

//tracks if entered a room
let roomsVisited = {
    hallway: false, 
    bedRoom: false, 
    livingRoom: false,
    kitchen: false,
    storageRoom: false
};

const narratorText = document.getElementById("narrator");
const input = document.querySelector("#choiceBoxButtons");
const goBackBtn = document.querySelector("#goBackBtn");
const imageLink = document.getElementById("imgLink");

const healthPlayerDiv = document.getElementById("healthPlayer");
const healthMonsterDiv = document.getElementById("healthMonster");

const doorSound = new Audio("sound/dragon-studio-door-opening-sfx-454243.mp3");

// Updates player and monster health
function healthTracker(){
healthPlayerDiv.innerHTML = "Player HP:" + playerHealth;
healthMonsterDiv.innerHTML = "Monster HP:" + monsterHealth;
    if(playerHealth === 0){
        theEnd();
    }else if (monsterHealth === 0){
        winnerDinner();
    }
};

let currentSound = null;  // keeps track of sounds playing
let typingSound = new Audio("sound/freesound_community-035385_long-sound-typewriter-76388.mp3");
let typewriterInterval = null;

//plays sound effect with current room
function playRoomSound(room) {
    if (currentSound) {
        currentSound.pause();  // stop previous sound
        currentSound.currentTime = 0;
    }

    const sounds = {
        "bathroom": new Audio("sound/freesound_community-dripping-tapwater-27783.mp3"),
        "hallway": new Audio("sound/freesound_community-wood-creaking-30692.mp3"),
        "bedroom": new Audio("sound/tanweraman-howling-hissy-blizard-350418.mp3"),
        "livingroom": new Audio("sound/freesound_community-rocking-chair-grand-final-78248.mp3"),
    };

    if (sounds[room]) {
        currentSound = sounds[room];
        currentSound.loop = true;  // loop så den spiller kontinuerlig
        currentSound.play();
    }
};

//TypeWriter effect
function typeWriter(text, element, speed = 30) {
    if (typewriterInterval) {
        clearInterval(typewriterInterval);  // stopp forrige
    }
    
    narratorText.innerHTML = "";
    
    typingSound.pause();        // stopp forrige
    typingSound.currentTime = 0; // spol tilbake
    typingSound.volume = 0.3;
    typingSound.play();          // start på nytt


    const parts = text.split("<br>");
    let partIndex = 0;
    let charIndex = 0;

    typewriterInterval = setInterval(() => {  // lagre i den globale
        if (partIndex >= parts.length) {
            clearInterval(typewriterInterval);
            typingSound.pause();
            return;
        }

        if (charIndex < parts[partIndex].length) {
            element.innerHTML += parts[partIndex][charIndex];
            charIndex++;
        } else {
            if (partIndex < parts.length - 1) {
                element.innerHTML += "<br>";
            }
            partIndex++;
            charIndex = 0;
        }
    }, speed);
};

healthTracker();

// "show's" the player what is in their current location and gives actions based on this.
function lookAround(){
    image();
    if (currentRoom === room[0]){ //Bathroom
        playRoomSound("bathroom");
        typeWriter("You look around... <br> you're in what looks like an old and musty bathroom, there is a door a sink with a cabinet and an old toilet...", narratorText);
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
        playRoomSound("hallway");
        typeWriter("You look around the hallway... <br> There is a door right in front of you, a door to your left. or you can walk down the hallway into what looks to be the living room", narratorText);
        const things = ["downHallway","Bathroom"];
        
        if (inspected.bedroomDoor === false){
            things.push("firstDoor");
        } else if (inspected.bedroomDoor){
            things.push("bedroom");
        };

        if(inspected.storageroomDoor === false){
            things.push("secondDoor");
        } else if (inspected.storageroomDoor){
            things.push("storageRoom");
        };
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
        playRoomSound("bedroom");
        typeWriter("You look around you... you are standing in a bedroom. <br> to your left you spot a big closet, its doors barely hanging on their hinges. <br> to your right an old bed and straight a head a small window, it's curtains sheer <br> you... ? ? ", narratorText);
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
        playRoomSound("livingroom");
        if(roomsVisited.livingRoom === false && playerInv.storageRoomKey === false){
            typeWriter("You look around you... you are standing in the living room. <br> just as you step inside you spot an old lady sitting in a rocking chair in the corner. you jump a little as her head quickly snaps in you'r direction <br> she fixes you with a blank but intense stare <br> what do you do...?", narratorText);
            roomsVisited.livingRoom = true;
        } else if (roomsVisited.livingRoom && playerInv.storageRoomKey === false){
            typeWriter("You look around you... you are standing in the living room. <br> The old lady is still sitting in the corner just staring at you... <br> What do you do...?", narratorText)
        }else if (roomsVisited.livingRoom && playerInv.storageRoomKey){
            typeWriter("You now have the key and the giant eye is gone. but as you look at the old lady you notice that she's not just looking somewhere random... <br> she is focusing her eyes on one spot on the fireplace...", narratorText);
            input.innerHTML = "";
            eventTracker.staringFireplace = true;
        }
        const things = ["approach lady","Inspect Fireplace","Inspect entrance"];
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
        typeWriter("You look around you... you are standing the kitchen. <br> it's a simple kitchen.. the monsterous plant's roots are everywhere. <br> a big flower with a big eye sits on one of the vines...", narratorText)
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
        typeWriter("You look around you... you are standing in a storage room, the shelves dusty and empty except for a few things <br> What do you do ?", narratorText)
        input.innerHTML = ""; // clears input field
        input.appendChild(createButton("Go back", () => goBack()));
        input.appendChild(createButton("Inspect shelves", () => inspect("shelves")));
    } else if (currentRoom === room[6]){ //Outside
        typeWriter("as you exit the cabin you are suddenly ambushed by the monster. <br> You enter into a vicious battle with the plant monster. <br> you ?", narratorText)
        const things = ["Rock","Paper", "Scissor"];
        input.innerHTML = ""; // clears input field
        
        things.forEach(function (thing){
            
            const button = document.createElement("button");
            button.textContent = `${thing}`;
            button.addEventListener("click", function(){
                RockPaperScissor(thing);
            });
            input.appendChild(button); //inserts buttons into "parent" Input div
        });
    }else {
        console.log("ERROR: lookAround function did not work as intended")
    }
};

// function to create buttons.
function createButton(text, onClick){ 
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.classList.add("choiceButton");
    btn.addEventListener("click", onClick);
    return btn;
};

//makes it so player can inspect and interact with objects etc.
function inspect(focus){
    if(currentRoom === room[0]){ //Bathroom
        if(focus === "door"){
            image("door");
            if(playerInv.bathroomKey === false && eventTracker.bathroomDoorLocked){
                typeWriter("You approach the door and try the handle, it's locked", narratorText);
                input.innerHTML="";
            } else if (playerInv.bathroomKey){
                eventTracker.bathroomDoorLocked = false;
                typeWriter("You approach the door and try the handle, it's locked, you use the key you found to unlock the door. <br> do you go trough ?", narratorText);
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    action("enter")
                    currentRoom = room[1];
                }));
            }else {
                typeWriter("you approach the bathroom door", narratorText);
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
            if (playerInv.bathroomKey){
                typeWriter("you inspect the toilet, there is nothing here.", narratorText);
                input.innerHTML = '';
                input.appendChild(createButton("Go back", () => goBack("inspect"))); //Calling createButton function and gives it parameters to specify it.

            }else{
                typeWriter("you inspect the toilet, a shiny object hanging in the side catches your attention, as you inspect further you realize it's a key.", narratorText);
                input.innerHTML = '';
                input.appendChild(createButton("Take key", () => action("takeKey")));
                input.appendChild(createButton("Go back", () => goBack("inspect"))); //Calling createButton function and gives it parameters to specify it.
            }
        } else if (focus === "sink cabinet"){
            if(playerInv.sprayBottle){
                typeWriter("you inspect the sink cabinet, there is nothing here.",narratorText);
                input.innerHTML = '';
                input.appendChild(createButton("Go back", () => goBack("inspect"))); //Calling createButton function and gives it parameters to specify it.
            }else{
                typeWriter("you inspect the sink cabinet... <br> you find an empty spray bottle", narratorText);
                input.innerHTML = '';
                input.appendChild(createButton("Take bottle", () => action("takeSprayBottle")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
        }
    }else if (currentRoom === room[1]){ //Hallway
        if(focus === "firstDoor" || focus === "bedroom"){
            image("door");
            if (inspected.bedroomDoor === false){
                    inspected.bedroomDoor = true;
                    typeWriter("You approach the door, as you inspect it further you see the word ..Bedroom.. written on it. <br> do you enter ?", narratorText);
                    input.innerHTML = "";
                    
                } else if(inspected.bedroomDoor){
                    typeWriter("You approach the bedroomDoor <br> do you enter ?", narratorText);
                    input.innerHTML = "";
                }
                input.appendChild(createButton("Enter", () => {
                        roomMemory.push(currentRoom);
                        currentRoom = room[2];
                        action("enter")
                    }));
                input.appendChild(createButton("Go back", () => goBack("inspect")));

            }else if (focus === "secondDoor" || focus === "storageRoom"){
                image("door");
                if (inspected.storageroomDoor === false){
                    inspected.storageroomDoor = true;
                    typeWriter("You approach the door, as you inspect it further you see the word ..storage.. written on it. <br> do you enter ?", narratorText);
                    input.innerHTML = "";
                } else if (inspected.storageroomDoor){
                    typeWriter("You approach the storage room Door <br> do you enter ?", narratorText);
                    input.innerHTML = "";
                    
                }
                input.appendChild(createButton("Enter", () => {
                        if(playerInv.storageRoomKey === false){
                            typeWriter("As you try the handle you realize the door is locked.", narratorText);
                            input.innerHTML = "";
                            input.appendChild(createButton("Go back", () => goBack("inspect")));
                        }
                        if(playerInv.storageRoomKey){
                            roomMemory.push(currentRoom);
                            currentRoom = room[5];
                            action("enter") 
                        }
                    }));
                input.appendChild(createButton("Go back", () => goBack("inspect")));

            }else if (focus === "downHallway"){
                image("downHallway");
                typeWriter("You make your way to the end of the hallway. what you see is a living room and a kitchen adjacent to each other <br> where do you go ?", narratorText);
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
                typeWriter("You approach the bathroom door", narratorText);
                input.innerHTML = "";
                input.appendChild(createButton("Enter", () => {
                    roomMemory.push(currentRoom);
                    currentRoom = room[0];
                    action("enter")
                }));
            }

    }else if (currentRoom === room[2]){ // Bedroom
        if(focus === "oldCloset"){
            image("oldCloset");
            if(playerInv.safeCode === false){
                typeWriter("You approach the old closet, you open the door and find a safe. it's secrets safely locked away <br> you need a combination to open the safe", narratorText);
                input.innerHTML = "";
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            } else{
                typeWriter("You approach the old closet, you open the door and find a safe. it's secrets safely locked away <br> lucky for you, you have the code <br> what do you do..?", narratorText);
                input.innerHTML = "";
                input.appendChild(createButton("Open it", () => action("open")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
            
        }else if(focus === "oldBed"){
            image("oldBed");
            if (playerInv.ingredient2 === false){
                typeWriter("you walk towards the old bed. it's vacancy apparent by the thick layer of dust covering it like a blanket. <br> something under the bed catches you'r eye, it's a bottle labeled `Ingredient 2` <br> You take it. " , narratorText);
                playerInv.ingredient2 = true;
                input.innerHTML = "";
            }else if (playerInv.ingredient2){
                typeWriter("you walk towards the old bed. it's vacancy apparent by the thick layer of dust covering it like a blanket. <br> there is nothing more to see here. ", narratorText);
                input.innerHTML = "";
            }
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }else if(focus === "window"){
            image("window");
            typeWriter("You approach the window. you can see trough the sheer curtains that it's boarded up from outside <br> from what little you can see trough the cracks you can make out that you are in a what seems to be a forrest. <br> the dim orange glow giving away the time of day.", narratorText);
            input.innerHTML = "";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    }else if (currentRoom === room[3]){ // LivingRoom
        if(focus === "approach lady"){
            if(eventTracker.spatulaInEye === false){
                typeWriter("as you approach the old lady her eyes follow your every move... <br> you...?", narratorText);
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
            } else if (eventTracker.spatulaInEye && playerInv.storageRoomKey === false){
                typeWriter("The old lady looks from you to where the giant plant eye was before. she starts to cackle hysterically <br> then she starts to cough loudly and spits out a key <br> you are shocked but you slowly pick up the key from the floor <br> as you do the old lady abruptly stops to laugh and looks away", narratorText);
                input.innerHTML = ""
                playerInv.storageRoomKey = true;
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
            
        }else if(focus === "Inspect Fireplace"){
            if(eventTracker.staringFireplace === false){
                typeWriter("You approach the fireplace inspecting it. the quiet crackling of embers quiet you'r mind. <br> there is nothing more to do here.", narratorText);
                input.innerHTML ="";
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }else{
                typeWriter("You look at where the old lady is staring. you realize that she is staring at one of the bricks on the fireplace <br> it is slightly askew. you go up to it and realize that it is loose <br> as you pull it out you find a small note tucked behind. <br> it's the safe code!", narratorText);
                input.innerHTML ="";
                playerInv.safeCode = true
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
        } else if (focus === "Inspect entrance"){
            
            if (eventTracker.weedKillerUsed === false){
                typeWriter("You approach the what looks to be the exit door... huge vines covers the door stopping you from leaving. <br> What do you do ?", narratorText);
                input.innerHTML ="";
                input.appendChild(createButton("Try and remove the vines", () => action("vineRemover")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
                
            }else if (eventTracker.weedKillerUsed){
                typeWriter("You approach the what exit door... huge vines covers that once blocked the door is gone <br> What do you do ?", narratorText);
                input.innerHTML ="";
                input.appendChild(createButton("Exit", () => action("Exit")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
                console.log("exit cabin funker")
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
            if(playerInv.salt === false){
                things.push("salt")
            }
            if(playerInv.pepper === false){
                things.push("pepper")
            }
            if(playerInv.spatula === false){
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
                playerInv.salt &&
                playerInv.pepper &&
                playerInv.spatula
            ){
                typeWriter("you start rummage trough each cupboard. you have already grabbed each item here:  ", narratorText);
            } else{
                typeWriter("you start rummage trough each cupboard. you find a few items:...  ", narratorText);
            }

        }else if(focus === "Inspect Sink"){
            if(playerInv.sprayBottle && playerInv.ingredient1 && playerInv.ingredient2 && playerInv.recipe){
                typeWriter("You now have all the items listed on the recipe you found got from the safe, do you wish to combine them ?", narratorText);
                input.innerHTML = ""; // clears input field
                input.appendChild(createButton("Combine", () => action("combine")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }else {
                typeWriter("You look at the sink. when you try the faucet nothing happens. there is no water, <br> a black sludge like substance is coating the bottom of the sink... <br> there is nothing to do here...", narratorText);
                input.innerHTML = ""; // clears input field
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
            
        }else if(focus === "Approach plant"){
            typeWriter("You approach the monsterous eye looking at you from the corner... <br> you...?", narratorText);
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
    }else if (currentRoom === room[5]){ // StorageRoom
        if (focus === "shelves"){
                typeWriter("You take a closer look at the items on the shelves. <br> ", narratorText)
            if(playerInv.ingredient1 === false){
                typeWriter("there is a weird looking bottle with some unknown substance with the label `Ingredient Nr1` written on it <br> Do you take it ? ", narratorText);
                input.appendChild(createButton("Take it", () => action("take")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }else if (playerInv.ingredient1){
                typeWriter("there is nothing more for you to get here <br> ", narratorText)
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
        }
    }else{
        console.log("ERROR: inspect function did not work as intended")
    }
};

//makes it so the player can perform an action with the object in focus.
function action(type, item, button){
    if (currentRoom === room[0]){ //Bathroom logic
        if (type === "takeKey"){
            playerInv.bathroomKey = true;
            narratorText.innerHTML = "You take the key";
            input.innerHTML ="";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        } else if (type === "enter") {
            doorSound.play();
            typeWriter("You go through the door",narratorText);
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        } else if (type === "takeSprayBottle"){
            Inv.push("SprayBottle");
            playerInv.sprayBottle = true;
            typeWriter("You take the spray bottle", narratorText);
            input.innerHTML ="";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    } else if (currentRoom === room[1]){//hallway action
        typeWriter("You go through the door", narratorText);
        doorSound.play();
        input.innerHTML = "";
        input.appendChild(createButton("look around", () => lookAround()));
        input.appendChild(createButton("Go back", () => goBack()));
    } else if (currentRoom === room[2]){//bedroom action
        if (type === "enter"){
            typeWriter("You go through the door",narratorText);
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        } else if (type === "open"){
            typeWriter("you open the safe, inside you find some old documents. <br> one paper in particular catches you'r interest. as you inspect it further you realize it's a recipe for weed killer. <br> you take it with you...", narratorText);
            playerInv.recipe = true;
            input.innerHTML = "";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
            
        }   
    } else if (currentRoom === room[3]){//livingRoom action
        if (type === "enter"){
            typeWriter("You step into the livingRoom", narratorText);
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }else if(type === "Speak"){
            typeWriter("You say hello to the old lady but she only keeps staring at you", narratorText);
        }else if(type === "Stare even more back"){
            typeWriter("You stare back at the old lady as if having a staring contest. some time passes before you feel you'r eyes start to sting making you close them. <br> the old lady makes no sound or movement still staring intensely", narratorText);
        }else if(type === "Make a silly face"){
            typeWriter("You take a deep breath before contorting your face into every funny and silly expression you can manage hoping to get a reaction <br> the old lady makes no sound or movement still staring intensely <br> you feel you'r cheeks warm up as embarrassment fills you ", narratorText);
        }else if (type === "vineRemover"){
            if(playerInv.weedKiller === false){
                typeWriter("You try and pry the vines away from the door, it's useless", narratorText);
                input.innerHTML = "";
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            } else if (playerInv.weedKiller){
                eventTracker.weedKillerUsed = true;
                typeWriter("You use the weedkiller you made earlier and spray it on the vines. you hear the monster shriek before the vines retract away from the door <br> What's ur next move ?", narratorText);
                input.innerHTML = "";
                input.appendChild(createButton("Exit cabin", () => action("Exit")));
                input.appendChild(createButton("Go back", () => goBack("inspect")));
            }
        }else if (type === "Exit"){
            doorSound.play();
            typeWriter("You exit the cabin", narratorText);
            input.innerHTML = "";
            roomMemory.push(currentRoom);
            currentRoom = room[6];
            input.appendChild(createButton("look around", () => lookAround()));
        }
    } else if (currentRoom === room[4]){//Kitchen action
        if (type === "enter"){
            typeWriter("You step into the Kitchen", narratorText);
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        }else if(type === "grab"){
            if (!Inv.includes(item)){
                Inv.push(item);
                playerInv[item] = true;
            }
            
            if (button){
                button.remove();
            }

            typeWriter(` <br> You picked up ${item}`, narratorText);
        }else if(type === "use"){
            if(item === "salt"){
                typeWriter("you throw salt at the monster plants eye <br> you hear a loud roar as the eye closes shut and start to water. the vines quiver slightly", narratorText);
                monsterHealth -= 1;
                Inv = Inv.filter(i => i !== item);
                healthTracker();
            }else if(item === "pepper"){
                typeWriter("you decide to throw pepper at it, but as you do it back fires and you get a sneezing fit...", narratorText);
                playerHealth -= 1;
                Inv = Inv.filter(i => i !== item);
                healthTracker();
            }else if(item === "spatula"){
                typeWriter("you pull out the spatula from your bag, wielding it like a weapon you charge at the plant poking it as hard as you can in the eye <br> the monster shrieks in response and retreats", narratorText);
                monsterHealth -= 1;
                eventTracker.spatulaInEye = true;
                Inv = Inv.filter(i => i !== item);
                healthTracker();
            }
            if (button){
                button.remove();
            }
        }else if (type === "combine"){
            typeWriter("you combine the item's as instructed at the sink", narratorText);
            playerInv.weedKiller = true;
            input.innerHTML ="";
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    } else if ( currentRoom === room[5]){//storageRoom action
        if (type === "enter"){
            typeWriter("You enter the storageroom", narratorText);
            input.innerHTML = "";
            input.appendChild(createButton("look around", () => lookAround()));
            input.appendChild(createButton("Go back", () => goBack()));
        } else if (type === "take"){
            typeWriter("You take the weird bottle", narratorText);
            playerInv.ingredient1 = true;
            input.appendChild(createButton("Go back", () => goBack("inspect")));
        }
    }
    else {
        console.log("ERROR: action function did not work as intended")
    }
};

// removes previous room from memory array and puts it as current room. unless you are inspecting something.
function goBack(focus){ 
    if (focus === "inspect"){
        typeWriter("You go back", narratorText);
        input.innerHTML = "";
        input.appendChild(createButton("look around", () => lookAround()));
    } else {
    input.innerHTML = "";
    let x = roomMemory.pop();
    currentRoom = x;
    typeWriter("You go back", narratorText);
    input.appendChild(createButton("look around", () => lookAround()));
    }
};

// gives player ending screen type based on choices etc
function theEnd(type){
    const ending = document.getElementById("endText");
    if (type === "sleep"){
        ending.innerHTML = "You went to sleep and died...";
    }
};

// gives player winner screen.
function winnerDinner(type){

};

function RockPaperScissor(thing){
    const box = ["Rock","Paper","Scissor"];
    let number = Math.floor(Math.random() * 3);
    let computerChoose = box[number];
    let playerChoose = thing

    if(playerChoose === "Rock" && computerChoose === "Paper"){
        typeWriter("You loose", narratorText);
        playerHealth -= playerHealth * 0.10
        console.log("You lose");
        healthTracker();
    } 
    else if(playerChoose === "Scissor" && computerChoose === "Rock"){
        typeWriter("You loose", narratorText);
        playerHealth -= playerHealth * 0.10
        console.log("You lose");
        healthTracker();
    }
    else if(playerChoose === "Paper" && computerChoose === "Scissor"){
        typeWriter("You loose", narratorText);
        playerHealth -= playerHealth * 0.10
        console.log("You lose");
        healthTracker();
    }
    else if(playerChoose === computerChoose){
        typeWriter("You draw", narratorText);
        console.log("Draw");
        healthTracker();
    }
    else{
        typeWriter("You win!", narratorText);
        monsterHealth -= monsterHealth * 0.10
        console.log("You win");
        healthTracker();
    }
};

// Changes game image based on location etc
function image(focus){
    console.log("image() running", currentRoom);
    if (currentRoom === room[0]){ //Bathroom
        imageLink.src = "img/Bathroom.png";
        if(focus === "toilet"){
            imageLink.src = "img/ToiletKey.png";
        }
    }else if (currentRoom === room[1]){ //Hallway
        imageLink.src = "img/Hallway.png";
        if (focus === "downHallway"){
            imageLink.src = "img/Hallway.png";
        }
    }else if (currentRoom === room[2]){ //Bedroom
        imageLink.src = "img/BedRoom.png";
        if (focus === "oldCloset"){
            imageLink.src = "img/OldCloset.png";
        }else if (focus === "oldBed"){
            imageLink.src = "img/Bed.png";
        }else if (focus === "window"){
            imageLink.src = "img/BedroomWindow.png";
        }
    }else if (currentRoom === room[3]){ //Living room
        imageLink.src = "img/LivingRoomLady.png";
        
    }else if (currentRoom === room[4]){ //Kitchen
        if (eventTracker.spatulaInEye){
            imageLink.src = "img/kitchenPlantEyeGone.png";
        }else {
            imageLink.src = "img/Kitchen.png";
        }
    }else if (currentRoom === room[5]){ //Storage
        imageLink.src = "img/StorageRoom.png";
    }else if (currentRoom === room[6]){ //Outside
        imageLink.src = "img/StorageRoom.png";
    }else if (focus === "door"){
            imageLink.src = "img/InspectDoor.png";
    }else{
        console.log("Image function did not work as intended...");
    }
};

