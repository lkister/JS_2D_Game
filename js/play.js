var cursors;
var player;
var scoreText;
var score = 0;
var platforms;

var playState = {

    preload: function() {
        game.load.spritesheet('player', 'assets/zombie_anim.png', 195, 273);
        game.load.image("ground", "assets/ground.png");
        game.load.image("sky", "assets/sky_wide.png");
        game.load.image("meat", "assets/meat.png");
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


        // meat 
        meats = game.add.group();
        meats.enableBody = true;

        for (var i = 0; i < 11; i++) {
            var meat = meats.create(i * 70, 0, 'meat');
            meat.body.gravity.y = 6;
            meat.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        cursors = game.input.keyboard.createCursorKeys();
        space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        scoreText = game.add.text(16, 16, 'Meats collected: 0', { fontSize: '32px', fill: '#000' });
        scoreText.fixedToCamera = true;
    },

    update: function() {
        function collectMeat(player, meat) {
            meat.kill();
            score += 1;
            scoreText.text = 'Score: ' + score;
        }

        function restart() {
            game.state.start("play")
        }

        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(meats, platforms);
        game.physics.arcade.overlap(player, meats, collectMeat, null, this);
        game.physics.arcade.overlap(player, lavaGround, restart, null, this)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -250;
            player.animations.play('left');
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 250;
            player.animations.play('right');
        } else {
            player.animations.stop();
            player.frame = 5;
        }

        if (space.isDown && player.body.touching.down && hitPlatform) {
            player.body.velocity.y = -350;
        }
        if (space.isDown || !player.body.touching.down) {
            player.animations.stop();
        }

    }

};