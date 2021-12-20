class Enemy {
  constructor(ctx, shape, position, y, extraHp) {
    this.ctx = ctx
    const offSet = 100
    this.id = new Date()
    this.dying = false
    this.x = position === "left" ? - offSet : this.ctx.canvas.width + offSet
    this.position = position
    this.y = y
    this.extraHp = extraHp

    this.shape = shape

    this.img = new Image()

    this.img.src = `asset/images/${this.position === "left" ? shape : `${shape}-reverse`}.png`

    this.img.isReady = false

    this.img.onload = () => {
      this.img.isReady = true
    }

    this.horizontalFrames = 6
    this.verticalFrames = 5

    this.xFrame = this.position === "left" ? 0 : this.horizontalFrames - 1
    this.yFrame = 4

    this.tick = 0

    this.doingDamage = false

    switch (shape) {
      case "medusa":
        this.health = 75
        this.damage = 2
        this.vx = position === "left" ? 2 : -2
        this.value = 10
        this.width = 100
        this.height = 64
        break;
      case "lizard":
        this.health = 125
        this.damage = 1
        this.vx = position === "left" ? 1.25 : -1.25
        this.value = 15
        this.width = 100
        this.height = 64
        break;
      case "jihn":
        this.health = 50
        this.damage = 4
        this.vx = position === "left" ? 0.75 : -0.75
        this.value = 30
        this.width = 100
        this.height = 100
        this.y = this.y - 36
        break;
      case "demon":
        this.health = 300
        this.damage = 3
        this.vx = position === "left" ? 0.9 : -0.9
        this.value = 50
        this.width = 125
        this.height = 125
        this.y = this.y - 61
        break;
      case "small-dragon":
        this.health = 1000
        this.damage = 7
        this.vx = position === "left" ? 0.8 : -0.8
        this.value = 600
        this.width = 110
        this.height = 64
        this.y = this.y
        break;
      default:
        break;
    }
    this.health += this.extraHp
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

  getResetFrame() {
    switch (this.shape) {
      case "medusa":
        switch (this.yFrame) {
          case 0:
            return 5
          case 1:
            return 5
          case 2:
            return 1
          case 3:
            return 2
          case 4:
            return 3
          default:
            break;
        }
        break;
      case "lizard":
        switch (this.yFrame) {
          case 0:
            return 4
          case 1:
            return 5
          case 2:
            return 1
          case 3:
            return 2
          case 4:
            return 5
          default:
            break;
        }
        break;
      case "jihn":
        switch (this.yFrame) {
          case 0:
            return 3
          case 1:
            return 4
          case 2:
            return 3
          case 3:
            return 1
          case 4:
            return 3
          default:
            break;
        }
        break;
      case "demon":
        switch (this.yFrame) {
          case 0:
            return 3
          case 1:
            return 5
          case 2:
            return 1
          case 3:
            return 2
          case 4:
            return 5
          default:
            break;
        }
        break;
      case "small-dragon":
        switch (this.yFrame) {
          case 0:
            return 2
          case 1:
            return 3
          case 2:
            return 1
          case 3:
            return 2
          case 4:
            return 3
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  animation() {
    if (this.tick % 10 === 0) {
      if (this.position === "left") {
        this.xFrame++
        // Reinicia animación si está completa y no ha muerto
        if (this.xFrame === this.getResetFrame() && this.yFrame !== 1) {
          this.xFrame = 0
        }
      } else if (this.position === "right") {
        this.xFrame--
        // Reinicia animación si está completa y no ha muerto
        if (this.xFrame === this.horizontalFrames - this.getResetFrame() && this.yFrame !== 1) {
          this.xFrame = this.horizontalFrames - 1
        }
      }

    }
  }

  move() {
    this.animation()
    const towerX = (this.ctx.canvas.width / 2) - 100 / 2
    const notTouchingTowerLeft = (this.x + this.width) < towerX
    const notTouchingTowerRight = (this.x) > towerX + 100
    // moves if theres no tower in front
    if (this.position === "left" && notTouchingTowerLeft && this.yFrame !== 1) {
      this.x += this.vx
    }
    if (this.position === "right" && notTouchingTowerRight && this.yFrame !== 1) {
      this.x += this.vx
    }

    // Attacks when touching tower
    if (this.position === "left" && !notTouchingTowerLeft || this.position === "right" && !notTouchingTowerRight) {
      // Damage
      if (!this.doingDamage) {
        this.doingDamage = true
      }
      // Animation
      if (!this.dying) {
        this.yFrame = 0
      }
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
    const collideContidion = (
      this.x < bullet.x + bullet.width &&
      this.x + this.width > bullet.x &&
      this.y < bullet.y + bullet.height &&
      this.y + this.width > bullet.y)

    if (bullet.shape === "rocks") {
      this.dying === false
      if (!this.dying && Math.random() < 0.03) {
        this.takeDamage(bullet.dmg)
      }
      return collideContidion
    } else if (bullet.shape === "tornado") {
      this.dying === false
      if (!this.dying && Math.random() < 0.2) {
        this.takeDamage(bullet.dmg)
        return collideContidion
      }
    } else if (!bullet.dies && !this.dying) {
      return collideContidion
    }
  }

  takeDamage(dmg) {
    this.health -= dmg
  }

}