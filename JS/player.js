class Player {
  constructor(x, y, width, height, ID) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.n = ID;
    this.radius = width * 2;
    this.pointerX = width * 2;
    this.pointerY = 0;
  }

  xvel = 0;
  yvel = 0;
  vel = 0;
  power = 0;
  maxPower = globalMaxMovingPower;
  friction = globalFriction;
  powerUpArcAngle = 0;
  hori = false; //is it colliding horizontally?
  vert = false; //is it colliding vertically?
  both = false; //is it colliding diagonally?
  hasBomb = false;
  killed = [];
  underDecision = false;

  //active status
  active = false;
  alive = true;

  update() {
    //determining the center and actual velocity
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.vel = Math.sqrt(Math.pow(this.xvel, 2) + Math.pow(this.yvel, 2));

    if (this.active) {
      //for moving the arrow/pointer
      arrowMovement(this);

      //for player movement and throwing
      if (charge && this.power <= this.maxPower) {
        this.power++;
        this.powerUpArcAngle = ((2 * Math.PI) / this.maxPower) * this.power;
      } else if (charge && this.power > this.maxPower) {
        this.power = 1;
        this.powerUpArcAngle = ((2 * Math.PI) / this.maxPower) * this.power;
      }
      if (!charge && this.power > 0 && !undecided) {
        if (!this.hasBomb) velocityCalculator(this, this);
        else if (this.hasBomb) velocityCalculator(this, bomb);
        this.power = 0;
        this.powerUpArcAngle = 0;
        this.hasBomb = false;
        bomb.onGround = true;
        this.active = false;
        changeTurn = true;
      }
    }

    //collision testing with other players
    player.forEach((obj) => {
      if (this.n != obj.n) {
        checkCollision(this, obj);
        //console.log(`hori = ${player[0].hori} and vert = ${player[0].vert} and both = ${player[0].both}`);
        if (this.hori) {
          obj.xvel = this.xvel;
          this.xvel = 0;
          this.hori = false;
          this.both = false;
        }
        if (this.vert) {
          obj.yvel = this.yvel;
          this.yvel = 0;
          this.vert = false;
          this.both = false;
        }
        if (this.both && !this.hori && !this.vert) {
          obj.xvel = this.xvel;
          obj.yvel = this.yvel;
          this.xvel = 0;
          this.yvel = 0;
          this.both = false;
        }
      }
    });

    //collsion testing with the walls
    border.forEach((wall) => {
      checkCollision(this, wall);
      if (this.hori) {
        this.xvel = -this.xvel / 10;
        this.hori = false;
        this.both = false;
      }
      if (this.vert) {
        this.yvel = -this.yvel / 10;
        this.vert = false;
        this.both = false;
      }
      if (this.both && !this.hori && !this.vert) {
        this.xvel = -this.xvel / 10;
        this.yvel = -this.yvel / 10;
        this.both = false;
      }
    });

    //collision testing with the bomb
    if (!this.hasBomb) checkCollision(this, bomb);
    if (this.both) {
      this.hasBomb = true;
      this.both = false;
      this.hori = false;
      this.vert = false;
      // Reset attack spot when player picks up bomb
      attackSpot = "NC";
    }

    //determining the velocity after some probable change
    this.vel = Math.sqrt(Math.pow(this.xvel, 2) + Math.pow(this.yvel, 2));

    //action of friction
    this.xvel /= this.friction;
    this.yvel /= this.friction;
    if (this.xvel < 0.1 && this.xvel > -0.1) this.xvel = 0;
    if (this.yvel < 0.1 && this.yvel > -0.1) this.yvel = 0;

    //actual movement
    this.x += this.xvel;
    this.y += this.yvel;
  }

  draw() {
    //colour and design with display names
    if (this.n == 1) {
      this.colour = "#ff6b6b"; // Modern red
      this.displayName = "Red";
    } else if (this.n == 2) {
      this.colour = "#4ecdc4"; // Modern cyan/blue
      this.displayName = "Blue";
    } else if (this.n == 3 && !duoMode) {
      this.colour = "#45b7d1"; // Modern blue
      this.displayName = "Green";
    } else if (this.n == 4 && !duoMode) {
      this.colour = "#f9ca24"; // Modern yellow
      this.displayName = "Yellow";
    } else if (this.n == 3 && duoMode) {
      this.colour = "#ff6b6b"; // Modern red
      this.displayName = "Red";
    } else if (this.n == 4 && duoMode) {
      this.colour = "#4ecdc4"; // Modern cyan
      this.displayName = "Blue";
    }

    // Enhanced player body with glow effect
    ctx.fillStyle = this.colour;
    ctx.shadowColor = this.colour;
    ctx.shadowBlur = 15;

    // Draw a subtle gradient background for the player
    const gradient = ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, this.width);
    gradient.addColorStop(0, this.colour);
    gradient.addColorStop(1, this.colour + "80"); // Semi-transparent outer edge

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = this.width / 15;

    //drawing the body with rounded corners effect
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Reset shadow for other elements
    ctx.shadowBlur = 0;

    //drawing the arrow with enhanced styling
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(this.centerX + this.pointerX, this.centerY + this.pointerY);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    //drawing the powerUpArc with glow
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius / 2, 0, this.powerUpArcAngle, false);
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = 4;
    ctx.shadowColor = this.colour;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    //drawing enhanced indicators
    if (this.hasBomb) {
      // Enhanced bomb indicator with pulsing effect
      ctx.beginPath();
      ctx.strokeStyle = "#4ecdc4";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#4ecdc4";
      ctx.shadowBlur = 15;
      ctx.strokeRect(this.x - 6, this.y - 6, this.width + 12, this.height + 12);
      ctx.shadowBlur = 0;

      // Add corner accents
      const cornerSize = 8;
      ctx.fillStyle = "#4ecdc4";
      // Top-left corner
      ctx.fillRect(this.x - 6, this.y - 6, cornerSize, 3);
      ctx.fillRect(this.x - 6, this.y - 6, 3, cornerSize);
      // Top-right corner
      ctx.fillRect(this.x + this.width + 6 - cornerSize, this.y - 6, cornerSize, 3);
      ctx.fillRect(this.x + this.width + 3, this.y - 6, 3, cornerSize);
      // Bottom-left corner
      ctx.fillRect(this.x - 6, this.y + this.height + 3, cornerSize, 3);
      ctx.fillRect(this.x - 6, this.y + this.height + 6 - cornerSize, 3, cornerSize);
      // Bottom-right corner
      ctx.fillRect(this.x + this.width + 6 - cornerSize, this.y + this.height + 3, cornerSize, 3);
      ctx.fillRect(this.x + this.width + 3, this.y + this.height + 6 - cornerSize, 3, cornerSize);
    }

    if (this.underDecision) {
      // Enhanced decision indicator
      ctx.beginPath();
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#f39c12";
      ctx.shadowBlur = 20;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(this.x - 8, this.y - 8, this.width + 16, this.height + 16);
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    }
  }
}

function arrowMovement(obj) {
  //Arrow By X-component
  if ((keyRight && keyLeft) || (!keyLeft && !keyRight)) {
    //Nothing
  }
  if (keyRight && obj.pointerX < obj.radius && obj.pointerY != 0) {
    if (obj.pointerX + 1 <= obj.radius) obj.pointerX++;
    else obj.pointerX = obj.radius;

    if (obj.pointerY > 0) obj.pointerY = Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerX, 2));
    if (obj.pointerY < 0) obj.pointerY = -Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerX, 2));
  } else if (keyLeft && obj.pointerX > -obj.radius && obj.pointerY != 0) {
    if (obj.pointerX - 1 >= -obj.radius) obj.pointerX--;
    else obj.pointerX = -obj.radius;

    if (obj.pointerY > 0) obj.pointerY = Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerX, 2));
    if (obj.pointerY < 0) obj.pointerY = -Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerX, 2));
  }

  //Arrow By Y-component
  if ((keyUp && keyDown) || (!keyUp && !keyDown)) {
    //Nothing
  }
  if (keyDown && obj.pointerY < obj.radius && obj.pointerX != 0) {
    if (obj.pointerY + 1 <= obj.radius) obj.pointerY++;
    else obj.pointerY = obj.radius;

    if (obj.pointerX > 0) obj.pointerX = Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerY, 2));
    else if (obj.pointerX < 0) obj.pointerX = -Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerY, 2));
  } else if (keyUp && obj.pointerY > -obj.radius && obj.pointerX != 0) {
    if (obj.pointerY - 1 >= -obj.radius) obj.pointerY--;
    else obj.pointerY = -obj.radius;

    if (obj.pointerX > 0) obj.pointerX = Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerY, 2));
    else if (obj.pointerX < 0) obj.pointerX = -Math.sqrt(Math.pow(obj.radius, 2) - Math.pow(obj.pointerY, 2));
  }
}
