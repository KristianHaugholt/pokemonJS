const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionMap = []

for (let i = 0; i<collisions.length; i+=70){
    collisionMap.push(collisions.slice(i, i + 70))
}

const battleMap = []

for (let i = 0; i<battleData.length; i+=70){
    battleMap.push(battleData.slice(i, i + 70))
}

const offset = {
    x: -1070,
    y: -450
}

const boundaries = []

collisionMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025){
            boundaries.push(
                new Boundary({
                position:{
                    x: offset.x + j*Boundary.width,
                    y: offset.y + i*Boundary.height
                }
            }))
        }
    })
})

const battles = []

battleMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025){
            battles.push(
                new Boundary({
                    position:{
                        x: offset.x + j*Boundary.width,
                        y: offset.y + i*Boundary.height
                    }
                }))
        }
    })
})
console.log(battles)

c.fillRect(0,0,1024,576)

const backgroundImage = new Image()
backgroundImage.src = './img/Pokemonkart.png'

const foregroundImage = new Image()
foregroundImage.src = './img/PokemonTopplag.png'


const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'



const player = new Sprite({
    position: {
        x: canvas.width/2 - (192/4)/2,
        y: canvas.height/2 - 68/2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 21
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, ...battles , foreground]

function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.position.x +rectangle1.width >= rectangle2.position.x +4 &&
        rectangle1.position.x +4 <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height/2 <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y +4
    )
}

const fight = {
    initiated: false
}

function animate () {
    const animationID = window.requestAnimationFrame(animate)
    console.log(animationID)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battles.forEach(battle => {
        battle.draw()
    })

    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if (fight.initiated) return

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        for (let i = 0; i < battles.length; i++){
            const battle = battles[i]
            const overlappingArea = (Math.min(player.position.x + player.width, battle.position.x + battle.width)
                - Math.max(player.position.x, battle.position.x))
                * (Math.min(player.position.y + player.height, battle.position.y + battle.height)
                - Math.max(player.position.y, battle.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battle
                }) && overlappingArea > player.width * player.height / 2
                && Math.random() < 0.01
            ){
                //deactivate current animation
                window.cancelAnimationFrame(animationID)
                console.log('battle')
                fight.initiated = true

                gsap.to('#flashing', {
                    opacity: 1,
                    repeat: 6,
                    yoyo: true,
                    duration: 0.4,
                    onComplete(){
                        gsap.to('#flashing', {
                            opacity: 0,
                            duration: 0.4
                        })
                        //activate new animation
                        animateBattle()

                    }
                })
                break
            }
        }
    }


    if (keys.w.pressed && lastPressedKey === 'w'){
        player.animate = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            ){
                moving = false
                console.log('coll')
                break
            }
        }
        if (moving) {
            movables.forEach(movable =>{
                movable.position.y += 3
            })
            }
    }
    else if (keys.a.pressed && lastPressedKey === 'a'){
        player.animate = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }}
                })
            ){
                moving = false
                console.log('coll')
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x += 3
            })
        }
    }
    else if (keys.s.pressed && lastPressedKey === 's'){
        player.animate = true
        player.image = player.sprites.down

        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }}
                })
            ){
                moving = false
                console.log('coll')
                break
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.y -= 3
            })
        }
    }
    else if (keys.d.pressed && lastPressedKey === 'd'){
        player.animate = true
        player.image = player.sprites.right

        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }}
                })
            ){
                moving = false
                console.log('coll')
                break
            }
        }
        if (moving) {
            movables.forEach(movable =>{
                movable.position.x -= 3
            })
        }
    }
}

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'

const battleBackground = new Sprite({
    image: battleBackgroundImage,
    position: {
        x: 0,
        y: 0
    }
})

const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'

const draggle = new Sprite({
    image: draggleImage,
    position: {
        x: 800,
        y: 100
    },
    frames: {
        max: 4,
        hold: 35
    },
    animate: true
})

const embyImage = new Image()
embyImage.src = './img/embySprite.png'

const emby = new Sprite({
    image: embyImage,
    position: {
        x: 280,
        y: 325
    },
    frames: {
        max: 4,
        hold: 25
    },
    animate: true
})

function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    draggle.draw()
    emby.draw()

}

//animate()
animateBattle()

let lastPressedKey = ''

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastPressedKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastPressedKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastPressedKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastPressedKey = 'd'
            break
    }
})
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})