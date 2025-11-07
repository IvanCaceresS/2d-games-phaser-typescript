# phaser-typescript-first-game

# PLAN INICIAL
Este será un juego dockerizado inspirado en flappy bird, la idea es hacerlo con tematica de un gato saltando mientras hay que esquivar tulipanes. Debe haber:
- Marcador
- Mejores puntuaciones
- Sonidos de salto, de muerte y de fondo
- Mapa infito creado aleatoreamente

Si es posible:
- Añadir multijugador (2 gatos distintos saltando simultaneamente, online)

Stack Tecnológico
- Docker
- Phaser 3.x
- Typescript
- Nest.js

# INICIAR PROYECTO

npx degit https://github.com/phaserjs/template-vite-ts.git .
npm install

# PLAN PASO A PASO

1. Fase 1: El Entorno (Hoy). Configurar la estructura del monorepo (cliente/servidor), instalar Nest.js, instalar Phaser con TypeScript y crear los archivos de Docker (Dockerfile y docker-compose) para que todo corra junto.

2. Fase 2: El Juego Básico. Crear la escena principal de Phaser. Poner al gato en pantalla, añadir gravedad y hacer que salte con un input (espacio o clic).

3. Fase 3: El Mundo Infinito. Generar los tulipanes (obstáculos) de forma procedural. Hacer que se muevan hacia el gato. Implementar la detección de colisiones (¡muerte!).

4. Fase 4: Puntuación y Sonido. Añadir el marcador que incrementa al pasar tulipanes. Integrar los sonidos de salto, muerte y la música de fondo.

5. Fase 5: El Backend. Levantar la base de datos (simple, como SQLite o Postgres en Docker) y crear los endpoints en Nest.js para POST /score y GET /highscores.

6. Fase 6: Integración y Pulido. Crear la escena de "Game Over". Hacer que el juego llame al endpoint de Nest.js al morir y que muestre la tabla de mejores puntuaciones.

7. Fase 7 (El Jefe Final): Multijugador. Esto es complejo. Implica migrar la lógica del juego al servidor (Nest.js), usar WebSockets (Socket.IO) para la comunicación en tiempo real y manejar la latencia.

# Rutas y puertos

🚀 Juego (Phaser): http://159.112.129.245:8081

🚀 Backend (NestJS): http://159.112.129.245:3001

# DOCKER-COMPOSE COMANDOS UTILES
1. Este comando detiene y elimina todo lo asociado con tu docker-compose.yml
        docker-compose down -v --rmi all
2. Construir Desde Cero y Lanzar (Sin Caché)
        docker-compose build --no-cache
        docker-compose up --force-recreate -d
3. Reconstruir y Lanzar (Con Caché)
        docker-compose up --build --force-recreate -d
4. Solo Reconstruir Imágenes
        docker-compose build
5. Ver Logs
        docker-compose logs -f
        docker-compose logs -f server
        docker-compose logs -f client
6. Detener y Eliminar los contenedores
        docker-compose down
7. Borrar toda la caché de Docker
        docker system prune

# PARA BORRAR BD DE PUNTUACIONES
docker-compose down
rm server/db/database.sqlite
docker-compose up --build --force-recreate -d