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
    if (nearestEnemy) {
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
    }
  }

  move() {
    this.bullets.forEach(bullet => bullet.move());
  }

  checkCollissions(enemies) {
    let condition
    let enemyBeated = -1
    let bulletBeated
    enemies.forEach(enemy => {
      this.bullets.forEach(bullet => {
        if (enemy.collidesWith(bullet)) {
          console.log("hit")
          enemy.takeDamage(50)
          console.log(enemy.health)
          condition = true
          if (enemy.health <= 0) {
            enemyBeated = enemy
            enemy.dying = true
            if (enemy.yFrame !== 1) {
              enemy.xFrame = 0
            }
            enemy.yFrame = 1
            enemy.doingDamage = false
          }
          bulletBeated = bullet.id
          bullet.dies = true
          if (bullet.shape === "water") {
            bullet.yFrame = 3
          } else {
            bullet.yFrame = 0
          }
        }
      });
    })
    if (condition) {
      this.deleteOldBullets()
      return enemyBeated
    }
  }
  deleteOldBullets() {
    while (this.bullets.length > 10) {
      this.bullets.shift()
    }
  }
}
