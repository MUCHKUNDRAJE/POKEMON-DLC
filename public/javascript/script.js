const canvas = document.querySelector("canvas");
const tackleAudiovolume = 0.5


canvas.width = 1014;
canvas.height = 566;
const c = canvas.getContext("2d");




// Audio needs user interaction first due to browser autoplay policies
window.audioPlaying = false;
const backgroundMusic = new Audio('/Audio/map.wav');
const battleMusic = new Audio('/Audio/BattleMusic.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.7;

battleMusic.loop = true;
battleMusic.volume = 0.7;

// Wait for user interaction before playing audio
window.addEventListener('click', () => {
  if (!window.audioPlaying) {
    backgroundMusic.play();
    window.audioPlaying = true;
  }
}, { once: true });



c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "/images/pokemon.png";

const player_left = new Image();
player_left.src = "/images/leftplayer.png";

const player_front = new Image();
player_front.src = "/images/frontplayer.png";

const player_right = new Image();
player_right.src = "/images/rightplayer.png";

const player_back = new Image();
player_back.src = "/images/upplayer.png";

let collision_map = [];
for (let i = 0; i < collision.length; i += 80) {
  collision_map.push(collision.slice(i, 80 + i));
}

let battlefield_map = [];
for (let i = 0; i < battlefield.length; i += 80) {
  battlefield_map.push(battlefield.slice(i, 80 + i));
}



class Boundary {
  static width = 49;
  static height = 49;

  constructor({ position }) {
    this.position = position;
    this.width = 49;
    this.height = 49;
  }

  draw() {
    c.fillStyle = "rgb(255,0,0,0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const offset = {
  x: -290,
  y: -1500,
};
const boundary = [];

collision_map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1702) {
      boundary.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const battleZone = []

battlefield_map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1702) {
      battleZone.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});




let frameX = 0;
let frameY = 0; // Changed to 0 since we're only using one row
let gameFrame = 0;


class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } , width ,height }) {
    this.position = position;
    this.image = image;
    this.frames = frames; // Fixed property name
    this.currentFrame = 0;
    this.width = width,
    this.height =  height // Added to track current animation frame
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
      
    };
    this.moving = false;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.frames.max), // Use currentFrame instead of frameX
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

var fight_button = document.querySelector("#Fight-button")
fight_button.addEventListener("click",()=>{


})




const playerSprite = new Sprite({
  position: {
    x: canvas.width / 2 - 232 / 4 / 2,
    y: canvas.height / 2 - 52 / 2,
  },
  image: player_front,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

image.onload = () => {
  c.drawImage(image, -300, -1500);
};

let movableEntities = [background, ...boundary , ...battleZone];

function collision101({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  );
}

// Create a separate flag for tackle hit sound
let tackleHitPlaying = false;

const battle =
{
  initiated : false 
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);  

  const animationId = window.requestAnimationFrame(animate);
  
  background.draw();
  boundary.forEach((bound) => {
    bound.draw();
  });
  
  battleZone.forEach((battlePoints)=>{
    battlePoints.draw();
  })
  // Update sprite animation frame

  if (playerSprite.moving) {
    if (gameFrame % 10 === 0) { // Slow down animation by updating every 10 frames
      playerSprite.currentFrame = (playerSprite.currentFrame + 1) % playerSprite.frames.max;
    }
    gameFrame++;
  }

  
  playerSprite.draw();
  let move = true;
  playerSprite.moving = false;
  // responsibale for Battle collison
if (battle.initiated) return

 if(keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed)
 {
  
  for (let i = 0; i < battleZone.length; i++) {
    const battlePoints = battleZone[i];
    const overlappingArea =  (Math.min(
      playerSprite.position.x + playerSprite.width,
      battlePoints.position.x + battlePoints.width
    ) -
      Math.max(playerSprite.position.x, battlePoints.position.x)) *
    (Math.min(
      playerSprite.position.y + playerSprite.height,
      battlePoints.position.y + battlePoints.height
    ) -
      Math.max(playerSprite.position.y, battlePoints.position.y))
     
    
    if (
      collision101({
        rect1: playerSprite,
        rect2:battlePoints
      }) &&
        overlappingArea > (playerSprite.width * playerSprite.height) / 2
        && Math.random() < 0.01


    ) {
      backgroundMusic.pause();
      battleMusic.play();
  
    window.cancelAnimationFrame(animationId)
    battle.initiated = true
    gsap.to("#overlay" , {
      opacity: 1,
      repeat:5,
      yoyo:true,
      duration:0.3,
      onComplete(){
        animationBattle();
           gsap.to("#overlay",{
            opacity:0,
            duration:0.4,
           })
           gsap.to(["#battlecontrol", "#emenyBattleInterface", "#PlayerBattleInterface"], { 
            display: "block", 
          });

           gsap.to(["#battlecontrol", "#emenyBattleInterface", "#PlayerBattleInterface"], { 
            opacity: 1, 
            duration: 0.2,
          });

      }
    })

    

      break;
    }
  }
 }

//  gsap.to(["#battlecontrol", "#emenyBattleInterface", "#PlayerBattleInterface"], { 
//   display: "block", 
// });

//  gsap.to(["#battlecontrol", "#emenyBattleInterface", "#PlayerBattleInterface"], { 
//   opacity: 1, 
//   duration: 0.2,
// });

  if (keys.w.pressed && lastkey === "w") {
   
    playerSprite.moving = true;
    playerSprite.image = player_back;
    for (let i = 0; i < boundary.length; i++) {
      const bound = boundary[i];
      if (
        collision101({
          rect1: playerSprite,
          rect2: {
            ...bound,
            position: {
              x: bound.position.x,
              y: bound.position.y + 1,
            },
          },
        })
      ) {
      
        if (!tackleHitPlaying) {
          tackleHitPlaying = true;
          const audio = new Audio("/Audio/wall_collision.wav");
          audio.volume =tackleAudiovolume;
          audio.addEventListener('ended', () => {
            tackleHitPlaying = false;
          });
          audio.play();
        }
        move = false;
        break;
      }
    }
   
    if (move) { 
      movableEntities.forEach((move) => {
        move.position.y += 1;
      });
    }
  }

  
  if (keys.s.pressed && lastkey === "s") {
    playerSprite.moving = true;
    playerSprite.image = player_front;
    for (let i = 0; i < boundary.length; i++) {
      const bound = boundary[i];
      if (
        collision101({
          rect1: playerSprite,
          rect2: {
            ...bound,
            position: {
              x: bound.position.x,
              y: bound.position.y - 1,
            },
          },
        })
      ) {
      
        if (!tackleHitPlaying) {
          tackleHitPlaying = true;
          const audio = new Audio("/Audio/wall_collision.wav");
          audio.volume =tackleAudiovolume
          audio.addEventListener('ended', () => {
            tackleHitPlaying = false;
          });
          audio.play();
        }
        move = false;
        break;
      }
    }
    if (move) { 
      movableEntities.forEach((move) => {
        move.position.y -= 1;
      });
    }
  }
  if (keys.a.pressed && lastkey === "a") {
    playerSprite.moving = true;
    playerSprite.image = player_left;
    for (let i = 0; i < boundary.length; i++) {
      const bound = boundary[i];
      if (
        collision101({
          rect1: playerSprite,
          rect2: {
            ...bound,
            position: {
              x: bound.position.x + 3,
              y: bound.position.y,
            },
          },
        })
      ) {
     
        if (!tackleHitPlaying) {
          tackleHitPlaying = true;
          const audio = new Audio("/Audio/wall_collision.wav");
          audio.volume =tackleAudiovolume
          audio.addEventListener('ended', () => {
            tackleHitPlaying = false;
          });
          audio.play();
        }
        move = false;
        break;
      }
    }
    if (move) { 
      movableEntities.forEach((move) => {
        move.position.x += 1;
      });
    }
  }
  if (keys.d.pressed && lastkey === "d") {
    playerSprite.moving = true;
    playerSprite.image = player_right;
    for (let i = 0; i < boundary.length; i++) {
      const bound = boundary[i];
      if (
        collision101({
          rect1: playerSprite,
          rect2: {
            ...bound,
            position: {
              x: bound.position.x - 3,
              y: bound.position.y,
            },
          },
        })
      ) {
      
        if (!tackleHitPlaying) {
          tackleHitPlaying = true;
          const audio = new Audio("/Audio/wall_collision.wav");
          audio.volume =tackleAudiovolume
          audio.addEventListener('ended', () => {
            tackleHitPlaying = false;
          });
          audio.play();
        }
        move = false;
        break;
      }
    }
    if (move) { 
      movableEntities.forEach((move) => {
        move.position.x -= 1;
      });
    }
  }
}
animate();
// animationBattle();

const BattlegroundImage = new Image();
BattlegroundImage.src = "/images/battleBackground.png"; 

Pokemon = new Image();
Pokemon.src = "/images/Foragerra.png";

battlemon = new Image();
battlemon.src = "/images/Flambull.png";

const Battleground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: BattlegroundImage,
})

const PokemonDraw = new Sprite({
  position: {
    x: 280,
    y: 260,
  },
  image: Pokemon,
  frames: {
    max: 1,
  },  
  width:210,
  height:320,
  
})

let animationbattlePokemon = 0 ;
const battlemonDraw = new Sprite({
  position: {
    x: animationbattlePokemon,
    y: 60,
  },
  image: battlemon,
  frames: {
    max: 1,
  },  
})
function animationBattle()
{
  window.requestAnimationFrame(animationBattle)

 
  Battleground.draw();
 
  battlemonDraw.position.x = animationbattlePokemon;
  battlemonDraw.draw();


  if (animationbattlePokemon < 750)  animationbattlePokemon += 3;
  if (animationbattlePokemon == 750 )PokemonDraw.draw() ;
 
}

const battle_dailogs = [
  "Flambull spotted at the bush!",
  "Wanna fight me?",
  "Let's fight!",
  "Go, Foragerra!",
  "Show them who’s the boss!",
  "What Will You do?"
];

document.addEventListener("DOMContentLoaded", () => {
  const textbox = document.querySelector("#text-box");
  let count_battle_sequences = 0;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && count_battle_sequences < battle_dailogs.length) {
      let characters = battle_dailogs[count_battle_sequences].match(/[\S\s]/g); 
      // Keeps spaces, letters, and punctuation as separate elements

      textbox.innerHTML = ""; // Clear previous text

      characters.forEach((char) => {
        let span = document.createElement("span");
        span.innerHTML = char === " " ? "&nbsp;" : char; // Render spaces properly
        span.classList.add("text");
        textbox.appendChild(span);
      });

      gsap.from(".text", {
        // y: 10,
        opacity: 0,
        duration: 0.2,
        ease: "power3",
        stagger: 0.05, // Fast animation per character
      });

      count_battle_sequences++;
    }
  });
});

// animationBattle();

var main = document.querySelector("#main");

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastkey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastkey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastkey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastkey = "d";
      break;
  }
});

var lastkey;
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      playerSprite.moving = false;
      break;
    case "a":
      keys.a.pressed = false;
      playerSprite.moving = false;
        break;
    case "s":
      keys.s.pressed = false;
      playerSprite.moving = false;
      break;
    case "d":
      keys.d.pressed = false;
      playerSprite.moving = false;
      break;
  }
});
