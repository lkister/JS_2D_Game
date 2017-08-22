var cursors;
var player;
var scoreText;
var score = 0;
var platforms;
var facing = "right";

var playState = {

    preload: function() {
        game.load.spritesheet('player', 'assets/zombie_anim.png', 195, 273);
        game.load.image("ground", "assets/newGround.png");
        game.load.image("sky", "assets/background.png");
        game.load.image("brain", "assets/brain.png");
        game.load.image("lava", "assets/lava.png");
        game.load.image("arrowSign", "assets/ArrowSign.png")
        game.load.image("grave1", "assets/TombStone_1.png")
    },

    create: function() {
        // fizyka
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // niebo
        background = game.add.tileSprite(0, 0, 800, 600, 'sky');
        game.world.setBounds(0, 0, 8000, 600);
        game.camera.follow(background);
        background.fixedToCamera = true;

        //arrow sign 
        arrow = game.add.sprite(150, game.world.height - 135, "arrowSign");

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
        var ground = platforms.create(0, game.world.height - 50, 'ground');
        ground.body.immovable = true;
        ground.scale.setTo(16, 1);

        ground = platforms.create(1900, game.world.height - 50, 'ground');
        ground.body.immovable = true;
        ground.scale.setTo(8, 1);

        ground = platforms.create(3500, game.world.height - 50, 'ground');
        ground.body.immovable = true;
        ground.scale.setTo(12, 1);
        // platform 1
        var ledge = platforms.create(0, 250, 'ground');
        ledge.scale.setTo(2, 0.5);
        ledge.body.immovable = true;
        // platform 2
        ledge = platforms.create(400, 360, 'ground');
        ledge.scale.setTo(1, 0.5);
        ledge.body.immovable = true;
        //platform 3
        ledge = platforms.create(1200, 220, 'ground');
        ledge.scale.setTo(1, 0.5);
        ledge.body.immovable = true;
        // platform 4
        ledge = platforms.create(1800, 220, 'ground');
        ledge.scale.setTo(1, 0.51);
        ledge.body.immovable = true;

        // platform 5
        ledge = platforms.create(2900, 380, 'ground');
        ledge.scale.setTo(1, 0.5);
        ledge.body.immovable = true;

        // lava 
        lavaGround = game.add.group();
        lavaGround.enableBody = true;
        var lava = lavaGround.create(1600, game.world.height - 40, "lava");
        lava.body.immovable = true;
        lava.scale.setTo(3, 1);

        lava = lavaGround.create(2700, game.world.height - 40, "lava");
        lava.body.immovable = true;
        lava.scale.setTo(8, 1);



        // brain 
        brains = game.add.group();
        brains.enableBody = true;

        for (var i = 0; i < 50; i++) {
            var brain = brains.create(i * 200 + 50, 0, 'brain');
            brain.body.gravity.y = 260;
            brain.body.bounce.y = 0.2 + Math.random() * 0.2;
        }

        //tombstone1 
        for (var i = 1; i < 20; i++) {
            tombstone1 = game.add.sprite(i * 1000, game.world.height - 132, "grave1");
            tombstone1.scale.setTo(1.5, 1.5);
        }





        cursors = game.input.keyboard.createCursorKeys();
        space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        scoreText = game.add.text(16, 16, 'Brains eaten: 0', { fontSize: '20px', fill: '#ff0000' });
        scoreText.fixedToCamera = true;
    },

    update: function() {
        function collectbrain(player, brain) {
            brain.kill();
            score += 1;
            scoreText.text = 'Brains eaten: ' + score;
        }

        function restart() {
            setTimeout(function() {
                game.state.start("play")
                score = 0;
            }, 2000)
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
            player.body.velocity.y = -370;
        }
        // if (space.isDown || !player.body.touching.down) {
        //     player.animations.stop();
        // }
    }
};