//declare global variables
var canvas;
var ctx;

//character variables
var player = [];
var playerNumber;
var attackSpot = "NC";
var defendSpot = [];
var trys = 3;
var notStarted;
var choosen;

//game variables
var gameLoop;
var fps = 30;
var globalMaxMovingPower = 100;
var globalFriction = 1.4;     //will manage later if we add in things like stamina and mass
var border = [];
var gameObject = [];
var changeTurn = true;
var turnNumber;
var bomb;
var undecided = false;
var memory;
var unintentionallyDestroyedBorder = undefined;
var duoMode = false;

//controller variables
var keyUp = false;
var keyDown = false;
var keyLeft = false;
var keyRight = false;
var charge = false;


//instructions and display variables
var instructionLoop = 0;
var textColour;
var disappear;
var infoShown = false;
var delayTime = 5000;    //to determine after how much time does the text disappear.   //1000 means 1000 milliseconds so 1 second.

function gameStart(){

    //setting the canvas
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 22;
    canvas.colour = "grey";

    //setting the characters
    createCharacters();

    //storing all the gameObjects and finding some data
    storeGameObjects();

    //setting the controller
    setController();

    gameLoop = setInterval(engine, 1000/fps);
}

