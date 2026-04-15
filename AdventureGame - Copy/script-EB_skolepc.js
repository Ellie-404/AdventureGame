
let itemList = [];
let playerInventory = ["itemOne","itemTwo"];
let playerHands = [];
const room = ["bathroom", "hallway", "bedroom", "livingroom", "kitchen"];
let playerHealth = 100;
let monsterHealth = 100;
let backpack = 0;
let currentRoom = room[0];
let roomMemory = [];
const narratorText = document.getElementById("narrator");
const image = document.getElementById("imgBox");


const input = document.getElementById("choiceBox");

function lookAround(){
    if (currentRoom === room[0]){
        narratorText.innerHTML = "You look around you... the bathroom is old, there is a door, sink, cabinet, mirror and an old toilet."
        input.innerHTML = '<button onclick = "inspect(\'sink\')">Inspect Sink</button>';
        input.innerHTML += '<button onclick = "inspect(\'toilet\')">Inspect toilet</button>';
        input.innerHTML += '<button onclick = "inspect(\'door\')">Inspect door</button>';
        input.innerHTML += '<button onclick = "inspect(\'cabinet\')">Inspect cabinet</button>';
        input.innerHTML += '<button onclick = "inspect(\'mirror\')">Inspect mirror</button>';
    } else if (currentRoom === room[1]){
        narratorText.innerHTML = "You look around you... you are standing in a hallway. there is a door right in front of you, a door to your left. or you can walk down the hallway into what looks to be the living room"
    } else if (currentRoom === room[2]){
        narratorText.innerHTML = "You look around you... you are standing in a bedroom."
    } else if (currentRoom === room[3]){
        narratorText.innerHTML = "You look around you... you are standing in the living room."
    } else if (currentRoom === room[4]){
        narratorText.innerHTML = "You look around you... you are standing the kitchen."
    } 
};

function inspect(focus){
    if (currentRoom === room[0] && focus === "door"){
        narratorText.innerHTML = "You approach the door and try the handle, it's unlocked. do you go through ?";
        input.innerHTML = '<button onclick = "action(\'open\')">Enter</button>';
        console.log("shuppp");
    }
};

function action(action){
    if (currentRoom === room[0] && action === "open"){
        narratorText.innerHTML = "You go trough the door and end up in what seems to be a hallway";
        input.innerHTML = '<button onclick="lookAround()">Look around</button>';
        input.innerHTML += '<button onclick="goBack()">Go back</button>';
        roomMemory.push(currentRoom);
        currentRoom = room[1];
    }
};

function goBack(){
    let x = roomMemory.pop();
    currentRoom = x;
    narratorText.innerHTML = "You go back";
}