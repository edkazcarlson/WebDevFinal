function search () {
    var url = "player/player.html";
    document.location.href = url;
    let actualId = document.getElementById("searchTerm").value;
    localStorage.setItem("dotaID", actualId);
}
