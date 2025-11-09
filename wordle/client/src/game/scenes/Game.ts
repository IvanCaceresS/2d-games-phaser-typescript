import { Scene, GameObjects, Cameras } from 'phaser';
import { StateManager } from '../StateManager';

// Interfaz para la respuesta del API (Req 7 y 8)
interface ILetterStatus {
  letter: string;
  status: 'green' | 'yellow' | 'gray';
}

// Interfaz para los datos de la cookie (Req 5)
interface IDailyProgress {
  guesses: string[];
  status: 'pending' | 'win' | 'lose';
}

// Interfaz para los datos que se pasan a esta escena
interface IGameData {
  difficulty: number;
  previousState: IDailyProgress;
}

type CheckWordResponse =
  | { status: 'ok'; result: ILetterStatus[] }
  | { status: 'invalid_word' };

export class Game extends Scene
{
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    
    private stateManager: StateManager;
    private dailyState: IDailyProgress;
    
    private grid: GameObjects.Text[][] = []; // El tablero
    private currentRow = 0;
    private currentCol = 0;
    private difficulty: number = 5;
    private isChecking = false; // Bloquea la entrada

    constructor ()
    {
        super('Game');
        // Inicializamos el manager en el constructor
        this.stateManager = new StateManager();
    }

    /**
     * init se ejecuta ANTES de create()
     * Aquí recibimos los datos pasados desde DifficultyScene
     */
    init(data: IGameData) 
    {
        this.difficulty = data.difficulty || 5;
        // Obtenemos el estado de HOY para esta dificultad
        this.dailyState = this.stateManager.getDailyState(this.difficulty);
    }

    create ()
    { 
        if (this.dailyState.status !== 'pending') {
            
            // Preparamos los datos para la EndScene
            const sceneData: { status: 'win' | 'lose', word?: string, attempts?: number } = { 
                status: this.dailyState.status 
            };

            // Si ganó, necesitamos saber la palabra y los intentos
            if (this.dailyState.status === 'win') {
                const guesses = this.dailyState.guesses;
                sceneData.word = guesses[guesses.length - 1]; // La última palabra fue la ganadora
                sceneData.attempts = guesses.length;
            }
            
            // Redirigimos inmediatamente a la EndScene con los datos
            this.scene.start('EndScene', sceneData);
            return; // Detenemos la ejecución de create() para no dibujar el tablero
        }

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x121213); // Fondo oscuro

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.currentRow = 0;
        this.currentCol = 0;
        this.isChecking = false;

        // 1. Dibujar el tablero (Grid)
        this.createGrid();

        // 2. Lanzar la escena del teclado (UIScene)
        this.scene.launch('UIScene', { parent: this });

        // 3. Repintar intentos anteriores si existen (Req 5)
        if (this.dailyState.guesses.length > 0) { 
            this.replayGameOnLoad(); 
        }

        // 4. Escuchar eventos del teclado (físico y virtual)
        this.input.keyboard?.on('keydown-ENTER', this.handleSubmit, this);
        this.input.keyboard?.on('keydown-BACKSPACE', this.handleBackspace, this);
        this.input.keyboard?.on('keydown', this.handleLetterInput, this);

        this.events.on('key_press', (key: string) => {
            this.handleLetter(key);
        }, this);
    }

    createGrid() {
        const boxSize = 60;
        const padding = 10;
        const totalRows = 6; // Req 4
        const totalCols = this.difficulty;
        const startX = 512 - ((totalCols * (boxSize + padding)) - padding) / 2;
        const startY = 100;

        for (let row = 0; row < totalRows; row++) {
          this.grid[row] = [];
          for (let col = 0; col < totalCols; col++) {
            const x = startX + col * (boxSize + padding);
            const y = startY + row * (boxSize + padding);
            
            const box = this.add.text(x, y, '', { 
                fontFamily: 'Arial Black',
                fontSize: '32px', 
                color: '#ffffff', 
                backgroundColor: '#3A3A3C',
                align: 'center'
            })
              .setFixedSize(boxSize, boxSize)
              .setOrigin(0);
              
            this.grid[row][col] = box;
          }
        }
    }

    // Maneja letras del teclado físico
    handleLetterInput(event: KeyboardEvent) {
        const key = event.key.toUpperCase();
        if (/^[A-ZÑ]$/.test(key)) {
            this.handleLetter(key);
        }
    }

    // Lógica para añadir una letra (físico o virtual)
    handleLetter(key: string) {
        if (this.isChecking || this.currentRow >= 6) return; 

        if (this.currentCol < this.difficulty) {
          this.grid[this.currentRow][this.currentCol].setText(key);
          this.currentCol++;
        }
    }

    // Lógica para borrar
    handleBackspace() {
        if (this.isChecking || this.currentRow >= 6) return;

        if (this.currentCol > 0) {
          this.currentCol--;
          this.grid[this.currentRow][this.currentCol].setText('');
        }
    }

    /**
     * Función que envuelve la carga asíncrona de intentos previos
     */
    async replayGameOnLoad() {
        await this.replayPreviousGuesses(this.dailyState.guesses);
        
        // Si el estado ya era 'win' o 'lose', bloqueamos el juego
        if (this.dailyState.status !== 'pending') {
            this.isChecking = true;
            console.log(`Juego ya finalizado con estado: ${this.dailyState.status}`);
            // Opcional: ir a la pantalla final directamente
            // this.scene.start('EndScene', { ... });
        }
    }

    /**
     * Repinta los intentos guardados en la cookie
     */
    async replayPreviousGuesses(previousGuesses: string[]) {
        this.isChecking = true; // Bloquear entrada

        for (const guess of previousGuesses) {
            // Rellena la fila
            guess.split('').forEach((letter, index) => {
                if (index < this.grid[this.currentRow].length) { 
                    this.grid[this.currentRow][index].setText(letter);
                }
            });
            this.currentCol = guess.length; 

            try {
                // --- ¡ARREGLO IMPORTANTE! ---
                // La llamada a fetch DEBE tener el body
                const response = await fetch('/api/game/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ guess: guess, difficulty: this.difficulty }),
                });
                // --- FIN DEL ARREGLO ---

                if (!response.ok) throw new Error('Error en la API al repintar');

                const results: ILetterStatus[] = await response.json();
                
                this.updateGridColors(results);
                this.scene.get('UIScene').events.emit('update_keyboard', results);
                
                this.currentRow++;
                this.currentCol = 0;

            } catch (error) {
                console.error("Error repintando intento:", error);
                this.isChecking = false;
                break; // Salir del bucle si falla el repintado
            }
        }
        
        // Desbloquear solo si el juego no ha terminado
        if (this.dailyState.status === 'pending') {
            this.isChecking = false; 
        }
    }

    /**
     * Envía el intento actual al backend (al presionar ENTER)
     */
    async handleSubmit() {
        if (this.isChecking || this.currentRow >= 6) return; 

        if (this.currentCol !== this.difficulty) {
          console.log("Palabra incompleta");
          
          // Mostramos un mensaje temporal de error
          const msg = this.add.text(512, 60, 'PALABRA INCOMPLETA', {
              fontFamily: 'Arial Black', fontSize: 24, color: '#FF5555', // Color rojo
              stroke: '#000000', strokeThickness: 4,
              align: 'center'
          }).setOrigin(0.5);
          
          // Borramos el mensaje después de 1.5 segundos
          this.time.delayedCall(1500, () => msg.destroy());
          
          return; // Detener ejecución
        }

        this.isChecking = true; 
        const guess = this.grid[this.currentRow].map(box => box.text).join('');

        try {
          // Esta llamada a fetch SÍ estaba bien, pero la de replayPreviousGuesses no
          const response = await fetch('/api/game/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess: guess, difficulty: this.difficulty }),
          });

          if (!response.ok) throw new Error('Error en la API');

          const responseData: CheckWordResponse = await response.json(); // Esta era tu línea de error 231

          // 3. REVISAMOS EL ESTADO DE LA RESPUESTA
          if (responseData.status === 'invalid_word') {
            console.log("Palabra no válida");
            
            // AHORA SÍ MOSTRARÁ EL AVISO
            const msg = this.add.text(512, 60, 'PALABRA NO VÁLIDA', {
                fontFamily: 'Arial Black', fontSize: 24, color: '#FF5555',
                stroke: '#000000', strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5);
            
            this.time.delayedCall(1500, () => msg.destroy());

            this.isChecking = false; // Desbloquear
            return; // Detener ejecución, el usuario sigue en la misma fila
          }

          this.stateManager.saveGuess(this.difficulty, guess);
          const results = responseData.result;
          this.updateGridColors(results);
          this.scene.get('UIScene').events.emit('update_keyboard', results);

          const isWinner = results.every(r => r.status === 'green');
          const intentosUsados = this.currentRow + 1; 

          if (isWinner) {
            // --- Guardar Victoria (Req 9) ---
            this.stateManager.markAsWon(this.difficulty);
            
            // --- INICIO DEL CAMBIO: Añadir retraso ---
            // Esperamos 2 segundos (2000ms) antes de cambiar de escena
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    // --- AÑADE ESTA LÍNEA ---
                    this.scene.stop('UIScene'); 
                    // --- FIN DE LA MODIFICACIÓN ---
                    this.scene.start('EndScene', { 
                        status: 'win', 
                        word: guess,
                        attempts: intentosUsados
                    });
                },
                callbackScope: this
            });
          } else if (this.currentRow === 5) { // 5 es la última fila (0-5)
            this.stateManager.markAsLost(this.difficulty);

            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    // --- AÑADE ESTA LÍNEA ---
                    this.scene.stop('UIScene');
                    // --- FIN DE LA MODIFICACIÓN ---
                    this.scene.start('EndScene', { 
                        status: 'lose' 
                    });
                },
                callbackScope: this
            });
          } else {
            // Continuar a la siguiente fila
            this.currentRow++;
            this.currentCol = 0;
            this.isChecking = false; // Desbloquear
          }

        } catch (error) {
          console.error('Error al validar la palabra:', error);
          this.isChecking = false; // Desbloquear en caso de error
        }
    }

    updateGridColors(results: ILetterStatus[]) {
        const colorMap = {
          green: '#538D4E',
          yellow: '#B59F3B',
          gray: '#3A3A3C',
        };

        results.forEach((result, index) => {
          const box = this.grid[this.currentRow][index];
          box.setBackgroundColor(colorMap[result.status]);
        });
    }
}