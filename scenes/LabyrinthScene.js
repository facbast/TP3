export default class LabyrinthScene extends Phaser.Scene {
  constructor() {
    super("labyrinth");
  }

  init() {
    this.collectedItems = 0;
    this.maxItems = 8;
  }

  preload() {
    this.load.image("sky", "./public/assets/space3.png");
  }

  create() {
    // background
    this.add.image(400, 300, "sky");

    // create tile graphics and textures
    this.createTileTextures();

    // create tilemap programmatically
    this.createLabyrinthTilemap();

    // create player
    this.player = this.physics.add.sprite(32, 32, "player-tex");
    this.player.setDisplaySize(24, 24);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // cursor keys for movement
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // create items group
    this.items = this.physics.add.group();
    this.spawnItems();

    // create goal marker
    this.goal = this.physics.add.sprite(this.goalX * 32 + 16, this.goalY * 32 + 16, "goal-tex");
    this.goal.setDisplaySize(20, 20);

    // collider between player and walls
    this.physics.add.collider(this.player, this.walls);

    // overlap between player and items
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);

    // overlap between player and goal
    this.physics.add.overlap(this.player, this.goal, this.checkGoal, null, this);

    // UI
    this.countText = this.add.text(10, 10, `Items: ${this.collectedItems}/${this.maxItems}`, {
      fontSize: "18px",
      fill: "#ffff00",
      fontStyle: "bold",
    });

    this.goalText = this.add.text(10, 35, `Llega a la META (verde)`, {
      fontSize: "14px",
      fill: "#00ff00",
    });
  }

  update() {
    // player movement
    const speed = 200;
    this.player.setVelocity(0, 0);

    if (this.cursors.left.isDown || this.wasd.a.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.d.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up.isDown || this.wasd.w.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.s.isDown) {
      this.player.setVelocityY(speed);
    }
  }

  createTileTextures() {
    // wall texture (gray)
    if (!this.textures.exists("wall-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x666666, 1);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture("wall-tex", 32, 32);
      g.clear();
    }

    // floor texture (light gray)
    if (!this.textures.exists("floor-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xcccccc, 1);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture("floor-tex", 32, 32);
      g.clear();
    }

    // player texture (blue)
    if (!this.textures.exists("player-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x0000ff, 1);
      g.fillCircle(16, 16, 12);
      g.generateTexture("player-tex", 32, 32);
      g.clear();
    }

    // item texture (yellow star)
    if (!this.textures.exists("item-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffff00, 1);
      g.fillRect(12, 12, 8, 8);
      g.generateTexture("item-tex", 32, 32);
      g.clear();
    }

    // goal texture (green)
    if (!this.textures.exists("goal-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x00ff00, 1);
      g.fillCircle(16, 16, 14);
      g.generateTexture("goal-tex", 32, 32);
      g.clear();
    }
  }

  createLabyrinthTilemap() {
    // simple maze layout (0=floor, 1=wall)
    // 25x19 grid
    const maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.goalX = 23;
    this.goalY = 15;

    this.walls = this.physics.add.staticGroup();

    // create wall sprites
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 1) {
          const wall = this.walls.create(x * 32 + 16, y * 32 + 16, "wall-tex");
          wall.setDisplaySize(32, 32);
          wall.body.setSize(32, 32);
        }
      }
    }
  }

  spawnItems() {
    // place items at specific locations (not on walls)
    const itemPositions = [
      { x: 2, y: 2 },
      { x: 5, y: 3 },
      { x: 8, y: 6 },
      { x: 12, y: 8 },
      { x: 16, y: 10 },
      { x: 20, y: 7 },
      { x: 22, y: 12 },
      { x: 10, y: 15 },
    ];

    itemPositions.forEach((pos) => {
      const item = this.items.create(pos.x * 32 + 16, pos.y * 32 + 16, "item-tex");
      item.setDisplaySize(20, 20);
      item.setData("collected", false);
    });
  }

  collectItem(player, item) {
    if (!item.getData("collected")) {
      item.setData("collected", true);
      item.destroy();
      this.collectedItems += 1;
      this.countText.setText(`Items: ${this.collectedItems}/${this.maxItems}`);
    }
  }

  checkGoal(player, goal) {
    if (this.collectedItems >= 5) {
      // win
      this.scene.start("game-over", { won: true, score: this.collectedItems, message: "¡Escapaste del laberinto!" });
    } else {
      // not enough items
      this.goalText.setText(`Necesitas ${5 - this.collectedItems} items más!`);
    }
  }
}
