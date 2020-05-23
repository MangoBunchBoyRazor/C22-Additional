//Aliases for the Matter. namespace
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
//const Render = Matter.Render;
const Body = Matter.Body;

//Declaring global variables
var engine, world, object, gameState, Canvas, score;

//Declaring the images
var tom1Img, tom2Img, jerry1Img, jerry2Img, backgroundImg; 

//The sprites
var tom, jerry, backgroundS;

//Function to load all the images
function preload(){
  //Tom images
  tom1Img = loadImage("tomPart1.png.png"); 
  tom2Img = loadImage("tomPart2.png.png");
  //Jerry images
  jerry1Img = loadImage("runningJerry-1.png.png"); 
  jerry2Img = loadImage("sleepingJerry-1.png.png");
  //Background
  backgroundImg = loadImage("background.png");
}

function setup() {
  Canvas = createCanvas(749,576); //Creating the canvas
  
  engine = Engine.create(); //Creating the physics engine

  world = engine.world; //Variable reference to the world object in the engine

  world.gravity = {scale: 0, x: 0, y: 0}; //Changing the gravity to zero

  //Creating the background sprite
  backgroundS = createSprite(width/2,height/2,width,height);
  backgroundS.addImage(backgroundImg);  //Adding image to the background

  //Creating the tom sprite
  tom = createSprite(50,200,50,50);
  tom.addImage(tom1Img);  //Adding the image to the sprite

  //Creating the jerry sprite
  jerry = createSprite(Canvas.width/2,Canvas.height/2,50,50);
  jerry.addImage(jerry2Img);  //Adding image to the sprite

  //Creating the physics engine body for the jerry sprite
  Jerryobject = Bodies.rectangle(jerry.position.x,jerry.position.y,jerry.width,jerry.height);
  World.add(world,Jerryobject); //Adding it to the world of the physics engine
  Jerryobject.frictionAir = 0.03; //Adjusting the friction to suit the game's needs

  //Creating the physics engine body for the jerry sprite
  Tomobject = Bodies.rectangle(tom.position.x,tom.position.y,tom.width,tom.height);
  World.add(world,Tomobject);

  gameState = "start"; //Variable to keep track of the game
  score = 0;  //Variable to keep track of the score

  //Built-in matter.js renderer which was used for debugging
  /*var render = Render.create({
    engine: engine,
    element: document.body,
    options: {
      width: Canvas.width,
      height : Canvas.height
    }
  });
  Render.run(render);
  console.log(render);*/
}

function draw() {
  //Updating the engine
  Engine.update(engine);

  //Setting the position of the physics engine body to the position of the sprite
  Tomobject.position.x = tom.position.x;
  Tomobject.position.y = tom.position.y;

  //Setting angular velocity to zero to prevent unnecessary body rotation
  Body.setAngularVelocity(Jerryobject,0);
  Body.setAngularVelocity(Tomobject,0);

  //Setting the position of the physics engine body to the position of the sprite
  jerry.position.x = Jerryobject.position.x;
  jerry.position.y = Jerryobject.position.y;

  //Changing the sleeping jerry to running jerry when tom touches it
  if(tom.isTouching(jerry)){
    jerry.addImage(jerry1Img);
  }
  //Changing tom animation according to the position of jerry
  if(tom.position.x > jerry.position.x)
    tom.addImage(tom2Img);
  else
    tom.addImage(tom1Img);

  drawSprites();  //Drawing sprites

  //Displaying starting text
  if(gameState === "start"){
    stroke(255,0,0);
    strokeWeight(5);
    fill(255,255,0);
    textAlign(CENTER);
    textSize(25);
    text("The Tom and Jerry Game",Canvas.width/2,100);
    textSize(15);
    text("Click to start",Canvas.width/2,150);
    jerry.addImage(jerry2Img);
  }
  //What to do when game is play
  if(gameState === "play"){
    //Controls for tom
    tom.position.x = mouseX;  
    tom.position.y = mouseY;

    //Changing gamestate to over if jerry escapes i.e. moves out of the canvas
    if(jerry.position.x > width || jerry.position.x < 0)
      gameState = "over";
    if(jerry.position.y > height || jerry.position.y < 0)
      gameState = "over";

    //INcreasing game score when tom touches jerry
    if(tom.isTouching(jerry))
      score++;
    
    //Displaying instructions
    stroke(255,0,0);
    strokeWeight(5);
    fill(255,255,0);
    textAlign(CENTER);
    textSize(15);
    text("touch jerry to increase your score", width/2, 100);
  }
  if(gameState === "over"){
    //Displaying game over text
    stroke(255,0,0);
    strokeWeight(5);
    fill(255,255,0);
    textAlign(CENTER);
    textSize(25);
    text("You lost. Jerry has escaped!",width/2,100);
    textSize(15);
    text("Press r to restart",width/2,150);
    //Restarting the game
    if(keyDown('r')){
      gameState = "start";
      tom.position.x = 50;
      tom.position.y = height/2;
      Body.setPosition(Jerryobject, {x: width/2, y: height/2});
      Body.setVelocity(Jerryobject, {x: 0, y: 0});
    }
  }
  //Score
  fill(255,255,0);
  textSize(12);
  text("Score: "+score,width - 100,100);
}
//Function to handle mouse inputs
function mouseClicked(){
  if(gameState === "start")
    gameState = "play";
}