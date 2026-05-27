export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  preload() {
    this.load.image("sky", "./public/assets/space3.png");
  }

  create() {
    // background
    this.add.image(400, 300, "sky");

    // semi-transparent overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

    // title
    this.add.text(400, 80, "Selecciona un Juego", {
      fontSize: "48px",
      fill: "#ffff00",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Button 1: Item Collection Game
    const btn1 = this.add.rectangle(200, 250, 280, 80, 0x0066cc);
    btn1.setInteractive();
    btn1.on("pointerdown", () => {
      this.scene.start("hello-world");
    });
    btn1.on("pointerover", () => {
      btn1.setFillStyle(0x0088ff);
    });
    btn1.on("pointerout", () => {
      btn1.setFillStyle(0x0066cc);
    });

    this.add.text(200, 250, "Propuesta 1:\nRecolección", {
      fontSize: "18px",
      fill: "#ffffff",
      align: "center",
    }).setOrigin(0.5);

    // Button 2: Labyrinth Game
    const btn2 = this.add.rectangle(600, 250, 280, 80, 0x00cc00);
    btn2.setInteractive();
    btn2.on("pointerdown", () => {
      this.scene.start("labyrinth");
    });
    btn2.on("pointerover", () => {
      btn2.setFillStyle(0x00ff00);
    });
    btn2.on("pointerout", () => {
      btn2.setFillStyle(0x00cc00);
    });

    this.add.text(600, 250, "Propuesta 2:\nLaberinto", {
      fontSize: "18px",
      fill: "#ffffff",
      align: "center",
    }).setOrigin(0.5);

    // instructions
    this.add.text(400, 450, "Elige un juego para comenzar", {
      fontSize: "16px",
      fill: "#cccccc",
    }).setOrigin(0.5);
  }
}
