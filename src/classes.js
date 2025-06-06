class Sprite {
    constructor({image, position,
                    frames = {max: 1, hold: 20},
                    sprites = [],
                    animate = false,
                    rotation = 0,
    }) {
        this.image = new Image()
        this.position = position
        this.frames = {...frames, val: 0, elapsed: 0}
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
    }
    draw() {
        c.save()
        c.translate(this.position.x + this.width/2, this.position.y + this.height/2)
        c.rotate(this.rotation)
        c.translate(-this.position.x - this.width/2, -this.position.y - this.height/2)

        c.globalAlpha = this.opacity
        c.drawImage(this.image,
            this.frames.val * this.width,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        )
        c.restore()

        if (!this.animate) return
        if (this.frames.max >1) this.frames.elapsed++
        if (this.frames.elapsed % this.frames.hold !== 0) return
        if (this.frames.val < this.frames.max -1){
            this.frames.val ++
        }
        else {
            this.frames.val = 0
        }
    }
}

class Monster extends Sprite{
    constructor({
                    image,
                    position,
                    frames = {max: 1, hold: 20},
                    sprites = [],
                    animate = false,
                    rotation = 0,
                    name= '',
                    isEnemy = false,
                    attacks
                }) {
        super({
            image,
            position,
            frames,
            sprites,
            animate,
            rotation
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint(){
        document.querySelector('#attackMessage').innerHTML = this.name + ' fainted'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }

    attack({attack, recipient, renderedSprites}) {
        document.querySelector('#attackMessage').style.display = 'block'
        document.querySelector('#attackMessage').innerHTML = this.name + ' used ' + attack.name

        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) healthBar = '#myHealthBar'

        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        let rotation = 0.8
        if (this.isEnemy) rotation = 3.94

        const tl = gsap.timeline()

        switch (attack.name) {
            case 'Tackle':
                recipient.health -= attack.damage
                tl.to(this.position, {
                    x: this.position.x - movementDistance,
                    duration: 0.3
                }).to(this.position, {
                    x: this.position.x + 2 * movementDistance,
                    duration: 0.07,
                    oncomplete: () => {
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + movementDistance / 2,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.1
                        })
                        gsap.to(recipient, {
                            opacity: 0.3,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.1
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break
            case 'Fireball':
                recipient.health -= attack.damage
                const fireballImage = new Image()
                fireballImage.src = './img/fireball.png'

                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    frames: {
                        max: 4,
                        hold: 4
                    },
                    image: fireballImage,
                    animate: true,
                    rotation: rotation
                })
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        renderedSprites.splice(1, 1)
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + movementDistance / 2,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.1
                        })
                        gsap.to(recipient, {
                            opacity: 0.3,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.1
                        })
                    }
                })
                break
        }
    }
}


class Boundary{
    static width = 48
    static height = 48
    constructor({position}){
        this.position = position
        this.height = 48
        this.width = 48
    }
    draw(){
        c.fillStyle = 'rgba(255, 0,0,0.2)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}