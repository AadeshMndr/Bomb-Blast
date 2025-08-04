window.onload = () => {
  notStarted = true;
  //adding controls for help box
  document.addEventListener("keydown", (event) => {
    if (event.key == "Escape" && !infoShown) {
      information();
    } else if (event.key == "Escape" && infoShown) {
      document.getElementById("infoBox").remove();
      infoShown = false;
    }
  });

  document.addEventListener("click", (event) => {
    if (infoShown) {
      // document.getElementById("infoBox").remove();
      // infoShown = false;
    }
  });

  // Removed conflicting JavaScript hover animations
  // Now using only CSS hover effects for smooth transitions
  document.addEventListener("keydown", (event) => {
    if ((event.code == "Space" || event.code == "Enter") && notStarted) {
      notStarted = false;

      initiate();
    }
  });
};

function initiate() {
  notStarted = false;

  //clearing the previous screen
  document.querySelector(".main-menu").remove();

  // Create a container for player selection buttons
  const playerSelectionContainer = document.createElement("div");
  playerSelectionContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        position: relative;
        z-index: 20;
    `;
  document.body.appendChild(playerSelectionContainer);

  // Add a title for player selection
  const selectionTitle = document.createElement("div");
  selectionTitle.innerHTML = "SELECT PLAYERS";
  selectionTitle.style.cssText = `
        font-family: 'Orbitron', monospace;
        font-size: clamp(30px, 6vw, 50px);
        font-weight: 700;
        color: #4ecdc4;
        margin-bottom: 40px;
        text-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
        letter-spacing: 3px;
    `;
  playerSelectionContainer.appendChild(selectionTitle);

  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 30px;
    `;
  playerSelectionContainer.appendChild(buttonContainer);

  let p = [];

  //choosing the game mode
  for (let i = 0; i < 3; i++) {
    //creation of no of players options chooser
    p[i] = document.createElement("div");
    buttonContainer.appendChild(p[i]); // Append to button container instead of body
    p[i].id = `p${i + 2}`;
    p[i].innerHTML = `${i + 2}P`;

    //checker to see what the user has clicked
    p[i].addEventListener("click", () => {
      // Remove the entire player selection container
      playerSelectionContainer.remove();
      secondInitiation(p[i].id);
    });
  }
}

function secondInitiation(id) {
  if (id == "p2") {
    // Create a container for team mode selection
    const teamModeContainer = document.createElement("div");
    teamModeContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            position: relative;
            z-index: 20;
        `;
    document.body.appendChild(teamModeContainer);

    // Add a title for team mode selection
    const teamTitle = document.createElement("div");
    teamTitle.innerHTML = "SELECT GAME MODE";
    teamTitle.style.cssText = `
            font-family: 'Orbitron', monospace;
            font-size: clamp(30px, 6vw, 50px);
            font-weight: 700;
            color: #ff6b6b;
            margin-bottom: 40px;
            text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
            letter-spacing: 3px;
        `;
    teamModeContainer.appendChild(teamTitle);

    // Create button container for team modes
    const teamButtonContainer = document.createElement("div");
    teamButtonContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
        `;
    teamModeContainer.appendChild(teamButtonContainer);

    //creation of the solo and duo option
    let solo = document.createElement("div");
    let duo = document.createElement("div");
    teamButtonContainer.appendChild(solo);
    teamButtonContainer.appendChild(duo);
    solo.id = "solo";
    duo.id = "duo";

    solo.innerHTML = "Solo mode";
    duo.innerHTML = "Duo mode";

    //checker to see what the user has clicked
    solo.addEventListener("click", () => {
      teamModeContainer.remove();
      duoMode = false;
      playerNumber = 2;
      tutorialType();
    });
    duo.addEventListener("click", () => {
      teamModeContainer.remove();
      playerNumber = 4;
      duoMode = true;
      tutorialType();
    });
  } else if (id == "p3") {
    duoMode = false;
    playerNumber = 3;
    tutorialType();
  } else if (id == "p4") {
    duoMode = false;
    playerNumber = 4;
    tutorialType();
  }
}

function tutorialType() {
  //audio
  let bgMusic = document.getElementById("audio");
  bgMusic.play();

  // Add class to body for game-started state
  document.body.classList.add("game-started");

  //creating the canvas
  canvas = document.createElement("canvas");
  canvas.id = "canvas";

  // Append to game content container for better layout
  const gameContent = document.querySelector(".game-content");
  if (gameContent) {
    gameContent.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  //starting the game
  gameStart();
}

function information() {
  infoBox = document.createElement("div");
  document.body.appendChild(infoBox);
  infoBox.id = "infoBox";
  infoShown = true;

  infoBox.innerHTML = `<div class="info-content">
        <h1 style="text-align: center; font-size: 45px;">💣 Welcome to Bomb Blast! 💥</h1>
        <p style="text-align: center; font-size: 25px; color: #4ecdc4; margin-bottom: 30px;">Softcopy of a Classic Nepali game</p>
        
        <p style="font-size: 20px;">
            <b>📖 Quick Start</b><br>
            Press <b>ESC</b> to access or exit this info page • <b>SPACE/ENTER</b> to play<br><br>
            
            <b>🎯 Game Objective</b><br>
            This is a turn-based multiplayer game where your goal is to eliminate all opponents using the bomb. 
            The last player standing wins!<br><br>
            
            <b>🎮 How to Play</b><br>
            • A bomb spawns in the center - grab it to start attacking<br>
            • When you have the bomb, you cannot move and must throw it on your next turn<br>
            • Successfully hit opponents to eliminate them<br>
            • If someone catches your thrown bomb, you get eliminated instead<br>
            • Eliminated players can be revived if their eliminator gets eliminated<br><br>
            
            <b>⌨️ Controls</b><br>
            <b>Movement:</b> Use <b>ARROW KEYS</b> or <b>WASD</b> to aim, then hold <b>SPACE</b> to charge power<br>
            <b>Action:</b> Release <b>SPACE</b> to move/throw in the aimed direction<br>
            <b>Collision:</b> Players bounce off each other and walls with some recoil<br><br>
            
            <b>💣 Bomb Mechanics</b><br>
            <b>Getting the Bomb:</b> Move through the bomb to pick it up (black border shows who has it)<br>
            <b>Throwing:</b> Aim and charge like normal movement, release to throw<br>
            <b>Wall Hits:</b> Bombs destroy walls and rebound<br><br>
            
            <b>🎯 Aiming & Defense System</b><br>
            <b>Aiming:</b> When throwing, secretly choose a direction using the numpad layout:<br>
        </p>
        <img src="Accesory/ImageNumPad.jpg" width="280px" height="280px" style="display: block; margin: 20px auto; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.5));"><br>
        <p style="font-size: 20px;">
            <b>Defense:</b> If hit by a bomb, choose 3 directions to defend<br>
            • If any of your guesses matches the attacker's aim = successful catch<br>
            • Successful catch eliminates the thrower and gives you the bomb<br>
            • Failed defense eliminates you and the bomb rebounds<br>
            • Forgot to aim? The throw counts as "NC" (no catch/elimination)<br><br>
            
            <b>🌟 Pro Tips</b><br>
            • Watch player positions to predict their moves<br>
            • Use walls strategically for rebounds<br>
            • Remember eliminated players can return if their eliminator falls<br>
            • Master the charge system for precise movement<br><br>
            
            <b>🎊 That's it! Good luck and have fun!</b>
        </p>
    </div>`;
}
