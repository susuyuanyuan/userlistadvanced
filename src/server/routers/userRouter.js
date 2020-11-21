let userRouter = require("express").Router();
let User = require("../models/user.js");

//get users
userRouter.get("/", (req, res) => {
  console.log(req.query);
  // update :use if else, id should use findById
  // use find() method to return all Users
  if (req.query.id !== "") {
    User.findById(req.query.id, (err, result) => {
      if (err) {
        console.error("Failed to find superior" + err);
        res.status(500).send(err);
      } else {
        res.json({ docs: [result], totalDocs: 1 });
      }
    });
  } else {
    User.paginate(
      {
        $or: [
          { name: { $regex: req.query.regex } },
          { rank: { $regex: req.query.regex } },
          { sex: { $regex: req.query.regex } },
          { phone: { $regex: req.query.regex } },
          { email: { $regex: req.query.regex } },
          { superiorName: { $regex: req.query.regex } },
        ],
      },
      {
        offset: req.query.offset,
        limit: req.query.limit,
        sort: { [req.query.sortCol]: req.query.order },
      },
      (err, result) => {
        if (err) {
          console.error("Failed to find all: " + err);
          res.status(500).send(err);
        } else {
          res.json(result);
          console.log(result.totalDocs);
        }
      }
    );
  }
});

userRouter.get("/count", (req, res) => {
  User.countDocuments({}, (err, count) => {
    if (err) {
      console.error("Failed to find all: " + err);
      res.status(500).send(err);
    } else {
      res.json(count);
    }
  });
});

// update User
userRouter.post("/", (req, res) => {
  const user = req.body;
  console.log(user);
  if (user._id === null || user._id === "") {
    let newUser = new User(req.body);
    let error = newUser.validateSync();
    if (error) {
      console.error("Failed to validate: " + error);
      res.status(500).send(error);
      return;
    }
    // save new user to db
    newUser.save((err, result) => {
      if (result.avatar) {
        console.error("Has Avatar");
      }
      if (err) {
        console.error("Failed to save: " + err);
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
    return;
  }

  User.findById(user._id, function (find_err, doc) {
    if (find_err) {
      console.error("Failed to find: " + find_err);
      res.status(500).send(find_err);
    } else {
      let needToUpdate = req.body.superiorID !== doc.superiorID;
      doc.updateOne(req.body, (update_error) => {
        if (update_error) {
          console.error("Failed to update: " + update_error);
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

// delete user
userRouter.delete("/:id", (req, res) => {
  if (req.params.id === null || req.params.id === "") {
    res.status(500).send("Invalid Id");
    return;
  }

  User.findByIdAndRemove(req.params.id, function (err, docs) {
    if (err) {
      console.error("Failed to remove" + err);
      res.status(500).send(err);
    } else {
      console.log("Removed: " + req.params.id);
      res.sendStatus(200);
    }
  });
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
        console.error("Can't find user superior: " + this_user);
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
              console.error(err);
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

module.exports = userRouter;
