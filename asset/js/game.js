class Game {
  constructor(ctx) {
    this.ctx = ctx

    this.background = new Background(ctx)
    this.intervalId = null
    this.fireId = null
    this.damageId = null
    this.gold = 250
    this.round = 0
    this.roundPoints = 0
    this.towerHealth = 150
    this.changindRound = false

    // obstacle
    this.enemies = [];
    this.floors = [];
    this.enemyFramesCount = 0;

    //this.score = 0
  }

  start() {
    const best = localStorage.getItem("best")
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.checkRound()
        this.clear()
        this.move()
        this.draw()
        this.collisionLogic()
        this.shouldEnemyDie()
      }, 1000 / 60)
    }

    const nearestEnemy = () => {
      let lowestDistance = 1000
      const towerX = this.ctx.canvas.width / 2
      let nearestEnemy = null
      this.enemies.forEach(enemy => {
        const distance = Math.abs(towerX - 50 - enemy.x)
        if (distance < lowestDistance && enemy.yFrame !== 1) {
          lowestDistance = distance
          nearestEnemy = enemy
        }
      })
      return nearestEnemy
    }

    // Fire interval
    this.fireId = setInterval(() => {
      this.floors.forEach(floor => {
        if (this.enemies.length) {
          floor.fire(nearestEnemy())
        }
      });
    }, 500)

    // Enemy damage check interval
    this.damageId = setInterval(() => {
      this.enemies.forEach(enemy => {
        if (enemy.doingDamage) {
          this.towerHealth -= enemy.damage
          document.getElementById("towerHealth").innerHTML = `Health: ${this.towerHealth}`
        }
      });
      if (this.towerHealth <= 0) {
        const current = this.round
        if (current > best)
          localStorage.setItem("best", current)
        this.gameOver()
      }
    }, 125)
    this.updateUi()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  draw() {
    this.background.draw()
    this.floors.forEach((floor, index) => {
      floor.draw(index);
    })
    this.enemies.forEach(obstacle => {
      obstacle.draw();
    })
  }

  move() {
    this.enemies.forEach(obstacle => obstacle.move());
    this.floors.forEach(floor => floor.move());
  }

  addEnemy() {
    //const randomShape = Math.floor(Math.random() * 300 + 150)
    //const randomPosition = Math.floor(Math.random() * 300 + 150)

    let shapeArr = ["medusa", "lizard", "jihn"]
    if (this.round % 5 === 0) {
      shapeArr = ["demon", "small-dragon"]
    } else if (this.round > 5) {
      shapeArr = ["medusa", "lizard", "jihn", "demon"]
    }
    const randomShape = shapeArr[Math.floor(Math.random() * shapeArr.length)]

    const yArr = [345, 390, 435]
    const randomY = yArr[Math.floor(Math.random() * yArr.length)]

    const positionArr = ["left", "right"]
    const randomPosition = positionArr[Math.floor(Math.random() * positionArr.length)]

    const newEnemy = new Enemy(this.ctx, randomShape, randomPosition, randomY)

    this.roundPoints -= newEnemy.value
    this.enemies.push(newEnemy);
  }

  addFloor(shape) {
    const newFloor = new Floor(this.ctx, shape, this.floors.length)
    console.log("test1")
    if (this.gold > this.checkPrice(newFloor.shape) && this.floors.length < 4) {
      this.floors.push(newFloor);
      this.gold -= 200
      this.updateUi()
    }
  }

  checkPrice(floor) {
    let price
    switch (floor) {
      case "cannon":
        price = 200 + 500 * this.floors.length
        break;
      case "ballista":
        price = 300 + 500 * this.floors.length
        break;
      case "blaster":
        price = 300 + 500 * this.floors.length
        break;
      case "catapult":
        price = 500 + 500 * this.floors.length
        break;
      default:
        break;
    }
    return price
  }

  updateUi() {
    const best = localStorage.getItem("best")
    this.floors.length >= 4 ? document.getElementById("floor-3-data").innerHTML = ` Floor 3: ${this.floors[3].shape}` : "Empty"
    this.floors.length >= 3 ? document.getElementById("floor-2-data").innerHTML = ` Floor 2: ${this.floors[2].shape}` : "Empty"
    this.floors.length >= 2 ? document.getElementById("floor-1-data").innerHTML = ` Floor 1: ${this.floors[1].shape}` : "Empty"
    this.floors.length >= 1 ? document.getElementById("floor-0-data").innerHTML = ` Floor 0: ${this.floors[0].shape}` : "Not floors yet"

    if (this.floors.length === 4) {
      const element = document.getElementById("floor-3")
      element.style.visibility = "visible"
    } else if (this.floors.length === 3) {
      const element = document.getElementById("floor-2")
      element.style.visibility = "visible"
    } else if (this.floors.length === 2) {
      const element = document.getElementById("floor-1")
      element.style.visibility = "visible"
    } else if (this.floors.length === 1) {
      const element = document.getElementById("floor-0")
      element.style.visibility = "visible"
    }

    document.getElementById("cannon").innerHTML = ` ${this.checkPrice("cannon")}`
    document.getElementById("ballista").innerHTML = ` ${this.checkPrice("ballista")}`
    document.getElementById("blaster").innerHTML = ` ${this.checkPrice("blaster")}`
    document.getElementById("catapult").innerHTML = ` ${this.checkPrice("catapult")}`

    document.getElementById("towerHealth").innerHTML = `Health: ${this.towerHealth}`
    document.getElementById("gold").innerHTML = `Gold: ${this.gold}`
    document.getElementById("round").innerHTML = `Round: ${this.round}`
    document.getElementById("best").innerHTML = `Best: ${best ? best : 0}`
  }

  collisionLogic() {
    this.floors.forEach(floor => {
      floor.checkCollissions(this.enemies)
    });
  }

  shouldEnemyDie() {
    this.enemies.forEach(enemy => {
      if (enemy.yFrame === 1 && enemy.xFrame === (enemy.position === "left" ? 5 : enemy.horizontalFrames - enemy.getResetFrame() - 1)) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1)
        this.gold += enemy.value
        this.updateUi()
      }
    })
  }

  gameOver() {
    this.towerHealth = 0
    clearInterval(this.intervalId)
    clearInterval(this.damageId)
    clearInterval(this.fireId)

    this.ctx.save()

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.ctx.fillStyle = 'white'
    this.ctx.textAlign = 'center'
    this.ctx.font = 'bold 32px sans-serif'
    this.ctx.fillText('Game Over', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2)

    this.ctx.restore()
  }

  checkRound() {
    if (this.roundPoints > 0) {
      this.enemySpawnLogic()
    } else {
      this.newRound()
    }
  }

  enemySpawnLogic() {
    // add an enemy every ENEMY_FREQUENCY
    let ENEMY_FREQUENCY = 80 - this.round * 10;
    if (ENEMY_FREQUENCY < 20) {
      ENEMY_FREQUENCY = 20
    }
    if (this.enemyFramesCount % ENEMY_FREQUENCY === 0) {
      this.addEnemy();
      this.enemyFramesCount = 0;
    }
    this.enemyFramesCount++;
  }

  newRound() {
    if (!this.changindRound) {
      this.changindRound = true
      // Timeout entre rondas
      setTimeout(() => {
        this.changindRound = false
        this.round++
        document.getElementById("round").innerHTML = `Round: ${this.round}`
        this.roundPoints = 100 + 20 * this.round
      }, 5000);
    }
  }

  sortFloors(message) {
    switch (message) {
      case "3-down":
        let temp5 = this.floors[2]
        this.floors[2] = this.floors[3]
        this.floors[3] = temp5
        this.floors[2].y += 112
        this.floors[3].y -= 112
        break;
      case "2-up":
        let temp4 = this.floors[2]
        this.floors[2] = this.floors[3]
        this.floors[3] = temp4
        this.floors[2].y += 112
        this.floors[3].y -= 112
        break;
      case "2-down":
        let temp3 = this.floors[1]
        this.floors[1] = this.floors[2]
        this.floors[2] = temp3
        this.floors[1].y += 112
        this.floors[2].y -= 112
        break;
      case "1-up":
        let temp2 = this.floors[1]
        this.floors[1] = this.floors[2]
        this.floors[2] = temp2
        this.floors[1].y += 112
        this.floors[2].y -= 112
        break;
      case "1-down":
        let temp1 = this.floors[0]
        this.floors[0] = this.floors[1]
        this.floors[1] = temp1
        this.floors[0].y += 112
        this.floors[1].y -= 112
        break;
      case "0-up":
        let temp0 = this.floors[0]
        this.floors[0] = this.floors[1]
        this.floors[1] = temp0
        this.floors[0].y += 112
        this.floors[1].y -= 112
        break;
      default:
        break;
    }
    this.updateUi()
  }

}