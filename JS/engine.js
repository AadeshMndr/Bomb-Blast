function engine() {
  //error correction
  if (!player.some((p) => p.n == turnNumber) && !changeTurn) {
    changeTurn = true;
  }

  //assigning turns
  while (changeTurn) {
    //actual turn changer
    if (turnNumber == undefined) turnNumber = 1;
    else if (turnNumber == playerNumber) turnNumber = 1;
    else if (turnNumber < playerNumber) turnNumber++;

    //checks if each turn change is valid and does respective things
    player.forEach((p) => {
      if (p.n == turnNumber) {
        if (p.alive) {
          p.active = true;
          changeTurn = false;
          if (!undecided) {
            choosen = false;
          }
          disappear = false;
          clearTimeout(instructionLoop);
          instructionLoop = 0;
        }
      }
    });

    //removing any errors
    if (!undecided) {
      player.forEach((p) => (p.underDecision = false));
    }
  }

  //updating the player
  player.forEach((p) => p.update());

  //update the bomb
  bomb.update();

  //actually drawing the things
  draw();
}

function draw() {
  //drawing the canvas with gradient background effect
  ctx.fillStyle = canvas.colour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle grid pattern for futuristic feel
  ctx.strokeStyle = "rgba(78, 205, 196, 0.1)";
  ctx.lineWidth = 1;
  ctx.setLineDash([10, 10]);

  // Draw grid lines
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.setLineDash([]); // Reset line dash

  if (undecided) {
    // Enhanced "HIT" display in top-right corner

    // Calculate dimensions for the HIT box in top-right
    const boxWidth = 200;
    const boxHeight = 80;
    const boxX = canvas.width - boxWidth - 20; // 20px margin from right edge
    const boxY = 20; // 20px margin from top edge

    // Draw fully opaque background for the HIT notification
    ctx.fillStyle = "rgba(20, 20, 30, 0.95)"; // Almost fully opaque dark background
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Add border glow
    ctx.strokeStyle = bomb.colour;
    ctx.lineWidth = 3;
    ctx.shadowColor = bomb.colour;
    ctx.shadowBlur = 10;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Add inner border for modern look
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.strokeRect(boxX + 3, boxY + 3, boxWidth - 6, boxHeight - 6);

    // Draw the HIT text
    ctx.font = "bold 36px 'Orbitron', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = bomb.colour;
    ctx.shadowColor = bomb.colour;
    ctx.shadowBlur = 15;
    ctx.fillText("💥 HIT!", boxX + boxWidth / 2, boxY + boxHeight / 2 + 5);

    // Add small subtitle
    ctx.font = "bold 12px 'Rajdhani', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 3;
    ctx.fillText("Player Hit!", boxX + boxWidth / 2, boxY + boxHeight / 2 + 25);

    // Reset shadow and alignment
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.textAlign = "start";
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
  if (player.length == 1 && !duoMode) {
    finalDisplay();
  } else if (duoMode && player.length <= 2) {
    let finalColour = player[0].colour;
    if (player.every((p) => p.colour == finalColour)) finalDisplay();
  }
}

//Some custom Maths functions
function velocityCalculator(obj, receiver) {
  if (obj.pointerX == 0) {
    receiver.yvel = obj.power;
    receiver.xvel = 0;
  } else if (obj.pointerY == 0) {
    receiver.xvel = obj.power;
    receiver.yvel = 0;
  } else {
    let k = obj.pointerY / obj.pointerX;
    receiver.yvel = Math.sqrt((Math.pow(obj.power, 2) * Math.pow(k, 2)) / (1 + Math.pow(k, 2)));
    receiver.xvel = receiver.yvel / k;
  }

  if (Math.sign(obj.pointerX) != Math.sign(receiver.xvel)) receiver.xvel *= -1;
  if (Math.sign(obj.pointerY) != Math.sign(receiver.yvel)) receiver.yvel *= -1;

  if (receiver.n != obj.n) {
    receiver.xvel *= 2;
    receiver.yvel *= 2;
  }
}
