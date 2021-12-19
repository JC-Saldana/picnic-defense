class Bullet {
  constructor(ctx, shape, position, x, y, vx, vy) {
    this.ctx = ctx
    this.position = position
    this.width = 45
    this.height = 45
    this.shape = shape
    this.dies = false

    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy

    this.horizontalFrames = 10
    this.verticalFrames = 13
    /*
    fireball 0 - 5
    water 2 - 8
    tornado 3 y 9 o solo 9
    */
    switch (shape) {
      case "fireball":
        this.xFrame = this.position === "right" ? 0 : 9
        this.dmg = 50
        break;
      case "water":
        this.xFrame = this.position === "right" ? 2 : 7
        this.dmg = 5
        break;
      case "tornado":
        this.xFrame = this.position === "right" ? 3 : 6
        this.dmg = 10
        break;
      case "rocks":
        this.xFrame = this.position === "right" ? 1 : 8
        this.dmg = 35
        break;
      default:
        break;
    }



    this.yFrame = 0

    this.tick = 0

    this.img = new Image()
    this.img.src = `asset/images/${this.position === "right" ? "bullet" : "bullet-reverse"}.png`
    this.img.isReady = false

    this.img.onload = () => {
      this.img.isReady = true
    }
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      (this.img.width * this.xFrame) / this.horizontalFrames,
      (this.img.height * this.yFrame) / this.verticalFrames,
      this.img.width / this.horizontalFrames,
      this.img.height / this.verticalFrames,
      this.x,
      this.y,
      this.width,
      this.height
    )
    this.tick++
  }

  animation() {
    if (this.tick % 10 === 0) {
      this.yFrame++
      if (this.yFrame >= this.horizontalFrames) {
        this.xFrame = 0
      }
    }
  }

  move() {
    this.animation()
    if (!this.dies) {
      this.x += this.vx
      this.y += this.vy
    } else {
      switch (this.shape) {
        case "fireball":
          this.xFrame = this.xFrame = this.position === "right" ? 5 : 4
          break;
        case "water":
          this.xFrame = this.xFrame = this.position === "right" ? 8 : 1
          break;
        case "tornado":
          this.xFrame = this.xFrame = this.position === "right" ? 9 : 0
          break;
        case "rocks":
          this.xFrame = this.xFrame = this.position === "right" ? 7 : 2
          break;
        default:
          break;
      }
    }
  }
}
