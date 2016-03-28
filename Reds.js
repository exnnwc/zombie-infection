function Reds (){
	this.locations = new Array();
	this.motion = new Array();
	this.add = add;
	this.kill = killRed;
}

function killRed(location){
    for(red=0;red<this.locations.length;red++){				
        if (this.locations[red]["x"]===location["x"]  && this.locations[red]["y"]===location["y"]){

            this.locations.splice(red, 1);
        }
    }

}