function engine(){

    //error correction
    if (!player.some((p) => p.n == turnNumber) && !changeTurn)
    {
        changeTurn = true;
    }

    //assigning turns
    while (changeTurn)
    {
        //actual turn changer
        if (turnNumber == undefined)
        turnNumber = 1;
        else if (turnNumber == playerNumber)
        turnNumber = 1;
        else if (turnNumber < playerNumber)
        turnNumber++;

        //checks if each turn change is valid and does respective things
        player.forEach((p) => {
            if (p.n == turnNumber)
            {
                if (p.alive)
                {
                    p.active = true;
                    changeTurn = false;
                    if (!undecided)
                    {
                        choosen = false;
                    }
                    disappear = false;
                    clearTimeout(instructionLoop);
                    instructionLoop = 0;
                }
            }
        });


        //removing any errors
        if (!undecided)
        {
            player.forEach((p) => p.underDecision = false);
        }
    }    
    
    //updating the player
    player.forEach((p) => p.update());

    //update the bomb
    bomb.update();
    
    //actually drawing the things
    draw();
}

function draw(){
    //drawing the canvas
    ctx.fillStyle = canvas.colour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (undecided)
    {
        ctx.font = "80px Arial";
        ctx.fillStyle = bomb.colour;
        ctx.fillText("HIT", 600, 620);
    }

    //drawing the walls
    border.forEach((p) => p.draw());

    //decorations or rather instructions
    drawInstructions();

    //drawing the player
    player.forEach((p) => p.draw());

    //drawing the bomb
    bomb.draw();

    //checking for winner and final message
    if (player.length == 1 && !duoMode)
    {
        finalDisplay();
    }
    else if (duoMode && player.length <= 2)
    {
        let finalColour = player[0].colour;
        if (player.every((p) => p.colour == finalColour))
        finalDisplay();
    }
}


//Some custom Maths functions
function velocityCalculator(obj, receiver){
    if (obj.pointerX == 0)
    {
        receiver.yvel = obj.power;
        receiver.xvel = 0;
    }
    else if (obj.pointerY == 0)
    {
        receiver.xvel = obj.power;
        receiver.yvel = 0;
    }
    else
    {
        let k = obj.pointerY / obj.pointerX;
        receiver.yvel = Math.sqrt( (Math.pow(obj.power, 2) * Math.pow(k, 2)) / (1 + Math.pow(k, 2)) );
        receiver.xvel = receiver.yvel / k;
    }

    if (Math.sign(obj.pointerX) != Math.sign(receiver.xvel))
    receiver.xvel *= -1;
    if (Math.sign(obj.pointerY) != Math.sign(receiver.yvel))
    receiver.yvel *= -1;

    if (receiver.n != obj.n)
    {
        receiver.xvel *= 2;
        receiver.yvel *= 2;
    }
}

