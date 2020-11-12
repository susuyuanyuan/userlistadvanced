let express = require("express");
let fileUpload = require("express-fileupload");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

// import User Model from ./models
let User = require("./models/user.js");
let cors = require("cors");

// initialize express app
let app = express();

// configure express app to serve static files
app.use(express.static(__dirname + "/public"));

// configure app to use file upload
app.use(fileUpload());
// configure express app to parse json content and form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var mongoUrl = "mongodb://localhost:27017/armyListTest";
// connect to mongodb instance where database is testdb
mongoose.connect(mongoUrl);

//get users
app.get("/api/armyUserList/", (req, res) => {
  // use find() method to return all Users
  User.find((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

// add user
app.post("/api/armyUserList/", (req, res) => {
  let newUser = new User(req.body);
  error = newUser.validateSync();
  if (error) {
    console.log(error);
    res.status(500).send(error);
    return;
  }
  // save new user to db
  newUser.save((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// update User
app.post("/api/armyUserList/:id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  if (req.params.id === null || req.params.id === "") {
    res.status(500).send("Invalid Id");
    return;
  }

  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { useFindAndModify: true },
    function (err, docs) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log("Updated: " + req.params.id);
        res.sendStatus(200);
      }
    }
  );
});

// delete user
app.delete("/api/armyUserList/:id", (req, res) => {
  console.log(req.params);
  if (req.params.id === null || req.params.id === "") {
    res.status(500).send("Invalid Id");
    return;
  }

  User.findByIdAndRemove(req.params.id, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log("Removed: " + req.params.id);
      res.sendStatus(200);
    }
  });
});

// Upload Endpoint
app.post("upload", (req, res) => {
  if (req.files === null) {
    return res.status(400);
  }
});
// listen on port 5000
app.listen(5000, () => {
  console.log("Server listening on port 3000");
});
