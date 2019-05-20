var mysql = require("mysql");

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
  console.log(req.body.scores)
  connection.query("INSERT INTO friends_db.friends (friend, photo, scores) VALUES (?,?,?)", [req.body.friend, req.body.photo,'['+req.body.scores+']'], function(err, result) {
    if (err) {
      return res.status(500).end();
    }
    // Send back the ID of the new friend
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});
};