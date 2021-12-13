class Game {
  constructor(ctx) {
    this.ctx = ctx

    this.background = new Background(ctx)
    this.intervalId = null
    this.fireId = null
    this.damageId = null
    this.gold = 0
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
          console.log(this.towerHealth)
        }
      });
      if (this.towerHealth <= 0) {
        const current = this.round
        if(current > best)
        localStorage.setItem("best", current)
        this.gameOver()
      }
    }, 125)
    document.getElementById("towerHealth").innerHTML = `Health: ${this.towerHealth}`
    document.getElementById("gold").innerHTML = `Gold: ${this.gold}`
    document.getElementById("round").innerHTML = `Round: ${this.round}`
    document.getElementById("best").innerHTML = `Best: ${best ? best : 0}`
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  draw() {
    this.background.draw()
    this.floors.forEach(floor => {
      floor.draw();
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

    const shapeArr = ["medusa", "lizard"]
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
    if (this.floors.length < 4) {
      this.floors.push(new Floor(this.ctx, shape, this.floors.length));
      //
    }
  }

  collisionLogic() {
    this.floors.forEach(floor => {
      const enemyBeated = floor.checkCollissions(this.enemies)
      if (enemyBeated >= 0) {
        this.gold += enemyBeated.value
        document.getElementById("gold").innerHTML = `Gold: ${this.gold}`
      }
    });
  }

  shouldEnemyDie() {
    this.enemies.forEach(enemy => {
      if (enemy.yFrame === 1 && enemy.xFrame === 5) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1)
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
      }, 3000);
    }
  }

}