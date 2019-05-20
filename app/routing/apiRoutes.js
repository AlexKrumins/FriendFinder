var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "us-cdbr-iron-east-02.cleardb.net",
  port: 3306,
  user: "b5cc49ce32b600",
  password: "480566a2c06cf2b",
  database: "heroku_bf0299f0896d543"
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
app.post("/api/friends", function(req, res, next) {
  connection.query("INSERT INTO heroku_bf0299f0896d543.friends (friend, photo, scores) VALUES (?,?,?)", [req.body.friend, req.body.photo,'['+req.body.scores+']'], function(err, result) {
    if (err) {
      return res.status(500).end();
    }
    // Send back the ID of the new friend
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  next()
}, function(req, res) {
    var userProfile = req.body;
    for (var i = 0; i < userProfile.scores.length; i++) {
      userProfile.scores[i] = parseInt(userProfile.scores[i]);
    }
    connection.query("SELECT * FROM friends", function(err, data) {
      if(err) {
        return res.status(500).end();
      }
      return res.json(data);
    })
    //This will be the array position of the best matched friend
    var allFriendsIndex = 0;
    var maxDifference = 40;
    //Getting all friends from the database

    var allFriends = res.json(data);
    //loop through the database and compare the scores
    for(var n=0; n < allFriends.length; n++) {
      var totalDifference = 0;
      for (var h = 0; h<allFreinds[n].scores.length; h++) {
        var scoreDifference = Math.abs(userProfile.scores[h] - allFriends[n].scores[h]);
        totalDifference += scoreDifference;
      }
      //this will determine if the current friend in the loop is better that the current placeholder
      if(totalDifference < maxDifference) {
        allFriendsIndex = n;
        maxDifference = totalDifference;
      }
    }
    res.json(allFriends[allFriendsIndex]);
  })
})
}
