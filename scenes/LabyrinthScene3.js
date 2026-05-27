export default class LabyrinthScene3 extends Phaser.Scene {
  constructor() {
    super("labyrinth3");
  }

  init(data) {
    this.accumulatedScore = data?.accumulatedScore || 0;
    this.collectedItems = 0;
    this.maxItems = 12;
  }

  preload() {
    this.load.image("sky", "./public/assets/space3.png");
  }

  create() {
    // world background and bounds
    this.cameras.main.setBackgroundColor("#111111");

    // create tile graphics and textures
    this.createTileTextures();

    // create tilemap programmatically
    this.createLabyrinthTilemap();

    // create player
    this.player = this.physics.add.sprite(48, 48, "player-tex");
    this.player.setDisplaySize(24, 24);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // camera follow and world bounds
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

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

    // create enemies group
    this.enemies = this.physics.add.group();
    this.spawnEnemies();

    // create goal marker
    this.goal = this.physics.add.sprite(this.goalX * 32 + 16, this.goalY * 32 + 16, "goal-tex");
    this.goal.setDisplaySize(20, 20);

    // colliders
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.player, this.enemies, this.handleEnemyHit, null, this);

    // overlaps
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.goal, this.checkGoal, null, this);

    // UI fixed to camera
    this.countText = this.add.text(10, 10, `Items: ${this.collectedItems}/${this.maxItems}`, {
      fontSize: "18px",
      fill: "#ffff00",
      fontStyle: "bold",
    }).setScrollFactor(0);

    this.scoreText = this.add.text(10, 35, `Puntaje Acumulado: ${this.accumulatedScore}`, {
      fontSize: "14px",
      fill: "#00ffff",
    }).setScrollFactor(0);

    this.levelText = this.add.text(400, 10, "NIVEL 3", {
      fontSize: "20px",
      fill: "#ff00ff",
      fontStyle: "bold",
    }).setOrigin(0.5, 0).setScrollFactor(0);

    this.goalText = this.add.text(10, 60, `Llega a la META (verde) y evita enemigos`, {
      fontSize: "14px",
      fill: "#00ff00",
    }).setScrollFactor(0);
  }

  update() {
    const speed = 220;
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

    // update enemy movement direction on bounce
    this.enemies.getChildren().forEach((enemy) => {
      const direction = enemy.getData("movement");
      if (direction === "horizontal") {
        if (enemy.body.blocked.left || enemy.body.blocked.right) {
          enemy.setVelocityX(-enemy.body.velocity.x);
        }
      } else {
        if (enemy.body.blocked.up || enemy.body.blocked.down) {
          enemy.setVelocityY(-enemy.body.velocity.y);
        }
      }
    });
  }

  createTileTextures() {
    if (!this.textures.exists("wall-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x444444, 1);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture("wall-tex", 32, 32);
      g.clear();
    }

    if (!this.textures.exists("floor-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x222222, 1);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture("floor-tex", 32, 32);
      g.clear();
    }

    if (!this.textures.exists("player-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x0000ff, 1);
      g.fillCircle(16, 16, 12);
      g.generateTexture("player-tex", 32, 32);
      g.clear();
    }

    if (!this.textures.exists("item-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffff00, 1);
      g.fillRect(12, 12, 8, 8);
      g.generateTexture("item-tex", 32, 32);
      g.clear();
    }

    if (!this.textures.exists("goal-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x00ff00, 1);
      g.fillCircle(16, 16, 14);
      g.generateTexture("goal-tex", 32, 32);
      g.clear();
    }

    if (!this.textures.exists("enemy-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xff0000, 1);
      g.fillCircle(16, 16, 12);
      g.fillStyle(0x000000, 1);
      g.fillRect(12, 14, 8, 4);
      g.generateTexture("enemy-tex", 32, 32);
      g.clear();
    }
  }

  createLabyrinthTilemap() {
    const maze = [];
    const width = 40;
    const height = 30;
    this.mapWidth = width * 32;
    this.mapHeight = height * 32;

    // default floor rows
    for (let y = 0; y < height; y++) {
      maze[y] = [];
      for (let x = 0; x < width; x++) {
        maze[y][x] = 0;
      }
    }

    // surround with walls
    for (let x = 0; x < width; x++) {
      maze[0][x] = 1;
      maze[height - 1][x] = 1;
    }
    for (let y = 0; y < height; y++) {
      maze[y][0] = 1;
      maze[y][width - 1] = 1;
    }

    // add some wide corridors and rooms
    for (let y = 2; y < height - 2; y += 4) {
      for (let x = 2; x < width - 2; x++) {
        if (x % 4 !== 0) maze[y][x] = 1;
      }
    }
    for (let x = 2; x < width - 2; x += 5) {
      for (let y = 2; y < height - 2; y++) {
        if (y % 3 !== 0) maze[y][x] = 1;
      }
    }

    maze[1][1] = 0;
    maze[height - 2][width - 2] = 0;

    this.goalX = width - 2;
    this.goalY = height - 2;

    this.walls = this.physics.add.staticGroup();
    this.floors = this.add.group();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (maze[y][x] === 1) {
          const wall = this.walls.create(x * 32 + 16, y * 32 + 16, "wall-tex");
          wall.setDisplaySize(32, 32);
          wall.body.setSize(32, 32);
        } else {
          const floor = this.add.image(x * 32 + 16, y * 32 + 16, "floor-tex");
          floor.setDisplaySize(32, 32);
        }
      }
    }
  }

  spawnItems() {
    const positions = [
      { x: 3, y: 3 },
      { x: 10, y: 4 },
      { x: 6, y: 9 },
      { x: 14, y: 6 },
      { x: 18, y: 10 },
      { x: 24, y: 7 },
      { x: 28, y: 12 },
      { x: 20, y: 18 },
      { x: 32, y: 19 },
      { x: 34, y: 24 },
      { x: 28, y: 26 },
      { x: 6, y: 22 },
    ];

    positions.forEach((pos) => {
      const item = this.items.create(pos.x * 32 + 16, pos.y * 32 + 16, "item-tex");
      item.setDisplaySize(20, 20);
      item.setData("collected", false);
      item.body.setAllowGravity(false);
      item.setImmovable(true);
    });
  }

  spawnEnemies() {
    const positions = [
      { x: 8, y: 5 },
      { x: 15, y: 10 },
      { x: 26, y: 12 },
      { x: 30, y: 18 },
      { x: 18, y: 22 },
    ];

    positions.forEach((pos) => {
      const enemy = this.enemies.create(pos.x * 32 + 16, pos.y * 32 + 16, "enemy-tex");
      enemy.setDisplaySize(26, 26);
      enemy.body.setAllowGravity(false);
      enemy.setImmovable(true);
      enemy.setBounce(1, 1);
      if (pos.x < this.mapWidth / 2) {
        enemy.setData("movement", "horizontal");
        enemy.setVelocityX(120);
      } else {
        enemy.setData("movement", "vertical");
        enemy.setVelocityY(120);
      }
    });
  }

  collectItem(player, item) {
    if (!item.getData("collected")) {
      item.setData("collected", true);
      item.destroy();
      this.collectedItems += 1;
      this.accumulatedScore += 15;
      this.countText.setText(`Items: ${this.collectedItems}/${this.maxItems}`);
      this.scoreText.setText(`Puntaje Acumulado: ${this.accumulatedScore}`);
    }
  }

  checkGoal(player, goal) {
    if (this.collectedItems >= 5) {
      this.scene.start("labyrinth-win", { totalScore: this.accumulatedScore });
    } else {
      this.goalText.setText(`Necesitas ${5 - this.collectedItems} items más!`);
    }
  }

  handleEnemyHit(player, enemy) {
    player.setPosition(48, 48);
    player.setVelocity(0, 0);
    this.scoreText.setText(`Puntaje Acumulado: ${this.accumulatedScore}`);
  }
}
