let API_URL = "https://api.opendota.com/api/";

function setup(){
    let dotaID = localStorage.getItem("dotaID");
    console.log(dotaID);

	//testing requesthandler
	const requestHandler = new RequestHandler();

	let url = API_URL + "players/" + dotaID + "/";
	let oReq = new XMLHttpRequest();
	oReq.onreadystatechange = function handleReady(){
		if (this.readyState == 4 && this.status == 200) {
			let rank = JSON.parse(this.responseText);
			console.log(rank.solo_competitive_rank);
			document.getElementById("container stats__display").innerHTML = rank.solo_competitive_rank;
		}
	}

	//this is how u make a request so u dont have to do the onreadystate change thing every time
	//gets information from 
	requestHandler.makeRequest("GET", url, function personaName(data) {
		const player = JSON.parse(data);
		let profile = player.profile;
		console.log(profile);
		document.getElementById("personaName").innerHTML = profile.personaname;
		document.getElementById("profilePic").src = profile.avatarmedium;
	});

	oReq.open("GET", url, true);
	oReq.send();

	winLoss(url, requestHandler);

	//requestHandler = new RequestHandler();
    //requestHandler.makeRequest("GET", url, )
}

function winLoss(url, requestHandler) {
	requestHandler.makeRequest("GET", url + "wl", function getWinLoss(data){
		let wl = JSON.parse(data);
		document.getElementById("win").innerHTML = "Wins: " +  wl.win;
		document.getElementById("loss").innerHTML = "Losses: " + wl.lose;
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