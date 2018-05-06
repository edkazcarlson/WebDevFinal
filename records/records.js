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
	soloMMR(url, requestHandler);
    
    getRecords(url, requestHandler);

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

function soloMMR(url, requestHandler) {
	requestHandler.makeRequest("GET", url, function getMMR(data){
        let mmr = JSON.parse(data);
        if (mmr.solo_competitive_rank == null) {
            mmr.solo_competitive_rank = "n/a";
        }
		document.getElementById("mmr").innerHTML = "MMR: " + mmr.solo_competitive_rank;
	})
}	

// RECORDS TO COLLECT
// Most Deaths, Least Hero Damage, Least Experience, 
// Worst KDA, Shortest Game, Longest Losing Streak
// Lowest Net Worth, Least Tower Damage, Fewest Last Hits

function getRecords(url, requestHandler) {
    requestHandler.makeRequest("GET", url + "recentMatches/", function (data){
        let matches = JSON.parse(data);
        let maxDeaths = 0;
        let heroDMG = Number.MAX_SAFE_INTEGER;
        let xpm = Number.MAX_SAFE_INTEGER;
        let minXP;
        let kda = [0, 0 , 0];
        let gameTime = Number.MAX_SAFE_INTEGER;
        let gpm = Number.MAX_SAFE_INTEGER;
        let netWorth;
        let towerDMG = Number.MAX_SAFE_INTEGER;
        let lastHits = Number.MAX_SAFE_INTEGER;
        let streak = 0;
        let tempStreak = 0;
        for (i = 0; i < matches.length; i++) {
            let m = matches[i];
            if (maxDeaths < m.deaths) {
                maxDeaths = m.deaths;
                kda[0] = m.kills;
                kda[1] = m.deaths;
                kda[2] = m.assists;
            }

            if (heroDMG > m.hero_damage) {
                heroDMG = m.hero_damage;
            }

            if (xpm > m.xp_per_min) {
                xpm = m.xp_per_min;
                minXP = xpm * (m.duration/60);
            }

            if (gameTime > m.duration) {
                gameTime = m.duration;
            }

            if (gpm > m.gold_per_min) {
                gpm = m.gold_per_min;
                netWorth = gpm * (m.duration/60);
            }

            if (towerDMG > m.tower_damage) {
                towerDMG = m.tower_damage;
            }

            if (lastHits > m.last_hits) {
                lastHits = m.last_hits;
            }
            let flag = false;
            if (m.player_slot < 128) {
                //player is on radiant
                if (m.radiant_win == false) {
                    tempStreak++;
                } else {
                    flag = true;
                }
            } else {
                if (m.radiant_win == true) {
                    tempStreak++;
                } else {
                    flag = true;
                }
            }

            if (tempStreak > streak) {
                streak = tempStreak;
            }

            if (flag) {
                tempStreak = 0;
            }
        }
        document.getElementById("maxDeaths").innerHTML = maxDeaths;
        document.getElementById("minHeroDMG").innerHTML = heroDMG;
        document.getElementById("minXP").innerHTML = Math.round(minXP);
        document.getElementById("worstKDA").innerHTML = kda;
        document.getElementById("minTime").innerHTML = gameTime;
        document.getElementById("minNetWorth").innerHTML = Math.round(netWorth);
        document.getElementById("minTowerDMG").innerHTML = towerDMG;
        document.getElementById("minLastHits").innerHTML = lastHits;
        document.getElementById("losingStreak").innerHTML = streak;
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
