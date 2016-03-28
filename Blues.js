function Blues(){
	this.locations = new Array();
	this.panicked=new Array();
	this.motion = new Array();
	this.add = addBlue;
	this.kill = killBlue;
	this.move = move;
	this.who = whichBlueIsHere;
}
function addBlue(spawnLocation){
	this.locations.push(spawnLocation);
	this.panicked.push(0);
	this.motion.push(false);
}
function killBlue(location){
    for(blue=0;blue<this.locations.length;blue++){				
        if (this.locations[blue]["x"]===location["x"]  && this.locations[blue]["y"]===location["y"]){
            this.locations.splice(blue, 1);
			this.panicked.splice(blue, 1);
			this.motion.splice(blue, 1);
        }
    }

}



function whichBlueIsHere(currentLocation){
	//console.log("		WHO IS BLUE @ ", currentLocation);
	for (person=0;person<this.locations.length;person++){
		/*console.log("		", person, 
		  (this.locations[person]["x"]===currentLocation["x"] && this.locations[person]["y"]===currentLocation["y"]), 
		  this.locations[person], currentLocation);*/
		if (this.locations[person]["x"]===currentLocation["x"] && this.locations[person]["y"]===currentLocation["y"]){
			/*console.log("		", person, 
			  (this.locations[person]["x"]===currentLocation["x"] && this.locations[person]["y"]===currentLocation["y"]), 
			  this.locations[person], currentLocation);*/
			return person;
		}
	}
}