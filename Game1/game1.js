var assassin_char;
deadly_arrows = [];
deadly_spears = [];
deadly_rocks = [];
deadly_chains = [];
var timer;

let offset = 0,
  paused = true;

render();
  
function startStopwatch(evt) {
  if (paused) {
    paused = false;
    offset -= Date.now();
    render();
  }
}

function stopStopwatch(evt) {
  if (!paused) {
    paused = true;
    offset += Date.now();
  }
}

function resetStopwatch(evt) {
  if (paused) {
    offset = 0;
    render();
  } else {
    offset = -Date.now();
  }
}

function format(value, scale, modulo, padding) {
  value = Math.floor(value / scale) % modulo;
  return value.toString().padStart(padding, 0);
}

function render() {
  var value = paused ? offset : Date.now() + offset;

  document.querySelector('#s_ms').textContent = format(value, 1, 1000, 3);
  document.querySelector('#s_seconds').textContent = format(value, 1000, 60, 2);
  document.querySelector('#s_minutes').textContent = format(value, 60000, 60, 2);
  
  if(!paused) {
    requestAnimationFrame(render);
  }
}


function startGame() {
    dojo.start();
    assassin_char = new Assassin(30, 30, 'black', 470, 320);
    startStopwatch()
    resetStopwatch()
   

}

var dojo = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;     
        this.interval = setInterval(updateGameArea, 30);


    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }, 
    stop: function() {
        clearInterval(this.interval)
    }
    
}

function everyinterval(n) {
    if ((dojo.frameNo / n) % 1 == 0) {return true;}
    return false;
  }
  



function Arrows(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.updateArrows = function() {
        ctx = dojo.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
    


function Assassin(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.updateChar = function() {
        ctx = dojo.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    this.crashWith = function(arrow) {
        var myleft = this.x
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);

        var arrowleft = arrow.x; 
        var arrowright = arrow.x + (arrow.width); 
        var arrowtop = arrow.y; 
        var arrowbottom = arrow.y + (arrow.height);
        var dead = true;

        if ((mybottom <= arrowtop) || (mytop >= arrowbottom) || 
        (myright <= arrowleft) || (myleft >= arrowright)) {
            dead = false; 
        }
    return dead;
    }
}




function updateGameArea() {
    var x, y;
    for (i=0; i < deadly_arrows.length; i += 1) {
        if (assassin_char.crashWith(deadly_arrows[i])) {
        dojo.stop()
        window.removeEventListener("keydown", keyDownHandler, true);
        stopStopwatch()
        alert('Game over')
        return;
        }
    }

    for (z = 0; z < deadly_spears.length; z += 1) {
        if (assassin_char.crashWith(deadly_spears[z])) {
            dojo.stop()
            window.removeEventListener("keydown", keyDownHandler, true);
            stopStopwatch()
            alert('Game over')
            return;
        }
    }

    for (x = 0; x < deadly_rocks.length; x += 1) {
        if (assassin_char.crashWith(deadly_rocks[x])) {
            dojo.stop()
            window.removeEventListener("keydown", keyDownHandler, true);
            stopStopwatch()
            alert('Game over')
            return;
        }
    }

    for (y = 0; y < deadly_chains.length; y += 1) {
        if (assassin_char.crashWith(deadly_chains[y])) {
            dojo.stop()
            window.removeEventListener("keydown", keyDownHandler, true);
            stopStopwatch()
            alert('Game over')
            return;
        }
    }

    dojo.clear()
    dojo.frameNo += 20; //Increase the difficulty here
    if (dojo.frameNo == 1 || everyinterval(150)) {
        randomX = Math.floor(Math.random() * 700) + 15;

        // For Arrows
        x = randomX;
        y = dojo.canvas.height; 
        leftx = Math.ceil(Math.random() * 700) + 15;
        deadly_arrows.push(new Arrows(40, 40, "green", x, y));
        deadly_arrows.push(new Arrows(20, 20, "red", leftx ,y ));

        // For Spears:
        x_pos = Math.floor(Math.random() * 700) + 30;
        spearX = x_pos 
        spearY = 0; 
        deadly_spears.push(new Arrows(30, 30, "orange", spearX, spearY));

        // For Rocks:
        rockYPosition = Math.floor(Math.random() * 1000) - 15; 
        rockX = 0;
        rockY = rockYPosition;
        deadly_rocks.push(new Arrows(20, 20, "blue", rockX ,rockY ));

        // For Chains:
        chainYPosition = Math.floor(Math.random() * 1000) - 15; 
        chainX = dojo.canvas.width;
        chainY = chainYPosition;
        deadly_chains.push(new Arrows(20, 20, "pink", chainX, chainY))



    }
    for (z = 0; z < deadly_spears.length; z += 1) {
        deadly_spears[z].y += 5;
        deadly_spears[z].updateArrows();
    }
    for (i = 0; i < deadly_arrows.length; i += 1) {
      deadly_arrows[i].y -= 5;
      deadly_arrows[i].updateArrows();
    }

    for (x=0; x < deadly_rocks.length; x += 1) {
        deadly_rocks[x].x += 5;
        deadly_rocks[x].updateArrows()
    }

    for (y=0; y < deadly_chains.length; y +=1) {
        deadly_chains[y].x -= 5;
        deadly_chains[y].updateArrows()
        
    }
    assassin_char.updateChar();
}

function keyDownHandler(event) {

    //get which key the user pressed
    var key = event.which;
    if (key>46) {
        return;
    }
    switch(key) {
        case 37: //left key 
            if (assassin_char.x >= 5) {
                assassin_char.x -= 15;
            }
            break;
        case 39:  // right key
            if (assassin_char.x < 995) {
                assassin_char.x += 15; 
            }
            break;
        case 38: // Up Key
            if (assassin_char.y >= 5) {
                assassin_char.y -= 15; 
            } 
            break
        case 40: // down Key
            if (assassin_char.y <= 685) {
                assassin_char.y += 15;
            }
            break

        default:
            break;
    }

    if (key == 38 && key == 49) {
        assassin_char.y -= 15; 
        assassin_char.x += 15;
    }
    assassin_char.updateChar()



}

window.addEventListener("keydown", keyDownHandler, true);
