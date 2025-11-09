// src/game/main.ts
import { Boot } from './scenes/Boot';
// Importamos las escenas nuevas/renombradas
import { EndScene } from './scenes/EndScene';
import { Game as MainGame } from './scenes/Game';
import { DifficultyScene } from './scenes/DifficultyScene';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { UIScene } from './scenes/UIScene'; // Importamos la nueva UIScene

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    
    // --- INICIO DE LA MODIFICACIÓN ---
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta el juego a la pantalla manteniendo la proporción
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centra el juego horizontal y verticalmente
        width: 1024, // Le decimos que nuestro ancho de diseño es 1024
        height: 768 // Le decimos que nuestro alto de diseño es 768
    },
    // --- FIN DE LA MODIFICACIÓN ---
    
    scene: [
        Boot,
        Preloader,
        DifficultyScene, // Reemplaza a MainMenu
        MainGame,        // Esta es tu 'Game.ts'
        UIScene,         // La nueva escena de teclado
        EndScene         // Reemplaza a GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;