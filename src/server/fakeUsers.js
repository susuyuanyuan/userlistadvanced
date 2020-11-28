const mongoose = require("mongoose");
const faker = require("faker");
const User = require("./models/user.js");

let genderValues = ["M", "F", "NA"];
let rankValues = ["Soldier", "Captain", "Colonel", "General"];

let mongoUrl = "mongodb://localhost:27017/armyListTest";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoose.connection.readyState);

// first drop all data
User.collection.drop();

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let promises = [];

for (let i = 0; i < 100; i++) {
  let newUserJson = {
    name: faker.name.firstName() + " " + faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(),
    startDate: faker.date.past(),
    sex: genderValues[getRandomInt(genderValues.length)],
    rank: rankValues[getRandomInt(rankValues.length)],
  };
  promises.push(User.create(newUserJson));
}

Promise.all(promises).then((values) => {
  console.log(values);
  console.log("Finished");
});
