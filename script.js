var mmr = 2250;
var morale = 50;
var karma = 0;
var wins = 0;
var losses = 0;
var calibrated = false;
var calibratingMatches = 0;
var games = [ ];

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

	console.log(calibratingMatches);
}

function db() {
	document.getElementById("db").innerHTML += "<tr> <td>"+ games[matches][3] + "</td> <td>" + games[matches][0] + "</td><td>" + games[matches][1] + "</td> <td>" + games[matches][2] + "</td> <td>" + games[matches][4] + "</td></tr>";	
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
	game(false,false);
}

function game(c, ranked) {
	var kda = [random(1,20),random(1,20),random(1,20)];
	var hero = heroes[random(0,109)];
	averageKDA[kdaCount] = (kda[0] + kda[2]) / kda[1];
	var result;

	if (random(0,1) === 0) {
		result = true;
	}
	else {
		result = false;
	}

	if (result) {

		if (!c && !ranked) {
			mmr += 25;
		}

		if (c && ranked) {
			mmr += 25;
		}

		if (!c && ranked) {
			if ( ((kda[0] + kda[2]) / kda[1]) > 1) {
				mmr += (kda[0] + kda[2]) / kda[1] * 50;
			}
			else {
				mmr += 150;
			} 
			calibratingMatches++;
		}
		alert("You won with " + lanes[random(0,4)] + " " + hero + " with a score of " + kda[0] + "/" + kda[1] + "/" + kda[2]);
		won = true;
		if (morale < 96) {
			morale += 5;
		}
		wins++;
		result = "Won";
	}
	else {
		if (!c && !ranked) {
			mmr -= 25;
		}

		if (c && ranked) {
			mmr -= 25;
		}

		if (!c && ranked) {
			if ( ((kda[0] + kda[2]) / kda[1]) < 1) {
				mmr -= 150;
			}
			else {
				mmr += (kda[0] + kda[2]) / kda[1] * 12.5;
			}
			calibratingMatches++;	
		}
		alert("You lost with " + lanes[random(0,4)] + " " + hero + " with a score of " + kda[0] + "/" + kda[1] + "/" + kda[2]);
		losses++;
		won = false;

		result = "Lost";

		if (morale > 5) {
			morale -= 5;
		}
	}

	if (calibratingMatches > 9 && !calibrated) {
		alert("Your mmr is: " + parseInt(mmr) );
		calibrated = true;
	}

	matches++;
	kdaCount++;
	games[matches] = [kda[0],kda[1],kda[2],hero,result];
	console.log(games[matches]);
	db();
	write();
}

var calibratingWin;
var calibratingKDA = [ ];

function rankedGame() {

	if (matches < 15) {
		alert("You need at least fifteen matches to calibrate your MMR.")
	}
	if (calibratingMatches < 11) {
		game(false, true);
	}
	if (calibratingMatches > 10) {
		game(true, true);
	}

}
			



function redditPost() {
	reddit = ["reddit post about how OP " + heroes[random(0,109)] + " is", "reddit post about how overrated " + players[random(0,160)] + " is", "shoutout thread to " + players[random(0,160)], "reddit post asking for true solo queue", "reddit post asking for Pit Lord", "reddit post asking for the Axe immortal"];
	if (random(0,1) === 0) {
		var gain = random(10,5000)
		karma += gain;
		alert("You made a " + reddit[random(0,5)] + " and gained " + gain.toString() + " karma.");
	}
	else {
		var gain = random(10,5000)
		karma -= gain;
		alert("You made a " + reddit[random(0,5)] + " and lost " + gain.toString() + " karma.");
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

	