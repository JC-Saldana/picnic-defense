class Bullet {
  constructor(ctx, shape, x, y, vx, vy) {
    this.ctx = ctx

    this.width = 80
    this.height = 80
    this.shape = shape

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
        this.xFrame = 0
        break;
      case "water":
        this.xFrame = 2
        break;
      default:
        break;
    }

    this.yFrame = 0

    this.tick = 0

    this.img = new Image()
    this.img.src = `asset/images/bullet.png`
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
    this.x += this.vx
    this.y += this.vy
  }
}
