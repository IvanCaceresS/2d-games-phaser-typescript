// src/game/scenes/EndScene.ts
import { Scene, GameObjects } from 'phaser';

export class EndScene extends Scene
{
    // Propiedades para guardar los datos recibidos
    private status: 'win' | 'lose';
    private word: string;
    private attempts: number;

    // Propiedad para el texto del contador
    private countdownText: GameObjects.Text;

    constructor ()
    {
        super('EndScene');
    }

    /**
     * Recibimos los datos de la GameScene
     */
    init(data: { status: 'win' | 'lose', word?: string, attempts?: number })
    {
        this.status = data.status;
        this.word = data.word || ''; // 'word' solo vendrá si se gana
        this.attempts = data.attempts || 0; // 'attempts' solo vendrá si se gana
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x121213); // Fondo oscuro
        
        // Fondo semi-transparente de la escena anterior (opcional)
        // this.add.image(512, 384, 'background').setAlpha(0.5);

        let titleText = '';
        let messageText = '';

        const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        };

        const messageStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'Arial', fontSize: 28, color: '#ffffff',
            align: 'center', wordWrap: { width: 600 }
        };

        if (this.status === 'win') {
            // REQ 11: Mensaje de victoria
            titleText = '¡FELICIDADES!';
            messageText = `Completaste la palabra del día\n'${this.word.toUpperCase()}'\nen ${this.attempts} intentos.`;
            titleStyle.color = '#538D4E'; // Verde
        } else {
            // REQ 10: Mensaje de derrota
            titleText = '¡INTÉNTALO MAÑANA!';
            messageText = 'No completaste la palabra del día.';
            titleStyle.color = '#B59F3B'; // Amarillo/Naranja
        }

        // Mostrar títulos
        this.add.text(512, 250, titleText, titleStyle).setOrigin(0.5);
        this.add.text(512, 350, messageText, messageStyle).setOrigin(0.5);

        // --- REQ 10 & 11: Contador ---
        this.countdownText = this.add.text(512, 450, 'Siguiente palabra en...', messageStyle)
            .setOrigin(0.5);

        // Iniciar el temporizador que actualiza el contador cada segundo
        this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });
        
        // Actualizar el contador una vez inmediatamente
        this.updateCountdown();

        // Ocultar teclado si está visible
        
        this.scene.get('UIScene').scene.setVisible(false);

        // --- Volver al menú ---
        this.add.text(512, 600, 'Toca para continuar', { ...messageStyle, fontSize: 20, color: '#999' }).setOrigin(0.5);
        
        this.input.once('pointerdown', () => {
            // Volvemos a la escena de selección de dificultad
            this.scene.start('DifficultyScene');
        });
    }

    /**
     * Calcula y muestra el tiempo restante hasta la medianoche (Req 10 y 11)
     */
    updateCountdown() {
        const now = new Date();
        
        // Crear un objeto Date para la medianoche de "mañana"
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        
        // Diferencia en segundos
        const diffSeconds = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);

        if (diffSeconds < 0) {
            this.countdownText.setText('Cargando...');
            return;
        }

        // Convertir a H:M:S
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;

        // Formatear (asegurando 2 dígitos)
        const hStr = hours.toString().padStart(2, '0');
        const mStr = minutes.toString().padStart(2, '0');
        const sStr = seconds.toString().padStart(2, '0');

        this.countdownText.setText(`Siguiente palabra en\n${hStr} horas ${mStr} minutos ${sStr} segundos.`);
    }
}