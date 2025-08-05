function drawInstructions() {
  // Use modern font styling
  ctx.font = "bold 24px 'Rajdhani', sans-serif";
  ctx.textAlign = "center";

  ctx.fillStyle = canvas.colour;
  textColour = "No"; //just for humour

  if (!disappear && player.length != 1) {
    // Clear the instruction area first to prevent text overlap with rounded corners
    ctx.fillStyle = canvas.colour;
    ctx.fillRect(0, 20, canvas.width, 60);

    // Draw a semi-transparent background for instructions
    ctx.fillStyle = "rgba(26, 26, 46, 0.8)";
    ctx.fillRect(20, 25, canvas.width - 40, 50);

    // Add a subtle border glow effect
    ctx.strokeStyle = "#4ecdc4";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(20, 25, canvas.width - 40, 50);

    // Determine current player's color for normal turns
    player.forEach((p) => {
      if (p.n == turnNumber) textColour = p.colour;
    });

    // Get current game state and show appropriate instruction
    let instructionText = getContextualInstruction();

    // Set text color based on context with enhanced styling
    if (undecided) {
      // When someone is hit, use the hit player's color with glow effect
      player.forEach((p) => {
        if (p.underDecision) {
          ctx.fillStyle = p.colour;
          ctx.shadowColor = p.colour;
          ctx.shadowBlur = 10;
        }
      });
      // Clear any existing timer and keep instructions visible during decision
      if (instructionLoop != 0) {
        clearTimeout(instructionLoop);
        instructionLoop = 0;
      }
      disappear = false;
    } else {
      // Normal game state with enhanced text styling
      ctx.fillStyle = textColour;
      ctx.shadowColor = textColour;
      ctx.shadowBlur = 8;

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
        instructionLoop = setTimeout(() => {
          disappear = true;
        }, delayTime);
      }
    }

    // Display the instruction text with center alignment
    if (instructionText) {
      ctx.fillText(instructionText, canvas.width / 2, 55);
      // Reset shadow for other drawings
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
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
        return `${hitPlayer.displayName || hitPlayer.colour} Player: Select Catching Locations (1-8)`;
      } else {
        // Get the most recent 3 selections (or all if less than 3)
        let recentSelections = defendSpot.slice(-trys);
        let selectionsText = recentSelections.join(", ");

        if (defendSpot.length >= trys) {
          return `${hitPlayer.displayName || hitPlayer.colour} Player: Selected [${selectionsText}] - Press Enter`;
        } else {
          return `${hitPlayer.displayName || hitPlayer.colour} Player: Selected [${selectionsText}] - Continue Selecting`;
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
        return `${currentPlayer.displayName || currentPlayer.colour} Player: Select Aiming Location (1-8)`;
      } else {
        return `${currentPlayer.displayName || currentPlayer.colour} Player: Aim and Throw (Use WASD + Space)`;
      }
    } else {
      // Normal turn without bomb
      return `${currentPlayer.displayName || currentPlayer.colour} Player's Turn`;
    }
  }

  // Fallback - get display name for current turn player
  let displayName = "Unknown";
  player.forEach((p) => {
    if (p.n == turnNumber) {
      displayName = p.displayName || p.colour;
    }
  });

  return `${displayName} Player's Turn`;
}

function getTextXPosition(text) {
  // Calculate text width to center it properly
  ctx.font = "30px Arial";
  let textWidth = ctx.measureText(text).width;
  return (canvas.width - textWidth) / 2;
}

function finalDisplay() {
  // Enhanced winner display with modern styling
  ctx.font = "bold 80px 'Orbitron', monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = player[0].colour;
  ctx.shadowColor = player[0].colour;
  ctx.shadowBlur = 30;

  let winnerName = player[0].displayName || player[0].colour;
  let text = `🏆 WINNER: ${winnerName.toUpperCase()} PLAYER! 🏆`;

  // Add dark background for the winner text
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(50, canvas.height / 2 - 80, canvas.width - 100, 160);

  // Add glowing border
  ctx.strokeStyle = player[0].colour;
  ctx.lineWidth = 4;
  ctx.strokeRect(50, canvas.height / 2 - 80, canvas.width - 100, 160);

  // Draw the winner text
  ctx.fillStyle = player[0].colour;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Add subtitle
  ctx.font = "bold 30px 'Rajdhani', sans-serif";
  ctx.fillStyle = "#4ecdc4";
  ctx.shadowColor = "#4ecdc4";
  ctx.shadowBlur = 15;
  ctx.fillText("Press F5 to play again", canvas.width / 2, canvas.height / 2 + 50);

  // Reset shadow and alignment
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.textAlign = "start";
}
