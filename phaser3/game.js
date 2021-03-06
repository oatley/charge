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
var map;
var layer;
var platforms;
var player;
var score = 0;
var scoreText;
//var bomb;
var playerDirection = 'right';
var playerJumpForce = -630;

var allPlayers = [];


function preload () {

    // Charge assets
    /*this.load.image('bboy_pos_default', 'assets/bboy_default.png');
    this.load.image('bboy_neg_default', 'assets/bboy_neg_default.png');
    /this.load.spritesheet('bboy_walk',
        'assets/bboy_walk.png',
        { frameWidth: 64, frameHeight: 64 }
    );*/
    //this.load.image('bboy_jump_right', 'assets/bboy_jumpR.png');
    //this.load.image('bboy_jump_left', 'assets/bboy_jumpL.png');
    this.load.spritesheet('bboy_walk_right', 'assets/sprites/characters/bboy_walkR.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_walk_left', 'assets/sprites/characters/bboy_walkL.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_idle_right', 'assets/sprites/characters/bboy_idleR.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_idle_left', 'assets/sprites/characters/bboy_idleL.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_jump_right', 'assets/sprites/characters/bboy_jumpR.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_jump_left', 'assets/sprites/characters/bboy_jumpL.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_fall_right', 'assets/sprites/characters/bboy_fallR.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bboy_fall_left', 'assets/sprites/characters/bboy_fallL.png', { frameWidth: 64, frameHeight: 64 });
    // Tutorial assets
    this.load.image('sky', 'assets/sprites/characters/sky.png');
    //this.load.image('ground', 'assets/sprites/characters/platform.png');
    //this.load.image('star', 'assets/sprites/characters/star.png');
    //this.load.image('bomb', 'assets/sprites/characters/bomb.png');
    /*this.load.spritesheet('dude',
        'tutorial/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );*/
    //game.load.tilemap('level1', 'assets/tilemaps/maps/ChargeTilesMap.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    //game.load.image('player', 'assets/sprites/phaser-dude.png');

    //this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/ChargeTilesMap.json');
    //this.load.tilemapJSON('map', 'assets/tilemaps/maps/ChargeTilesMap.json');
    //this.load.spritesheet('tiles','assets/sprites/tiles/ChargeTiles.png', {frameWidth: 64, frameHeight: 64} );

    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/ChargeTilesMap.json');
    this.load.image('ChargeTiles', 'assets/sprites/tiles/ChargeTiles.png');


    //this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/cybernoid.json');
    //this.load.image('cybernoid', 'cybernoid.png');



}


function create () {
    // Background
    this.add.image(400, 300, 'sky');
    //map = game.add.tilemap('map');
    //map = this.make.tilemap({ key: 'map' });

    map = this.add.tilemap('map');
    console.log(map);
    //map.addTilesetImage('ChargeTiles', 'tiles');
    var tiles = map.addTilesetImage('ChargeTiles'); // 'assets/sprites/tiles/ChargeTiles.png');
    console.log(tiles);
    //this.map.createStaticLayer(0, tiles).resizeWorld();
    var layer = map.createDynamicLayer(0, tiles, 0, 0);

    console.log(layer);
    layer.setScale(1,1);

    map.setCollision([2,3,4,5,6,7,8,10,11,12,13,14,15]);

    //this.groundLayer = map.createStaticLayer('Ground', tiles, 0, 0);
    //var Layer = map.createStaticLayer('Ground', tiles);
    //layer = map.createStaticLayer(0, 'Ground', 0, 0);
    //layer.resizeWorld();
    console.log ('done');
    //map = this.make.tilemap({ key: 'map' });
    //this.map = this.add.tilemap('map');
    //var tiles = map.addTilesetImage('ChargeTiles', 'tiles');
    //this.backgroundLayer = this.map.createStaticLayer('Ground', tiles);
    //var layer = map.createStaticLayer(0, tiles, 0, 0);

    //console.log(map);

    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Platforms
    //platforms = this.physics.add.staticGroup();
    //platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    //platforms.create(600, 400, 'ground');
    //platforms.create(50, 250, 'ground');
    //platforms.create(750, 240, 'ground');

    /*for (var i = 1; i <= 5; i++) {
        // Player
        player = this.physics.add.sprite(100*i, 450, 'bboy_pos_default');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        console.log(player);
        player.body.height = 60;
        player.body.width = 40;
        allPlayers.push(player);
    }*/

    player = this.physics.add.sprite(100, 250, 'bboy_pos_default');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setSize(64,64, false);
    player.body.halfHeight = 64;
    player.body.halfWidth = 64;
    player.body.sourceHeight = 64;
    player.body.sourceWidth = 64;
    player.body.updateCenter();
    console.log(player.body.setSize);

    /*player.body.height = 60;
    player.body.halfHeight = 30;
    player.body.width = 40;
    player.body.halfWidth = 20;
    player.body.halfHeight = 64;
    player.body.halfWidth = 16;
    player.body.sourceHeight = 64;
    player.body.sourceWidth = 16;
    player.setOrigin(20,30);*/
    console.log(player);
    //console.log('local player bounds', player.getBounds());
    //player.Physics.Body.width = 32;
    //console.log('local player bounds', player.getBounds());
    // Bombs
    //bombs = this.physics.add.group();

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
    this.anims.create({
        key: 'left_jump',
        frames: [ { key: 'bboy_jump_left', frame: 0 } ],
        frameRate: 20,
    });
    this.anims.create({
        key: 'right_jump',
        frames: [ { key: 'bboy_jump_right', frame: 0 } ],
        frameRate: 20,
    });
    this.anims.create({
        key: 'left_fall',
        frames: [ { key: 'bboy_fall_left', frame: 0 } ],
        frameRate: 20,
    });
    this.anims.create({
        key: 'right_fall',
        frames: [ { key: 'bboy_fall_right', frame: 0 } ],
        frameRate: 20,
    });


    // Star objects
    /*stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });*/

    /*stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Add colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    */
    /*
    for (var object in layer.culledTiles) {
        this.physics.add.collider(player, object);
    }
        this.physics.add.collider(player, layer);
            this.physics.add.collider(player, layer.culledTiles);
                this.physics.add.collider(player, 'Ground');
    console.log(layer.culledTiles);
*/
    this.physics.add.collider(player, layer);
    // Enable keyboard bindings
    cursors = this.input.keyboard.createCursorKeys();

    // Add text information
    scoreText = this.add.text(16, 16, 'score: 0' , { fontSize: '32px', fill: '#000' });

}



// Load level
function loadLevel1() {
    var level = 'assets/levels/ChargeTilesMap.json'
}

// Function to run on star player collision
function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
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
        if (player.body.velocity.y > 0) {
            player.anims.play('left_fall', true);
        } else if (cursors.up.isDown) {
            player.anims.play('left_jump', true);
        } else {
            player.anims.play('left', true);
        }
        playerDirection = 'left';
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        if (player.body.velocity.y > 0) {
            player.anims.play('right_fall', true);
        } else if (cursors.up.isDown) {
            player.anims.play('right_jump', true);
        } else {
            player.anims.play('right', true);
        }
        playerDirection = 'right';
    } else {
        player.setVelocityX(0);
        //console.log(player.body.velocity.y);
        if (playerDirection == 'right' && player.body.velocity.y > 0) {
            player.anims.play('right_fall', true);
        } else if (playerDirection == 'left' && player.body.velocity.y > 0) {
            player.anims.play('right_fall', true);
        } else if (playerDirection == 'right' && player.body.velocity.y < -3) {
            player.anims.play('right_jump', true);
        } else if (playerDirection == 'left' && player.body.velocity.y < -3) {
            player.anims.play('right_jump', true);
        } else {
            if (playerDirection == 'right') {
                player.anims.play('right_idle', true);
            } else if (playerDirection == 'left') {
                player.anims.play('left_idle', true);
            }
        }
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(playerJumpForce);
    }

}
