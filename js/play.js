var cursors;
var player;

var playState = {

    preload: function() {
        game.load.image('player', 'assets/Zombie.png');
        game.load.image("ground", "assets/ground.png");
        game.load.image("sky", "assets/sky.png");
        game.load.image("meat", "assets/meat.png");
    },

    create: function() {
        // fizyka
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // niebo
        game.add.sprite(0, 0, 'sky');
        // ludek do grania
        player = game.add.sprite(30, game.world.height - 180, 'player');
        player.scale.setTo(0.25, 0.25);
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        // ziemia
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, game.world.height - 54, 'ground');
        ground.body.immovable = true;
        // platformy
        var ledge = platforms.create(400, 350, 'ground');
        ledge.scale.setTo(0.5, 0.25);
        ledge.body.immovable = true;
        // platforma 2
        ledge = platforms.create(0, 250, 'ground');
        ledge.scale.setTo(0.25, 0.25);
        ledge.body.immovable = true;

        // meat 
        meats = game.add.group();
        meats.enableBody = true;

        for (var i = 0; i < 11; i++) {
            var meat = meats.create(i * 70, 0, 'meat');
            meat.body.gravity.y = 6;
            meat.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {

        function collectMeat(player, meat) {
            meat.kill();
        }
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(meats, platforms);
        game.physics.arcade.overlap(player, meats, collectMeat, null, this);
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -150;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 150;
        }


        if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
            player.body.velocity.y = -350;
        }

    }

};