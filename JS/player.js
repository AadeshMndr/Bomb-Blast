class Player
{
    constructor(x, y, width,  height, ID)
    {
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
    hori = false;              //is it colliding horizontally?
    vert = false;              //is it colliding vertically?
    both = false;              //is it colliding diagonally?
    hasBomb = false;
    killed = [];
    underDecision = false;

    //active status
    active = false;
    alive = true;

    update(){
        //determining the center and actual velocity
        this.centerX = this.x + this.width/2;
        this.centerY = this.y + this.height/2;
        this.vel = Math.sqrt(Math.pow(this.xvel, 2) + Math.pow(this.yvel, 2));

        if (this.active)
        {
            //for moving the arrow/pointer
            arrowMovement(this);

            //for player movement and throwing
            if (charge && this.power <= this.maxPower)
            {
                this.power++;
                this.powerUpArcAngle = (2 * Math.PI / this.maxPower) * this.power; 
            }
            else if (charge && this.power > this.maxPower)
            {
                this.power = 1;
                this.powerUpArcAngle = (2 * Math.PI / this.maxPower) * this.power;
            }
            if (!charge && this.power > 0 && !undecided)
            {
                if (!this.hasBomb)
                velocityCalculator(this, this);
                else if (this.hasBomb)
                velocityCalculator(this, bomb);
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
            if (this.n != obj.n)
            {
                checkCollision(this, obj);
                //console.log(`hori = ${player[0].hori} and vert = ${player[0].vert} and both = ${player[0].both}`);
                if (this.hori)
                {
                    obj.xvel = this.xvel;
                    this.xvel = 0;
                    this.hori = false;
                    this.both = false;
                }
                if (this.vert)
                {
                    obj.yvel = this.yvel;
                    this.yvel = 0;
                    this.vert = false;
                    this.both = false;
                }
                if (this.both && !this.hori && !this.vert)
                {
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
            if (this.hori)
            {
                this.xvel = -this.xvel / 10;
                this.hori = false;
                this.both = false;
            }
            if (this.vert)
            {
                this.yvel =-this.yvel / 10;
                this.vert = false;
                this.both = false;
            }
            if (this.both && !this.hori && !this.vert)
            {
                this.xvel = -this.xvel / 10;
                this.yvel = -this.yvel / 10;
                this.both = false;
            }
        });

        //collision testing with the bomb
        if (!this.hasBomb)
        checkCollision(this, bomb);
        if (this.both)
        {
            this.hasBomb = true;
            this.both = false;
            this.hori = false;
            this.vert = false;
        }

        //determining the velocity after some probable change
        this.vel = Math.sqrt(Math.pow(this.xvel, 2) + Math.pow(this.yvel, 2));

        //action of friction
        this.xvel /= this.friction;
        this.yvel /= this.friction;
        if (this.xvel < 0.1 && this.xvel > -0.1)
        this.xvel = 0;
        if (this.yvel < 0.1 && this.yvel > -0.1)
        this.yvel = 0;

        //actual movement
        this.x += this.xvel;
        this.y += this.yvel;
    }

    draw(){
        //colour and design
        if (this.n == 1)
        this.colour = "Red";
        else if (this.n == 2)
        this.colour = "Blue";
        else if (this.n == 3 && !duoMode)
        this.colour = "Green";
        else if (this.n == 4 && !duoMode)
        this.colour = "Yellow";
        else if (this.n == 3 && duoMode)
        this.colour = "Red";
        else if (this.n == 4 && duoMode)
        this.colour = "Blue";

        ctx.fillStyle = this.colour;

        ctx.strokeStyle = "black";
        ctx.lineWidth = this.width / 10;

        //drawing the body
        ctx.fillRect(this.x, this.y, this.width, this.height);

        //drawing the arrow
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.centerX + this.pointerX, this.centerY + this.pointerY);
        ctx.stroke();
        ctx.closePath();

        //drawing the powerUpArc
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius / 2, 0, this.powerUpArcAngle, false);
        ctx.stroke();

        //drawing things if aquired
        if (this.hasBomb)
        {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
        }

        if (this.underDecision)
        {
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
        }
    }
}

function arrowMovement(obj){
    //Arrow By X-component
    if ((keyRight && keyLeft) || (!keyLeft && !keyRight))
    {
        //Nothing
    }
    if (keyRight && (obj.pointerX < obj.radius) && obj.pointerY != 0)
    {
        if (obj.pointerX + 1 <= obj.radius)
        obj.pointerX++;
        else
        obj.pointerX = obj.radius;

        if (obj.pointerY > 0)
        obj.pointerY = Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerX, 2)));
        if (obj.pointerY < 0)
        obj.pointerY = -Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerX, 2)));
    }
    else if (keyLeft && (obj.pointerX > -obj.radius) && obj.pointerY != 0)
    {
        if (obj.pointerX - 1 >= -obj.radius)
        obj.pointerX--;
        else
        obj.pointerX = -obj.radius;

        if (obj.pointerY > 0)
        obj.pointerY = Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerX, 2)));
        if (obj.pointerY < 0)
        obj.pointerY = -Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerX, 2)));
    }
    
    //Arrow By Y-component
    if ((keyUp && keyDown) || (!keyUp && !keyDown))
    {
        //Nothing
    }
    if (keyDown && (obj.pointerY < obj.radius) && obj.pointerX != 0)
    {
        if (obj.pointerY + 1 <= obj.radius)
        obj.pointerY++;
        else
        obj.pointerY = obj.radius;

        if (obj.pointerX > 0)
        obj.pointerX = Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerY, 2)));
        else if (obj.pointerX < 0)
        obj.pointerX = -Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerY, 2)));
    }
    else if (keyUp && (obj.pointerY > -obj.radius) && obj.pointerX != 0)
    {
        if (obj.pointerY - 1 >= -obj.radius)
        obj.pointerY--;
        else
        obj.pointerY = -obj.radius;

        if (obj.pointerX > 0)
        obj.pointerX = Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerY, 2)));
        else if (obj.pointerX < 0)
        obj.pointerX = -Math.sqrt((Math.pow(obj.radius, 2)) - (Math.pow(obj.pointerY, 2)));
    }
}