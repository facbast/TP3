export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  init(data) {
    this.gameData = data || { won: false, score: 0 };
  }

  preload() {
    this.load.image("sky", "./public/assets/space3.png");
  }

  create() {
    // background
    this.add.image(400, 300, "sky");

    // semi-transparent overlay
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

    // determine outcome and colors
    const won = this.gameData.won;
    const outcomeText = won ? "¡GANASTE!" : "¡PERDISTE!";
    const outcomeColor = won ? "#00ff00" : "#ff0000";

    // outcome text (large)
    this.add
      .text(400, 150, outcomeText, {
        fontSize: "72px",
        fill: outcomeColor,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // score display (medium)
    this.add
      .text(400, 280, `Puntuación: ${this.gameData.score}`, {
        fontSize: "48px",
        fill: "#ffff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // outcome message (small)
    let message = "";
    if (won) {
      message = "¡Felicidades! ¡Alcanzaste 100 puntos!";
    } else {
      message = "Se acabó el tiempo. ¡Inténtalo de nuevo!";
    }
    this.add
      .text(400, 380, message, {
        fontSize: "28px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // restart instruction
    this.add
      .text(400, 480, "Presiona ESPACIO para reiniciar", {
        fontSize: "20px",
        fill: "#cccccc",
      })
      .setOrigin(0.5);

    // restart on space key
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("hello-world");
    });

    // also allow clicking
    this.input.on("pointerdown", () => {
      this.scene.start("hello-world");
    });
  }

  update() {
    // nothing to update
  }
}
