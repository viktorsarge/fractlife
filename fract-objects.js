function world()
{
  this.inhabitants = [];										// Used to store references of all the things living in the world

  this.populate = function()									 // Function to add the creatures to the world
  {
      for (var i = 0; i < randomIntFromInterval(6,20); ++i)
      {																// TODO - random rot speed + make the generation of fractals aware of the world size
          this.inhabitants.push(new squareFractal(
                                randomIntFromInterval(10,w-20),
                                randomIntFromInterval(10,h-20),
                                randomIntFromInterval(10,100),                                                            
                                "FF0000", 1.4
                                // randomIntFromInterval(-4,4)/randomIntFromInterval(-4,4)
                               )
        					   );
      }
  
	  															 // console.log(this.inhabitants)
      return;
  }
  
  this.update = function()										// Add 1 tick to the world. 
   {
      // console.log("Entered world.update()"); 
      this.clear();												// Calling my own clear function 
      for (var i = 0; i < this.inhabitants.length; ++i)			// Update and plot all inhabitants of the world
      {
         														// console.log("Inside loop of world.update()");
         this.inhabitants[i].update();
         this.inhabitants[i].plot();

      } 
  return;
  }
  
  this.clear = function()										// TODO - Make this function aware of the worlds bgcolor and size
  {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0,0,w,h);
      return;
  }
}


// ********************************************************************************
// **********************  Fractals below here
// ********************************************************************************

function squareFractal(centerX,centerY,size,color,rotationSpeed)
{
  this.individualSquares = [];
  //console.log(this.individualSquares)
  this.centerX = centerX;
  this.centerY = centerY;
  this.size = size;
  this.color = color;
  this.rotationSpeed = rotationSpeed;
  this.rotation = 0; 
  this.childScale = 0.8;
  
  // Register the initial center square of the fractal into the list of individual squares
  this.individualSquares.push(new singleSquare( centerX-this.size/2,
  												centerY-this.size/2,
  												size,color,
  												["C"] ));  

  this.returnLayer = function(position){
    var layerArray = [];
    var i;
    for (i=0; i < this.individualSquares.length; ++i){
    // TODO -    this.individualSquares[i]
    
    }
        return layerArray;}
        
    
   this.returnOuterLayer = function()
   {
		var outerLayer = [];
		var longestPath = 0;

    	for (var i = 0; i < this.individualSquares.length; ++i)
    	{
			if (this.individualSquares[i].path.length > longestPath)
			{longestPath = this.individualSquares[i].path.length;}	
    	}
    	
    	for (var i = 0; i < this.individualSquares.length; ++i)
    	{
    		if (this.individualSquares[i].path.length == longestPath)
    		{outerLayer.push(this.individualSquares[i])}
    	}
    	
    	return outerLayer;
   }
  


  this.rotate = function(rotation){
    // Probably redundant since rotation is done in plot 
    // Can be kept to force rotation to a certain angle for docking etc. 
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
    var outerLayer = this.returnOuterLayer();
  
    // parse through all of the outer layer and add child nodes in all free directions
    

    // new squares are added to this.individualSquares to be kept as a part of this particular fractal
    
    return;
    }
           

  this.removeLayer = function(position){
    // Remove the layer with a certain position. -1 for outmost layer
    }

  this.refreshPositions = function(){
    // Recalculate all positions based on the parent position. Goes from center and outwards
    }

  this.update = function()
  {
     this.rotation = this.rotation + this.rotationSpeed;
     // Add calls to all behaviour (motions, resize and rotations) that should happen
     return;
  }
  
  this.plot = function()
  {
     //console.log("Inside squareFractal.plot()");
     ctx.save();													// Save the coordinate system before we mess with it
     ctx.translate(this.centerX, this.centerY);						// Make the center of the fractal the canvas center before rotating around canvas center
     ctx.rotate(this.rotation*Math.PI/180);							// Rotate canvas before painting
     ctx.translate(-this.centerX, -this.centerY);					// Put stuff back 
     for (var i = 0; i < this.individualSquares.length; ++i)		// Make sure to update all of the individual squares of the fractal
     {
        //console.log("Calling plot on square" + i);
        this.individualSquares[i].plot()
     }
     ctx.restore();													// Restore coordinate system after rotation
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
        //console.log("Entered plot of individual squares");
    if (this.size > 0)
        { 
         ctx.fillStyle = color;
         ctx.fillRect(this.x,this.y,this.size,this.size);
         } 
    return;                   
    };
    
/*  Commented out since it may be best to keep this logic inside fractals instead. 

this.spawnChildren = function()
  {

	  // console.log("Length of path" + this.path.length);

	  // These four blocks adds all children. Blocks spawning of already filled squares based on the parents path
	  if (this.path[this.path.length-1] != "S"){
		childPath = this.path.slice();
		childPath.push("N");
		squares.push(new square(
		  this.x+this.size/2-resizer*this.size/4, 
		  this.y - resizer * this.size/2, 
		  resizer * (this.size/2), 
		  "#FF0000", 
		  childPath)
		 );
	  }
  
	  if (this.path[this.path.length-1] != "W"){
		childPath = this.path.slice();
		childPath.push("E");
		squares.push(new square(
		  this.x + this.size, 
		  this.y+this.size/2-resizer*this.size/4, 
		  resizer * (this.size/2), 
		  "#FF0000", 
		  childPath)
		 );
	  }
  
	  if (this.path[this.path.length-1] != "N"){
		childPath = this.path.slice();
		childPath.push("S");
		squares.push(new square(
		  this.x+this.size/2-resizer*this.size/4, 
		  this.y + this.size, 
		  resizer * (this.size/2), 
		  "#FF0000", 
		  childPath)
		);
	  }
  
	  if (this.path[this.path.length-1] != "E"){
		childPath = this.path.slice();
		childPath.push("W");
		squares.push(new square(
		  this.x - resizer * this.size/2, 
		  this.y+this.size/2-resizer*this.size/4, 
		  resizer * (this.size/2), 
		  "#FF0000", 
		  childPath)
		);
	  }
   

  };
  */    
}

