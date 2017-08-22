const game = new Phaser.Game(1000, 600, Phaser.AUTO, parent = 'game');

game.state.add('play', playState);

game.state.start('play');