var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sprites/characters/sky.png');
    game.load.image('ground', 'assets/sprites/characters/platform.png');
    game.load.image('star', 'assets/sprites/characters/star.png');
    game.load.spritesheet('battery', 'assets/sprites/characters/battery-spritesheet.png', 64, 64);
    game.load.spritesheet('battery-neg', 'assets/sprites/characters/battery-neg-spritesheet.png', 64, 64);

    game.load.image('ChargeTiles', 'assets/sprites/tiles/ChargeTiles.png');
    game.load.tilemap('map', 'assets/tilemaps/maps/ChargeTilesMap.json', null, Phaser.Tilemap.TILED_JSON);


}

var playerDirection = 'left';
var playerJumpSensitivity = -5; // Negative number, default is about -2.8 falling always
var playerMoveSpeed = 250;
var playerJumpSpeed = -650; // Negative number
var playerJumping = false;

var playerNegativeGroup;
var playerPositiveGroup;

// tilemap
var map;
var groundlayer;
var bglayer;
var wallslayer;

var players = [];
var p;

var upPositiveButton;
var downPositiveButton;
var leftPositiveButton;
var rightPositiveButton;

var upNegativeButton;
var downNegativeButton;
var leftNegativeButton;
var rightNegativeButton;

function configurePlayer(player, group) {
    game.physics.arcade.enable(player);

    // Custom attributes
    player.playerDirection = playerDirection;
    player.playerJumpSensitivity = playerJumpSensitivity;
    player.playerMoveSpeed = playerMoveSpeed;
    player.playerJumpSpeed = playerJumpSpeed;
    player.playerJumping = playerJumping;

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 1000;
    player.body.collideWorldBounds = true;
    player.body.setSize(32, 60, 16, 0);
    player.body.checkCollision.up = false;


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

    group.add(player);
}

function configureNegativePlayerControls() {
    upPositiveButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downPositiveButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftPositiveButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightPositiveButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function configurePositivePlayerControls() {
    upNegativeButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downNegativeButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftNegativeButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightNegativeButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}


function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    // other objects, etc
   map = game.add.tilemap('map'); // step 1
   map.addTilesetImage('ChargeTiles', 'ChargeTiles'); // step 2
   groundlayer = map.createLayer('Ground');

   map.setCollision([2,3,4,5,6,7,8,10,11,12,13,14,15], true, groundlayer);

   configurePositivePlayerControls();
   configureNegativePlayerControls();

    //ledge.body.immovable = true;
    playerPositiveGroup = game.add.group();
    for (var i = 0; i < 3; i++) {
        // The player and its settings
        p = game.add.sprite(32 * i, game.world.height - 150, 'battery');
        configurePlayer(p, playerPositiveGroup); // Default settings + group
    }

    playerNegativeGroup = game.add.group();
    for (var i = 0; i < 3; i++) {
        // The player and its settings
        p = game.add.sprite(game.world.width -128 * i, game.world.height - 150, 'battery-neg');
        configurePlayer(p, playerNegativeGroup); // Default settings + group
    }

    //console.log(player.animations);

    cursors = game.input.keyboard.createCursorKeys();

    console.log(player.body);
}

function runAnim(player, controls) {

    if (controls == 'positive') {
        var upButton = upPositiveButton;
        var downButton = downPositiveButton;
        var leftButton = leftPositiveButton;
        var rightButton = rightPositiveButton;
    } else {
        var upButton = upNegativeButton;
        var downButton = downNegativeButton;
        var leftButton = leftNegativeButton;
        var rightButton = rightNegativeButton;
    }
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (leftButton.isDown) {
        //  Move to the right
        player.body.velocity.x = -player.playerMoveSpeed;
        player.playerDirection = 'left';
        if (player.body.velocity.y < player.playerJumpSensitivity || !(player.body.touching.down || player.body.blocked.down)) {
            if (player.body.velocity.y < player.playerJumpSensitivity) {
                player.animations.play('jump_left');
            } else {
                player.animations.play('fall_left');
            }
        } else {
            player.animations.play('walk_left');
        }
    }
    else if (rightButton.isDown) {
        //  Move to the right
        player.body.velocity.x = player.playerMoveSpeed;
        player.playerDirection = 'right';
        if (player.body.velocity.y < player.playerJumpSensitivity || !(player.body.touching.down || player.body.blocked.down)) {
            if (player.body.velocity.y < player.playerJumpSensitivity) {
                player.animations.play('jump_right');
            } else {
                player.animations.play('fall_right');
            }

        } else {
            player.animations.play('walk_right');
        }
    }
    else {
        if (player.playerDirection == 'left') {
            if (player.body.velocity.y < player.playerJumpSensitivity) {
                player.animations.play('jump_left');
            } else if (!(player.body.touching.down || player.body.blocked.down)) {
                player.animations.play('fall_left');
            } else {
                player.animations.play('idle_left');
            }
        } else if (player.playerDirection == 'right') {
            if (player.body.velocity.y < player.playerJumpSensitivity) {
                player.animations.play('jump_right');
            } else if (!(player.body.touching.down || player.body.blocked.down)) {
                player.animations.play('fall_right');
            } else {
                player.animations.play('idle_right');
            }
        }
    }

    //  Allow the player to jump if they are touching the ground.
    if (!upButton.isDown && player.playerJumping && player.body.velocity.y < 0) {
        player.body.velocity.y = player.body.velocity.y * 0.5;
        player.playerJumping = false;
    } else if (upButton.isDown && (player.body.touching.down || player.body.blocked.down)) {
        player.body.velocity.y = player.playerJumpSpeed;
        player.playerJumping = true;
    }
}

function update() {

    //  Collide the player and the stars with the platforms
    //var hitPlatform = game.physics.arcade.collide(player, platforms);
    var hitChargeTiles = game.physics.arcade.collide(playerPositiveGroup, groundlayer);
    var hitChargeTiles2 = game.physics.arcade.collide(playerNegativeGroup, groundlayer);
    playerNegativeGroup.forEach(function(player) {
        runAnim(player, 'negative');

    }, this);

    playerPositiveGroup.forEach(function(player) {
        runAnim(player, 'positive');

    }, this);
}
