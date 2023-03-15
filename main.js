

window.addEventListener("load", function(event) {

  "use strict";
 

  const timer=document.getElementById("timer");
  timer.style.position="absolute";
  timer.style.bottom="93%";
  timer.style.left="17.5%";
  timer.style.fontSize="40px";
  timer.style.visibility="hidden";

  let myTimer;
  function clock(c) {
    myTimer = setInterval(myClock, 1000);
    

    function myClock() {
      document.getElementById("timer").innerHTML = --c;
      if (c == 0) {
        clearInterval(myTimer);
        game.MainMenu.showGameOver();
        game.menuUtility.canvas1.style.visibility="hidden";
        timer.style.visibility="hidden";
      }
    }
  }

  const ZONE_PREFIX = "level/zone";
  const ZONE_SUFFIX = ".json";

 

  const AssetsManager = function() {

    this.tile_set_image = undefined;

  };

  AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    
    requestJSON:function(url, callback) {

      let request = new XMLHttpRequest();

      request.addEventListener("load", function(event) {

        callback(JSON.parse(this.responseText));

      }, { once:true });

      request.open("GET", url);
      request.send();

    },

  
    requestImage:function(url, callback) {

      let image = new Image();

      image.addEventListener("load", function(event) {

        callback(image);

      }, { once:true });

      image.src = url;

    },

  };


  let keyDownUp = function(event) {

    controller.keyDownUp(event.type, event.keyCode);

  };

  let resize = function(event) {

    display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
    display.render();

  };

  let render = function() {

    display.drawMap   (assets_manager.tile_set_image,
    game.world.tile_set.columns, game.world.graphical_map, game.world.columns,  game.world.tile_set.tile_size);

    let frame = game.world.tile_set.frames[game.world.player.frame_value];

    display.drawObject(assets_manager.tile_set_image,
    frame.x, frame.y,
    game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
    game.world.player.y + frame.offset_y, frame.width, frame.height);

    display.render();

  };

  var update = function() {

    if (controller.left.active ) { game.world.player.moveLeft ();                               }
    if (controller.right.active) { game.world.player.moveRight();                               }
    if (controller.up.active   ) { game.world.player.jump();      controller.up.active = false; game.menuUtility.jumpMusic.play();}
    if (controller.esc.active  ) { game.menuUtility.canvas1.style.visibility="hidden"; game.menuUtility.levelMusic.pause(); game.menuUtility.levelMusic.currentTime=0; game.menuUtility.titleMusic.play(); timer.style.visibility="hidden";clearInterval(myTimer); game.MainMenu.showMainMenu();}
    game.update();

    
    if (game.world.door) {

      engine.stop();

      
      assets_manager.requestJSON(ZONE_PREFIX + game.world.door.destination_zone + ZONE_SUFFIX, (zone) => {

        game.world.setup(zone);

        engine.start();

      });

      return;

    }

  };

 

  let assets_manager = new AssetsManager();
  let controller     = new Controller();
  let game           = new Game();
  window.game = game;
  let display        = new Display(document.querySelector("canvas"));
  let engine         = new Engine(1000/30, render, update);

  

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width  = game.world.width;
  display.buffer.imageSmoothingEnabled = false;

  

  game.menuUtility.btn1.addEventListener("click",function(){

    game.world.zone_id="00";
    game.world.player.x=21;
    game.world.player.y=100;

    clearInterval(myTimer);
    clock(45);
    engine.stop();

    game.menuUtility.titleMusic.pause();
    game.menuUtility.titleMusic.currentTime=0;

    game.menuUtility.levelMusic.play();

  
    assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {

      game.world.setup(zone);
      console.log(game.world.player);
  
      assets_manager.requestImage("textures/timejump.png", (image) => {
  
        assets_manager.tile_set_image = image;
  
        resize();
        engine.start();
        
      });
      
      game.MainMenu.hideMainMenu();
      timer.style.visibility="visible";
     

  });

  
  
  });

  game.menuUtility.btn2.addEventListener("click",function(){
    
    game.world.zone_id="05";
    game.world.player.x=21;
    game.world.player.y=80;

    clearInterval(myTimer);
    clock(50);

    engine.stop();

    game.menuUtility.titleMusic.pause();
    game.menuUtility.titleMusic.currentTime=0;

    game.menuUtility.levelMusic.play();
    

    assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {

      game.world.setup(zone);
  
      assets_manager.requestImage("textures/timejump.png", (image) => {
  
        assets_manager.tile_set_image = image;
  
        resize();
        engine.start();
  
      });
      
      game.MainMenu.hideMainMenu();
      timer.style.visibility="visible";
  });

  });

  game.menuUtility.btn3.addEventListener("click",function(){

    if(game.world.zone_id>="00"&&game.world.zone_id<="04"){
      
      game.world.zone_id="00";
      game.world.player.x=21;
      game.world.player.y=100;
      
      clearInterval(myTimer);
      clock(45);

      game.menuUtility.gameoverMusic.pause();
      game.menuUtility.gameoverMusic.currentTime=0;

      game.menuUtility.levelMusic.play();
    
      

    }else if(game.world.zone_id>="05"&&game.world.zone_id<="09"){
      
      game.world.zone_id="05";
      game.world.player.x=21;
      game.world.player.y=80;

      clearInterval(myTimer);
      clock(50);

      game.menuUtility.gameoverMusic.pause();
      game.menuUtility.gameoverMusic.currentTime=0;

      game.menuUtility.levelMusic.play();
    }else if(game.world.zone_id>="10"&&game.world.zone_id<="14"){
      
      game.world.zone_id="10";
      game.world.player.x=21;
      game.world.player.y=0;

      clearInterval(myTimer);
      //clock(50);

      game.menuUtility.gameoverMusic.pause();
      game.menuUtility.gameoverMusic.currentTime=0;

      game.menuUtility.levelMusic.play();
    }

    engine.stop();
  
      assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {
  
        game.world.setup(zone);
    
        assets_manager.requestImage("textures/timejump.png", (image) => {
    
          assets_manager.tile_set_image = image;
    
          resize();
          engine.start();
          
        });
        
        game.MainMenu.hideGameOver();
        timer.style.visibility="visible";
    });
  

    


  });

  game.menuUtility.btn4.addEventListener("click",function(){
    
    engine.stop();

    game.menuUtility.gameoverMusic.pause();
    game.menuUtility.gameoverMusic.currentTime=0;

    game.menuUtility.victoryMusic.pause();
    game.menuUtility.victoryMusic.currentTime=0;

    game.menuUtility.titleMusic.play();
    

  
    game.MainMenu.hideLevelComplete();
    game.MainMenu.hideGameOver();
    game.MainMenu.showMainMenu();
    
    timer.style.visibility="hidden";

    clearInterval(myTimer);


  });

  game.menuUtility.btn5.addEventListener("click",function(){

    if(game.world.zone_id=="04"){

      game.world.zone_id="05";
      game.world.player.x=21;
      game.world.player.y=80;

      clearInterval(myTimer);
      clock(50);

      game.menuUtility.victoryMusic.pause();
      game.menuUtility.victoryMusic.currentTime=0;
      
      game.menuUtility.levelMusic.play();
    }else if(game.world.zone_id=="09"){
      game.world.zone_id="10";
      game.world.player.x=21;
      game.world.player.y=0;

      clearInterval(myTimer);

      game.menuUtility.victoryMusic.pause();
      game.menuUtility.victoryMusic.currentTime=0;
      
      game.menuUtility.levelMusic.play();
    }
    
    engine.stop();

    assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {
  
      game.world.setup(zone);
  
      assets_manager.requestImage("textures/timejump.png", (image) => {
  
        assets_manager.tile_set_image = image;
  
        resize();
        engine.start();
        
      });
      
      game.MainMenu.hideLevelComplete();
      timer.style.visibility="visible";
  });
  
  });

  game.menuUtility.btn6.addEventListener("click",function(){
    
    game.world.zone_id="10";
    game.world.player.x=21;
    game.world.player.y=0;

    clearInterval(myTimer);
    //clock(50);

    engine.stop();

    game.menuUtility.titleMusic.pause();
    game.menuUtility.titleMusic.currentTime=0;

    game.menuUtility.levelMusic.play();
    

    assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {

      game.world.setup(zone);
  
      assets_manager.requestImage("textures/timejump.png", (image) => {
  
        assets_manager.tile_set_image = image;
  
        resize();
        engine.start();
  
      });
      
      game.MainMenu.hideMainMenu();
      timer.style.visibility="visible";
  });

  });

  game.menuUtility.btn7.addEventListener("click",function(){

    game.MainMenu.hideMainMenu();
    game.MainMenu.showControls();

  });

  game.menuUtility.btn8.addEventListener("click",function(){

    game.MainMenu.showMainMenu();
    game.MainMenu.hideControls();

  });

  game.menuUtility.btn9.addEventListener("click",function(){

    if(game.menuUtility.levelMusic.volume==0.5){

      game.menuUtility.levelMusic.volume=0;
      game.menuUtility.gameoverMusic.volume=0;
      game.menuUtility.jumpMusic.volume=0;
      game.menuUtility.victoryMusic.volume=0;
      game.menuUtility.titleMusic.volume=0;



    }else{

      game.menuUtility.levelMusic.volume=0.5;
      game.menuUtility.gameoverMusic.volume=0.5;
      game.menuUtility.jumpMusic.volume=0.5;
      game.menuUtility.victoryMusic.volume=0.5;
      game.menuUtility.titleMusic.volume=0.5;

    }
   

  });



  
  game.menuUtility.titleMusic.play();

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup"  , keyDownUp);
  window.addEventListener("resize" , resize);

});


