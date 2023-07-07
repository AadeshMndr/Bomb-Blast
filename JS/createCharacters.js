function createCharacters(){
    //creating the players
    for (let i = 1; i <= playerNumber; i++)               
    {
        if (i == 1)
        player.push(new Player(80, 77, 25, 25, i));
        else if (i == 2)
        player.push(new Player(1250, 580, 25, 25, i));
        else if (i == 3)
        player.push(new Player(1250, 77, 25, 25, i));
        else if (i == 4)
        player.push(new Player(80, 580, 25, 25, i));
    }                                                   

    //create the bomb
    bomb = new Bomb(650, 320, 10, 10, 0); //add an id later if needed

    //map building
    buildMap();
}

function buildMap(){

    //edges of the map

    //left and right border
    border.push(new Border(-10, -10, 20, 700, -1));     //the borders that won't get removed have 
    border.push(new Border(1335, -10, 20, 700, -2));    // - ID number (n). (negative ID number)
    //top and bottom
    border.push(new Border(0, -10, 1345, 20, -3));
    border.push(new Border(0, 665, 1345, 20, -4));

    //the ones around the bomb
    border.push(new Border(470, 200, 20, 80, playerNumber + 1));
    border.push(new Border(490, 200, 60, 20, playerNumber + 2));
    border.push(new Border(755, 200, 80, 20, playerNumber + 3));
    border.push(new Border(815, 220, 20, 60, playerNumber + 4));
    border.push(new Border(470, 360, 20, 80, playerNumber + 5));
    border.push(new Border(490, 420, 60, 20, playerNumber + 6));
    border.push(new Border(815, 360, 20, 80, playerNumber + 7));
    border.push(new Border(755, 420, 60, 20, playerNumber + 8));

    //ones in the middle
    border.push(new Border(1065, 220, 20, 200, playerNumber + 9));
    border.push(new Border(240, 220, 20, 200, playerNumber + 10));
    border.push(new Border(490, 105, 325, 20, playerNumber + 11));
    border.push(new Border(490, 515, 325, 20, playerNumber + 12));

    //ones around the players

    //around red (player 1)
    border.push(new Border(60, 155, 115, 20, playerNumber + 13));
    border.push(new Border(155, 60, 20, 95, playerNumber + 14));
    //around green (player 3)
    border.push(new Border(1170, 60, 20, 115, playerNumber + 15));
    border.push(new Border(1190, 155, 95, 20, playerNumber + 16));
    //around yellow (player 4)
    border.push(new Border(60, 500, 95, 20, playerNumber + 17));
    border.push(new Border(155, 500, 20, 115, playerNumber + 18));
    //around blue (player 2)
    border.push(new Border(1170, 500, 115, 20, playerNumber + 19));
    border.push(new Border(1170, 520, 20, 95, playerNumber + 20));
    
}

function storeGameObjects(){

    //storing the players
    player.forEach((obj) => {gameObject.push(obj)});
}
