function Greens(){
	this.locations = new Array();
	this.motion = new Array();
	this.add = addGreen;
	this.kill = killGreen;
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
function killGreen(location){
    for(green in this.locations){				
        if (this.locations[green]["x"]===location["x"]  && this.locations[green]["y"]===location["y"]){
            this.locations.splice(green, 1);
        }
    }

}