# LA PALABRA DEL DIA

### REQUISITOS
1. DEBE HABER UNA BASE DE DATOS DE PALABRAS
2. CADA DIA HAY UNA PALABRA DISTINTA
3. DEBEN HABER 3 DIFICULTADES (PALABRAS DE 5 LETRAS, 7 LETRAS Y 9 LETRAS)
4. DEBEN HABER 6 INTENTOS/FILAS POR JUEGO (SIN IMPORTAR LA CANTIDAD DE LETRAS DE LA PALABRA)
5. CADA DIA PUEDES INTENTAR 3 VECES COMPLETAR LA PALABRA (VERIFICA LA COOKIE PARA SABER SI ES EL USUARIO)
6. DEBE SALIR UN TECLADO EN LA PANTALLA
7. EN EL TECLADO:
    - LAS LETRAS QUE ESTÁN POSICIONADAS CORRECTAMENTE SE MARCARÁN EN VERDE
    - LAS LETRAS QUE ESTÁN EN LA PALABRA PERO NO EN LA POSICIÓN CORRECTA EN AMARILLO
    - LAS LETRAS QUE NO ESTÁN EN LA PALABRA EN GRIS
8. EN LAS FILAS DE LAS PALABRAS (DONDE EL USUARIO VERÁ SUS PALABRAS ESCRITAS)
    - LAS LETRAS QUE ESTÁN POSICIONADAS CORRECTAMENTE SE MARCARÁN EN VERDE
    - LAS LETRAS QUE ESTÁN EN LA PALABRA PERO NO EN LA POSICIÓN CORRECTA EN AMARILLO
    - LAS LETRAS QUE NO ESTÁN EN LA PALABRA EN GRIS
9. DIAS DE RACHA (CUANTOS DIAS SEGUIDOS A RESUELTO EL USUARIO LA PALABRA DEL DÍA, VERIFICA LA COOKIE PARA SABER SI ES EL USUARIO)
10. SI EL USUARIO NO ADIVINA LA PALABRA DEL DÍA EN SUS 3 INTENTOS NO SABRÁ LA PALABRA DEL DÍA. SALDRÁ UNA PANTALLA DONDE DIRÁ "NO COMPLETASTE LA PALABRA DEL DÍA. SIGUIENTE PALABRA EN X HORAS Y MINUTOS Z SEGUNDOS."
11. SI EL USUARIO ADIVINA LA PALABRA DEL DÍA, SALDRÁ UNA PANTALLA DONDE DIRÁ "COMPLETASTE LA PALABRA DEL DÍA 'PALABRA' CON X INTENTOS. SIGUIENTE PALABRA EN X HORAS Y MINUTOS Z SEGUNDOS."

### TECNOLOGÍAS
1. Docker
2. Typescript
3. Phaser 3.X
4. Nest.js
5. Sqlite

### Rutas y puertos

🚀 **Juego (Phaser):** http://159.112.129.245:8082

🚀 **Backend (NestJS):** http://159.112.129.245:3002

### DOCKER-COMPOSE COMANDOS UTILES
1. **Este comando detiene y elimina todo lo asociado con tu docker-compose.yml**

        docker-compose down -v --rmi all
2. **Construir Desde Cero y Lanzar (Sin Caché)**

        docker-compose build --no-cache
        docker-compose up --force-recreate -d
3. **Reconstruir y Lanzar (Con Caché)**

        docker-compose up --build --force-recreate -d
4. **Solo Reconstruir Imágenes**

        docker-compose build
5. **Ver Logs**

        docker-compose logs -f
        docker-compose logs -f server
        docker-compose logs -f client
6. **Detener y Eliminar los contenedores**

        docker-compose down
7. **Borrar toda la caché de Docker**

        docker system prune


### PLAN PASO A PASO

#### FASE 0: TEMPLATE PROYECTO PHASER 3.X CLIENTE-SERVIDOR

1. Crear dos carpetas /client y /server.
2. Crear un docker-compose.yml en la raiz
3. Dentro de /client ejecutar ``` npx degit https://github.com/phaserjs/template-vite-ts.git . ``` y luego ```npm install```

### FASE 1: SERVIDOR NEST.JS Y SQLITE

1. Iniciar un nuevo proyecto de nest.js en la carpeta /server ``` npx @nestjs/cli new . ```
2. Instalar SQLITE ``` npm install @nestjs/typeorm typeorm sqlite3 ```
3. Configurar src/app.module.ts para que utilice como base de datos sqlite
4. Crear un módulo, servicio y entidad 'word'

        nest g module word
        nest g service word

5. Crear un archivo src/word/word.entity.ts e importarla en src/word/word.module.ts
6. Crea una carpeta src/seed, donde dentro habrá:

        - palabras_5.txt
        - palabras_7.txt
        - palabras_9.txt
7. Permitir que src/word/word.service.ts lea estos archivos .txt
8. Generar los archivos

        nest g module game
        nest g service game
        nest g controller game
9. Crear un DTO (Data Transfer Object) para definir como se verán los datos que envía el front

        src/game/dto/check-word.dto.ts

10. Implementar la lógica en src/game/game.service.ts
11. Crear el endpoint en src/game/game.controller.ts

### FASE 2: CLIENTE PHASER 3.X + VITE

1. Instalar las librerías de cookies 

        npm install js-cookie
        npm install @types/js-cookie --save-dev
2. Crear las escenas
        
        DifficultyScene.ts -> Para elegir 5, 7 o 9 letras.
        GameScene.ts -> El tablero principal del juego.
        UIScene.ts -> El teclado virtual y los mensajes.
        EndScene.ts -> El final del juego.