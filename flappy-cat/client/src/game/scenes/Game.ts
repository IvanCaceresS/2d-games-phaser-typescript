import { Scene } from 'phaser';

export class Game extends Scene {
    
    private cat!: Phaser.Physics.Arcade.Sprite;
    private tulipGroup!: Phaser.Physics.Arcade.Group;
    private tulipSpawnTimer!: Phaser.Time.TimerEvent;

    private scoreZoneGroup!: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private isAlive: boolean = true;
    private background!: Phaser.GameObjects.TileSprite;

    constructor() {
        super('Game');
    }

    create() {

        // --- INICIO FONDO ANIMADO ---
        const { width, height } = this.cameras.main;
        this.background = this.add.tileSprite(0, 0, width, height, 'fondo')
            .setOrigin(0, 0);
        // --- FIN FONDO ANIMADO ---

        this.isAlive = true; // GATO VIVO AL INICIO
        // --- INICIO PUNTUACIÓN ---
        this.score = 0;
        
        this.scoreText = this.add.text(
            this.cameras.main.width / 2,
            50,
            'Puntuación: 0', 
            {
                fontFamily: 'Arial', 
                fontSize: 32, 
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        this.scoreText.setDepth(1);
        // --- FIN PUNTUACIÓN ---

        // --- INICIO GATO ---
        this.cat = this.physics.add.sprite(
            this.cameras.main.width / 2, 
            150, 
            'gato'
        );

        this.cat.setFlipX(true); 
        this.cat.setGravityY(1000); 
        this.cat.setCollideWorldBounds(true);
        // INICIO COLLIDER BOX GATO ---
        const body = this.cat.body as Phaser.Physics.Arcade.Body;
        body.setSize(34, 30); // Ancho 34px, alto 30px
        body.setOffset(22, 16); // Offset X=22px, Y=16px
        // FIN COLLIDER BOX GATO ---

        // INICIO ANIMACIÓN GATO ---
        this.anims.create({
            key: 'gato-saltando',
            frames: this.anims.generateFrameNumbers('gato', { frames: [1, 0, 2] }), 
            frameRate: 12,
            repeat: 1,
            hideOnComplete: false
        });
        // FIN ANIMACIÓN GATO ---

        this.cat.setFrame(2); 
        this.input.on('pointerdown', this.handleJump, this);
        this.input.keyboard?.on('keydown-SPACE', this.handleJump, this);
        this.physics.world.on('collide', (gameObject1: Phaser.GameObjects.GameObject, gameObject2: Phaser.GameObjects.GameObject) => {
            if (gameObject1 === this.cat || gameObject2 === this.cat) {
                if (this.cat.body) {
                    const body = this.cat.body as Phaser.Physics.Arcade.Body;
                    if (body.onFloor() && Math.abs(body.velocity.y) < 10) {
                        this.cat.setFrame(2);
                    }
                }
            }
        });
        // --- FIN GATO ---

        // --- INICIO TULIPANES ---
        this.tulipGroup = this.physics.add.group();
        this.scoreZoneGroup = this.physics.add.group();
        this.tulipSpawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnTulip,
            callbackScope: this,
            loop: true
        });

        // 3. Añadimos la colisión entre el gato y el grupo de tulipanes
        this.physics.add.collider(
            this.cat, 
            this.tulipGroup, 
            this.handleGameOver, // choque
            undefined, 
            this
        );
        // Collider de PUNTUACIÓN
        this.physics.add.overlap(
            this.cat,
            this.scoreZoneGroup,
            this.incrementScore, // La función que llamaremos
            undefined,
            this
        );
        // --- FIN TULIPANES ---
    }

    // --- INICIO FUNCIÓN SALTO GATO ---
    handleJump() {
        if (this.isAlive && this.cat.body) {
            const body = this.cat.body as Phaser.Physics.Arcade.Body;

            if (body.velocity.y > -200) { 
                this.cat.setVelocityY(-350);
                this.cat.play('gato-saltando');
                this.sound.play('sonido_salto', {
                    // Reemplaza estos valores
                    seek: 0,
                    duration: 0.2
                });
            }
        }
    }
    // --- FIN FUNCIÓN SALTO GATO ---

    // --- INICIO FUNCIÓN SPAWN TULIPÁN ---
    private spawnTulip() {
        const gameHeight = this.cameras.main.height;
        const spawnX = this.cameras.main.width + 100;

        // --- INICIO LOGICA DE DIFICULTAD
        const baseGap = 180;
        const minGap = 60; // ALCANZA EL MINIMO A LOS 150 PUNTOS
        const reductionPerTenPoints = 8;
        const difficultyChunks = Math.floor(this.score / 10);
        const calculatedGap = baseGap - (difficultyChunks * reductionPerTenPoints);
        const gapHeight = Math.max(minGap, calculatedGap);
        // --- FIN LOGICA DE DIFICULTAD
        
        const gapCenter = Phaser.Math.Between(200, gameHeight - 200);
        const topTulipY = gapCenter - (gapHeight / 2);
        const bottomTulipY = gapCenter + (gapHeight / 2);

        // --- CREAR TULIPÁN DE ARRIBA ---
        const topTulip = this.tulipGroup.create(spawnX, topTulipY, 'tulipan');
        topTulip.setOrigin(0.5, 1);
        topTulip.displayHeight = topTulipY;
        topTulip.setFlipY(true);
        topTulip.setFrame(Phaser.Math.Between(0, 7));
        topTulip.setPushable(false).setImmovable(true).setVelocityX(-250);

        // --- CREAR TULIPÁN DE ABAJO ---
        const bottomTulip = this.tulipGroup.create(spawnX, bottomTulipY, 'tulipan');
        bottomTulip.setOrigin(0.5, 0);
        bottomTulip.displayHeight = gameHeight - bottomTulipY;
        bottomTulip.setFrame(Phaser.Math.Between(0, 7));
        bottomTulip.setPushable(false).setImmovable(true).setVelocityX(-250);

        const scoreZone = this.scoreZoneGroup.create(
            spawnX + 10,
            gapCenter,
            undefined
        );
        scoreZone.setVisible(false);
        scoreZone.body?.setSize(20, gapHeight);
        scoreZone.setVelocityX(-250);
    }
    // --- FIN FUNCIÓN SPAWN TULIPÁN ---
    
    // --- INICIO FUNCIÓN GAME OVER ---
    private handleGameOver() {
        if (!this.isAlive) {
            return;
        }
        this.isAlive = false;
        this.cat.body?.stop();
        this.cat.setFrame(0);     
        this.physics.pause();
        this.tulipSpawnTimer.destroy();

        this.sound.get('sonido_musica')?.stop();
        this.sound.play('sonido_muerte', {
            seek: 0,
            duration: 1
        });

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver', { score: this.score });
        });
    }
    // --- FIN FUNCIÓN GAME OVER ---

    // --- INICIO FUNCIÓN INCREMENTAR PUNTUACIÓN ---
    private incrementScore(
        _cat: any,
        zone: any
    ) {
        this.score++;
        this.scoreText.setText(`Puntuación: ${this.score}`);
        zone.destroy();
        
        this.sound.play('sonido_punto', {
                    seek: 0,
                    duration: 1
                });
    }
    // --- FIN FUNCIÓN INCREMENTAR PUNTUACIÓN ---

    // --- INICIO UPDATE ---
    update() {
        if (this.isAlive) {
            this.background.tilePositionX += 1;
        }

        // --- INICIO ANIMACIÓN GATO ---
        if (this.cat.body) {
            const body = this.cat.body as Phaser.Physics.Arcade.Body;
            if (!body.onFloor() && body.velocity.y > 0 && !this.cat.anims.isPlaying) {
                this.cat.setFrame(2);
            }
            if (this.isAlive && body.blocked.down) {
                this.handleGameOver();
            }
        }
        // --- FIN ANIMACIÓN GATO ---

        // --- INICIO LIMPIEZA  ---
        this.tulipGroup.getChildren().forEach(child => {
            const tulipan = child as Phaser.Physics.Arcade.Sprite;
            if (tulipan.x < -100) {
                tulipan.destroy();
            }
        });

        this.scoreZoneGroup.getChildren().forEach(child => {
            const zone = child as Phaser.Physics.Arcade.Sprite;
            if (zone.x < -100) {
                zone.destroy();
            }
        });
        // --- FIN LIMPIEZA  ---
    }
    // --- FIN UPDATE ---

}