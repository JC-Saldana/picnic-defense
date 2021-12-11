const ENEMY_FREQUENCY = 50;

class Enemy {
  constructor(ctx, shape, position, y) {
    this.ctx = ctx
    const offSet = 100
    this.x = position === "left" ? - offSet : this.ctx.canvas.width + offSet
    this.position = position
    this.y = y

    this.vx = position === "left" ? 1 : -1

    this.width = 50
    this.height = 50

    this.img = new Image()
    if (shape === "skeleton") {
      this.img.src = 'asset/images/BODY_skeleton.png'
    }
    this.img.isReady = false

    this.img.onload = () => {
      this.img.isReady = true
    }

    this.horizontalFrames = 6
    this.verticalFrames = 4

    this.xFrame = 0
    this.yFrame = 0

    this.tick = 0
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
      this.xFrame++
      if (this.xFrame >= this.horizontalFrames) {
        this.xFrame = 0
      }
    }
  }

  move() {
    this.animation()
    const towerX = (this.ctx.canvas.width / 2) - 100 / 2

    // moves if theres no tower in front
    if (this.position === "left" && ((this.x + this.width) < towerX)) {
      this.x += this.vx
    }
    if (this.position === "right" && ((this.x) > towerX + 100)) {
      this.x += this.vx
    }

    // cant go off map
    if (this.x <= 0) {
      this.x = 0
    }
    if (this.x + this.width >= this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.width
    }
  }
  collidesWith(bullet) {
    return (
      this.x < bullet.x + bullet.width &&
      this.x + this.width > bullet.x &&
      this.y < bullet.y + bullet.height &&
      this.y + this.width > bullet.y)
  }
}