class Floor {
  constructor(ctx, shape, floorCount) {
    this.ctx = ctx

    this.width = 133
    this.height = 188
    this.shape = shape
    this.floorCount = floorCount
    this.fireFramesCount = 0;
    this.lvl = 1

    this.x = (this.ctx.canvas.width / 2) - this.width / 2
    this.y = (this.ctx.canvas.height - this.height - 35) - (this.height * 0.6) * floorCount

    this.bullets = [];

    this.img = new Image()
    this.img.src = `asset/images/${shape}.png`
    this.img.isReady = false

    this.base = new Image()
    this.base.src = `asset/images/base.png`
    this.base.isReady = false

    this.roof = new Image()
    this.roof.src = `asset/images/roof.png`
    this.roof.isReady = false

    this.img.onload = () => {
      this.img.isReady = true
    }

    this.base.onload = () => {
      this.base.isReady = true
    }

    this.roof.onload = () => {
      this.roof.isReady = true
    }

    switch (this.shape) {
      case "cannon":
        this.fireSpeed = 45 - this.lvl * 20
        break;
      case "ballista":
        this.fireSpeed = 60 - this.lvl * 5
        break;
      case "blaster":
        this.fireSpeed = 70 - this.lvl * 5
        break;
      case "catapult":
        this.fireSpeed = 85 - this.lvl * 5
        break;
      default:
        break;
    }
  }

  draw(index) {
    if (index === 0) {
      if (this.base.isReady) {
        this.ctx.drawImage(
          this.base,
          this.x,
          this.y,
          this.width,
          this.height
        )
      }
      if (this.img.isReady) {
        this.ctx.drawImage(
          this.img,
          this.x,
          this.y + 10,
          this.width,
          this.height
        )
      }
    } else if (index === 3) {
      if (this.img.isReady) {
        this.ctx.drawImage(
          this.img,
          this.x,
          this.y + index * 50,
          this.width,
          this.height
        )
      }
      if (this.roof.isReady) {
        this.ctx.drawImage(
          this.roof,
          this.x,
          this.y + 50,
          this.width,
          this.height
        )
      }
    } else {
      if (this.img.isReady) {
        this.ctx.drawImage(
          this.img,
          this.x,
          this.y + index * 50,
          this.width,
          this.height
        )
      }
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
    if (nearestEnemy && this.fireFramesCount % this.fireSpeed === 0) {
      const towerX = (this.ctx.canvas.width / 2) + (this.ctx.canvas.width / 2 > nearestEnemy.x ? - 50 : 25)
      const towerY = this.y + (this.floorCount * 50) + 90
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
          bulletShape = "tornado"
          break;
        case "ballista":
          bulletShape = "water"
          break;
        case "catapult":
          bulletShape = "rocks"
          break;
        default:
          break;
      }
      this.bullets.push(new Bullet(this.ctx, bulletShape, nearestEnemy.position, towerX, towerY, Math.sin(angle) * speed, Math.cos(angle) * speed))
    }
    this.fireFramesCount++
  }

  move() {
    this.bullets.forEach(bullet => bullet.move());
  }

  checkCollissions(enemies) {
    let condition
    let enemyBeated = -1
    enemies.forEach(enemy => {
      this.bullets.forEach(bullet => {
        if (enemy.collidesWith(bullet)) {
          if (bullet.shape === "tornado") {
            const movedInterval = setInterval(() => {
              enemy.position === "left" ? enemy.x -= 5 : enemy.x += 5
            }, 2);
            setTimeout(() => {
              clearInterval(movedInterval)
            }, 70);
          } else if (bullet.shape === "water") {
            enemy.vx *= 0.5
          }
          enemy.takeDamage(bullet.dmg)
          condition = true
          if (enemy.health <= 0) {
            enemyBeated = enemy
            enemy.dying = true
            if (enemy.yFrame !== 1) {
              enemy.xFrame = enemy.position === "left" ? 0 : 5
            }
            enemy.yFrame = 1
            enemy.doingDamage = false
          }
          bullet.dies = true
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
  lvlUp() {
    switch (this.shape) {
      case "cannon":
        this.fireSpeed -= 8
        break;
      case "ballista":
        this.fireSpeed -= 2
        break;
      case "blaster":
        this.fireSpeed -= 2
        break;
      case "catapult":
        this.fireSpeed -= 2
        break;
      default:
        break;
    }
  }
}
