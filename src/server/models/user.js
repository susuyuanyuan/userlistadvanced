let mongoose = require("mongoose");
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
    stdat: {
      type: Date,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    superiorID: {
      type: Number,
      required: true,
    },
  },
  { collection: "users" }
);
let User = mongoose.model("User", userSchema);
module.exports = User;
