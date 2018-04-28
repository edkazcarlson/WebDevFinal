let API_URL = "https://api.opendota.com/api/";

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
//ignore this line, im just testing why there's 2 different plupimans for commits pt2

	winLoss(url, requestHandler);
	heroStats(url, requestHandler);
	soloMMR(url, requestHandler);

	//requestHandler = new RequestHandler();
    //requestHandler.makeRequest("GET", url, )
}

function soloMMR(url, requestHandler){
	requestHandler.makeRequest("GET", url, function getMMR(data){
		let mmr = JSON.parse(data);
		document.getElementById("mmr").innerHTML = "MMR: " + mmr.solo_competitive_rank;
	})
}

function winLoss(url, requestHandler) {
	requestHandler.makeRequest("GET", url + "wl", function getWinLoss(data) {
		let wl = JSON.parse(data);
		document.getElementById("win").innerHTML = "Wins: " +  wl.win;
		document.getElementById("loss").innerHTML = "Losses: " + wl.lose;
	});
}

function heroStats(url, requestHandler) {
	var heroStats = "";
	var heroMap = "";

	requestHandler.makeRequest("GET", url + "heroes", function getHeroStats(data) {
		heroStats = JSON.parse(data);
		console.log(heroStats);
	});
	console.log(heroStats);
	requestHandler.makeRequest("GET", API_URL + "heroes", function getHeroMap(data) {
		heroMap = JSON.parse(data);
		console.log(heroMap);
	})
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