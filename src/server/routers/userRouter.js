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
        res.sendStatus(200);
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

module.exports = userRouter;
