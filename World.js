/*
0 - empty
1 - structure
2 - player
3 - blue
4 - red
*/
function World(sizeOfX, sizeOfY){
	this.sizeOfX = sizeOfX;
	this.sizeOfY = sizeOfY;
	
	this.buildHere = buildStructure;
	this.direction = direction;
	this.neighbors = fetchNeighbors;
	this.openNeighbor = fetchOpenNeighbor;
	this.openSpot = fetchRandomOpenSpot;
	this.show = displayWorld;
	this.status = fetchNeighborStatus;
	var map = new Array (new Array());
	for(x=0;x<this.sizeOfX;x++){
		map.push([]);
		for(y=0;y<this.sizeOfY;y++){
			if (x+y===0 || x===this.sizeOfX || y===this.sizeOfY){
					map[x].push(1);
			}
			map[x].push(0);
		}
	}
	map[0][0]=0;
	this.map = map;	
	
	this.show();
}

function displayWorld(){	
	worldDiv="<div id='world'>";
	for(y=0;y<this.sizeOfY;y++){
		worldDiv = worldDiv + "<div style='clear:both;'>";
		for(x=0;x<this.sizeOfX;x++){	
			worldDiv = worldDiv + "<div title='(" + x + ", " + y + ")' class='cell";			
			if (this.map[x][y]===1){
				worldDiv = worldDiv + " wall";
			} else if (this.map[x][y]===2){
				worldDiv = worldDiv + " player";
			} else if (this.map[x][y]===3){
				worldDiv = worldDiv + " blues";
			} else if (this.map[x][y]===4){
				worldDiv = worldDiv + " reds";
			} 
			worldDiv = worldDiv + "'>"
			if (this.map[x][y]===1){
				worldDiv = worldDiv + "";
			} else if (this.map[x][y]===2){
				worldDiv = worldDiv + "O";
			} else if (this.map[x][y]===3){
				worldDiv = worldDiv + "&Delta;";
			} else if (this.map[x][y]===4){
				worldDiv = worldDiv + "&nabla;";
			} 
			worldDiv = worldDiv + "</div>";
		}
		worldDiv = worldDiv + "</div>";
	}
	worldDiv = worldDiv + "</div>";
	$("#world_div").html(worldDiv);
}



function fetchNeighbors(location){
	neighbors=new Array();
	for(x=location["x"]-1;x<=location["x"]+1;x++){
		for(y=location["y"]-1;y<=location["y"]+1;y++){
			if (x>=0 && x<this.sizeOfX && y>=0 && y<this.sizeOfY 
			&& typeof this.map[x][y]!=="undefined" 
			&& !(x==location["x"] 
			&& y==location["y"])){
				neighbors.push({x:x, y:y});
			}
		}
	}
	return neighbors;
	
}

function fetchRandomOpenSpot(){
	tries=0;
	while (tries<this.sizeOfX*this.sizeOfY*2){
		x=randomNumber(0, this.sizeOfX);
		y=randomNumber(0, this.sizeOfY);
		if (this.map[x][y]===0){
			return {x:x, y:y};
		}
		tries++;
	}
	return false;
}

function fetchOpenNeighbor(location){
	neighbors = this.neighbors(location);
	for (neighbor in neighbors){
		if (this.map[neighbors[neighbor]["x"]][neighbors[neighbor]["y"]]===0){
			
			return neighbors[neighbor];
		}
	}
	return false;
}

function fetchNeighborStatus(location){
	neighbors=this.neighbors(location);
	neighborStatus=[];
	for (i=0;i<10;i++){
		neighborStatus.push(0);
	}
	for (neighbor=0;neighbor<neighbors.length;neighbor++){
		neighborStatus[this.map[neighbors[neighbor]["x"]][neighbors[neighbor]["y"]]]++;
	}
	return neighborStatus;
}

function buildStructure(location){
	this.map[location["x"]][location["y"]]=1;
	
}

function direction(direction, location){
	x=location["x"];
	y=location["y"];
	
	if (direction.indexOf("n")!==-1){
		if (y-1>0){
			y--;
		} else if (y===0){
			return false;
		}
	} else if (direction.indexOf("s")!==-1){
		if (y<this.sizeOfY-1){			
			y++;
		} else if (y===this.sizeOfY){
			return false;
		}
	}

	if (direction.indexOf("w")!==-1){
		if (x-1>0){
			x--;
		} else if (x===0){
			return false;
		}
	} else if (direction.indexOf("e")!==-1){
		if (x<this.sizeOfX-1){			
			x++;
		} else if (x===this.sizeOfX){
			return false;
		}
			
	}
	
	if (x===location["x"] && y===location["y"]){
		return false;
	}
	return {x:x, y:y};
}