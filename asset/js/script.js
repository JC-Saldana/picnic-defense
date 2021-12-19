const canvas = document.getElementById('my-canvas')

const ctx = canvas.getContext('2d')

const game = new Game(ctx)

const startButton = document.getElementById('start-button')

startButton.addEventListener('click', () => {
  startButton.remove()
  game.start()
})
document.getElementById("ballista").addEventListener('click', () => {
  game.addFloor("ballista")
})
document.getElementById("blaster").addEventListener('click', () => {
  game.addFloor("blaster")
})
document.getElementById("cannon").addEventListener('click', () => {
  game.addFloor("cannon")
})
document.getElementById("catapult").addEventListener('click', () => {
  game.addFloor("catapult")
})

document.getElementById("3-down").addEventListener('click', () => {
  game.sortFloors("3-down")
})
document.getElementById("2-down").addEventListener('click', () => {
  game.sortFloors("2-down")
})
document.getElementById("2-up").addEventListener('click', () => {
  game.sortFloors("2-up")
})
document.getElementById("1-up").addEventListener('click', () => {
  game.sortFloors("1-up")
})
document.getElementById("1-down").addEventListener('click', () => {
  game.sortFloors("1-down")
})
document.getElementById("0-up").addEventListener('click', () => {
  game.sortFloors("0-up")
})
document.getElementById("3-upgrade").addEventListener('click', () => {
  game.lvlFloor(3)
})
document.getElementById("2-upgrade").addEventListener('click', () => {
  game.lvlFloor(2)
})
document.getElementById("1-upgrade").addEventListener('click', () => {
  game.lvlFloor(1)
})
document.getElementById("0-upgrade").addEventListener('click', () => {
  game.lvlFloor(0)
})
