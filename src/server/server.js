let express = require("express");
let fileUpload = require("express-fileupload");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
// initialize express app
let app = express();

// configure express app to serve static files
app.use(express.static(__dirname + "/public"));

// configure app to use file upload
app.use(fileUpload());
// configure express app to parse json content and form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("cors")());

let mongoUrl = "mongodb://localhost:27017/armyListTest";
// connect to mongodb instance where database is testdb
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

console.log(mongoose.connection.readyState);

const ROUTE_PREFIX = "/api/armyUserList";
app.use(ROUTE_PREFIX + "/User", require("./routers/userRouter"));

// listen on port 5000
const PORT_NUM = 5000;
app.listen(PORT_NUM, () => {
  console.log("Server listening on port: " + PORT_NUM);
});
