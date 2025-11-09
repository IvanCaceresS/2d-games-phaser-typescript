// src/game/scenes/UIScene.ts
import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  // Guardamos una referencia a la escena de juego principal
  private parentScene!: Phaser.Scene; 
  // Objeto para guardar las referencias a los botones del teclado
  private keyboardButtons: { [key: string]: Phaser.GameObjects.Text } = {};

  constructor() {
    super({ key: 'UIScene' });
  }

  // init se llama ANTES de create, y aquí recibimos la data (la escena padre)
  init(data: { parent: Phaser.Scene }) {
    this.parentScene = data.parent;
  }

  create() {
    // ---- Definición de las filas del teclado ----
    const keys = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK', 'ENTER'],
    ];

    let y = 550; // Posición Y inicial del teclado
    const keyStyle = { 
        fontSize: '20px', 
        color: '#000000',
        backgroundColor: '#DADADA', 
        padding: { x: 10, y: 5 },
        fixedWidth: 0
    };

    keys.forEach((row, rowIndex) => {
      let x = 512 - (row.length * (keyStyle.padding.x*2 + 20) / 2); // Centrar fila
      
      row.forEach(key => {
        // Ajustar ancho para teclas especiales
        if(key === 'ENTER' || key === 'BACK') {
            keyStyle.fixedWidth = 70;
        } else {
            keyStyle.fixedWidth = 30;
        }

        const button = this.add.text(x, y, key, keyStyle)
          .setOrigin(0)
          .setInteractive()
          .on('pointerdown', () => {
            this.handleKeyPress(key); // Manejador de click
          });
        
        this.keyboardButtons[key] = button; // Guardar referencia para cambiar color
        x += button.width + 10;
      });
      y += 50; // Siguiente fila
    });

    // Escuchar evento de GameScene para actualizar colores (Req 7)
    // El 'this.events' de esta escena (UIScene)
    this.events.on('update_keyboard', this.updateKeyboardColors, this);
  }

  handleKeyPress(key: string) {
    if (key === 'ENTER') {
      // Emitimos un evento de teclado "físico" a la escena padre
      this.parentScene.input.keyboard?.emit('keydown-ENTER');
    } else if (key === 'BACK') {
      this.parentScene.input.keyboard?.emit('keydown-BACKSPACE');
    } else {
      // Emitimos un evento personalizado a la escena padre
      // 'key_press' es un evento nuestro, no de Phaser
      this.parentScene.events.emit('key_press', key);
    }
  }

  updateKeyboardColors(results: {letter: string, status: string}[]) {
    const colorMap = {
      green: '#538D4E',  // Verde
      yellow: '#B59F3B', // Amarillo
      gray: '#3A3A3C',   // Gris
    };

    results.forEach(result => {
      const button = this.keyboardButtons[result.letter.toUpperCase()];
      if (button) {
        // Lógica de prioridad: Verde > Amarillo > Gris
        const currentColor = button.style.backgroundColor;
        if (currentColor !== colorMap.green) {
            if (result.status === 'green' || (result.status === 'yellow' && currentColor !== colorMap.yellow)) {
               button.setBackgroundColor(colorMap[result.status]);
               button.setColor('#FFFFFF'); // Letra blanca para mejor contraste
            } else if (result.status === 'gray' && currentColor === '#DADADA') {
               button.setBackgroundColor(colorMap.gray);
               button.setColor('#FFFFFF');
            }
        }
      }
    });
  }
}