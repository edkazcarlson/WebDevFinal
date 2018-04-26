let API_URL = "https://api.opendota.com/api/";

function setup(){
    let dotaID = localStorage.getItem("dotaID");
    console.log(dotaID);

	let url = API_URL + "players/" + dotaID + "/";
	let oReq = new XMLHttpRequest();
	oReq.onreadystatechange = function handleReady(){
		if (this.readyState == 4 && this.status == 200) {
			let rank = JSON.parse(this.responseText);
			console.log(rank.solo_competitive_rank);
		}
	}
	oReq.open("GET", url, true);
	oReq.send();



	//requestHandler = new RequestHandler();
    //requestHandler.makeRequest("GET", url, )
}

/*



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
*/
setup();