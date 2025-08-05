class Border {
  constructor(x, y, width, height, ID) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.n = ID;
  }

  update() {}

  draw() {
    // Enhanced wall/border with modern styling
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    gradient.addColorStop(0, "#34495e");
    gradient.addColorStop(0.5, "#2c3e50");
    gradient.addColorStop(1, "#1a252f");

    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Add subtle border glow
    ctx.strokeStyle = "#4ecdc4";
    ctx.lineWidth = 1;
    ctx.shadowColor = "#4ecdc4";
    ctx.shadowBlur = 5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Add inner highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // Reset styles
    ctx.shadowBlur = 0;
  }
}
