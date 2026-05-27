export default class LabyrinthWinScene extends Phaser.Scene {
  constructor() {
    super("labyrinth-win");
  }

  init(data) {
    this.totalScore = data?.totalScore || 0;
  }

  preload() {
    this.load.image("sky", "./public/assets/space3.png");
  }

  create() {
    // background
    this.add.image(400, 300, "sky");

    // semi-transparent overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

    // victory text
    this.add.text(400, 100, "¡COMPLETASTE EL LABERINTO!", {
      fontSize: "48px",
      fill: "#00ff00",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // score display
    this.add.text(400, 220, `Puntaje Total: ${this.totalScore}`, {
      fontSize: "44px",
      fill: "#ffff00",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // message
    this.add.text(400, 320, "¡Felicidades! ¡Escapaste de todos los laberintos!", {
      fontSize: "24px",
      fill: "#ffffff",
    }).setOrigin(0.5);

    // back to menu instruction
    this.add.text(400, 420, "Presiona ESPACIO para volver al menú", {
      fontSize: "18px",
      fill: "#cccccc",
    }).setOrigin(0.5);

    // back to menu on space key
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("menu");
    });

    // also allow clicking
    this.input.on("pointerdown", () => {
      this.scene.start("menu");
    });
  }
}
