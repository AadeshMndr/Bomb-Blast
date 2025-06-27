function drawInstructions(){
    ctx.font = "30px Arial";

    ctx.fillStyle = canvas.colour;
    textColour = "No";              //just for humour

    if (!disappear && player.length != 1)
    {
        // Clear the instruction area first to prevent text overlap
        ctx.fillStyle = canvas.colour;
        ctx.fillRect(0, 40, canvas.width, 40);
        
        // Determine current player's color for normal turns
        player.forEach((p) => {
            if (p.n == turnNumber)
            textColour = p.colour;
        });
        
        // Get current game state and show appropriate instruction
        let instructionText = getContextualInstruction();
        
        // Set text color based on context
        if (undecided) {
            // When someone is hit, use the hit player's color
            player.forEach((p) => {
                if (p.underDecision) {
                    ctx.fillStyle = p.colour;
                }
            });
            // Clear any existing timer and keep instructions visible during decision
            if (instructionLoop != 0) {
                clearTimeout(instructionLoop);
                instructionLoop = 0;
            }
            disappear = false;
        } else {
            // Normal game state
            ctx.fillStyle = textColour;
            
            // Only set timer for normal instructions, not for critical game states
            let currentPlayer = null;
            player.forEach((p) => {
                if (p.n == turnNumber) {
                    currentPlayer = p;
                }
            });
            
            // Don't auto-hide instructions when player has bomb and hasn't selected aim
            let shouldAutoHide = !(currentPlayer && currentPlayer.hasBomb && attackSpot === "NC");
            
            if (instructionLoop == 0 && shouldAutoHide) {
                instructionLoop = setTimeout(() => {disappear = true}, delayTime);
            }
        }
        
        // Display the instruction text
        if (instructionText) {
            ctx.fillText(instructionText, getTextXPosition(instructionText), 70);
        }
    }
}

function getContextualInstruction() {
    // Check if someone is currently under decision (got hit)
    if (undecided) {
        let hitPlayer = null;
        player.forEach((p) => {
            if (p.underDecision) {
                hitPlayer = p;
            }
        });
        
        if (hitPlayer) {
            // Show the selected catching locations
            if (defendSpot.length === 0) {
                return `${hitPlayer.colour} Player: Select Catching Locations (1-8)`;
            } else {
                // Get the most recent 3 selections (or all if less than 3)
                let recentSelections = defendSpot.slice(-trys);
                let selectionsText = recentSelections.join(", ");
                
                if (defendSpot.length >= trys) {
                    return `${hitPlayer.colour} Player: Selected [${selectionsText}] - Press Enter`;
                } else {
                    return `${hitPlayer.colour} Player: Selected [${selectionsText}] - Continue Selecting`;
                }
            }
        }
    }
    
    // Check current player's state
    let currentPlayer = null;
    player.forEach((p) => {
        if (p.n == turnNumber) {
            currentPlayer = p;
        }
    });
    
    if (currentPlayer) {
        // If player has the bomb
        if (currentPlayer.hasBomb) {
            if (attackSpot === "NC") {
                return `${currentPlayer.colour} Player: Select Aiming Location (1-8)`;
            } else {
                return `${currentPlayer.colour} Player: Aim and Throw (Use WASD + Space)`;
            }
        } else {
            // Normal turn without bomb
            return `${currentPlayer.colour} Player's Turn`;
        }
    }
    
    return `${textColour} Player's Turn`;
}

function getTextXPosition(text) {
    // Calculate text width to center it properly
    ctx.font = "30px Arial";
    let textWidth = ctx.measureText(text).width;
    return (canvas.width - textWidth) / 2;
}

function finalDisplay(){
    ctx.font = "100px Arial";
    ctx.fillStyle = player[0].colour;
    let text = `Winner : ${player[0].colour} player!`.toUpperCase();
    
    if (player[0].colour == "Yellow")
    ctx.fillText(text, 15, 190);
    else
    ctx.fillText(text, 105, 190);
}