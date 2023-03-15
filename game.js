


const Game = function() {

  this.world    = new Game.World(this);
  this.MainMenu = new Game.MainMenu();
  this.menuUtility = new Game.menuUtility();
  this.update   = function() {

    this.world.update();

  };

  

};
Game.prototype = { constructor : Game };

Game.Animator = function(frame_set, delay) {

 this.count       = 0;
 this.delay       = (delay >= 1) ? delay : 1;
 this.frame_set   = frame_set;
 this.frame_index = 0;
 this.frame_value = frame_set[0];
 this.mode        = "pause";

};
Game.Animator.prototype = {

 constructor:Game.Animator,

 animate:function() {

   switch(this.mode) {

     case "loop" : this.loop(); break;
     case "pause":              break;

   }

 },

 changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {

   if (this.frame_set === frame_set) { return; }

   this.count       = 0;
   this.delay       = delay;
   this.frame_set   = frame_set;
   this.frame_index = frame_index;
   this.frame_value = frame_set[frame_index];
   this.mode        = mode;

 },

 loop:function() {

   this.count ++;

   while(this.count > this.delay) {

     this.count -= this.delay;

     this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;

     this.frame_value = this.frame_set[this.frame_index];

   }

 }

};

Game.Collider = function(game) {
  this.game = game;
  
  this.collide = function(value, object, tile_x, tile_y, tile_size) {

    switch(value) {

      case  1:     this.collidePlatformTop    (object, tile_y            ); break;
      case  2:     this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  3: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  4:     this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  5: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  6: if (this.collidePlatformRight  (object, tile_x + tile_size)) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  7: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  8:     this.collidePlatformLeft   (object, tile_x            ); break;
      case  9: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 10: if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 12: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 13: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 14: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 15: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 16:     this.deathZone (object, tile_y + tile_size); break;
      case 17:     this.winZone (object, tile_y + tile_size); break;
                  }
      
  }

};
Game.Collider.prototype = {

  constructor: Game.Collider,

  collidePlatformBottom:function(object, tile_bottom) {

    if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {

      object.setTop(tile_bottom);
      object.velocity_y = 0;
      return true;

    } return false;

  },

  collidePlatformLeft:function(object, tile_left) {

    if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {

      object.setRight(tile_left - 0.01);
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformRight:function(object, tile_right) {

    if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {

      object.setLeft(tile_right);
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformTop:function(object, tile_top) {

    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {

      object.setBottom(tile_top - 0.01);
      object.velocity_y = 0;
      object.jumping    = false;
      return true;

    } return false;

  },

  deathZone:function(object, tile_top) {
    
    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
      this.game.MainMenu.showGameOver(this.game.menuUtility.canvas1,this.game.menuUtility.btn3,this.game.menuUtility.btn4,this.game.menuUtility.mainMenu,this.game.menuUtility.gameOver);
      this.game.menuUtility.canvas1.style.visibility="hidden";
      
      return true;
    } return false;

  },

  winZone:function(object, tile_top) {
    
    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
      this.game.MainMenu.showLevelComplete(this.game.menuUtility.canvas1,this.game.menuUtility.btn4,this.game.menuUtility.btn5,this.game.menuUtility.mainMenu,this.game.menuUtility.levelComplete);
      
      return true;
    } return false;

  }


 };

 

Game.Frame = function(x, y, width, height, offset_x, offset_y) {

  this.x        = x;
  this.y        = y;
  this.width    = width;
  this.height   = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;

};
Game.Frame.prototype = { constructor: Game.Frame };

Game.Object = function(x, y, width, height) {

 this.height = height;
 this.width  = width;
 this.x      = x;
 this.y      = y;

};

Game.Object.prototype = {

  constructor:Game.Object,

  getBottom : function()  { return this.y + this.height;       },
  getCenterX: function()  { return this.x + this.width  * 0.5; },
  getCenterY: function()  { return this.y + this.height * 0.5; },
  getLeft   : function()  { return this.x;                     },
  getRight  : function()  { return this.x + this.width;        },
  getTop    : function()  { return this.y;                     },
  setBottom : function(y) { this.y = y - this.height;          },
  setCenterX: function(x) { this.x = x - this.width  * 0.5;    },
  setCenterY: function(y) { this.y = y - this.height * 0.5;    },
  setLeft   : function(x) { this.x = x;                        },
  setRight  : function(x) { this.x = x - this.width;           },
  setTop    : function(y) { this.y = y;                        }

};

Game.MovingObject = function(x, y, width, height, velocity_max = 15) {

  Game.Object.call(this, x, y, width, height);

  this.jumping      = false;
  this.velocity_max = velocity_max;
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.x_old        = x;
  this.y_old        = y;

};

Game.MovingObject.prototype = {

  getOldBottom : function()  { return this.y_old + this.height;       },
  getOldCenterX: function()  { return this.x_old + this.width  * 0.5; },
  getOldCenterY: function()  { return this.y_old + this.height * 0.5; },
  getOldLeft   : function()  { return this.x_old;                     },
  getOldRight  : function()  { return this.x_old + this.width;        },
  getOldTop    : function()  { return this.y_old;                     },
  setOldBottom : function(y) { this.y_old = y    - this.height;       },
  setOldCenterX: function(x) { this.x_old = x    - this.width  * 0.5; },
  setOldCenterY: function(y) { this.y_old = y    - this.height * 0.5; },
  setOldLeft   : function(x) { this.x_old = x;                        },
  setOldRight  : function(x) { this.x_old = x    - this.width;        },
  setOldTop    : function(y) { this.y_old = y;                        }

};
Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;

Game.Door = function(door) {

 Game.Object.call(this, door.x, door.y, door.width, door.height);

 this.destination_x    = door.destination_x;
 this.destination_y    = door.destination_y;
 this.destination_zone = door.destination_zone;

};
Game.Door.prototype = {

 
 collideObject(object) {

   let center_x = object.getCenterX();
   let center_y = object.getCenterY();

   if (center_x < this.getLeft() || center_x > this.getRight() ||
       center_y < this.getTop()  || center_y > this.getBottom()) return false;

   return true;

 }

};
Object.assign(Game.Door.prototype, Game.Object.prototype);
Game.Door.prototype.constructor = Game.Door;

Game.Player = function(x, y) {

  Game.MovingObject.call(this, x, y, 7, 14);
  Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-left"], 10);

  this.jumping     = true;
  this.direction_x = -1;
  this.velocity_x  = 0;
  this.velocity_y  = 0;

};
Game.Player.prototype = {

  frame_sets: {

    "idle-left" : [0],
    "jump-left" : [1],
    "move-left" : [2, 3, 4],
    "idle-right": [5],
    "jump-right": [6],
    "move-right": [7, 8, 9]

  },

  jump: function() {

   
    if (!this.jumping && this.velocity_y < 10) {

      this.jumping     = true;
      this.velocity_y = 0;
      this.velocity_y -= 8;

    }

  },

  moveLeft: function() {

    this.direction_x = -1;
    this.velocity_x -= 2;

  },

  moveRight:function(frame_set) {

    this.direction_x = 1;
    this.velocity_x += 2;

  },

  updateAnimation:function() {

    if (this.velocity_y < 0) {

      if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "pause");
      else this.changeFrameSet(this.frame_sets["jump-right"], "pause");

    } else if (this.direction_x < 0) {

      if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 5);
      else this.changeFrameSet(this.frame_sets["idle-left"], "pause");

    } else if (this.direction_x > 0) {

      if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 5);
      else this.changeFrameSet(this.frame_sets["idle-right"], "pause");

    }

    this.animate();

  },
  
  updatePosition:function(gravity, friction) {

    this.x_old = this.x;
    this.y_old = this.y;

    this.velocity_y += gravity;
    this.velocity_x *= friction;

   
    if (Math.abs(this.velocity_x) > this.velocity_max)
    this.velocity_x = this.velocity_max * Math.sign(this.velocity_x);

    if (Math.abs(this.velocity_y) > this.velocity_max)
    this.velocity_y = this.velocity_max * Math.sign(this.velocity_y);

    this.x    += this.velocity_x;
    this.y    += this.velocity_y;

  }

};
Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;

Game.TileSet = function(columns, tile_size) {

  this.columns    = columns;
  this.tile_size  = tile_size;

  let f = Game.Frame;

  this.frames = [new f(0,  0, 16, 16, 0, -2), // idle-left
    new f(64,  0, 16, 16, 0, -2), // jump-left
    new f(16,  0, 16, 16, 0, -2), new f(32, 0, 16, 16, 0, -2), new f(48, 0, 16, 16, 0, -2), // walk-left
    new f(96, 0, 16, 16, 0, -2), // idle-right
    new f(176, 0, 16, 16, 0, -2), // jump-right
    new f(112,  0, 16, 16, 0, -2), new f(128, 0, 16, 16, 0, -2), new f(144, 0, 16, 16, 0, -2) // walk-right
   ];


};
Game.TileSet.prototype = { constructor: Game.TileSet };

Game.World = function(game, friction = 0.5, gravity = 0.8) {
  this.game = game;
  this.collider  = new Game.Collider(game);

  this.friction  = friction;
  this.gravity   = gravity;

  this.columns   = 16;
  this.rows      = 9;

  this.tile_set  = new Game.TileSet(32, 16);
  this.player    = new Game.Player(32, 76);

  this.zone_id   = "00";

  this.doors     = [];
  this.door      = undefined; 

  this.height    = this.tile_set.tile_size * this.rows;
  this.width     = this.tile_set.tile_size * this.columns;



};





Game.World.prototype = {

  constructor: Game.World,

  collideObject:function(object) {

  

    let bottom, left, right, top, value;

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

  },

 
  setup:function(zone) {

    
    this.graphical_map      = zone.graphical_map;
    this.collision_map      = zone.collision_map;
    this.columns            = zone.columns;
    this.rows               = zone.rows;
    this.doors              = new Array();
    this.zone_id            = zone.id;

    
    for (let index = zone.doors.length - 1; index > -1; -- index) {

      let door = zone.doors[index];
      this.doors[index] = new Game.Door(door);

    }

 
    if (this.door) {


      if (this.door.destination_x != -1) {

        this.player.setCenterX   (this.door.destination_x);
        this.player.setOldCenterX(this.door.destination_x);

      }

      if (this.door.destination_y != -1) {

        this.player.setCenterY   (this.door.destination_y);
        this.player.setOldCenterY(this.door.destination_y);

      }

      this.door = undefined;

    }

  },

  update:function() {

    this.player.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player);

   
    for(let index = this.doors.length - 1; index > -1; -- index) {

      let door = this.doors[index];

      if (door.collideObject(this.player)) {

        this.door = door;

      };

    }

    this.player.updateAnimation();

  }

};

Game.MainMenu = function(){
  
};

Game.MainMenu.prototype = {

  constructor: Game.MainMenu,

  hideMainMenu:function() {
    
    game.menuUtility.canvas1.style.visibility="visible";
    game.menuUtility.btn1.style.visibility="hidden";
    game.menuUtility.btn2.style.visibility="hidden";
    game.menuUtility.btn6.style.visibility="hidden";
    game.menuUtility.btn7.style.visibility="hidden";
    game.menuUtility.btn9.style.visibility="hidden";
    game.menuUtility.mainMenu.style.visibility="hidden";
    game.menuUtility.titleImg.style.visibility="hidden";
    
  },

  showMainMenu:function() {

    game.menuUtility.btn1.style.visibility="visible";
    game.menuUtility.btn2.style.visibility="visible";
    game.menuUtility.btn6.style.visibility="visible";
    game.menuUtility.btn7.style.visibility="visible";
    game.menuUtility.btn9.style.visibility="visible";
    game.menuUtility.mainMenu.style.visibility="visible";
    game.menuUtility.titleImg.style.visibility="visible";
    game.menuUtility.canvas1.style.visibility="hidden";
    

  },

  showGameOver:function() {
    
    
    game.menuUtility.btn3.style.visibility="visible";
    game.menuUtility.btn4.style.visibility="visible";
    game.menuUtility.mainMenu.style.visibility="visible";
    game.menuUtility.gameOver.style.visibility="visible";
    game.menuUtility.canvas1.style.visibility="hidden";

    game.menuUtility.levelMusic.pause(); 
    game.menuUtility.levelMusic.currentTime=0;
    game.menuUtility.gameoverMusic.play();
    
  },

  hideGameOver:function() {

    game.menuUtility.btn3.style.visibility="hidden";
    game.menuUtility.btn4.style.visibility="hidden";
    game.menuUtility.gameOver.style.visibility="hidden";
    game.menuUtility.canvas1.style.visibility="visible";
    game.menuUtility.mainMenu.style.visibility="hidden";
  },

  showLevelComplete:function() {
    
    
    game.menuUtility.btn4.style.visibility="visible";
    game.menuUtility.btn5.style.visibility="visible";
    game.menuUtility.mainMenu.style.visibility="visible";
    game.menuUtility.levelComplete.style.visibility="visible";
    game.menuUtility.canvas1.style.visibility="hidden";

    game.menuUtility.levelMusic.pause(); 
    game.menuUtility.levelMusic.currentTime=0;
    game.menuUtility.victoryMusic.play();
    
  },

  hideLevelComplete:function() {

    game.menuUtility.btn4.style.visibility="hidden";
    game.menuUtility.btn5.style.visibility="hidden";
    game.menuUtility.levelComplete.style.visibility="hidden";
    game.menuUtility.canvas1.style.visibility="visible";
    game.menuUtility.mainMenu.style.visibility="hidden";
  },

  showControls:function() {

    game.menuUtility.canvas1.style.visibility="hidden"
    game.menuUtility.mainMenu.style.visibility="visible";
    game.menuUtility.controls.style.visibility="visible";
    game.menuUtility.btn8.style.visibility="visible";
    
  },

  hideControls:function() {

    game.menuUtility.controls.style.visibility="hidden";
    game.menuUtility.btn8.style.visibility="hidden";
  }

  


}


  


Game.menuUtility = function(){

//Main Menü Überschrift
let titleImg=document.createElement("IMG");
titleImg.src="textures/TimeJump Logo.png";
titleImg.style.position="absolute";
titleImg.style.bottom="70%";
titleImg.style.left="25%";
const title = document.getElementById("title").appendChild(titleImg);

//Main Menü Bild
const mainMenu = document.getElementById("mainMenu");
mainMenu.style.position="absolute";

  
// Game Over Bild

const gameOver=document.createElement("IMG");
gameOver.src="textures/GameOver.png";
gameOver.style.position="absolute";
gameOver.style.bottom="70%";
gameOver.style.left="25%";
gameOver.style.visibility="hidden";
const title1 = document.getElementById("gameOver").appendChild(gameOver);

// Level Complete Bild

const levelComplete=document.createElement("IMG");
levelComplete.src="textures/LevelComplete.png";
levelComplete.style.position="absolute";
levelComplete.style.bottom="70%";
levelComplete.style.left="25%";
levelComplete.style.visibility="hidden";
const title2 = document.getElementById("levelComplete").appendChild(levelComplete);

//Steuerung Bild

const controls=document.createElement("IMG");
controls.src="textures/controls.png";
controls.style.position="absolute";
controls.style.bottom="30%";
controls.style.left="2.5%";
controls.style.visibility="hidden";
const title3 = document.getElementById("controls").appendChild(controls);

//buttons

 const btn1=document.getElementById("level1");
 btn1.innerHTML="Level 1";
 btn1.style.width="295px";
 btn1.style.height="65px";
 btn1.style.position="absolute";
 btn1.style.left="29%";
 btn1.style.bottom="63%";
 btn1.style.borderRadius="25px"
 btn1.style.backgroundImage="url('textures/menubutton.png')";


 const btn2=document.getElementById("level2");
 btn2.innerHTML="Level 2";
 btn2.style.width="295px";
 btn2.style.height="65px";
 btn2.style.position="absolute";
 btn2.style.left="29%";
 btn2.style.bottom="57%";
 btn2.style.borderRadius="25px"
 btn2.style.backgroundImage="url('textures/menubutton.png')";

 const btn3=document.getElementById("neustarten");
 btn3.innerHTML="Neustarten";
 btn3.style.width="295px";
 btn3.style.height="65px";
 btn3.style.position="absolute";
 btn3.style.left="29%";
 btn3.style.bottom="57%";
 btn3.style.visibility="hidden";
 btn3.style.borderRadius="25px"
 btn3.style.backgroundImage="url('textures/menubutton.png')";

 const btn4=document.getElementById("hauptmenue");
 btn4.innerHTML="Hauptmenue";
 btn4.style.width="295px";
 btn4.style.height="65px";
 btn4.style.position="absolute";
 btn4.style.left="29%";
 btn4.style.bottom="63%";
 btn4.style.visibility="hidden";
 btn4.style.borderRadius="25px"
 btn4.style.backgroundImage="url('textures/menubutton.png')";

 const btn5=document.getElementById("nextLevel");
 btn5.innerHTML="nächstes Level";
 btn5.style.width="295px";
 btn5.style.height="65px";
 btn5.style.position="absolute";
 btn5.style.left="29%";
 btn5.style.bottom="57%";
 btn5.style.visibility="hidden";
 btn5.style.borderRadius="25px"
 btn5.style.backgroundImage="url('textures/menubutton.png')";

 const btn6=document.getElementById("level3");
 btn6.innerHTML="Level 3";
 btn6.style.width="295px";
 btn6.style.height="65px";
 btn6.style.position="absolute";
 btn6.style.left="29%";
 btn6.style.bottom="51%";
 btn6.style.borderRadius="25px"
 btn6.style.backgroundImage="url('textures/menubutton.png')";

 const btn7=document.getElementById("steuerung");
 btn7.innerHTML="Steuerung";
 btn7.style.width="295px";
 btn7.style.height="65px";
 btn7.style.position="absolute";
 btn7.style.left="29%";
 btn7.style.bottom="45%";
 btn7.style.borderRadius="25px"
 btn7.style.backgroundImage="url('textures/menubutton.png')";

 const btn8=document.getElementById("exitSteuerung");
 btn8.innerHTML="Hauptmenue";
 btn8.style.width="295px";
 btn8.style.height="65px";
 btn8.style.position="absolute";
 btn8.style.left="29%";
 btn8.style.bottom="27%";
 btn8.style.borderRadius="25px"
 btn8.style.backgroundImage="url('textures/menubutton.png')";
 btn8.style.visibility="hidden";

 const btn9=document.getElementById("mute");
 btn9.innerHTML="Musik ein/aus";
 btn9.style.width="295px";
 btn9.style.height="65px";
 btn9.style.position="absolute";
 btn9.style.left="60%";
 btn9.style.bottom="93.5%";
 btn9.style.borderRadius="25px"
 btn9.style.backgroundImage="url('textures/menubutton.png')";

 const levelMusic=document.getElementById("levelMusic");
 levelMusic.volume=0.5;
 const victoryMusic=document.getElementById("victoryMusic");
 victoryMusic.volume=0.5;
 const gameoverMusic=document.getElementById("gameoverMusic");
 gameoverMusic.volume=0.5;
 const jumpMusic=document.getElementById("jumpMusic");
 jumpMusic.volume=0.5;
 const titleMusic=document.getElementById("titleMusic");
 titleMusic.volume=0.5;
 titleMusic.loop=true;

 const canvas1= document.querySelector("canvas");


 this.titleImg=titleImg;
 this.mainMenu=mainMenu;
 this.gameOver=gameOver;
 this.levelComplete=levelComplete;
 this.controls=controls;
 this.btn1=btn1;
 this.btn2=btn2;
 this.btn3=btn3;
 this.btn4=btn4;
 this.btn5=btn5;
 this.btn6=btn6;
 this.btn7=btn7;
 this.btn8=btn8;
 this.btn9=btn9;
 this.levelMusic=levelMusic;
 this.victoryMusic=victoryMusic;
 this.gameoverMusic=gameoverMusic;
 this.jumpMusic=jumpMusic;
 this.titleMusic=titleMusic;
 this.canvas1=canvas1;
};




