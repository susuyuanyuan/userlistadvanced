let searchRouter = require("express").Router();
let User = require("../models/user.js");

// Search by keywords
searchRouter.post("/", (req, res) => {
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

module.exports = searchRouter;
