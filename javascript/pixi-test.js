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

function init_pixi(){
	let app = new PIXI.Application( {width: 640, height: 800} );

	app.renderer.backgroundColor = 25;
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
			log(me.right);
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

	function add_horizontal_border() {
		let cell = 0;
		while( cell<10) {
			let cur_border = new PIXI.Sprite( PIXI.loader.resources["images/top.png"].texture );
			cur_border.x = cell * 64;
			cur_border.y = 0;
			app.stage.addChild(cur_border);
			cell = cell + 1;
		};
	};

	PIXI.loader.add( ["images/top.png", "images/cat.png"]).load(
		function() {
			add_horizontal_border();
			add_cat();
		}
	);

}

