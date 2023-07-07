class Border
{
    constructor(x, y, width, height, ID)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.n = ID;
    }

    update(){

    }
    
    draw(){
        ctx.fillStyle = "darkslateblue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}