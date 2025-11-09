import { defineConfig } from 'vite';
import phaser from 'phaser/plugins/vite/vite-plugin-phaser';

export default defineConfig({
  plugins: [
    phaser({
      phaserVersion: '3.80.1' // O la versión que estés usando
    })
  ],
  server: {
    host: '0.0.0.0', 
    port: 8080,      
    proxy: {
      '/api': {
        // CAMBIO AQUÍ: El proxy debe apuntar al puerto 3000 (donde Nest corre)
        target: 'http://server:3000', 
        changeOrigin: true,
      },
    },
  },
});