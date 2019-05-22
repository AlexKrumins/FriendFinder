var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "k3xio06abqa902qt.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "qrs9yep1ere6lkdt",
  password: "ojf5wsew0qpktqm8",
  database: "yg2x9f6m2g2eszyl"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

module.exports = function(app) {
app.get("/api/friends", function(req, res) {
  connection.query("SELECT * FROM friends", function(err, data) {
    if(err) {
      return res.status(500).end();
    }
    return res.json(data);
  });
});
app.post("/api/friends", function(req, res) {
  connection.query("SELECT * FROM friends", function(err, data) {
    if(err) {
      return res.status(500).end();
    }
    var userProfile = req.body;
    //This will be the array position of the best matched friend
    var allFriendsIndex = 0;
    var maxDifference = 40;
    //Getting all friends from the database
    var allFriends = data;
    //loop through the database and compare the scores
    for(var j = 0; j < allFriends.length; j++) {
      var totalDifference = 0;
      var arr = allFriends[j].scores.split(" ")
      // console.log("allFriends.scores: " + allFriends[j].scores)
      // console.log("res: " + res);
      for (var h = 0; h < arr.length; h++) {
        // console.log("user score at " + h + " = " + userProfile.scores[h])
        var scoreDifference = Math.abs(parseInt(userProfile.scores[h]) - parseInt(arr[h]));
        // console.log("scoreDifference: " + scoreDifference)
        totalDifference += scoreDifference;
      }
      // console.log("Name " + allFriends[j].friend)
      // console.log("total difference " + totalDifference);
      //this will determine if the current friend in the loop is better that the current placeholder
      if(totalDifference < maxDifference) {
        allFriendsIndex = j;
        maxDifference = totalDifference;
      }
    }
    // console.log(userProfile.scores.join(" "));
    connection.query("INSERT INTO friends (friend, photo, scores) VALUES (?,?,?)", [userProfile.friend, userProfile.photo, userProfile.scores.join(" ")])
    // console.log(allFriends[allFriendsIndex]);
    return res.json(allFriends[allFriendsIndex]);
  })
})}