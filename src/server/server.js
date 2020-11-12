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

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

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
  let error = newUser.validateSync();
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

const computeUserRankNum = (all_users) => {
  // first establish the superior pointer such that
  // we build a initial linked list
  for (let i = 0; i < all_users.length; i++) {
    let this_user = all_users[i];
    if (this_user.superiorID) {
      this_user.superior = all_users.find(
        (user) => user._id === this_user.superiorID
      );
      console.log(this_user.superior);
    } else {
      this_user.superior = null;
    }
  }

  // traverse again to find who is has the maximum
  let max_rank = 0;
  let max_rank_user = -1;
  for (let i = 0; i < all_users.length; i++) {
    let this_user = all_users[i];
    let this_rank = 0;
    while (this_user.superior) {
      console.log(this_user.superiorID);
      this_user = this_user.superior;
      this_rank++;
    }
    if (this_rank > max_rank) {
      max_rank = this_rank;
      max_rank_user = i;
    }
    all_users[i].DSNum = this_rank;
  }

  console.log(max_rank);

  let userToUpdate = [];

  for (let i = 0; i < all_users.length; i++) {
    if (all_users[i].DSNum > 0) {
      all_users[i].DSNum = max_rank - all_users[i].DSNum;
      userToUpdate.push(all_users[i]);
    }
  }

  if (max_rank_user >= 0) {
    // set the max rank user
    all_users[max_rank_user].DSNum = max_rank;
    userToUpdate.push(all_users[max_rank_user]);
  }

  // reverse the rank
  User.updateMany(userToUpdate);
};

const updateAllUserDsNum = (res) => {
  User.find((err, result) => {
    if (err) {
      console.log(err);
    }
    //
    console.log("updating All");
    computeUserRankNum(result);
    // console.log(typeof result);
    // result.updateAll();

    res.sendStatus(200);
  });
};

// update User
app.post("/api/armyUserList/:id", (req, res) => {
  if (req.params.id === null || req.params.id === "") {
    res.status(500).send("Invalid Id");
    return;
  }

  User.findById(req.params.id, function (err, doc) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      let needToUpdate = req.body.superiorID !== doc.superiorID;
      doc.updateOne(req.body, (err2) => {
        if (err2) {
          console.log(err2);
          res.status(500).send(err2);
          return;
        }
        if (needToUpdate) {
          updateAllUserDsNum(res);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
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
  console.log("Server listening on port 5000");
});
