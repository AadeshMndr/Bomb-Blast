function setController(){
    document.addEventListener("keydown", (event) => {
        if (event.key == "a" || event.key == "A" || event.code == "ArrowLeft")
        keyLeft = true;
        if (event.key == "d" || event.key == "D" || event.code == "ArrowRight")
        keyRight = true;
        if (event.key == "w" || event.key == "W" || event.code == "ArrowUp")
        keyUp = true;
        if (event.key == "s" || event.key == "S" || event.code == "ArrowDown")
        keyDown = true;
        if (event.keyCode == 32)
        charge = true;
    });

    document.addEventListener("keyup", (event) => {
        if (event.key == "a" || event.key == "A" || event.code == "ArrowLeft")
        keyLeft = false;
        if (event.key == "d" || event.key == "D" || event.code == "ArrowRight")
        keyRight = false;
        if (event.key == "w" || event.key == "W" || event.code == "ArrowUp")
        keyUp = false;
        if (event.key == "s" || event.key == "S" || event.code == "ArrowDown")
        keyDown = false;
        if (event.keyCode == 32)
        charge = false;
    });


    document.addEventListener("keydown", (event) => {
        //when attacker has the ball
        let canAttack = false;
        player.forEach((p) => {
            if (p.n == turnNumber)
            {
                if (p.hasBomb)
                canAttack = true;
            }
        });
        if (!undecided && canAttack && (event.code == "Numpad8" || event.code == "Numpad5" || event.code == "Numpad2" || event.code == "Numpad4" || event.code == "Numpad1" || event.code == "Numpad6" || event.code == "Numpad3" || event.code == "Digit1" || event.code == "Digit2" || event.code == "Digit3" || event.code == "Digit4" || event.code == "Digit5" || event.code == "Digit6" || event.code == "Digit8"))
        {
            let code;
            if (event.code == "Digit1" || event.code == "Numpad1")
            code = 1;
            else if (event.code == "Digit2" || event.code == "Numpad2")
            code = 2;
            else if (event.code == "Digit3" || event.code == "Numpad3")
            code = 3;
            else if (event.code == "Digit4" || event.code == "Numpad4")
            code = 4;
            else if (event.code == "Digit5" || event.code == "Numpad5")
            code = 5;
            else if (event.code == "Digit6" || event.code == "Numpad6")
            code = 6;
            else if (event.code == "Digit8" || event.code == "Numpad8")
            code = 8;

            attackSpot = code;
        }
        //when the screen is paused and the defender has to choose
        if (undecided && (event.code == "Numpad8" || event.code == "Numpad5" || event.code == "Numpad2" || event.code == "Numpad4" || event.code == "Numpad1" || event.code == "Numpad6" || event.code == "Numpad3" || event.code == "Digit1" || event.code == "Digit2" || event.code == "Digit3" || event.code == "Digit4" || event.code == "Digit5" || event.code == "Digit6" || event.code == "Digit8"))
        {
            let code;
            if (event.code == "Digit1" || event.code == "Numpad1")
            code = 1;
            else if (event.code == "Digit2" || event.code == "Numpad2")
            code = 2;
            else if (event.code == "Digit3" || event.code == "Numpad3")
            code = 3;
            else if (event.code == "Digit4" || event.code == "Numpad4")
            code = 4;
            else if (event.code == "Digit5" || event.code == "Numpad5")
            code = 5;
            else if (event.code == "Digit6" || event.code == "Numpad6")
            code = 6;
            else if (event.code == "Digit8" || event.code == "Numpad8")
            code = 8;
            
            // Allow unlimited selections, will use only the last 3
            defendSpot.push(code);
            
            // Immediately refresh the display to show updated instructions
            draw();
        }
    });
}

document.addEventListener("keydown", (event) =>{
    if (undecided && event.key == "Enter")
    {
        undecided = false;
        memory.target.underDecision = false;

        //see if caught or hit and do the rest once
        // Use only the last 3 selections for catching
        let lastThreeSelections = defendSpot.slice(-trys);
        let caught = lastThreeSelections.some((guess) => guess == attackSpot);

        //upon catching
        if (caught && attackSpot != "NC")
        {
            bomb.onGround = false; 
            memory.target.hasBomb = true;
            memory.thrower.alive = false;
            memory.target.killed.push(memory.thrower);
            memory.thrower.killed.forEach((soul) => {
                soul.alive = true;
                player.push(soul);
            });
            memory.thrower.killed = [];
            bomb.acquiredBy = memory.target.n;

            if (unintentionallyDestroyedBorder != undefined)
            border.push(unintentionallyDestroyedBorder);
            unintentionallyDestroyedBorder = undefined;
        }
        //upon hit
        else if (!caught && attackSpot != "NC")
        {
            bomb.onGround = true;
            memory.target.alive = false;
            memory.thrower.killed.push(memory.target);
            memory.target.killed.forEach((soul) => {
                soul.alive = true;
                player.push(soul);
            });
            memory.target.killed = [];
            unintentionallyDestroyedBorder = undefined;
        }
        else if (attackSpot == "NC")
        {
            bomb.onGround = true;
            bomb.acquiredBy = "None";
        }
       
        defendSpot = [];
        //checking and keeping only the players that are alive
        player = player.filter((p) => p.alive);

        attackSpot = "NC";

        gameLoop = setInterval(engine, 1000 / fps);
    }
});