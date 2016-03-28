function Greens(){
	this.locations = new Array();
	this.motion = new Array();
	this.add = addGreen;
	this.move = moveGreen;
}

function moveGreen(green, newLocation, direction){	
	this.locations[green]=newLocation;
	this.motion[green]=direction;
}

function addGreen (newLocation){
	this.locations.push(newLocation);
	this.motion.push(0);
}