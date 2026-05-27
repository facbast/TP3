// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  init() {
    this.collected = []; // array to persist collected items
    this.shapes = ["square", "triangle", "diamond", "bomb"];
    this.pointValues = { square: 20, triangle: 30, diamond: 50, bomb: -40 }; // points per item type (bomb deducts)
    this.score = 0; // current score
    this.timeLeft = 30; // seconds for countdown
    this.ended = false; // whether game ended (win or lose)
  }

  preload() {
    this.load.image("sky", "./public/assets/space3.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    this.createShapeTextures();

    // player platform at bottom
    this.player = this.physics.add.sprite(400, 560, "square-text");
    this.player.setDisplaySize(120, 24);
    this.player.body.setAllowGravity(false);
    this.player.setImmovable(true);

    // create additional static platforms
    this.platforms = this.physics.add.staticGroup();
    this.createPlatforms();

    // allow simple left/right control
    this.cursors = this.input.keyboard.createCursorKeys();

    // group for falling items
    this.items = this.physics.add.group();

    // collide items with platforms
    this.physics.add.collider(this.items, this.platforms);

    // spawn every 0.5 seconds
    this.spawnTimer = this.time.addEvent({
      delay: 500,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });

    // collision between player and items
    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);

    // UI: display score and collected counts
    this.scoreText = this.add.text(10, 10, `Puntaje: ${this.score}`, { fontSize: "20px", fill: "#ffff00", fontStyle: "bold" });
    this.countText = this.add.text(10, 35, this.getCountsText(), { fontSize: "14px", fill: "#ccc" });

    // timer UI (top-right)
    this.timerText = this.add
      .text(this.scale.width - 10, 10, `Tiempo: ${this.timeLeft}s`, { fontSize: "18px", fill: "#fff" })
      .setOrigin(1, 0);

    // countdown event every second
    this.countdownEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  }

  createPlatforms() {
    // platform 1: left-middle area
    const plat1 = this.platforms.create(150, 250);
    plat1.setDisplaySize(120, 20).setScale(1).refreshBody();
    plat1.setTint(0x888888);

    // platform 2: right-middle area
    const plat2 = this.platforms.create(650, 250);
    plat2.setDisplaySize(120, 20).setScale(1).refreshBody();
    plat2.setTint(0x888888);

    // platform 3: center-lower
    const plat3 = this.platforms.create(400, 380);
    plat3.setDisplaySize(140, 20).setScale(1).refreshBody();
    plat3.setTint(0x888888);

    // platform 4: left-lower
    const plat4 = this.platforms.create(200, 470);
    plat4.setDisplaySize(100, 20).setScale(1).refreshBody();
    plat4.setTint(0x888888);

    // platform 5: right-lower
    const plat5 = this.platforms.create(600, 470);
    plat5.setDisplaySize(100, 20).setScale(1).refreshBody();
    plat5.setTint(0x888888);
  }

  update(time, delta) {
    // player horizontal movement
    const speed = 300;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    const floorY = 548; // platform top is at ~560, collision zone starts at ~548
    // check each item for bounces on floor or platforms
    this.items.getChildren().forEach((it) => {
      if (it.y > this.scale.height + 50) {
        it.destroy();
        return;
      }
      // detect bounce: track previous velocity to detect direction change
      const prevVelY = it.getData("prevVelY") || 0;
      const currVelY = it.body.velocity.y;
      
      // if velocity changed from positive (falling) to negative (bouncing up) or near-zero, it bounced
      const bounced = prevVelY > 10 && currVelY < 5;
      
      if (bounced) {
        // decrease durability
        let durability = it.getData("durability") || 3;
        durability -= 1;
        it.setData("durability", durability);
        if (durability <= 0) {
          it.destroy();
        }
      }
      // update previous velocity for next frame
      it.setData("prevVelY", currVelY);
    });
  }

  createShapeTextures() {
    // square texture
    if (!this.textures.exists("square-text")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xff0000, 1);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture("square-text", 32, 32);
      g.clear();
    }

    // triangle texture
    if (!this.textures.exists("triangle-text")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x00ff00, 1);
      g.beginPath();
      g.moveTo(16, 0);
      g.lineTo(32, 32);
      g.lineTo(0, 32);
      g.closePath();
      g.fillPath();
      g.generateTexture("triangle-text", 32, 32);
      g.clear();
    }

    // diamond (rhombus) texture
    if (!this.textures.exists("diamond-text")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x0000ff, 1);
      g.beginPath();
      g.moveTo(16, 0);
      g.lineTo(32, 16);
      g.lineTo(16, 32);
      g.lineTo(0, 16);
      g.closePath();
      g.fillPath();
      g.generateTexture("diamond-text", 32, 32);
      g.clear();
    }

    // bomb texture (black circle with warning)
    if (!this.textures.exists("bomb-text")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x1a1a1a, 1);
      g.fillCircle(16, 16, 14);
      g.fillStyle(0xff8800, 1);
      g.fillRect(12, 8, 8, 8);
      g.generateTexture("bomb-text", 32, 32);
      g.clear();
    }
  }

  spawnItem() {
    if (this.ended) return;
    const x = Phaser.Math.Between(20, this.scale.width - 20);
    const type = Phaser.Utils.Array.GetRandom(this.shapes);
    let key = "square-text";
    if (type === "triangle") key = "triangle-text";
    if (type === "diamond") key = "diamond-text";
    if (type === "bomb") key = "bomb-text";

    const item = this.items.create(x, -20, key);
    item.setData("type", type);
    item.setData("durability", 3); // can bounce 3 times before disappearing
    item.setData("prevVelY", 0); // track velocity for bounce detection
    item.setDisplaySize(32, 32);
    item.body.setAllowGravity(true);
    item.setVelocityY(Phaser.Math.Between(80, 160));
    item.setBounce(0.7); // enable bouncing
  }

  collectItem(player, item) {
    const type = item.getData("type");
    // persist in array
    this.collected.push(type);
    // add points
    this.score += this.pointValues[type];
    item.destroy();
    this.scoreText.setText(`Puntaje: ${this.score}`);
    this.countText.setText(this.getCountsText());

    // verify win: score >= 100
    if (this.score >= 100 && !this.ended) {
      this.ended = true;
      // transition to game over scene (won)
      this.scene.start("game-over", { won: true, score: this.score });
    }
  }

  onSecond() {
    if (this.ended) return;
    this.timeLeft -= 1;
    if (this.timeLeft < 0) this.timeLeft = 0;
    this.timerText.setText(`Tiempo: ${this.timeLeft}s`);
    if (this.timeLeft <= 0) {
      this.loseGame();
    }
  }

  loseGame() {
    if (this.ended) return;
    this.ended = true;
    // transition to game over scene (lost)
    this.scene.start("game-over", { won: false, score: this.score });
  }

  getCounts() {
    const counts = {};
    this.collected.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }

  getCountsText() {
    const counts = this.getCounts();
    return `Square: ${counts.square || 0} (20pts)  Triangle: ${counts.triangle || 0} (30pts)  Diamond: ${counts.diamond || 0} (50pts)  Bomb: ${counts.bomb || 0} (-40pts)`;
  }
}
