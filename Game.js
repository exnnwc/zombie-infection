function Game(){
	this.world = new World (40, 20);
	this.player = new Player({x:0, y:0});
	this.reds = new Reds();
	this.blues = new Blues();
	this.greens = new Greens();
	this.chanceToSeeZombie=4;

	this.isActive=true;
	this.date = new Date();
	this.lastMove=this.date.getTime();
	this.greensMoved=false;
	this.blue_percent = 4;
	this.red_percent = 1;
	this.statusMsgs = new Array();
	this.structure_percent = 4;
	
	max_num_of_structures = (this.world.sizeOfX * this.world.sizeOfX) * (this.structure_percent/100);	
	max_num_of_blues = (this.world.sizeOfX * this.world.sizeOfX) * (this.blue_percent/100);	
	max_num_of_reds = (this.world.sizeOfX * this.world.sizeOfX) * (this.red_percent/100);	
	
	this.escapeFromZombies = escapeFromZombies;
	this.input = playerInput;
	this.run = run;
	this.seeds = fetchSeeds;
	this.gameOver = gameOver;
	this.generateStructures = generateStructures;
	this.moveBlue = moveBlue;
	this.moveBlues = moveBlues;
	this.moveGreens = moveGreens;
	this.movePlayer=movePlayer;
	this.moveReds = moveReds;
	this.shootZombie = shootZombie;
	this.spawnGreen = spawnGreen;
	this.updateStatusDiv = updateStatusDiv;
	this.bluesWander = bluesWander;
	this.won = won;
	
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
	this.world.show();
}
function bluesWander(blue){
		status = this.world.status(this.blues.locations[blue]);		
	if (status[0]>0){
		openNeighbor=this.world.openNeighbor(this.blues.locations[blue]);
		
		if(randomNumber(1,10)===1 && openNeighbor!==false && openNeighbor!==undefined){		
			this.moveBlue(blue, openNeighbor);
		}
	}
}
function escapeFromZombies(blue, directionToNearestZombie){
	this.blues.panicked[blue]++;			
	newDirection = this.world.openSpaceInThisDirection(this.world.otherDirection(directionToNearestZombie), this.blues.locations[blue]);
	newLocation = newDirection
	  ? this.world.findSpotFromDirection(newDirection, this.blues.locations[blue])
	  : this.world.openNeighbor(this.blues.locations[blue]);
	if (newLocation!==undefined){
		this.moveBlue(blue, newLocation);
	}
}
function fetchSeeds(num_of_seeds){
	seeds = new Array();
	for(seed=0;seed<num_of_seeds;seed++){
		seeds.push(this.world.openSpot())
	}
	return seeds;
}

function gameOver(){
	this.updateStatusDiv("<span style='color:red;'>Game Over!</span>");
	$("#game_over_div").show();
	this.isActive=false;
	
	
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
	this.world.reset();
	this.moveReds();
	if (this.isActive){
		
		this.moveBlues();
		
		if (!this.greensMoved){
			this.moveGreens();	
			this.greensMoved=true;
		} else if (this.greensMoved){
			this.greensMoved=false;
		}
		if (this.greens.locations.length===this.reds.locations.length && this.reds.length===0){
			this.won();
		}
	}
	this.world.show();
}

function start(){
	
}
function playerInput(inputDirection, shifting){
	date = new Date();	
	timeSinceLastMove = Math.floor((date.getTime() - this.lastMove)/500);
	
	if (timeSinceLastMove>0 && this.world.directions.indexOf(inputDirection)!==-1){
		this.lastMove=date.getTime();
		place = this.world.findSpotFromDirection(inputDirection, this.player.pos)	 
		if (this.world.map[place["x"]][place["y"]]===0){
			this.movePlayer(place)	
		} else if (this.world.map[place["x"]][place["y"]]===3){
			this.spawnGreen(place);
		}
	}
	this.world.show();
}

function moveBlue(blue, newLocation){	
	currentLocation=this.blues.locations[blue];
	this.world.map[currentLocation["x"]][currentLocation["y"]]=0;
	this.world.map[newLocation["x"]][newLocation["y"]]=3;	
	this.blues.locations[blue]=newLocation;
	directionMoving = this.world.whichDirection(newLocation, currentLocation);
	this.blues.motion[blue]=directionMoving;

}
function movePlayer(location){
	this.world.map[this.player.pos["x"]][this.player.pos["y"]]=0;
	this.player.move(location);
	this.world.map[this.player.pos["x"]][this.player.pos["y"]]=2;
}

function moveBlues(){
	
	for(blue=0;blue<this.blues.locations.length;blue++){
		directionToNearestZombie = this.world.nearestZombie(this.blues.locations[blue]);
		if (directionToNearestZombie!==false){
			if (this.blues.panicked[blue]>0){
				this.escapeFromZombies(blue, directionToNearestZombie);
			} else if (this.blues.panicked[blue]===0 && randomNumber(1,this.chanceToSeeZombie)===1){
				this.escapeFromZombies(blue, directionToNearestZombie);
			}
		} else if (directionToNearestZombie===false){						
			allHumansInSight = this.world.humansInSight(this.blues.locations[blue]);			
			if (allHumansInSight!==false){
				blueMoved=false;
				for (human=0;human<allHumansInSight.length;human++){
					otherBlue = this.blues.who(allHumansInSight[human]["where"]);
					if (this.blues.panicked[otherBlue]>0){
						this.blues.panicked[blue]= Math.ceil(this.blues.panicked[otherBlue]*.75);
						directionPersonIsRunningFrom = this.world.otherDirection(this.blues.motion[otherBlue]);
						//newDirection = openSpaceInThisDirection(directionPersonIsRunningFrom,this.blues.locations[blue]);
						/*
						if (newDirection===false){
							newLocation = this.world.openNeighbor(this.blues.locations[blue]);
							if (newLocation!==false){
								this.escapeFromZombies(blue, this.world.whichDirection(this.blues.locations[blue], newLocation));
							} else if (newLocation==false){
								this.panicked.blues[blue] = Math.ceil(this.panicked.blues[blue] * 1.10);
							}
						} else if (newDirection!==false){
							this.escapeFromZombies(blue, newDirection);
						}
						*/
						
						/*
						newDirection = this.world.openSpaceInThisDirection(this.blues.motion[otherBlue], this.blues.locations[blue]);
						newLocation = newDirection
						  ? this.world.findSpotFromDirection(newDirection, this.blues.locations[blue])
						  : this.world.openNeighbor(this.blues.locations[blue]);
						this.moveBlue(blue, newLocation);
						*/
					}					
				}
				if (!blueMoved){
					this.bluesWander(blue);
				}
			} else if (allHumansInSight===false){
				if (this.blues.panicked[blue]>0){
					newDirection = this.world.openSpaceInThisDirection(this.blues.motion[blue], this.blues.locations[blue]);
					if (newDirection===false){
						newLocation = this.world.openNeighbor(this.blues.locations[blue]);
						newDirection = this.world.whichDirection(this.blues.locations[blue], newLocation);						
					} else if (newDirection!==false){						
						newLocation = this.world.findSpotFromDirection(newDirection, this.blues.locations[blue]);						
					}
					if (newDirection!==this.blues.motion[blue]){
						this.blues.motion[blue]=newDirection;
					}
					this.moveBlue(blue, newLocation);
					
				} else if (this.blues.panicked[blue]===0){
					this.bluesWander(blue);

				}
			}
			if (this.blues.panicked[blue]>0){
				this.blues.panicked[blue]--;				
			}
		}
	}	
}

function moveGreens(){
	for(green=0;green<this.greens.locations.length;green++){
		directionToNearestHuman = this.world.nearestHuman(this.greens.locations[green]);
		if (directionToNearestHuman!==false){
			whereToGo = this.world.findSpotFromDirection(directionToNearestHuman, this.greens.locations[green]);
			if (this.world.map[whereToGo["x"]][whereToGo["y"]]===0){
				this.world.map[this.greens.locations[green]["x"]][this.greens.locations[green]["y"]]=0;
				this.greens.move(green, whereToGo, this.world.whichDirection(this.greens.locations[green], whereToGo));
				this.world.map[this.greens.locations[green]["x"]][this.greens.locations[green]["y"]]=5;
			} else if (this.world.map[whereToGo["x"]][whereToGo["y"]]===3 || this.world.map[whereToGo["x"]][whereToGo["y"]]===4){
				this.spawnGreen(whereToGo);
			}
		} else if (directionToNearestHuman===false){
			openNeighbor=this.world.openNeighbor(this.greens.locations[green]);
			if(randomNumber(1,4) && openNeighbor!==false && openNeighbor!==undefined){					
				this.world.map[this.greens.locations[green]["x"]][this.greens.locations[green]["y"]]=0;
				this.greens.move(green, openNeighbor, this.world.whichDirection(this.greens.locations[green], openNeighbor));
				this.world.map[this.greens.locations[green]["x"]][this.greens.locations[green]["y"]]=5;
			}		
		}
	}	
		this.world.show();
}
function moveReds(){
	for(red in this.reds.locations){
		directionToNearestZombie = this.world.nearestZombie(this.reds.locations[red]);
		if (this.reds.gunIsEmpty[red]){
			this.world.map[this.reds.locations[red]["x"]][this.reds.locations[red]["y"]]=4;
			this.reds.gunIsEmpty[red]=false;
		} else if (directionToNearestZombie===false){			
			allHumansInSight = this.world.humansInSight(this.reds.locations[red]);
			if (allHumansInSight===false && this.reds.alert[red]>0){				
				this.reds.alert[red]--;	
			} else if (allHumansInSight!==false){
				for (human in allHumansInSight){
					randomBlue = this.blues.who(allHumansInSight[human]["where"]);
					if (this.blues.panicked[randomBlue]>this.reds.alert[red]){
						this.reds.alert[red]=this.blues.panicked[randomBlue];
					} else if (this.blues.panicked[randomBlue]===0 && this.reds.alert[red]>0){						
						this.reds.alert[red]--;
						
					}
				}										
			}
		} else if (directionToNearestZombie!==false){
		
			pov = this.world.lookAround(this.reds.locations[red]);
			
			if (this.reds.alert[red]>0){
				this.shootZombie(red, pov[this.world.directions.indexOf(directionToNearestZombie)]["next"], 
					  pov[this.world.directions.indexOf(directionToNearestZombie)]["distance"]);
				this.reds.alert[red]++;
			} 
			if (this.reds.alert[red]===0){
				if (randomNumber(1,this.chanceToSeeZombie/2)===1){
					this.shootZombie(red, pov[this.world.directions.indexOf(directionToNearestZombie)]["next"], 
					  pov[this.world.directions.indexOf(directionToNearestZombie)]["distance"]);
					this.reds.alert[red]++;
				}
			}
			
			
		}
	}
}

function shootZombie(red, zombieLocation, distance){
	redLocation=this.reds.locations[red];
	if (this.reds.gunIsEmpty[red]){
		return;
	}
	this.world.createBulletTrail(this.reds.locations[red], zombieLocation);
	
	this.reds.gunIsEmpty[red]=true;
	successfulShot=false;
	var message = "Red @ (" + redLocation["x"] + ", " + redLocation["y"] + ") shot at zombie @ (" + zombieLocation["x"] +  ", " 
	  + zombieLocation["y"] + ").";
	if (randomNumber(1, distance*2)===1){
		successfulShot=true;
		message = message + " <span style='font-weight:bold;color:red;'>Successfully killed!</span>";		
	} else {
		message = message + " <span style='font-weight:bold;'>Failed!</span>";
	}

	if (zombieLocation["x"]===this.player.pos["x"] && zombieLocation["y"]===this.player.pos["y"] && successfulShot){
		message = message + "That was you! LOL";
		this.updateStatusDiv(message);
		this.gameOver();
	} else if (!(zombieLocation["x"]===this.player.pos["x"] && zombieLocation["y"]===this.player.pos["y"]) && successfulShot){
		this.greens.kill(zombieLocation);
		this.world.map[zombieLocation["x"]][zombieLocation["y"]]=0;
	} 
	this.updateStatusDiv(message);
		
}
function spawnGreen(location){		
	if (this.world.map[location["x"]][location["y"]]===3){
		this.blues.kill(location);
	} else if (this.world.map[location["x"]][location["y"]]===4){
		this.reds.kill(location);
	}	
	this.world.map[location["x"]][location["y"]]=5;
	this.greens.add(location);
}

function updateStatusDiv(currentStatusMsg){	
	if (this.isActive){
		this.statusMsgs.push(currentStatusMsg);
	
		var string = "";
		for(status=this.statusMsgs.length-1;status>this.statusMsgs.length-11;status--){
			if (this.statusMsgs[status]!==undefined){
				string = string + "<div>" + this.statusMsgs[status] + "</div>";
			}
		}	
		$("#status_div").html(string);	
	}
}
function won(){
	this.isActive=false;
	$("#win_div").show();		
}