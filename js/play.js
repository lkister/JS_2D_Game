var cursors;
var player;
var scoreText;
var score = 0;
var platforms;
var facing = "right";

var playState = {

    preload: function() {
        game.load.spritesheet('player', 'assets/zombie_anim.png', 195, 273);
        game.load.image("ground", "assets/ground.png");
        game.load.image("sky", "assets/sky_wide.png");
        game.load.image("brain", "assets/brain.png");
        game.load.image("lava", "assets/lava.png");
    },

    create: function() {
        // fizyka
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // niebo
        game.add.tileSprite(0, 0, 8000, 600, 'sky');
        game.world.setBounds(0, 0, 8000, 600);

        // zombiak
        player = game.add.sprite(30, 410, 'player');
        player.frame = 5;
        player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        // player.body.bounce.y = 0.5;
        player.body.gravity.y = 360;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [6, 7, 8, 9], 10, true);
        game.camera.follow(player);

        // ziemia
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, game.world.height - 56, 'ground');
        ground.body.immovable = true;
        ground.scale.setTo(2, 2);
        // platformy
        var ledge = platforms.create(400, 380, 'ground');
        ledge.scale.setTo(0.5, 0.25);
        ledge.body.immovable = true;
        // platforma 2
        ledge = platforms.create(0, 250, 'ground');
        ledge.scale.setTo(0.25, 0.25);
        ledge.body.immovable = true;

        // lava 
        lavaGround = game.add.group();
        lavaGround.enableBody = true;
        var lava = lavaGround.create(1600, game.world.height - 50, "lava");
        lava.body.immovable = true;
        lava.scale.setTo(3, 1);


        // brain 
        brains = game.add.group();
        brains.enableBody = true;

        for (var i = 0; i < 50; i++) {
            var brain = brains.create(i * 90, 0, 'brain');
            brain.body.gravity.y = 260;
            brain.body.bounce.y = 0.2 + Math.random() * 0.2;
        }

        cursors = game.input.keyboard.createCursorKeys();
        space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        scoreText = game.add.text(16, 16, 'Brains eaten: 0', { fontSize: '32px', fill: '#000' });
        scoreText.fixedToCamera = true;
    },

    update: function() {
        function collectbrain(player, brain) {
            brain.kill();
            score += 1;
            scoreText.text = 'Brains eaten: ' + score;
        }

        function restart() {
            game.state.start("play")
        }

        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(brains, platforms);
        game.physics.arcade.overlap(player, brains, collectbrain, null, this);
        game.physics.arcade.overlap(player, lavaGround, restart, null, this)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -350;
            if (facing != 'left') {
                player.animations.play('left');
                facing = 'left';
            }
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 350;
            if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
            }
        } else {
            if (facing != 'idle') {
                player.animations.stop();

                if (facing == 'left') {
                    player.frame = 4;
                } else {
                    player.frame = 5;
                }
                facing = 'idle';
            }
        }

        if (space.isDown && player.body.touching.down && hitPlatform) {
            player.body.velocity.y = -350;
        }
        if (space.isDown || !player.body.touching.down) {
            player.animations.stop();
        }
    }
};