import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        // CAMBIO 1: Añadir el host para que sea accesible fuera del contenedor
        host: '0.0.0.0', 
        port: 8080,
        // CAMBIO 2: Añadir el proxy para hablar con el backend
        proxy: {
          '/api': {
            // 'server' es el nombre del servicio de backend en docker-compose
            // 3000 es el puerto *dentro* del contenedor del backend
            target: 'http://server:3000', 
            changeOrigin: true,
          },
        },
    }
});