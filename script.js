var mmr = 2250;
var morale = 50;
var karma = 0;
var wins = 0;
var losses = 0;
var calibrated = false;
var calibratingMatches = 0;

function write() {

	if (calibrated) {
		document.getElementById("mmr").innerHTML = "MMR: " + parseInt(mmr);	
	}

	else {
		document.getElementById("mmr").innerHTML = "MMR: Undefined";
	}

	document.getElementById("morale").innerHTML = "Morale: " + morale + "%"
	document.getElementById("karma").innerHTML = "Karma: " + karma;
	if (matches > 0) {
		document.getElementById("matches").innerHTML = "Matches played: " + matches + " Winrate: " + Math.floor((wins / matches) * 100)  + "%" + " Average KDA: " + Math.round(calcKDA() * 10) / 10;
	}
	else {
		document.getElementById("matches").innerHTML = "Matches played: " + matches + " Winrate: 0% Average KDA: 0";
	}


	if (matches > 14 && document.getElementById("notyet")) {
		document.getElementById("notyet").id = " ";	
	}

	

	if (morale < 0) {
		alert("Your morale was too low so you died.")
		document.body.innerHTML = ""
	}
}

var random = function(min,max) {
	return Math.floor(Math.random() * (max - min +1)) + min; 	
}

var reddit; 
var won;
var matches = 0;
var averageKDA = [ ];
var kdaCount = 0;

function normalGame() {
	/*if (random(0,1) === 0) {
		if (!calibrated) {
			mmr += 25;
		}
		var kda = [random(1,20),random(1,20),random(1,20)];
		averageKDA[kdaCount] = (kda[0] + kda[2]) / kda[1]
		alert("You won with " + lanes[random(0,4)] + " " + heroes[random(0,109)] + " with a score of " + kda[0] + "/" + kda[1] + "/" + kda[2]);
		morale += 5;
		won = true;
		kdaCount++;
		wins++;
	}
	else {
		if (!calibrated) {
			mmr -= 25;
		}
		var kda = [random(1,20),random(1,20),random(1,20)];
		averageKDA[kdaCount] = (kda[0] + kda[2]) / kda[1]
		alert("You lost with " + lanes[random(0,4)] + " " + heroes[random(0,109)] + " with a score of " + kda[0] + "/" + kda[1] + "/" + kda[2]);		
		morale -= 5;	
		won = false;
		kdaCount++;
		losses++;
	}
	matches++;
	console.log(mmr);
	write();
	*/
	game(false,false);
}

function game(calibrated, ranked) {
		var kda = [random(1,20),random(1,20),random(1,20)];
		var hero = heroes[random(0,109)];
		averageKDA[kdaCount] = (kda[0] + kda[2]) / kda[1];
	if (random(0,1) === 0) {

		if (!calibrated && !ranked) {
			mmr += 25;
		}

		if (calibrated && ranked) {
			mmr += 25;
		}

		if (!calibrated && ranked) {
			if ( ((kda[0] + kda[2]) / kda[1]) > 1) {
				mmr += (kda[0] + kda[2]) / kda[1] * 50;
			}
			else {
				mmr += 150;
			} 
		}
		alert("You won with " + lanes[random(0,4)] + " " + hero + " with a score of " + kda[0] + "/" + kda[1] + "/" + kda[2]);
		won = true;
		morale += 5;
		wins++;
	}
	else {
		if (!calibrated && !ranked) {
			mmr -= 25;
		}

		if (calibrated && ranked) {
			mmr -= 25;
		}

		if (!calibrated && ranked) {
			if ( ((kda[0] + kda[2]) / kda[1]) < 1) {
				mmr -= 150;
			}
			else {
				mmr += (kda[0] + kda[2]) / kda[1] * 12.5;
			}

			
		}
		alert("You lost with " + lanes[random(0,4)] + " " + hero + " with a score of " + kda[0] + "/" + kda[1] + "/" + kda[2]);
		losses++;
		won = false;
		morale -= 5;
	}
	calibratingMatches++;
	if (calibratingMatches > 10) {
		alert("Your mmr is: " + mmr);
	}
	matches++;
	kdaCount++;
	write();
}

var calibratingWin;
var calibratingMatches = 0;;
var calibratingKDA = [ ];

function rankedGame() {

	if (matches < 15) {
		alert("You need at least fifteen matches to calibrate your MMR.")
	}
	else {
	game(true,true)	
	}
	

	}
			



function redditPost() {
	reddit = ["reddit post about how OP " + heroes[random(0,109)] + " is ", "reddit post about how overrated " + players[random(0,160)] + " is ", "shoutout thread to " + players[random(0,160)]];
	if (random(0,1) === 0) {
		var gain = random(10,5000)
		karma += gain;
		alert("You made a " + reddit[random(0,2)] + " and gained " + gain.toString() + " karma.");
	}
	else {
		var gain = random(10,5000)
		karma -= gain;
		alert("You made a " + reddit[random(0,2)] + " and lost " + gain.toString() + " karma.");
	}
	write();
}

function calcKDA() {
	var sum = 0;
	for (var i = 0; i < kdaCount; i++) {
		sum += averageKDA[i];
	}
	return sum / kdaCount;
}

setInterval(function() {
	if (won && morale < 100) {
		morale += 1;
		write();
	}
	if (!won) {
		morale -= 1;
		write();
	}
}, 2000);

write(); 

	