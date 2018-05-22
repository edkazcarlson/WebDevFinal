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

	document.getElementById("loader").innerHTML = '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>';
	winLoss(url, requestHandler);
	heroInfoFetch(url, requestHandler);
	soloMMR(url, requestHandler);
	

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
		if (mmr.solo_competitive_rank == null) {
            mmr.solo_competitive_rank = "n/a";
        }
		document.getElementById("mmr").innerHTML = "MMR: " + mmr.solo_competitive_rank;
		document.getElementById("loader").innerHTML = "";
	})
}

function createHeroTable(table, heroInfo){
	console.log(heroInfo);
	var rowCount = 115;
	var columnCount = 4;
	for (var i = 0; i < rowCount; i++){
		var row = table.insertRow(i+1);
		let heroJSON = heroInfo[i];
		var nameCell = row.insertCell(0);
		nameCell.innerHTML = heroJSON.name;
		var lossCell = row.insertCell(1);
		if (heroJSON.games == 0) {
			lossCell.innerHTML = "n/a";
		} else {
			lossCell.innerHTML = Math.round(((heroJSON.games - heroJSON.win)/(heroJSON.games))*1000)/10	 + "%";
		}
		var lossVSCell = row.insertCell(2);
		lossVSCell.innerHTML = Math.round(((heroJSON.against_games - heroJSON.against_win)/(heroJSON.against_games))*1000)/10	 + "%";
		var legsCell = row.insertCell(3);
		legsCell.innerHTML = heroJSON.legs;

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
						against_win: hero.against_win,
						legs: name.legs
					});
				}
			}
		}
		heroInfo = userHeroInfo;
		createHeroTable(document.getElementById("heroTable"), heroInfo);
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


function sortTable(n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById("heroTable");
	firstRow = table.getElementsByTagName("TR")[0];
	firstRow.cells[0].style.color= "black";
	firstRow.cells[1].style.color= "black";
	firstRow.cells[2].style.color= "black";
	firstRow.cells[3].style.color= "black";
	firstRow.cells[n].style.color= "red";
	console.log(firstRow.cells[n].innerHTML);
	switching = true;
	//Set the sorting direction to ascending:
	dir = "asc"; 
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.getElementsByTagName("TR");
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 1; i < (rows.length - 1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("TD")[n];
		y = rows[i + 1].getElementsByTagName("TD")[n];
		/*check if the two rows should switch place,
		based on the direction, asc or desc:*/
		if (n == 0){
			if (dir == "asc") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					//if so, mark as a switch and break the loop:
					shouldSwitch= true;
					break;
				}
			} else if (dir == "desc") {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					//if so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			}
		} else {
			if (dir == "asc") {
				if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
					//if so, mark as a switch and break the loop:
					shouldSwitch= true;
					break;
				}
			} else if (dir == "desc") {
				if ((parseInt(x.innerHTML) < parseInt(y.innerHTML))) {
					//if so, mark as a switch and break the loop:
					shouldSwitch = true;
					break;
				}
			}
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
		//Each time a switch is done, increase this count by 1:
		switchcount ++;      
	  } else {
		/*If no switching has been done AND the direction is "asc",
		set the direction to "desc" and run the while loop again.*/
		if (switchcount == 0 && dir == "asc") {
		  dir = "desc";
		  switching = true;
		}
	  }
	}
  }

setup();
