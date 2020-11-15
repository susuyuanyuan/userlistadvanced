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
const URL_PREFIX = "/api/armyUserList";
// connect to mongodb instance where database is testdb

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//get users
app.get(URL_PREFIX + "/User", (req, res) => {
  // use find() method to return all Users
  User.find({}, (err, result) => {
    if (err) {
      console.log("Failed to find all: " + err);
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

// update User
app.post(URL_PREFIX + "/User:id", (req, res) => {
  if (req.params.id === null || req.params.id === "") {
    res.status(500).send("Invalid Id");
    return;
  }

  User.findById(req.params.id, function (find_err, doc) {
    if (find_err) {
      console.log("Failed to find: " + find_err);
      res.status(500).send(find_err);
    } else {
      let needToUpdate = req.body.superiorID !== doc.superiorID;
      doc.updateOne(req.body, (update_error) => {
        if (update_error) {
          console.log("Failed to update: " + update_error);
          res.status(500).send(update_error);
          return;
        }
        if (needToUpdate) {
          findAllAndComputeDSNum(res);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

// add user
app.post(URL_PREFIX + "/User", (req, res) => {
  let newUser = new User(req.body);
  let error = newUser.validateSync();
  if (error) {
    console.log("Failed to validate: " + error);
    res.status(500).send(error);
    return;
  }
  // save new user to db
  newUser.save((err, result) => {
    if (result.avatar) {
      console.log("Has Avatar");
    }
    if (err) {
      console.log("Failed to save: " + err);
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// delete user
app.delete(URL_PREFIX + "/User:id", (req, res) => {
  if (req.params.id === null || req.params.id === "") {
    res.status(500).send("Invalid Id");
    return;
  }

  User.findByIdAndRemove(req.params.id, function (err, docs) {
    if (err) {
      console.log("Failed to remove" + err);
      res.status(500).send(err);
    } else {
      console.log("Removed: " + req.params.id);
      res.sendStatus(200);
    }
  });
});

// Search by keywords
app.post(URL_PREFIX + "/Search", (req, res) => {
  if (req.body.regex === null || req.body.regex === "") {
    res.status(500).send("Invalid regex");
    return;
  }

  User.find(
    {
      $or: [
        { name: { $regex: req.body.regex } },
        { email: { $regex: req.body.regex } },
      ],
    },
    (err, result) => {
      if (err) {
        console.log("Failed to find all: " + err);
        res.status(500).send(err);
      } else {
        res.json(result);
      }
    }
  );
});

function computeAllDSNum(all_users, res) {
  // first establish the superior pointer such that
  // we build a initial linked list
  for (let i = 0; i < all_users.length; i++) {
    let this_user = all_users[i];
    if (this_user.superiorID) {
      this_user.superior = all_users.find(
        (user) => user.id === this_user.superiorID
      );
      if (this_user.superior) {
        this_user.superior.hasDep = true;
      } else {
        console.log("Can't find user superior: " + this_user);
      }
    } else {
      this_user.superior = null;
    }
    this_user.idInt = i;
  }

  // traverse again to find who is has the maximum
  let max_rank = 0;
  // let max_rank_user = -1;
  for (let i = 0; i < all_users.length; i++) {
    let this_user = all_users[i];
    let this_rank = 0;
    let visited = new Set();
    visited.add(this_user.idInt);

    while (this_user.superior) {
      this_user = this_user.superior;
      if (visited.has(this_user.idInt)) {
        break;
      }
      visited.add(this_user.idInt);
      this_rank++;
    }

    if (this_rank > max_rank) {
      max_rank = this_rank;
      // max_rank_user = i;
    }
    all_users[i].DSNum = this_rank;
  }

  // reverse the rank
  const tasks = [];
  for (let i = 0; i < all_users.length; i++) {
    if (all_users[i].hasDep) {
      let this_user = all_users[i];
      this_user.DSNum = max_rank - this_user.DSNum;
      tasks.push(() => {
        User.findByIdAndUpdate(
          this_user._id,
          {
            DSNum: this_user.DSNum,
          },
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });
    }
  }

  const arrayOfPromises = tasks.map((task) => task());

  // call Promise.all on that array
  Promise.all(arrayOfPromises).then((result) => {
    res.sendStatus(200);
  });
}

const findAllAndComputeDSNum = (res) => {
  // we only need the superior ID here so we minimize the database query
  User.find({}, "superiorID", (err, users) => {
    if (err) {
      res.status(500).send(err);
    } else {
      computeAllDSNum(users, res);
    }
  });
};

// listen on port 5000
app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
