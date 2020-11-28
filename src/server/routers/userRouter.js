let userRouter = require("express").Router();
let User = require("../models/user.js");

//get users
userRouter.get("/", async (req, res) => {
  const query = req.query;
  try {
    // update :use if else, id should use findById
    // use find() method to return all Users
    if (query.id && query.id !== "") {
      const result = await User.findById(query.id);
      res.json({ docs: [result], totalDocs: 1 });
    } else {
      const queryParams = {};
      if (query.regex) {
        queryParams["$or"] = [
          { name: { $regex: query.regex } },
          { rank: { $regex: query.regex } },
          { sex: { $regex: query.regex } },
          { phone: { $regex: query.regex } },
          { email: { $regex: query.regex } },
          { superiorName: { $regex: query.regex } },
        ];
      }

      if (query.superiorID) {
        queryParams["superiorID"] = query.superiorID;
      }

      const options = {};
      if (query.offset) {
        options["offset"] = query.offset;
      }
      if (query.limit) {
        options["limit"] = query.limit;
      }
      if (query.sortCol && query.order) {
        options["sort"] = { [query.sortCol]: query.order };
      }

      const result = await User.paginate(queryParams, options);
      res.json(result);
    }
  } catch (err) {
    console.error("Failed to find: " + err);
    res.status(500).send(err);
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

async function incrementDSNum(id, increments) {
  const this_user = await User.findById(id);
  if (!this_user.DSNum) {
    this_user.DSNum = 0;
  }

  this_user.DSNum += increments;

  await this_user.updateOne(this_user);
}

async function updateDSNum(previousID, currentId) {
  // if previously user doesn't have superior
  // but this user has, update the superior DSNum
  if (!previousID && currentId) {
    await incrementDSNum(currentId, 1);
    return;
  }

  // if currentId is empty, previous Id -1
  if (!currentId) {
    await incrementDSNum(previousID, -1);
    return;
  }

  // if the superior changed
  if (previousID && previousID !== currentId) {
    await incrementDSNum(previousID, -1);
    if (currentId) {
      await incrementDSNum(currentId, 1);
    }
  }
}

// update User
userRouter.post("/", async (req, res) => {
  try {
    const input_user = req.body;
    if (input_user._id === null || input_user._id === "") {
      let newUser = new User(input_user);
      await newUser.validate();
      await newUser.save();
      res.sendStatus(200);
      return;
    }

    const user = await User.findById(input_user._id);
    updateDSNum(user.superiorID, input_user.superiorID);
    await user.updateOne(input_user);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }
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
