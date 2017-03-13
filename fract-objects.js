function config() {
    this.worldBgColor = "black";
    this.worldFriction = 0.9955;
    this.fractGlowColor = "black";
    this.fractGlowColor2 = "hsl(229, 100%, 50%)";
    this.fractColor = "black";
    this.fractChildScale = 0.85;
    this.fractInitialRot = 0;
}

function world(settings) {
    this.settings = settings;
    this.bgcolor = this.settings.worldBgColor;
    this.friction = this.settings.worldFriction;
    this.inhabitants = []; // Used to store references of all the things living in the world
    this.width = c.width;
    this.heigth = c.height;

    this.populate = function () {
        var i = 0;
        for (i = 0; i < randomIntFromInterval(3, 5); i += 1) {   // TODO - random rot speed + make the generation of fractals aware of the world size
            this.inhabitants.push(new squareFractal(this));
        }
        return;
    };

    this.update = function () {
        this.clear();   // Calling own clear function
        var i = 0;
        for (i = 0; i < this.inhabitants.length; i += 1) {
            this.inhabitants[i].update(i);
            //this.inhabitants[i].checkCollisions(i);
            this.inhabitants[i].plot(i);
        }
        ctx.font="20px Georgia";
        ctx.fillStyle = "white";
        ctx.fillText(this.inhabitants.length,10,50);
        return;
    };

    this.clear = function () {
        ctx.fillStyle = this.bgcolor;
        ctx.fillRect(0, 0, c.width, c.height);
        return;
    };
}

// ********************************************************************************
// **********************  Fractals below here
// ********************************************************************************

// The main function used to create the squareFractal objects
function squareFractal(world, initValues) {
    if (!initValues) {
        this.size = randomIntFromInterval(40, 100);
        this.centerX = randomIntFromInterval(150, world.width - 150);
        this.centerY = randomIntFromInterval(150, world.heigth - 150);
        this.nrLayers = 4;
    } else {
        this.size = initValues[0];
        this.centerX = initValues[1];
        this.centerY = initValues[2];
        this.nrLayers = 0;
    }

    this.rotationSpeed = randomIntFromInterval(-500, 500) / 100;
    this.rotation = world.settings.fractInitialRot;
    this.directionX = randomIntFromInterval(-90, 90) / 100;
    this.directionY = randomIntFromInterval(-90, 90) / 100;
    this.color = world.settings.fractColor;
    this.bgBasecolor = world.settings.fractGlowColor;
    this.bgAccentcolor = world.settings.fractGlowColor2;
    this.state = "alive";
    this.individualSquares = [];
    this.childScale = world.settings.fractChildScale;
    this.world = world;
    this.overlapping = [];

    // Register the initial center square of the fractal into the list of individual squares
    this.individualSquares.push(new singleSquare(0 - this.size / 2,
            0 - this.size / 2,
            this.size, this.color,
            ["C"]));
/*
    this.returnLayer = function (position) { // Implement if accessing individual layers is needed
        var layerArray = [];
        var i;
        for (i = 0; i < this.individualSquares.length; i += 1) {
            // TODO - Implement this logic if I'll actually need it   this.individualSquares[i]
        }
        return layerArray;
    };
*/
    this.resize = function () {
        // recalculate the size and position of all squares - from center and outwards since it´s based on parent size
    };

    // Returns an array with the squares of the fractal that has the longest paths
    this.returnOuterLayer = function () {
        var outerLayer = [];
        var longestPath = 0;
        var i = 0;
        for (i = 0; i < this.individualSquares.length; i += 1) {
            if (this.individualSquares[i].path.length > longestPath) {
                longestPath = this.individualSquares[i].path.length;
            }
        }
        for (i = 0; i < this.individualSquares.length; i += 1) {
            if (this.individualSquares[i].path.length === longestPath) {
                outerLayer.push(this.individualSquares[i]);
            }
        }
        return outerLayer;
    };

    this.addLayer = function () {
        var outerLayer = this.returnOuterLayer(); // Fetches the squares farthest out in the fractal == the longest paths
        var i = 0;
        var childPath = "";
        for (i = 0; i < outerLayer.length; i += 1) {    // Add child nodes in all free directions to the squares in outer layer. If adding to center it will add in all directions since path is "C"
            if (this.childScale * (outerLayer[i].size / 2) > 1) { // Safeguard against negative sizes freezing up the browser
                if (outerLayer[i].path[outerLayer[i].path.length - 1] !== "S") {  // Checking only the last element of the path since that is the parents
                    childPath = outerLayer[i].path.slice();           // Copying the parent path to a new array for the childs path
                    childPath.push("N");   // Adding the childs alignment in relation to the parent
                    this.individualSquares.push(
                        new singleSquare(
                            outerLayer[i].x + outerLayer[i].size / 2 - this.childScale * outerLayer[i].size / 4,
                            outerLayer[i].y - this.childScale * outerLayer[i].size / 2,
                            this.childScale * (outerLayer[i].size / 2),
                            this.color,
                            childPath
                        )
                    );
                }
                if (outerLayer[i].path[outerLayer[i].path.length - 1] !== "W") {
                    childPath = outerLayer[i].path.slice();
                    childPath.push("E");
                    this.individualSquares.push(
                        new singleSquare(
                            outerLayer[i].x + outerLayer[i].size,
                            outerLayer[i].y + outerLayer[i].size / 2 - this.childScale * outerLayer[i].size / 4,
                            this.childScale * (outerLayer[i].size / 2),
                            this.color,
                            childPath
                        )
                    );
                }
                if (outerLayer[i].path[outerLayer[i].path.length - 1] !== "N") {
                    childPath = outerLayer[i].path.slice();
                    childPath.push("S");
                    this.individualSquares.push(
                        new singleSquare(
                            outerLayer[i].x + outerLayer[i].size / 2 - this.childScale * outerLayer[i].size / 4,
                            outerLayer[i].y + outerLayer[i].size,
                            this.childScale * (outerLayer[i].size / 2),
                            this.color,
                            childPath
                        )
                    );
                }
                if (outerLayer[i].path[outerLayer[i].path.length - 1] !== "E") {
                    childPath = outerLayer[i].path.slice();
                    childPath.push("W");
                    this.individualSquares.push(
                        new singleSquare(
                            outerLayer[i].x - this.childScale * outerLayer[i].size / 2,
                            outerLayer[i].y + outerLayer[i].size / 2 - this.childScale * outerLayer[i].size / 4,
                            this.childScale * (outerLayer[i].size / 2),
                            this.color,
                            childPath
                        )
                    );
                }
            }
        }
        return;
    };

//    this.removeLayer = function (position) {
        // Remove the layer with a certain position. -1 for outmost layer
//    };

    this.update = function (id) {
        if (this.state !== "dead") {
            // Decrease speed over time, move and rotate
            this.directionX = this.directionX * this.world.friction;
            if(this.state !== "dying") {
                this.directionY = this.directionY * this.world.friction;
            }
            this.centerY = this.centerY + this.directionY;
            this.centerX = this.centerX + this.directionX;
            this.rotation = this.rotation + this.rotationSpeed;
            // Does it go over edge of world?
            if ((this.centerX + this.size * 1.5) > c.width || (this.centerX - this.size * 1.5) < 0) {
                this.directionX = -this.directionX;
                this.rotationSpeed = -this.rotationSpeed;
            }
            if ((this.centerY + this.size * 1.5) > c.height || (this.centerY - this.size * 1.5) < 0) {
                if (this.state === "alive") {
                    this.directionY = -this.directionY;
                    this.rotationSpeed = -this.rotationSpeed;
                } else if (this.state == "dying") {
                    this.directionY = 0;
                    this.directionX = 0;
                    this.rotationSpeed = 0;
                    this.state = "dead";
                }
            }
            this.rotationSpeed = this.rotationSpeed * this.world.friction;

            // Dissolve if all movement energy is lost
            if ((Math.abs(this.directionX) + Math.abs(this.directionY) + Math.abs(this.rotationSpeed)) < 0.05 && this.state === "alive") {
                // console.log("Dissolve!");
                if (this.individualSquares.length > 1) {
                    this.dissolve(id);
                } else if(this.state!="dying") {
                    this.state = "dying";
                    this.bgAccentcolor = "grey";
                    this.directionY = 0;
                    console.log(this.state);
                }
            }
            if (this.state == "dying" && this.directionY < this.size * 0.05) {
                this.directionY = this.directionY + this.size * 0.001;
            }
        }
        if
        //this.checkCollisions(id);
        return;
    };

    this.plot = function (id) {
        //if (this.state === "alive") {
            var i = 0;
            ctx.save();
            ctx.translate(this.centerX, this.centerY); // Make the center of the fractal the canvas center before rotating around canvas center
            ctx.rotate(this.rotation * Math.PI / 180);   // Rotate canvas before painting

            // Lighting stuff below
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.5, 0, 2 * Math.PI);
            var grd = ctx.createRadialGradient(0, 0, this.size * 1.7, 0, 0, this.size / 3);
            grd.addColorStop(0, this.bgBasecolor);
            grd.addColorStop(1, this.bgAccentcolor);
            ctx.fillStyle = grd;
            ctx.fill();

            for (i = 0; i < this.individualSquares.length; i += 1) {
                this.individualSquares[i].plot();
            }
            ctx.restore();
        return;
    };

    this.addNrLayers = function (nrLayers) {
        this.nrLayers = nrLayers;
        var i;
        for (i = 0; i < nrLayers; i += 1) {
            this.addLayer();
        }
        return;
    };

    this.kill = function (id) {
        this.world.inhabitants.splice(id, 1);
        console.log("KILLKILLKILLKILLKILLKILL KILL KILL KILL");
    };
    
    this.dissolve = function (id) {
        var i = 0;
        //console.log(this.individualSquares.length);
        var initarray = [];
        for (i = 0; i < this.individualSquares.length; i += 1) {
            //console.log(i);
            initarray.push(this.individualSquares[i].size);
            initarray.push(this.centerX + this.individualSquares[i].x);
            initarray.push(this.centerY + this.individualSquares[i].y);
            this.world.inhabitants.push(new squareFractal(this.world, initarray));
            initarray = [];
        }
        this.kill(id);
    };
/*
    this.checkCollisions = function (id) {
        var i = 0;
        var overlap = false;
        for (i = 0; i < this.world.inhabitants.length; i += 1) {
            if (i !== id) {
                overlap = circlesOverlap(this.centerX, this.centerY, this.size * 1.5, this.world.inhabitants[i].centerX, this.world.inhabitants[i].centerY, this.world.inhabitants[i].size * 1.5);
                if (overlap) {
                    this.overlapping.push(i);
                }
            }
        }
        if (this.overlapping.length > 0) {
            this.dissolve(id);
        }
    };
*/

    this.addNrLayers(this.nrLayers);
}


// ********************************************************************************
// **********************  Individual squares below
// ********************************************************************************

function singleSquare(x, y, size, color, path) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.path = path;

    this.plot = function () {
        if (this.size > 0) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
        return;
    };
}

