window.onload = () => {
    notStarted = true;
    //adding controls for help box
    document.addEventListener("keydown", (event) => {
        if (event.key == "Escape" && (!infoShown) )
        {
            information();
        }
        else if (event.key == "Escape" && infoShown)
        {
            document.getElementById("infoBox").remove();
            infoShown = false;
        }
    });

    document.addEventListener("click", (event) => {
       if (infoShown)
       {
            // document.getElementById("infoBox").remove();
            // infoShown = false;
       }
    });

    //some Animations for the starting elements
    let button = document.getElementById("button");
    let info = document.getElementById("info");
    button.addEventListener("mouseover", ()=> {
        button.style.fontSize = "55px";
    });
    button.addEventListener("mouseout", ()=> {
        button.style.fontSize = "50px";
    });
    info.addEventListener("mouseover", ()=> {
        info.style.fontSize = "45px";
    });
    info.addEventListener("mouseout", ()=> {
        info.style.fontSize = "40px";
    });
    document.addEventListener("keydown", (event) => {
        if ((event.code == "Space" || event.code == "Enter") && notStarted)
        {
            notStarted = false;
            
            initiate();
        }
    });   
}

function initiate(){
    notStarted = false;

    //clearing the previous screen
    document.getElementById("title").remove();
    document.getElementById("button").remove();
    document.getElementById("info").remove();

    let  p = [];

    //choosing the game mode
    for (let i = 0; i < 3; i++)
    {
        //creation of no of players options chooser
        p[i] = document.createElement("div");
        document.body.appendChild(p[i]);
        p[i].id = `p${i+2}`;
        p[i].innerHTML = `${i+2}P`;

        //a bit of animation for it.
        p[i].addEventListener("mouseover", () => {
            p[i].style.fontSize = "220px";
        });
        p[i].addEventListener("mouseout", () => {
            p[i].style.fontSize = "200px";
        });


        //checker to see what the user has clicked
        p[i].addEventListener("click", () => {
            secondInitiation(p[i].id);
        });
    }
}

function secondInitiation(id){

    //initiate's content remover
    for (let i = 2; i <= 4; i++)
    {
        document.getElementById(`p${i}`).remove();
    }

    if (id == "p2")
    {
        //game mode chooser

        //creation of the solo and duo option
        let solo = document.createElement("div");
        let duo = document.createElement("div");
        document.body.appendChild(solo);
        document.body.appendChild(duo);
        solo.id = "solo";
        duo.id = "duo";

        solo.innerHTML = "Solo mode";
        duo.innerHTML = "Duo mode";

        //a bit of animation
        solo.addEventListener("mouseover", () => {
            solo.style.fontSize = "110px";
        });
        duo.addEventListener("mouseover", () => {
            duo.style.fontSize = "110px";
        });
        solo.addEventListener("mouseout", () => {
            solo.style.fontSize = "100px";
        });
        duo.addEventListener("mouseout", () => {
            duo.style.fontSize = "100px";
        });

        //checker to see what the user has clicked
        solo.addEventListener("click", () => {
            solo.remove();
            duo.remove();
            duoMode = false;
            playerNumber = 2;
            tutorialType();
        });
        duo.addEventListener("click", () => {
            solo.remove();
            duo.remove();
            playerNumber = 4;
            duoMode = true;
            tutorialType();
        });

    }
    else if (id == "p3")
    {
        duoMode = false;
        playerNumber = 3;
        tutorialType();
    }
    else if (id == "p4")
    {
        duoMode = false;
        playerNumber = 4;
        tutorialType();
    }
}

function tutorialType(){

    //audio
    let bgMusic = document.getElementById("audio");
    bgMusic.play();

    //creating the canvas
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    //starting the game
    gameStart();
}

function information(){
    infoBox = document.createElement("div");
    document.body.appendChild(infoBox);
    infoBox.id = "infoBox";
    infoShown = true;

    infoBox.innerHTML = 
    `    <h1 style = "text-align : center; font-size: 45px;"> Welcome to Bomb Blast! </h1>
    <p style = "text-align: center; font-size: 25px;">Softcopy of a Classic Nepali game </p> <br>
    <p style = "font-size: 20px;">
        (To access or exit this info page press ESC)<br><br>
        The rules for the game are exactly the same as that of the normal Nepali version.
        (so if you are familiar with the normal version then you may skip "about game")<br><br>
        <b>About game</b> <br>
        This is a turn based game. (ie. each player will have their turn). A bomb will be placed in the center of the map, the objective is to obtain it and eliminate every other player 
        using it.
        After a player obtains the bomb, he will not be able to move and will have to throw the bomb in his next turn.
        If the thrown bomb gets caught by the opponent, the thrower will be eliminated by the catcher, and if the target
        (catcher) is unable to catch the bomb, he will get eliminated in the name of the thrower. 
        If a player who has previously eliminated others is eliminated, then those previously eliminated players will be 
        revived in the place they were eliminated.
        Finally, if a player manages to eliminate all other players, being the only one remaining, he will win the game!
        <br><br>
        <b>Controls</b><br>
        How to move?<br>
        Use the ARROW KEYS or the "WASD" buttons to move the aimer, then hold down the SPACE to charge.
        After obtaining the required charge release the SPACE button to move in the direction you had previously aimed at.
        Note: Players can collide with each other and they collide with the wall to recoil with a bit of charge.<br><br>
        How to deal with the Bomb?<br>
        To get the Bomb: Just aim towards the bomb and move through it. If a player obtains the bomb he will have a black 
        border around him (signifying who has the bomb).<br>
        To throw the bomb: Do what you normally do to move, but this time when you release, the bomb gets thrown.<br>
        <br>
        <b>How to Aim and Defend?</b> <br>
        To Aim: You can aim when you have the bomb and it's your turn.  
        Then during your turn select any one of the following options, without showing the one who is being attacked.<br>
        <img src="Accesory/ImageNumPad.jpg" width="300px" height="300px" style="display: block; margin-left: auto; margin-right: auto;"><br>
        If you forget to aim, that throw will be counted as a "NC", ie, It will neither eliminate the target upon hitting,
        nor will it get caught.<br>
        Note: If you hit a wall, the wall will get destroyed and the bomb will rebound.<br>
        To Defend: If the thrown bomb hits a player, the player that got hit will get to choose 3 options.
        (The same options as above). After choosing the options press Enter key to continue. If among the three guesses,
        any one matches what the thrower had previously choosen, it signifies a catch, the thrower gets eliminated and will
        obtain the bomb. Else, the target (catcher) gets eliminated, and the bomb rebounds.
        <br><br>
        <b>That's it! Have a good game! </b>

    </p>`;
}
