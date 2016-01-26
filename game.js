var gameOfLife = {
  width: 12,
  height: 12,
  stepInterval: null,

  createAndShowBoard: function() {
    // create <table> element
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function(iteratorFunc) {
    /* 
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */

    // go through each cell.. 
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        iteratorFunc(document.getElementById(x + '-' + y), x, y);
      }
    }
  },

  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y" 
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "on-click" events that allow a user to click on 
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board

    var onCellClick = function(e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?

      // how to set the style of the cell when it's clicked
      if (this.getAttribute('data-status') == 'dead') {
        this.className = "alive";
        this.setAttribute('data-status', 'alive');
      }
      else {
        this.className = "dead";
        this.setAttribute('data-status', 'dead');
      }
    };

    // var cell00 = document.getElementById('0-0');
    // cell00.onclick = onCellClick;
    this.forEachCell(function(cell) {
      cell.onclick = onCellClick;
    });

    document.getElementById('step_btn').onclick = this.step.bind(this);
    document.getElementById('play_btn').onclick = this.enableAutoPlay.bind(this);
    document.getElementById('reset_btn').onclick = this.reset.bind(this);
    document.getElementById('clear_btn').onclick = this.clear.bind(this);
  },

  reset: function() {

  },

  clear: function() {
    this.forEachCell(function(cell) {
      cell.className = 'dead';
      cell.setAttribute('data-status', 'dead');
    })
  },

  _checkNeighbors: function(cell, x, y) {
    // loop around current cell
    // x, y =>
    // 1, 1 => x-1 -> x+1 && y-1 -> y+1
    // x = 0, y = 0;
    var neighbor;
    var alive;
    var arr = [];
    var count = 0;
    for (var offsetY = y - 1; offsetY <= y + 1; offsetY++) {
      for (var offsetX = x - 1; offsetX <= x + 1; offsetX++) {
        neighbor = document.getElementById(offsetX + '-' + offsetY);
        if (neighbor !== cell) {
          arr.push(neighbor);

        }


        // 0,3 => 1,2 && 1,4
      }
    }
    // return number of alive neighbors.
    return arr;

  },

  _isAlive: function(cell) {
    return cell && cell.className === 'alive';
  },

  _countAliveSurrounding: function(cellArray) {
    var numberAlive = 0;
    for (var i = 0; i < cellArray.length; i++) {
      if (cellArray[i] && cellArray[i].className === 'alive') {
        numberAlive++;
      }
    }
    return numberAlive;
  },
  
  _setFuture: function(cell, aliveNeighbors) {
    // Any live cell with two or three live neighbors lives on to the next generation.
    // Any live cell with fewer than two live neighbors dies, as if caused by under-population.
    // Any live cell with more than three live neighbors dies, as if by overcrowding.
    // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction./**/
    cell = document.getElementById(cell);
    var isAlive = this._isAlive(cell);

    if (isAlive && aliveNeighbors === 2 || aliveNeighbors === 3) {
      // stays alive
      cell.className = 'alive';
      cell.setAttribute('data-status', 'alive')
    }
    if (isAlive && aliveNeighbors < 2) {
      // dies
      cell.className = 'dead';
      cell.setAttribute('data-status', 'dead');
    }
    if (isAlive && aliveNeighbors > 3) {
      cell.className = 'dead';
      cell.setAttribute('data-status', 'dead');
    }
    if (!isAlive && aliveNeighbors === 3) {
      // alive
      cell.className = 'alive';
      cell.setAttribute('data-status', 'alive')
    }
  },

  step: function() {
    //console.log(this)
    var aliveCells = {};
    // go through each cell, call check neighbors on each cell
    this.forEachCell(function(cell, x, y) {

      aliveCells[x + '-' + y] = this._checkNeighbors(cell, x, y);
    }.bind(this))


    // set alivecell count on object
    for (var cellArray in aliveCells) {
      aliveCells[cellArray].alive = this._countAliveSurrounding(aliveCells[cellArray]);
      //this._setFuture(cellArray, aliveCells[cellArray].alive);
    }

    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game. 
    //
    // You need to:
    // 1. Count alive neighbors for all cells

      // 2. Set the next state of all cells based on their alive neighbors
    for (var key in aliveCells) {
      this._setFuture(key, aliveCells[key].alive);
    }
  },

  enableAutoPlay: function(set) {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    var interval;
    if (set) {
      console.log('helloo..')
      interval = setInterval(this.step.bind(this),500)
      //set = true;
    } else {
      clearInterval(interval);
    }

  }
};

gameOfLife.createAndShowBoard();
