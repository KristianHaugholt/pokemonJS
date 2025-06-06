const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'

const battleBackground = new Sprite({
    image: battleBackgroundImage,
    position: {
        x: 0,
        y: 0
    }
})


let draggle = new Monster(monsters.Draggle)

let emby = new Monster(monsters.Emby)

let renderedSprites = [draggle, emby]

let queue

let battleAnimationID


function postFaint(){
    queue.push(() => {
        gsap.to('#flashing', {
            opacity: 1,
            onComplete: () => {
                cancelAnimationFrame(battleAnimationID)
                document.querySelector('#battleInfo').style.display = 'none'
                animate()
                gsap.to('#flashing', {
                    opacity: 0
                })
                fight.initiated = false
            }
        })
    })
}

function initBattle(){

    document.querySelector('#battleInfo').style.display = 'block'

    document.querySelector('#attackMessage').style.display = 'none'

    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#myHealthBar').style.width = '100%'

    document.querySelector('#attackBox').replaceChildren()

    draggle = new Monster(monsters.Draggle)

    emby = new Monster(monsters.Emby)

    renderedSprites = [draggle, emby]

    emby.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attackBox').append(button)
    })

    queue = []


    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            })

            if (draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint()
                })
                postFaint()
                return
            }

            let enemyAttack = 0
            if (Math.random() < 0.2){
                enemyAttack = 1
            }
            queue.push(() => {
                draggle.attack({
                    attack: draggle.attacks[enemyAttack],
                    recipient: emby,
                    renderedSprites
                })
            })
        })
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#typeBox').innerHTML = selectedAttack.type
            document.querySelector('#typeBox').style.backgroundColor = selectedAttack.color
        })
        button.addEventListener('mouseleave', (e) => {
            document.querySelector('#typeBox').innerHTML = 'Type'
            document.querySelector('#typeBox').style.backgroundColor = 'white'
        })
    })

}
function animateBattle(){
    battleAnimationID = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}


document.querySelector('#attackMessage').addEventListener('click', (e) => {
    if (emby.health <= 0) {
        queue.push(() => {
            emby.faint()
        })
        postFaint()
    }
    if (queue.length > 0){
        queue[0]()
        queue.shift()
    }
    else e.currentTarget.style.display = 'none'
})