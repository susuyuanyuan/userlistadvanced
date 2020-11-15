let mongoose = require("mongoose");
let genderValues = ["M", "F", "NA"];

let rankValues = ["Soldier", "Captain", "Colonel", "General"];

let userSchema = mongoose.Schema(
  {
    avatar: {
      type: String,
    },
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
      type: String,
    },
    DSNum: {
      type: Number,
    },
  },
  { collection: "users" }
);

let User = mongoose.model("User", userSchema);

module.exports = User;
