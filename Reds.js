function Reds (){
	this.locations = new Array();
	this.alert = new Array();
	this.gunIsEmpty = new Array();
	this.add = addRed;
	this.kill = killRed;
}
function addRed(spawnLocation){
	this.locations.push(spawnLocation);
	this.alert.push(0);
	this.gunIsEmpty.push(false);
}
function killRed(location){
    for(red=0;red<this.locations.length;red++){				
        if (this.locations[red]["x"]===location["x"]  && this.locations[red]["y"]===location["y"]){

            this.locations.splice(red, 1);
        }
    }

}