var friends = require("../data/friends");

module.exports = function(app) {

var express = require("express");
var app = express();
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "friends_db"
});
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });
});
  app.get("/api/friends", function(req, res) {
    connection.query("SELECT * FROM friends", function(err, data) {
      if(err) {
      return res.status(500).end();
      }
      return res.json(data);
    });
  });

  app.post("/api/friends", function(req, res) {
    connection.query("INSERT INTO friends (friend) VALUES (?)", [req.body.friend], function(err, result) {
      if (err) {
        return res.status(500).end();
      }
      // Send back the ID of the new friend
      res.json({ id: result.insertId });
      console.log({ id: result.insertId });
    });
  });

  // app.post("/api/friends", function(req, res) {
  //   console.log(req.body.scores);

  //   // Receive user details (name, photo, scores)
  //   var user = req.body;

  //   // parseInt for scores
  //   for(var i = 0; i < user.scores.length; i++) {
  //     user.scores[i] = parseInt(user.scores[i]);
  //   }

  //   // default friend match is the first friend but result will be whoever has the minimum difference in scores
  //   var bestFriendIndex = 0;
  //   var maxDifference = 40;

  //   // in this for-loop, start off with a zero difference and compare the user and the ith friend scores, one set at a time
  //   //  whatever the difference is, add to the total difference
  //   for(var i = 0; i < friends.length; i++) {
  //     var totalDifference = 0;
  //     for(var j = 0; j < friends[i].scores.length; j++) {
  //       var difference = Math.abs(user.scores[j] - friends[i].scores[j]);
  //       totalDifference += difference;
  //     }

  //     // if there is a new minimum, change the best friend index and set the new minimum for next iteration comparisons
  //     if(totalDifference < minimumDifference) {
  //       bestFriendIndex = i;
  //       minimumDifference = totalDifference;
  //     }
  //   }

  //   // after finding match, add user to friend array
  //   friends.push(user);

  //   // send back to browser the best friend match
  //   res.json(friends[bestFriendIndex]);
  // });
};