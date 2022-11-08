var express = require("express");
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

app.listen(3002, function () {
  console.log("Example app listening on port 3002!");
});
