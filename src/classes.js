class Sprite {
    constructor({image, position, frames = {max: 1, hold: 20},
                    sprites = [], animate = false}) {
        this.image = image
        this.position = position
        this.frames = {...frames, val: 0, elapsed: 0}
        this.sprites = sprites

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.animate = animate
    }
    draw() {
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