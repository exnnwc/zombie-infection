function Game(){
	this.world = new World(50, 25);
	this.player = new Player({x:0, y:0});
	this.reds = new Reds();
	this.blues = new Blues();
	
	this.isActive=true;
	this.blue_percent = 3;
	this.red_percent = 1;
	this.structure_percent = 5;
	
	max_num_of_structures = (this.world.sizeOfX * this.world.sizeOfX) * (this.structure_percent/100);	
	max_num_of_blues = (this.world.sizeOfX * this.world.sizeOfX) * (this.blue_percent/100);	
	max_num_of_reds = (this.world.sizeOfX * this.world.sizeOfX) * (this.red_percent/100);	
	
	this.input = playerInput;
	this.run = run;
	this.seeds = fetchSeeds;
	this.generateStructures = generateStructures;
	this.moveBlues = moveBlues;
	this.movePlayer=movePlayer;
	
	
	this.world.map[this.player.pos["x"]][this.player.pos["y"]]=2;
	
	this.generateStructures(max_num_of_structures);
	num_of_blues=0;
	while (num_of_blues<max_num_of_blues){
		openSpot = this.world.openSpot();
		this.blues.add(openSpot);
		this.world.map[openSpot["x"]][openSpot["y"]]=3;
		num_of_blues++;
	}
	
	num_of_reds=0;
	while (num_of_reds<max_num_of_reds){
		openSpot = this.world.openSpot();
		if (openSpot["x"]>5 && openSpot["y"]>5){
			this.reds.add(openSpot);
			this.world.map[openSpot["x"]][openSpot["y"]]=4;
			num_of_reds++;
		}
	}
	console.log(this.blues.locations);
	this.world.show();
}

function fetchSeeds(num_of_seeds){
	seeds = new Array();
	for(seed=0;seed<num_of_seeds;seed++){
		seeds.push(this.world.openSpot())
	}
	return seeds;
}

function generateStructures(max_num_of_structures){
	num_of_seeds=0;	
	while (num_of_seeds<max_num_of_structures){
		openSpot = this.world.openSpot();
		neighbors = this.world.neighbors(openSpot);
		status = this.world.status(openSpot);
		if (neighbors.length===Number(status[0])){			
			this.world.buildHere(openSpot);
			num_of_seeds++;
		}
		
	}
}

function run(){

	this.moveBlues();
	this.world.show();
}

function playerInput(inputDirection, shifting){
	place = this.world.direction(inputDirection, this.player.pos);
	console.log(place, place["x"], place["y"]);
	if (this.world.map[place["x"]][place["y"]]===0){
		this.movePlayer(place)	
	}
	this.world.show();
}

function movePlayer(location){
	this.world.map[this.player.pos["x"]][this.player.pos["y"]]=0;
	this.player.move(location);
	this.world.map[this.player.pos["x"]][this.player.pos["y"]]=2;
}

function moveBlues(){
	console.log(this.blues);
	for(blue=0;blue<this.blues.locations.length;blue++){
		/*
		openNeighbor=this.world.openNeighbor(this.blues.locations[blue]);
		this.world.map[this.blues.locations[blue]["x"]][this.blues.locations[blue]["y"]]=0;
		this.blues.locations[blue]=openNeighbor;
		this.world.map[this.blues.locations[blue]["x"]][this.blues.locations[blue]["y"]]=3;
		*/
	}	
}

