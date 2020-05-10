import "./style.css"

const $color = document.querySelector('.color')
const $dots = document.querySelector('.dots')
const $rubber = document.querySelector('.rubber')
const $colorList = document.querySelector('.color-list')

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
                console.log(e.target.classList)
            } else {
                parent[i].classList.remove('selected')
            }
        }
    }
})