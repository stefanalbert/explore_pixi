
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

	function create_cell_list( maze ) {
		let result = {
			x_max:Math.floor(maze[0].length /2),
			y_max:Math.floor(maze.length/2),
			data:[]
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

	function add_cat() {
		let cat = new PIXI.Sprite(PIXI.loader.resources["images/cat.png"].texture );
		cat.x = 10;
		cat.y = 10;
		app.stage.addChild(cat);
		app.ticker.add(delta => gameLoop(delta));
		function gameLoop(delta){
			if(game_controller.up){
				cat.y=cat.y - 1;
			};
			if(game_controller.down) {
				cat.y = cat.y + 1;
			};
			if(game_controller.left){
				cat.x=cat.x - 1;
			};
			if(game_controller.right){
				cat.x=cat.x + 1;
			}
		}
	};

	function add_cell( x, y, cells ) {
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

	PIXI.loader.add( ["images/top.png", "images/cat.png", "images/left.png"]).load(
		function() {
			add_border(cells);
			add_cat();
		}
	);
}

