class Game {
  constructor(ctx) {
    this.ctx = ctx

    this.background = new Background(ctx)
    this.intervalId = undefined
    this.fireId = undefined
    this.gold = 0
    this.round = 0

    // obstacle
    this.enemies = [];
    this.floors = [];
    this.obstacleFramesCount = 0;

    //this.score = 0
  }

  start() {
    if (!this.intervalId) {

      this.intervalId = setInterval(() => {
        // add an enemy every ENEMY_FREQUENCY
        if (this.obstacleFramesCount % ENEMY_FREQUENCY === 0) {
          this.addEnemy();
          this.obstacleFramesCount = 0;
        }
        this.obstacleFramesCount++;
        this.clear()
        this.move()
        this.draw()
        collisionLogic()
      }, 1000 / 60)
    }

    const nearestEnemy = () => {
      let lowestDistance = 1000
      const towerX = this.ctx.canvas.width / 2
      let nearestEnemy = null
      this.enemies.forEach(e => {
        const distance = Math.abs(towerX - 50 - e.x)
        if (distance < lowestDistance) {
          lowestDistance = distance
          nearestEnemy = e
        }
      })
      return nearestEnemy
    }

    const collisionLogic = () => {
      this.floors.forEach(floor => {
        const enemyBeated = floor.checkCollissions(this.enemies)
        if (enemyBeated >= 0) {
          this.enemies.splice(enemyBeated, 1)
          this.gold += 10
          document.getElementById("gold").innerHTML = `Gold: ${this.gold}`
        }
      });
    }

    // Fire interval
    this.fireId = setInterval(() => {
      this.floors.forEach(floor => {
        if (this.enemies.length) {
          floor.fire(nearestEnemy())
        }
      });
    }, 800)
    document.getElementById("gold").innerHTML = `Gold: ${this.gold}`
    document.getElementById("round").innerHTML = `Round: ${this.round}`
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
    const yArr = [345, 390, 435]
    const positionArr = ["left", "right"]
    const randomY = yArr[Math.floor(Math.random() * yArr.length)]
    const randomPosition = positionArr[Math.floor(Math.random() * positionArr.length)]
    this.enemies.push(new Enemy(this.ctx, "skeleton", randomPosition, randomY));
  }

  addFloor(shape) {
    if (this.floors.length < 4) {
      this.floors.push(new Floor(this.ctx, shape, this.floors.length));
      //
    }
  }

  gameOver() {
    clearInterval(this.intervalId)

    this.ctx.save()

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    this.ctx.fillStyle = 'white'
    this.ctx.textAlign = 'center'
    this.ctx.font = 'bold 32px sans-serif'
    this.ctx.fillText('Game Over', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2)

    this.ctx.restore()
  }

}