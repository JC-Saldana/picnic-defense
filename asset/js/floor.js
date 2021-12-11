class Floor {
  constructor(ctx, shape, floorCount) {
    this.ctx = ctx

    this.width = 133
    this.height = 188
    this.shape = shape

    this.x = (this.ctx.canvas.width / 2) - this.width / 2
    this.y = (this.ctx.canvas.height - this.height - 35) - (this.height * 0.6) * floorCount

    this.bullets = [];

    this.img = new Image()
    this.img.src = `asset/images/${shape}.png`
    this.img.isReady = false

    this.img.onload = () => {
      this.img.isReady = true
    }
  }

  draw() {
    if (this.img.isReady) {
      this.ctx.drawImage(
        this.img,
        this.x,
        this.y,
        this.width,
        this.height
      )
    }
    this.shouldBulletLive()
    this.bullets.forEach(bullet => {
      bullet.draw();
    })
  }
  shouldBulletLive() {
    this.bullets.forEach(bullet => {
      if (bullet.x < 0 || bullet.x > this.ctx.canvas.width) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1)
      }
    })
  }

  fire(nearestEnemy) {
    const towerX = this.ctx.canvas.width / 2
    const towerY = this.y
    let dx = (nearestEnemy.x + (nearestEnemy.width / 2)) - towerX
    let dy = (nearestEnemy.y + (nearestEnemy.height / 2)) - towerY
    let angle = Math.atan2(dx, dy)
    const speed = 8
    let bulletShape
    switch (this.shape) {
      case "cannon":
        bulletShape = "fireball"
        break;
      case "blaster":
        bulletShape = "water"
        break;
      default:
        break;
    }
    this.bullets.push(new Bullet(this.ctx, bulletShape, towerX, towerY, Math.sin(angle) * speed, Math.cos(angle) * speed))

    //bullets clear
  }

  move() {
    this.bullets.forEach(bullet => bullet.move());
  }

  checkCollissions(enemies) {
    let condition
    let enemyBeated
    let bulletBeated
    enemies.forEach(enemy => {
      this.bullets.forEach(bullet => {
        if (enemy.collidesWith(bullet)) {
          condition = true
          enemyBeated = enemies.indexOf(enemy)
          bulletBeated = this.bullets.indexOf(bullet)
        }
      });
    })
    if (condition) {
      this.bullets.splice(bulletBeated, 1)
      return enemyBeated
    }
  }
}
