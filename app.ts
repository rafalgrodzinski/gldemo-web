const express = require("express");
const path = require("path");

let app = express();

app.use(express.static(path.join(__dirname, "static")));
app.listen(8080);