// src/game/scenes/DifficultyScene.ts
import { Scene, GameObjects } from 'phaser';

export class DifficultyScene extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        // Asegúrate de que la clave coincide con la de main.ts
        super('DifficultyScene');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5); // Fondo semitransparente

        this.title = this.add.text(512, 200, 'LA PALABRA DEL DÍA', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // --- Crear los 3 botones de dificultad ---
        this.createButton(350, 'FÁCIL (5 LETRAS)', 5);
        this.createButton(450, 'NORMAL (7 LETRAS)', 7);
        this.createButton(550, 'DIFÍCIL (9 LETRAS)', 9);
    }

    /**
     * Función helper para crear los botones
     */
    createButton(y: number, text: string, difficulty: number) {
        
        const buttonStyle = {
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            color: '#ffffff',
            backgroundColor: '#3A3A3C', // Gris oscuro
            stroke: '#000000', 
            strokeThickness: 4,
            align: 'center',
            padding: { x: 20, y: 10 }
        };

        const button = this.add.text(512, y, text, buttonStyle)
            .setOrigin(0.5)
            .setInteractive(); // Hacerlo clickeable

        // --- Efectos visuales del botón ---
        
        // Al pasar el mouse por encima (hover)
        button.on('pointerover', () => {
            button.setBackgroundColor('#538D4E'); // Verde (como en "green" status)
        });

        // Al quitar el mouse
        button.on('pointerout', () => {
            button.setBackgroundColor('#3A3A3C'); // Gris oscuro
        });

        // --- Acción de Click ---
        button.on('pointerdown', () => {
            
            // Iniciar la escena 'Game' y pasarle la dificultad
            // El 'data' { difficulty: difficulty } es la clave
            this.scene.start('Game', { difficulty: difficulty });

        });
    }
}