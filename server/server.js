const express = require("express");
require("dotenv").config();
const dbConnect = require('./config/db_connect.js');
const initRoutes = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 8888;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://192.168.0.138:3001', 'http://localhost:3001'],
  methods: ['POST', 'PUT', 'GET', 'DELETE'],
  credentials: true
}))

dbConnect();

initRoutes(app);

app.listen(port, () => {
  console.log("Server running on the port: " + port);
});
