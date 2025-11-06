import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    create() {
        // Comprobar si NO estamos en un PC de escritorio
        if (!this.sys.game.device.os.desktop) {
            
            // Si es celular o tablet, forzar la orientación horizontal
            this.scale.lockOrientation('landscape');
        }
        this.scene.start('Preloader');
    }
}