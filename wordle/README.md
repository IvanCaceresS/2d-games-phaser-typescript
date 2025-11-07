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

### INICIAR PROYECTO

    npx degit https://github.com/phaserjs/template-vite-ts.git .
    npm install

### PLAN PASO A PASO