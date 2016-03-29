/*
0 - empty
1 - structure
2 - player
3 - blue
4 - red
5 - green
*/
function World(sizeOfX, sizeOfY){
	this.directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
	this.sizeOfX = sizeOfX;
	this.sizeOfY = sizeOfY;
	
	this.buildHere = buildStructure;
	this.findSpotFromDirection = findSpotFromDirection;
	this.lookAround = lookAround;
	this.nearestHuman = nearestHuman;
	this.humansInSight = humansInSight;
	this.nearestZombie = nearestZombie;
	this.neighbors = fetchNeighbors;
	this.openNeighbor = fetchOpenNeighbor;
	this.openSpaceInThisDirection = openSpaceInThisDirection;
	this.openSpot = fetchRandomOpenSpot;
	this.otherDirection = otherDirection;
	this.show = displayWorld;
	this.status = fetchNeighborStatus;
	this.whichDirection=whichDirection;
	
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
			worldDiv = worldDiv + "<div title='(" + x + ", " + y + ") - " + this.map[x][y] + "' class='cell";			
			if (this.map[x][y]===1){
				worldDiv = worldDiv + " wall";
			} else if (this.map[x][y]===2){
				worldDiv = worldDiv + " player";
			} else if (this.map[x][y]===3){
				worldDiv = worldDiv + " blues";
			} else if (this.map[x][y]===4){
				worldDiv = worldDiv + " reds";
			} else if (this.map[x][y]===5){
				worldDiv = worldDiv + " greens";
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
			} else if (this.map[x][y]===5){
				worldDiv = worldDiv + "o";
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
	status=this.status(location);
	
	if (status[0]>0){
		tries=0;
		while(tries<81){
			randomNeighbor=neighbors[randomNumber(0, neighbors.length-1)];						
			if (this.map[randomNeighbor["x"]][randomNeighbor["y"]]===0){			
				return randomNeighbor;
			}
			tries++;
		}
	} else if (status[0]>0){
		return false;
	}
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

function findSpotFromDirection(direction, location){
	//console.log(direction);
	if (direction===false || direction===undefined ){
			return false;
	}
	x=location["x"];
	y=location["y"];	
	
	if (direction.indexOf("n")!==-1){
		if (y-1>=0){
			y--;
		} else if (y===0){
			return false;
		}
	} else if (direction.indexOf("s")!==-1){
		if (y<this.sizeOfY-1){			
			y++;
		} else if (y>=this.sizeOfY){
			return false;
		}
	}

	if (direction.indexOf("w")!==-1){
		if (x-1>=0){
			x--;
		} else if (x===0){
			return false;
		}
	} else if (direction.indexOf("e")!==-1){
		if (x<this.sizeOfX-1){			
			x++;
		} else if (x>=this.sizeOfX){
			return false;
		}
			
	}
	
	if ((x===location["x"] && y===location["y"]) || (direction.length===2 && (x===location["x"] || y===location["y"]))){
		return false;
	}
	return {x:x, y:y};
}


function lookAround(centerLocation){
	pov = new Array();
	for (direction in this.directions){
		newLocation = centerLocation;
		looking = true;
		prevSpot=0;
		distance=1;
		while(looking){
			//console.log(this.directions[direction]);
			var nextSpot = this.findSpotFromDirection(this.directions[direction], newLocation);
			if (nextSpot===false){
				pov.push({direction:this.directions[direction], before:prevSpot, next:nextSpot, distance:distance, what:false});
				looking=false;
			} else if (this.map[nextSpot["x"]][nextSpot["y"]]===0){
				newLocation = nextSpot;				
			} else if (this.map[nextSpot["x"]][nextSpot["y"]]!==0){
				pov.push({direction:this.directions[direction], before:prevSpot, next:nextSpot, distance:distance, what:this.map[nextSpot["x"]][nextSpot["y"]]});
				looking=false;
			}
			prevSpot=nextSpot;
			distance++;
		}
	}
	return pov;
}

function nearestHuman(currentLocation){
	directions = this.lookAround(currentLocation);
	directionToNearestHuman = false;
	for (direction in directions){

		distance=this.sizeOfX+this.sizeOfY;
		//console.log(distance > directions[direction][1], distance, directions[direction][1]);
		if ((directions[direction]["what"]===3 || directions[direction]["what"]===4) && distance > directions[direction]["distance"]){
			distance=directions[direction]["distance"];
			directionToNearestHuman = directions[direction]["direction"];
		}
	}
	
	return directionToNearestHuman;
}
function humansInSight(currentLocation){
	directions = this.lookAround(currentLocation);
	humansInSight = new Array();
	for (direction in directions){			
		//console.log(distance > directions[direction][1], distance, directions[direction][1]);
		if (directions[direction]["what"]===3){
			humansInSight.push({direction: directions[direction]["direction"], distance: directions[direction]["distance"], where:directions[direction]["next"]});
		}
	}
	if (humansInSight.length===0){
		return false;
	}
	return humansInSight;
	
	
}
function whichDirection (currentLocation, newLocation){
	northOrSouth=0;
	eastOrWest=0;
	if(currentLocation["y"]-newLocation["y"]===-1){
		northOrSouth="n";	
	} else if(currentLocation["y"]-newLocation["y"]===1){
		northOrSouth="s";
	}
	
	if(currentLocation["x"]-newLocation["x"]===-1){		
		eastOrWest="w";	
	} else if(currentLocation["x"]-newLocation["x"]===1){
		
		eastOrWest="e";
	}
	if (typeof northOrSouth===typeof eastOrWest){
		return northOrSouth+eastOrWest;
	} else if (northOrSouth!=0){
		return northOrSouth;
	} else if (eastOrWest!=0){
		return eastOrWest;
	}
}

function nearestZombie(currentLocation){
	directions = this.lookAround(currentLocation);
	directionsToNearestZombie = false;
	for (direction in directions){

		distance=this.sizeOfX+this.sizeOfY;
		//console.log(distance > directions[direction][1], distance, directions[direction][1]);
		if ((directions[direction]["what"]===2 || directions[direction]["what"]===5) && distance > directions[direction]["distance"]){
			distance=directions[direction]["distance"];
			directionsToNearestZombie = directions[direction]["direction"];
		}
	}
	
	return directionsToNearestZombie;
}

function otherDirection(direction){
	directionNum = this.directions.indexOf(direction);
	if (directionNum>3){
		otherDirection = this.directions[directionNum-4];
		
	} else if (directionNum<4){
		otherDirection = this.directions[directionNum+4];
		
	}	
	return otherDirection;
		
}

function openSpaceInThisDirection(newDirection, currentLocation){
	//console.log(newDirection, currentLocation, this.map);
	tries=0;
	while (tries<5){
		if (tries===0){			
			prospectiveDirection=newDirection;
		} else if (tries>0 && tries<3){
			prospectiveDirection = this.directions[this.directions.indexOf(newDirection)+tries];
		}else if (tries>=3){
			prospectiveDirection = this.directions[this.directions.indexOf(newDirection)-(tries-2)];
		}
		//console.log(prospectiveDirection);
		prospectiveSpot = this.findSpotFromDirection(prospectiveDirection, currentLocation);
		//console.log(prospectiveSpot, prospectiveSpot["x"], prospectiveSpot["y"]);
		//console.log(this.map);
		if (prospectiveSpot!==false && this.map[prospectiveSpot["x"]][prospectiveSpot["y"]]===0){
			return prospectiveDirection;
		}
		tries++;
	}
	return false;
}