const mongoose = require("mongoose");
const dummy = require("mongoose-dummy");

let genderValues = ["M", "F", "NA"];
let rankValues = ["Soldier", "Captain", "Colonel", "General"];
let userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
    },
    rank: {
      type: String,
      enum: rankValues,
      required: true,
    },
    sex: {
      type: String,
      enum: genderValues,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    superiorID: {
      type: Number,
      required: false,
    },
    superiorName: {
      type: String,
    },
    DSNum: {
      type: Number,
    },
  },
  { collection: "users" }
);

let User = mongoose.model("User", userSchema);

var mongoUrl = "mongodb://localhost:27017/armyListTest";
mongoose.connect(mongoUrl, { useNewUrlParser: true });
console.log(mongoose.connection.readyState);

// first drop all data
User.collection.drop();

var db = mongoose.connection;
db.once("open", function () {
  for (let i = 0; i < 100; i++) {
    let newUserJson = dummy(User, {
      ignore: ["_id", "__v", "superiorID", "superiorName", "DSNum"],
      returnDate: true,
    });
    User.create(newUserJson, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }
  console.log("Finished");
});
