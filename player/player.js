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

	winLoss(url, requestHandler);
	heroInfoFetch(url, requestHandler);
	console.log(document.getElementById("heroTable")+"ree");
	soloMMR(url, requestHandler);
	createHeroTable(document.getElementById("heroTable"));

	//requestHandler = new RequestHandler();
    //requestHandler.makeRequest("GET", url, )
}

function winLoss(url, requestHandler) {
	requestHandler.makeRequest("GET", url + "wl", function getWinLoss(data) {
		let wl = JSON.parse(data);
		document.getElementById("win").innerHTML = "Wins: " +  wl.win;
		document.getElementById("loss").innerHTML = "Losses: " + wl.lose;
	});
}

function heroInfoFetch(url, requestHandler) {
	requestHandler.makeRequest("GET", API_URL + "heroes", function getHeroMap(data) {
		let names = JSON.parse(data);
		heroStatsFetch(names, requestHandler, url);
	});
	
}

function soloMMR(url, requestHandler){
	requestHandler.makeRequest("GET", url, function getMMR(data){
		let mmr = JSON.parse(data);
		document.getElementById("mmr").innerHTML = "MMR: " + mmr.solo_competitive_rank;
	})
}

function createHeroTable(table){
	console.log(table);
	var rowCount = 115;
	var columnCount = 5;
	for (var i = 0; i < rowCount; i++){
		var row = table.insertRow(i+1);
		for (var j = 0; j < columnCount ; j++){
			var cell = row.insertCell(j);
			cell.innerHTML = j;
		}
		
	}
}
	

function heroStatsFetch(heroNames, requestHandler, url) {
	requestHandler.makeRequest("GET", url + "heroes", function getHeroStats(data) {
		let heroStats = JSON.parse(data);
		console.log(heroNames);
		console.log(heroStats);
		var userHeroInfo = [];
		for (i = 0; i < heroNames.length; i++) {
			for (j = 0; j < heroStats.length; j++) {
				let name = heroNames[i];
				let hero = heroStats[j];
				if (name.id == hero.hero_id) {
					userHeroInfo.push({id: name.id, 
						name: name.localized_name, 
						last_played: hero.last_played,
						games: hero.games,
						win: hero.win,
						with_games: hero.with_games,
						with_win: hero.with_win,
						against_games: hero.against_games,
						against_win: hero.against_win
					});
				}
			}
		}
		heroInfo = userHeroInfo;
	});
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

setup();
