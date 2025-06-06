const monsters = {
    Emby: {
        image: {
            src: './img/embySprite.png'
        },
        position: {
            x: 280,
            y: 325
        },
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        name: 'emby',
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Draggle: {
        image: {
            src: './img/draggleSprite.png'
        },
        position: {
            x: 800,
            y: 100
        },
        frames: {
            max: 4,
            hold: 35
        },
        animate: true,
        isEnemy: true,
        name: 'draggle',
        attacks: [attacks.Tackle, attacks.Fireball]
    }
}