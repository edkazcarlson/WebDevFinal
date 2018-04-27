window.onload = function() {
    let dotaID = localStorage.getItem("dotaID");
    document.getElementById("searchTerm").value = dotaID;
};

function search () {
    var url = "player/player.html";
    document.location.href = url;
    let actualId = document.getElementById("searchTerm").value;
    localStorage.setItem("dotaID", actualId);
}
