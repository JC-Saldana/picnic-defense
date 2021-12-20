class Game {
  constructor(ctx) {
    this.ctx = ctx

    this.background = new Background(ctx)
    this.intervalId = null
    this.damageId = null
    this.gold = 500
    this.round = 0
    this.roundPoints = 0
    this.towerHealth = 150
    this.changindRound = false

    // obstacle
    this.enemies = [];
    this.floors = [];
    this.enemyFramesCount = 0;
    this.fireFramesCount = 0;

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
        this.fire()
      }, 1000 / 60)
    }

    // Enemy damage check interval
    this.damageId = setInterval(() => {
      this.enemies.forEach(enemy => {
        if (enemy.doingDamage) {
          this.towerHealth -= enemy.damage
          this.updateUi()
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

  nearestEnemy = () => {
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

  fire() {
    this.floors.forEach(floor => {
      if (this.enemies.length) {
        floor.fire(this.nearestEnemy())
      }
    });

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
    const extraHp = this.round * 10
 
    const newEnemy = new Enemy(this.ctx, randomShape, randomPosition, randomY, extraHp)

    this.roundPoints -= newEnemy.value
    this.enemies.push(newEnemy);
  }

  addFloor(shape) {
    const newFloor = new Floor(this.ctx, shape, this.floors.length)
    if (this.gold >= this.checkPrice(newFloor.shape) && this.floors.length < 4) {
      this.gold -= this.checkPrice(newFloor.shape)
      this.floors.push(newFloor);
      this.updateUi()
    }
  }

  checkPrice(floor) {
    let price
    switch (floor) {
      case "cannon":
        price = 400 + 300 * this.floors.length
        break;
      case "ballista":
        price = 200 + 300 * this.floors.length
        break;
      case "blaster":
        price = 200 + 300 * this.floors.length
        break;
      case "catapult":
        price = 300 + 300 * this.floors.length
        break;
      default:
        break;
    }
    return price
  }

  updateUi() {
    const best = localStorage.getItem("best")
    this.floors.length >= 4 ? document.getElementById("floor-3-data").innerHTML = ` Lvl ${this.floors[3].lvl} ${this.floors[3].shape} ` : document.getElementById("floor-3-data").innerHTML = null
    this.floors.length >= 3 ? document.getElementById("floor-2-data").innerHTML = ` Lvl ${this.floors[2].lvl} ${this.floors[2].shape} ` : document.getElementById("floor-2-data").innerHTML = null
    this.floors.length >= 2 ? document.getElementById("floor-1-data").innerHTML = ` Lvl ${this.floors[1].lvl} ${this.floors[1].shape} ` : document.getElementById("floor-1-data").innerHTML = null
    this.floors.length >= 1 ? document.getElementById("floor-0-data").innerHTML = ` Lvl ${this.floors[0].lvl} ${this.floors[0].shape} ` : document.getElementById("floor-0-data").innerHTML = null

    this.floors.length >= 4 ? document.getElementById("3-upgrade").innerHTML = ` ${this.floors[3].lvl !== 3 ? this.floors[3].lvl * 2500 - 1500 : "max"}` : document.getElementById("3-upgrade").innerHTML = null
    this.floors.length >= 3 ? document.getElementById("2-upgrade").innerHTML = ` ${this.floors[2].lvl !== 3 ? this.floors[2].lvl * 2500 - 1500 : "max"}` : document.getElementById("2-upgrade").innerHTML = null
    this.floors.length >= 2 ? document.getElementById("1-upgrade").innerHTML = ` ${this.floors[1].lvl !== 3 ? this.floors[1].lvl * 2500 - 1500 : "max"}` : document.getElementById("1-upgrade").innerHTML = null
    this.floors.length >= 1 ? document.getElementById("0-upgrade").innerHTML = ` ${this.floors[0].lvl !== 3 ? this.floors[0].lvl * 2500 - 1500 : "max"}` : document.getElementById("0-upgrade").innerHTML = null

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
    } else if (this.floors.length === 0) {
      const floor3 = document.getElementById("floor-3")
      const floor2 = document.getElementById("floor-2")
      const floor1 = document.getElementById("floor-1")
      const floor0 = document.getElementById("floor-0")

      floor3.style.visibility = "hidden"
      floor2.style.visibility = "hidden"
      floor1.style.visibility = "hidden"
      floor0.style.visibility = "hidden"
    }

    document.getElementById("cannon").innerHTML = ` ${this.floors.length !== 4 ? this.checkPrice("cannon") : "max"}`
    document.getElementById("ballista").innerHTML = ` ${this.floors.length !== 4 ? this.checkPrice("ballista") : "max"}`
    document.getElementById("blaster").innerHTML = ` ${this.floors.length !== 4 ? this.checkPrice("blaster") : "max"}`
    document.getElementById("catapult").innerHTML = ` ${this.floors.length !== 4 ? this.checkPrice("catapult") : "max"}`

    document.getElementById("towerHealth").innerHTML = `<i class="fas fa-heart"></i> ${this.towerHealth}`
    document.getElementById("gold").innerHTML = `<i class="fab fa-bitcoin"></i> ${this.gold}`
    document.getElementById("round").innerHTML = `Round: ${this.round} (Best: ${best ? best : 0})`
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

    this.ctx.save()

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.ctx.fillStyle = 'white'
    this.ctx.textAlign = 'center'
    this.ctx.font = 'bold 32px sans-serif'
    this.ctx.fillText('Game Over', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2)

    this.ctx.restore()

    this.restart()
  }

  restart() {
    // Restart button
    const startButton = document.createElement("button")
    startButton.innerHTML = `<i class="fas fa-play"></i>`
    startButton.setAttribute("id", "start-button")
    startButton.setAttribute("class", "start-button")
    startButton.setAttribute("onclick", "game.start(); document.getElementById('start-button').remove()")
    document.getElementById("game-board").appendChild(startButton)


    clearInterval(this.intervalId)
    clearInterval(this.damageId)

    this.intervalId = null

    this.gold = 500
    this.round = 0
    this.roundPoints = 0
    this.towerHealth = 150
    this.changindRound = false

    this.enemies = [];
    this.floors = [];
    this.enemyFramesCount = 0;
    this.fireFramesCount = 0;

    this.updateUi()

    this.ctx.save()
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.restore()

  }

  checkRound() {
    if (this.roundPoints > 0) {
      this.enemySpawnLogic()
    } else if (!this.enemies.length) {
      this.newRound()
    }
  }

  enemySpawnLogic() {
    // add an enemy every ENEMY_FREQUENCY
    let ENEMY_FREQUENCY = 80 - this.round * 5;
    if (ENEMY_FREQUENCY < 10) {
      ENEMY_FREQUENCY = 10
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
        this.updateUi()
        this.roundPoints = 100 + 30 * this.round
      }, 2500);
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

  lvlFloor(floorIndex) {
    let floor = this.floors[floorIndex]
    if (floor.lvl < 3 && this.gold >= floor.lvl * 2500 - 1500) {
      this.gold -= floor.lvl * 2500 - 1500
      floor.lvl++
      floor.lvlUp()
      this.updateUi()
    }
  }

}