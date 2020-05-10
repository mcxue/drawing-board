import "./style.css"

const $color = document.querySelector('.color')
const $dots = document.querySelector('.dots')
const $rubber = document.querySelector('.rubber')
const $colorList = document.querySelector('.color-list')
const $canvas = document.querySelector('.canvas')
const ctx = $canvas.getContext('2d');


let mouseState = false
let lastLocation
let touchDevice = "ontouchend" in document ? true : false;

let widthChoice = 1
let rubberChoice = false
let colorChoice = 0
let colorStore = ['black', 'red', '#ff5000', '#1AAD19', 'blue', '#8000ff', '#483D8D']
let widthStore = ['20', '15', '10']


$canvas.width = document.documentElement.clientWidth
$canvas.height = document.documentElement.clientHeight - 135

if (touchDevice) {
    $canvas.ontouchstart = (e) => {
        lastLocation = [e.touches[0].clientX, e.touches[0].clientY]
    }
    $canvas.ontouchmove = (e) => {
        if (rubberChoice) {
            ctx.clearRect(e.touches[0].clientX, e.touches[0].clientY, 30, 30)
        } else {
            ctx.beginPath()
            ctx.moveTo(lastLocation[0], lastLocation[1])
            ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY)
            ctx.lineWidth = widthStore[widthChoice]
            ctx.strokeStyle = colorStore[colorChoice]
            ctx.lineCap = 'round'
            ctx.stroke()
            lastLocation = [e.touches[0].clientX, e.touches[0].clientY]
        }
    }
} else {
    $canvas.onmousedown = (e) => {
        mouseState = true
        lastLocation = [e.clientX, e.clientY]
    }

    $canvas.onmouseup = () => {
        mouseState = false
    }

    $canvas.onmousemove = (e) => {

        if (mouseState) {
            if (rubberChoice) {
                ctx.clearRect(e.clientX, e.clientY, 30, 30)
            } else {
                ctx.beginPath()
                ctx.moveTo(lastLocation[0], lastLocation[1])
                ctx.lineTo(e.clientX, e.clientY)
                ctx.lineWidth = widthStore[widthChoice]
                ctx.strokeStyle = colorStore[colorChoice]
                ctx.lineCap = 'round'
                ctx.stroke()
                lastLocation = [e.clientX, e.clientY]
            }

        }
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
                widthChoice = i
            }
        }

    }
})

$rubber.addEventListener('click', (e) => {
    e.currentTarget.classList.add('selected')
    rubberChoice = true
})

$colorList.addEventListener('click', (e) => {
    if (e.target != e.currentTarget) {
        $rubber.classList.remove('selected')
        for (let i = 0; i < e.currentTarget.children.length; i++) {
            let parent = e.currentTarget.children
            if (parent[i] === e.target) {
                e.target.classList.add('selected')
                colorChoice = i
                rubberChoice = false
                $color.style.background = colorStore[colorChoice]
            } else {
                parent[i].classList.remove('selected')
            }
        }
    }
})

