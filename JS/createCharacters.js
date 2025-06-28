function createCharacters(){
    // Get canvas dimensions for responsive positioning
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate player size relative to screen (minimum 20px, scales with screen)
    const playerSize = Math.max(canvasWidth * 0.018, 20);
    
    //creating the players with responsive positions
    for (let i = 1; i <= playerNumber; i++)               
    {
        if (i == 1) // Top left
            player.push(new Player(canvasWidth * 0.06, canvasHeight * 0.12, playerSize, playerSize, i));
        else if (i == 2) // Bottom right
            player.push(new Player(canvasWidth * 0.93, canvasHeight * 0.88, playerSize, playerSize, i));
        else if (i == 3) // Top right
            player.push(new Player(canvasWidth * 0.93, canvasHeight * 0.12, playerSize, playerSize, i));
        else if (i == 4) // Bottom left
            player.push(new Player(canvasWidth * 0.06, canvasHeight * 0.88, playerSize, playerSize, i));
    }                                                   

    //create the bomb (centered)
    const bombSize = Math.max(canvasWidth * 0.008, 8);
    bomb = new Bomb(canvasWidth * 0.5, canvasHeight * 0.5, bombSize, bombSize, 0);

    //map building
    buildMap();
}

function buildMap(){
    // Get canvas dimensions for responsive positioning
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate relative positions as percentages of canvas size
    const borderThickness = Math.max(canvasWidth * 0.015, 15); // Minimum 15px, scales with width
    
    //edges of the map
    
    //left and right border
    border.push(new Border(-borderThickness, -borderThickness, borderThickness, canvasHeight + (2 * borderThickness), -1));     // Left border
    border.push(new Border(canvasWidth, -borderThickness, borderThickness, canvasHeight + (2 * borderThickness), -2));    // Right border
    //top and bottom
    border.push(new Border(-borderThickness, -borderThickness, canvasWidth + (2 * borderThickness), borderThickness, -3)); // Top border
    border.push(new Border(-borderThickness, canvasHeight, canvasWidth + (2 * borderThickness), borderThickness, -4)); // Bottom border

    // Calculate center positions
    const centerX = canvasWidth * 0.5;
    const centerY = canvasHeight * 0.5;
    
    // Bomb area dimensions (scaled to screen)
    const bombAreaWidth = canvasWidth * 0.25; // 25% of screen width
    const bombAreaHeight = canvasHeight * 0.2; // 20% of screen height
    const wallThickness = Math.max(canvasWidth * 0.015, 15);
    
    //the ones around the bomb (centered around bomb position)
    const bombLeft = centerX - bombAreaWidth * 0.5;
    const bombRight = centerX + bombAreaWidth * 0.5;
    const bombTop = centerY - bombAreaHeight * 0.5;
    const bombBottom = centerY + bombAreaHeight * 0.5;
    
    // Left side walls around bomb
    border.push(new Border(bombLeft - wallThickness, bombTop, wallThickness, bombAreaHeight * 0.4, playerNumber + 1));
    border.push(new Border(bombLeft, bombTop, bombAreaWidth * 0.2, wallThickness, playerNumber + 2));
    // Right side walls around bomb
    border.push(new Border(bombRight, bombTop, bombAreaWidth * 0.25, wallThickness, playerNumber + 3));
    border.push(new Border(bombRight + bombAreaWidth * 0.2, bombTop + wallThickness, wallThickness, bombAreaHeight * 0.3, playerNumber + 4));
    // Bottom walls around bomb
    border.push(new Border(bombLeft - wallThickness, bombBottom - bombAreaHeight * 0.4, wallThickness, bombAreaHeight * 0.4, playerNumber + 5));
    border.push(new Border(bombLeft, bombBottom, bombAreaWidth * 0.2, wallThickness, playerNumber + 6));
    border.push(new Border(bombRight + bombAreaWidth * 0.2, bombBottom - bombAreaHeight * 0.4, wallThickness, bombAreaHeight * 0.4, playerNumber + 7));
    border.push(new Border(bombRight, bombBottom, bombAreaWidth * 0.2, wallThickness, playerNumber + 8));

    //ones in the middle (major structural walls)
    const middleWallLength = canvasHeight * 0.3;
    const middleWallY = centerY - middleWallLength * 0.5;
    
    border.push(new Border(canvasWidth * 0.8, middleWallY, wallThickness, middleWallLength, playerNumber + 9)); // Right middle wall
    border.push(new Border(canvasWidth * 0.18, middleWallY, wallThickness, middleWallLength, playerNumber + 10)); // Left middle wall
    border.push(new Border(canvasWidth * 0.36, canvasHeight * 0.16, canvasWidth * 0.24, wallThickness, playerNumber + 11)); // Top horizontal wall
    border.push(new Border(canvasWidth * 0.36, canvasHeight * 0.8, canvasWidth * 0.24, wallThickness, playerNumber + 12)); // Bottom horizontal wall

    //ones around the players
    
    //around red (player 1) - top left
    const player1X = canvasWidth * 0.06;
    const player1Y = canvasHeight * 0.12;
    const player1WallHeight = canvasHeight * 0.15;
    const player1WallWidth = canvasWidth * 0.085;
    border.push(new Border(player1X, player1Y + player1WallHeight, player1WallWidth, wallThickness, playerNumber + 13));
    border.push(new Border(player1X + canvasWidth * 0.07, player1Y, wallThickness, player1WallHeight, playerNumber + 14));
    
    //around green (player 3) - top right
    const player3X = canvasWidth * 0.87;
    const player3Y = canvasHeight * 0.12; // Make consistent with player1Y
    const player3WallHeight = canvasHeight * 0.15; // Make consistent with player1WallHeight
    const player3WallWidth = canvasWidth * 0.085; // Make consistent with player1WallWidth
    border.push(new Border(player3X, player3Y, wallThickness, player3WallHeight, playerNumber + 15));
    border.push(new Border(player3X + wallThickness, player3Y + player3WallHeight, player3WallWidth, wallThickness, playerNumber + 16));
    
    //around yellow (player 4) - bottom left
    const player4X = canvasWidth * 0.045;
    const player4Y = canvasHeight * 0.77;
    border.push(new Border(player4X, player4Y, canvasWidth * 0.07, wallThickness, playerNumber + 17));
    border.push(new Border(player4X + canvasWidth * 0.07, player4Y, wallThickness, canvasHeight * 0.18, playerNumber + 18));
    
    //around blue (player 2) - bottom right
    const player2X = canvasWidth * 0.87;
    const player2Y = canvasHeight * 0.77;
    border.push(new Border(player2X, player2Y, canvasWidth * 0.085, wallThickness, playerNumber + 19));
    border.push(new Border(player2X, player2Y + wallThickness, wallThickness, canvasHeight * 0.15, playerNumber + 20));
    
}

function storeGameObjects(){

    //storing the players
    player.forEach((obj) => {gameObject.push(obj)});
}
