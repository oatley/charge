
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var platforms;
var player;
var score = 0;
var scoreText;
var bomb;
var playerDirection = 'right';


function preload () {
    // Charge assets
    this.load.image('bboy_pos_default', 'assets/bboy_default.png');
    this.load.image('bboy_neg_default', 'assets/bboy_neg_default.png');
    this.load.spritesheet('bboy_walk',
        'assets/bboy_walk.png',
        { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet('bboy_walk_right', 'assets/bboy_walkR.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_walk_left', 'assets/bboy_walkL.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_idle_right', 'assets/bboy_idleR.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_idle_left', 'assets/bboy_idleL.png', { frameWidth: 64, frameHeight: 64 });


    // Tutorial assets
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    /*this.load.spritesheet('dude',
        'tutorial/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );*/
}



function create () {
    // Background
    this.add.image(400, 300, 'sky');

    // Platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Player
    player = this.physics.add.sprite(100, 450, 'bboy_pos_default');
    player.setBounce(0.15);
    player.setCollideWorldBounds(true);

    // Bombs
    bombs = this.physics.add.group();

    // Animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('bboy_walk_left', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'bboy_walk', frame: 0 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('bboy_walk_right', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'left_idle',
        frames: this.anims.generateFrameNumbers('bboy_idle_left', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right_idle',
        frames: this.anims.generateFrameNumbers('bboy_idle_right', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });


    // Star objects
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Add colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);


    // Enable keyboard bindings
    cursors = this.input.keyboard.createCursorKeys();

    // Add text information
    scoreText = this.add.text(16, 16, 'score: 0' , { fontSize: '32px', fill: '#000' });

}

// Function to run on star player collision
function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

// Function to run on bomb player collision
function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}

// Update function controls keyboard input
function update () {

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
        playerDirection = 'left';
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
        playerDirection = 'right';
    } else {
        player.setVelocityX(0);
        if (playerDirection == 'right') {
            player.anims.play('right_idle', true);
        } else {
            player.anims.play('left_idle', true);
        }
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-660);
    }
}
