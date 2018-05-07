let API_URL = "https://api.opendota.com/api/";

function setup(){
    let dotaID = localStorage.getItem("dotaID");
	let heroInfo = [];
	//testing requesthandler
	const requestHandler = new RequestHandler();

	let url = API_URL + "players/" + dotaID + "/";


	//this is how u make a request so u dont have to do the onreadystate change thing every time
	//gets information from 
	requestHandler.makeRequest("GET", url, function personaName(data) {
		const player = JSON.parse(data);
		let profile = player.profile;
		document.getElementById("personaName").innerHTML = profile.personaname;
		document.getElementById("profilePic").src = profile.avatarmedium;
	});

	getRecentMatches(url, requestHandler);


	//requestHandler = new RequestHandler();
	//requestHandler.makeRequest("GET", url, )
	
}

function getRecentMatches(url, requestHandler) {
	requestHandler.makeRequest("GET", url + "recentmatches", function (data) {
		let matchStats = JSON.parse(data);
		let matchArray = [];
		console.log(matchStats);
		console.log(matchStats[0].match_id);
		for (let i = 0; i < 15 ; i++){
			var curMatch = matchStats[i];
			matchArray.push({matchID : curMatch.match_id, 
			kills: curMatch.kills,
			deaths: curMatch.deaths,
			assists: curMatch.assists});
		}
		matchStatsFetch(matchStats, requestHandler);
	});
}

function matchStatsFetch(matches, requestHandler){
	console.log(matches);
	let matchData = [];
	for (let i = 0; i < 20 ; i++){
		requestHandler.makeRequest("GET", API_URL + "matches/" + matches[i].match_id, function (data){
			let indivMatchData = JSON.parse(data);
			let hasFound = false;
			let playerValue = 0;
			while (hasFound != true){
				if (indivMatchData.players[playerValue].player_slot == matches[i].player_slot){
					hasFound = true;
				} else {
					playerValue++;
				}
			}
			let playerData = indivMatchData.players[playerValue].player_slot;		
			matchData.push({matchID = matches[i].match_id,
							hero = })
		});
		console.log(matches[i].matchID);

	}
}

class RequestHandler {
	makeRequest(method, url, handler) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function handleReady() {
			if (this.readyState == 4 && this.status == 200) {
				handler(this.responseText);
			}
		}
		request.open(method, url, true);
		request.send();
	}
}


function createMatchTable(table, matchInfo){
	var rowCount = 15;
	var columnCount = 5;
	for (var i = 0; i < rowCount; i++){

	}
}
setup();
