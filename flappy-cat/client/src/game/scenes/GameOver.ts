import { Scene } from 'phaser';

export class GameOver extends Scene {
    
    private currentScore: number = 0;
    private highScores: { name: string, score: number }[] = [];
    private promptText!: Phaser.GameObjects.Text;
    private yesButton!: Phaser.GameObjects.Text;
    private noButton!: Phaser.GameObjects.Text;
    private nameInput!: Phaser.GameObjects.DOMElement;
    private saveButton!: Phaser.GameObjects.Text;
    private scoreListGroup!: Phaser.GameObjects.Group;
    private errorText!: Phaser.GameObjects.Text;

    constructor() {
        super('GameOver');
    }

    init(data: { score: number }) {
        this.currentScore = data.score || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.image(0, 0, 'gameover_bg')
            .setOrigin(0, 0)
            .setDisplaySize(width, height);

        // Título de Game Over
        this.add.text(width / 2, height / 2 - 250, '¡MIAU! (Has perdido)', {
            fontFamily: 'Arial', fontSize: 48, color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // PUNTUACIÓN OBTENIDA
        this.add.text(width / 2, height / 2 - 200, `Tu puntuación: ${this.currentScore}`, {
            fontFamily: 'Arial', fontSize: 32, color: '#222222'
        }).setOrigin(0.5);

        // CARGA DE PUNTUACIONES DESDE EL BACKEND
        this.scoreListGroup = this.add.group();
        this.fetchHighScores();

        // CARGA DEL FORMULARIO DE GUARDADO
        this.createSaveForm();

        // MOSTRAR PREGUNTA DE GUARDADO SOLO SI HUBO PUNTOS
        if (this.currentScore > 0) {
            this.showSavePrompt();
        } else {
            this.showRestartButton('Volver al Menú');
        }
    }

    // INICIO FUNCIÓN MOSTRAR PREGUNTA DE GUARDADO ---
    showSavePrompt() {
        const { width, height } = this.cameras.main;

        this.promptText = this.add.text(width / 2, height - 150, '¿Quieres guardar tu puntaje?', {
            fontSize: 24, color: '#333333'
        }).setOrigin(0.5);

        // Botón "SÍ"
        this.yesButton = this.add.text(width / 2 - 80, height - 100, 'SÍ', {
            fontSize: 24, color: '#00FF00', backgroundColor: '#333'
        })
        .setOrigin(0.5).setPadding(10).setInteractive();

        // Botón "NO"
        this.noButton = this.add.text(width / 2 + 80, height - 100, 'NO', {
            fontSize: 24, color: '#FF0000', backgroundColor: '#333'
        })
        .setOrigin(0.5).setPadding(10).setInteractive();

        // --- Lógica de Clics ---
        this.yesButton.on('pointerdown', () => {
            // Ocultar la pregunta
            this.promptText.setVisible(false);
            this.yesButton.setVisible(false);
            this.noButton.setVisible(false);
            // Mostrar el formulario
            this.showFormElements(true);
        });

        this.noButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
    // FIN FUNCIÓN MOSTRAR PREGUNTA DE GUARDADO ---

    // INICIO FUNCIÓN CREAR FORMULARIO DE GUARDADO ---
    createSaveForm() {
        const { width, height } = this.cameras.main;

        // El Input HTML
        this.nameInput = this.add.dom(
            width / 2,
            height - 150,
            'input',
            {
                type: 'text',
                placeholder: 'INICIALES (3-5)',
                style: `width: 200px; padding: 10px; font-size: 16px; text-transform: uppercase;`
            }
        ).setOrigin(0.5);
        
        // --- Forzar Mayúsculas y 5 Caracteres ---
        (this.nameInput.node as HTMLInputElement).maxLength = 5;
        this.nameInput.on('input', (event: any) => {
            let input = event.target as HTMLInputElement;
            let upperValue = input.value.toUpperCase();
            let cleanValue = upperValue.replace(/[^A-Z0-9Ñ]/g, ''); // Reemplazar cualquier cosa que NO sea A-Z, 0-9, o Ñ
            input.value = cleanValue;
        });

        // El botón "Guardar" de Phaser
        this.saveButton = this.add.text(width / 2, height - 100, 'Guardar', {
            fontSize: 24, color: '#00FF00', backgroundColor: '#333'
        })
        .setOrigin(0.5).setPadding(10).setInteractive();

        // Texto para errores
        this.errorText = this.add.text(width / 2, height - 70, '', {
            fontSize: 16, color: '#ff0000'
        }).setOrigin(0.5);

        // Lógica del botón "Guardar"
        this.saveButton.on('pointerdown', () => {
            const name = (this.nameInput.node as HTMLInputElement).value;
            if (name.length >= 3 && name.length <= 5) {
                this.errorText.setText('');
                this.saveScore(name, this.currentScore);
            } else {
                this.errorText.setText('Debe tener entre 3 y 5 letras');
            }
        });

        // Ocultar todo al inicio
        this.showFormElements(false);
    }
    // FIN FUNCIÓN CREAR FORMULARIO DE GUARDADO ---

    // INICIO FUNCIÓN MOSTRAR/OCULTAR ELEMENTOS DEL FORMULARIO ---
    showFormElements(visible: boolean) {
        this.nameInput.setVisible(visible);
        this.saveButton.setVisible(visible);
        this.errorText.setVisible(visible);
    }
    // FIN FUNCIÓN MOSTRAR/OCULTAR ELEMENTOS DEL FORMULARIO ---

    // INICIO FUNCIÓN MOSTRAR BOTÓN DE REINICIAR ---
    showRestartButton(text: string) {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, text, {
            fontSize: 24, color: '#ffffff', backgroundColor: '#333'
        })
        .setOrigin(0.5).setPadding(10).setInteractive()
        .on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
    // FIN FUNCIÓN MOSTRAR BOTÓN DE REINICIAR ---
    
    // INICIO FUNCIÓN CARGAR PUNTUACIONES DESDE EL BACKEND ---
    async fetchHighScores() {
        try {
            const response = await fetch('http://159.112.129.245:3000/score');
            if (!response.ok) throw new Error('No se pudieron cargar las puntuaciones');
            
            this.highScores = await response.json() as { name: string, score: number }[];
            
            this.drawHighScores();

        } catch (error) {
            console.error('Error fetching scores:', error);
            this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'No se pudo conectar al servidor', {
                fontSize: 20, color: '#ff0000'
            }).setOrigin(0.5);
        }
    }
    // FIN FUNCIÓN CARGAR PUNTUACIONES DESDE EL BACKEND ---

    // INICIO FUNCIÓN DIBUJAR PUNTUACIONES EN PANTALLA ---
    drawHighScores() {
        this.scoreListGroup.clear(true, true);

        const { width, height } = this.cameras.main;

        const title = this.add.text(width / 2, height / 2 - 100, 'Mejores Puntuaciones', {
            fontFamily: 'Arial', fontSize: 28, color: '#FFD700',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.scoreListGroup.add(title);

        let yPos = height / 2 - 60;
        this.highScores.forEach((entry, index) => {
            const nameText = this.add.text(width / 2 - 100, yPos, `${index + 1}. ${entry.name}`, {
                fontSize: 20, color: '#333333'
            }).setOrigin(0, 0.5);

            const scoreText = this.add.text(width / 2 + 100, yPos, entry.score.toString(), {
                fontSize: 20, color: '#333333'
            }).setOrigin(1, 0.5);

            this.scoreListGroup.add(nameText);
            this.scoreListGroup.add(scoreText);

            yPos += 30;
        });
    }
    // FIN FUNCIÓN DIBUJAR PUNTUACIONES EN PANTALLA ---


    // INICIO FUNCIÓN GUARDAR PUNTUACIÓN EN EL BACKEND ---
    async saveScore(name: string, score: number) {
        try {
            const response = await fetch('http://159.112.129.245:3001/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, score }),
            });

            if (!response.ok) throw new Error('Error al guardar');

            this.showFormElements(false);
            await this.fetchHighScores();
            this.showRestartButton('¡Guardado! Volver al Menú');

        } catch (error) {
            console.error('Error saving score:', error);
            this.errorText.setText('Error del servidor. Intenta de nuevo.');
        }
    }
    // FIN FUNCIÓN GUARDAR PUNTUACIÓN EN EL BACKEND ---
}