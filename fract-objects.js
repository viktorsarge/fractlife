function world() {
    this.inhabitants = []; // Used to store references of all the things living in the world
    this.populate = function () {
        var i = 0;
        for (i = 0; i < randomIntFromInterval(2, 2); i += 1) {   // TODO - random rot speed + make the generation of fractals aware of the world size
            this.inhabitants.push(new squareFractal(
                randomIntFromInterval(10, w - 20),
                randomIntFromInterval(10, h - 20),
                randomIntFromInterval(40, 100),
                "#FF0000",
                randomIntFromInterval(-80, 80)/100,
                randomIntFromInterval(-80, 80)/100,
                randomIntFromInterval(-80, 80)/100
            ));
        }
        return;
    };

    this.update = function () {
        this.clear();   // Calling my own clear function
        var i = 0;
        for (i = 0; i < this.inhabitants.length; i += 1) {
            this.inhabitants[i].update();
            this.inhabitants[i].plot();
        }
        return;
    };

    this.clear = function () { // TODO - Make this function aware of the worlds bgcolor and size
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
        return;
    };
}

// ********************************************************************************
// **********************  Fractals below here
// ********************************************************************************

// The main function used to create the squareFractal objects
function squareFractal(centerX, centerY, size, color, rotationSpeed, directionX, directionY) {
    this.individualSquares = [];
    //console.log(this.individualSquares)
    this.size = size;
    this.centerX = centerX;
    this.centerY = centerY;
    this.color = color;
    this.rotationSpeed = rotationSpeed;
    this.rotation = 0;
    this.childScale = 0.85;
    this.directionX = directionX;
    this.directionY = directionY;

    // Register the initial center square of the fractal into the list of individual squares
    this.individualSquares.push(new singleSquare(0 - this.size / 2,
            0 - this.size / 2,
            size, color,
            ["C"]));

    this.returnLayer = function (position) { // Implement if accessing individual layers is needed
        var layerArray = [];
        var i;
        for (i = 0; i < this.individualSquares.length; i += 1) {
            // TODO - Implement this logic if I'll actually need it   this.individualSquares[i]
        }
        return layerArray;
    };

    /*
    this.rotate = function(rotation){
    // Probably redundant since rotation is done in plot
    // Can be kept to force rotation to a certain angle for docking etc.
    return;
    }  */

    this.grow = function () {
        // recalculate the size of all squares - from center and outwards since it´s based on parent size
    };

    this.shrink = function () {
        // recalculate the size of all squares - from center and outwards since it´s based on parent size
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
        console.log("Inside addLayer");
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
                            "#FF0000",
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
                            "#FF0000",
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
                            "#FF0000",
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
                            "#FF0000",
                            childPath
                        )
                    );
                }
            }
        }
        return;
    };

    this.removeLayer = function (position) {
        // Remove the layer with a certain position. -1 for outmost layer
    };

    this.refreshPositions = function () {
        this.centerX = this.centerX + this.directionX;
        this.centerY = this.centerY + this.directionY;
    };

    this.update = function () {
        this.refreshPositions();
        this.rotation = this.rotation + this.rotationSpeed;
        if (this.centerX > w || this.centerX < 0) {
            this.directionX = -this.directionX;
        }
        if (this.centerY > h || this.centerY < 0) {
            this.directionY = -this.directionY;
        }
        // Add calls to all behaviour (motions, resize and rotations) that should happen
        return;
    };

    this.plot = function () {
        var i = 0;
        //console.log("Inside squareFractal.plot()");
        ctx.save();
        ctx.translate(this.centerX, this.centerY); // Make the center of the fractal the canvas center before rotating around canvas center
        ctx.rotate(this.rotation * Math.PI / 180);   // Rotate canvas before painting
        // Lighting stuff below
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2, 0, 2 * Math.PI);
        var grd = ctx.createRadialGradient(0, 0, this.size * 2.5, 0, 0, this.size / 2);
        grd.addColorStop(0, "black");
        grd.addColorStop(1, "blue");
        ctx.fillStyle = grd;
        ctx.fill();

        for (i = 0; i < this.individualSquares.length; i += 1) { // Make sure to update all of the individual squares of the fractal
            //console.log("Calling plot on square" + i);
            this.individualSquares[i].plot();
        }
        ctx.restore();
        return;
    };

    // Fill up a fractal with specified nr of layers.
    // TODO - rename to addNrLayers and change references to it
    this.spawnNew = function (nrLayers) {
        this.nrLayers = nrLayers;
        var i;
        for (i = 0; i < nrLayers; i += 1) {
            this.addLayer();
        }
        return;
    };
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
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
        return;
    };
}

