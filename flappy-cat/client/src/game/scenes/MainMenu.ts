import { Scene } from 'phaser';

export class MainMenu extends Scene {
    private background!: Phaser.GameObjects.TileSprite;
    constructor() {
        super('MainMenu');
    }

    create() {
        // INICIO FONDO ANIMADO ---
        const { width, height } = this.cameras.main;
        this.background = this.add.tileSprite(0, 0, width, height, 'fondo')
            .setOrigin(0, 0);
        console.log('¡MainMenu CREATE se ha ejecutado!');
        // FIN FONDO ANIMADO ---

        // INICIO MÚSICA DE FONDO ---
        let music = this.sound.get('sonido_musica');
        if (!music) {
            music = this.sound.add('sonido_musica', { 
                loop: true, 
                volume: 0.4,
            });
            music.play();
        } else if (!music.isPlaying) {
            music.play();
        }
        // FIN MÚSICA DE FONDO ---

        // INICIO TEXTO BOTÓN DE INICIO ---
        const startButton = this.add.text(
            this.cameras.main.width / 2, 
            this.cameras.main.height / 2, 
            'Haz clic para empezar', 
            {
                fontFamily: 'Arial', 
                fontSize: 48, 
                color: '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5);

        startButton.setInteractive();

        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#FF0' });
            this.input.setDefaultCursor('pointer');
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#ffffff' });
            this.input.setDefaultCursor('default');
        });

        startButton.on('pointerdown', () => {
            this.input.setDefaultCursor('default');
            this.scene.start('Game');
        });
        // FIN TEXTO BOTÓN DE INICIO ---
    }

    update() {
        this.background.tilePositionX += 0.5; // Velocidad de desplazamiento del fondo
    }
}