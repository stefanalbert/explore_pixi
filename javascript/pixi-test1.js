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
	let app = new PIXI.Application( {width: 400, height: 800} );

	app.renderer.backgroundColor = 0x061639;
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


	PIXI.loader.add( "images/cat.png").load(
		function(){
			let cat = new PIXI.Sprite(PIXI.loader.resources["images/cat.png"].texture );
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
		})
}

