
function hello(){
	alert("Hi");
}

function log(msg){
	var p = document.getElementById( "log" );
	p.innerHTML = msg + "<br/>" + p.innerHTML;
}

function handle_touch( button_name, handler ) {
	let button = document.getElementById( button_name );
	button.addEventListener("touchstart",
				function(evt){
					evt.preventDefault();
					handler(true);
				},
				false );
	button.addEventListener("touchend",
				function(evt){
					evt.preventDefault();
					handler(false);
				},
				false );
};


var maze = ["+-+-+-+-+-+-+-+-+-+-+",
	    "|   | | | | | | | | |",
	    "+-+ +-+-+-+-+-+-+-+-+",
	    "| |   | | | | | | | |",
	    "+-+-+ +-+-+-+-+-+-+-+",
	    "| | |   | | | | | | |",
	    "+-+-+-+ +-+-+-+-+-+-+",
	    "| | | |   | | | | | |",
	    "+-+-+-+-+ +-+-+-+-+-+",
	    "| | | | |   | | | | |",
	    "+-+-+-+-+-+ +-+-+-+-+",
	    "| | | | | |     | | |",
	    "+-+-+-+-+-+-+-+ +-+-+",
            "| | | | | |     | | |",
	    "+-+-+-+-+-+ +-+-+-+-+",
	    "| | | | |   | | | | |",
	    "+-+-+-+-+ +-+-+-+-+-+",
	    "| | | |   | | | | | |",
	    "+-+-+-+ +-+-+-+-+-+-+",
	    "| | | |     | | | | |",
	    "+-+-+-+-+-+ +-+-+-+-+",
	    "| |         | | | | |",
	    "+-+ +-+-+-+-+-+-+-+-+",
	    "| |     | | | | | | |",
	    "+-+-+-+ +-+-+-+-+-+-+",
	    "| | | |             |",
	    "+-+-+-+-+-+-+-+-+-+-+"
];

function create_cells( maze ) {

	function create_cell() {
		return {left:false,
		        top:false,
			right:false,
			bottom:false };
	};

	function init_cell( cell, x, y, maze ) {
		cell.left = maze[(y*2)+1].charAt(x*2) =='|';
		cell.right = maze[(y*2)+1].charAt((x+1)*2) == '|';
                cell.top = maze[y*2].charAt(x*2+1) == '-';
		cell.bottom = maze[(y+1)*2].charAt(x*2+1)=='-';
		return cell;
	};

	/*
	 *	Create a cell list based on the data in the maze. The cell list is
	 *      list of cell objects, each cell object represents a cell in the maze 
	 *      it contains information about the cell's borders. The cell list
	 *      contains the cells ordered by rows. This means, the first row of
	 *      cells comes first, then the second row and so on.
	 *      This means, the cell in position x,y in the maze is stored at
	 *      position y*x_max + x in the cell list.
	 *
	 *      @oaram maze	The maze that should be converted into a cell list.
	 *      @return The resulting cell list.
	 */ 
	function create_cell_list( maze ) {
		let result = {
			x_max:Math.floor(maze[0].length /2),
			y_max:Math.floor(maze.length/2),
			data:[],
			/*
			 * Determines if a position of a sprite, which is
			 * given by the x,y pair of input parameters is valid.
			 * A position is valid if it either positions a sprite
			 * entirely in a cell, or if the sprite is positioned 
			 * in more than one cell, then those cells should not
			 * have a border between them according to the cell
			 * data. It is assumed that the width and height of
			 * the cell is the same as the width and height of
			 * the sprite, namely 64.
			 *
			 * Deterimining is a position is valid works as
			 * follows:
			 *
			 * 1. Find the cell where the x,y position is
			 *    located:
			 *    	cell_x = x div 64
			 *     	cell_y = y div 64
			 *     	cell = data[ cell_y * x_max + cell_x ]
			 * 2. Check if either the x position is at the left hand
			 *    side of the cell or if it is not that the cell has
			 *    no right border.
			 *    x_pos = x mod 64
			 *    if x_pos != 0:
			 *    	!cell.right
			 * 3. Check if either y position is at the top of the
			 *    cell or, if it is not, that the cell has no
			 *    bottom border.
			 *    y_pos = y mod 64
			 *    if y_pos != 0:
			 *    	!cell.bottom
			 * 4. Return true if both checks (2 and 3 ) pass, and
			 *    false if at least one of them fails.
			 *
			 * @param x The x position of the top left corner of the 
			 *          sprite on the screen.
			 * @param y The y position of the top left corner of the
			 *          sprite on the screen.
			 *
			 * @return True if the position of the sprite is valid 
			 *         according to the above rules, and False, if 
			 *         the position is not valid.
			 */ 
			is_valid_position:function(x,y) {
				let result = ( x>=0 ) && (y>=0);
				if( result ){
					let cell_x = Math.floor( x/64);
					let cell_y = Math.floor( y/64);
					let cur_cell = this.data[ cell_y*this.x_max + cell_x];
				
					let x_pos = x%64;
					if( x_pos != 0 ) {
						result = !cur_cell.right;
					}
					if( result ){
						let y_pos = y%64;
						if( y_pos != 0 ){
							result = !cur_cell.bottom;
						}
					}
				}
				return result;
			}
		};

		for( j=0; j<result.y_max; j++ ) {
			for( i=0; i<result.x_max; i++ ){
				result.data.push( init_cell(create_cell(), i, j, maze) );
			};
		};
		return result;
	};
	return create_cell_list(maze);	
};

function start_app() {
	init_pixi(create_cells(maze));
};

function init_pixi(cells){
	let app = new PIXI.Application( {width: 640, height: 832} );

	document.getElementById("game_display").appendChild( app.view );

	var  game_controller = {
		init:function() {
			me=this;
			me.right = false;
			me.left = false;
			me.up = false;
			me.down = false;
		},
		set_up:function(value){
			me.up=value;
		},
		set_down:function(value){
			me.down=value;
		},
		set_left: function(value){
			me.left=value;
		},
		set_right: function(value){
			me.right=value;
		}
	};

	game_controller.init();

	handle_touch("up_button", game_controller.set_up );
	handle_touch("down_button", game_controller.set_down);
	handle_touch("left_button", game_controller.set_left);
	handle_touch("right_button", game_controller.set_right);

	function add_chicken(cells) {
		let chicken = new PIXI.Sprite(PIXI.loader.resources["images/chicken.png"].texture );
		chicken.x = 0;
		chicken.y = 0;
		app.stage.addChild(chicken);
		app.ticker.add(delta => gameLoop(delta));
		function gameLoop(delta){
			let new_x = chicken.x;
			let new_y = chicken.y;
			if(game_controller.up){
				new_y=new_y - 1;
			};
			if(game_controller.down) {
				new_y= new_y + 1;
			};
			if(game_controller.left){
				new_x=new_x - 1;
			};
			if(game_controller.right){
				new_x=new_x + 1;
			}
			if( cells.is_valid_position(new_x, new_y) ){
				chicken.x = new_x;
				chicken.y = new_y;
			}
		}
	};

	function add_cell( x, y, cells ) {

		let background = new PIXI.Sprite( PIXI.loader.resources["images/background.png"].texture);
		background.x = x*64;
		background.y = y*64;
		app.stage.addChild(background);

		let cell_model = cells.data[(y*cells.x_max) + x ];
		if(cell_model.top ) {
			let top_border = new PIXI.Sprite( PIXI.loader.resources["images/top.png"].texture );
			top_border.x = x * 64;
			top_border.y = y * 64;
			app.stage.addChild(top_border);
		};

		if( cell_model.bottom ){
			let bottom_border = new PIXI.Sprite( PIXI.loader.resources["images/top.png"].texture );
			bottom_border.x = x * 64;
			bottom_border.y = y * 64 + 60;
			app.stage.addChild(bottom_border);
		};

		if( cell_model.left ) {
			let left_border = new PIXI.Sprite( PIXI.loader.resources["images/left.png"].texture);
			left_border.x = x*64;
			left_border.y = y*64;
			app.stage.addChild(left_border);
		};

		if( cell_model.right ){
			let right_border = new PIXI.Sprite( PIXI.loader.resources["images/left.png"].texture);
			right_border.x = x*64 + 60;
			right_border.y = y*64;
			app.stage.addChild(right_border);
		};

	};

	function add_border(cells) {
		for( y=0;y<cells.y_max;y++ ) { 
			for(x=0; x<cells.x_max; x++ ) {
				add_cell( x, y, cells );
			};
		};
	};

	PIXI.loader.add( ["images/top.png", "images/chicken.png", "images/left.png", "images/background.png"]).load(
		function() {
			add_border(cells);
			add_chicken(cells);
		}
	);
}

