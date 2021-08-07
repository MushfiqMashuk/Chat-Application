/*
 * Title: Chat Application
 * Description: Chat app using Node, Express, Socket.io, Mongo, Mongoose
 * Author: Mushfiq Mashuk
 * Date: 23-07-2021
 *
 */

// Externel Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejs = require("ejs");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const moment = require('moment');

// Internal Dependencies
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./routers/loginRouter");
const usersRouter = require("./routers/usersRouter");
const inboxRouter = require("./routers/inboxRouter");

// app configuration
const app = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
const io = require("socket.io")(server);
global.io = io;

// set moment as app locals
app.locals.moment = moment;

// connecting to database
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connection Successfull!"))
  .catch((err) => console.log(err));

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine as ejs Template Engine
app.set("view engine", "ejs");

// set the static folder
app.use(express.static("public"));

// set cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// error handling
app.use(notFoundHandler);

//default error handler
app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Listening to port: ${process.env.PORT}`);
});
