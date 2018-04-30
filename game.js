var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sprites/characters/sky.png');
    game.load.image('ground', 'assets/sprites/characters/platform.png');
    game.load.image('star', 'assets/sprites/characters/star.png');
    game.load.spritesheet('battery', 'assets/sprites/characters/battery-spritesheet.png', 64, 64);
    //game.load.spritesheet('bboy_walkL', 'assets/sprites/characters/bboy_walkL.png', 64, 64);
    //game.load.spritesheet('bboy_idleL', 'assets/sprites/characters/bboy_idleL.png', 64, 64);
    //console.log(game.load.spritesheet);
}

var playerDirection = 'left';

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'battery');
    //player = game.add.sprite(32, game.world.height - 150, 'bboy_walkL');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 1000;
    player.body.collideWorldBounds = true;
    player.body.setSize(32, 60, 16, 0);


    //  Our two animations, walking left and right.
    player.animations.add('idle_left', [0, 1, 2, 3, 4, 5, 6], 10, true);
    player.animations.add('idle_right', [7, 8, 9, 10, 11, 12, 13], 10, true);
    player.animations.add('fall_left', [14], 10, false);
    player.animations.add('fall_right', [15], 10, false);
    player.animations.add('walk_left', [16, 17, 18, 19, 20, 21], 10, true);
    player.animations.add('walk_right', [22, 23, 24, 25, 26, 27, ], 10, true);
    player.animations.add('jump_left', [28], 10, false);
    player.animations.add('jump_right', [29], 10, false);
    player.animations.add('weld_left', [32, 33, 34, 35, 36, 37, 38, 39, 40], 10, true);
    player.animations.add('weld_right', [48, 49, 50, 51, 52, 53, 54, 55, 56], 10, true);

    //console.log(player.animations);

    cursors = game.input.keyboard.createCursorKeys();

    console.log(player.body);
}

function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    //console.log(player.body.velocity.y);

    if (cursors.left.isDown) {
        //  Move to the right
        player.body.velocity.x = -250;
        playerDirection = 'left';
        if (player.body.velocity.y < -3 || !player.body.touching.down) {
            if (player.body.velocity.y < -3) {
                player.animations.play('jump_left');
            } else {
                player.animations.play('fall_left');
            }
        } else {
            player.animations.play('walk_left');
        }
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 250;
        playerDirection = 'right';
        if (player.body.velocity.y < -3 || !player.body.touching.down) {
            if (player.body.velocity.y < -3) {
                player.animations.play('jump_right');
            } else {
                player.animations.play('fall_right');
            }

        } else {
            player.animations.play('walk_right');
        }
    }
    else
    {
        if (playerDirection == 'left') {
            if (player.body.velocity.y < -3) {
                player.animations.play('jump_left');
            } else if (!player.body.touching.down) {
                player.animations.play('fall_left');
            } else {
                player.animations.play('idle_left');
            }
        } else if (playerDirection == 'right') {
            if (player.body.velocity.y < -3) {
                player.animations.play('jump_right');
            } else if (!player.body.touching.down) {
                player.animations.play('fall_right');
            } else {
                player.animations.play('idle_right');
            }
        }
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -600;
    }
}
