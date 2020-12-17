var dog,dogimg, happyDog, database, foodS, foodStock
var fedTime,lastFed
var feed,addFood;
var foodObj
var gameState 
var changingGameState
var readinggameState
var bedroomimg, gardenimg, washroomimg
var currentTime


function preload()
{
  dogimg=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png")
  bedroomimg=loadImage("images/Bed Room.png")
  gardenimg=loadImage("images/Garden.png")
  washroomimg=loadImage("images/Wash Room.png")
}

function setup() {

	createCanvas(500, 500);
  database = firebase.database();
   foodObj=new food()



  foodStock=database.ref('Food')
  foodStock.on("value",readStock)
 
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState')
  readState.on("value",function(data){
gameState=data.val()
  })

  feed=createButton("Feed the dog")
  feed.position(400,300)
  feed.mousePressed(feedDog)

  addFood=createButton("Add Food")
  addFood.position(500,300)
  addFood.mousePressed(addFoods)

  

}

function draw() {

 
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing")
  foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom()
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom()
  }else{
    update("Hungry")
    foodObj.display()
  }


  if(gameState!="Hungry"){
    feed.hide()
    addFood.hide()
    dog.remove()
  }else{
    feed.show()
    addFood.show()
  dog.addImage(dogimg)
  }

 

 
  
  
  
  

  
  drawSprites();
  fill (255,255,254)
  stroke ("black")
  text("foodRemaining :"+foodS,150,50)
  textSize(10)

 
}
 function readStock(data){
   foodS=data.val()
   foodObj.updateFoodStock(foodS)
 }

 

 function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}