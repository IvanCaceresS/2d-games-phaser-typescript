import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.setPath('assets'); // Establecemos la ruta base de los assets

        // INICIO CARGA DE SPRITES ---

        this.load.spritesheet('gato', 'gato.png', { 
            frameWidth: 80,    // 240px / 3 frames = 80px de ancho
            frameHeight: 64    // 64px de alto
        });

        this.load.spritesheet('tulipan', 'tulipan.png', {
            frameWidth: 32,    // 128px / 4 frames = 32px de ancho
            frameHeight: 80    // 160px / 2 filas = 80px de alto
        });
        // FIN CARGA DE SPRITES ---

        // INICIO CARGA DE IMÁGENES ---
        this.load.image('gameover_bg', 'gameover.png');
        this.load.image('fondo', 'bg.png');
        // FIN CARGA DE IMÁGENES ---

        // INICIO CARGA DE AUDIOS ---
        this.load.audio('sonido_salto', 'sounds/salto.mp3');
        this.load.audio('sonido_muerte', 'sounds/muerte.mp3');
        this.load.audio('sonido_musica', 'sounds/musica.mp3');
        this.load.audio('sonido_punto', 'sounds/punto.mp3');
        // FIN CARGA DE AUDIOS ---

    }

    create() {
        this.scene.start('MainMenu');
    }
}