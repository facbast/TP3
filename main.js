import MenuScene from "./scenes/MenuScene.js";
import HelloWorldScene from "./scenes/HelloWorldScene.js";
import GameOverScene from "./scenes/GameOverScene.js";
import LabyrinthScene from "./scenes/LabyrinthScene.js";
import LabyrinthScene2 from "./scenes/LabyrinthScene2.js";
import LabyrinthScene3 from "./scenes/LabyrinthScene3.js";
import LabyrinthWinScene from "./scenes/LabyrinthWinScene.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [MenuScene, HelloWorldScene, GameOverScene, LabyrinthScene, LabyrinthScene2, LabyrinthScene3, LabyrinthWinScene],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
