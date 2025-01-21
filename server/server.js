const express = require("express");
require("dotenv").config();
const dbConnect = require('./config/db_connect.js');
const initRoutes = require('./routes/index.js');

const app = express();
const port = process.env.PORT || 8888;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

initRoutes(app);

app.listen(port, () => {
  console.log("Server running on the port: " + port);
});
