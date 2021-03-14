require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const mainRouter = require("./src/routes/IndexRoutes");
const app = express();
const port = 8000;
// const socketio = require("socket.io");
// const server = http.createServer(app);
// const mainRouter = require("./src/routes/index");
// const cors = require("cors");
// const io = socketio(server).sockets;

const server = require("http").createServer(app);
// const options = {
//   cors: {
//     // origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// };

const io = require("socket.io")(server).sockets;

// app.listen(port, () => {
//   console.log(`Server is running at port ${port}`);
// });

app.use(express.static("public"));

app.use(cors({ origin: true, credentials: true }));
app.use(logger("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", mainRouter);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  const room = socket.handshake.query.room;
  const level = socket.handshake.query.level;

  const split = room.split("_");
  // console.log(split);

  socket.send("Hello!");
  console.log("New User Has Connected " + id);

  if (level === "customer") {
    if (id === split[1]) {
      // console.log("customer");
      socket.join(id);
      socket.emit("message", "Selamat Datang");

      socket.on("new-data", (datum) => {
        // socket.emit("refreshing-data", datum);
        // console.log(datum);
      });
    }
  }
});

server.listen(8000, () => console.log("server running on port:" + 8000));

module.exports = app;
