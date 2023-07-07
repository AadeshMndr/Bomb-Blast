function drawInstructions(){
    ctx.font = "30px Arial";

    ctx.fillStyle = canvas.colour;
    textColour = "No";              //just for humour

    if (!disappear && player.length != 1)
    {
        player.forEach((p) => {
            if (p.n == turnNumber)
            textColour = p.colour;
        });
        ctx.fillStyle = textColour;
        
        if (instructionLoop == 0)
        instructionLoop = setTimeout(() => {disappear = true}, delayTime);
    }
    ctx.fillText(`${textColour} Player's Turn`, 523, 70);
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