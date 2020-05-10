import "./style.css"

const $color = document.querySelector('.color')
const $dots = document.querySelector('.dots')
const $rubber = document.querySelector('.rubber')
const $colorList = document.querySelector('.color-list')
const $canvas = document.querySelector('.canvas')
const ctx = $canvas.getContext('2d');


ctx.strokeStyle = "black"

$canvas.width = document.documentElement.clientWidth
$canvas.height = document.documentElement.clientHeight - 135
let mouseState = false
let lastLocation = [0, 0]

$canvas.onmousedown = (e) => {
    mouseState = true
    lastLocation = [e.clientX, e.clientY]
}

$canvas.onmouseup = () => {
    mouseState = false
}

$canvas.onmousemove = (e) => {

    if (mouseState) {
        ctx.beginPath()
        ctx.moveTo(lastLocation[0], lastLocation[1])
        console.log(lastLocation[0], lastLocation[1])
        ctx.lineTo(e.clientX, e.clientY)
        ctx.lineWidth = 10
        ctx.lineCap = 'round'
        ctx.stroke()
        lastLocation = [e.clientX, e.clientY]
    }
}


$dots.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) {
        for (let i = 0; i < e.currentTarget.children.length; i++) {
            let parent = e.currentTarget.children
            if (parent[i] != e.target) {
                parent[i].classList.remove('selected')
            } else {
                parent[i].classList.add('selected')
            }
        }

    }
})

$rubber.addEventListener('click', (e) => {
    e.currentTarget.classList.add('selected')
})

$colorList.addEventListener('click', (e) => {
    if (e.target != e.currentTarget) {
        $rubber.classList.remove('selected')
        for (let i = 0; i < e.currentTarget.children.length; i++) {
            let parent = e.currentTarget.children
            if (parent[i] === e.target) {
                e.target.classList.add('selected')
            } else {
                parent[i].classList.remove('selected')
            }
        }
    }
})

