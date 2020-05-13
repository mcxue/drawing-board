import "./components/reset.css"
import "./components/style.css"
import "./components/toolbar.css"
import "./components/canvas.css"

// 我原本想把 toolbar 和 canvas 的 JS 代码分成两个文件来写
// 但是 它们数据之间的通信用原生 JS 直接写貌似有些困难，所以就还是写在一起，假装是分开的
// toolbar 的 JS 代码，一直到第 67 行代码开始 canvas 的 JS 代码
const $colorShow = document.querySelector('.color-show')
const $brushList = document.querySelector('.brush-list')
const $rubber = document.querySelector('.rubber')
const $colorList = document.querySelector('.color-list')

let colorChoice = 'black'
let widthChoice = 15
let rubberChoice = false
let colorStore = ['black', 'red', '#ff5000', '#1AAD19', 'blue', '#8000ff', '#483D8D']
let widthStore = [20, 15, 10]

$colorShow.onclick = (e) => {
    e.currentTarget.classList.add('selected')
    $rubber.classList.remove('selected')
    rubberChoice = false
}

$brushList.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) {
        const temporary = e.currentTarget
        const brushList = temporary.children
        const brush = e.target
        for (let i = 0; i < brushList.length; i++) {
            if (brushList[i] !== brush) {
                brushList[i].classList.remove('selected')
            } else {
                brush.classList.add('selected')
                widthChoice = widthStore[i]
            }
        }

    }
})

$rubber.addEventListener('click', (e) => {
    let rubber = e.currentTarget
    rubber.classList.add('selected')
    $colorShow.classList.remove('selected')
    if (rubberChoice) {
        clearCanvas()
        rubberChoice = false
        rubber.classList.remove('selected')
        $colorShow.classList.add('selected')
    } else {
        rubberChoice = true
    }
})

$colorList.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) {
        $rubber.classList.remove('selected')
        $colorShow.classList.add('selected')
        const temporary = e.currentTarget
        const colorList = temporary.children
        let color = e.target
        for (let i = 0; i < colorList.length; i++) {
            if (colorList[i] === color) {
                color.classList.add('selected')
                colorChoice = colorStore[i]
                rubberChoice = false
                $colorShow.style.background = colorStore[i]
            } else {
                colorList[i].classList.remove('selected')
            }
        }
    }
})

// canvas 的 JS 代码
const $canvasWrapper = document.querySelector('.canvas-wrapper')
const $canvas = document.querySelector('.canvas')
const ctx = $canvas.getContext('2d');

let mouseState = false
let touchDevice = "ontouchend" in document;
let lastLocation

$canvas.width = $canvasWrapper.clientWidth
$canvas.height = $canvasWrapper.clientHeight

function drawLine(x1, y1, x2, y2) {
    ctx.lineWidth = widthChoice
    ctx.strokeStyle = colorChoice
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    lastLocation = [x2, y2]
}
function drawDot(x, y) {
    ctx.fillStyle = colorChoice
    ctx.beginPath()
    ctx.arc(x, y, widthChoice / 2, 0, 2 * Math.PI)
    ctx.fill()
}
function clearLine(x1, y1, x2, y2) {
    ctx.lineWidth = 30
    ctx.strokeStyle = 'white'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    lastLocation = [x2, y2]
}

function clearDot(x, y) {
    ctx.fillStyle = 'white'

    ctx.beginPath()
    ctx.arc(x, y, 15, 0, 2 * Math.PI)
    ctx.fill()
}

function clearCanvas() {
    $canvas.width = $canvasWrapper.clientWidth
    $canvas.height = $canvasWrapper.clientHeight
}

if (touchDevice) {
    $canvas.ontouchstart = (e) => {
        lastLocation = [e.touches[0].clientX, e.touches[0].clientY]
        if (rubberChoice) {
            clearDot(e.touches[0].clientX, e.touches[0].clientY)
        } else {
            drawDot(e.touches[0].clientX, e.touches[0].clientY)
        }
    }
    $canvas.ontouchmove = (e) => {
        if (rubberChoice) {
            clearLine(lastLocation[0], lastLocation[1], e.touches[0].clientX, e.touches[0].clientY)
        } else {
            drawLine(lastLocation[0], lastLocation[1], e.touches[0].clientX, e.touches[0].clientY)
        }
    }
} else {
    $canvas.onmousedown = (e) => {
        if (rubberChoice) {
            clearDot(e.clientX, e.clientY)
        } else {
            drawDot(e.clientX, e.clientY)
        }
        mouseState = true
        lastLocation = [e.clientX, e.clientY]
    }
    $canvas.onmouseup = () => {
        mouseState = false
    }
    $canvas.onmousemove = (e) => {
        if (mouseState) {
            if (rubberChoice) {
                clearLine(lastLocation[0], lastLocation[1], e.clientX, e.clientY)
            } else {
                drawLine(lastLocation[0], lastLocation[1], e.clientX, e.clientY)
            }
        }
    }
}