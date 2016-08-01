function world()
{
  this.inhabitants = [];										// Used to store references of all the things living in the world

  this.populate = function()									 // Function to add the creatures to the world
  {
      this.inhabitants.push(new squareFractal(300,300,60,"#FF0000",7.5)); // TODO - Implement a more random population method. For now hardcoded. 
      this.inhabitants.push(new squareFractal(500,300,60,"#FF0000", 0));															// this.inhabitants[0].spawnNew(3);
	  															 // console.log(this.inhabitants)
      return;
  }
  
  this.update = function()										// Add 1 tick to the world. 
   {
      // console.log("Entered world.update()"); 
      
      for (var i = 0; i < this.inhabitants.length; ++i)			// Update and plot all inhabitants of the world
      {
         														// console.log("Inside loop of world.update()");
         this.inhabitants[i].update();
         this.inhabitants[i].plot();
      } 
  return;
  }
}


// ********************************************************************************
// **********************  Fractals below here
// ********************************************************************************

function squareFractal(centerX,centerY,size,color,rotation)
{
  this.individualSquares = [];
  console.log(this.individualSquares)
  this.centerX = centerX;
  this.centerY = centerY;
  this.size = size;
  this.color = color;
  this.rotation = rotation; 
  
  // Register the initial center square of the fractal into the list of individual squares
  this.individualSquares.push(new singleSquare( centerX-this.size/2,
  												centerY-this.size/2,
  												size,color,
  												"C"));  

  this.returnLayer = function(position){
    var layerArray = [];
    var i;
    for (i=0; i < this.individualSquares.length; ++i){
    // TODO -    this.individualSquares[i]
    
    }
  
    return layerArray;}

  this.rotate = function(rotation){
    // Probably redundant since rotation is done in plot 
    return;
    }  

  this.grow = function(){
    // recalculate the size of all squares - from center and outwards since it´s based on parent size
    }

  this.shrink = function(){
    // recalculate the size of all squares - from center and outwards since it´s based on parent size
    }

   this.addLayer = function(){
    // find outmost layer == the one with the longest path
  
    // parse through all of the outer layer and add child nodes in all free directions

    // new squares are added to this.individualSquares to be kept as a part of this particular fractal
    }

  this.removeLayer = function(position){
    // Remove the layer with a certain position. -1 for outmost layer
    }

  this.refreshPositions = function(){
    // Recalculate all positions based on the parent position. Goes from center and outwards
    }

  this.update = function()
  {
     // Add calls to all behaviour (motions, resize and rotations) that should happen
     return;
  }
  
  this.plot = function()
  {
     //console.log("Inside squareFractal.plot()");
     ctx.save();
     ctx.translate(this.centerX, this.centerY);
     ctx.rotate(this.rotation*Math.PI/180);
     ctx.translate(-this.centerX, -this.centerY);
     for (var i = 0; i < this.individualSquares.length; ++i)
     {
        console.log("Calling plot on square" + i);
        this.individualSquares[i].plot()
     }
     ctx.restore();
     return;
  }  
  

  
  
  this.spawnNew = function(nrLayers){
     this.nrLayers = nrLayers;
     var i;
     for (i = 0; i < nrLayers; ++i)
       {
        this.addLayer;
       }
       return;
  // Create a new from scratch.
  }

}


// ********************************************************************************
// **********************  Individual squares below
// ********************************************************************************

function singleSquare(x,y,size,color,path){
this.x = x;
this.y = y;
this.size = size;
this.color = color;
this.path = path; 

this.plot = function()
    {
        console.log("Entered plot of individual squares");
    if (this.size > 0)
        { 
         ctx.fillStyle = color;
         ctx.fillRect(this.x,this.y,this.size,this.size);
         } 
    return;                   
    };
}

