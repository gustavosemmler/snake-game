var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")

var score = document.querySelector(".score--value")
var finalScore = document.querySelector(".final-score > span")
var menu = document.querySelector(".menu-screen")
var buttonPlay = document.querySelector(".btn-play")

const audio = new Audio('assets/audio.mp3')

var size = 30

const initialPosition = {x: 270, y: 240}

let snake = [{x: 270, y: 240}]

var incrementScore = () => {
    score.innerText = +score.innerText + 10
}

var randonNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

var randonPosition = () => {
    const number = randonNumber(0, canvas.width-size)
    return Math.round(number / 30) * 30
}

var randomColor = () => {
    const red = randonNumber(0, 255)
    const green = randonNumber(0, 255)
    const blue = randonNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

var food = {
    x: randonPosition(),
    y: randonPosition(),
    color: randomColor()
}

let direction
let LoopId

var drawFood = () => {

    var{x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}

var drawSnake = () => {
    ctx.fillStyle = "#ddd"
   
    snake.forEach((position, index) => {

        if(index == snake.length - 1) {
            ctx.fillStyle = 'white'
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

var moveSnake = () => {
if(!direction) return
    var head = snake[snake.length - 1]

    snake.shift()

    if (direction == "right"){
        snake.push ({ x: head.x + size, y: head.y })
    }
    if (direction == "left"){
        snake.push ({ x: head.x - size, y: head.y })
    }

    if (direction == "down"){
        snake.push ({ x: head.x, y: head.y + size })
    }

    if (direction == "up"){
        snake.push ({ x: head.x, y: head.y - size })
    }
}

var drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#97d196"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }

   
}   

var chackeat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

       let x = randonPosition()
       let y = randonPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
        x = randonPosition()
        y = randonPosition()
        }

        food.x=x
        food.y=y
        food.color = randomColor()

    }
}

var checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2
    const wallCollision = head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

var gameOver = () => {
    direction = undefined
    
    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}

const gameLoop = () => {
    clearInterval (LoopId)
    
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chackeat()
    checkCollision()
    LoopId = setTimeout(() => {
        gameLoop()
    }, 100);
}


gameLoop()

document.addEventListener("keydown", ({key}) => {

    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "Up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})
