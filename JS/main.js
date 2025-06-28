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
    
    // Set canvas dimensions to use most of the viewport
    canvas.width = window.innerWidth - 40; // Account for margins
    canvas.height = window.innerHeight - 40; // Account for margins
    canvas.colour = "grey";
    
    // Ensure canvas fits in game content container if it exists
    const gameContent = document.querySelector('.game-content');
    if (gameContent && !gameContent.contains(canvas)) {
        gameContent.appendChild(canvas);
    }

    //setting the characters
    createCharacters();

    //storing all the gameObjects and finding some data
    storeGameObjects();

    //setting the controller
    setController();

    // Add window resize handler to maintain consistent gameplay
    window.addEventListener('resize', handleWindowResize);

    gameLoop = setInterval(engine, 1000/fps);
}

function handleWindowResize() {
    // Prevent resize during active gameplay to maintain fairness
    if (!changeTurn && gameLoop) {
        return; // Don't resize during a player's turn
    }
    
    const newWidth = window.innerWidth - 40;
    const newHeight = window.innerHeight - 40;
    
    // Only resize if the change is significant (more than 50px)
    if (Math.abs(canvas.width - newWidth) > 50 || Math.abs(canvas.height - newHeight) > 50) {
        // Calculate ratios before changing canvas dimensions
        const widthRatio = newWidth / canvas.width;
        const heightRatio = newHeight / canvas.height;
        
        // Update canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Clear and rebuild borders with new dimensions
        border = [];
        buildMap();
        
        // Update player positions proportionally
        player.forEach(p => {
            p.x = p.x * widthRatio;
            p.y = p.y * heightRatio;
        });
        
        // Update bomb position
        bomb.x = bomb.x * widthRatio;
        bomb.y = bomb.y * heightRatio;
    }
}

