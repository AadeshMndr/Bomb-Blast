class Bomb
{
    constructor(x, y, width, height, ID)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.n = ID;
    }
    onGround = true;

    xvel = 0;
    yvel = 0;
    friction = globalFriction;
    both = false;
    hori = false;
    vert = false;
    colour = "white";

    update(){
        this.vel = Math.sqrt(Math.pow(this.xvel, 2) + Math.pow(this.yvel, 2));
        player.forEach((obj) => {
            if (obj.hasBomb)
            {
                this.onGround = false;
                this.x = obj.centerX;
                this.y = obj.centerY;
                this.acquiredBy = obj.n;
            }
        });

        //checking collision with other players
        player.forEach((target) => {

            if (this.acquiredBy != target.n)
            checkCollision(this, target);
            
            if (this.both)
            {
                undecided = true;
                target.underDecision = true;
                this.onGround = false;

                setTimeout(() => {
                    ctx.fillStyle = canvas.colour;
                    ctx.fillRect(600, 540, 130, 80);
                    player.forEach((p) => p.draw())
                }, 5000);


                clearInterval(gameLoop);

                if (this.hori)
                {
                    this.xvel = -this.xvel / 2;
                    this.hori = false;
                    this.both = false;
                }
                if (this.vert)
                {
                    this.yvel =-this.yvel / 2;
                    this.vert = false;
                    this.both = false;
                }
                if (this.both && !this.hori && !this.vert)
                {
                    this.xvel = -this.xvel / 2;
                    this.yvel = -this.yvel / 2;
                    this.both = false;
                }

                player.forEach((thrower) => {
                    if (thrower.n == this.acquiredBy)
                    {
                        memory = {
                            target: target,
                            thrower: thrower
                        };
                    }
                });
            }
        });

        //checking collisions with border walls
        border.forEach((wall) => {
            checkCollision(this, wall);
            if (wall.n > 0 && this.both)
            {
                if (undecided)
                {
                    border.forEach((block) => {
                        if (block.n == wall.n)
                        {
                            unintentionallyDestroyedBorder = block;
                        }
                    });
                }
                border = border.filter((block) => block.n != wall.n);
            }
            if (this.hori)
            {
                this.xvel = -this.xvel / 2;
                this.hori = false;
                this.both = false;
            }
            if (this.vert)
            {
                this.yvel =-this.yvel / 2;
                this.vert = false;
                this.both = false;
            }
            if (this.both && !this.hori && !this.vert)
            {
                this.xvel = -this.xvel / 2;
                this.yvel = -this.yvel / 2;
                this.both = false;
            }
        });


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
        if (this.onGround)
        {
            ctx.fillStyle = this.colour;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}