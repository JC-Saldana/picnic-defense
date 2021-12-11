const canvas = document.getElementById('my-canvas')

const ctx = canvas.getContext('2d')

const game = new Game(ctx)

const button = document.getElementById('start-button')

button.onclick = () => {
  button.remove()
  game.start()
}

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
