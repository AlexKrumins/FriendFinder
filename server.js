var express = require("express");

var app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require ("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");
var friends = require("./app/data/friends.js")

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


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "home.html"));
});
app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "survey.html"));
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