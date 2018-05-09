let API_URL = "https://api.opendota.com/api/";
var matchInfo = [];
var iteration = 0;
function setup(){
    let dotaID = localStorage.getItem("dotaID");
	
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

	getRecentMatches(url, requestHandler, matchInfo);


	//requestHandler = new RequestHandler();
	//requestHandler.makeRequest("GET", url, )
	
}

function getRecentMatches(url, requestHandler, matchInfo) {
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
		heroNameIDFetch(matchStats, requestHandler, url);
	});
}

function heroNameIDFetch(matchStats, requestHandler, url){
	console.log(matchInfo);
	let heroNamesToID = [];
	requestHandler.makeRequest("GET", API_URL + "heroes", function getHeroStats(data) {
		let heroNames = JSON.parse(data);
		for (let i = 0; i < heroNames.length ; i++){
			heroNamesToID.push(heroNames[i].localized_name);
		}
		matchStatsFetch(matchStats, requestHandler, url, heroNamesToID)
	});
}
function matchStatsFetch(matches, requestHandler, url, heroNamesToID){
	console.log(heroNamesToID);
	for (let i = 0 ; i < 20 ; i++){
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
			/*matchInfo.push({matchID : matches[i].match_id,
							hero : indivMatchData.players[playerValue].hero_id,
							kills : indivMatchData.players[playerValue].kills,
							deaths: indivMatchData.players[playerValue].deaths,
							assists: indivMatchData.players[playerValue].assists,
							seconds: indivMatchData.players[playerValue].duration,
							result: indivMatchData.radiant_win,
							usage_5 : indivMatchData.players[playerValue].item_5});*/
			//matchInfo = matchData;
			createMatchTable(document.getElementById("matchTable"),{matchID : matches[i].match_id,
																		hero : indivMatchData.players[playerValue].hero_id,
																		kills : indivMatchData.players[playerValue].kills,
																		deaths: indivMatchData.players[playerValue].deaths,
																		assists: indivMatchData.players[playerValue].assists,
																		seconds: indivMatchData.players[playerValue].duration,
																		result: indivMatchData.radiant_win,
																		usage_5 : indivMatchData.players[playerValue].item_5} );
		});
	}
		
	
	console.log(matchInfo.length);
	console.log(matchInfo);
	
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


function createMatchTable(table, matchJSON){
	console.log(table);
	console.log(iteration);
	var row = table.insertRow(iteration+1);
	console.log(matchJSON);
	var heroCell = row.insertCell(0);
	heroCell.innerHTML = matchJSON.hero;
	var DKACell = row.insertCell(1);
	DKACell.innerHTML = matchJSON.deaths +","+matchJSON.kills+","+matchJSON.assists;
	var durationCell = row.insertCell(2);
	durationCell.innerHTML = Math.round(matchJSON.seconds/60)+":"+matchJSON.seconds % 60
	var resultCell = row.insertCell(3);
	if (matchJSON.result == true){
		resultCell.innerHTML = "Radiant Victory";
	} else {
		resultCell.innerHTML = "Dire Victory";
	}
	var item5Cell = row.insertCell(4);
	item5Cell.innerHTML = matchJSON.usage_5;
	iteration++;
}

setup();
